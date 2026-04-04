import { findConstitutionalFiles, findSpecDocuments, detectSpecLevel } from './memory-index-discovery.js';
import { summarizeAliasConflicts, runDivergenceReconcileHooks } from './memory-index-alias.js';
import type { MCPResponse } from './types.js';
interface IndexResult {
    status: string;
    id?: number;
    specFolder?: string;
    title?: string | null;
    error?: string;
    errorDetail?: string;
    [key: string]: unknown;
}
interface ScanArgs {
    specFolder?: string | null;
    force?: boolean;
    includeConstitutional?: boolean;
    includeSpecDocs?: boolean;
    incremental?: boolean;
}
/** Index a single memory file, delegating to the shared indexMemoryFile logic */
declare function indexSingleFile(filePath: string, force?: boolean, options?: {
    qualityGateMode?: 'enforce' | 'warn-only';
}): Promise<IndexResult>;
/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
declare function handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse>;
export { handleMemoryIndexScan, indexSingleFile, findConstitutionalFiles, findSpecDocuments, detectSpecLevel, summarizeAliasConflicts, runDivergenceReconcileHooks, };
declare const handle_memory_index_scan: typeof handleMemoryIndexScan;
declare const index_single_file: typeof indexSingleFile;
declare const find_constitutional_files: typeof findConstitutionalFiles;
declare const find_spec_documents: typeof findSpecDocuments;
declare const detect_spec_level: typeof detectSpecLevel;
declare const summarize_alias_conflicts: typeof summarizeAliasConflicts;
declare const run_divergence_reconcile_hooks: typeof runDivergenceReconcileHooks;
export { handle_memory_index_scan, index_single_file, find_constitutional_files, find_spec_documents, detect_spec_level, summarize_alias_conflicts, run_divergence_reconcile_hooks, };
//# sourceMappingURL=memory-index.d.ts.map