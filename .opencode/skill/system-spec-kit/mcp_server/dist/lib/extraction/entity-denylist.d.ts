/**
 * Complete denylist of common nouns, technology stop words, and generic
 * modifiers that should be filtered from entity extraction results.
 * All terms stored in lowercase for case-insensitive matching.
 */
export declare const ENTITY_DENYLIST: Set<string>;
/**
 * Check if a term is on the entity denylist (case-insensitive).
 *
 * @param term - The term to check
 * @returns true if the term is denied and should NOT be extracted as an entity
 */
export declare function isEntityDenied(term: string): boolean;
/**
 * Get the total number of words in the entity denylist.
 *
 * @returns The size of the entity denylist set
 */
export declare function getEntityDenylistSize(): number;
//# sourceMappingURL=entity-denylist.d.ts.map