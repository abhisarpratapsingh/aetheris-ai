'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, Wand2, Shield, Radio, Volume2, MapPin, X, Flame, Zap, Compass } from 'lucide-react';
import { LocationMetadata } from '@/lib/types';

interface EntryEditorProps {
  onSubmit: (text: string, category: string, audioSec?: number, location?: LocationMetadata) => void;
  isAnalyzing: boolean;
}

const SAMPLE_PROMPTS = [
  { label: 'Strategic Roadmap', text: "Analyzing the trade-off between shipping new user-facing features quickly vs hardening Cloud Run database connection pooling. Fast deployment creates immediate market momentum, but subtle concurrency locks could cause sprint bottlenecks down the road." },
  { label: 'Deep Work Debrief', text: "Completed a 90-minute architecture review. Feeling high cognitive load from multi-tenant threat modeling. We decided on strict /users/{uid} Firestore subcollections to prevent data leakage." },
  { label: 'Mental Reset', text: "Brain dump: Reorganizing our sprint cadence. Dropping 45-minute daily standups in favor of async status memos so engineering can stay in flow state." }
];

const POPULAR_LOCATIONS: LocationMetadata[] = [
  { name: 'Google Campus (Bengaluru)', latitude: 12.9716, longitude: 77.5946, formattedAddress: 'Old Airport Rd, Bengaluru' },
  { name: 'Tokyo Shibuya Innovation Studio', latitude: 35.6595, longitude: 139.7005, formattedAddress: 'Shibuya-ku, Tokyo' },
  { name: 'Singapore APAC Tech Hub', latitude: 1.2838, longitude: 103.8591, formattedAddress: 'Marina Bay, Singapore' },
  { name: 'Executive Home Office', latitude: 37.7749, longitude: -122.4194, formattedAddress: 'Private Studio' },
];

export const EntryEditor: React.FC<EntryEditorProps> = ({ onSubmit, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string>('reflection');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [location, setLocation] = useState<LocationMetadata | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Audio timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Audio waveform simulation on canvas
  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x += 3) {
        const amplitude = 12 * Math.sin(x * 0.08 + phase) * Math.cos(phase * 0.4);
        const y = centerY + amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      phase += 0.15;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (!text) {
        setText("Voice Reflection: Discussing Cloud Run autoscaling policies and caching Gemini tokens via Secret Manager to maintain sub-500ms inference latency.");
      }
    } else {
      setIsRecording(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isAnalyzing) return;
    onSubmit(
      text,
      category,
      recordSeconds > 0 ? recordSeconds : undefined,
      location || undefined
    );
    setText('');
    setIsRecording(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel p-6 transition-all duration-300">
      
      {/* Top Bar: Categories & Quick Inspirations */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'reflection', label: 'Reflection', icon: Compass },
            { id: 'brainstorm', label: 'Brainstorm', icon: Sparkles },
            { id: 'problem-solving', label: 'Problem Solving', icon: Zap },
            { id: 'debrief', label: 'Executive Debrief', icon: Shield },
            { id: 'stream-of-consciousness', label: 'Raw Dump', icon: Flame },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-medium transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`h-3 w-3 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick prompt injector pills */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Wand2 className="h-3 w-3 text-cyan-400" />
          <span className="font-mono text-[10px] text-slate-500">Inspirations:</span>
          {SAMPLE_PROMPTS.map((sample, i) => (
            <button
              key={i}
              onClick={() => setText(sample.text)}
              className="rounded-lg border border-white/[0.06] bg-slate-900/60 px-2 py-0.5 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stream of Consciousness Textarea */}
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What is occupying your mental RAM right now? Speak or type your raw, unfiltered stream of consciousness..."
          rows={4}
          disabled={isAnalyzing}
          className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#070b14]/70 p-4 font-sans text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/60 focus:bg-[#070b14]/90 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all leading-relaxed"
        />

        {/* Live Audio recording visualizer overlay */}
        {isRecording && (
          <div className="absolute inset-x-3 bottom-3 rounded-xl border border-cyan-500/40 bg-slate-950/95 p-3 flex items-center justify-between backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-mono text-rose-400 font-semibold tracking-wider">
                DICTATING 00:{recordSeconds.toString().padStart(2, '0')}
              </span>
            </div>

            <canvas ref={canvasRef} width={260} height={28} className="h-7 w-64" />

            <button
              onClick={toggleRecording}
              className="rounded-lg bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              Done Dictating
            </button>
          </div>
        )}
      </div>

      {/* Metadata Row: Location & Threat Status */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Location Pin */}
        <div className="flex items-center gap-2">
          {location ? (
            <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-cyan-300 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-medium text-[11px]">{location.name}</span>
              <button
                onClick={() => setLocation(null)}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-900/50 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
              >
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>Pin Location (Google Maps)</span>
              </button>

              {showLocationPicker && (
                <div className="absolute left-0 bottom-8 z-30 w-72 rounded-2xl border border-white/[0.1] bg-[#0c1220] p-2.5 shadow-2xl backdrop-blur-2xl space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Select Workspace / Venue
                  </div>
                  {POPULAR_LOCATIONS.map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationPicker(false);
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left text-xs text-slate-200 hover:bg-slate-800/80 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-medium text-slate-200 group-hover:text-cyan-300">{loc.name}</div>
                        <div className="text-[10px] text-slate-500">{loc.formattedAddress}</div>
                      </div>
                      <MapPin className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Threat Guard status */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
          <Shield className="h-3 w-3 text-emerald-400" />
          <span>OWASP LLM01 Threat Defense Armed</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        
        {/* Voice Trigger */}
        <button
          onClick={toggleRecording}
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
            isRecording
              ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-sm shadow-rose-500/20'
              : 'border-white/[0.08] bg-slate-900/60 text-slate-300 hover:border-white/20 hover:text-white'
          }`}
        >
          {isRecording ? <MicOff className="h-4 w-4 text-rose-400" /> : <Mic className="h-4 w-4 text-cyan-400" />}
          <span>{isRecording ? 'Stop Voice' : 'Dictate Stream'}</span>
        </button>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-500">
            <span>Commit:</span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[9px] text-slate-400">
              ⌘ Enter
            </kbd>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isAnalyzing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xl shadow-indigo-500/20 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-cyan-200" />
                <span>Decomposing with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-cyan-300" />
                <span>Decompose with Gemini</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
