// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Anti-Stuffing
// ───────────────────────────────────────────────────────────────

import { isInstructionShaped, sanitizeDerivedArray } from './sanitizer.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface AntiStuffingOptions {
  readonly maxTriggerPhrases?: number;
  readonly maxKeywords?: number;
  readonly repetitionThreshold?: number;
}

export interface AntiStuffingResult {
  readonly triggerPhrases: string[];
  readonly keywords: string[];
  readonly demotion: number;
  readonly rejected: boolean;
  readonly diagnostics: string[];
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const DEFAULT_MAX_TRIGGER_PHRASES = 24;
export const DEFAULT_MAX_KEYWORDS = 48;
const DEFAULT_REPETITION_THRESHOLD = 0.32;
const HARD_REPETITION_REJECT_THRESHOLD = 0.58;

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ───────────────────────────────────────────────────────────────

function tokenDensity(values: readonly string[]): number {
  const tokens = values.flatMap((value) => value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2));
  if (tokens.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return Math.max(...counts.values()) / tokens.length;
}

export function applyAntiStuffing(
  triggerPhrases: readonly unknown[],
  keywords: readonly unknown[],
  options: AntiStuffingOptions = {},
): AntiStuffingResult {
  const maxTriggerPhrases = options.maxTriggerPhrases ?? DEFAULT_MAX_TRIGGER_PHRASES;
  const maxKeywords = options.maxKeywords ?? DEFAULT_MAX_KEYWORDS;
  const repetitionThreshold = options.repetitionThreshold ?? DEFAULT_REPETITION_THRESHOLD;
  const diagnostics: string[] = [];

  const unsafe = [...triggerPhrases, ...keywords].some((value) => typeof value === 'string' && isInstructionShaped(value));
  if (unsafe) {
    return {
      triggerPhrases: [],
      keywords: [],
      demotion: 0,
      rejected: true,
      diagnostics: ['INSTRUCTION_SHAPED_DERIVED_VALUE_REJECTED'],
    };
  }

  const cleanTriggerPhrases = sanitizeDerivedArray(triggerPhrases, 'graph-metadata', maxTriggerPhrases);
  const cleanKeywords = sanitizeDerivedArray(keywords, 'graph-metadata', maxKeywords);
  const density = tokenDensity([...cleanTriggerPhrases, ...cleanKeywords]);
  let demotion = 1;
  let rejected = false;

  if (density >= HARD_REPETITION_REJECT_THRESHOLD) {
    rejected = true;
    demotion = 0;
    diagnostics.push(`REPETITION_DENSITY_REJECTED:${density.toFixed(3)}`);
  } else if (density > repetitionThreshold) {
    demotion = Math.max(0.15, 1 - density);
    diagnostics.push(`REPETITION_DENSITY_DEMOTED:${density.toFixed(3)}`);
  }

  if (triggerPhrases.length > maxTriggerPhrases) {
    diagnostics.push(`TRIGGER_CAP_APPLIED:${maxTriggerPhrases}`);
  }
  if (keywords.length > maxKeywords) {
    diagnostics.push(`KEYWORD_CAP_APPLIED:${maxKeywords}`);
  }

  return {
    triggerPhrases: cleanTriggerPhrases,
    keywords: cleanKeywords,
    demotion,
    rejected,
    diagnostics,
  };
}

