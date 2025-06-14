
"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import next/image
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE_ID, DEFAULT_USER_PROFILE, APP_LOGO_URL } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { UserCog, ImageUp, UploadCloud } from 'lucide-react';
import { onAuthStateChanged, type FirebaseUser, updateUserProfileName } from '@/lib/firebase/authService';
import { Skeleton } from '@/components/ui/skeleton';

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function EditProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [name, setName] = useState('');
  // customProfileImageUrl will store the Data URI or existing URL
  const [customProfileImageUrl, setCustomProfileImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const userSpecificProfileKey = `userProfile-${currentUser.uid}`;
      const storedUserProfile = localStorage.getItem(userSpecificProfileKey);
      let loadedProfile: UserProfile | null = null;

      if (storedUserProfile) {
        loadedProfile = JSON.parse(storedUserProfile);
        setUserProfile(loadedProfile);
      } else {
        const defaultProfileForUser: UserProfile = {
          ...DEFAULT_USER_PROFILE,
          id: currentUser.uid,
          name: currentUser.displayName || DEFAULT_USER_PROFILE.name,
          customProfileImageUrl: currentUser.photoURL || null, // Use Firebase photoURL as initial custom
        };
        setUserProfile(defaultProfileForUser);
        loadedProfile = defaultProfileForUser;
        localStorage.setItem(userSpecificProfileKey, JSON.stringify(defaultProfileForUser));
      }
      
      if (loadedProfile) {
        setName(loadedProfile.name);
        setCustomProfileImageUrl(loadedProfile.customProfileImageUrl || null);
        setImagePreview(loadedProfile.customProfileImageUrl || null);
      }

    } else if (isClient && !authLoading && !currentUser && !userProfile) {
        // This case should ideally not be hit frequently if auth redirects work.
        // Fallback to truly default if no auth and no existing local profile.
        setUserProfile(DEFAULT_USER_PROFILE);
        setName(DEFAULT_USER_PROFILE.name);
        setCustomProfileImageUrl(DEFAULT_USER_PROFILE.customProfileImageUrl || null);
        setImagePreview(DEFAULT_USER_PROFILE.customProfileImageUrl || null);
    }
  }, [isClient, authLoading, currentUser, setUserProfile]); // userProfile removed from deps to avoid loop if it's part of a parent context

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: 'File Too Large',
          description: `Image must be less than ${MAX_FILE_SIZE_MB}MB.`,
          variant: 'destructive',
        });
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (e.g., PNG, JPG).',
          variant: 'destructive',
        });
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setCustomProfileImageUrl(dataUri); // Store Data URI for saving
        setImagePreview(dataUri);         // For immediate preview
      };
      reader.readAsDataURL(file);
    }
  };

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
      // Update Firebase auth display name (photoURL update via Firebase auth is complex with Data URIs, so we'll skip for this prototype)
      await updateUserProfileName(currentUser, { displayName: name.trim() });

      const updatedProfile: UserProfile = { 
        ...userProfile, 
        id: currentUser.uid, // Ensure ID is correctly set to current user's UID
        name: name.trim(),
        customProfileImageUrl: customProfileImageUrl, // This will be the Data URI or null
      };
      setUserProfile(updatedProfile); // Update the hook's state
      localStorage.setItem(`userProfile-${currentUser.uid}`, JSON.stringify(updatedProfile)); // Update specific user profile
      localStorage.setItem(DEFAULT_USER_PROFILE_ID, JSON.stringify(updatedProfile)); // Update the active user profile reference

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
                    <Skeleton className="h-40 w-full" /> {/* Placeholder for image uploader */}
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
                <Label htmlFor="profileImageUpload" className="text-md font-medium flex items-center">
                  <ImageUp className="mr-2 h-5 w-5 text-muted-foreground" />
                  Custom Profile Image
                </Label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-2 border-primary"
                      data-ai-hint="user avatar"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-input">
                      <UploadCloud className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <Input
                    id="profileImageUpload"
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    onChange={handleFileChange}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    ref={fileInputRef}
                    disabled={isSaving}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload an image (PNG, JPG, GIF, WebP). Max {MAX_FILE_SIZE_MB}MB.
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
