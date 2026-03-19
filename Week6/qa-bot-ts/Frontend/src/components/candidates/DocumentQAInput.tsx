import { useState } from "react";
import { useDocumentQA } from "@/api/hooks/useDocumentQA";
import { Send } from "lucide-react";

interface DocumentQAInputProps {
    candidateId: string;
    candidateName: string;
}

export const DocumentQAInput = ({
    candidateId,
    candidateName,
}: DocumentQAInputProps) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [excerpts, setExcerpts] = useState<string[]>([]);
    const { mutate: askQuestion, isPending } = useDocumentQA();

    const handleAsk = () => {
        if (!question.trim()) return;

        askQuestion(
            { candidateId, question },
            {
                onSuccess: (data) => {
                    setAnswer(data.answer);
                    setExcerpts(data.relevantExcerpts);
                },
            }
        );
    };

    return (
        <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
                Ask about {candidateName}'s resume
            </h3>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    placeholder="What do you want to know?"
                    className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    disabled={isPending}
                />
                <button
                    onClick={handleAsk}
                    disabled={!question.trim() || isPending}
                    className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>

            {answer && (
                <div className="space-y-2 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                        A: {answer}
                    </p>
                    {excerpts.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Relevant excerpts:
                            </p>
                            {excerpts.map((excerpt, i) => (
                                <p
                                    key={i}
                                    className="text-xs italic text-gray-600 dark:text-gray-400"
                                >
                                    "{excerpt}"
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
