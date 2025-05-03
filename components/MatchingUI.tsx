import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useMemo, useState } from "react";
import TinderCard from "react-tinder-card";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

interface MatchingUIProps {
  profiles: Profile[];
}

export default function MatchingUI({
  profiles: initialProfiles,
}: MatchingUIProps) {
  const [cards, setCards] = useState<Profile[]>(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  const [matched, setMatched] = React.useState<string[]>([]);
  const [passed, setPassed] = React.useState<string[]>([]);

  useEffect(() => {
    setCurrentIndex(cards.length - 1);
  }, [cards]);

  const childRefs = useMemo(
    () => cards.map(() => React.createRef<any>()),
    [cards]
  );

  const handleMatch = (profile: any) => {
    setMatched((prev) => [...prev, profile.id]);
    toast.success("You matched with " + profile.name);
  };

  const handlePass = (profile: any) => {
    setPassed((prev) => [...prev, profile.id]);
    toast("You passed " + profile.name);
  };

  const swiped = (direction: string, profile: Profile) => {
    setLastDirection(direction);

    if (direction === "right") handleMatch(profile);
    else handlePass(profile);
  };

  const outOfFrame = (profileId: string) => {
    setCards((prev) => prev.filter((p) => p.id !== profileId));
  };

  const swipe = (dir: "left" | "right") => {
    if (currentIndex < 0 || !childRefs[currentIndex]?.current) return;
    childRefs[currentIndex].current.swipe(dir);
  };

  const remainingProfiles = initialProfiles.filter(
    (p) => !matched.includes(p.id) && !passed.includes(p.id)
  );

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No more profiles!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-80 h-96">
        {cards.map((profile, index) => (
          <TinderCard
            ref={childRefs[index]}
            key={profile.id}
            onSwipe={(dir) => swiped(dir, profile)}
            onCardLeftScreen={() => outOfFrame(profile.id)}
            preventSwipe={["up", "down"]}
          >
            <Card
              className="w-80 h-96 overflow-hidden rounded-2xl shadow-lg absolute top-0 left-0 cursor-pointer select-none"
              style={{ zIndex: index }}
            >
              <div className="relative w-full h-48">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.bio}
                </p>
              </CardContent>
            </Card>
          </TinderCard>
        ))}
      </div>

      <CardFooter className="flex gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() => swipe("left")}
          className="cursor-pointer"
        >
          Pass
        </Button>
        <Button onClick={() => swipe("right")} className="cursor-pointer">
          Match
        </Button>
      </CardFooter>
    </div>
  );
}
