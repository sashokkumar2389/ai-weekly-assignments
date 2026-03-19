interface PageContainerProps {
    children: React.ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
    return (
        <div className="mx-auto h-full max-w-screen-xl">
            {children}
        </div>
    );
};
