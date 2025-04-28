"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import MatchingUI from "@/components/MatchingUI";

function ModeToggle() {
  const { setTheme, theme } = useTheme()
 
  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="cursor-pointer">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default function Home() {
  const [matched, setMatched] = React.useState<string[]>([])
  const [passed, setPassed] = React.useState<string[]>([])

  const PROFILES = [
    {
      id: '1',
      name: 'Alice',
      avatar: 'vercel.svg',
      bio: 'Full-stack engineer who loves JavaScript & coffee.',
    },
    {
      id: '2',
      name: 'Bob',
      avatar: 'vercel.svg',
      bio: 'UX designer obsessed with user flows and Figma.',
    },
    {
      id: '3',
      name: 'Carol',
      avatar: 'vercel.svg',
      bio: 'Data scientist and AI enthusiast.',
    },
  ];
  
  const handleMatch = (profile: any) => {
    setMatched((prev) => [...prev, profile.id])
    console.log('Matched:', profile.name)
  };
  
  const handlePass = (profile: any) => {
    setPassed((prev) => [...prev, profile.id])
    console.log('Passed:', profile.name)
  };

  const remainingProfiles = PROFILES.filter(
    (p) => !matched.includes(p.id) && !passed.includes(p.id)
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-10 gap-5 overflow-x-hidden">
      <div className="flex w-full justify-end">
        <ModeToggle />
      </div>
      <h1 className="text-3xl font-bold">find your hackathon team!</h1>
      <MatchingUI
        profiles={remainingProfiles}
        onMatch={handleMatch}
        onPass={handlePass}
      />
    </main>
  );
}
