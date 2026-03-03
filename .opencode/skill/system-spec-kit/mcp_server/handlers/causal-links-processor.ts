// ---------------------------------------------------------------
// MODULE: Causal Links Processor
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import type { CausalLinks } from '../lib/parsing/memory-parser';
import * as causalEdges from '../lib/storage/causal-edges';
import { toErrorMessage } from '../utils';
import { escapeLikePattern } from './memory-save';

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

const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
};

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
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\'
    `).get(`%${escapeLikePattern(normalizedReference)}%`) as Record<string, unknown> | undefined;
    if (bySession) {
      return bySession.id as number;
    }
  }

  if (normalizedLower.includes('specs/') || normalizedLower.includes('memory/')) {
    const byPath = database.prepare(`
      SELECT id FROM memory_index WHERE file_path LIKE ? ESCAPE '\\'
    `).get(`%${escapeLikePattern(normalizedReference)}%`) as Record<string, unknown> | undefined;
    if (byPath) {
      return byPath.id as number;
    }
  }

  const byTitleExact = database.prepare(`
    SELECT id FROM memory_index WHERE title = ?
  `).get(trimmed) as Record<string, unknown> | undefined;
  if (byTitleExact) {
    return byTitleExact.id as number;
  }

  const byTitlePartial = database.prepare(`
    SELECT id FROM memory_index WHERE title LIKE ? ESCAPE '\\'
  `).get(`%${escapeLikePattern(trimmed)}%`) as Record<string, unknown> | undefined;
  if (byTitlePartial) {
    return byTitlePartial.id as number;
  }

  return null;
}

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

      const resolvedId = resolveMemoryReference(database, reference);

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
        console.info(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        if (message.includes('UNIQUE constraint')) {
          console.info(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
        } else {
          result.errors.push({ type: link_type, reference, error: message });
          console.warn(`[causal-links] Failed to insert edge: ${message}`);
        }
      }
    }
  }

  return result;
}

/**
 * Detect spec documentation level for a file by checking its parent spec.md.
 * Delegates to the spec.md file in the same directory (or returns null).
 */
function detectSpecLevelFromParsed(filePath: string): number | null {
  const dir = path.dirname(filePath);
  const specMdPath = path.join(dir, 'spec.md');

  try {
    if (!fs.existsSync(specMdPath)) return null;

    // Read first 2KB for SPECKIT_LEVEL marker
    const fd = fs.openSync(specMdPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // Heuristic: check sibling files
    const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
    if (siblings.includes('decision-record.md')) return 3;
    if (siblings.includes('checklist.md')) return 2;
    return 1;
  } catch (_err: unknown) {
    // AI-GUARD: Spec level detection is best-effort; null signals unknown level to caller
    return null;
  }
}

export {
  processCausalLinks,
  resolveMemoryReference,
  CAUSAL_LINK_MAPPINGS,
  detectSpecLevelFromParsed,
};

export type {
  CausalLinkMapping,
  CausalLinksResult,
};
