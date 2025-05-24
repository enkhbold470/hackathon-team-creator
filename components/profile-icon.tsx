import { getCurrentUser } from "@/app/actions/getCurrentUser";

import Link from "next/link";

export async function ProfileIcon() {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs opacity-50">
        <p>Logged in as</p>
        <p>{user?.emailAddresses[0]?.emailAddress}</p>
      </div>
      <Link href="/profile">
        <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center">
          {/* first two letters of email  */}
          {user?.emailAddresses[0]?.emailAddress?.slice(0, 2)}
        </div>
      </Link>
    </div>
  );
}
