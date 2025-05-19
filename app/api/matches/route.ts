import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Match, MatchedUser } from "@/lib/types";
import { prisma } from "@/lib/prisma";

// Define match interface

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
      where: { user_id: userId },
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
      // Ensure this query correctly gets user_id_2 when user_id_1 is the current user
      const interactedMatches = await prisma.match.findMany({
        where: { user_id_1: userId },
        select: { user_id_2: true }
      });
      
      const interactedUserIds = interactedMatches.map(u => u.user_id_2);
      
      // Add the current user's ID to exclude from potential matches
      interactedUserIds.push(userId);
      
      // Find users who have submitted applications but haven't been interacted with
      const potentialMatches = await prisma.application.findMany({
        where: {
          user_id: {
            notIn: interactedUserIds
          },
          status: 'submitted' // Only consider submitted applications
        },
        take: 10  // Limit the number of potential matches
      });
      
      console.log(`Matches API: Found ${potentialMatches.length} potential matches`);
      
      return NextResponse.json({
        potentialMatches: potentialMatches.map(profile => ({
          user_id: profile.user_id,
          full_name: profile.full_name,
          skill_level: profile.skill_level,
          hackathon_experience: profile.hackathon_experience,
          project_experience: profile.project_experience,
          fun_fact: profile.fun_fact,
          self_description: profile.self_description,
          future_plans: profile.future_plans,
        }))
      });
    } else {
      // Return existing matches (both mutual and one-sided initiated by the user)
      console.log(`Matches API: Fetching existing matches for user ${userId}`);
      
      const dbMatchRecords = await prisma.match.findMany({
        where: {
          OR: [{ user_id_1: userId }, { user_id_2: userId }],
          status: { in: ['matched', 'interested'] }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      const responseMatches: Match[] = [];
      const processedMutualPartnerIds = new Set<string>();

      for (const record of dbMatchRecords) {
        const otherUserId = record.user_id_1 === userId ? record.user_id_2 : record.user_id_1;

        // If it's a mutual match and we've already processed this partner, skip.
        if (record.status === 'matched' && processedMutualPartnerIds.has(otherUserId)) {
          continue;
        }

        const otherUserApplication = await prisma.application.findUnique({
          where: { user_id: otherUserId },
        });

        if (!otherUserApplication) {
          console.warn(`Matches API: Profile for other user ${otherUserId} not found. Skipping match ID ${record.id}.`);
          continue; // Skip if the other user's profile doesn't exist
        }

        const otherUserDetail: MatchedUser = {
          user_id: otherUserApplication.user_id,
          full_name: otherUserApplication.full_name || "Anonymous User",
          skill_level: otherUserApplication.skill_level || "Not specified",
          hackathon_experience: otherUserApplication.hackathon_experience || "Not specified",
          project_experience: otherUserApplication.project_experience || "Not specified",
          fun_fact: otherUserApplication.fun_fact || "Not specified",
          self_description: otherUserApplication.self_description || "Not specified",
          future_plans: otherUserApplication.future_plans || "Not specified",
          discord: otherUserApplication.discord || "Not specified",
          links: otherUserApplication.links || "Not specified",
        };
        
        const isMutual = record.status === 'matched';
        // User is interested if they initiated an 'interested' record, or if it's a mutual 'matched' record.
        const isCurrentUserInterested = (record.user_id_1 === userId && record.status === 'interested') || isMutual;
        // Other party is interested if they initiated an 'interested' record (where current user is user_id_2), or it's mutual.
        const isOtherPartyInterested = (record.user_id_2 === userId && record.status === 'interested') || isMutual;

        if (isMutual) {
          responseMatches.push({
            id: record.id, // Keep as number, assuming lib/types.Match.id is number
            user_id_1: record.user_id_1,
            user_id_2: record.user_id_2,
            status: record.status,
            created_at: record.created_at,
            is_mutual_match: true,
            is_user_interested: true, // For a mutual match, current user was interested
            is_other_interested: true, // And so was the other party
            other_user: otherUserDetail,
          });
          processedMutualPartnerIds.add(otherUserId);
        } else if (record.user_id_1 === userId && record.status === 'interested') {
          // This is a pending match (current user interested, not yet mutual)
          responseMatches.push({
            id: record.id, // Keep as number
            user_id_1: record.user_id_1,
            user_id_2: record.user_id_2,
            status: record.status,
            created_at: record.created_at,
            is_mutual_match: false,
            is_user_interested: true,
            is_other_interested: false, // Other party hasn't reciprocated this specific 'interested' record
            other_user: otherUserDetail,
          });
        }
        // We don't add records where record.user_id_2 === userId && record.status === 'interested'
        // to this list, as those represent interest *from* others *towards* the current user,
        // which they act upon in their "discover" queue, not view in "my matches" or "my pending interests".
      }
      
      console.log(`Matches API: Returning ${responseMatches.length} processed matches`);
      return NextResponse.json(responseMatches);
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