
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string; 
  enableSystem?: boolean;
}

interface ThemeProviderState {
  theme: Theme; 
  resolvedTheme?: "dark" | "light"; 
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light", 
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "animefit-theme",
  attribute = "class",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme); 
  const [actualResolvedTheme, setActualResolvedTheme] = useState<"dark" | "light" | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  const applyThemeToDom = useCallback((newThemeToApply: "dark" | "light") => {
    const root = window.document.documentElement;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(newThemeToApply);
    } else {
      root.setAttribute('data-theme', newThemeToApply);
    }
  }, [attribute]);
  
  useEffect(() => {
    setMounted(true);
    let initialUserTheme: Theme = defaultTheme;
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        initialUserTheme = storedTheme;
      }
    } catch (e) {
      // Ignore localStorage error
    }
    setCurrentTheme(initialUserTheme);
  }, [defaultTheme, storageKey]);


  useEffect(() => {
    if (!mounted) {
      // Determine initial resolved theme for SSR consistency, but don't apply to DOM yet
      // The DOM class should match server output initially.
      // suppressHydrationWarning on <html> handles class mismatch if server sends no class / default class.
      if (defaultTheme === "system" && enableSystem && typeof window !== "undefined") {
        setActualResolvedTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      } else {
        setActualResolvedTheme(defaultTheme === "dark" ? "dark" : "light");
      }
      return;
    }

    let newResolvedTheme: "dark" | "light";
    if (currentTheme === "system" && enableSystem) {
      newResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      newResolvedTheme = currentTheme === "dark" ? "dark" : "light";
    }
    
    setActualResolvedTheme(newResolvedTheme);
    applyThemeToDom(newResolvedTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (currentTheme === "system" && enableSystem) {
        const changedResolvedTheme = mediaQuery.matches ? "dark" : "light";
        setActualResolvedTheme(changedResolvedTheme);
        applyThemeToDom(changedResolvedTheme);
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
  }, [currentTheme, mounted, enableSystem, applyThemeToDom, defaultTheme]);


  const handleSetTheme = (newThemeToSet: Theme) => {
    try {
      window.localStorage.setItem(storageKey, newThemeToSet);
    } catch (e) {
      // Ignore localStorage error
    }
    setCurrentTheme(newThemeToSet);
  };
  
  const contextValueTheme = !mounted ? defaultTheme : currentTheme;
  const contextValueResolvedTheme = !mounted
    ? (defaultTheme === "system" && enableSystem && typeof window !== "undefined"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : (defaultTheme === "dark" ? "dark" : "light")
      )
    : actualResolvedTheme;


  const value: ThemeProviderState = {
    theme: contextValueTheme,
    resolvedTheme: contextValueResolvedTheme,
    setTheme: handleSetTheme,
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

