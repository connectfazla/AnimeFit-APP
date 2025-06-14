
import type { Metadata } from 'next';
import './globals.css';
import { APP_NAME } from '@/lib/constants';
import { ThemeProvider } from '@/components/theme-provider';

const APP_DESCRIPTION = 'Level up your fitness, anime style! Track workouts, choose hero mentors, and unlock achievements.';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
    // startupImage: [], // Optionally, add startup images for different devices
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    // images: [ // Optionally, add a default social sharing image
    //   {
    //     url: 'https://yourdomain.com/og-image.png', // Replace with your actual image URL
    //     width: 1200,
    //     height: 630,
    //     alt: `${APP_NAME} Og Image`,
    //   },
    // ],
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    // images: ['https://yourdomain.com/twitter-image.png'], // Replace with your actual image URL
  },
  icons: {
    icon: '/favicon.ico', // This references public/favicon.ico
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png', // This references public/apple-touch-icon.png
    // other: [ // Example for different sizes
    //   { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16' },
    //   { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32' },
    // ],
  },
  keywords: ['fitness', 'anime', 'workout', 'tracker', 'gamification', 'health', 'exercise', 'motivation'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#FF6600" /> 
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=SF+Pro+Text:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
