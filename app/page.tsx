"use client"
import { useState, useEffect } from "react"
import { getProfile } from "./actions/saveProfile"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button" // Assuming you have a Button component
import { User } from "@prisma/client"

export default function Home() {
  const [profile, setProfile] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await getProfile()
      setProfile(fetchedProfile as User)
      setIsLoading(false)
    }
    fetchProfile()
  }, [])  

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p>Loading...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p>You have not created a profile yet</p>
        <Button onClick={() => redirect('/profile')}>Create Profile</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome, {profile.full_name}!</h1>
      <p>You can continue using the app</p>
    </div>
  )
}