// ───────────────────────────────────────────────────────────────
// MODULE: Dedup
// ───────────────────────────────────────────────────────────────
import fs from 'fs';
import type Database from 'better-sqlite3';

import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
import type { IndexResult } from './types.js';

// Feature catalog: SHA-256 content-hash deduplication
// Feature catalog: Canonical ID dedup hardening
// Feature catalog: Generation-time duplicate and empty content prevention


const UNCHANGED_EMBEDDING_STATUSES = new Set(['success', 'pending', 'partial']);
const DEDUP_ELIGIBLE_EMBEDDING_STATUSES = ['success', 'partial'] as const;
const QUALITY_SCORE_EPSILON = 1e-9;
const SCOPE_COLUMNS = [
  ['tenant_id', 'tenantId'],
  ['user_id', 'userId'],
  ['agent_id', 'agentId'],
  ['session_id', 'sessionId'],
  ['shared_space_id', 'sharedSpaceId'],
] as const;

interface SamePathDedupExclusion {
  canonicalFilePath: string;
  filePath: string;
}

import type { MemoryScopeMatch } from './types.js';
import { normalizeScopeMatchValue } from './types.js';

type ScopeColumnName = typeof SCOPE_COLUMNS[number][0];

interface LatestMemoryLookupRow {
  id: number;
  content_hash: string;
  embedding_status: string | null;
  trigger_phrases: string | null;
  quality_score: number | null;
  quality_flags: string | null;
}

interface DuplicateLookupRow {
  id: number;
  file_path: string;
  title: string | null;
  content_text?: string | null;
}

function buildScopedWhereClauses(scope: MemoryScopeMatch): {
  clauses: string[];
  params: Array<string>;
} {
  const normalizedScope: MemoryScopeMatch = {
    tenantId: normalizeScopeMatchValue(scope.tenantId),
    userId: normalizeScopeMatchValue(scope.userId),
    agentId: normalizeScopeMatchValue(scope.agentId),
    sessionId: normalizeScopeMatchValue(scope.sessionId),
    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
  };
  const clauses: string[] = [];
  const params: string[] = [];

  for (const [column, key] of SCOPE_COLUMNS) {
    const value = normalizedScope[key];
    if (value === null || value === undefined) {
      clauses.push(`${column} IS NULL`);
      continue;
    }
    clauses.push(`${column} = ?`);
    params.push(value);
  }

  return { clauses, params };
}

function selectLatestExistingRow(
  database: Database.Database,
  parsed: ParsedMemory,
  pathColumn: ScopeColumnName | 'canonical_file_path' | 'file_path',
  pathValue: string,
  scopeClauses: string[],
  scopeParams: string[],
): LatestMemoryLookupRow | undefined {
  const whereClauses = [
    'spec_folder = ?',
    'parent_id IS NULL',
    `${pathColumn} = ?`,
    ...scopeClauses,
  ];

  return database.prepare(`
    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
    FROM memory_index
    WHERE ${whereClauses.join('\n      AND ')}
    ORDER BY id DESC
    LIMIT 1
  `).get(
    parsed.specFolder,
    pathValue,
    ...scopeParams,
  ) as LatestMemoryLookupRow | undefined;
}

function parseJsonStringArray(raw: string | null): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

function normalizeStringArray(values: string[]): string[] {
  return [...new Set(values.map(value => value.trim()).filter(Boolean))].sort();
}

function areEquivalentStringArrays(left: string[], right: string[]): boolean {
  const normalizedLeft = normalizeStringArray(left);
  const normalizedRight = normalizeStringArray(right);

  if (normalizedLeft.length !== normalizedRight.length) {
    return false;
  }

  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function isSamePathMetadataEquivalent(
  existing: {
    trigger_phrases: string | null;
    quality_score: number | null;
    quality_flags: string | null;
  },
  parsed: ParsedMemory,
): boolean {
  const persistedTriggerPhrases = parseJsonStringArray(existing.trigger_phrases);
  if (!areEquivalentStringArrays(persistedTriggerPhrases, parsed.triggerPhrases)) {
    return false;
  }

  const persistedQualityFlags = parseJsonStringArray(existing.quality_flags);
  if (!areEquivalentStringArrays(persistedQualityFlags, parsed.qualityFlags ?? [])) {
    return false;
  }

  const persistedQualityScore = existing.quality_score ?? 0;
  const parsedQualityScore = parsed.qualityScore ?? 0;
  return Math.abs(persistedQualityScore - parsedQualityScore) <= QUALITY_SCORE_EPSILON;
}

function verifyStoredContentMatch(
  storedContent: string | null | undefined,
  storedPath: string | null | undefined,
  incomingContent: string,
): boolean | null {
  if (typeof storedContent === 'string') {
    return storedContent === incomingContent;
  }

  if (typeof storedPath === 'string' && storedPath.length > 0) {
    try {
      if (fs.existsSync(storedPath)) {
        return fs.readFileSync(storedPath, 'utf-8') === incomingContent;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function checkExistingRow(
  database: Database.Database,
  parsed: ParsedMemory,
  canonicalFilePath: string,
  filePath: string,
  force: boolean,
  warnings: string[] | undefined,
  scope: MemoryScopeMatch = {},
): IndexResult | null {
  const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
  const candidates = [
    selectLatestExistingRow(
      database,
      parsed,
      'canonical_file_path',
      canonicalFilePath,
      scopeClauses,
      scopeParams,
    ),
  ];

  if (filePath !== canonicalFilePath) {
    candidates.push(
      selectLatestExistingRow(
        database,
        parsed,
        'file_path',
        filePath,
        scopeClauses,
        scopeParams,
      ),
    );
  }

  const existing = candidates
    .filter((candidate): candidate is LatestMemoryLookupRow => candidate !== undefined)
    .sort((left, right) => right.id - left.id)[0];

  const existingStatus = existing?.embedding_status ?? null;
  const isUnchangedEligible = existingStatus !== null && UNCHANGED_EMBEDDING_STATUSES.has(existingStatus);
  const isMetadataEquivalent = existing
    ? isSamePathMetadataEquivalent(existing, parsed)
    : false;

  // P1-4 FIX: Check content hash even during force reindex to prevent duplicate
  // row accumulation. If content AND metadata are identical, the embedding would
  // not change either, so re-indexing provides no value and creates duplicates.
  if (existing && existing.content_hash === parsed.contentHash && isUnchangedEligible && isMetadataEquivalent) {
    return {
      status: 'unchanged',
      id: existing.id,
      specFolder: parsed.specFolder,
      title: parsed.title ?? '',
      triggerPhrases: parsed.triggerPhrases,
      contextType: parsed.contextType,
      importanceTier: parsed.importanceTier,
      warnings,
    };
  }

  return null;
}

export function checkContentHashDedup(
  database: Database.Database,
  parsed: ParsedMemory,
  force: boolean,
  warnings: string[] | undefined,
  samePathExclusion?: SamePathDedupExclusion,
  scope: MemoryScopeMatch = {},
): IndexResult | null {
  if (!force) {
    const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
    const whereClauses = [
      'spec_folder = ?',
      'content_hash = ?',
      'parent_id IS NULL',
      'embedding_status IN (?, ?)',
      ...scopeClauses,
    ];
    const duplicateParams: Array<string> = [
      parsed.specFolder,
      parsed.contentHash,
      ...DEDUP_ELIGIBLE_EMBEDDING_STATUSES,
      ...scopeParams,
    ];

    if (samePathExclusion) {
      whereClauses.push('file_path != ?');
      duplicateParams.push(samePathExclusion.filePath);
      whereClauses.push('(canonical_file_path IS NULL OR canonical_file_path != ?)');
      duplicateParams.push(samePathExclusion.canonicalFilePath);
    }

    const duplicateByHash = database.prepare(`
      SELECT id, file_path, title, content_text
      FROM memory_index
      WHERE ${whereClauses.join('\n        AND ')}
      ORDER BY id DESC
      LIMIT 1
    `).get(...duplicateParams) as DuplicateLookupRow | undefined;

    if (duplicateByHash) {
      const verifiedMatch = verifyStoredContentMatch(
        duplicateByHash.content_text,
        duplicateByHash.file_path,
        parsed.content,
      );
      if (verifiedMatch === false) {
        console.warn(`[memory-save] Hash match for memory #${duplicateByHash.id} failed secondary content verification; continuing save`);
        return null;
      }
      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
      return {
        status: 'duplicate',
        id: duplicateByHash.id,
        specFolder: parsed.specFolder,
        title: parsed.title ?? duplicateByHash.title ?? '',
        triggerPhrases: parsed.triggerPhrases,
        contextType: parsed.contextType,
        importanceTier: parsed.importanceTier,
        warnings,
        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
      };
    }
  }

  return null;
}
