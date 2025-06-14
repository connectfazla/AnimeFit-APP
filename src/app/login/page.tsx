
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail, signInWithGoogle, onAuthStateChanged, type FirebaseUser, resetPassword } from '@/lib/firebase/authService';
import { LogIn, Mail, KeyRound, Chrome, ShieldQuestion } from 'lucide-react';
import { APP_NAME, APP_LOGO_URL } from '@/lib/constants';

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
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

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

  const handleSendResetLink = async () => {
    if (!resetEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    setIsResettingPassword(true);
    try {
      await resetPassword(resetEmail);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for a link to reset your password.',
      });
      setForgotPasswordDialogOpen(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: 'Error Sending Reset Email',
        description: error.message || 'Could not send password reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center">
             <Image
                src={APP_LOGO_URL}
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
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="items-center text-center">
            <Link href="/" className="mb-6 inline-block">
              <Image
                src={APP_LOGO_URL}
                alt={`${APP_NAME} logo`}
                width={100}
                height={100}
                data-ai-hint="app logo"
                className="mx-auto"
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />Password</FormLabel>
                        <Button 
                          variant="link" 
                          type="button" 
                          onClick={() => setForgotPasswordDialogOpen(true)} 
                          className="px-0 text-xs h-auto text-primary hover:underline"
                        >
                          Forgot password?
                        </Button>
                      </div>
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

      <Dialog open={forgotPasswordDialogOpen} onOpenChange={setForgotPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center font-headline text-primary">
                <ShieldQuestion className="mr-2 h-6 w-6" />
                Reset Your Password
            </DialogTitle>
            <DialogDescription className="pt-2">
              Enter your email address below. If an account exists for that email, we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email Address
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="hero@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setForgotPasswordDialogOpen(false); setResetEmail(''); }}>Cancel</Button>
            <Button onClick={handleSendResetLink} disabled={isResettingPassword} className="font-headline">
              {isResettingPassword ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
