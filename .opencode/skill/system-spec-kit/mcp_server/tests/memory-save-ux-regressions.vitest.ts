import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock core/db-state to prevent real DB operations (checkDatabaseUpdated throws
// when the database directory cannot be resolved in the test environment).
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

import * as handler from '../handlers/memory-save';
import { buildSaveResponse } from '../handlers/save/response-builder';
import * as vectorIndex from '../lib/search/vector-index';

const TEST_DB_DIR = path.join(os.tmpdir(), `speckit-memory-save-ux-${process.pid}`);
const TEST_DB_PATH = path.join(TEST_DB_DIR, 'speckit-memory.db');
const FIXTURE_ROOT = path.join(process.cwd(), 'tmp-test-fixtures', 'specs', '999-memory-save-ux-fixtures');
const ORIGINAL_ENV = {
  SPECKIT_AUTO_ENTITIES: process.env.SPECKIT_AUTO_ENTITIES,
  SPECKIT_MEMORY_SUMMARIES: process.env.SPECKIT_MEMORY_SUMMARIES,
  SPECKIT_ENTITY_LINKING: process.env.SPECKIT_ENTITY_LINKING,
  SPECKIT_QUALITY_LOOP: process.env.SPECKIT_QUALITY_LOOP,
  SPECKIT_SAVE_QUALITY_GATE: process.env.SPECKIT_SAVE_QUALITY_GATE,
};

function buildMemoryContent(title: string, body: string): string {
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `---
title: "${title}"
description: "Durable regression fixture for memory_save UX contract coverage."
trigger_phrases:
  - "${titleSlug}"
  - "memory-save-ux"
importance_tier: "normal"
contextType: "implementation"
---

# ${title}

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Total Messages | 4 |
| Fixture Type | memory-save-ux |

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

The handler is saving into a sandbox spec folder. This fixture intentionally captures concrete file roles, operator-visible save outcomes, and enough semantic detail to survive the shared insufficiency contract before duplicate detection or success-response shaping occurs.

<!-- /ANCHOR:project-state-snapshot -->

<!-- ANCHOR:summary -->
<a id="overview"></a>

## OVERVIEW

${body}

This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## DETAILED CHANGES

### Key Files

| File | Role |
|------|------|
| \`mcp_server/handlers/memory-save.ts\` | Coordinates atomic save, sufficiency enforcement, duplicate detection, and post-mutation feedback for the memory save path. |
| \`mcp_server/handlers/save/response-builder.ts\` | Shapes MCP success, duplicate, deferred-indexing, and rejected response payloads for operators. |

### Observation: atomic save verification

Executed the save path with a durable fixture so the test reaches duplicate handling and post-mutation hook feedback instead of stopping early on insufficient context. Verified that successful saves surface cache invalidation feedback while duplicate no-op saves leave caches unchanged.

<!-- /ANCHOR:detailed-changes -->

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## DECISIONS

- Decided to keep the insufficiency gate active before duplicate and response UX handling so thin memories reject early instead of producing misleading save results.
- Chosen fixture content keeps the duplicate regression exact-match behavior while preserving concrete file, decision, and workflow evidence for the newer durable-memory contract.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## CONVERSATION

The operator requested regression coverage for duplicate no-op responses, post-mutation feedback fields, and deferred-indexing hints. The handler parsed this memory, ran save-path enforcement, and then returned the resulting UX payload for assertion.

<!-- /ANCHOR:session-history -->

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

- If this fixture starts failing insufficiency again, add more concrete file, decision, blocker, next action, or outcome evidence instead of weakening the gate.
- Re-run the UX regression suite and the full MCP package test suite after changing the save contract.

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

\`\`\`yaml
session_id: "${titleSlug}-fixture"
fixture_title: "${title}"
\`\`\`

<!-- /ANCHOR:metadata -->
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
  db.prepare(`DELETE FROM active_memory_projection WHERE active_memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare(`DELETE FROM memory_lineage WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_conflicts WHERE spec_folder LIKE ?').run(likePattern);
  // Delete history rows before memory_index to satisfy FK constraint
  db.prepare(`DELETE FROM memory_history WHERE memory_id IN (
    SELECT id FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?
  )`).run(likePattern, likePattern);
  db.prepare('DELETE FROM memory_index WHERE file_path LIKE ? OR spec_folder LIKE ?').run(likePattern, likePattern);
}

beforeAll(() => {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  process.env.MEMORY_DB_PATH = TEST_DB_PATH;
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors in tests
  }
  vectorIndex.initializeDb();
  if (previousMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
  else process.env.MEMORY_DB_PATH = previousMemoryDbPath;
  resetFixtureDir();
});

beforeEach(() => {
  // Keep the UX contract tests focused on save-path response shaping.
  // Optional enrichment and quality-gate suites are covered elsewhere and can
  // introduce non-deterministic provider/env interactions in the full run.
  process.env.SPECKIT_AUTO_ENTITIES = 'false';
  process.env.SPECKIT_MEMORY_SUMMARIES = 'false';
  process.env.SPECKIT_ENTITY_LINKING = 'false';
  process.env.SPECKIT_QUALITY_LOOP = 'false';
  delete process.env.SPECKIT_SAVE_QUALITY_GATE;
});

afterEach(() => {
  cleanupFixtureRows();
  resetFixtureDir();
  if (ORIGINAL_ENV.SPECKIT_AUTO_ENTITIES === undefined) delete process.env.SPECKIT_AUTO_ENTITIES;
  else process.env.SPECKIT_AUTO_ENTITIES = ORIGINAL_ENV.SPECKIT_AUTO_ENTITIES;
  if (ORIGINAL_ENV.SPECKIT_MEMORY_SUMMARIES === undefined) delete process.env.SPECKIT_MEMORY_SUMMARIES;
  else process.env.SPECKIT_MEMORY_SUMMARIES = ORIGINAL_ENV.SPECKIT_MEMORY_SUMMARIES;
  if (ORIGINAL_ENV.SPECKIT_ENTITY_LINKING === undefined) delete process.env.SPECKIT_ENTITY_LINKING;
  else process.env.SPECKIT_ENTITY_LINKING = ORIGINAL_ENV.SPECKIT_ENTITY_LINKING;
  if (ORIGINAL_ENV.SPECKIT_QUALITY_LOOP === undefined) delete process.env.SPECKIT_QUALITY_LOOP;
  else process.env.SPECKIT_QUALITY_LOOP = ORIGINAL_ENV.SPECKIT_QUALITY_LOOP;
  if (ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE === undefined) delete process.env.SPECKIT_SAVE_QUALITY_GATE;
  else process.env.SPECKIT_SAVE_QUALITY_GATE = ORIGINAL_ENV.SPECKIT_SAVE_QUALITY_GATE;
});

afterAll(() => {
  try {
    vectorIndex.closeDb();
  } catch {
    // Ignore cleanup errors in tests
  }
  fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
  fs.rmSync(FIXTURE_ROOT, { recursive: true, force: true });
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
      asyncEmbedding: true,
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
      asyncEmbedding: true,
    });

    const parsed = parseResponse(response);
    expect(['indexed', 'created', 'updated', 'deferred']).toContain(parsed.data.status);
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
