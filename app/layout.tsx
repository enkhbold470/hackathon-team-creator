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
  title: "Hackmatch",
  description: "Find your hackathon team!",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Hackmatch" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hackmatch" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
      </head>
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
