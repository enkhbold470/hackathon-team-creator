"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@prisma/client";
import ProfileForm from "./components/ProfileForm";
import ProfileDisplay from "./components/ProfileDisplay";
import LoadingProfile from "./components/LoadingProfile";
import { getProfile, saveProfile } from "@/app/actions/saveProfile";

import Logout from "./components/logout";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const existingProfile = await getProfile();
        if (existingProfile) {
          setProfile(existingProfile);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
        setIsEditing(true);
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile data being sent from page.tsx:", profile);
    if (profile) {
      try {
        await saveProfile(profile as User);
        toast({
          title: "Success!",
          description: "Your profile has been saved.",
        });
        const updatedProfile = await getProfile();
        if (updatedProfile) setProfile(updatedProfile);
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save profile:", error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.error("Attempted to save a null or incomplete profile.");
      toast({
        title: "Error",
        description: "Profile data is incomplete. Please fill out the form.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingProfile />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 min-h-screen pb-20">
      <Card className=" flex-col gap-4 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {isEditing ? "Edit Profile" : "Your Profile"} <Logout />
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your profile information below."
              : "View your profile information."}
          </CardDescription>
          
        </CardHeader>
        {isEditing ? (
          <ProfileForm
            profile={profile}
            setProfile={setProfile}
            handleSubmit={handleSubmit}
            setIsEditing={setIsEditing}
          />
        ) : profile ? (
          <ProfileDisplay profile={profile} setIsEditing={setIsEditing} />
        ) : (
          <div className="p-4 text-center">
            Could not load profile. Try refreshing.
          </div>
        )}
      </Card>
    </div>
  );
}
