"use client";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Zap } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { getXpToNextLevel } from "@/lib/constants";

interface LevelIndicatorProps {
  userProfile: UserProfile | null;
}

export function LevelIndicator({ userProfile }: LevelIndicatorProps) {
  if (!userProfile) {
    return (
      <Card className="shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4 text-center text-muted-foreground">Loading level...</CardContent>
      </Card>
    );
  }

  const xpToNextLevel = getXpToNextLevel(userProfile.level);
  const progressPercentage = (userProfile.experiencePoints / xpToNextLevel) * 100;

  return (
    <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary flex items-center justify-between">
          <div className="flex items-center">
            <Star className="mr-2 h-6 w-6 text-yellow-400 fill-yellow-400" />
            Level {userProfile.level}
          </div>
          <div className="flex items-center text-sm text-accent">
             <Zap className="mr-1 h-4 w-4" /> {userProfile.experiencePoints.toFixed(0)} / {xpToNextLevel.toFixed(0)} XP
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Progress value={progressPercentage} className="w-full h-3 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
        <p className="text-xs text-muted-foreground text-right mt-1">
          { (xpToNextLevel - userProfile.experiencePoints).toFixed(0)} XP to next level
        </p>
      </CardContent>
    </Card>
  );
}
