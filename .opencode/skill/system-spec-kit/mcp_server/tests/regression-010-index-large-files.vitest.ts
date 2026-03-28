// ───────────────────────────────────────────────────────────────
// 1. REGRESSION 010 LARGE FILES TESTS
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  CHUNKING_THRESHOLD,
  chunkLargeFile,
  needsChunking,
} from '../lib/chunking/anchor-chunker';

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  delete process.env.SPEC_KIT_DB_DIR;
  delete process.env.MEMORY_BASE_PATH;
  delete process.env.MEMORY_ALLOWED_PATHS;

  for (const dir of tempDirs.splice(0)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Ignore test cleanup failures
    }
  }
});

describe('Regression 010: index large files guardrails', () => {
  it('respects 50K/100K/250K boundaries with 250KB max content gate', async () => {
    const preflight = await import('../lib/validation/preflight');

    const at50k = preflight.validateContentSize('x'.repeat(50000));
    expect(at50k.valid).toBe(true);

    const at100k = preflight.validateContentSize('x'.repeat(100000));
    expect(at100k.valid).toBe(true);

    const at250k = preflight.validateContentSize('x'.repeat(250000));
    expect(at250k.valid).toBe(true);

    const over250k = preflight.validateContentSize('x'.repeat(250001));
    expect(over250k.valid).toBe(false);
    expect(over250k.errors.some((e: { code: string }) => e.code === preflight.PreflightErrorCodes.CONTENT_TOO_LARGE)).toBe(true);
  });

  it('chunks >50K anchored content and keeps anchor semantics', () => {
    const atThreshold = 'x'.repeat(CHUNKING_THRESHOLD);
    expect(needsChunking(atThreshold)).toBe(false);

    const anchoredLargeContent = [
      '<!-- ANCHOR:intro -->',
      'I'.repeat(26000),
      '<!-- /ANCHOR:intro -->',
      '',
      '<!-- ANCHOR:details -->',
      'D'.repeat(26000),
      '<!-- /ANCHOR:details -->',
    ].join('\n');

    expect(needsChunking(anchoredLargeContent)).toBe(true);

    const result = chunkLargeFile(anchoredLargeContent);
    expect(result.strategy).toBe('anchor');
    expect(result.chunks.length).toBeGreaterThanOrEqual(2);
    expect(result.chunks.some((chunk) => chunk.anchorIds.includes('intro'))).toBe(true);
    expect(result.chunks.some((chunk) => chunk.anchorIds.includes('details'))).toBe(true);
  });

  it('preserves text outside anchors when anchor chunking is selected', () => {
    const preface = `Preface outside anchors.\n${'P'.repeat(2200)}`;
    const bridge = `Bridge text between anchors.\n${'B'.repeat(2200)}`;
    const trailing = `Trailing notes outside anchors.\n${'T'.repeat(2200)}`;
    const content = [
      preface,
      '',
      '<!-- ANCHOR:intro -->',
      `Intro section body.\n${'I'.repeat(2200)}`,
      '<!-- /ANCHOR:intro -->',
      '',
      bridge,
      '',
      '<!-- ANCHOR:details -->',
      `Details section body.\n${'D'.repeat(2200)}`,
      '<!-- /ANCHOR:details -->',
      '',
      trailing,
    ].join('\n');

    const result = chunkLargeFile(content);
    expect(result.strategy).toBe('anchor');

    const combined = result.chunks.map((chunk) => chunk.content).join('\n');
    expect(combined).toContain('Preface outside anchors.');
    expect(combined).toContain('Bridge text between anchors.');
    expect(combined).toContain('Trailing notes outside anchors.');
    expect(result.chunks.some((chunk) => chunk.anchorIds.includes('intro'))).toBe(true);
    expect(result.chunks.some((chunk) => chunk.anchorIds.includes('details'))).toBe(true);
  });

  it('uses structure-aware fallback so fenced code comments are not treated as headings', () => {
    const markdown = [
      '# Intro',
      '',
      'Lead paragraph.',
      '',
      '```sh',
      '# not a heading',
      'echo ok',
      '```',
      '',
      '## After',
      '',
      'Tail text.',
    ].join('\n');

    const result = chunkLargeFile(markdown);
    expect(result.strategy).toBe('structure');

    const codeChunk = result.chunks.find((chunk) => chunk.content.includes('echo ok'));
    expect(codeChunk).toBeDefined();
    expect(codeChunk!.content).toContain('# not a heading');
    expect(codeChunk!.content.trim().startsWith('```sh')).toBe(true);
    expect(result.chunks.some((chunk) => chunk.content.trim() === '# not a heading')).toBe(false);
  });

  it('initializes schema with v16 chunk columns and parent indexes', async () => {
    vi.resetModules();
    const tempDir = makeTempDir('spec-kit-schema-v16-');
    const dbPath = path.join(tempDir, 'context-index.sqlite');

    const vectorIndex = await import('../lib/search/vector-index');
    vectorIndex.initializeDb(dbPath);

    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();

    const columns = db.prepare('PRAGMA table_info(memory_index)').all().map((row: unknown) => (row as { name: string }).name);
    expect(columns).toEqual(expect.arrayContaining(['parent_id', 'chunk_index', 'chunk_label']));

    const indexes = db.prepare('PRAGMA index_list(memory_index)').all().map((row: unknown) => (row as { name: string }).name);
    expect(indexes).toEqual(expect.arrayContaining(['idx_parent_id', 'idx_parent_chunk']));

    const versionRow = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
    expect(versionRow?.version ?? 0).toBeGreaterThanOrEqual(16);

    vectorIndex.closeDb();
  });

  it('enforces memory_bulk_delete safety gates', async () => {
    const tempDir = makeTempDir('spec-kit-bulk-gates-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    const bulkDelete = await import('../handlers/memory-bulk-delete');

    await expect(
      bulkDelete.handleMemoryBulkDelete({ tier: 'deprecated', confirm: false })
    ).rejects.toThrow(/confirm: true/);

    await expect(
      bulkDelete.handleMemoryBulkDelete({ tier: 'critical', confirm: true })
    ).rejects.toThrow(/requires specFolder scope/i);

    await expect(
      bulkDelete.handleMemoryBulkDelete({ tier: 'critical', specFolder: 'specs/010-test', confirm: true, skipCheckpoint: true })
    ).rejects.toThrow(/skipCheckpoint/i);

    await expect(
      bulkDelete.handleMemoryBulkDelete({ tier: 'deprecated', confirm: true, olderThanDays: 0 })
    ).rejects.toThrow(/olderThanDays/i);

    await expect(
      bulkDelete.handleMemoryBulkDelete({ tier: 'deprecated', confirm: true, olderThanDays: 1.5 })
    ).rejects.toThrow(/olderThanDays/i);

    await expect(
      bulkDelete.handleMemoryBulkDelete({ tier: 'deprecated', confirm: true, olderThanDays: Number.NaN })
    ).rejects.toThrow(/olderThanDays/i);
  });

  it('returns restoreCommand on successful bulk delete with checkpoint init', async () => {
    const tempDir = makeTempDir('spec-kit-bulk-restore-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index');
    const checkpoints = await import('../lib/storage/checkpoints');
    const bulkDelete = await import('../handlers/memory-bulk-delete');

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    checkpoints.init(db);

    db.prepare(`
      INSERT INTO memory_index
      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      'specs/010-test',
      '/specs/010-test/memory/deprecated.md',
      'Deprecated memory',
      'deprecated-hash',
      'deprecated',
      '2025-01-01 00:00:00',
      '2025-01-01 00:00:00'
    );

    const response = await bulkDelete.handleMemoryBulkDelete({
      tier: 'deprecated',
      confirm: true,
    });

    const envelope = JSON.parse(response.content[0].text);
    expect(envelope.data?.deleted).toBe(1);
    expect(typeof envelope.data?.restoreCommand).toBe('string');
    expect(envelope.data.restoreCommand).toContain('checkpoint_restore');

    vectorIndex.closeDb();
  });

  it('returns an MCP database-unavailable envelope when bulk delete cannot open the database', async () => {
    const tempDir = makeTempDir('spec-kit-bulk-db-unavailable-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    vi.doMock('../lib/search/vector-index', async (importOriginal) => {
      const actual = await importOriginal<typeof import('../lib/search/vector-index')>();
      return {
        ...actual,
        getDb: vi.fn(() => null),
      };
    });

    try {
      const bulkDelete = await import('../handlers/memory-bulk-delete');

      const response = await bulkDelete.handleMemoryBulkDelete({
        tier: 'deprecated',
        confirm: true,
      });

      const envelope = JSON.parse(response.content[0].text);
      expect(envelope.data?.code).toBe('E_DB_UNAVAILABLE');
      expect(envelope.data?.error).toBe('Memory bulk delete aborted: database unavailable');
      expect(envelope.data?.details).toMatchObject({
        tier: 'deprecated',
        specFolder: null,
      });
    } finally {
      vi.doUnmock('../lib/search/vector-index');
    }
  });

  it('allows skipCheckpoint for non-critical tiers', async () => {
    const tempDir = makeTempDir('spec-kit-bulk-skip-checkpoint-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index');
    const checkpoints = await import('../lib/storage/checkpoints');
    const bulkDelete = await import('../handlers/memory-bulk-delete');

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    checkpoints.init(db);

    db.prepare(`
      INSERT INTO memory_index
      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      'specs/010-test',
      '/specs/010-test/memory/temp.md',
      'Temp memory',
      'temp-hash',
      'temporary',
      '2025-01-01 00:00:00',
      '2025-01-01 00:00:00'
    );

    const response = await bulkDelete.handleMemoryBulkDelete({
      tier: 'temporary',
      confirm: true,
      skipCheckpoint: true,
    });

    const envelope = JSON.parse(response.content[0].text);
    expect(envelope.data?.deleted).toBe(1);
    expect(envelope.data?.skipCheckpoint).toBe(true);
    expect(envelope.data?.restoreCommand).toBeUndefined();

    vectorIndex.closeDb();
  });

  it('proceeds without rollback metadata when checkpoint creation returns null on non-critical tier', async () => {
    const tempDir = makeTempDir('spec-kit-bulk-null-checkpoint-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index');
    const checkpoints = await import('../lib/storage/checkpoints');
    const bulkDelete = await import('../handlers/memory-bulk-delete');

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    checkpoints.init(db);

    db.prepare(`
      INSERT INTO memory_index
      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      'specs/010-test',
      '/specs/010-test/memory/deprecated-null-checkpoint.md',
      'Deprecated memory',
      'deprecated-null-checkpoint-hash',
      'deprecated',
      '2025-01-01 00:00:00',
      '2025-01-01 00:00:00'
    );

    const checkpointSpy = vi.spyOn(checkpoints, 'createCheckpoint').mockReturnValue(null);

    try {
      const response = await bulkDelete.handleMemoryBulkDelete({
        tier: 'deprecated',
        confirm: true,
      });

      const envelope = JSON.parse(response.content[0].text);
      expect(envelope.data?.deleted).toBe(1);
      expect(envelope.data?.checkpoint).toBeUndefined();
      expect(envelope.data?.restoreCommand).toBeUndefined();
      expect(checkpointSpy).toHaveBeenCalledTimes(1);
    } finally {
      checkpointSpy.mockRestore();
      vectorIndex.closeDb();
    }
  });

  it('aborts critical tier bulk delete when checkpoint creation returns null', async () => {
    const tempDir = makeTempDir('spec-kit-bulk-critical-null-checkpoint-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index');
    const checkpoints = await import('../lib/storage/checkpoints');
    const bulkDelete = await import('../handlers/memory-bulk-delete');

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    checkpoints.init(db);

    db.prepare(`
      INSERT INTO memory_index
      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      'specs/010-test',
      '/specs/010-test/memory/critical-null-checkpoint.md',
      'Critical memory',
      'critical-null-checkpoint-hash',
      'critical',
      '2025-01-01 00:00:00',
      '2025-01-01 00:00:00'
    );

    const checkpointSpy = vi.spyOn(checkpoints, 'createCheckpoint').mockReturnValue(null);

    try {
      await expect(
        bulkDelete.handleMemoryBulkDelete({
          tier: 'critical',
          specFolder: 'specs/010-test',
          confirm: true,
        })
      ).rejects.toThrow(/mandatory checkpoint|Aborting high-safety/i);
      expect(checkpointSpy).toHaveBeenCalledTimes(1);
    } finally {
      checkpointSpy.mockRestore();
      vectorIndex.closeDb();
    }
  });

  it('downgrades schema from v16 to v15 and removes chunk columns', async () => {
    const tempDir = makeTempDir('spec-kit-schema-downgrade-');
    process.env.SPEC_KIT_DB_DIR = tempDir;

    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index');
    const checkpoints = await import('../lib/storage/checkpoints');
    const downgrade = await import('../lib/storage/schema-downgrade');

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    checkpoints.init(db);

    const beforeVersion = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
    expect(beforeVersion?.version).toBeGreaterThanOrEqual(16);

    // Set schema to v16 for the v16→v15 downgrade test (v17+ migrations are independent of chunk columns)
    db.prepare('UPDATE schema_version SET version = 16 WHERE id = 1').run();

    const result = downgrade.downgradeSchemaV16ToV15(db);
    expect(result.toVersion).toBe(15);
    expect(typeof result.checkpointName).toBe('string');
    expect(result.checkpointName.length).toBeGreaterThan(0);

    const afterVersion = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
    expect(afterVersion?.version).toBe(15);

    const columns = db.prepare('PRAGMA table_info(memory_index)').all().map((row: unknown) => (row as { name: string }).name);
    expect(columns).not.toContain('parent_id');
    expect(columns).not.toContain('chunk_index');
    expect(columns).not.toContain('chunk_label');

    vectorIndex.closeDb();
  });

  it('collapses sibling chunk hits and reassembles content', async () => {
    const tempDir = makeTempDir('spec-kit-search-reassembly-');
    process.env.SPEC_KIT_DB_DIR = tempDir;
    process.env.MEMORY_ALLOWED_PATHS = process.cwd();

    vi.resetModules();
    const vectorIndex = await import('../lib/search/vector-index');
    const checkpoints = await import('../lib/storage/checkpoints');
    const core = await import('../core');
    const memorySearch = await import('../handlers/memory-search');

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    checkpoints.init(db);
    core.init({ vectorIndex, checkpoints });

    db.prepare(`
      INSERT INTO memory_index
      (id, spec_folder, file_path, title, created_at, updated_at, embedding_status, content_text, importance_tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      9000,
      'specs/010-test',
      '/specs/010-test/memory/large.md',
      'Large Parent',
      '2025-01-01 00:00:00',
      '2025-01-01 00:00:00',
      'partial',
      'Parent summary',
      'normal'
    );

    const insertChild = db.prepare(`
      INSERT INTO memory_index
      (id, spec_folder, file_path, anchor_id, title, created_at, updated_at, embedding_status, content_text, parent_id, chunk_index, chunk_label, importance_tier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertChild.run(9001, 'specs/010-test', '/specs/010-test/memory/large.md', 'chunk-1', 'Chunk 1', '2025-01-01 00:00:00', '2025-01-01 00:00:00', 'success', 'Chunk content 1', 9000, 0, 'chunk-1', 'normal');
    insertChild.run(9002, 'specs/010-test', '/specs/010-test/memory/large.md', 'chunk-2', 'Chunk 2', '2025-01-01 00:00:00', '2025-01-01 00:00:00', 'success', 'Chunk content 2', 9000, 1, 'chunk-2', 'normal');
    insertChild.run(9003, 'specs/010-test', '/specs/010-test/memory/large.md', 'chunk-3', 'Chunk 3', '2025-01-01 00:00:00', '2025-01-01 00:00:00', 'success', 'Chunk content 3', 9000, 2, 'chunk-3', 'normal');

    const prepared = memorySearch.__testables.collapseAndReassembleChunkResults([
      { id: 9001, parent_id: 9000, chunk_index: 0, chunk_label: 'chunk-1', file_path: '/specs/010-test/memory/large.md' },
      { id: 9002, parent_id: 9000, chunk_index: 1, chunk_label: 'chunk-2', file_path: '/specs/010-test/memory/large.md' },
      { id: 42, spec_folder: 'specs/010-test', file_path: '/specs/010-test/memory/other.md', title: 'Other' },
    ]);

    expect(prepared.results.length).toBe(2);
    expect(prepared.stats.collapsedChunkHits).toBe(1);
    expect(prepared.stats.chunkParents).toBe(1);
    expect(prepared.stats.reassembled).toBe(1);

    const chunkResult = prepared.results.find((row: { parentId?: number | null }) => row.parentId === 9000);
    expect(chunkResult).toBeTruthy();
    if (!chunkResult) {
      throw new Error('Expected reassembled chunk result for parent_id=9000');
    }
    expect(chunkResult.isChunk).toBe(true);
    expect(chunkResult.chunkCount).toBe(3);
    expect(chunkResult.contentSource).toBe('reassembled_chunks');
    expect(chunkResult.precomputedContent).toContain('Chunk content 1');
    expect(chunkResult.precomputedContent).toContain('Chunk content 2');
    expect(chunkResult.precomputedContent).toContain('Chunk content 3');

    vectorIndex.closeDb();
  });

  it('contains lazy warmup and eager override in cli source', () => {
    const repoRoot = path.resolve(__dirname, '../../../../..');
    const cliSourcePath = path.join(repoRoot, '.opencode/skill/system-spec-kit/mcp_server/cli.ts');
    const cliSource = fs.readFileSync(cliSourcePath, 'utf8');
    expect(cliSource).toContain('--eager-warmup');
    expect(cliSource).toContain('Warmup:');
    expect(cliSource).toContain('if (eagerWarmup)');
    expect(cliSource).toContain('schema-downgrade');
    expect(cliSource).toContain('--confirm is required for schema-downgrade');
  });

  it('runs dist CLI from project root without module-resolution errors', () => {
    const repoRoot = path.resolve(__dirname, '../../../../..');
    const cliPath = path.join(repoRoot, '.opencode/skill/system-spec-kit/mcp_server/dist/cli.js');
    expect(fs.existsSync(cliPath)).toBe(true);

    const tempDir = makeTempDir('spec-kit-cli-root-');
    const dbDir = path.join(tempDir, 'db');
    const workspaceDir = path.join(tempDir, 'workspace');
    fs.mkdirSync(dbDir, { recursive: true });
    fs.mkdirSync(workspaceDir, { recursive: true });

    const baseEnv = {
      ...process.env,
      SPEC_KIT_DB_DIR: dbDir,
      MEMORY_BASE_PATH: workspaceDir,
      MEMORY_ALLOWED_PATHS: repoRoot,
    };

    const helpResult = spawnSync(process.execPath, [cliPath, '--help'], {
      cwd: repoRoot,
      env: baseEnv,
      encoding: 'utf8',
    });
    expect(helpResult.status).toBe(0);
    expect(`${helpResult.stdout}${helpResult.stderr}`).toContain('spec-kit-cli');

    const statsResult = spawnSync(process.execPath, [cliPath, 'stats'], {
      cwd: repoRoot,
      env: baseEnv,
      encoding: 'utf8',
    });
    expect(statsResult.status).toBe(0);
    expect(`${statsResult.stdout}${statsResult.stderr}`).toContain('Memory Database Statistics');
  });
});
