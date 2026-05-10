import { useVaultStore } from '@/store/useVaultStore';
import { Palette, Check, X } from 'lucide-react';

const THEMES = [
  { id: 'default', label: 'Obsidian', colors: ['#1e1e1e', '#bd93f9'] },
  { id: 'dracula', label: 'Dracula', colors: ['#282a36', '#ff79c6'] },
  { id: 'nord', label: 'Nordic Ice', colors: ['#2e3440', '#88c0d0'] },
  { id: 'solarized', label: 'Solarized Deep', colors: ['#002b36', '#b58900'] },
  { id: 'everforest', label: 'Everforest', colors: ['#2b3339', '#a7c080'] },
  { id: 'paper', label: 'Paper White', colors: ['#ffffff', '#3b82f6'] },
  { id: 'midnight', label: 'Midnight (OLED)', colors: ['#000000', '#ffffff'] },
];

export const ThemeSwitcher = ({ onClose }: { onClose: () => void }) => {
  const { theme: currentTheme, setTheme } = useVaultStore();

  return (
    <div className="p-4 w-64 bg-obsidian-sidebar border border-obsidian-border rounded-lg shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-obsidian-text-muted">
          <Palette size={14} className="text-obsidian-accent" />
          Appearance
        </div>
        <button onClick={onClose} className="text-obsidian-text-muted hover:text-obsidian-accent transition-colors">
          <X size={14} />
        </button>
      </div>
      
      <div className="space-y-1">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
              currentTheme === theme.id 
                ? 'bg-obsidian-accent/10 text-obsidian-accent' 
                : 'hover:bg-obsidian-border text-obsidian-text-muted hover:text-obsidian-text'
            }`}
          >
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full border border-obsidian-border" style={{ backgroundColor: theme.colors[0] }} />
              <div className="w-3 h-3 rounded-full border border-obsidian-border" style={{ backgroundColor: theme.colors[1] }} />
            </div>
            <span className="text-sm font-medium">{theme.label}</span>
            {currentTheme === theme.id && <Check size={14} className="ml-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
};
