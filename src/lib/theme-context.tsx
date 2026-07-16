"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ThemeMode = "dark" | "light" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: "dark" | "light"; // actual applied theme
  setMode: (mode: ThemeMode) => void;
  toggle: () => void; // dark ↔ light shortcut
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "dark",
  resolved: "dark",
  setMode: () => {},
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  // Apply theme class to <html>
  const apply = useCallback((theme: "dark" | "light") => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    setResolved(theme);
  }, []);

  // Set mode with persistence
  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem("cia_theme", newMode);
    } catch {}
  }, []);

  // Toggle dark ↔ light
  const toggle = useCallback(() => {
    setMode(resolved === "dark" ? "light" : "dark");
  }, [resolved, setMode]);

  // Initialize from localStorage or system
  useEffect(() => {
    const saved = (() => {
      try { return localStorage.getItem("cia_theme") as ThemeMode | null; } catch { return null; }
    })();
    const initial = saved || "dark";
    setModeState(initial);

    const mq = window.matchMedia("(prefers-color-scheme: light)");

    const resolve = (m: ThemeMode) => {
      if (m === "system") return mq.matches ? "light" : "dark";
      return m;
    };

    apply(resolve(initial));
    setMounted(true);

    // Listen for system changes
    const handler = () => {
      if (initial === "system") apply(resolve("system"));
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [apply]);

  // Sync when mode changes
  useEffect(() => {
    if (!mounted) return;

    const mq = window.matchMedia("(prefers-color-scheme: light)");

    if (mode === "system") {
      apply(mq.matches ? "light" : "dark");
    } else {
      apply(mode);
    }
  }, [mode, mounted, apply]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
