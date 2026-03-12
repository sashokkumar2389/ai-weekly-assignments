interface UiState {
    isMobile: boolean;
    isSidebarOpen: boolean;
    setIsMobile: (v: boolean) => void;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    openSidebar: () => void;
}
export declare const useUiStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UiState>>;
export {};
//# sourceMappingURL=ui.store.d.ts.map