import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Match } from "@/lib/types";
import { motion } from "framer-motion";

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const otherUser = match.other_user;

  if (!otherUser) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card key={match.id}>
        <CardHeader>
          <CardTitle>{otherUser.full_name || "Teammate"}</CardTitle>
          <CardDescription>You've matched!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <h3 className="text-sm font-medium">Skill Level</h3>
            <p>{otherUser.skill_level || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Hackathon Experience</h3>
            <p>{otherUser.hackathon_experience || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Project Experience</h3>
            <p>{otherUser.project_experience || "Not specified"}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default">
            <MessageCircle className="mr-2 h-4 w-4" /> Contact
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 