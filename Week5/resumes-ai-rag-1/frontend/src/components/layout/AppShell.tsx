export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-screen bg-bg-base overflow-hidden">
            {children}
        </div>
    );
}
