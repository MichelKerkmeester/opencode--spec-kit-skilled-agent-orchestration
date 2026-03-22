// ───────────────────────────────────────────────────────────────
// MODULE: Bm25 Index
// ───────────────────────────────────────────────────────────────
// Feature catalog: BM25 trigger phrase re-index gate
import type Database from 'better-sqlite3';
import { normalizeContentForBM25 } from '../parsing/content-normalizer';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
   1B. CONSTANTS & FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */

const DEFAULT_K1 = 1.2;
const DEFAULT_B = 0.75;

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
const BM25_FIELD_WEIGHTS: Record<string, number> = {
  title:           10.0,
  trigger_phrases:  5.0,
  content_generic:  2.0,
  body:             1.0,
};

function isBm25Enabled(): boolean {
  return process.env.ENABLE_BM25 !== 'false';
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

function simpleStem(word: string): string {
  let stem = word.toLowerCase();
  let suffixRemoved = false;
  // Simple suffix removal
  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
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

function tokenize(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(simpleStem);
}

function getTermFrequencies(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) || 0) + 1);
  }
  return freq;
}

// ───────────────────────────────────────────────────────────────
// 3. BM25 INDEX CLASS

// ───────────────────────────────────────────────────────────────
class BM25Index {
  private k1: number;
  private b: number;
  private documents: Map<string, { tokens: string[]; termFreq: Map<string, number> }>;
  private documentFreq: Map<string, number>;
  private totalDocLength: number;

  constructor(k1: number = DEFAULT_K1, b: number = DEFAULT_B) {
    this.k1 = k1;
    this.b = b;
    this.documents = new Map();
    this.documentFreq = new Map();
    this.totalDocLength = 0;
  }

  addDocument(id: string, text: string): void {
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

  removeDocument(id: string): boolean {
    const doc = this.documents.get(id);
    if (!doc) return false;

    this.totalDocLength -= doc.tokens.length;

    for (const term of doc.termFreq.keys()) {
      const count = this.documentFreq.get(term) || 0;
      if (count <= 1) {
        this.documentFreq.delete(term);
      } else {
        this.documentFreq.set(term, count - 1);
      }
    }

    this.documents.delete(id);
    return true;
  }

  calculateIdf(term: string): number {
    const n = this.documents.size;
    const df = this.documentFreq.get(term) || 0;
    if (df === 0 || n === 0) return 0;
    return Math.log((n - df + 0.5) / (df + 0.5) + 1);
  }

  calculateScore(queryTokens: string[], docId: string): number {
    const doc = this.documents.get(docId);
    if (!doc) return 0;

    const avgDl = this.documents.size > 0 ? this.totalDocLength / this.documents.size : 0;
    const dl = doc.tokens.length;

    let score = 0;
    for (const term of queryTokens) {
      const tf = doc.termFreq.get(term) || 0;
      if (tf === 0) continue;

      const idf = this.calculateIdf(term);
      const numerator = tf * (this.k1 + 1);
      const denominator = tf + this.k1 * (1 - this.b + this.b * (dl / Math.max(avgDl, 1)));
      score += idf * (numerator / denominator);
    }

    return score;
  }

  search(query: string, limit: number = 10): BM25SearchResult[] {
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const results: BM25SearchResult[] = [];

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

  getStats(): BM25Stats {
    return {
      documentCount: this.documents.size,
      termCount: this.documentFreq.size,
      avgDocLength: this.documents.size > 0 ? this.totalDocLength / this.documents.size : 0,
    };
  }

  clear(): void {
    this.documents.clear();
    this.documentFreq.clear();
    this.totalDocLength = 0;
  }

  addDocuments(docs: Array<{ id: string; text: string }>): void {
    for (const doc of docs) {
      this.addDocument(doc.id, doc.text);
    }
  }

  /**
   * P3-04: Rebuild BM25 index from all active memories in the database.
   * Called on startup to restore the in-memory BM25 index from persisted data.
   */
  rebuildFromDatabase(database: Database.Database): number {
    this.clear();

    try {
      const rows = (database.prepare(
        `SELECT id, title, content_text, trigger_phrases, file_path
         FROM memory_index
         WHERE COALESCE(is_archived, 0) = 0`
      ) as Database.Statement).all() as Array<{
        id: number;
        title: string | null;
        content_text: string | null;
        trigger_phrases: string | null;
        file_path: string | null;
      }>;

      for (const row of rows) {
        const textParts: string[] = [];
        if (row.title) textParts.push(row.title);
        if (row.content_text) textParts.push(normalizeContentForBM25(row.content_text));
        if (row.trigger_phrases) textParts.push(row.trigger_phrases);
        if (row.file_path) textParts.push(row.file_path);
        const text = textParts.join(' ');
        if (text.trim()) {
          this.addDocument(String(row.id), text);
        }
      }

      return rows.length;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[bm25-index] Failed to rebuild from database: ${msg}`);
      return 0;
    }
  }

}

// ───────────────────────────────────────────────────────────────
// 4. SINGLETON

// ───────────────────────────────────────────────────────────────
let indexInstance: BM25Index | null = null;

function getIndex(): BM25Index {
  if (!indexInstance) {
    indexInstance = new BM25Index();
  }
  return indexInstance;
}

function resetIndex(): void {
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
 */
function sanitizeQueryTokens(query: string): string[] {
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

/**
 * Sanitize a query string for safe use with SQLite FTS5.
 * Delegates to `sanitizeQueryTokens` for tokenization, then wraps
 * each token in quotes for FTS5 safety.
 */
function sanitizeFTS5Query(query: string): string {
  return sanitizeQueryTokens(query)
    .map(t => `"${t}"`)
    .join(' ');
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS

// ───────────────────────────────────────────────────────────────
export {
  BM25Index,
  getIndex,
  resetIndex,
  tokenize,
  simpleStem,
  getTermFrequencies,
  isBm25Enabled,
  sanitizeQueryTokens,
  sanitizeFTS5Query,
  DEFAULT_K1,
  DEFAULT_B,
  BM25_FIELD_WEIGHTS,
};

export type {
  BM25SearchResult,
  BM25Stats,
};
