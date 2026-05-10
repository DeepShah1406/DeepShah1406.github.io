import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface HistoryItem {
  type: 'command' | 'response';
  content: React.ReactNode;
}

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'response', content: 'Welcome to the Obsidian Access Terminal v1.0.0' },
    { type: 'response', content: 'Type "help" to see available commands.' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.toLowerCase().trim();
    const newHistory: HistoryItem[] = [...history, { type: 'command', content: cmd }];

    switch (cleanCmd) {
      case 'help':
        newHistory.push({
          type: 'response',
          content: (
            <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 mt-2">
              <span className="text-obsidian-accent font-bold">whoami</span>
              <span className="text-obsidian-text-muted">Display profile summary</span>
              <span className="text-obsidian-accent font-bold">mail</span>
              <span className="text-obsidian-text-muted">Open default email client</span>
              <span className="text-obsidian-accent font-bold">clear</span>
              <span className="text-obsidian-text-muted">Clear terminal history</span>
              <span className="text-obsidian-accent font-bold">github</span>
              <span className="text-obsidian-text-muted">Open GitHub profile</span>
            </div>
          )
        });
        break;
      case 'whoami':
        newHistory.push({
          type: 'response',
          content: (
            <div className="mt-2 space-y-2">
              <p className="text-dracula-pink font-bold">Deep Ashishkumar Shah</p>
              <p className="text-sm">AI/ML Engineer specialized in GenAI & RAG.</p>
              <p className="text-xs opacity-60 italic">"Bridging the gap between complex models and automation."</p>
            </div>
          )
        });
        break;
      case 'mail':
        newHistory.push({ type: 'response', content: 'Opening email client...' });
        window.location.href = 'mailto:shahdeep1406@gmail.com';
        break;
      case 'github':
        newHistory.push({ type: 'response', content: 'Redirecting to github.com/DeepShah1406...' });
        window.open('https://github.com/DeepShah1406', '_blank');
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        break;
      default:
        newHistory.push({
          type: 'response',
          content: <span className="text-dracula-red">Command not found: {cmd}. Type "help" for a list of commands.</span>
        });
    }
    setHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput('');
  };

  return (
    <div 
      className="w-full bg-black/80 rounded-lg border border-obsidian-border overflow-hidden font-mono shadow-2xl"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-obsidian-sidebar px-4 py-2 border-b border-obsidian-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-obsidian-accent" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-obsidian-text-muted">Access Node Terminal</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-dracula-red/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-dracula-yellow/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-dracula-green/50" />
        </div>
      </div>

      {/* Terminal History */}
      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 space-y-2"
      >
        {history.map((item, i) => (
          <div key={i} className="flex gap-2 text-sm leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300">
            {item.type === 'command' && (
              <span className="text-dracula-green shrink-0">visitor@deepshah:~$</span>
            )}
            <div className="flex-1">
              {item.content}
            </div>
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-dracula-green shrink-0 text-sm">visitor@deepshah:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-obsidian-text caret-obsidian-accent"
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};
