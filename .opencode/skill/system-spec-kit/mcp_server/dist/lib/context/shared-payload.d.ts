export type SharedPayloadKind = 'startup' | 'resume' | 'health' | 'bootstrap' | 'compaction';
export type SharedPayloadTrustState = 'live' | 'cached' | 'stale' | 'imported' | 'rebuilt' | 'rehomed';
export interface SharedPayloadSection {
    key: string;
    title: string;
    content: string;
    source: 'memory' | 'code-graph' | 'semantic' | 'session' | 'operational';
}
export interface SharedPayloadProvenance {
    producer: 'startup_brief' | 'session_snapshot' | 'session_resume' | 'session_health' | 'session_bootstrap' | 'compact_merger' | 'hook_cache';
    sourceSurface: string;
    trustState: SharedPayloadTrustState;
    generatedAt: string;
    lastUpdated: string | null;
    sourceRefs: string[];
}
export interface PreMergeSelectionMetadata {
    strategy: 'pre-merge';
    selectedFrom: string[];
    fileCount: number;
    topicCount: number;
    attentionSignalCount: number;
    notes: string[];
    antiFeedbackGuards: string[];
}
export interface SharedPayloadEnvelope {
    kind: SharedPayloadKind;
    summary: string;
    sections: SharedPayloadSection[];
    provenance: SharedPayloadProvenance;
    selection?: PreMergeSelectionMetadata;
}
export declare function summarizeUnknown(value: unknown, maxChars?: number): string;
export declare function createSharedPayloadEnvelope(input: {
    kind: SharedPayloadKind;
    sections: SharedPayloadSection[];
    provenance: SharedPayloadProvenance;
    summary?: string;
    selection?: PreMergeSelectionMetadata;
}): SharedPayloadEnvelope;
export declare function trustStateFromGraphState(graphState: 'ready' | 'stale' | 'empty' | 'missing'): SharedPayloadTrustState;
export declare function trustStateFromStructuralStatus(status: 'ready' | 'stale' | 'missing'): SharedPayloadTrustState;
export declare function trustStateFromCache(cachedAt: string, maxAgeMs: number, nowMs?: number): SharedPayloadTrustState;
export declare function createPreMergeSelectionMetadata(input: {
    selectedFrom: string[];
    fileCount: number;
    topicCount: number;
    attentionSignalCount: number;
    notes?: string[];
    antiFeedbackGuards?: string[];
}): PreMergeSelectionMetadata;
//# sourceMappingURL=shared-payload.d.ts.map