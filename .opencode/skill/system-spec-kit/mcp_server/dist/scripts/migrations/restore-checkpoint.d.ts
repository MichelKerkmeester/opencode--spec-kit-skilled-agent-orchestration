#!/usr/bin/env node
interface CliArgs {
    checkpointPath: string;
    dbPath: string;
    backupDir: string;
    force: boolean;
    json: boolean;
}
interface RestoreCheckpointResult {
    ok: true;
    restoredAt: string;
    checkpointPath: string;
    targetDbPath: string;
    backupPath: string | null;
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
declare function toTimestampId(date: Date): string;
/**
 * Verify that a file is a valid SQLite database by reading its master table.
 *
 * @param dbPath - Path to the SQLite database file to verify.
 */
declare function verifySqliteFile(dbPath: string): void;
/**
 * Execute the checkpoint restore workflow: backup existing DB then copy checkpoint in place.
 *
 * @param args - Parsed CLI arguments specifying checkpoint source and target.
 * @returns Result containing the restored path and optional backup location.
 */
declare function runRestoreCheckpoint(args: CliArgs): RestoreCheckpointResult;
/**
 * CLI entry point: parse arguments, restore checkpoint, and print results.
 *
 * @param argv - Command-line arguments (defaults to `process.argv.slice(2)`).
 * @returns Checkpoint restore result.
 */
declare function main(argv?: string[]): RestoreCheckpointResult;
export { main, parseArgs, resolveDefaultDbPath, runRestoreCheckpoint, toTimestampId, verifySqliteFile, };
export type { CliArgs, RestoreCheckpointResult, };
//# sourceMappingURL=restore-checkpoint.d.ts.map