import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';

// ── Config ──────────────────────────────────────────────────────────────────
const COLS = 12;
const ROWS = 8;

const D_MAP = [
  [1,1,1,1,0],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,1,1,1,0],
];
const S_MAP = [
  [0,1,1,1,1],
  [1,0,0,0,0],
  [1,0,0,0,0],
  [0,1,1,1,0],
  [0,0,0,0,1],
  [0,0,0,0,1],
  [1,1,1,1,0],
];

interface BlockData {
  id: number;
  row: number;
  col: number;
  isLogo: boolean;
}

export const GridRevealLoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  useEffect(() => {
    const list: BlockData[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        // Map D and S onto the grid.
        // Row 0 is empty padding, rows 1-7 map to D_MAP/S_MAP rows 0-6.
        const logoRow = r - 1;
        let isLogo = false;

        if (logoRow >= 0 && logoRow < 7) {
          if (c < 5) {
            isLogo = D_MAP[logoRow][c] === 1;
          } else if (c >= 7 && c < 12) {
            isLogo = S_MAP[logoRow][c - 7] === 1;
          }
        }

        list.push({
          id: r * COLS + c,
          row: r,
          col: c,
          isLogo,
        });
      }
    }
    setBlocks(list);
  }, []);

  useEffect(() => {
    if (blocks.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    const gridBlocks = Array.from(container.querySelectorAll('.grid-block'));

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    // ── Phase 1: Build Up (Ripple pop-in from center) ──
    animate(gridBlocks, {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 650,
      delay: stagger(30, { grid: [COLS, ROWS], from: 'center' }) as any,
      ease: 'easeOutBack',
      onComplete: () => {
        if (cancelled) return;

        // Grab only the logo blocks for the pulse
        const logoBlocks = Array.from(container.querySelectorAll('.grid-block[data-is-logo="true"]'));

        // ── Phase 2: Logo Pulse ──
        animate(logoBlocks, {
          scale: [1, 1.15, 1],
          backgroundColor: ['#00CED1', '#e0f7f7', '#00CED1'],
          duration: 500,
          delay: stagger(15, { from: 'center' }) as any,
          ease: 'easeInOutSine',
          onComplete: () => {
            if (cancelled) return;

            // ── Phase 3 & 4: Shatter Grid & Fade Container ──
            const t1 = setTimeout(() => {
              if (cancelled) return;

              // Shatter blocks outward
              animate(gridBlocks, {
                scale: 0,
                opacity: 0,
                translateX: () => rand(-350, 350),
                translateY: () => rand(-350, 350),
                rotate: () => rand(-180, 180),
                duration: 850,
                delay: stagger(20, { grid: [COLS, ROWS], from: 'center' }) as any,
                ease: 'easeInQuad',
              });

              // Fade background container
              animate(container, {
                opacity: 0,
                duration: 650,
                delay: 200, // start slightly after shatter starts
                ease: 'linear',
                onComplete: () => {
                  if (!cancelled) onComplete();
                },
              });
            }, 500); // hold fully built grid for 500ms
            timers.push(t1);
          }
        });
      }
    });

    const timers: any[] = [];
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [blocks]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-[#030d14] flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 grid h-full w-full gap-[1px] bg-black"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {blocks.map((b) => (
          <div
            key={b.id}
            className="grid-block"
            data-is-logo={b.isLogo}
            style={{
              backgroundColor: b.isLogo ? '#00CED1' : '#051119',
              boxShadow: b.isLogo ? '0 0 15px rgba(0,206,209,0.5), inset 0 0 5px rgba(0,206,209,0.2)' : 'none',
              transform: 'scale(0)',
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* URL Footer */}
      <p className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#008B8B]/40 select-none pointer-events-none z-[1000]">
        deepshah1406.github.io
      </p>
    </div>
  );
};
