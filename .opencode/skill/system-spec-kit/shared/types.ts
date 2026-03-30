// ---------------------------------------------------------------
// MODULE: Types
// ---------------------------------------------------------------
// Single source of truth for cross-workspace types.
// Used across shared/, mcp_server/, and scripts/.
//
// DB normalization types (MemoryDbRow, Memory, conversion fns)
// live in ./normalization.ts — import from there for DB ↔ App
// conversions.
// ---------------------------------------------------------------

// Import normalization types for local use (Memory used in IVectorStore.get)
// and re-export so consumers can import from here
import type { MemoryDbRow, Memory } from './normalization.js';
export type { MemoryDbRow, Memory };
export { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from './normalization.js';

// ---------------------------------------------------------------
// 1. EMBEDDING TYPES
// ---------------------------------------------------------------

/** Embedding profile descriptor (provider + model + dimension) */
export interface EmbeddingProfileData {
  provider: string;
  model: string;
  dim: number;
  baseUrl?: string | null;
  slug?: string;
}

/**
 * Canonical embedding profile — minimal shape used across handlers.
 * Prefer this over re-declaring { provider, model, dim } locally.
 */
export interface EmbeddingProfile {
  provider: string;
  model: string;
  dim: number;
}

/**
 * Extended embedding profile with database path resolution.
 * Used by handlers that need to resolve DB paths from profile info.
 */
export interface EmbeddingProfileExtended extends EmbeddingProfile {
  getDatabasePath: (basePath: string) => string | null;
}

/** Interface for all embedding providers (HfLocal, OpenAI, Voyage) */
export interface IEmbeddingProvider {
  generateEmbedding(text: string): Promise<Float32Array | null>;
  embedDocument(text: string): Promise<Float32Array | null>;
  embedQuery(text: string): Promise<Float32Array | null>;
  warmup(): Promise<boolean>;
  getMetadata(): ProviderMetadata;
  getProfile(): EmbeddingProfileData | { provider: string; model: string; dim: number; baseUrl?: string | null; slug: string };
  healthCheck(): Promise<boolean>;
  getProviderName(): string;
}

/** Provider metadata returned by getMetadata() */
export interface ProviderMetadata {
  provider: string;
  model: string;
  dim: number;
  healthy: boolean;
  device?: string | null;
  loaded?: boolean;
  loadTimeMs?: number | null;
  baseUrl?: string;
  requestCount?: number;
  totalTokens?: number;
}

/** Usage statistics for API-based providers (OpenAI, Voyage) */
export interface UsageStats {
  requestCount: number;
  totalTokens: number;
  estimatedCost: number;
}

/** Provider info returned by getProviderInfo() without creating the provider */
export interface ProviderInfo {
  provider: string;
  reason: string;
  config: Record<string, string>;
}

/** Resolution result from resolveProvider() */
export interface ProviderResolution {
  name: string;
  reason: string;
}

/** Options for createEmbeddingsProvider() */
export interface CreateProviderOptions {
  provider?: string;
  model?: string;
  dim?: number;
  apiKey?: string;
  warmup?: boolean;
  baseUrl?: string;
  maxTextLength?: number;
  timeout?: number;
}

/** API key validation result */
export interface ApiKeyValidationResult {
  valid: boolean;
  provider: string;
  reason?: string;
  error?: string;
  errorCode?: string;
  httpStatus?: number;
  warning?: string;
  actions?: string[];
  networkError?: boolean;
}

/** Embedding cache statistics */
export interface EmbeddingCacheStats {
  size: number;
  maxSize: number;
}

/** Lazy loading statistics for diagnostics */
export interface LazyLoadingStats {
  isInitialized: boolean;
  isInitializing: boolean;
  eagerWarmupEnabled: boolean;
  initStartTime: number | null;
  initCompleteTime: number | null;
  initDurationMs: number | null;
  firstEmbeddingTime: number | null;
  timeToFirstEmbeddingMs: number | null;
}

/** Batch embedding options */
export interface BatchEmbeddingOptions {
  delayMs?: number;
  verbose?: boolean;
}

/** Model dimensions lookup for API providers */
export type ModelDimensions = Record<string, number>;

// ---------------------------------------------------------------
// 2. DATABASE INTERFACE TYPES
// ---------------------------------------------------------------

/** Prepared statement interface (structural supertype of better-sqlite3 Statement) */
export interface PreparedStatement {
  all(...params: unknown[]): unknown[];
  get(...params: unknown[]): unknown | undefined;
  run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
}

/**
 * Canonical Database interface — structural subset of better-sqlite3.
 * Use this for modules that need basic query operations without
 * depending on better-sqlite3 types directly.
 *
 * Files that already `import type Database from 'better-sqlite3'`
 * are fine — the real type is a superset of this interface.
 */
export interface Database {
  prepare(sql: string): PreparedStatement;
}

/**
 * Extended Database interface with transaction and exec support.
 * Use this when a module needs DDL execution or transactions.
 */
export interface DatabaseExtended extends Database {
  transaction<T>(fn: () => T): () => T;
  exec(sql: string): void;
}

// ---------------------------------------------------------------
// 3. VECTOR STORE TYPES
// ---------------------------------------------------------------

/** Search options for vector store queries */
export interface SearchOptions {
  limit?: number;
  threshold?: number;
  filters?: Record<string, unknown>;
  anchors?: string[];
}

/**
 * Canonical search result — unified across all search paths.
 * This replaces the prior incompatible SearchResult definitions:
 *   - shared/types.ts (had id: string, score, metadata)
 *   - memory-search.ts (had id: number, similarity)
 *
 * All search code should use this single type.
 */
export interface SearchResult {
  /** DB primary key (always number) */
  id: number;
  /**
   * Normalized relevance score (0-1). Semantics depend on `scoringMethod`:
   * - `'vector'` — cosine similarity between query and memory embeddings
   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized to 0-1)
   * - `'hybrid'` — weighted combination of vector + lexical scores
   * - `'rrf'` — Reciprocal Rank Fusion across multiple retrieval methods
   * - `'cross-encoder'` — reranker model relevance
   * - `'fallback'` — best-effort score from degraded search path
   */
  score: number;
  /**
   * Disambiguates `.score` semantics. Indicates which scoring algorithm
   * produced the `score` value. One of: `'vector'`, `'bm25'`, `'hybrid'`,
   * `'rrf'`, `'cross-encoder'`, `'fallback'`.
   */
  scoringMethod?: 'vector' | 'bm25' | 'hybrid' | 'rrf' | 'cross-encoder' | 'fallback';
  /** Memory content (when include_content is true) */
  content?: string;
  /** Memory title */
  title?: string | null;
  /** Importance tier */
  tier?: string;
  /** Spec folder path */
  specFolder?: string;
  /** Memory file path */
  filePath?: string;
  /** Trigger phrases */
  triggerPhrases?: string[];
  /** Whether this is a constitutional memory */
  isConstitutional?: boolean;
  /** Additional metadata for extensibility */
  metadata?: Record<string, unknown>;
}

/** Vector store statistics */
export interface StoreStats {
  totalMemories: number;
  totalEmbeddings: number;
  dimensions: number;
}

/** Interface for vector store implementations */
export interface IVectorStore {
  search(embedding: number[], options?: SearchOptions): Promise<SearchResult[]>;
  upsert(id: number | string, embedding: number[], metadata: Record<string, unknown>): Promise<void>;
  delete(id: number | string): Promise<boolean>;
  get(id: number | string): Promise<Memory | null>;
  getStats(): Promise<StoreStats>;
  isAvailable(): boolean;
  getEmbeddingDimension?(): number;
  close(): void;
}

// ---------------------------------------------------------------
// 3. RETRY / ERROR CLASSIFICATION TYPES
// ---------------------------------------------------------------

/** Configuration for retry with exponential backoff */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
}

/** Error classification result */
export interface ErrorClassification {
  type: 'transient' | 'permanent' | 'unknown';
  reason: string;
  shouldRetry: boolean;
}

/** Options for retryWithBackoff() */
export interface RetryOptions {
  operationName?: string;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  exponentialBase?: number;
  onRetry?: ((attempt: number, error: Error, delay: number) => void | Promise<void>) | null;
  shouldRetry?: ((error: Error, attempt: number, classification: ErrorClassification) => boolean) | null;
}

/** Attempt log entry for retry diagnostics */
export interface RetryAttemptLogEntry {
  attempt: number;
  success: boolean;
  isRetry: boolean;
  errorType?: string;
  errorMessage?: string;
  classificationReason?: string;
  timestamp: string;
}

// ---------------------------------------------------------------
// 4. FOLDER SCORING TYPES
// ---------------------------------------------------------------

/** Archive pattern with multiplier for folder scoring */
export interface ArchivePattern {
  pattern: RegExp;
  multiplier: number;
  type: string;
}

/** Composite folder score with component breakdowns */
export interface FolderScore {
  folder: string;
  simplified: string;
  count: number;
  /** Composite folder relevance score (0-1), weighted combination of component scores. */
  score: number;
  /** How recently the folder was active (0-1). Higher = more recent activity. */
  recencyScore: number;
  /** Based on highest importance tier in folder (0-1). Maps tier rank to normalized weight. */
  importanceScore: number;
  /** Memory count and activity level (0-1). Reflects folder density and engagement. */
  activityScore: number;
  /** User validation feedback ratio (0-1). Proportion of positive validations. */
  validationScore: number;
  lastActivity: string;
  isArchived: boolean;
  topTier: string;
  [key: string]: unknown;
}

/** Options for computeFolderScores() */
export interface FolderScoreOptions {
  excludePatterns?: string[];
  includeArchived?: boolean;
  limit?: number;
}

/** Score weights for folder composite scoring */
export interface ScoreWeights {
  recency: number;
  importance: number;
  activity: number;
  validation: number;
}

/** Tier weights mapping tier names to numeric weights */
export type TierWeights = Record<string, number>;

/** Ranking mode for folder results */
export type RankingMode = 'score' | 'recency' | 'activity' | 'importance';

// ---------------------------------------------------------------
// 5. CHUNKING TYPES
// ---------------------------------------------------------------

/** Priority patterns for semantic chunking */
export interface PriorityPatterns {
  high: RegExp;
  medium: RegExp;
}

/** Priority buckets for section classification */
export interface PriorityBuckets {
  critical: string[];
  high: string[];
  medium: string[];
  low: string[];
}

// ---------------------------------------------------------------
// 6. TRIGGER EXTRACTOR TYPES
// ---------------------------------------------------------------

/** Trigger extractor configuration */
export interface TriggerConfig {
  MIN_PHRASE_COUNT: number;
  MAX_PHRASE_COUNT: number;
  MIN_WORD_LENGTH: number;
  MIN_UNIGRAM_LENGTH: number;
  MIN_CONTENT_LENGTH: number;
  MIN_FREQUENCY: number;
  LENGTH_BONUS: {
    UNIGRAM: number;
    BIGRAM: number;
    TRIGRAM: number;
    QUADGRAM: number;
  };
  PRIORITY_BONUS: {
    PROBLEM_TERM: number;
    TECHNICAL_TERM: number;
    DECISION_TERM: number;
    ACTION_TERM: number;
    COMPOUND_NOUN: number;
  };
}

/** Individual trigger phrase with score and type */
export interface TriggerPhrase {
  phrase: string;
  score: number;
  type?: string;
  count?: number;
}

/** N-gram count result */
export interface NgramCount {
  phrase: string;
  count: number;
}

/** Scored n-gram with optional count */
export interface ScoredNgram {
  phrase: string;
  score: number;
  count?: number;
}

/** Extraction statistics from trigger phrase extraction */
export interface ExtractionStats {
  inputLength: number;
  cleanedLength: number;
  tokenCount: number;
  filteredTokenCount: number;
  phraseCount: number;
  extractionTimeMs: number;
}

/** Breakdown of extracted phrase types */
export interface ExtractionBreakdown {
  problemTerms: number;
  technicalTerms: number;
  decisionTerms: number;
  actionTerms: number;
  compoundNouns: number;
  samples: {
    problem: string[];
    technical: string[];
    decision: string[];
    action: string[];
    compound: string[];
  };
}

/** Full extraction result with stats and breakdown */
export interface ExtractionResult {
  phrases: string[];
  stats: ExtractionStats;
  breakdown: ExtractionBreakdown;
}

// ---------------------------------------------------------------
// 7. MCP RESPONSE TYPES
// ---------------------------------------------------------------

/**
 * Canonical MCP tool response envelope — single source of truth.
 *
 * Previously duplicated across:
 *   - lib/response/envelope.ts (strict: literal 'text', required isError)
 *   - handlers/types.ts (loose: string type, optional isError)
 *   - tools/types.ts (loose + autoSurfacedContext)
 *   - tests/memory-context.test.ts (local, missing isError)
 *   - scripts/memory/reindex-embeddings.ts (local, optional isError)
 *
 * Consolidated per REC-010 (Spec 103 audit).
 */
export interface MCPResponse {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

// ---------------------------------------------------------------
// 8. PATH SECURITY TYPES
// ---------------------------------------------------------------

// Path security functions use primitive types (string, string[], null).
// No custom types needed beyond the function signatures themselves.

// ---------------------------------------------------------------
// 9. PROFILE SLUG TYPES
// ---------------------------------------------------------------

/** Parsed profile slug components */
export interface ParsedProfileSlug {
  provider: string;
  model: string;
  dim: number;
}

/** Profile JSON representation */
export interface ProfileJson {
  provider: string;
  model: string;
  dim: number;
  baseUrl: string | null;
  slug: string;
}

// ---------------------------------------------------------------
// 10. TASK PREFIX TYPES
// ---------------------------------------------------------------

/** Task prefix constants for embedding task types */
export interface TaskPrefixMap {
  DOCUMENT: string;
  QUERY: string;
  CLUSTERING: string;
  CLASSIFICATION: string;
}

/** Task type for getTaskPrefix() */
export type TaskType = 'document' | 'query' | 'clustering' | 'classification';
