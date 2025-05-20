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
      <CardContent className="pt-6 space-y-6">
        <div className="border rounded-lg p-4 border-orange-500">
      <p className="text-center opacity-50 uppercase">this info will appear once matched</p>

       
        {/* Full Name Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">Full Name</h3>
          </div>
          <p className="ml-7 text-sm text-muted-foreground">{profile.full_name || "Not specified"}</p>
        </div>

        {/* Social Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AtSign className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Discord</h3>
            </div>
            <p className="ml-7 text-sm text-muted-foreground">{profile.discord || "Not specified"}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">LinkedIn</h3>
            </div>
            <p className="ml-7 text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
              {profile.linkedin || "Not specified"}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Instagram</h3>
            </div>
            <p className="ml-7 text-sm text-muted-foreground">{profile.instagram || "Not specified"}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Github className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">GitHub</h3>
            </div>
            <p className="ml-7 text-sm text-muted-foreground">{profile.github || "Not specified"}</p>
          </div>
        </div>
        </div>

        <hr className="border-border" />
        <div className="border rounded-lg p-4 border-green-500">
      <p className="text-center opacity-50 uppercase my-2">this info will used to match you with others</p>

        {/* Other Profile Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Project Experience</h3>
            </div>
            <p className="text-sm text-muted-foreground break-words">{profile.project_experience || "Not specified"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">What I want to build</h3>
            </div>
            <p className="text-sm text-muted-foreground break-words">{profile.what_to_build || "Not specified"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Self-Description</h3>
            </div>
            <p className="text-sm text-muted-foreground break-words">{profile.self_description || "Not specified"}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-base font-semibold">Fun Fact</h3>
            </div>
            <p className="text-sm text-muted-foreground break-words">{profile.fun_fact || "Not specified"}</p>
          </div>
        </div>
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