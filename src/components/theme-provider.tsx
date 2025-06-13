
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
// Use next-themes for a more robust solution if preferred, but this is a minimal custom hook.

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string; // "class" or "data-theme"
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean; // For next-themes compatibility, not fully used here
}

interface ThemeProviderState {
  theme: Theme;
  resolvedTheme?: "dark" | "light";
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "animefit-theme", // Changed storage key
  attribute = "class", // Default to class
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (e) {
      // If localStorage is unavailable
      return defaultTheme;
    }
  });
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light' | undefined>(undefined);


  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: Theme) => {
      let newResolvedTheme: "dark" | "light";
      if (currentTheme === "system" && enableSystem) {
        newResolvedTheme = mediaQuery.matches ? "dark" : "light";
      } else {
        newResolvedTheme = currentTheme === "dark" ? "dark" : "light";
      }
      
      setResolvedTheme(newResolvedTheme);

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(newResolvedTheme);
      } else {
        root.setAttribute('data-theme', newResolvedTheme);
      }
    };

    applyTheme(theme); // Apply theme on initial load and when theme state changes

    const handleChange = () => {
      if (theme === "system" && enableSystem) {
        applyTheme("system");
      }
    };

    if (enableSystem) {
        mediaQuery.addEventListener("change", handleChange);
    }
    
    return () => {
        if (enableSystem) {
            mediaQuery.removeEventListener("change", handleChange);
        }
    };
  }, [theme, attribute, enableSystem, storageKey]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (newTheme: Theme) => {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch (e) {
          // localStorage unavailable
        }
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
