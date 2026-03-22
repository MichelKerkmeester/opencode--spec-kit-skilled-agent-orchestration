// ───────────────────────────────────────────────────────────────
// MODULE: Contamination Filter
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. CONTAMINATION FILTER
// ───────────────────────────────────────────────────────────────
// Removes orchestration chatter before semantic extraction

import type { DataSource } from '../utils/input-normalizer';
import { getSourceCapabilities, type SourceCapabilities } from '../utils/source-capabilities';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/

type ContaminationSeverity = 'low' | 'medium' | 'high';

interface DenylistEntry {
  label: string;
  pattern: RegExp;
  severity: ContaminationSeverity;
}

type DenylistPattern = DenylistEntry | RegExp;

/* ───────────────────────────────────────────────────────────────
   2. DENYLIST PATTERNS
------------------------------------------------------------------*/

const DEFAULT_DENYLIST: readonly DenylistEntry[] = [
  // Orchestration chatter — medium severity
  { label: 'step-by-step orchestration', pattern: /\bI'll execute this step by step\b/gi, severity: 'medium' },
  { label: 'analysis preamble', pattern: /\bLet me analyze (?:this|the|your)\b/gi, severity: 'medium' },
  { label: 'progress narration', pattern: /\bI'll now\b/gi, severity: 'medium' },
  // F-11: Tighten "Step N:" to require orchestration context (not docs/headings)
  { label: 'step narration', pattern: /^(?:\s*)Step\s+\d+:\s+(?:I'll|Let me|I need to|I will)\b/gim, severity: 'medium' },
  // Preamble phrases — low severity
  { label: 'check preamble', pattern: /\bLet me check\b/gi, severity: 'low' },
  { label: 'start-by preamble', pattern: /\bI'll start by\b/gi, severity: 'low' },
  { label: 'start preamble', pattern: /\bLet me start\b/gi, severity: 'low' },
  { label: 'read preamble', pattern: /\bLet me read\b/gi, severity: 'low' },
  { label: 'look-into preamble', pattern: /\bLet me look (?:at|into) (?:this|the|that)\b/gi, severity: 'low' },
  { label: 'begin preamble', pattern: /\bI'll begin\b/gi, severity: 'low' },
  { label: 'proceed preamble', pattern: /\bI'll proceed\b/gi, severity: 'low' },
  { label: 'handle preamble', pattern: /\bI'll handle\b/gi, severity: 'low' },
  { label: 'will-now preamble', pattern: /\bI will now\b/gi, severity: 'low' },
  // Orchestration headings/transitions — medium severity
  { label: 'analysis heading', pattern: /\bHere is my analysis\b/gi, severity: 'medium' },
  { label: 'review heading', pattern: /\bBased on my review\b/gi, severity: 'medium' },
  { label: 'transition phrase', pattern: /\bMoving on to\b/gi, severity: 'low' },
  { label: 'close-reading transition', pattern: /\bLooking at this more closely\b/gi, severity: 'medium' },
  { label: 'first-step narration', pattern: /\bFirst,?\s+(?:let me|I'll|I need to)\b/gi, severity: 'medium' },
  { label: 'now-step narration', pattern: /\bNow(?:,?\s+| )(?:let me|I'll|I need to)\b/gi, severity: 'medium' },
  { label: 'next-step narration', pattern: /\bNext,?\s+(?:let me|I'll|I need to)\b/gi, severity: 'medium' },
  // AI self-referencing — high severity
  { label: 'ai self-reference', pattern: /\bAs an AI\b/gi, severity: 'high' },
  { label: 'language-model self-reference', pattern: /\bAs a language model\b/gi, severity: 'high' },
  { label: 'assistant self-reference', pattern: /\bAs your assistant\b/gi, severity: 'high' },
  // Filler phrases — low severity
  { label: 'generic affirmation', pattern: /\bOf course!\b/gi, severity: 'low' },
  { label: 'sure filler', pattern: /\bSure!\s/gi, severity: 'low' },
  { label: 'absolute filler', pattern: /\bAbsolutely!\s/gi, severity: 'low' },
  // Tool scaffolding — high severity
  { label: 'tool usage narration', pattern: /\bI'll use the \w+ tool\b/gi, severity: 'high' },
  { label: 'tool usage narration active', pattern: /\bUsing the \w+ tool\b/gi, severity: 'high' },
  { label: 'tool usage preamble', pattern: /\bLet me use the \w+ tool\b/gi, severity: 'high' },
  // F-10: Tool titles with path arguments (Read/Edit/Write/Grep/Glob/Bash) — high severity
  { label: 'tool title with path', pattern: /\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+tool\s+(?:on\s+)?[\/\.][^\s]+/gi, severity: 'high' },
  // API/service error leakage — high severity
  { label: 'api error prefix', pattern: /\bAPI\s+Error:\s*\d{3}\b/gi, severity: 'high' },
  { label: 'json error payload', pattern: /\{"\s*(?:type|error)"\s*:\s*"\s*(?:error|api_error|overloaded_error|rate_limit_error|server_error|invalid_request_error)\b/gi, severity: 'high' },
  { label: 'request id leak', pattern: /"request_id"\s*:\s*"req_[a-zA-Z0-9]+"/gi, severity: 'high' },
  // Hedging phrases — low severity (T017)
  { label: 'hedging i-think', pattern: /\bI think\b(?!\s+(?:we should|you should|it would|this is good|this approach))/gi, severity: 'low' },
  { label: 'hedging it-seems', pattern: /\bit seems\b/gi, severity: 'low' },
  { label: 'hedging perhaps', pattern: /\bPerhaps\b(?=\s+(?:I|we|the|this|that|it|you))/gi, severity: 'low' },
  { label: 'hedging might-be', pattern: /\bthis might be\b/gi, severity: 'low' },
  { label: 'hedging could-be', pattern: /\bthis could be\b/gi, severity: 'low' },
  // Conversational acknowledgment fillers — low severity (T018)
  { label: 'certainly filler', pattern: /\bCertainly!\s/gi, severity: 'low' },
  // Meta-commentary — high severity (T019)
  { label: 'ai should-note meta', pattern: /\bI should note that\b/gi, severity: 'high' },
  { label: 'ai worth-noting meta', pattern: /\bIt(?:'s| is) worth noting that\b/gi, severity: 'medium' },
  // Instruction echoing — medium severity (T020)
  { label: 'instruction echo please', pattern: /^(?:Please\s+)?(?:provide|list|explain|describe|tell me|give me)\b.{0,60}(?::\s*$)/gim, severity: 'medium' },
  // Markdown artifact patterns — medium severity (T021)
  { label: 'orphaned markdown header', pattern: /^#{1,6}\s*$/gm, severity: 'medium' },
  { label: 'stray backtick block', pattern: /^```\s*$/gm, severity: 'medium' },
  // Safety disclaimer patterns — high severity (T022)
  { label: 'safety cannot disclaimer', pattern: /\bI(?:'m| am) not able to(?! (?:reproduce|replicate|confirm|verify|find|locate|identify|determine|access|connect)\b)\b/gi, severity: 'high' },
  { label: 'safety i-cannot disclaimer', pattern: /\bI cannot\b(?=\s+(?:provide|assist|help|access|create|generate|write|give))/gi, severity: 'high' },
  { label: 'safety please-consult disclaimer', pattern: /\bPlease consult\b/gi, severity: 'high' },
  // Redundant certainty markers — low severity (T023)
  { label: 'certainty important-note marker', pattern: /\bIt is important to note(?: that)?\b/gi, severity: 'low' },
  { label: 'certainty worth-mentioning marker', pattern: /\bIt is worth mentioning(?: that)?\b/gi, severity: 'low' },
  { label: 'certainty keep-in-mind marker', pattern: /\bIt(?:'s| is) important to keep in mind\b/gi, severity: 'low' },
  { label: 'certainty redundant-assurance marker', pattern: /^(?:I am )?(?:absolutely |completely )?(?:certain|confident|sure) that /gim, severity: 'low' },
] as const;

interface FilterResult {
  cleanedText: string;
  removedPhrases: string[];
  hadContamination: boolean;
  matchedPatterns: string[];
  maxSeverity: ContaminationSeverity | null;
}

interface FilterOptions {
  captureSource?: DataSource;
  sourceCapabilities?: SourceCapabilities;
}

/* ───────────────────────────────────────────────────────────────
   3. FILTER LOGIC
------------------------------------------------------------------*/

function clonePattern(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags);
}

function getDenylistLabel(entry: DenylistPattern): string {
  return entry instanceof RegExp ? entry.toString() : entry.label;
}

function getDenylistPattern(entry: DenylistPattern): RegExp {
  return entry instanceof RegExp ? entry : entry.pattern;
}

function getDenylistSeverity(entry: DenylistPattern, options?: FilterOptions): ContaminationSeverity {
  if (entry instanceof RegExp) {
    return 'high';
  }

  const sourceCapabilities = options?.sourceCapabilities ?? getSourceCapabilities(options?.captureSource);
  if (entry.label === 'tool title with path' && sourceCapabilities.toolTitleWithPathExpected) {
    return 'low';
  }

  return entry.severity;
}

const SEVERITY_RANK: Record<ContaminationSeverity, number> = { low: 0, medium: 1, high: 2 };

function maxSeverityOf(a: ContaminationSeverity | null, b: ContaminationSeverity): ContaminationSeverity {
  if (a === null) return b;
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}

function getContaminationPatternLabels(denylist: readonly DenylistPattern[] = DEFAULT_DENYLIST): string[] {
  return denylist.map((entry) => getDenylistLabel(entry));
}

function normalizeWhitespace(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .trim();
}

function filterContamination(
  input: string,
  denylist: readonly DenylistPattern[] = DEFAULT_DENYLIST,
  options?: FilterOptions,
): FilterResult {
  if (!input || typeof input !== 'string') {
    return { cleanedText: '', removedPhrases: [], hadContamination: false, matchedPatterns: [], maxSeverity: null };
  }

  // F-10: Pre-normalize — NFKC Unicode, collapse whitespace, strip zero-width chars
  let cleaned = input
    .normalize('NFKC')
    .replace(/[\u00AD\u034F\u061C\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')
    .replace(/[ \t]+/g, ' ');

  const removedPhrases: string[] = [];
  const matchedPatterns = new Set<string>();
  let severity: ContaminationSeverity | null = null;

  for (const entry of denylist) {
    const pattern = clonePattern(getDenylistPattern(entry));
    const matches = cleaned.match(pattern);
    if (matches && matches.length > 0) {
      removedPhrases.push(...matches.map((match) => match.trim()));
      matchedPatterns.add(getDenylistLabel(entry));
      severity = maxSeverityOf(severity, getDenylistSeverity(entry, options));
      cleaned = cleaned.replace(pattern, ' ');
    }
  }

  // F-31: Post-cleanup — orphaned punctuation, double-spaces, leading conjunctions
  cleaned = cleaned
    .replace(/^\s*[,;:]\s*/gm, '')           // orphaned leading punctuation
    .replace(/\s+([,;:!?.])/g, '$1')          // space before punctuation
    .replace(/^(?:And|But|Or|So|Then)\s+/gim, '') // orphaned leading conjunctions
    .replace(/ {2,}/g, ' ');                   // collapse double-spaces

  return {
    cleanedText: normalizeWhitespace(cleaned),
    removedPhrases,
    hadContamination: removedPhrases.length > 0,
    matchedPatterns: [...matchedPatterns],
    maxSeverity: severity,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
------------------------------------------------------------------*/

export {
  DEFAULT_DENYLIST,
  SEVERITY_RANK,
  filterContamination,
  getContaminationPatternLabels,
};

export type {
  ContaminationSeverity,
  DenylistEntry,
  DenylistPattern,
  FilterOptions,
  FilterResult,
};
