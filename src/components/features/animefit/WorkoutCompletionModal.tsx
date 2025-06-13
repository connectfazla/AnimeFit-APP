"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PartyPopper, X } from "lucide-react";

interface WorkoutCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterName?: string;
  xpEarned?: number;
  levelledUp?: boolean;
  newLevel?: number;
}

export function WorkoutCompletionModal({
  isOpen,
  onClose,
  characterName,
  xpEarned,
  levelledUp,
  newLevel
}: WorkoutCompletionModalProps) {
  if (!isOpen) return null;

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
          {/* Placeholder for anime-style animation/image */}
          <Image 
            src="https://placehold.co/300x200.png" 
            alt="Workout Complete Animation" 
            width={300} 
            height={200}
            className="mx-auto rounded-lg shadow-lg animate-anime-power-up"
            data-ai-hint="victory celebration"
          />
          <p className="mt-4 text-xl font-semibold text-accent">
            YOU'VE POWERED UP!
          </p>
        </div>

        {xpEarned && (
          <p className="text-center text-md">You earned <span className="font-bold text-primary">{xpEarned} XP</span>!</p>
        )}
        {levelledUp && newLevel && (
          <p className="text-center text-lg font-bold text-accent animate-pulse">
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
