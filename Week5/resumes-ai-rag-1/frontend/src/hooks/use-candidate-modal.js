import { useCallback, useState } from 'react';
import { candidateApi } from '@/lib/api/candidate.api';
import toast from 'react-hot-toast';
export function useCandidateModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    const openCandidateModal = useCallback(async (id) => {
        setIsOpen(true);
        setLoading(true);
        try {
            const data = await candidateApi.getCandidate(id);
            setCandidate(data);
        }
        catch {
            toast.error('Failed to load candidate profile.');
            setIsOpen(false);
        }
        finally {
            setLoading(false);
        }
    }, []);
    const closeModal = useCallback(() => {
        setIsOpen(false);
        setCandidate(null);
    }, []);
    return {
        isOpen,
        candidate,
        loading,
        openCandidateModal,
        closeModal,
    };
}
//# sourceMappingURL=use-candidate-modal.js.map