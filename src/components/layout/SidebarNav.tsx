
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ListChecks, CalendarDays, UserCircle, Dumbbell, LogIn, UserPlus } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';

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
  // In a more advanced setup, you'd get currentUser state here, possibly from a context
  // For now, we'll show all nav items. Header will show conditional login/logout.

  return (
    <Sidebar variant="sidebar" side="left" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
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
          {/* Static Auth Links - better to make these conditional based on auth state */}
          <hr className="my-2 border-sidebar-border group-data-[collapsible=icon]:hidden" />
           {authNavItems.map((item) => (
            <SidebarMenuItem key={item.href} className="group-data-[collapsible=icon]:my-1">
              <Link href={item.href}>
                <SidebarMenuButton
                  variant="ghost" // Or another appropriate variant
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
