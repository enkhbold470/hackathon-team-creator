import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { MatchedUser } from "@/lib/types";

interface PotentialMatchCardProps {
  potentialMatch: MatchedUser | undefined;
  onAction: (targetUserId: string, action: 'interested' | 'pass') => void;
  loading: boolean;
}

export default function PotentialMatchCard({
  potentialMatch,
  onAction,
  loading
}: PotentialMatchCardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Finding potential teammates...</p>
      </div>
    );
  }
  
  if (!potentialMatch) {
     return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-xl font-medium mb-2">No more potential matches</h2>
        <p className="text-muted-foreground">
          Check back later for more potential teammates.
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-[500px]">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>{"Potential Teammate ID: " + potentialMatch.user_id.slice(10, 15)}</CardTitle>
          <CardDescription>React the thumb up or down to show interest or pass</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Skill Level</h3>
              <p>{potentialMatch?.skill_level || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Hackathon Experience</h3>
              <p>{potentialMatch?.hackathon_experience || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Project Experience</h3>
              <p>{potentialMatch?.project_experience || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">About Me</h3>
              <p>{potentialMatch?.self_description || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Fun Fact</h3>
              <p>{potentialMatch?.fun_fact || "Not specified"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full w-12 h-12"
            onClick={() => onAction(potentialMatch.user_id, 'pass')}
          >
            <ThumbsDown className="h-5 w-5" />
          </Button>
          <Button 
            variant="default" 
            size="icon"
            className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600"
            onClick={() => onAction(potentialMatch.user_id, 'interested')}
          >
            <ThumbsUp className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 