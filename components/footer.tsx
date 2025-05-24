import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-2 bottom-0 w-full text-sm border-t justify-center flex flex-col items-center">
      <div className="flex gap-4 mb-1">
        <Link
          href="/install"
          className="underline hover:text-blue-600 transition-colors"
        >
          Install App
        </Link>
        <span>•</span>
        <Link
          href="https://github.com/enkhbold470/hackathon-team-creator/issues"
          target="_blank"
          className="underline hover:text-blue-600 transition-colors"
        >
          Report Issues
        </Link>
      </div>
      <p>
        Not getting a match? Try finding one on our{" "}
        <Link
          href="https://discord.gg/bJWTS7qem6"
          className="underline hover:text-blue-600 transition-colors"
          target="_blank"
        >
          Discord
        </Link>
        !
      </p>
    </footer>
  );
}
