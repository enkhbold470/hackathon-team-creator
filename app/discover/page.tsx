"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { UserCard, type UserProfile } from "@/components/user-card"
import { UserButton } from "@/components/auth/auth-placeholder"

export default function DiscoverPage() {
  // All profiles fetched from the database
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([])
  // Current profile to display
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null)
  // Loading state
  const [loading, setLoading] = useState(true)
  // Current user ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  // IDs of profiles that have been seen and interacted with in the current session
  const [seenProfileIds, setSeenProfileIds] = useState<Set<string>>(new Set())
  // IDs of profiles that the user has previously interacted with (from database)
  const [interactedProfileIds, setInteractedProfileIds] = useState<Set<string>>(new Set())
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    unseen: 0
  })

  // Fetch the current user ID
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        console.log("Fetching current user...")
        const response = await fetch("/api/getCurrentUser")
        const data = await response.json()
        if (data.user) {
          console.log("Current user:", data.user.id)
          setCurrentUserId(data.user.id)
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
      }
    }

    fetchCurrentUser()
  }, [])

  // Fetch previous interactions
  useEffect(() => {
    async function fetchInteractions() {
      if (!currentUserId) return
      
      try {
        console.log("Fetching previous interactions...")
        const response = await fetch(`/api/db?action=get-user-interactions&userId=${currentUserId}`)
        const data = await response.json()
        
        if (data.success && Array.isArray(data.interactedUserIds)) {
          console.log(`Found ${data.interactedUserIds.length} previous interactions`)
          setInteractedProfileIds(new Set(data.interactedUserIds))
        } else {
          console.error("Invalid interactions response:", data)
        }
      } catch (error) {
        console.error("Error fetching interactions:", error)
      }
    }
    
    if (currentUserId) {
      fetchInteractions()
    }
  }, [currentUserId])

  // Fetch all user profiles
  useEffect(() => {
    async function fetchProfiles() {
      if (!currentUserId) return

      try {
        setLoading(true)
        console.log("Fetching all profiles from database...")
        const timestamp = new Date().toISOString()
        const response = await fetch(`/api/db?action=get-all-applications&timestamp=${timestamp}`)
        const data = await response.json()
        
        console.log("Raw data from API:", data)
        
        if (!data.applications || !Array.isArray(data.applications)) {
          console.error("Invalid response format:", data)
          return
        }
        
        // Filter out the current user and profiles the user has already interacted with
        const otherProfiles = data.applications
          .filter((app: any) => {
            // Skip current user
            if (app.userId === currentUserId) return false
            
            // Skip previously interacted profiles
            if (interactedProfileIds.has(app.userId)) {
              console.log(`Filtering out previously interacted profile: ${app.userId}`)
              return false
            }
            
            return true
          })
          .map((app: any) => ({
            id: app.userId,
            skillLevel: app.skillLevel || "Beginner",
            hackathonExperience: app.hackathonExperience || "None",
            buildInterest: app.projectExperience || "",
            funFact: app.funFact || "",
            selfDescription: app.selfDescription || "Balanced",
            fullName: app.fullName || "Anonymous User",
          }))
        
        console.log(`Fetched ${otherProfiles.length} potential matches (after filtering)`)
        setAllProfiles(otherProfiles)
        
        // Reset seen profiles on each fetch
        setSeenProfileIds(new Set())
        
        // Update stats
        setStats({
          total: otherProfiles.length,
          unseen: otherProfiles.length
        })
      } catch (error) {
        console.error("Error fetching profiles:", error)
      } finally {
        setLoading(false)
      }
    }

    if (currentUserId && interactedProfileIds) {
      fetchProfiles()
    }
  }, [currentUserId, interactedProfileIds])

  // Reload profiles when returning to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentUserId) {
        console.log("Page is now visible, refreshing profiles...")
        fetchInteractionsAndProfiles()
      }
    }

    async function fetchInteractionsAndProfiles() {
      if (!currentUserId) return
      
      try {
        // First get updated interactions
        console.log("Refreshing interactions...")
        const interactionsResponse = await fetch(`/api/db?action=get-user-interactions&userId=${currentUserId}`)
        const interactionsData = await interactionsResponse.json()
        
        let updatedInteractedIds = new Set(interactedProfileIds)
        
        if (interactionsData.success && Array.isArray(interactionsData.interactedUserIds)) {
          console.log(`Found ${interactionsData.interactedUserIds.length} previous interactions`)
          updatedInteractedIds = new Set(interactionsData.interactedUserIds)
          setInteractedProfileIds(updatedInteractedIds)
        }
        
        // Then fetch profiles
        console.log("Refreshing profiles from database...")
        const timestamp = new Date().toISOString()
        const response = await fetch(`/api/db?action=get-all-applications&timestamp=${timestamp}`)
        const data = await response.json()
        
        if (!data.applications || !Array.isArray(data.applications)) {
          console.error("Invalid response format:", data)
          return
        }
        
        // Filter out current user and interacted profiles
        const otherProfiles = data.applications
          .filter((app: any) => {
            // Skip current user
            if (app.userId === currentUserId) return false
            
            // Skip previously interacted profiles
            if (updatedInteractedIds.has(app.userId)) {
              return false
            }
            
            return true
          })
          .map((app: any) => ({
            id: app.userId,
            skillLevel: app.skillLevel || "Beginner",
            hackathonExperience: app.hackathonExperience || "None",
            buildInterest: app.projectExperience || "",
            funFact: app.funFact || "",
            selfDescription: app.selfDescription || "Balanced",
            fullName: app.fullName || "Anonymous User",
          }))
        
        console.log(`Refreshed ${otherProfiles.length} potential matches (after filtering)`)
        setAllProfiles(otherProfiles)
        
        // Reset seen profiles on each fetch
        setSeenProfileIds(new Set())
        
        // Update stats
        setStats({
          total: otherProfiles.length,
          unseen: otherProfiles.length
        })
      } catch (error) {
        console.error("Error refreshing data:", error)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [currentUserId, interactedProfileIds])

  // Select the next unseen profile
  useEffect(() => {
    if (allProfiles.length === 0) return
    
    // Filter out seen profiles
    const unseenProfiles = allProfiles.filter(
      profile => !seenProfileIds.has(profile.id)
    )
    
    // Update stats
    setStats({
      total: allProfiles.length,
      unseen: unseenProfiles.length
    })
    
    // Set the current profile to the first unseen profile
    if (unseenProfiles.length > 0) {
      const nextProfile = unseenProfiles[0]
      console.log(`Setting current profile to: ${nextProfile.id}`)
      setCurrentProfile(nextProfile)
    } else {
      console.log("No more unseen profiles")
      setCurrentProfile(null)
    }
  }, [allProfiles, seenProfileIds])

  // Handle connecting with a profile
  async function handleConnect(id: string) {
    if (!id || !currentUserId) return
    
    try {
      console.log(`Connecting with user: ${id}`)
      
      // Mark this profile as seen in the current session
      setSeenProfileIds(prev => new Set([...prev, id]))
      
      // Add to the interacted profiles list
      setInteractedProfileIds(prev => new Set([...prev, id]))
      
      // Save the match to the database
      await fetch("/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-match",
          userId: currentUserId,
          targetUserId: id,
          status: "interested"
        }),
      })
      
      console.log(`Successfully connected with user: ${id}`)
    } catch (error) {
      console.error(`Error connecting with user ${id}:`, error)
    }
  }

  // Handle passing on a profile
  async function handlePass(id: string) {
    if (!id || !currentUserId) return
    
    try {
      console.log(`Passing on user: ${id}`)
      
      // Mark this profile as seen in the current session
      setSeenProfileIds(prev => new Set([...prev, id]))
      
      // Add to the interacted profiles list
      setInteractedProfileIds(prev => new Set([...prev, id]))
      
      // Save the pass to the database
      await fetch("/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-match",
          userId: currentUserId,
          targetUserId: id,
          status: "passed"
        }),
      })
      
      console.log(`Successfully passed on user: ${id}`)
    } catch (error) {
      console.error(`Error passing on user ${id}:`, error)
    }
  }

  // Reset all seen profiles
  function handleReset() {
    console.log("Resetting seen profiles")
    setSeenProfileIds(new Set())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profiles...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex justify-between items-center border-b border-border">
        <h1 className="text-xl font-bold text-primary">HackMatch</h1>
        <UserButton />
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">
            {stats.unseen} profiles left to review
          </p>
        </div>
        
        <div className="profile-container">
          {currentProfile && stats.unseen > 0 ? (
            <UserCard 
              profile={currentProfile} 
              onConnect={handleConnect} 
              onPass={handlePass} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <h2 className="text-xl font-medium mb-2">No more profiles</h2>
              <p className="text-muted-foreground mb-6">
                You've viewed all available profiles.
              </p>
              {seenProfileIds.size > 0 && (
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Reset & Start Over
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Navigation />
      
      <style jsx global>{`
        .card-transition {
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        }
        .card-exit-left {
          transform: translateX(-100%) rotate(-10deg);
          opacity: 0;
        }
        .card-exit-right {
          transform: translateX(100%) rotate(10deg);
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
