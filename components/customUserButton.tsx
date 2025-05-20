
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import Link from "next/link";
export async function CustomUserButton() {
  const user = await getCurrentUser();
  return (
    <Link href="/profile">
    <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
    </div>
    </Link>
  );
}

