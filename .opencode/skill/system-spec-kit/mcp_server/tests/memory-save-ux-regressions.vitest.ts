import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import * as handler from '../handlers/memory-save';
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

  it('atomicSaveMemory returns post-mutation feedback for successful saves', async () => {
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
    expect(Array.isArray(result.hints)).toBe(true);
    expect(result.hints?.some((hint: string) => hint.includes('Post-mutation cache clear'))).toBe(true);
  });
});
