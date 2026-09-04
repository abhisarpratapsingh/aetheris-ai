'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Terminal, LogOut, User as UserIcon, Lock, Activity, Clock } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface HeaderProps {
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenSecurity: () => void;
  onOpenCommand: () => void;
  isProcessing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onSignOut,
  onOpenSecurity,
  onOpenCommand,
  isProcessing = false,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
        ' • ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#1c1e22]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff5733] to-[#ff8c42] p-[1px] shadow-lg shadow-[#ff5733]/20 group">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#24272c] transition-colors group-hover:bg-[#2d3137]">
              <Sparkles className="h-4 w-4 text-[#ff5733] animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-heading font-bold tracking-tight text-white text-lg">Aetheris</span>
              <span className="rounded-full border border-[#ff5733]/40 bg-[#ff5733]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#ff8c42] font-semibold">
                Life OS v2.0
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="hidden sm:inline font-medium">Cognitive Second Brain</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-mono text-[10px] text-slate-400">{timeStr}</span>
            </div>
          </div>
        </div>

        {/* Center telemetry pills */}
        <div className="hidden md:flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono text-[10px] tracking-wide">Cloud Run Active</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-indigo-300 font-mono text-[10px] tracking-wide">
            <Lock className="h-3 w-3 text-indigo-400" />
            <span>Secret Manager</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-cyan-300 font-mono text-[10px] tracking-wide">
            <Activity className="h-3 w-3 text-cyan-400" />
            <span>Gemini 3.6 Flash</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick command shortcut */}
          <button
            onClick={onOpenCommand}
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-300 hover:border-white/20 hover:text-white transition-all shadow-sm"
          >
            <Terminal className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px]">Command</span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 font-mono text-[9px] text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Security HUD Trigger */}
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#24272c] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-[#ff5733]/50 hover:text-white transition-all shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#ff8c42]" />
            <span className="hidden sm:inline">Security HUD</span>
          </button>

          {/* User Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#24272c] px-3 py-1.5 text-xs shadow-sm">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-[#ff5733] to-[#ff8c42] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'E'}
                </div>
                <div className="flex flex-col text-left hidden sm:block">
                  <span className="max-w-[90px] truncate text-slate-200 font-medium text-[11px] leading-tight block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 leading-none">
                    Verified / Isolated
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="ml-1 text-slate-400 hover:text-[#ff5733] transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-xl bg-[#ff5733] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ff6d4d] transition-all shadow-md shadow-[#ff5733]/25 active:scale-98"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
