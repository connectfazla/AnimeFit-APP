
'use client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
  updateProfile as updateUserProfileName,
} from 'firebase/auth';
import { auth } from './config';
import type { UserProfile } from '@/lib/types';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_PROFILE_ID } from '@/lib/constants';

export type { FirebaseUser };

const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string, name: string): Promise<FirebaseUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateUserProfileName(userCredential.user, { displayName: name });
  
  // Create and save user profile to local storage
  const newUserProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    id: userCredential.user.uid,
    name: name || userCredential.user.displayName || "Anime Hero",
    selectedCharacterId: DEFAULT_USER_PROFILE.selectedCharacterId, // Or null
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`userProfile-${userCredential.user.uid}`, JSON.stringify(newUserProfile));
    localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(newUserProfile));
  }
  
  return userCredential.user;
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await loadAndActivateUserProfile(userCredential.user);
  return userCredential.user;
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Check if a profile exists for this Google user, if not, create one
  if (typeof window !== 'undefined') {
    let userProfile = JSON.parse(localStorage.getItem(`userProfile-${user.uid}`) || 'null') as UserProfile | null;
    if (!userProfile) {
      userProfile = {
        ...DEFAULT_USER_PROFILE,
        id: user.uid,
        name: user.displayName || "Anime Hero",
        selectedCharacterId: DEFAULT_USER_PROFILE.selectedCharacterId, // Or null
      };
      localStorage.setItem(`userProfile-${user.uid}`, JSON.stringify(userProfile));
    }
    // Activate this profile
    localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(userProfile));
  }
  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  if (typeof window !== 'undefined') {
    // Option 1: Clear the active profile
    localStorage.removeItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`);
    // Option 2: Reset to default guest profile (if you have one)
    // localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(DEFAULT_USER_PROFILE_GUEST_STATE_IF_ANY));
  }
}

export function onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  return firebaseOnAuthStateChanged(auth, callback);
}

// Helper to load user-specific profile and set it as active
async function loadAndActivateUserProfile(user: FirebaseUser) {
  if (typeof window !== 'undefined') {
    let userProfile = JSON.parse(localStorage.getItem(`userProfile-${user.uid}`) || 'null') as UserProfile | null;
    
    if (!userProfile) {
      // If no specific profile, create a default one for this UID
      userProfile = {
        ...DEFAULT_USER_PROFILE,
        id: user.uid,
        name: user.displayName || "Anime Hero", // Use Firebase display name if available
      };
      localStorage.setItem(`userProfile-${user.uid}`, JSON.stringify(userProfile));
    }
    // Set this loaded/created profile as the active one
    localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(userProfile));
  }
}
