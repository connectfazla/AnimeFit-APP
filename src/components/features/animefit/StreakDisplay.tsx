
"use client";
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  userProfile: UserProfile | null;
}

export function StreakDisplay({ userProfile }: StreakDisplayProps) {
  if (!userProfile || !userProfile.currentStreak || userProfile.currentStreak === 0) {
    return (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="font-headline text-xl text-primary flex items-center">
                <Flame className="mr-2 h-6 w-6 text-muted-foreground" />
                Workout Streak
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">Complete a workout to start your streak!</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-gradient-to-br from-accent/20 via-card/70 to-primary/20 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-xl text-primary flex items-center justify-between">
            <div className="flex items-center">
                 <Flame className="mr-2 h-7 w-7 text-orange-500 animate-pulse" />
                 Current Streak
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-4xl font-bold text-center text-accent drop-shadow-md">
          {userProfile.currentStreak} Day{userProfile.currentStreak > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Keep the fire burning, hero!
        </p>
      </CardContent>
    </Card>
  );
}
