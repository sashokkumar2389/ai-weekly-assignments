interface ToastProps {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    onClose: () => void;
}
export declare function Toast({ message, type, onClose }: ToastProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Toast.d.ts.map