
"use client";
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';
import { AppLayout } from '@/components/layout/AppLayout';
import { CharacterSelectionGrid } from '@/components/features/animefit/CharacterSelectionGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import type { UserProfile } from '@/lib/types';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_PROFILE_ID } from '@/lib/constants';

export default function CharacterSelectionPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Determine the key for localStorage based on authentication state
  const profileKey = currentUser ? `userProfile-${currentUser.uid}` : `userProfile-${DEFAULT_USER_PROFILE_ID}`;

  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(
    profileKey,
    () => {
      // Initializer function for useLocalStorageState
      if (currentUser) {
        return {
          ...DEFAULT_USER_PROFILE,
          id: currentUser.uid,
          name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
          customProfileImageUrl: currentUser.photoURL || DEFAULT_USER_PROFILE.customProfileImageUrl,
        };
      }
      return DEFAULT_USER_PROFILE;
    }
  );

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        // If user logs in, and profileKey changes, useLocalStorageState should re-evaluate
        // We might need to explicitly re-fetch/re-initialize if user logs in *on this page*
        // and the key for useLocalStorageState needs to change from default to user-specific.
        // The current `profileKey` definition outside useEffect might handle this if `userProfile`
        // state from `useLocalStorageState` re-runs its initializer when its key prop changes.
        // This needs careful testing.
        // For now, ensure `userProfile` is updated if a user logs in.
        const userSpecificProfileKey = `userProfile-${user.uid}`;
        const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
        if (storedUserProfile) {
            const loadedProfile = JSON.parse(storedUserProfile);
            if(userProfile?.id !== user.uid) { // only update if the profile is not already the current user's
                setUserProfile(loadedProfile);
            }
        } else if (userProfile?.id !== user.uid) { // If no stored profile, set up a new one
            setUserProfile({
                ...DEFAULT_USER_PROFILE,
                id: user.uid,
                name: user.displayName || DEFAULT_USER_PROFILE.name,
                customProfileImageUrl: user.photoURL || DEFAULT_USER_PROFILE.customProfileImageUrl,
            });
        }


      } else {
        setCurrentUser(null);
        // If user logs out, switch to default profile key
        if (userProfile?.id !== DEFAULT_USER_PROFILE_ID) {
             setUserProfile(DEFAULT_USER_PROFILE); // This might be too aggressive, consider if needed
        }
        router.push('/login'); // Redirect to login if not authenticated
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router, setUserProfile]); // userProfile removed from deps as it could cause loop with setUserProfile


  // Effect to ensure userProfile ID matches currentUser UID if currentUser exists
  useEffect(() => {
    if (currentUser && userProfile && userProfile.id !== currentUser.uid) {
        // This case indicates a mismatch, possibly after login or if default profile was loaded.
        // Attempt to load the correct user-specific profile or initialize it.
        const userSpecificProfileKey = `userProfile-${currentUser.uid}`;
        const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
        if (storedUserProfile) {
            setUserProfile(JSON.parse(storedUserProfile));
        } else {
            setUserProfile({
                ...DEFAULT_USER_PROFILE,
                id: currentUser.uid,
                name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
                customProfileImageUrl: currentUser.photoURL || DEFAULT_USER_PROFILE.customProfileImageUrl,
            });
        }
    } else if (!currentUser && userProfile && userProfile.id !== DEFAULT_USER_PROFILE_ID) {
        // If logged out, and profile is not the default, reset to default.
        // setUserProfile(DEFAULT_USER_PROFILE); // Consider if this is desired or if redirect handles it.
    }
  }, [currentUser, userProfile, setUserProfile]);


  if (authLoading || !isClient || !userProfile) {
    return (
      <AppLayout pageTitle="Choose Your Hero">
        <div className="container mx-auto py-8">
          <Card className="mb-8 bg-card/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center text-primary">Loading Characters...</CardTitle>
              <CardDescription className="text-center text-lg text-foreground/80">
                {authLoading ? 'Verifying your hero status...' : userProfile ? 'Preparing the lineup...' : 'Initializing profile...'}
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                 <Card key={i} className="w-full shadow-lg">
                    <Skeleton className="aspect-[3/4] w-full rounded-t-lg" />
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2 mt-2 mb-3" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                 </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Choose Your Hero">
      <div className="container mx-auto py-8">
        <Card className="mb-8 bg-card/70 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-center text-primary">Select Your Training Partner</CardTitle>
            <CardDescription className="text-center text-lg text-foreground/80">
              Choose an anime hero to guide your fitness journey. Their power will be your inspiration!
            </CardDescription>
          </CardHeader>
        </Card>
        <CharacterSelectionGrid 
            userProfile={userProfile} 
            setUserProfile={setUserProfile as Dispatch<SetStateAction<UserProfile>>} // Cast because null is handled by loading state
        />
      </div>
    </AppLayout>
  );
}
