'use client';

import React from 'react';
import { Activity, Flame, Zap, Gauge, HeartPulse } from 'lucide-react';
import { EmotionTelemetry } from '@/lib/types';

interface EmotionRadarProps {
  telemetry: EmotionTelemetry;
}

export const EmotionRadar: React.FC<EmotionRadarProps> = ({ telemetry }) => {
  const getBurnoutColor = (score: number) => {
    if (score > 70) return 'text-rose-400 bg-rose-500';
    if (score > 40) return 'text-amber-400 bg-amber-500';
    return 'text-emerald-400 bg-emerald-500';
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <HeartPulse className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Cognitive Load & Burnout Radar</h3>
            <p className="text-[11px] text-slate-400">Real-time Biometric & Sentiment Telemetry</p>
          </div>
        </div>

        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-purple-300">
          {telemetry.sentiment}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Burnout Risk */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              Burnout Risk
            </span>
            <span className="font-mono font-bold text-slate-200">
              {telemetry.burnoutRiskScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                telemetry.burnoutRiskScore > 70
                  ? 'bg-rose-500'
                  : telemetry.burnoutRiskScore > 40
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${telemetry.burnoutRiskScore}%` }}
            />
          </div>
        </div>

        {/* Cognitive Load */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Cognitive Load
            </span>
            <span className="font-mono font-bold text-slate-200">
              {telemetry.cognitiveLoadScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${telemetry.cognitiveLoadScore}%` }}
            />
          </div>
        </div>

        {/* Clarity Score */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              Clarity Index
            </span>
            <span className="font-mono font-bold text-slate-200">
              {telemetry.clarityScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${telemetry.clarityScore}%` }}
            />
          </div>
        </div>

      </div>

      {/* Dominant Emotional States */}
      {telemetry.dominantEmotions && telemetry.dominantEmotions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
            Detected States:
          </span>
          {telemetry.dominantEmotions.map((emo, idx) => (
            <span
              key={idx}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 font-medium"
            >
              {emo}
            </span>
          ))}
        </div>
      )}

    </div>
  );
};
