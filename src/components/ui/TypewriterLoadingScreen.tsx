import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

interface TypewriterLoadingScreenProps {
  onComplete: () => void;
}

export const TypewriterLoadingScreen = ({ onComplete }: TypewriterLoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  const [activeCursor, setActiveCursor] = useState<1 | 2 | 3 | null>(1);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const line1 = "Deep Shah";
    const line2 = "AI/ML & Automation Engineer";
    const line3 = "System ready. Launching...";

    const progress1 = { value: 0 };
    const progress2 = { value: 0 };
    const progress3 = { value: 0 };

    // ── Helper to run typing animation ──
    const typeLine = (
      prog: { value: number },
      text: string,
      setter: (v: string) => void,
      charDuration: number
    ): Promise<void> => {
      return new Promise((resolve) => {
        animate(prog, {
          value: text.length,
          round: 1,
          duration: text.length * charDuration,
          ease: 'linear',
          update: () => {
            if (!cancelled) {
              setter(text.slice(0, Math.floor(prog.value)));
            }
          },
          onComplete: () => {
            resolve();
          },
        });
      });
    };

    const runSequence = async () => {
      // 1. Type line 1
      await typeLine(progress1, line1, setText1, 45);
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 200));
      if (cancelled) return;

      // Move cursor to line 2
      setActiveCursor(2);

      // 2. Type line 2
      await typeLine(progress2, line2, setText2, 35);
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 250));
      if (cancelled) return;

      // Move cursor to line 3
      setActiveCursor(3);

      // 3. Type line 3
      await typeLine(progress3, line3, setText3, 35);
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 450));
      if (cancelled) return;

      // Remove cursor
      setActiveCursor(null);

      // ── Phase 4: Dissolve & Fade Container ──
      // Fade out contents
      const content = container.querySelector('.terminal-content');
      if (content) {
        animate(content, {
          opacity: 0,
          scale: 0.95,
          duration: 350,
          ease: 'inQuad',
        });
      }

      // Fade out main container
      animate(container, {
        opacity: 0,
        duration: 350,
        delay: 50,
        ease: 'linear',
        onComplete: () => {
          if (!cancelled) onComplete();
        },
      });
    };

    runSequence();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-[#030d14] flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Inline styles for cursor blink animation */}
      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .term-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background-color: #00CED1;
          margin-left: 4px;
          vertical-align: middle;
          animation: terminal-blink 1s step-end infinite;
          box-shadow: 0 0 4px rgba(0,206,209,0.8);
        }
      `}</style>

      {/* Terminal Content Box */}
      <div className="terminal-content w-full max-w-md bg-[#051119]/80 border border-[#008B8B]/20 rounded-lg p-6 font-mono text-[13px] tracking-wide text-[#e0f7f7] shadow-2xl relative backdrop-blur-sm">
        {/* Terminal Header */}
        <div className="flex items-center gap-1.5 border-b border-[#008B8B]/10 pb-3 mb-4 select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="text-[10px] text-[#008B8B]/40 font-bold uppercase tracking-widest ml-auto">
            bash - deep_shah
          </span>
        </div>

        {/* Lines */}
        <div className="flex flex-col gap-2.5 min-h-[90px]">
          {/* Line 1 */}
          <div className="flex items-center min-h-[18px]">
            <span className="text-[#00CED1] font-bold select-none mr-2">{text1 || activeCursor === 1 ? '>' : ''}</span>
            <span>{text1}</span>
            {activeCursor === 1 && <span className="term-cursor" />}
          </div>

          {/* Line 2 */}
          <div className="flex items-center min-h-[18px]">
            <span className="text-[#00CED1] font-bold select-none mr-2">{text2 || activeCursor === 2 ? '>' : ''}</span>
            <span>{text2}</span>
            {activeCursor === 2 && <span className="term-cursor" />}
          </div>

          {/* Line 3 */}
          <div className="flex items-center min-h-[18px]">
            <span className="text-[#00CED1] font-bold select-none mr-2">{text3 || activeCursor === 3 ? '>' : ''}</span>
            <span>{text3}</span>
            {activeCursor === 3 && <span className="term-cursor" />}
          </div>
        </div>
      </div>

      {/* URL Footer */}
      <p className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#008B8B]/30 select-none pointer-events-none">
        deepshah1406.github.io
      </p>
    </div>
  );
};
