import React, { useEffect, useState, useRef } from 'react';
import { animate } from 'animejs';
import { User, Cpu, Briefcase, Calendar, Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { useVaultStore } from '../../store/useVaultStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface NodeData {
  id: string;
  title: string;
  x: number;
  y: number;
  scale: number;
  icon: React.ComponentType<any>;
  description: string;
}

interface InteractiveNodeGridProps {
  activeTheme: 'retro' | 'cosmic';
  onZoomChange: (isZoomed: boolean) => void;
}

export const InteractiveNodeGrid: React.FC<InteractiveNodeGridProps> = ({ activeTheme, onZoomChange }) => {
  const [zoomedNode, setZoomedNode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { notes } = useVaultStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const gridGroupRef = useRef<SVGGElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);

  const nodes: NodeData[] = [
    { id: 'about', title: 'About Me', x: 500, y: 400, scale: 2.2, icon: User, description: 'Identity, bio, and background' },
    { id: 'skills', title: 'Skills', x: 220, y: 400, scale: 2.2, icon: Cpu, description: 'Core technologies and capabilities' },
    { id: 'projects', title: 'Projects', x: 780, y: 400, scale: 2.2, icon: Briefcase, description: 'AI, ML, and automation builds' },
    { id: 'experience', title: 'Experience', x: 500, y: 180, scale: 2.2, icon: Calendar, description: 'Work history and career log' },
    { id: 'contact', title: 'Contact', x: 500, y: 620, scale: 2.2, icon: Mail, description: 'Connect, access nodes, and social links' },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Entrance animations on mount
  useEffect(() => {
    animate('.schematic-node', {
      scale: [0, 1],
      opacity: [0, 1],
      delay: ((_el: any, i: number) => i * 150) as any,
      duration: 1000,
      ease: 'outBack',
    });

    animate('.schematic-connection', {
      strokeDashoffset: 0,
      opacity: 0.4,
      delay: ((_el: any, i: number) => 300 + i * 100) as any,
      duration: 1200,
      ease: 'outQuad',
    });
  }, []);

  // Manage Zoom Camera Transitions
  useEffect(() => {
    const group = gridGroupRef.current;
    if (!group) return;

    onZoomChange(zoomedNode !== null);

    let S = 1;
    let tx = 0;
    let ty = 0;

    if (zoomedNode) {
      const activeNode = nodes.find((n) => n.id === zoomedNode);
      if (activeNode) {
        if (isMobile) {
          S = 1.6;
          tx = 500 - activeNode.x * S;
          ty = 220 - activeNode.y * S;
        } else {
          S = 2.2;
          tx = 300 - activeNode.x * S;
          ty = 400 - activeNode.y * S;
        }
      }
    }

    animate(group, {
      transform: `matrix(${S}, 0, 0, ${S}, ${tx}, ${ty})`,
      duration: 900,
      ease: 'outQuad',
    });

    // Detail Card entrance animation
    if (zoomedNode) {
      setTimeout(() => {
        if (detailCardRef.current) {
          animate(detailCardRef.current, {
            opacity: [0, 1],
            translateX: isMobile ? [0, 0] : [50, 0],
            translateY: isMobile ? [50, 0] : [0, 0],
            duration: 600,
            ease: 'outBack',
          });

          // Staggered letters spring text reveal
          animate('.reveal-item', {
            opacity: [0, 1],
            translateY: [20, 0],
            delay: ((_el: any, i: number) => 100 + i * 40) as any,
            duration: 500,
            ease: 'outQuad',
          });
        }
      }, 50);
    }
  }, [zoomedNode, isMobile]);

  const handleNodeClick = (nodeId: string) => {
    if (zoomedNode === nodeId) {
      setZoomedNode(null);
    } else {
      setZoomedNode(nodeId);
    }
  };

  // Extract relevant notes depending on active node
  const getNoteContent = () => {
    if (!zoomedNode) return null;
    switch (zoomedNode) {
      case 'about':
        return notes['deep_shah']?.content || '';
      case 'skills':
        return `
# Skills & Capabilities
Combine technical expertise with automation workflows:

## Core Programming & Vision
* **Python**: OpenCV, YOLO, PyTorch
* **GenAI & RAG**: LLMs, LangChain, vector search
* **Orchestration**: n8n, API integrations, web scrapers
* **DevOps**: Linux, Docker, Shell scripting

---
### 🧠 Deep-Dive Notes
Click on any of the skills to view the technical spec sheets in simple view.
        `;
      case 'projects':
        return `
# Featured Builds
Production-grade systems & ML research projects:

* **Railway Safety AI**: Real-time Computer Vision system tracking safety violations.
* **Mental Health Chatbot**: Fine-tuned LLM conversational agent with RAG.
* **Autism ML Study**: Predictive diagnostic tools utilizing XGBoost.
* **Company RAG Chatbot**: Internal document retrieval using FastAPI & Pinecone.
* **n8n Automations**: Multi-stage business flow scripts saving 30+ hours/week.
        `;
      case 'experience':
        return notes['experience_log']?.content || '';
      case 'contact':
        return notes['contact_node']?.content || '';
      default:
        return '';
    }
  };

  const currentNoteContent = getNoteContent();

  // Glow configurations based on theme
  const primaryGlow = activeTheme === 'retro' ? 'rgba(0, 206, 209, 0.4)' : 'rgba(32, 178, 170, 0.4)';
  const nodeStroke = activeTheme === 'retro' ? '#00CED1' : '#20B2AA';
  const nodeFill = 'rgba(3, 13, 20, 0.9)';

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* SVG Canvas Map */}
      <svg
        className="absolute inset-0 w-full h-full select-none"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definitions for gradients and drop shadows */}
        <defs>
          <filter id="glow-neon" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g ref={gridGroupRef} style={{ transformOrigin: '500px 400px' }}>
          {/* Decorative Grid Orbits */}
          <circle cx="500" cy="400" r="320" fill="none" stroke={nodeStroke} strokeWidth="1" strokeDasharray="3, 10" opacity="0.12" />
          <circle cx="500" cy="400" r="160" fill="none" stroke={nodeStroke} strokeWidth="1" strokeDasharray="5, 5" opacity="0.08" />

          {/* Connection Paths (Bezier curves) */}
          <path id="path-skills" d="M 500 400 C 400 370, 320 430, 220 400" fill="none" stroke={nodeStroke} strokeWidth="1.5" opacity="0.35" className="schematic-connection" strokeDasharray="300" strokeDashoffset="300" />
          <path id="path-projects" d="M 500 400 C 600 430, 680 370, 780 400" fill="none" stroke={nodeStroke} strokeWidth="1.5" opacity="0.35" className="schematic-connection" strokeDasharray="300" strokeDashoffset="300" />
          <path id="path-experience" d="M 500 400 C 460 300, 540 300, 500 180" fill="none" stroke={nodeStroke} strokeWidth="1.5" opacity="0.35" className="schematic-connection" strokeDasharray="250" strokeDashoffset="250" />
          <path id="path-contact" d="M 500 400 C 540 500, 460 500, 500 620" fill="none" stroke={nodeStroke} strokeWidth="1.5" opacity="0.35" className="schematic-connection" strokeDasharray="250" strokeDashoffset="250" />

          {/* Cross mesh / secondary neural paths (Bezier curves) */}
          <path d="M 220 400 C 300 300, 400 240, 500 180" fill="none" stroke={nodeStroke} strokeWidth="0.75" opacity="0.12" strokeDasharray="4, 4" />
          <path d="M 500 180 C 600 240, 700 300, 780 400" fill="none" stroke={nodeStroke} strokeWidth="0.75" opacity="0.12" strokeDasharray="4, 4" />
          <path d="M 780 400 C 700 500, 600 560, 500 620" fill="none" stroke={nodeStroke} strokeWidth="0.75" opacity="0.12" strokeDasharray="4, 4" />
          <path d="M 500 620 C 400 560, 300 500, 220 400" fill="none" stroke={nodeStroke} strokeWidth="0.75" opacity="0.12" strokeDasharray="4, 4" />

          {/* Connection Midpoint Junctions */}
          <circle cx="360" cy="400" r="3" fill={nodeStroke} opacity="0.6" />
          <circle cx="360" cy="400" r="8" fill="none" stroke={nodeStroke} strokeWidth="1" opacity="0.35" className="animate-ping" style={{ animationDuration: '3s' }} />
          
          <circle cx="640" cy="400" r="3" fill={nodeStroke} opacity="0.6" />
          <circle cx="640" cy="400" r="8" fill="none" stroke={nodeStroke} strokeWidth="1" opacity="0.35" className="animate-ping" style={{ animationDuration: '3.5s' }} />
          
          <circle cx="500" cy="290" r="3" fill={nodeStroke} opacity="0.6" />
          <circle cx="500" cy="290" r="8" fill="none" stroke={nodeStroke} strokeWidth="1" opacity="0.35" className="animate-ping" style={{ animationDuration: '4s' }} />
          
          <circle cx="500" cy="510" r="3" fill={nodeStroke} opacity="0.6" />
          <circle cx="500" cy="510" r="8" fill="none" stroke={nodeStroke} strokeWidth="1" opacity="0.35" className="animate-ping" style={{ animationDuration: '2.5s' }} />

          {/* Pulsing signal dots traversing curved connections using animateMotion */}
          <circle r="3.5" fill={activeTheme === 'retro' ? '#00FFFF' : '#40E0D0'} opacity="0.8" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}>
            <animateMotion dur="4.2s" repeatCount="indefinite" path="M 500 400 C 400 370, 320 430, 220 400" />
          </circle>
          <circle r="3.5" fill={activeTheme === 'retro' ? '#00FFFF' : '#40E0D0'} opacity="0.8" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}>
            <animateMotion dur="3.8s" repeatCount="indefinite" path="M 500 400 C 600 430, 680 370, 780 400" />
          </circle>
          <circle r="3.5" fill={activeTheme === 'retro' ? '#00FFFF' : '#40E0D0'} opacity="0.8" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}>
            <animateMotion dur="3.5s" repeatCount="indefinite" path="M 500 400 C 460 300, 540 300, 500 180" />
          </circle>
          <circle r="3.5" fill={activeTheme === 'retro' ? '#00FFFF' : '#40E0D0'} opacity="0.8" style={{ filter: 'drop-shadow(0 0 3px currentColor)' }}>
            <animateMotion dur="4.5s" repeatCount="indefinite" path="M 500 400 C 540 500, 460 500, 500 620" />
          </circle>

          {/* Interactive Node Anchors */}
          {nodes.map((node) => {
            const IconComponent = node.icon;
            const isSelected = zoomedNode === node.id;
            const isActive = zoomedNode === null || isSelected;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                style={{ opacity: isActive ? 1 : 0.25, transition: 'opacity 0.4s ease' }}
              >
                <g
                  className="schematic-node cursor-pointer group"
                  onClick={() => handleNodeClick(node.id)}
                >
                  {/* Corner Tech Brackets */}
                  <path d="M -30 -18 L -30 -30 L -18 -30" stroke={nodeStroke} strokeWidth="1" fill="none" className="opacity-50 group-hover:opacity-90 transition-opacity duration-300" />
                  <path d="M 18 -30 L 30 -30 L 30 -18" stroke={nodeStroke} strokeWidth="1" fill="none" className="opacity-50 group-hover:opacity-90 transition-opacity duration-300" />
                  <path d="M -30 18 L -30 30 L -18 30" stroke={nodeStroke} strokeWidth="1" fill="none" className="opacity-50 group-hover:opacity-90 transition-opacity duration-300" />
                  <path d="M 18 30 L 30 30 L 30 18" stroke={nodeStroke} strokeWidth="1" fill="none" className="opacity-50 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Glowing Outer Ripple */}
                  <circle
                    r="38"
                    fill="none"
                    stroke={nodeStroke}
                    strokeWidth="1.5"
                    opacity={isSelected ? 0.9 : 0.3}
                    className={isSelected ? 'animate-ping' : 'group-hover:scale-110 transition-transform duration-300'}
                    style={{ filter: isSelected ? 'url(#glow-neon)' : 'none' }}
                  />

                  {/* Outer Ring Tech Details */}
                  <circle
                    r="32"
                    fill="none"
                    stroke={nodeStroke}
                    strokeWidth="1"
                    strokeDasharray={isSelected ? '2, 2' : '6, 4'}
                    className={isSelected ? 'animate-[spin_10s_linear_infinite]' : 'group-hover:animate-[spin_15s_linear_infinite]'}
                  />

                  {/* Node Solid Center */}
                  <circle
                    r="24"
                    fill={nodeFill}
                    stroke={nodeStroke}
                    strokeWidth="2"
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 8px ${primaryGlow})` : 'none',
                    }}
                    className="group-hover:stroke-white transition-colors duration-300"
                  />

                  {/* Node Icon */}
                  <g transform="translate(-10, -10)" className="pointer-events-none text-white group-hover:text-white transition-colors">
                    <IconComponent size={20} className={isSelected ? 'text-[#00FFFF]' : 'text-white'} />
                  </g>

                  {/* Floating Node Label */}
                  <text
                    y="52"
                    textAnchor="middle"
                    className="fill-white font-mono text-[11px] font-bold tracking-widest uppercase pointer-events-none select-none"
                    style={{
                      textShadow: isSelected ? `0 0 10px ${nodeStroke}` : 'none',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {node.title}
                  </text>

                  {/* Coordinate Address readout */}
                  <text
                    y="65"
                    textAnchor="middle"
                    className="fill-slate-400 font-mono text-[7px] tracking-wider opacity-60 pointer-events-none select-none"
                  >
                    {`ADDR: 0x00F${node.id.charCodeAt(0).toString(16).toUpperCase()}`}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating details overlay panel */}
      {zoomedNode && currentNoteContent && (
        <div
          ref={detailCardRef}
          className={`absolute z-30 flex flex-col border border-white/10 bg-black/85 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden
            ${isMobile 
              ? 'left-4 right-4 bottom-4 top-[50%] h-[46%]' 
              : 'right-10 top-20 bottom-20 w-[45%] max-w-xl'
            }`}
        >
          {/* Tech Top Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${activeTheme === 'retro' ? 'bg-[#00CED1] animate-pulse' : 'bg-[#20B2AA] animate-pulse'}`} />
              <h3 className="font-mono text-xs font-black tracking-widest text-[#7fb3b3] uppercase">
                {`// SYSTEM_NODE: ${zoomedNode}`}
              </h3>
            </div>
            <button
              onClick={() => setZoomedNode(null)}
              data-magnetic
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-[10px] font-mono uppercase tracking-widest text-[#7fb3b3] hover:text-white hover:border-[#00CED1]/50 transition-all duration-300 group"
            >
              <ArrowLeft size={10} className="group-hover:-translate-x-0.5 transition-transform" />
              Close
            </button>
          </div>

          {/* Details Scroll Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
            <div className="reveal-item prose prose-invert max-w-none prose-headings:font-mono prose-headings:tracking-wider prose-h1:text-2xl prose-h1:font-bold prose-h1:text-white prose-h2:text-base prose-h2:text-[#00CED1] prose-h2:mt-6 prose-h2:mb-2 prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed prose-li:text-slate-300 prose-li:text-sm prose-code:text-[#00FFFF]">
              {zoomedNode === 'about' && (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 pb-6 border-b border-white/5">
                  <img
                    src="/Deep_Shah_Image.jpg"
                    alt="Deep Shah"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-white/15 shadow-xl filter grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="text-center sm:text-left">
                    <h2 className="font-mono text-xl font-bold text-white tracking-wide">Deep Shah</h2>
                    <p className="text-xs text-[#00CED1] uppercase font-mono tracking-widest mt-1">AI / ML Engineer & Orchestrator</p>
                    <p className="text-xs text-slate-400 mt-2">Location: Ahmedabad, India</p>
                  </div>
                </div>
              )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Custom rendering for external links
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#00CED1] hover:text-[#00FFFF] transition-colors border-b border-[#00CED1]/30"
                    >
                      {children} <ExternalLink size={10} className="opacity-70" />
                    </a>
                  ),
                }}
              >
                {currentNoteContent}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Tech Footer Decoration */}
          <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-[9px] font-mono text-slate-500">
            <span>SYS_STATUS: ZOOMED_ACTIVE</span>
            <span>GRID_LOC: X={nodes.find(n => n.id === zoomedNode)?.x}, Y={nodes.find(n => n.id === zoomedNode)?.y}</span>
          </div>
        </div>
      )}
    </div>
  );
};
