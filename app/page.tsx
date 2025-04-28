"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ModeToggle() {
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
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="flex w-full justify-end">
        <ModeToggle />
      </div>
      This is the testing page aldskjflakdsjfladskjf
    </main>
  );
}
