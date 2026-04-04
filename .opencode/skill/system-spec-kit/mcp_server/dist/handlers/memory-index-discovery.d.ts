export interface SpecDiscoveryOptions {
    specFolder?: string | null;
}
/**
 * Discover spec folder documents (.opencode/specs/ directory tree).
 * Finds spec.md, plan.md, tasks.md, checklist.md, decision-record.md,
 * implementation-summary.md, research/research.md, handover.md.
 *
 * Excludes scratch/, memory/, iterations/, and hidden directories.
 */
export declare function findSpecDocuments(workspacePath: string, options?: SpecDiscoveryOptions): string[];
/**
 * Detect the spec documentation level from a spec.md file.
 * Reads first 2KB looking for <!-- SPECKIT_LEVEL: N --> marker.
 * Falls back to document completeness heuristic if marker not found.
 */
export declare function detectSpecLevel(specPath: string): number | null;
/** Discover constitutional memory files from skill constitutional directories. */
export declare function findConstitutionalFiles(workspacePath: string): string[];
//# sourceMappingURL=memory-index-discovery.d.ts.map