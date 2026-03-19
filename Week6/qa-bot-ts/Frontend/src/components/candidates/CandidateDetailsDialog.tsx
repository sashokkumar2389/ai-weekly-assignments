import { X } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useCandidate } from "@/api/hooks/useCandidate";
import { CandidateProfile } from "./CandidateProfile";
import { CandidateCardSkeleton } from "./CandidateCardSkeleton";

export const CandidateDetailsDialog = () => {
    const { isCandidateDialogOpen, selectedCandidateId, closeCandidateDialog } =
        useUIStore();
    const { data: profile, isLoading, error } = useCandidate(selectedCandidateId || "");

    if (!isCandidateDialogOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative h-[90vh] w-full max-w-2xl rounded-lg bg-white shadow-2xl dark:bg-gray-900 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent px-6 py-4 dark:border-gray-700 dark:from-gray-800 dark:to-transparent">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Candidate Details
                    </h2>
                    <button
                        onClick={closeCandidateDialog}
                        className="rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {isLoading ? (
                        <div className="space-y-4">
                            <CandidateCardSkeleton />
                            <CandidateCardSkeleton />
                            <CandidateCardSkeleton />
                        </div>
                    ) : error ? (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                Failed to load candidate details
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                {error instanceof Error ? error.message : "Unknown error"}
                            </p>
                        </div>
                    ) : profile ? (
                        <CandidateProfile profile={profile} />
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                No candidate data available
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
