// TEST: Chunking Orchestrator Safe-Swap Regressions (T013)
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

type MockChunk = {
  content: string;
  anchorIds: string[];
  label: string;
  charCount: number;
};

let testDb: Database.Database | null = null;
let mockChunks: MockChunk[] = [];
let mockParentSummary = 'Updated parent summary';

function requireTestDb(): Database.Database {
  if (!testDb) {
    throw new Error('Test database is not initialized');
  }
  return testDb;
}

vi.mock('../utils', () => ({
  requireDb: () => requireTestDb(),
  toErrorMessage: (err: unknown) => (err instanceof Error ? err.message : String(err)),
}));

vi.mock('../lib/search/vector-index', () => ({
  indexMemory: vi.fn(),
  indexMemoryDeferred: vi.fn(),
  deleteMemory: vi.fn(),
}));

vi.mock('../lib/providers/embeddings', () => ({
  getModelName: vi.fn(() => 'test-embedding-model'),
  getEmbeddingDimension: vi.fn(() => 3),
  generateDocumentEmbedding: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
}));

vi.mock('../lib/cache/embedding-cache', () => ({
  lookupEmbedding: vi.fn(() => null),
  storeEmbedding: vi.fn(),
  computeContentHash: vi.fn((content: string) => `hash-${content.length}`),
}));

vi.mock('../lib/chunking/anchor-chunker', () => ({
  needsChunking: vi.fn(() => true),
  chunkLargeFile: vi.fn(() => ({
    strategy: 'anchor',
    chunks: mockChunks,
    parentSummary: mockParentSummary,
  })),
}));

vi.mock('../lib/chunking/chunk-thinning', () => ({
  thinChunks: vi.fn((chunks: MockChunk[]) => ({
    original: chunks,
    retained: chunks,
    dropped: [],
    scores: chunks.map(chunk => ({
      chunk,
      score: 1,
      anchorScore: chunk.anchorIds.length > 0 ? 1 : 0,
      densityScore: 1,
      retained: true,
    })),
  })),
}));

vi.mock('../lib/search/bm25-index', () => ({
  isBm25Enabled: vi.fn(() => false),
  getIndex: vi.fn(() => ({
    addDocument: vi.fn(),
    removeDocument: vi.fn(),
  })),
}));

vi.mock('../lib/storage/incremental-index', () => ({
  getFileMetadata: vi.fn(() => null),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
  clearCache: vi.fn(),
}));

vi.mock('../lib/cache/tool-cache', () => ({
  invalidateOnWrite: vi.fn(),
}));

vi.mock('../lib/storage/history', () => ({
  recordHistory: vi.fn(),
}));

vi.mock('../handlers/memory-crud-utils', () => ({
  appendMutationLedgerSafe: vi.fn(),
}));

vi.mock('../lib/search/search-flags', () => ({
  isEncodingIntentEnabled: vi.fn(() => false),
}));

import { indexChunkedMemoryFile } from '../handlers/chunking-orchestrator';
import * as vectorIndex from '../lib/search/vector-index';
import * as bm25Index from '../lib/search/bm25-index';
import * as embeddings from '../lib/providers/embeddings';
import * as embeddingCache from '../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../lib/parsing/content-normalizer';
import * as history from '../lib/storage/history';

type ParsedMemoryInput = {
  specFolder: string;
  filePath: string;
  title: string;
  triggerPhrases: string[];
  content: string;
  contentHash: string;
  contextType: string;
  importanceTier: string;
  memoryType: string;
  memoryTypeSource: string;
  documentType: string;
  qualityScore: number;
  qualityFlags: string[];
};

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      parent_id INTEGER,
      anchor_id TEXT,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL DEFAULT 0.5,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      embedding_status TEXT DEFAULT 'pending',
      content_hash TEXT,
      context_type TEXT,
      importance_tier TEXT,
      memory_type TEXT,
      type_inference_source TEXT,
      stability REAL,
      difficulty REAL,
      review_count INTEGER,
      file_mtime_ms INTEGER,
      encoding_intent TEXT,
      document_type TEXT,
      spec_level INTEGER,
      quality_score REAL DEFAULT 0,
      quality_flags TEXT,
      chunk_index INTEGER,
      chunk_label TEXT,
      content_text TEXT,
      is_archived INTEGER DEFAULT 0
    );
  `);
  return db;
}

function createParsedMemory(filePath: string): ParsedMemoryInput {
  return {
    specFolder: 'specs/test-safe-swap',
    filePath,
    title: 'Safe Swap Parent',
    triggerPhrases: [],
    content: 'Mocked content (chunking is controlled by test)',
    contentHash: 'new-content-hash',
    contextType: 'implementation',
    importanceTier: 'normal',
    memoryType: 'declarative',
    memoryTypeSource: 'test',
    documentType: 'memory',
    qualityScore: 0.85,
    qualityFlags: [],
  };
}

function insertIndexedRow(
  params: {
    specFolder: string;
    filePath: string;
    anchorId?: string | null;
    title?: string | null;
    triggerPhrases?: string[];
    importanceWeight?: number;
    contentText?: string | null;
  },
  embeddingStatus: 'success' | 'pending'
): number {
  const db = requireTestDb();
  const result = db.prepare(`
    INSERT INTO memory_index (
      spec_folder,
      file_path,
      canonical_file_path,
      parent_id,
      anchor_id,
      title,
      trigger_phrases,
      importance_weight,
      embedding_status,
      content_text,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(
    params.specFolder,
    params.filePath,
    params.filePath,
    params.anchorId ?? null,
    params.title ?? null,
    JSON.stringify(params.triggerPhrases ?? []),
    params.importanceWeight ?? 0.5,
    embeddingStatus,
    params.contentText ?? null,
  );
  return Number(result.lastInsertRowid);
}

function configureVectorIndexMocks(): void {
  vi.mocked(vectorIndex.indexMemory).mockImplementation((params) => insertIndexedRow(params, 'success'));
  vi.mocked(vectorIndex.indexMemoryDeferred).mockImplementation((params) => insertIndexedRow(params, 'pending'));
  vi.mocked(vectorIndex.deleteMemory).mockImplementation((id: number) => {
    const result = requireTestDb().prepare('DELETE FROM memory_index WHERE id = ?').run(id);
    return result.changes > 0;
  });
}

function applyTestMetadata(
  db: Database.Database,
  memoryId: number,
  fields: Record<string, unknown>,
): void {
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return;
  }

  const setClause = entries.map(([column]) => `${column} = ?`).join(', ');
  db.prepare(`UPDATE memory_index SET ${setClause} WHERE id = ?`).run(
    ...entries.map(([, value]) => value),
    memoryId,
  );
}

function seedExistingParentWithChildren(filePath: string, oldChildCount: number): { parentId: number; oldChildIds: number[] } {
  const db = requireTestDb();
  const parentInsert = db.prepare(`
    INSERT INTO memory_index (
      spec_folder,
      file_path,
      canonical_file_path,
      parent_id,
      title,
      trigger_phrases,
      importance_weight,
      embedding_status,
      content_hash,
      context_type,
      importance_tier,
      content_text,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(
    'specs/test-safe-swap',
    filePath,
    filePath,
    'Safe Swap Parent (old)',
    '[]',
    0.5,
    'partial',
    'old-content-hash',
    'implementation',
    'normal',
    'Old parent summary',
  );
  const parentId = Number(parentInsert.lastInsertRowid);

  const oldChildIds: number[] = [];
  const childStmt = db.prepare(`
    INSERT INTO memory_index (
      spec_folder,
      file_path,
      canonical_file_path,
      parent_id,
      title,
      trigger_phrases,
      importance_weight,
      embedding_status,
      chunk_index,
      chunk_label,
      content_text,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  for (let i = 0; i < oldChildCount; i++) {
    const child = childStmt.run(
      'specs/test-safe-swap',
      filePath,
      filePath,
      parentId,
      `Old child ${i + 1}`,
      '[]',
      0.5,
      'success',
      i,
      `old-${i + 1}`,
      `old-child-content-${i + 1}`,
    );
    oldChildIds.push(Number(child.lastInsertRowid));
  }

  return { parentId, oldChildIds };
}

describe('T013: staged swap regressions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testDb = createTestDb();
    mockChunks = [
      { content: 'new chunk 1', anchorIds: ['a1'], label: 'new-1', charCount: 11 },
      { content: 'new chunk 2', anchorIds: ['a2'], label: 'new-2', charCount: 11 },
    ];
    mockParentSummary = 'Updated parent summary';
    configureVectorIndexMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (testDb) {
      testDb.close();
      testDb = null;
    }
  });

  it('successful swap deletes old children and links new children atomically', async () => {
    const filePath = '/tmp/specs/test-safe-swap/memory.md';
    const { parentId, oldChildIds } = seedExistingParentWithChildren(filePath, 2);
    const parsed = createParsedMemory(filePath);

    const result = await indexChunkedMemoryFile(filePath, parsed);
    expect(result.status).toBe('updated');

    const db = requireTestDb();
    const oldChildrenRemaining = db.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index
      WHERE id IN (${oldChildIds.map(() => '?').join(', ')})
    `).get(...oldChildIds) as { count: number };
    expect(oldChildrenRemaining.count).toBe(0);

    const newChildren = db.prepare(`
      SELECT id, parent_id, chunk_label, embedding_status
      FROM memory_index
      WHERE parent_id = ?
      ORDER BY chunk_index ASC, id ASC
    `).all(parentId) as Array<{
      id: number;
      parent_id: number | null;
      chunk_label: string | null;
      embedding_status: string;
    }>;

    expect(newChildren).toHaveLength(mockChunks.length);
    expect(newChildren.every(row => row.parent_id === parentId)).toBe(true);
    expect(newChildren.map(row => row.chunk_label)).toEqual(mockChunks.map(chunk => chunk.label));

    const stagedChildren = db.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index
      WHERE file_path = ? AND parent_id IS NULL AND id != ?
    `).get(filePath, parentId) as { count: number };
    expect(stagedChildren.count).toBe(0);

    const parentRow = db.prepare(`
      SELECT content_hash, content_text
      FROM memory_index
      WHERE id = ?
    `).get(parentId) as { content_hash: string; content_text: string };
    expect(parentRow.content_hash).toBe(parsed.contentHash);
    expect(parentRow.content_text).toBe(mockParentSummary);

    const deleteHistoryCalls = vi.mocked(history.recordHistory).mock.calls
      .filter(([, event, , , actor]) => event === 'DELETE' && actor === 'mcp:chunking_reindex');
    expect(deleteHistoryCalls.map(([memoryId]) => memoryId)).toEqual(oldChildIds);

    const deleteMemoryCalls = vi.mocked(vectorIndex.deleteMemory).mock.calls.map(([memoryId]) => memoryId);
    expect(deleteMemoryCalls).toEqual(oldChildIds);
  });

  it('swap failure rolls back: old children remain and staged children are cleaned', async () => {
    const filePath = '/tmp/specs/test-safe-swap/memory-fail.md';
    const { parentId, oldChildIds } = seedExistingParentWithChildren(filePath, 2);
    const parsed = createParsedMemory(filePath);
    const db = requireTestDb();

    const realTransaction = db.transaction.bind(db) as Database.Database['transaction'];
    let transactionCalls = 0;
    vi.spyOn(db, 'transaction')
      .mockImplementation(((fn: Parameters<Database.Database['transaction']>[0]) => {
        transactionCalls += 1;
        if (transactionCalls === 4) {
          return (() => {
            throw new Error('forced finalize swap failure');
          }) as unknown as ReturnType<Database.Database['transaction']>;
        }
        return realTransaction(fn);
      }) as Database.Database['transaction']);

    const result = await indexChunkedMemoryFile(filePath, parsed);
    expect(result.status).toBe('error');
    expect(result.message).toContain('failed to finalize safe swap');

    const remainingChildren = db.prepare(`
      SELECT id
      FROM memory_index
      WHERE parent_id = ?
      ORDER BY id ASC
    `).all(parentId) as Array<{ id: number }>;
    expect(remainingChildren.map(row => row.id)).toEqual(oldChildIds);

    const stagedChildren = db.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index
      WHERE file_path = ? AND parent_id IS NULL AND id != ?
    `).get(filePath, parentId) as { count: number };
    expect(stagedChildren.count).toBe(0);

    const rollbackHistoryCalls = vi.mocked(history.recordHistory).mock.calls
      .filter(([, event, , , actor]) => event === 'DELETE' && actor === 'mcp:chunking_rollback');
    expect(rollbackHistoryCalls).toHaveLength(mockChunks.length);

    const rollbackDeletedIds = rollbackHistoryCalls.map(([memoryId]) => memoryId);
    const deleteMemoryCalls = vi.mocked(vectorIndex.deleteMemory).mock.calls.map(([memoryId]) => memoryId);
    expect(deleteMemoryCalls).toEqual(rollbackDeletedIds);
  });

  it('fails safe-swap finalization when old-child bulk delete fails and keeps old children linked', async () => {
    const filePath = '/tmp/specs/test-safe-swap/memory-delete-fail.md';
    const { parentId, oldChildIds } = seedExistingParentWithChildren(filePath, 2);
    const parsed = createParsedMemory(filePath);

    const realDelete = vi.mocked(vectorIndex.deleteMemory).getMockImplementation();
    vi.mocked(vectorIndex.deleteMemory).mockImplementation((id: number) => {
      if (oldChildIds.includes(id)) {
        return false;
      }
      if (realDelete) {
        return realDelete(id);
      }
      return false;
    });

    const result = await indexChunkedMemoryFile(filePath, parsed);
    expect(result.status).toBe('error');
    expect(result.message).toContain('failed to finalize safe swap');

    const db = requireTestDb();
    const oldChildren = db.prepare(`
      SELECT id, parent_id
      FROM memory_index
      WHERE id IN (${oldChildIds.map(() => '?').join(', ')})
      ORDER BY id ASC
    `).all(...oldChildIds) as Array<{ id: number; parent_id: number | null }>;
    expect(oldChildren.map((row) => row.id)).toEqual(oldChildIds);
    expect(oldChildren.every((row) => row.parent_id === parentId)).toBe(true);
  });

  it('partial embedding failures still swap successfully with mixed child statuses', async () => {
    mockChunks = [
      { content: 'partial chunk 1', anchorIds: ['p1'], label: 'partial-1', charCount: 15 },
      { content: 'partial chunk 2', anchorIds: ['p2'], label: 'partial-2', charCount: 15 },
      { content: 'partial chunk 3', anchorIds: ['p3'], label: 'partial-3', charCount: 15 },
    ];

    vi.mocked(embeddings.generateDocumentEmbedding)
      .mockResolvedValueOnce(new Float32Array([0.11, 0.22, 0.33]))
      .mockRejectedValueOnce(new Error('simulated embedding outage'))
      .mockResolvedValueOnce(new Float32Array([0.44, 0.55, 0.66]));

    const filePath = '/tmp/specs/test-safe-swap/memory-partial.md';
    const { parentId, oldChildIds } = seedExistingParentWithChildren(filePath, 2);
    const parsed = createParsedMemory(filePath);

    const result = await indexChunkedMemoryFile(filePath, parsed);
    expect(result.status).toBe('updated');
    expect(result.message).toContain(`Chunked: ${mockChunks.length}/${mockChunks.length} chunks indexed`);

    expect(vi.mocked(vectorIndex.indexMemoryDeferred).mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(vi.mocked(vectorIndex.indexMemory).mock.calls.length).toBeGreaterThanOrEqual(1);

    const db = requireTestDb();
    const oldChildrenRemaining = db.prepare(`
      SELECT COUNT(*) as count
      FROM memory_index
      WHERE id IN (${oldChildIds.map(() => '?').join(', ')})
    `).get(...oldChildIds) as { count: number };
    expect(oldChildrenRemaining.count).toBe(0);

    const newChildren = db.prepare(`
      SELECT embedding_status, parent_id
      FROM memory_index
      WHERE parent_id = ?
      ORDER BY chunk_index ASC
    `).all(parentId) as Array<{ embedding_status: string; parent_id: number | null }>;

    expect(newChildren).toHaveLength(mockChunks.length);
    expect(newChildren.some(row => row.embedding_status === 'pending')).toBe(true);
    expect(newChildren.some(row => row.embedding_status === 'success')).toBe(true);
    expect(newChildren.every(row => row.parent_id === parentId)).toBe(true);
  });

  it('rolls back inserted child rows when metadata application fails mid-chunk', async () => {
    mockChunks = [
      { content: 'metadata chunk 1', anchorIds: ['m1'], label: 'metadata-1', charCount: 16 },
      { content: 'metadata chunk 2', anchorIds: ['m2'], label: 'metadata-2', charCount: 16 },
    ];

    const filePath = '/tmp/specs/test-safe-swap/memory-metadata-fail.md';
    const parsed = createParsedMemory(filePath);
    const applyPostInsertMetadata = vi.fn((db: Database.Database, memoryId: number, fields: Record<string, unknown>) => {
      if (fields.chunk_label === 'metadata-1') {
        throw new Error('forced metadata write failure');
      }
      applyTestMetadata(db, memoryId, fields);
    });

    const result = await indexChunkedMemoryFile(filePath, parsed, { applyPostInsertMetadata });
    expect(result.status).toBe('indexed');
    expect(result.message).toContain('Chunked: 1/2 chunks indexed');

    const db = requireTestDb();
    const failedChild = db.prepare(`
      SELECT id
      FROM memory_index
      WHERE file_path = ? AND title = ?
    `).get(filePath, 'Safe Swap Parent [chunk 1/2]');
    expect(failedChild).toBeUndefined();

    const survivingChildren = db.prepare(`
      SELECT chunk_label
      FROM memory_index
      WHERE file_path = ? AND parent_id IS NOT NULL
      ORDER BY chunk_index ASC
    `).all(filePath) as Array<{ chunk_label: string | null }>;
    expect(survivingChildren.map((row) => row.chunk_label)).toEqual(['metadata-2']);
  });

  it('does not mutate parent BM25 document when all chunk inserts fail for an existing parent', async () => {
    const filePath = '/tmp/specs/test-safe-swap/memory-bm25-rollback.md';
    const { parentId } = seedExistingParentWithChildren(filePath, 1);
    const parsed = createParsedMemory(filePath);

    const bm25AddDocument = vi.fn();
    const bm25RemoveDocument = vi.fn();
    vi.mocked(bm25Index.isBm25Enabled).mockReturnValue(true);
    vi.mocked(bm25Index.getIndex).mockReturnValue({
      addDocument: bm25AddDocument,
      removeDocument: bm25RemoveDocument,
    } as unknown as ReturnType<typeof bm25Index.getIndex>);

    const result = await indexChunkedMemoryFile(filePath, parsed, {
      applyPostInsertMetadata: () => {
        throw new Error('forced metadata failure for all chunks');
      },
    });

    expect(result.status).toBe('error');
    expect(result.message).toContain('existing parent retained');
    expect(bm25AddDocument).not.toHaveBeenCalledWith(String(parentId), expect.any(String));
    expect(bm25AddDocument).not.toHaveBeenCalled();

    const db = requireTestDb();
    const parentRow = db.prepare('SELECT content_text FROM memory_index WHERE id = ?').get(parentId) as { content_text: string | null };
    expect(parentRow.content_text).toBe('Old parent summary');
  });

  it('uses normalized content hash for chunk embedding cache keys', async () => {
    mockChunks = [
      {
        content: '---\ntitle: Cache Key\n---\n\n## Heading\n- bullet item\n<!-- ANCHOR:test -->',
        anchorIds: ['cache-1'],
        label: 'cache-1',
        charCount: 79,
      },
    ];

    const filePath = '/tmp/specs/test-safe-swap/memory-cache-key.md';
    const parsed = createParsedMemory(filePath);

    await indexChunkedMemoryFile(filePath, parsed);

    const expectedNormalized = normalizeContentForEmbedding(mockChunks[0].content);
    expect(vi.mocked(embeddingCache.computeContentHash)).toHaveBeenCalledWith(expectedNormalized);
    expect(vi.mocked(embeddingCache.computeContentHash)).not.toHaveBeenCalledWith(mockChunks[0].content);
  });
});
