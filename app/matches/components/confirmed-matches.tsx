"use client";

import type { Match } from "@/lib/types";
import ErrorComponent from "./ErrorComponent";
import MatchCard from "./MatchCard";
import NoMatchesComponent from "./NoMatchesComponent";

type ConfirmedMatchesProps = {
  confirmedMatches: Match[] | null;
};

export default function ConfirmedMatches({
  confirmedMatches,
}: ConfirmedMatchesProps) {
  if (!confirmedMatches) {
    return (
      <div className="max-w-lg mx-auto">
        <ErrorComponent error="Failed to load confirmed matches" />
      </div>
    );
  }

  if (confirmedMatches.length === 0) {
    return (
      <NoMatchesComponent
        title="No Matches Yet"
        message="When you and another person both express interest, you'll see your matches here!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {confirmedMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
