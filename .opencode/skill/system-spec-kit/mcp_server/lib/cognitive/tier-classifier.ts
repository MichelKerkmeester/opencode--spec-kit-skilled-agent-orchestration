// ───────────────────────────────────────────────────────────────
// MODULE: Tier Classifier
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// Fs and path removed — unused in this module

// Import FSRS constants and canonical retrievability function.
import {
  FSRS_HALF_LIFE_FACTOR,
  calculateRetrievability as calculateFsrsRetrievability
} from './fsrs-scheduler.js';
import type { MemoryDbRow } from '@spec-kit/shared/types';

/**
 * Loose input type for tier classification functions.
 * Accepts any partial DB row plus arbitrary extra fields (camelCase
 * fallbacks, search-enriched properties, etc.).
 */
type TierInput = Partial<MemoryDbRow> & Record<string, unknown>;

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
----------------------------------------------------------------*/

/** Parse threshold from env var with validation */
function parseThreshold(envVar: string, defaultVal: number): number {
  const parsed = parseFloat(process.env[envVar] || '');
  return !isNaN(parsed) && parsed >= 0 && parsed <= 1 ? parsed : defaultVal;
}

/** Parse integer limit from env var with validation */
function parseLimit(envVar: string, defaultVal: number): number {
  const parsed = parseInt(process.env[envVar] || '', 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : defaultVal;
}

// 5-State Model thresholds based on FSRS retrievability R = (1 + FACTOR * t / S)^DECAY
const STATE_THRESHOLDS = {
  HOT: 0.80,
  WARM: 0.25,
  COLD: 0.05,
  DORMANT: 0.02,
} as const;

const ARCHIVED_DAYS_THRESHOLD = 90;

interface TierConfigType {
  hotThreshold: number;
  warmThreshold: number;
  coldThreshold: number;
  archivedDaysThreshold: number;
  maxHotMemories: number;
  maxWarmMemories: number;
  maxColdMemories: number;
  maxDormantMemories: number;
  maxArchivedMemories: number;
  summaryFallbackLength: number;
}

const TIER_CONFIG: TierConfigType = {
  hotThreshold: parseThreshold('HOT_THRESHOLD', STATE_THRESHOLDS.HOT),
  warmThreshold: parseThreshold('WARM_THRESHOLD', STATE_THRESHOLDS.WARM),
  coldThreshold: parseThreshold('COLD_THRESHOLD', STATE_THRESHOLDS.COLD),
  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
  maxHotMemories: parseLimit('MAX_HOT_MEMORIES', 5),
  maxWarmMemories: parseLimit('MAX_WARM_MEMORIES', 10),
  maxColdMemories: parseLimit('MAX_COLD_MEMORIES', 3),
  maxDormantMemories: parseLimit('MAX_DORMANT_MEMORIES', 2),
  maxArchivedMemories: parseLimit('MAX_ARCHIVED_MEMORIES', 1),
  summaryFallbackLength: 150,
};

// Validate threshold ordering (HOT > WARM > COLD)
if (TIER_CONFIG.hotThreshold <= TIER_CONFIG.warmThreshold) {
  console.warn('[tier-classifier] Invalid thresholds: HOT must be > WARM. Using defaults.');
  TIER_CONFIG.hotThreshold = STATE_THRESHOLDS.HOT;
  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
}
if (TIER_CONFIG.warmThreshold <= TIER_CONFIG.coldThreshold) {
  console.warn('[tier-classifier] Invalid thresholds: WARM must be > COLD. Using defaults.');
  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
  TIER_CONFIG.coldThreshold = STATE_THRESHOLDS.COLD;
}

/* ───────────────────────────────────────────────────────────────
   1.5 TYPE-SPECIFIC HALF-LIVES (REQ-002, T008)
----------------------------------------------------------------*/

type TierState = 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';

// TierInput derived from MemoryDbRow (shared/normalization.ts)

interface StateContent {
  state: TierState;
  memories: TierInput[];
  count: number;
}

interface StateStats {
  HOT: number;
  WARM: number;
  COLD: number;
  DORMANT: number;
  ARCHIVED: number;
  total: number;
}

// Lazy-load memory types to avoid circular dependencies
let memoryTypesModule: Record<string, unknown> | false | null = null;
let memoryTypesModulePromise: Promise<Record<string, unknown> | false> | null = null;

async function loadMemoryTypesModule(): Promise<Record<string, unknown> | false> {
  if (memoryTypesModule !== null) {
    return memoryTypesModule;
  }
  if (memoryTypesModulePromise !== null) {
    return memoryTypesModulePromise;
  }

  const loadPromise = (async (): Promise<Record<string, unknown> | false> => {
    try {
      memoryTypesModule = await import('../config/memory-types.js');
      return memoryTypesModule;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[tier-classifier] memory-types module not available:', msg);
      memoryTypesModule = false;
      return false;
    }
  })();

  memoryTypesModulePromise = loadPromise;
  try {
    return await loadPromise;
  } finally {
    if (memoryTypesModulePromise === loadPromise) {
      memoryTypesModulePromise = null;
    }
  }
}

/** Get memory types module (lazy loaded) */
function getMemoryTypesModule(): Record<string, unknown> | null {
  if (memoryTypesModule !== null) {
    return memoryTypesModule || null;
  }
  if (memoryTypesModulePromise === null) {
    void loadMemoryTypesModule();
  }
  return null;
}

/**
 * Get effective half-life for a memory based on its type (REQ-002, CHK-017)
 * Priority: explicit half_life_days > memory_type lookup > default
 */
function getEffectiveHalfLife(memory: TierInput | null | undefined): number | null {
  if (!memory || typeof memory !== 'object') {
    return 60; // Default to declarative half-life
  }

  // Priority 1: Explicit half_life_days override
  if (typeof memory.half_life_days === 'number' && memory.half_life_days > 0) {
    return memory.half_life_days;
  }
  if (typeof memory.halfLifeDays === 'number' && memory.halfLifeDays > 0) {
    return memory.halfLifeDays;
  }

  // Priority 2: Look up by memory_type
  const memoryType = memory.memory_type;
  if (memoryType && typeof memoryType === 'string') {
    const typesModule = getMemoryTypesModule();
    if (typesModule && typeof typesModule === 'object') {
      const getHalfLife = (typesModule as Record<string, unknown>).getHalfLifeForType;
      if (typeof getHalfLife === 'function') {
        const halfLife = getHalfLife(memoryType);
        if (typeof halfLife === 'number' && Number.isFinite(halfLife) && halfLife > 0) {
          return halfLife;
        }
      }
    }
  }

  // Priority 3: Default based on importance tier
  const tier = memory.importance_tier;
  if (tier === 'constitutional' || tier === 'critical') {
    return null; // No decay for constitutional/critical
  }

  return 60; // Default declarative half-life
}

/**
 * Convert half-life in days to FSRS stability value.
 *
 * FSRS v4 retrievability: R(t) = (1 + FACTOR * t / S)^DECAY
 * where FACTOR = 19/81, DECAY = -0.5.
 *
 * Half-life means R(h) = 0.5:
 *   0.5 = (1 + (19/81) * h / S)^(-0.5)
 *   => S = FSRS_HALF_LIFE_FACTOR * h  (= 19/243 * h)
 *
 * NOTE: The old formula (h / ln(2)) assumed exponential decay R = e^(-t/S),
 * which yielded stability ~18.5x too high for the FSRS power-law model.
 */
function halfLifeToStability(halfLifeDays: number | null): number {
  if (halfLifeDays === null || halfLifeDays <= 0) {
    return 999999; // Effectively infinite stability (no decay)
  }
  // Use canonical FSRS_HALF_LIFE_FACTOR from fsrs-scheduler.ts
  // S = FSRS_HALF_LIFE_FACTOR * halfLife  (derived from FSRS power-law half-life equation)
  return FSRS_HALF_LIFE_FACTOR * halfLifeDays;
}

/* ───────────────────────────────────────────────────────────────
   2. CORE CLASSIFICATION FUNCTIONS
----------------------------------------------------------------*/

/**
 * Calculate retrievability using FSRS formula.
 * R = (1 + FACTOR * t / S)^DECAY
 */
function calculateRetrievability(stability: number, elapsedDays: number): number {
  if (stability <= 0 || elapsedDays < 0) return 0;
  return calculateFsrsRetrievability(stability, elapsedDays);
}

/**
 * Classify memory into 5-state model based on retrievability.
 *
 * Accepts either:
 *   - Two numbers: classifyState(retrievability, elapsedDays)
 *   - A memory object: classifyState(memoryOrObj) where R is extracted from
 *     retrievability, attentionScore, or defaults to 0
 *   - null/undefined: returns 'DORMANT'
 */
function classifyState(
  retrievabilityOrMemory: number | TierInput | null | undefined,
  elapsedDays?: number,
): TierState {
  let r: number;
  let days: number;

  if (retrievabilityOrMemory === null || retrievabilityOrMemory === undefined) {
    return 'DORMANT';
  }

  if (typeof retrievabilityOrMemory === 'number') {
    // Direct numeric call: classifyState(0.95, 5)
    r = retrievabilityOrMemory;
    days = typeof elapsedDays === 'number' ? elapsedDays : 0;
  } else if (typeof retrievabilityOrMemory === 'object') {
    // Memory object call: classifyState(memoryObj)
    const mem = retrievabilityOrMemory as Record<string, unknown>;
    if (typeof mem.retrievability === 'number') {
      r = mem.retrievability;
    } else if (typeof mem.attentionScore === 'number') {
      r = mem.attentionScore;
    } else {
      r = 0;
    }
    // Extract elapsed days from lastAccess or created_at
    const timestamp = mem.lastAccess || mem.last_accessed || mem.lastReview || mem.last_review || mem.created_at;
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      const lastDate = new Date(timestamp as string | number);
      const now = new Date();
      days = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      days = 0;
    }
  } else {
    return 'DORMANT';
  }

  // ARCHIVED requires BOTH conditions: old age AND very low retrievability
  // (days > 90 AND r < 0.02). Using || here would incorrectly archive
  // Recent memories with low R, or old memories with high R.
  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
    return 'ARCHIVED';
  }
  if (r >= TIER_CONFIG.hotThreshold) return 'HOT';
  if (r >= TIER_CONFIG.warmThreshold) return 'WARM';
  if (r >= TIER_CONFIG.coldThreshold) return 'COLD';
  return 'DORMANT';
}

/**
 * Classify a memory's importance tier based on its properties.
 */
function classifyTier(memory: TierInput): {
  state: TierState;
  retrievability: number;
  effectiveHalfLife: number | null;
} {
  const stability = memory.stability ?? 1.0;
  const lastReview = memory.last_review || memory.created_at;
  const effectiveHalfLife = getEffectiveHalfLife(memory);

  // If no decay (constitutional/critical), always HOT
  if (effectiveHalfLife === null) {
    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
  }

  // Pinned memories are always HOT
  if (memory.is_pinned === 1) {
    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
  }

  // Calculate elapsed days
  let elapsedDays = 0;
  if (lastReview) {
    const lastDate = new Date(lastReview);
    const now = new Date();
    elapsedDays = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Use effective stability from half-life.
  // Math.max ensures new memories (default stability=1.0) benefit from their
  // Type's configured half-life, while well-reviewed memories keep their
  // Earned FSRS stability if it exceeds the type baseline.
  const effectiveStability = halfLifeToStability(effectiveHalfLife);
  const finalStability = Math.max(stability, effectiveStability);

  const retrievability = calculateRetrievability(finalStability, elapsedDays);
  const state = classifyState(retrievability, elapsedDays);

  return { state, retrievability, effectiveHalfLife };
}

/* ───────────────────────────────────────────────────────────────
   3. QUERY FUNCTIONS
----------------------------------------------------------------*/

/**
 * Get memories filtered and classified by state.
 */
function getStateContent(
  memories: TierInput[],
  targetState: TierState,
  limit: number = 20
): StateContent {
  const filtered = memories
    .map(m => ({
      ...m,
      _classification: classifyTier(m),
    }))
    .filter(m => m._classification.state === targetState)
    .slice(0, limit);

  return {
    state: targetState,
    memories: filtered,
    count: filtered.length,
  };
}

/**
 * T210: Per-tier limit map used by filterAndLimitByState.
 * When applyStateLimits is true, each tier is capped to its max count.
 * If a tier has fewer results than its limit, the surplus slots are
 * redistributed to other tiers that have overflow (in priority order).
 */
const PER_TIER_LIMITS: Record<TierState, number> = {
  HOT: TIER_CONFIG.maxHotMemories,
  WARM: TIER_CONFIG.maxWarmMemories,
  COLD: TIER_CONFIG.maxColdMemories,
  DORMANT: TIER_CONFIG.maxDormantMemories,
  ARCHIVED: TIER_CONFIG.maxArchivedMemories,
};

/** Priority order for tier overflow redistribution (highest priority first) */
const TIER_PRIORITY: TierState[] = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];

/**
 * Filter memories by state and apply limits.
 * Generic over any type assignable to TierInput so callers preserve their
 * concrete element type without double-casting.
 *
 * T210: When no targetState is specified, enforces per-tier quantity limits
 * (HOT: 5, WARM: 10, COLD: 3, DORMANT: 2, ARCHIVED: 1 by default).
 * If a tier has fewer results than its limit, surplus slots are redistributed
 * to other tiers in priority order to maximize total result count.
 */
function filterAndLimitByState<T extends TierInput>(
  memories: T[],
  targetState: TierState | null = null,
  limit: number = 20
): T[] {
  type ClassifiedEntry = {
    memory: T;
    classification: ReturnType<typeof classifyTier>;
  };
  let classified: ClassifiedEntry[] = memories.map((memory) => ({
    memory,
    classification: classifyTier(memory),
  }));

  if (targetState) {
    classified = classified.filter((entry) => entry.classification.state === targetState);
  }

  // Apply per-tier limits with overflow redistribution
  if (!targetState) {
    // Group by tier
    const byTier: Record<TierState, typeof classified> = {
      HOT: [], WARM: [], COLD: [], DORMANT: [], ARCHIVED: [],
    };
    for (const entry of classified) {
      const state = entry.classification.state;
      byTier[state].push(entry);
    }

    // Calculate surplus slots from under-filled tiers
    let surplusSlots = 0;
    for (const tier of TIER_PRIORITY) {
      const tierLimit = PER_TIER_LIMITS[tier];
      const available = byTier[tier].length;
      if (available < tierLimit) {
        surplusSlots += tierLimit - available;
      }
    }

    // Apply limits, distributing surplus to over-filled tiers in priority order
    const result: typeof classified = [];
    for (const tier of TIER_PRIORITY) {
      const tierLimit = PER_TIER_LIMITS[tier];
      const available = byTier[tier].length;
      const overflow = Math.max(0, available - tierLimit);

      if (overflow > 0 && surplusSlots > 0) {
        // This tier has overflow; grant it some surplus slots
        const extraSlots = Math.min(overflow, surplusSlots);
        surplusSlots -= extraSlots;
        result.push(...byTier[tier].slice(0, tierLimit + extraSlots));
      } else {
        result.push(...byTier[tier].slice(0, tierLimit));
      }
    }

    classified = result;
  }

  return classified.slice(0, limit).map((entry) => entry.memory);
}

/**
 * Format state response for API output.
 */
function formatStateResponse(memories: TierInput[]): Array<{
  id: number;
  title: string;
  state: TierState;
  retrievability: number;
  specFolder: string;
  filePath: string;
}> {
  return memories.map(m => {
    const classification = classifyTier(m);
    return {
      id: m.id ?? 0,
      title: m.title || 'Untitled',
      state: classification.state,
      retrievability: Math.round(classification.retrievability * 100) / 100,
      specFolder: m.spec_folder || '',
      filePath: m.file_path || '',
    };
  });
}

/**
 * Get statistics for each state.
 * Accepts any array of TierInput-compatible objects.
 */
function getStateStats(memories: readonly TierInput[]): StateStats {
  const stats: StateStats = {
    HOT: 0,
    WARM: 0,
    COLD: 0,
    DORMANT: 0,
    ARCHIVED: 0,
    total: memories.length,
  };

  for (const memory of memories) {
    const { state } = classifyTier(memory);
    stats[state]++;
  }

  return stats;
}

/**
 * Determine if a memory should be archived.
 */
function shouldArchive(memory: TierInput): boolean {
  const { state } = classifyTier(memory);

  // Never archive constitutional or critical
  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
    return false;
  }

  // Pinned memories are never archived
  if (memory.is_pinned === 1) {
    return false;
  }

  return state === 'ARCHIVED' || state === 'DORMANT';
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
----------------------------------------------------------------*/

export {
  // Constants
  STATE_THRESHOLDS,
  ARCHIVED_DAYS_THRESHOLD,
  TIER_CONFIG,
  PER_TIER_LIMITS,
  TIER_PRIORITY,

  // Core functions
  classifyState,
  calculateRetrievability,
  classifyTier,
  getEffectiveHalfLife,
  halfLifeToStability,

  // Query functions
  getStateContent,
  filterAndLimitByState,
  formatStateResponse,
  getStateStats,
  shouldArchive,
};

export type {
  TierState,
  TierInput,
  StateContent,
  StateStats,
  TierConfigType,
};
