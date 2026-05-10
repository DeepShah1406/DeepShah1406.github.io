import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Info, Award, Zap, AlertCircle, FileText } from 'lucide-react';
import { useNotes, type NoteId } from '@/hooks/useNotes';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Terminal } from '../ui/Terminal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NoteViewerProps {
  content: string;
}

const Callout = ({ type, children }: { type: string, children: React.ReactNode }) => {
  const config: Record<string, { icon: any, className: string, label: string }> = {
    'ACHIEVEMENT': { icon: Award, className: 'bg-dracula-green/10 border-dracula-green text-dracula-green', label: 'Achievement' },
    'TECH_STACK': { icon: Zap, className: 'bg-dracula-cyan/10 border-dracula-cyan text-dracula-cyan', label: 'Tech Stack' },
    'INFO': { icon: Info, className: 'bg-dracula-purple/10 border-dracula-purple text-dracula-purple', label: 'Info' },
    'WARNING': { icon: AlertCircle, className: 'bg-dracula-orange/10 border-dracula-orange text-dracula-orange', label: 'Warning' },
  };

  const current = config[type.toUpperCase()] || config['INFO'];
  const Icon = current.icon;

  return (
    <div className={cn("border-l-4 p-4 my-6 rounded-r-md", current.className)}>
      <div className="flex items-center gap-2 mb-2 font-bold uppercase text-[10px] tracking-widest opacity-80">
        <Icon size={14} />
        <span>{current.label}</span>
      </div>
      <div className="text-sm leading-relaxed prose-p:my-0">
        {children}
      </div>
    </div>
  );
};

export const NoteViewer: React.FC<NoteViewerProps> = ({ content }) => {
  const { openNote } = useNotes();

  // Pre-process Wiki-links: [[NoteName]] -> [NoteName](#NoteName)
  const processedContent = content.replace(/\[\[(.*?)\]\]/g, '[$1](#$1)');

  return (
    <div className="prose prose-sm sm:prose-base prose-invert max-w-none 
      prose-headings:text-dracula-purple 
      prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
      prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-obsidian-border prose-h2:pb-2
      prose-p:text-obsidian-text prose-p:leading-relaxed prose-p:mb-4
      prose-li:text-obsidian-text-muted prose-li:my-1
      prose-strong:text-dracula-pink prose-strong:font-bold
      prose-code:text-dracula-yellow prose-code:bg-dracula-current/50 prose-code:px-1 prose-code:rounded
      prose-pre:bg-obsidian-sidebar prose-pre:border prose-pre:border-obsidian-border prose-pre:p-0
      prose-hr:border-obsidian-border prose-hr:my-12"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom blockquote for Callouts
          blockquote: ({ children }) => {
            const childrenArray = React.Children.toArray(children);
            const firstChild = childrenArray[1] as any;
            const textContent = firstChild?.props?.children?.[0] || '';
            
            if (typeof textContent === 'string' && textContent.startsWith('[!')) {
              const match = textContent.match(/^\[!(\w+)\]/);
              if (match) {
                const type = match[1];
                const newChildren = childrenArray.map((child, index) => {
                    if (index === 1) {
                        const p = child as any;
                        const pChildren = React.Children.toArray(p.props.children);
                        return React.cloneElement(p, {}, pChildren.slice(1));
                    }
                    return child;
                });
                return <Callout type={type}>{newChildren}</Callout>;
              }
            }
            return <blockquote className="border-l-4 border-dracula-comment pl-4 italic my-4 text-dracula-comment">{children}</blockquote>;
          },
          // Custom image renderer
          img: ({ src, alt, ...props }) => {
            if (alt === 'PROFILE') {
              return (
                <div className="float-none sm:float-right mx-auto sm:ml-8 mb-8 sm:mb-4 group relative w-max">
                  <img 
                    src={src} 
                    alt={alt}
                    className="w-32 sm:w-48 h-auto rounded-xl shadow-2xl filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-700 ease-in-out border border-obsidian-border group-hover:border-obsidian-accent"
                    {...props}
                  />
                  <div className="absolute inset-0 rounded-xl bg-obsidian-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              );
            }
            return <img src={src} alt={alt} className="rounded-lg border border-obsidian-border my-8 mx-auto w-full max-w-full" {...props} />;
          },
          // Custom link for Wiki-links and external links
          a: ({ href, children }) => {
            if (href?.startsWith('#')) {
              const label = href.slice(1);
              const id = label.toLowerCase().replace(/ /g, '_') as NoteId;
              
              return (
                <button 
                  onClick={() => openNote(id)}
                  className="inline-flex items-center gap-1 text-dracula-cyan hover:text-dracula-purple transition-colors border-b border-dracula-cyan/30 hover:border-dracula-purple font-medium"
                >
                  <FileText size={14} className="opacity-60" />
                  {children}
                </button>
              );
            }
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-dracula-cyan hover:text-dracula-purple underline transition-colors"
              >
                {children}
              </a>
            );
          },
          // Syntax highlighting wrapper
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            
            if (lang === 'terminal') {
                return <Terminal />;
            }
            
            if (lang) {
                return (
                    <div className="relative group overflow-x-auto no-scrollbar">
                        <div className="absolute top-0 right-0 px-2 py-1 text-[10px] font-bold uppercase text-obsidian-text-muted/50 bg-obsidian-border rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity">
                            {lang}
                        </div>
                        <code className={className} {...props}>
                            {children}
                        </code>
                    </div>
                );
            }
            return <code className={className} {...props}>{children}</code>;
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
