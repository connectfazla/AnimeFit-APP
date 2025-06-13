
"use client";
import Link from 'next/link';
import { UserCircle, Menu, Sun, Moon, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { useSidebar } from '@/components/ui/sidebar';
import { useTheme } from '@/components/theme-provider';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, type FirebaseUser } from '@/lib/firebase/authService';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function Header({ pageTitle }: { pageTitle: string }) {
  const { toggleSidebar, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
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
  
  // Placeholder for hydration mismatch avoidance
  if (!mounted) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden" aria-label="Toggle Menu">
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="font-headline text-xl md:text-2xl font-semibold text-primary">{pageTitle || APP_NAME}</h1>
        </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Toggle theme (placeholder)">
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary hover:text-accent" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary hover:text-accent" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="User Profile (placeholder)">
              <UserCircle className="h-6 w-6 text-primary hover:text-accent" />
            </Button>
          </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden" aria-label="Toggle Menu">
          <Menu className="h-6 w-6" />
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
        {currentUser ? (
          <>
            <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="User Profile">
                <UserCircle className="h-6 w-6 text-primary hover:text-accent" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out">
              <LogOut className="h-6 w-6 text-primary hover:text-accent" />
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-primary hover:text-accent">
                <LogIn className="mr-1 h-4 w-4" /> Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="sm">
                 Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
