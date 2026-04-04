import type Database from 'better-sqlite3';
import type { StorableSurrogateMetadata } from './surrogate-storage.js';
export { initSurrogateTable, loadSurrogates, loadSurrogatesBatch } from './surrogate-storage.js';
export type { SurrogateRow, StorableSurrogateMetadata } from './surrogate-storage.js';
/** Backward-compatible wrapper preserving the original feature flag guard. */
export declare function storeSurrogates(db: Database.Database, memoryId: number, surrogates: StorableSurrogateMetadata): void;
/**
 * Surrogate metadata generated at index time for a single document.
 */
export interface SurrogateMetadata {
    /** Abbreviations and synonyms extracted from content. */
    aliases: string[];
    /** Structural headings as retrieval surrogates. */
    headings: string[];
    /** Concise summary (extracted, not LLM-generated). */
    summary: string;
    /** 2-5 likely user questions this memory answers. */
    surrogateQuestions: string[];
    /** Timestamp of generation (Date.now()). */
    generatedAt: number;
}
import { isQuerySurrogatesEnabled } from './search-flags.js';
export { isQuerySurrogatesEnabled };
/**
 * Extract abbreviations and synonyms from content using heuristics.
 *
 * Patterns detected:
 *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
 *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
 *   - Slash-separated synonyms: "recall/precision" → ["recall", "precision"]
 *
 * @param content - Document content to extract aliases from.
 * @returns Deduplicated array of extracted aliases.
 */
export declare function extractAliases(content: string): string[];
/**
 * Extract markdown headings (## and ###) as structural surrogates.
 *
 * Strips markdown formatting (leading #, bold, italic, code spans).
 * Returns a flat string array of heading text.
 *
 * @param content - Markdown document content.
 * @returns Array of heading strings.
 */
export declare function extractHeadings(content: string): string[];
/**
 * Generate an extractive summary from document content.
 *
 * Strategy:
 *   1. Try to extract the first paragraph (non-heading, non-empty lines).
 *   2. If the first paragraph is too short, extend to the next paragraph.
 *   3. Fallback: first MAX_SUMMARY_LENGTH characters of content.
 *
 * No LLM calls — purely heuristic extraction.
 *
 * @param content - Document content.
 * @returns Extracted summary string (max MAX_SUMMARY_LENGTH chars).
 */
export declare function generateSummary(content: string): string;
/**
 * Generate surrogate questions that the document likely answers.
 *
 * Heuristic approach (no LLM):
 *   - Convert headings to questions ("How to X" → "How do I X?")
 *   - Generate "What is [title]?" from document title
 *   - Generate "When should I use [concept]?" for how-to content
 *
 * @param title - Document title.
 * @param headings - Extracted headings from the document.
 * @param content - Document content (used for additional heuristics).
 * @returns Array of 2-5 deduplicated surrogate questions.
 */
export declare function generateSurrogateQuestions(title: string, headings: string[], content: string): string[];
/**
 * Generate complete surrogate metadata for a document.
 *
 * Called at index time (save pipeline). Returns null when the
 * feature flag is disabled.
 *
 * @param content - Document content.
 * @param title   - Document title.
 * @returns SurrogateMetadata or null if feature is disabled.
 */
export declare function generateSurrogates(content: string, title: string): SurrogateMetadata | null;
/**
 * Tokenize a string into lowercase words for matching.
 * Strips punctuation and filters tokens shorter than 2 characters.
 */
declare function tokenize(text: string): string[];
/**
 * Compute keyword overlap score between a query and a target string.
 *
 * Score = |intersection(queryTokens, targetTokens)| / |queryTokens|
 *
 * @param queryTokens - Tokenized query.
 * @param target      - Target string to match against.
 * @returns Overlap score in [0, 1].
 */
declare function keywordOverlap(queryTokens: string[], target: string): number;
/**
 * Match a query against stored surrogate metadata for a single document.
 *
 * Matching channels (weighted):
 *   - Alias match (exact token overlap): weight 0.3
 *   - Question match (best keyword overlap across surrogateQuestions): weight 0.4
 *   - Summary match (keyword overlap): weight 0.2
 *   - Heading match (best keyword overlap across headings): weight 0.1
 *
 * @param query      - The search query.
 * @param surrogates - Stored surrogate metadata for one document.
 * @returns Combined match score in [0, 1] and list of matched surrogate strings.
 */
export declare function matchSurrogates(query: string, surrogates: SurrogateMetadata): {
    score: number;
    matchedSurrogates: string[];
};
/**
 * Internal functions and constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    tokenize: typeof tokenize;
    keywordOverlap: typeof keywordOverlap;
    MAX_SURROGATE_QUESTIONS: number;
    MIN_SURROGATE_QUESTIONS: number;
    MAX_SUMMARY_LENGTH: number;
    MIN_MATCH_THRESHOLD: number;
};
//# sourceMappingURL=query-surrogates.d.ts.map