import type { FileChange } from '../types/session-types';
export declare function normalizeFilePath(rawPath: string): string;
export declare function getParentDirectory(filePath: string): string;
export declare function isWithinDirectory(parentDir: string, candidatePath: string): boolean;
export declare function resolveTreeThinningContent(file: FileChange, specFolderPath: string): string;
export declare function listSpecFolderKeyFiles(specFolderPath: string): Array<{
    FILE_PATH: string;
}>;
export declare function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{
    FILE_PATH: string;
}>;
export declare function buildAlignmentKeywords(specFolderPath: string): string[];
//# sourceMappingURL=workflow-path-utils.d.ts.map