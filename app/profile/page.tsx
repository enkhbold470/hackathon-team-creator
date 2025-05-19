"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { UserButton } from "@/components/auth/auth-placeholder"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Application } from "@prisma/client"
import ProfileForm from "./components/ProfileForm"
import ProfileDisplay from "./components/ProfileDisplay"
import LoadingProfile from "./components/LoadingProfile"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await fetch("/api/getCurrentUser")
        const userData = await userResponse.json()
        setProfile(userData || null)
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!profile || !profile.user_id) {
      toast({
        title: "Error",
        description: "Profile data or user ID is missing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const requestBody = {
        action: 'save-application',
        userId: profile.user_id, 
        skill_level: profile.skill_level || null,
        hackathon_experience: profile.hackathon_experience || null,
        fun_fact: profile.fun_fact || null,
        self_description: profile.self_description || null,
        project_experience: profile.project_experience || null,
      };
      
      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      
      
      if (response.ok) {
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
        
        const appResponse = await fetch(`/api/db?action=get-application&userId=${profile.user_id}`);
        const appData = await appResponse.json();
        setProfile(prev => prev ? ({ ...prev, ...(appData.application || {}) }) : null);
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to update profile: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: typeof error === 'string' ? error : (error as Error).message || "There was an error updating your profile.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <LoadingProfile />;
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex justify-between items-center border-b border-border">
        <h1 className="text-xl font-bold text-primary">Your Profile</h1>
        <UserButton />
      </header>

      <main className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>ID: {profile?.user_id.slice(10, 15) || "Your Profile"}</CardTitle>
            <CardDescription>This information will be shown to potential teammates</CardDescription>
          </CardHeader>

          {isEditing ? (
            <ProfileForm 
              profile={profile} 
              setProfile={setProfile} 
              handleSubmit={handleSubmit} 
              setIsEditing={setIsEditing} 
            />
          ) : (
            <ProfileDisplay profile={profile} setIsEditing={setIsEditing} />
          )}
        </Card>
      </main>

      <Navigation />
    </div>
  )
}
