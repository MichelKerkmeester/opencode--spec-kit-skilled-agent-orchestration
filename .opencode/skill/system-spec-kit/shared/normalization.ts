// ---------------------------------------------------------------
// MODULE: Normalization
// ---------------------------------------------------------------
// Feature catalog: Content-aware memory filename generation
// Converts between snake_case (database) and camelCase (application).
// This is the SINGLE SOURCE OF TRUTH for DB ↔ App type conversions.
//
// The raw DB schema is defined in:
//   mcp_server/lib/search/vector-index-impl.js (CREATE TABLE memory_index)
//
// Consumers should use MemoryDbRow (snake_case DB rows).
// or Memory (camelCase app layer) from this module.
// Deprecated MemoryRow/MemoryRecord interfaces were removed.
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. DATABASE ROW TYPE (snake_case — exactly as SQLite returns)
// ---------------------------------------------------------------

/**
 * Raw database row from the `memory_index` table.
 * Column names match the production schema exactly (snake_case).
 *
 * Source of truth: vector-index-impl.js CREATE TABLE memory_index
 */

// Feature catalog: Entity normalization consolidation

export interface MemoryDbRow {
  id: number;
  spec_folder: string;
  file_path: string;
  anchor_id: string | null;
  title: string | null;
  trigger_phrases: string | null;
  importance_weight: number;
  created_at: string;
  updated_at: string;
  embedding_model: string | null;
  embedding_generated_at: string | null;
  embedding_status: string;
  retry_count: number;
  last_retry_at: string | null;
  failure_reason: string | null;
  base_importance: number;
  decay_half_life_days: number;
  is_pinned: number;           // SQLite boolean (0 | 1)
  access_count: number;
  last_accessed: number;       // Unix timestamp (integer)
  importance_tier: string;
  session_id: string | null;
  context_type: string;
  channel: string;
  content_hash: string | null;
  expires_at: string | null;
  confidence: number;
  validation_count: number;
  stability: number;
  difficulty: number;
  last_review: string | null;
  review_count: number;
  file_mtime_ms: number | null;
  document_type: string;
  spec_level: number | null;
}

// ---------------------------------------------------------------
// 2. APPLICATION TYPE (camelCase — used in handler/business logic)
// ---------------------------------------------------------------

/**
 * Application-level memory object (camelCase).
 * This is what handler code should work with after normalization.
 */
export interface Memory {
  id: number;
  specFolder: string;
  filePath: string;
  anchorId: string | null;
  title: string | null;
  triggerPhrases: string | null;
  importanceWeight: number;
  createdAt: string;
  updatedAt: string;
  embeddingModel: string | null;
  embeddingGeneratedAt: string | null;
  embeddingStatus: string;
  retryCount: number;
  lastRetryAt: string | null;
  failureReason: string | null;
  baseImportance: number;
  decayHalfLifeDays: number;
  isPinned: boolean;            // Normalized to boolean
  accessCount: number;
  lastAccessed: number;
  importanceTier: string;
  sessionId: string | null;
  contextType: string;
  channel: string;
  contentHash: string | null;
  expiresAt: string | null;
  confidence: number;
  validationCount: number;
  stability: number;
  difficulty: number;
  lastReview: string | null;
  reviewCount: number;
  fileMtimeMs: number | null;
  documentType: string;
  specLevel: number | null;
}

// ---------------------------------------------------------------
// 3. CONVERSION FUNCTIONS


// ---------------------------------------------------------------

/**
 * Convert a raw database row to the application-level Memory type.
 * This is the ONLY place where snake_case → camelCase mapping lives.
 */
export function dbRowToMemory(row: MemoryDbRow): Memory {
  return {
    id: row.id,
    specFolder: row.spec_folder,
    filePath: row.file_path,
    anchorId: row.anchor_id,
    title: row.title,
    triggerPhrases: row.trigger_phrases,
    importanceWeight: row.importance_weight,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    embeddingModel: row.embedding_model,
    embeddingGeneratedAt: row.embedding_generated_at,
    embeddingStatus: row.embedding_status,
    retryCount: row.retry_count,
    lastRetryAt: row.last_retry_at,
    failureReason: row.failure_reason,
    baseImportance: row.base_importance,
    decayHalfLifeDays: row.decay_half_life_days,
    isPinned: row.is_pinned === 1,
    accessCount: row.access_count,
    lastAccessed: row.last_accessed,
    importanceTier: row.importance_tier,
    sessionId: row.session_id,
    contextType: row.context_type,
    channel: row.channel,
    contentHash: row.content_hash,
    expiresAt: row.expires_at,
    confidence: row.confidence,
    validationCount: row.validation_count,
    stability: row.stability,
    difficulty: row.difficulty,
    lastReview: row.last_review,
    reviewCount: row.review_count,
    fileMtimeMs: row.file_mtime_ms,
    documentType: row.document_type,
    specLevel: row.spec_level,
  };
}

/**
 * Convert an application-level Memory to a partial DB row for INSERT/UPDATE.
 * Omits `id` (auto-generated by DB).
 * Only includes fields that are present on the Memory object.
 */
export function memoryToDbRow(memory: Partial<Memory>): Partial<MemoryDbRow> {
  const row: Partial<MemoryDbRow> = {};

  if (memory.specFolder !== undefined) row.spec_folder = memory.specFolder;
  if (memory.filePath !== undefined) row.file_path = memory.filePath;
  if (memory.anchorId !== undefined) row.anchor_id = memory.anchorId;
  if (memory.title !== undefined) row.title = memory.title;
  if (memory.triggerPhrases !== undefined) row.trigger_phrases = memory.triggerPhrases;
  if (memory.importanceWeight !== undefined) row.importance_weight = memory.importanceWeight;
  if (memory.createdAt !== undefined) row.created_at = memory.createdAt;
  if (memory.updatedAt !== undefined) row.updated_at = memory.updatedAt;
  if (memory.embeddingModel !== undefined) row.embedding_model = memory.embeddingModel;
  if (memory.embeddingGeneratedAt !== undefined) row.embedding_generated_at = memory.embeddingGeneratedAt;
  if (memory.embeddingStatus !== undefined) row.embedding_status = memory.embeddingStatus;
  if (memory.retryCount !== undefined) row.retry_count = memory.retryCount;
  if (memory.lastRetryAt !== undefined) row.last_retry_at = memory.lastRetryAt;
  if (memory.failureReason !== undefined) row.failure_reason = memory.failureReason;
  if (memory.baseImportance !== undefined) row.base_importance = memory.baseImportance;
  if (memory.decayHalfLifeDays !== undefined) row.decay_half_life_days = memory.decayHalfLifeDays;
  if (memory.isPinned !== undefined) row.is_pinned = memory.isPinned ? 1 : 0;
  if (memory.accessCount !== undefined) row.access_count = memory.accessCount;
  if (memory.lastAccessed !== undefined) row.last_accessed = memory.lastAccessed;
  if (memory.importanceTier !== undefined) row.importance_tier = memory.importanceTier;
  if (memory.sessionId !== undefined) row.session_id = memory.sessionId;
  if (memory.contextType !== undefined) row.context_type = memory.contextType;
  if (memory.channel !== undefined) row.channel = memory.channel;
  if (memory.contentHash !== undefined) row.content_hash = memory.contentHash;
  if (memory.expiresAt !== undefined) row.expires_at = memory.expiresAt;
  if (memory.confidence !== undefined) row.confidence = memory.confidence;
  if (memory.validationCount !== undefined) row.validation_count = memory.validationCount;
  if (memory.stability !== undefined) row.stability = memory.stability;
  if (memory.difficulty !== undefined) row.difficulty = memory.difficulty;
  if (memory.lastReview !== undefined) row.last_review = memory.lastReview;
  if (memory.reviewCount !== undefined) row.review_count = memory.reviewCount;
  if (memory.fileMtimeMs !== undefined) row.file_mtime_ms = memory.fileMtimeMs;
  if (memory.documentType !== undefined) row.document_type = memory.documentType;
  if (memory.specLevel !== undefined) row.spec_level = memory.specLevel;

  return row;
}

/**
 * Convert a partial DB row (e.g., from a SELECT with fewer columns)
 * to a partial Memory. Useful for search results that don't fetch all columns.
 */
export function partialDbRowToMemory(row: Partial<MemoryDbRow> & { id: number }): Partial<Memory> & { id: number } {
  const mem: Partial<Memory> & { id: number } = { id: row.id };

  if (row.spec_folder !== undefined) mem.specFolder = row.spec_folder;
  if (row.file_path !== undefined) mem.filePath = row.file_path;
  if (row.anchor_id !== undefined) mem.anchorId = row.anchor_id;
  if (row.title !== undefined) mem.title = row.title;
  if (row.trigger_phrases !== undefined) mem.triggerPhrases = row.trigger_phrases;
  if (row.importance_weight !== undefined) mem.importanceWeight = row.importance_weight;
  if (row.created_at !== undefined) mem.createdAt = row.created_at;
  if (row.updated_at !== undefined) mem.updatedAt = row.updated_at;
  if (row.embedding_model !== undefined) mem.embeddingModel = row.embedding_model;
  if (row.embedding_generated_at !== undefined) mem.embeddingGeneratedAt = row.embedding_generated_at;
  if (row.embedding_status !== undefined) mem.embeddingStatus = row.embedding_status;
  if (row.retry_count !== undefined) mem.retryCount = row.retry_count;
  if (row.last_retry_at !== undefined) mem.lastRetryAt = row.last_retry_at;
  if (row.failure_reason !== undefined) mem.failureReason = row.failure_reason;
  if (row.base_importance !== undefined) mem.baseImportance = row.base_importance;
  if (row.decay_half_life_days !== undefined) mem.decayHalfLifeDays = row.decay_half_life_days;
  if (row.is_pinned !== undefined) mem.isPinned = row.is_pinned === 1;
  if (row.access_count !== undefined) mem.accessCount = row.access_count;
  if (row.last_accessed !== undefined) mem.lastAccessed = row.last_accessed;
  if (row.importance_tier !== undefined) mem.importanceTier = row.importance_tier;
  if (row.session_id !== undefined) mem.sessionId = row.session_id;
  if (row.context_type !== undefined) mem.contextType = row.context_type;
  if (row.channel !== undefined) mem.channel = row.channel;
  if (row.content_hash !== undefined) mem.contentHash = row.content_hash;
  if (row.expires_at !== undefined) mem.expiresAt = row.expires_at;
  if (row.confidence !== undefined) mem.confidence = row.confidence;
  if (row.validation_count !== undefined) mem.validationCount = row.validation_count;
  if (row.stability !== undefined) mem.stability = row.stability;
  if (row.difficulty !== undefined) mem.difficulty = row.difficulty;
  if (row.last_review !== undefined) mem.lastReview = row.last_review;
  if (row.review_count !== undefined) mem.reviewCount = row.review_count;
  if (row.file_mtime_ms !== undefined) mem.fileMtimeMs = row.file_mtime_ms;
  if (row.document_type !== undefined) mem.documentType = row.document_type;
  if (row.spec_level !== undefined) mem.specLevel = row.spec_level;

  return mem;
}
