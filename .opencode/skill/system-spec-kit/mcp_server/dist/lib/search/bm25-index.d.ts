import type Database from 'better-sqlite3';
interface BM25SearchResult {
    id: string;
    /**
     * BM25 term-frequency relevance score (unbounded, typically 0-25+).
     * Higher = better lexical match. Not directly comparable to vector similarity
     * scores; use min-max normalization or RRF when combining with other methods.
     */
    score: number;
}
interface BM25Stats {
    documentCount: number;
    termCount: number;
    avgDocLength: number;
}
interface BM25DocumentSource {
    title?: string | null;
    content_text?: string | null;
    trigger_phrases?: string | string[] | null;
    file_path?: string | null;
}
declare const DEFAULT_K1 = 1.2;
declare const DEFAULT_B = 0.75;
/**
 * C138: Field weight multipliers for weighted BM25 scoring.
 * When indexing a document composed of multiple fields, multiply
 * each field's token scores by the appropriate weight before
 * accumulating the total document score.
 *
 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
 * not the in-memory BM25 engine in this file. Exported for shared access.
 *
 * title:           10.0 — exact title matches are the strongest signal
 * trigger_phrases:  5.0 — curated keywords next most important
 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
 * body:             1.0 — baseline weight for full body / content_text
 */
declare const BM25_FTS5_WEIGHTS: readonly [10, 5, 2, 1];
declare const BM25_FIELD_WEIGHTS: Record<string, number>;
/**
 * Check whether the in-memory BM25 index is enabled.
 *
 * @returns `true` when BM25 indexing/search is enabled for the current process.
 * @example
 * ```ts
 * if (isBm25Enabled()) {
 *   getIndex();
 * }
 * ```
 */
declare function isBm25Enabled(): boolean;
/**
 * Apply lightweight stemming to a token for BM25 indexing and matching.
 *
 * @param word - Token to stem.
 * @returns A lowercased token with simple suffix normalization applied.
 * @example
 * ```ts
 * simpleStem('running');
 * // 'run'
 * ```
 */
declare function simpleStem(word: string): string;
/**
 * Tokenize raw text into normalized BM25 terms.
 *
 * @param text - Input text to tokenize.
 * @returns Stemmed, lowercased, stop-word-filtered terms.
 * @example
 * ```ts
 * tokenize('The memory indexing pipeline');
 * // ['memory', 'index', 'pipeline']
 * ```
 */
declare function tokenize(text: string): string[];
/**
 * Count token frequency occurrences for BM25 scoring.
 *
 * @param tokens - Normalized tokens produced by {@link tokenize}.
 * @returns A frequency map keyed by token text.
 * @example
 * ```ts
 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
 * // 2
 * ```
 */
declare function getTermFrequencies(tokens: string[]): Map<string, number>;
declare function buildBm25DocumentText(row: BM25DocumentSource): string;
declare class BM25Index {
    private k1;
    private b;
    private documents;
    private documentFreq;
    private totalDocLength;
    private warmupHandle;
    private warmupGeneration;
    constructor(k1?: number, b?: number);
    addDocument(id: string, text: string): void;
    removeDocument(id: string): boolean;
    calculateIdf(term: string): number;
    calculateScore(queryTokens: string[], docId: string): number;
    search(query: string, limit?: number): BM25SearchResult[];
    getStats(): BM25Stats;
    clear(): void;
    addDocuments(docs: Array<{
        id: string;
        text: string;
    }>): void;
    /**
     * Incrementally synchronize changed rows from the database into the in-memory index.
     */
    syncChangedRows(database: Database.Database, rowIds: Array<number | string>): number;
    /**
     * P3-04/T312: Defer full startup warmup into batched row-ID syncs so process
     * initialization is not blocked by a monolithic in-memory rebuild.
     */
    rebuildFromDatabase(database: Database.Database): number;
    cancelWarmup(): void;
}
/**
 * Retrieve the shared in-memory BM25 index singleton.
 *
 * @returns The process-wide {@link BM25Index} instance.
 * @example
 * ```ts
 * const index = getIndex();
 * index.addDocument('123', 'memory search');
 * ```
 */
declare function getIndex(): BM25Index;
/**
 * Reset the shared BM25 index singleton.
 *
 * @returns Nothing.
 * @example
 * ```ts
 * resetIndex();
 * ```
 */
declare function resetIndex(): void;
/**
 * Sanitize a query string for safe use with SQLite FTS5 and return
 * the individual tokens as an array. This is the shared tokenization
 * entry point — both FTS5 query construction and BM25 callers should
 * use this array to ensure consistent tokenization.
 *
 * Removes all FTS5 operators and special characters, then returns
 * the remaining non-empty tokens.
 *
 * @param query - Raw user query text that may contain FTS operators.
 * @returns Sanitized query tokens safe to reuse for lexical search paths.
 * @example
 * ```ts
 * sanitizeQueryTokens('title:memory AND vector');
 * // ['title', 'memory', 'vector']
 * ```
 */
declare function sanitizeQueryTokens(query: string): string[];
interface NormalizedLexicalQueryTokens {
    fts: string[];
    bm25: string[];
}
declare function normalizeLexicalQueryTokens(query: string): NormalizedLexicalQueryTokens;
/**
 * Sanitize a query string for safe use with SQLite FTS5.
 * Delegates to `sanitizeQueryTokens` for tokenization, then wraps
 * each token in quotes for FTS5 safety.
 *
 * @param query - Raw user query text.
 * @returns A quoted FTS5-safe query string.
 * @example
 * ```ts
 * sanitizeFTS5Query('memory search');
 * // "\"memory\" \"search\""
 * ```
 */
declare function sanitizeFTS5Query(query: string): string;
export { BM25Index, getIndex, resetIndex, tokenize, simpleStem, getTermFrequencies, isBm25Enabled, sanitizeQueryTokens, sanitizeFTS5Query, normalizeLexicalQueryTokens, buildBm25DocumentText, DEFAULT_K1, DEFAULT_B, BM25_FTS5_WEIGHTS, BM25_FIELD_WEIGHTS, };
export type { BM25SearchResult, BM25Stats, BM25DocumentSource, };
//# sourceMappingURL=bm25-index.d.ts.map