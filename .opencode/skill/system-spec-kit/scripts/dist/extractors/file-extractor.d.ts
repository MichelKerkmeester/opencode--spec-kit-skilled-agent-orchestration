import type { CollectedDataSubset, FileChange, Observation, ObservationDetailed } from '../types/session-types';
export type { FileChange, ObservationDetailed };
/** Raw observation input used during file extraction. */
export type ObservationInput = Observation;
/** Semantic summary for a file referenced by the session. */
export interface SemanticFileInfo {
    description: string;
    action: string;
}
declare function detectObservationType(obs: ObservationInput): string;
declare function extractFilesFromData(collectedData: CollectedDataSubset<'FILES' | 'filesModified'> | null, observations: ObservationInput[] | null): FileChange[];
declare function enhanceFilesWithSemanticDescriptions(files: FileChange[], semanticFileChanges: Map<string, SemanticFileInfo>): FileChange[];
declare function buildObservationsWithAnchors(observations: ObservationInput[] | null, specFolder: string): ObservationDetailed[];
/**
 * Deduplicate observations that represent repeated tool calls on the same file.
 * Merges consecutive observations with identical titles into a single entry with
 * a count annotation and combined facts.
 */
declare function deduplicateObservations(observations: ObservationInput[]): ObservationInput[];
export { detectObservationType, extractFilesFromData, enhanceFilesWithSemanticDescriptions, buildObservationsWithAnchors, deduplicateObservations, };
//# sourceMappingURL=file-extractor.d.ts.map