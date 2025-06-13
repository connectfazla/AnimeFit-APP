
"use client";
import Link from 'next/link';
import { UserCircle, Menu, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/components/theme-provider';
import { useEffect, useState } from 'react';

export function Header({ pageTitle }: { pageTitle: string }) {
  const { toggleSidebar, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}
        <div className="flex-1">
          <h1 className="font-headline text-xl md:text-2xl font-semibold text-primary">{pageTitle || APP_NAME}</h1>
        </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary hover:text-accent" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary hover:text-accent" />
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="User Profile">
                <UserCircle className="h-6 w-6 text-primary hover:text-accent" />
              </Button>
            </Link>
          </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}
      <div className="flex-1">
        <h1 className="font-headline text-xl md:text-2xl font-semibold text-primary">{pageTitle || APP_NAME}</h1>
      </div>
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? (
            <Sun className="h-6 w-6 text-primary hover:text-accent" />
          ) : (
            <Moon className="h-6 w-6 text-primary hover:text-accent" />
          )}
        </Button>
        <Link href="/profile">
          <Button variant="ghost" size="icon" aria-label="User Profile">
            <UserCircle className="h-6 w-6 text-primary hover:text-accent" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
