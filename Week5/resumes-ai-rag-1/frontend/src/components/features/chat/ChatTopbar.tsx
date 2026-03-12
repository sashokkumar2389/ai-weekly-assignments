import { Badge } from '@/components/ui/badge';
import { useSearchStore } from '@/lib/stores/search.store';

export function ChatTopbar() {
    const { searchType } = useSearchStore();

    const modeInfo = {
        vector: { label: 'Vector Search', color: 'vector' },
        bm25: { label: 'BM25 Keyword', color: 'bm25' },
        hybrid: { label: 'Hybrid Search', color: 'hybrid' },
    };

    const info = modeInfo[searchType];

    return (
        <div className="flex items-center justify-between p-4 border-b border-white/[0.07] bg-bg-card">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs">
                    R
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-text-primary">RecruitBot</h2>
                    <p className="text-xs text-text-muted">Candidate Discovery</p>
                </div>
            </div>
            <Badge variant={info.color as any}>{info.label}</Badge>
        </div>
    );
}
