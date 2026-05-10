import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useVaultStore } from '@/store/useVaultStore';
import { useNotes, type NoteId } from '@/hooks/useNotes';
import * as THREE from 'three';

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color?: string;
  isDeepShah?: boolean;
}

interface GraphLink {
  source: string;
  target: string;
}

export const GraphView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  
  const { notes } = useVaultStore();
  const { activeNoteId, openNote } = useNotes();
  const [colors, setColors] = useState({ accent: '#bd93f9', muted: '#6272a4', identity: '#008b8b' });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const style = getComputedStyle(document.documentElement);
    setColors({
      accent: style.getPropertyValue('--accent').trim() || '#bd93f9',
      muted: style.getPropertyValue('--text-muted').trim() || '#6272a4',
      identity: '#008b8b'
    });

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prepare graph data
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = Object.values(notes).map(n => {
      const isDeepShah = n.id === 'deep_shah';
      return {
        id: n.id,
        name: isDeepShah ? 'Deep Shah' : n.title,
        val: isDeepShah ? 12 : (n.id === activeNoteId ? 5 : 2), // Keep Deep Shah node largest
        color: isDeepShah ? colors.identity : (n.id === activeNoteId ? colors.accent : colors.muted),
        isDeepShah
      };
    });

    const links: GraphLink[] = [];
    const noteList = Object.values(notes);

    noteList.forEach(node => {
      if (node.id !== 'deep_shah') {
        links.push({ source: 'deep_shah', target: node.id });
      }

      noteList.forEach(otherNode => {
        if (node.id !== otherNode.id && node.folder === otherNode.folder && node.id !== 'deep_shah' && otherNode.id !== 'deep_shah') {
            if (!links.some(l => (l.source === otherNode.id && l.target === node.id))) {
                links.push({ source: node.id, target: otherNode.id });
            }
        }
      });
    });

    return { nodes, links };
  }, [notes, activeNoteId, colors]);

  const handleNodeHover = useCallback((node: any) => {
    setHoverNode(node);
    if (containerRef.current) {
      containerRef.current.style.cursor = node ? 'pointer' : 'default';
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[400px] border border-obsidian-border rounded-lg bg-obsidian-sidebar/20 mt-12 relative overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="text-[10px] uppercase font-bold text-obsidian-text-muted/50 tracking-widest">Interactive 3D Vault</div>
        <div className="text-[9px] text-obsidian-text-muted/30 opacity-0 group-hover:opacity-100 transition-opacity">Drag to rotate • Scroll to zoom • Click to open</div>
      </div>
      
      {dimensions.width > 0 && (
        <ForceGraph3D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          nodeLabel="name"
          linkColor={() => 'rgba(255, 255, 255, 0.1)'}
          linkWidth={0.5}
          onNodeClick={(node: any) => openNote(node.id as NoteId)}
          onNodeHover={handleNodeHover}
          showNavInfo={false}
          enableNodeDrag={true}
          nodeRelSize={1}
          
          nodeThreeObject={(node: any) => {
            const isHovered = hoverNode?.id === node.id;
            const isActive = node.id === activeNoteId;
            const isDeepShah = node.isDeepShah;
            
            // Base visual size
            let size = isDeepShah ? 4 : (isActive ? 2.5 : 1.5);
            if (isHovered) size *= 1.4; // Responsive hover animation

            const group = new THREE.Group();
            
            const geometry = new THREE.SphereGeometry(size);
            const material = new THREE.MeshPhongMaterial({ 
                color: node.color,
                transparent: true,
                opacity: 0.9,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            if (isActive || isDeepShah || isHovered) {
                const glowSize = size * 1.6;
                const glowGeom = new THREE.SphereGeometry(glowSize);
                const glowMat = new THREE.MeshBasicMaterial({ 
                    color: node.color, 
                    transparent: true, 
                    opacity: isHovered ? 0.35 : 0.18 
                });
                group.add(new THREE.Mesh(glowGeom, glowMat));
            }

            return group;
          }}
          nodeThreeObjectExtend={false}
        />
      )}
    </div>
  );
};
