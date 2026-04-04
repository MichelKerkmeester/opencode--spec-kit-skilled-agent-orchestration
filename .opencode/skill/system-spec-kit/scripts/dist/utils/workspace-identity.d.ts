export interface WorkspaceIdentity {
    canonicalOpencodePath: string;
    workspaceRoot: string;
    inputPath: string;
    matchPaths: string[];
}
declare function normalizeAbsolutePath(filePath: string): string;
declare function findNearestOpencodeDirectory(candidatePath: string): string | null;
export declare function buildWorkspaceIdentity(workspacePath: string): WorkspaceIdentity;
export declare function getWorkspacePathVariants(workspacePath: string): string[];
export declare function isSameWorkspacePath(workspacePath: string, candidatePath: string | null | undefined): boolean;
export declare function toWorkspaceRelativePath(workspacePath: string, maybeFilePath: string): string;
export { findNearestOpencodeDirectory, normalizeAbsolutePath, };
//# sourceMappingURL=workspace-identity.d.ts.map