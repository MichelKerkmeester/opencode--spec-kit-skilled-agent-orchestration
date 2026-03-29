// ---------------------------------------------------------------
// MODULE: Chunking
// ---------------------------------------------------------------
// Feature catalog: Anchor-aware chunk thinning

import type { PriorityPatterns, PriorityBuckets } from './types.js';

// ---------------------------------------------------------------
// 1. CONFIGURATION
//
// These constants are the SINGLE SOURCE OF TRUTH for text length limits.
// Other modules (embeddings.ts, hf-local.ts) import from here.
// ---------------------------------------------------------------

/**
 * Maximum text length for embedding generation.
 * This value is used across all embedding providers.
 * Based on nomic-embed-text-v1.5 context window (~8192 tokens).
 */
export const MAX_TEXT_LENGTH: number = 8000;
/** Defines reserved overview. */
export const RESERVED_OVERVIEW: number = 500;
/** Defines reserved outcome. */
export const RESERVED_OUTCOME: number = 300;
/** Defines min section length. */
export const MIN_SECTION_LENGTH: number = 20;

const PRIORITY_PATTERNS: PriorityPatterns = {
  high: /overview|summary|decision|chose|key outcome|conclusion|result|important|critical|must|required/i,
  medium: /implementation|file|change|technical|approach|solution|method|function|class|component/i,
};

// ---------------------------------------------------------------
// 2. SEMANTIC CHUNKING
// ---------------------------------------------------------------

/**
 * Intelligently chunk text to fit within max_length while preserving important content.
 * Priority: 1) First RESERVED_OVERVIEW chars, 2) Last RESERVED_OUTCOME chars,
 * 3) Decision sections, 4) Fill remaining with high -> medium -> low priority.
 */
export function semanticChunk(text: string, maxLength: number = MAX_TEXT_LENGTH): string {
  if (text.length <= maxLength) {
    return text;
  }

  const originalLength = text.length;

  const overview = text.substring(0, RESERVED_OVERVIEW);
  const outcome = text.substring(text.length - RESERVED_OUTCOME);

  let remainingBudget = maxLength - overview.length - outcome.length - 10;

  const middleText = text.substring(RESERVED_OVERVIEW, text.length - RESERVED_OUTCOME);
  const sections = middleText.split(/\n#{1,3}\s|\n\n/).filter(s => s.trim().length >= MIN_SECTION_LENGTH);

  const priorities: PriorityBuckets = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };

  sections.forEach((section: string) => {
    const trimmed = section.trim();
    if (trimmed.length < MIN_SECTION_LENGTH) return;

    if (/decision|chose|decided|selected|picked|concluded/i.test(trimmed)) {
      priorities.critical.push(trimmed);
    } else if (PRIORITY_PATTERNS.high.test(trimmed)) {
      priorities.high.push(trimmed);
    } else if (PRIORITY_PATTERNS.medium.test(trimmed)) {
      priorities.medium.push(trimmed);
    } else {
      priorities.low.push(trimmed);
    }
  });

  const includedSections: string[] = [];

  for (const section of priorities.critical) {
    includedSections.push(section);
    remainingBudget -= section.length + 2;
  }

  for (const priority of ['high', 'medium', 'low'] as const) {
    for (const section of priorities[priority]) {
      if (remainingBudget <= 0) break;
      if (section.length + 2 <= remainingBudget) {
        includedSections.push(section);
        remainingBudget -= section.length + 2;
      }
    }
    if (remainingBudget <= 0) break;
  }

  let result = overview;
  if (includedSections.length > 0) {
    result += '\n\n' + includedSections.join('\n\n');
  }
  result += '\n\n' + outcome;

  if (result.length > maxLength) {
    result = result.substring(0, maxLength);
  }

  console.warn(`[chunking] Semantic chunking: ${originalLength} -> ${result.length} chars (${Math.round((1 - result.length / originalLength) * 100)}% reduced)`);

  return result.trim();
}
