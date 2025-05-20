import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import { MessageCircleHeart, User as UserIcon, Link as LinkIcon, AtSign, Instagram, Github } from "lucide-react";

interface ProfileDisplayProps {
  profile: User | null;
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            <h3 className="text-base font-bold">Full Name</h3>
          </div>
          <p>{profile.full_name || "Not specified"}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AtSign className="h-5 w-5" />
            <h3 className="text-base font-bold">Discord</h3>
          </div>
          <p>{profile.discord || "Not specified"}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <h3 className="text-base font-bold">LinkedIn</h3>
          </div>
          <p>{profile.linkedin || "Not specified"}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            <h3 className="text-base font-bold">Instagram</h3>
          </div>
          <p>{profile.instagram || "Not specified"}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            <h3 className="text-base font-bold">GitHub</h3>
          </div>
          <p>{profile.github || "Not specified"}</p>
        </div>

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
          <p>{profile.what_to_build || "Not specified"}</p>
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