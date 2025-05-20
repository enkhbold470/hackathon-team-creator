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

      <Link href="/" className="text-xl font-bold text-primary hover:scale-110 transition-all duration-300">MatchAnza</Link>
      <div className="flex justify-end gap-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
        <CustomUserButton />

        </SignedIn>
      </div>
    </header>
  );
}
