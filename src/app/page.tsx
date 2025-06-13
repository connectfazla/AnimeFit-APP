
"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChartClient } from '@/components/features/animefit/ProgressChartClient';
import { LevelIndicator } from '@/components/features/animefit/LevelIndicator';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_PROFILE_ID, CHARACTERS } from '@/lib/constants';
import type { UserProfile, AnimeCharacter, DailyLog } from '@/lib/types';
import { ArrowRight, BarChartBig, Users, CalendarPlus, TrendingUp } from 'lucide-react'; // Added TrendingUp

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [dailyLogs, setDailyLogs] = useLocalStorageState<Record<string, DailyLog>>('dailyLogs', {});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize profile if it doesn't exist and client has mounted
  useEffect(() => {
    if (isClient && !userProfile) {
      setUserProfile(DEFAULT_USER_PROFILE);
    }
  }, [isClient, userProfile, setUserProfile]);

  const selectedCharacter: AnimeCharacter | undefined = 
    (isClient && userProfile) 
    ? CHARACTERS.find(char => char.id === userProfile.selectedCharacterId) 
    : undefined;

  if (!isClient) {
    // SSR or pre-hydration on client: Render a consistent loading state
    return (
      <AppLayout pageTitle="Dashboard">
        <div className="container mx-auto py-8 space-y-8">
          <Card className="shadow-xl bg-gradient-to-br from-primary/20 via-card/70 to-accent/20 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                Loading Dashboard...
              </CardTitle>
              <CardDescription className="text-lg text-foreground/80">
                Please wait while we prepare your hero stats!
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center text-muted-foreground">Loading level...</CardContent>
            </Card>
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-center"><CalendarPlus className="mr-2 h-6 w-6"/>Today's Quest</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button size="lg" className="w-full font-headline text-lg" disabled>
                        Loading Workout...
                    </Button>
                </CardContent>
            </Card>
          </div>
          <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><TrendingUp className="mr-2 h-6 w-6"/>Workout Progress</CardTitle>
              <CardDescription className="text-muted-foreground">Loading chart data...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Your progress chart will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  if (!userProfile) {
    // This state occurs after isClient is true, but before userProfile is potentially defaulted
    return (
      <AppLayout pageTitle="Dashboard">
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-muted-foreground">Loading your dashboard...</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout pageTitle="Dashboard">
      <div className="container mx-auto py-8 space-y-8">
        <Card className="shadow-xl bg-gradient-to-br from-primary/20 via-card/70 to-accent/20 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
              Welcome back, {userProfile.name}!
            </CardTitle>
            <CardDescription className="text-lg text-foreground/80">
              Ready to unleash your inner hero today? Let's get training!
            </CardDescription>
          </CardHeader>
          {selectedCharacter && (
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <Image 
                src={selectedCharacter.imageUrl} 
                alt={selectedCharacter.name} 
                width={100} 
                height={150} 
                className="rounded-lg shadow-md border-2 border-primary object-cover"
                data-ai-hint={selectedCharacter.dataAiHint}
              />
              <div>
                <p className="text-xl font-semibold text-foreground">Your current mentor: <span className="text-accent font-bold">{selectedCharacter.name}</span></p>
                <p className="text-sm text-muted-foreground italic">"{selectedCharacter.description}"</p>
                <Link href="/character-selection" passHref>
                  <Button variant="link" className="px-0 text-sm text-primary hover:text-accent">
                    Change Character <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          )}
           {!selectedCharacter && (
            <CardContent>
                 <p className="text-lg text-foreground">No character selected yet. Choose your hero!</p>
                <Link href="/character-selection" passHref>
                    <Button className="mt-2">
                        <Users className="mr-2 h-5 w-5" /> Select Character
                    </Button>
                </Link>
            </CardContent>
           )}
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <LevelIndicator userProfile={userProfile} />
            <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary flex items-center"><CalendarPlus className="mr-2 h-6 w-6"/>Today's Quest</CardTitle>
                    <CardDescription className="text-muted-foreground">Jump into your daily training regime.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Link href="/workout-tracker" passHref>
                        <Button size="lg" className="w-full font-headline text-lg">
                            Start Today's Workout
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
        
        <ProgressChartClient dailyLogs={dailyLogs} />

        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/workout-tracker" passHref>
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                        <BarChartBig className="mr-3 h-5 w-5 text-accent" />
                        <div>
                            <p className="font-semibold">Log Workout</p>
                            <p className="text-xs text-muted-foreground">Record your daily exercises.</p>
                        </div>
                    </Button>
                </Link>
                 <Link href="/character-selection" passHref>
                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                        <Users className="mr-3 h-5 w-5 text-accent" />
                        <div>
                            <p className="font-semibold">View Characters</p>
                            <p className="text-xs text-muted-foreground">Choose your training partner.</p>
                        </div>
                    </Button>
                </Link>
                <Link href="/workout-schedule" passHref>
                     <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                        <CalendarPlus className="mr-3 h-5 w-5 text-accent" />
                        <div>
                            <p className="font-semibold">Set Schedule</p>
                            <p className="text-xs text-muted-foreground">Customize your workout days.</p>
                        </div>
                    </Button>
                </Link>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
