import { WELCOME_MESSAGE, WELCOME_SUGGESTIONS } from "@/lib/suggestions";
import { MessageCircle } from "lucide-react";

interface WelcomeScreenProps {
    onSuggestClick: (suggestion: string) => void;
}

export const WelcomeScreen = ({ onSuggestClick }: WelcomeScreenProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    QA Resume Bot
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {WELCOME_MESSAGE}
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {WELCOME_SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => onSuggestClick(suggestion)}
                        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};
