// ───────────────────────────────────────────────────────────────
// MODULE: Tfidf Summarizer
// ───────────────────────────────────────────────────────────────
// Feature catalog: Memory summary search channel
// Pure TypeScript, zero dependencies
// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
interface ScoredSentence {
  text: string;
  score: number;
  index: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Minimum character length for a sentence to be considered. */
const MIN_SENTENCE_LENGTH = 10;

/** Maximum character length for a sentence to be considered. */
const MAX_SENTENCE_LENGTH = 500;

/** Default number of key sentences to extract. */
const DEFAULT_TOP_N = 3;

// ───────────────────────────────────────────────────────────────
// 3. INTERNAL HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Strip markdown syntax from text before scoring.
 * Removes headers (#), bullets (- / *), links ([text](url)),
 * bold/italic markers, inline code, and image syntax.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')          // headers
    .replace(/^\s*[-*+]\s+/gm, '')        // bullets
    .replace(/^\s*\d+\.\s+/gm, '')        // numbered lists
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // links
    .replace(/`{1,3}[^`]*`{1,3}/g, '')    // inline code
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold/italic
    .replace(/~~([^~]+)~~/g, '$1')         // strikethrough
    .replace(/>\s+/g, '')                  // blockquotes
    .trim();
}

/**
 * Tokenize a sentence: lowercase, split on whitespace, remove punctuation.
 * Returns array of cleaned tokens.
 */
function tokenize(sentence: string): string[] {
  const cleaned = stripMarkdown(sentence);
  return cleaned
    .toLowerCase()
    .split(/\s+/)
    .map(token => token.replace(/[^\w]/g, ''))
    .filter(token => token.length > 0);
}

/**
 * Split content into sentences using sentence-ending punctuation
 * and newline boundaries.
 */
function splitSentences(content: string): string[] {
  // First split on newlines to handle markdown line-by-line content
  const lines = content.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);

  const sentences: string[] = [];
  for (const line of lines) {
    // Split each line on sentence-ending punctuation followed by space
    const parts = line.split(/(?<=[.!?])\s+/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.length > 0) {
        sentences.push(trimmed);
      }
    }
  }

  return sentences;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
/**
 * Compute TF-IDF scores for sentences within a document.
 *
 * Algorithm:
 * 1. Tokenize each sentence: lowercase, split on whitespace, remove punctuation
 * 2. TF(term, sentence) = count of term in sentence / total terms in sentence
 * 3. IDF(term) = log(total sentences / sentences containing term)
 * 4. Score per sentence = sum of TF*IDF for all terms in that sentence
 * 5. Normalize scores to [0, 1] by dividing by max score
 *
 * @param sentences - Array of sentence strings to score
 * @returns Array of scored sentences with normalized [0, 1] scores
 */
export function computeTfIdf(sentences: string[]): ScoredSentence[] {
  if (sentences.length === 0) {
    return [];
  }

  // Tokenize all sentences
  const tokenizedSentences = sentences.map(s => tokenize(s));
  const totalSentences = sentences.length;

  // Build document frequency map: term -> number of sentences containing it
  const docFreq = new Map<string, number>();
  for (const tokens of tokenizedSentences) {
    const unique = new Set(tokens);
    for (const term of unique) {
      docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
    }
  }

  // Compute TF-IDF score for each sentence
  const scored: ScoredSentence[] = sentences.map((text, index) => {
    const tokens = tokenizedSentences[index];
    if (tokens.length === 0) {
      return { text, score: 0, index };
    }

    // Count term frequencies in this sentence
    const termFreq = new Map<string, number>();
    for (const token of tokens) {
      termFreq.set(token, (termFreq.get(token) ?? 0) + 1);
    }

    // Sum TF * IDF for all terms
    let score = 0;
    for (const [term, count] of termFreq) {
      const tf = count / tokens.length;
      const df = docFreq.get(term) ?? 1;
      const idf = Math.log(totalSentences / df);
      score += tf * idf;
    }

    return { text, score, index };
  });

  // Normalize scores to [0, 1]
  // Use reduce-based max to avoid RangeError when scored is large (spread exceeds call-stack limit)
  const maxScore = scored.reduce((max, s) => s.score > max ? s.score : max, -Infinity);
  if (maxScore > 0) {
    for (const s of scored) {
      s.score = s.score / maxScore;
    }
  }

  return scored;
}

/**
 * Extract top-n sentences by TF-IDF score.
 *
 * 1. Split content into sentences (split on sentence-ending punctuation or newlines)
 * 2. Filter: skip sentences < 10 chars or > 500 chars
 * 3. Run computeTfIdf on filtered sentences
 * 4. Return top-n by score, sorted by original document order (index)
 *
 * @param content - The document content to extract from
 * @param n - Number of top sentences to extract (default: 3)
 * @returns Array of top-n sentences sorted by original document order
 */
export function extractKeySentences(content: string, n: number = DEFAULT_TOP_N): string[] {
  if (!content || content.trim().length === 0) {
    return [];
  }

  // Split into sentences
  const rawSentences = splitSentences(content);

  // Filter by length constraints
  const filtered = rawSentences.filter(s => {
    const stripped = stripMarkdown(s);
    return stripped.length >= MIN_SENTENCE_LENGTH && stripped.length <= MAX_SENTENCE_LENGTH;
  });

  if (filtered.length === 0) {
    return [];
  }

  // Single sentence: return as-is
  if (filtered.length === 1) {
    return [filtered[0]];
  }

  // Compute TF-IDF scores
  const scored = computeTfIdf(filtered);

  // Sort by score descending, take top-n
  const topN = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, n);

  // Return sorted by original document order (index)
  return topN
    .sort((a, b) => a.index - b.index)
    .map(s => s.text);
}

/**
 * Orchestrator: generate summary from content.
 *
 * 1. Call extractKeySentences(content, 3)
 * 2. Join with ' ' as summary text
 * 3. Return both summary and key sentences array
 *
 * @param content - The document content to summarize
 * @returns Object with summary text and key sentences array
 */
export function generateSummary(content: string): { summary: string; keySentences: string[] } {
  if (!content || content.trim().length === 0) {
    return { summary: '', keySentences: [] };
  }

  const keySentences = extractKeySentences(content, DEFAULT_TOP_N);

  if (keySentences.length === 0) {
    return { summary: '', keySentences: [] };
  }

  const summary = keySentences.join(' ');
  return { summary, keySentences };
}

// ───────────────────────────────────────────────────────────────
// 5. TEST EXPORTS

// ───────────────────────────────────────────────────────────────
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  stripMarkdown,
  tokenize,
  splitSentences,
  MIN_SENTENCE_LENGTH,
  MAX_SENTENCE_LENGTH,
  DEFAULT_TOP_N,
};
