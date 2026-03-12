import { create } from 'zustand';

interface UiState {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsMobile: (v: boolean) => void;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobile: false,
  isSidebarOpen: false,
  setIsMobile: (v) => set({ isMobile: v }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
}));
