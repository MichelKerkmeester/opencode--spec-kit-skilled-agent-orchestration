// ───────────────────────────────────────────────────────────────
// MODULE: Tool Detection
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TOOL DETECTION
// ───────────────────────────────────────────────────────────────
// Detects tool calls, classifies conversation phases, and identifies prose context

import type { ConversationPhaseLabel } from '../types/session-types';
import { classifyConversationPhase as classifyPhaseViaSignals } from '../lib/phase-classifier';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Confidence level for tool call detection */
export type ToolConfidence = 'high' | 'medium' | 'low';

/** Result of tool call detection */
export interface ToolUsage {
  tool: string;
  confidence: ToolConfidence;
}

/** Tool call record for phase classification */
export interface ToolCallRecord {
  tool?: string;
  [key: string]: unknown;
}

/** Conversation phase classification labels */
export type ConversationPhase = ConversationPhaseLabel;

// ───────────────────────────────────────────────────────────────
// 3. TOOL CALL DETECTION
// ───────────────────────────────────────────────────────────────
function detectToolCall(text: string): ToolUsage | null {
  if (!text || typeof text !== 'string') return null;

  const explicitMatch: RegExpMatchArray | null = text.match(/\bTool:\s*(\w+)/i);
  if (explicitMatch) {
    return { tool: explicitMatch[1], confidence: 'high' };
  }

  const callSyntaxMatch: RegExpMatchArray | null = text.match(/^\s*(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch|Skill)\s*\(/);
  if (callSyntaxMatch) {
    return { tool: callSyntaxMatch[1], confidence: 'high' };
  }

  const usingToolMatch: RegExpMatchArray | null = text.match(/\busing\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s+tool\b/i);
  if (usingToolMatch) {
    return { tool: usingToolMatch[1], confidence: 'medium' };
  }

  const calledMatch: RegExpMatchArray | null = text.match(/\bcalled?\s+(Read|Edit|Write|Bash|Grep|Glob|Task|WebFetch|WebSearch)\s*\(/i);
  if (calledMatch) {
    return { tool: calledMatch[1], confidence: 'medium' };
  }

  return null;
}

// ───────────────────────────────────────────────────────────────
// 4. PROSE CONTEXT DETECTION
// ───────────────────────────────────────────────────────────────
function isProseContext(text: string, matchStartIndex: number): boolean {
  if (matchStartIndex < 0) return false;

  const before: string = text.substring(Math.max(0, matchStartIndex - 20), matchStartIndex);
  const after: string = text.substring(matchStartIndex, Math.min(text.length, matchStartIndex + 50));

  const sentenceBefore: RegExp = /[.!?]\s*$/;
  const lowercaseAfter: RegExp = /^[a-z]/;

  if (sentenceBefore.test(before) && lowercaseAfter.test(after)) {
    return true;
  }

  const contextWindow: string = before.substring(Math.max(0, before.length - 10)) + after.substring(0, 30);
  const prosePatterns: readonly RegExp[] = [
    /\bread\s+more\b/i,
    /\bread\s+about\b/i,
    /\bread\s+the\b/i,
    /\bto\s+read\b/i,
    /\byou\s+should\s+read\b/i
  ] as const;

  for (const pattern of prosePatterns) {
    if (pattern.test(contextWindow)) {
      return true;
    }
  }

  return false;
}

// ───────────────────────────────────────────────────────────────
// 5. CONVERSATION PHASE CLASSIFICATION
// ───────────────────────────────────────────────────────────────
/** Pass-through wrapper. Prefer classifyPhaseViaSignals from phase-classifier.ts directly. */
function classifyConversationPhase(toolCalls: ToolCallRecord[], messageContent: string): ConversationPhase {
  return classifyPhaseViaSignals(toolCalls, messageContent);
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  detectToolCall,
  isProseContext,
  classifyConversationPhase,
};
