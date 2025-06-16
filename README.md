# AnimeFit - Level Up Your Fitness! BY FAZLA RABBI

AnimeFit is a gamified fitness tracking application designed to motivate users by allowing them to train alongside their favorite anime heroes. Track your workouts, select character mentors, unlock achievements, and watch your fitness level grow!

## Features

*   **User Authentication**: Secure sign-up and login with Email/Password and Google Sign-In powered by Firebase Authentication.
*   **Character Selection**: Choose an anime hero to be your training mentor. Each character can have a unique themed workout.
*   **Workout Tracking**:
    *   Log daily exercises with customizable difficulty levels (Easy, Normal, Hard).
    *   Track workout duration.
    *   Complete "Extra Quests" for bonus XP.
*   **Gamification**:
    *   Earn Experience Points (XP) for completing exercises and workouts.
    *   Level up your profile.
    *   Maintain a workout streak.
    *   Unlock rewards and achievements.
*   **Personalized Dashboard**: View your stats, selected mentor, level progress, and workout streak.
*   **Profile Management**:
    *   Edit your hero name.
    *   Upload a custom profile picture (max 1MB, stored locally).
*   **Workout Scheduling**: Select your preferred workout days.
*   **In-App Reminders**: Set a daily time to receive an in-app toast notification for your workout.
*   **Responsive Design**: Adapts to desktop and mobile viewports.
*   **PWA Ready**: Configured for Progressive Web App capabilities (requires manual creation of `site.webmanifest` and icons in the `public` folder).
*   **Light/Dark Mode**: Theme switching for user preference.

## Tech Stack

*   **Framework**: Next.js (with App Router)
*   **Language**: TypeScript
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **Authentication & Backend (Client-Side)**: Firebase (Authentication)
*   **State Management**: React Hooks (useState, useEffect, useContext), `use-local-storage-state` custom hook.
*   **AI (Placeholder)**: Genkit (Google AI) - Currently initialized but not actively used in core features.
*   **Deployment (Assumed)**: Configured for Firebase App Hosting (see `apphosting.yaml`).

## Getting Started

### Prerequisites

*   Node.js (v18 or newer recommended)
*   npm or yarn

### Setup

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Firebase Configuration:**
    *   You need a Firebase project.
    *   In `src/lib/firebase/config.ts`, replace the placeholder `firebaseConfig` object with your actual Firebase project configuration details.
        ```typescript
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
          measurementId: "YOUR_MEASUREMENT_ID" // Optional
        };
        ```
    *   **Enable Authentication Providers**: In your Firebase project console, go to "Authentication" -> "Sign-in method" and enable:
        *   Email/Password
        *   Google (ensure a "Project support email" is selected for Google sign-in)
    *   **Authorized Domains**: Ensure `localhost` and any deployment preview domains are added to the "Authorized domains" list in the Firebase Authentication settings.

4.  **PWA Setup (Manual Steps Required):**
    *   Create a `public` folder at the root of your project (if it doesn't exist).
    *   Inside the `public` folder, create:
        *   `site.webmanifest`: A JSON file configuring your PWA (see example below).
        *   `favicon.ico`: Your application's favicon.
        *   `apple-touch-icon.png`: (e.g., 180x180px) for iOS home screen.
        *   Any icons referenced in your `site.webmanifest` (e.g., `android-chrome-192x192.png`, `android-chrome-512x512.png`).

    *Example `public/site.webmanifest`:*
    ```json
    {
      "name": "AnimeFit",
      "short_name": "AnimeFit",
      "description": "Level up your fitness, anime style! Track workouts, choose hero mentors, and unlock achievements.",
      "icons": [
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
      "theme_color": "#FF6600",
      "background_color": "#F5F5DC",
      "display": "standalone",
      "scope": "/",
      "start_url": "/",
      "orientation": "portrait-primary"
    }
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```
The application will be available at `http://localhost:9002` (or the port specified in `package.json`).

The Genkit development flow (if used) can be started with:
```bash
npm run genkit:dev
```

## Scripts

*   `dev`: Starts the Next.js development server with Turbopack.
*   `genkit:dev`: Starts the Genkit development server.
*   `genkit:watch`: Starts the Genkit development server with watch mode.
*   `build`: Builds the application for production.
*   `start`: Starts the production server.
*   `lint`: Lints the codebase.
*   `typecheck`: Checks TypeScript types.

## Future Enhancements (Suggestions)

*   **Backend Integration**: For persistent data storage beyond `localStorage` (e.g., Firestore for user profiles, workout logs).
*   **True Push Notifications**: Implement Firebase Cloud Messaging for workout reminders that work even when the app is closed.
*   **Advanced PWA**: Full offline support using service workers.
*   **Genkit AI Features**:
    *   AI-generated workout plans or modifications.
    *   Personalized motivational messages from "character mentors."
    *   AI-powered image generation for rewards or character interactions.
*   **Social Features**: Leaderboards, sharing progress.
*   **More Characters & Workouts**: Expand the library of anime heroes and their themed exercises.
*   **Detailed Progress Analytics**: More charts and stats for users to track their fitness journey.
