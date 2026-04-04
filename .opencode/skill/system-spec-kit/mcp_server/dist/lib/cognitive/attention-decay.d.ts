import type Database from 'better-sqlite3';
import type { FiveFactorWeights } from '../scoring/composite-scoring.js';
interface DecayRateByTier {
    constitutional: number;
    critical: number;
    important: number;
    normal: number;
    temporary: number;
    deprecated: number;
    [key: string]: number;
}
interface DecayConfigType {
    defaultDecayRate: number;
    decayRateByTier: DecayRateByTier;
    minScoreThreshold: number;
}
declare const DECAY_CONFIG: DecayConfigType;
declare function init(database: Database.Database): void;
declare function getDb(): Database.Database | null;
declare function getDecayRate(importanceTier: string | null | undefined): number;
/**
 * Calculate retrievability-based decay using FSRS formula.
 */
declare function calculateRetrievabilityDecay(stability: number, elapsedDays: number): number;
/**
 * Apply FSRS-based decay to a memory.
 */
declare function applyFsrsDecay(memory: Record<string, unknown>, baseScore?: number): number;
/**
 * Activate a memory (boost its decay score via access recording).
 */
declare function activateMemory(memoryId: number): boolean;
/**
 * Activate memory with FSRS review update.
 */
declare function activateMemoryWithFsrs(memoryId: number, grade?: number): boolean;
interface AttentionBreakdown {
    temporal: number;
    usage: number;
    importance: number;
    pattern: number;
    citation: number;
    composite: number;
    weights: FiveFactorWeights;
}
/**
 * Calculate composite attention score using 5-factor model.
 */
declare function calculateCompositeAttention(memory: Record<string, unknown>, options?: {
    weights?: Record<string, number>;
}): number;
/**
 * Get detailed attention breakdown for a memory.
 */
declare function getAttentionBreakdown(memory: Record<string, unknown>): AttentionBreakdown;
/**
 * Apply composite decay to a list of memories and return sorted by score.
 */
declare function applyCompositeDecay(memories: Array<Record<string, unknown>>): Array<Record<string, unknown> & {
    attentionScore: number;
}>;
/**
 * Get active memories sorted by attention score.
 */
declare function getActiveMemories(limit?: number): Array<Record<string, unknown>>;
/**
 * Clear session state.
 */
declare function clearSession(): void;
export { DECAY_CONFIG, init, getDb, getDecayRate, calculateRetrievabilityDecay, applyFsrsDecay, activateMemory, activateMemoryWithFsrs, calculateCompositeAttention, getAttentionBreakdown, applyCompositeDecay, getActiveMemories, clearSession, };
export type { DecayConfigType, DecayRateByTier, AttentionBreakdown, };
//# sourceMappingURL=attention-decay.d.ts.map