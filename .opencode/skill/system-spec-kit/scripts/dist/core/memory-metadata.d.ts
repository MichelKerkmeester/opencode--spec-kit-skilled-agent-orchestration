import type { CollectedDataFull } from '../extractors/collect-session-data';
import type { MemoryEvidenceSnapshot } from '@spec-kit/shared/parsing/memory-sufficiency';
import type { FileChange } from '../types/session-types';
export type MemoryClassificationContext = {
    MEMORY_TYPE: string;
    HALF_LIFE_DAYS: number;
    BASE_DECAY_RATE: number;
    ACCESS_BOOST_FACTOR: number;
    RECENCY_WEIGHT: number;
    IMPORTANCE_MULTIPLIER: number;
};
export type SessionDedupContext = {
    MEMORIES_SURFACED_COUNT: number;
    DEDUP_SAVINGS_TOKENS: number;
    FINGERPRINT_HASH: string;
    SIMILAR_MEMORIES: Array<{
        MEMORY_ID: string;
        SIMILARITY_SCORE: number;
    }>;
};
export type CausalLinksContext = {
    CAUSED_BY: string[];
    SUPERSEDES: string[];
    DERIVED_FROM: string[];
    BLOCKS: string[];
    RELATED_TO: string[];
};
export type WorkflowObservationEvidence = {
    TITLE?: string;
    title?: string;
    NARRATIVE?: string;
    narrative?: string;
    FACTS?: unknown[];
    facts?: unknown[];
    _synthetic?: boolean;
    _provenance?: string;
    _specRelevant?: boolean;
};
export type WorkflowDecisionEvidence = {
    TITLE?: string;
    CHOSEN?: string;
    RATIONALE?: string;
    CONTEXT?: string;
};
export type WorkflowOutcomeEvidence = {
    OUTCOME?: string;
};
export declare function inferMemoryType(contextType: string, importanceTier: string): string;
export declare function defaultHalfLifeDays(memoryType: string): number;
export declare function baseDecayRateFromHalfLife(halfLifeDays: number): number;
export declare function importanceMultiplier(importanceTier: string): number;
export declare function buildMemoryClassificationContext(collectedData: CollectedDataFull, sessionData: {
    CONTEXT_TYPE: string;
    IMPORTANCE_TIER: string;
}): MemoryClassificationContext;
export declare function buildSessionDedupContext(collectedData: CollectedDataFull, sessionData: {
    SESSION_ID: string;
    SUMMARY: string;
}, memoryTitle: string): SessionDedupContext;
export declare function buildCausalLinksContext(collectedData: CollectedDataFull): CausalLinksContext;
export declare function buildWorkflowMemoryEvidenceSnapshot(params: {
    title: string;
    content: string;
    triggerPhrases: string[];
    files: FileChange[];
    observations: WorkflowObservationEvidence[];
    decisions: WorkflowDecisionEvidence[];
    outcomes: WorkflowOutcomeEvidence[];
    nextAction?: string;
    blockers?: string;
    recentContext?: Array<{
        request?: string;
        learning?: string;
    }>;
}): MemoryEvidenceSnapshot;
/** Also used by frontmatter-editor; exported for reuse. */
export declare function extractAnchorIds(content: string): string[];
//# sourceMappingURL=memory-metadata.d.ts.map