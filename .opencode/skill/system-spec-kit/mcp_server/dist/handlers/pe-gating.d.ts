export { calculateDocumentWeight, isSpecDocumentType } from '../lib/storage/document-helpers.js';
interface ParsedMemory {
    specFolder: string;
    filePath: string;
    title: string | null;
    triggerPhrases: string[];
    content: string;
    contentHash: string;
    contextType: string;
    importanceTier: string;
    documentType?: string;
    qualityScore?: number;
    qualityFlags?: string[];
}
interface SimilarMemory {
    id: number;
    similarity: number;
    content: string;
    stability: number;
    difficulty: number;
    file_path: string;
    [key: string]: unknown;
}
import type { PeDecision } from './save/types.js';
interface IndexResult extends Record<string, unknown> {
    status: string;
    id: number;
    specFolder: string;
    title: string | null;
    triggerPhrases?: string[];
    contextType?: string;
    importanceTier?: string;
    previous_stability?: number;
    newStability?: number;
    retrievability?: number;
    success?: boolean;
    error?: string;
}
/** Find memories with similar embeddings for PE gating deduplication */
declare function findSimilarMemories(embedding: Float32Array | null, options?: {
    limit?: number;
    specFolder?: string | null;
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    sessionId?: string | null;
    sharedSpaceId?: string | null;
}): SimilarMemory[];
/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
declare function reinforceExistingMemory(memoryId: number, parsed: ParsedMemory): IndexResult;
/** Mark a memory as superseded (deprecated) when a newer contradicting version is saved */
declare function markMemorySuperseded(memoryId: number): boolean;
/** Append a new immutable version and advance the active projection. */
declare function updateExistingMemory(memoryId: number, parsed: ParsedMemory, embedding: Float32Array): IndexResult;
/** Log a prediction-error gating decision to the memory_conflicts table */
declare function logPeDecision(decision: PeDecision, contentHash: string, specFolder: string): void;
export { findSimilarMemories, reinforceExistingMemory, markMemorySuperseded, updateExistingMemory, logPeDecision, };
export type { SimilarMemory, PeDecision, };
//# sourceMappingURL=pe-gating.d.ts.map