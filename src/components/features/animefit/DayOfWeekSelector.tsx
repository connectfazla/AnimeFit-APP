
"use client";
import { useState, useEffect } from 'react';
import { DAYS_OF_WEEK, DEFAULT_USER_PROFILE_ID, DEFAULT_USER_PROFILE } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CalendarCheck } from 'lucide-react';

export function DayOfWeekSelector() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (isClient && !userProfile) {
      setUserProfile(DEFAULT_USER_PROFILE);
    }
  }, [isClient, userProfile, setUserProfile]);

  if (!isClient || !userProfile) {
    return (
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <CalendarCheck className="mr-2 h-7 w-7" />
            Customize Your Workout Week
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Loading schedule options...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center space-x-2 p-3 bg-background rounded-lg shadow">
                <Checkbox id={`day-${day}-placeholder`} disabled />
                <Label htmlFor={`day-${day}-placeholder`} className="text-md font-medium text-muted-foreground">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full font-headline text-lg" disabled>
              Save Schedule Changes
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleDayToggle = (day: string) => {
    setUserProfile(prev => {
      if (!prev) return null;
      const newWorkoutDays = prev.workoutDays.includes(day)
        ? prev.workoutDays.filter(d => d !== day)
        : [...prev.workoutDays, day];
      return { ...prev, workoutDays: newWorkoutDays };
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Schedule Updated!",
      description: "Your workout days have been saved.",
    });
  };

  return (
    <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <CalendarCheck className="mr-2 h-7 w-7" />
          Customize Your Workout Week
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Select the days you want to train like a hero. Consistency is key to unlocking your power!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="flex items-center space-x-2 p-3 bg-background rounded-lg shadow hover:shadow-md transition-shadow">
              <Checkbox
                id={`day-${day}`}
                checked={userProfile.workoutDays.includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
                aria-label={`Toggle workout on ${day}`}
              />
              <Label htmlFor={`day-${day}`} className="text-md font-medium text-foreground cursor-pointer">
                {day}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} className="w-full font-headline text-lg">
            Save Schedule Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
