"use server"

import { User } from "@prisma/client";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

import { prisma } from "@/lib/prisma";

export async function saveProfile(profile: User) {
  console.log("Profile data received in saveProfile action:", profile);
  const user = await getCurrentUser();
 
  try {
    await prisma.user.upsert({
      where: {
        user_id: user?.id || "",
      },
      update: {
        // Fields to update if the user already exists
        full_name: profile.full_name,
        discord: profile.discord,
        linkedin: profile.linkedin,
        instagram: profile.instagram,
        github: profile.github,
        skill_level: profile.skill_level,
        hackathon_experience: profile.hackathon_experience,
        project_experience: profile.project_experience,
        what_to_build: profile.what_to_build,
        fun_fact: profile.fun_fact,
        self_description: profile.self_description,
        // Note: email is typically managed by the auth provider (Clerk)
        // and user_id is the unique key, so they are not in the update section.
      },
      create: {
        // Fields to set when creating a new user profile
        user_id: user?.id || "",
        email: user?.emailAddresses[0]?.emailAddress || "", // Ensure email exists
        full_name: profile.full_name,
        discord: profile.discord,
        linkedin: profile.linkedin,
        instagram: profile.instagram,
        github: profile.github,
        skill_level: profile.skill_level,
        hackathon_experience: profile.hackathon_experience,
        project_experience: profile.project_experience,
        what_to_build: profile.what_to_build,
        fun_fact: profile.fun_fact,
        self_description: profile.self_description,
      },
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    // Optionally, rethrow the error or handle it in a way that the client can understand
    // throw error;
  }
}

export async function getProfile() {
  const user = await getCurrentUser();
  const profile = await prisma.user.findUnique({
    where: {
      user_id: user?.id,
    },
  });
  return profile;
}