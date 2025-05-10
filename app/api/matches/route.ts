import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';

// Create a fresh instance of the Prisma client
const prisma = new PrismaClient();

// Define match interface
interface Match {
  id: number;
  user_id_1: string;
  user_id_2: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET(request: NextRequest) {
  console.log('Matches API: GET request received');
  
  try {
    const { userId } = await auth();
    console.log('Authenticated user ID:', userId);

    if (!userId) {
      console.error('Matches API: Unauthorized access attempt');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current user's profile
    console.log(`Matches API: Checking if user ${userId} has an application`);
    const currentProfile = await prisma.application.findUnique({
      where: { userId },
    });

    if (!currentProfile) {
      console.error(`Matches API: No profile found for user ${userId}`);
      return new NextResponse("Profile not found", { status: 404 });
    }

    // Check if we need to return potential matches or existing matches
    const requestType = request.nextUrl.searchParams.get('type') || 'matches';
    
    if (requestType === 'potential') {
      // Return potential matches (people the user hasn't interacted with yet)
      console.log(`Matches API: Fetching potential matches for user ${userId}`);
      
      // Find users the current user has already interacted with
      const interactedUsers = await prisma.$queryRaw<{user_id_2: string}[]>`
        SELECT user_id_2 FROM matches 
        WHERE user_id_1 = ${userId}
      `;
      
      const interactedUserIds = interactedUsers.map(u => u.user_id_2);
      
      // Add the current user's ID to exclude from potential matches
      interactedUserIds.push(userId);
      
      // Find users who have submitted applications but haven't been interacted with
      const potentialMatches = await prisma.application.findMany({
        where: {
          userId: {
            notIn: interactedUserIds
          },
          status: 'submitted'
        },
        take: 10  // Limit the number of potential matches
      });
      
      console.log(`Matches API: Found ${potentialMatches.length} potential matches`);
      
      return NextResponse.json({
        potentialMatches: potentialMatches.map(profile => ({
          userId: profile.userId,
          fullName: profile.fullName,
          skillLevel: profile.skillLevel,
          hackathonExperience: profile.hackathonExperience,
          projectExperience: profile.projectExperience,
          funFact: profile.funFact,
          selfDescription: profile.selfDescription,
        }))
      });
    } else {
      // Return existing matches (both mutual and one-sided)
      console.log(`Matches API: Fetching matches for user ${userId}`);
      
      // Using raw SQL to fetch all matches where the user is involved
      const matchesResult = await prisma.$queryRaw<Match[]>`
        SELECT * FROM matches 
        WHERE (user_id_1 = ${userId} OR user_id_2 = ${userId})
        AND (status = 'matched' OR status = 'interested')
      `;

      console.log(`Matches API: Found ${matchesResult.length} matches`);
      
      // Format matches to make them easier to use in the client
      const formattedMatches = await Promise.all(
        matchesResult.map(async (match) => {
          // Determine which user in the match is the other user
          const otherUserId = match.user_id_1 === userId ? match.user_id_2 : match.user_id_1;
          console.log(`Matches API: Getting details for matched user ${otherUserId}`);
          
          // Get the other user's profile
          const otherUserProfile = await prisma.application.findUnique({
            where: { userId: otherUserId },
          });
          
          // Check if this is a mutual match (both users interested in each other)
          let isMutualMatch = match.status === 'matched';
          let isUserInterested = match.user_id_1 === userId && match.status === 'interested';
          let isOtherInterested = match.user_id_2 === userId && match.status === 'interested';
          
          // If this match shows the current user is interested in the other user,
          // check if there's a reciprocal match
          if (match.status === 'interested' && match.user_id_1 === userId) {
            const reciprocalMatch = await prisma.$queryRaw<Match[]>`
              SELECT * FROM matches 
              WHERE user_id_1 = ${otherUserId}
              AND user_id_2 = ${userId}
              AND status = 'interested'
            `;
            
            if (reciprocalMatch.length > 0) {
              isMutualMatch = true;
              
              // Update this match to 'matched' status since both users are interested
              await prisma.$executeRaw`
                UPDATE matches 
                SET status = 'matched' 
                WHERE id = ${match.id}
              `;
              
              // Also update the reciprocal match
              await prisma.$executeRaw`
                UPDATE matches 
                SET status = 'matched' 
                WHERE id = ${reciprocalMatch[0].id}
              `;
            }
          }
          
          return {
            id: match.id,
            userId1: match.user_id_1,
            userId2: match.user_id_2,
            status: match.status,
            createdAt: match.created_at,
            isMutualMatch,
            isUserInterested,
            isOtherInterested,
            otherUser: otherUserProfile ? {
              userId: otherUserId,
              fullName: otherUserProfile.fullName,
              skillLevel: otherUserProfile.skillLevel,
              hackathonExperience: otherUserProfile.hackathonExperience,
              projectExperience: otherUserProfile.projectExperience,
              funFact: otherUserProfile.funFact,
              selfDescription: otherUserProfile.selfDescription,
            } : null,
          };
        })
      );
      
      console.log('Matches API: Returning formatted matches');
      return NextResponse.json(formattedMatches);
    }
  } catch (error) {
    console.error("Matches API Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('Matches API: POST request received');
  
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const data = await request.json();
    const { targetUserId, action } = data;
    
    if (!targetUserId || !action) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    if (action !== 'interested' && action !== 'pass') {
      return new NextResponse("Invalid action", { status: 400 });
    }
    
    console.log(`User ${userId} ${action} in user ${targetUserId}`);
    
    if (action === 'interested') {
      // Create an 'interested' match
      const match = await prisma.$executeRaw`
        INSERT INTO matches (user_id_1, user_id_2, status, created_at, updated_at)
        VALUES (${userId}, ${targetUserId}, 'interested', NOW(), NOW())
        ON CONFLICT (user_id_1, user_id_2) DO UPDATE
        SET status = 'interested', updated_at = NOW()
      `;
      
      // Check if there's a reciprocal match
      const reciprocalMatch = await prisma.$queryRaw<Match[]>`
        SELECT * FROM matches 
        WHERE user_id_1 = ${targetUserId}
        AND user_id_2 = ${userId}
        AND status = 'interested'
      `;
      
      if (reciprocalMatch.length > 0) {
        // Update both matches to 'matched' status
        await prisma.$executeRaw`
          UPDATE matches 
          SET status = 'matched', updated_at = NOW()
          WHERE (user_id_1 = ${userId} AND user_id_2 = ${targetUserId})
          OR (user_id_1 = ${targetUserId} AND user_id_2 = ${userId})
        `;
        
        return NextResponse.json({ status: 'matched' });
      }
      
      return NextResponse.json({ status: 'interested' });
    } else {
      // Create a 'pass' match
      await prisma.$executeRaw`
        INSERT INTO matches (user_id_1, user_id_2, status, created_at, updated_at)
        VALUES (${userId}, ${targetUserId}, 'pass', NOW(), NOW())
        ON CONFLICT (user_id_1, user_id_2) DO UPDATE
        SET status = 'pass', updated_at = NOW()
      `;
      
      return NextResponse.json({ status: 'pass' });
    }
  } catch (error) {
    console.error("Matches API POST Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 