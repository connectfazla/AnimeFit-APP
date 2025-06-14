
"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Exercise, DailyLog, UserProfile } from '@/lib/types';
import { WORKOUTS, MAIN_WORKOUT_ID, XP_PER_EXERCISE, XP_PER_WORKOUT_COMPLETION_BONUS, DEFAULT_USER_PROFILE_ID, getXpToNextLevel, CHARACTERS } from '@/lib/constants';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { WorkoutCompletionModal } from './WorkoutCompletionModal';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';

export function WorkoutLogList() {
  const today = new Date().toISOString().split('T')[0];
  const [dailyLogs, setDailyLogs] = useLocalStorageState<Record<string, DailyLog>>('dailyLogs', {});
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [isClient, setIsClient] = useState(false);
  
  const getInitialLogState = useCallback(() => ({ date: today, completedExerciseIds: [], workoutCompleted: false }), [today]);
  const [currentLog, setCurrentLog] = useState<DailyLog>(getInitialLogState);
  
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [modalData, setModalData] = useState<{ xpEarned: number, levelledUp: boolean, newLevel?: number }>({ xpEarned: 0, levelledUp: false });
  const [helpExercise, setHelpExercise] = useState<Exercise | null>(null);

  const workout = WORKOUTS.find(w => w.id === MAIN_WORKOUT_ID);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setCurrentLog(dailyLogs[today] || getInitialLogState());
    }
  }, [isClient, today, dailyLogs, getInitialLogState]);


  if (!isClient || !workout || !userProfile) {
    return (
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Dumbbell className="mr-2 h-7 w-7" />
            {workout?.name || "Today's Challenge"} - {new Date(today).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </CardTitle>
          <CardDescription className="text-muted-foreground">Loading workout details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Separator className="my-6" />
           <ul className="space-y-4">
            {[...Array(WORKOUTS.find(w => w.id === MAIN_WORKOUT_ID)?.exercises.length || 3)].map((_, index) => (
              <li key={index}>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-6 rounded-sm" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                 <Skeleton className="h-3 w-3/4 mt-1 pl-4" />
                {index < (WORKOUTS.find(w => w.id === MAIN_WORKOUT_ID)?.exercises.length || 3) - 1 && <Separator className="my-4" />}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full font-headline text-lg" disabled>
            Loading...
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleToggleExercise = (exerciseId: string) => {
    if (currentLog.workoutCompleted) return; 

    setCurrentLog(prevLog => {
      const newCompletedExerciseIds = prevLog.completedExerciseIds.includes(exerciseId)
        ? prevLog.completedExerciseIds.filter(id => id !== exerciseId)
        : [...prevLog.completedExerciseIds, exerciseId];
      return { ...prevLog, completedExerciseIds: newCompletedExerciseIds };
    });
  };

  const handleFinishWorkout = () => {
    if (!userProfile) { 
      toast({ title: "Error", description: "User profile not loaded. Please try again.", variant: "destructive" });
      return;
    }
    if (currentLog.workoutCompleted) {
      toast({ title: "Already Completed!", description: "You've already logged this workout for today." });
      return;
    }

    const exercisesDoneCount = currentLog.completedExerciseIds.length;
    if (exercisesDoneCount === 0) {
      toast({ title: "No Exercises Logged", description: "Please complete at least one exercise.", variant: "destructive" });
      return;
    }

    let xpEarned = exercisesDoneCount * XP_PER_EXERCISE;
    const allExercisesCompleted = currentLog.completedExerciseIds.length === workout.exercises.length;
    if (allExercisesCompleted) {
      xpEarned += XP_PER_WORKOUT_COMPLETION_BONUS;
    }
    
    let newExperiencePoints = userProfile.experiencePoints + xpEarned;
    let newLevel = userProfile.level;
    let levelledUp = false;
    let xpToNext = getXpToNextLevel(newLevel);

    while (newExperiencePoints >= xpToNext) {
      newExperiencePoints -= xpToNext;
      newLevel++;
      levelledUp = true;
      xpToNext = getXpToNextLevel(newLevel);
    }
    
    const updatedProfile: UserProfile = {
      ...userProfile,
      experiencePoints: newExperiencePoints,
      level: newLevel,
      rewards: levelledUp ? [...userProfile.rewards, `Level ${newLevel} Achieved Aura`] : userProfile.rewards,
    };
    setUserProfile(updatedProfile); 

    const finalLog = { ...currentLog, workoutCompleted: true };
    setDailyLogs(prevLogs => ({ ...prevLogs, [today]: finalLog })); 
    setCurrentLog(finalLog); 

    setModalData({ xpEarned, levelledUp, newLevel: levelledUp ? newLevel : undefined });
    setShowCompletionModal(true);

    toast({
      title: "Workout Logged!",
      description: `You earned ${xpEarned} XP. Keep up the great work!`,
    });
  };
  
  const progressPercentage = workout.exercises.length > 0 ? (currentLog.completedExerciseIds.length / workout.exercises.length) * 100 : 0;

  return (
    <>
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Dumbbell className="mr-2 h-7 w-7" />
            {workout.name} - {new Date(today).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </CardTitle>
          <CardDescription className="text-muted-foreground">Log your exercises for today. Every rep brings you closer to your hero form!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-foreground/80">Progress: {currentLog.completedExerciseIds.length} / {workout.exercises.length} exercises</Label>
            <Progress value={progressPercentage} className="w-full h-3 mt-1 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
          </div>
          <ul className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <li key={exercise.id}>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`exercise-${exercise.id}`}
                      checked={currentLog.completedExerciseIds.includes(exercise.id)}
                      onCheckedChange={() => handleToggleExercise(exercise.id)}
                      disabled={currentLog.workoutCompleted}
                      aria-label={`Mark ${exercise.name} as complete`}
                    />
                    <Label htmlFor={`exercise-${exercise.id}`} className="text-lg font-medium text-foreground cursor-pointer">
                      {exercise.name}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {exercise.sets && exercise.reps && `${exercise.sets} sets x ${exercise.reps} reps`}
                      {exercise.duration && `${exercise.duration}`}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => setHelpExercise(exercise)} aria-label={`Help for ${exercise.name}`}>
                      <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-4">{exercise.description.substring(0, 100)}{exercise.description.length > 100 ? '...' : ''}</p>
                {index < workout.exercises.length - 1 && <Separator className="my-4" />}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleFinishWorkout} 
            disabled={!userProfile || currentLog.workoutCompleted || currentLog.completedExerciseIds.length === 0} 
            size="lg" 
            className="w-full font-headline text-lg"
          >
            {currentLog.workoutCompleted ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" /> Workout Completed Today!
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> Finish & Log Workout
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={!!helpExercise} onOpenChange={(isOpen) => { if (!isOpen) setHelpExercise(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">{helpExercise?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-foreground">{helpExercise?.description}</p>
            {(helpExercise?.sets && helpExercise?.reps) && 
              <p className="text-sm text-muted-foreground mt-2">Recommended: {helpExercise.sets} sets of {helpExercise.reps} reps.</p>
            }
            {helpExercise?.duration &&
              <p className="text-sm text-muted-foreground mt-2">Recommended duration: {helpExercise.duration}.</p>
            }
          </div>
        </DialogContent>
      </Dialog>

      {userProfile && <WorkoutCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        characterName={CHARACTERS.find(c => c.id === userProfile.selectedCharacterId)?.name}
        xpEarned={modalData.xpEarned}
        levelledUp={modalData.levelledUp}
        newLevel={modalData.newLevel}
      />}
    </>
  );
}
