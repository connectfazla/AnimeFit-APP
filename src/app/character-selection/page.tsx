
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from '@/lib/firebase/authService';
import { AppLayout } from '@/components/layout/AppLayout';
import { CharacterSelectionGrid } from '@/components/features/animefit/CharacterSelectionGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export default function CharacterSelectionPage() {
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
      <AppLayout pageTitle="Choose Your Hero">
        <div className="container mx-auto py-8">
          <Card className="mb-8 bg-card/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center text-primary">Loading...</CardTitle>
              <CardDescription className="text-center text-lg text-foreground/80">
                Checking authentication status...
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    // This primarily acts as a fallback if redirection is slow or auth state changes unexpectedly client-side
    return (
       <AppLayout pageTitle="Redirecting...">
        <div className="flex min-h-screen items-center justify-center">
          <p>Redirecting to login...</p>
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
        <CharacterSelectionGrid />
      </div>
    </AppLayout>
  );
}
