'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, CheckSquare, Copy, Check, Filter, Layers, Zap, ArrowUpRight } from 'lucide-react';
import { ActionItem } from '@/lib/types';

interface ActionMatrixProps {
  items: ActionItem[];
  onToggleItem?: (id: string) => void;
}

export const ActionMatrix: React.FC<ActionMatrixProps> = ({ items: initialItems, onToggleItem }) => {
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');
  const [copied, setCopied] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    if (onToggleItem) onToggleItem(id);
  };

  const copyAsMarkdown = () => {
    const md = items
      .map(
        (i) =>
          `- [${i.completed ? 'x' : ' '}] **${i.title}** (${i.priority.toUpperCase()}, ~${i.estimatedMinutes}m) [${i.quadrant}]`
      )
      .join('\n');

    navigator.clipboard.writeText(`### Aetheris Action Matrix\n${md}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const filteredItems = filterPriority === 'all' 
    ? items 
    : items.filter((i) => i.priority === filterPriority);

  const quadrants = [
    { id: 'do-first', title: 'Do First (Immediate)', color: 'text-rose-400', border: 'border-rose-500/20 bg-rose-950/10' },
    { id: 'schedule', title: 'Schedule (Deep Work)', color: 'text-cyan-400', border: 'border-cyan-500/20 bg-cyan-950/10' },
    { id: 'delegate', title: 'Delegate / Automate', color: 'text-amber-400', border: 'border-amber-500/20 bg-amber-950/10' },
    { id: 'eliminate', title: 'Eliminate / Defer', color: 'text-slate-400', border: 'border-slate-800 bg-slate-900/30' },
  ];

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-2xl transition-all">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-100">Eisenhower Action Matrix</h3>
              <span className="rounded-full border border-white/[0.08] bg-slate-800/80 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                {completedCount}/{items.length} Resolved ({progressPct}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous Task Triage & Deep Work Priority Queue</p>
          </div>
        </div>

        {/* View mode toggle & Copy */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#070b14] p-1 text-xs">
            <button
              onClick={() => setViewMode('matrix')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                viewMode === 'matrix' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Matrix
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-all ${
                viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={copyAsMarkdown}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:text-white transition-all shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Obsidian Export'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-slate-400 shrink-0">{progressPct}% Settle</span>
      </div>

      {/* Content */}
      {viewMode === 'matrix' ? (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {quadrants.map((q) => {
            const quadrantItems = filteredItems.filter((i) => i.quadrant === q.id);
            return (
              <div key={q.id} className={`rounded-xl border ${q.border} p-3.5 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${q.color}`}>
                      {q.title}
                    </span>
                    <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                      {quadrantItems.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {quadrantItems.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-600 italic">No tasks in this quadrant</div>
                    ) : (
                      quadrantItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggle(item.id)}
                          className={`group flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-[#070b14]/70 p-3 text-xs transition-all cursor-pointer hover:border-white/20 hover:bg-[#070b14]/90 ${
                            item.completed ? 'opacity-40' : ''
                          }`}
                        >
                          <button className="mt-0.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0">
                            {item.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium leading-snug ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                              {item.title}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                              <span className={`font-mono font-semibold uppercase ${
                                item.priority === 'critical' ? 'text-rose-400' :
                                item.priority === 'high' ? 'text-amber-400' : 'text-cyan-400'
                              }`}>
                                {item.priority}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono text-slate-500">
                                <Clock className="h-3 w-3" />
                                ~{item.estimatedMinutes}m
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#070b14]/60 p-3 text-xs cursor-pointer hover:border-white/20 transition-all ${
                item.completed ? 'opacity-40' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button className="text-slate-500 hover:text-cyan-400">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>
                <span className={`font-medium ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500 capitalize">{item.quadrant}</span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300">
                  {item.estimatedMinutes}m
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
