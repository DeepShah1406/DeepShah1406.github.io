import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

// ── Config ────────────────────────────────────────────────────────────────────
const CELL = 18;
const GAP  = 4;
const STEP = CELL + GAP;

// ── Pixel art (5 wide x 7 tall) ───────────────────────────────────────────────
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

// D: cols 0-4 | gap: cols 5-6 | S: cols 7-11
type Pixel = { row: number; col: number };
const PIXELS: Pixel[] = [];
D_MAP.forEach((row, r) => row.forEach((v, c) => { if (v) PIXELS.push({ row: r, col: c });     }));
S_MAP.forEach((row, r) => row.forEach((v, c) => { if (v) PIXELS.push({ row: r, col: c + 7 }); }));

const GRID_W = 12 * STEP - GAP;
const GRID_H =  7 * STEP - GAP;

const rand = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

// ── Component ─────────────────────────────────────────────────────────────────
interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const blocks = Array.from(
      overlay.querySelectorAll<HTMLElement>('.px-block')
    );
    if (blocks.length === 0) return;

    const n = blocks.length;
    const W = Math.round(window.innerWidth  * 0.45);
    const H = Math.round(window.innerHeight * 0.45);

    // Pre-compute all per-element random values upfront
    const startX    = blocks.map(() => rand(-W, W));
    const startY    = blocks.map(() => rand(-H, H));
    const inDelays  = blocks.map(() => Math.random() * n * 28);

    const scatterX  = blocks.map(() => rand(-Math.round(W * 1.8), Math.round(W * 1.8)));
    const scatterY  = blocks.map(() => rand(-Math.round(H * 1.8), Math.round(H * 1.8)));
    const outDelays = blocks.map(() => Math.random() * n * 14);

    const phase1End = Math.max(...inDelays)  + 900 + 80;
    const phase3End = Math.max(...outDelays) + 750 + 80;

    // -- Phase 1: fly in from random positions --------------------------------
    blocks.forEach((el, i) => {
      animate(el, {
        translateX: [startX[i], 0],
        translateY: [startY[i], 0],
        scale:      [0.3, 1],
        opacity:    [0, 1],
        duration:   900,
        delay:      inDelays[i],
        ease:       'outExpo',
      });
    });

    const t1 = setTimeout(() => {
      if (cancelled) return;

      // -- Phase 2: glow pulse ------------------------------------------------
      animate(blocks, {
        scale:    [1, 1.2, 1],
        opacity:  [1, 0.8, 1],
        duration: 450,
        ease:     'inOutSine',
        onComplete: () => {
          if (cancelled) return;

          // -- Phase 3: scatter outward & fade --------------------------------
          blocks.forEach((el, i) => {
            animate(el, {
              translateX: scatterX[i],
              translateY: scatterY[i],
              scale:      0.1,
              opacity:    0,
              duration:   750,
              delay:      outDelays[i],
              ease:       'inExpo',
            });
          });

          // -- Phase 4: fade overlay after scatter completes ------------------
          const t2 = setTimeout(() => {
            if (cancelled) return;
            animate(overlay, {
              opacity:    0,
              duration:   350,
              ease:       'linear',
              onComplete: () => { if (!cancelled) onComplete(); },
            });
          }, phase3End);

          timers.push(t2);
        },
      });
    }, phase1End);

    const timers = [t1];
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#030d14]"
    >
      {/* Ambient teal glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width:      GRID_W * 2.8,
          height:     GRID_H * 2.8,
          background: 'radial-gradient(ellipse, rgba(0,139,139,0.22) 0%, transparent 70%)',
          top:        '50%',
          left:       '50%',
          transform:  'translate(-50%, -50%)',
        }}
      />

      {/* Pixel DS grid */}
      <div className="relative" style={{ width: GRID_W, height: GRID_H }}>
        {PIXELS.map(({ row, col }, i) => (
          <div
            key={i}
            className="px-block absolute rounded-[2px]"
            style={{
              width:      CELL,
              height:     CELL,
              left:       col * STEP,
              top:        row * STEP,
              background: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)',
              boxShadow:  '0 0 10px rgba(0,206,209,0.55), 0 0 3px rgba(0,206,209,0.9)',
              opacity:    0,
            }}
          />
        ))}
      </div>

      {/* URL label */}
      <p className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#008B8B]/50 select-none">
        deepshah1406.github.io
      </p>
    </div>
  );
};
