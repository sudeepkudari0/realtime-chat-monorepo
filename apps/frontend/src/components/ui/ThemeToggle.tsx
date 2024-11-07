"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme: nextThemeSetter } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    nextThemeSetter(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative w-12 px-0 hover:bg-transparent"
      onClick={toggleTheme}
    >
      <div className="relative h-10 w-10">
        <Sun
          className="absolute h-10 w-10 rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0"
          strokeWidth={1.5}
        />
        <Moon
          className="absolute h-10 w-10 rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100"
          strokeWidth={1.5}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
