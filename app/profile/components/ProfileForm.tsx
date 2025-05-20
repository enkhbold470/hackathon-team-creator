import type React from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@prisma/client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

export default function ProfileForm({
  profile,
  setProfile,
  handleSubmit,
  setIsEditing,
}: ProfileFormProps) {
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
    >
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            placeholder="Enter your full name"
            defaultValue={profile?.full_name || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), full_name: value } as User));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discord">Discord</Label>
          <Input
            id="discord"
            placeholder="Enter your Discord username"
            defaultValue={profile?.discord || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), discord: value } as User));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="Enter your LinkedIn profile URL"
            defaultValue={profile?.linkedin || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), linkedin: value } as User));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            placeholder="Enter your Instagram username"
            defaultValue={profile?.instagram || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), instagram: value } as User));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            placeholder="Enter your GitHub username"
            defaultValue={profile?.github || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), github: value } as User));
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-experience">Project Experience</Label>
          <Textarea
            id="project-experience"
            placeholder="Describe what is your project experience"
            defaultValue={profile?.project_experience || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), project_experience: value } as User));
            }}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="future-plans">What I want to build</Label>
          <Textarea
            id="future-plans"
            placeholder="Describe what you want to build"
            defaultValue={profile?.what_to_build || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), what_to_build: value } as User));
            }}
            className="min-h-[100px]"
          />
        </div>

    

        <div className="space-y-2">
          <Label>Self-Description</Label>
          <RadioGroup
            defaultValue={profile?.self_description || ""}
            onValueChange={(value) => setProfile(prev => ({ ...(prev || {}), self_description: value } as User))}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Creative" id="creative" />
              <Label htmlFor="creative">Creative</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Technical" id="technical" />
              <Label htmlFor="technical">Technical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Leader" id="leader" />
              <Label htmlFor="leader">Leader</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Balanced" id="balanced" />
              <Label htmlFor="balanced">Balanced</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fun-fact">Fun Fact</Label>
          <Textarea
            id="fun-fact"
            placeholder="Share something interesting about yourself"
            defaultValue={profile?.fun_fact || ""}
            onChange={(e) => {
              const { value } = e.target;
              setProfile(prev => ({ ...(prev || {}), fun_fact: value } as User));
            }}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>

      

      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </CardFooter>
    </motion.form>
  );
} 