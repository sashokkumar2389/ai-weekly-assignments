import { CandidateCard } from "@/components/candidates/CandidateCard";
import { CandidateResult } from "@/api/types";

interface CandidateCardListProps {
    candidates: CandidateResult[];
}

export const CandidateCardList = ({ candidates }: CandidateCardListProps) => {
    return (
        <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Found {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-2">
                {candidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
            </div>
        </div>
    );
};
