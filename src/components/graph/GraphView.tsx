import React, { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useVaultStore } from '@/store/useVaultStore';
import { useNotes, type NoteId } from '@/hooks/useNotes';
import * as THREE from 'three';

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color?: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export const GraphView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { notes } = useVaultStore();
  const { activeNoteId, openNote } = useNotes();
  const [colors, setColors] = useState({ accent: '#bd93f9', muted: '#6272a4', bg: '#1e1e1e' });

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

    // Extract colors from CSS variables
    const style = getComputedStyle(document.documentElement);
    setColors({
      accent: style.getPropertyValue('--accent').trim() || '#bd93f9',
      muted: style.getPropertyValue('--text-muted').trim() || '#6272a4',
      bg: style.getPropertyValue('--bg-primary').trim() || '#1e1e1e'
    });

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prepare graph data
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = Object.values(notes).map(n => ({
      id: n.id,
      name: n.title,
      val: n.id === 'identity' ? 5 : 2,
      color: n.id === activeNoteId ? colors.accent : colors.muted
    }));

    const links: GraphLink[] = [];
    const noteList = Object.values(notes);

    noteList.forEach(node => {
      // 1. Link everything to identity
      if (node.id !== 'identity') {
        links.push({ source: 'identity', target: node.id });
      }

      // 2. Link notes in the same folder
      noteList.forEach(otherNode => {
        if (node.id !== otherNode.id && node.folder === otherNode.folder && node.id !== 'identity' && otherNode.id !== 'identity') {
            // Avoid double links
            if (!links.some(l => (l.source === otherNode.id && l.target === node.id))) {
                links.push({ source: node.id, target: otherNode.id });
            }
        }
      });
    });

    return { nodes, links };
  }, [notes, activeNoteId, colors]);

  return (
    <div ref={containerRef} className="w-full h-[400px] border border-obsidian-border rounded-lg bg-obsidian-sidebar/20 mt-12 relative overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <div className="text-[10px] uppercase font-bold text-obsidian-text-muted/50 tracking-widest">Interactive 3D Vault</div>
        <div className="text-[9px] text-obsidian-text-muted/30 opacity-0 group-hover:opacity-100 transition-opacity">Drag to rotate • Scroll to zoom • Click to open</div>
      </div>
      
      {dimensions.width > 0 && (
        <ForceGraph3D
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          backgroundColor="rgba(0,0,0,0)"
          nodeLabel="name"
          nodeColor="color"
          linkColor={() => 'rgba(255, 255, 255, 0.1)'}
          linkWidth={0.5}
          onNodeClick={(node: any) => openNote(node.id as NoteId)}
          showNavInfo={false}
          enableNodeDrag={true}
          nodeRelSize={4}
          onNodeHover={(node: any) => {
              if (containerRef.current) {
                  containerRef.current.style.cursor = node ? 'pointer' : 'default';
              }
          }}
          // Customize node appearance
          nodeThreeObject={(node: any) => {
            const group = new THREE.Group();
            
            // Create sphere
            const geometry = new THREE.SphereGeometry(node.id === activeNoteId ? 1.5 : 1);
            const material = new THREE.MeshPhongMaterial({ 
                color: node.id === activeNoteId ? colors.accent : colors.muted,
                transparent: true,
                opacity: 0.9,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // Add glow for active node
            if (node.id === activeNoteId) {
                const glowGeom = new THREE.SphereGeometry(2);
                const glowMat = new THREE.MeshBasicMaterial({ 
                    color: colors.accent, 
                    transparent: true, 
                    opacity: 0.2 
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
