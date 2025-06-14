
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ListChecks, UserCircle, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

// Define items for bottom navigation, typically 3-5 main sections
const bottomNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workout-tracker', label: 'Track', icon: ListChecks },
  { href: '/character-selection', label: 'Characters', icon: Users },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile(); // Hook to check if on mobile

  // Only render BottomNav if on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background/95 backdrop-blur-sm shadow-t-lg">
      <div className="flex h-full items-center justify-around">
        {bottomNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center p-1 text-center"
            aria-current={pathname === item.href ? "page" : undefined}
          >
            <item.icon
              className={cn(
                "mb-0.5 h-6 w-6",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-xs",
                pathname === item.href ? "font-medium text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
