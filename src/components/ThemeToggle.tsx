"use client";

import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ThemeToggle() {
  const { mode, resolved, setMode, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options: { value: "dark" | "light" | "system"; label: string; icon: React.ReactNode }[] = [
    { value: "dark", label: "深色模式", icon: <Moon size={14} /> },
    { value: "light", label: "亮色模式", icon: <Sun size={14} /> },
    { value: "system", label: "跟随系统", icon: <Monitor size={14} /> },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-border-primary bg-bg-card hover:bg-bg-hover transition-all text-text-secondary hover:text-text-primary"
        title={resolved === "dark" ? "切换亮色模式" : "切换暗色模式"}
      >
        {resolved === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-border-primary bg-bg-card shadow-xl overflow-hidden z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setMode(opt.value); setOpen(false); }}
              className={cn(
                "flex items-center gap-2.5 w-full px-4 py-2.5 text-xs transition-all",
                mode === opt.value
                  ? "bg-accent-blue/10 text-accent-blue"
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <span className={mode === opt.value ? "text-accent-blue" : "text-text-muted"}>{opt.icon}</span>
              {opt.label}
              {mode === opt.value && <span className="ml-auto text-accent-blue">✓</span>}
            </button>
          ))}
          <div className="px-4 py-2 border-t border-border-primary/50 text-[9px] text-text-muted">
            当前: {resolved === "dark" ? "暗色" : "亮色"}
          </div>
        </div>
      )}
    </div>
  );
}
