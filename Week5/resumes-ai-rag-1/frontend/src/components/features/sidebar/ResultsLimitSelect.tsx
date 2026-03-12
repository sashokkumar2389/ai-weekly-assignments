import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchStore } from '@/lib/stores/search.store';
import { RESULTS_LIMIT_OPTIONS } from '@/lib/utils/constants';

export function ResultsLimitSelect() {
    const { topK, setTopK } = useSearchStore();

    return (
        <Select value={topK.toString()} onValueChange={(value) => setTopK(parseInt(value))}>
            <SelectTrigger className="w-full">
                <span className="text-sm">Show top </span>
                <SelectValue />
                <span className="text-sm"> results</span>
            </SelectTrigger>
            <SelectContent>
                {RESULTS_LIMIT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                        {option} results
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
