import { redirect } from "next/navigation"

export default function Home() {
  // You can implement your auth check here later
  // For now, we'll just redirect to the discover page
  return redirect("/discover")
}
