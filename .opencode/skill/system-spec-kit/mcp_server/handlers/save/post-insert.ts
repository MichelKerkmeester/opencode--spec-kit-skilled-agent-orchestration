// ───────────────────────────────────────────────────────────────
// MODULE: Post Insert
// ───────────────────────────────────────────────────────────────
import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';

import * as embeddings from '../../lib/providers/embeddings.js';
import { processCausalLinks } from '../causal-links-processor.js';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags.js';
import {
  extractEntities,
  filterEntities,
  refreshAutoEntitiesForMemory,
} from '../../lib/extraction/entity-extractor.js';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries.js';
import { runEntityLinking } from '../../lib/search/entity-linker.js';
import { onIndex, isGraphRefreshEnabled } from '../../lib/search/graph-lifecycle.js';
import { toErrorMessage } from '../../utils/index.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Duplicate-save no-op feedback hardening


interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

// C5-4: Track which enrichment steps succeeded
export interface EnrichmentStatus {
  causalLinks: boolean;
  entityExtraction: boolean;
  summaries: boolean;
  entityLinking: boolean;
  graphLifecycle: boolean;
}

export interface PostInsertEnrichmentResult {
  causalLinksResult: CausalLinksResult | null;
  enrichmentStatus: EnrichmentStatus;
}

/**
 * Run post-insert enrichment pipeline for a newly saved memory.
 *
 * Sequentially executes: causal links processing, entity extraction (R10),
 * summary generation (R8), and cross-document entity linking (S5).
 * Each step is independently guarded by its feature flag and wrapped
 * in try-catch so a single failure does not block the others.
 *
 * @param database - The SQLite database instance.
 * @param id - The memory row ID to enrich.
 * @param parsed - Parsed memory file data from the memory parser.
 * @returns PostInsertEnrichmentResult with causal links outcome.
 */
export async function runPostInsertEnrichment(
  database: BetterSqlite3.Database,
  id: number,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
): Promise<PostInsertEnrichmentResult> {
  // C5-4: Track enrichment step outcomes
  const enrichmentStatus: EnrichmentStatus = {
    causalLinks: false,
    entityExtraction: false,
    summaries: false,
    entityLinking: false,
    graphLifecycle: false,
  };

  // CAUSAL LINKS PROCESSING
  let causalLinksResult: CausalLinksResult | null = null;
  if (parsed.hasCausalLinks && parsed.causalLinks) {
    try {
      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
      enrichmentStatus.causalLinks = true;
      if (causalLinksResult.inserted > 0) {
        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
      }
      if (causalLinksResult.unresolved.length > 0) {
        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
      }
    } catch (causal_err: unknown) {
      const message = toErrorMessage(causal_err);
      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    }
  } else {
    // No causal links to process — not a failure
    enrichmentStatus.causalLinks = true;
  }

  // -- Auto Entity Extraction --
  if (isAutoEntitiesEnabled()) {
    try {
      const rawEntities = extractEntities(parsed.content);
      const filtered = filterEntities(rawEntities);
      // Data integrity: clean stale auto-entities before re-extraction on update
      const entityResult = refreshAutoEntitiesForMemory(database, id, filtered);
      if (entityResult.stored > 0) {
        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
      }
      enrichmentStatus.entityExtraction = true;
    } catch (entityErr: unknown) {
      const message = toErrorMessage(entityErr);
      console.warn(`[memory-save] R10 entity extraction failed: ${message}`);
    }
  } else {
    // Feature disabled — not a failure
    enrichmentStatus.entityExtraction = true;
  }

  // -- R8: Memory Summary Generation --
  if (isMemorySummariesEnabled()) {
    try {
      const summaryResult = await generateAndStoreSummary(
        database,
        id,
        parsed.content,
        (text: string) => embeddings.generateQueryEmbedding(text)
      );
      if (summaryResult.stored) {
        console.error(`[memory-summaries] Generated summary for memory #${id}`);
      }
      enrichmentStatus.summaries = true;
    } catch (summaryErr: unknown) {
      const message = toErrorMessage(summaryErr);
      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
    }
  } else {
    // Feature disabled — not a failure
    enrichmentStatus.summaries = true;
  }

  // -- S5: Cross-Document Entity Linking --
  // Runs after R10 entity storage; links entities across spec folders.
  if (isEntityLinkingEnabled() && isAutoEntitiesEnabled()) {
    try {
      const linkResult = runEntityLinking(database);
      if (linkResult.linksCreated > 0) {
        console.error(`[entity-linking] Created ${linkResult.linksCreated} cross-doc links from ${linkResult.crossDocMatches} entity matches`);
      } else if (linkResult.skippedByDensityGuard) {
        const density = typeof linkResult.edgeDensity === 'number'
          ? linkResult.edgeDensity.toFixed(3)
          : 'unknown';
        const threshold = typeof linkResult.densityThreshold === 'number'
          ? linkResult.densityThreshold.toFixed(3)
          : 'unknown';
        console.error(`[entity-linking] Skipped by density guard (density=${density}, threshold=${threshold})`);
      }
      enrichmentStatus.entityLinking = true;
    } catch (linkErr: unknown) {
      const message = toErrorMessage(linkErr);
      console.warn(`[memory-save] S5 entity linking failed: ${message}`);
    }
  } else {
    // Feature disabled — not a failure
    enrichmentStatus.entityLinking = true;
  }

  // -- D3 REQ-D3-004: Graph Lifecycle — deterministic save-time enrichment --
  // Runs last; relies on entity extraction having completed above.
  // Gated via isGraphRefreshEnabled() OR SPECKIT_ENTITY_LINKING (any active graph flag).
  // Default-OFF: no-op unless SPECKIT_GRAPH_REFRESH_MODE != 'off' or SPECKIT_ENTITY_LINKING active.
  if (isGraphRefreshEnabled() || isEntityLinkingEnabled()) {
    try {
      const indexResult = onIndex(database, id, parsed.content, {
        qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 0,
      });
      if (!indexResult.skipped) {
        if (indexResult.edgesCreated > 0) {
          console.error(`[graph-lifecycle] Created ${indexResult.edgesCreated} typed edges for memory #${id}`);
        }
        if (indexResult.llmBackfillScheduled) {
          console.error(`[graph-lifecycle] LLM backfill scheduled for memory #${id}`);
        }
      }
      enrichmentStatus.graphLifecycle = true;
    } catch (glErr: unknown) {
      const message = toErrorMessage(glErr);
      console.warn(`[memory-save] D3 graph-lifecycle enrichment failed: ${message}`);
    }
  } else {
    // Feature disabled — not a failure
    enrichmentStatus.graphLifecycle = true;
  }

  return { causalLinksResult, enrichmentStatus };
}
