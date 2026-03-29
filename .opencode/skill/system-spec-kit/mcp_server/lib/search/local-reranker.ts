// ───────────────────────────────────────────────────────────────
// MODULE: Local Reranker
// ───────────────────────────────────────────────────────────────
// Optional local reranker for Stage 3. This module is fully gated by
// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
// Precondition or runtime failure.
//
// [CHK-069] Eval comparison (local GGUF vs Cohere/Voyage) is deferred to the
// Dedicated evaluation suite because runtime reranking must stay provider-agnostic.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import os from 'os';
import path from 'path';
import { access } from 'fs/promises';
import { toErrorMessage } from '../../utils/index.js';

// Feature catalog: Local GGUF reranker via node-llama-cpp

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface NodeLlamaCppModule {
  getLlama: () => Promise<unknown>;
}

type LocalRerankRow = Record<string, unknown> & {
  id: number | string;
  content?: string;
  file_path?: string;
  score?: number;
  rerankerScore?: number;
};

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

const MIN_TOTAL_MEMORY_BYTES = 8 * 1024 * 1024 * 1024;
// Lower total-memory threshold when custom model is configured — still
// Prevents OOM on truly constrained systems without blocking intentional
// Overrides. We use totalmem() because freemem() is unreliable on macOS/Linux
// Where disk cache can make "free" memory appear deceptively low.
const MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2 * 1024 * 1024 * 1024;
const DEFAULT_MODEL_RELATIVE_PATH = path.join('models', 'bge-reranker-v2-m3.Q4_K_M.gguf');
const RERANKER_TIMEOUT_MS = Number(process.env.SPECKIT_RERANKER_TIMEOUT_MS) || 30_000;
const MAX_PROMPT_BYTES = 10 * 1024;
const MAX_RERANK_CANDIDATES = 50;

/* ───────────────────────────────────────────────────────────────
   4. MODEL MANAGEMENT
──────────────────────────────────────────────────────────────── */

let cachedLlama: unknown | null = null;
let cachedModel: unknown | null = null;
let cachedModelPath: string | null = null;
let modelLoadPromise: Promise<unknown> | null = null;
let modelLoadPromisePath: string | null = null;

function resolveModelPath(): string {
  const configured = process.env.SPECKIT_RERANKER_MODEL?.trim();
  if (!configured) {
    return path.resolve(process.cwd(), DEFAULT_MODEL_RELATIVE_PATH);
  }
  if (path.isAbsolute(configured)) {
    return configured;
  }
  return path.resolve(process.cwd(), configured);
}

function resolveRowText(row: LocalRerankRow): string {
  if (typeof row.content === 'string' && row.content.trim().length > 0) {
    return row.content.trim();
  }
  if (typeof row.file_path === 'string' && row.file_path.trim().length > 0) {
    return row.file_path.trim();
  }
  return '';
}

async function loadNodeLlamaCpp(): Promise<NodeLlamaCppModule> {
  const dynamicImport = new Function('m', 'return import(m)');
  const mod = await dynamicImport('node-llama-cpp') as unknown;
  if (!mod || typeof mod !== 'object' || typeof (mod as NodeLlamaCppModule).getLlama !== 'function') {
    throw new Error('node-llama-cpp loaded without getLlama() export');
  }
  return mod as NodeLlamaCppModule;
}

async function ensureModelLoaded(modelPath: string): Promise<unknown> {
  // Fast path: model already cached for this path
  if (cachedModel && cachedModelPath === modelPath) {
    return cachedModel;
  }

  // H4 fix: Explicitly reuse in-flight promise for the same model path
  // To prevent concurrent callers from orphaning promises
  if (modelLoadPromise && modelLoadPromisePath === modelPath) {
    return await modelLoadPromise;
  }

  // Discard stale promise if the model path changed since the last load
  if (modelLoadPromise && modelLoadPromisePath !== modelPath) {
    modelLoadPromise = null;
    modelLoadPromisePath = null;
  }

  modelLoadPromisePath = modelPath;
  modelLoadPromise = (async () => {
    const llamaModule = await loadNodeLlamaCpp();
    cachedLlama = await llamaModule.getLlama();
    if (!cachedLlama || typeof cachedLlama !== 'object') {
      throw new Error('getLlama() did not return a usable object');
    }
    const loadModel = (cachedLlama as { loadModel?: (args: { modelPath: string }) => Promise<unknown> }).loadModel;
    if (typeof loadModel !== 'function') {
      throw new Error('node-llama-cpp runtime missing loadModel()');
    }
    const model = await loadModel.call(cachedLlama, { modelPath });
    if (!model || typeof model !== 'object') {
      throw new Error('loadModel() returned invalid model');
    }
    cachedModel = model;
    cachedModelPath = modelPath;
    return model;
  })();

  try {
    return await modelLoadPromise;
  } catch (error: unknown) {
    modelLoadPromise = null;
    modelLoadPromisePath = null;
    cachedModel = null;
    cachedModelPath = null;
    throw error;
  }
}

/* ───────────────────────────────────────────────────────────────
   5. SCORING
──────────────────────────────────────────────────────────────── */

function normalizeScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  // Keep score bounded and monotonic without assuming provider-native scale.
  return (Math.tanh(value) + 1) / 2;
}

function extractNumericScore(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const directKeys = ['score', 'relevance', 'relevanceScore', 'similarity', 'logit'];
    for (const key of directKeys) {
      const extracted = extractNumericScore(record[key]);
      if (extracted !== null) return extracted;
    }
  }
  return null;
}

async function scorePrompt(context: unknown, prompt: string): Promise<number> {
  if (!context || typeof context !== 'object') {
    throw new Error('Invalid llama context');
  }

  const directFns = ['score', 'getScore', 'evaluate', 'eval'] as const;
  for (const fnName of directFns) {
    const fn = (context as Record<string, unknown>)[fnName];
    if (typeof fn === 'function') {
      const raw = await (fn as (input: string) => Promise<unknown>).call(context, prompt);
      const score = extractNumericScore(raw);
      if (score !== null) return normalizeScore(score);
    }
  }

  const getSequence = (context as { getSequence?: () => Promise<unknown> }).getSequence;
  if (typeof getSequence === 'function') {
    const sequence = await getSequence.call(context);
    if (sequence && typeof sequence === 'object') {
      const seqEval = (sequence as { evaluate?: (input: string) => Promise<unknown> }).evaluate;
      if (typeof seqEval === 'function') {
        const raw = await seqEval.call(sequence, prompt);
        const score = extractNumericScore(raw);
        if (score !== null) return normalizeScore(score);
      }
    }
  }

  throw new Error('Unable to resolve a scoring method from llama context');
}

/* ───────────────────────────────────────────────────────────────
   6. PUBLIC API
──────────────────────────────────────────────────────────────── */

/**
 * Feature-flag gate for local reranking.
 * This guard is intentionally strict: local reranking only runs when the
 * operator opts in with `RERANKER_LOCAL=true`, has enough total RAM, and the
 * configured GGUF model file is available.
 */
export async function canUseLocalReranker(): Promise<boolean> {
  if (process.env.RERANKER_LOCAL?.toLowerCase().trim() !== 'true') {
    return false;
  }

  // Use total system memory instead of free memory. On macOS/Linux,
  // Os.freemem() can look artificially low due to disk cache usage.
  const hasCustomModel = Boolean(process.env.SPECKIT_RERANKER_MODEL?.trim());
  const memThreshold = hasCustomModel ? MIN_TOTAL_MEMORY_CUSTOM_BYTES : MIN_TOTAL_MEMORY_BYTES;
  if (os.totalmem() < memThreshold) {
    return false;
  }

  const modelPath = resolveModelPath();
  try {
    await access(modelPath);
    return true;
  } catch (_error: unknown) {
    return false;
  }
}

/**
 * Local GGUF reranking entrypoint for Stage 3.
 * Falls back to original ordering whenever preconditions fail or runtime
 * inference errors occur, preserving deterministic behavior.
 */
export async function rerankLocal<T extends LocalRerankRow>(
  query: string,
  candidates: T[],
  topK: number
): Promise<T[]> {
  if (!Array.isArray(candidates) || candidates.length < 2) {
    return candidates;
  }

  /**
   * Internal guard for direct callers: rerankLocal re-checks eligibility even
   * when invoked outside the Stage 3 flag path, and fails closed to the
   * original ranking when local execution is unavailable.
   */
  const localEnabled = await canUseLocalReranker();
  if (!localEnabled) {
    return candidates;
  }

  const modelPath = resolveModelPath();
  const rerankCandidates = candidates.slice(0, MAX_RERANK_CANDIDATES);
  const rerankCount = Math.max(1, Math.min(topK, rerankCandidates.length));
  const startedAt = Date.now();

  let context: unknown | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  try {
    const model = await ensureModelLoaded(modelPath);
    const createContext = (model as { createContext?: () => Promise<unknown> }).createContext;
    if (typeof createContext !== 'function') {
      throw new Error('Loaded model does not expose createContext()');
    }
    context = await createContext.call(model);

    /**
     * Feature-flagged local inference branch.
     * This code path exists for opt-in deployments (`RERANKER_LOCAL=true`) so
     * local GGUF reranking can be exercised without changing the default
     * remote/fallback behavior for non-opted-in environments.
     *
     * [CHK-069] Quality comparison against Cohere/Voyage is deferred to
     * `tests/reranker-eval-comparison.vitest.ts`, where benchmark protocol and
     * remote-provider requirements are isolated from runtime code paths.
     */
    const reranked = await Promise.race([
      (async (): Promise<T[]> => {
        // Sequential scoring instead of Promise.all to avoid
        // Allocating multiple sequence states simultaneously in VRAM, which
        // Can trigger OOM or context mixing on local LLM inference.
        // PERF(CHK-113): Sequential per-candidate inference. For 20 candidates, latency depends on
        // Model size and hardware. On Apple Silicon with small GGUF (~100MB), expect 200-400ms.
        // Future optimization: batch inference via node-llama-cpp's evaluateBatch API.
        const scored: Array<{ candidate: T; rerankScore: number }> = [];
        for (const candidate of rerankCandidates.slice(0, rerankCount)) {
          const content = resolveRowText(candidate);
          const prompt = `query: ${query}\ndocument: ${content}`;
          // Truncate by character count after converting from bytes to avoid
          // Splitting multi-byte UTF-8 sequences (which produces replacement chars).
          let boundedPrompt = prompt;
          if (Buffer.byteLength(prompt, 'utf8') > MAX_PROMPT_BYTES) {
            const buf = Buffer.from(prompt, 'utf8');
            let end = MAX_PROMPT_BYTES;
            // Walk back to a valid UTF-8 boundary (continuation bytes start with 10xxxxxx).
            while (end > 0 && (buf[end] & 0xC0) === 0x80) { end -= 1; }
            boundedPrompt = buf.subarray(0, end).toString('utf8');
          }
          const rerankScore = await scorePrompt(context, boundedPrompt);
          scored.push({ candidate, rerankScore });
        }

        scored.sort((a, b) => b.rerankScore - a.rerankScore);
        const rerankedTop = scored.map((entry) => ({
          ...entry.candidate,
          rerankerScore: entry.rerankScore,
          score: entry.rerankScore,
        }));
        const remainder = candidates.slice(rerankCount);
        const elapsed = Date.now() - startedAt;
        console.error(
          `[local-reranker] reranked=${rerankCount} total=${candidates.length} durationMs=${elapsed} model=${path.basename(modelPath)}`
        );
        return [...rerankedTop, ...remainder];
      })(),
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`local reranker timed out after ${RERANKER_TIMEOUT_MS}ms`));
        }, RERANKER_TIMEOUT_MS);
      }),
    ]);
    return reranked;
  } catch (error: unknown) {
    console.warn(`[local-reranker] fallback to original ordering: ${toErrorMessage(error)}`);
    return candidates;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const dispose = (context as { dispose?: () => Promise<void> | void } | null)?.dispose;
    if (typeof dispose === 'function') {
      try {
        await dispose.call(context);
      } catch (_error: unknown) {
        // Non-fatal cleanup
      }
    }
  }
}

export async function disposeLocalReranker(): Promise<void> {
  // If modelLoadPromise is pending when shutdown triggers,
  // The model could resolve after dispose, leaving it orphaned. Chain cleanup.
  const pending = modelLoadPromise;
  if (pending) {
    modelLoadPromise = null;
    try {
      const resolved = await pending;
      const disposable = resolved as { dispose?: () => Promise<void> | void } | null;
      if (disposable && typeof disposable.dispose === 'function') {
        await disposable.dispose();
      }
    } catch (_error: unknown) {
      // Model failed to load — nothing to dispose.
    }
  }

  const model = cachedModel as { dispose?: () => Promise<void> | void } | null;
  if (model && typeof model.dispose === 'function') {
    try {
      await model.dispose();
    } catch (_error: unknown) {
      // Non-fatal cleanup
    }
  }
  cachedLlama = null;
  cachedModel = null;
  cachedModelPath = null;
  modelLoadPromisePath = null;
}

/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

export const __testables = {
  resolveModelPath,
  resolveRowText,
  extractNumericScore,
  normalizeScore,
  scorePrompt,
};
