import { ALIGNMENT_CONFIG } from './alignment-validator';
import type { AlignmentCollectedData } from './alignment-validator';
interface FolderQualityAssessment {
    score: number;
    label: 'active' | 'scratch' | 'test-fixture' | 'archive';
    reasons: string[];
    isArchive: boolean;
    isTestFixture: boolean;
    isScratch: boolean;
}
interface SessionCandidate {
    path: string;
    canonicalKey: string;
    quality: FolderQualityAssessment;
    recencyMs: number;
    recencyIso: string;
    sourceSpecFolder: string;
}
interface AutoDetectCandidate {
    path: string;
    canonicalKey: string;
    relativePath: string;
    folderName: string;
    quality: FolderQualityAssessment;
    depth: number;
    effectiveDepth: number;
    idVector: number[];
    mtimeMs: number;
    gitStatusCount: number;
    sessionActivityBoost: number;
    sessionActivitySignalCount: number;
    recentlyActiveChildCount: number;
}
interface CandidateConfidence {
    lowConfidence: boolean;
    reason: string;
}
interface SessionCandidateTestInput {
    path: string;
    recencyMs: number;
    canonicalKey?: string;
}
interface AutoCandidateTestInput {
    path: string;
    relativePath?: string;
    mtimeMs: number;
    canonicalKey?: string;
    effectiveDepth?: number;
    gitStatusCount?: number;
    sessionActivityBoost?: number;
    sessionActivitySignalCount?: number;
    recentlyActiveChildCount?: number;
}
declare function filterArchiveFolders(folders: string[]): string[];
declare function isPathWithin(parentPath: string, childPath: string): boolean;
declare function isUnderApprovedSpecsRoots(specPath: string): boolean;
declare function normalizeSpecReferenceForLookup(specFolderRef: string): string;
declare function assessFolderQuality(relativePath: string): FolderQualityAssessment;
declare function collectAutoDetectCandidates(specsDirs: string[]): Promise<AutoDetectCandidate[]>;
declare const TEST_HELPERS: {
    normalizeSpecReferenceForLookup: typeof normalizeSpecReferenceForLookup;
    assessFolderQuality: typeof assessFolderQuality;
    isPathWithin: typeof isPathWithin;
    isUnderApprovedSpecsRoots: typeof isUnderApprovedSpecsRoots;
    resolveSessionSpecFolderPaths: (rawSpecFolder: string, specsDirs: string[]) => Promise<string[]>;
    collectAutoDetectCandidates: typeof collectAutoDetectCandidates;
    rankSessionCandidates: (inputs: SessionCandidateTestInput[]) => SessionCandidate[];
    rankAutoDetectCandidates: (inputs: AutoCandidateTestInput[]) => AutoDetectCandidate[];
    rankGitStatusCandidates: (inputs: AutoCandidateTestInput[]) => AutoDetectCandidate[];
    rankSessionActivityCandidates: (inputs: AutoCandidateTestInput[]) => AutoDetectCandidate[];
    assessSessionConfidence: (inputs: SessionCandidateTestInput[]) => CandidateConfidence;
    assessAutoDetectConfidence: (inputs: AutoCandidateTestInput[]) => CandidateConfidence;
    assessGitStatusConfidence: (inputs: AutoCandidateTestInput[]) => CandidateConfidence;
    assessSessionActivityConfidence: (inputs: AutoCandidateTestInput[]) => CandidateConfidence;
    decideSessionAction: (inputs: SessionCandidateTestInput[], interactive: boolean) => {
        action: string;
        reason: string;
    };
    decideAutoDetectAction: (inputs: AutoCandidateTestInput[], interactive: boolean) => {
        action: string;
        reason: string;
    };
};
declare function detectSpecFolder(collectedData?: AlignmentCollectedData | null, options?: {
    specFolderArg?: string | null;
}): Promise<string>;
export { ALIGNMENT_CONFIG, TEST_HELPERS, detectSpecFolder, filterArchiveFolders, };
//# sourceMappingURL=folder-detector.d.ts.map