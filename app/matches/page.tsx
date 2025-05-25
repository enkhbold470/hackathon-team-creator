import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import {
  getConfirmedMatches,
  getPendingMatches,
  getPotentialMatches,
} from "../actions/getMatches";
import ConfirmedMatches from "./components/confirmed-matches";
import LoadingComponent from "./components/LoadingComponent";
import PendingMatches from "./components/pending-matches";
import PotentialMatches from "./components/potential-matches";

export default async function MatchesPage() {
  const [potentialMatches, pendingMatches, confirmedMatches] =
    await Promise.all([
      getPotentialMatches(),
      getPendingMatches(),
      getConfirmedMatches(),
    ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Find Hackathon Teammates</h1>

      <Tabs defaultValue="potential">
        <TabsList className="w-full mb-8">
          <TabsTrigger value="potential" className="flex-1">
            Potential Matches
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">
            Pending ({pendingMatches?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="matched" className="flex-1">
            Matched ({confirmedMatches?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="potential" className="space-y-6">
          <Suspense fallback={<LoadingComponent />}>
            <PotentialMatches initialPotentialMatches={potentialMatches} />
          </Suspense>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Suspense fallback={<LoadingComponent />}>
            <PendingMatches pendingMatches={pendingMatches} />
          </Suspense>
        </TabsContent>

        <TabsContent value="matched" className="space-y-6">
          <Suspense fallback={<LoadingComponent />}>
            <ConfirmedMatches confirmedMatches={confirmedMatches} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
