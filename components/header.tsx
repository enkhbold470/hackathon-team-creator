import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,

} from "@clerk/nextjs";
import { CustomUserButton } from "./customUserButton";

export function Header() {
  return (
    <header className="p-4 flex justify-between items-center border-b border-border">
      <h1 className="text-xl font-bold text-primary">Your Profile</h1>
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
