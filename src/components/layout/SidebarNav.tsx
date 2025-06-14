
"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ListChecks, CalendarDays, UserCircle, LogIn, UserPlus, LogOut } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { onAuthStateChanged, signOut as firebaseSignOutService, type FirebaseUser } from '@/lib/firebase/authService';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/character-selection', label: 'Characters', icon: Users },
  { href: '/workout-tracker', label: 'Track Workout', icon: ListChecks },
  { href: '/workout-schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

// For users who are not logged in yet
const authNavItems = [
  { href: '/login', label: 'Login', icon: LogIn },
  { href: '/signup', label: 'Sign Up', icon: UserPlus },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOutService();
      toast({
        title: 'Signed Out',
        description: "You've successfully signed out.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Sign Out Failed',
        description: error.message || 'Could not sign out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/animefit.svg"
            alt={`${APP_NAME} logo`}
            width={32}
            height={32}
            data-ai-hint="app logo"
          />
          <span className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {/* Always show main nav items; page-level auth will handle redirection */}
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  variant="default"
                  size="default"
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}

          <hr className="my-2 border-sidebar-border group-data-[collapsible=icon]:hidden" />

          {mounted && currentUser && (
            <SidebarMenuItem className="group-data-[collapsible=icon]:my-1">
              <SidebarMenuButton
                variant="ghost"
                size="default"
                onClick={handleSignOut}
                tooltip={{ children: "Logout", side: 'right', align: 'center' }}
                className="justify-start"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {mounted && !currentUser && (
            authNavItems.map((item) => (
              <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:my-1">
                <Link href={item.href}>
                  <SidebarMenuButton
                    variant="ghost"
                    size="default"
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                    className="justify-start"
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden text-center">
          Level up your fitness!
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
