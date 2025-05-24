/* delete? */

// "use client"

// import { useState } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"

// type FilterBarProps = {
//   onFilterChange: (filters: {
//     skillLevel: string
//     interest: string
//   }) => void
// }

// export function FilterBar({ onFilterChange }: FilterBarProps) {
//   const [filters, setFilters] = useState({
//     skillLevel: "all",
//     interest: "all",
//   })

//   const handleFilterChange = (key: string, value: string) => {
//     const newFilters = { ...filters, [key]: value }
//     setFilters(newFilters)
//     onFilterChange(newFilters)
//   }

//   return (
//     <div className="w-full p-4 bg-card border-b border-border sticky top-0 z-10">
//       <div className="flex gap-4 items-center">
//         <div className="w-1/2">
//           <Label htmlFor="skill-level" className="text-xs mb-1 block">
//             Skill Level
//           </Label>
//           <Select value={filters.skillLevel} onValueChange={(value) => handleFilterChange("skillLevel", value)}>
//             <SelectTrigger id="skill-level" className="w-full">
//               <SelectValue placeholder="All Skill Levels" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Skill Levels</SelectItem>
//               <SelectItem value="Beginner">Beginner</SelectItem>
//               <SelectItem value="Intermediate">Intermediate</SelectItem>
//               <SelectItem value="Advanced">Advanced</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div className="w-1/2">
//           <Label htmlFor="interest" className="text-xs mb-1 block">
//             Interest
//           </Label>
//           <Select value={filters.interest} onValueChange={(value) => handleFilterChange("interest", value)}>
//             <SelectTrigger id="interest" className="w-full">
//               <SelectValue placeholder="All Interests" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Interests</SelectItem>
//               <SelectItem value="Creative">Creative</SelectItem>
//               <SelectItem value="Technical">Technical</SelectItem>
//               <SelectItem value="Leader">Leader</SelectItem>
//               <SelectItem value="Balanced">Balanced</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//     </div>
//   )
// }
