"use client";

import type { Match } from "@/lib/types";
import ErrorComponent from "./ErrorComponent";
import NoMatchesComponent from "./NoMatchesComponent";
import PendingMatchCard from "./pending-match-card";

type PendingMatchesProps = {
  pendingMatches: Match[] | null;
};

export default function PendingMatches({
  pendingMatches,
}: PendingMatchesProps) {
  if (!pendingMatches) {
    return (
      <div className="max-w-lg mx-auto">
        <ErrorComponent error="Failed to load pending matches" />
      </div>
    );
  }

  if (pendingMatches.length === 0) {
    return (
      <NoMatchesComponent
        title="No Pending Matches"
        message="You don't have any pending match requests. Start by liking potential matches!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pendingMatches.map((match) => (
        <PendingMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
