export const CandidateCardSkeleton = () => {
    return (
        <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="mt-2 h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="flex gap-2">
                    <div className="h-6 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
                <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-14 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
        </div>
    );
};
