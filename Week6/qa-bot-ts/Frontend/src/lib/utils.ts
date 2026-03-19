import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString();
};

export const formatScore = (score: number | undefined): string => {
    if (score === undefined || score === null) return "0";
    // Ensure score is normalized between 0-1
    const normalized = Math.max(0, Math.min(1, score));
    return (normalized * 100).toFixed(0);
};

export const getScoreBadgeColor = (
    score: number | undefined
): "green" | "yellow" | "red" => {
    if (score === undefined || score === null) return "red";
    // Ensure score is normalized between 0-1
    const normalized = Math.max(0, Math.min(1, score));
    if (normalized >= 0.8) return "green";
    if (normalized >= 0.5) return "yellow";
    return "red";
};
