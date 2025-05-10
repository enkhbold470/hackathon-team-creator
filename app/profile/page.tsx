"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { UserButton } from "@/components/auth/auth-placeholder"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the current user from Clerk
        const userResponse = await fetch("/api/getCurrentUser")
        const userData = await userResponse.json()
        
        console.log("Current user data:", userData);
        
        if (userData.user) {
          // Get the application data using the user ID
          const appResponse = await fetch(`/api/db?action=get-application&userId=${userData.user.id}`)
          const appData = await appResponse.json()
          
          console.log("Application data:", appData);
          
          // Combine user data with application data
          setProfile({
            ...userData.user,
            ...appData.application
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Ensure we use the proper userId from the Clerk user
    const userId = profile.id || "";
    console.log("Submitting profile with userId:", userId);
    console.log("Profile data:", profile);
    
    try {
      // Update profile in the database
      const requestBody = {
        action: 'save-application',
        userId: userId.toString(), // Convert to string to ensure it's not treated as a number
        skill_level: profile.skillLevel,
        hackathon_experience: profile.hackathonExperience,
        fun_fact: profile.funFact,
        self_description: profile.selfDescription,
        project_experience: profile.buildInterest || profile.projectExperience,
      };
      
      console.log("Request body:", requestBody);
      
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
      } else {
        const errorData = await response.json();
        console.error("API response error:", errorData);
        throw new Error(`Failed to update profile: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
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
            <CardTitle>{profile?.firstName} {profile?.lastName}</CardTitle>
            <CardDescription>This information will be shown to potential teammates</CardDescription>
          </CardHeader>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-level">Skill Level</Label>
                  <Select
                    defaultValue={profile.skillLevel || ""}
                    onValueChange={(value) => setProfile({ ...profile, skillLevel: value })}
                  >
                    <SelectTrigger id="skill-level">
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hackathon-experience">Hackathon Experience</Label>
                  <Select
                    defaultValue={profile.hackathonExperience || ""}
                    onValueChange={(value) => setProfile({ ...profile, hackathonExperience: value })}
                  >
                    <SelectTrigger id="hackathon-experience">
                      <SelectValue placeholder="Select your experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="1-2">1-2 hackathons</SelectItem>
                      <SelectItem value="3-5">3-5 hackathons</SelectItem>
                      <SelectItem value="5+">5+ hackathons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="build-interest">What do you want to build?</Label>
                  <Textarea
                    id="build-interest"
                    placeholder="Describe what you're interested in building"
                    defaultValue={profile.buildInterest || profile.projectExperience || ""}
                    onChange={(e) => setProfile({ ...profile, buildInterest: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fun-fact">Fun Fact</Label>
                  <Textarea
                    id="fun-fact"
                    placeholder="Share something interesting about yourself"
                    defaultValue={profile.funFact || ""}
                    onChange={(e) => setProfile({ ...profile, funFact: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Self-Description</Label>
                  <RadioGroup
                    defaultValue={profile.selfDescription || ""}
                    onValueChange={(value) => setProfile({ ...profile, selfDescription: value })}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Creative" id="creative" />
                      <Label htmlFor="creative">Creative</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Technical" id="technical" />
                      <Label htmlFor="technical">Technical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Leader" id="leader" />
                      <Label htmlFor="leader">Leader</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Balanced" id="balanced" />
                      <Label htmlFor="balanced">Balanced</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Skill Level</h3>
                  <p>{profile.skillLevel || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Hackathon Experience</h3>
                  <p>{profile.hackathonExperience || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">What I want to build</h3>
                  <p>{profile.buildInterest || profile.projectExperience || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Fun Fact</h3>
                  <p>{profile.funFact || "Not specified"}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Self-Description</h3>
                  <p>{profile.selfDescription || "Not specified"}</p>
                </div>
              </CardContent>

              <CardFooter>
                <Button onClick={() => setIsEditing(true)} className="w-full">
                  Edit Profile
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </main>

      <Navigation />
    </div>
  )
}
