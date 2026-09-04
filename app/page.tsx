'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ExecutiveBriefing } from '@/components/ExecutiveBriefing';
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
import { Sparkles, Brain, CheckSquare, Network, History, Shield, Flame, Activity, ArrowRight, Search, Filter } from 'lucide-react';

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
  const [vaultFilter, setVaultFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const handleCreateEntry = async (
    rawText: string,
    category: string,
    audioDurationSec?: number,
    location?: any
  ) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/journal/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ rawText, category, audioDurationSec, location }),
      });

      const data = await res.json();
      if (data.success && data.entry) {
        setCurrentEntry(data.entry);
        setHistory((prev) => [data.entry, ...prev]);
        setActiveTab('stream');
        if (data.persistenceWarning) {
          console.warn('[Persistence Warning]:', data.persistenceWarning);
        }
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

  const allConceptNodes = currentEntry?.analysis?.conceptNodes || [
    { id: 'n1', label: 'Cloud Architecture', group: 'project', weight: 5, connections: ['n2', 'n4'] },
    { id: 'n2', label: 'Cognitive Bandwidth', group: 'emotional-theme', weight: 4, connections: ['n1', 'n3'] },
    { id: 'n3', label: 'Velocity vs Quality', group: 'insight', weight: 3, connections: ['n2', 'n5'] },
    { id: 'n4', label: 'Threat Surface', group: 'blocker', weight: 4, connections: ['n1'] },
    { id: 'n5', label: 'Daily Execution', group: 'habit', weight: 3, connections: ['n3'] },
  ];

  const allActionItems = history.flatMap((h) => h.analysis?.actionItems || []);

  const filteredHistory = history.filter((item) => {
    const matchesFilter = vaultFilter === 'all' || item.category === vaultFilter;
    const matchesSearch = !searchQuery || 
      item.rawText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysis?.executiveTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
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
        
        {/* Daily Executive Briefing & Focus Horizon Hero */}
        <ExecutiveBriefing
          entries={history}
          onRefresh={fetchHistory}
          onOpenSparring={() => setIsChatOpen(true)}
        />

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'stream', label: 'Reflect & Triage', icon: Sparkles, badge: null },
              { id: 'matrix', label: 'Action Matrix', icon: CheckSquare, badge: allActionItems.length },
              { id: 'constellation', label: 'Thought Constellation', icon: Network, badge: null },
              { id: 'vault', label: 'Historical Vault', icon: History, badge: history.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== null && (
                    <span className="rounded-full bg-white/[0.08] px-1.5 py-0.2 font-mono text-[9px] text-slate-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>Model: Gemini 3.6 Flash Fallback Ladder</span>
            <span>•</span>
            <span className="text-emerald-400">Isolated Storage</span>
          </div>
        </div>

        {/* Tab 1: Reflect & Triage */}
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
          <div className="space-y-6 animate-in fade-in duration-200">
            <ActionMatrix items={allActionItems} />
          </div>
        )}

        {/* Tab 3: Thought Constellation */}
        {activeTab === 'constellation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <MemoryGraph nodes={allConceptNodes} />
          </div>
        )}

        {/* Tab 4: Historical Memory Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Vault Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 rounded-xl">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="h-4 w-4 text-slate-400 ml-1" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories, decisions, takeaways..."
                  className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {['all', 'reflection', 'brainstorm', 'problem-solving', 'debrief'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setVaultFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] capitalize transition-all ${
                      vaultFilter === cat
                        ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Entries Feed */}
            <div className="grid gap-3.5">
              {filteredHistory.length === 0 ? (
                <div className="glass-panel p-8 text-center text-xs text-slate-500 italic rounded-2xl">
                  No memories match your query.
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setCurrentEntry(item);
                      setActiveTab('stream');
                    }}
                    className="glass-panel p-4 rounded-xl hover:border-cyan-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                          {item.category || 'Reflection'}
                        </span>
                        {item.location && (
                          <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-300">
                            📍 {item.location.name}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-200 line-clamp-2 leading-relaxed">
                      {item.rawText}
                    </p>

                    {item.analysis?.executiveTakeaway && (
                      <div className="mt-2.5 rounded-lg bg-[#070b14]/70 p-2.5 text-xs text-slate-300 border-l-2 border-cyan-400 leading-relaxed">
                        <span className="text-[9px] font-mono uppercase font-bold text-cyan-400 block mb-0.5">
                          Synthesized Takeaway:
                        </span>
                        {item.analysis.executiveTakeaway}
                      </div>
                    )}
                  </div>
                ))
              )}
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
