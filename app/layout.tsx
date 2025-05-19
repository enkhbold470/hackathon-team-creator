import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
const inter = Inter({ subsets: ["latin"] })
import { Toaster } from "@/components/ui/toaster"
export const metadata: Metadata = {
  title: "Dahacks HackMatch - Find Your Perfect Hackathon Teammate",
  description: "Match with the perfect teammates for your next hackathon",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>

      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange>

      <header className="flex justify-end gap-4">
        <SignedOut>
          <div className="flex gap-2">
            <div className="border border-border rounded-full p-2">
              <SignInButton />
            </div>
            <div className="border border-border rounded-full p-2">
              <SignUpButton />
            </div>
          </div>
        </SignedOut>
        {/* <SignedIn> */}
          {/* <div className="border border-border rounded-full p-2">
            <UserButton />
          </div> */}
        {/* </SignedIn> */}
      
      </header>
          {children}
       

      <Toaster />
      </ThemeProvider>
      </body>

    </html>
    </ClerkProvider>
  )
}
