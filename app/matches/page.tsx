"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { UserButton } from "@/components/auth/auth-placeholder"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion" // Import framer-motion

import { MatchedUser, Match } from "@/lib/types"
import LoadingComponent from "./components/LoadingComponent"
import ErrorComponent from "./components/ErrorComponent"
import NoMatchesComponent from "./components/NoMatchesComponent"
import PotentialMatchCard from "./components/PotentialMatchCard"
import MatchCard from "./components/MatchCard"
import PendingMatchCard from "./components/PendingMatchCard"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [potentialMatches, setPotentialMatches] = useState<MatchedUser[]>([])
  const [currentPotentialMatchIndex, setCurrentPotentialMatchIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingPotentials, setLoadingPotentials] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("discover")
  const { toast } = useToast()

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log('Fetching matches from API');
        const response = await fetch("/api/matches")
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from matches API:", errorText);
          if (response.status === 404) {
            setError("User profile not found. Please contact organizers for approval.");
          } else {
            throw new Error(errorText || 'Failed to fetch matches');
          }
          return; 
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
  }, []) // toast is not a dependency here as it's stable and setError is also stable

  // Fetch potential matches
  useEffect(() => {
    const fetchPotentialMatches = async () => {
      // If there's already a critical error (like profile not found), don't fetch potentials
      if (error) return;

      try {
        setLoadingPotentials(true);
        console.log('Fetching potential matches from API');
        const response = await fetch("/api/matches?type=potential")
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from potential matches API:", errorText);
          // Avoid overwriting a more specific error from the first fetch
          if (response.status === 404 && !error) { 
            setError("User profile not found. Please contact organizers for approval.");
          } else if (!error) { 
            throw new Error(errorText || 'Failed to fetch potential matches');
          }
          return;
        }
        
        const data = await response.json()
        console.log('Potential matches data:', data);
        
        setPotentialMatches(data.potentialMatches || []);
      } catch (err) { // Changed variable name to avoid conflict with outer 'error' state
        console.error("Error fetching potential matches:", err);
        // Only toast if there isn't a more critical error already displayed
        if (!error) {
          toast({
            title: "Error loading potential matches",
            description: "There was a problem loading potential matches. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        setLoadingPotentials(false);
      }
    }

    if (activeTab === "discover") {
      fetchPotentialMatches();
    }
  // error state is a dependency, if it changes (e.g. gets set by first useEffect), this effect might need to react
  // activeTab is a dependency to refetch when tab changes
  // toast is a dependency because it's used in the catch block
  }, [activeTab, error, toast]) 

  // Early returns for loading and error states AFTER all hooks have been called
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <p className="text-xl font-semibold mb-2">{error}</p>
        {error === "User profile not found. Please contact organizers for approval." && (
          <p>You don't belong here yet! Ask organizers to approve your application. If you're using different email than you used to apply, please contact organizers. inky@deanzahacks.com</p>
        )}
      </div>
    )
  }
  
  if (loading && loadingPotentials && activeTab === 'discover') { // Only show main loading if discover tab is active and its content is loading
    return <LoadingComponent />;
  }
  if (loading && activeTab === 'matches'){ // Show loading for matches tab if matches are still loading
    return <LoadingComponent />;
  }

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

  const currentPotentialMatch = potentialMatches[currentPotentialMatchIndex];
  const mutualMatches = matches.filter(match => match.is_mutual_match);
  const pendingMatches = matches.filter(match => match.is_user_interested && !match.is_mutual_match);

  return (
    <motion.div className="min-h-screen pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <header className="p-4 flex justify-between items-center border-b border-border">
        <div className="text-xl font-bold text-primary">HackMatch 
          <span className="text-sm text-muted-foreground font-normal border border-border rounded-full mx-2 px-2 py-1">BETA</span>
        </div> 
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
              <NoMatchesComponent 
                title="No more potential matches"
                message="Check back later for more potential teammates."
              />
            ) : (
              <PotentialMatchCard 
                potentialMatch={currentPotentialMatch}
                onAction={handleAction}
                loading={loadingPotentials}
              />
            )}
          </TabsContent>
          
          <TabsContent value="matches" className="mt-4">
            <div className="space-y-4">
              {mutualMatches.length > 0 ? (
                <>
                  <h2 className="text-lg font-medium">Your Matches</h2>
                  {mutualMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </>
              ) : (
                <NoMatchesComponent
                  title="No matches yet"
                  message="Start reacting to find your dream team!"
                />
              )}

              {pendingMatches.length > 0 && (
                <>
                  <h2 className="text-lg font-medium mt-8">Waiting for Response</h2>
                  <p className="text-sm text-muted-foreground">
                    You've shown interest in these users. Waiting for them to respond.
                  </p>
                  {pendingMatches.map((match) => (
                    <PendingMatchCard key={match.id} match={match} />
                  ))}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Navigation />
    </motion.div>
  )
}
