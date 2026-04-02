#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Migration Checkpoint Create
// ───────────────────────────────────────────────────────────────
// Create a point-in-time SQLite checkpoint before schema migrations.
// Feature catalog: Migration checkpoint scripts
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import Database from 'better-sqlite3';
import { getMemoryRoadmapDefaults } from '../../lib/config/capability-flags.js';

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
function resolveDefaultDbPath(): string {
  const candidates = [
    process.env.MEMORY_DB_PATH,
    path.resolve(process.cwd(), '.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite'),
    path.resolve(process.cwd(), 'mcp_server/database/context-index.sqlite'),
    path.resolve(process.cwd(), 'database/context-index.sqlite'),
  ].filter((candidate): candidate is string => typeof candidate === 'string' && candidate.trim().length > 0);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return path.resolve(candidate);
    }
  }

  return path.resolve(candidates[0] ?? path.resolve(process.cwd(), 'database/context-index.sqlite'));
}

/**
 * Parse CLI arguments into a structured args object.
 *
 * @param argv - Raw argument strings from the command line.
 * @returns Parsed CLI arguments with defaults applied.
 */
function parseArgs(argv: string[]): CliArgs {
  const defaults = {
    dbPath: resolveDefaultDbPath(),
    outputDir: '',
    name: 'migration-checkpoint',
    note: null as string | null,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--db' && argv[index + 1]) {
      defaults.dbPath = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--out' && argv[index + 1]) {
      defaults.outputDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--name' && argv[index + 1]) {
      defaults.name = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--note' && argv[index + 1]) {
      defaults.note = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--json') {
      defaults.json = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  const defaultOut = defaults.outputDir.length > 0
    ? defaults.outputDir
    : path.resolve(path.dirname(defaults.dbPath), 'checkpoints');

  return {
    dbPath: defaults.dbPath,
    outputDir: defaultOut,
    name: defaults.name.trim().length > 0 ? defaults.name.trim() : 'migration-checkpoint',
    note: defaults.note,
    json: defaults.json,
  };
}

function printHelp(): void {
  console.log(`Usage:
  node create-checkpoint.js [--db <path>] [--out <dir>] [--name <label>] [--note <text>] [--json]

Options:
  --db    SQLite database path (default: MEMORY_DB_PATH or known project paths)
  --out   Output directory for checkpoint files (default: <db-dir>/checkpoints)
  --name  Checkpoint label (default: migration-checkpoint)
  --note  Optional note persisted in sidecar metadata
  --json  Print machine-readable JSON output
`);
}

function toSafeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'checkpoint';
}

function toTimestampId(date: Date): string {
  return date
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[:T]/g, '-')
    .replace('Z', '');
}

/**
 * Read the current schema version from a SQLite database.
 *
 * @param dbPath - Path to the SQLite database file.
 * @returns Schema version number, or `null` if unavailable.
 */
function getSchemaVersion(dbPath: string): number | null {
  let db: Database.Database | null = null;
  try {
    db = new Database(dbPath, { fileMustExist: true });
    db.pragma('wal_checkpoint(FULL)');
    const row = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
    if (typeof row?.version === 'number' && Number.isFinite(row.version)) {
      return row.version;
    }
    return null;
  } catch (_error: unknown) {
    return null;
  } finally {
    try {
      db?.close();
    } catch (_error: unknown) {
      // Ignore close failures in CLI path
    }
  }
}

/**
 * Execute the checkpoint creation workflow: copy database and write metadata sidecar.
 *
 * @param args - Parsed CLI arguments specifying database, output, and label.
 * @returns Result containing the checkpoint and metadata file paths.
 */
function runCreateCheckpoint(args: CliArgs): CreateCheckpointResult {
  if (!fs.existsSync(args.dbPath)) {
    throw new Error(`Database not found: ${args.dbPath}`);
  }

  fs.mkdirSync(args.outputDir, { recursive: true });

  const now = new Date();
  const fileStem = `${toTimestampId(now)}__${toSafeSlug(args.name)}`;
  const checkpointPath = path.join(args.outputDir, `${fileStem}.sqlite`);
  const metadataPath = path.join(args.outputDir, `${fileStem}.json`);

  fs.copyFileSync(args.dbPath, checkpointPath);
  const sizeBytes = fs.statSync(checkpointPath).size;
  const schemaVersion = getSchemaVersion(args.dbPath);
  const rollout = getMemoryRoadmapDefaults();

  const metadata = {
    createdAt: now.toISOString(),
    sourceDbPath: args.dbPath,
    checkpointPath,
    schemaVersion,
    sizeBytes,
    phase: rollout.phase,
    capabilities: rollout.capabilities,
    scopeDimensionsTracked: rollout.scopeDimensionsTracked,
    note: args.note,
  };

  fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  return {
    ok: true,
    checkpointPath,
    metadataPath,
    schemaVersion,
    sizeBytes,
  };
}

/**
 * CLI entry point: parse arguments, create checkpoint, and print results.
 *
 * @param argv - Command-line arguments (defaults to `process.argv.slice(2)`).
 * @returns Checkpoint creation result.
 */
function main(argv = process.argv.slice(2)): CreateCheckpointResult {
  const args = parseArgs(argv);
  const result = runCreateCheckpoint(args);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return result;
  }

  console.log(`Checkpoint created: ${result.checkpointPath}`);
  console.log(`Metadata: ${result.metadataPath}`);
  console.log(`Schema version: ${result.schemaVersion ?? 'unknown'}`);
  console.log(`Size: ${result.sizeBytes} bytes`);
  return result;
}

function isMainModule(): boolean {
  const entryPath = process.argv[1];
  if (!entryPath) return false;
  return import.meta.url === pathToFileURL(path.resolve(entryPath)).href;
}

if (isMainModule()) {
  try {
    main();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[create-checkpoint] ERROR: ${message}`);
    process.exit(1);
  }
}

export {
  getSchemaVersion,
  main,
  parseArgs,
  resolveDefaultDbPath,
  runCreateCheckpoint,
  toSafeSlug,
  toTimestampId,
};

export type {
  CliArgs,
  CreateCheckpointResult,
};
