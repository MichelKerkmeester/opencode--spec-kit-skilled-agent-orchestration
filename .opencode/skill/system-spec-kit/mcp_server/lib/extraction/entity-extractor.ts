// ───────────────────────────────────────────────────────────────
// MODULE: Entity Extractor
// ───────────────────────────────────────────────────────────────
// Feature catalog: Auto entity extraction
// Feature-flagged via SPECKIT_AUTO_ENTITIES
// Pure-TS rule-based extraction, zero npm dependencies.
import { isEntityDenied } from './entity-denylist.js';
import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';

import type Database from 'better-sqlite3';

// Re-export canonical versions from entity-linker for backward compatibility
export { normalizeEntityName, computeEdgeDensity };

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** A single entity extracted from memory content. */
export interface ExtractedEntity {
  /** The raw entity text as found in content. */
  text: string;
  /** Classification of how the entity was detected. */
  type: 'proper_noun' | 'technology' | 'key_phrase' | 'heading' | 'quoted';
  /** Number of occurrences in the source content. */
  frequency: number;
}

export interface RebuildAutoEntitiesOptions {
  specFolder?: string | null;
  dryRun?: boolean;
}

export interface RebuildAutoEntitiesResult {
  dryRun: boolean;
  specFolder: string | null;
  memoriesScanned: number;
  memoriesReprocessed: number;
  autoRowsRemoved: number;
  extractedEntities: number;
  storedEntities: number;
  catalogEntriesRebuilt: number;
}

interface AutoEntitySourceRow {
  id: number;
  spec_folder: string | null;
  content_text: string | null;
}

interface CatalogEntityRow {
  memory_id: number;
  entity_text: string;
  entity_type: ExtractedEntity['type'];
}

export interface RefreshAutoEntitiesForMemoryResult {
  removed: number;
  stored: number;
  catalogRebuilt: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. EXTRACTION RULES

// ───────────────────────────────────────────────────────────────
/**
 * Main extraction function — pure-TS rule-based, no npm deps.
 *
 * Rules applied in order:
 *   1. Capitalized multi-word sequences (2+ words starting with uppercase) → proper_noun
 *   2. Technology names from code fence annotations → technology
 *   3. Words after key phrases ("using", "with", "via", "implements") → key_phrase
 *   4. Markdown heading content (## through ####) → heading
 *   5. Quoted strings (double quotes, 2-50 chars) → quoted
 *
 * Results are deduplicated by normalized text with summed frequencies.
 *
 * @param content - The raw text content to extract entities from.
 * @returns Array of extracted entities, deduplicated and frequency-counted.
 */
export function extractEntities(content: string): ExtractedEntity[] {
  const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [];

  // Rule 1: Capitalized multi-word sequences (proper nouns)
  const properNounRe = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  let match: RegExpExecArray | null;
  while ((match = properNounRe.exec(content)) !== null) {
    raw.push({ text: match[1], type: 'proper_noun' });
  }

  // Rule 2: Technology names from code fence annotations
  const codeFenceRe = /```(\w+)/g;
  while ((match = codeFenceRe.exec(content)) !== null) {
    raw.push({ text: match[1], type: 'technology' });
  }

  // Rule 3: Words after key phrases — keywords are case-insensitive via explicit
  // Alternation (no `i` flag, since continuation words must require uppercase start
  // To avoid capturing common English words like "and", "the"). Tokens may include
  // Internal dots (for names like "Node.js"), but a trailing sentence period ends
  // The match so we do not absorb the next sentence.
  const keyPhraseRe = /\b(?:[Uu]sing|[Ww]ith|[Vv]ia|[Ii]mplements)\s+([A-Za-z][\w-]*(?:\.[A-Za-z0-9_-]+)*(?:\s+[A-Z][\w-]*(?:\.[A-Za-z0-9_-]+)*)*)/g;
  while ((match = keyPhraseRe.exec(content)) !== null) {
    raw.push({ text: match[1], type: 'key_phrase' });
  }

  // Rule 4: Markdown heading content (## through ####)
  const headingRe = /^#{2,4}\s+(.+)$/gm;
  while ((match = headingRe.exec(content)) !== null) {
    raw.push({ text: match[1].trim(), type: 'heading' });
  }

  // Rule 5: Quoted strings (double quotes, 2-50 chars)
  const quotedRe = /"([^"]{2,50})"/g;
  while ((match = quotedRe.exec(content)) !== null) {
    raw.push({ text: match[1], type: 'quoted' });
  }

  // Deduplicate by normalized text (lowercase, trimmed), summing frequencies
  return deduplicateEntities(raw);
}

// ───────────────────────────────────────────────────────────────
// 3. FILTERING

// ───────────────────────────────────────────────────────────────
/**
 * Filter entities through denylist + length checks.
 *
 * Removes:
 *   - Single-character entities
 *   - Entities where ALL words are on the denylist
 *   - Entities longer than 100 characters
 *
 * @param entities - Raw extracted entities to filter.
 * @returns Filtered array with noise removed.
 */
export function filterEntities(entities: ExtractedEntity[]): ExtractedEntity[] {
  return entities.filter((entity) => {
    // Remove single-character entities
    if (entity.text.length <= 1) return false;

    // Remove entities longer than 100 characters
    if (entity.text.length > 100) return false;

    // Remove entities where ALL words are on the denylist
    const words = entity.text.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length > 0 && words.every((w) => isEntityDenied(w))) return false;

    return true;
  });
}

// ───────────────────────────────────────────────────────────────
// 4. STORAGE

// ───────────────────────────────────────────────────────────────
/**
 * Store extracted entities in the memory_entities table.
 *
 * Uses INSERT OR REPLACE on the UNIQUE(memory_id, entity_text) constraint.
 *
 * @param db - An initialized better-sqlite3 Database instance.
 * @param memoryId - The memory_index row ID to associate entities with.
 * @param entities - Filtered entities to store.
 * @returns Count of entities stored.
 */
export function storeEntities(
  db: Database.Database,
  memoryId: number,
  entities: ExtractedEntity[],
): { stored: number } {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO memory_entities
        (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, 'auto')
    `);

    let stored = 0;
    const runInTransaction = db.transaction(() => {
      for (const entity of entities) {
        stmt.run(memoryId, entity.text, entity.type, entity.frequency);
        stored++;
      }
    });
    runInTransaction();

    return { stored };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] storeEntities failed: ${msg}`);
    return { stored: 0 };
  }
}

export function refreshAutoEntitiesForMemory(
  db: Database.Database,
  memoryId: number,
  entities: ExtractedEntity[],
): RefreshAutoEntitiesForMemoryResult {
  try {
    const deleteStmt = db.prepare(`
      DELETE FROM memory_entities
      WHERE memory_id = ?
        AND created_by = 'auto'
    `);
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO memory_entities
        (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, 'auto')
    `);

    let removed = 0;
    let stored = 0;
    const runInTransaction = db.transaction(() => {
      removed = deleteStmt.run(memoryId).changes;
      for (const entity of entities) {
        insertStmt.run(memoryId, entity.text, entity.type, entity.frequency);
        stored++;
      }
    });
    runInTransaction();

    if (removed > 0) {
      rebuildEntityCatalog(db);
      return { removed, stored, catalogRebuilt: true };
    }

    if (entities.length > 0) {
      updateEntityCatalog(db, entities);
    }

    return { removed, stored, catalogRebuilt: false };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] refreshAutoEntitiesForMemory failed: ${msg}`);
    return { removed: 0, stored: 0, catalogRebuilt: false };
  }
}

// ───────────────────────────────────────────────────────────────
// 5. ENTITY CATALOG

// ───────────────────────────────────────────────────────────────
/**
 * Upsert entities into entity_catalog with alias normalization.
 *
 * For each entity:
 *   1. normalizeEntityName(text) -> canonical_name
 *   2. INSERT new catalog entry or UPDATE existing:
 *      - Increment memory_count
 *      - Append text as alias if not already present
 *
 * @param db - An initialized better-sqlite3 Database instance.
 * @param entities - Filtered entities to catalog.
 * @returns Count of entities upserted.
 */
export function updateEntityCatalog(
  db: Database.Database,
  entities: ExtractedEntity[],
): { upserted: number } {
  try {
    let upserted = 0;

    const selectStmt = db.prepare(
      'SELECT id, aliases, memory_count FROM entity_catalog WHERE canonical_name = ?',
    );
    const insertStmt = db.prepare(`
      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
      VALUES (?, ?, ?, 1, datetime('now'))
    `);
    const updateStmt = db.prepare(`
      UPDATE entity_catalog
      SET aliases = ?, memory_count = memory_count + 1
      WHERE id = ?
    `);

    const runInTransaction = db.transaction(() => {
      for (const entity of entities) {
        const canonical = normalizeEntityName(entity.text);
        if (!canonical) continue;

        const existing = selectStmt.get(canonical) as
          | { id: number; aliases: string; memory_count: number }
          | undefined;

        if (existing) {
          // Append alias if new variant
          let aliases: string[];
          try {
            aliases = JSON.parse(existing.aliases);
            if (!Array.isArray(aliases)) aliases = [];
          } catch {
            aliases = [];
          }

          if (!aliases.includes(entity.text)) {
            aliases.push(entity.text);
          }

          updateStmt.run(JSON.stringify(aliases), existing.id);
        } else {
          // Insert new catalog entry
          const aliases = JSON.stringify([entity.text]);
          insertStmt.run(canonical, aliases, entity.type);
        }

        upserted++;
      }
    });
    runInTransaction();

    return { upserted };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] updateEntityCatalog failed: ${msg}`);
    return { upserted: 0 };
  }
}

/**
 * Rebuild entity_catalog deterministically from current memory_entities rows.
 */
export function rebuildEntityCatalog(db: Database.Database): { rebuilt: number } {
  try {
    const rows = db.prepare(`
      SELECT memory_id, entity_text, entity_type
      FROM memory_entities
      ORDER BY id ASC
    `).all() as CatalogEntityRow[];

    const aggregates = new Map<string, {
      aliases: Set<string>;
      entityType: ExtractedEntity['type'];
      memoryIds: Set<number>;
    }>();

    for (const row of rows) {
      const canonical = normalizeEntityName(row.entity_text);
      if (!canonical) {
        continue;
      }

      const existing = aggregates.get(canonical);
      if (existing) {
        existing.aliases.add(row.entity_text);
        existing.memoryIds.add(row.memory_id);
        continue;
      }

      aggregates.set(canonical, {
        aliases: new Set([row.entity_text]),
        entityType: row.entity_type,
        memoryIds: new Set([row.memory_id]),
      });
    }

    const deleteStmt = db.prepare('DELETE FROM entity_catalog');
    const insertStmt = db.prepare(`
      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    const runInTransaction = db.transaction(() => {
      deleteStmt.run();

      for (const canonical of Array.from(aggregates.keys()).sort()) {
        const aggregate = aggregates.get(canonical);
        if (!aggregate) {
          continue;
        }

        insertStmt.run(
          canonical,
          JSON.stringify(Array.from(aggregate.aliases).sort()),
          aggregate.entityType,
          aggregate.memoryIds.size,
        );
      }
    });
    runInTransaction();

    return { rebuilt: aggregates.size };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[entity-extractor] rebuildEntityCatalog failed: ${msg}`);
    return { rebuilt: 0 };
  }
}

/**
 * Rebuild auto-generated entity rows from current memory content.
 *
 * This provides a deterministic cleanup path for pre-fix entity rows by
 * deleting only `created_by='auto'` entries in scope, re-extracting from the
 * live `memory_index.content_text`, and then rebuilding `entity_catalog`
 * exactly from the resulting entity rows.
 */
export function rebuildAutoEntities(
  db: Database.Database,
  options: RebuildAutoEntitiesOptions = {},
): RebuildAutoEntitiesResult {
  const specFolder = typeof options.specFolder === 'string' && options.specFolder.trim().length > 0
    ? options.specFolder.trim()
    : null;
  const dryRun = options.dryRun === true;

  const memories = db.prepare(`
    SELECT id, spec_folder, content_text
    FROM memory_index
    WHERE (? IS NULL OR spec_folder = ?)
    ORDER BY id ASC
  `).all(specFolder, specFolder) as AutoEntitySourceRow[];

  const extractedByMemory = memories.map((memory) => {
    const filtered = filterEntities(extractEntities(memory.content_text ?? ''));
    return { memoryId: memory.id, entities: filtered, hasContent: (memory.content_text ?? '').trim().length > 0 };
  });

  const autoRowCount = db.prepare(`
    SELECT COUNT(*) AS count
    FROM memory_entities me
    WHERE me.created_by = 'auto'
      AND EXISTS (
        SELECT 1
        FROM memory_index m
        WHERE m.id = me.memory_id
          AND (? IS NULL OR m.spec_folder = ?)
      )
  `).get(specFolder, specFolder) as { count?: number };

  const extractedEntities = extractedByMemory.reduce((sum, row) => sum + row.entities.length, 0);
  const memoriesReprocessed = extractedByMemory.filter((row) => row.hasContent).length;

  if (dryRun) {
    return {
      dryRun: true,
      specFolder,
      memoriesScanned: memories.length,
      memoriesReprocessed,
      autoRowsRemoved: autoRowCount.count ?? 0,
      extractedEntities,
      storedEntities: extractedEntities,
      catalogEntriesRebuilt: 0,
    };
  }

  const deleteAutoRows = db.prepare(`
    DELETE FROM memory_entities
    WHERE created_by = 'auto'
      AND EXISTS (
        SELECT 1
        FROM memory_index m
        WHERE m.id = memory_entities.memory_id
          AND (? IS NULL OR m.spec_folder = ?)
      )
  `);

  let storedEntities = 0;
  const runInTransaction = db.transaction(() => {
    deleteAutoRows.run(specFolder, specFolder);

    for (const row of extractedByMemory) {
      if (row.entities.length === 0) {
        continue;
      }

      storedEntities += storeEntities(db, row.memoryId, row.entities).stored;
    }
  });
  runInTransaction();

  const rebuiltCatalog = rebuildEntityCatalog(db);

  return {
    dryRun: false,
    specFolder,
    memoriesScanned: memories.length,
    memoriesReprocessed,
    autoRowsRemoved: autoRowCount.count ?? 0,
    extractedEntities,
    storedEntities,
    catalogEntriesRebuilt: rebuiltCatalog.rebuilt,
  };
}

// 6. INTERNAL HELPERS (exported for testing)
/**
 * Deduplicate raw extraction results by normalized text.
 * Entries with the same normalized form are merged, summing frequencies.
 * The first occurrence's type wins.
 */
function deduplicateEntities(
  raw: Array<{ text: string; type: ExtractedEntity['type'] }>,
): ExtractedEntity[] {
  const map = new Map<string, ExtractedEntity>();

  for (const item of raw) {
    const key = item.text.toLowerCase().trim();
    const existing = map.get(key);
    if (existing) {
      existing.frequency += 1;
    } else {
      map.set(key, { text: item.text, type: item.type, frequency: 1 });
    }
  }

  return Array.from(map.values());
}

/**
 * Internal helpers exported for testing via __testables.
 */
export const __testables = {
  deduplicateEntities,
  normalizeEntityName,
};
