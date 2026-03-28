// TEST: INCREMENTAL INDEX (focused compatibility coverage)
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import Database from 'better-sqlite3';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as incrementalIndex from '../lib/storage/incremental-index';

function createDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_mtime_ms REAL,
      content_hash TEXT,
      embedding_status TEXT DEFAULT 'success'
    );
  `);
  return db;
}

function createTempFile(content = 'test content'): string {
  const filePath = path.join(
    os.tmpdir(),
    `inc-index-${Date.now()}-${Math.random().toString(36).slice(2)}.md`
  );
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

describe('Incremental index behavior (concrete)', () => {
  let db: Database.Database;
  const tempFiles: string[] = [];

  beforeEach(() => {
    db = createDb();
    incrementalIndex.init(db);
  });

  afterEach(() => {
    for (const filePath of tempFiles) {
      fs.rmSync(filePath, { force: true });
    }
    tempFiles.length = 0;
    db.close();
  });

  it('exports a positive MTIME fast-path threshold', () => {
    expect(incrementalIndex.MTIME_FAST_PATH_MS).toBe(1000);
    expect(incrementalIndex.MTIME_FAST_PATH_MS).toBeGreaterThan(0);
  });

  it('returns missing metadata shape for unknown files', () => {
    const meta = incrementalIndex.getFileMetadata('/definitely/missing/path.md');
    expect(meta.exists).toBe(false);
    expect(meta.mtime).toBe(0);
    expect(meta.size).toBe(0);
  });

  it('marks an on-disk file as new when no stored metadata exists', () => {
    const filePath = createTempFile('new file content');
    tempFiles.push(filePath);

    expect(incrementalIndex.shouldReindex(filePath)).toBe('new');
  });

  it('returns skip when mtime is unchanged and embedding status is success', () => {
    const content = 'stable content';
    const filePath = createTempFile(content);
    tempFiles.push(filePath);
    const mtime = fs.statSync(filePath).mtimeMs;

    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?)
    `).run('specs/test', filePath, mtime, sha256(content), 'success');

    expect(incrementalIndex.shouldReindex(filePath)).toBe('skip');
  });

  it('forces reindex when embedding status is pending even if mtime is unchanged', () => {
    const filePath = createTempFile('pending content');
    tempFiles.push(filePath);
    const mtime = fs.statSync(filePath).mtimeMs;

    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?)
    `).run('specs/test', filePath, mtime, 'hash-pending', 'pending');

    expect(incrementalIndex.shouldReindex(filePath)).toBe('reindex');
  });

  it('categorizes files into toIndex, toSkip, and toDelete', () => {
    const newFile = createTempFile('brand new');
    const unchangedContent = 'unchanged';
    const unchangedFile = createTempFile(unchangedContent);
    tempFiles.push(newFile, unchangedFile);

    const unchangedMtime = fs.statSync(unchangedFile).mtimeMs;
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?)
    `).run('specs/test', unchangedFile, unchangedMtime, sha256(unchangedContent), 'success');

    const deletedPath = `/tmp/deleted-${Date.now()}.md`;
    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?)
    `).run('specs/test', deletedPath, Date.now(), 'hash-deleted', 'success');

    const categorized = incrementalIndex.categorizeFilesForIndexing([newFile, unchangedFile]);

    expect(categorized.toIndex).toContain(newFile);
    expect(categorized.toSkip).toContain(unchangedFile);
    expect(categorized.toDelete).toContain(deletedPath);
  });

  it('updates mtimes in batch and reports updated counts', () => {
    const filePath = createTempFile('batch-update');
    tempFiles.push(filePath);

    db.prepare(`
      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
      VALUES (?, ?, ?, ?, ?)
    `).run('specs/test', filePath, 0, 'hash-batch', 'success');

    const result = incrementalIndex.batchUpdateMtimes([filePath]);
    expect(result.updated).toBe(1);
    expect(result.failed).toBe(0);
  });
});
