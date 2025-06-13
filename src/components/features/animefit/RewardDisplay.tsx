"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserProfile } from "@/lib/types";
import { Gift, Medal, Trophy } from "lucide-react";

interface RewardDisplayProps {
  userProfile: UserProfile | null;
}

const rewardIcons = [
  <Gift key="gift" className="h-5 w-5 text-primary" />,
  <Medal key="medal" className="h-5 w-5 text-yellow-500" />,
  <Trophy key="trophy" className="h-5 w-5 text-orange-500" />,
]

export function RewardDisplay({ userProfile }: RewardDisplayProps) {
  if (!userProfile) {
    return (
      <Card className="shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center text-muted-foreground">Loading rewards...</CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary flex items-center">
          <Trophy className="mr-2 h-6 w-6" />
          Your Achievements
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Milestones you've unlocked on your hero journey!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userProfile.rewards.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No rewards earned yet. Keep training!</p>
        ) : (
          <ScrollArea className="h-48">
            <ul className="space-y-3 pr-3">
              {userProfile.rewards.map((reward, index) => (
                <li key={index} className="flex items-center gap-3 p-3 bg-background rounded-md shadow hover:shadow-primary/20 transition-shadow">
                  {rewardIcons[index % rewardIcons.length]}
                  <span className="text-sm font-medium text-foreground">{reward}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
