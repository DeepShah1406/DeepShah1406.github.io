import { create } from 'zustand';

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
}

interface VaultState {
  activeNoteId: string;
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  isFocusMode: boolean;
  theme: string;
  notes: Record<string, Note>;
  setActiveNote: (id: string) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  toggleFocusMode: () => void;
  setTheme: (theme: string) => void;
  setNotes: (notes: Record<string, Note>) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  activeNoteId: 'deep_shah',
  isSidebarOpen: true,
  isRightPanelOpen: true,
  isFocusMode: false,
  theme: localStorage.getItem('vault-theme') || 'default',
  notes: {},
  setActiveNote: (id) => set({ activeNoteId: id }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  toggleFocusMode: () => set((state) => {
    const nextFocusMode = !state.isFocusMode;
    return {
      isFocusMode: nextFocusMode,
      isSidebarOpen: nextFocusMode ? false : true,
      isRightPanelOpen: nextFocusMode ? false : true,
    };
  }),
  setTheme: (theme) => {
    localStorage.setItem('vault-theme', theme);
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
  setNotes: (notes) => set({ notes }),
}));
