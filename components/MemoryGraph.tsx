'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Network, Sparkles, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
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

  // Group color mapping
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

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;

    // Initialize positions in a circle layout
    const width = 600;
    const height = 360;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    nodesRef.current = nodes.map((n, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      return {
        ...n,
        x: centerX + radius * Math.cos(angle) + (Math.random() * 20 - 10),
        y: centerY + radius * Math.sin(angle) + (Math.random() * 20 - 10),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      };
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentNodes = nodesRef.current;

      // Draw subtle connecting lines
      ctx.lineWidth = 1;
      currentNodes.forEach((node) => {
        node.connections.forEach((connId) => {
          const target = currentNodes.find((cn) => cn.id === connId);
          if (target) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Update positions & draw nodes
      currentNodes.forEach((node) => {
        // Simple bounding bounce
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 30 || node.x > canvas.width - 30) node.vx *= -1;
        if (node.y < 30 || node.y > canvas.height - 30) node.vy *= -1;

        const isSelected = selectedNode?.id === node.id;
        const color = getGroupColor(node.group);
        const radius = Math.max(8, node.weight * 3.5);

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius + (isSelected ? 6 : 3), 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.05)';
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 14);
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
      return dist < Math.max(12, n.weight * 4);
    });

    setSelectedNode(hit || null);
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Interactive Thought Constellation</h3>
            <p className="text-[11px] text-slate-400">Semantic Dot-Connecting & Concept Cluster Topology</p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="hidden sm:flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1 text-cyan-400"><span className="h-2 w-2 rounded-full bg-cyan-400"></span>Project</span>
          <span className="flex items-center gap-1 text-indigo-400"><span className="h-2 w-2 rounded-full bg-indigo-400"></span>Insight</span>
          <span className="flex items-center gap-1 text-purple-400"><span className="h-2 w-2 rounded-full bg-purple-400"></span>Theme</span>
          <span className="flex items-center gap-1 text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Habit</span>
          <span className="flex items-center gap-1 text-rose-400"><span className="h-2 w-2 rounded-full bg-rose-400"></span>Blocker</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="mt-4 relative rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={640}
          height={320}
          onClick={handleCanvasClick}
          className="w-full h-80 cursor-pointer"
        />

        {selectedNode && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-cyan-500/30 bg-slate-900/90 p-2.5 text-xs backdrop-blur-md">
            <div className="flex items-center gap-2 font-medium text-slate-100">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getGroupColor(selectedNode.group) }} />
              <span>{selectedNode.label}</span>
              <span className="text-[10px] text-slate-400 capitalize">({selectedNode.group})</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Connected to {selectedNode.connections.length} related cognitive thread(s).
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
