// ────────────────────────────────────────────────────────────────
// MODULE: Search Results Formatter
// ────────────────────────────────────────────────────────────────

// Node stdlib
import fs from 'fs';

// Internal modules
import { estimateTokens } from './token-metrics.js';

// Import path security utilities (migrated from shared/utils.js)
import { validateFilePath } from '../lib/utils/path-security.js';
import {
  readSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';
import { formatAgeString } from '../lib/utils/format-helpers.js';

// Import memory parser for anchor extraction (SK-005)
import * as memoryParser from '../lib/parsing/memory-parser.js';
import { requireDb } from '../utils/index.js';

// REQ-019: Standardized Response Structure
import {
  createMCPSuccessResponse,
  createMCPEmptyResponse,
  type MCPResponse,
} from '../lib/response/envelope.js';

// REQ-D5-001: Empty/Weak Result Recovery UX
import {
  buildRecoveryPayload,
  shouldTriggerRecovery,
  isEmptyResultRecoveryEnabled,
  type RecoveryPayload,
} from '../lib/search/recovery-payload.js';

// REQ-D5-004: Per-Result Calibrated Confidence
import {
  computeResultConfidence,
  assessRequestQuality,
  isResultConfidenceEnabled,
  type ScoredResult,
} from '../lib/search/confidence-scoring.js';

// REQ-D5-002: Two-Tier Explainability
import {
  attachExplainabilityToResults,
  isResultExplainEnabled,
  type ExplainabilityOptions,
} from '../lib/search/result-explainability.js';

// Consolidated path validation from core/config.js (single source of truth)
import { ALLOWED_BASE_PATHS } from '../core/config.js';

// ────────────────────────────────────────────────────────────────
// 1. TYPES 

// ────────────────────────────────────────────────────────────────

/** Token metrics for anchor-filtered content */
export interface AnchorTokenMetrics {
  originalTokens: number;
  returnedTokens: number;
  savingsPercent: number;
  anchorsRequested: number;
  anchorsFound: number;
}

/** Raw search result from database/vector search */
export interface RawSearchResult {
  id: number | string;
  spec_folder?: string;
  file_path?: string;
  specFolder?: string;
  filePath?: string;
  title?: string | null;
  /** Raw vector cosine similarity (0-100 scale from sqlite-vec). */
  similarity?: number;
  /** Average similarity across multi-concept queries (0-100 scale). */
  averageSimilarity?: number;
  isConstitutional?: boolean;
  importance_tier?: string;
  triggerPhrases?: string | string[];
  created_at?: string;
  [key: string]: unknown;
}

/** Formatted search result */
export interface FormattedSearchResult {
  id: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  /** Raw vector cosine similarity (0-100 scale from sqlite-vec), or averageSimilarity for multi-concept. */
  similarity?: number;
  isConstitutional: boolean;
  importanceTier?: string;
  triggerPhrases: string[];
  createdAt?: string;
  content?: string | null;
  contentError?: string;
  tokenMetrics?: AnchorTokenMetrics;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
}

export interface MemoryResultScores {
  semantic: number | null;
  lexical: number | null;
  fusion: number | null;
  intentAdjusted: number | null;
  composite: number | null;
  rerank: number | null;
  attention: number | null;
}

export interface MemoryResultSource {
  file: string | null;
  anchorIds: string[];
  anchorTypes: string[];
  lastModified: string | null;
  memoryState: string | null;
}

export interface MemoryResultTrace {
  channelsUsed: string[];
  pipelineStages: string[];
  fallbackTier: number | null;
  queryComplexity: string | null;
  expansionTerms: string[];
  budgetTruncated: boolean;
  scoreResolution: 'intentAdjusted' | 'fusion' | 'score' | 'semantic' | 'none';
  graphContribution?: {
    sources: string[];
    totalDelta: number;
    injected: boolean;
    raw?: number;
    normalized?: number;
    appliedBonus?: number;
    capApplied?: boolean;
    rolloutState?: string | null;
  };
  adaptiveMode?: string | null;
  sessionTransition?: SessionTransitionTrace;
  /**
   * R-007-P2-11: Observability flag for trust-badge derivation.
   * Populated when `includeTrace` is set so operators can see
   * whether the derivation query was attempted, how many badges
   * actually came from the DB-side path (vs. fallback/explicit),
   * and why derivation failed when it did.
   *
   * - `attempted`: true if the DB query ran (i.e. there were
   *   numeric IDs to query); false if no IDs were resolvable.
   * - `derivedCount`: number of result rows for which a derived
   *   snapshot was returned by the DB query.
   * - `failureReason`: structured reason when `attempted` was
   *   true but `derivedCount` is zero or the query crashed:
   *   * `'no_db'`           — `requireDb` threw / returned null
   *   * `'no_results'`      — query ran cleanly, returned 0 rows
   *   * `'query_error'`     — query threw during execute/iterate
   *   * `null`              — no failure to attribute
   */
  trustBadgeDerivation?: {
    attempted: boolean;
    derivedCount: number;
    failureReason:
      | 'no_db'
      | 'no_results'
      | 'query_error'
      | null;
  };
}

export interface MemoryTrustBadges {
  confidence: number | null;
  extractionAge: string;
  lastAccessAge: string;
  orphan: boolean;
  weightHistoryChanged: boolean;
}

export interface MemoryResultEnvelope extends FormattedSearchResult {
  scores?: MemoryResultScores;
  source?: MemoryResultSource;
  trace?: MemoryResultTrace;
  trustBadges?: MemoryTrustBadges;
  /** Phase C T025: Graph evidence provenance — edges, communities, and boost factors. */
  graphEvidence?: {
    edges: Array<{ sourceId: number; targetId: number; relation: string; strength: number }>;
    communities: Array<{ communityId: number; summary?: string }>;
    boostFactors: Array<{ type: string; delta: number }>;
  };
}

/** Memory parser interface (for optional override) */
export interface MemoryParserLike {
  extractAnchors(content: string): Record<string, string>;
}

interface TrustBadgeSnapshot {
  confidence: number | null;
  extractedAt: string | null;
  lastAccessed: string | null;
  orphan: boolean;
  weightHistoryChanged: boolean;
}

// MCPResponse type is imported from '../lib/response/envelope.js'
export type { MCPResponse };

// ────────────────────────────────────────────────────────────────
// 2. PATH VALIDATION 

// ────────────────────────────────────────────────────────────────

export function validateFilePathLocal(filePath: string): string {
  const result = validateFilePath(filePath, ALLOWED_BASE_PATHS);
  if (result === null) {
    throw new Error('Access denied: Path outside allowed directories');
  }
  // Additional check for .. patterns (not just null bytes which shared handles)
  if (filePath.includes('..')) {
    throw new Error('Access denied: Invalid path pattern');
  }
  return result;
}

// ────────────────────────────────────────────────────────────────
// 3. HELPER UTILITIES 

// ────────────────────────────────────────────────────────────────

export function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch (_error: unknown) {
    return fallback;
  }
}

function toNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function clampConfidence(value: unknown): number | null {
  const numeric = toNullableNumber(value);
  if (numeric === null) return null;
  return Math.max(0, Math.min(1, numeric));
}

/**
 * R-007-P2-10: Allowlisted grammar for explicit `extractionAge` /
 * `lastAccessAge` strings. Mirrors the output of `formatAgeString`:
 *
 *   never | today | yesterday |
 *   <n> days ago | <n> week ago | <n> weeks ago |
 *   <n> month ago | <n> months ago
 *
 * Strings that don't match are dropped to `null` rather than
 * passed through (which previously allowed arbitrary attacker-
 * controlled strings to surface in result badges). The numeric
 * portion is capped at 6 digits (max ~99,999 days, ~999,999
 * months) to prevent visual-spam injection.
 */
const ALLOWED_AGE_LABEL = /^(?:never|today|yesterday|\d{1,6}\s+(?:day|days|week|weeks|month|months)\s+ago)$/;
const MAX_AGE_LABEL_LENGTH = 32;

function sanitizeAgeLabel(value: unknown, fallbackIso: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length <= MAX_AGE_LABEL_LENGTH && ALLOWED_AGE_LABEL.test(trimmed)) {
      return trimmed;
    }
    // Explicit string supplied but failed allowlist — fall through
    // to derivation rather than surfacing the raw value.
  }
  return formatAgeString(typeof fallbackIso === 'string' ? fallbackIso : null);
}

/**
 * R-007-11: Normalize a caller-supplied `trustBadges` payload into
 * a strict `MemoryTrustBadges` shape. Each field is sanitized
 * independently — `null` / wrong type means "fall through to
 * derivation" at merge time. Returns `null` only when the input is
 * not an object at all.
 */
function normalizeExplicitTrustBadges(value: unknown): MemoryTrustBadgePartial | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  const confidence = clampConfidence(candidate.confidence);

  // Age strings: allowlist or fallback to ISO-derived format.
  const extractionAge = sanitizeAgeLabel(candidate.extractionAge, candidate.extractedAt);
  const lastAccessAge = sanitizeAgeLabel(candidate.lastAccessAge, candidate.lastAccessed);

  // Booleans: only `true` counts; anything else (including absent)
  // falls through so the derived value can supply truth.
  const orphan = typeof candidate.orphan === 'boolean' ? candidate.orphan : null;
  const weightHistoryChanged = typeof candidate.weightHistoryChanged === 'boolean'
    ? candidate.weightHistoryChanged
    : null;

  return {
    confidence,
    extractionAge,
    lastAccessAge,
    orphan,
    weightHistoryChanged,
  };
}

interface MemoryTrustBadgePartial {
  confidence: number | null;
  extractionAge: string;
  lastAccessAge: string;
  orphan: boolean | null;
  weightHistoryChanged: boolean | null;
}

function toTrustBadges(snapshot: TrustBadgeSnapshot | null): MemoryTrustBadges | undefined {
  if (!snapshot) return undefined;
  return {
    confidence: snapshot.confidence,
    extractionAge: formatAgeString(snapshot.extractedAt),
    lastAccessAge: formatAgeString(snapshot.lastAccessed),
    orphan: snapshot.orphan,
    weightHistoryChanged: snapshot.weightHistoryChanged,
  };
}

/**
 * R-007-11: Merge an explicit caller-supplied partial onto the
 * derived snapshot per-field. Non-null explicit fields override
 * matching derived fields; null/missing fields fall through to
 * derived. When `derived` is undefined and the explicit partial is
 * incomplete (any required field still null after merge), returns
 * undefined so the caller can omit the badge entirely rather than
 * shipping a half-formed shape.
 */
function mergeTrustBadges(
  explicit: MemoryTrustBadgePartial | null,
  derived: MemoryTrustBadges | undefined,
): MemoryTrustBadges | undefined {
  if (!explicit) return derived;

  const confidence = explicit.confidence ?? derived?.confidence ?? null;
  const extractionAge = explicit.extractionAge !== 'never' && explicit.extractionAge.length > 0
    ? explicit.extractionAge
    : (derived?.extractionAge ?? explicit.extractionAge);
  const lastAccessAge = explicit.lastAccessAge !== 'never' && explicit.lastAccessAge.length > 0
    ? explicit.lastAccessAge
    : (derived?.lastAccessAge ?? explicit.lastAccessAge);
  const orphan = explicit.orphan ?? derived?.orphan;
  const weightHistoryChanged = explicit.weightHistoryChanged ?? derived?.weightHistoryChanged;

  if (orphan === undefined || weightHistoryChanged === undefined) {
    // Required boolean fields still missing — derived wasn't
    // available and caller didn't supply. Drop the badge rather
    // than shipping `undefined` casts.
    return undefined;
  }

  return {
    confidence,
    extractionAge,
    lastAccessAge,
    orphan,
    weightHistoryChanged,
  };
}

interface TrustBadgeFetchResult {
  readonly snapshots: Map<number, TrustBadgeSnapshot>;
  readonly attempted: boolean;
  readonly derivedCount: number;
  readonly failureReason:
    | 'no_db'
    | 'no_results'
    | 'query_error'
    | null;
}

/**
 * R-007-P2-11: trust-badge derivation now returns observability
 * fields alongside the snapshot map. The fields feed
 * `MemoryResultTrace.trustBadgeDerivation` so operators can
 * distinguish "no IDs to query" / "DB unavailable" / "query error"
 * / "0 rows" without inspecting logs. Existing fast paths (no IDs,
 * `requireDb` failure, query exception) preserve their previous
 * graceful-empty-Map return value — only the metadata is new.
 */
function fetchTrustBadgeSnapshots(results: RawSearchResult[]): TrustBadgeFetchResult {
  const resultIds = results
    .map((result) => toNullableNumber(result.id))
    .filter((id): id is number => id !== null);

  if (resultIds.length === 0) {
    return {
      snapshots: new Map(),
      attempted: false,
      derivedCount: 0,
      failureReason: null,
    };
  }

  let database: ReturnType<typeof requireDb>;
  try {
    database = requireDb();
  } catch {
    return {
      snapshots: new Map(),
      attempted: true,
      derivedCount: 0,
      failureReason: 'no_db',
    };
  }

  try {
    const hasWeightHistory = Boolean((database.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table' AND name = 'weight_history'
    `) as { get(): { name: string } | undefined }).get());

    const placeholders = resultIds.map(() => '(?)').join(', ');
    const historyJoin = hasWeightHistory
      ? `
      LEFT JOIN (
        SELECT DISTINCT edge_id
        FROM weight_history
      ) wh ON wh.edge_id = ce.edge_id
      `
      : '';
    const historySelect = hasWeightHistory
      ? 'MAX(CASE WHEN wh.edge_id IS NOT NULL THEN 1 ELSE 0 END) AS weight_history_changed'
      : '0 AS weight_history_changed';

    const rows = (database.prepare(`
      WITH result_ids(memory_id) AS (
        VALUES ${placeholders}
      ),
      connected_edges AS (
        SELECT
          rid.memory_id AS memory_id,
          ce.id AS edge_id,
          CASE
            WHEN ce.id IS NOT NULL THEN COALESCE(ce.strength, 1.0)
            ELSE NULL
          END AS strength,
          ce.extracted_at AS extracted_at,
          ce.last_accessed AS last_accessed,
          CASE
            WHEN ce.id IS NOT NULL AND ce.target_id = CAST(rid.memory_id AS TEXT) THEN 1
            ELSE 0
          END AS is_incoming
        FROM result_ids rid
        LEFT JOIN causal_edges ce
          ON ce.source_id = CAST(rid.memory_id AS TEXT)
          OR ce.target_id = CAST(rid.memory_id AS TEXT)
      )
      SELECT
        ce.memory_id AS memory_id,
        MAX(ce.strength) AS confidence,
        MAX(ce.extracted_at) AS extracted_at,
        MAX(ce.last_accessed) AS last_accessed,
        SUM(ce.is_incoming) AS incoming_edges,
        ${historySelect}
      FROM connected_edges ce
      ${historyJoin}
      GROUP BY ce.memory_id
    `) as {
      all(...params: number[]): Array<Record<string, unknown>>;
    }).all(...resultIds);

    const snapshots = new Map<number, TrustBadgeSnapshot>();
    for (const row of rows) {
      const memoryId = toNullableNumber(row.memory_id);
      if (memoryId === null) continue;
      snapshots.set(memoryId, {
        confidence: clampConfidence(row.confidence),
        extractedAt: typeof row.extracted_at === 'string' ? row.extracted_at : null,
        lastAccessed: typeof row.last_accessed === 'string' ? row.last_accessed : null,
        orphan: (toNullableNumber(row.incoming_edges) ?? 0) === 0,
        weightHistoryChanged: (toNullableNumber(row.weight_history_changed) ?? 0) > 0,
      });
    }

    return {
      snapshots,
      attempted: true,
      derivedCount: snapshots.size,
      failureReason: snapshots.size === 0 ? 'no_results' : null,
    };
  } catch {
    return {
      snapshots: new Map(),
      attempted: true,
      derivedCount: 0,
      failureReason: 'query_error',
    };
  }
}

function resolveCompositeScore(rawResult: RawSearchResult): number | null {
  const intentAdjusted = toNullableNumber(rawResult.intentAdjustedScore);
  if (intentAdjusted !== null) return intentAdjusted;
  const fusion = toNullableNumber(rawResult.rrfScore);
  if (fusion !== null) return fusion;
  const score = toNullableNumber(rawResult.score);
  if (score !== null) return score;
  const similarity = toNullableNumber(rawResult.similarity ?? rawResult.averageSimilarity);
  if (similarity !== null) return Math.max(0, Math.min(1, similarity / 100));
  return null;
}

function resolveScoreResolution(rawResult: RawSearchResult): MemoryResultTrace['scoreResolution'] {
  if (toNullableNumber(rawResult.intentAdjustedScore) !== null) return 'intentAdjusted';
  if (toNullableNumber(rawResult.rrfScore) !== null) return 'fusion';
  if (toNullableNumber(rawResult.score) !== null) return 'score';
  if (toNullableNumber(rawResult.similarity ?? rawResult.averageSimilarity) !== null) return 'semantic';
  return 'none';
}

function extractAnchorDetails(rawResult: RawSearchResult): { anchorIds: string[]; anchorTypes: string[] } {
  const metadata = Array.isArray(rawResult.anchorMetadata)
    ? rawResult.anchorMetadata as Array<Record<string, unknown>>
    : [];
  const anchorIds = metadata
    .map((entry) => (typeof entry.id === 'string' ? entry.id : null))
    .filter((entry): entry is string => entry !== null);
  const anchorTypes = metadata
    .map((entry) => (typeof entry.type === 'string' ? entry.type : null))
    .filter((entry): entry is string => entry !== null);
  return { anchorIds, anchorTypes };
}

function addChannel(channelsUsed: Set<string>, candidate: unknown): void {
  if (typeof candidate !== 'string') return;
  const normalized = candidate.trim();
  if (normalized.length === 0) return;
  channelsUsed.add(normalized);
}

function extractAttributedChannels(rawResult: RawSearchResult): string[] {
  const channels = new Set<string>();
  const numericId = toNullableNumber(rawResult.id);
  const traceMetadata = rawResult.traceMetadata as Record<string, unknown> | undefined;
  const attribution = traceMetadata?.attribution;

  if (!attribution || typeof attribution !== 'object') {
    return [];
  }

  for (const [channel, memoryIds] of Object.entries(attribution as Record<string, unknown>)) {
    if (!Array.isArray(memoryIds) || numericId === null) {
      continue;
    }

    const matchesResult = memoryIds.some((memoryId) => toNullableNumber(memoryId) === numericId);
    if (matchesResult) {
      addChannel(channels, channel);
    }
  }

  return Array.from(channels);
}

function extractTrace(rawResult: RawSearchResult, extraData?: Record<string, unknown>): MemoryResultTrace {
  const rootTrace = extraData?.retrievalTrace as { stages?: Array<{ stage?: string; metadata?: Record<string, unknown> }> } | undefined;
  const retrievalTrace = (rawResult.retrievalTrace as { stages?: Array<{ stage?: string; metadata?: Record<string, unknown> }> } | undefined) ?? rootTrace;
  const stages = Array.isArray(retrievalTrace?.stages) ? retrievalTrace.stages : [];
  const pipelineStages = stages
    .map((entry) => (typeof entry.stage === 'string' ? entry.stage : null))
    .filter((entry): entry is string => entry !== null);

  const channelsUsed = new Set<string>();
  const expansionTerms = new Set<string>();
  let fallbackTier: number | null = null;
  let queryComplexity: string | null = null;
  let budgetTruncated = false;
  let graphContribution: MemoryResultTrace['graphContribution'];
  let adaptiveMode: string | null = null;

  for (const stage of stages) {
    const meta = stage.metadata ?? {};
    const channel = typeof meta.channel === 'string' ? meta.channel : null;
    if (channel) channelsUsed.add(channel);

    if (Array.isArray(meta.channels)) {
      for (const item of meta.channels) {
        if (typeof item === 'string') channelsUsed.add(item);
      }
    }

    if (Array.isArray(meta.expandedTerms)) {
      for (const term of meta.expandedTerms) {
        if (typeof term === 'string') expansionTerms.add(term);
      }
    }

    if (typeof meta.tier === 'number' && Number.isFinite(meta.tier)) {
      fallbackTier = meta.tier;
    }
    if (typeof meta.fallbackTier === 'number' && Number.isFinite(meta.fallbackTier)) {
      fallbackTier = meta.fallbackTier;
    }
    if (typeof meta.queryComplexity === 'string' && meta.queryComplexity.length > 0) {
      queryComplexity = meta.queryComplexity;
    }
    if (meta.budgetTruncated === true || meta.truncated === true) {
      budgetTruncated = true;
    }
  }

  if (rawResult.fallbackRetry === true) {
    fallbackTier = fallbackTier ?? 2;
  }

  addChannel(channelsUsed, rawResult.source);
  if (Array.isArray(rawResult.sources)) {
    for (const source of rawResult.sources) {
      addChannel(channelsUsed, source);
    }
  }
  for (const channel of extractAttributedChannels(rawResult)) {
    addChannel(channelsUsed, channel);
  }

  // CHK-038: Fallback — read queryComplexity from traceMetadata if not found in stages
  if (!queryComplexity) {
    const tm = rawResult.traceMetadata as Record<string, unknown> | undefined;
    if (typeof tm?.queryComplexity === 'string' && (tm.queryComplexity as string).length > 0) {
      queryComplexity = tm.queryComplexity as string;
    }
  }

  const adaptiveShadow = extraData?.adaptiveShadow as { mode?: string } | undefined;
  if (typeof adaptiveShadow?.mode === 'string') {
    adaptiveMode = adaptiveShadow.mode;
  }

  if (rawResult.graphContribution && typeof rawResult.graphContribution === 'object') {
    const contribution = rawResult.graphContribution as Record<string, unknown>;
    graphContribution = {
      sources: Array.isArray(contribution.sources)
        ? contribution.sources.filter((value): value is string => typeof value === 'string')
        : [],
      totalDelta: typeof contribution.totalDelta === 'number' ? contribution.totalDelta : 0,
      injected: contribution.injected === true,
      raw: typeof contribution.raw === 'number' ? contribution.raw : undefined,
      normalized: typeof contribution.normalized === 'number' ? contribution.normalized : undefined,
      appliedBonus: typeof contribution.appliedBonus === 'number' ? contribution.appliedBonus : undefined,
      capApplied: contribution.capApplied === true,
      rolloutState: typeof contribution.rolloutState === 'string' ? contribution.rolloutState : null,
    };
  }

  const sessionTransition = readSessionTransitionTrace(extraData?.sessionTransition) ?? undefined;

  return {
    channelsUsed: Array.from(channelsUsed),
    pipelineStages,
    fallbackTier,
    queryComplexity,
    expansionTerms: Array.from(expansionTerms),
    budgetTruncated,
    scoreResolution: resolveScoreResolution(rawResult),
    graphContribution,
    adaptiveMode,
    sessionTransition,
  };
}

// ────────────────────────────────────────────────────────────────
// 4. SEARCH RESULTS FORMATTING 

// ────────────────────────────────────────────────────────────────

export async function formatSearchResults(
  results: RawSearchResult[] | null,
  searchType: string,
  include_content: boolean = false,
  anchors: string[] | null = null,
  parserOverride: MemoryParserLike | null = null,
  startTime: number | null = null,
  extraData: Record<string, unknown> = {},
  includeTrace: boolean = false,
  query: string | null = null,
  specFolder: string | null = null
): Promise<MCPResponse> {
  const startMs = startTime || Date.now();
  const includeContent = include_content;

  if (!results || results.length === 0) {
    // REQ-D5-001: Attach recovery payload when flag is enabled
    let recoveryPayload: RecoveryPayload | null = null;
    const requestQualityData = isResultConfidenceEnabled()
      ? assessRequestQuality([], [])
      : null;
    if (isEmptyResultRecoveryEnabled()) {
      recoveryPayload = buildRecoveryPayload({
        query,
        hasSpecFolderFilter: specFolder !== null && specFolder.length > 0,
        resultCount: 0,
      });
    }

    // REQ-019: Use standardized empty response envelope
    return createMCPEmptyResponse({
      tool: 'memory_search',
      summary: 'No matching memories found',
      data: {
        searchType: searchType,
        constitutionalCount: 0,
        ...(requestQualityData ?? {}),
        // Always spread caller-provided extraData (pipeline trace, timing, evidence gaps, etc.)
        ...(extraData ?? {}),
        // REQ-D5-001: Attach recovery payload (additive, only when flag enabled)
        ...(recoveryPayload !== null ? { recovery: recoveryPayload } : {}),
      },
      hints: [
        'Try broadening your search query',
        'Use memory_list() to browse available memories',
        'Check if specFolder filter is too restrictive'
      ],
      startTime: startMs
    });
  }

  // Count constitutional results
  const constitutionalCount = results.filter(rawResult => rawResult.isConstitutional).length;
  const trustBadgeFetch = fetchTrustBadgeSnapshots(results);

  const formatted: MemoryResultEnvelope[] = await Promise.all(results.map(async (rawResult: RawSearchResult) => {
    const resultId = toNullableNumber(rawResult.id);
    const formattedResult: MemoryResultEnvelope = {
      id: typeof rawResult.id === 'number' ? rawResult.id : Number.parseInt(rawResult.id, 10),
      specFolder: rawResult.spec_folder ?? String(rawResult.specFolder ?? ''),
      filePath: rawResult.file_path ?? String(rawResult.filePath ?? ''),
      title: rawResult.title ?? null,
      similarity: rawResult.similarity ?? rawResult.averageSimilarity,
      isConstitutional: rawResult.isConstitutional || false,
      importanceTier: rawResult.importance_tier,
      triggerPhrases: Array.isArray(rawResult.triggerPhrases) ? rawResult.triggerPhrases :
                      safeJsonParse<string[]>(rawResult.triggerPhrases as string, []),
      createdAt: rawResult.created_at,
      isChunk: rawResult.isChunk === true,
      parentId: toNullableNumber(rawResult.parentId ?? rawResult.parent_id),
      chunkIndex: toNullableNumber(rawResult.chunkIndex ?? rawResult.chunk_index),
      chunkLabel: (typeof rawResult.chunkLabel === 'string'
        ? rawResult.chunkLabel
        : (typeof rawResult.chunk_label === 'string' ? rawResult.chunk_label : null)),
      chunkCount: toNullableNumber(rawResult.chunkCount ?? rawResult.chunk_count),
      contentSource: (rawResult.contentSource === 'reassembled_chunks' || rawResult.contentSource === 'file_read_fallback')
        ? rawResult.contentSource
        : undefined,
    };

    // R-007-11 + P2-10: explicit `trustBadges` payloads are
    // sanitized per-field (allowlisted age strings, clamped
    // confidence, type-checked booleans). R-007-11 + merge: the
    // sanitized partial is merged onto the derived snapshot
    // per-field so callers can override specific fields without
    // wholesale-replacing the badge.
    const explicitTrustBadgePartial = normalizeExplicitTrustBadges(rawResult.trustBadges);
    const derivedTrustBadges = toTrustBadges(
      resultId !== null ? (trustBadgeFetch.snapshots.get(resultId) ?? null) : null
    );
    formattedResult.trustBadges = mergeTrustBadges(explicitTrustBadgePartial, derivedTrustBadges);

    if (includeTrace) {
      const anchorsInfo = extractAnchorDetails(rawResult);
      formattedResult.scores = {
        semantic: toNullableNumber(rawResult.similarity ?? rawResult.averageSimilarity),
        lexical: toNullableNumber(rawResult.fts_score ?? rawResult.bm25_score ?? (rawResult.sourceScores as Record<string, number> | undefined)?.keyword ?? (rawResult.sourceScores as Record<string, number> | undefined)?.fts ?? (rawResult.sourceScores as Record<string, number> | undefined)?.bm25),
        fusion: toNullableNumber(rawResult.rrfScore),
        intentAdjusted: toNullableNumber(rawResult.intentAdjustedScore),
        composite: resolveCompositeScore(rawResult),
        rerank: toNullableNumber(rawResult.rerankerScore),
        attention: toNullableNumber(rawResult.attentionScore),
      };
      formattedResult.source = {
        file: typeof rawResult.file_path === 'string' ? rawResult.file_path : null,
        anchorIds: anchorsInfo.anchorIds,
        anchorTypes: anchorsInfo.anchorTypes,
        lastModified: typeof rawResult.updated_at === 'string'
          ? rawResult.updated_at
          : (typeof rawResult.created_at === 'string' ? rawResult.created_at : null),
        memoryState: typeof rawResult.memoryState === 'string' ? rawResult.memoryState : null,
      };
      formattedResult.trace = extractTrace(rawResult, extraData);
      // R-007-P2-11: stamp the badge-derivation observability
      // fields onto the trace so operators can distinguish
      // explicit-vs-derived without inspecting logs.
      formattedResult.trace.trustBadgeDerivation = {
        attempted: trustBadgeFetch.attempted,
        derivedCount: trustBadgeFetch.derivedCount,
        failureReason: trustBadgeFetch.failureReason,
      };
    }

    // Phase C T029: Include graphEvidence provenance when present on the pipeline row.
    // The field is populated by Stage 2 when SPECKIT_RESULT_PROVENANCE is enabled.
    if (rawResult.graphEvidence && typeof rawResult.graphEvidence === 'object') {
      const evidence = rawResult.graphEvidence as Record<string, unknown>;
      formattedResult.graphEvidence = {
        edges: Array.isArray(evidence.edges)
          ? (evidence.edges as Array<Record<string, unknown>>).map((e) => ({
              sourceId: typeof e.sourceId === 'number' ? e.sourceId : 0,
              targetId: typeof e.targetId === 'number' ? e.targetId : 0,
              relation: typeof e.relation === 'string' ? e.relation : 'unknown',
              strength: typeof e.strength === 'number' ? e.strength : 1.0,
            }))
          : [],
        communities: Array.isArray(evidence.communities)
          ? (evidence.communities as Array<Record<string, unknown>>).map((c) => ({
              communityId: typeof c.communityId === 'number' ? c.communityId : 0,
              ...(typeof c.summary === 'string' ? { summary: c.summary } : {}),
            }))
          : [],
        boostFactors: Array.isArray(evidence.boostFactors)
          ? (evidence.boostFactors as Array<Record<string, unknown>>).map((b) => ({
              type: typeof b.type === 'string' ? b.type : 'unknown',
              delta: typeof b.delta === 'number' ? b.delta : 0,
            }))
          : [],
      };
    }

    // Include file content if requested.
    // Prefer precomputed chunk reassembly from memory-search to avoid disk reads.
    if (includeContent) {
      try {
        let content: string | null = null;

        if (typeof rawResult.precomputedContent === 'string' && rawResult.precomputedContent.length > 0) {
          content = rawResult.precomputedContent;
          if (!formattedResult.contentSource) {
            formattedResult.contentSource = 'reassembled_chunks';
          }
        } else if (rawResult.file_path) {
          // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
          const validatedPath = validateFilePathLocal(rawResult.file_path);
          content = await fs.promises.readFile(validatedPath, 'utf-8');
          if (!formattedResult.contentSource) {
            formattedResult.contentSource = 'file_read_fallback';
          }
        } else {
          formattedResult.content = null;
          formattedResult.contentError = 'File not found';
          return formattedResult;
        }

        // SK-005: Anchor System Implementation
        const parser: MemoryParserLike = parserOverride || memoryParser;
        if (anchors && Array.isArray(anchors) && anchors.length > 0 && parser && typeof content === 'string') {
          // BUG-017 FIX: Capture original tokens BEFORE any content reassignment
          const originalTokens = estimateTokens(content);

          const extracted = parser.extractAnchors(content);
          const filteredParts: string[] = [];
          let foundCount = 0;

          for (const anchorId of anchors) {
            // SK-005 Prefix matching: try exact match first, then fall back to
            // Prefix match for composite anchor IDs (e.g. 'summary' matches
            // 'summary-session-1770903150838-...'). Prefers shortest match to
            // Select the most specific key when multiple keys share a prefix.
            const matchingKey = extracted[anchorId] !== undefined
              ? anchorId
              : Object.keys(extracted)
                  .filter(key => key.startsWith(anchorId + '-'))
                  .sort((a, b) => a.length - b.length)[0] ?? undefined;

            if (matchingKey !== undefined) {
              filteredParts.push(`<!-- ANCHOR:${matchingKey} -->\n${extracted[matchingKey]}\n<!-- /ANCHOR:${matchingKey} -->`);
              foundCount++;
            }
          }

          if (filteredParts.length > 0) {
            // SK-005 Fix: Warn about missing anchors in partial match
            // Use same prefix-matching logic for consistency
            const missingAnchors = anchors.filter(a => {
              if (extracted[a] !== undefined) return false;
              return !Object.keys(extracted).some(key => key.startsWith(a + '-'));
            });
            if (missingAnchors.length > 0) {
              filteredParts.push(`<!-- WARNING: Requested anchors not found: ${missingAnchors.join(', ')} -->`);
            }

            content = filteredParts.join('\n\n');
            const newTokens = estimateTokens(content);
            const savings = Math.round((1 - newTokens / Math.max(originalTokens, 1)) * 100);

            formattedResult.tokenMetrics = {
              originalTokens: originalTokens,
              returnedTokens: newTokens,
              savingsPercent: savings,
              anchorsRequested: anchors.length,
              anchorsFound: foundCount
            };
          } else {
            // No anchors found - return warning
            content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
            formattedResult.tokenMetrics = {
              originalTokens: originalTokens,
              returnedTokens: 0,
              savingsPercent: 100,
              anchorsRequested: anchors.length,
              anchorsFound: 0
            };
          }
        }

        formattedResult.content = content;
      } catch (err: unknown) {
        formattedResult.content = null;
        const message = err instanceof Error ? err.message : String(err);
        // BUG-023 FIX: Sanitize error messages to prevent information leakage
        formattedResult.contentError = message.includes('Access denied')
          ? 'Security: Access denied'
          : message.includes('ENOENT')
            ? 'File not found'
            : 'Failed to read file';
      }
    }

    return formattedResult;
  }));

  // REQ-D5-004: Compute per-result confidence when flag is enabled (additive, no side-effects)
  const confidenceEnabled = isResultConfidenceEnabled();
  let confidenceData: ReturnType<typeof computeResultConfidence> | null = null;
  let requestQualityData: ReturnType<typeof assessRequestQuality> | null = null;
  if (confidenceEnabled) {
    // Cast to ScoredResult — RawSearchResult extends Record<string,unknown> and has the same shape
    const scoredResults = results as unknown as ScoredResult[];
    confidenceData = computeResultConfidence(scoredResults);
    requestQualityData = assessRequestQuality(scoredResults, confidenceData);
  }

  // REQ-D5-001: Compute recovery payload for weak/partial results when flag is enabled
  let recoveryPayload: RecoveryPayload | null = null;
  if (isEmptyResultRecoveryEnabled() && formatted.length > 0) {
    // Compute average confidence for recovery decision
    let avgConfidence: number | undefined;
    if (confidenceData && confidenceData.length > 0) {
      const sum = confidenceData.reduce((acc, c) => acc + c.confidence.value, 0);
      avgConfidence = sum / confidenceData.length;
    }

    const recoveryCtx = {
      query,
      hasSpecFolderFilter: specFolder !== null && specFolder.length > 0,
      evidenceGap: Boolean(extraData?.evidenceGap),
      resultCount: formatted.length,
      avgConfidence,
    };

    if (shouldTriggerRecovery(recoveryCtx)) {
      recoveryPayload = buildRecoveryPayload(recoveryCtx);
    }
  }

  // REQ-019: Build summary based on result characteristics
  const summary = constitutionalCount > 0
    ? `Found ${formatted.length} memories (${constitutionalCount} constitutional)`
    : `Found ${formatted.length} memories`;

  // REQ-019: Build hints based on context
  const hints: string[] = [];
  if (includeContent && anchors && anchors.length > 0) {
    hints.push('Anchor filtering applied for token efficiency');
  }
  if (!includeContent && formatted.length > 0) {
    hints.push('Use includeContent: true to embed file contents in results');
  }
  if (formatted.some(r => r.contentError)) {
    hints.push('Some files could not be read - check file paths');
  }

  // Merge per-result confidence into the formatted result array (additive)
  const resultsWithConfidence: Array<Record<string, unknown>> = formatted.map(
    (r, i): Record<string, unknown> => {
      if (!confidenceData) return r as unknown as Record<string, unknown>;
      const conf = confidenceData[i];
      if (!conf) return r as unknown as Record<string, unknown>;
      return { ...(r as unknown as Record<string, unknown>), ...conf };
    }
  );

  // REQ-D5-002: Attach explainability (slim tier) to every result when flag is ON.
  // Pass results as PipelineRow-compatible — they share the same Record<string,unknown> base.
  // Debug tier is opt-in via SPECKIT_RESULT_EXPLAIN_DEBUG env var.
  const explainOptions: ExplainabilityOptions = {
    debugEnabled: process.env.SPECKIT_RESULT_EXPLAIN_DEBUG?.toLowerCase().trim() === 'true',
  };
  const resultsWithExplain = isResultExplainEnabled()
    ? attachExplainabilityToResults(
        resultsWithConfidence as Parameters<typeof attachExplainabilityToResults>[0],
        explainOptions
      ) as Array<Record<string, unknown>>
    : resultsWithConfidence;

  // REQ-019: Use standardized success response envelope
  const responseData: Record<string, unknown> = {
    searchType: searchType,
    count: formatted.length,
    constitutionalCount: constitutionalCount,
    results: resultsWithExplain,
    // REQ-D5-004: Request-level quality assessment (additive)
    ...(requestQualityData !== null ? requestQualityData : {}),
    // REQ-D5-001: Recovery payload for weak/partial results (additive)
    ...(recoveryPayload !== null ? { recovery: recoveryPayload } : {}),
  };
  // Always spread caller-provided extraData (pipeline trace, timing, evidence gaps, etc.).
  // Spread extraData first, then re-assert canonical keys to prevent overwrites.
  if (extraData && Object.keys(extraData).length > 0) {
    const { searchType: _s, count: _c, constitutionalCount: _cc, results: _r, ...safeExtra } = extraData as Record<string, unknown>;
    Object.assign(responseData, safeExtra);
  }

  return createMCPSuccessResponse({
    tool: 'memory_search',
    summary,
    data: responseData,
    hints,
    startTime: startMs
  });
}

/* ───────────────────────────────────────────────────────────────
   5. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
