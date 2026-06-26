import React, { useState, useEffect, useRef } from 'react';
import { CanvasScratchMask } from '../components/ui/CanvasScratchMask';
import { InteractiveNodeGrid } from '../components/ui/InteractiveNodeGrid';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface CreativePageProps {
  onBack: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const CreativePage: React.FC<CreativePageProps> = ({ onBack }) => {
  const [activeTheme, setActiveTheme] = useState<'retro' | 'cosmic'>('retro');
  const [isGridZoomed, setIsGridZoomed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [gridTilt, setGridTilt] = useState({ x: 0, y: 0 });
  const [logs, setLogs] = useState<string[]>([
    '// INITIALIZING SYSTEM CODES...',
    '// ESTABLISHING CONNECTION TO NEURAL DECK...',
    `// SYS_DECRYPT_MODE: RETRO MATRIX`
  ]);

  // Custom Cursor References
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const velocity = useRef(0);
  const angle = useRef(0);
  const isHoveringMagnetic = useRef(false);
  const magneticTarget = useRef<HTMLElement | null>(null);

  // Toggle Theme between Retro Matrix and Cosmic Cybernet
  const toggleTheme = () => {
    const nextTheme = activeTheme === 'retro' ? 'cosmic' : 'retro';
    setActiveTheme(nextTheme);
    triggerGlitch();
    setLogs((prev) => [
      ...prev.slice(-3),
      `// THEME_SWITCH: LOAD ${nextTheme.toUpperCase()}_INTERFACE`
    ]);
  };

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 280);
  };

  const handleZoomChange = (zoomed: boolean) => {
    setIsGridZoomed(zoomed);
    triggerGlitch();
    setLogs((prev) => [
      ...prev.slice(-3),
      zoomed ? `// FOCUS_NODE: TARGET_ACQUIRED` : `// COLLAPSE_VIEW: ZOOM_OUT_COMPLETE`
    ]);
  };

  // Live Terminal Log Stream
  useEffect(() => {
    const logPool = [
      '// SYS_LOAD: 34.8% -- SECURE',
      '// CORE_TEMP: 41°C -- PASSIVE',
      '// DATA_FLOW: INCOMING STREAMS',
      '// HUD_RE_CALIBRATION: ACTIVE',
      '// SYSTEM_KEY: VERIFIED',
      '// DEC_STRENGTH: 98.4%',
      '// NODE_ADDRESS: ALLOCATED',
      '// PACKET_TRANSIT: COMPLETE',
      '// GRID_PERSPECTIVE: 3D_PAN_ON',
      '// AI_MODEL_STREAM: DOCK_SYNCED'
    ];
    const interval = setInterval(() => {
      const nextLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLogs((prev) => [...prev.slice(-3), `[${timeStr}] ${nextLog}`]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Parallax Tilt & Magnetic Hover listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Calculate 3D perspective warp coordinates
      const rx = (e.clientY - window.innerHeight / 2) * -0.04;
      const ry = (e.clientX - window.innerWidth / 2) * 0.04;
      setGridTilt({ x: rx, y: ry });

      const target = e.target as HTMLElement;
      const magneticEl = target.closest('[data-magnetic]');
      if (magneticEl) {
        isHoveringMagnetic.current = true;
        magneticTarget.current = magneticEl as HTMLElement;
      } else {
        isHoveringMagnetic.current = false;
        magneticTarget.current = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId: number;

    const updateCursor = () => {
      const dot = cursorDotRef.current;
      const ring = cursorRingRef.current;
      const label = cursorLabelRef.current;
      if (!dot || !ring) {
        rafId = requestAnimationFrame(updateCursor);
        return;
      }

      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      if (isHoveringMagnetic.current && magneticTarget.current) {
        const rect = magneticTarget.current.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      // Smooth lag interpolation
      const dx = targetX - currentPos.current.x;
      const dy = targetY - currentPos.current.y;

      currentPos.current.x += dx * 0.16;
      currentPos.current.y += dy * 0.16;

      const dist = Math.sqrt(dx * dx + dy * dy);
      velocity.current += (dist - velocity.current) * 0.1;
      angle.current = Math.atan2(dy, dx);

      const angleDeg = (angle.current * 180) / Math.PI;

      // Stretch values for gooey effect
      const stretch = 1 + Math.min(velocity.current * 0.015, 0.6);
      const squeeze = 1 / stretch;

      if (isHoveringMagnetic.current && magneticTarget.current) {
        const el = magneticTarget.current;
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) + 16;
        
        // Snapped HUD Crosshair (deactivate gooey filter)
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.transform = `translate3d(${rect.left + rect.width / 2}px, ${rect.top + rect.height / 2}px, 0)`;
        dot.style.background = activeTheme === 'retro' ? '#00CED1' : '#20B2AA';
        dot.style.boxShadow = `0 0 10px ${activeTheme === 'retro' ? '#00CED1' : '#20B2AA'}`;
        dot.style.marginLeft = '-2px';
        dot.style.marginTop = '-2px';

        ring.style.opacity = '1';
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
        ring.style.transform = `translate3d(${rect.left + rect.width / 2}px, ${rect.top + rect.height / 2}px, 0) rotate(45deg)`;
        ring.style.marginLeft = `-${size / 2}px`;
        ring.style.marginTop = `-${size / 2}px`;
        ring.style.borderColor = activeTheme === 'retro' ? '#00CED1' : '#20B2AA';
        ring.classList.add('hud-locked');

        if (label) {
          label.style.opacity = '1';
          label.innerText = el.classList.contains('schematic-node') || el.closest('.schematic-node') ? '[ ACCESS ]' : '[ SELECT ]';
        }
      } else {
        // Standard Liquid Pointer (activate gooey filter)
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
        dot.style.background = activeTheme === 'retro' ? '#00CED1' : '#20B2AA';
        dot.style.border = 'none';
        dot.style.borderRadius = '50%';
        dot.style.boxShadow = `0 0 10px ${activeTheme === 'retro' ? '#00CED1' : '#20B2AA'}`;
        dot.style.marginLeft = '-6px';
        dot.style.marginTop = '-6px';

        ring.style.opacity = '0.7';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) rotate(${angleDeg}deg) scale(${stretch}, ${squeeze})`;
        ring.style.marginLeft = '-18px';
        ring.style.marginTop = '-18px';
        ring.style.borderColor = 'transparent';
        ring.style.background = activeTheme === 'retro' ? 'rgba(0, 206, 209, 0.45)' : 'rgba(32, 178, 170, 0.45)';
        ring.classList.remove('hud-locked');

        if (label) {
          label.style.opacity = '0';
        }
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [activeTheme]);

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-[#02080c] select-none text-white font-mono transition-all duration-300 ${glitchActive ? 'cyber-glitch' : ''}`}>
      
      {/* LOCAL STYLES: Glitches, Scanlines, Oscilloscopes, Gooey Filters */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes glitch-anim {
          0% { clip-path: inset(40% 0 61% 0); transform: skew(0.5deg); filter: hue-rotate(90deg); }
          20% { clip-path: inset(92% 0 1% 0); transform: skew(-0.8deg); }
          40% { clip-path: inset(15% 0 80% 0); transform: skew(1.2deg); filter: invert(0.05); }
          60% { clip-path: inset(80% 0 5% 0); transform: skew(-0.3deg); }
          80% { clip-path: inset(5% 0 92% 0); transform: skew(0.8deg); }
          100% { clip-path: inset(40% 0 61% 0); transform: skew(0deg); }
        }
        .cyber-glitch {
          animation: glitch-anim 0.25s linear;
        }

        .scanlines {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.3) 50%
          ), linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.03), 
            rgba(0, 255, 0, 0.01), 
            rgba(0, 0, 255, 0.03)
          );
          background-size: 100% 4px, 6px 100%;
        }

        @keyframes wave-shift {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -120; }
        }
        .animate-wave {
          stroke-dasharray: 8, 4;
          animation: wave-shift 6s linear infinite;
        }

        @keyframes rotate-compass {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-compass {
          transform-origin: center;
          animation: rotate-compass 25s linear infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
      `}} />

      {/* SVG Gooey Liquid Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Background Decrypt Scratch Canvas */}
      <CanvasScratchMask activeTheme={activeTheme} />

      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines z-10 opacity-70" />

      {/* Grid Overlay for Cyberpunk/Scifi radial fade */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_15%,#02080c_90%)] opacity-85 z-10" />

      {/* Main HUD overlay */}
      <div className="absolute inset-0 z-20 flex flex-col pointer-events-none">
        
        {/* Header HUD */}
        <header className="w-full flex items-center justify-between px-6 py-6 pointer-events-auto">
          {/* Back button */}
          <button
            onClick={onBack}
            data-magnetic
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-[#7fb3b3] hover:text-white hover:border-[#00CED1]/50 hover:shadow-[0_0_15px_rgba(0,206,209,0.15)] transition-all duration-300 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Portal
          </button>

          {/* Center HUD status */}
          <div className={`hidden md:flex flex-col items-center gap-1 select-none transition-opacity duration-300 ${isGridZoomed ? 'opacity-0' : 'opacity-100'}`}>
            <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white">
              DEEP SHAH : CREATIVE INTERFACE
            </span>
            <span className="text-[8px] text-[#7fb3b3] tracking-widest animate-pulse">
              [ MOUSE/TOUCH DRAW TO DECRYPT GRID ]
            </span>
          </div>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            data-magnetic
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest text-[#7fb3b3] hover:text-white hover:border-[#00CED1]/50 hover:shadow-[0_0_15px_rgba(0,206,209,0.15)] transition-all duration-300 group"
            title="Toggle Creative Theme"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">Theme: </span>
            <span className={activeTheme === 'retro' ? 'text-[#00CED1]' : 'text-[#20B2AA]'}>
              {activeTheme === 'retro' ? 'Retro Matrix' : 'Cosmic Cybernet'}
            </span>
          </button>
        </header>

        {/* Dynamic Side Readouts (Hologram dashboard widgets) */}
        <div className="absolute inset-x-6 top-24 bottom-16 pointer-events-none flex justify-between items-stretch">
          
          {/* Left HUD Panel (Oscilloscope & System Health) */}
          <div className={`flex flex-col gap-6 w-44 transition-opacity duration-500 ${isGridZoomed ? 'opacity-15' : 'opacity-80'}`}>
            <div className="border border-white/5 bg-black/25 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-2">
              <span className="text-[8px] font-black text-[#7fb3b3] tracking-widest uppercase">// SYS_TELEMETRY</span>
              
              {/* Animated wave path */}
              <div className="h-10 flex items-center justify-center">
                <svg width="140" height="30" className={activeTheme === 'retro' ? 'text-[#00CED1]' : 'text-[#20B2AA]'}>
                  <path
                    d="M 0 15 Q 17.5 0, 35 15 T 70 15 T 105 15 T 140 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="animate-wave"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[8px] text-slate-400 mt-1 font-mono">
                <span>VOL: +1.28V</span>
                <span className="animate-pulse text-[#00CED1]">NEURAL_LOCK</span>
              </div>
            </div>

            <div className="border border-white/5 bg-black/25 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-1.5 font-mono text-[8px] text-slate-400">
              <span className="text-[8px] font-black text-[#7fb3b3] tracking-widest uppercase">// MODULE_READOUTS</span>
              <div className="flex justify-between mt-1">
                <span>SYS_HEALTH:</span>
                <span className="text-white">100.0%</span>
              </div>
              <div className="flex justify-between">
                <span>LATENCY:</span>
                <span className="text-white">12ms</span>
              </div>
              <div className="flex justify-between">
                <span>RENDER_LOD:</span>
                <span className="text-white">HIGH_ULTRA</span>
              </div>
            </div>
          </div>

          {/* Right HUD Panel (Scrolling AI Terminal Log Feed) */}
          <div className={`flex flex-col w-52 self-start transition-opacity duration-500 ${isGridZoomed ? 'opacity-15' : 'opacity-80'}`}>
            <div className="border border-white/5 bg-black/25 backdrop-blur-sm rounded-xl p-4 flex flex-col gap-2.5 font-mono text-[8px]">
              <span className="text-[8px] font-black text-[#7fb3b3] tracking-widest uppercase">// DOCK_LOGFLOW</span>
              
              <div className="flex flex-col gap-1.5 min-h-[90px] overflow-hidden text-slate-400">
                {logs.map((log, idx) => (
                  <div key={idx} className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-500">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mind Map schematic viewport with 3D parallax tilt */}
        <main 
          className="flex-1 w-full pointer-events-auto relative flex items-center justify-center transition-all duration-500 ease-out"
          style={{
            transform: `perspective(1200px) rotateX(${gridTilt.y * 0.12}deg) rotateY(${gridTilt.x * -0.12}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <InteractiveNodeGrid activeTheme={activeTheme} onZoomChange={handleZoomChange} />
        </main>

        {/* Telemetry Dial (Compass in bottom-left corner) */}
        <div className={`absolute bottom-6 left-6 pointer-events-none transition-opacity duration-500 ${isGridZoomed ? 'opacity-10' : 'opacity-80'} flex items-center gap-4`}>
          <svg width="46" height="46" viewBox="0 0 46 46" className="text-slate-600">
            {/* outer ring */}
            <circle cx="23" cy="23" r="21" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3, 3" />
            {/* inner rotating dial */}
            <g className="animate-compass">
              <circle cx="23" cy="23" r="16" fill="none" stroke={activeTheme === 'retro' ? '#00CED1' : '#20B2AA'} strokeWidth="1" strokeDasharray="10, 4, 2, 4" opacity="0.6" />
              <line x1="23" y1="7" x2="23" y2="12" stroke={activeTheme === 'retro' ? '#00CED1' : '#20B2AA'} strokeWidth="1.5" />
            </g>
            <circle cx="23" cy="23" r="3" fill="white" opacity="0.3" />
          </svg>
          <div className="flex flex-col font-mono text-[8px] text-slate-400">
            <span className="font-bold text-white uppercase">LOCATOR_LOCK</span>
            <span>GRID_ANGLE: 142.6°</span>
          </div>
        </div>

        {/* Footer HUD */}
        <footer className={`w-full flex justify-between items-center px-6 py-4 text-[9px] text-[#4a7272] tracking-wider select-none transition-opacity duration-300 ${isGridZoomed ? 'opacity-25' : 'opacity-100'}`}>
          <div className="flex items-center gap-4">
            <span>INTERFACE_MODE: CREATIVE_PORTAL</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">RENDER_ENGINE: ANIME_JS</span>
          </div>
          <div>
            <span>© 2026 DEEP SHAH</span>
          </div>
        </footer>
      </div>

      {/* HUD Diagonal corners / Tech details decoration */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none z-10" />

      {/* Upgraded Gooey Liquid Sight Custom Cursor */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] hidden md:block"
        style={{ filter: isHoveringMagnetic.current ? 'none' : 'url(#goo-filter)' }}
      >
        <div
          ref={cursorDotRef}
          className="absolute rounded-full pointer-events-none transition-[width,height,border-radius,background-color,border-color,box-shadow,margin-left,margin-top] duration-150 ease-out"
          style={{ willChange: 'transform' }}
        />
        <div
          ref={cursorRingRef}
          className="absolute border rounded-full pointer-events-none transition-[width,height,margin-left,margin-top,border-color,background-color,box-shadow,border-radius] duration-250 ease-out"
          style={{ willChange: 'transform' }}
        >
          {/* HUD alignment ticks (only visible when snapped) */}
          <div className="absolute top-0 left-1/2 w-[1px] h-1.5 bg-current -translate-x-1/2 hud-tick opacity-0 group-hud-locked:opacity-100" />
          <div className="absolute bottom-0 left-1/2 w-[1px] h-1.5 bg-current -translate-x-1/2 hud-tick opacity-0 group-hud-locked:opacity-100" />
          <div className="absolute left-0 top-1/2 w-1.5 h-[1px] bg-current -translate-y-1/2 hud-tick opacity-0 group-hud-locked:opacity-100" />
          <div className="absolute right-0 top-1/2 w-1.5 h-[1px] bg-current -translate-y-1/2 hud-tick opacity-0 group-hud-locked:opacity-100" />
          
          {/* HUD Context Label */}
          <span
            ref={cursorLabelRef}
            className="absolute left-full pl-3 top-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest text-[#00FFFF] select-none whitespace-nowrap opacity-0 transition-opacity duration-300"
            style={{ textShadow: '0 0 6px rgba(0, 255, 255, 0.6)' }}
          >
            [ LOCK ]
          </span>
        </div>
      </div>
    </div>
  );
};
