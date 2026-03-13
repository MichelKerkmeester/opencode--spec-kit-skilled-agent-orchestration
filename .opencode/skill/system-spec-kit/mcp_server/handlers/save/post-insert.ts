// --- 1. POST INSERT ---

import type BetterSqlite3 from 'better-sqlite3';
import type * as memoryParser from '../../lib/parsing/memory-parser';

import * as embeddings from '../../lib/providers/embeddings';
import { processCausalLinks } from '../causal-links-processor';
import {
  isAutoEntitiesEnabled,
  isMemorySummariesEnabled,
  isEntityLinkingEnabled,
} from '../../lib/search/search-flags';
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../../lib/extraction/entity-extractor';
import { generateAndStoreSummary } from '../../lib/search/memory-summaries';
import { runEntityLinking } from '../../lib/search/entity-linker';
import { toErrorMessage } from '../../utils';

interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

export interface PostInsertEnrichmentResult {
  causalLinksResult: CausalLinksResult | null;
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
  // CAUSAL LINKS PROCESSING
  let causalLinksResult: CausalLinksResult | null = null;
  if (parsed.hasCausalLinks && parsed.causalLinks) {
    try {
      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
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
  }

  // -- Auto Entity Extraction --
  if (isAutoEntitiesEnabled()) {
    try {
      const rawEntities = extractEntities(parsed.content);
      const filtered = filterEntities(rawEntities);
      if (filtered.length > 0) {
        const entityResult = storeEntities(database, id, filtered);
        updateEntityCatalog(database, filtered);
        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
      }
    } catch (entityErr: unknown) {
      const message = toErrorMessage(entityErr);
      console.warn(`[memory-save] R10 entity extraction failed: ${message}`);
    }
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
    } catch (summaryErr: unknown) {
      const message = toErrorMessage(summaryErr);
      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
    }
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
    } catch (linkErr: unknown) {
      const message = toErrorMessage(linkErr);
      console.warn(`[memory-save] S5 entity linking failed: ${message}`);
    }
  }

  return { causalLinksResult };
}
