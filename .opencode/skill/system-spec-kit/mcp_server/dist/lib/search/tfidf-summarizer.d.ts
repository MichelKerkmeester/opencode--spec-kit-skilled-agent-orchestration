interface ScoredSentence {
    text: string;
    score: number;
    index: number;
}
/**
 * Strip markdown syntax from text before scoring.
 * Removes headers (#), bullets (- / *), links ([text](url)),
 * bold/italic markers, inline code, and image syntax.
 */
declare function stripMarkdown(text: string): string;
/**
 * Tokenize a sentence: lowercase, split on whitespace, remove punctuation.
 * Returns array of cleaned tokens.
 */
declare function tokenize(sentence: string): string[];
/**
 * Split content into sentences using sentence-ending punctuation
 * and newline boundaries.
 */
declare function splitSentences(content: string): string[];
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
export declare function computeTfIdf(sentences: string[]): ScoredSentence[];
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
export declare function extractKeySentences(content: string, n?: number): string[];
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
export declare function generateSummary(content: string): {
    summary: string;
    keySentences: string[];
};
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    stripMarkdown: typeof stripMarkdown;
    tokenize: typeof tokenize;
    splitSentences: typeof splitSentences;
    MIN_SENTENCE_LENGTH: number;
    MAX_SENTENCE_LENGTH: number;
    DEFAULT_TOP_N: number;
};
export {};
//# sourceMappingURL=tfidf-summarizer.d.ts.map