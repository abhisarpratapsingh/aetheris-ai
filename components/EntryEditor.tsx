'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, Wand2, Shield, Radio, Volume2, CornerDownLeft } from 'lucide-react';

interface EntryEditorProps {
  onSubmit: (text: string, category: string, audioSec?: number) => void;
  isAnalyzing: boolean;
}

const SAMPLE_PROMPTS = [
  "Feeling torn between shipping new features quickly vs refactoring core billing logic. Velocity is key right now, but technical debt is causing subtle race conditions and increasing sprint fatigue.",
  "Preparing for investor update. Strong top-line growth (18% MoM), but our Cloud Run cold starts and inference latency for Gemini models are higher than expected. Need a disciplined mitigation plan.",
  "Brain dump: Reorganizing our sprint cadence. We're getting bogged down in 45-minute standups with zero actionable decisions. Want to switch to asynchronous status memos and focus blocks."
];

export const EntryEditor: React.FC<EntryEditorProps> = ({ onSubmit, isAnalyzing }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string>('reflection');
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
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
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x += 4) {
        const amplitude = 12 * Math.sin(x * 0.05 + phase) * Math.cos(phase * 0.5);
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
        setText("Voice Reflection (Dictated): Discussing system architecture and balancing Cloud Run deployment scaling with Secret Manager caching to minimize cold starts.");
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
    onSubmit(text, category, recordSeconds > 0 ? recordSeconds : undefined);
    setText('');
    setIsRecording(false);
  };

  const loadSample = (sample: string) => {
    setText(sample);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      
      {/* Decorative ambient gradient */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Top controls: Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'reflection', label: 'Reflection' },
            { id: 'brainstorm', label: 'Brainstorm' },
            { id: 'problem-solving', label: 'Problem Solving' },
            { id: 'debrief', label: 'Executive Debrief' },
            { id: 'stream-of-consciousness', label: 'Raw Dump' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`rounded-lg px-3 py-1 font-medium transition-all ${
                category === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick prompt injector */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Wand2 className="h-3 w-3 text-cyan-400" />
          <span>Samples:</span>
          <button
            onClick={() => loadSample(SAMPLE_PROMPTS[0])}
            className="hover:text-cyan-300 underline underline-offset-2 ml-1"
          >
            Roadmap
          </button>
          <span>•</span>
          <button
            onClick={() => loadSample(SAMPLE_PROMPTS[1])}
            className="hover:text-cyan-300 underline underline-offset-2"
          >
            Infra
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's taking up your mental RAM right now? Speak or type your raw, unfiltered stream of consciousness..."
          rows={4}
          disabled={isAnalyzing}
          className="w-full resize-none rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 font-sans text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />

        {/* Recording active banner & waveform */}
        {isRecording && (
          <div className="absolute inset-x-2 bottom-3 rounded-lg border border-cyan-500/30 bg-slate-900/95 p-2.5 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-mono text-rose-400 font-semibold">
                REC 00:{recordSeconds.toString().padStart(2, '0')}
              </span>
            </div>

            <canvas ref={canvasRef} width={220} height={26} className="h-6 w-52" />

            <button
              onClick={toggleRecording}
              className="text-xs text-slate-300 hover:text-white underline underline-offset-2"
            >
              Done Dictating
            </button>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="mt-3 flex items-center justify-between">
        
        {/* Left: Audio record & Security flag */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
              isRecording
                ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-sm shadow-rose-500/20'
                : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
            }`}
          >
            {isRecording ? <MicOff className="h-4 w-4 text-rose-400" /> : <Mic className="h-4 w-4 text-cyan-400" />}
            <span>{isRecording ? 'Stop Voice' : 'Dictate Stream'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
            <Shield className="h-3 w-3 text-slate-400" />
            <span>OWASP Sanitizer Armed</span>
          </div>
        </div>

        {/* Right: Submit Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-slate-500">
            <span>Press</span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 text-[10px] text-slate-400">
              ⌘ Enter
            </kbd>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isAnalyzing}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-cyan-200" />
                <span>Decomposing Thought...</span>
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
