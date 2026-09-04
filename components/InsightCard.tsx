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
    <div className="rounded-3xl border border-white/[0.08] bg-[#24272c] p-6 sm:p-7 shadow-xl transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#ff5733]/15 border border-[#ff5733]/30 text-[#ff5733]">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif-heading font-bold text-base sm:text-lg text-white">Executive Cognitive Synthesis</h3>
            <p className="text-[11px] text-slate-400">
              {analysis.securityStamp?.modelUsed || 'Gemini 3.6 Flash'} • Threat-modeled Output
            </p>
          </div>
        </div>

        {onDeepDive && (
          <button
            onClick={onDeepDive}
            className="flex items-center gap-1.5 rounded-2xl border border-white/[0.1] bg-[#1c1e22] px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-[#ff5733]/50 hover:text-white transition-all active:scale-98"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#ff8c42]" />
            <span>Deep Dive</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Main takeaway */}
      <div className="mt-5 rounded-2xl border border-[#ff5733]/25 bg-[#1c1e22] p-4">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#ff8c42] block mb-1">
          Executive Takeaway
        </span>
        <p className="font-serif-heading text-base font-medium text-slate-100 leading-relaxed italic">
          "{analysis.executiveTakeaway}"
        </p>
      </div>

      {/* Mental Reframing */}
      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#1c1e22] p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1">
          <Compass className="h-3.5 w-3.5 text-[#ff8c42]" />
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
