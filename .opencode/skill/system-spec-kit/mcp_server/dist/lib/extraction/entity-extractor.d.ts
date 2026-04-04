import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker.js';
import type Database from 'better-sqlite3';
export { normalizeEntityName, computeEdgeDensity };
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
export interface RefreshAutoEntitiesForMemoryResult {
    removed: number;
    stored: number;
    catalogRebuilt: boolean;
}
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
export declare function extractEntities(content: string): ExtractedEntity[];
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
export declare function filterEntities(entities: ExtractedEntity[]): ExtractedEntity[];
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
export declare function storeEntities(db: Database.Database, memoryId: number, entities: ExtractedEntity[]): {
    stored: number;
};
export declare function refreshAutoEntitiesForMemory(db: Database.Database, memoryId: number, entities: ExtractedEntity[]): RefreshAutoEntitiesForMemoryResult;
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
export declare function updateEntityCatalog(db: Database.Database, entities: ExtractedEntity[]): {
    upserted: number;
};
/**
 * Rebuild entity_catalog deterministically from current memory_entities rows.
 */
export declare function rebuildEntityCatalog(db: Database.Database): {
    rebuilt: number;
};
/**
 * Rebuild auto-generated entity rows from current memory content.
 *
 * This provides a deterministic cleanup path for pre-fix entity rows by
 * deleting only `created_by='auto'` entries in scope, re-extracting from the
 * live `memory_index.content_text`, and then rebuilding `entity_catalog`
 * exactly from the resulting entity rows.
 */
export declare function rebuildAutoEntities(db: Database.Database, options?: RebuildAutoEntitiesOptions): RebuildAutoEntitiesResult;
/**
 * Deduplicate raw extraction results by normalized text.
 * Entries with the same normalized form are merged, summing frequencies.
 * The first occurrence's type wins.
 */
declare function deduplicateEntities(raw: Array<{
    text: string;
    type: ExtractedEntity['type'];
}>): ExtractedEntity[];
/**
 * Internal helpers exported for testing via __testables.
 */
export declare const __testables: {
    deduplicateEntities: typeof deduplicateEntities;
    normalizeEntityName: typeof normalizeEntityName;
};
//# sourceMappingURL=entity-extractor.d.ts.map