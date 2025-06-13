"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { UserProfileCard } from '@/components/features/animefit/UserProfileCard';
import { LevelIndicator } from '@/components/features/animefit/LevelIndicator';
import { RewardDisplay } from '@/components/features/animefit/RewardDisplay';
import { ReminderSettingsForm } from '@/components/features/animefit/ReminderSettingsForm';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_PROFILE_ID } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BellRing, Star, Trophy, User } from 'lucide-react';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
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

  if (!isClient) {
    // Server-side rendering or client pre-hydration:
    // Render placeholders that match the "loading" state of child components.
    return (
      <AppLayout pageTitle="Your Hero Profile">
        <div className="container mx-auto py-8 space-y-8">
          {/* Placeholder for UserProfileCard */}
          <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-muted-foreground">Loading profile...</CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Placeholder for LevelIndicator */}
            <Card className="shadow-md bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center text-muted-foreground">Loading level...</CardContent>
            </Card>
            {/* Placeholder for RewardDisplay */}
            <Card className="shadow-md bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center text-muted-foreground">Loading rewards...</CardContent>
            </Card>
          </div>
          {/* Placeholder for ReminderSettingsForm */}
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <BellRing className="mr-2 h-7 w-7" /> Workout Reminders
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Loading reminder settings...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-10">{/* Placeholder for input */}</div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Client-side rendering after hydration:
  // If userProfile is still null at this point (e.g., local storage was empty and default not yet set by effect)
  // child components will show their specific loading states.
  return (
    <AppLayout pageTitle="Your Hero Profile">
      <div className="container mx-auto py-8 space-y-8">
        <UserProfileCard userProfile={userProfile} />
        <div className="grid md:grid-cols-2 gap-8">
          <LevelIndicator userProfile={userProfile} />
          <RewardDisplay userProfile={userProfile} />
        </div>
        <ReminderSettingsForm />
      </div>
    </AppLayout>
  );
}
