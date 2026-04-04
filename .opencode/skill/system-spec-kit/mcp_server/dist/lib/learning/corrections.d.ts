import type Database from 'better-sqlite3';
/**
 * Describes the CorrectionTypes shape.
 */
export interface CorrectionTypes {
    readonly SUPERSEDED: 'superseded';
    readonly DEPRECATED: 'deprecated';
    readonly REFINED: 'refined';
    readonly MERGED: 'merged';
}
/**
 * Describes the StabilityChanges shape.
 */
export interface StabilityChanges {
    original: {
        before: number;
        after: number;
        penalty_applied: number;
    };
    correction: {
        before: number;
        after: number;
        boost_applied: number;
    } | null;
}
/**
 * Describes the CorrectionResult shape.
 */
export interface CorrectionResult {
    success: boolean;
    skipped?: boolean;
    reason?: string;
    correction_id?: number | bigint;
    original_memory_id?: number;
    correction_memory_id?: number | null;
    correction_type?: string;
    stability_changes?: StabilityChanges;
}
/**
 * Describes the CorrectionRecord shape.
 */
export interface CorrectionRecord {
    id: number;
    original_memory_id: number;
    correction_memory_id: number | null;
    correction_type: string;
    original_stability_before: number;
    original_stability_after: number;
    correction_stability_before: number | null;
    correction_stability_after: number | null;
    reason: string;
    corrected_by: string;
    created_at: string;
    is_undone: number;
    undone_at: string | null;
}
/**
 * Describes the CorrectionChainEntry shape.
 */
export interface CorrectionChainEntry extends CorrectionRecord {
    direction: string;
    depth: number;
}
/**
 * Describes the CorrectionWithTitles shape.
 */
export interface CorrectionWithTitles extends CorrectionRecord {
    original_title: string | null;
    correction_title: string | null;
}
/**
 * Describes the CorrectionChain shape.
 */
export interface CorrectionChain {
    memory_id: number;
    chain: CorrectionChainEntry[];
    total: number;
    max_depth_reached?: boolean;
    error?: string;
}
/**
 * Describes the CorrectionStats shape.
 */
export interface CorrectionStats {
    enabled: boolean;
    total: number;
    by_type: Record<string, number>;
    undone: number;
    recent_24h: number;
    error?: string;
}
/**
 * Describes the RecordCorrectionParams shape.
 */
export interface RecordCorrectionParams {
    original_memory_id: number;
    correction_memory_id?: number | null;
    correction_type: string;
    reason?: string | null;
    corrected_by?: string | null;
}
/**
 * Describes the UndoResult shape.
 */
export interface UndoResult {
    success: boolean;
    skipped?: boolean;
    reason?: string;
    error?: string;
    correction_id?: number;
    original_memory_id?: number;
    correction_memory_id?: number | null;
    stability_restored?: {
        original: number;
        correction: number | null;
    };
}
/**
 * Describes the SchemaResult shape.
 */
export interface SchemaResult {
    success: boolean;
    skipped?: boolean;
    reason?: string;
    error?: string;
}
/**
 * Defines the CORRECTION_TYPES constant.
 */
export declare const CORRECTION_TYPES: CorrectionTypes;
/**
 * Provides the get_correction_types helper.
 */
export declare function get_correction_types(): string[];
/**
 * Defines the CORRECTION_STABILITY_PENALTY constant.
 */
export declare const CORRECTION_STABILITY_PENALTY: number;
/**
 * Defines the REPLACEMENT_STABILITY_BOOST constant.
 */
export declare const REPLACEMENT_STABILITY_BOOST: number;
/**
 * Provides the init helper.
 */
export declare function init(database: Database.Database): SchemaResult;
/**
 * Provides the get_db helper.
 */
export declare function get_db(): Database.Database | null;
/**
 * Provides the is_enabled helper.
 */
export declare function is_enabled(): boolean;
/**
 * Provides the ensure_schema helper.
 */
export declare function ensure_schema(): SchemaResult;
/**
 * Provides the record_correction helper.
 */
export declare function record_correction(params: RecordCorrectionParams): CorrectionResult;
/**
 * Provides the undo_correction helper.
 */
export declare function undo_correction(correction_id: number): UndoResult;
/**
 * Provides the get_corrections_for_memory helper.
 */
export declare function get_corrections_for_memory(memory_id: number, options?: {
    include_undone?: boolean;
    limit?: number;
}): CorrectionWithTitles[];
/**
 * Provides the get_correction_chain helper.
 */
export declare function get_correction_chain(memory_id: number, options?: {
    max_depth?: number;
}): CorrectionChain;
/**
 * Provides the get_corrections_stats helper.
 */
export declare function get_corrections_stats(): CorrectionStats;
/**
 * Provides the deprecate_memory helper.
 */
export declare function deprecate_memory(memory_id: number, reason?: string): CorrectionResult;
/**
 * Provides the supersede_memory helper.
 */
export declare function supersede_memory(old_memory_id: number, new_memory_id: number, reason?: string): CorrectionResult;
/**
 * Provides the refine_memory helper.
 */
export declare function refine_memory(original_id: number, refined_id: number, reason?: string): CorrectionResult;
/**
 * Provides the merge_memories helper.
 */
export declare function merge_memories(source_ids: number[], merged_id: number, reason?: string): CorrectionResult[];
export { record_correction as recordCorrection, undo_correction as undoCorrection, get_corrections_for_memory as getCorrectionsForMemory, get_correction_chain as getCorrectionChain, get_corrections_stats as getCorrectionsStats, get_correction_types as getCorrectionTypes, deprecate_memory as deprecateMemory, supersede_memory as supersedeMemory, refine_memory as refineMemory, merge_memories as mergeMemories, is_enabled as isEnabled, ensure_schema as ensureSchema, get_db as getDb, };
//# sourceMappingURL=corrections.d.ts.map