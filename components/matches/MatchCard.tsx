import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Match } from "@/lib/types";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const otherUser = match.other_user;
  const { toast } = useToast();

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
        <CardContent className="space-y-2 mx-2">
          <div>
            <h3 className="text-lg list-item font-medium">Skill Level</h3>
            <p>{otherUser.skill_level || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-lg list-item font-medium">Hackathon Experience</h3>
            <p>{otherUser.hackathon_experience || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-lg list-item font-medium">Project Experience</h3>
            <p>{otherUser.project_experience || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-lg list-item font-medium">Fun Fact</h3>
            <p>{otherUser.fun_fact || "Not specified"}</p>
          </div>
          <div>
            <h3 className="text-lg list-item font-medium">Self Description</h3>
            <p>{otherUser.self_description || "Not specified"}</p>

          </div>
          <div>
            <h3 className="text-lg list-item font-medium">What I wanna build for the hackathon</h3>
            <p>{otherUser.future_plans || "Not specified"}</p>
          </div>
      
          <div>
            <h3 className="text-lg list-item font-medium">Links</h3>
            <p>{otherUser.links || "Not specified"}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default" onClick={() => {
            copyToClipboard(otherUser.discord || "");
            toast({
              title: "Copied to clipboard",
              description: "Discord username copied to clipboard",
            });
          }}>
            <Copy className="h-4 w-4" />
            <p> Contact via Discord: #{otherUser.discord || "Not specified"}</p>
          </Button>
              
        </CardFooter>
      </Card>
    </motion.div>
  );
} 