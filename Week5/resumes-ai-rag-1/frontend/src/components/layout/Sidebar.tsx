import { BrandAvatar } from '@/components/common/BrandAvatar';
import { SearchModeNav } from '@/components/features/sidebar/SearchModeNav';
import { HybridWeightPanel } from '@/components/features/sidebar/HybridWeightPanel';
import { ResultsLimitSelect } from '@/components/features/sidebar/ResultsLimitSelect';
import { ClearChatButton } from '@/components/features/sidebar/ClearChatButton';
import { useSearchStore } from '@/lib/stores/search.store';
import { AnimatePresence } from 'framer-motion';

export function Sidebar() {
    const { searchType, setSearchType } = useSearchStore();

    return (
        <aside className="w-[260px] shrink-0 bg-bg-surface border-r border-white/[0.07] flex flex-col p-5 gap-4 overflow-y-auto">
            <BrandAvatar />

            <div className="text-xs font-medium uppercase tracking-widest text-text-muted">Search Mode</div>
            <SearchModeNav activeMode={searchType} onChange={setSearchType} />

            <AnimatePresence>
                {searchType === 'hybrid' && <HybridWeightPanel />}
            </AnimatePresence>

            <div className="text-xs font-medium uppercase tracking-widest text-text-muted mt-6">Results Limit</div>
            <ResultsLimitSelect />

            <div className="mt-auto flex flex-col gap-2">
                <ClearChatButton />
                <footer className="text-xs text-text-muted text-center py-2">RecruitBot v2.0</footer>
            </div>
        </aside>
    );
}
