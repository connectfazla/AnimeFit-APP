
'use client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
  updateProfile as firebaseUpdateProfile, // Renamed to avoid conflict
} from 'firebase/auth';
import { auth } from './config';
import type { UserProfile } from '@/lib/types';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_PROFILE_ID } from '@/lib/constants';

export type { FirebaseUser };

const googleProvider = new GoogleAuthProvider();

// Renamed from updateUserProfileName to avoid conflict with the new custom field
export async function updateUserProfileFirebase(user: FirebaseUser, profileData: { displayName?: string | null; photoURL?: string | null; }): Promise<void> {
  await firebaseUpdateProfile(user, profileData);
}


export async function signUpWithEmail(email: string, password: string, name: string): Promise<FirebaseUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await firebaseUpdateProfile(userCredential.user, { displayName: name });
  
  const newUserProfile: UserProfile = {
    ...DEFAULT_USER_PROFILE,
    id: userCredential.user.uid,
    name: name || userCredential.user.displayName || "Anime Hero",
    selectedCharacterId: DEFAULT_USER_PROFILE.selectedCharacterId,
    customProfileImageUrl: null, // Initialize new field
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
  
  if (typeof window !== 'undefined') {
    let userProfile = JSON.parse(localStorage.getItem(`userProfile-${user.uid}`) || 'null') as UserProfile | null;
    if (!userProfile) {
      userProfile = {
        ...DEFAULT_USER_PROFILE,
        id: user.uid,
        name: user.displayName || "Anime Hero",
        selectedCharacterId: DEFAULT_USER_PROFILE.selectedCharacterId,
        customProfileImageUrl: user.photoURL || null, // Use Google photo if available, else null
      };
      localStorage.setItem(`userProfile-${user.uid}`, JSON.stringify(userProfile));
    } else {
      // If profile exists, ensure customProfileImageUrl is there, potentially updating from Google photo
      userProfile.customProfileImageUrl = userProfile.customProfileImageUrl || user.photoURL || null;
      localStorage.setItem(`userProfile-${user.uid}`, JSON.stringify(userProfile));
    }
    localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(userProfile));
  }
  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`);
  }
}

export function onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
  return firebaseOnAuthStateChanged(auth, callback);
}

async function loadAndActivateUserProfile(user: FirebaseUser) {
  if (typeof window !== 'undefined') {
    let userProfile = JSON.parse(localStorage.getItem(`userProfile-${user.uid}`) || 'null') as UserProfile | null;
    
    if (!userProfile) {
      userProfile = {
        ...DEFAULT_USER_PROFILE,
        id: user.uid,
        name: user.displayName || "Anime Hero",
        customProfileImageUrl: user.photoURL || null, // Initialize with Firebase photoURL if available
      };
      localStorage.setItem(`userProfile-${user.uid}`, JSON.stringify(userProfile));
    } else {
      // Ensure customProfileImageUrl is part of the loaded profile
       if (userProfile.customProfileImageUrl === undefined) {
         userProfile.customProfileImageUrl = user.photoURL || null;
         localStorage.setItem(`userProfile-${user.uid}`, JSON.stringify(userProfile));
       }
    }
    localStorage.setItem(`userProfile-${DEFAULT_USER_PROFILE_ID}`, JSON.stringify(userProfile));
  }
}

// This function was previously named updateUserProfileName
// Keeping it specific for Firebase Auth profile update if needed separately from local UserProfile
export { firebaseUpdateProfile as updateUserProfileName };

