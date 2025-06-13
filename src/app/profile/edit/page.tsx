"use client";
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE_ID } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { UserCog } from 'lucide-react';

export default function EditProfilePage() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile && name.trim() !== "") {
      setUserProfile({ ...userProfile, name: name.trim() });
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

  if (!userProfile) {
    return (
      <AppLayout pageTitle="Edit Profile">
        <div className="container mx-auto py-8 text-center">Loading profile...</div>
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
                />
              </div>
              {/* Add more editable fields here if needed, e.g., avatar or preferences */}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="font-headline">
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
