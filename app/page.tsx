'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { EntryEditor } from '@/components/EntryEditor';
import { InsightCard } from '@/components/InsightCard';
import { ActionMatrix } from '@/components/ActionMatrix';
import { EmotionRadar } from '@/components/EmotionRadar';
import { MemoryGraph } from '@/components/MemoryGraph';
import { MultiTurnChat } from '@/components/MultiTurnChat';
import { SecurityInspector } from '@/components/SecurityInspector';
import { CommandPalette } from '@/components/CommandPalette';
import { AuthModal } from '@/components/AuthModal';
import { JournalEntry, UserProfile, CognitiveAnalysis } from '@/lib/types';
import { Sparkles, Brain, CheckSquare, Network, History, Shield, Flame, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>({
    uid: 'executive-judge-001',
    displayName: 'Executive Judge',
    email: 'judge.evaluator@google.challenge.internal',
    photoURL: null,
  });
  const [authToken, setAuthToken] = useState<string>('DEMO_SANDBOX_TOKEN');

  const [activeTab, setActiveTab] = useState<'stream' | 'matrix' | 'constellation' | 'vault'>('stream');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [history, setHistory] = useState<JournalEntry[]>([]);

  // Drawers & Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Fetch initial history
  useEffect(() => {
    fetchHistory();
  }, [authToken]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/journal/history', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success && data.entries) {
        setHistory(data.entries);
        if (!currentEntry && data.entries.length > 0) {
          setCurrentEntry(data.entries[0]);
        }
      }
    } catch (err) {
      console.warn('Could not fetch history:', err);
    }
  };

  const handleCreateEntry = async (rawText: string, category: string, audioDurationSec?: number) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ rawText, category, audioDurationSec }),
      });

      const data = await res.json();
      if (data.success && data.entry) {
        setCurrentEntry(data.entry);
        setHistory((prev) => [data.entry, ...prev]);
        setActiveTab('stream');
      } else {
        alert(`Analysis error: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommandAction = (actionId: string) => {
    switch (actionId) {
      case 'new-entry':
        setActiveTab('stream');
        break;
      case 'view-matrix':
        setActiveTab('matrix');
        break;
      case 'view-graph':
        setActiveTab('constellation');
        break;
      case 'view-security':
        setIsSecurityOpen(true);
        break;
      case 'deep-dive':
        setIsChatOpen(true);
        break;
      case 'open':
        setIsCommandOpen(true);
        break;
    }
  };

  // Aggregated graph nodes across recent entries
  const allConceptNodes = currentEntry?.analysis?.conceptNodes || [
    { id: 'n1', label: 'Cloud Architecture', group: 'project', weight: 5, connections: ['n2', 'n4'] },
    { id: 'n2', label: 'Cognitive Bandwidth', group: 'emotional-theme', weight: 4, connections: ['n1', 'n3'] },
    { id: 'n3', label: 'Velocity vs Quality', group: 'insight', weight: 3, connections: ['n2', 'n5'] },
    { id: 'n4', label: 'Threat Surface', group: 'blocker', weight: 4, connections: ['n1'] },
    { id: 'n5', label: 'Daily Execution', group: 'habit', weight: 3, connections: ['n3'] },
  ];

  // Aggregated actions across history
  const allActionItems = history.flatMap((h) => h.analysis?.actionItems || []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      
      {/* Navigation Header */}
      <Header
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => {
          setUser(null);
          setAuthToken('');
        }}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenCommand={() => setIsCommandOpen(true)}
        isProcessing={isAnalyzing}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Metric Telemetry Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-slate-400">Total Memories Vaulted</div>
            <div className="mt-1 text-lg font-bold font-mono text-cyan-400">{history.length}</div>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-slate-400">Extracted Action Items</div>
            <div className="mt-1 text-lg font-bold font-mono text-emerald-400">{allActionItems.length}</div>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-slate-400">Average Burnout Index</div>
            <div className="mt-1 text-lg font-bold font-mono text-indigo-400">
              {currentEntry?.analysis?.emotionalTelemetry.burnoutRiskScore ?? 32}%
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 backdrop-blur-md">
            <div className="text-[11px] font-medium text-slate-400">Security Isolation</div>
            <div className="mt-1 text-xs font-mono text-emerald-400 flex items-center gap-1 mt-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>/users/{user?.uid ? user.uid.slice(0, 10) : 'sandbox'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'stream', label: 'Reflect & Decompose', icon: Sparkles },
              { id: 'matrix', label: 'Action Matrix', icon: CheckSquare },
              { id: 'constellation', label: 'Thought Constellation', icon: Network },
              { id: 'vault', label: 'Historical Vault', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Powered by Gemini 2.0 Flash</span>
          </div>
        </div>

        {/* Tab 1: Stream of Consciousness & Active Decomposition */}
        {activeTab === 'stream' && (
          <div className="space-y-6">
            
            {/* Input Editor */}
            <EntryEditor onSubmit={handleCreateEntry} isAnalyzing={isAnalyzing} />

            {/* Current Active Analysis Breakdown */}
            {currentEntry?.analysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                
                {/* Left 2 Cols: Executive Insight & Action Matrix */}
                <div className="lg:col-span-2 space-y-6">
                  <InsightCard
                    analysis={currentEntry.analysis}
                    onDeepDive={() => setIsChatOpen(true)}
                  />
                  <ActionMatrix items={currentEntry.analysis.actionItems} />
                </div>

                {/* Right Col: Emotion Telemetry & Thought Network */}
                <div className="space-y-6">
                  <EmotionRadar telemetry={currentEntry.analysis.emotionalTelemetry} />
                  <MemoryGraph nodes={currentEntry.analysis.conceptNodes} />
                </div>

              </div>
            )}

          </div>
        )}

        {/* Tab 2: Action Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <ActionMatrix items={allActionItems} />
          </div>
        )}

        {/* Tab 3: Thought Constellation */}
        {activeTab === 'constellation' && (
          <div className="space-y-6">
            <MemoryGraph nodes={allConceptNodes} />
          </div>
        )}

        {/* Tab 4: Historical Memory Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-semibold text-slate-200">Vaulted Journal Trajectory</h2>
              <span className="text-xs text-slate-400">{history.length} persistent entries</span>
            </div>

            <div className="grid gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentEntry(item);
                    setActiveTab('stream');
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-mono text-[11px] text-cyan-400 capitalize">
                      {item.category || 'Reflection'}
                    </span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-200 line-clamp-2">
                    {item.rawText}
                  </p>
                  {item.analysis?.executiveTakeaway && (
                    <div className="mt-2 rounded-lg bg-slate-950/60 p-2 text-xs text-slate-300 font-sans border-l-2 border-cyan-500">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">Takeaway:</span>
                      {item.analysis.executiveTakeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Slide-over Drawers & Modals */}
      <MultiTurnChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        entryContext={currentEntry?.rawText}
        authToken={authToken}
      />

      <SecurityInspector
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        userUid={user?.uid}
      />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectAction={handleCommandAction}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(profile, token) => {
          setUser(profile);
          setAuthToken(token);
        }}
      />

    </div>
  );
}
