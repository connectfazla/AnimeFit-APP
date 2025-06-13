"use client";
import { useState, useEffect } from 'react';
import { CharacterCard } from './CharacterCard';
import { CHARACTERS, DEFAULT_USER_PROFILE_ID } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export function CharacterSelectionGrid() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (userProfile) {
      setSelectedCharacterId(userProfile.selectedCharacterId);
    }
  }, [userProfile]);

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
      router.push('/'); // Navigate to dashboard or profile
    } else {
       toast({
        title: "No Character Chosen",
        description: "Please select a character to continue.",
        variant: "destructive",
      });
    }
  };

  if (!userProfile) {
    // This should ideally be handled by ensuring profile exists before reaching this page,
    // or redirecting to a profile creation step.
    return <p>Loading user profile or profile not found...</p>;
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
