
import type { AnimeCharacter, Exercise, Workout, UserProfile, DifficultyLevel, IntensityConfig } from './types';

export const APP_NAME = "AnimeFit";
export const APP_LOGO_URL = "https://uppearance.com/wp-content/uploads/2025/06/ANIME-FIT-1.png";

// Helper function for creating intensity levels for exercises
const createExerciseIntensity = (
  normal: IntensityConfig,
  easyMultiplier: number = 0.5, // Made easy mode significantly easier
  hardMultiplier: number = 1.2, // Slightly increased hard mode
  minRepsSets: number = 1,
  minDurationSeconds: number = 30
): { easy: IntensityConfig, normal: IntensityConfig, hard: IntensityConfig } => {
  const applyMultiplier = (value: number | undefined, multiplier: number, minValue: number): number | undefined => {
    return value ? Math.max(minValue, Math.round(value * multiplier)) : undefined;
  };

  const applyDurationMultiplier = (durationStr: string | undefined, multiplier: number, minSeconds: number): string | undefined => {
    if (!durationStr || !durationStr.endsWith('s')) return durationStr;
    const seconds = parseInt(durationStr.slice(0, -1));
    if (isNaN(seconds)) return durationStr;
    return `${Math.max(minSeconds, Math.round(seconds * multiplier))}s`;
  };

  return {
    easy: {
      reps: applyMultiplier(normal.reps, easyMultiplier, minRepsSets),
      sets: applyMultiplier(normal.sets, easyMultiplier, minRepsSets),
      duration: applyDurationMultiplier(normal.duration, easyMultiplier, minDurationSeconds),
      descriptionSuffix: normal.reps || normal.duration ? "(Lighter routine, focus on consistency)" : " (Gentle pace)",
    },
    normal: {
      ...normal,
      descriptionSuffix: normal.descriptionSuffix || "(Standard challenge, unleash your potential!)",
    },
    hard: {
      reps: applyMultiplier(normal.reps, hardMultiplier, minRepsSets),
      sets: applyMultiplier(normal.sets, hardMultiplier, minRepsSets),
      duration: applyDurationMultiplier(normal.duration, hardMultiplier, minDurationSeconds),
      descriptionSuffix: normal.reps || normal.duration ? "(Maximum effort, break your limits!)" : " (Peak intensity!)",
    }
  };
};

// Define all available exercises here
export const ALL_EXERCISES: Exercise[] = [
  {
    id: 'benchpress', name: 'Herculean Bench Press',
    description: 'Lie on a bench, lower the barbell to your chest, and press it back up. Builds chest, shoulders, and triceps power.',
    videoTutorialUrl: 'https://www.youtube.com/embed/SCVCLChPQFY',
    intensity: createExerciseIntensity({ sets: 3, reps: 8, descriptionSuffix: "(Compound chest builder)" })
  },
  {
    id: 'barbellrows', name: 'Dragon Back Rows',
    description: 'Hinge at your hips with a slight bend in your knees, keep your back straight, and pull the barbell towards your lower chest. Develops a strong, wide back.',
    videoTutorialUrl: 'https://www.youtube.com/embed/G8l_8chR5BE',
    intensity: createExerciseIntensity({ sets: 3, reps: 10, descriptionSuffix: "(Strengthens entire back)" })
  },
  {
    id: 'overheadpress', name: 'Celestial Shoulder Press',
    description: 'Stand or sit, and press dumbbells or a barbell overhead until your arms are straight. Forges powerful, rounded shoulders.',
    videoTutorialUrl: 'https://www.youtube.com/embed/B-aVuyhvLHU',
    intensity: createExerciseIntensity({ sets: 3, reps: 10, descriptionSuffix: "(For strong, defined shoulders)" })
  },
  {
    id: 'barbellsquats', name: 'Colossal Titan Squats',
    description: 'With a barbell on your upper back, feet shoulder-width apart, squat down as if sitting in a chair, keeping your chest up and back straight. The king of leg exercises.',
    videoTutorialUrl: 'https://www.youtube.com/embed/Uv_DKDl7EjA',
    intensity: createExerciseIntensity({ sets: 3, reps: 8, descriptionSuffix: "(Full body power and leg strength)" })
  },
  {
    id: 'deadlifts', name: 'Earthshaker Deadlifts',
    description: 'Stand with feet hip-width apart, barbell over midfoot. Hinge at hips and knees to grip the bar. Lift by driving through heels, extending hips and knees, keeping a flat back. A true test of total body strength.',
    videoTutorialUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
    intensity: createExerciseIntensity({ sets: 1, reps: 5, descriptionSuffix: "(Ultimate strength builder - focus on perfect form!)" })
  },
  {
    id: 'stationarybike', name: 'Infinite Stamina Cycle',
    description: 'Boost your cardiovascular endurance and leg stamina. Ride a stationary bike, varying your pace for intervals or maintaining a steady effort.',
    videoTutorialUrl: 'https://www.youtube.com/embed/Xm13J4u6MhQ',
    intensity: createExerciseIntensity({ duration: "900s", descriptionSuffix: "(Great for cardio and endurance)" }, 0.66, 1.33, 1, 300) // Min 5 min for easy
  },
  {
    id: 'pushups', name: 'Hundred Push-ups (Endurance)',
    description: 'Perform as many push-ups as you can with good form. A fundamental bodyweight exercise for upper body strength.',
    videoTutorialUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    intensity: createExerciseIntensity({ reps: 100, sets: 1, descriptionSuffix: "(Target: 100 reps, break into sets if needed)" }, 0.2, 1.0) // Easy: 20, Normal: 100
  },
  {
    id: 'situps', name: 'Hundred Sit-ups (Core)',
    description: 'Lie on your back, knees bent, and lift your upper body towards your knees. Strengthens your core.',
    videoTutorialUrl: 'https://www.youtube.com/embed/1fbU_MkV7NE',
    intensity: createExerciseIntensity({ reps: 100, sets: 1, descriptionSuffix: "(Target: 100 reps, focus on control)" }, 0.2, 1.0) // Easy: 20, Normal: 100
  },
  {
    id: 'squats_bodyweight', name: 'Hundred Squats (Leg Power)',
    description: 'Perform bodyweight squats, focusing on depth and form. Builds leg strength and endurance.',
    videoTutorialUrl: 'https://www.youtube.com/embed/aclHkVgCgso',
    intensity: createExerciseIntensity({ reps: 100, sets: 1, descriptionSuffix: "(Target: 100 reps, proper form is key)" }, 0.2, 1.0) // Easy: 20, Normal: 100
  },
  {
    id: 'running', name: 'Ten Kilometer Run (Stamina)',
    description: 'Run or jog for an extended distance. Simulates a 10k run for peak endurance. (Use treadmill, stationary bike, or jumping jacks for equivalent time).',
    videoTutorialUrl: 'https://www.youtube.com/embed/uVq3h3kIjXI', // General running form
    intensity: createExerciseIntensity({ duration: "3600s", descriptionSuffix: "(Equivalent to 10km, adapt to your fitness level)" }, 0.16, 1.0, 1, 600) // Easy: 10 min, Normal: 60 min
  },
  {
    id: 'shadow_boxing', name: 'Consecutive Normal Punches',
    description: 'Practice rapid punches in the air, focusing on speed and form, like Saitama.',
    videoTutorialUrl: 'https://www.youtube.com/embed/yq9NlCP0sNA',
    intensity: createExerciseIntensity({ duration: "300s", descriptionSuffix: "(Fast-paced shadow boxing)" }, 0.5, 1.2, 1, 60) // Easy: 2.5 min, Normal: 5 min
  }
];

// Character definitions with their themed workouts
export const CHARACTERS: AnimeCharacter[] = [
  {
    id: 'goku', name: 'Son Goku', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/1.png', dataAiHint: 'anime warrior', description: 'A powerful Saiyan warrior from Earth.', powerLevel: 9001,
    themedExercises: [
      ALL_EXERCISES.find(e => e.id === 'barbellsquats')!, // Colossal Titan Squats
      ALL_EXERCISES.find(e => e.id === 'benchpress')!, // Herculean Bench Press
      ALL_EXERCISES.find(e => e.id === 'overheadpress')!, // Celestial Shoulder Press
      ALL_EXERCISES.find(e => e.id === 'running')!, // For stamina
    ]
  },
  {
    id: 'naruto', name: 'Naruto Uzumaki', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/2.png', dataAiHint: 'anime ninja', description: 'The unpredictable knucklehead ninja of Konoha.', powerLevel: 7000,
    themedExercises: [
      ALL_EXERCISES.find(e => e.id === 'running')!, // Lots of running
      ALL_EXERCISES.find(e => e.id === 'pushups')!, // Bodyweight strength
      ALL_EXERCISES.find(e => e.id === 'situps')!, // Core strength
      ALL_EXERCISES.find(e => e.id === 'squats_bodyweight')!, // Agility and leg power
    ]
  },
  {
    id: 'luffy', name: 'Monkey D. Luffy', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/3.png', dataAiHint: 'anime pirate', description: 'Captain of the Straw Hat Pirates, aiming to be Pirate King.', powerLevel: 8000,
    // Default exercises for now, can be customized
  },
  {
    id: 'saitama', name: 'Saitama', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/4.png', dataAiHint: 'anime hero', description: 'A hero for fun, capable of defeating any enemy with a single punch.', powerLevel: 99999,
    themedExercises: [
      ALL_EXERCISES.find(e => e.id === 'pushups')!,
      ALL_EXERCISES.find(e => e.id === 'situps')!,
      ALL_EXERCISES.find(e => e.id === 'squats_bodyweight')!,
      ALL_EXERCISES.find(e => e.id === 'running')!, // 10km run simulation
      // Optional: ALL_EXERCISES.find(e => e.id === 'shadow_boxing')!,
    ]
  },
  {
    id: 'nezuko', name: 'Nezuko Kamado', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/5.png', dataAiHint: 'anime demon', description: 'A kind girl turned demon, fighting alongside her brother.', powerLevel: 6500,
    // Default exercises for now
  },
  {
    id: 'levi', name: 'Levi Ackerman', imageUrl: 'https://uppearance.com/wp-content/uploads/2025/06/5.png', dataAiHint: 'anime soldier', description: "Humanity's strongest soldier in the fight against Titans.", powerLevel: 8500,
    themedExercises: [
        ALL_EXERCISES.find(e => e.id === 'barbellrows')!, // For back strength (ODM gear)
        ALL_EXERCISES.find(e => e.id === 'overheadpress')!, // Shoulder strength
        ALL_EXERCISES.find(e => e.id === 'situps')!, // Core for maneuverability
        ALL_EXERCISES.find(e => e.id === 'stationarybike')!, // Endurance training
    ]
  },
];

export const MAIN_WORKOUT_ID = 'daily_challenge';
// Default workout if no character is selected or character has no themed exercises
export const DEFAULT_WORKOUT_EXERCISES: Exercise[] = [
  ALL_EXERCISES.find(e => e.id === 'benchpress')!,
  ALL_EXERCISES.find(e => e.id === 'barbellrows')!,
  ALL_EXERCISES.find(e => e.id === 'barbellsquats')!,
  ALL_EXERCISES.find(e => e.id === 'stationarybike')!,
];

export const WORKOUTS: Workout[] = [
  { id: MAIN_WORKOUT_ID, name: "Today's Heroic Challenge", exercises: DEFAULT_WORKOUT_EXERCISES },
];

export const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DEFAULT_USER_PROFILE_ID = "currentUser"; // This key is often used for the *active* profile

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: DEFAULT_USER_PROFILE_ID, // This ID might be overridden by actual user UID
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
  return 100 * Math.pow(1.2, level - 1);
};
