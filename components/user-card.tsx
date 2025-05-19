"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export interface UserProfile {
  id: string
  skillLevel: "Beginner" | "Intermediate" | "Advanced"
  hackathonExperience: "None" | "1-2" | "3-5" | "5+"
  buildInterest: string
  funFact: string
  selfDescription: "Creative" | "Technical" | "Leader" | "Balanced"
  fullName?: string
}

interface UserCardProps {
  profile: UserProfile
  onConnect: (id: string) => void
  onPass: (id: string) => void
}

export function UserCard({ profile, onConnect, onPass }: UserCardProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null)

  const handleConnect = () => {
    setIsExiting(true)
    setExitDirection("right")
    setTimeout(() => {
      onConnect(profile.id)
    }, 300)
  }

  const handlePass = () => {
    setIsExiting(true)
    setExitDirection("left")
    setTimeout(() => {
      onPass(profile.id)
    }, 300)
  }

  const getCardClasses = () => {
    const baseClasses = "w-full max-w-md mx-auto overflow-hidden card-transition"
    
    if (!isExiting) return baseClasses
    
    if (exitDirection === "left") {
      return `${baseClasses} card-exit-left`
    } else if (exitDirection === "right") {
      return `${baseClasses} card-exit-right`
    } else {
      return `${baseClasses} card-exit`
    }
  }

  return (
    <Card className={cn(getCardClasses())}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">
              {profile.skillLevel || "Unknown"}
            </Badge>
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">
              {profile.selfDescription || "Unknown"}
            </Badge>
          </div>

          {profile.fullName && (
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Name</h3>
              <p className="text-muted-foreground">{profile.fullName}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium text-lg">Experience</h3>
            <p className="text-muted-foreground">{profile.hackathonExperience || "None"} hackathons</p>
          </div>

          {profile.buildInterest && (
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Wants to build</h3>
              <p className="text-muted-foreground">{profile.buildInterest}</p>
            </div>
          )}

          {profile.funFact && (
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Fun fact</h3>
              <p className="text-muted-foreground">{profile.funFact}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-6 pt-0 gap-4">
        <Button variant="outline" size="lg" className="w-full" onClick={handlePass}>
          <X className="mr-2 h-4 w-4" />
          Not Now
        </Button>
        <Button size="lg" className="w-full" onClick={handleConnect}>
          <Check className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to conditionally join classNames
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
