import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center overflow-hidden rounded-full cursor-pointer text-app-secondary hover:text-app-text hover:bg-app-muted transition-all"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {!mounted ? (
        <span className="w-[15px] h-[15px]" />
      ) : isDark ? (
        <Sun size={15} />
      ) : (
        <Moon size={15} />
      )}
    </button>
  );
}
