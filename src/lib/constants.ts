
import type { AnimeCharacter, Exercise, Workout, UserProfile } from './types';

export const APP_NAME = "AnimeFit";
export const APP_LOGO_URL = "https://uppearance.com/wp-content/uploads/2025/06/ANIME-FIT-1.png";


export const CHARACTERS: AnimeCharacter[] = [
  { id: 'goku', name: 'Son Goku', imageUrl: 'https://static.wikia.nocookie.net/dragonball/images/3/30/Goku_au_Galactic_Patrol.png/revision/latest', dataAiHint: 'anime warrior', description: 'A powerful Saiyan warrior from Earth.', powerLevel: 9001 },
  { id: 'naruto', name: 'Naruto Uzumaki', imageUrl: 'https://static.wikia.nocookie.net/naruto/images/7/7d/Naruto_Uzumaki_%28Part_II_-_Manual_de_Taijutsu%29.png/revision/latest', dataAiHint: 'anime ninja', description: 'The unpredictable knucklehead ninja of Konoha.', powerLevel: 7000 },
  { id: 'luffy', name: 'Monkey D. Luffy', imageUrl: 'https://static.wikia.nocookie.net/onepiece/images/a/af/Monkey_D._Luffy_Anime_Post_Timeskip_Infobox.png/revision/latest', dataAiHint: 'anime pirate', description: 'Captain of the Straw Hat Pirates, aiming to be Pirate King.', powerLevel: 8000 },
  { id: 'saitama', name: 'Saitama', imageUrl: 'https://static.wikia.nocookie.net/onepunchman/images/7/7d/Saitama_serious_profile.png/revision/latest', dataAiHint: 'anime hero', description: 'A hero for fun, capable of defeating any enemy with a single punch.', powerLevel: 99999 },
  { id: 'nezuko', name: 'Nezuko Kamado', imageUrl: 'https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/4/4c/Nezuko_Kamado_Anime_Profile.png/revision/latest', dataAiHint: 'anime demon', description: 'A kind girl turned demon, fighting alongside her brother.', powerLevel: 6500 },
  { id: 'levi', name: 'Levi Ackerman', imageUrl: 'https://static.wikia.nocookie.net/shingekinokyojin/images/b/b1/Levi_Ackermann_%28Anime%29_character_image.png/revision/latest', dataAiHint: 'anime soldier', description: "Humanity's strongest soldier in the fight against Titans.", powerLevel: 8500 },
];

export const EXERCISES: Exercise[] = [
  { id: 'pushups', name: 'Saiyan Push-ups', description: 'Explosive push-ups to build upper body strength.', sets: 3, reps: 15, videoTutorialUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },
  { id: 'squats', name: 'Ninja Squats', description: 'Deep squats for leg power and agility.', sets: 3, reps: 20, videoTutorialUrl: 'https://www.youtube.com/embed/aclHkVg7PL8' },
  { id: 'plank', name: 'Titan Plank', description: 'Hold a rock-solid plank like a true defender.', duration: "60s", videoTutorialUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
  { id: 'jumpingjacks', name: 'Flash Step Jacks', description: 'Rapid jumping jacks for speed and endurance.', duration: "120s", videoTutorialUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8' },
  { id: 'burpees', name: 'One-Punch Burpees', description: 'Full-body explosive movement.', sets: 3, reps: 10, videoTutorialUrl: 'https://www.youtube.com/embed/auKl9A2iWcE' },
  { id: 'running', name: 'Gear Second Run', description: 'High-intensity interval running or focus on proper form.', duration: "300s", videoTutorialUrl: 'https://www.youtube.com/embed/wRkeBVMQSgg' },
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
  customProfileImageUrl: null, // Initialize new field
  level: 1,
  experiencePoints: 0,
  workoutDays: ["Monday", "Wednesday", "Friday"],
  rewards: ["First Step Badge"],
  reminderTime: "08:00",
};

export const XP_PER_EXERCISE = 10;
export const XP_PER_WORKOUT_COMPLETION_BONUS = 50;

export const getXpToNextLevel = (level: number): number => {
  return 100 * Math.pow(1.2, level -1);
};
