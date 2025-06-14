
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';
import { AppLayout } from '@/components/layout/AppLayout';
import { CharacterSelectionGrid } from '@/components/features/animefit/CharacterSelectionGrid';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CharacterSelectionPage() {
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
      <AppLayout pageTitle="Choose Your Hero">
        <div className="container mx-auto py-8">
          <Card className="mb-8 bg-card/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-center text-primary">Loading Characters...</CardTitle>
              <CardDescription className="text-center text-lg text-foreground/80">
                {authLoading ? 'Verifying your hero status...' : 'Preparing the lineup...'}
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

  // If not authenticated after loading, redirect handled by useEffect. 
  // This fallback can be simpler.
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
