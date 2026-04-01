// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
// Stage interfaces with the Stage 4 immutability invariant
import type { RetrievalTrace } from '@spec-kit/shared/contracts/retrieval-trace';

// Feature catalog: 4-stage pipeline architecture


/**
 * Memory search row — the canonical internal result type flowing through the pipeline.
 * Extends Record<string, unknown> for backward compatibility with existing code.
 */
export interface PipelineRow extends Record<string, unknown> {
  id: number;
  similarity?: number;
  score?: number;
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  attentionScore?: number;
  retrievability?: number;
  stability?: number;
  last_review?: string | null;
  created_at?: string;
  last_accessed?: number;
  content?: string;
  memoryState?: string;
  file_path?: string;
  parent_id?: number | null;
  chunk_index?: number | null;
  chunk_label?: string | null;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
  precomputedContent?: string;
  quality_score?: number;
  importance_weight?: number;
  rrfScore?: number;
  intentAdjustedScore?: number;
  /** P1-015: Stage 2 composite score preserved for auditability when Stage 3 overwrites score */
  stage2Score?: number;
  /** Phase C T025: Graph evidence provenance — edges and communities that contributed to graph-based boosts. */
  graphEvidence?: {
    edges: Array<{ sourceId: number; targetId: number; relation: string; strength: number }>;
    communities: Array<{ communityId: number; summary?: string }>;
    boostFactors: Array<{ type: string; delta: number }>;
  };
}

/**
 * Shared score resolution function — canonical fallback chain for deriving the
 * "best available score" from a PipelineRow. Used by Stage 2, Stage 3, and any
 * code needing a consistent effective score.
 *
 * Previously Stage 2 and Stage 3 had
 * separate implementations with different fallback orders and clamping. This shared
 * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
 * all clamped to [0,1] with isFinite guards.
 */
export function resolveEffectiveScore(row: PipelineRow): number {
  if (typeof row.intentAdjustedScore === 'number' && Number.isFinite(row.intentAdjustedScore))
    return Math.max(0, Math.min(1, row.intentAdjustedScore));
  if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
    return Math.max(0, Math.min(1, row.rrfScore));
  if (typeof row.score === 'number' && Number.isFinite(row.score))
    return Math.max(0, Math.min(1, row.score));
  if (typeof row.similarity === 'number' && Number.isFinite(row.similarity))
    return Math.max(0, Math.min(1, row.similarity / 100));
  return 0;
}

/**
 * Stage 4 read-only row — compile-time enforcement that Stage 4 cannot modify scores.
 * OQ-S5-001 CLOSED: Primary enforcement via TypeScript read-only type guards.
 * All score-related fields are Readonly to prevent mutation in Stage 4.
 */
export interface Stage4ReadonlyRow extends Readonly<Pick<PipelineRow,
  'similarity' | 'score' | 'importance_weight' | 'rrfScore' | 'intentAdjustedScore' | 'attentionScore'
>> {
  readonly id: number;
  // Non-score fields remain mutable for annotation purposes
  importance_tier?: string;
  contextType?: string;
  context_type?: string;
  retrievability?: number;
  stability?: number;
  last_review?: string | null;
  created_at?: string;
  last_accessed?: number;
  content?: string;
  memoryState?: string;
  file_path?: string;
  parent_id?: number | null;
  chunk_index?: number | null;
  chunk_label?: string | null;
  isChunk?: boolean;
  parentId?: number | null;
  chunkIndex?: number | null;
  chunkLabel?: string | null;
  chunkCount?: number | null;
  contentSource?: 'reassembled_chunks' | 'file_read_fallback';
  precomputedContent?: string;
  quality_score?: number;
  // Annotation fields (Stage 4 may add these)
  channelAttribution?: string[];
  evidenceGap?: { gapDetected: boolean; warning?: string };
}

// -- Pipeline Configuration --

/**
 * Normalized configuration consumed by the four-stage retrieval pipeline.
 */
export interface PipelineConfig {
  query: string;
  queryEmbedding?: Float32Array;
  concepts?: string[];
  searchType: 'hybrid' | 'vector' | 'multi-concept';
  mode?: string;

  // Limits and filtering
  limit: number;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  tier?: string;
  contextType?: string;
  includeArchived: boolean;
  includeConstitutional: boolean;
  includeContent: boolean;
  anchors?: string[];
  qualityThreshold?: number;

  // Scoring configuration
  minState: string;
  applyStateLimits: boolean;
  useDecay: boolean;
  rerank: boolean;
  applyLengthPenalty: boolean;

  // Session and boost
  sessionId?: string;
  enableDedup: boolean;
  enableSessionBoost: boolean;
  enableCausalBoost: boolean;
  trackAccess: boolean;

  // Intent
  detectedIntent: string | null;
  intentConfidence: number;
  intentWeights: IntentWeightsConfig | null;

  // Routing
  artifactRouting?: ArtifactRoutingConfig;

  // Trace
  trace?: RetrievalTrace;
}

/**
 * Intent-aware weighting factors applied during fusion.
 */
export interface IntentWeightsConfig {
  similarity: number;
  importance: number;
  recency: number;
}

/**
 * Artifact-class routing decision passed into the pipeline.
 */
export interface ArtifactRoutingConfig {
  detectedClass: string;
  confidence: number;
  strategy: {
    maxResults: number;
    [key: string]: unknown;
  };
}

// -- Stage Interfaces --

/**
 * Stage 1: Candidate Generation
 * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
 * and collects raw results. No scoring modifications.
 */
export interface Stage1Input {
  config: PipelineConfig;
}

/**
 * Stage 1 output containing candidate rows and generation metadata.
 */
export interface Stage1Output {
  candidates: PipelineRow[];
  metadata: {
    searchType: string;
    channelCount: number;
    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
    activeChannels?: number;
    candidateCount: number;
    constitutionalInjected: number;
    durationMs: number;
  };
}

/**
 * Tri-state for signal application metadata.
 * B6 FIX: Replaces boolean flags so callers can distinguish "feature disabled
 * by config" ('off') from "feature crashed" ('failed') from "feature applied
 * successfully" ('applied').
 */
export type SignalStatus = 'off' | 'applied' | 'enabled' | 'failed';

/**
 * Stage 2: Fusion + Signal Integration
 * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
 * composite, intent weights (applied ONCE — prevents G2 recurrence).
 * Score changes: YES
 */
export interface Stage2Input {
  candidates: PipelineRow[];
  config: PipelineConfig;
  stage1Metadata: Stage1Output['metadata'];
}

/**
 * Stage 2 output containing scored rows and fusion metadata.
 */
export interface Stage2Output {
  scored: PipelineRow[];
  metadata: {
    sessionBoostApplied: SignalStatus;
    causalBoostApplied: SignalStatus;
    intentWeightsApplied: SignalStatus;
    artifactRoutingApplied: SignalStatus;
    feedbackSignalsApplied: SignalStatus;
    graphContribution?: {
      killSwitchActive: boolean;
      causalBoosted: number;
      coActivationBoosted: number;
      communityInjected: number;
      graphSignalsBoosted: number;
      totalGraphInjected: number;
      rolloutState?: 'off' | 'trace_only' | 'bounded_runtime';
    };
    qualityFiltered: number;
    durationMs: number;
  };
}

/**
 * Stage 3: Rerank + Aggregate
 * Cross-encoder reranking, MMR diversity enforcement, MPAB chunk-to-memory aggregation.
 * Score changes: YES
 */
export interface Stage3Input {
  scored: PipelineRow[];
  config: PipelineConfig;
}

/**
 * Stage 3 output containing reranked rows and reranking metadata.
 */
export interface Stage3Output {
  reranked: PipelineRow[];
  metadata: {
    rerankApplied: boolean;
    chunkReassemblyStats: {
      collapsedChunkHits: number;
      chunkParents: number;
      reassembled: number;
      fallback: number;
    };
    durationMs: number;
  };
}

/**
 * Stage 4: Filter + Annotate
 * State filtering, session dedup, constitutional injection, channel attribution.
 * Score changes: **NO** — Architectural invariant.
 *
 * Runtime assertion: scores at entry must equal scores at exit.
 * Compile-time enforcement: input type uses Stage4ReadonlyRow with readonly score fields.
 */
export interface Stage4Input {
  /** Results with read-only score fields — Stage 4 cannot modify scores */
  results: Stage4ReadonlyRow[];
  config: PipelineConfig;
  /** Fix #15: Stage 1 metadata passed through for constitutional count */
  stage1Metadata?: { constitutionalInjected?: number };
}

/**
 * Stage 4 output containing final rows, filter metadata, and annotations.
 */
export interface Stage4Output {
  final: Stage4ReadonlyRow[];
  metadata: {
    stateFiltered: number;
    constitutionalInjected: number;
    evidenceGapDetected: boolean;
    durationMs: number;
  };
  annotations: {
    evidenceGapWarning?: string;
    stateStats: Record<string, unknown>;
    featureFlags: Record<string, boolean>;
  };
}

// -- Pipeline Result --

/**
 * Final pipeline response returned to retrieval callers.
 */
export interface PipelineResult {
  results: Stage4ReadonlyRow[];
  metadata: {
    stage1: Stage1Output['metadata'];
    stage2: Stage2Output['metadata'];
    stage3: Stage3Output['metadata'];
    stage4: Stage4Output['metadata'];
    /** B1: Per-stage and total timing in milliseconds for latency observability. */
    timing?: Record<string, number>;
    /** B1: True when one or more stages fell back to degraded output. */
    degraded?: boolean;
  };
  annotations: Stage4Output['annotations'];
  trace?: RetrievalTrace;
}

// -- Stage Function Types --

/**
 * Executor signature for Stage 1 candidate generation.
 */
export type Stage1Fn = (input: Stage1Input) => Promise<Stage1Output>;
/**
 * Executor signature for Stage 2 fusion and signal integration.
 */
export type Stage2Fn = (input: Stage2Input) => Promise<Stage2Output>;
/**
 * Executor signature for Stage 3 reranking and aggregation.
 */
export type Stage3Fn = (input: Stage3Input) => Promise<Stage3Output>;
/**
 * Executor signature for Stage 4 filtering and annotation.
 */
export type Stage4Fn = (input: Stage4Input) => Promise<Stage4Output>;

// -- Score Snapshot Utility (Runtime assertion for Stage 4 invariant) --

/**
 * Captures score values from results for invariant checking.
 * Used to verify Stage 4 does not modify any scores.
 */
export interface ScoreSnapshot {
  id: number;
  similarity?: number;
  score?: number;
  importance_weight?: number;
  rrfScore?: number;
  intentAdjustedScore?: number;
  attentionScore?: number;
}

/**
 * Take a snapshot of score fields for later invariant verification.
 */
export function captureScoreSnapshot(results: Stage4ReadonlyRow[]): ScoreSnapshot[] {
  return results.map(r => ({
    id: r.id,
    similarity: r.similarity,
    score: r.score,
    importance_weight: r.importance_weight,
    rrfScore: r.rrfScore,
    intentAdjustedScore: r.intentAdjustedScore,
    attentionScore: r.attentionScore,
  }));
}

/**
 * Verify Stage 4 invariant: no score fields were modified.
 * Throws if any score differs between before and after snapshots.
 */
export function verifyScoreInvariant(
  before: ScoreSnapshot[],
  after: Stage4ReadonlyRow[]
): void {
  if (before.length !== after.length) {
    // Length changes are allowed (filtering removes items), but we verify retained items
  }

  const afterMap = new Map(after.map(r => [r.id, r]));

  for (const snap of before) {
    const row = afterMap.get(snap.id);
    if (!row) continue; // Filtered out — OK

    if (row.similarity !== snap.similarity) {
      throw new Error(
        `[Stage4Invariant] Score mutation detected: id=${snap.id} similarity changed from ${snap.similarity} to ${row.similarity}`
      );
    }
    if (row.score !== snap.score) {
      throw new Error(
        `[Stage4Invariant] Score mutation detected: id=${snap.id} score changed from ${snap.score} to ${row.score}`
      );
    }
    if (row.rrfScore !== snap.rrfScore) {
      throw new Error(
        `[Stage4Invariant] Score mutation detected: id=${snap.id} rrfScore changed from ${snap.rrfScore} to ${row.rrfScore}`
      );
    }
    if (row.intentAdjustedScore !== snap.intentAdjustedScore) {
      throw new Error(
        `[Stage4Invariant] Score mutation detected: id=${snap.id} intentAdjustedScore changed from ${snap.intentAdjustedScore} to ${row.intentAdjustedScore}`
      );
    }
    if (row.importance_weight !== snap.importance_weight) {
      throw new Error(
        `[Stage4Invariant] Score mutation detected: id=${snap.id} importance_weight changed from ${snap.importance_weight} to ${row.importance_weight}`
      );
    }
    if (row.attentionScore !== snap.attentionScore) {
      throw new Error(
        `[Stage4Invariant] Score mutation detected: id=${snap.id} attentionScore changed from ${snap.attentionScore} to ${row.attentionScore}`
      );
    }
  }
}
