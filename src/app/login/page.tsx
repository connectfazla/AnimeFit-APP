
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signInWithGoogle, onAuthStateChanged, type FirebaseUser } from '@/lib/firebase/authService';
import { LogIn, Mail, KeyRound, Chrome } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        router.push('/'); 
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
      toast({
        title: 'Login Successful!',
        description: 'Welcome back, hero!',
      });
      router.push('/'); 
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: 'Google Sign-In Successful!',
        description: 'Welcome, hero!',
      });
      router.push('/'); 
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message || 'Could not sign in with Google.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center">
             <Image
                src="https://uppearance.com/wp-content/uploads/2025/06/ANIME-FIT-1.png"
                alt={`${APP_NAME} loading logo`}
                width={64}
                height={64}
                className="mx-auto mb-4"
                data-ai-hint="app logo"
              />
            <LogIn className="mx-auto h-10 w-10 text-primary animate-pulse" />
            <CardTitle className="font-headline text-3xl mt-2">Loading...</CardTitle>
            <CardDescription>Checking your session...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Link href="/" className="mb-6 inline-block">
            <Image
              src="https://uppearance.com/wp-content/uploads/2025/06/ANIME-FIT-1.png"
              alt={`${APP_NAME} logo`}
              width={80}
              height={80}
              data-ai-hint="app logo"
            />
          </Link>
          <CardTitle className="font-headline text-3xl text-primary">Hero Login</CardTitle>
          <CardDescription>Access your training dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="hero@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your secret power" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-headline" disabled={isLoading || isGoogleLoading}>
                {isLoading ? 'Logging In...' : 'Login'}
              </Button>
            </form>
          </Form>
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-6" 
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              'Signing In...'
            ) : (
              <>
                <Chrome className="mr-2 h-5 w-5" /> Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            New hero?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
