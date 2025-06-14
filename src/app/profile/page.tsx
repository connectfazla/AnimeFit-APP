
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
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [isClient, setIsClient] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize profile if it doesn't exist and client has mounted
  useEffect(() => {
    if (isClient && currentUser && !userProfile) {
      const userSpecificProfileKey = `userProfile-${currentUser.uid}`;
      const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
      if (storedUserProfile) {
        setUserProfile(JSON.parse(storedUserProfile));
      } else {
         const defaultProfileForUser: UserProfile = {
            ...DEFAULT_USER_PROFILE,
            id: currentUser.uid,
            name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
        };
        setUserProfile(defaultProfileForUser);
        localStorage.setItem(userSpecificProfileKey, JSON.stringify(defaultProfileForUser));
        localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(defaultProfileForUser));
      }
    } else if (isClient && !currentUser && !userProfile) {
        setUserProfile(DEFAULT_USER_PROFILE);
    }
  }, [isClient, userProfile, setUserProfile, currentUser]);

  if (authLoading || !isClient) {
    return (
      <AppLayout pageTitle="Your Hero Profile">
        <div className="container mx-auto py-8 space-y-8">
          <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-muted-foreground">Loading profile...</CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!currentUser) {
     return (
       <AppLayout pageTitle="Redirecting...">
        <div className="flex min-h-screen items-center justify-center">
          <p>Redirecting to login...</p>
        </div>
      </AppLayout>
    );
  }
  
  // User is authenticated, show profile content (userProfile might still be loading from localStorage here)
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
