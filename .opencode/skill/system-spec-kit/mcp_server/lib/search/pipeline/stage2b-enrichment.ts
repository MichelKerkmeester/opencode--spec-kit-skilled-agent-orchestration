// ───────────────────────────────────────────────────────────────
// MODULE: Stage 2b Enrichment
// ───────────────────────────────────────────────────────────────
// B4 DECOMPOSITION: Extracted from stage2-fusion.ts steps 8-9.
// Pure annotation — no score mutation. Separated to clarify that
// enrichment is logically distinct from scoring (steps 1-7).
//
// This module enriches results within Stage 2, before validation-signal
// scoring (step 9). It attaches metadata to rows without changing any
// score fields.

import type { PipelineRow } from './types.js';
import { enrichResultsWithAnchorMetadata } from '../anchor-metadata.js';
import { enrichResultsWithValidationMetadata } from '../validation-metadata.js';

/**
 * Execute Stage 2b: Enrichment (annotation-only, no score changes).
 *
 * Step 8: Anchor metadata — extract named ANCHOR sections from content
 * Step 9: Validation metadata — spec quality signals enrichment
 *
 * @param results - Scored rows from Stage 2a (steps 1-7)
 * @returns Enriched rows with annotation metadata attached
 */
export function executeStage2bEnrichment(results: PipelineRow[]): PipelineRow[] {
  let enriched = results;

  // -- Step 8: Anchor metadata annotation --
  // Pure annotation: attach AnchorMetadata[] to rows that contain ANCHOR tags.
  // No scores are changed.
  try {
    enriched = enrichResultsWithAnchorMetadata(enriched);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2b-enrichment] anchor metadata enrichment failed: ${message}`);
  }

  // -- Step 9: Validation metadata enrichment --
  // Extract spec quality signals (SPECKIT_LEVEL, quality_score,
  // importance_tier, completion markers) and attach as `validationMetadata` key.
  try {
    enriched = enrichResultsWithValidationMetadata(enriched);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[stage2b-enrichment] validation metadata enrichment failed: ${message}`);
  }

  return enriched;
}
