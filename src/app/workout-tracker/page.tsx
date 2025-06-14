
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/firebase/authService';
import { AppLayout } from '@/components/layout/AppLayout';
import { WorkoutLogList } from '@/components/features/animefit/WorkoutLogList';
import { Skeleton } from '@/components/ui/skeleton'; 
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

export default function WorkoutTrackerPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (authLoading) {
    return (
      <AppLayout pageTitle="Daily Workout Tracker">
        <div className="container mx-auto py-8">
           <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center">
                <Dumbbell className="mr-2 h-7 w-7" />
                Loading Workout Tracker...
              </CardTitle>
              <CardDescription className="text-muted-foreground">Checking authentication...</CardDescription>
            </CardHeader>
            <Skeleton className="h-64 w-full" />
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  if (!isAuthenticated) {
     return (
       <AppLayout pageTitle="Redirecting...">
        <div className="flex min-h-screen items-center justify-center">
          <p>Redirecting to login...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="Daily Workout Tracker">
      <div className="container mx-auto py-8">
        <WorkoutLogList />
      </div>
    </AppLayout>
  );
}
