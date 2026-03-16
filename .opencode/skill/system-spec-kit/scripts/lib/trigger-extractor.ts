// ---------------------------------------------------------------
// MODULE: Trigger Extractor
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TRIGGER EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Script-side compatibility wrapper over the unified semantic signal extractor.

export * from '@spec-kit/shared/trigger-extractor';

import { SemanticSignalExtractor } from './semantic-signal-extractor';
import type { ExtractionResult } from '@spec-kit/shared/types';

export function extractTriggerPhrases(text: string): string[] {
  return SemanticSignalExtractor.extractTriggerPhrases(text);
}

export function extractTriggerPhrasesWithStats(text: string): ExtractionResult {
  return SemanticSignalExtractor.extractTriggerPhrasesWithStats(text);
}

export { SemanticSignalExtractor } from './semantic-signal-extractor';
