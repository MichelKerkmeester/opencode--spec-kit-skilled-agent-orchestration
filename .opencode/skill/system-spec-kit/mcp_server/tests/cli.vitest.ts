// TEST: Standalone admin CLI integration
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve } from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

const tempDirs: string[] = [];
const repoRoot = resolve(__dirname, '../../../../..');
const cliPath = join(repoRoot, '.opencode/skill/system-spec-kit/mcp_server/dist/cli.js');

interface CliSandbox {
  rootDir: string;
  dbDir: string;
  workspaceDir: string;
  env: NodeJS.ProcessEnv;
}

function createSandbox(prefix: string): CliSandbox {
  const rootDir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(rootDir);

  const dbDir = join(rootDir, 'db');
  const workspaceDir = join(rootDir, 'workspace');
  mkdirSync(dbDir, { recursive: true });
  mkdirSync(workspaceDir, { recursive: true });

  return {
    rootDir,
    dbDir,
    workspaceDir,
    env: {
      ...process.env,
      SPEC_KIT_DB_DIR: dbDir,
      MEMORY_BASE_PATH: workspaceDir,
      MEMORY_ALLOWED_PATHS: [workspaceDir, repoRoot].join(delimiter),
    },
  };
}

function runCli(
  args: string[],
  options: { env: NodeJS.ProcessEnv; cwd?: string }
): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: options.cwd ?? repoRoot,
    env: options.env,
    encoding: 'utf8',
  });
}

function outputOf(result: SpawnSyncReturns<string>): string {
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

function seedBulkDeleteFixture(dbPath: string): void {
  const db = new Database(dbPath);
  const insertMemory = db.prepare(`
    INSERT INTO memory_index
      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
  `);
  insertMemory.run(
    'specs/012-cli',
    '/specs/012-cli/memory/old-a.md',
    'Old A',
    'old-a-hash',
    'deprecated',
    '2025-01-01 00:00:00',
    '2025-01-01 00:00:00'
  );
  insertMemory.run(
    'specs/012-cli',
    '/specs/012-cli/memory/old-b.md',
    'Old B',
    'old-b-hash',
    'deprecated',
    '2025-01-01 00:00:00',
    '2025-01-01 00:00:00'
  );
  insertMemory.run(
    'specs/012-cli',
    '/specs/012-cli/memory/keep.md',
    'Keep',
    'keep-hash',
    'normal',
    '2025-01-01 00:00:00',
    '2025-01-01 00:00:00'
  );
  db.close();
}

beforeAll(() => {
  expect(existsSync(cliPath)).toBe(true);
});

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('standalone admin CLI', () => {
  it('runs stats without errors', () => {
    const sandbox = createSandbox('spec-kit-cli-stats-');

    const result = runCli(['stats'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });

    expect(result.status).toBe(0);
    expect(outputOf(result)).toContain('Memory Database Statistics');
  });

  it('bulk-delete removes matching tier and creates pre-delete checkpoint', () => {
    const sandbox = createSandbox('spec-kit-cli-bulk-delete-');
    const dbPath = join(sandbox.dbDir, 'context-index.sqlite');

    const initResult = runCli(['stats'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(initResult.status).toBe(0);

    seedBulkDeleteFixture(dbPath);

    const beforeDb = new Database(dbPath);
    const checkpointsBefore = (
      beforeDb.prepare('SELECT COUNT(*) as count FROM checkpoints').get() as { count: number }
    ).count;
    beforeDb.close();

    const deleteResult = runCli(['bulk-delete', '--tier', 'deprecated'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(deleteResult.status).toBe(0);
    expect(outputOf(deleteResult)).toContain('Deleted:     2 memories');
    expect(outputOf(deleteResult)).toContain('Checkpoint:');

    const afterDb = new Database(dbPath);
    const deprecatedCount = (
      afterDb.prepare(
        "SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = 'deprecated'"
      ).get() as { count: number }
    ).count;
    const remainingCount = (
      afterDb.prepare(
        "SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = 'normal'"
      ).get() as { count: number }
    ).count;
    const checkpointsAfter = (
      afterDb.prepare('SELECT COUNT(*) as count FROM checkpoints').get() as { count: number }
    ).count;
    const matchingCheckpointCount = (
      afterDb.prepare(
        "SELECT COUNT(*) as count FROM checkpoints WHERE name LIKE 'pre-bulk-delete-deprecated-%'"
      ).get() as { count: number }
    ).count;
    afterDb.close();

    expect(deprecatedCount).toBe(0);
    expect(remainingCount).toBe(1);
    expect(checkpointsAfter).toBeGreaterThan(checkpointsBefore);
    expect(matchingCheckpointCount).toBeGreaterThan(0);
  });

  it('runs reindex without errors', () => {
    const sandbox = createSandbox('spec-kit-cli-reindex-');

    const result = runCli(['reindex', '--force'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });

    const output = outputOf(result);
    expect(result.status).toBe(0);
    expect(output).toContain('Reindex Memory Files');
    expect(output).not.toContain('ERROR: Reindex failed');
  });

  it('schema-downgrade fails safely when current schema is newer than v16', () => {
    const sandbox = createSandbox('spec-kit-cli-schema-downgrade-');
    const initResult = runCli(['stats'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(initResult.status).toBe(0);

    const downgradeResult = runCli(['schema-downgrade', '--to', '15', '--confirm'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(downgradeResult.status).toBe(1);
    expect(outputOf(downgradeResult)).toContain('Schema Downgrade');
    expect(outputOf(downgradeResult)).toContain('Downgrade supports only v16 -> v15');
  });

  it('returns errors for invalid command and missing required args', () => {
    const sandbox = createSandbox('spec-kit-cli-errors-');

    const unknownCommand = runCli(['not-a-command'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(unknownCommand.status).toBe(1);
    expect(outputOf(unknownCommand)).toContain('Unknown command');

    const missingTier = runCli(['bulk-delete'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(missingTier.status).toBe(1);
    expect(outputOf(missingTier)).toContain('--tier is required');

    const missingConfirm = runCli(['schema-downgrade', '--to', '15'], {
      env: sandbox.env,
      cwd: sandbox.workspaceDir,
    });
    expect(missingConfirm.status).toBe(1);
    expect(outputOf(missingConfirm)).toContain('--confirm is required');
  });

  it('fails cleanly when database path is unavailable', () => {
    const sandbox = createSandbox('spec-kit-cli-db-unavailable-');
    const brokenDbRoot = join(sandbox.rootDir, 'db-root-file');
    writeFileSync(brokenDbRoot, 'not-a-directory', 'utf8');

    const result = runCli(['stats'], {
      cwd: sandbox.workspaceDir,
      env: {
        ...sandbox.env,
        SPEC_KIT_DB_DIR: brokenDbRoot,
      },
    });

    expect(result.status).not.toBe(0);
    expect(outputOf(result)).toMatch(/FATAL|unable to open database file|not a directory/i);
  });
});
