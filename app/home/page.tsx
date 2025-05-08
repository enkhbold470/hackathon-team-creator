import { MessageSquare, Search, User } from "lucide-react";

import MatchingUI from "@/components/MatchingUI";
import ModeToggle from "@/components/mode-toggle";
import Navbar from "@/components/Navbar";
import { loggedIn } from "@/lib/utils";
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
      <Navbar />
      <main className="flex min-h-screen flex-col items-center p-10 gap-5 overflow-x-hidden">
        <div className="flex w-full justify-end">
          <ModeToggle />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Swipe right to match, swipe left to pass.</p>
        <MatchingUI profiles={PROFILES} />
      </main>
    </div>
  );
}
