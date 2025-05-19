import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Application } from "@prisma/client";
import { motion } from "framer-motion";
import { MessageCircleHeart } from "lucide-react";
interface ProfileDisplayProps {
  profile: Application | null;
  setIsEditing: (isEditing: boolean) => void;
}

export default function ProfileDisplay({ profile, setIsEditing }: ProfileDisplayProps) {
  if (!profile) {
    return (
      <CardContent>
        <p>Profile not found.</p>
      </CardContent>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CardContent className="space-y-4">
        {/* <div className="space-y-1">
          <h3 className="text-sm font-medium">Skill Level</h3>
          <p>{profile.skill_level || "Not specified"}</p>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium">Hackathon Experience</h3>
          <p>{profile.hackathon_experience || "Not specified"}</p>
        </div> */}

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">Project Experience</h3>
          </div>
          <p>{profile.project_experience || "Not specified"}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">What I want to build</h3>
          </div>
          <p>{profile.future_plans || "Not specified"}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">Self-Description</h3>
          </div>
          <p>{profile.self_description || "Not specified"}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">Fun Fact</h3>
          </div>
          <p>{profile.fun_fact || "Not specified"}</p>
        </div>
  
     
      </CardContent>

      <CardFooter>
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Edit Profile
        </Button>
      </CardFooter>
    </motion.div>
  );
} 