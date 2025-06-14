
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
  videoTutorialUrl?: string;
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
  customProfileImageUrl?: string | null; // Added for custom user profile image
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
