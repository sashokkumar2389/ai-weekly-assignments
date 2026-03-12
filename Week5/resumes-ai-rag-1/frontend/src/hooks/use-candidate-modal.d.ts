import { CandidateProfile } from '@/types/candidate.types';
export declare function useCandidateModal(): {
    isOpen: boolean;
    candidate: CandidateProfile | null;
    loading: boolean;
    openCandidateModal: (id: string) => Promise<void>;
    closeModal: () => void;
};
//# sourceMappingURL=use-candidate-modal.d.ts.map