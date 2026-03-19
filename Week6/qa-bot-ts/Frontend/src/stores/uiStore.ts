import { create } from "zustand";

interface UIState {
    isSettingsModalOpen: boolean;
    isCandidateDialogOpen: boolean;
    selectedCandidateId: string | null;
    theme: "light" | "dark";

    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    openCandidateDialog: (candidateId: string) => void;
    closeCandidateDialog: () => void;
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
    isSettingsModalOpen: false,
    isCandidateDialogOpen: false,
    selectedCandidateId: null,
    theme: "light",

    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),
    openCandidateDialog: (candidateId) =>
        set({ isCandidateDialogOpen: true, selectedCandidateId: candidateId }),
    closeCandidateDialog: () =>
        set({ isCandidateDialogOpen: false, selectedCandidateId: null }),
    toggleTheme: () =>
        set((state) => ({
            theme: state.theme === "light" ? "dark" : "light",
        })),
    setTheme: (theme) => set({ theme }),
}));
