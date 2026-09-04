'use client';

import React from 'react';
import { Sparkles, Brain, Compass, AlertCircle, MessageSquare, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { CognitiveAnalysis } from '@/lib/types';

interface InsightCardProps {
  analysis: CognitiveAnalysis;
  onDeepDive?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ analysis, onDeepDive }) => {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl transition-all hover:border-slate-700/80">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Executive Cognitive Synthesis</h3>
            <p className="text-[11px] text-slate-400">
              {analysis.securityStamp?.modelUsed || 'Gemini 3.6 Flash'} • Threat-modeled Output
            </p>
          </div>
        </div>

        {onDeepDive && (
          <button
            onClick={onDeepDive}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-900/50 hover:border-indigo-400 transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Deep Dive</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Main takeaway */}
      <div className="mt-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 via-slate-900/40 to-slate-900/60 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 block mb-1">
          Executive Takeaway
        </span>
        <p className="text-sm font-medium text-slate-100 leading-relaxed">
          {analysis.executiveTakeaway}
        </p>
      </div>

      {/* Mental Reframing */}
      <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          <Compass className="h-3.5 w-3.5" />
          <span>Cognitive Reframing</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {analysis.mentalReframing}
        </p>
      </div>

      {/* Subconscious Blockers */}
      {analysis.subconsciousBlockers && analysis.subconsciousBlockers.length > 0 && (
        <div className="mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block mb-2 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Latent Friction & Blindspots</span>
          </span>
          <div className="grid gap-2">
            {analysis.subconsciousBlockers.map((blocker, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-300"
              >
                <span className="text-amber-400 font-mono font-bold">•</span>
                <span>{blocker}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verifiable Security Stamp Footer */}
      {analysis.securityStamp && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Threat Score: {analysis.securityStamp.threatAssessmentScore}/100</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
            <span>Latency: {analysis.securityStamp.executionTimeMs}ms</span>
            <span>•</span>
            <span>Secret Manager: {analysis.securityStamp.secretManagerResolved ? 'Verified' : 'Env'}</span>
          </div>
        </div>
      )}

    </div>
  );
};
