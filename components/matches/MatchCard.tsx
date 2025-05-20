import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, User, Linkedin, Instagram, Github, Info, MessageCircleHeart } from "lucide-react";
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

  const extractLink = (platform: string) => {
    if (!otherUser.links) return null;
    const linksArray = otherUser.links.split(' ');
    return linksArray.find(link => link.includes(platform)) || null;
  };

  const linkedinLink = extractLink("linkedin.com");
  const githubLink = extractLink("github.com");
  const instagramLink = extractLink("instagram.com");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card key={match.id}>
        <CardHeader>
          <CardTitle>{otherUser.full_name || "Teammate"}</CardTitle>
          <CardDescription>You've matched! Here are more details:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 mx-2">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-lg font-medium">Project Experience</h3>
          </div>
          <p className="ml-7">{otherUser.project_experience || "Not specified"}</p>
          
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-lg font-medium">What I want to build</h3>
          </div>
          <p className="ml-7">{otherUser.future_plans || "Not specified"}</p>

          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-lg font-medium">Self Description</h3>
          </div>
          <p className="ml-7">{otherUser.self_description || "Not specified"}</p>

          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5" />
            <h3 className="text-lg font-medium">Fun Fact</h3>
          </div>
          <p className="ml-7">{otherUser.fun_fact || "Not specified"}</p>

          <hr className="my-4"/>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <h3 className="text-lg font-medium">Full Name</h3>
          </div>
          <p className="ml-7">{otherUser.full_name || "Not specified"}</p>

          <div className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            <h3 className="text-lg font-medium">Discord</h3>
          </div>
          <p className="ml-7">{otherUser.discord || "Not specified"}</p>

          {linkedinLink && (
            <>
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5" />
                <h3 className="text-lg font-medium">LinkedIn</h3>
              </div>
              <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="ml-7 text-blue-500 hover:underline">{linkedinLink}</a>
            </>
          )}
          {githubLink && (
            <>
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                <h3 className="text-lg font-medium">GitHub</h3>
              </div>
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="ml-7 text-blue-500 hover:underline">{githubLink}</a>
            </>
          )}
          {instagramLink && (
            <>
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                <h3 className="text-lg font-medium">Instagram</h3>
              </div>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="ml-7 text-blue-500 hover:underline">{instagramLink}</a>
            </>
          )}
          {otherUser.links && !linkedinLink && !githubLink && !instagramLink && (
             <>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <h3 className="text-lg font-medium">Other Links</h3>
              </div>
              <p className="ml-7">{otherUser.links}</p>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default" onClick={() => {
            copyToClipboard(otherUser.discord || "");
            toast({
              title: "Copied to clipboard",
              description: "Discord username copied to clipboard",
            });
          }}>
            <Copy className="h-4 w-4 mr-2" />
            Contact via Discord: {otherUser.discord || "Not specified"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 