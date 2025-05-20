import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,

} from "@clerk/nextjs";
import { CustomUserButton } from "./customUserButton";
import Link from "next/link";
export function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b border-border">

      <Link href="/profile" className="text-xl font-bold text-primary">MatchAnza</Link>
      <header className="flex justify-end gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
        <CustomUserButton />
       
        </SignedIn>
      </header>
    </header>
  );
}
