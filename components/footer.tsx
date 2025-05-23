import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-2 bottom-0 w-full text-sm border-t justify-center flex flex-col items-center">
        <p>You notice bug? or something is not working?</p>
        <p>Report it on <Link href="https://github.com/enkhbold470/hackathon-team-creator/issues"  target="_blank" className="underline" >Github Issues</Link></p>
    </footer>
  );
}