
"use client";
import { useState, useEffect, useCallback } from 'react';
import { CharacterCard } from './CharacterCard';
import { CHARACTERS, DEFAULT_USER_PROFILE_ID, DEFAULT_USER_PROFILE } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CharacterSelectionGrid() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userProfile) {
      // If userProfile exists, set selectedCharacterId from it.
      // No need to call setUserProfile here.
      setSelectedCharacterId(userProfile.selectedCharacterId);
    }
    // If userProfile is null while isClient is true, the component will show its loading state.
    // The parent page or auth service is responsible for initializing userProfile.
  }, [isClient, userProfile]);

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacterId(id);
  };

  const handleConfirmSelection = () => {
    if (selectedCharacterId && userProfile) {
      setUserProfile({ ...userProfile, selectedCharacterId });
      toast({
        title: "Character Selected!",
        description: `You are now training as ${CHARACTERS.find(c => c.id === selectedCharacterId)?.name || 'your chosen hero'}!`,
      });
      router.push('/');
    } else {
       toast({
        title: "No Character Chosen",
        description: "Please select a character to continue.",
        variant: "destructive",
      });
    }
  };

  if (!isClient || !userProfile) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(CHARACTERS.length || 4)].map((_, index) => (
            <Card key={index} className="w-full shadow-lg">
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
        <div className="flex justify-center">
          <Button size="lg" className="font-headline" disabled>
            Confirm Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {CHARACTERS.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacterId === character.id}
            onSelect={handleSelectCharacter}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button 
          onClick={handleConfirmSelection} 
          size="lg" 
          className="font-headline"
          disabled={!selectedCharacterId}
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
}
