"use client";
import Link from 'next/link';
import { UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { useSidebar } from '@/components/ui/sidebar'; // Assuming sidebar provides toggle

export function Header({ pageTitle }: { pageTitle: string }) {
  const { toggleSidebar, isMobile } = useSidebar();

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
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" aria-label="User Profile">
            <UserCircle className="h-6 w-6 text-primary hover:text-accent" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
