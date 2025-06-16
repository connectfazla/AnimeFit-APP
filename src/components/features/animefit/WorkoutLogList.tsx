
"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Exercise, DailyLog, UserProfile, DifficultyLevel, IntensityConfig, AnimeCharacter } from '@/lib/types';
import { ALL_EXERCISES, DEFAULT_WORKOUT_EXERCISES, XP_PER_EXERCISE, XP_PER_WORKOUT_COMPLETION_BONUS, DEFAULT_USER_PROFILE_ID, getXpToNextLevel, CHARACTERS, XP_DIFFICULTY_MULTIPLIERS, XP_EXTRA_QUEST_BONUS } from '@/lib/constants';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { WorkoutCompletionModal } from './WorkoutCompletionModal';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, CheckCircle2, Sparkles, HelpCircle, Zap, Shield, Brain, Clock, ChevronsUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const difficultyButtonConfig: Record<DifficultyLevel, { text: string, icon: React.ElementType, variant: "outline" | "default" | "secondary" }> = {
  easy: { text: "Relaxed Recalibration", icon: Shield, variant: "outline" },
  normal: { text: "Standard Power Drill", icon: Brain, variant: "default" },
  hard: { text: "Limit Break Mode!", icon: Zap, variant: "outline" },
};

const currentDifficultyButtonConfig: Record<DifficultyLevel, { text: string, icon: React.ElementType }> = {
  easy: { text: "Relaxed Recalibration", icon: Shield },
  normal: { text: "Standard Power Drill", icon: Brain },
  hard: { text: "Limit Break Mode!", icon: Zap },
};


export function WorkoutLogList() {
  const today = new Date().toISOString().split('T')[0];
  const [dailyLogs, setDailyLogs] = useLocalStorageState<Record<string, DailyLog>>('dailyLogs', {});
  // Assuming userProfile is loaded correctly with the user-specific key by the page using this component
  // For WorkoutLogList, it might need to get the current user's ID to construct its own key if not passed via props.
  // For now, using DEFAULT_USER_PROFILE_ID which should be updated by the parent page context.
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const [isClient, setIsClient] = useState(false);

  const [currentWorkout, setCurrentWorkout] = useState<{ name: string; exercises: Exercise[] }>({
    name: "Today's Heroic Challenge",
    exercises: DEFAULT_WORKOUT_EXERCISES,
  });

  const getInitialLogState = useCallback((): DailyLog => {
    const existingLog = dailyLogs[today];
    if (existingLog) return existingLog;
    return {
      date: today,
      completedExerciseIds: [],
      workoutCompleted: false,
      difficulty: 'normal',
      duration: undefined,
      extraQuestCompleted: false
    };
  }, [today, dailyLogs]);

  const [currentLog, setCurrentLog] = useState<DailyLog>(getInitialLogState);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [modalData, setModalData] = useState<{ xpEarned: number, levelledUp: boolean, newLevel?: number, characterName?: string, selectedCharacterImageUrl?: string | null, workoutDuration?: string }>({ xpEarned: 0, levelledUp: false });
  const [helpExercise, setHelpExercise] = useState<Exercise | null>(null);

  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyLevel>(currentLog.difficulty || 'normal');
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [workoutActive, setWorkoutActive] = useState<boolean>(false);


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userProfile) {
      const selectedChar: AnimeCharacter | undefined = CHARACTERS.find(c => c.id === userProfile.selectedCharacterId);
      if (selectedChar && selectedChar.themedExercises && selectedChar.themedExercises.length > 0) {
        setCurrentWorkout({
          name: `${selectedChar.name}'s Training Regimen`,
          exercises: selectedChar.themedExercises,
        });
      } else {
        setCurrentWorkout({
          name: "Today's Heroic Challenge",
          exercises: DEFAULT_WORKOUT_EXERCISES,
        });
      }

      const logForToday = dailyLogs[today] || getInitialLogState();
      setCurrentLog(logForToday);
      setCurrentDifficulty(logForToday.difficulty || 'normal');
      if (logForToday.workoutCompleted && logForToday.duration) {
        setWorkoutActive(false);
      }
    } else if (isClient && !userProfile) {
        // If no user profile, use default workout
        setCurrentWorkout({
          name: "Today's Heroic Challenge",
          exercises: DEFAULT_WORKOUT_EXERCISES,
        });
         const logForToday = dailyLogs[today] || getInitialLogState();
         setCurrentLog(logForToday);
         setCurrentDifficulty(logForToday.difficulty || 'normal');
    }
  }, [isClient, userProfile, today, dailyLogs, getInitialLogState]);

  const getExerciseDetails = (exercise: Exercise): IntensityConfig => {
    // Ensure exercise and exercise.intensity are defined
    if (!exercise || !exercise.intensity) {
        // Fallback to a default intensity or handle error
        // This might happen if an exercise ID in themedExercises is invalid
        console.error("Exercise or intensity not found:", exercise);
        return { reps: 0, sets: 0, duration: "0s", descriptionSuffix: "(Error loading details)"};
    }
    return exercise.intensity[currentDifficulty] || exercise.intensity.normal;
  };

  const handleStartWorkout = () => {
    if (currentLog.workoutCompleted) {
      toast({ title: "Workout Already Completed!", description: "You've already conquered today's challenge." });
      return;
    }
    setWorkoutStartTime(new Date());
    setWorkoutActive(true);
    // Reset completed exercises for the new session, but keep difficulty
    setCurrentLog(prev => ({ ...prev, completedExerciseIds: [], workoutCompleted: false, extraQuestCompleted: false, duration: undefined }));
    toast({ title: "Training Session Initiated!", description: "Let's get stronger, hero!" });
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    if (workoutActive || currentLog.workoutCompleted) {
      toast({ title: "Difficulty Locked", description: "Cannot change difficulty during or after a workout session.", variant: "destructive" });
      return;
    }
    setCurrentDifficulty(difficulty);
    setCurrentLog(prev => ({ ...prev, difficulty: difficulty, completedExerciseIds: [] })); // Reset progress on difficulty change before start
    toast({ title: "Difficulty Set!", description: `Training protocol adjusted to: ${difficultyButtonConfig[difficulty].text}` });
  };

  if (!isClient || !currentWorkout.exercises.length || !userProfile) { // Check userProfile here
    return (
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Dumbbell className="mr-2 h-7 w-7" />
            {currentWorkout?.name || "Today's Challenge"} - {new Date(today).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </CardTitle>
          <CardDescription className="text-muted-foreground">Loading workout details...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-6" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Separator className="my-6" />
          <ul className="space-y-4">
            {(currentWorkout?.exercises || []).map((_, index) => (
              <li key={index}>
                <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-6 rounded-sm" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-3 w-3/4 mt-1 pl-4" />
                {index < ((currentWorkout?.exercises.length || 0) - 1) && <Separator className="my-4" />}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full font-headline text-lg" disabled>
            { userProfile ? "Loading Workout..." : "Loading Profile..."}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleToggleExercise = (exerciseId: string) => {
    if (currentLog.workoutCompleted || !workoutActive) return;

    setCurrentLog(prevLog => {
      const newCompletedExerciseIds = prevLog.completedExerciseIds.includes(exerciseId)
        ? prevLog.completedExerciseIds.filter(id => id !== exerciseId)
        : [...prevLog.completedExerciseIds, exerciseId];
      return { ...prevLog, completedExerciseIds: newCompletedExerciseIds };
    });
  };

  const handleFinishWorkout = () => {
    if (!userProfile || !workoutStartTime) {
      toast({ title: "Error", description: "Workout not started or user profile not loaded.", variant: "destructive" });
      return;
    }
    if (currentLog.workoutCompleted) {
      toast({ title: "Already Completed!", description: "You've already logged this workout for today." });
      return;
    }

    const exercisesDoneCount = currentLog.completedExerciseIds.length;
    if (exercisesDoneCount === 0 && currentWorkout.exercises.length > 0) { // Ensure workout actually has exercises
      toast({ title: "No Exercises Logged", description: "Please complete at least one exercise.", variant: "destructive" });
      return;
    }

    const difficultyMultiplier = XP_DIFFICULTY_MULTIPLIERS[currentDifficulty];
    let xpEarned = (exercisesDoneCount * XP_PER_EXERCISE) * difficultyMultiplier;
    const allExercisesCompleted = currentLog.completedExerciseIds.length === currentWorkout.exercises.length;
    if (allExercisesCompleted && currentWorkout.exercises.length > 0) { // Add bonus only if there were exercises
      xpEarned += (XP_PER_WORKOUT_COMPLETION_BONUS * difficultyMultiplier);
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

    let newStreak = userProfile.currentStreak;
    const lastWorkoutString = userProfile.lastWorkoutDate;
    if (lastWorkoutString) {
      const lastWorkoutDate = new Date(lastWorkoutString + "T00:00:00Z"); // Assume UTC storage
      const todayDate = new Date(today + "T00:00:00Z"); // Compare with UTC today
      const diffTime = todayDate.getTime() - lastWorkoutDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) newStreak++;
      else if (diffDays > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const workoutEndTime = new Date();
    const durationMs = workoutEndTime.getTime() - workoutStartTime.getTime();
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
    const formattedDuration = `${durationMinutes}m ${durationSeconds}s`;

    const updatedProfile: UserProfile = {
      ...userProfile,
      experiencePoints: newExperiencePoints,
      level: newLevel,
      rewards: levelledUp ? [...userProfile.rewards, `Level ${newLevel} Achieved (${currentDifficulty})!`] : userProfile.rewards,
      currentStreak: newStreak,
      lastWorkoutDate: today,
    };
    setUserProfile(updatedProfile);

    const finalLog: DailyLog = { ...currentLog, workoutCompleted: true, duration: formattedDuration, difficulty: currentDifficulty, extraQuestCompleted: currentLog.extraQuestCompleted || false };
    setDailyLogs(prevLogs => ({ ...prevLogs, [today]: finalLog }));
    setCurrentLog(finalLog);
    setWorkoutActive(false);

    const selectedChar = CHARACTERS.find(c => c.id === updatedProfile.selectedCharacterId);
    setModalData({
      xpEarned,
      levelledUp,
      newLevel: levelledUp ? newLevel : undefined,
      characterName: selectedChar?.name,
      selectedCharacterImageUrl: selectedChar?.imageUrl || userProfile.customProfileImageUrl,
      workoutDuration: formattedDuration,
    });
    setShowCompletionModal(true);

    toast({
      title: "Workout Conquered!",
      description: `You earned ${xpEarned.toFixed(0)} XP. Total time: ${formattedDuration}. Keep it up!`,
    });
  };

  const handleExtraQuest = () => {
    if (!userProfile || !currentLog.workoutCompleted || currentLog.extraQuestCompleted) {
      toast({ title: "Not Eligible", description: "Complete your main workout first, or extra quest already done.", variant: "destructive" });
      return;
    }

    const bonusXp = XP_EXTRA_QUEST_BONUS * XP_DIFFICULTY_MULTIPLIERS[currentDifficulty];
    let newExperiencePoints = userProfile.experiencePoints + bonusXp;
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
      rewards: levelledUp ? [...userProfile.rewards, `Level ${newLevel} (Hyper-Quest Bonus!)`] : userProfile.rewards,
    };
    setUserProfile(updatedProfile);

    const finalLog: DailyLog = { ...currentLog, extraQuestCompleted: true };
    setDailyLogs(prevLogs => ({ ...prevLogs, [today]: finalLog }));
    setCurrentLog(finalLog);

    toast({
      title: "HYPER-QUEST COMPLETE!",
      description: `You've pushed beyond limits and earned an extra ${bonusXp.toFixed(0)} XP!`,
      duration: 5000,
    });
    if (levelledUp) {
      toast({
        title: "LEVEL UP!",
        description: `Your extra effort propelled you to Level ${newLevel}!`,
        duration: 5000,
      });
    }
  };

  const progressPercentage = currentWorkout.exercises.length > 0 ? (currentLog.completedExerciseIds.length / currentWorkout.exercises.length) * 100 : 0;

  return (
    <>
      <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Dumbbell className="mr-2 h-7 w-7" />
            {currentWorkout.name} - {new Date(today).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Select your intensity, then begin your training. Every rep brings you closer to your hero form!
            {currentLog.workoutCompleted && currentLog.duration && <span className="block mt-1 font-semibold text-accent">Today's session lasted: {currentLog.duration}</span>}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!currentLog.workoutCompleted && !workoutActive && (
            <div className="mb-6 p-4 border border-dashed border-primary rounded-lg bg-primary/5">
              <Label className="text-lg font-semibold text-primary mb-3 block text-center">Choose Your Battle Intensity!</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(Object.keys(difficultyButtonConfig) as DifficultyLevel[]).map(diff => {
                  const config = difficultyButtonConfig[diff];
                  return (
                    <Button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff)}
                      variant={currentDifficulty === diff ? config.variant : "ghost"}
                      className={cn("w-full font-headline", currentDifficulty === diff && "ring-2 ring-offset-2 ring-accent")}
                      disabled={workoutActive || currentLog.workoutCompleted}
                    >
                      <config.icon className={cn("mr-2 h-5 w-5", currentDifficulty === diff ? "text-accent-foreground" : "text-primary")} />
                      {config.text}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {!workoutActive && !currentLog.workoutCompleted && (
            <Button
              onClick={handleStartWorkout}
              size="lg"
              className="w-full font-headline text-lg animate-pulse bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90"
              disabled={currentWorkout.exercises.length === 0} // Disable if no exercises loaded
            >
              <Zap className="mr-2 h-6 w-6" /> {currentWorkout.exercises.length > 0 ? "LAUNCH TRAINING SESSION!" : "Select Character First"}
            </Button>
          )}

          {workoutActive && !currentLog.workoutCompleted && (
            <div className="text-center text-accent font-semibold text-lg animate-pulse">
              <Clock className="inline mr-2 h-5 w-5" /> Training Session Active... Timer Running!
            </div>
          )}


          {(workoutActive || currentLog.workoutCompleted) && currentWorkout.exercises.length > 0 && (
            <>
              <div>
                <Label className="text-sm font-medium text-foreground/80">Progress: {currentLog.completedExerciseIds.length} / {currentWorkout.exercises.length} exercises ({currentDifficultyButtonConfig[currentDifficulty].text})</Label>
                <Progress value={progressPercentage} className="w-full h-3 mt-1 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
              </div>
              <ul className="space-y-4">
                {currentWorkout.exercises.map((exercise, index) => {
                  const details = getExerciseDetails(exercise);
                  return (
                    <li key={exercise.id}>
                      <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`exercise-${exercise.id}`}
                            checked={currentLog.completedExerciseIds.includes(exercise.id)}
                            onCheckedChange={() => handleToggleExercise(exercise.id)}
                            disabled={currentLog.workoutCompleted || !workoutActive}
                            aria-label={`Mark ${exercise.name} as complete`}
                          />
                          <Label htmlFor={`exercise-${exercise.id}`} className="text-lg font-medium text-foreground cursor-pointer">
                            {exercise.name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {details.sets && details.reps && `${details.sets} sets x ${details.reps} reps`}
                            {details.duration && `${details.duration}`}
                          </span>
                          <Button variant="ghost" size="icon" onClick={() => setHelpExercise(exercise)} aria-label={`Help for ${exercise.name}`}>
                            <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-4">
                        {exercise.description} {details.descriptionSuffix && <span className="italic">{details.descriptionSuffix}</span>}
                      </p>
                      {index < currentWorkout.exercises.length - 1 && <Separator className="my-4" />}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
           {(workoutActive || currentLog.workoutCompleted) && currentWorkout.exercises.length === 0 && (
            <p className="text-center text-muted-foreground">No exercises defined for the current selection. Please select a character with a workout plan or check the default plan.</p>
           )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!currentLog.workoutCompleted && workoutActive && currentWorkout.exercises.length > 0 && (
            <Button
              onClick={handleFinishWorkout}
              disabled={!userProfile || (currentLog.completedExerciseIds.length === 0 && currentWorkout.exercises.length > 0)}
              size="lg"
              className="w-full font-headline text-lg"
            >
              <Sparkles className="mr-2 h-5 w-5" /> Finish & Log Power Session!
            </Button>
          )}

          {currentLog.workoutCompleted && (
            <div className="w-full text-center p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-md">
              <CheckCircle2 className="mr-2 h-6 w-6 inline text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-700 dark:text-green-300">Workout Completed Today! Awesome job!</span>
              {currentLog.duration && <p className="text-sm text-muted-foreground">Total Time: {currentLog.duration}</p>}
            </div>
          )}

          {currentLog.workoutCompleted && !currentLog.extraQuestCompleted && currentWorkout.exercises.length > 0 && (
            <Button
              onClick={handleExtraQuest}
              size="lg"
              variant="destructive"
              className="w-full font-headline text-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:opacity-90 animate-pulse"
              disabled={!userProfile || currentLog.extraQuestCompleted}
            >
              <ChevronsUp className="mr-2 h-6 w-6" /> UNLOCK HYPER-QUEST! (+{(XP_EXTRA_QUEST_BONUS * XP_DIFFICULTY_MULTIPLIERS[currentDifficulty]).toFixed(0)} XP)
            </Button>
          )}
          {currentLog.workoutCompleted && currentLog.extraQuestCompleted && (
            <div className="w-full text-center p-3 bg-purple-100 dark:bg-purple-900/30 border border-purple-500 rounded-md">
              <Zap className="mr-2 h-5 w-5 inline text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-700 dark:text-purple-300">Hyper-Quest Conquered! You're a legend!</span>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={!!helpExercise} onOpenChange={(isOpen) => { if (!isOpen) setHelpExercise(null); }}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-primary">{helpExercise?.name}</DialogTitle>
          </DialogHeader>
          {helpExercise && (
            <div className="py-4 space-y-4">
              <p className="text-sm text-foreground">{helpExercise.description} {getExerciseDetails(helpExercise)?.descriptionSuffix}</p>
              {(getExerciseDetails(helpExercise)?.sets && getExerciseDetails(helpExercise)?.reps) &&
                <p className="text-sm text-muted-foreground">Recommended ({currentDifficulty}): {getExerciseDetails(helpExercise).sets} sets of {getExerciseDetails(helpExercise).reps} reps.</p>
              }
              {getExerciseDetails(helpExercise)?.duration &&
                <p className="text-sm text-muted-foreground">Recommended duration ({currentDifficulty}): {getExerciseDetails(helpExercise).duration}.</p>
              }
              {helpExercise.videoTutorialUrl && (
                <div className="aspect-video w-full">
                  <iframe
                    src={helpExercise.videoTutorialUrl}
                    title={`${helpExercise.name} Tutorial`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <WorkoutCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        characterName={modalData.characterName}
        xpEarned={modalData.xpEarned}
        levelledUp={modalData.levelledUp}
        newLevel={modalData.newLevel}
        selectedCharacterImageUrl={modalData.selectedCharacterImageUrl}
        workoutDuration={modalData.workoutDuration}
      />
    </>
  );
}
