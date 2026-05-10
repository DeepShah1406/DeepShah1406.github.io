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
  Menu,
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
        "flex items-center gap-2 px-3 py-1.5 cursor-pointer rounded-md transition-all group",
        isActive ? "bg-obsidian-border text-obsidian-accent shadow-sm" : "hover:bg-obsidian-border/50 text-obsidian-text-muted",
        isMain && "py-3 my-1 bg-obsidian-accent/5 hover:bg-obsidian-accent/10"
      )}
    >
      <Icon size={isMain ? 20 : 16} className={cn(isMain && "text-obsidian-accent animate-pulse")} />
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
        className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-obsidian-border/30 rounded text-obsidian-text-muted/70 uppercase text-[10px] font-bold tracking-wider"
      >
        {isOpen ? <ChevronRight size={10} className="rotate-90" /> : <ChevronRight size={10} />}
        {title}
      </div>
      {isOpen && <div className="ml-2 mt-1">{children}</div>}
    </div>
  );
};

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar, isRightPanelOpen, toggleRightPanel, notes } = useVaultStore();
  const { activeNoteId } = useNotes();
  const activeNote = notes[activeNoteId || ''];
  const [isMobile, setIsMobile] = useState(false);
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-obsidian-border flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-obsidian-accent">
          <Command size={20} />
          <span>VAULT</span>
        </div>
        <Search size={16} className="text-obsidian-text-muted cursor-pointer hover:text-obsidian-accent" />
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-obsidian-border">
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

      <div className="p-4 border-t border-obsidian-border flex justify-between items-center text-obsidian-text-muted relative">
        <Settings 
          size={18} 
          className="cursor-pointer hover:text-obsidian-accent transition-colors" 
          onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
        />
        <Layout size={18} className="cursor-pointer hover:text-obsidian-accent transition-colors" />

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

  const MetadataContent = () => (
    <div className="flex flex-col h-full">
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
              {activeNote?.tags?.map(tag => (
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

      {/* Left Sidebar (250px) - DISABLED COLLAPSE ON DESKTOP */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isMobile ? (isSidebarOpen ? 250 : 0) : 250,
          x: isMobile && !isSidebarOpen ? -250 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "bg-obsidian-sidebar border-r border-obsidian-border h-full flex flex-col z-50",
          isMobile ? "fixed left-0 top-0 shadow-2xl" : "relative"
        )}
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Toolbar */}
        <header className="h-10 border-b border-obsidian-border flex items-center justify-between px-4 bg-obsidian-bg/50 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-2">
            {/* Show menu button ONLY on mobile or if collapse is needed elsewhere */}
            {isMobile && (
                <button 
                onClick={toggleSidebar} 
                className="p-1 hover:bg-obsidian-border rounded transition-colors"
                aria-label="Toggle Left Sidebar"
                >
                <Menu size={16} className={cn(!isSidebarOpen && "text-obsidian-accent")} />
                </button>
            )}
            <div className="text-xs text-obsidian-text-muted flex items-center gap-1 overflow-hidden">
              <span className="hidden sm:inline">vault</span>
              <ChevronRight size={10} className="hidden sm:inline" />
              <span className="truncate">{activeNote?.folder || 'root'}</span>
              <ChevronRight size={10} />
              <span className="text-obsidian-text font-medium truncate">{activeNoteId}.md</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleRightPanel} 
              className="p-1 hover:bg-obsidian-border rounded transition-colors"
              aria-label="Toggle Right Sidebar"
            >
              <Layout size={16} className={cn(!isRightPanelOpen && "text-obsidian-accent")} />
            </button>
          </div>
        </header>

        {/* Tab Bar */}
        <TabBar />

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-obsidian-border p-4 sm:p-8">
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
          "bg-obsidian-sidebar border-l border-obsidian-border h-full flex flex-col z-50",
          isMobile ? "fixed right-0 top-0 shadow-2xl" : "relative"
        )}
      >
        <MetadataContent />
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
