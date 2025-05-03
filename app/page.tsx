import { loggedIn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function AuthCheck() {
  if (!loggedIn) {
    return redirect("/sign-in");
  } else {
    return redirect("/home");
  }
}
