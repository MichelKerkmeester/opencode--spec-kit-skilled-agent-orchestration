import type { ModificationMagnitude } from '../types/session-types';
type ChangeAction = 'modify' | 'add' | 'delete' | 'rename';
export type GitRepositoryState = 'clean' | 'dirty' | 'unavailable';
export interface GitContextExtraction {
    observations: Array<{
        type: string;
        title: string;
        narrative: string;
        timestamp: string;
        facts: string[];
        files: string[];
        _provenance: 'git';
        _synthetic: true;
    }>;
    FILES: Array<{
        FILE_PATH: string;
        DESCRIPTION: string;
        ACTION?: string;
        MODIFICATION_MAGNITUDE: ModificationMagnitude;
        _provenance: 'git';
    }>;
    summary: string;
    commitCount: number;
    uncommittedCount: number;
    headRef: string | null;
    commitRef: string | null;
    repositoryState: GitRepositoryState;
    isDetachedHead: boolean;
}
interface ModificationMagnitudeInput {
    changeScore?: number;
    action?: ChangeAction;
    commitTouches?: number;
}
export declare function deriveModificationMagnitude({ changeScore, action, commitTouches, }: ModificationMagnitudeInput): ModificationMagnitude;
export declare function extractGitContext(projectRoot: string, specFolderHint?: string): Promise<GitContextExtraction>;
export {};
//# sourceMappingURL=git-context-extractor.d.ts.map