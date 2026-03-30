// ───────────────────────────────────────────────────────────────
// MODULE: LLM Reformulation
// ───────────────────────────────────────────────────────────────
// Feature catalog: D2 REQ-D2-003 — Corpus-Grounded LLM Reformulation
//
// Gate: SPECKIT_LLM_REFORMULATION — deep-mode only.
//
// Step-back abstraction combined with corpus seed grounding.
// Seeds are retrieved via a lightweight keyword-only search using
// BM25/FTS5 (no embedding call) to ground the LLM prompt in real
// corpus content and prevent hallucination.
//
// Budget: ≤1 LLM call per reformulation (enforced by design).
// Shared LLM result cache (key: normalized query + mode, TTL 1h)
// is imported from llm-cache.ts and also used by hyde.ts.
//
// Feature flag: SPECKIT_LLM_REFORMULATION (default: TRUE, graduated via rollout-policy).
// Set SPECKIT_LLM_REFORMULATION=false to disable. Only fires in deep mode.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { fts5Bm25Search } from './sqlite-fts.js';
import { requireDb } from '../../utils/db-helpers.js';
import { getLlmCache, type LlmCacheKey } from './llm-cache.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Number of seed results to retrieve for grounding. */
const SEED_LIMIT = 3;

/** Timeout for the reformulation LLM call in milliseconds. */
const REFORMULATION_TIMEOUT_MS = 8000;

/**
 * Maximum number of variants the LLM may return.
 * Enforced via prompt and validated on the parsed result.
 */
const MAX_VARIANTS = 2;

/**
 * Minimum length (characters) for an LLM output string to be considered valid.
 * Guards against empty or whitespace-only returns.
 */
const MIN_OUTPUT_LENGTH = 5;

/* ───────────────────────────────────────────────────────────────
   4. FEATURE FLAG
──────────────────────────────────────────────────────────────── */

// D2 REQ-D2-003: LLM reformulation gate — canonical implementation in search-flags.ts.
// Default: TRUE (graduated). Set SPECKIT_LLM_REFORMULATION=false to disable.
import { isLlmReformulationEnabled } from './search-flags.js';
export { isLlmReformulationEnabled };

/* ───────────────────────────────────────────────────────────────
   5. SEED RETRIEVAL
──────────────────────────────────────────────────────────────── */

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
export function cheapSeedRetrieve(
  query: string,
  options?: SeedRetrieveOptions,
): SeedResult[] {
  const limit = options?.limit ?? SEED_LIMIT;

  try {
    const db = requireDb();
    const rawResults = fts5Bm25Search(db, query, { limit });

    return rawResults.slice(0, limit).map((row): SeedResult => ({
      id: typeof row.id === 'number' ? row.id : Number(row.id),
      title: typeof row.title === 'string' ? row.title : undefined,
      content: typeof row.content_text === 'string'
        ? row.content_text
        : typeof row.content === 'string'
          ? row.content
          : undefined,
    }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[llm-reformulation] cheapSeedRetrieve failed: ${msg}`);
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   6. PROMPT BUILDER
──────────────────────────────────────────────────────────────── */

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
function buildReformulationPrompt(query: string, seeds: SeedResult[]): string {
  const seedBlock = seeds.length > 0
    ? seeds.map((s, i) => {
        const snippet = (s.content ?? s.title ?? '').slice(0, 200);
        return `Seed ${i + 1}: ${snippet}`;
      }).join('\n')
    : '(no corpus seeds available)';

  return [
    'You are a search query reformulation assistant.',
    'Your task: given an original query and corpus seed excerpts, produce:',
    '  1. A step-back abstraction (more general form of the query)',
    `  2. Up to ${MAX_VARIANTS} corpus-grounded variant queries`,
    '',
    'RULES:',
    '  - Stay strictly grounded in the provided seed content.',
    '  - Do NOT invent concepts, entities, or facts not present in the seeds.',
    '  - If seeds are unavailable, use only the original query as grounding.',
    '  - Keep each variant under 120 characters.',
    '',
    'Return ONLY valid JSON, no prose:',
    '{"abstract": "<step-back abstraction>", "variants": ["<variant1>", "<variant2>"]}',
    '',
    `Original query: ${query}`,
    '',
    'Corpus seeds:',
    seedBlock,
  ].join('\n');
}

/* ───────────────────────────────────────────────────────────────
   7. LLM CALL (PROVIDER-AGNOSTIC STUB)
──────────────────────────────────────────────────────────────── */

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
async function callLlmForReformulation(
  prompt: string,
): Promise<ReformulationResult | null> {
  const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
  if (!endpoint) {
    // No LLM provider configured — caller falls back to non-LLM path.
    return null;
  }

  const apiKey = process.env.LLM_REFORMULATION_API_KEY?.trim() ?? '';
  const model = process.env.LLM_REFORMULATION_MODEL?.trim() ?? 'gpt-4o-mini';

  const requestBody = {
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 256,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REFORMULATION_TIMEOUT_MS,
  );

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
      console.warn(
        `[llm-reformulation] LLM endpoint returned HTTP ${response.status}`,
      );
      return null;
    }

    const data = await response.json() as Record<string, unknown>;
    const content = (data?.choices as Array<Record<string, unknown>>)?.[0]
      ?.message as Record<string, unknown> | undefined;
    const rawText = typeof content?.content === 'string'
      ? content.content
      : null;

    if (!rawText) return null;

    return parseReformulationResponse(rawText);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[llm-reformulation] LLM call failed: ${msg}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. RESPONSE PARSER
──────────────────────────────────────────────────────────────── */

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
function parseReformulationResponse(
  rawText: string,
): ReformulationResult | null {
  try {
    const parsed = JSON.parse(rawText) as Record<string, unknown>;

    const abstract = typeof parsed.abstract === 'string'
      ? parsed.abstract.trim()
      : '';

    if (abstract.length < MIN_OUTPUT_LENGTH) {
      console.warn('[llm-reformulation] LLM returned empty or too-short abstract');
      return null;
    }

    const rawVariants = Array.isArray(parsed.variants) ? parsed.variants : [];
    const variants = rawVariants
      .filter((v): v is string => typeof v === 'string' && v.trim().length >= MIN_OUTPUT_LENGTH)
      .map((v) => v.trim())
      .slice(0, MAX_VARIANTS);

    return { abstract, variants };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[llm-reformulation] Failed to parse LLM response: ${msg}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   9. PUBLIC API — llm.rewrite
──────────────────────────────────────────────────────────────── */

/**
 * Namespace object exposing the public LLM reformulation API.
 * Matches the call site pattern: `await llm.rewrite({ q, seeds, mode })`.
 */
export const llm = {
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
  async rewrite(params: {
    q: string;
    seeds: SeedResult[];
    mode: 'step_back+corpus';
  }): Promise<ReformulationResult> {
    const { q, seeds } = params;
    const cache = getLlmCache();

    const cacheKey: LlmCacheKey = {
      query: normalizeQuery(q),
      mode: 'reformulation',
    };

    // Cache hit — no LLM call
    const cached = cache.get<ReformulationResult>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    const fallback: ReformulationResult = { abstract: q, variants: [] };

    if (!isLlmReformulationEnabled()) {
      return fallback;
    }

    try {
      const prompt = buildReformulationPrompt(q, seeds);
      const result = await callLlmForReformulation(prompt);

      if (result !== null) {
        cache.set(cacheKey, result);
        return result;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[llm-reformulation] llm.rewrite failed, returning fallback: ${msg}`,
      );
    }

    return fallback;
  },
};

/* ───────────────────────────────────────────────────────────────
   10. FANOUT HELPER
──────────────────────────────────────────────────────────────── */

/**
 * Deduplicated fanout: combines the original query with the LLM-produced
 * abstract and variants into a set of distinct query strings.
 *
 * The original query always appears first. Empty strings are rejected.
 *
 * @param queries - Array of query strings to deduplicate.
 * @returns Deduplicated array, original first.
 */
export function fanout(queries: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const q of queries) {
    const trimmed = q.trim();
    if (trimmed.length > 0 && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }
  return result;
}

/* ───────────────────────────────────────────────────────────────
   11. UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Normalise a query string for use as a cache key.
 * Collapses whitespace and lowercases.
 *
 * @param q - Raw query string.
 * @returns Normalised key string.
 */
export function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ');
}

/* ───────────────────────────────────────────────────────────────
   12. TEST EXPORTS
──────────────────────────────────────────────────────────────── */

/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  buildReformulationPrompt,
  parseReformulationResponse,
  callLlmForReformulation,
  normalizeQuery,
  SEED_LIMIT,
  MAX_VARIANTS,
  MIN_OUTPUT_LENGTH,
  REFORMULATION_TIMEOUT_MS,
};
