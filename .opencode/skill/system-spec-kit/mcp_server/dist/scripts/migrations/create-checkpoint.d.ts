#!/usr/bin/env node
interface CliArgs {
    dbPath: string;
    outputDir: string;
    name: string;
    note: string | null;
    json: boolean;
}
interface CreateCheckpointResult {
    ok: true;
    checkpointPath: string;
    metadataPath: string;
    schemaVersion: number | null;
    sizeBytes: number;
}
/**
 * Resolve the default database path from environment or known project locations.
 *
 * @returns Absolute path to the SQLite database file.
 */
declare function resolveDefaultDbPath(): string;
/**
 * Parse CLI arguments into a structured args object.
 *
 * @param argv - Raw argument strings from the command line.
 * @returns Parsed CLI arguments with defaults applied.
 */
declare function parseArgs(argv: string[]): CliArgs;
declare function toSafeSlug(value: string): string;
declare function toTimestampId(date: Date): string;
/**
 * Read the current schema version from a SQLite database.
 *
 * @param dbPath - Path to the SQLite database file.
 * @returns Schema version number, or `null` if unavailable.
 */
declare function getSchemaVersion(dbPath: string): number | null;
/**
 * Execute the checkpoint creation workflow: copy database and write metadata sidecar.
 *
 * @param args - Parsed CLI arguments specifying database, output, and label.
 * @returns Result containing the checkpoint and metadata file paths.
 */
declare function runCreateCheckpoint(args: CliArgs): CreateCheckpointResult;
/**
 * CLI entry point: parse arguments, create checkpoint, and print results.
 *
 * @param argv - Command-line arguments (defaults to `process.argv.slice(2)`).
 * @returns Checkpoint creation result.
 */
declare function main(argv?: string[]): CreateCheckpointResult;
export { getSchemaVersion, main, parseArgs, resolveDefaultDbPath, runCreateCheckpoint, toSafeSlug, toTimestampId, };
export type { CliArgs, CreateCheckpointResult, };
//# sourceMappingURL=create-checkpoint.d.ts.map