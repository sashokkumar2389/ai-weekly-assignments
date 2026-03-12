import { Button } from '@/components/ui/button';
import { SUGGESTION_CHIPS } from '@/lib/utils/constants';

interface SuggestionChipsProps {
    onSelect: (query: string) => Promise<void>;
    isVisible?: boolean;
}

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
    return (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {SUGGESTION_CHIPS.map((chip, idx) => (
                <Button
                    key={idx}
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelect(chip.query)}
                    className="justify-start h-auto py-3 px-4 text-left"
                >
                    <span className="mr-2 text-lg">{chip.icon}</span>
                    <span className="text-xs font-medium">{chip.label}</span>
                </Button>
            ))}
        </div>
    );
}
