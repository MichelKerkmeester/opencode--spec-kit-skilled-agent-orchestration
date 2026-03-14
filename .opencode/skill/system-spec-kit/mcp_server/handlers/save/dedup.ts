// ───────────────────────────────────────────────────────────────
// 1. DEDUP
// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';

import type { ParsedMemory } from '../../lib/parsing/memory-parser';
import type { IndexResult } from './types';

// Feature catalog: SHA-256 content-hash deduplication
// Feature catalog: Canonical ID dedup hardening
// Feature catalog: Generation-time duplicate and empty content prevention


const UNCHANGED_EMBEDDING_STATUSES = new Set(['success', 'pending', 'partial']);
const DEDUP_ELIGIBLE_EMBEDDING_STATUSES = ['success', 'partial'] as const;
const QUALITY_SCORE_EPSILON = 1e-9;

interface SamePathDedupExclusion {
  canonicalFilePath: string;
  filePath: string;
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

export function checkExistingRow(
  database: Database.Database,
  parsed: ParsedMemory,
  canonicalFilePath: string,
  filePath: string,
  force: boolean,
  warnings: string[] | undefined,
): IndexResult | null {
  const existing = database.prepare(`
    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
    FROM memory_index
    WHERE spec_folder = ?
      AND parent_id IS NULL
      AND (canonical_file_path = ? OR file_path = ?)
    ORDER BY id DESC
    LIMIT 1
  `).get(parsed.specFolder, canonicalFilePath, filePath) as {
    id: number;
    content_hash: string;
    embedding_status: string | null;
    trigger_phrases: string | null;
    quality_score: number | null;
    quality_flags: string | null;
  } | undefined;

  const existingStatus = existing?.embedding_status ?? null;
  const isUnchangedEligible = existingStatus !== null && UNCHANGED_EMBEDDING_STATUSES.has(existingStatus);
  const isMetadataEquivalent = existing
    ? isSamePathMetadataEquivalent(existing, parsed)
    : false;

  if (existing && existing.content_hash === parsed.contentHash && isUnchangedEligible && isMetadataEquivalent && !force) {
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
): IndexResult | null {
  if (!force) {
    const duplicateQuery = samePathExclusion
      ? `
      SELECT id, file_path, title FROM memory_index
      WHERE spec_folder = ?
        AND content_hash = ?
        AND parent_id IS NULL
        AND embedding_status IN (?, ?)
        AND file_path != ?
        AND (canonical_file_path IS NULL OR canonical_file_path != ?)
      ORDER BY id DESC
      LIMIT 1
    `
      : `
      SELECT id, file_path, title FROM memory_index
      WHERE spec_folder = ?
        AND content_hash = ?
        AND parent_id IS NULL
        AND embedding_status IN (?, ?)
      ORDER BY id DESC
      LIMIT 1
    `;

    const duplicateParams = samePathExclusion
      ? [
          parsed.specFolder,
          parsed.contentHash,
          ...DEDUP_ELIGIBLE_EMBEDDING_STATUSES,
          samePathExclusion.filePath,
          samePathExclusion.canonicalFilePath,
        ]
      : [
          parsed.specFolder,
          parsed.contentHash,
          ...DEDUP_ELIGIBLE_EMBEDDING_STATUSES,
        ];

    const duplicateByHash = database.prepare(duplicateQuery).get(...duplicateParams) as {
      id: number;
      file_path: string;
      title: string | null;
    } | undefined;

    if (duplicateByHash) {
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
