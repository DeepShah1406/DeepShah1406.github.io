import { useEffect, useState, useMemo } from 'react';
import { Command } from 'cmdk';
import { useVaultStore } from '@/store/useVaultStore';
import { useNotes, type NoteId } from '@/hooks/useNotes';
import { Search, FileText, Download, Eye, EyeOff } from 'lucide-react';
import Fuse from 'fuse.js';

export const CommandPalette = () => {
  const [search, setSearch] = useState('');
  const { notes, toggleFocusMode, isFocusMode, isCommandPaletteOpen, setCommandPaletteOpen } = useVaultStore();
  const { openNote } = useNotes();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const onSelectNote = (id: NoteId) => {
    openNote(id);
    setCommandPaletteOpen(false);
    setSearch('');
  };

  const handleDownloadResume = () => {
    console.log('Downloading resume...');
    alert('Download Resume triggered! (Replace with actual PDF link)');
    setCommandPaletteOpen(false);
    setSearch('');
  };

  // 1. Fuzzy Search for Notes
  const noteList = useMemo(() => Object.values(notes), [notes]);
  const noteFuse = useMemo(() => {
    return new Fuse(noteList, {
      keys: ['id', 'title', 'tags', 'folder'],
      threshold: 0.3,
    });
  }, [noteList]);

  const filteredNotes = useMemo(() => {
    if (!search) return noteList;
    return noteFuse.search(search).map(result => result.item);
  }, [search, noteFuse, noteList]);

  // 2. Fuzzy Search for Actions
  const actions = useMemo(() => [
    { 
        id: 'toggle-focus', 
        label: isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode', 
        icon: isFocusMode ? Eye : EyeOff, 
        shortcut: 'F',
        perform: () => {
            toggleFocusMode();
            setCommandPaletteOpen(false);
            setSearch('');
        }
    },
    { 
        id: 'download-resume', 
        label: 'Download Resume (PDF)', 
        icon: Download, 
        perform: handleDownloadResume 
    }
  ], [isFocusMode, toggleFocusMode, setCommandPaletteOpen]);

  const actionFuse = useMemo(() => {
    return new Fuse(actions, {
        keys: ['label'],
        threshold: 0.4,
    });
  }, [actions]);

  const filteredActions = useMemo(() => {
    if (!search) return actions;
    return actionFuse.search(search).map(result => result.item);
  }, [search, actionFuse, actions]);

  return (
    <Command.Dialog
      open={isCommandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      shouldFilter={false}
      label="Global Command Palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-[640px] bg-obsidian-sidebar border border-obsidian-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center px-4 border-b border-obsidian-border">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-obsidian-accent" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search notes or commands..."
            className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-obsidian-text-muted disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-obsidian-border">
          {filteredNotes.length === 0 && filteredActions.length === 0 && (
            <Command.Empty className="py-6 text-center text-sm text-obsidian-text-muted">No results found.</Command.Empty>
          )}
          
          {filteredNotes.length > 0 && (
            <Command.Group heading="Notes" className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-obsidian-text-muted/50">
                {filteredNotes.map((note) => (
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
          )}

          {filteredNotes.length > 0 && filteredActions.length > 0 && <Command.Separator className="h-px bg-obsidian-border my-2" />}

          {filteredActions.length > 0 && (
            <Command.Group heading="Actions" className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-obsidian-text-muted/50">
                {filteredActions.map((action) => (
                    <Command.Item
                        key={action.id}
                        onSelect={action.perform}
                        className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer aria-selected:bg-obsidian-border aria-selected:text-obsidian-accent text-obsidian-text transition-colors"
                    >
                        <action.icon className="h-4 w-4" />
                        <span>{action.label}</span>
                        {action.shortcut && (
                            <kbd className="ml-auto text-[10px] font-mono bg-obsidian-bg px-1.5 py-0.5 rounded border border-obsidian-border">{action.shortcut}</kbd>
                        )}
                    </Command.Item>
                ))}
            </Command.Group>
          )}
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
