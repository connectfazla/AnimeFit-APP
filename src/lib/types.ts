export interface AnimeCharacter {
  id: string;
  name: string;
  imageUrl: string;
  dataAiHint: string;
  description: string;
  powerLevel: number; 
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  reps?: number;
  sets?: number;
  duration?: string; 
  videoTutorialUrl?: string; // Added for video tutorials
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface UserProfile {
  id: string; // Keep id for potential future backend integration
  name: string;
  selectedCharacterId: string | null;
  level: number;
  experiencePoints: number;
  workoutDays: string[]; 
  rewards: string[]; 
  reminderTime: string | null; 
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedExerciseIds: string[]; 
  workoutCompleted: boolean;
}
