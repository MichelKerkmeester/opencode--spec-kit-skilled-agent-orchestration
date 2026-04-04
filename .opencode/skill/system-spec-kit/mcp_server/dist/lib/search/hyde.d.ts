import type { PipelineRow } from './pipeline/types.js';
/**
 * Format hint for pseudo-document generation.
 *
 * 'markdown-memory' — produce a short markdown-formatted memory entry
 *   matching the corpus format (bullet points, section headers, etc.).
 *   Max 200 tokens.
 */
export type HyDEFormat = 'markdown-memory';
/** Options for generateHyDE. */
export interface HyDEOptions {
    /** Hint for pseudo-document format. Default: 'markdown-memory'. */
    format?: HyDEFormat;
    /** Maximum token count for the pseudo-document. Default: MAX_HYDE_TOKENS. */
    maxTokens?: number;
}
/** HyDE result including the pseudo-document and its embedding. */
export interface HyDEResult {
    /** The generated pseudo-document text. */
    pseudoDocument: string;
    /** Embedding vector of the pseudo-document (Float32Array). */
    embedding: Float32Array;
}
/** Baseline result shape accepted by lowConfidence(). */
export interface BaselineResult {
    id: number;
    score?: number;
    rrfScore?: number;
    similarity?: number;
}
import { isHyDEEnabled } from './search-flags.js';
export { isHyDEEnabled };
/**
 * HyDE active mode (graduate from shadow to full merge).
 * Default: TRUE (graduated). Set SPECKIT_HYDE_ACTIVE=false to disable merging.
 */
export declare function isHyDEActive(): boolean;
/**
 * Detect whether a baseline result set has low retrieval confidence.
 *
 * A baseline is low-confidence when:
 *   1. It has fewer than MIN_RESULTS_FOR_CONFIDENCE results, OR
 *   2. The effective score of the top result is below LOW_CONFIDENCE_THRESHOLD.
 *
 * Score resolution order mirrors pipeline/types.ts resolveEffectiveScore:
 *   intentAdjustedScore (not in BaselineResult) → rrfScore → score → similarity/100
 *
 * @param baseline - Array of scored results (typically from Stage 1).
 * @returns True when the baseline is low-confidence.
 */
export declare function lowConfidence(baseline: BaselineResult[]): boolean;
/**
 * Resolve the effective score from a baseline result.
 * Mirrors resolveEffectiveScore in pipeline/types.ts.
 *
 * @param result - Baseline result row.
 * @returns Effective score in [0, 1].
 */
declare function resolveBaselineScore(result: BaselineResult): number;
/**
 * Build the HyDE generation prompt.
 *
 * The prompt asks the LLM to write a short memory entry (markdown format)
 * that would be a perfect answer to the query.
 *
 * @param query  - The search query.
 * @param format - Output format hint.
 * @param maxTokens - Maximum token count.
 * @returns Assembled prompt string.
 */
declare function buildHyDEPrompt(query: string, format: HyDEFormat, maxTokens: number): string;
/**
 * Call the LLM to generate a HyDE pseudo-document.
 *
 * Reads LLM_REFORMULATION_ENDPOINT / LLM_REFORMULATION_API_KEY from env
 * (shared with the reformulation module — same provider configuration).
 * Returns null when no endpoint is configured or on any error.
 *
 * @param prompt - The assembled HyDE prompt.
 * @param maxTokens - Token budget passed to the LLM.
 * @returns Raw pseudo-document text or null on failure.
 */
declare function callLlmForHyDE(prompt: string, maxTokens: number): Promise<string | null>;
/**
 * Generate a hypothetical document answering the query and embed it.
 *
 * Flow:
 *   1. Check shared cache (key: normalised query + 'hyde').
 *   2. On cache miss: call LLM to generate pseudo-document.
 *   3. Embed the pseudo-document via the embeddings provider.
 *   4. Cache { pseudoDocument, embedding } with 1-hour TTL.
 *   5. Return HyDEResult.
 *
 * Returns null when:
 *   - SPECKIT_HYDE flag is off (checked by caller but double-guarded here)
 *   - No LLM endpoint is configured
 *   - LLM or embedding call fails
 *
 * @param query   - The search query.
 * @param format  - Pseudo-document format. Default: 'markdown-memory'.
 * @param options - Optional token limit override.
 * @returns HyDEResult or null on failure.
 */
export declare function generateHyDE(query: string, format?: HyDEFormat, options?: HyDEOptions): Promise<HyDEResult | null>;
/**
 * Run a vector-only search using the HyDE pseudo-document embedding.
 *
 * This is the search channel activated when HyDE fires.
 * In shadow mode (SPECKIT_HYDE_ACTIVE=false): results are logged but
 * NOT returned to the caller.
 * In active mode (SPECKIT_HYDE_ACTIVE=true): results are returned for
 * merging into the candidate pool.
 *
 * @param embedding - The pseudo-document embedding.
 * @param limit     - Maximum number of results.
 * @param specFolder - Optional spec folder filter.
 * @returns Array of PipelineRow candidates (empty in shadow mode).
 */
export declare function vectorOnly(embedding: Float32Array, limit: number, specFolder?: string): PipelineRow[];
/**
 * Execute HyDE in shadow mode: run the full HyDE retrieval pipeline
 * for a deep + low-confidence query, log results, and return candidates
 * only when SPECKIT_HYDE_ACTIVE=true.
 *
 * Shadow-first design:
 *   - Shadow mode: results logged via console.warn (not stderr-polluting
 *     in production — use SPECKIT_HYDE_LOG=true to enable).
 *   - Active mode: results returned for merging in stage1-candidate-gen.
 *
 * @param query    - Original search query.
 * @param baseline - Current stage-1 candidate set (before HyDE).
 * @param limit    - Result limit.
 * @param specFolder - Optional spec folder scope.
 * @returns PipelineRow[] to merge (empty array in shadow mode or on failure).
 */
export declare function runHyDE(query: string, baseline: BaselineResult[], limit: number, specFolder?: string): Promise<PipelineRow[]>;
/**
 * Internal functions and constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    buildHyDEPrompt: typeof buildHyDEPrompt;
    callLlmForHyDE: typeof callLlmForHyDE;
    resolveBaselineScore: typeof resolveBaselineScore;
    LOW_CONFIDENCE_THRESHOLD: number;
    MAX_HYDE_TOKENS: number;
    MIN_RESULTS_FOR_CONFIDENCE: number;
    HYDE_TIMEOUT_MS: number;
};
//# sourceMappingURL=hyde.d.ts.map