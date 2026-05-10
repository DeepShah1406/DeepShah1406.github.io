import { create } from 'zustand';

export type NoteId = 
  | 'deep_shah'
  | 'resume_snapshot'
  | 'python'
  | 'genai_rag'
  | 'automation'
  | 'linux_docker'
  | 'railway_safety_ai'
  | 'autism_ml_study'
  | 'mental_health_chatbot'
  | 'company_rag_chatbot'
  | 'movie_rec_chatbot'
  | 'college_rag_chatbot'
  | 'n8n_business_automations'
  | 'under_construction_completed'
  | 'experience_log'
  | 'execution_logs'
  | 'impact_record'
  | 'certifications'
  | 'contact_node';

interface NotesState {
  openTabs: NoteId[];
  activeNoteId: NoteId | null;
  openNote: (id: NoteId) => void;
  closeNote: (id: NoteId) => void;
  setActiveNote: (id: NoteId) => void;
}

export const useNotes = create<NotesState>((set) => ({
  openTabs: ['deep_shah'],
  activeNoteId: 'deep_shah',

  openNote: (id) => set((state) => {
    const isTabOpen = state.openTabs.includes(id);
    const newTabs = isTabOpen ? state.openTabs : [...state.openTabs, id];
    return {
      openTabs: newTabs,
      activeNoteId: id,
    };
  }),

  closeNote: (id) => set((state) => {
    const newTabs = state.openTabs.filter((tabId) => tabId !== id);
    let newActiveId = state.activeNoteId;
    
    // If we closed the active tab, switch to the last available tab
    if (state.activeNoteId === id) {
      newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1] : null;
    }

    return {
      openTabs: newTabs,
      activeNoteId: newActiveId,
    };
  }),

  setActiveNote: (id) => set({ activeNoteId: id }),
}));
