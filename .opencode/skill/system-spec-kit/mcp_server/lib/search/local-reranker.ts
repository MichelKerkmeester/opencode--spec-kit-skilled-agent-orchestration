// ---------------------------------------------------------------
// MODULE: Local GGUF Reranker (node-llama-cpp)
// ---------------------------------------------------------------
// Optional local reranker for Stage 3. This module is fully gated by
// RERANKER_LOCAL and gracefully degrades to unchanged ordering on any
// precondition or runtime failure.

import os from 'os';
import path from 'path';
import { access } from 'fs/promises';
import { toErrorMessage } from '../../utils';

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

const MIN_FREE_MEMORY_BYTES = 4 * 1024 * 1024 * 1024;
// Lower threshold when custom model is configured — still prevents OOM on
// truly memory-starved machines without blocking intentional overrides.
const MIN_FREE_MEMORY_CUSTOM_BYTES = 512 * 1024 * 1024;
const DEFAULT_MODEL_RELATIVE_PATH = path.join('models', 'bge-reranker-v2-m3.Q4_K_M.gguf');

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
  if (cachedModel && cachedModelPath === modelPath) {
    return cachedModel;
  }

  // Codex fix: If the model path changed since the last load, discard the
  // stale promise so a fresh load is initiated for the new path.
  if (modelLoadPromise && modelLoadPromisePath !== modelPath) {
    modelLoadPromise = null;
    modelLoadPromisePath = null;
  }

  if (!modelLoadPromise) {
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
  }

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
  if (Array.isArray(value)) {
    const numeric = value.filter((item): item is number => typeof item === 'number' && Number.isFinite(item));
    if (numeric.length === 0) return null;
    return numeric.reduce((sum, n) => sum + n, 0) / numeric.length;
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const directKeys = ['score', 'relevance', 'relevanceScore', 'similarity', 'logit'];
    for (const key of directKeys) {
      const extracted = extractNumericScore(record[key]);
      if (extracted !== null) return extracted;
    }
    if (record['embedding'] !== undefined) {
      const embeddingScore = extractNumericScore(record['embedding']);
      if (embeddingScore !== null) return embeddingScore;
    }
  }
  return null;
}

async function scorePrompt(context: unknown, prompt: string): Promise<number> {
  if (!context || typeof context !== 'object') {
    throw new Error('Invalid llama context');
  }

  const directFns = ['score', 'getScore', 'embed', 'encode', 'evaluate', 'eval'] as const;
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

export async function canUseLocalReranker(): Promise<boolean> {
  if (process.env.RERANKER_LOCAL !== 'true') {
    return false;
  }

  // Sprint 9 fix: Bypass freemem check when user explicitly configured a custom
  // model path, as this indicates intentional override. On macOS/Linux, os.freemem()
  // is unreliable because the OS uses free RAM for disk caching, reporting
  // deceptively low values on healthy machines.
  const hasCustomModel = Boolean(process.env.SPECKIT_RERANKER_MODEL?.trim());
  const memThreshold = hasCustomModel ? MIN_FREE_MEMORY_CUSTOM_BYTES : MIN_FREE_MEMORY_BYTES;
  if (os.freemem() < memThreshold) {
    return false;
  }

  const modelPath = resolveModelPath();
  try {
    await access(modelPath);
    return true;
  } catch {
    return false;
  }
}

export async function rerankLocal<T extends LocalRerankRow>(
  query: string,
  candidates: T[],
  topK: number
): Promise<T[]> {
  if (!Array.isArray(candidates) || candidates.length < 2) {
    return candidates;
  }

  const localEnabled = await canUseLocalReranker();
  if (!localEnabled) {
    return candidates;
  }

  const modelPath = resolveModelPath();
  const rerankCount = Math.max(1, Math.min(topK, candidates.length));
  const startedAt = Date.now();

  let context: unknown | null = null;
  try {
    const model = await ensureModelLoaded(modelPath);
    const createContext = (model as { createContext?: () => Promise<unknown> }).createContext;
    if (typeof createContext !== 'function') {
      throw new Error('Loaded model does not expose createContext()');
    }
    context = await createContext.call(model);

    // Sprint 9 fix: Sequential scoring instead of Promise.all to avoid
    // allocating multiple sequence states simultaneously in VRAM, which
    // can trigger OOM or context mixing on local LLM inference.
    const scored: Array<{ candidate: T; rerankScore: number }> = [];
    for (const candidate of candidates.slice(0, rerankCount)) {
      const content = resolveRowText(candidate);
      const prompt = `query: ${query}\ndocument: ${content}`;
      const rerankScore = await scorePrompt(context, prompt);
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
    console.log(
      `[local-reranker] reranked=${rerankCount} total=${candidates.length} durationMs=${elapsed} model=${modelPath}`
    );
    return [...rerankedTop, ...remainder];
  } catch (error: unknown) {
    console.warn(`[local-reranker] fallback to original ordering: ${toErrorMessage(error)}`);
    return candidates;
  } finally {
    const dispose = (context as { dispose?: () => Promise<void> | void } | null)?.dispose;
    if (typeof dispose === 'function') {
      try {
        await dispose.call(context);
      } catch {
        // non-fatal cleanup
      }
    }
  }
}

export async function disposeLocalReranker(): Promise<void> {
  // Sprint 9 fix: If modelLoadPromise is pending when shutdown triggers,
  // the model could resolve after dispose, leaving it orphaned. Chain cleanup.
  const pending = modelLoadPromise;
  if (pending) {
    modelLoadPromise = null;
    try {
      const resolved = await pending;
      const disposable = resolved as { dispose?: () => Promise<void> | void } | null;
      if (disposable && typeof disposable.dispose === 'function') {
        await disposable.dispose();
      }
    } catch {
      // Model failed to load — nothing to dispose.
    }
  }

  const model = cachedModel as { dispose?: () => Promise<void> | void } | null;
  if (model && typeof model.dispose === 'function') {
    try {
      await model.dispose();
    } catch {
      // non-fatal cleanup
    }
  }
  cachedLlama = null;
  cachedModel = null;
  cachedModelPath = null;
  modelLoadPromisePath = null;
}

export const __testables = {
  resolveModelPath,
  resolveRowText,
  extractNumericScore,
  normalizeScore,
};
