import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

// ── Config ──────────────────────────────────────────────────────────────────
const CELL = 22; // size for positioning target nodes
const GAP  = 6;
const STEP = CELL + GAP;

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

interface Pixel {
  row: number;
  col: number;
  isLogo: boolean;
}

// Generate target positions for the Logo pixels
const LOGO_PIXELS: Pixel[] = [];
D_MAP.forEach((row, r) => row.forEach((v, c) => { if (v) LOGO_PIXELS.push({ row: r, col: c, isLogo: true }); }));
S_MAP.forEach((row, r) => row.forEach((v, c) => { if (v) LOGO_PIXELS.push({ row: r, col: c + 7, isLogo: true }); }));

const GRID_W = 12 * STEP - GAP;
const GRID_H =  7 * STEP - GAP;

// Find adjacent pairs for connections
const EDGES: { from: number; to: number }[] = [];
for (let i = 0; i < LOGO_PIXELS.length; i++) {
  for (let j = i + 1; j < LOGO_PIXELS.length; j++) {
    const p1 = LOGO_PIXELS[i];
    const p2 = LOGO_PIXELS[j];
    const sameLetter = (p1.col < 5 && p2.col < 5) || (p1.col >= 7 && p2.col >= 7);
    if (sameLetter) {
      const dist = Math.sqrt(Math.pow(p1.row - p2.row, 2) + Math.pow(p1.col - p2.col, 2));
      if (dist < 1.5) { // allow vertical, horizontal, diagonal
        EDGES.push({ from: i, to: j });
      }
    }
  }
}

interface ParticleData {
  id: number;
  isLogo: boolean;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  endX: number;
  endY: number;
  size: number;
  opacity: number;
}

interface ParticleLoadingScreenProps {
  onComplete: () => void;
}

export const ParticleLoadingScreen = ({ onComplete }: ParticleLoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRefRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [edges, setEdges] = useState<{ fromId: number; toId: number; key: string }[]>([]);

  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const centerX = W / 2;
    const centerY = H / 2;

    const offsetX = centerX - GRID_W / 2;
    const offsetY = centerY - GRID_H / 2;

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const list: ParticleData[] = [];

    // 1. Logo particles
    LOGO_PIXELS.forEach((pixel, i) => {
      const targetX = pixel.col * STEP + offsetX + CELL / 2;
      const targetY = pixel.row * STEP + offsetY + CELL / 2;
      list.push({
        id: i,
        isLogo: true,
        startX: rand(0, W),
        startY: rand(0, H),
        targetX,
        targetY,
        endX: targetX + rand(-W / 1.5, W / 1.5),
        endY: targetY + rand(-H / 1.5, H / 1.5),
        size: rand(5, 7),
        opacity: rand(0.7, 0.9),
      });
    });

    // 2. Ambient particles
    const numAmbient = 35;
    for (let i = 0; i < numAmbient; i++) {
      const startX = rand(0, W);
      const startY = rand(0, H);
      list.push({
        id: LOGO_PIXELS.length + i,
        isLogo: false,
        startX,
        startY,
        targetX: startX + rand(-60, 60), // slow drift
        targetY: startY + rand(-60, 60),
        endX: startX + rand(-W / 1.5, W / 1.5),
        endY: startY + rand(-H / 1.5, H / 1.5),
        size: rand(2.5, 4),
        opacity: rand(0.2, 0.5),
      });
    }

    setParticles(list);

    // Setup edge mappings
    const edgeList = EDGES.map((edge, idx) => ({
      fromId: edge.from,
      toId: edge.to,
      key: `edge-${idx}`,
    }));
    setEdges(edgeList);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const container = containerRef.current;
    const svg = svgRefRef.current;
    if (!container || !svg) return;

    let cancelled = false;

    // Grab elements
    const logoNodes = Array.from(svg.querySelectorAll('.logo-node'));
    const ambientNodes = Array.from(svg.querySelectorAll('.ambient-node'));
    const edgeLines = Array.from(svg.querySelectorAll('.constellation-edge'));

    // 1. Initial fade-in of nodes at scattered starting positions
    animate(logoNodes, {
      opacity: (el: any) => parseFloat(el.getAttribute('data-init-opacity') || '0.8'),
      r: (el: any) => parseFloat(el.getAttribute('data-init-size') || '6'),
      duration: 500,
      delay: ((_el: any, i: number, _l: number) => i * 8) as any,
      ease: 'easeOutQuad',
    });

    animate(ambientNodes, {
      opacity: (el: any) => parseFloat(el.getAttribute('data-init-opacity') || '0.4'),
      r: (el: any) => parseFloat(el.getAttribute('data-init-size') || '3'),
      duration: 600,
      delay: ((_el: any, i: number, _l: number) => i * 6) as any,
      ease: 'easeOutQuad',
    });

    // Slow ambient drifting
    ambientNodes.forEach(node => {
      const tx = parseFloat(node.getAttribute('data-target-x') || '0');
      const ty = parseFloat(node.getAttribute('data-target-y') || '0');
      animate(node, {
        cx: tx,
        cy: ty,
        duration: 3500,
        ease: 'linear',
      });
    });

    // 2. Trigger Convergence
    const t1 = setTimeout(() => {
      if (cancelled) return;

      let convergedCount = 0;
      logoNodes.forEach((node) => {
        const tx = parseFloat(node.getAttribute('data-target-x') || '0');
        const ty = parseFloat(node.getAttribute('data-target-y') || '0');
        animate(node, {
          cx: tx,
          cy: ty,
          duration: 950,
          ease: 'cubicBezier(0.16, 1, 0.3, 1)', // OutExpo snap
          onComplete: () => {
            convergedCount++;
            if (convergedCount === logoNodes.length) {
              if (cancelled) return;

              // 3. Connect constellation lines and Pulse logo nodes
              animate(edgeLines, {
                opacity: 0.35,
                duration: 400,
                ease: 'easeOutQuad',
              });

              animate(logoNodes, {
                r: (el: any) => parseFloat(el.getAttribute('data-init-size') || '6') * 1.35,
                opacity: 1,
                duration: 250,
                direction: 'alternate',
                loop: 2,
                ease: 'easeInOutSine',
                onComplete: () => {
                  if (cancelled) return;

                  // 4. Scatter/Dissolve
                  const t2 = setTimeout(() => {
                    if (cancelled) return;

                    // Scatter logo nodes
                    logoNodes.forEach(node => {
                      const ex = parseFloat(node.getAttribute('data-end-x') || '0');
                      const ey = parseFloat(node.getAttribute('data-end-y') || '0');
                      animate(node, {
                        cx: ex,
                        cy: ey,
                        opacity: 0,
                        r: 1,
                        duration: 650,
                        ease: 'easeInQuad',
                      });
                    });

                    // Scatter ambient nodes
                    ambientNodes.forEach(node => {
                      const ex = parseFloat(node.getAttribute('data-end-x') || '0');
                      const ey = parseFloat(node.getAttribute('data-end-y') || '0');
                      animate(node, {
                        cx: ex,
                        cy: ey,
                        opacity: 0,
                        r: 0.5,
                        duration: 800,
                        ease: 'easeInQuad',
                      });
                    });

                    // Fade lines out
                    animate(edgeLines, {
                      opacity: 0,
                      duration: 350,
                      ease: 'linear',
                    });

                    // 5. Fade container and trigger completion
                    const t3 = setTimeout(() => {
                      if (cancelled) return;
                      animate(container, {
                        opacity: 0,
                        duration: 350,
                        ease: 'linear',
                        onComplete: () => {
                          if (!cancelled) onComplete();
                        },
                      });
                    }, 650);
                    timers.push(t3);

                  }, 400); // hold completed logo briefly
                  timers.push(t2);
                }
              });
            }
          }
        });
      });
    }, 600);

    const timers = [t1];
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [particles]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-[#030d14] flex items-center justify-center overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: GRID_W * 2.8,
          height: GRID_H * 2.8,
          background: 'radial-gradient(ellipse, rgba(0,139,139,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* SVG Canvas for Constellation System */}
      <svg
        ref={svgRefRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      >
        {/* Edges */}
        {edges.map((edge) => {
          const fromNode = particles[edge.fromId];
          const toNode = particles[edge.toId];
          if (!fromNode || !toNode) return null;
          return (
            <line
              key={edge.key}
              className="constellation-edge"
              x1={fromNode.targetX}
              y1={fromNode.targetY}
              x2={toNode.targetX}
              y2={toNode.targetY}
              stroke="#00CED1"
              strokeWidth="1.2"
              opacity="0"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(0,206,209,0.4))',
              }}
            />
          );
        })}

        {/* Nodes */}
        {particles.map((p) => (
          <circle
            key={p.id}
            className={p.isLogo ? 'logo-node' : 'ambient-node'}
            cx={p.startX}
            cy={p.startY}
            r="0"
            fill={p.isLogo ? '#00CED1' : '#20B2AA'}
            opacity="0"
            data-init-size={p.size}
            data-init-opacity={p.opacity}
            data-target-x={p.targetX}
            data-target-y={p.targetY}
            data-end-x={p.endX}
            data-end-y={p.endY}
            style={{
              filter: p.isLogo ? 'drop-shadow(0 0 5px rgba(0,206,209,0.75))' : 'none',
            }}
          />
        ))}
      </svg>

      {/* Site URL Footer */}
      <p className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#008B8B]/40 select-none">
        deepshah1406.github.io
      </p>
    </div>
  );
};
