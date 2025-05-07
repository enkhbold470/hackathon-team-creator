import { loggedIn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function AuthCheck() {
  if (!loggedIn) {
    return redirect("/login");
  } else {
    return redirect("/home");
  }
}

