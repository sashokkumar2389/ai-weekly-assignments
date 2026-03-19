import { useEffect } from "react";
import { useUIStore } from "@/stores/uiStore";

export const useTheme = () => {
    const { theme, setTheme } = useUIStore();

    useEffect(() => {
        const stored = localStorage.getItem("qa-bot-theme") as
            | "light"
            | "dark"
            | null;
        if (stored) {
            setTheme(stored);
        }
    }, [setTheme]);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("qa-bot-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return { theme, toggleTheme };
};
