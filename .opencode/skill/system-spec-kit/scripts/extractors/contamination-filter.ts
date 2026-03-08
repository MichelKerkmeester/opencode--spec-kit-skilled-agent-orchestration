// ---------------------------------------------------------------
// MODULE: Contamination Filter
// ---------------------------------------------------------------
// Removes orchestration chatter before semantic extraction

const DEFAULT_DENYLIST: RegExp[] = [
  // Orchestration chatter
  /\bI'll execute this step by step\b/gi,
  /\bLet me analyze\b/gi,
  /\bI'll now\b/gi,
  /\bStep\s+\d+:/gi,
  /\bLet me check\b/gi,
  /\bI need to\b/gi,
  /\bI'll start by\b/gi,
  /\bLet me start\b/gi,
  /\bLet me read\b/gi,
  /\bLet me look\b/gi,
  /\bI'll begin\b/gi,
  /\bI'll proceed\b/gi,
  /\bI'll handle\b/gi,
  /\bFirst,?\s+(?:let me|I'll|I need to)\b/gi,
  /\bNow(?:,?\s+| )(?:let me|I'll|I need to)\b/gi,
  /\bNext,?\s+(?:let me|I'll|I need to)\b/gi,
  // AI self-referencing
  /\bAs an AI\b/gi,
  /\bAs a language model\b/gi,
  /\bAs your assistant\b/gi,
  // Filler phrases
  /\bI hope this helps\b/gi,
  /\bLet me know if\b/gi,
  /\bFeel free to\b/gi,
  /\bIs there anything else\b/gi,
  /\bGreat question\b/gi,
  /\bThat's a great\b/gi,
  /\bHappy to help\b/gi,
  /\bOf course!\b/gi,
  /\bSure!\s/gi,
  /\bAbsolutely!\s/gi,
  // Tool scaffolding
  /\bI'll use the \w+ tool\b/gi,
  /\bUsing the \w+ tool\b/gi,
  /\bLet me use\b/gi,
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

  let cleaned = input;
  const removedPhrases: string[] = [];

  for (const pattern of denylist) {
    const matches = cleaned.match(pattern);
    if (matches && matches.length > 0) {
      removedPhrases.push(...matches.map((match) => match.trim()));
      cleaned = cleaned.replace(pattern, ' ');
    }
  }

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
