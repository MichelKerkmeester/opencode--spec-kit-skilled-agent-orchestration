export type GraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';
export type StructuralReadiness = 'ready' | 'stale' | 'missing';
export interface MetadataOnlyPreview {
    mode: 'metadata-only';
    path: string;
    fileName: string;
    kind: 'text' | 'binary' | 'unknown';
    sizeBytes: number | null;
    mimeType: string | null;
    lastModified: string | null;
    rawContentIncluded: false;
}
export interface CodeGraphOpsContract {
    readiness: {
        canonical: StructuralReadiness;
        graphFreshness: GraphFreshness;
        sourceSurface: string;
        summary: string;
        recommendedAction: string;
    };
    doctor: {
        supported: true;
        surface: 'memory_health';
        checks: string[];
        repairModes: string[];
        recommendedAction: string;
    };
    exportImport: {
        rawDbDumpAllowed: false;
        portableIdentityRequired: true;
        postImportRepairRequired: true;
        workspaceBoundRelativePaths: true;
        absolutePaths: 'allowed-for-import-only';
        recommendedAction: string;
    };
    previewPolicy: {
        mode: 'metadata-only';
        rawBinaryAllowed: false;
        recommendedFields: string[];
        recommendedAction: string;
    };
}
export declare function normalizeStructuralReadiness(graphFreshness: GraphFreshness): StructuralReadiness;
export declare function buildCodeGraphOpsContract(args: {
    graphFreshness: GraphFreshness;
    sourceSurface: string;
}): CodeGraphOpsContract;
export declare function createMetadataOnlyPreview(input: {
    path: string;
    sizeBytes?: number | null;
    mimeType?: string | null;
    lastModified?: string | null;
}): MetadataOnlyPreview;
//# sourceMappingURL=ops-hardening.d.ts.map