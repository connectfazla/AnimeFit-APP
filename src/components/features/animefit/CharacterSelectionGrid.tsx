
"use client";
import { useState, useEffect } from 'react';
import { CharacterCard } from './CharacterCard';
import { CHARACTERS, DEFAULT_USER_PROFILE_ID, DEFAULT_USER_PROFILE } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

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
      setSelectedCharacterId(userProfile.selectedCharacterId);
    } else if (isClient && !userProfile) {
      // Initialize default profile if none exists when client loads
      setUserProfile(DEFAULT_USER_PROFILE);
    }
  }, [isClient, userProfile, setUserProfile]);

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
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="w-full shadow-lg">
              <CardContent className="p-4 aspect-[3/4] flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
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
