'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, User, Bot, Shield, CornerDownLeft } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface MultiTurnChatProps {
  isOpen: boolean;
  onClose: () => void;
  entryContext?: string;
  authToken?: string;
}

export const MultiTurnChat: React.FC<MultiTurnChatProps> = ({
  isOpen,
  onClose,
  entryContext,
  authToken,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `I've synthesized your reflection into my working memory. What aspect would you like to stress-test or brainstorm further?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/journal/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken ? `Bearer ${authToken}` : 'Bearer DEMO_SANDBOX_TOKEN',
        },
        body: JSON.stringify({
          messages: newHistory,
          entryContext: entryContext || '',
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: Date.now(),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to generate companion reply');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Apologies, encountered a connection issue: ${err.message}. Please try again.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] border-l border-slate-800 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-2xl flex flex-col">
      
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">Executive Sparring Partner</h3>
            <p className="text-[11px] text-slate-400">Multi-Turn Gemini 2.0 Dialogue</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Context Badge */}
      {entryContext && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/50 p-2 text-xs text-slate-400 line-clamp-2">
          <span className="font-semibold text-slate-300">Target Context: </span>
          {entryContext}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 mt-0.5">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`rounded-xl p-3.5 max-w-[85%] whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'border border-slate-800/80 bg-slate-900/70 text-slate-200'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-300 mt-0.5">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-slate-400 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-400" />
              <span>Synthesizing perspective...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Challenge an assumption or ask for a framework..."
            disabled={isLoading}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-3.5 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 rounded-lg p-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-slate-400" />
            OWASP LLM01 Guardrails Active
          </span>
          <span>Press Enter to send</span>
        </div>
      </div>

    </div>
  );
};
