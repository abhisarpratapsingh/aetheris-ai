export interface JournalEntry {
  id: string;
  userId: string;
  rawText: string;
  timestamp: number;
  category?: 'reflection' | 'brainstorm' | 'problem-solving' | 'debrief' | 'stream-of-consciousness';
  audioDurationSec?: number;
  analysis?: CognitiveAnalysis;
}

export interface CognitiveAnalysis {
  executiveTakeaway: string;
  mentalReframing: string;
  subconsciousBlockers: string[];
  actionItems: ActionItem[];
  emotionalTelemetry: EmotionTelemetry;
  conceptNodes: ConceptNode[];
  securityStamp?: SecurityStamp;
}

export interface ActionItem {
  id: string;
  title: string;
  quadrant: 'do-first' | 'schedule' | 'delegate' | 'eliminate'; // Eisenhower Matrix
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  completed: boolean;
  context?: string;
}

export interface EmotionTelemetry {
  sentiment: 'positive' | 'reflective' | 'anxious' | 'energized' | 'fatigued' | 'neutral';
  sentimentScore: number; // -1.0 to 1.0
  burnoutRiskScore: number; // 0 to 100
  cognitiveLoadScore: number; // 0 to 100
  clarityScore: number; // 0 to 100
  dominantEmotions: string[];
}

export interface ConceptNode {
  id: string;
  label: string;
  group: 'project' | 'emotional-theme' | 'habit' | 'insight' | 'blocker';
  weight: number;
  connections: string[];
}

export interface SecurityStamp {
  sanitized: boolean;
  threatAssessmentScore: number; // 0 (Safe) to 100 (Critical Threat)
  secretManagerResolved: boolean;
  uidValidated: boolean;
  owaspRulePassed: string[];
  executionTimeMs: number;
  threatDetails?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}
