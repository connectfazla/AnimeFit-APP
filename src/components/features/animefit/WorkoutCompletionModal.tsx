
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PartyPopper, X, Clock } from "lucide-react";
import { APP_LOGO_URL } from "@/lib/constants"; // Fallback image

interface WorkoutCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterName?: string;
  xpEarned?: number;
  levelledUp?: boolean;
  newLevel?: number;
  selectedCharacterImageUrl?: string | null;
  workoutDuration?: string;
}

export function WorkoutCompletionModal({
  isOpen,
  onClose,
  characterName,
  xpEarned,
  levelledUp,
  newLevel,
  selectedCharacterImageUrl,
  workoutDuration
}: WorkoutCompletionModalProps) {
  if (!isOpen) return null;

  const displayImage = selectedCharacterImageUrl || APP_LOGO_URL;
  const imageAlt = selectedCharacterImageUrl ? `${characterName || 'Hero'} in victory!` : "Workout Complete Placeholder";
  const imageHint = selectedCharacterImageUrl ? "character victory" : "celebration placeholder";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground shadow-xl border-primary ring-2 ring-primary/50">
        <DialogHeader className="items-center">
          <PartyPopper className="h-16 w-16 text-primary animate-bounce" />
          <DialogTitle className="font-headline text-3xl text-primary mt-4">Workout Complete!</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-lg mt-2">
          {characterName ? `Amazing job, ${characterName} would be proud!` : "Fantastic work, you crushed it!"}
        </DialogDescription>
        
        <div className="my-6 text-center">
          <Image 
            src={displayImage}
            alt={imageAlt} 
            width={250} 
            height={250}
            className="mx-auto rounded-lg shadow-lg animate-anime-power-up object-contain aspect-square"
            data-ai-hint={imageHint}
            onError={(e) => {
                (e.target as HTMLImageElement).src = APP_LOGO_URL;
                (e.target as HTMLImageElement).alt = "Fallback celebration image";
            }}
          />
          <p className="mt-4 text-xl font-semibold text-accent">
            YOU'VE POWERED UP!
          </p>
        </div>

        {workoutDuration && (
          <p className="text-center text-md flex items-center justify-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            Total Training Time: <span className="font-bold text-primary ml-1">{workoutDuration}</span>
          </p>
        )}
        {xpEarned && (
          <p className="text-center text-md mt-1">You earned <span className="font-bold text-primary">{xpEarned.toFixed(0)} XP</span>!</p>
        )}
        {levelledUp && newLevel && (
          <p className="text-center text-lg font-bold text-accent animate-pulse mt-2">
            LEVEL UP! You are now Level {newLevel}!
          </p>
        )}

        <DialogFooter className="mt-6 sm:justify-center">
          <Button onClick={onClose} className="font-headline bg-primary hover:bg-primary/90 text-primary-foreground">
            Awesome!
          </Button>
        </DialogFooter>
        <button onClick={onClose} className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
