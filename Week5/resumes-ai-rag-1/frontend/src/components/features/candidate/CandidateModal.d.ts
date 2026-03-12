import { CandidateProfile } from '@/types/candidate.types';
interface CandidateModalProps {
    isOpen: boolean;
    candidate: CandidateProfile | null;
    isLoading: boolean;
    onClose: () => void;
}
export declare function CandidateModal({ isOpen, candidate, isLoading, onClose, }: CandidateModalProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CandidateModal.d.ts.map