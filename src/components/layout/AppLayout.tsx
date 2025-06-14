
"use client";
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { SidebarNav } from './SidebarNav';
import { Header } from './Header';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { BottomNav } from './BottomNav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import useLocalStorageState from '@/hooks/use-local-storage-state';
import { DEFAULT_USER_PROFILE_ID } from '@/lib/constants';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { BellRing } from 'lucide-react';
import { onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

function MainContent({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <main className={cn(
      "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
      isMobile && "pb-20" 
    )}>
      {children}
    </main>
  );
}

function ReminderHandler() {
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile | null>(`userProfile-${DEFAULT_USER_PROFILE_ID}`, null);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setCurrentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !userProfile || !userProfile.reminderTime) {
      return;
    }

    const checkReminder = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      if (userProfile.lastReminderDismissedDate === todayStr) {
        return; 
      }

      const [hours, minutes] = userProfile.reminderTime!.split(':').map(Number);
      const reminderDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (now.getHours() === reminderDateTime.getHours() && now.getMinutes() === reminderDateTime.getMinutes()) {
        toast({
          title: (
            <div className="flex items-center">
              <BellRing className="mr-2 h-5 w-5 text-primary" />
              Workout Reminder!
            </div>
          ),
          description: `Time for your training session, ${userProfile.name}! Let's go!`,
          duration: 10000, // 10 seconds
        });
        setUserProfile(prev => prev ? { ...prev, lastReminderDismissedDate: todayStr } : null);
      }
    };

    // Check immediately on load and then set an interval
    checkReminder(); 
    const intervalId = setInterval(checkReminder, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [userProfile, setUserProfile, toast, currentUser]);

  return null; // This component does not render anything visible
}


export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarNav />
        <SidebarInset className="flex flex-col">
          <Header pageTitle={pageTitle} />
          <MainContent>
            {children}
          </MainContent>
          <Toaster />
          <BottomNav /> 
          <ReminderHandler />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
