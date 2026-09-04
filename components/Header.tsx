'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Terminal, LogOut, User as UserIcon, Lock, Activity } from 'lucide-react';
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
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-950">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-lg">Aetheris</span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-cyan-400">
                Cognitive OS v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Executive Second Brain • Gemini 2.0 on Cloud Run
            </p>
          </div>
        </div>

        {/* Center status indicators */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono text-[11px]">Cloud Run Active</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-indigo-300 font-mono text-[11px]">
            <Lock className="h-3 w-3 text-indigo-400" />
            <span>Secret Manager Bound</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick command shortcut */}
          <button
            onClick={onOpenCommand}
            className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-slate-400" />
            <span>Search</span>
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Security HUD Trigger */}
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Security HUD</span>
          </button>

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs">
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[11px] font-bold text-white">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate text-slate-200 font-medium hidden sm:inline">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign out"
                  className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-md shadow-indigo-500/25"
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
