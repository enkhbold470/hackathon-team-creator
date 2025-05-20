"use server"

import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Match, MatchedUser } from '@/lib/types';

// Function to get potential matches (users you haven't interacted with yet)
export async function getPotentialMatches() {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");
    
    // Get users that the current user hasn't interacted with yet
    const potentialMatches = await prisma.user.findMany({
      where: {
        user_id: {
          not: userId
        },
        // Exclude users that already have match entries with the current user
        NOT: {
          OR: [
            { matches_as_user1: { some: { user_id_2: userId } } },
            { matches_as_user2: { some: { user_id_1: userId } } }
          ]
        }
      },
      select: {
        user_id: true,
        full_name: true,
        discord: true,
        skill_level: true,
        hackathon_experience: true,
        project_experience: true,
        fun_fact: true,
        self_description: true,
        what_to_build: true, // Changed from future_plans
        linkedin: true, // Use linkedin instead of generic links
        github: true,
        instagram: true,
      }
    });
    
    // Transform to match the MatchedUser type
    const transformedMatches = potentialMatches.map(user => ({
      user_id: user.user_id,
      full_name: user.full_name || "",
      discord: user.discord || "",
      skill_level: user.skill_level || "",
      hackathon_experience: user.hackathon_experience || "",
      project_experience: user.project_experience || "",
      fun_fact: user.fun_fact || "",
      self_description: user.self_description || "",
      future_plans: user.what_to_build || "", // Map what_to_build to future_plans
      links: `${user.linkedin || ""} ${user.github || ""} ${user.instagram || ""}`.trim(), // Combine links
    }));
    
    return transformedMatches;
  } catch (error) {
    console.error("Error getting potential matches:", error);
    throw new Error("Failed to get potential matches");
  }
}

// Function to handle user's interest in a potential match
export async function handleMatchAction(targetUserId: string, action: 'interested' | 'pass') {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");
    
    // Create a new match record based on the action
    await prisma.match.create({
      data: {
        user_id_1: userId,
        user_id_2: targetUserId,
        status: action === 'interested' ? 'interested' : 'passed',
      }
    });
    
    // If the action is "interested", check if there's a mutual match
    if (action === 'interested') {
      const otherUserInterest = await prisma.match.findFirst({
        where: {
          user_id_1: targetUserId,
          user_id_2: userId,
          status: 'interested'
        }
      });
      
      // If other user is also interested, update both match records to "matched"
      if (otherUserInterest) {
        await prisma.match.updateMany({
          where: {
            OR: [
              { user_id_1: userId, user_id_2: targetUserId },
              { user_id_1: targetUserId, user_id_2: userId }
            ]
          },
          data: {
            status: 'matched',
          }
        });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error handling match action:", error);
    throw new Error("Failed to process match action");
  }
}

// Function to get pending matches (you showed interest but waiting for response)
export async function getPendingMatches() {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");
    
    const pendingMatches = await prisma.match.findMany({
      where: {
        user_id_1: userId,
        status: 'interested',
      },
      include: {
        user2: {
          select: {
            user_id: true,
            full_name: true,
            discord: true,
            skill_level: true,
            hackathon_experience: true,
            project_experience: true,
            fun_fact: true,
            self_description: true,
            what_to_build: true,
            linkedin: true,
            github: true,
            instagram: true,
          }
        }
      }
    });
    
    // Transform data to match the expected Match type
    return pendingMatches.map(match => ({
      id: match.id,
      user_id_1: match.user_id_1,
      user_id_2: match.user_id_2,
      status: match.status,
      created_at: match.created_at,
      is_mutual_match: match.status === 'matched',
      is_user_interested: true, // User showed interest
      is_other_interested: false, // Pending, so other hasn't responded yet
      other_user: {
        user_id: match.user2.user_id,
        full_name: match.user2.full_name || "",
        discord: match.user2.discord || "",
        skill_level: match.user2.skill_level || "",
        hackathon_experience: match.user2.hackathon_experience || "",
        project_experience: match.user2.project_experience || "",
        fun_fact: match.user2.fun_fact || "",
        self_description: match.user2.self_description || "",
        future_plans: match.user2.what_to_build || "",
        links: `${match.user2.linkedin || ""} ${match.user2.github || ""} ${match.user2.instagram || ""}`.trim(),
      }
    })) as Match[];
  } catch (error) {
    console.error("Error getting pending matches:", error);
    throw new Error("Failed to get pending matches");
  }
}

// Function to get confirmed matches (mutual interest)
export async function getConfirmedMatches() {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) throw new Error("Not authenticated");
    
    // Get matches where the current user is user_id_1
    const matches1 = await prisma.match.findMany({
      where: {
        user_id_1: userId,
        status: 'matched',
      },
      include: {
        user2: {
          select: {
            user_id: true,
            full_name: true,
            discord: true,
            skill_level: true,
            hackathon_experience: true,
            project_experience: true,
            fun_fact: true,
            self_description: true,
            what_to_build: true,
            linkedin: true,
            github: true,
            instagram: true,
          }
        }
      }
    });
    
    // Get matches where the current user is user_id_2
    const matches2 = await prisma.match.findMany({
      where: {
        user_id_2: userId,
        status: 'matched',
      },
      include: {
        user1: {
          select: {
            user_id: true,
            full_name: true,
            discord: true,
            skill_level: true,
            hackathon_experience: true,
            project_experience: true,
            fun_fact: true,
            self_description: true,
            what_to_build: true,
            linkedin: true,
            github: true,
            instagram: true,
          }
        }
      }
    });
    
    // Transform data to match the expected Match type
    const confirmedMatches1 = matches1.map(match => ({
      id: match.id,
      user_id_1: match.user_id_1,
      user_id_2: match.user_id_2,
      status: match.status,
      created_at: match.created_at,
      is_mutual_match: true,
      is_user_interested: true,
      is_other_interested: true,
      other_user: {
        user_id: match.user2.user_id,
        full_name: match.user2.full_name || "",
        discord: match.user2.discord || "",
        skill_level: match.user2.skill_level || "",
        hackathon_experience: match.user2.hackathon_experience || "",
        project_experience: match.user2.project_experience || "",
        fun_fact: match.user2.fun_fact || "",
        self_description: match.user2.self_description || "",
        future_plans: match.user2.what_to_build || "",
        links: `${match.user2.linkedin || ""} ${match.user2.github || ""} ${match.user2.instagram || ""}`.trim(),
      }
    }));
    
    const confirmedMatches2 = matches2.map(match => ({
      id: match.id,
      user_id_1: match.user_id_1, 
      user_id_2: match.user_id_2,
      status: match.status,
      created_at: match.created_at,
      is_mutual_match: true,
      is_user_interested: true,
      is_other_interested: true,
      other_user: {
        user_id: match.user1.user_id,
        full_name: match.user1.full_name || "",
        discord: match.user1.discord || "",
        skill_level: match.user1.skill_level || "",
        hackathon_experience: match.user1.hackathon_experience || "",
        project_experience: match.user1.project_experience || "",
        fun_fact: match.user1.fun_fact || "",
        self_description: match.user1.self_description || "",
        future_plans: match.user1.what_to_build || "",
        links: `${match.user1.linkedin || ""} ${match.user1.github || ""} ${match.user1.instagram || ""}`.trim(),
      }
    }));
    
    return [...confirmedMatches2] as Match[];
  } catch (error) {
    console.error("Error getting confirmed matches:", error);
    throw new Error("Failed to get confirmed matches");
  }
} 