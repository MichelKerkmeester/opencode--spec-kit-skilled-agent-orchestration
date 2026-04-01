// ---------------------------------------------------------------
// MODULE: Embeddings
// ---------------------------------------------------------------
// Feature catalog: Hybrid search pipeline

// Node stdlib
import crypto from 'crypto';

// Internal modules
import {
  createEmbeddingsProvider,
  getProviderInfo,
  getStartupEmbeddingDimension,
  validateApiKey,
  VALIDATION_TIMEOUT_MS,
} from './embeddings/factory.js';
import { semanticChunk, MAX_TEXT_LENGTH, RESERVED_OVERVIEW, RESERVED_OUTCOME, MIN_SECTION_LENGTH } from './chunking.js';
import type {
  IEmbeddingProvider,
  EmbeddingCacheStats,
  LazyLoadingStats,
  BatchEmbeddingOptions,
  ProviderMetadata,
  ProviderInfo,
  ApiKeyValidationResult,
  TaskPrefixMap,
  TaskType,
  EmbeddingProfileData,
} from './types.js';

export interface WeightedDocumentSections {
  title?: string | null;
  decisions?: string[];
  outcomes?: string[];
  general?: string | null;
}

// ---------------------------------------------------------------
// EMBEDDING CIRCUIT BREAKER
// ---------------------------------------------------------------
// Mirrors the cross-encoder circuit breaker pattern (cross-encoder.ts).
// After EMBEDDING_CB_THRESHOLD consecutive failures the circuit opens
// and embedding calls return null immediately for EMBEDDING_CB_COOLDOWN_MS,
// letting the search pipeline fall back to keyword/BM25 channels.

/** Master kill-switch: set SPECKIT_EMBEDDING_CIRCUIT_BREAKER=false to disable. */
function isEmbeddingCircuitBreakerEnabled(): boolean {
  const v = process.env.SPECKIT_EMBEDDING_CIRCUIT_BREAKER?.toLowerCase().trim();
  if (v === 'false' || v === '0') return false;
  return true; // default ON
}

const EMBEDDING_CB_THRESHOLD: number =
  Math.max(1, parseInt(process.env.SPECKIT_EMBEDDING_CB_THRESHOLD || '', 10) || 3);

const EMBEDDING_CB_COOLDOWN_MS: number =
  Math.max(1000, parseInt(process.env.SPECKIT_EMBEDDING_CB_COOLDOWN_MS || '', 10) || 60_000);

interface EmbeddingCircuitState {
  failures: number;
  openedAt: number | null;
}

const embeddingCircuit: EmbeddingCircuitState = { failures: 0, openedAt: null };

function isEmbeddingCircuitOpen(): boolean {
  if (!isEmbeddingCircuitBreakerEnabled()) return false;
  if (embeddingCircuit.openedAt === null) return false;
  if (Date.now() - embeddingCircuit.openedAt >= EMBEDDING_CB_COOLDOWN_MS) {
    // Cooldown elapsed — half-open: allow one attempt
    console.warn(
      `[embeddings] Circuit breaker HALF-OPEN — cooldown elapsed (${EMBEDDING_CB_COOLDOWN_MS}ms). Allowing probe request.`
    );
    embeddingCircuit.openedAt = null;
    embeddingCircuit.failures = 0;
    return false;
  }
  return true;
}

function recordEmbeddingSuccess(): void {
  if (embeddingCircuit.failures > 0 || embeddingCircuit.openedAt !== null) {
    console.warn('[embeddings] Circuit breaker CLOSED — embedding call succeeded.');
  }
  embeddingCircuit.failures = 0;
  embeddingCircuit.openedAt = null;
}

function recordEmbeddingFailure(): void {
  if (!isEmbeddingCircuitBreakerEnabled()) return;
  embeddingCircuit.failures++;
  if (embeddingCircuit.failures >= EMBEDDING_CB_THRESHOLD && embeddingCircuit.openedAt === null) {
    embeddingCircuit.openedAt = Date.now();
    console.warn(
      `[embeddings] Circuit breaker OPEN after ${embeddingCircuit.failures} consecutive failures. ` +
      `Cooldown: ${EMBEDDING_CB_COOLDOWN_MS}ms. Embedding calls will return null (keyword/BM25 fallback).`
    );
  }
}

// ---------------------------------------------------------------
// 1. EMBEDDING CACHE
// ---------------------------------------------------------------

const EMBEDDING_CACHE_MAX_SIZE: number = 1000;
const embeddingCache: Map<string, Float32Array> = new Map();

// ---------------------------------------------------------------
// RATE LIMITING CONFIGURATION
// ---------------------------------------------------------------

/**
 * Delay between batch embedding requests (ms).
 * Prevents overwhelming external embedding providers (Voyage, OpenAI).
 * Configurable via EMBEDDING_BATCH_DELAY_MS environment variable.
 * Default: 100ms (allows ~10 requests/second, well under typical rate limits)
 */
const BATCH_DELAY_MS: number = parseInt(process.env.EMBEDDING_BATCH_DELAY_MS || '', 10) || 100;

/**
 * Sleep helper for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface ErrorWithStatus {
  status?: number;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return undefined;
  }

  const status = Reflect.get(error, 'status');
  return typeof status === 'number' ? status : undefined;
}

function normalizeWeightedSectionText(text: string | null | undefined): string {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function trimToWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  if (maxLength <= MIN_SECTION_LENGTH) {
    return '';
  }

  const hardTrimmed = text.slice(0, maxLength).trimEnd();
  const lastWhitespace = Math.max(
    hardTrimmed.lastIndexOf(' '),
    hardTrimmed.lastIndexOf('\n')
  );

  if (lastWhitespace >= Math.floor(maxLength * 0.6)) {
    return hardTrimmed.slice(0, lastWhitespace).trimEnd();
  }

  return hardTrimmed;
}

function buildWeightedSectionBlock(entries: string[], multiplier: number): string {
  if (entries.length === 0 || multiplier <= 0) {
    return '';
  }

  const weightedEntries: string[] = [];
  for (const entry of entries) {
    for (let index = 0; index < multiplier; index++) {
      weightedEntries.push(entry);
    }
  }

  return weightedEntries.join('\n\n');
}

function trimWeightedBlock(block: string, overflow: number): string {
  if (!block || overflow <= 0) {
    return block;
  }

  const nextLength = Math.max(0, block.length - overflow);
  return trimToWordBoundary(block, nextLength);
}

function joinWeightedBlocks(blocks: string[]): string {
  return blocks.filter(Boolean).join('\n\n').trim();
}

function prepareWeightedEntries(entries: string[] | null | undefined): string[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry) => normalizeWeightedSectionText(entry))
    .filter(Boolean);
}

function buildGeneralWeightedBlock(sections: WeightedDocumentSections): string {
  const general = normalizeWeightedSectionText(sections.general);
  return general;
}

function buildDecisionWeightedBlock(sections: WeightedDocumentSections): string {
  return buildWeightedSectionBlock(prepareWeightedEntries(sections.decisions), 3);
}

function buildOutcomeWeightedBlock(sections: WeightedDocumentSections): string {
  return buildWeightedSectionBlock(prepareWeightedEntries(sections.outcomes), 2);
}

function buildTitleWeightedBlock(sections: WeightedDocumentSections): string {
  return normalizeWeightedSectionText(sections.title);
}

function truncateWeightedBlocksToBudget(
  blocks: { title: string; decisions: string; outcomes: string; general: string },
  maxLength: number,
): { title: string; decisions: string; outcomes: string; general: string } {
  let nextBlocks = { ...blocks };
  let combined = joinWeightedBlocks([
    nextBlocks.title,
    nextBlocks.decisions,
    nextBlocks.outcomes,
    nextBlocks.general,
  ]);

  if (combined.length <= maxLength) {
    return nextBlocks;
  }

  let overflow = combined.length - maxLength;
  nextBlocks.general = trimWeightedBlock(nextBlocks.general, overflow);
  combined = joinWeightedBlocks([nextBlocks.title, nextBlocks.decisions, nextBlocks.outcomes, nextBlocks.general]);

  if (combined.length <= maxLength) {
    return nextBlocks;
  }

  overflow = combined.length - maxLength;
  nextBlocks.outcomes = trimWeightedBlock(nextBlocks.outcomes, overflow);
  combined = joinWeightedBlocks([nextBlocks.title, nextBlocks.decisions, nextBlocks.outcomes, nextBlocks.general]);

  if (combined.length <= maxLength) {
    return nextBlocks;
  }

  overflow = combined.length - maxLength;
  nextBlocks.decisions = trimWeightedBlock(nextBlocks.decisions, overflow);
  combined = joinWeightedBlocks([nextBlocks.title, nextBlocks.decisions, nextBlocks.outcomes, nextBlocks.general]);

  if (combined.length <= maxLength) {
    return nextBlocks;
  }

  overflow = combined.length - maxLength;
  nextBlocks.title = trimWeightedBlock(nextBlocks.title, overflow);
  return nextBlocks;
}

function buildWeightedDocumentText(
  sections: WeightedDocumentSections,
  maxLength: number = MAX_TEXT_LENGTH,
): string {
  const safeMaxLength = Number.isFinite(maxLength) && maxLength > 0 ? Math.floor(maxLength) : MAX_TEXT_LENGTH;
  const blocks = truncateWeightedBlocksToBudget({
    title: buildTitleWeightedBlock(sections),
    decisions: buildDecisionWeightedBlock(sections),
    outcomes: buildOutcomeWeightedBlock(sections),
    general: buildGeneralWeightedBlock(sections),
  }, safeMaxLength);

  return joinWeightedBlocks([blocks.title, blocks.decisions, blocks.outcomes, blocks.general]);
}

/**
 * Generate SHA256 hash key for cache lookup.
 * Uses 32 hex chars (128 bits) for cache keys.
 * Keys are scoped by provider name to prevent cross-provider cache hits
 * (different providers produce different-dimension embeddings).
 *
 * Collision Analysis:
 * - 32 hex chars = 128 bits = 2^128 possible values
 * - With 1000 cache entries, birthday paradox collision probability ~ 0
 * - Even with 10^18 entries, collision probability < 10^-20
 */
function getCacheKey(text: string): string {
  const providerName = providerInstance ? providerInstance.getMetadata().provider : 'unknown';
  return crypto.createHash('sha256').update(`${providerName}:${text}`).digest('hex').substring(0, 32);
}

/** Get cached embedding or null */
function getCachedEmbedding(text: string): Float32Array | null {
  const key = getCacheKey(text);
  const cached = embeddingCache.get(key);
  if (cached) {
    embeddingCache.delete(key);
    embeddingCache.set(key, cached);
    return cached;
  }
  return null;
}

/** Store embedding in cache with LRU eviction */
function cacheEmbedding(text: string, embedding: Float32Array): void {
  const key = getCacheKey(text);
  if (embeddingCache.size >= EMBEDDING_CACHE_MAX_SIZE) {
    const firstKey = embeddingCache.keys().next().value;
    if (firstKey !== undefined) {
      embeddingCache.delete(firstKey);
    }
  }
  embeddingCache.set(key, embedding);
}

function clearEmbeddingCache(): void {
  embeddingCache.clear();
}

function getEmbeddingCacheStats(): EmbeddingCacheStats {
  return {
    size: embeddingCache.size,
    maxSize: EMBEDDING_CACHE_MAX_SIZE,
  };
}

// ---------------------------------------------------------------
// 2. LAZY SINGLETON PROVIDER INSTANCE
// ---------------------------------------------------------------

/**
 * LAZY SINGLETON PATTERN (REQ-003, T016-T019)
 *
 * The embedding provider is initialized lazily on first use to reduce
 * MCP startup time from 2-3s to <500ms.
 *
 * Initialization Flow:
 * 1. On first embedding request, get_provider() creates the instance
 * 2. Provider is created without warmup (warmup: false)
 * 3. First actual embedding call triggers model loading
 *
 * Environment Variables:
 * - SPECKIT_EAGER_WARMUP=true: Force eager loading at startup (legacy behavior)
 * - SPECKIT_LAZY_LOADING=false: Alias for SPECKIT_EAGER_WARMUP=true
 */

let providerInstance: IEmbeddingProvider | null = null;
let providerInitPromise: Promise<IEmbeddingProvider> | null = null;
let providerInitStartTime: number | null = null;
let providerInitCompleteTime: number | null = null;
let firstEmbeddingTime: number | null = null;

/**
 * Check if eager warmup is requested via environment variable.
 * Lazy loading is now the permanent default.
 * SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING env vars are inert.
 */
function shouldEagerWarmup(): boolean {
  return false;
}

/**
 * Get or create provider instance (lazy singleton).
 * T016: Provider is created on first call, not at module load time.
 * T017: Model initialization is deferred until first embedding request.
 */
async function getProvider(): Promise<IEmbeddingProvider> {
  if (providerInstance) {
    MODEL_NAME = getProviderModelName(providerInstance);
    return providerInstance;
  }

  if (providerInitPromise) {
    return providerInitPromise;
  }

  providerInitStartTime = Date.now();

  providerInitPromise = (async (): Promise<IEmbeddingProvider> => {
    try {
      providerInstance = await createEmbeddingsProvider({
        warmup: false, // T017: No warmup at creation; model loads on first embed call
      });
      MODEL_NAME = getProviderModelName(providerInstance);
      providerInitCompleteTime = Date.now();
      const initTime = providerInitCompleteTime - (providerInitStartTime as number);
      console.error(`[embeddings] Provider created lazily (${initTime}ms)`);
      return providerInstance;
    } catch (error: unknown) {
      if (error instanceof Error) {
        void error.message;
      }
      providerInitPromise = null;
      providerInitStartTime = null;
      throw error;
    }
  })();

  return providerInitPromise;
}

/**
 * Check if the provider is initialized without triggering initialization.
 * Useful for status checks that shouldn't cause side effects.
 */
function isProviderInitialized(): boolean {
  return providerInstance !== null;
}

/**
 * Get lazy loading statistics for diagnostics.
 */
function getLazyLoadingStats(): LazyLoadingStats {
  return {
    isInitialized: providerInstance !== null,
    isInitializing: providerInitPromise !== null && providerInstance === null,
    eagerWarmupEnabled: shouldEagerWarmup(),
    initStartTime: providerInitStartTime,
    initCompleteTime: providerInitCompleteTime,
    initDurationMs: providerInitCompleteTime && providerInitStartTime
      ? providerInitCompleteTime - providerInitStartTime
      : null,
    firstEmbeddingTime: firstEmbeddingTime,
    timeToFirstEmbeddingMs: firstEmbeddingTime && providerInitStartTime
      ? firstEmbeddingTime - providerInitStartTime
      : null,
  };
}

// ---------------------------------------------------------------
// 3. CORE EMBEDDING GENERATION
// ---------------------------------------------------------------

/**
 * Generate embedding for text (low-level function).
 * T017: First call triggers lazy model initialization.
 * Circuit breaker: returns null immediately when the provider is failing.
 */
async function generateEmbedding(text: string): Promise<Float32Array | null> {
  if (!text || typeof text !== 'string') {
    console.warn('[embeddings] Empty or invalid text provided');
    return null;
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    console.warn('[embeddings] Empty text after trim');
    return null;
  }

  const cached = getCachedEmbedding(trimmedText);
  if (cached) {
    return cached;
  }

  // Circuit breaker: skip provider call when open
  if (isEmbeddingCircuitOpen()) {
    return null;
  }

  // T017: Track first embedding time for lazy loading diagnostics
  const isFirstEmbedding = !firstEmbeddingTime && !isProviderInitialized();

  try {
    const provider = await getProvider();

    // Record first embedding timestamp after provider init
    if (isFirstEmbedding && !firstEmbeddingTime) {
      firstEmbeddingTime = Date.now();
    }

    const maxLength = MAX_TEXT_LENGTH;
    let inputText = trimmedText;
    if (inputText.length > maxLength) {
      inputText = semanticChunk(trimmedText, maxLength);
    }

    const embedding = await provider.generateEmbedding(inputText);

    if (embedding) {
      recordEmbeddingSuccess();
      cacheEmbedding(trimmedText, embedding);
    }

    return embedding;
  } catch (error: unknown) {
    recordEmbeddingFailure();
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[embeddings] generateEmbedding failed: ${msg}`);
    return null;
  }
}

/** Generate embedding with timeout protection (default: 30s) */
async function generateEmbeddingWithTimeout(text: string, timeout: number = 30000): Promise<Float32Array | null> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Embedding generation timed out')), timeout);
  });

  return Promise.race([
    generateEmbedding(text),
    timeoutPromise,
  ]);
}

/**
 * Generate embeddings for batch of texts with parallel processing and rate limiting.
 *
 * Rate limiting prevents overwhelming external embedding providers (Voyage, OpenAI)
 * by adding a configurable delay between batch requests.
 * On 429 (rate limit) errors, implements exponential backoff before retrying the batch.
 */
async function generateBatchEmbeddings(
  texts: string[],
  concurrency: number = 5,
  options: BatchEmbeddingOptions = {}
): Promise<(Float32Array | null)[]> {
  if (!Array.isArray(texts)) {
    throw new TypeError('texts must be an array');
  }

  if (texts.length === 0) {
    return [];
  }

  // AI-FIX: F-26 — Validate concurrency to prevent infinite loop (i += 0 never exits)
  if (!Number.isFinite(concurrency) || concurrency < 1) {
    concurrency = 5;
  }

  const delayMs = options.delayMs ?? BATCH_DELAY_MS;
  const verbose = options.verbose ?? false;
  const totalBatches = Math.ceil(texts.length / concurrency);

  if (verbose && totalBatches > 1) {
    console.error(`[embeddings] Processing ${texts.length} texts in ${totalBatches} batches (delay: ${delayMs}ms)`);
  }

  let currentBackoff = 0; // Additional backoff from 429 responses
  const MAX_429_RETRIES = 3;
  const results: (Float32Array | null)[] = [];
  for (let i = 0; i < texts.length; i += concurrency) {
    const batchNum = Math.floor(i / concurrency) + 1;
    const batch = texts.slice(i, i + concurrency);

    // Apply any accumulated 429 backoff before this batch
    if (currentBackoff > 0) {
      if (verbose) {
        console.error(`[embeddings] Rate limit backoff: waiting ${currentBackoff}ms before batch ${batchNum}`);
      }
      await sleep(currentBackoff);
    }

    let batchResults: (Float32Array | null)[] | null = null;
    let retryCount = 0;

    while (batchResults === null && retryCount <= MAX_429_RETRIES) {
      try {
        batchResults = await Promise.all(
          batch.map(text => generateEmbedding(text))
        );
        // Success: decay backoff
        currentBackoff = Math.max(0, Math.floor(currentBackoff / 2));
      } catch (error: unknown) {
        if (error instanceof Error) {
          void error.message;
        }
        const errMsg = getErrorMessage(error);
        const errStatus = getErrorStatus(error);
        const is429 = errStatus === 429 || /429|rate limit|too many requests/i.test(errMsg);

        if (is429 && retryCount < MAX_429_RETRIES) {
          retryCount++;
          currentBackoff = Math.min(60000, (currentBackoff || 1000) * 2);
          console.warn(
            `[embeddings] Rate limited (429) on batch ${batchNum}, retry ${retryCount}/${MAX_429_RETRIES} after ${currentBackoff}ms`
          );
          await sleep(currentBackoff);
        } else {
          // Non-429 error or retries exhausted: push nulls for this batch
          console.error(`[embeddings] Batch ${batchNum} failed: ${errMsg}`);
          batchResults = batch.map(() => null);
        }
      }
    }

    results.push(...(batchResults || batch.map(() => null)));

    // Rate limiting: delay between batches (skip after last batch)
    const isLastBatch = i + concurrency >= texts.length;
    if (!isLastBatch && delayMs > 0) {
      if (verbose) {
        console.error(`[embeddings] Batch ${batchNum}/${totalBatches} complete, waiting ${delayMs}ms...`);
      }
      await sleep(delayMs);
    }
  }

  if (verbose && totalBatches > 1) {
    console.error(`[embeddings] All ${totalBatches} batches complete`);
  }

  return results;
}

// ---------------------------------------------------------------
// 4. TASK-SPECIFIC FUNCTIONS
// ---------------------------------------------------------------

/** Generate embedding for a document (for indexing/storage).
 * Circuit breaker: returns null immediately when the provider is failing. */
async function generateDocumentEmbedding(text: string): Promise<Float32Array | null> {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.warn('[embeddings] Empty document text');
    return null;
  }

  const trimmedText = text.trim();
  const cacheText = 'doc:' + trimmedText;
  const cached = getCachedEmbedding(cacheText);
  if (cached) {
    return cached;
  }

  // Circuit breaker: skip provider call when open
  if (isEmbeddingCircuitOpen()) {
    return null;
  }

  try {
    const provider = await getProvider();

    const maxLength = MAX_TEXT_LENGTH;
    let inputText = trimmedText;
    if (inputText.length > maxLength) {
      inputText = semanticChunk(trimmedText, maxLength);
    }

    const embedding = await provider.embedDocument(inputText);

    if (embedding) {
      recordEmbeddingSuccess();
      cacheEmbedding(cacheText, embedding);
    }

    return embedding;
  } catch (error: unknown) {
    recordEmbeddingFailure();
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[embeddings] generateDocumentEmbedding failed: ${msg}`);
    return null;
  }
}

/**
 * Generate embedding for a search query.
 * Circuit breaker: returns null immediately when the provider is failing.
 *
 * Note: Query embeddings ARE cached, but with lower priority than documents:
 * 1. Cache is checked first to avoid redundant API calls for repeated queries
 * 2. New query embeddings are only stored when cache is below 90% capacity
 * 3. This avoids query embeddings evicting more valuable document embeddings
 *
 * If your use case has high query volume, consider increasing EMBEDDING_CACHE_MAX_SIZE
 * or caching at the application layer with query-specific TTL.
 */
async function generateQueryEmbedding(query: string): Promise<Float32Array | null> {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[embeddings] Empty query');
    return null;
  }

  // Check cache for repeated queries (optional optimization)
  const trimmed = query.trim();
  const cacheKey = 'query:' + trimmed;
  const cached = getCachedEmbedding(cacheKey);
  if (cached) {
    return cached;
  }

  // Circuit breaker: skip provider call when open
  if (isEmbeddingCircuitOpen()) {
    return null;
  }

  try {
    const provider = await getProvider();
    const embedding = await provider.embedQuery(trimmed);

    // Reset circuit breaker unconditionally on success (even if cache is full)
    if (embedding) {
      recordEmbeddingSuccess();
    }

    // Cache query embeddings with lower priority (only if space available)
    if (embedding && embeddingCache.size < EMBEDDING_CACHE_MAX_SIZE * 0.9) {
      cacheEmbedding(cacheKey, embedding);
    }

    return embedding;
  } catch (error: unknown) {
    recordEmbeddingFailure();
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[embeddings] generateQueryEmbedding failed: ${msg}`);
    return null;
  }
}

/** Generate embedding for clustering task */
async function generateClusteringEmbedding(text: string): Promise<Float32Array | null> {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }
  return await generateDocumentEmbedding(text);
}

// ---------------------------------------------------------------
// 5. UTILITY FUNCTIONS
// ---------------------------------------------------------------

/**
 * Get embedding dimension
 * Priority: 1) Initialized provider, 2) Environment detection, 3) Legacy default (768)
 */
function getEmbeddingDimension(): number {
  if (providerInstance) {
    return providerInstance.getProfile().dim;
  }

  return getStartupEmbeddingDimension();
}

function getModelName(): string {
  if (providerInstance) {
    return getProviderModelName(providerInstance);
  }

  return detectConfiguredModelName();
}

function detectConfiguredModelName(): string {
  const providerInfo = getProviderInfo();
  const effectiveProvider = providerInfo.effectiveProvider || providerInfo.provider;
  switch (effectiveProvider) {
    case 'voyage':
      return providerInfo.config.VOYAGE_EMBEDDINGS_MODEL
        || (process.env.VOYAGE_API_KEY ? 'voyage-4' : DEFAULT_MODEL_NAME);
    case 'openai':
      return providerInfo.config.OPENAI_EMBEDDINGS_MODEL
        || (process.env.OPENAI_API_KEY ? 'text-embedding-3-small' : DEFAULT_MODEL_NAME);
    case 'hf-local':
    default:
      return providerInfo.config.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL_NAME;
  }
}

function getProviderModelName(provider: IEmbeddingProvider): string {
  const profile = provider.getProfile();
  if (profile && typeof profile.model === 'string' && profile.model.trim().length > 0) {
    return profile.model;
  }

  const metadata = provider.getMetadata();
  if (metadata && typeof metadata.model === 'string' && metadata.model.trim().length > 0) {
    return metadata.model;
  }

  return detectConfiguredModelName();
}

function isModelLoaded(): boolean {
  return providerInstance !== null;
}

function getModelLoadTime(): number | null {
  if (providerInstance) {
    const metadata = providerInstance.getMetadata();
    return metadata.loadTimeMs || null;
  }
  return null;
}

function getCurrentDevice(): string | null {
  if (providerInstance) {
    const metadata = providerInstance.getMetadata();
    return metadata.device || null;
  }
  return null;
}

function getOptimalDevice(): string {
  return process.platform === 'darwin' ? 'mps' : 'cpu';
}

function getTaskPrefix(task: TaskType | string): string {
  const prefixes: Record<string, string> = {
    document: 'search_document: ',
    query: 'search_query: ',
    clustering: 'clustering: ',
    classification: 'classification: ',
  };
  return prefixes[task] || '';
}

/** Pre-warm the model for faster first embedding */
async function preWarmModel(): Promise<boolean> {
  try {
    const provider = await getProvider();
    await provider.warmup();
    console.error('[embeddings] Provider warmed up successfully');
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      void error.message;
    }
    console.error('[embeddings] Pre-warmup failed:', getErrorMessage(error));
    return false;
  }
}

/** Get current embedding profile (sync - returns null if not initialized) */
function getEmbeddingProfile(): EmbeddingProfileData | ReturnType<IEmbeddingProvider['getProfile']> | null {
  if (providerInstance) {
    return providerInstance.getProfile();
  }
  return null;
}

/** Get embedding profile with initialization guarantee (async) */
async function getEmbeddingProfileAsync(): Promise<EmbeddingProfileData | ReturnType<IEmbeddingProvider['getProfile']>> {
  const provider = await getProvider();
  return provider.getProfile();
}

function getProviderMetadata(): ProviderMetadata | ProviderInfo {
  if (providerInstance) {
    return providerInstance.getMetadata();
  }
  return getProviderInfo();
}

// ---------------------------------------------------------------
// 6. CONSTANTS
// ---------------------------------------------------------------

const EMBEDDING_DIM: number = 768;
const EMBEDDING_TIMEOUT: number = 30000;
// MAX_TEXT_LENGTH is imported from chunking.ts (single source of truth)
// DEFAULT_MODEL_NAME is the fallback; use get_model_name() for the actual active model
export const DEFAULT_MODEL_NAME: string = 'nomic-ai/nomic-embed-text-v1.5';
// Legacy alias for backwards compatibility
export let MODEL_NAME: string = detectConfiguredModelName();
const BATCH_RATE_LIMIT_DELAY: number = BATCH_DELAY_MS; // Alias for export

const TASK_PREFIX: TaskPrefixMap = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: ',
};

// ---------------------------------------------------------------
// 7. MODULE EXPORTS
// ---------------------------------------------------------------

export {
  // Core embedding generation
  generateEmbedding,
  generateEmbeddingWithTimeout,
  generateBatchEmbeddings,
  generateDocumentEmbedding,
  generateQueryEmbedding,
  generateClusteringEmbedding,
  buildWeightedDocumentText,
  // Re-exported from chunking
  semanticChunk,
  // Utility functions
  getEmbeddingDimension,
  getModelName,
  isModelLoaded,
  getModelLoadTime,
  getCurrentDevice,
  getOptimalDevice,
  getTaskPrefix,
  preWarmModel,
  getEmbeddingProfile,
  getEmbeddingProfileAsync,
  getProviderMetadata,
  clearEmbeddingCache,
  getEmbeddingCacheStats,
  // T016-T019: Lazy loading exports
  isProviderInitialized,
  shouldEagerWarmup,
  getLazyLoadingStats,
  // T087-T090: Pre-flight API key validation (REQ-029)
  validateApiKey,
  VALIDATION_TIMEOUT_MS,
  // Constants
  EMBEDDING_DIM,
  EMBEDDING_TIMEOUT,
  MAX_TEXT_LENGTH,
  TASK_PREFIX,
  BATCH_DELAY_MS,
  BATCH_RATE_LIMIT_DELAY,
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH,
};

/**
 * Internal embedding circuit breaker functions exposed for unit testing.
 * Not intended for production use outside the test harness.
 */
export const __embeddingCircuitTestables = {
  embeddingCircuit,
  isEmbeddingCircuitOpen,
  isEmbeddingCircuitBreakerEnabled,
  recordEmbeddingSuccess,
  recordEmbeddingFailure,
  EMBEDDING_CB_THRESHOLD,
  EMBEDDING_CB_COOLDOWN_MS,
};
