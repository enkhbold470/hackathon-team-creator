"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"

export function UserButton() {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/clerkCurrentUser')
        if (!response.ok) {
          throw new Error('Failed to fetch user')
        }
        const data = await response.json()

    
        setCurrentUser(data)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    

    fetchUser()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.imageUrl || "/placeholder.svg"} alt={currentUser?.firstName + " " + currentUser?.lastName} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser?.firstName + " " + currentUser?.lastName}</p>
            <p className="text-xs leading-none text-muted-foreground">{currentUser?.emailAddresses[0].emailAddress}</p>
            {/* <p className="text-xs leading-none text-muted-foreground">{currentUser?.id}</p> */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/matches">Matches</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem> <SignOutButton /></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


