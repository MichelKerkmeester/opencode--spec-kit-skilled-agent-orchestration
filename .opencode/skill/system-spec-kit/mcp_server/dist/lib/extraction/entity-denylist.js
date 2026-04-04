// ───────────────────────────────────────────────────────────────
// MODULE: Entity Denylist
// ───────────────────────────────────────────────────────────────
// Feature catalog: Auto entity extraction
// Common nouns and stop words filtered from entity extraction.
// ───────────────────────────────────────────────────────────────
// 1. COMMON NOUNS
// ───────────────────────────────────────────────────────────────
// High-frequency English nouns that carry little entity signal.
const COMMON_NOUNS = [
    'thing', 'things', 'way', 'ways', 'time', 'times',
    'year', 'years', 'people', 'system', 'part', 'case',
    'point', 'group', 'problem', 'fact', 'place', 'world',
    'example', 'end', 'head', 'side', 'area', 'line',
    'work', 'day', 'number', 'use', 'change',
];
// ───────────────────────────────────────────────────────────────
// 2. TECHNOLOGY STOP WORDS
// ───────────────────────────────────────────────────────────────
// Generic tech abbreviations too broad to serve as entity names.
const TECHNOLOGY_STOP_WORDS = [
    'app', 'api', 'sdk', 'cli', 'url',
    'http', 'https', 'json', 'html', 'css',
    'sql', 'dom', 'npm', 'git', 'env',
    'dev', 'src', 'lib', 'bin', 'tmp',
];
// ───────────────────────────────────────────────────────────────
// 3. GENERIC MODIFIERS
// ───────────────────────────────────────────────────────────────
// Adjectives/determiners that add no entity-level meaning.
const GENERIC_MODIFIERS = [
    'new', 'old', 'first', 'last', 'next',
    'main', 'other', 'same', 'different', 'current',
    'general', 'specific', 'basic', 'simple', 'various',
];
// ───────────────────────────────────────────────────────────────
// 4. COMBINED ENTITY DENYLIST
// ───────────────────────────────────────────────────────────────
/**
 * Complete denylist of common nouns, technology stop words, and generic
 * modifiers that should be filtered from entity extraction results.
 * All terms stored in lowercase for case-insensitive matching.
 */
export const ENTITY_DENYLIST = new Set([
    ...COMMON_NOUNS,
    ...TECHNOLOGY_STOP_WORDS,
    ...GENERIC_MODIFIERS,
]);
// ───────────────────────────────────────────────────────────────
// 5. PUBLIC API
// ───────────────────────────────────────────────────────────────
/**
 * Check if a term is on the entity denylist (case-insensitive).
 *
 * @param term - The term to check
 * @returns true if the term is denied and should NOT be extracted as an entity
 */
export function isEntityDenied(term) {
    return ENTITY_DENYLIST.has(term.toLowerCase().trim());
}
/**
 * Get the total number of words in the entity denylist.
 *
 * @returns The size of the entity denylist set
 */
export function getEntityDenylistSize() {
    return ENTITY_DENYLIST.size;
}
//# sourceMappingURL=entity-denylist.js.map