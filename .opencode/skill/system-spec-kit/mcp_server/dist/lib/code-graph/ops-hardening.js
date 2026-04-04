// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Ops Hardening
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 3: shared runtime hardening contract for
// readiness, repair, export/import, path identity, and previews.
export function normalizeStructuralReadiness(graphFreshness) {
    if (graphFreshness === 'fresh') {
        return 'ready';
    }
    if (graphFreshness === 'stale') {
        return 'stale';
    }
    return 'missing';
}
export function buildCodeGraphOpsContract(args) {
    const canonical = normalizeStructuralReadiness(args.graphFreshness);
    const readinessSummary = canonical === 'ready'
        ? 'Code graph readiness is unified and structurally usable.'
        : canonical === 'stale'
            ? 'Code graph exists but needs refresh before structural trust is high.'
            : 'Code graph is missing or unusable; fallback and repair flows should be used.';
    const readinessAction = canonical === 'ready'
        ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
        : canonical === 'stale'
            ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
            : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
    return {
        readiness: {
            canonical,
            graphFreshness: args.graphFreshness,
            sourceSurface: args.sourceSurface,
            summary: readinessSummary,
            recommendedAction: readinessAction,
        },
        doctor: {
            supported: true,
            surface: 'memory_health',
            checks: [
                'fts_consistency',
                'trigger_cache_refresh',
                'orphan_edges',
                'orphan_vectors',
                'orphan_chunks',
            ],
            repairModes: [
                'confirmation-gated autoRepair',
                'best-effort partial success reporting',
            ],
            recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
        },
        exportImport: {
            rawDbDumpAllowed: false,
            portableIdentityRequired: true,
            postImportRepairRequired: true,
            workspaceBoundRelativePaths: true,
            absolutePaths: 'allowed-for-import-only',
            recommendedAction: 'Treat export/import as a portable identity flow with post-import repair, never as a raw DB dump.',
        },
        previewPolicy: {
            mode: 'metadata-only',
            rawBinaryAllowed: false,
            recommendedFields: ['path', 'fileName', 'kind', 'sizeBytes', 'mimeType', 'lastModified'],
            recommendedAction: 'Expose metadata-only previews for non-text artifacts and avoid raw binary content in runtime context surfaces.',
        },
    };
}
export function createMetadataOnlyPreview(input) {
    const normalizedPath = input.path.replace(/\\/g, '/');
    const fileName = normalizedPath.split('/').filter(Boolean).pop() ?? normalizedPath;
    const kind = input.mimeType?.startsWith('text/')
        ? 'text'
        : input.mimeType
            ? 'binary'
            : 'unknown';
    return {
        mode: 'metadata-only',
        path: normalizedPath,
        fileName,
        kind,
        sizeBytes: input.sizeBytes ?? null,
        mimeType: input.mimeType ?? null,
        lastModified: input.lastModified ?? null,
        rawContentIncluded: false,
    };
}
//# sourceMappingURL=ops-hardening.js.map