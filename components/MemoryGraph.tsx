'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Network, Sparkles, ZoomIn, ZoomOut, RefreshCw, Layers, Compass, Eye } from 'lucide-react';
import { ConceptNode } from '@/lib/types';

interface MemoryGraphProps {
  nodes: ConceptNode[];
}

interface RenderNode {
  id: string;
  label: string;
  group: string;
  weight: number;
  connections: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const MemoryGraph: React.FC<MemoryGraphProps> = ({ nodes }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<RenderNode | null>(null);
  const nodesRef = useRef<RenderNode[]>([]);
  const animFrameId = useRef<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'project': return '#38bdf8'; // Cyan
      case 'insight': return '#818cf8'; // Indigo
      case 'emotional-theme': return '#c084fc'; // Purple
      case 'habit': return '#34d399'; // Emerald
      case 'blocker': return '#fb7185'; // Rose
      default: return '#94a3b8';
    }
  };

  const reseedPositions = () => {
    if (!nodes || nodes.length === 0) return;
    const width = 640;
    const height = 340;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 110;

    nodesRef.current = nodes.map((n, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      return {
        ...n,
        x: centerX + radius * Math.cos(angle) + (Math.random() * 20 - 10),
        y: centerY + radius * Math.sin(angle) + (Math.random() * 20 - 10),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      };
    });
  };

  useEffect(() => {
    reseedPositions();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentNodes = nodesRef.current;

      // Draw glowing connection strands
      currentNodes.forEach((node) => {
        node.connections.forEach((connId) => {
          const target = currentNodes.find((cn) => cn.id === connId);
          if (target) {
            ctx.beginPath();
            const grad = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
            grad.addColorStop(1, 'rgba(129, 140, 248, 0.15)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Update node physics and render
      currentNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 35 || node.x > canvas.width - 35) node.vx *= -1;
        if (node.y < 35 || node.y > canvas.height - 35) node.vy *= -1;

        const isSelected = selectedNode?.id === node.id;
        const color = getGroupColor(node.group);
        const radius = Math.max(9, node.weight * 3.8);

        // Radial glow halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + (isSelected ? 9 : 4), 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.04)';
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isSelected ? 15 : 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Label typography
        ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 15);
      });

      animFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [nodes, selectedNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const hit = nodesRef.current.find((n) => {
      const dist = Math.hypot(n.x - x, n.y - y);
      return dist < Math.max(14, n.weight * 4.5);
    });

    setSelectedNode(hit || null);
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#24272c] p-6 sm:p-7 shadow-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#ff5733]/15 border border-[#ff5733]/30 text-[#ff5733]">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif-heading font-bold text-base sm:text-lg text-white">Interactive Thought Constellation</h3>
            <p className="text-[11px] text-slate-400">Semantic Dot-Connecting & Concept Cluster Topology</p>
          </div>
        </div>

        {/* Legend pills & re-seed */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-cyan-400"><span className="h-2 w-2 rounded-full bg-cyan-400"></span>Project</span>
            <span className="flex items-center gap-1 text-[#ff8c42]"><span className="h-2 w-2 rounded-full bg-[#ff5733]"></span>Insight</span>
            <span className="flex items-center gap-1 text-purple-400"><span className="h-2 w-2 rounded-full bg-purple-400"></span>Theme</span>
            <span className="flex items-center gap-1 text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Habit</span>
            <span className="flex items-center gap-1 text-rose-400"><span className="h-2 w-2 rounded-full bg-rose-400"></span>Blocker</span>
          </div>

          <button
            onClick={reseedPositions}
            className="rounded-2xl border border-white/[0.08] bg-[#1c1e22] p-2 text-slate-400 hover:text-white transition-all active:scale-98"
            title="Re-layout Nodes"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="mt-4 relative rounded-2xl border border-white/[0.06] bg-[#181a1d] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={640}
          height={320}
          onClick={handleCanvasClick}
          className="w-full h-80 cursor-pointer"
        />

        {selectedNode && (
          <div className="absolute bottom-3 left-3 rounded-2xl border border-white/[0.1] bg-[#24272c]/95 p-3.5 text-xs backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 max-w-xs">
            <div className="flex items-center gap-2 font-medium text-slate-100">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getGroupColor(selectedNode.group) }} />
              <span className="font-semibold text-sm">{selectedNode.label}</span>
              <span className="text-[10px] font-mono text-slate-400 capitalize">({selectedNode.group})</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Linked across <span className="text-[#ff8c42] font-mono font-bold">{selectedNode.connections.length}</span> related memory threads in your Second Brain.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
