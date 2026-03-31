// TEST: INCREMENTAL INDEX V2
import { describe, it, expect, beforeEach } from 'vitest';
import { createHash } from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';
import Database from 'better-sqlite3';
import * as mod from '../lib/storage/incremental-index';
import type { StoredMetadata } from '../lib/storage/incremental-index';

/* ───────────────────────────────────────────────────────────────
   DB HELPERS
──────────────────────────────────────────────────────────────── */

/**
 * Create an in-memory SQLite DB with the memory_index schema
 * matching the production schema from vector-index-impl.js.
 */
type InitDb = Parameters<typeof mod.init>[0];
type EmbeddingStatus = StoredMetadata['embedding_status'];

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      embedding_model TEXT,
      embedding_generated_at TEXT,
      embedding_status TEXT DEFAULT 'pending'
        CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
      retry_count INTEGER DEFAULT 0,
      last_retry_at TEXT,
      failure_reason TEXT,
      base_importance REAL DEFAULT 0.5,
      decay_half_life_days REAL DEFAULT 90.0,
      is_pinned INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      last_accessed INTEGER DEFAULT 0,
      importance_tier TEXT DEFAULT 'normal'
        CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
      session_id TEXT,
      context_type TEXT DEFAULT 'general'
        CHECK(context_type IN ('research', 'implementation', 'planning', 'general', 'decision', 'discovery')),
      channel TEXT DEFAULT 'default',
      content_hash TEXT,
      expires_at DATETIME,
      confidence REAL DEFAULT 0.5,
      validation_count INTEGER DEFAULT 0,
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      file_mtime_ms INTEGER,
      UNIQUE(spec_folder, file_path, anchor_id)
    )
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_file_mtime ON memory_index(file_mtime_ms)');
  return db;
}

/** Insert a row into memory_index for testing. */
function insertRow(db: Database.Database, opts: {
  file_path: string;
  file_mtime_ms?: number | null;
  content_hash?: string | null;
  embedding_status?: EmbeddingStatus;
  spec_folder?: string;
}): number {
  const stmt = db.prepare(`
    INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    opts.spec_folder ?? 'specs/test',
    opts.file_path,
    opts.file_mtime_ms ?? null,
    opts.content_hash ?? null,
    opts.embedding_status ?? 'success',
  );
  return Number(result.lastInsertRowid);
}

/** Create a temporary file on disk and return its path. */
function createTempFile(content = 'test content'): string {
  const name = `inc-idx-test-${Date.now()}-${Math.random().toString(36).slice(2)}.md`;
  const p = path.join(os.tmpdir(), name);
  fs.writeFileSync(p, content, 'utf-8');
  return p;
}

/** Clean up a temp file (ignore errors). */
function removeTempFile(p: string) {
  try { fs.unlinkSync(p); } catch {}
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function supportsDirectorySymlinks(): boolean {
  const probeRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-symlink-probe-'));
  const targetDir = path.join(probeRoot, 'target');
  const aliasDir = path.join(probeRoot, 'alias');

  try {
    fs.mkdirSync(targetDir);
    fs.symlinkSync(targetDir, aliasDir, 'dir');
    return fs.lstatSync(aliasDir).isSymbolicLink();
  } catch {
    return false;
  } finally {
    fs.rmSync(probeRoot, { recursive: true, force: true });
  }
}

const symlinkIt = supportsDirectorySymlinks() ? it : it.skip;

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('MTIME_FAST_PATH_MS constant', () => {
  it('MTIME_FAST_PATH_MS is a positive number', () => {
    expect(typeof mod.MTIME_FAST_PATH_MS).toBe('number');
    expect(mod.MTIME_FAST_PATH_MS).toBeGreaterThan(0);
  });

  it('MTIME_FAST_PATH_MS equals 1000', () => {
    expect(mod.MTIME_FAST_PATH_MS).toBe(1000);
  });
});

describe('init()', () => {
  it('init(db) sets module DB — getStoredMetadata works after init', () => {
    const db = createTestDb();
    mod.init(db);
    const result = mod.getStoredMetadata('/does/not/exist.md');
    expect(result).toBeNull();
    db.close();
  });

  it('init(null) — getStoredMetadata returns null when db is null', () => {
    mod.init(null as unknown as InitDb);
    const result = mod.getStoredMetadata('/any/path.md');
    expect(result).toBeNull();
  });
});

describe('getFileMetadata()', () => {
  it('returns {path, mtime, size, exists:true} for real file', () => {
    const tmpFile = createTempFile('hello world');
    const meta = mod.getFileMetadata(tmpFile);
    expect(meta.path).toBe(tmpFile);
    expect(typeof meta.mtime).toBe('number');
    expect(meta.mtime).toBeGreaterThan(0);
    expect(typeof meta.size).toBe('number');
    expect(meta.size).toBeGreaterThan(0);
    expect(meta.exists).toBe(true);
    removeTempFile(tmpFile);
  });

  it('returns {exists:false, mtime:0, size:0} for missing file', () => {
    const meta = mod.getFileMetadata('/absolutely/does/not/exist.md');
    expect(meta.path).toBe('/absolutely/does/not/exist.md');
    expect(meta.mtime).toBe(0);
    expect(meta.size).toBe(0);
    expect(meta.exists).toBe(false);
  });

  it('handles empty file (size=0, exists=true)', () => {
    const tmpFile = createTempFile('');
    const meta = mod.getFileMetadata(tmpFile);
    expect(meta.exists).toBe(true);
    expect(meta.size).toBe(0);
    removeTempFile(tmpFile);
  });

  it('size matches Buffer.byteLength', () => {
    const content = 'known content';
    const tmpFile = createTempFile(content);
    const meta = mod.getFileMetadata(tmpFile);
    const expectedSize = Buffer.byteLength(content, 'utf-8');
    expect(meta.size).toBe(expectedSize);
    removeTempFile(tmpFile);
  });
});

describe('getStoredMetadata()', () => {
  it('returns null for unknown file_path', () => {
    const db = createTestDb();
    mod.init(db);
    const result = mod.getStoredMetadata('/nonexistent/path.md');
    expect(result).toBeNull();
    db.close();
  });

  it('returns correct row shape {file_path, file_mtime_ms, content_hash, embedding_status}', () => {
    const db = createTestDb();
    mod.init(db);
    insertRow(db, {
      file_path: '/test/file.md',
      file_mtime_ms: 1700000000000,
      content_hash: 'abc123',
      embedding_status: 'success',
    });
    const row = mod.getStoredMetadata('/test/file.md');
    expect(row).not.toBeNull();
    if (!row) {
      throw new Error('Expected stored metadata row for /test/file.md');
    }
    expect(row.file_path).toBe('/test/file.md');
    expect(row.file_mtime_ms).toBe(1700000000000);
    expect(row.content_hash).toBe('abc123');
    expect(row.embedding_status).toBe('success');
    db.close();
  });

  it('returns null fields when DB values are null', () => {
    const db = createTestDb();
    mod.init(db);
    insertRow(db, {
      file_path: '/test/null-mtime.md',
      file_mtime_ms: null,
      content_hash: null,
      embedding_status: 'pending',
    });
    const row = mod.getStoredMetadata('/test/null-mtime.md');
    expect(row).not.toBeNull();
    if (!row) {
      throw new Error('Expected stored metadata row for /test/null-mtime.md');
    }
    expect(row.file_mtime_ms).toBeNull();
    expect(row.content_hash).toBeNull();
    db.close();
  });

  it('returns null when db is null (not initialized)', () => {
    mod.init(null as unknown as InitDb);
    const result = mod.getStoredMetadata('/any/file.md');
    expect(result).toBeNull();
  });

  symlinkIt('matches alias path via canonical_file_path when available', () => {
    const db = createTestDb();
    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
    mod.init(db);

    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-'));
    const canonicalFile = path.join(canonicalDir, 'alias-match.md');
    fs.writeFileSync(canonicalFile, 'alias content', 'utf-8');

    const aliasDir = path.join(os.tmpdir(), `inc-idx-alias-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.symlinkSync(canonicalDir, aliasDir, 'dir');

    const aliasFile = path.join(aliasDir, 'alias-match.md');
    const canonicalKey = fs.realpathSync(canonicalFile);

    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('specs/test', canonicalFile, canonicalKey, 1700000000000, 'alias-hash', 'success');

    const row = mod.getStoredMetadata(aliasFile);
    expect(row).not.toBeNull();
    if (!row) {
      throw new Error('Expected stored metadata row for alias path');
    }
    expect(row.file_path).toBe(canonicalFile);
    expect(row.content_hash).toBe('alias-hash');

    fs.rmSync(aliasDir, { recursive: true, force: true });
    fs.rmSync(canonicalDir, { recursive: true, force: true });
    db.close();
  });
});

describe('shouldReindex()', () => {
  it('returns "new" for file not in DB', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('brand new file');
    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('new');
    removeTempFile(tmpFile);
    db.close();
  });

  it('returns "deleted" for file in DB but not on disk', () => {
    const db = createTestDb();
    mod.init(db);
    const fakePath = '/tmp/deleted-file-' + Date.now() + '.md';
    insertRow(db, { file_path: fakePath, file_mtime_ms: 1700000000000, embedding_status: 'success' });
    const decision = mod.shouldReindex(fakePath);
    expect(decision).toBe('deleted');
    db.close();
  });

  it('returns "skip" for nonexistent file not in DB', () => {
    const db = createTestDb();
    mod.init(db);
    const decision = mod.shouldReindex('/totally/nonexistent/' + Date.now() + '.md');
    expect(decision).toBe('skip');
    db.close();
  });

  it('returns "reindex" for null file_mtime_ms (legacy entry)', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('legacy entry');
    insertRow(db, { file_path: tmpFile, file_mtime_ms: null, embedding_status: 'success' });
    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('reindex');
    removeTempFile(tmpFile);
    db.close();
  });

  it('returns "skip" for unchanged mtime + successful embedding', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('unchanged content');
    const stats = fs.statSync(tmpFile);
    const mtimeMs = stats.mtimeMs;
    insertRow(db, { file_path: tmpFile, file_mtime_ms: mtimeMs, embedding_status: 'success' });
    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('skip');
    removeTempFile(tmpFile);
    db.close();
  });

  it('returns "modified" when content hash changes but mtime stays within the fast-path window', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('original content');
    const stats = fs.statSync(tmpFile);

    insertRow(db, {
      file_path: tmpFile,
      file_mtime_ms: stats.mtimeMs,
      content_hash: sha256('original content'),
      embedding_status: 'success',
    });

    fs.writeFileSync(tmpFile, 'updated content', 'utf-8');
    fs.utimesSync(tmpFile, stats.atime, new Date(stats.mtimeMs));

    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('modified');

    removeTempFile(tmpFile);
    db.close();
  });

  it('returns "reindex" for same mtime but pending embedding', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('pending content');
    const stats = fs.statSync(tmpFile);
    insertRow(db, { file_path: tmpFile, file_mtime_ms: stats.mtimeMs, embedding_status: 'pending' });
    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('reindex');
    removeTempFile(tmpFile);
    db.close();
  });

  it('returns "reindex" for same mtime but failed embedding', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('failed content');
    const stats = fs.statSync(tmpFile);
    insertRow(db, { file_path: tmpFile, file_mtime_ms: stats.mtimeMs, embedding_status: 'failed' });
    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('reindex');
    removeTempFile(tmpFile);
    db.close();
  });

  it('returns "modified" when mtime differs significantly', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('modified content');
    insertRow(db, { file_path: tmpFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
    const decision = mod.shouldReindex(tmpFile);
    expect(decision).toBe('modified');
    removeTempFile(tmpFile);
    db.close();
  });
});

describe('updateFileMtime()', () => {
  it('updates mtime and returns true', () => {
    const db = createTestDb();
    mod.init(db);
    const filePath = '/test/update-mtime.md';
    insertRow(db, { file_path: filePath, file_mtime_ms: 1000 });
    const ok = mod.updateFileMtime(filePath, 2000);
    expect(ok).toBe(true);
    const row = db.prepare('SELECT file_mtime_ms FROM memory_index WHERE file_path = ?').get(filePath) as { file_mtime_ms: number } | undefined;
    if (!row) {
      throw new Error('Expected updated row for file mtime');
    }
    expect(row.file_mtime_ms).toBe(2000);
    db.close();
  });

  it('returns false for file_path not in DB', () => {
    const db = createTestDb();
    mod.init(db);
    const ok = mod.updateFileMtime('/nonexistent/path.md', 9999);
    expect(ok).toBe(false);
    db.close();
  });

  it('returns false when db is null', () => {
    mod.init(null as unknown as InitDb);
    const ok = mod.updateFileMtime('/any/path.md', 1234);
    expect(ok).toBe(false);
  });

  symlinkIt('updates mtime when called with symlink alias path', () => {
    const db = createTestDb();
    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
    mod.init(db);

    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-update-'));
    const canonicalFile = path.join(canonicalDir, 'alias-update.md');
    fs.writeFileSync(canonicalFile, 'mtime alias content', 'utf-8');

    const aliasDir = path.join(os.tmpdir(), `inc-idx-alias-update-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.symlinkSync(canonicalDir, aliasDir, 'dir');

    const aliasFile = path.join(aliasDir, 'alias-update.md');
    const canonicalKey = fs.realpathSync(canonicalFile);

    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('specs/test', canonicalFile, canonicalKey, 1000, 'mtime-hash', 'success');

    const ok = mod.updateFileMtime(aliasFile, 3000);
    expect(ok).toBe(true);

    const row = db.prepare('SELECT file_mtime_ms FROM memory_index WHERE file_path = ?').get(canonicalFile) as { file_mtime_ms: number };
    expect(row.file_mtime_ms).toBe(3000);

    fs.rmSync(aliasDir, { recursive: true, force: true });
    fs.rmSync(canonicalDir, { recursive: true, force: true });
    db.close();
  });
});

describe('setIndexedMtime()', () => {
  it('reads file mtime and writes it to DB', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('set indexed mtime test');
    insertRow(db, { file_path: tmpFile, file_mtime_ms: 0 });
    const ok = mod.setIndexedMtime(tmpFile);
    expect(ok).toBe(true);
    const row = db.prepare('SELECT file_mtime_ms FROM memory_index WHERE file_path = ?').get(tmpFile) as { file_mtime_ms: number } | undefined;
    if (!row) {
      throw new Error('Expected row after setting indexed mtime');
    }
    const stats = fs.statSync(tmpFile);
    expect(row.file_mtime_ms).toBe(stats.mtimeMs);
    removeTempFile(tmpFile);
    db.close();
  });

  it('returns false for nonexistent file', () => {
    const db = createTestDb();
    mod.init(db);
    const ok = mod.setIndexedMtime('/nonexistent/file-' + Date.now() + '.md');
    expect(ok).toBe(false);
    db.close();
  });
});

describe('categorizeFilesForIndexing()', () => {
  it('correctly sorts files into toIndex/toUpdate/toSkip/toDelete', () => {
    const db = createTestDb();
    mod.init(db);

    const newFile = createTempFile('brand new');
    const unchangedFile = createTempFile('unchanged');
    const modifiedFile = createTempFile('modified');
    const deletedPath = '/tmp/gone-file-' + Date.now() + '.md';

    const unchangedStats = fs.statSync(unchangedFile);
    insertRow(db, { file_path: unchangedFile, file_mtime_ms: unchangedStats.mtimeMs, embedding_status: 'success' });
    insertRow(db, { file_path: modifiedFile, file_mtime_ms: 1000000000000, embedding_status: 'success' });
    insertRow(db, { file_path: deletedPath, file_mtime_ms: 1700000000000, embedding_status: 'success' });

    const result = mod.categorizeFilesForIndexing([newFile, unchangedFile, modifiedFile, deletedPath]);

    expect(Array.isArray(result.toIndex)).toBe(true);
    expect(Array.isArray(result.toUpdate)).toBe(true);
    expect(Array.isArray(result.toSkip)).toBe(true);
    expect(Array.isArray(result.toDelete)).toBe(true);

    expect(result.toIndex).toContain(newFile);
    expect(result.toSkip).toContain(unchangedFile);
    expect(result.toUpdate).toContain(modifiedFile);
    expect(result.toDelete).toContain(deletedPath);

    removeTempFile(newFile);
    removeTempFile(unchangedFile);
    removeTempFile(modifiedFile);
    db.close();
  });

  it('returns empty arrays for empty input', () => {
    const db = createTestDb();
    mod.init(db);
    const result = mod.categorizeFilesForIndexing([]);
    expect(result).toEqual({ toIndex: [], toUpdate: [], toSkip: [], toDelete: [] });
    db.close();
  });

  it('puts legacy null-mtime entries in toUpdate', () => {
    const db = createTestDb();
    mod.init(db);
    const tmpFile = createTempFile('legacy reindex');
    insertRow(db, { file_path: tmpFile, file_mtime_ms: null, embedding_status: 'success' });
    const result = mod.categorizeFilesForIndexing([tmpFile]);
    expect(result.toUpdate).toContain(tmpFile);
    removeTempFile(tmpFile);
    db.close();
  });

  it('adds stale indexed rows to toDelete even when missing from scan input', () => {
    const db = createTestDb();
    mod.init(db);

    const liveFile = createTempFile('live file');
    const liveStats = fs.statSync(liveFile);
    insertRow(db, { file_path: liveFile, file_mtime_ms: liveStats.mtimeMs, embedding_status: 'success' });

    const stalePath = '/tmp/stale-only-in-db-' + Date.now() + '.md';
    insertRow(db, { file_path: stalePath, file_mtime_ms: 1700000000000, embedding_status: 'success' });

    const result = mod.categorizeFilesForIndexing([liveFile]);
    expect(result.toDelete).toContain(stalePath);
    expect(result.toSkip).toContain(liveFile);

    removeTempFile(liveFile);
    db.close();
  });

  symlinkIt('does not mark alias rows as stale when canonical path is still present in scan', () => {
    const db = createTestDb();
    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
    mod.init(db);

    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-present-'));
    const canonicalFile = path.join(canonicalDir, 'doc.md');
    fs.writeFileSync(canonicalFile, 'canonical content', 'utf-8');

    const aliasDir = path.join(os.tmpdir(), `inc-idx-alias-present-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.symlinkSync(canonicalDir, aliasDir, 'dir');

    const aliasFile = path.join(aliasDir, 'doc.md');
    const canonicalKey = fs.realpathSync(canonicalFile);
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('specs/test', aliasFile, canonicalKey, 1700000000000, 'alias-hash', 'success');

    const result = mod.categorizeFilesForIndexing([canonicalFile]);
    expect(result.toDelete).not.toContain(aliasFile);

    fs.rmSync(aliasDir, { recursive: true, force: true });
    fs.rmSync(canonicalDir, { recursive: true, force: true });
    db.close();
  });
});

describe('listIndexedRecordIdsForDeletedPaths()', () => {
  it('returns ids only for records that are still missing on disk', () => {
    const db = createTestDb();
    mod.init(db);

    const stalePath = '/tmp/stale-id-test-' + Date.now() + '.md';
    const staleId = insertRow(db, { file_path: stalePath, file_mtime_ms: 1700000000000, embedding_status: 'success' });

    const liveFile = createTempFile('still on disk');
    const liveStats = fs.statSync(liveFile);
    const liveId = insertRow(db, { file_path: liveFile, file_mtime_ms: liveStats.mtimeMs, embedding_status: 'success' });

    const ids = mod.listIndexedRecordIdsForDeletedPaths([stalePath, liveFile]);
    expect(ids).toContain(staleId);
    expect(ids).not.toContain(liveId);

    removeTempFile(liveFile);
    db.close();
  });

  symlinkIt('skips deletion ids when canonical path still exists', () => {
    const db = createTestDb();
    db.exec('ALTER TABLE memory_index ADD COLUMN canonical_file_path TEXT');
    mod.init(db);

    const canonicalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'inc-idx-canonical-id-'));
    const canonicalFile = path.join(canonicalDir, 'doc.md');
    fs.writeFileSync(canonicalFile, 'canonical-id content', 'utf-8');

    const aliasDir = path.join(os.tmpdir(), `inc-idx-alias-id-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    fs.symlinkSync(canonicalDir, aliasDir, 'dir');

    const aliasFile = path.join(aliasDir, 'doc.md');
    const canonicalKey = fs.realpathSync(canonicalFile);
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('specs/test', aliasFile, canonicalKey, 1700000000000, 'canonical-live', 'success');

    const ids = mod.listIndexedRecordIdsForDeletedPaths([aliasFile]);
    expect(ids).toEqual([]);

    fs.rmSync(aliasDir, { recursive: true, force: true });
    fs.rmSync(canonicalDir, { recursive: true, force: true });
    db.close();
  });
});

describe('batchUpdateMtimes()', () => {
  it('updates multiple files and returns {updated:2, failed:0}', () => {
    const db = createTestDb();
    mod.init(db);
    const f1 = createTempFile('batch file 1');
    const f2 = createTempFile('batch file 2');
    insertRow(db, { file_path: f1, file_mtime_ms: 0 });
    insertRow(db, { file_path: f2, file_mtime_ms: 0 });
    const result = mod.batchUpdateMtimes([f1, f2]);
    expect(typeof result.updated).toBe('number');
    expect(typeof result.failed).toBe('number');
    expect(result.updated).toBe(2);
    expect(result.failed).toBe(0);
    removeTempFile(f1);
    removeTempFile(f2);
    db.close();
  });

  it('returns {updated:0, failed:0} for empty input', () => {
    const db = createTestDb();
    mod.init(db);
    const result = mod.batchUpdateMtimes([]);
    expect(result.updated).toBe(0);
    expect(result.failed).toBe(0);
    db.close();
  });

  it('returns {updated:0, failed:N} when db is null', () => {
    mod.init(null as unknown as InitDb);
    const result = mod.batchUpdateMtimes(['/some/file.md']);
    expect(result.updated).toBe(0);
    expect(result.failed).toBe(1);
  });

  it('handles mix of updatable and non-updatable files', () => {
    const db = createTestDb();
    mod.init(db);
    const realFile = createTempFile('real file for batch');
    const fakePath = '/nonexistent/batch-file-' + Date.now() + '.md';
    insertRow(db, { file_path: realFile, file_mtime_ms: 0 });
    const result = mod.batchUpdateMtimes([realFile, fakePath]);
    expect(result.updated).toBe(1);
    expect(result.failed).toBe(1);
    removeTempFile(realFile);
    db.close();
  });
});

describe('T106: Failed files retried on next scan', () => {
  it('T106-01: Successfully indexed file skipped on rescan', () => {
    const db = createTestDb();
    mod.init(db);

    const successFile = createTempFile('success content');
    const successMeta = mod.getFileMetadata(successFile);
    insertRow(db, { file_path: successFile, file_mtime_ms: successMeta.mtime, content_hash: 'hash-ok', embedding_status: 'success' });

    mod.batchUpdateMtimes([successFile]);

    const successReindex = mod.shouldReindex(successFile);
    expect(successReindex === 'skip' || successReindex !== 'reindex').toBe(true);

    removeTempFile(successFile);
    db.close();
  });

  it('T106-02: Failed file marked for reindex on rescan', () => {
    const db = createTestDb();
    mod.init(db);

    const failedFile = createTempFile('failed content');
    const failedMeta = mod.getFileMetadata(failedFile);
    insertRow(db, { file_path: failedFile, file_mtime_ms: failedMeta.mtime, content_hash: 'hash-fail', embedding_status: 'failed' });

    const failedReindex = mod.shouldReindex(failedFile);
    expect(failedReindex).toBe('reindex');

    removeTempFile(failedFile);
    db.close();
  });

  it('T106-03: batchUpdateMtimes updated only the successful file', () => {
    const db = createTestDb();
    mod.init(db);

    const successFile = createTempFile('success content');
    insertRow(db, { file_path: successFile, file_mtime_ms: 0, embedding_status: 'success' });

    const batchResult = mod.batchUpdateMtimes([successFile]);
    expect(batchResult.updated).toBe(1);

    removeTempFile(successFile);
    db.close();
  });
});

describe('Module exports', () => {
  it('All expected exports are present', () => {
    const expectedExports = [
      'init',
      'getFileMetadata',
      'getStoredMetadata',
      'shouldReindex',
      'updateFileMtime',
      'setIndexedMtime',
      'categorizeFilesForIndexing',
      'batchUpdateMtimes',
      'MTIME_FAST_PATH_MS',
    ] as const satisfies readonly (keyof typeof mod)[];
    const missing = expectedExports.filter(name => typeof mod[name] === 'undefined');
    expect(missing.length).toBe(0);
  });

  it('All exports have correct types', () => {
    expect(typeof mod.init).toBe('function');
    expect(typeof mod.getFileMetadata).toBe('function');
    expect(typeof mod.getStoredMetadata).toBe('function');
    expect(typeof mod.shouldReindex).toBe('function');
    expect(typeof mod.updateFileMtime).toBe('function');
    expect(typeof mod.setIndexedMtime).toBe('function');
    expect(typeof mod.categorizeFilesForIndexing).toBe('function');
    expect(typeof mod.batchUpdateMtimes).toBe('function');
    expect(typeof mod.MTIME_FAST_PATH_MS).toBe('number');
  });
});
