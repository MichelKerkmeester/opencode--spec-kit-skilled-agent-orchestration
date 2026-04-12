import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as bm25Index from '../lib/search/bm25-index';
import * as vectorIndex from '../lib/search/vector-index';
import * as incrementalIndex from '../lib/storage/incremental-index';
import * as lineageState from '../lib/storage/lineage-state';
import * as dbHelpers from '../handlers/save/db-helpers';
import {
  CONTINUITY_ANCHOR_ID,
  createMemoryRecord,
  findSamePathExistingMemory,
  resolveCreateRecordIdentity,
} from '../handlers/save/create-record';

function createMinimalDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      title TEXT,
      content_hash TEXT,
      parent_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      importance_tier TEXT DEFAULT 'normal',
      tenant_id TEXT,
      user_id TEXT,
      agent_id TEXT,
      session_id TEXT
    );
  `);
  return db;
}

function buildParsedMemory(overrides: Record<string, unknown> = {}) {
  return {
    filePath: '/tmp/specs/026/memory/session.md',
    specFolder: 'specs/026-gate-c',
    title: 'Gate C session',
    triggerPhrases: ['gate c'],
    contextType: 'implementation',
    importanceTier: 'critical',
    contentHash: 'sha256:test-hash',
    content: 'writer-ready content',
    fileSize: 128,
    lastModified: '2026-04-11T20:00:00Z',
    memoryType: 'session_context',
    memoryTypeSource: 'test',
    memoryTypeConfidence: 1,
    causalLinks: {
      caused_by: [],
      supersedes: [],
      derived_from: [],
      blocks: [],
      related_to: [],
    },
    hasCausalLinks: false,
    documentType: 'implementation-summary',
    qualityScore: 0.9,
    qualityFlags: [],
    ...overrides,
  } as any;
}

describe('create-record identity helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('TGC4-1 resolves routed doc-anchor identity from parsed hints', () => {
    const parsed = buildParsedMemory({
      targetDocPath: '/tmp/specs/026/implementation-summary.md',
      targetAnchorId: 'executive-summary',
      routeAs: 'task_update',
    });

    const resolved = resolveCreateRecordIdentity(parsed, parsed.filePath);

    expect(resolved.targetDocPath).toBe('/tmp/specs/026/implementation-summary.md');
    expect(resolved.canonicalFilePath).toBe('/tmp/specs/026/implementation-summary.md');
    expect(resolved.targetAnchorId).toBe('executive-summary');
    expect(resolved.routeAs).toBe('task_update');
  });

  it('TGC4-2 maps metadata-only routed saves to the continuity anchor', () => {
    const parsed = buildParsedMemory({
      targetDocPath: '/tmp/specs/026/implementation-summary.md',
      routeAs: 'metadata_only',
      continuitySourceKey: 'session-dedup',
    });

    const resolved = resolveCreateRecordIdentity(parsed, parsed.filePath);

    expect(resolved.targetDocPath).toBe('/tmp/specs/026/implementation-summary.md');
    expect(resolved.targetAnchorId).toBe(CONTINUITY_ANCHOR_ID);
    expect(resolved.continuitySourceKey).toBe('session-dedup');
  });

  it('TGC4-3 preserves legacy file-path identity when no routed hints exist', () => {
    const parsed = buildParsedMemory();

    const resolved = resolveCreateRecordIdentity(parsed, parsed.filePath);

    expect(resolved.targetDocPath).toBe(parsed.filePath);
    expect(resolved.canonicalFilePath).toBe(parsed.filePath);
    expect(resolved.targetAnchorId).toBeNull();
  });

  it('TGC4-4 scopes same-path lookup to the routed anchor identity', () => {
    const db = createMinimalDb();
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, anchor_id, title, content_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      11,
      'specs/026-gate-c',
      '/tmp/specs/026/implementation-summary.md',
      '/tmp/specs/026/implementation-summary.md',
      'executive-summary',
      'Exec summary',
      'hash-exec',
    );
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, anchor_id, title, content_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      12,
      'specs/026-gate-c',
      '/tmp/specs/026/implementation-summary.md',
      '/tmp/specs/026/implementation-summary.md',
      CONTINUITY_ANCHOR_ID,
      'Continuity',
      'hash-continuity',
    );

    const existing = findSamePathExistingMemory(
      db,
      'specs/026-gate-c',
      '/tmp/specs/026/implementation-summary.md',
      '/tmp/specs/026/implementation-summary.md',
      {},
      {
        targetDocPath: '/tmp/specs/026/implementation-summary.md',
        canonicalFilePath: '/tmp/specs/026/implementation-summary.md',
        targetAnchorId: CONTINUITY_ANCHOR_ID,
      },
    );

    expect(existing?.id).toBe(12);
    db.close();
  });

  it('TGC4-5 routes createMemoryRecord through the canonical doc-anchor identity when hints are provided', () => {
    const db = createMinimalDb();
    db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, canonical_file_path, anchor_id, title, content_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      21,
      'specs/026-gate-c',
      '/tmp/specs/026/implementation-summary.md',
      '/tmp/specs/026/implementation-summary.md',
      CONTINUITY_ANCHOR_ID,
      'Previous continuity',
      'older-hash',
    );

    const indexSpy = vi.spyOn(vectorIndex, 'indexMemory').mockReturnValue(77);
    vi.spyOn(bm25Index, 'isBm25Enabled').mockReturnValue(false);
    vi.spyOn(incrementalIndex, 'getFileMetadata').mockReturnValue(null as any);
    vi.spyOn(dbHelpers, 'applyPostInsertMetadata').mockImplementation(() => {});
    vi.spyOn(lineageState, 'recordLineageTransition').mockImplementation(() => undefined);

    const parsed = buildParsedMemory({
      contentHash: 'newer-hash',
    });

    const id = createMemoryRecord(
      db,
      parsed,
      parsed.filePath,
      new Float32Array([0.1, 0.2, 0.3, 0.4]),
      null,
      {
        action: 'CREATE',
        similarity: 0,
      },
      {},
      {
        targetDocPath: '/tmp/specs/026/implementation-summary.md',
        targetAnchorId: CONTINUITY_ANCHOR_ID,
        routeAs: 'metadata_only',
      },
    );

    expect(id).toBe(77);
    expect(indexSpy).toHaveBeenCalledWith(expect.objectContaining({
      filePath: '/tmp/specs/026/implementation-summary.md',
      anchorId: CONTINUITY_ANCHOR_ID,
      appendOnly: true,
    }));

    db.close();
  });
});
