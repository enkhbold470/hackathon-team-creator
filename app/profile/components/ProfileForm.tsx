import type React from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Application } from "@prisma/client";
import { motion } from "framer-motion";

interface ProfileFormProps {
  profile: Application | null;
  setProfile: React.Dispatch<React.SetStateAction<Application | null>>;
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
        {/* <div className="space-y-2">
          <Label htmlFor="skill-level">Skill Level</Label>
          <Select
            defaultValue={profile?.skill_level || ""}
            onValueChange={(value) => setProfile(prev => prev ? ({ ...prev, skill_level: value }) : null)}
          >
            <SelectTrigger id="skill-level">
              <SelectValue placeholder="Select your skill level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <Label htmlFor="hackathon-experience">Hackathon Experience</Label>
          <Select
            defaultValue={profile?.hackathon_experience || ""}
            onValueChange={(value) => setProfile(prev => prev ? ({ ...prev, hackathon_experience: value }) : null)}
          >
            <SelectTrigger id="hackathon-experience">
              <SelectValue placeholder="Select your experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="1-2">1-2 hackathons</SelectItem>
              <SelectItem value="3-5">3-5 hackathons</SelectItem>
              <SelectItem value="5+">5+ hackathons</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="project-experience">Project Experience</Label>
          <Textarea
            id="project-experience"
            placeholder="Describe what is your project experience"
            defaultValue={profile?.project_experience || ""}
            onChange={(e) => setProfile(prev => prev ? ({ ...prev, project_experience: e.target.value }) : null)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="future-plans">What I want to build</Label>
          <Textarea
            id="future-plans"
            placeholder="Describe what you want to build"
            defaultValue={profile?.future_plans || ""}
            onChange={(e) => setProfile(prev => prev ? ({ ...prev, future_plans: e.target.value }) : null)}
            className="min-h-[100px]"
          />
        </div>

    

        <div className="space-y-2">
          <Label>Self-Description</Label>
          <RadioGroup
            defaultValue={profile?.self_description || ""}
            onValueChange={(value) => setProfile(prev => prev ? ({ ...prev, self_description: value }) : null)}
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
            onChange={(e) => setProfile(prev => prev ? ({ ...prev, fun_fact: e.target.value }) : null)}
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