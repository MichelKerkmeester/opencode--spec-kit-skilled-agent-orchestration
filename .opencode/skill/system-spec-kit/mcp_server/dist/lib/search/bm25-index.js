import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
/* ───────────────────────────────────────────────────────────────
   1B. CONSTANTS & FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */
const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;
const BM25_WARMUP_BATCH_SIZE = 250;
const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
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
const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0];
const BM25_FIELD_WEIGHTS = {
    title: BM25_FTS5_WEIGHTS[0],
    trigger_phrases: BM25_FTS5_WEIGHTS[1],
    content_generic: BM25_FTS5_WEIGHTS[2],
    body: BM25_FTS5_WEIGHTS[3],
};
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
function isBm25Enabled() {
    const value = process.env.ENABLE_BM25?.trim().toLowerCase();
    if (!value)
        return true; // enabled by default
    if (BM25_DISABLED_VALUES.has(value))
        return false;
    return BM25_ENABLED_VALUES.has(value);
}
// ───────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
    'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
    'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
    'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
]);
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
function simpleStem(word) {
    let stem = word.toLowerCase();
    let suffixRemoved = false;
    // Simple suffix removal
    if (stem.endsWith('ing') && stem.length > 5) {
        stem = stem.slice(0, -3);
        suffixRemoved = true;
    }
    else if (stem.endsWith('tion') && stem.length > 6) {
        stem = stem.slice(0, -4);
        suffixRemoved = true;
    }
    else if (stem.endsWith('ed') && stem.length > 4) {
        stem = stem.slice(0, -2);
        suffixRemoved = true;
    }
    else if (stem.endsWith('ly') && stem.length > 4) {
        stem = stem.slice(0, -2);
        suffixRemoved = true;
    }
    else if (stem.endsWith('es') && stem.length > 4) {
        stem = stem.slice(0, -2);
        suffixRemoved = true;
    }
    else if (stem.endsWith('s') && stem.length > 3) {
        stem = stem.slice(0, -1);
        suffixRemoved = true;
    }
    // Only deduplicate doubled consonants when a suffix was actually removed.
    // Without this guard, original double consonants are incorrectly stripped:
    // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
    // Handle doubled consonants after suffix
    // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
    // Are identical consonants and deduplicate.
    if (suffixRemoved && stem.length >= 3) {
        const last = stem[stem.length - 1];
        if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
            stem = stem.slice(0, -1);
        }
    }
    return stem;
}
function splitLexicalFragments(text) {
    if (!text || typeof text !== 'string')
        return [];
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/g, ' ')
        .split(/\s+/)
        .map(t => t.trim())
        .filter(Boolean);
}
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
function tokenize(text) {
    return splitLexicalFragments(text)
        .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
        .map(simpleStem);
}
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
function getTermFrequencies(tokens) {
    const freq = new Map();
    for (const token of tokens) {
        freq.set(token, (freq.get(token) || 0) + 1);
    }
    return freq;
}
function normalizeTriggerPhrasesForBM25(triggerPhrases) {
    if (Array.isArray(triggerPhrases)) {
        return triggerPhrases
            .filter((phrase) => typeof phrase === 'string' && phrase.trim().length > 0)
            .join(' ');
    }
    if (typeof triggerPhrases !== 'string') {
        return '';
    }
    const trimmed = triggerPhrases.trim();
    if (!trimmed) {
        return '';
    }
    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed
                .filter((phrase) => typeof phrase === 'string' && phrase.trim().length > 0)
                .join(' ');
        }
    }
    catch {
        // Fall back to raw string when the database value is not JSON.
    }
    return trimmed;
}
function buildBm25DocumentText(row) {
    const textParts = [];
    if (typeof row.title === 'string' && row.title.trim()) {
        textParts.push(row.title.trim());
    }
    if (typeof row.content_text === 'string' && row.content_text.trim()) {
        textParts.push(normalizeContentForBM25(row.content_text));
    }
    const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
    if (triggerPhrases) {
        textParts.push(triggerPhrases);
    }
    if (typeof row.file_path === 'string' && row.file_path.trim()) {
        textParts.push(row.file_path.trim());
    }
    return textParts.join(' ').trim();
}
// ───────────────────────────────────────────────────────────────
// 3. BM25 INDEX CLASS
// ───────────────────────────────────────────────────────────────
class BM25Index {
    k1;
    b;
    documents;
    documentFreq;
    totalDocLength;
    warmupHandle;
    warmupGeneration;
    constructor(k1 = DEFAULT_K1, b = DEFAULT_B) {
        this.k1 = k1;
        this.b = b;
        this.documents = new Map();
        this.documentFreq = new Map();
        this.totalDocLength = 0;
        this.warmupHandle = null;
        this.warmupGeneration = 0;
    }
    addDocument(id, text) {
        const tokens = tokenize(text);
        const termFreq = getTermFrequencies(tokens);
        // Remove old document if exists
        if (this.documents.has(id)) {
            this.removeDocument(id);
        }
        this.documents.set(id, { tokens, termFreq });
        this.totalDocLength += tokens.length;
        // Update document frequency
        for (const term of termFreq.keys()) {
            this.documentFreq.set(term, (this.documentFreq.get(term) || 0) + 1);
        }
    }
    removeDocument(id) {
        const doc = this.documents.get(id);
        if (!doc)
            return false;
        this.totalDocLength -= doc.tokens.length;
        for (const term of doc.termFreq.keys()) {
            const count = this.documentFreq.get(term) || 0;
            if (count <= 1) {
                this.documentFreq.delete(term);
            }
            else {
                this.documentFreq.set(term, count - 1);
            }
        }
        this.documents.delete(id);
        return true;
    }
    calculateIdf(term) {
        const n = this.documents.size;
        const df = this.documentFreq.get(term) || 0;
        if (df === 0 || n === 0)
            return 0;
        return Math.log((n - df + 0.5) / (df + 0.5) + 1);
    }
    calculateScore(queryTokens, docId) {
        const doc = this.documents.get(docId);
        if (!doc)
            return 0;
        const avgDl = this.documents.size > 0 ? this.totalDocLength / this.documents.size : 0;
        const dl = doc.tokens.length;
        let score = 0;
        for (const term of queryTokens) {
            const tf = doc.termFreq.get(term) || 0;
            if (tf === 0)
                continue;
            const idf = this.calculateIdf(term);
            const numerator = tf * (this.k1 + 1);
            const denominator = tf + this.k1 * (1 - this.b + this.b * (dl / Math.max(avgDl, 1)));
            score += idf * (numerator / denominator);
        }
        return score;
    }
    search(query, limit = 10) {
        const queryTokens = normalizeLexicalQueryTokens(query).bm25;
        if (queryTokens.length === 0)
            return [];
        const results = [];
        for (const [id] of this.documents) {
            const score = this.calculateScore(queryTokens, id);
            if (score > 0) {
                results.push({ id, score });
            }
        }
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
    getStats() {
        return {
            documentCount: this.documents.size,
            termCount: this.documentFreq.size,
            avgDocLength: this.documents.size > 0 ? this.totalDocLength / this.documents.size : 0,
        };
    }
    clear() {
        this.cancelWarmup();
        this.documents.clear();
        this.documentFreq.clear();
        this.totalDocLength = 0;
    }
    addDocuments(docs) {
        for (const doc of docs) {
            this.addDocument(doc.id, doc.text);
        }
    }
    /**
     * Incrementally synchronize changed rows from the database into the in-memory index.
     */
    syncChangedRows(database, rowIds) {
        const normalizedIds = Array.from(new Set(rowIds
            .map((rowId) => Number(rowId))
            .filter((rowId) => Number.isInteger(rowId) && rowId > 0)));
        if (normalizedIds.length === 0) {
            return 0;
        }
        try {
            const placeholders = normalizedIds.map(() => '?').join(', ');
            const rows = database.prepare(`SELECT id, title, content_text, trigger_phrases, file_path
         FROM memory_index
         WHERE id IN (${placeholders})
           AND COALESCE(is_archived, 0) = 0`).all(...normalizedIds);
            const activeRowMap = new Map();
            for (const row of rows) {
                activeRowMap.set(row.id, row);
            }
            for (const rowId of normalizedIds) {
                const row = activeRowMap.get(rowId);
                if (!row) {
                    this.removeDocument(String(rowId));
                    continue;
                }
                const text = buildBm25DocumentText(row);
                if (text.trim()) {
                    this.addDocument(String(row.id), text);
                }
                else {
                    this.removeDocument(String(row.id));
                }
            }
            return normalizedIds.length;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
            return 0;
        }
    }
    /**
     * P3-04/T312: Defer full startup warmup into batched row-ID syncs so process
     * initialization is not blocked by a monolithic in-memory rebuild.
     */
    rebuildFromDatabase(database) {
        this.clear();
        try {
            const rows = database.prepare(`SELECT id
         FROM memory_index
         WHERE COALESCE(is_archived, 0) = 0
         ORDER BY id`).all();
            const pendingIds = rows.map((row) => row.id);
            if (pendingIds.length === 0) {
                return 0;
            }
            const warmupGeneration = ++this.warmupGeneration;
            const processBatch = () => {
                if (warmupGeneration !== this.warmupGeneration) {
                    return;
                }
                const batchIds = pendingIds.splice(0, BM25_WARMUP_BATCH_SIZE);
                if (batchIds.length === 0) {
                    this.warmupHandle = null;
                    return;
                }
                this.syncChangedRows(database, batchIds);
                if (pendingIds.length > 0) {
                    this.warmupHandle = setTimeout(processBatch, 0);
                }
                else {
                    this.warmupHandle = null;
                }
            };
            this.warmupHandle = setTimeout(processBatch, 0);
            return pendingIds.length;
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
            return 0;
        }
    }
    cancelWarmup() {
        this.warmupGeneration += 1;
        if (this.warmupHandle) {
            clearTimeout(this.warmupHandle);
            this.warmupHandle = null;
        }
    }
}
// ───────────────────────────────────────────────────────────────
// 4. SINGLETON
// ───────────────────────────────────────────────────────────────
let indexInstance = null;
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
function getIndex() {
    if (!indexInstance) {
        indexInstance = new BM25Index();
    }
    return indexInstance;
}
/**
 * Reset the shared BM25 index singleton.
 *
 * @returns Nothing.
 * @example
 * ```ts
 * resetIndex();
 * ```
 */
function resetIndex() {
    indexInstance?.cancelWarmup();
    indexInstance = null;
}
// ───────────────────────────────────────────────────────────────
// 5. FTS5 QUERY SANITIZATION (P3-06)
// ───────────────────────────────────────────────────────────────
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
function sanitizeQueryTokens(query) {
    // Input length guard: truncate overly long queries to prevent DoS
    if (query.length > 2000) {
        query = query.substring(0, 2000);
    }
    // Remove FTS5 boolean/proximity operators (case-insensitive)
    let sanitized = query
        .replace(/\bNEAR\b/gi, '')
        .replace(/\bNOT\b/gi, '')
        .replace(/\bAND\b/gi, '')
        .replace(/\bOR\b/gi, '');
    // Strip NEAR/N residual (e.g., "NEAR/5" becomes "NEAR" then "/" and "5" remain)
    sanitized = sanitized.replace(/\/\d+/g, ' ');
    // Remove FTS5 special characters and column-filter colon.
    sanitized = sanitized
        .replace(/[*^(){}[\]"]/g, '')
        .replace(/:/g, ' ')
        .trim();
    return sanitized
        .split(/\s+/)
        .filter(Boolean);
}
function normalizeLexicalQueryTokens(query) {
    const sharedTokens = sanitizeQueryTokens(query)
        .flatMap((token) => splitLexicalFragments(token));
    const phraseToken = sharedTokens.length >= 2
        ? [`"${sharedTokens.join(' ')}"`]
        : [];
    return {
        fts: [...sharedTokens, ...phraseToken],
        bm25: sharedTokens
            .filter((token) => token.length >= 2 && !STOP_WORDS.has(token))
            .map(simpleStem),
    };
}
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
function sanitizeFTS5Query(query) {
    return sanitizeQueryTokens(query)
        .map(t => `"${t}"`)
        .join(' ');
}
// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
export { BM25Index, getIndex, resetIndex, tokenize, simpleStem, getTermFrequencies, isBm25Enabled, sanitizeQueryTokens, sanitizeFTS5Query, normalizeLexicalQueryTokens, buildBm25DocumentText, DEFAULT_K1, DEFAULT_B, BM25_FTS5_WEIGHTS, BM25_FIELD_WEIGHTS, };
//# sourceMappingURL=bm25-index.js.map