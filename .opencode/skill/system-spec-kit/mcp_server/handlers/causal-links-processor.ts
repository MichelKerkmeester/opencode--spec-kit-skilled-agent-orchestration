// ────────────────────────────────────────────────────────────────
// MODULE: Causal Links Processor
// ────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import type BetterSqlite3 from 'better-sqlite3';

import type { CausalLinks } from '../lib/parsing/memory-parser';
import * as causalEdges from '../lib/storage/causal-edges';
import { toErrorMessage } from '../utils';
import { escapeLikePattern } from './handler-utils';

// Feature catalog: Causal edge creation (memory_causal_link)
// Feature catalog: Causal edge deletion (memory_causal_unlink)
// Feature catalog: Memory indexing (memory_save)

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

interface CausalLinkMapping {
  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
  reverse: boolean;
}

interface CausalLinksResult {
  processed: number;
  inserted: number;
  resolved: number;
  unresolved: { type: string; reference: string }[];
  errors: { type: string; reference: string; error: string }[];
}

interface MemoryIdRow {
  id: number;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
};

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

/** Resolve a memory reference (ID, path, or title) to a numeric memory ID */
function resolveMemoryReference(database: BetterSqlite3.Database, reference: string): number | null {
  if (!reference || typeof reference !== 'string') {
    return null;
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    return null;
  }

  const normalizedReference = trimmed.replace(/\\/g, '/');
  const normalizedLower = normalizedReference.toLowerCase();

  if (/^\d+$/.test(trimmed)) {
    const numericId = parseInt(trimmed, 10);
    const exists = database.prepare('SELECT id FROM memory_index WHERE id = ?').get(numericId);
    if (exists) {
      return numericId;
    }
  }

  if (normalizedLower.includes('session') || normalizedReference.match(/^\d{4}-\d{2}-\d{2}/)) {
    const bySession = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\' ORDER BY id DESC LIMIT 1
    `).get(`%${escapeLikePattern(normalizedReference)}%`) as MemoryIdRow | undefined;
    if (bySession) {
      return bySession.id;
    }
  }

  if (normalizedLower.includes('specs/') || normalizedLower.includes('memory/')) {
    const byPath = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\' ORDER BY id DESC LIMIT 1
    `).get(`%${escapeLikePattern(normalizedReference)}%`) as MemoryIdRow | undefined;
    if (byPath) {
      return byPath.id;
    }
  }

  const byTitleExact = database.prepare(`
    SELECT id FROM memory_index WHERE title = ?
  `).get(trimmed) as MemoryIdRow | undefined;
  if (byTitleExact) {
    return byTitleExact.id;
  }

  const byTitlePartial = database.prepare(`
    SELECT id FROM memory_index WHERE title LIKE ? ESCAPE '\\' ORDER BY id DESC LIMIT 1
  `).get(`%${escapeLikePattern(trimmed)}%`) as MemoryIdRow | undefined;
  if (byTitlePartial) {
    return byTitlePartial.id;
  }

  return null;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Process causal link declarations from a memory file and insert edges into the graph */
function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
  const result: CausalLinksResult = {
    processed: 0,
    inserted: 0,
    resolved: 0,
    unresolved: [],
    errors: []
  };

  if (!causalLinks || typeof causalLinks !== 'object') {
    return result;
  }

  // Initialize causal-edges module with database connection
  causalEdges.init(database);

  const memoryIdStr = String(memoryId);

  for (const [link_type, references] of Object.entries(causalLinks)) {
    if (!Array.isArray(references) || references.length === 0) {
      continue;
    }

    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
    if (!mapping) {
      console.warn(`[causal-links] Unknown link type: ${link_type}`);
      continue;
    }

    for (const reference of references) {
      result.processed++;

      let resolvedId: number | null;
      try {
        resolvedId = resolveMemoryReference(database, reference);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        result.errors.push({ type: link_type, reference, error: `Resolution failed: ${message}` });
        console.warn(`[causal-links] Failed to resolve reference "${reference}": ${message}`);
        continue;
      }

      if (!resolvedId) {
        result.unresolved.push({ type: link_type, reference });
        continue;
      }

      result.resolved++;

      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);

      try {
        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
        result.inserted++;
        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        if (message.includes('UNIQUE constraint')) {
          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
        } else {
          result.errors.push({ type: link_type, reference, error: message });
          console.warn(`[causal-links] Failed to insert edge: ${message}`);
        }
      }
    }
  }

  return result;
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  processCausalLinks,
  resolveMemoryReference,
  CAUSAL_LINK_MAPPINGS,
};

// Re-export from handler-utils for backward compatibility
export { detectSpecLevelFromParsed } from './handler-utils';

export type {
  CausalLinkMapping,
  CausalLinksResult,
};
