import type { CollectedDataSubset } from '../types/session-types';
export interface SpecAffinityTargets {
    specFolderHint: string;
    resolvedSpecFolderPath: string | null;
    specId: string | null;
    exactPhrases: string[];
    strongKeywordTokens: string[];
    fileTargets: string[];
}
export interface SpecAffinityEvaluation {
    hasAnchor: boolean;
    matchedFileTargets: string[];
    matchedPhrases: string[];
    matchedKeywordTokens: string[];
    matchedSpecId: boolean;
    foreignSpecIds: string[];
}
type SpecAffinityCollectedData = CollectedDataSubset<'userPrompts' | 'recentContext' | 'observations' | 'FILES' | 'SUMMARY'>;
declare function normalizeText(value: string): string;
declare function normalizePathLike(value: string): string;
declare function extractSpecIds(value: string): string[];
export declare function buildSpecAffinityTargets(specFolderHint?: string | null): SpecAffinityTargets;
export declare function matchesSpecAffinityFilePath(filePath: string, targets: SpecAffinityTargets): boolean;
export declare function evaluateSpecAffinityText(text: string, targets: SpecAffinityTargets): {
    matchedFileTargets: string[];
    matchedPhrases: string[];
    matchedKeywordTokens: string[];
    matchedSpecId: boolean;
    foreignSpecIds: string[];
};
export declare function matchesSpecAffinityText(text: string, targets: SpecAffinityTargets): boolean;
export declare function evaluateCollectedDataSpecAffinity(data: SpecAffinityCollectedData, targetsOrHint: SpecAffinityTargets | string): SpecAffinityEvaluation;
export { extractSpecIds, normalizePathLike, normalizeText, };
//# sourceMappingURL=spec-affinity.d.ts.map