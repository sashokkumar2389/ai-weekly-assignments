import { useMemo, useState } from "react";
import { LOCATION_SUGGESTIONS, EXPERIENCE_SUGGESTIONS, QUERY_STARTERS } from "@/lib/suggestions";
import { cn } from "@/lib/utils";

interface ChatSuggestionsProps {
    inputValue: string;
    onSelect: (suggestion: string) => void;
    isOpen: boolean;
}

export const ChatSuggestions = ({
    inputValue,
    onSelect,
    isOpen,
}: ChatSuggestionsProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const suggestions = useMemo(() => {
        if (!isOpen) return [];

        const lower = inputValue.toLowerCase();

        if (lower.includes(" in ") || lower.includes(" from ")) {
            return LOCATION_SUGGESTIONS;
        }

        if (lower.match(/\d+|\byear\b/)) {
            return EXPERIENCE_SUGGESTIONS;
        }

        if (!inputValue.trim()) {
            return QUERY_STARTERS;
        }

        return [];
    }, [inputValue, isOpen]);

    if (!isOpen || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="mb-2 rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
            {suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                    key={suggestion}
                    onClick={() => onSelect(suggestion)}
                    className={cn(
                        "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                        index === selectedIndex && "bg-gray-100 dark:bg-gray-700"
                    )}
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
};
