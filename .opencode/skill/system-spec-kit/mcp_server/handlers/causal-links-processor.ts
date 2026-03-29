// ────────────────────────────────────────────────────────────────
// MODULE: Causal Links Processor
// ────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import type BetterSqlite3 from 'better-sqlite3';

import type { CausalLinks } from '../lib/parsing/memory-parser.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import { toErrorMessage } from '../utils/index.js';
import { escapeLikePattern } from './handler-utils.js';

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

interface PathLookupRow extends MemoryIdRow {
  canonical_file_path: string | null;
  file_path: string | null;
}

interface TitleLookupRow extends MemoryIdRow {
  title: string | null;
}

interface PreparedReference {
  original: string;
  trimmed: string;
  normalizedReference: string;
  normalizedLower: string;
  escapedLike: string;
  numericId: number | null;
  isSessionLike: boolean;
  isPathLike: boolean;
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
  const resolved = resolveMemoryReferencesBatch(database, [reference]).get(reference);
  return typeof resolved === 'number' ? resolved : null;
}

function buildPreparedReference(reference: string): PreparedReference | null {
  if (!reference || typeof reference !== 'string') {
    return null;
  }

  const trimmed = reference.trim();
  if (!trimmed) {
    return null;
  }

  const normalizedReference = trimmed.replace(/\\/g, '/');
  const normalizedLower = normalizedReference.toLowerCase();
  const numericId = /^\d+$/.test(trimmed) ? Number.parseInt(trimmed, 10) : null;

  return {
    original: reference,
    trimmed,
    normalizedReference,
    normalizedLower,
    escapedLike: escapeLikePattern(normalizedReference),
    numericId: Number.isFinite(numericId) ? numericId : null,
    isSessionLike: normalizedLower.includes('session') || /^\d{4}-\d{2}-\d{2}/.test(normalizedReference),
    isPathLike:
      normalizedLower.includes('specs/')
      || normalizedLower.includes('memory/')
      || normalizedReference.includes('/'),
  };
}

function buildPathExactCandidates(normalizedReference: string): string[] {
  const candidates = new Set<string>();

  const canonical = getCanonicalPathKey(normalizedReference);
  const trimmedLeadingSlash = normalizedReference.replace(/^\/+/, '');

  candidates.add(normalizedReference);
  candidates.add(canonical);
  candidates.add(trimmedLeadingSlash);
  if (!normalizedReference.startsWith('/')) {
    candidates.add(`/${normalizedReference}`);
  }
  if (!canonical.startsWith('/')) {
    candidates.add(`/${canonical}`);
  }

  return Array.from(candidates).filter((candidate) => candidate.length > 0);
}

function buildInClause(values: readonly unknown[]): string {
  return values.map(() => '?').join(', ');
}

function getMemoryIndexColumns(database: BetterSqlite3.Database): Set<string> {
  const rows = database.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name?: string }>;
  return new Set(rows.map((row) => row.name).filter((name): name is string => typeof name === 'string'));
}

/** Resolve many memory references in batch (exact first, fuzzy fallback). */
function resolveMemoryReferencesBatch(
  database: BetterSqlite3.Database,
  references: readonly string[],
): Map<string, number | null> {
  const resolved = new Map<string, number | null>();
  const preparedRefs: PreparedReference[] = [];
  const memoryIndexColumns = getMemoryIndexColumns(database);
  const hasCanonicalFilePath = memoryIndexColumns.has('canonical_file_path');

  for (const reference of references) {
    const prepared = buildPreparedReference(reference);
    if (!prepared) {
      resolved.set(reference, null);
      continue;
    }
    preparedRefs.push(prepared);
    resolved.set(reference, null);
  }

  if (preparedRefs.length === 0) {
    return resolved;
  }

  const unresolved = (reference: PreparedReference): boolean => {
    return !resolved.has(reference.original) || resolved.get(reference.original) == null;
  };

  const setResolved = (reference: PreparedReference, id: number | null): void => {
    if (typeof id === 'number' && Number.isFinite(id)) {
      resolved.set(reference.original, id);
    }
  };

  // 1) Batch numeric IDs
  const numericIds = Array.from(
    new Set(preparedRefs.map((ref) => ref.numericId).filter((id): id is number => typeof id === 'number')),
  );
  if (numericIds.length > 0) {
    const numericRows = database.prepare(`
      SELECT id
      FROM memory_index
      WHERE id IN (${buildInClause(numericIds)})
    `).all(...numericIds) as MemoryIdRow[];
    const foundIds = new Set(numericRows.map((row) => row.id));
    for (const ref of preparedRefs) {
      if (!unresolved(ref) || ref.numericId == null) {
        continue;
      }
      if (foundIds.has(ref.numericId)) {
        setResolved(ref, ref.numericId);
      }
    }
  }

  // 2) Batch exact path matches via canonical_file_path/file_path equality
  const pathCandidates = new Set<string>();
  const pathCandidateRefs = new Map<string, PreparedReference[]>();
  for (const ref of preparedRefs) {
    if (!unresolved(ref) || (!ref.isPathLike && !ref.isSessionLike)) {
      continue;
    }

    for (const candidate of buildPathExactCandidates(ref.normalizedReference)) {
      pathCandidates.add(candidate);
      const current = pathCandidateRefs.get(candidate) ?? [];
      current.push(ref);
      pathCandidateRefs.set(candidate, current);
    }
  }

  if (pathCandidates.size > 0) {
    const values = Array.from(pathCandidates);
    const inClause = buildInClause(values);
    const pathRows = hasCanonicalFilePath
      ? database.prepare(`
        SELECT id, canonical_file_path, file_path
        FROM memory_index
        WHERE canonical_file_path IN (${inClause})
           OR file_path IN (${inClause})
        ORDER BY id DESC
      `).all(...values, ...values) as PathLookupRow[]
      : database.prepare(`
        SELECT id, NULL AS canonical_file_path, file_path
        FROM memory_index
        WHERE file_path IN (${inClause})
        ORDER BY id DESC
      `).all(...values) as PathLookupRow[];

    const idByCandidate = new Map<string, number>();
    for (const row of pathRows) {
      const rowKeys = [row.canonical_file_path, row.file_path].filter((value): value is string => typeof value === 'string');
      for (const rowKey of rowKeys) {
        if (!idByCandidate.has(rowKey)) {
          idByCandidate.set(rowKey, row.id);
        }
      }
    }

    for (const [candidate, refs] of pathCandidateRefs.entries()) {
      const id = idByCandidate.get(candidate);
      if (typeof id !== 'number') {
        continue;
      }
      for (const ref of refs) {
        if (unresolved(ref)) {
          setResolved(ref, id);
        }
      }
    }
  }

  // 3) Batch exact title matches
  const titleCandidates = Array.from(new Set(
    preparedRefs
      .filter((ref) => unresolved(ref))
      .map((ref) => ref.trimmed),
  ));

  if (titleCandidates.length > 0) {
    const titleRows = database.prepare(`
      SELECT id, title
      FROM memory_index
      WHERE title IN (${buildInClause(titleCandidates)})
      ORDER BY id DESC
    `).all(...titleCandidates) as TitleLookupRow[];

    const idByTitle = new Map<string, number>();
    for (const row of titleRows) {
      if (typeof row.title !== 'string' || idByTitle.has(row.title)) {
        continue;
      }
      idByTitle.set(row.title, row.id);
    }

    for (const ref of preparedRefs) {
      if (!unresolved(ref)) {
        continue;
      }
      const id = idByTitle.get(ref.trimmed);
      if (typeof id === 'number') {
        setResolved(ref, id);
      }
    }
  }

  // 4) Fuzzy fallback (LIKE with leading wildcard is intentionally last-resort)
  const byPathFallbackStmt = hasCanonicalFilePath
    ? database.prepare(`
      SELECT id
      FROM memory_index
      WHERE canonical_file_path LIKE ? ESCAPE '\\'
         OR file_path LIKE ? ESCAPE '\\'
      ORDER BY id DESC
      LIMIT 1
    `)
    : database.prepare(`
      SELECT id
      FROM memory_index
      WHERE file_path LIKE ? ESCAPE '\\'
      ORDER BY id DESC
      LIMIT 1
    `);
  const byTitlePartialStmt = database.prepare(`
    SELECT id
    FROM memory_index
    WHERE title LIKE ? ESCAPE '\\'
    ORDER BY id DESC
    LIMIT 1
  `);

  for (const ref of preparedRefs) {
    if (!unresolved(ref)) {
      continue;
    }

    if (ref.isSessionLike || ref.isPathLike) {
      const byPath = hasCanonicalFilePath
        ? byPathFallbackStmt.get(`%${ref.escapedLike}%`, `%${ref.escapedLike}%`) as MemoryIdRow | undefined
        : byPathFallbackStmt.get(`%${ref.escapedLike}%`) as MemoryIdRow | undefined;
      if (byPath) {
        setResolved(ref, byPath.id);
        continue;
      }
    }

    const byTitlePartial = byTitlePartialStmt.get(`%${escapeLikePattern(ref.trimmed)}%`) as MemoryIdRow | undefined;
    if (byTitlePartial) {
      setResolved(ref, byTitlePartial.id);
    }
  }

  return resolved;
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
  const allReferences: string[] = [];
  for (const references of Object.values(causalLinks)) {
    if (Array.isArray(references)) {
      allReferences.push(...references);
    }
  }
  const resolvedReferenceMap = resolveMemoryReferencesBatch(database, allReferences);

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
        const candidate = resolvedReferenceMap.get(reference);
        resolvedId = typeof candidate === 'number' ? candidate : null;
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
  resolveMemoryReferencesBatch,
  CAUSAL_LINK_MAPPINGS,
};

// Re-export from handler-utils for backward compatibility
export { detectSpecLevelFromParsed } from './handler-utils.js';

export type {
  CausalLinkMapping,
  CausalLinksResult,
};
