import type Database from 'better-sqlite3';

import type { ParsedMemory } from '../../lib/parsing/memory-parser';
import type { IndexResult } from './types';

export function checkExistingRow(
  database: Database.Database,
  parsed: ParsedMemory,
  canonicalFilePath: string,
  filePath: string,
  force: boolean,
  warnings: string[] | undefined,
): IndexResult | null {
  const existing = database.prepare(`
    SELECT id, content_hash FROM memory_index
    WHERE spec_folder = ?
      AND parent_id IS NULL
      AND (canonical_file_path = ? OR file_path = ?)
    ORDER BY id DESC
    LIMIT 1
  `).get(parsed.specFolder, canonicalFilePath, filePath) as { id: number; content_hash: string } | undefined;

  if (existing && existing.content_hash === parsed.contentHash && !force) {
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
): IndexResult | null {
  if (!force) {
    const duplicateByHash = database.prepare(`
      SELECT id, file_path, title FROM memory_index
      WHERE spec_folder = ?
        AND content_hash = ?
        AND parent_id IS NULL
        AND embedding_status != 'pending'
      ORDER BY id DESC
      LIMIT 1
    `).get(parsed.specFolder, parsed.contentHash) as { id: number; file_path: string; title: string | null } | undefined;

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
