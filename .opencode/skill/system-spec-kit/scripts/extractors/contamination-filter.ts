// ───────────────────────────────────────────────────────────────
// 1. CONTAMINATION FILTER
// ───────────────────────────────────────────────────────────────
// Removes orchestration chatter before semantic extraction

const DEFAULT_DENYLIST: RegExp[] = [
  // Orchestration chatter
  /\bI'll execute this step by step\b/gi,
  /\bLet me analyze (?:this|the|your)\b/gi,
  /\bI'll now\b/gi,
  // F-11: Tighten "Step N:" to require orchestration context (not docs/headings)
  /^(?:\s*)Step\s+\d+:\s+(?:I'll|Let me|I need to|I will|Now)\b/gim,
  /\bLet me check\b/gi,
  /\bI'll start by\b/gi,
  /\bLet me start\b/gi,
  /\bLet me read\b/gi,
  /\bLet me look (?:at|into) (?:this|the|that)\b/gi,
  /\bI'll begin\b/gi,
  /\bI'll proceed\b/gi,
  /\bI'll handle\b/gi,
  /\bI will now\b/gi,
  /\bHere is my analysis\b/gi,
  /\bBased on my review\b/gi,
  /\bMoving on to\b/gi,
  /\bLooking at this more closely\b/gi,
  /\bFirst,?\s+(?:let me|I'll|I need to)\b/gi,
  /\bNow(?:,?\s+| )(?:let me|I'll|I need to)\b/gi,
  /\bNext,?\s+(?:let me|I'll|I need to)\b/gi,
  // AI self-referencing
  /\bAs an AI\b/gi,
  /\bAs a language model\b/gi,
  /\bAs your assistant\b/gi,
  // Filler phrases
  /\bOf course!\b/gi,
  /\bSure!\s/gi,
  /\bAbsolutely!\s/gi,
  // Tool scaffolding
  /\bI'll use the \w+ tool\b/gi,
  /\bUsing the \w+ tool\b/gi,
  /\bLet me use the \w+ tool\b/gi,
  // F-10: Tool titles with path arguments (Read/Edit/Write/Grep/Glob/Bash)
  /\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+(?:tool\s+)?(?:on\s+)?[\/\.][^\s]+/gi,
];

interface FilterResult {
  cleanedText: string;
  removedPhrases: string[];
  hadContamination: boolean;
}

function normalizeWhitespace(input: string): string {
  return input
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .trim();
}

function filterContamination(
  input: string,
  denylist: RegExp[] = DEFAULT_DENYLIST
): FilterResult {
  if (!input || typeof input !== 'string') {
    return { cleanedText: '', removedPhrases: [], hadContamination: false };
  }

  // F-10: Pre-normalize — NFKC Unicode, collapse whitespace, strip zero-width chars
  let cleaned = input
    .normalize('NFKC')
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')
    .replace(/[ \t]+/g, ' ');

  const removedPhrases: string[] = [];

  for (const pattern of denylist) {
    const matches = cleaned.match(pattern);
    if (matches && matches.length > 0) {
      removedPhrases.push(...matches.map((match) => match.trim()));
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
  };
}

export {
  filterContamination,
};

export type {
  FilterResult,
};
