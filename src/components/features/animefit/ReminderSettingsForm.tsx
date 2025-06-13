"use client";
import { useState, useEffect } from 'react';
import type { UserProfile } from '@/lib/types';
import { DEFAULT_USER_PROFILE_ID } from '@/lib/constants';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';

export function ReminderSettingsForm() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [reminderTime, setReminderTime] = useState<string>("");

  useEffect(() => {
    if (userProfile && userProfile.reminderTime) {
      setReminderTime(userProfile.reminderTime);
    }
  }, [userProfile]);

  if (!userProfile) {
    return <p>Loading profile...</p>;
  }

  const handleSaveReminders = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile(prev => {
      if (!prev) return null;
      return { ...prev, reminderTime: reminderTime || null };
    });
    toast({
      title: "Reminders Updated!",
      description: `Workout reminders set for ${reminderTime || 'disabled'}. (Note: Actual notifications require backend setup)`,
    });
  };

  return (
    <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
           <BellRing className="mr-2 h-7 w-7" /> Workout Reminders
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Set a daily reminder to never miss a training session. Stay disciplined like your favorite hero!
          (UI for reminder setting only, actual notifications not implemented).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSaveReminders}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reminderTime" className="text-md font-medium text-foreground">Reminder Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-1 w-full md:w-1/2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to disable reminders.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full font-headline text-lg">Save Reminder Settings</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
