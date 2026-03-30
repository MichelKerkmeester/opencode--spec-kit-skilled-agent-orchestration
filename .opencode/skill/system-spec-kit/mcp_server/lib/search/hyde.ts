// ───────────────────────────────────────────────────────────────
// MODULE: HyDE (Hypothetical Document Embeddings)
// ───────────────────────────────────────────────────────────────
// Feature catalog: D2 REQ-D2-004 — HyDE Active Mode
//
// Gate: SPECKIT_HYDE — deep + low-confidence queries only.
//
// HyDE generates a short hypothetical document that would answer the
// query, embeds it, then uses the pseudo-document embedding as an
// additional retrieval channel.  This helps bridge the vocabulary
// mismatch between user queries and indexed memories.
//
// Active mode (graduated): HyDE results are merged into the candidate
// set by default.  Set SPECKIT_HYDE_ACTIVE=false to revert to shadow
// mode where results are logged but NOT merged.
//
// Budget:
//   HyDE uses 1 LLM call per cache miss.
//   Combined with LLM reformulation: ≤2 total LLM calls per deep query.
//   Both share the same LlmCache (module: llm-cache.ts).
//
// Feature flags:
//   SPECKIT_HYDE        — enable the HyDE feature (default: TRUE, graduated)
//   SPECKIT_HYDE_ACTIVE — merge HyDE results into candidates (default: TRUE, graduated)

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import * as embeddings from '../providers/embeddings.js';
import * as vectorIndex from './vector-index.js';
import { getLlmCache, type LlmCacheKey } from './llm-cache.js';
import { normalizeQuery } from './llm-reformulation.js';
import type { PipelineRow } from './pipeline/types.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

/**
 * Maximum token count hint for pseudo-document generation.
 * Roughly 200 tokens ≈ 150 words at English density.
 */
const MAX_HYDE_TOKENS = 200;

/**
 * Low-confidence threshold: if the top result has an effective score
 * below this value, the baseline is considered low-confidence.
 */
const LOW_CONFIDENCE_THRESHOLD = 0.45;

/**
 * Minimum number of results needed to assess baseline confidence.
 * An empty result set is always considered low-confidence.
 */
const MIN_RESULTS_FOR_CONFIDENCE = 1;

/** Timeout for the HyDE LLM call in milliseconds. */
const HYDE_TIMEOUT_MS = 8000;

/* ───────────────────────────────────────────────────────────────
   4. FEATURE FLAGS
──────────────────────────────────────────────────────────────── */

// D2 REQ-D2-004: HyDE feature gate — canonical implementation in search-flags.ts.
// Default: TRUE (graduated). Set SPECKIT_HYDE=false to disable.
import { isHyDEEnabled } from './search-flags.js';
export { isHyDEEnabled };

/**
 * HyDE active mode (graduate from shadow to full merge).
 * Default: TRUE (graduated). Set SPECKIT_HYDE_ACTIVE=false to disable merging.
 */
export function isHyDEActive(): boolean {
  const val = process.env.SPECKIT_HYDE_ACTIVE?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/* ───────────────────────────────────────────────────────────────
   5. LOW-CONFIDENCE DETECTION
──────────────────────────────────────────────────────────────── */

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
export function lowConfidence(baseline: BaselineResult[]): boolean {
  if (!Array.isArray(baseline) || baseline.length < MIN_RESULTS_FOR_CONFIDENCE) {
    return true;
  }

  // H15 FIX: Use max score from baseline, not baseline[0], since callers
  // don't guarantee sorted input.
  let maxScore = 0;
  for (const item of baseline) {
    const s = resolveBaselineScore(item);
    if (s > maxScore) maxScore = s;
  }
  return maxScore < LOW_CONFIDENCE_THRESHOLD;
}

/**
 * Resolve the effective score from a baseline result.
 * Mirrors resolveEffectiveScore in pipeline/types.ts.
 *
 * @param result - Baseline result row.
 * @returns Effective score in [0, 1].
 */
function resolveBaselineScore(result: BaselineResult): number {
  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore))
    return Math.max(0, Math.min(1, result.rrfScore));
  if (typeof result.score === 'number' && Number.isFinite(result.score))
    return Math.max(0, Math.min(1, result.score));
  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity))
    return Math.max(0, Math.min(1, result.similarity / 100));
  return 0;
}

/* ───────────────────────────────────────────────────────────────
   6. PROMPT BUILDER
──────────────────────────────────────────────────────────────── */

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
function buildHyDEPrompt(
  query: string,
  format: HyDEFormat,
  maxTokens: number,
): string {
  const formatInstruction = format === 'markdown-memory'
    ? [
        'Write a short markdown memory entry (≤ 2 short sections, bullet points allowed)',
        'that would directly answer the query below.',
        'Use the format of a concise technical memory note.',
        'Do NOT include a title or YAML front-matter.',
      ].join(' ')
    : 'Write a concise document that answers the query below.';

  return [
    'You are a technical knowledge assistant.',
    formatInstruction,
    `Keep the response under ${maxTokens} tokens.`,
    '',
    'RULES:',
    '  - Be specific and grounded. Do not pad with filler.',
    '  - Do not claim facts you are uncertain about.',
    `  - Query: ${query}`,
  ].join('\n');
}

/* ───────────────────────────────────────────────────────────────
   7. LLM CALL (PROVIDER-AGNOSTIC STUB)
──────────────────────────────────────────────────────────────── */

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
async function callLlmForHyDE(
  prompt: string,
  maxTokens: number,
): Promise<string | null> {
  const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
  if (!endpoint) {
    return null;
  }

  const apiKey = process.env.LLM_REFORMULATION_API_KEY?.trim() ?? '';
  const model = process.env.LLM_REFORMULATION_MODEL?.trim() ?? 'gpt-4o-mini';

  const requestBody = {
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.5,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HYDE_TIMEOUT_MS);

  try {
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[hyde] LLM endpoint returned HTTP ${response.status}`);
      return null;
    }

    const data = await response.json() as Record<string, unknown>;
    const content = (data?.choices as Array<Record<string, unknown>>)?.[0]
      ?.message as Record<string, unknown> | undefined;
    const text = typeof content?.content === 'string' ? content.content.trim() : null;

    if (!text || text.length < 10) return null;
    return text;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[hyde] LLM call failed: ${msg}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. PUBLIC API — generateHyDE
──────────────────────────────────────────────────────────────── */

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
export async function generateHyDE(
  query: string,
  format: HyDEFormat = 'markdown-memory',
  options?: HyDEOptions,
): Promise<HyDEResult | null> {
  if (!isHyDEEnabled()) {
    return null;
  }

  const maxTokens = options?.maxTokens ?? MAX_HYDE_TOKENS;
  const cache = getLlmCache();
  const cacheKey: LlmCacheKey = {
    query: normalizeQuery(query),
    mode: 'hyde',
  };

  // Cache hit — return stored pseudo-document + embedding
  const cached = cache.get<HyDEResult>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  try {
    const prompt = buildHyDEPrompt(query, format, maxTokens);
    const pseudoDocument = await callLlmForHyDE(prompt, maxTokens);

    if (!pseudoDocument) return null;

    const embeddingRaw = await embeddings.generateQueryEmbedding(pseudoDocument);
    if (!embeddingRaw) {
      console.warn('[hyde] Failed to embed pseudo-document');
      return null;
    }

    const embedding = embeddingRaw instanceof Float32Array
      ? embeddingRaw
      : Float32Array.from(embeddingRaw as number[]);

    const result: HyDEResult = { pseudoDocument, embedding };
    cache.set(cacheKey, result);
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[hyde] generateHyDE failed: ${msg}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   9. PUBLIC API — hydeSearch
──────────────────────────────────────────────────────────────── */

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
export function vectorOnly(
  embedding: Float32Array,
  limit: number,
  specFolder?: string,
): PipelineRow[] {
  return vectorIndex.vectorSearch(embedding, {
    limit,
    specFolder,
    includeConstitutional: false,
  }) as PipelineRow[];
}

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
export async function runHyDE(
  query: string,
  baseline: BaselineResult[],
  limit: number,
  specFolder?: string,
): Promise<PipelineRow[]> {
  if (!isHyDEEnabled()) {
    return [];
  }

  if (!lowConfidence(baseline)) {
    return [];
  }

  try {
    const hydeResult = await generateHyDE(query, 'markdown-memory');
    if (!hydeResult) return [];

    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);

    const active = isHyDEActive();

    if (process.env.SPECKIT_HYDE_LOG?.toLowerCase().trim() === 'true') {
      console.warn(
        `[hyde] shadow results: ${candidates.length} candidates for query "${query}" ` +
        `(pseudo-doc length: ${hydeResult.pseudoDocument.length} chars, active: ${active})`,
      );
    }

    if (!active) {
      // Shadow mode — log only, do not contribute to candidate set
      return [];
    }

    return candidates;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[hyde] runHyDE failed: ${msg}`);
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   10. TEST EXPORTS
──────────────────────────────────────────────────────────────── */

/**
 * Internal functions and constants exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  buildHyDEPrompt,
  callLlmForHyDE,
  resolveBaselineScore,
  LOW_CONFIDENCE_THRESHOLD,
  MAX_HYDE_TOKENS,
  MIN_RESULTS_FOR_CONFIDENCE,
  HYDE_TIMEOUT_MS,
};
