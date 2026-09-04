'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Shield, CheckSquare, Brain, Network, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('open');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const actions = [
    { id: 'new-entry', label: 'New Cognitive Reflection', icon: Sparkles, category: 'Capture' },
    { id: 'view-matrix', label: 'Open Eisenhower Action Matrix', icon: CheckSquare, category: 'Execution' },
    { id: 'view-graph', label: 'Explore 2D Thought Constellation', icon: Network, category: 'Mind Map' },
    { id: 'view-security', label: 'Launch Enterprise Security Inspector', icon: Shield, category: 'Governance' },
    { id: 'deep-dive', label: 'Start Multi-Turn Gemini Sparring', icon: Brain, category: 'AI Dialogue' },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search className="h-4 w-4 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search memories..."
            autoFocus
            className="w-full py-4 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">No matching commands found</div>
          ) : (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => {
                    onSelectAction(action.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-cyan-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{action.label}</span>
                  </div>
                  <span className="rounded bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400">
                    {action.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/80 px-4 py-2 bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with arrows</span>
          <span>Select with Enter</span>
        </div>

      </div>
    </div>
  );
};
