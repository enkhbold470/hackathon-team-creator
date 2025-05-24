import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

import Link from "next/link";

import { ProfileIcon } from "./profile-icon";

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b border-border">
      <Link
        href="/"
        className="text-xl font-bold text-primary hover:scale-110 transition-all duration-300"
      >
        MatchAnza{" "}
        <span className="uppercase text-xs border border-primary rounded-full px-2 py-1">
          beta
        </span>
      </Link>
      <div className="flex justify-end gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <ProfileIcon />
        </SignedIn>
      </div>
    </header>
  );
}
