import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import * as handler from '../handlers/memory-save';
import { buildSaveResponse } from '../handlers/save/response-builder';
import * as vectorIndex from '../lib/search/vector-index';

const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-memory-save-ux-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(process.cwd(), 'tmp-test-fixtures', 'specs', '999-memory-save-ux-fixtures');

function buildMemoryContent(title: string, body: string): string {
  return `---
title: "${title}"
trigger_phrases:
  - "${title.toLowerCase().replace(/\s+/g, '-')}"
importance_tier: "normal"
contextType: "general"
---
# ${title}

${body}
`;
}

function parseResponse(result: { content: Array<{ text: string }> }): any {
  return JSON.parse(result.content[0].text);
}

function resetFixtureDir(): void {
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
  fs.mkdirSync(path.join(FIXTURE_ROOT, 'memory'), { recursive: true });
}

function cleanupFixtureRows(): void {
  const db = vectorIndex.getDb();
  if (!db) {
    return;
  }

  const likePattern = '%999-memory-save-ux-fixtures%';
  db.prepare('DELETE FROM memory_conflicts WHERE spec_folder LIKE ?').run(likePattern);
  // Delete history rows before memory_index to satisfy FK constraint
  db.prepare(`DELETE FROM memory_history WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?').run(likePattern, likePattern);
}

beforeAll(() => {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  vectorIndex.initializeDb(TEST_DB_PATH);
  resetFixtureDir();
});

afterEach(() => {
  cleanupFixtureRows();
  resetFixtureDir();
});

afterAll(() => {
  try {
    vectorIndex.closeDb();
  } catch {
    // ignore cleanup errors in tests
  }
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
  fs.rmSync(path.join(process.cwd(), 'tmp-test-fixtures'), { recursive: true, force: true });
});

describe('Memory save UX regressions', () => {
  it('does not emit postMutationHooks for duplicate-content no-op saves', async () => {
    const originalPath = path.join(FIXTURE_ROOT, 'memory', 'original.md');
    const duplicatePath = path.join(FIXTURE_ROOT, 'memory', 'duplicate.md');
    const sharedContent = buildMemoryContent('Duplicate Seed', 'Shared duplicate body for regression coverage.');

    fs.writeFileSync(originalPath, sharedContent, 'utf8');
    fs.writeFileSync(duplicatePath, sharedContent, 'utf8');

    const initialIndex = await handler.indexMemoryFile(originalPath, { force: true, asyncEmbedding: true });
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    db!.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', initialIndex.id);

    const response = await handler.handleMemorySave({
      filePath: duplicatePath,
      skipPreflight: true,
    });

    const parsed = parseResponse(response);
    expect(parsed.data.status).toBe('duplicate');
    expect(parsed.data.postMutationHooks).toBeUndefined();
    expect(parsed.hints.some((hint: string) => hint.includes('Post-mutation cache clear'))).toBe(false);
    expect(parsed.hints.some((hint: string) => hint.includes('caches were left unchanged'))).toBe(true);
  });

  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
    const savePath = path.join(FIXTURE_ROOT, 'memory', 'save-response-contract.md');
    fs.writeFileSync(savePath, buildMemoryContent('Save Response Contract', 'Response contract fixture content.'), 'utf8');

    const response = await handler.handleMemorySave({
      filePath: savePath,
      skipPreflight: true,
    });

    const parsed = parseResponse(response);
    expect(['indexed', 'created', 'updated']).toContain(parsed.data.status);
    expect(parsed.data.postMutationHooks).toBeDefined();
    expect(parsed.data.postMutationHooks).toMatchObject({
      latencyMs: expect.any(Number),
      triggerCacheCleared: expect.any(Boolean),
      constitutionalCacheCleared: expect.any(Boolean),
      graphSignalsCacheCleared: expect.any(Boolean),
      coactivationCacheCleared: expect.any(Boolean),
      toolCacheInvalidated: expect.any(Number),
    });

    expect(typeof parsed.data.postMutationHooks.latencyMs).toBe('number');
    expect(typeof parsed.data.postMutationHooks.triggerCacheCleared).toBe('boolean');
    expect(typeof parsed.data.postMutationHooks.constitutionalCacheCleared).toBe('boolean');
    expect(typeof parsed.data.postMutationHooks.graphSignalsCacheCleared).toBe('boolean');
    expect(typeof parsed.data.postMutationHooks.coactivationCacheCleared).toBe('boolean');
    expect(typeof parsed.data.postMutationHooks.toolCacheInvalidated).toBe('number');
  });

  it('atomicSaveMemory returns post-mutation feedback payload with typed fields for successful saves', async () => {
    const atomicPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-save.md');

    const result = await handler.atomicSaveMemory(
      {
        file_path: atomicPath,
        content: buildMemoryContent('Atomic Save', 'Atomic save regression fixture content.'),
      },
      { force: true }
    );

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.status).toBeDefined();
    expect(result.postMutationHooks).toBeDefined();
    expect(result.postMutationHooks).toMatchObject({
      latencyMs: expect.any(Number),
      triggerCacheCleared: expect.any(Boolean),
      constitutionalCacheCleared: expect.any(Boolean),
      graphSignalsCacheCleared: expect.any(Boolean),
      coactivationCacheCleared: expect.any(Boolean),
      toolCacheInvalidated: expect.any(Number),
    });
    expect(Array.isArray(result.hints)).toBe(true);
    expect(result.hints?.some((hint: string) => hint.includes('Post-mutation cache clear'))).toBe(true);
  });

  it('atomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status', async () => {
    const indexedPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-duplicate-seed.md');
    const duplicatePath = path.join(FIXTURE_ROOT, 'memory', 'atomic-duplicate-copy.md');
    const sharedContent = buildMemoryContent('Atomic Duplicate Seed', 'Atomic duplicate behavior regression fixture.');

    fs.writeFileSync(indexedPath, sharedContent, 'utf8');
    const initialIndex = await handler.indexMemoryFile(indexedPath, { force: true, asyncEmbedding: true });
    const db = vectorIndex.getDb();
    expect(db).toBeTruthy();
    db!.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', initialIndex.id);

    const result = await handler.atomicSaveMemory(
      {
        file_path: duplicatePath,
        content: sharedContent,
      },
      { force: false }
    );

    expect(result.success).toBe(true);
    expect(['duplicate', 'unchanged', 'no_change']).toContain(result.status);
    expect(result.postMutationHooks).toBeUndefined();
  });

  it('atomicSaveMemory succeeds with pending async embedding and returns partial-indexing hints', async () => {
    const atomicPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-save-async-pending.md');
    const content = buildMemoryContent('Atomic Async Pending', 'Atomic save should pass with deferred embedding.');

    const result = await handler.atomicSaveMemory(
      {
        file_path: atomicPath,
        content,
      },
      { force: true }
    );

    expect(result.success).toBe(true);
    expect(result.embeddingStatus).toBe('pending');
    expect(['deferred', 'created', 'indexed', 'updated']).toContain(result.status);
    expect(result.message).toContain('deferred indexing');
    expect(fs.existsSync(atomicPath)).toBe(true);
    expect(fs.readFileSync(atomicPath, 'utf8')).toBe(content);
    expect(result.hints?.some((hint: string) => hint.includes('fully indexed when embedding provider becomes available'))).toBe(true);
  });

  it('atomicSaveMemory rolls back file when indexing fails after retry', async () => {
    const atomicPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-save-invalid.md');

    const result = await handler.atomicSaveMemory(
      {
        file_path: atomicPath,
        content: 'bad',
      },
      { force: true }
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe('error');
    expect(result.error).toContain('Validation failed');
    expect(fs.existsSync(atomicPath)).toBe(false);
  });

  it('atomicSaveMemory restores previous content when indexing fails after overwrite', async () => {
    const atomicPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-save-restore.md');
    const originalContent = buildMemoryContent('Atomic Restore Seed', 'Original content to restore on failure.');
    fs.writeFileSync(atomicPath, originalContent, 'utf8');

    const result = await handler.atomicSaveMemory(
      {
        file_path: atomicPath,
        content: 'bad',
      },
      { force: true }
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe('error');
    expect(result.error).toContain('Validation failed');
    expect(fs.existsSync(atomicPath)).toBe(true);
    expect(fs.readFileSync(atomicPath, 'utf8')).toBe(originalContent);
  });

  it('buildSaveResponse returns explicit rejected payload without mutation side effects', () => {
    const response = buildSaveResponse({
      result: {
        status: 'rejected',
        id: 0,
        specFolder: 'specs/999-memory-save-ux-fixtures',
        title: 'Rejected Save',
        qualityScore: 0.2,
        qualityFlags: ['No trigger phrases found'],
        rejectionReason: 'Quality score 0.200 below threshold 0.6 after 1 auto-fix attempt(s).',
        message: 'Quality score 0.200 below threshold 0.6 after 1 auto-fix attempt(s).',
        qualityGate: {
          pass: false,
          reasons: ['signal density too low'],
          layers: { lexical: { pass: false } },
        },
      },
      filePath: path.join(FIXTURE_ROOT, 'memory', 'rejected.md'),
      asyncEmbedding: true,
      requestId: 'req-test-rejected',
    });

    const parsed = parseResponse(response);
    expect(parsed.data.status).toBe('rejected');
    expect(parsed.data.postMutationHooks).toBeUndefined();
    expect(parsed.data.qualityGate).toEqual({
      pass: false,
      reasons: ['signal density too low'],
      layers: { lexical: { pass: false } },
    });
    expect(parsed.hints).toContain('Rejected saves do not mutate the memory index');
  });
});
