import { useCallback } from 'react';
import { useSearchStore } from '@/lib/stores/search.store';

export function useHybridWeights() {
    const { bm25Weight, vectorWeight, setWeights } = useSearchStore();

    const handleBm25Change = useCallback(
        (value: number[]) => {
            const newBm25 = value[0];
            const newVector = 100 - newBm25;
            setWeights(newBm25, newVector);
        },
        [setWeights]
    );

    const handleVectorChange = useCallback(
        (value: number[]) => {
            const newVector = value[0];
            const newBm25 = 100 - newVector;
            setWeights(newBm25, newVector);
        },
        [setWeights]
    );

    const applyPreset = useCallback(
        (bm25: number, vector: number) => {
            setWeights(bm25, vector);
        },
        [setWeights]
    );

    return {
        bm25Weight,
        vectorWeight,
        handleBm25Change,
        handleVectorChange,
        applyPreset,
    };
}
