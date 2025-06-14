
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';
import { AppLayout } from '@/components/layout/AppLayout';
import { DayOfWeekSelector } from '@/components/features/animefit/DayOfWeekSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';

export default function WorkoutSchedulePage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isClient, setIsClient] = useState(false);

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

  if (authLoading || !isClient) {
    return (
      <AppLayout pageTitle="Workout Schedule">
        <div className="container mx-auto py-8">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <CalendarCheck className="mr-2 h-7 w-7" />
                Loading Schedule...
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                 {authLoading ? 'Checking permissions...' : 'Fetching your schedule settings...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-12 w-full mt-4" />
            </CardContent>
          </Card>
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

  return (
    <AppLayout pageTitle="Workout Schedule">
      <div className="container mx-auto py-8">
        <DayOfWeekSelector />
      </div>
    </AppLayout>
  );
}
