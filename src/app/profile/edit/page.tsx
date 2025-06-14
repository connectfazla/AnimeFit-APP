
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
import { UserCog, ImageUp } from 'lucide-react';
import { onAuthStateChanged, type FirebaseUser, updateUserProfileName } from '@/lib/firebase/authService';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [name, setName] = useState('');
  const [customProfileImageUrl, setCustomProfileImageUrl] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (isClient && !authLoading && currentUser) {
      if (userProfile && userProfile.id === currentUser.uid) {
        setName(userProfile.name);
        setCustomProfileImageUrl(userProfile.customProfileImageUrl || '');
      } else {
        const userSpecificProfileKey = `userProfile-${currentUser.uid}`;
        const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
        if (storedUserProfile) {
          const loadedProfile: UserProfile = JSON.parse(storedUserProfile);
          setUserProfile(loadedProfile);
          setName(loadedProfile.name);
          setCustomProfileImageUrl(loadedProfile.customProfileImageUrl || '');
        } else {
          const defaultProfileForUser: UserProfile = {
            ...DEFAULT_USER_PROFILE,
            id: currentUser.uid,
            name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
            customProfileImageUrl: null,
          };
          setUserProfile(defaultProfileForUser);
          setName(defaultProfileForUser.name);
          setCustomProfileImageUrl('');
          localStorage.setItem(userSpecificProfileKey, JSON.stringify(defaultProfileForUser));
        }
      }
    } else if (isClient && !authLoading && !currentUser && !userProfile) {
        setUserProfile(DEFAULT_USER_PROFILE);
        setName(DEFAULT_USER_PROFILE.name);
        setCustomProfileImageUrl(DEFAULT_USER_PROFILE.customProfileImageUrl || '');
    }
  }, [isClient, authLoading, currentUser, userProfile, setUserProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userProfile || name.trim() === "") {
      toast({
        title: 'Invalid Input',
        description: 'Hero name cannot be empty or profile not loaded.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfileName(currentUser, { displayName: name.trim() });

      const updatedProfile: UserProfile = { 
        ...userProfile, 
        name: name.trim(),
        customProfileImageUrl: customProfileImageUrl.trim() || null,
      };
      setUserProfile(updatedProfile);
      localStorage.setItem(`userProfile-${currentUser.uid}`, JSON.stringify(updatedProfile));

      toast({
        title: 'Profile Updated!',
        description: 'Your hero details have been changed.',
      });
      router.push('/profile');
    } catch (error: any) {
       toast({
        title: 'Update Failed',
        description: error.message || 'Could not update your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
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
                  {authLoading ? 'Verifying hero status...' : 'Loading profile editor...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <Skeleton className="h-6 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-10 w-full" />
                </div>
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
  
  if (!userProfile) {
    return (
       <AppLayout pageTitle="Edit Profile">
        <div className="container mx-auto py-8 flex justify-center">
           <Card className="w-full max-w-lg shadow-xl bg-card/80 backdrop-blur-sm">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center">
                  <UserCog className="mr-2 h-7 w-7" />
                  Loading Profile Data...
                </CardTitle>
              </CardHeader>
           </Card>
        </div>
      </AppLayout>
    );
  }

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
              Update your hero name and profile image. Make it legendary!
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
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customProfileImageUrl" className="text-md font-medium flex items-center">
                  <ImageUp className="mr-2 h-5 w-5 text-muted-foreground" />
                  Custom Profile Image URL
                </Label>
                <Input
                  id="customProfileImageUrl"
                  type="url"
                  value={customProfileImageUrl}
                  onChange={(e) => setCustomProfileImageUrl(e.target.value)}
                  placeholder="https://example.com/your-image.png"
                  className="text-lg"
                  disabled={isSaving}
                />
                <p className="text-xs text-muted-foreground">
                  Paste a direct link to an image (e.g., .png, .jpg). Ensure the domain is whitelisted in app config if it's external.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="font-headline" disabled={isSaving || !name.trim()}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
