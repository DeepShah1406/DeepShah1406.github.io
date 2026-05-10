import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useVaultStore } from '@/store/useVaultStore';
import { useNotes, type NoteId } from '@/hooks/useNotes';
import { Search, FileText, Download, Eye, EyeOff } from 'lucide-react';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { notes, toggleFocusMode, isFocusMode } = useVaultStore();
  const { openNote } = useNotes();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const onSelectNote = (id: NoteId) => {
    openNote(id);
    setOpen(false);
  };

  const handleDownloadResume = () => {
    console.log('Downloading resume...');
    alert('Download Resume triggered! (Replace with actual PDF link)');
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-[640px] bg-obsidian-sidebar border border-obsidian-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center px-4 border-b border-obsidian-border">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-obsidian-accent" />
          <Command.Input
            placeholder="Search notes or commands..."
            className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-obsidian-text-muted disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-obsidian-border">
          <Command.Empty className="py-6 text-center text-sm text-obsidian-text-muted">No results found.</Command.Empty>
          
          <Command.Group heading="Notes" className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-obsidian-text-muted/50">
            {Object.values(notes).map((note) => (
              <Command.Item
                key={note.id}
                onSelect={() => onSelectNote(note.id as NoteId)}
                className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer aria-selected:bg-obsidian-border aria-selected:text-obsidian-accent text-obsidian-text transition-colors"
              >
                <FileText size={16} />
                <span>{note.id}.md</span>
                <span className="ml-auto text-[10px] opacity-40">{note.folder}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator className="h-px bg-obsidian-border my-2" />

          <Command.Group heading="Actions" className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-obsidian-text-muted/50">
            <Command.Item
              onSelect={() => {
                toggleFocusMode();
                setOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer aria-selected:bg-obsidian-border aria-selected:text-obsidian-accent text-obsidian-text transition-colors"
            >
              {isFocusMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}</span>
              <kbd className="ml-auto text-[10px] font-mono bg-obsidian-bg px-1.5 py-0.5 rounded border border-obsidian-border">F</kbd>
            </Command.Item>
            
            <Command.Item
              onSelect={handleDownloadResume}
              className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer aria-selected:bg-obsidian-border aria-selected:text-obsidian-accent text-obsidian-text transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Resume (PDF)</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
