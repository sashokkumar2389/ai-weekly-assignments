import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700",
                className
            )}
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </button>
    );
};
