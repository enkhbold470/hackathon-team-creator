import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
export default function Logout() {
  return (
    <SignOutButton>
      <Button variant="outline" size="icon" className="w-auto p-2 gap-2">
        <p className="text-sm hidden sm:block">Logout</p>
        <LogOut className="w-4 h-4" />
      </Button>
    </SignOutButton>
  );
}
