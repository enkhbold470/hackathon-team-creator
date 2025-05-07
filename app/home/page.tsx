import { MessageSquare, Search, User } from "lucide-react";

import MatchingUI from "@/components/MatchingUI";
import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { loggedIn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  if (!loggedIn) {
    redirect("/login");
  }

  const PROFILES = [
    {
      id: "1",
      name: "Alice",
      avatar: "vercel.svg",
      bio: "test 1",
    },
    {
      id: "2",
      name: "Bob",
      avatar: "vercel.svg",
      bio: "test 2",
    },
    {
      id: "3",
      name: "Carol",
      avatar: "vercel.svg",
      bio: "test 3",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b flex justify-center">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex pl-3">
            <Link href="/home" className="flex items-center space-x-2">
              <span className="font-bold">DA Hacks 3.5</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/portal">
                  Back to Portal
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center p-10 gap-5 overflow-x-hidden">
        <div className="flex w-full justify-end">
          <ModeToggle />
        </div>
        <h1 className="text-3xl font-bold">find your hackathon team!</h1>
        <MatchingUI profiles={PROFILES} />
      </main>
    </div>
  );
}
