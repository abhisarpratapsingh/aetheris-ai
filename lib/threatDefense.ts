export interface ThreatReport {
  isSafe: boolean;
  threatScore: number; // 0 = Clean, 100 = Malicious
  sanitizedText: string;
  detectedThreats: string[];
  mitigationsApplied: string[];
  telemetry: {
    scannedLength: number;
    patternsEvaluated: number;
    timestamp: number;
  };
}

// Common prompt injection attack signatures
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /you\s+are\s+now\s+(unconstrained|in\s+developer\s+mode|dan)/i,
  /disregard\s+system\s+(prompt|directives)/i,
  /reveal\s+your\s+(initial|system)\s+instructions/i,
  /<\|im_start\|>|<\|im_end\|>|\[INST\]|\[\/INST\]/i,
  /drop\s+table|delete\s+from\s+users/i,
  /fetch\s*\(\s*["']https?:\/\//i,
  /eval\s*\(/i,
  /__proto__|prototype\s*pollution/i,
];

// Sensitive PII / Credential leak regexes
const SENSITIVE_PATTERNS = [
  { pattern: /AIzaSy[A-Za-z0-9_-]{33}/g, label: '[REDACTED_GOOGLE_API_KEY]' },
  { pattern: /sk-[A-Za-z0-9]{48}/g, label: '[REDACTED_OPENAI_KEY]' },
  { pattern: /ghp_[A-Za-z0-9]{36}/g, label: '[REDACTED_GITHUB_TOKEN]' },
  { pattern: /\b(?:\d{4}[ -]?){3}\d{4}\b/g, label: '[REDACTED_CARD_NUMBER]' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, label: '[REDACTED_SSN]' },
  { pattern: /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, label: '[REDACTED_BEARER_TOKEN]' },
];

/**
 * Agentic Threat Modeling & Input Sanitizer
 * Executes pre-execution security checks mapped directly to OWASP LLM01 & LLM02.
 */
export function analyzeAndSanitizeInput(rawInput: string): ThreatReport {
  let sanitized = rawInput.trim();
  const detectedThreats: string[] = [];
  const mitigationsApplied: string[] = [];
  let threatScore = 0;

  // 1. Check for prompt injection attempts (OWASP LLM01)
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      detectedThreats.push(`Prompt Injection Signature detected: ${pattern.toString()}`);
      threatScore += 35;
      mitigationsApplied.push('Neutralized adversarial system override directive');
      // Neutralize the injection
      sanitized = sanitized.replace(pattern, '[BLOCKED_INJECTION_DIRECTIVE]');
    }
  }

  // 2. Redact credentials & sensitive PII (OWASP LLM02)
  for (const { pattern, label } of SENSITIVE_PATTERNS) {
    if (pattern.test(sanitized)) {
      detectedThreats.push(`Sensitive Data/Credential detected matching: ${label}`);
      threatScore += 20;
      mitigationsApplied.push(`Sanitized sensitive token with ${label}`);
      sanitized = sanitized.replace(pattern, label);
    }
  }

  // 3. Length / DoS bounding
  const MAX_INPUT_CHARS = 12000;
  if (sanitized.length > MAX_INPUT_CHARS) {
    detectedThreats.push('Excessive Payload Length (Token Exhaustion / DoS risk)');
    threatScore += 15;
    mitigationsApplied.push(`Truncated input from ${sanitized.length} to ${MAX_INPUT_CHARS} characters`);
    sanitized = sanitized.slice(0, MAX_INPUT_CHARS);
  }

  // Normalize final threat score (0 to 100)
  threatScore = Math.min(100, threatScore);
  const isSafe = threatScore < 70;

  return {
    isSafe,
    threatScore,
    sanitizedText: sanitized,
    detectedThreats,
    mitigationsApplied,
    telemetry: {
      scannedLength: rawInput.length,
      patternsEvaluated: INJECTION_PATTERNS.length + SENSITIVE_PATTERNS.length,
      timestamp: Date.now(),
    },
  };
}
