import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CandidateResult } from "@/api/types";
import { MatchTypeBadge, SkillTag } from "@/components/shared";
import { useUIStore } from "@/stores/uiStore";
import { formatScore, getScoreBadgeColor } from "@/lib/utils";

interface CandidateCardProps {
    candidate: CandidateResult;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { openCandidateDialog } = useUIStore();
    const scoreColor = getScoreBadgeColor(candidate.score);
    const scoreColorBg = {
        green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
        yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700",
        red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700",
    };
    const scoreColorText = {
        green: "text-green-700 dark:text-green-200",
        yellow: "text-yellow-700 dark:text-yellow-200",
        red: "text-red-700 dark:text-red-200",
    };

    return (
        <div className={`rounded-lg border ${scoreColorBg[scoreColor]} p-3 transition-all duration-200`}>
            <div className="flex items-center gap-3">
                {/* Score Circle */}
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white dark:bg-gray-700 border-2 border-current ${scoreColorText[scoreColor]}`}>
                    <span className="text-lg font-bold">{formatScore(candidate.score)}</span>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {candidate.name}
                        </h3>
                        <MatchTypeBadge matchType={candidate.matchType} />
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        {candidate.extractedInfo?.experience && (
                            <span>{candidate.extractedInfo.experience}</span>
                        )}
                        {candidate.extractedInfo?.specialization && (
                            <>
                                <span>•</span>
                                <span>{candidate.extractedInfo.specialization}</span>
                            </>
                        )}
                    </div>
                    {!isExpanded && candidate.extractedInfo?.skills && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                            {candidate.extractedInfo.skills.slice(0, 2).map((skill) => (
                                <SkillTag key={skill} skill={skill} />
                            ))}
                            {candidate.extractedInfo.skills.length > 2 && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    +{candidate.extractedInfo.skills.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={() => openCandidateDialog(candidate.id)}
                    className="flex-shrink-0 rounded-md bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                >
                    View
                </button>
            </div>

            {isExpanded && (
                <div className="mt-3 space-y-2 border-t border-current border-opacity-20 pt-3">
                    {candidate.extractedInfo?.skills && (
                        <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                All Skills
                            </p>
                            <div className="mt-1 flex flex-wrap gap-1">
                                {candidate.extractedInfo.skills.map((skill) => (
                                    <SkillTag key={skill} skill={skill} />
                                ))}
                            </div>
                        </div>
                    )}
                    {candidate.llmReasoning && (
                        <div>
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Why Match
                            </p>
                            <p className="text-xs italic text-gray-600 dark:text-gray-400">
                                {candidate.llmReasoning}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
                {isExpanded ? (
                    <>
                        Show less <ChevronUp className="h-3 w-3" />
                    </>
                ) : (
                    <>
                        Show more <ChevronDown className="h-3 w-3" />
                    </>
                )}
            </button>
        </div>
    );
};
