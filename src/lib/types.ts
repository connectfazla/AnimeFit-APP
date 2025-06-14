
export interface AnimeCharacter {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint: string;
  description: string;
  powerLevel: number;
  // Optional: Future enhancement for character-specific difficulty names
  // difficultyModeNames?: {
  //   easyButtonText: string;
  //   normalButtonText: string;
  //   hardButtonText: string;
  //   extraQuestButtonText: string;
  //   currentDifficultyText: (difficulty: 'easy' | 'normal' | 'hard', characterName: string) => string;
  // };
}

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export interface IntensityConfig {
  reps?: number;
  sets?: number;
  duration?: string;
  descriptionSuffix?: string; // e.g., "(Focus on form)" or "(Max intensity!)"
}

export interface Exercise {
  id: string;
  name: string;
  description: string; // Base description
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
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedExerciseIds: string[];
  workoutCompleted: boolean;
  difficulty?: DifficultyLevel; // Store difficulty for the completed log
  duration?: string; // Store workout duration
  extraQuestCompleted?: boolean;
}
