import type { PipelineRow } from './types.js';
/**
 * Execute Stage 2b: Enrichment (annotation-only, no score changes).
 *
 * Step 8: Anchor metadata — extract named ANCHOR sections from content
 * Step 9: Validation metadata — spec quality signals enrichment
 *
 * @param results - Scored rows from Stage 2a (steps 1-7)
 * @returns Enriched rows with annotation metadata attached
 */
export declare function executeStage2bEnrichment(results: PipelineRow[]): PipelineRow[];
//# sourceMappingURL=stage2b-enrichment.d.ts.map