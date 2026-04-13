import { createHash } from 'node:crypto';

import routingPrototypeLibrary from './routing-prototypes.json' with { type: 'json' };
import { normalizeContentForEmbedding } from '../parsing/content-normalizer.js';
import { cosineSimilarity } from '../validation/save-quality-gate.js';

export const ROUTING_PROMPT_VERSION = 'tier3-router-v1' as const;
export const TIER1_THRESHOLD = 0.7;
export const TIER2_THRESHOLD = 0.7;
export const TIER3_THRESHOLD = 0.5;
export const TIER2_FALLBACK_PENALTY = 0.15;
export const TIER3_MODEL = 'gpt-5.4' as const;
export const TIER3_REASONING_EFFORT = 'low' as const;
export const TIER3_TEMPERATURE = 0 as const;
export const TIER3_MAX_OUTPUT_TOKENS = 200 as const;
export const TIER3_TIMEOUT_MS = 2_000 as const;

export const ROUTING_CATEGORIES = [
  'narrative_progress',
  'narrative_delivery',
  'decision',
  'handover_state',
  'research_finding',
  'task_update',
  'metadata_only',
  'drop',
] as const;

const INTERNAL_TIER3_DROP = 'drop_candidate' as const;
const SOURCE_SHAPES = [
  'implementation-summary',
  'decision-record',
  'handover',
  'research',
  'tasks',
  'legacy-memory',
] as const;

const ROUTING_AUDIT_CODE = 'CR001' as const;
const DROP_TARGET_PREFIX = 'scratch/pending-route-' as const;
const DEFAULT_HANDOVER_ANCHOR = 'session-log' as const;
const DEFAULT_RESEARCH_ANCHOR = 'findings' as const;
const DEFAULT_DECISION_ANCHOR = 'adr-NNN' as const;
const DEFAULT_PROGRESS_ANCHOR = 'what-built' as const;
const DEFAULT_DELIVERY_ANCHOR = 'how-delivered' as const;
const DEFAULT_METADATA_ANCHOR = '_memory.continuity' as const;
const DEFAULT_TASK_ANCHOR = 'phase-1' as const;
const MANUAL_REVIEW_ANCHOR = 'manual-review' as const;
const SESSION_CACHE_PREFIX = 'session' as const;
const SPEC_FOLDER_CACHE_PREFIX = 'spec-folder' as const;

type PacketLevel = 'L1' | 'L2' | 'L3' | 'L3+';
type PacketKind = 'feature' | 'phase' | 'remediation' | 'research' | 'unknown';
type SaveMode = 'auto' | 'interactive' | 'dry-run' | 'route-as';
type SourceField =
  | 'observations'
  | 'decisions'
  | 'preflight'
  | 'postflight'
  | 'exchanges'
  | 'toolCalls'
  | 'unknown';
type MergeMode =
  | 'append-as-paragraph'
  | 'append-section'
  | 'insert-new-adr'
  | 'update-in-place'
  | 'refuse-to-route';
type ConfidenceBand = 'silent' | 'audit' | 'warn' | 'refuse';
type Tier2TriggerReason =
  | 'top1_below_0_70'
  | 'margin_too_narrow'
  | 'mixed_signals'
  | 'manual_retry';
type CacheScope = 'session' | 'spec-folder';
type Tier3Category = Exclude<RoutingCategory, 'drop'> | typeof INTERNAL_TIER3_DROP;
type SourceShape = typeof SOURCE_SHAPES[number];

export type RoutingCategory = typeof ROUTING_CATEGORIES[number];

export interface RoutingTarget {
  docPath: string;
  anchorId: string;
  mergeMode: MergeMode;
}

export interface RoutingAlternative {
  category: RoutingCategory;
  confidence: number;
}

export interface RoutingDecision {
  category: RoutingCategory;
  confidence: number;
  target: RoutingTarget;
  tierUsed: 1 | 2 | 3;
  explanation: string;
  overrideable: boolean;
  confidenceBand: ConfidenceBand;
  shouldLogForReview: boolean;
  warningMessage: string | null;
  refusal: boolean;
  alternatives: RoutingAlternative[];
  overrideApplied: boolean;
  cacheHit: boolean;
  promptVersion: typeof ROUTING_PROMPT_VERSION;
  tier1: Tier1Result | null;
  tier2TopK: Tier2Hit[];
  tier3: Tier3Outcome | null;
  cacheKey: string;
  triggerReason: Tier2TriggerReason | null;
  naturalDecision?: {
    category: RoutingCategory;
    confidence: number;
    tierUsed: 1 | 2 | 3;
    target: RoutingTarget;
  };
}

export interface ContentChunk {
  id: string;
  text: string;
  sourceField?: SourceField;
  structuredType?: 'decision' | 'handover' | 'research' | 'task_update' | 'metadata_only';
  routeAs?: RoutingCategory;
  metadata?: Record<string, unknown>;
}

export interface RouterContext {
  specFolder: string;
  packetLevel: PacketLevel;
  existingAnchors?: string[];
  sessionMeta?: Partial<SessionHints>;
}

export interface SessionHints {
  spec_folder: string;
  packet_level: PacketLevel;
  packet_kind: PacketKind;
  save_mode: SaveMode;
  recent_docs_touched: string[];
  recent_anchors_touched: string[];
  likely_phase_anchor: string | null;
  session_id?: string;
}

export interface PrototypeRecord {
  id: string;
  label: string;
  sourceShape: SourceShape;
  tags: string[];
  chunk: string;
  negativeHints?: string[];
}

export interface PrototypeLibrary {
  version: number;
  embeddingProfile: string;
  categories: Record<RoutingCategory, PrototypeRecord[]>;
}

export interface Tier1Result {
  matched: boolean;
  category: RoutingCategory | null;
  confidence: number;
  rule_id: string | null;
  hard_negative_flags: string[];
  scores: Partial<Record<RoutingCategory, number>>;
  margin: number;
}

export interface Tier2Hit {
  rank: 1 | 2 | 3;
  category: RoutingCategory;
  prototype_id: string;
  similarity: number;
  target_doc: string;
  target_anchor: string;
  merge_intent: MergeMode;
  cue_summary: string;
}

export interface Tier3ClassifierInput {
  chunk_id: string;
  chunk_hash: string;
  chunk_text: string;
  chunk_text_normalized: string;
  chunk_char_count: number;
  source_field: SourceField;
  tier1: Tier1Result | null;
  tier2_topk: Tier2Hit[];
  tier2_trigger_reason: Tier2TriggerReason;
  context: SessionHints;
}

export interface Tier3RawAlternative {
  category: Tier3Category;
  confidence: number;
}

export interface Tier3RawResponse {
  category: Tier3Category;
  confidence: number;
  target_doc: string;
  target_anchor: string;
  merge_mode: MergeMode;
  reasoning: string;
  alternatives?: Tier3RawAlternative[];
}

export interface Tier3Outcome {
  rawCategory: Tier3Category;
  decision: Tier3RawResponse;
  latencyMs: number;
  usedRepairRetry: boolean;
  cacheScope: CacheScope | null;
}

export interface Tier3CacheEntry {
  promptVersion: typeof ROUTING_PROMPT_VERSION;
  model: string;
  packetLevel: PacketLevel;
  category: Tier3Category;
  confidence: number;
  targetDoc: string;
  targetAnchor: string;
  mergeMode: MergeMode;
  reasoning: string;
  alternatives: Tier3RawAlternative[];
  createdAt: string;
}

export interface RouterCache {
  get(scope: CacheScope, key: string, context: SessionHints): Promise<Tier3CacheEntry | null> | Tier3CacheEntry | null;
  set(
    scope: CacheScope,
    key: string,
    entry: Tier3CacheEntry,
    ttlMs: number,
    context: SessionHints,
  ): Promise<void> | void;
}

export interface RouterDependencies {
  embedText?: (text: string) => Promise<Float32Array | number[]> | Float32Array | number[];
  classifyWithTier3?: (input: Tier3ClassifierInput) => Promise<Tier3RawResponse | null> | Tier3RawResponse | null;
  cache?: RouterCache;
  now?: () => number;
  prototypes?: PrototypeLibrary;
}

export interface RoutingAuditEntry {
  ts: string;
  component: 'content-router';
  code: typeof ROUTING_AUDIT_CODE;
  chunk_id: string;
  chunk_text_preview: string;
  chunk_hash: string;
  tier_used: 1 | 2 | 3;
  category: RoutingCategory;
  confidence: number;
  target_doc: string;
  target_anchor: string;
  merge_mode: MergeMode;
  alternatives: Array<{ cat: RoutingCategory; conf: number }>;
  decision_latency_ms: number;
  spec_folder: string;
  session_id: string | null;
}

interface PrototypeEmbeddingRecord {
  category: RoutingCategory;
  prototype: PrototypeRecord;
  embedding: Float32Array | number[];
}

const DEFAULT_PROTOTYPES = validatePrototypeLibrary(
  routingPrototypeLibrary as PrototypeLibrary,
);

interface InMemoryRouterCacheRecord {
  entry: Tier3CacheEntry;
  expiresAt: number | null;
}

export class InMemoryRouterCache implements RouterCache {
  private readonly entries = new Map<string, InMemoryRouterCacheRecord>();

  get(scope: CacheScope, key: string, context: SessionHints): Tier3CacheEntry | null {
    const cacheKey = this.buildKey(scope, key, context);
    const record = this.entries.get(cacheKey);
    if (!record) {
      return null;
    }
    if (record.expiresAt !== null && record.expiresAt <= Date.now()) {
      this.entries.delete(cacheKey);
      return null;
    }
    return record.entry;
  }

  set(scope: CacheScope, key: string, entry: Tier3CacheEntry, ttlMs: number, context: SessionHints): void {
    const expiresAt = Number.isFinite(ttlMs) ? Date.now() + Math.max(0, ttlMs) : null;
    this.entries.set(this.buildKey(scope, key, context), {
      entry,
      expiresAt,
    });
  }

  private buildKey(scope: CacheScope, key: string, context: SessionHints): string {
    if (scope === 'session') {
      const sessionId = context.session_id?.trim();
      return `${SESSION_CACHE_PREFIX}:${sessionId || context.spec_folder}:${key}`;
    }
    return `${SPEC_FOLDER_CACHE_PREFIX}:${context.spec_folder}:${key}`;
  }
}

const TIER1_RULE_LIBRARY = [
  {
    id: 'tier1.structured.decision',
    category: 'decision',
    confidence: 0.98,
    when: (chunk: ContentChunk): boolean => chunk.structuredType === 'decision' || chunk.sourceField === 'decisions',
  },
  {
    id: 'tier1.structured.handover',
    category: 'handover_state',
    confidence: 0.96,
    when: (chunk: ContentChunk): boolean => chunk.structuredType === 'handover',
  },
  {
    id: 'tier1.structured.research',
    category: 'research_finding',
    confidence: 0.95,
    when: (chunk: ContentChunk): boolean => chunk.structuredType === 'research',
  },
  {
    id: 'tier1.structured.task-update',
    category: 'task_update',
    confidence: 0.96,
    when: (chunk: ContentChunk): boolean => chunk.structuredType === 'task_update',
  },
  {
    id: 'tier1.structured.metadata-only',
    category: 'metadata_only',
    confidence: 0.99,
    when: (chunk: ContentChunk): boolean =>
      chunk.structuredType === 'metadata_only'
      || chunk.sourceField === 'preflight'
      || chunk.sourceField === 'postflight',
  },
  {
    id: 'tier1.structured.toolcalls',
    category: 'drop',
    confidence: 0.99,
    when: (chunk: ContentChunk): boolean => chunk.sourceField === 'toolCalls',
  },
  {
    id: 'tier1.transcript.wrapper',
    category: 'drop',
    confidence: 0.98,
    when: (_chunk: ContentChunk, normalized: string): boolean =>
      /conversation_log|timestamped dialogue|assistant:|user:|tool:/.test(normalized),
  },
  {
    id: 'tier1.placeholder.boilerplate',
    category: 'drop',
    confidence: 0.95,
    when: (_chunk: ContentChunk, normalized: string): boolean =>
      /recovery scenarios|diagnostic commands|table of contents|placeholder|auto-truncated/.test(normalized),
  },
] satisfies Array<{
  id: string;
  category: RoutingCategory;
  confidence: number;
  when: (chunk: ContentChunk, normalized: string) => boolean;
}>;

const DELIVERY_SEQUENCE_CUES = /\b(only then|then|after|before|followed by|in order|delivered in (?:two|three|four|\d+|\w+) passes)\b/u;
const DELIVERY_GATING_CUES = /\b(gate|gated|gating|prerequisite|depends on|blocked by|kept (?:the work )?pending until)\b/u;
const DELIVERY_ROLLOUT_CUES = /\b(feature flag|feature-flag|shadow|rollout|deployed?|deployment|canary|dual-write|ship(?:ped|ping)?|release(?:d)?|migrat(?:e|ed|ion)|staging)\b/u;
const DELIVERY_VERIFICATION_CUES = /\b(verify|verified|validate(?:d|s|ion)?|confirm(?:ed|s)?|check(?:ed|ing|s)?|verification stayed|closure only happened after|awaiting runtime verification|auditable)\b/u;
const STRONG_DELIVERY_PHRASES = /\b(updated together|same-?pass|same runtime truth|kept (?:the work )?pending until|closure only happened after|awaiting runtime verification|verification stayed|only then)\b/u;
const HARD_DROP_WRAPPER_CUES = /\b(conversation transcript|generic recovery hints|tool telemetry|table of contents|raw tool|repository state|assistant:|user:|tool:|recovery scenarios|diagnostic commands)\b/u;
const SOFT_OPERATIONAL_DROP_CUES = /\b(git diff|list memories|force re-index)\b/u;
const STRONG_HANDOVER_LANGUAGE = /\b(current state|next session|resume|blocker|continuation|hand off|pick up where|active files|current blockers|remaining effort|immediate next session work|recent action|next safe action|fresh session|restart recipe)\b/u;

const RULE_CUES: Record<RoutingCategory, RegExp[]> = {
  narrative_progress: [
    /\b(refactor|refactored|implemented|merged|added|built|fixed|updated|shipped|unblock|behavior changed)\b/,
    /\btests pass|verification passed|runtime correction|new capability|moving parts\b/,
  ],
  narrative_delivery: [
    DELIVERY_SEQUENCE_CUES,
    DELIVERY_GATING_CUES,
    DELIVERY_ROLLOUT_CUES,
    DELIVERY_VERIFICATION_CUES,
    STRONG_DELIVERY_PHRASES,
  ],
  decision: [
    /\bwe chose|alternatives considered|trade-?off|rejected|consequence|rollback|decision\b/,
    /\bwhy this|preferred|governing rule|backward compatibility|namespace reuse\b/,
  ],
  handover_state: [
    /\bcontinuation|current state|next session|resume|paused|blocker|remaining effort|immediate next\b/,
    /\brecent action|next safe action|restart recipe|fresh session\b/,
  ],
  research_finding: [
    /\b(found that|finding|research|source|cited|upstream|investigation|synthesis|evidence)\b/,
    /\bcritical signal|hidden dependency|architecture conclusion|recommendation\b/,
  ],
  task_update: [
    /\[(?:x|X| )\]\s*T\d{3}|\bCHK-\d{3}\b|\bphase-\d\b/,
    /\bcompleted|started|remaining tasks|blocked tasks|completion criteria\b/,
  ],
  metadata_only: [
    /\b(trigger_phrases|importance_tier|contextType|_memory\.continuity|fingerprint|preflight|postflight|learningIndex)\b/i,
    /\bknowledgeScore|uncertaintyScore|contextScore|causal_links|session_id|completion_pct\b/,
  ],
  drop: [
    HARD_DROP_WRAPPER_CUES,
  ],
};

const CATEGORY_ORDER: RoutingCategory[] = [
  'decision',
  'task_update',
  'metadata_only',
  'handover_state',
  'research_finding',
  'narrative_delivery',
  'narrative_progress',
  'drop',
];

export function createContentRouter(dependencies: RouterDependencies = {}) {
  const deps = {
    prototypes: dependencies.prototypes ?? DEFAULT_PROTOTYPES,
    now: dependencies.now ?? Date.now,
    embedText: dependencies.embedText ?? ((text: string): number[] => lexicalVectorize(text)),
    classifyWithTier3: dependencies.classifyWithTier3 ?? (async (): Promise<null> => null),
    cache: dependencies.cache,
  };

  const prototypeEmbeddingCache = new Map<string, Promise<PrototypeEmbeddingRecord[]>>();

  return {
    async classifyContent(chunk: ContentChunk, context: RouterContext): Promise<RoutingDecision> {
      const normalizedContext = resolveSessionHintsForChunk(context, chunk);
      const normalizedText = normalizeChunkText(chunk.text);
      const chunkHash = createRoutingCacheKey(normalizedText);
      const tier1 = runTier1Rules(chunk, normalizedText);
      const tier2Reason = resolveTier2TriggerReason(tier1);
      const prototypeEmbeddings = await getPrototypeEmbeddings(
        deps.prototypes,
        deps.embedText,
        prototypeEmbeddingCache,
      );
      const tier2TopK = await runTier2Similarity(normalizedText, deps.embedText, prototypeEmbeddings, normalizedContext);

      const naturalDecision = await resolveNaturalDecision({
        chunk,
        normalizedText,
        chunkHash,
        context: normalizedContext,
        tier1,
        tier2TopK,
        tier2Reason,
        classifyWithTier3: deps.classifyWithTier3,
        cache: deps.cache,
        now: deps.now,
      });

      if (!chunk.routeAs) {
        return naturalDecision;
      }

      const overrideTarget = buildTarget(chunk.routeAs, normalizedContext.packet_level, normalizedContext.likely_phase_anchor);
      return {
        ...naturalDecision,
        category: chunk.routeAs,
        confidence: clampConfidence(Math.max(naturalDecision.confidence, TIER3_THRESHOLD)),
        target: overrideTarget,
        overrideApplied: true,
        overrideable: naturalDecision.overrideable,
        explanation: `Override applied: forced route to ${chunk.routeAs}; natural route was ${naturalDecision.category}.`,
        confidenceBand: confidenceBandFor(Math.max(naturalDecision.confidence, TIER3_THRESHOLD)),
        warningMessage: naturalDecision.category === 'drop'
          ? 'Override accepted against a natural drop classification; review before merge.'
          : naturalDecision.warningMessage,
        naturalDecision: {
          category: naturalDecision.category,
          confidence: naturalDecision.confidence,
          tierUsed: naturalDecision.tierUsed,
          target: naturalDecision.target,
        },
      };
    },
  };
}

async function resolveNaturalDecision(params: {
  chunk: ContentChunk;
  normalizedText: string;
  chunkHash: string;
  context: SessionHints;
  tier1: Tier1Result | null;
  tier2TopK: Tier2Hit[];
  tier2Reason: Tier2TriggerReason;
  classifyWithTier3: NonNullable<RouterDependencies['classifyWithTier3']>;
  cache?: RouterCache;
  now: () => number;
}): Promise<RoutingDecision> {
  const { chunk, normalizedText, chunkHash, context, tier1, tier2TopK, tier2Reason, classifyWithTier3, cache, now } = params;

  const tier1Top = tier1?.category
    ? makeDecisionFromCategory(tier1.category, tier1.confidence, 1, context, tier1, tier2TopK, null, chunkHash, tier2Reason)
    : null;

  if (tier1Top && tier1Top.confidence >= TIER1_THRESHOLD && tier2Reason !== 'mixed_signals' && tier2Reason !== 'margin_too_narrow') {
    return tier1Top;
  }

  const tier2Best = tier2TopK[0] ?? null;
  if (tier2Best && tier2Best.similarity >= TIER2_THRESHOLD) {
    return makeDecisionFromCategory(
      tier2Best.category,
      tier2Best.similarity,
      2,
      context,
      tier1,
      tier2TopK,
      null,
      chunkHash,
      tier2Reason,
    );
  }

  const tier3Input: Tier3ClassifierInput = {
    chunk_id: chunk.id,
    chunk_hash: chunkHash,
    chunk_text: chunk.text,
    chunk_text_normalized: normalizedText,
    chunk_char_count: chunk.text.length,
    source_field: chunk.sourceField ?? 'unknown',
    tier1,
    tier2_topk: tier2TopK,
    tier2_trigger_reason: tier2Reason,
    context,
  };

  const tier3Result = await resolveTier3Decision({
    input: tier3Input,
    context,
    classifyWithTier3,
    cache,
    now,
  });

  if (tier3Result && normalizeTier3Category(tier3Result.decision.category) !== 'drop' && tier3Result.decision.confidence >= TIER3_THRESHOLD) {
    return makeDecisionFromTier3(tier3Result, context, tier1, tier2TopK, chunkHash, tier2Reason);
  }

  if (tier3Result && normalizeTier3Category(tier3Result.decision.category) === 'drop' && tier3Result.decision.confidence >= TIER2_THRESHOLD) {
    return makeDecisionFromTier3(tier3Result, context, tier1, tier2TopK, chunkHash, tier2Reason);
  }

  if (tier2Best) {
    const fallbackConfidence = clampConfidence(tier2Best.similarity - TIER2_FALLBACK_PENALTY);
    if (fallbackConfidence >= TIER3_THRESHOLD) {
      return {
        ...makeDecisionFromCategory(tier2Best.category, fallbackConfidence, 2, context, tier1, tier2TopK, tier3Result, chunkHash, tier2Reason),
        warningMessage: `Tier 3 unavailable or below threshold; fell back to Tier 2 with ${TIER2_FALLBACK_PENALTY.toFixed(2)} confidence penalty.`,
      };
    }
  }

  const refusalCategory = normalizeTier3Category(tier3Result?.decision.category ?? tier2Best?.category ?? tier1?.category ?? 'drop');
  return {
    category: refusalCategory,
    confidence: clampConfidence(tier3Result?.decision.confidence ?? tier2Best?.similarity ?? tier1?.confidence ?? 0),
    target: refusalTarget(chunkHash),
    tierUsed: tier3Result ? 3 : tier2Best ? 2 : 1,
    explanation: tier3Result?.decision.reasoning ?? 'No routing category reached the 0.50 confidence floor; pending manual review.',
    overrideable: refusalCategory !== 'drop',
    confidenceBand: 'refuse',
    shouldLogForReview: true,
    warningMessage: 'Routing confidence below 0.50; manual review required before merge.',
    refusal: true,
    alternatives: collectAlternatives(refusalCategory, tier2TopK, tier3Result?.decision.alternatives ?? []),
    overrideApplied: false,
    cacheHit: tier3Result?.cacheScope != null,
    promptVersion: ROUTING_PROMPT_VERSION,
    tier1,
    tier2TopK,
    tier3: tier3Result,
    cacheKey: chunkHash,
    triggerReason: tier2Reason,
  };
}

function makeDecisionFromTier3(
  tier3Result: Tier3Outcome,
  context: SessionHints,
  tier1: Tier1Result | null,
  tier2TopK: Tier2Hit[],
  chunkHash: string,
  tier2Reason: Tier2TriggerReason,
): RoutingDecision {
  const finalCategory = normalizeTier3Category(tier3Result.decision.category);
  const fallbackTarget = buildTarget(finalCategory, context.packet_level, context.likely_phase_anchor);
  const confidence = clampConfidence(tier3Result.decision.confidence);
  const refusal = tier3Result.decision.merge_mode === 'refuse-to-route' || confidence < TIER3_THRESHOLD;

  return {
    category: finalCategory,
    confidence,
    target: refusal ? refusalTarget(chunkHash) : {
      docPath: tier3Result.decision.target_doc || fallbackTarget.docPath,
      anchorId: tier3Result.decision.target_anchor || fallbackTarget.anchorId,
      mergeMode: tier3Result.decision.merge_mode || fallbackTarget.mergeMode,
    },
    tierUsed: 3,
    explanation: tier3Result.decision.reasoning,
    overrideable: finalCategory !== 'drop',
    confidenceBand: refusal ? 'refuse' : confidenceBandFor(confidence),
    shouldLogForReview: refusal ? true : confidence < 0.9,
    warningMessage: refusal
      ? 'Tier 3 did not clear the 0.50 confidence floor; pending manual review.'
      : warningFor(confidence),
    refusal,
    alternatives: collectAlternatives(finalCategory, tier2TopK, tier3Result.decision.alternatives ?? []),
    overrideApplied: false,
    cacheHit: tier3Result.cacheScope != null,
    promptVersion: ROUTING_PROMPT_VERSION,
    tier1,
    tier2TopK,
    tier3: tier3Result,
    cacheKey: chunkHash,
    triggerReason: tier2Reason,
  };
}

function makeDecisionFromCategory(
  category: RoutingCategory,
  confidence: number,
  tierUsed: 1 | 2,
  context: SessionHints,
  tier1: Tier1Result | null,
  tier2TopK: Tier2Hit[],
  tier3: Tier3Outcome | null,
  chunkHash: string,
  tier2Reason: Tier2TriggerReason | null,
): RoutingDecision {
  return {
    category,
    confidence: clampConfidence(confidence),
    target: buildTarget(category, context.packet_level, context.likely_phase_anchor),
    tierUsed,
    explanation: tierUsed === 1
      ? `Tier 1 matched ${category}${tier1?.rule_id ? ` via ${tier1.rule_id}` : ''}.`
      : `Tier 2 nearest-prototype match selected ${category}.`,
    overrideable: category !== 'drop',
    confidenceBand: confidenceBandFor(confidence),
    shouldLogForReview: confidence < 0.9,
    warningMessage: warningFor(confidence),
    refusal: false,
    alternatives: collectAlternatives(category, tier2TopK, []),
    overrideApplied: false,
    cacheHit: false,
    promptVersion: ROUTING_PROMPT_VERSION,
    tier1,
    tier2TopK,
    tier3,
    cacheKey: chunkHash,
    triggerReason: tier2Reason,
  };
}

async function resolveTier3Decision(params: {
  input: Tier3ClassifierInput;
  context: SessionHints;
  classifyWithTier3: NonNullable<RouterDependencies['classifyWithTier3']>;
  cache?: RouterCache;
  now: () => number;
}): Promise<Tier3Outcome | null> {
  const { input, context, classifyWithTier3, cache, now } = params;
  const sessionKey = input.chunk_hash;

  if (cache) {
    const cachedSession = await cache.get('session', sessionKey, context);
    if (cachedSession) {
      return cacheEntryToOutcome(cachedSession, 'session');
    }
    const cachedFolder = await cache.get('spec-folder', sessionKey, context);
    if (cachedFolder) {
      return cacheEntryToOutcome(cachedFolder, 'spec-folder');
    }
  }

  const start = now();
  let raw: Tier3RawResponse | null;
  try {
    raw = await classifyWithTier3(input);
  } catch {
    return null;
  }
  if (!raw) {
    return null;
  }
  const validated = validateTier3Response(raw, input.chunk_hash);
  if (!validated) {
    return null;
  }

  const outcome: Tier3Outcome = {
    rawCategory: validated.category,
    decision: validated,
    latencyMs: Math.max(0, now() - start),
    usedRepairRetry: false,
    cacheScope: null,
  };

  if (cache && shouldCacheTier3(validated)) {
    const entry: Tier3CacheEntry = {
      promptVersion: ROUTING_PROMPT_VERSION,
      model: TIER3_MODEL,
      packetLevel: context.packet_level,
      category: validated.category,
      confidence: validated.confidence,
      targetDoc: validated.target_doc,
      targetAnchor: validated.target_anchor,
      mergeMode: validated.merge_mode,
      reasoning: validated.reasoning,
      alternatives: normalizeTier3Alternatives(validated.alternatives ?? []),
      createdAt: new Date(now()).toISOString(),
    };
    await cache.set('session', sessionKey, entry, Number.POSITIVE_INFINITY, context);
    await cache.set('spec-folder', sessionKey, entry, 24 * 60 * 60 * 1000, context);
  }

  return outcome;
}

function cacheEntryToOutcome(entry: Tier3CacheEntry, cacheScope: CacheScope): Tier3Outcome {
  const decision: Tier3RawResponse = {
    category: entry.category,
    confidence: entry.confidence,
    target_doc: entry.targetDoc,
    target_anchor: entry.targetAnchor,
    merge_mode: entry.mergeMode,
    reasoning: entry.reasoning,
    alternatives: entry.alternatives,
  };
  return {
    rawCategory: entry.category,
    decision,
    latencyMs: 0,
    usedRepairRetry: false,
    cacheScope,
  };
}

function shouldCacheTier3(decision: Tier3RawResponse): boolean {
  const normalizedCategory = normalizeTier3Category(decision.category);
  return decision.confidence >= TIER1_THRESHOLD || (normalizedCategory === 'drop' && decision.confidence >= TIER1_THRESHOLD);
}

function validateTier3Response(
  raw: Tier3RawResponse,
  chunkHash: string,
): Tier3RawResponse | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  if (!isTier3Category(raw.category)) {
    return null;
  }
  if (!isMergeMode(raw.merge_mode)) {
    return null;
  }

  const confidence = clampConfidence(raw.confidence);
  const fallbackTarget = confidence < TIER3_THRESHOLD
    ? refusalTarget(chunkHash)
    : null;

  return {
    category: raw.category,
    confidence,
    target_doc: fallbackTarget?.docPath ?? (typeof raw.target_doc === 'string' ? raw.target_doc : ''),
    target_anchor: fallbackTarget?.anchorId ?? (typeof raw.target_anchor === 'string' ? raw.target_anchor : ''),
    merge_mode: fallbackTarget?.mergeMode ?? raw.merge_mode,
    reasoning: typeof raw.reasoning === 'string'
      ? raw.reasoning.trim().slice(0, 200)
      : 'Tier 3 classification completed.',
    alternatives: normalizeTier3Alternatives(raw.alternatives ?? []),
  };
}

async function runTier2Similarity(
  normalizedText: string,
  embedText: NonNullable<RouterDependencies['embedText']>,
  prototypeEmbeddings: PrototypeEmbeddingRecord[],
  context: SessionHints,
): Promise<Tier2Hit[]> {
  const chunkEmbedding = await embedText(normalizedText);
  const scored = prototypeEmbeddings
    .map((record) => ({
      record,
      similarity: clampConfidence(cosineSimilarity(chunkEmbedding, record.embedding)),
    }))
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, 3);

  return scored.map((entry, index) => {
    const target = buildTarget(
      entry.record.category,
      context.packet_level,
      context.likely_phase_anchor,
    );
    return {
      rank: (index + 1) as 1 | 2 | 3,
      category: entry.record.category,
      prototype_id: entry.record.prototype.id,
      similarity: entry.similarity,
      target_doc: target.docPath,
      target_anchor: target.anchorId,
      merge_intent: target.mergeMode,
      cue_summary: `${entry.record.prototype.label} (${entry.record.prototype.tags.join(', ')})`,
    };
  });
}

async function getPrototypeEmbeddings(
  library: PrototypeLibrary,
  embedText: NonNullable<RouterDependencies['embedText']>,
  cache: Map<string, Promise<PrototypeEmbeddingRecord[]>>,
): Promise<PrototypeEmbeddingRecord[]> {
  const cacheKey = `${library.version}:${library.embeddingProfile}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const next = (async (): Promise<PrototypeEmbeddingRecord[]> => {
    const records: PrototypeEmbeddingRecord[] = [];
    for (const category of ROUTING_CATEGORIES) {
      for (const prototype of library.categories[category]) {
        records.push({
          category,
          prototype,
          embedding: await embedText(normalizeChunkText(prototype.chunk)),
        });
      }
    }
    return records;
  })();

  cache.set(cacheKey, next);
  return next;
}

function runTier1Rules(chunk: ContentChunk, normalizedText: string): Tier1Result {
  const hardMatch = TIER1_RULE_LIBRARY.find((rule) => rule.when(chunk, normalizedText));
  if (hardMatch) {
    return {
      matched: true,
      category: hardMatch.category,
      confidence: hardMatch.confidence,
      rule_id: hardMatch.id,
      hard_negative_flags: hardMatch.category === 'drop' ? ['drop-hardened'] : [],
      scores: { [hardMatch.category]: hardMatch.confidence },
      margin: 1,
    };
  }

  const scores = scoreCategories(chunk, normalizedText);
  const ranked = CATEGORY_ORDER
    .map((category) => ({ category, score: scores[category] ?? 0 }))
    .sort((left, right) => right.score - left.score);
  const best = ranked[0];
  const second = ranked[1];
  const confidence = clampConfidence(best?.score ?? 0.58);

  return {
    matched: confidence > 0,
    category: best?.category ?? 'narrative_progress',
    confidence,
    rule_id: best && best.score > 0 ? `tier1.heuristic.${best.category}` : 'tier1.heuristic.default-progress',
    hard_negative_flags: extractHardNegativeFlags(normalizedText),
    scores,
    margin: clampConfidence((best?.score ?? 0) - (second?.score ?? 0)),
  };
}

function scoreCategories(chunk: ContentChunk, normalizedText: string): Partial<Record<RoutingCategory, number>> {
  const scores: Partial<Record<RoutingCategory, number>> = {};
  const implementationVerbMatch = /\b(refactor|refactored|implement|implemented|merged|added|built|fixed|updated|patched|shipped)\b/.test(normalizedText);
  const deliveryMechanicMatchCount = [
    DELIVERY_SEQUENCE_CUES,
    DELIVERY_GATING_CUES,
    DELIVERY_ROLLOUT_CUES,
    DELIVERY_VERIFICATION_CUES,
  ].reduce((count, pattern) => count + (pattern.test(normalizedText) ? 1 : 0), 0);
  const strongDeliveryMechanics = STRONG_DELIVERY_PHRASES.test(normalizedText) || deliveryMechanicMatchCount >= 2;
  const strongHandoverLanguage = STRONG_HANDOVER_LANGUAGE.test(normalizedText);
  const hardDropWrapperSignals = HARD_DROP_WRAPPER_CUES.test(normalizedText);
  const softOperationalSignals = SOFT_OPERATIONAL_DROP_CUES.test(normalizedText);

  for (const category of ROUTING_CATEGORIES) {
    const cueScore = RULE_CUES[category].reduce((acc, pattern) => acc + (pattern.test(normalizedText) ? 0.18 : 0), 0);
    if (cueScore > 0) {
      scores[category] = cueScore;
    }
  }

  if (chunk.sourceField === 'observations' && implementationVerbMatch && !strongDeliveryMechanics) {
    scores.narrative_progress = Math.max(scores.narrative_progress ?? 0, 0.72);
  }
  if (chunk.sourceField === 'exchanges' && /\bimplemented|refactored|tests pass|added\b/.test(normalizedText) && !strongDeliveryMechanics) {
    scores.narrative_progress = Math.max(scores.narrative_progress ?? 0, 0.71);
  }
  if (DELIVERY_ROLLOUT_CUES.test(normalizedText) || strongDeliveryMechanics) {
    scores.narrative_delivery = Math.max(scores.narrative_delivery ?? 0, strongDeliveryMechanics ? 0.78 : 0.74);
  }
  if (/\bwe chose|alternatives considered|trade-?off|preferred|rejected|chose to\b/.test(normalizedText)) {
    scores.decision = Math.max(scores.decision ?? 0, 0.76);
  }
  if (/\[[ xX]\]\s*(?:T\d{3}|CHK-\d{3})/.test(chunk.text) || /\bT\d{3}\b/.test(normalizedText)) {
    scores.task_update = Math.max(scores.task_update ?? 0, 0.9);
  }
  if (strongHandoverLanguage) {
    scores.handover_state = Math.max(scores.handover_state ?? 0, softOperationalSignals ? 0.88 : 0.84);
  }
  if (/\bcited|source|found that|investigation|evidence|upstream\b/.test(normalizedText)) {
    scores.research_finding = Math.max(scores.research_finding ?? 0, 0.8);
  }
  if (/\bpreflight|postflight|trigger_phrases|importance_tier|contexttype|fingerprint|knowledgeScore\b/i.test(normalizedText)) {
    scores.metadata_only = Math.max(scores.metadata_only ?? 0, 0.93);
  }
  if (hardDropWrapperSignals) {
    scores.drop = Math.max(scores.drop ?? 0, 0.92);
  } else if (softOperationalSignals) {
    scores.drop = Math.max(scores.drop ?? 0, strongHandoverLanguage ? 0.36 : 0.6);
  }

  if (!Object.values(scores).some((score) => (score ?? 0) > 0)) {
    scores.narrative_progress = 0.58;
  }

  return scores;
}

function resolveTier2TriggerReason(tier1: Tier1Result | null): Tier2TriggerReason {
  if (!tier1) {
    return 'manual_retry';
  }
  if (tier1.hard_negative_flags.length > 0 && tier1.category !== 'drop') {
    return 'mixed_signals';
  }
  if (tier1.margin < 0.1) {
    return 'margin_too_narrow';
  }
  if ((tier1.confidence ?? 0) < TIER1_THRESHOLD) {
    return 'top1_below_0_70';
  }
  return 'manual_retry';
}

function extractHardNegativeFlags(normalizedText: string): string[] {
  const flags: string[] = [];
  if (/\bconversation transcript|assistant:|user:|tool:\b/.test(normalizedText)) {
    flags.push('transcript-like');
  }
  if (/\brecovery scenarios|diagnostic commands|table of contents\b/.test(normalizedText)) {
    flags.push('boilerplate');
  }
  if (/\btrigger_phrases|importance_tier|fingerprint|knowledgeScore\b/.test(normalizedText)) {
    flags.push('metadata-like');
  }
  return flags;
}

function buildTarget(
  category: RoutingCategory,
  packetLevel: PacketLevel,
  likelyPhaseAnchor: string | null,
): RoutingTarget {
  switch (category) {
    case 'narrative_progress':
      return { docPath: 'implementation-summary.md', anchorId: DEFAULT_PROGRESS_ANCHOR, mergeMode: 'append-as-paragraph' };
    case 'narrative_delivery':
      return { docPath: 'implementation-summary.md', anchorId: DEFAULT_DELIVERY_ANCHOR, mergeMode: 'append-as-paragraph' };
    case 'decision':
      if (packetLevel === 'L3' || packetLevel === 'L3+') {
        return { docPath: 'decision-record.md', anchorId: DEFAULT_DECISION_ANCHOR, mergeMode: 'insert-new-adr' };
      }
      return { docPath: 'implementation-summary.md', anchorId: 'decisions', mergeMode: 'update-in-place' };
    case 'handover_state':
      return { docPath: 'handover.md', anchorId: DEFAULT_HANDOVER_ANCHOR, mergeMode: 'append-section' };
    case 'research_finding':
      return { docPath: 'research/research.md', anchorId: DEFAULT_RESEARCH_ANCHOR, mergeMode: 'append-section' };
    case 'task_update':
      return { docPath: 'tasks.md', anchorId: likelyPhaseAnchor || DEFAULT_TASK_ANCHOR, mergeMode: 'update-in-place' };
    case 'metadata_only':
      return { docPath: 'spec-frontmatter', anchorId: DEFAULT_METADATA_ANCHOR, mergeMode: 'update-in-place' };
    case 'drop':
      return refusalTarget('drop');
  }
}

function refusalTarget(chunkHash: string): RoutingTarget {
  return {
    docPath: `${DROP_TARGET_PREFIX}${chunkHash}.json`,
    anchorId: MANUAL_REVIEW_ANCHOR,
    mergeMode: 'refuse-to-route',
  };
}

function collectAlternatives(
  winner: RoutingCategory,
  tier2TopK: Tier2Hit[],
  tier3Alternatives: Tier3RawAlternative[],
): RoutingAlternative[] {
  const byCategory = new Map<RoutingCategory, number>();
  for (const alt of tier3Alternatives) {
    const category = normalizeTier3Category(alt.category);
    if (category === winner) continue;
    byCategory.set(category, Math.max(byCategory.get(category) ?? 0, clampConfidence(alt.confidence)));
  }
  for (const hit of tier2TopK) {
    if (hit.category === winner) continue;
    byCategory.set(hit.category, Math.max(byCategory.get(hit.category) ?? 0, clampConfidence(hit.similarity)));
  }
  return [...byCategory.entries()]
    .map(([category, confidence]) => ({ category, confidence }))
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 2);
}

function confidenceBandFor(confidence: number): ConfidenceBand {
  if (confidence < TIER3_THRESHOLD) return 'refuse';
  if (confidence < TIER1_THRESHOLD) return 'warn';
  if (confidence < 0.9) return 'audit';
  return 'silent';
}

function warningFor(confidence: number): string | null {
  const band = confidenceBandFor(confidence);
  if (band === 'warn') {
    return `Routing confidence ${confidence.toFixed(2)} is below the silent threshold; review the selected target.`;
  }
  return null;
}

function normalizeChunkText(text: string): string {
  return normalizeContentForEmbedding(text)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2_048);
}

function normalizeContext(context: RouterContext): SessionHints {
  return {
    spec_folder: context.specFolder,
    packet_level: context.packetLevel,
    packet_kind: context.sessionMeta?.packet_kind ?? 'unknown',
    save_mode: context.sessionMeta?.save_mode ?? (context.sessionMeta?.likely_phase_anchor ? 'auto' : 'dry-run'),
    recent_docs_touched: context.sessionMeta?.recent_docs_touched ?? [],
    recent_anchors_touched: context.sessionMeta?.recent_anchors_touched ?? [],
    likely_phase_anchor: context.sessionMeta?.likely_phase_anchor ?? inferLikelyPhaseAnchor(context.existingAnchors),
    session_id: context.sessionMeta?.session_id,
  };
}

function resolveSessionHintsForChunk(context: RouterContext, chunk: ContentChunk): SessionHints {
  const normalizedContext = normalizeContext(context);
  return {
    ...normalizedContext,
    likely_phase_anchor: resolveLikelyPhaseAnchor(chunk, context, normalizedContext),
  };
}

function resolveLikelyPhaseAnchor(
  chunk: ContentChunk,
  context: RouterContext,
  normalizedContext: SessionHints,
): string | null {
  return (
    extractPhaseAnchorFromMetadata(chunk.metadata)
    ?? extractPhaseAnchorFromText(chunk.text)
    ?? context.sessionMeta?.recent_anchors_touched
      ?.map((anchor) => normalizePhaseAnchor(anchor))
      .find((anchor): anchor is string => anchor !== null)
    ?? normalizePhaseAnchor(context.sessionMeta?.likely_phase_anchor ?? null)
    ?? extractPhaseAnchorFromText(context.specFolder)
    ?? inferLikelyPhaseAnchor(context.existingAnchors)
    ?? normalizedContext.likely_phase_anchor
  );
}

function inferLikelyPhaseAnchor(existingAnchors?: string[]): string | null {
  return existingAnchors?.find((anchor) => /^phase-\d+$/i.test(anchor)) ?? null;
}

function extractPhaseAnchorFromMetadata(metadata?: Record<string, unknown>): string | null {
  if (!metadata) {
    return null;
  }

  return normalizePhaseAnchor(readString(metadata.targetAnchorId))
    ?? normalizePhaseAnchor(readString(metadata.target_anchor_id))
    ?? normalizePhaseAnchor(readString(metadata.phaseAnchor))
    ?? normalizePhaseAnchor(readString(metadata.phase_anchor));
}

function extractPhaseAnchorFromText(text: string): string | null {
  const match = text.match(/\bphase(?:[\s_-]+)?(\d+)\b/iu);
  return match ? `phase-${match[1]}` : null;
}

function normalizePhaseAnchor(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  const match = trimmed.match(/^phase(?:[\s_-]+)?(\d+)$/iu);
  return match ? `phase-${match[1]}` : null;
}

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function normalizeTier3Category(category: Tier3Category | RoutingCategory): RoutingCategory {
  return category === INTERNAL_TIER3_DROP ? 'drop' : category;
}

function normalizeTier3Alternatives(alternatives: Tier3RawAlternative[]): Tier3RawAlternative[] {
  return alternatives
    .filter((alternative) => isTier3Category(alternative.category))
    .map((alternative) => ({
      category: alternative.category,
      confidence: clampConfidence(alternative.confidence),
    }))
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 2);
}

function validatePrototypeLibrary(library: PrototypeLibrary): PrototypeLibrary {
  for (const category of ROUTING_CATEGORIES) {
    if (!Array.isArray(library.categories[category]) || library.categories[category].length === 0) {
      throw new Error(`routing-prototypes missing category ${category}`);
    }
  }
  return library;
}

function lexicalVectorize(text: string): number[] {
  const tokens = text.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean);
  const buckets = Array.from({ length: 64 }, () => 0);
  for (const token of tokens) {
    const digest = createHash('sha256').update(token).digest();
    const bucketIndex = digest[0] % buckets.length;
    buckets[bucketIndex] += 1;
  }
  return buckets;
}

function createRoutingCacheKey(normalizedText: string): string {
  return createHash('sha256').update(normalizedText).digest('hex');
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, Number(value)));
}

function isTier3Category(value: string): value is Tier3Category {
  return ROUTING_CATEGORIES.includes(value as RoutingCategory) || value === INTERNAL_TIER3_DROP;
}

function isMergeMode(value: string): value is MergeMode {
  return [
    'append-as-paragraph',
    'append-section',
    'insert-new-adr',
    'update-in-place',
    'refuse-to-route',
  ].includes(value);
}

export function buildTier3Prompt(input: Tier3ClassifierInput): { system: string; user: string } {
  const system = [
    'You are Tier 3 of the contentRouter for canonical continuity saves.',
    '',
    'Classify ONE chunk into exactly ONE of these 8 categories:',
    '- narrative_progress: what was built or changed; usually implementation-summary.md::what-built',
    '- narrative_delivery: how work was delivered, rolled out, sequenced, verified, or gated; usually implementation-summary.md::how-delivered',
    '- decision: choice, tradeoff, rationale, rejected alternative, or governing rule; L3/L3+ prefers decision-record.md, L2 prefers implementation-summary.md::decisions',
    '- task_update: task or checklist status mutation; usually tasks.md::<phase-anchor>',
    '- handover_state: recent action, blocker, next safe action, stop-state, or resume instruction; usually handover.md',
    '- research_finding: evidence, investigation result, cited upstream behavior, or research conclusion; usually research/research.md',
    '- metadata_only: machine-owned continuity payload such as preflight, postflight, causal links, fingerprints, or compact continuity fields; usually _memory.continuity',
    '- drop_candidate: transcript turns, generic recovery hints, tool telemetry, wrapper scaffolding, or other non-canonical content that should not merge into spec docs',
    '',
    'Confidence scale: 0.90-1.00 safe auto-route; 0.70-0.89 strong route; 0.50-0.69 weak route with warning; below 0.50 refuse.',
    'Refusal is first-class, not a ninth category. If no category reaches 0.50 confidence: choose the closest category, set merge_mode="refuse-to-route", target_doc="scratch/pending-route-{CHUNK_HASH}.json", and target_anchor="manual-review".',
    'Output rules: return ONE JSON object only; no markdown fences; no chain-of-thought; no extra prose; reasoning <= 200 chars; alternatives up to 2, sorted by confidence; category must be one of the 8 categories; confidence must be 0.0..1.0; merge_mode must be one of "append-as-paragraph", "append-section", "insert-new-adr", "update-in-place", "refuse-to-route".',
    'Merge-mode guidance: progress and delivery -> append-as-paragraph; handover and research -> append-section; L3/L3+ decision -> insert-new-adr; task_update, metadata_only, and L2 decision -> update-in-place; drop_candidate -> refuse-to-route.',
    'Never invent a new category, doc, anchor, or merge mode. If still uncertain below 0.50 after using the provided evidence, refuse.',
  ].join('\n');

  const user = [
    'Classify this save chunk.',
    `PROMPT_VERSION: ${ROUTING_PROMPT_VERSION}`,
    `CHUNK_ID: ${input.chunk_id}`,
    `CHUNK_HASH: ${input.chunk_hash}`,
    `PACKET_LEVEL: ${input.context.packet_level}`,
    `PACKET_KIND: ${input.context.packet_kind}`,
    `SAVE_MODE: ${input.context.save_mode}`,
    `SOURCE_FIELD: ${input.source_field}`,
    `RECENT_DOCS_TOUCHED: ${JSON.stringify(input.context.recent_docs_touched)}`,
    `RECENT_ANCHORS_TOUCHED: ${JSON.stringify(input.context.recent_anchors_touched)}`,
    `LIKELY_PHASE_ANCHOR: ${input.context.likely_phase_anchor ?? 'null'}`,
    'TIER1_RESULT:',
    JSON.stringify(input.tier1),
    'TIER2_TOP3:',
    JSON.stringify(input.tier2_topk),
    'TIER3_TRIGGER_REASON:',
    input.tier2_trigger_reason,
    'CHUNK_TEXT:',
    input.chunk_text,
    'Return JSON only.',
  ].join('\n');

  return { system, user };
}

export function createRoutingAuditEntry(
  decision: RoutingDecision,
  chunk: ContentChunk,
  context: RouterContext,
  decisionLatencyMs: number,
): RoutingAuditEntry {
  const normalizedContext = normalizeContext(context);
  return {
    ts: new Date().toISOString(),
    component: 'content-router',
    code: ROUTING_AUDIT_CODE,
    chunk_id: chunk.id,
    chunk_text_preview: chunk.text.slice(0, 120),
    chunk_hash: decision.cacheKey,
    tier_used: decision.tierUsed,
    category: decision.category,
    confidence: decision.confidence,
    target_doc: decision.target.docPath,
    target_anchor: decision.target.anchorId,
    merge_mode: decision.target.mergeMode,
    alternatives: decision.alternatives.map((alternative) => ({
      cat: alternative.category,
      conf: alternative.confidence,
    })),
    decision_latency_ms: decisionLatencyMs,
    spec_folder: normalizedContext.spec_folder,
    session_id: normalizedContext.session_id ?? null,
  };
}

export function getDefaultPrototypeLibrary(): PrototypeLibrary {
  return DEFAULT_PROTOTYPES;
}

export function getTier3Contract() {
  return {
    promptVersion: ROUTING_PROMPT_VERSION,
    model: TIER3_MODEL,
    reasoningEffort: TIER3_REASONING_EFFORT,
    temperature: TIER3_TEMPERATURE,
    maxOutputTokens: TIER3_MAX_OUTPUT_TOKENS,
    timeoutMs: TIER3_TIMEOUT_MS,
  };
}
