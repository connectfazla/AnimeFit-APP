
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
    return `${Math.max(60, Math.round(seconds * multiplier))}s`; 
  };

  return {
    easy: {
      reps: applyMultiplier(normal.reps, easyMultiplier),
      sets: normal.sets ? Math.max(1, Math.round(normal.sets * easyMultiplier)) : normal.sets,
      duration: applyDurationMultiplier(normal.duration, easyMultiplier),
      descriptionSuffix: normal.reps || normal.duration ? "(Focus on form and control)" : "",
    },
    normal: normal,
    hard: {
      reps: applyMultiplier(normal.reps, hardMultiplier),
      sets: normal.sets ? Math.max(1, Math.round(normal.sets * hardMultiplier)) : normal.sets,
      duration: applyDurationMultiplier(normal.duration, hardMultiplier),
      descriptionSuffix: normal.reps || normal.duration ? "(Push your limits!)" : "",
    }
  };
};

export const EXERCISES: Exercise[] = [
  { 
    id: 'benchpress', name: 'Herculean Bench Press', 
    description: 'Forge a chest of steel with this classic compound lift using a barbell.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/SCVCLChPQFY', 
    intensity: createExerciseIntensity({ sets: 3, reps: 8 }) 
  },
  { 
    id: 'barbellrows', name: 'Dragon Back Rows', 
    description: 'Sculpt a powerful back worthy of a mythical beast with barbell rows.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/G8l_8chR5BE', 
    intensity: createExerciseIntensity({ sets: 3, reps: 10 }) 
  },
  { 
    id: 'overheadpress', name: 'Celestial Shoulder Press', 
    description: 'Raise your power level with this shoulder-defining press (dumbbells or barbell).', 
    videoTutorialUrl: 'https://www.youtube.com/embed/B-aVuyhvLHU', 
    intensity: createExerciseIntensity({ sets: 3, reps: 10 }) 
  },
  { 
    id: 'barbellsquats', name: 'Colossal Titan Squats', 
    description: 'Build legs that can withstand any onslaught with heavy barbell squats.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/Uv_DKDl7EjA', 
    intensity: createExerciseIntensity({ sets: 3, reps: 8 }) 
  },
  { 
    id: 'deadlifts', name: 'Earthshaker Deadlifts', 
    description: 'Channel the planet\'s might with this ultimate test of strength (conventional deadlift).', 
    videoTutorialUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE', 
    intensity: createExerciseIntensity({ sets: 1, reps: 5 }) 
  },
  { 
    id: 'stationarybike', name: 'Infinite Stamina Cycle', 
    description: 'Boost your endurance with high-intensity intervals or a steady state ride on a stationary bike.', 
    videoTutorialUrl: 'https://www.youtube.com/embed/Xm13J4u6MhQ', 
    intensity: createExerciseIntensity({ duration: "900s" }, 0.66, 1.33) 
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
  lastReminderDismissedDate: null,
};

export const XP_PER_EXERCISE = 10;
export const XP_PER_WORKOUT_COMPLETION_BONUS = 50; 
export const XP_EXTRA_QUEST_BONUS = 75;

export const XP_DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  easy: 0.75,
  normal: 1.0,
  hard: 1.25,
};

export const getXpToNextLevel = (level: number): number => {
  return 100 * Math.pow(1.2, level -1);
};
