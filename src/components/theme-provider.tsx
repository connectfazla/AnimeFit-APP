
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string; 
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean; // Added based on existing RootLayout usage
}

interface ThemeProviderState {
  theme: Theme; 
  resolvedTheme: "dark" | "light"; 
  setTheme: (theme: Theme) => void;
}

// Helper function to determine the initial resolved theme in a server-safe way
const getInitialResolvedTheme = (defaultTheme: Theme, enableSystem: boolean): "dark" | "light" => {
  // For SSR and initial client render, if defaultTheme is "system", we can't know the actual system preference.
  // So, we default to "light" to ensure consistency. The actual system preference will be applied client-side post-mount.
  if (defaultTheme === "system" && enableSystem) {
    return "light"; 
  }
  return defaultTheme === "dark" ? "dark" : "light";
};


const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "animefit-theme",
  attribute = "class",
  enableSystem = true,
  // disableTransitionOnChange is not directly used by this provider's logic
  // but is kept if Next.js's own <ThemeProvider> might use it.
  // For our custom one, it's more about managing `theme` and `resolvedTheme`.
}: ThemeProviderProps) {
  // State for the user's selected theme preference (light, dark, or system)
  // Initialized with defaultTheme, which is consistent for server and initial client render.
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  
  // State for the actual resolved theme (always 'light' or 'dark')
  // Initialized using a helper that's consistent for server and initial client render.
  const [resolvedTheme, setResolvedThemeState] = useState<"dark" | "light">(() => 
    getInitialResolvedTheme(defaultTheme, enableSystem)
  );
  
  const [mounted, setMounted] = useState(false);

  const applyThemeToDom = useCallback((newThemeToApply: "dark" | "light") => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark"); // Remove both to handle transitions correctly
    if (attribute === "class") {
      root.classList.add(newThemeToApply);
    } else {
      root.setAttribute('data-theme', newThemeToApply);
    }
  }, [attribute]);
  
  // Effect 1: Set mounted and load theme preference from localStorage (client-side only)
  useEffect(() => {
    setMounted(true);
    let storedThemePreference: Theme | null = null;
    try {
      storedThemePreference = window.localStorage.getItem(storageKey) as Theme | null;
    } catch (e) {
      // Ignore localStorage errors (e.g., in private browsing)
    }

    if (storedThemePreference && ["light", "dark", "system"].includes(storedThemePreference)) {
      setThemeState(storedThemePreference);
    } else {
      // If no valid stored theme, ensure state reflects defaultTheme (already done by useState init)
      // This explicit setThemeState call isn't strictly needed if useState(defaultTheme) is used,
      // but reinforces the logic if localStorage is empty or invalid.
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]);


  // Effect 2: Update resolvedTheme and apply to DOM when 'theme' state or 'mounted' status changes (client-side)
  useEffect(() => {
    if (!mounted) {
      // Do nothing until the component is mounted and initial theme preference is loaded.
      // The initial resolvedTheme (from useState) and DOM class (via Next.js SSR + suppressHydrationWarning) handle the first paint.
      return;
    }

    let newResolvedServerConsistent: "dark" | "light";
    if (theme === "system" && enableSystem) {
      newResolvedServerConsistent = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      newResolvedServerConsistent = theme === "dark" ? "dark" : "light";
    }
    
    setResolvedThemeState(newResolvedServerConsistent);
    applyThemeToDom(newResolvedServerConsistent);

    // Set up listener for system theme changes if current theme is 'system'
    if (theme === "system" && enableSystem) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const changedSystemResolved = mediaQuery.matches ? "dark" : "light";
        setResolvedThemeState(changedSystemResolved); // Update resolved state
        applyThemeToDom(changedSystemResolved); // Apply to DOM
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted, enableSystem, applyThemeToDom]);

  const handleSetTheme = (newThemeToSet: Theme) => {
    try {
      window.localStorage.setItem(storageKey, newThemeToSet);
    } catch (e) {
      // Ignore localStorage errors
    }
    setThemeState(newThemeToSet); // Update the theme preference state
  };
  
  // The context value uses the 'theme' state (user preference) and 'resolvedTheme' state (actual light/dark).
  // Both states are initialized consistently for SSR and initial client render.
  // Updates happen in useEffect post-mount.
  const contextValue: ThemeProviderState = {
    theme: theme,
    resolvedTheme: resolvedTheme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
