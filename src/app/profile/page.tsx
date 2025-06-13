"use client";
import { AppLayout } from '@/components/layout/AppLayout';
import { UserProfileCard } from '@/components/features/animefit/UserProfileCard';
import { LevelIndicator } from '@/components/features/animefit/LevelIndicator';
import { RewardDisplay } from '@/components/features/animefit/RewardDisplay';
import { ReminderSettingsForm } from '@/components/features/animefit/ReminderSettingsForm';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE, DEFAULT_USER_PROFILE_ID } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { useEffect } from 'react';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);

  // Initialize profile if it doesn't exist
  useEffect(() => {
    if (!userProfile) {
      setUserProfile(DEFAULT_USER_PROFILE);
    }
  }, [userProfile, setUserProfile]);

  return (
    <AppLayout pageTitle="Your Hero Profile">
      <div className="container mx-auto py-8 space-y-8">
        <UserProfileCard userProfile={userProfile} />
        <div className="grid md:grid-cols-2 gap-8">
          <LevelIndicator userProfile={userProfile} />
          <RewardDisplay userProfile={userProfile} />
        </div>
        <ReminderSettingsForm />
      </div>
    </AppLayout>
  );
}
