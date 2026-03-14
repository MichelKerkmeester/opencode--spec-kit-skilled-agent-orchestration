// ───────────────────────────────────────────────────────────────
// MODULE: Architecture Boundary Check Types
// ───────────────────────────────────────────────────────────────
// Public declaration surface for architecture-boundary audit helpers.

interface GapAViolation {
    file: string;
    line: number;
    importPath: string;
}
interface GapBViolation {
    file: string;
    reasons: string[];
}
declare function findTsFiles(dir: string): string[];
declare function resolvePackageRoot(startDir: string): string;
declare function extractModuleSpecifiers(content: string, filePath: string): Array<{
    importPath: string;
    line: number;
}>;
declare function countSubstantiveLines(content: string): number;
declare function checkSharedNeutrality(packageRoot?: string): GapAViolation[];
declare function checkWrapperOnly(packageRoot?: string): GapBViolation[];
declare function runArchitectureBoundaryCheck(packageRoot?: string): {
    gapAViolations: GapAViolation[];
    gapBViolations: GapBViolation[];
};
export { checkSharedNeutrality, checkWrapperOnly, countSubstantiveLines, extractModuleSpecifiers, findTsFiles, resolvePackageRoot, runArchitectureBoundaryCheck, };
//# sourceMappingURL=check-architecture-boundaries.d.ts.map
