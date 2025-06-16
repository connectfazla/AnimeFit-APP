
export interface AnimeCharacter {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint: string;
  description: string;
  powerLevel: number;
  themedExercises?: Exercise[]; // Added for character-specific workouts
}

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export interface IntensityConfig {
  reps?: number;
  sets?: number;
  duration?: string;
  descriptionSuffix?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoTutorialUrl?: string;
  intensity: {
    easy: IntensityConfig;
    normal: IntensityConfig;
    hard: IntensityConfig;
  };
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface UserProfile {
  id: string;
  name: string;
  selectedCharacterId: string | null;
  customProfileImageUrl?: string | null;
  level: number;
  experiencePoints: number;
  workoutDays: string[];
  rewards: string[];
  reminderTime: string | null;
  currentStreak: number;
  lastWorkoutDate: string | null; // YYYY-MM-DD
  lastReminderDismissedDate?: string | null; // YYYY-MM-DD, to prevent multiple reminders per day
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedExerciseIds: string[];
  workoutCompleted: boolean;
  difficulty?: DifficultyLevel;
  duration?: string;
  extraQuestCompleted?: boolean;
}
