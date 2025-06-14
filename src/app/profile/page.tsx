
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
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [isClient, setIsClient] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    setIsClient(true);
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
    if (isClient && !authLoading) {
      if (currentUser) {
        const userSpecificProfileKey = `userProfile-${currentUser.uid}`;
        const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
        if (storedUserProfile) {
          const loadedProfile = JSON.parse(storedUserProfile);
          if (userProfile?.id !== currentUser.uid) {
            setUserProfile(loadedProfile);
          } else if (!userProfile) {
            setUserProfile(loadedProfile);
          }
        } else {
           const defaultProfileForUser: UserProfile = {
              ...DEFAULT_USER_PROFILE,
              id: currentUser.uid,
              name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
          };
          setUserProfile(defaultProfileForUser);
          localStorage.setItem(userSpecificProfileKey, JSON.stringify(defaultProfileForUser));
        }
      } else if (!currentUser && !userProfile) {
          setUserProfile(DEFAULT_USER_PROFILE); // Should be rare
      }
    }
  }, [isClient, authLoading, currentUser, userProfile, setUserProfile]);

  if (authLoading || !isClient) {
    return (
      <AppLayout pageTitle="Your Hero Profile">
        <div className="container mx-auto py-8 space-y-8">
          <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center items-center">
                <Skeleton className="w-32 h-32 rounded-full mx-auto border-4 border-primary shadow-lg" />
                <Skeleton className="h-8 w-48 mt-4 mx-auto" />
                <Skeleton className="h-5 w-64 mt-1 mx-auto" />
            </CardHeader>
            <CardContent className="p-6 text-center text-muted-foreground">
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter className="p-6 flex justify-center">
                <Skeleton className="h-10 w-32" />
            </CardFooter>
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

  if (!currentUser) { // Fallback if auth resolved to no user (redirect is primary)
     return (
       <AppLayout pageTitle="Redirecting...">
        <div className="flex min-h-screen items-center justify-center">
          <p>Redirecting to login...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!userProfile) { // If user is authenticated but profile isn't loaded yet
    return (
      <AppLayout pageTitle="Your Hero Profile">
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-muted-foreground">Loading your hero data...</p>
        </div>
      </AppLayout>
    );
  }
  
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
