import React, { useState, useEffect } from 'react';
import { useVaultStore } from '@/store/useVaultStore';
import { useNotes, type NoteId } from '@/hooks/useNotes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Settings, 
  ChevronRight,
  Command,
  Info,
  Layers,
  Zap,
  History,
  Award,
  Send,
  X,
  Layout
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NavItem = ({ icon: Icon, label, id, isMain }: { icon: any, label: string, id: NoteId, isMain?: boolean }) => {
  const { activeNoteId, openNote } = useNotes();
  const isActive = activeNoteId === id;

  return (
    <div 
      onClick={() => openNote(id)}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md transition-all group overflow-hidden",
        isActive ? "bg-obsidian-border text-obsidian-accent shadow-sm" : "hover:bg-obsidian-border/50 text-obsidian-text-muted",
        isMain && "py-3 my-1 bg-obsidian-accent/5 hover:bg-obsidian-accent/10"
      )}
    >
      <Icon size={isMain ? 20 : 16} className={cn("shrink-0", isMain && "text-obsidian-accent animate-pulse")} />
      <span className={cn(
        "truncate transition-all",
        isMain ? "text-base font-bold tracking-tight text-obsidian-text group-hover:text-obsidian-accent" : "text-sm"
      )}>
        {label}
      </span>
    </div>
  );
};

const TabBar = () => {
  const { openTabs, activeNoteId, setActiveNote, closeNote } = useNotes();

  return (
    <div className="flex bg-obsidian-sidebar border-b border-obsidian-border overflow-x-auto no-scrollbar scroll-smooth">
      {openTabs.map((id) => (
        <div 
          key={id}
          onClick={() => setActiveNote(id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-obsidian-border min-w-[120px] max-w-[200px] transition-colors relative group shrink-0",
            activeNoteId === id ? "bg-obsidian-bg text-obsidian-accent" : "hover:bg-obsidian-border/30 text-obsidian-text-muted"
          )}
        >
          <FileText size={14} className={cn(activeNoteId === id ? "text-obsidian-accent" : "text-obsidian-text-muted")} />
          <span className="text-xs truncate">{id}.md</span>
          <X 
            size={12} 
            className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-obsidian-border p-0.5 rounded transition-all"
            onClick={(e) => {
              e.stopPropagation();
              closeNote(id);
            }}
          />
          {activeNoteId === id && (
            <motion.div 
              layoutId="activeTab"
              className="absolute top-0 left-0 w-full h-0.5 bg-obsidian-accent" 
            />
          )}
        </div>
      ))}
    </div>
  );
};

const FolderSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-4">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-obsidian-border/30 rounded text-obsidian-text-muted/70 uppercase text-[10px] font-bold tracking-wider overflow-hidden"
      >
        <ChevronRight size={10} className={cn("shrink-0 transition-transform", isOpen && "rotate-90")} />
        <span className="truncate">{title}</span>
      </div>
      {isOpen && <div className="ml-2 mt-1">{children}</div>}
    </div>
  );
};

const SidebarContent = ({ 
    isSidebarOpen, 
    toggleSidebar, 
    showThemeSwitcher, 
    setShowThemeSwitcher,
    setCommandPaletteOpen
}: { 
    isSidebarOpen: boolean, 
    toggleSidebar: () => void, 
    showThemeSwitcher: boolean, 
    setShowThemeSwitcher: (val: boolean) => void,
    setCommandPaletteOpen: (val: boolean) => void
}) => (
  <div className="flex flex-col h-full overflow-hidden">
    <div className="p-4 border-b border-obsidian-border flex items-center justify-between min-h-[57px]">
      <div className="flex items-center gap-2 font-bold text-obsidian-accent text-sm sm:text-base overflow-hidden text-nowrap">
        <Command size={20} className="shrink-0" />
        {isSidebarOpen && (
            <span className="truncate whitespace-nowrap">PORTFOLIO</span>
        )}
      </div>
      <div className="flex items-center gap-1">
          <Search 
            size={16} 
            className="text-obsidian-text-muted cursor-pointer hover:text-obsidian-accent shrink-0" 
            onClick={() => setCommandPaletteOpen(true)}
          />
          <button 
              onClick={toggleSidebar}
              className="p-1 hover:bg-obsidian-border rounded transition-colors text-obsidian-text-muted hover:text-obsidian-accent shrink-0"
              title="Collapse Sidebar"
          >
              <Layout size={16} className="rotate-180" />
          </button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-obsidian-border overflow-x-hidden">
      <FolderSection title="00 - Identity">
        <NavItem icon={Info} label="Deep_Shah.md" id="deep_shah" isMain={true} />
        <NavItem icon={FileText} label="Resume_Snapshot.md" id="resume_snapshot" />
      </FolderSection>

      <FolderSection title="01 - Skills">
        <NavItem icon={Layers} label="Python.md" id="python" />
        <NavItem icon={Layers} label="GenAI_RAG.md" id="genai_rag" />
        <NavItem icon={Layers} label="Automation.md" id="automation" />
        <NavItem icon={Layers} label="Linux_Docker.md" id="linux_docker" />
      </FolderSection>

      <FolderSection title="02 - Builds">
        <NavItem icon={Zap} label="Railway_Safety_AI.md" id="railway_safety_ai" />
        <NavItem icon={Zap} label="Mental_Health_Chatbot.md" id="mental_health_chatbot" />
        <NavItem icon={Zap} label="Company_RAG.md" id="company_rag_chatbot" />
        <NavItem icon={Zap} label="Movie_Rec.md" id="movie_rec_chatbot" />
        <NavItem icon={Zap} label="College_RAG.md" id="college_rag_chatbot" />
        <NavItem icon={Zap} label="n8n_Business.md" id="n8n_business_automations" />
        <NavItem icon={Zap} label="Under_Construction.md" id="under_construction_completed" />
        <NavItem icon={Zap} label="Autism_ML_Study.md" id="autism_ml_study" />
      </FolderSection>

      <FolderSection title="03 - Logs">
        <NavItem icon={History} label="Experience_Log.md" id="experience_log" />
        <NavItem icon={History} label="Execution_Logs.md" id="execution_logs" />
      </FolderSection>

      <FolderSection title="04 - Proof">
        <NavItem icon={Award} label="Impact_Record.md" id="impact_record" />
        <NavItem icon={Award} label="Certifications.md" id="certifications" />
      </FolderSection>

      <FolderSection title="05 - Access">
        <NavItem icon={Send} label="Contact_Node.md" id="contact_node" />
      </FolderSection>
    </div>

    <div className="p-4 border-t border-obsidian-border flex justify-between items-center text-obsidian-text-muted relative min-h-[50px]">
      <Settings 
        size={18} 
        className="cursor-pointer hover:text-obsidian-accent transition-colors shrink-0" 
        onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
      />
      <AnimatePresence>
        {showThemeSwitcher && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-4 mb-2 z-[60]"
          >
            <ThemeSwitcher onClose={() => setShowThemeSwitcher(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const MetadataContent = ({ activeNote }: { activeNote: any }) => (
  <div className="flex flex-col h-full overflow-hidden">
    <div className="p-4 border-b border-obsidian-border font-bold text-xs uppercase tracking-widest text-obsidian-text-muted">
      Metadata
    </div>
    <div className="p-4 overflow-y-auto flex-1">
      <div className="space-y-6">
        <div>
          <label className="text-[10px] text-obsidian-text-muted uppercase font-bold tracking-tighter">Properties</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-obsidian-text-muted">Created</span>
              <span className="text-obsidian-text italic opacity-60">2026-05-09</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-obsidian-text-muted">Status</span>
              <span className="px-1.5 py-0.5 bg-obsidian-accent/10 text-obsidian-accent rounded text-[10px] uppercase font-bold">Stable</span>
            </div>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-obsidian-text-muted uppercase font-bold tracking-tighter">Tags</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {activeNote?.tags?.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 bg-obsidian-accent/10 text-obsidian-accent rounded text-xs hover:bg-obsidian-accent/20 cursor-pointer transition-colors">
                {tag}
              </span>
            )) || <span className="text-xs text-obsidian-text-muted/50 italic">No tags</span>}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-obsidian-text-muted uppercase font-bold tracking-tighter">Backlinks</label>
          <div className="mt-2 text-sm text-obsidian-text-muted/60 italic">No backlinks found.</div>
        </div>
      </div>
    </div>
  </div>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    isRightPanelOpen, 
    toggleRightPanel, 
    notes, 
    setCommandPaletteOpen 
  } = useVaultStore();
  const { activeNoteId } = useNotes();
  const activeNote = notes[activeNoteId || ''];
  const [isMobile, setIsMobile] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile && isSidebarOpen) toggleSidebar();
        if (mobile && isRightPanelOpen) toggleRightPanel();
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-full w-full bg-obsidian-bg text-obsidian-text overflow-hidden font-sans relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar - Now fully collapses to 0 */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 250 : 0,
          x: isMobile && !isSidebarOpen ? -250 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "bg-obsidian-sidebar border-r border-obsidian-border h-full flex flex-col z-50 overflow-hidden",
          isMobile ? "fixed left-0 top-0 shadow-2xl" : "relative"
        )}
      >
        <SidebarContent 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            showThemeSwitcher={showThemeSwitcher} 
            setShowThemeSwitcher={setShowThemeSwitcher} 
            setCommandPaletteOpen={setCommandPaletteOpen}
        />
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Toolbar */}
        <header className="h-10 border-b border-obsidian-border flex items-center justify-between px-2 sm:px-4 bg-obsidian-bg/50 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {/* Show toggle button when sidebar is closed (matches Right side behavior) */}
            {(isMobile || !isSidebarOpen) && (
                <button 
                onClick={toggleSidebar} 
                className="p-1 hover:bg-obsidian-border rounded transition-colors shrink-0 text-obsidian-accent"
                aria-label="Expand Left Sidebar"
                >
                <Layout size={16} className={cn(isMobile ? "" : "rotate-180")} />
                </button>
            )}
            <div className="text-[10px] sm:text-xs text-obsidian-text-muted flex items-center gap-1 overflow-hidden">
              <span className="hidden sm:inline">vault</span>
              <ChevronRight size={10} className="hidden sm:inline" />
              <span className="truncate">{activeNote?.folder || 'root'}</span>
              <ChevronRight size={10} />
              <span className="text-obsidian-text font-medium truncate">{activeNoteId}.md</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={toggleRightPanel} 
              className="p-1 hover:bg-obsidian-border rounded transition-colors"
              aria-label="Toggle Right Sidebar"
              title="Toggle Metadata Panel"
            >
              <Layout size={16} className={cn(!isRightPanelOpen && "text-obsidian-accent")} />
            </button>
          </div>
        </header>

        {/* Tab Bar */}
        <TabBar />

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-obsidian-border p-3 sm:p-8">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Right Sidebar (300px) */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isRightPanelOpen ? 300 : 0,
          x: isMobile && !isRightPanelOpen ? 300 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "bg-obsidian-sidebar border-l border-obsidian-border h-full flex flex-col z-50 overflow-hidden",
          isMobile ? "fixed right-0 top-0 shadow-2xl" : "relative"
        )}
      >
        <MetadataContent activeNote={activeNote} />
      </motion.aside>

      {/* Mobile Right Panel Overlay */}
      <AnimatePresence>
        {isMobile && isRightPanelOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleRightPanel}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
