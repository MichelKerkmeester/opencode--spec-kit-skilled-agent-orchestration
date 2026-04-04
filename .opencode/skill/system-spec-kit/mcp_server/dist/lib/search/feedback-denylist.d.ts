/**
 * Complete denylist of 100+ stop words that should never be learned
 * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
 */
export declare const DENYLIST: Set<string>;
/**
 * Check if a term is on the denylist (case-insensitive).
 *
 * @param term - The term to check
 * @returns true if the term is on the denylist and should NOT be learned
 */
export declare function isOnDenylist(term: string): boolean;
/**
 * Get the total number of words in the denylist.
 *
 * @returns The size of the denylist set
 */
export declare function getDenylistSize(): number;
//# sourceMappingURL=feedback-denylist.d.ts.map