/* delete? */

// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { UserCircle, Search, Home, Users } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function Navigation() {
//   const pathname = usePathname()

//   const routes = [

//     {
//       href: "/",
//       label: "Home",
//       icon: Home,
//       active: pathname === "/",
//     },
//     {
//       href: "/matches",
//       label: "Matches",
//       icon: Users,
//       active: pathname === "/matches",
//     },
//     {
//       href: "/profile",
//       label: "Profile",
//       icon: UserCircle,
//       active: pathname === "/profile",
//     },
//   ]

//   return (
//     <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-2">
//       <div className="flex justify-around items-center">
//         {routes.map((route) => (
//           <Link
//             key={route.href}
//             href={route.href}
//             className={cn(
//               "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
//               route.active ? "text-primary" : "text-muted-foreground hover:text-foreground",
//             )}
//           >
//             <route.icon className="h-6 w-6" />
//             <span className="text-xs mt-1">{route.label}</span>
//           </Link>
//         ))}

//       </div>
//     </nav>
//   )
// }
