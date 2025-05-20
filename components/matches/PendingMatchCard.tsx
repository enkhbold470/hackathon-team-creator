import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Match } from "@/lib/types";
import { motion } from "framer-motion";
import { MessageCircleHeart } from "lucide-react";

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
          <CardTitle>{otherUser.user_id ? `Potential Teammate ID: ${otherUser.user_id.slice(5,9)}` : "Potential Teammate"}</CardTitle>
          <CardDescription>Waiting for response</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">Project Experience</h3>
          </div>
          <p>{otherUser.project_experience || "Not specified"}</p>
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">What I want to build</h3>
          </div>
          <p>{otherUser.future_plans || "Not specified"}</p>
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">Self-Description</h3>
          </div>
          <p>{otherUser.self_description || "Not specified"}</p>
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-base font-bold">Fun Fact</h3>
          </div>
          <p>{otherUser.fun_fact || "Not specified"}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
} 