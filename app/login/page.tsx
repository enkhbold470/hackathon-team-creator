import { LoginForm } from "@/components/login-form/login-form";
import { loggedIn } from "@/lib/utils";
import { redirect } from "next/navigation";
import ModeToggle from "@/components/mode-toggle";

export default function LoginPage() {
  if (loggedIn) {
    redirect("/home");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold">DA Hacks 3.5 <span className="font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Matchathon</span></h1>

          <p className="mt-4 text-muted-foreground">
            find your hackathon team!
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
