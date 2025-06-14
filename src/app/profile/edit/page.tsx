
"use client";
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE_ID, DEFAULT_USER_PROFILE } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { UserCog } from 'lucide-react';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [name, setName] = useState('');
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

  useEffect(() => {
    if (isClient && currentUser) {
      if (userProfile) {
        setName(userProfile.name);
      } else {
        const userSpecificProfileKey = `userProfile-${currentUser.uid}`;
        const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
        if (storedUserProfile) {
          const loadedProfile = JSON.parse(storedUserProfile);
          setUserProfile(loadedProfile);
          setName(loadedProfile.name);
        } else {
          const defaultProfileForUser: UserProfile = {
            ...DEFAULT_USER_PROFILE,
            id: currentUser.uid,
            name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
          };
          setUserProfile(defaultProfileForUser);
          setName(defaultProfileForUser.name);
          localStorage.setItem(userSpecificProfileKey, JSON.stringify(defaultProfileForUser));
          localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(defaultProfileForUser));
        }
      }
    } else if (isClient && !currentUser && !userProfile) {
        // Fallback if no user but also no profile
        setUserProfile(DEFAULT_USER_PROFILE);
        setName(DEFAULT_USER_PROFILE.name);
    }
  }, [isClient, userProfile, setUserProfile, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile && name.trim() !== "" && currentUser) {
      const updatedProfile = { ...userProfile, name: name.trim() };
      setUserProfile(updatedProfile);
      // Also update the user-specific profile
      localStorage.setItem(`userProfile-${currentUser.uid}`, JSON.stringify(updatedProfile));

      toast({
        title: 'Profile Updated!',
        description: 'Your hero name has been changed.',
      });
      router.push('/profile');
    } else {
      toast({
        title: 'Invalid Name',
        description: 'Please enter a valid name for your hero.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !isClient || (isClient && !currentUser)) {
    return (
      <AppLayout pageTitle="Edit Profile">
        <div className="container mx-auto py-8 flex justify-center">
           <Card className="w-full max-w-lg shadow-xl bg-card/80 backdrop-blur-sm">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center">
                  <UserCog className="mr-2 h-7 w-7" />
                  Customize Your Hero Identity
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {authLoading ? 'Checking authentication...' : 'Loading profile to edit...'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" disabled>Cancel</Button>
                <Button type="submit" className="font-headline" disabled>Save Changes</Button>
              </CardFooter>
           </Card>
        </div>
      </AppLayout>
    );
  }
  
  // User is authenticated and client is ready
  return (
    <AppLayout pageTitle="Edit Your Profile">
      <div className="container mx-auto py-8 flex justify-center">
        <Card className="w-full max-w-lg shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <UserCog className="mr-2 h-7 w-7" />
              Customize Your Hero Identity
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your hero name. Make it legendary!
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-md font-medium">Hero Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Captain Fit"
                  className="text-lg"
                  required
                  disabled={!userProfile} // Disable if profile hasn't loaded from localstorage yet
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="font-headline" disabled={!userProfile}>
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
