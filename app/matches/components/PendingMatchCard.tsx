import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Match } from "@/lib/types";
import { motion } from "framer-motion";

interface PendingMatchCardProps {
  match: Match;
}

export default function PendingMatchCard({ match }: PendingMatchCardProps) {
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
      <Card key={match.id} className="bg-muted">
        <CardHeader>
          {/* name is not showing up */}
          <CardTitle>{"Potential Teammate ID: " + match.user_id_2.slice(10, 15)}</CardTitle>
          <CardDescription>Waiting for response</CardDescription>
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
            <h3 className="text-sm font-medium">About Me</h3>
            <p>{otherUser.self_description || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Fun Fact</h3>
            <p>{otherUser.fun_fact || "Not specified"}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 