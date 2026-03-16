// ---------------------------------------------------------------
// MODULE: Contamination Filter
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CONTAMINATION FILTER
// ───────────────────────────────────────────────────────────────
// Removes orchestration chatter before semantic extraction

interface DenylistEntry {
  label: string;
  pattern: RegExp;
}

type DenylistPattern = DenylistEntry | RegExp;

const DEFAULT_DENYLIST: readonly DenylistEntry[] = [
  // Orchestration chatter
  { label: 'step-by-step orchestration', pattern: /\bI'll execute this step by step\b/gi },
  { label: 'analysis preamble', pattern: /\bLet me analyze (?:this|the|your)\b/gi },
  { label: 'progress narration', pattern: /\bI'll now\b/gi },
  // F-11: Tighten "Step N:" to require orchestration context (not docs/headings)
  { label: 'step narration', pattern: /^(?:\s*)Step\s+\d+:\s+(?:I'll|Let me|I need to|I will|Now)\b/gim },
  { label: 'check preamble', pattern: /\bLet me check\b/gi },
  { label: 'start-by preamble', pattern: /\bI'll start by\b/gi },
  { label: 'start preamble', pattern: /\bLet me start\b/gi },
  { label: 'read preamble', pattern: /\bLet me read\b/gi },
  { label: 'look-into preamble', pattern: /\bLet me look (?:at|into) (?:this|the|that)\b/gi },
  { label: 'begin preamble', pattern: /\bI'll begin\b/gi },
  { label: 'proceed preamble', pattern: /\bI'll proceed\b/gi },
  { label: 'handle preamble', pattern: /\bI'll handle\b/gi },
  { label: 'will-now preamble', pattern: /\bI will now\b/gi },
  { label: 'analysis heading', pattern: /\bHere is my analysis\b/gi },
  { label: 'review heading', pattern: /\bBased on my review\b/gi },
  { label: 'transition phrase', pattern: /\bMoving on to\b/gi },
  { label: 'close-reading transition', pattern: /\bLooking at this more closely\b/gi },
  { label: 'first-step narration', pattern: /\bFirst,?\s+(?:let me|I'll|I need to)\b/gi },
  { label: 'now-step narration', pattern: /\bNow(?:,?\s+| )(?:let me|I'll|I need to)\b/gi },
  { label: 'next-step narration', pattern: /\bNext,?\s+(?:let me|I'll|I need to)\b/gi },
  // AI self-referencing
  { label: 'ai self-reference', pattern: /\bAs an AI\b/gi },
  { label: 'language-model self-reference', pattern: /\bAs a language model\b/gi },
  { label: 'assistant self-reference', pattern: /\bAs your assistant\b/gi },
  // Filler phrases
  { label: 'generic affirmation', pattern: /\bOf course!\b/gi },
  { label: 'sure filler', pattern: /\bSure!\s/gi },
  { label: 'absolute filler', pattern: /\bAbsolutely!\s/gi },
  // Tool scaffolding
  { label: 'tool usage narration', pattern: /\bI'll use the \w+ tool\b/gi },
  { label: 'tool usage narration active', pattern: /\bUsing the \w+ tool\b/gi },
  { label: 'tool usage preamble', pattern: /\bLet me use the \w+ tool\b/gi },
  // F-10: Tool titles with path arguments (Read/Edit/Write/Grep/Glob/Bash)
  { label: 'tool title with path', pattern: /\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+(?:tool\s+)?(?:on\s+)?[\/\.][^\s]+/gi },
] as const;

interface FilterResult {
  cleanedText: string;
  removedPhrases: string[];
  hadContamination: boolean;
  matchedPatterns: string[];
}

function clonePattern(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags);
}

function getDenylistLabel(entry: DenylistPattern): string {
  return entry instanceof RegExp ? entry.toString() : entry.label;
}

function getDenylistPattern(entry: DenylistPattern): RegExp {
  return entry instanceof RegExp ? entry : entry.pattern;
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
  denylist: readonly DenylistPattern[] = DEFAULT_DENYLIST
): FilterResult {
  if (!input || typeof input !== 'string') {
    return { cleanedText: '', removedPhrases: [], hadContamination: false, matchedPatterns: [] };
  }

  // F-10: Pre-normalize — NFKC Unicode, collapse whitespace, strip zero-width chars
  let cleaned = input
    .normalize('NFKC')
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')
    .replace(/[ \t]+/g, ' ');

  const removedPhrases: string[] = [];
  const matchedPatterns = new Set<string>();

  for (const entry of denylist) {
    const pattern = clonePattern(getDenylistPattern(entry));
    const matches = cleaned.match(pattern);
    if (matches && matches.length > 0) {
      removedPhrases.push(...matches.map((match) => match.trim()));
      matchedPatterns.add(getDenylistLabel(entry));
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
  };
}

export {
  DEFAULT_DENYLIST,
  filterContamination,
  getContaminationPatternLabels,
};

export type {
  DenylistEntry,
  DenylistPattern,
  FilterResult,
};
