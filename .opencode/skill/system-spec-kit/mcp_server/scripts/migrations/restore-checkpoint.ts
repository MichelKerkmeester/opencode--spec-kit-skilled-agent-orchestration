#!/usr/bin/env node
// --- 1. MIGRATION CHECKPOINT RESTORE ---
// Restore a previously created SQLite checkpoint into the target DB.
import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

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

function parseArgs(argv: string[]): CliArgs {
  let checkpointPath = '';
  let dbPath = resolveDefaultDbPath();
  let backupDir = '';
  let force = false;
  let json = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--checkpoint' && argv[index + 1]) {
      checkpointPath = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--db' && argv[index + 1]) {
      dbPath = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--backup-dir' && argv[index + 1]) {
      backupDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg === '--force') {
      force = true;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  if (checkpointPath.length === 0) {
    throw new Error('Missing required flag: --checkpoint <path>');
  }

  const resolvedBackupDir = backupDir.length > 0
    ? backupDir
    : path.resolve(path.dirname(dbPath), 'checkpoints', 'restore-backups');

  return {
    checkpointPath,
    dbPath,
    backupDir: resolvedBackupDir,
    force,
    json,
  };
}

function printHelp(): void {
  console.log(`Usage:
  node restore-checkpoint.js --checkpoint <path> [--db <path>] [--backup-dir <dir>] [--force] [--json]

Options:
  --checkpoint  Required checkpoint SQLite file to restore
  --db          Target SQLite database path
  --backup-dir  Directory for pre-restore backups (default: <db-dir>/checkpoints/restore-backups)
  --force       Allow restoring into non-empty target path
  --json        Print machine-readable JSON output
`);
}

function toTimestampId(date: Date): string {
  return date
    .toISOString()
    .replace(/\.\d{3}Z$/, 'Z')
    .replace(/[:T]/g, '-')
    .replace('Z', '');
}

function verifySqliteFile(dbPath: string): void {
  const db = new Database(dbPath, { fileMustExist: true });
  try {
    db.prepare('SELECT COUNT(*) AS total FROM sqlite_master').get();
  } finally {
    db.close();
  }
}

function runRestoreCheckpoint(args: CliArgs): RestoreCheckpointResult {
  if (!fs.existsSync(args.checkpointPath)) {
    throw new Error(`Checkpoint file not found: ${args.checkpointPath}`);
  }

  const targetExists = fs.existsSync(args.dbPath);
  if (targetExists && !args.force) {
    throw new Error('Target DB already exists. Re-run with --force to allow replacement.');
  }

  fs.mkdirSync(path.dirname(args.dbPath), { recursive: true });
  fs.mkdirSync(args.backupDir, { recursive: true });

  const now = new Date();
  const backupPath = path.join(
    args.backupDir,
    `${toTimestampId(now)}__pre-restore-context-index.sqlite`,
  );

  if (targetExists) {
    fs.copyFileSync(args.dbPath, backupPath);
  }

  fs.copyFileSync(args.checkpointPath, args.dbPath);
  verifySqliteFile(args.dbPath);

  const result: RestoreCheckpointResult = {
    ok: true,
    restoredAt: now.toISOString(),
    checkpointPath: args.checkpointPath,
    targetDbPath: args.dbPath,
    backupPath: targetExists ? backupPath : null,
  };

  return result;
}

function main(argv = process.argv.slice(2)): RestoreCheckpointResult {
  const args = parseArgs(argv);
  const result = runRestoreCheckpoint(args);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return result;
  }

  console.log(`Checkpoint restored to: ${args.dbPath}`);
  if (result.backupPath) {
    console.log(`Pre-restore backup: ${result.backupPath}`);
  } else {
    console.log('Target DB did not exist; no pre-restore backup was created.');
  }
  return result;
}

if (require.main === module) {
  try {
    main();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[restore-checkpoint] ERROR: ${message}`);
    process.exit(1);
  }
}

export {
  main,
  parseArgs,
  resolveDefaultDbPath,
  runRestoreCheckpoint,
  toTimestampId,
  verifySqliteFile,
};

export type {
  CliArgs,
  RestoreCheckpointResult,
};
