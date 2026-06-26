import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

interface ProgressBarLoadingScreenProps {
  onComplete: () => void;
}

export const ProgressBarLoadingScreen = ({ onComplete }: ProgressBarLoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    const text = container.querySelector('.loading-text') as HTMLElement;
    const bar = container.querySelector('.progress-bar-fill') as HTMLElement;
    const percent = container.querySelector('.loading-percent') as HTMLElement;

    // Reset initial states
    if (text) {
      text.style.opacity = '0';
      text.style.letterSpacing = '0.4em';
    }
    if (bar) {
      bar.style.transform = 'scaleX(0)';
    }
    if (percent) {
      percent.style.opacity = '0';
    }

    // ── Phase 1: Text & Percent Fade-in ──
    animate(text, {
      opacity: [0, 1],
      letterSpacing: ['0.4em', '0.18em'],
      duration: 900,
      ease: 'outExpo',
    });

    animate(percent, {
      opacity: [0, 1],
      duration: 900,
      ease: 'outExpo',
    });

    // ── Phase 2: Progress Bar Fill & Percentage Counting ──
    const progressVal = { value: 0 };
    
    // Scale X of progress bar
    animate(bar, {
      scaleX: [0, 1],
      duration: 1500,
      ease: 'inOutQuad',
    });

    // Tick the numeric value
    animate(progressVal, {
      value: 100,
      round: 1,
      duration: 1500,
      ease: 'inOutQuad',
      update: () => {
        if (!cancelled) {
          setProgress(Math.floor(progressVal.value));
        }
      },
      onComplete: () => {
        if (cancelled) return;

        // ── Phase 3: Disperse / Scale Out ──
        const t1 = setTimeout(() => {
          if (cancelled) return;

          // Slide and fade out the content elements
          animate([text, bar.parentElement!, percent], {
            opacity: 0,
            translateY: -15,
            duration: 450,
            ease: 'inQuad',
          });

          // Fade out the main container
          animate(container, {
            opacity: 0,
            duration: 400,
            delay: 100,
            ease: 'linear',
            onComplete: () => {
              if (!cancelled) onComplete();
            },
          });
        }, 300); // hold at 100% briefly for visual satisfaction
        timers.push(t1);
      }
    });

    const timers: any[] = [];
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-[#030d14] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Radial background ambient glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(0,139,139,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div className="flex flex-col items-center text-center z-10">
        {/* Name heading */}
        <h1
          className="loading-text text-white text-xl sm:text-2xl font-black uppercase tracking-[0.4em] select-none"
          style={{ opacity: 0 }}
        >
          Deep Shah
        </h1>

        {/* Progress bar line */}
        <div className="h-[2px] w-[200px] sm:w-[240px] bg-white/10 rounded-full overflow-hidden mt-6 relative">
          <div
            className="progress-bar-fill absolute inset-y-0 left-0 w-full bg-[#00CED1] origin-left"
            style={{
              transform: 'scaleX(0)',
              boxShadow: '0 0 8px rgba(0,206,209,0.7), 0 0 2px rgba(0,206,209,0.9)',
            }}
          />
        </div>

        {/* 3-Digit Percentage counter */}
        <span className="loading-percent text-[10px] font-bold text-[#00CED1] tracking-[0.2em] mt-3 uppercase select-none">
          {progress.toString().padStart(3, '0')}%
        </span>
      </div>

      {/* URL Footer */}
      <p className="absolute bottom-10 text-[10px] font-bold uppercase tracking-[0.35em] text-[#008B8B]/40 select-none pointer-events-none">
        deepshah1406.github.io
      </p>
    </div>
  );
};
