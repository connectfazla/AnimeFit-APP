
"use client";
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { CharacterCard } from './CharacterCard';
import { CHARACTERS } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CharacterSelectionGridProps {
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
}

export function CharacterSelectionGrid({ userProfile, setUserProfile }: CharacterSelectionGridProps) {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userProfile) {
      setSelectedCharacterId(userProfile.selectedCharacterId);
    }
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
    // This loading state should ideally be brief as CharacterSelectionPage handles the main loading.
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {CHARACTERS.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharacterId === character.id}
            onSelect={handleSelectCharacter}
          />
        ))}
      </div>
      <div className="flex justify-center pb-4">
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
