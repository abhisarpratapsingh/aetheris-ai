'use client';

import React from 'react';
import { Activity, Flame, Zap, Gauge, HeartPulse } from 'lucide-react';
import { EmotionTelemetry } from '@/lib/types';

interface EmotionRadarProps {
  telemetry: EmotionTelemetry;
}

export const EmotionRadar: React.FC<EmotionRadarProps> = ({ telemetry }) => {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#24272c] p-6 sm:p-7 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#ff5733]/15 border border-[#ff5733]/30 text-[#ff5733]">
            <HeartPulse className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif-heading font-bold text-base sm:text-lg text-white">Cognitive Load & Burnout Radar</h3>
            <p className="text-[11px] text-slate-400">Real-time Biometric & Sentiment Telemetry</p>
          </div>
        </div>

        <span className="rounded-full border border-[#ff5733]/30 bg-[#ff5733]/15 px-3 py-1 text-xs font-semibold capitalize text-[#ff8c42]">
          {telemetry.sentiment}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Burnout Risk */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#1c1e22] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
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
                  ? 'bg-[#ff5733]'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${telemetry.burnoutRiskScore}%` }}
            />
          </div>
        </div>

        {/* Cognitive Load */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#1c1e22] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Zap className="h-3.5 w-3.5 text-[#ff8c42]" />
              Cognitive Load
            </span>
            <span className="font-mono font-bold text-slate-200">
              {telemetry.cognitiveLoadScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#ff8c42] transition-all duration-500"
              style={{ width: `${telemetry.cognitiveLoadScore}%` }}
            />
          </div>
        </div>

        {/* Clarity Score */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#1c1e22] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="h-3.5 w-3.5 text-cyan-400" />
              Clarity Index
            </span>
            <span className="font-mono font-bold text-slate-200">
              {telemetry.clarityScore}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${telemetry.clarityScore}%` }}
            />
          </div>
        </div>

      </div>

      {/* Dominant Emotional States */}
      {telemetry.dominantEmotions && telemetry.dominantEmotions.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono font-semibold mr-1">
            States:
          </span>
          {telemetry.dominantEmotions.map((emo, idx) => (
            <span
              key={idx}
              className="rounded-full border border-white/[0.08] bg-[#1c1e22] px-3 py-1 text-xs text-slate-200 font-medium"
            >
              {emo}
            </span>
          ))}
        </div>
      )}

    </div>
  );
};
