
"use client";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { UserProfile, AnimeCharacter } from '@/lib/types';
import { CHARACTERS, APP_LOGO_URL } from '@/lib/constants';
import { Edit3, User, BarChart3, ShieldCheck } from 'lucide-react';

interface UserProfileCardProps {
  userProfile: UserProfile | null;
}

export function UserProfileCard({ userProfile }: UserProfileCardProps) {
  if (!userProfile) {
    return (
      <Card className="shadow-md bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center text-muted-foreground">Loading profile...</CardContent>
      </Card>
    );
  }

  const selectedCharacter: AnimeCharacter | undefined = CHARACTERS.find(
    (char) => char.id === userProfile.selectedCharacterId
  );

  // Prioritize customProfileImageUrl (which could be a Data URI or external URL)
  // Then selected character's image, then a default placeholder/icon.
  const displayImageUrl = userProfile.customProfileImageUrl || selectedCharacter?.imageUrl;
  const displayName = userProfile.name;
  
  let imageAlt = displayName;
  if (userProfile.customProfileImageUrl) {
    imageAlt = `${displayName}'s custom profile picture`;
  } else if (selectedCharacter) {
    imageAlt = selectedCharacter.name;
  }

  let imageDataAiHint = "user avatar";
  if (!userProfile.customProfileImageUrl && selectedCharacter) {
    imageDataAiHint = selectedCharacter.dataAiHint;
  }


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center items-center">
        {displayImageUrl ? (
          <Image
            src={displayImageUrl} // Can be Data URI or external URL
            alt={imageAlt}
            width={128}
            height={128}
            className="rounded-full object-cover border-4 border-primary shadow-lg mx-auto"
            data-ai-hint={imageDataAiHint}
            // For Data URIs, onError might not be as relevant unless the Data URI itself is broken.
            // For external URLs, good to have error handling.
             onError={(e) => { 
              // Attempt to set to default app logo on error
              // This is a basic fallback. More robust would be a specific default user avatar.
              (e.target as HTMLImageElement).src = APP_LOGO_URL; 
              (e.target as HTMLImageElement).dataset.aiHint = "app logo fallback";
            }}
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mx-auto border-4 border-primary shadow-lg">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <CardTitle className="font-headline text-3xl mt-4 text-primary">{displayName}</CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          {userProfile.customProfileImageUrl 
            ? (selectedCharacter ? `Also inspired by ${selectedCharacter.name}` : "Hero in training")
            : (selectedCharacter ? `Training as ${selectedCharacter.name}` : 'Ready to choose a hero!')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <div className="flex justify-between items-center p-3 bg-background rounded-lg shadow">
          <span className="font-medium text-foreground flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-accent" /> Level:</span>
          <span className="text-primary font-bold text-lg">{userProfile.level}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-background rounded-lg shadow">
          <span className="font-medium text-foreground flex items-center"><BarChart3 className="mr-2 h-5 w-5 text-accent" /> Experience:</span>
          <span className="text-primary font-bold text-lg">{userProfile.experiencePoints.toFixed(0)} XP</span>
        </div>
        <div className="p-3 bg-background rounded-lg shadow">
          <span className="font-medium text-foreground flex items-center mb-1"><User className="mr-2 h-5 w-5 text-accent" />Workout Days:</span>
          <p className="text-primary">{userProfile.workoutDays.join(', ') || 'Not set'}</p>
        </div>
      </CardContent>
      <CardFooter className="p-6 flex justify-center">
        <Link href="/profile/edit" passHref>
          <Button variant="outline" className="font-headline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

