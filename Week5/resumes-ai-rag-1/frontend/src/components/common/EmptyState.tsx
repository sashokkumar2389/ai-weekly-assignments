import { Inbox } from 'lucide-react';

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 p-3 bg-primary/10 rounded-full">
                <Inbox className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-text-primary mb-1">No results found</h3>
            <p className="text-xs text-text-muted">Try adjusting your search query or filters</p>
        </div>
    );
}
