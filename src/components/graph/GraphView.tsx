import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useVaultStore } from '@/store/useVaultStore';
import { useNotes } from '@/hooks/useNotes';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

export const GraphView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { notes } = useVaultStore();
  const { setActiveNote, activeNoteId } = useNotes();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 400;
    const height = svgRef.current.clientHeight || 400;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    const nodes: Node[] = Object.values(notes).map(n => ({ id: n.id, group: n.folder }));
    const links: Link[] = [];

    nodes.forEach(node => {
      if (node.id !== 'identity') {
        links.push({ source: 'identity', target: node.id });
      }
    });

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#44475a")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (_event, d) => setActiveNote(d.id as any));

    node.append("circle")
      .attr("r", d => d.id === activeNoteId ? 8 : 5)
      .attr("fill", d => d.id === activeNoteId ? "#bd93f9" : "#6272a4")
      .attr("stroke", "#282a36")
      .attr("stroke-width", 1.5);

    node.append("text")
      .text(d => d.id)
      .attr("x", 10)
      .attr("y", 4)
      .style("font-size", "10px")
      .style("fill", "#f8f8f2")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
        simulation.stop();
    };
  }, [notes, activeNoteId, setActiveNote]);

  return (
    <div className="w-full h-64 border border-obsidian-border rounded-lg bg-obsidian-sidebar/30 mt-8 relative overflow-hidden">
      <div className="absolute top-2 left-2 text-[10px] uppercase font-bold text-obsidian-text-muted/50 tracking-widest">Graph View</div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};
