// ---------------------------------------------------------------
// MODULE: Trigger Extractor
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TRIGGER EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Script-side compatibility wrapper over the unified semantic signal extractor.

import { SemanticSignalExtractor } from './semantic-signal-extractor';
import type { ExtractionResult } from '@spec-kit/shared/types';
import {
  CONFIG as TRIGGER_CONFIG,
  STOP_WORDS_ENGLISH,
} from '@spec-kit/shared/trigger-extractor';

function normalizeTextInput(text: string | null | undefined): string {
  return typeof text === 'string' ? text : '';
}

export function extractTriggerPhrases(text: string | null | undefined): string[] {
  const normalizedText = normalizeTextInput(text);
  if (normalizedText.trim().length < 3) {
    return [];
  }
  return SemanticSignalExtractor.extractTriggerPhrases(normalizedText);
}

export function extractTriggerPhrasesWithStats(text: string | null | undefined): ExtractionResult {
  const normalizedText = normalizeTextInput(text);
  if (normalizedText.trim().length < 3) {
    return {
      phrases: [],
      stats: {
        inputLength: normalizedText.length,
        cleanedLength: normalizedText.trim().length,
        tokenCount: 0,
        filteredTokenCount: 0,
        phraseCount: 0,
        extractionTimeMs: 0,
      },
      breakdown: {
        problemTerms: 0,
        technicalTerms: 0,
        decisionTerms: 0,
        actionTerms: 0,
        compoundNouns: 0,
        samples: {
          problem: [],
          technical: [],
          decision: [],
          action: [],
          compound: [],
        },
      },
    };
  }
  return SemanticSignalExtractor.extractTriggerPhrasesWithStats(normalizedText);
}

export const extract_trigger_phrases = extractTriggerPhrases;
export const extract_trigger_phrases_with_stats = extractTriggerPhrasesWithStats;
export const CONFIG = TRIGGER_CONFIG;
export { STOP_WORDS_ENGLISH };
