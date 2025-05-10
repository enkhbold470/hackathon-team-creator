"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { UserButton } from "@/components/auth/auth-placeholder"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsDown, ThumbsUp, MessageCircle } from "lucide-react"

interface MatchedUser {
  userId: string;
  fullName: string;
  skillLevel: string;
  hackathonExperience: string;
  projectExperience: string;
  funFact: string;
  selfDescription: string;
}

interface Match {
  id: number;
  userId1: string;
  userId2: string;
  status: string;
  createdAt: Date;
  isMutualMatch: boolean;
  isUserInterested: boolean;
  isOtherInterested: boolean;
  otherUser: MatchedUser | null;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [potentialMatches, setPotentialMatches] = useState<MatchedUser[]>([])
  const [currentPotentialMatchIndex, setCurrentPotentialMatchIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingPotentials, setLoadingPotentials] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("discover")

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log('Fetching matches from API');
        const response = await fetch("/api/matches")
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from matches API:", errorText);
          throw new Error(errorText || 'Failed to fetch matches');
        }
        
        const data = await response.json()
        console.log('Matches data:', data);
        
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
        setError("Could not load your matches. Please try again later.");
        toast({
          title: "Error loading matches",
          description: "There was a problem loading your matches. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  // Fetch potential matches
  useEffect(() => {
    const fetchPotentialMatches = async () => {
      try {
        setLoadingPotentials(true);
        console.log('Fetching potential matches from API');
        const response = await fetch("/api/matches?type=potential")
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from potential matches API:", errorText);
          throw new Error(errorText || 'Failed to fetch potential matches');
        }
        
        const data = await response.json()
        console.log('Potential matches data:', data);
        
        setPotentialMatches(data.potentialMatches || []);
      } catch (error) {
        console.error("Error fetching potential matches:", error);
        toast({
          title: "Error loading potential matches",
          description: "There was a problem loading potential matches. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingPotentials(false);
      }
    }

    if (activeTab === "discover") {
      fetchPotentialMatches();
    }
  }, [activeTab])

  // Handle interest or pass
  const handleAction = async (targetUserId: string, action: 'interested' | 'pass') => {
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register action");
      }

      const data = await response.json();
      
      if (data.status === 'matched') {
        toast({
          title: "It's a match!",
          description: "You've matched with this person!",
          variant: "default",
        });
        
        // Refresh matches list
        const matchesResponse = await fetch("/api/matches");
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
      }

      // Move to next potential match
      setCurrentPotentialMatchIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= potentialMatches.length) {
          // We've run out of potential matches, reload them
          fetch("/api/matches?type=potential")
            .then(res => res.json())
            .then(data => {
              setPotentialMatches(data.potentialMatches || []);
              return 0; // Reset to first match
            });
          return 0;
        }
        return nextIndex;
      });
    } catch (error) {
      console.error("Error registering action:", error);
      toast({
        title: "Error",
        description: "There was a problem. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading && loadingPotentials) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const currentPotentialMatch = potentialMatches[currentPotentialMatchIndex];
  const mutualMatches = matches.filter(match => match.isMutualMatch);
  const pendingMatches = matches.filter(match => match.isUserInterested && !match.isMutualMatch);

  return (
    <div className="min-h-screen pb-20">
      <header className="p-4 flex justify-between items-center border-b border-border">
        <h1 className="text-xl font-bold text-primary">Team Builder</h1>
        <UserButton />
      </header>

      <main className="p-4 max-w-md mx-auto">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="mt-4">
            {loadingPotentials ? (
              <div className="flex items-center justify-center h-96">
                <p>Finding potential teammates...</p>
              </div>
            ) : potentialMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <h2 className="text-xl font-medium mb-2">No more potential matches</h2>
                <p className="text-muted-foreground">
                  Check back later for more potential teammates.
                </p>
              </div>
            ) : (
              <div className="relative h-[500px]">
                <Card className="w-full h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{currentPotentialMatch?.fullName || "Potential Teammate"}</CardTitle>
                    <CardDescription>Swipe right if interested, left to pass</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-auto">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Skill Level</h3>
                        <p>{currentPotentialMatch?.skillLevel || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Hackathon Experience</h3>
                        <p>{currentPotentialMatch?.hackathonExperience || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Project Experience</h3>
                        <p>{currentPotentialMatch?.projectExperience || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">About Me</h3>
                        <p>{currentPotentialMatch?.selfDescription || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Fun Fact</h3>
                        <p>{currentPotentialMatch?.funFact || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="rounded-full w-12 h-12"
                      onClick={() => handleAction(currentPotentialMatch.userId, 'pass')}
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="icon"
                      className="rounded-full w-12 h-12 bg-green-500 hover:bg-green-600"
                      onClick={() => handleAction(currentPotentialMatch.userId, 'interested')}
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="matches" className="mt-4">
            <div className="space-y-4">
              {mutualMatches.length > 0 ? (
                <>
                  <h2 className="text-lg font-medium">Your Matches</h2>
                  {mutualMatches.map((match) => {
                    const otherUser = match.otherUser;
                    
                    if (!otherUser) {
                      return null;
                    }
                    
                    return (
                      <Card key={match.id}>
                        <CardHeader>
                          <CardTitle>{otherUser.fullName || "Teammate"}</CardTitle>
                          <CardDescription>You've matched!</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <h3 className="text-sm font-medium">Skill Level</h3>
                            <p>{otherUser.skillLevel || "Not specified"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Hackathon Experience</h3>
                            <p>{otherUser.hackathonExperience || "Not specified"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Project Experience</h3>
                            <p>{otherUser.projectExperience || "Not specified"}</p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="default">
                            <MessageCircle className="mr-2 h-4 w-4" /> Contact
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <h2 className="text-xl font-medium mb-2">No matches yet</h2>
                  <p className="text-muted-foreground">
                    Start swiping to find your dream team!
                  </p>
                </div>
              )}

              {pendingMatches.length > 0 && (
                <>
                  <h2 className="text-lg font-medium mt-8">Waiting for Response</h2>
                  <p className="text-sm text-muted-foreground">
                    You've shown interest in these users. Waiting for them to respond.
                  </p>
                  {pendingMatches.map((match) => {
                    const otherUser = match.otherUser;
                    
                    if (!otherUser) {
                      return null;
                    }
                    
                    return (
                      <Card key={match.id} className="bg-muted">
                        <CardHeader>
                          <CardTitle>{otherUser.fullName || "Potential Teammate"}</CardTitle>
                          <CardDescription>Waiting for response</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div>
                            <h3 className="text-sm font-medium">Skill Level</h3>
                            <p>{otherUser.skillLevel || "Not specified"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium">Hackathon Experience</h3>
                            <p>{otherUser.hackathonExperience || "Not specified"}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </div>
  )
}
