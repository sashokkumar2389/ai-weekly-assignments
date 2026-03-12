import { SearchMode } from '@/types/search.types';
import { SEARCH_MODES } from '@/lib/utils/constants';
import { Check } from 'lucide-react';

interface SearchModeNavProps {
    activeMode: SearchMode;
    onChange: (mode: SearchMode) => void;
}

export function SearchModeNav({ activeMode, onChange }: SearchModeNavProps) {
    const modes: SearchMode[] = ['vector', 'bm25', 'hybrid'];

    return (
        <div className="space-y-2">
            {modes.map((mode) => {
                const config = SEARCH_MODES[mode];
                const isActive = activeMode === mode;

                return (
                    <button
                        key={mode}
                        onClick={() => onChange(mode)}
                        className={`w-full text-left p-3 rounded-md border transition-all ${isActive
                            ? 'bg-indigo-500/12 border-indigo-400/30'
                            : 'bg-transparent border-white/[0.07] hover:bg-white/[0.02]'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-text-primary">{config.label}</h4>
                                <p className="text-xs text-text-muted">{config.description}</p>
                            </div>
                            {isActive && (
                                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
