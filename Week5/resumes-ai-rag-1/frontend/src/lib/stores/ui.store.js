import { create } from 'zustand';
export const useUiStore = create((set) => ({
    isMobile: false,
    isSidebarOpen: false,
    setIsMobile: (v) => set({ isMobile: v }),
    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
    openSidebar: () => set({ isSidebarOpen: true }),
}));
//# sourceMappingURL=ui.store.js.map