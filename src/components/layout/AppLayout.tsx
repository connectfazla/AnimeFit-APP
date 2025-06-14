
import type { ReactNode } from 'react';
import { SidebarNav } from './SidebarNav';
import { Header } from './Header';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { BottomNav } from './BottomNav'; // Import BottomNav
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

// Create a helper component to access useIsMobile hook within SidebarProvider scope if needed,
// or use useIsMobile directly if SidebarProvider doesn't influence it for this specific case.
// For BottomNav positioning and main content padding, direct useIsMobile is fine.

function MainContent({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <main className={cn(
      "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8",
      isMobile && "pb-20" // Add padding-bottom for BottomNav on mobile
    )}>
      {children}
    </main>
  );
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
          <BottomNav /> {/* Render BottomNav, it will internally decide if it's mobile */}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
