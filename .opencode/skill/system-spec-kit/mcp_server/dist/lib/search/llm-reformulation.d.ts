/** A single seed result used to ground the reformulation prompt. */
export interface SeedResult {
    id: number;
    title?: string;
    content?: string;
}
/** Output of llm.rewrite — step-back abstract + corpus-grounded variants. */
export interface ReformulationResult {
    /** Step-back abstraction of the original query. */
    abstract: string;
    /** Additional corpus-grounded query variants. */
    variants: string[];
}
/** Options for cheapSeedRetrieve. */
export interface SeedRetrieveOptions {
    /** Number of seed results to retrieve. Default: SEED_LIMIT. */
    limit?: number;
}
import { isLlmReformulationEnabled } from './search-flags.js';
export { isLlmReformulationEnabled };
/**
 * Fast, low-cost seed retrieval for reformulation grounding.
 *
 * Uses FTS5 / BM25 keyword search only — no embedding call — to keep
 * latency minimal and the ≤2 LLM calls per deep query budget intact.
 * Returns up to `limit` (default 3) results.
 *
 * Fail-open: returns empty array on any error so that the caller can
 * decide whether to proceed with an ungrounded prompt or skip.
 *
 * @param query - The raw search query to ground against.
 * @param options - Optional limit override.
 * @returns Array of seed results (may be empty).
 */
export declare function cheapSeedRetrieve(query: string, options?: SeedRetrieveOptions): SeedResult[];
/**
 * Build a grounded reformulation prompt.
 *
 * Injects the original query and top-3 seed snippets so the LLM can
 * produce a step-back abstraction and grounded variants without
 * inventing content that does not exist in the corpus.
 *
 * Prompt design principles:
 *   - Explicit "do not hallucinate" instruction
 *   - Seeds bounded to avoid token bloat (first 200 chars each)
 *   - Structured JSON output schema minimises parsing failures
 *
 * @param query - Original user query.
 * @param seeds - Corpus seed results for grounding.
 * @returns Prompt string ready for the LLM chat API.
 */
declare function buildReformulationPrompt(query: string, seeds: SeedResult[]): string;
/**
 * Provider-agnostic LLM caller.
 *
 * Reads LLM_REFORMULATION_ENDPOINT and LLM_REFORMULATION_API_KEY from env.
 * If neither is set, the function returns null (caller handles graceful fallback).
 *
 * This is an intentionally thin integration layer. The server operator is
 * responsible for pointing these env vars at an OpenAI-compatible endpoint
 * (OpenAI, Ollama, local proxy, etc.).
 *
 * Contract:
 *   - Single system/user turn
 *   - max_tokens capped at 256 (no streaming)
 *   - Response parsed as JSON matching ReformulationResult
 *
 * @param prompt - The assembled reformulation prompt.
 * @returns Parsed result or null on any failure.
 */
declare function callLlmForReformulation(prompt: string): Promise<ReformulationResult | null>;
/**
 * Parse and validate the LLM reformulation JSON response.
 *
 * Validation rules:
 *   - `abstract` must be a non-empty string ≥ MIN_OUTPUT_LENGTH chars
 *   - `variants` must be an array; invalid items are filtered out
 *   - At most MAX_VARIANTS variants are kept
 *
 * Returns null on any parse or validation failure so the caller can
 * fall back gracefully.
 *
 * @param rawText - Raw JSON string from the LLM.
 * @returns Validated ReformulationResult or null.
 */
declare function parseReformulationResponse(rawText: string): ReformulationResult | null;
/**
 * Namespace object exposing the public LLM reformulation API.
 * Matches the call site pattern: `await llm.rewrite({ q, seeds, mode })`.
 */
export declare const llm: {
    /**
     * Perform corpus-grounded step-back query reformulation.
     *
     * Flow:
     *   1. Build normalised cache key (query + mode).
     *   2. Check shared LLM result cache — return hit immediately (no LLM call).
     *   3. Build grounded prompt using seeds.
     *   4. Call LLM endpoint (capped at REFORMULATION_TIMEOUT_MS).
     *   5. Parse and validate JSON response.
     *   6. Cache the result with 1-hour TTL.
     *   7. Return result (or fallback identity on any failure).
     *
     * LLM call budget: exactly 1 call per cache miss (0 on hit).
     * Combined with HyDE this stays within the ≤2 calls per deep query budget.
     *
     * @param params.q     - Original query string.
     * @param params.seeds - Seed results for corpus grounding.
     * @param params.mode  - Must be 'step_back+corpus' (extension point for future modes).
     * @returns ReformulationResult (abstract + variants), never throws.
     */
    rewrite(params: {
        q: string;
        seeds: SeedResult[];
        mode: "step_back+corpus";
    }): Promise<ReformulationResult>;
};
/**
 * Deduplicated fanout: combines the original query with the LLM-produced
 * abstract and variants into a set of distinct query strings.
 *
 * The original query always appears first. Empty strings are rejected.
 *
 * @param queries - Array of query strings to deduplicate.
 * @returns Deduplicated array, original first.
 */
export declare function fanout(queries: string[]): string[];
/**
 * Normalise a query string for use as a cache key.
 * Collapses whitespace and lowercases.
 *
 * @param q - Raw query string.
 * @returns Normalised key string.
 */
export declare function normalizeQuery(q: string): string;
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    buildReformulationPrompt: typeof buildReformulationPrompt;
    parseReformulationResponse: typeof parseReformulationResponse;
    callLlmForReformulation: typeof callLlmForReformulation;
    normalizeQuery: typeof normalizeQuery;
    SEED_LIMIT: number;
    MAX_VARIANTS: number;
    MIN_OUTPUT_LENGTH: number;
    REFORMULATION_TIMEOUT_MS: number;
};
//# sourceMappingURL=llm-reformulation.d.ts.map