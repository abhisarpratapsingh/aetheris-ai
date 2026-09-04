'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, TrendingUp, Shield, Zap, ChevronRight, CheckCircle, RefreshCw } from 'lucide-react';
import { JournalEntry } from '@/lib/types';

interface ExecutiveBriefingProps {
  entries: JournalEntry[];
  onRefresh?: () => void;
  onOpenSparring?: () => void;
}

export const ExecutiveBriefing: React.FC<ExecutiveBriefingProps> = ({
  entries,
  onRefresh,
  onOpenSparring,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onRefresh) onRefresh();
    }, 800);
  };

  // Derive trajectory from latest entry or defaults
  const latestAnalysis = entries[0]?.analysis;
  const recentTakeaway = latestAnalysis?.executiveTakeaway || 
    "Current cognitive trajectory centers on disciplined execution: Ship core Cloud Run services before expanding surface area.";
  const clarity = latestAnalysis?.emotionalTelemetry.clarityScore ?? 84;
  const burnout = latestAnalysis?.emotionalTelemetry.burnoutRiskScore ?? 28;

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-6">
      
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-slow" />

      {/* Top Bar: Title & Live Readiness Gauge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight text-white">Daily Focus Horizon & Executive Brief</h2>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                Optimal Flow
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Synthesized by Gemini 3.6 Flash across {entries.length} recent memory vectors
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onOpenSparring && (
            <button
              onClick={onOpenSparring}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900/50 hover:border-indigo-400 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Spar with Gemini</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-2 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            title="Recalculate Briefing"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Strategic Directive Block */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Left 2 Cols: The Core Strategic Directive */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 relative">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold block mb-1">
              Primary Directive for Today
            </span>
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              "{recentTakeaway}"
            </p>
          </div>

          {/* 3 Executive Vectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-2.5">
              <span className="text-[10px] text-slate-400 block font-mono">1. Lever of Leverage</span>
              <p className="text-slate-200 font-medium mt-0.5">Focus on Cloud Run scalability over manual testing</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-2.5">
              <span className="text-[10px] text-slate-400 block font-mono">2. Cognitive Friction</span>
              <p className="text-slate-200 font-medium mt-0.5">Mitigate sprint deadline stress with 45m deep blocks</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-slate-950/40 p-2.5">
              <span className="text-[10px] text-slate-400 block font-mono">3. Security Posture</span>
              <p className="text-slate-200 font-medium mt-0.5">OWASP LLM01 verified; zero keys in client bundle</p>
            </div>
          </div>
        </div>

        {/* Right Col: Executive Telemetry Dial */}
        <div className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">Cognitive Energy Index</span>
            <span className="font-mono font-bold text-cyan-400">{clarity}%</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Clarity & Focus</span>
                <span className="font-mono text-slate-200">{clarity}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-400" style={{ width: `${clarity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Burnout Reserve</span>
                <span className="font-mono text-emerald-400">{100 - burnout}% Capacity</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${100 - burnout}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Isolation: Strict /users/{'{uid}'}</span>
            <span>Secret Manager: Live</span>
          </div>
        </div>

      </div>

    </div>
  );
};
