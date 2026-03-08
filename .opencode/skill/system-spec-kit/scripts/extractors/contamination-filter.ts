// ---------------------------------------------------------------
// MODULE: ContaminationFilter
// ---------------------------------------------------------------
// Removes orchestration chatter before semantic extraction
// ---------------------------------------------------------------

const DEFAULT_DENYLIST: RegExp[] = [
  /\bI'll execute this step by step\b/gi,
  /\bLet me analyze\b/gi,
  /\bI'll now\b/gi,
  /\bStep\s+\d+:/gi,
  /\bLet me check\b/gi,
  /\bI need to\b/gi,
  /\bI'll start by\b/gi,
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
