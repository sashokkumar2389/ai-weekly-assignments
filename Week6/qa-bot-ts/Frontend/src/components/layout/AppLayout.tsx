interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="h-screen w-screen bg-white dark:bg-gray-950">
            {children}
        </div>
    );
};
