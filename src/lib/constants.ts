
import type { AnimeCharacter, Exercise, Workout, UserProfile, DifficultyLevel, IntensityConfig } from './types';

export const APP_NAME = "AnimeFit";
export const APP_LOGO_URL = "https://uppearance.com/wp-content/uploads/2025/06/ANIME-FIT-1.png";


export const CHARACTERS: AnimeCharacter[] = [
  { id: 'goku', name: 'Son Goku', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/1.png', dataAiHint: 'anime warrior', description: 'A powerful Saiyan warrior from Earth.', powerLevel: 9001 },
  { id: 'naruto', name: 'Naruto Uzumaki', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/2.png', dataAiHint: 'anime ninja', description: 'The unpredictable knucklehead ninja of Konoha.', powerLevel: 7000 },
  { id: 'luffy', name: 'Monkey D. Luffy', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/3.png', dataAiHint: 'anime pirate', description: 'Captain of the Straw Hat Pirates, aiming to be Pirate King.', powerLevel: 8000 },
  { id: 'saitama', name: 'Saitama', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/4.png', dataAiHint: 'anime hero', description: 'A hero for fun, capable of defeating any enemy with a single punch.', powerLevel: 99999 },
  { id: 'nezuko', name: 'Nezuko Kamado', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/5.png', dataAiHint: 'anime demon', description: 'A kind girl turned demon, fighting alongside her brother.', powerLevel: 6500 },
  { id: 'levi', name: 'Levi Ackerman', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/5.png', dataAiHint: 'anime soldier', description: "Humanity's strongest soldier in the fight against Titans.", powerLevel: 8500 },
];

const createExerciseIntensity = (normal: IntensityConfig, easyMultiplier: number = 0.7, hardMultiplier: number = 1.3): { easy: IntensityConfig, normal: IntensityConfig, hard: IntensityConfig } => {
  const applyMultiplier = (value: number | undefined, multiplier: number): number | undefined => {
    return value ? Math.max(1, Math.round(value * multiplier)) : undefined;
  };
  
  const applyDurationMultiplier = (durationStr: string | undefined, multiplier: number): string | undefined => {
    if (!durationStr || !durationStr.endsWith('s')) return durationStr;
    const seconds = parseInt(durationStr.slice(0, -1));
    if (isNaN(seconds)) return durationStr;
    return `${Math.max(10, Math.round(seconds * multiplier))}s`; // Ensure minimum 10s
  };

  return {
    easy: {
      reps: applyMultiplier(normal.reps, easyMultiplier),
      sets: applyMultiplier(normal.sets, easyMultiplier) || normal.sets, // if sets are few, keep them same for easy
      duration: applyDurationMultiplier(normal.duration, easyMultiplier),
      descriptionSuffix: normal.reps || normal.duration ? "(Focus on form)" : "",
    },
    normal: normal,
    hard: {
      reps: applyMultiplier(normal.reps, hardMultiplier),
      sets: applyMultiplier(normal.sets, hardMultiplier) || normal.sets, // if sets are few, hard might increase them slightly or keep
      duration: applyDurationMultiplier(normal.duration, hardMultiplier),
      descriptionSuffix: normal.reps || normal.duration ? "(Max Power!)" : "",
    }
  };
};

export const EXERCISES: Exercise[] = [
  { 
    id: 'pushups', name: 'Saiyan Push-ups', 
    description: 'Explosive push-ups to build upper body strength.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    intensity: createExerciseIntensity({ sets: 3, reps: 15 })
  },
  { 
    id: 'squats', name: 'Ninja Squats', 
    description: 'Deep squats for leg power and agility.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/aclHkVg7PL8',
    intensity: createExerciseIntensity({ sets: 3, reps: 20 })
  },
  { 
    id: 'plank', name: 'Titan Plank', 
    description: 'Hold a rock-solid plank like a true defender.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    intensity: createExerciseIntensity({ duration: "60s" }, 0.75, 1.5) // Custom multipliers for plank
  },
  { 
    id: 'jumpingjacks', name: 'Flash Step Jacks', 
    description: 'Rapid jumping jacks for speed and endurance.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    intensity: createExerciseIntensity({ duration: "120s" })
  },
  { 
    id: 'burpees', name: 'One-Punch Burpees', 
    description: 'Full-body explosive movement.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/auKl9A2iWcE',
    intensity: createExerciseIntensity({ sets: 3, reps: 10 })
  },
  { 
    id: 'running', name: 'Gear Second Run', 
    description: 'High-intensity interval running or focus on proper form.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/wRkeBVMQSgg',
    intensity: createExerciseIntensity({ duration: "300s" }, 0.6, 1.2) // Different multipliers for running
  },
];

export const MAIN_WORKOUT_ID = 'daily_challenge';

export const WORKOUTS: Workout[] = [
  { id: MAIN_WORKOUT_ID, name: "Today's Heroic Challenge", exercises: EXERCISES },
];

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DEFAULT_USER_PROFILE_ID = "currentUser";

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: DEFAULT_USER_PROFILE_ID,
  name: "Anime Athlete",
  selectedCharacterId: null,
  customProfileImageUrl: null,
  level: 1,
  experiencePoints: 0,
  workoutDays: ["Monday", "Wednesday", "Friday"],
  rewards: ["First Step Badge"],
  reminderTime: "08:00",
  currentStreak: 0,
  lastWorkoutDate: null,
};

export const XP_PER_EXERCISE = 10;
export const XP_PER_WORKOUT_COMPLETION_BONUS = 50; // Bonus for completing ALL exercises in the workout
export const XP_EXTRA_QUEST_BONUS = 75;

export const XP_DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  easy: 0.75,
  normal: 1.0,
  hard: 1.25,
};

export const getXpToNextLevel = (level: number): number => {
  return 100 * Math.pow(1.2, level -1);
};
