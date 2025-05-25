"use client";

import { useToast } from "@/hooks/use-toast";
import type { MatchedUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { handleMatchAction } from "../../actions/getMatches";
import ErrorComponent from "./ErrorComponent";
import NoMatchesComponent from "./NoMatchesComponent";
import PotentialMatchCard from "./potential-match-card";

type PotentialMatchesProps = {
  initialPotentialMatches: MatchedUser[] | null;
};

export default function PotentialMatches({
  initialPotentialMatches,
}: PotentialMatchesProps) {
  const [potentialMatches, setPotentialMatches] = useState<
    MatchedUser[] | null
  >(initialPotentialMatches);
  const [currentPotentialMatchIndex, setCurrentPotentialMatchIndex] =
    useState(0);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setPotentialMatches(initialPotentialMatches);
    setCurrentPotentialMatchIndex(0);
  }, [initialPotentialMatches]);

  if (!potentialMatches)
    return (
      <div className="max-w-lg mx-auto">
        <ErrorComponent error="Failed to load potential matches" />
      </div>
    );

  const currentPotentialMatch =
    potentialMatches.length > 0 &&
    currentPotentialMatchIndex < potentialMatches.length
      ? potentialMatches[currentPotentialMatchIndex]
      : null;

  if (potentialMatches.length === 0 || !currentPotentialMatch) {
    return (
      <NoMatchesComponent
        title="No Potential Matches"
        message="There are no potential matches available at the moment. Check back later!"
      />
    );
  }

  const handleMatchInteraction = async (
    targetUserId: string,
    action: "interested" | "pass"
  ) => {
    startTransition(async () => {
      try {
        const { success } = await handleMatchAction(targetUserId, action);

        if (!success) {
          throw new Error();
        }

        setCurrentPotentialMatchIndex((prev) =>
          Math.min(prev + 1, potentialMatches.length)
        );

        router.refresh();
      } catch (error) {
        console.error("Error handling match action:", error);

        toast({
          title: "Error",
          description: "Failed to match. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <PotentialMatchCard
        potentialMatch={currentPotentialMatch}
        onAction={handleMatchInteraction}
        loading={isPending}
      />
    </div>
  );
}
