import type Database from 'better-sqlite3';
import type { ParsedMemory } from '../parsing/memory-parser.js';
import { type HistoryLineageEvent } from './history.js';
type MemoryIndexRow = Record<string, unknown> & {
    id: number;
    spec_folder: string;
    file_path: string;
    canonical_file_path?: string | null;
    anchor_id?: string | null;
    tenant_id?: string | null;
    user_id?: string | null;
    agent_id?: string | null;
    session_id?: string | null;
    shared_space_id?: string | null;
    title?: string | null;
    content_hash?: string | null;
    created_at?: string;
    updated_at?: string;
};
type LineageTransitionEvent = 'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'BACKFILL';
interface MemoryLineageRow {
    memory_id: number;
    logical_key: string;
    version_number: number;
    root_memory_id: number;
    predecessor_memory_id: number | null;
    superseded_by_memory_id: number | null;
    valid_from: string;
    valid_to: string | null;
    transition_event: LineageTransitionEvent;
    actor: string;
    metadata: string | null;
    created_at: string;
}
interface ActiveProjectionRow {
    logical_key: string;
    root_memory_id: number;
    active_memory_id: number;
    updated_at: string;
}
interface RecordLineageTransitionOptions {
    actor?: string;
    predecessorMemoryId?: number | null;
    transitionEvent?: LineageTransitionEvent;
    validFrom?: string;
    historyEvents?: HistoryLineageEvent[];
}
interface RecordedLineageTransition {
    logicalKey: string;
    versionNumber: number;
    rootMemoryId: number;
    activeMemoryId: number;
    predecessorMemoryId: number | null;
    transitionEvent: LineageTransitionEvent;
}
interface ResolvedLineageSnapshot {
    logicalKey: string;
    memoryId: number;
    versionNumber: number;
    rootMemoryId: number;
    validFrom: string;
    validTo: string | null;
    transitionEvent: LineageTransitionEvent;
    snapshot: MemoryIndexRow;
}
interface LineageInspectionSummary {
    logicalKey: string;
    rootMemoryId: number;
    activeMemoryId: number | null;
    activeVersionNumber: number | null;
    totalVersions: number;
    versionNumbers: number[];
    historicalMemoryIds: number[];
    firstValidFrom: string;
    latestValidFrom: string;
    actors: string[];
    transitionCounts: Record<LineageTransitionEvent, number>;
    hasVersionGaps: boolean;
    hasMultipleActiveVersions: boolean;
}
interface ValidateLineageIntegrityResult {
    valid: boolean;
    issues: string[];
    activeProjectionCount: number;
    lineageRowCount: number;
    missingPredecessors: number[];
    duplicateActiveLogicalKeys: string[];
    projectionMismatches: string[];
}
interface BackfillLineageResult {
    dryRun: boolean;
    scanned: number;
    seeded: number;
    skipped: number;
    logicalKeys: string[];
    totalGroups: number;
}
interface LineageWriteBenchmarkResult {
    memoryIds: number[];
    iterations: number;
    insertedVersions: number;
    durationMs: number;
    averageWriteMs: number;
    logicalKey: string | null;
    rootMemoryId: number | null;
    activeMemoryId: number | null;
    finalVersionNumber: number | null;
}
interface CreateAppendOnlyMemoryRecordParams {
    database: Database.Database;
    parsed: ParsedMemory;
    filePath: string;
    embedding: Float32Array | null;
    embeddingFailureReason: string | null;
    predecessorMemoryId: number;
    actor?: string;
}
/**
 * Seed lineage state from an existing memory row when no lineage entry exists yet.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version to seed into lineage tables.
 * @param options - Optional actor, timestamps, and transition metadata.
 * @returns Seeded lineage state for the requested memory version.
 */
export declare function seedLineageFromCurrentState(database: Database.Database, memoryId: number, options?: RecordLineageTransitionOptions): RecordedLineageTransition;
/**
 * Seed or append a lineage transition for a memory version.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version being recorded.
 * @param options - Transition details such as predecessor and actor.
 * @returns Recorded lineage state for the requested memory version.
 */
export declare function recordLineageTransition(database: Database.Database, memoryId: number, options?: RecordLineageTransitionOptions): RecordedLineageTransition;
/**
 * Create a new append-only memory row and wire it into lineage state.
 *
 * @param params - Parsed memory payload and append-only lineage metadata.
 * @returns Identifier of the newly inserted memory row.
 */
export declare function createAppendOnlyMemoryRecord(params: CreateAppendOnlyMemoryRecordParams): number;
/**
 * Return the full ordered lineage chain for the logical key behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Ordered lineage snapshots from oldest to newest version.
 */
export declare function inspectLineageChain(database: Database.Database, memoryId: number): ResolvedLineageSnapshot[];
/**
 * Build a compact operator-facing summary for the lineage behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Aggregated lineage summary when one exists.
 */
export declare function summarizeLineageInspection(database: Database.Database, memoryId: number): LineageInspectionSummary | null;
/**
 * Resolve the currently active lineage snapshot for a memory logical key.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Active lineage snapshot when one exists.
 */
export declare function resolveActiveLineageSnapshot(database: Database.Database, memoryId: number): ResolvedLineageSnapshot | null;
/**
 * Resolve the lineage snapshot visible at a specific point in time.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @param asOf - Timestamp used for temporal resolution.
 * @returns Snapshot active at the requested time when one exists.
 */
export declare function resolveLineageAsOf(database: Database.Database, memoryId: number, asOf: string | Date): ResolvedLineageSnapshot | null;
/**
 * Validate lineage chains and active projections for structural drift.
 *
 * @param database - Database connection that stores lineage state.
 * @returns Integrity report describing missing predecessors and projection drift.
 */
export declare function validateLineageIntegrity(database: Database.Database): ValidateLineageIntegrityResult;
/**
 * Backfill lineage state from existing memory rows in append-only order.
 *
 * @param database - Database connection that stores lineage state.
 * @param options - Dry-run and actor settings for the backfill.
 * @returns Backfill summary including scanned and seeded rows.
 */
export declare function backfillLineageState(database: Database.Database, options?: {
    dryRun?: boolean;
    actor?: string;
}): BackfillLineageResult;
/**
 * Resolve the active projection row for the lineage that owns a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Active projection row when one exists.
 */
export declare function getActiveProjectionRow(database: Database.Database, memoryId: number): ActiveProjectionRow | null;
/**
 * Resolve the latest lineage row for the logical key behind a memory.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory identifier used to resolve the logical key.
 * @returns Latest lineage row when one exists.
 */
export declare function getLatestLineageForMemory(database: Database.Database, memoryId: number): MemoryLineageRow | null;
/**
 * Compatibility wrapper used by roadmap tests and save flows for lineage writes.
 *
 * @param database - Database connection that stores lineage state.
 * @param params - Memory identifier and transition metadata to record.
 * @returns Recorded lineage transition for the requested memory version.
 */
export declare function recordLineageVersion(database: Database.Database, params: {
    memoryId: number;
    actor?: string;
    predecessorMemoryId?: number | null;
    effectiveAt?: string;
    transitionEvent?: LineageTransitionEvent;
}): RecordedLineageTransition;
/**
 * Compatibility wrapper that resolves the active snapshot for a memory target.
 *
 * @param database - Database connection that stores lineage state.
 * @param target - Memory identifier used to resolve the active snapshot.
 * @returns Active lineage snapshot when one exists.
 */
export declare function getActiveMemoryProjection(database: Database.Database, target: {
    memoryId: number;
}): ResolvedLineageSnapshot | null;
/**
 * Compatibility wrapper that resolves the snapshot visible at a given time.
 *
 * @param database - Database connection that stores lineage state.
 * @param target - Memory identifier and `asOf` timestamp to resolve.
 * @returns Snapshot active at the requested time when one exists.
 */
export declare function resolveMemoryAsOf(database: Database.Database, target: {
    memoryId: number;
    asOf: string | Date;
}): ResolvedLineageSnapshot | null;
/**
 * Compatibility wrapper that executes the lineage backfill workflow.
 *
 * @param database - Database connection that stores lineage state.
 * @param options - Dry-run and actor settings for the backfill.
 * @returns Backfill summary including scanned and seeded rows.
 */
export declare function runLineageBackfill(database: Database.Database, options?: {
    dryRun?: boolean;
    actor?: string;
}): BackfillLineageResult;
/**
 * Benchmark append-first lineage writes across an ordered chain of memory ids.
 *
 * @param database - Database connection that stores lineage state.
 * @param options - Ordered memory ids and optional actor label for the benchmark run.
 * @returns Lightweight write-path timing and final projection details.
 */
export declare function benchmarkLineageWritePath(database: Database.Database, options: {
    memoryIds: number[];
    actor?: string;
}): LineageWriteBenchmarkResult;
/**
 * Public lineage result types exposed to tests and compatibility helpers.
 */
export type { ActiveProjectionRow, BackfillLineageResult, LineageInspectionSummary, LineageWriteBenchmarkResult, RecordedLineageTransition, ResolvedLineageSnapshot, ValidateLineageIntegrityResult, };
//# sourceMappingURL=lineage-state.d.ts.map