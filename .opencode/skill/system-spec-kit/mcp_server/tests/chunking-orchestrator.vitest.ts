import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MockChunk = {
  content: string;
  anchorIds: string[];
  label: string;
  charCount: number;
};

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

let testDb: Database.Database | null = null;
let tempDir: string | null = null;
let mockChunks: MockChunk[] = [];
let mockParentSummary = 'Chunked parent summary';

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

vi.mock('../lib/providers/embeddings', () => ({
  getModelName: vi.fn(() => 'test-embedding-model'),
  getEmbeddingDimension: vi.fn(() => 3),
  generateDocumentEmbedding: vi.fn(),
}));

vi.mock('../lib/cache/embedding-cache', () => ({
  initEmbeddingCache: vi.fn((db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS embedding_cache (
        content_hash TEXT NOT NULL,
        model_id TEXT NOT NULL,
        embedding BLOB NOT NULL,
        dimensions INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (content_hash, model_id)
      )
    `);
  }),
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
    scores: chunks.map((chunk) => ({
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
  buildBm25DocumentText: vi.fn(() => ''),
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
  init: vi.fn((db: Database.Database) => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        spec_folder TEXT,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system'
      )
    `);
  }),
  recordHistory: vi.fn(),
}));

vi.mock('../handlers/memory-crud-utils', () => ({
  appendMutationLedgerSafe: vi.fn(),
}));

vi.mock('../lib/search/search-flags', () => ({
  isEncodingIntentEnabled: vi.fn(() => false),
}));

import { indexChunkedMemoryFile } from '../handlers/chunking-orchestrator';
import * as embeddings from '../lib/providers/embeddings';
import { closeDb, initializeDb } from '../lib/search/vector-index';

function createParsedMemory(filePath: string): ParsedMemoryInput {
  return {
    specFolder: 'specs/test-chunking',
    filePath,
    title: 'Chunked Memory',
    triggerPhrases: [],
    content: 'Mocked content (chunking is controlled by the test)',
    contentHash: 'content-hash-123',
    contextType: 'implementation',
    importanceTier: 'normal',
    memoryType: 'declarative',
    memoryTypeSource: 'manual',
    documentType: 'memory',
    qualityScore: 0.9,
    qualityFlags: [],
  };
}

beforeEach(() => {
  vi.clearAllMocks();

  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chunking-orchestrator-'));
  process.env.MEMORY_ALLOWED_PATHS = tempDir;
  process.env.EMBEDDING_DIM = '3';

  testDb = initializeDb(path.join(tempDir, 'context-index.sqlite'));
  mockParentSummary = 'Chunked parent summary';
  mockChunks = [
    {
      content: 'Chunk A content',
      anchorIds: ['chunk-a'],
      label: 'chunk-a',
      charCount: 15,
    },
    {
      content: 'Chunk B content',
      anchorIds: ['chunk-b'],
      label: 'chunk-b',
      charCount: 15,
    },
    {
      content: 'Chunk C content',
      anchorIds: ['chunk-c'],
      label: 'chunk-c',
      charCount: 15,
    },
  ];
});

afterEach(() => {
  closeDb();
  testDb = null;

  delete process.env.EMBEDDING_DIM;
  delete process.env.MEMORY_ALLOWED_PATHS;

  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('chunking orchestrator deferred anchor identity', () => {
  it('keeps separate active projection rows for mixed embedded and deferred chunk children', async () => {
    const filePath = path.join(tempDir ?? os.tmpdir(), 'mixed-chunks.md');
    fs.writeFileSync(filePath, '# Chunked content', 'utf8');

    vi.mocked(embeddings.generateDocumentEmbedding)
      .mockImplementationOnce(async () => new Float32Array([0.1, 0.2, 0.3]))
      .mockImplementationOnce(async () => null as unknown as Float32Array)
      .mockImplementationOnce(async () => null as unknown as Float32Array);

    const parsed = createParsedMemory(filePath);
    const result = await indexChunkedMemoryFile(filePath, parsed);

    expect(result.status).toBe('indexed');

    const parentId = result.id;
    const childRows = requireTestDb().prepare(`
      SELECT id, anchor_id, chunk_label, embedding_status
      FROM memory_index
      WHERE parent_id = ?
      ORDER BY chunk_index ASC
    `).all(parentId) as Array<{
      id: number;
      anchor_id: string | null;
      chunk_label: string | null;
      embedding_status: string;
    }>;

    expect(childRows).toHaveLength(3);
    expect(childRows.map((row) => row.anchor_id)).toEqual(['chunk-a', 'chunk-b', 'chunk-c']);
    expect(childRows.map((row) => row.chunk_label)).toEqual(['chunk-a', 'chunk-b', 'chunk-c']);
    expect(childRows.map((row) => row.embedding_status)).toEqual(['success', 'pending', 'pending']);

    const parentRow = requireTestDb().prepare(`
      SELECT canonical_file_path
      FROM memory_index
      WHERE id = ?
    `).get(parentId) as {
      canonical_file_path: string;
    };

    const placeholders = childRows.map(() => '?').join(', ');
    const projectionRows = requireTestDb().prepare(`
      SELECT logical_key, active_memory_id
      FROM active_memory_projection
      WHERE active_memory_id IN (${placeholders})
      ORDER BY logical_key ASC
    `).all(...childRows.map((row) => row.id)) as Array<{
      logical_key: string;
      active_memory_id: number;
    }>;

    expect(projectionRows).toHaveLength(3);
    expect(projectionRows.map((row) => row.active_memory_id).sort((a, b) => a - b)).toEqual(
      childRows.map((row) => row.id).sort((a, b) => a - b),
    );
    expect(projectionRows.map((row) => row.logical_key)).toEqual([
      `${parsed.specFolder}::${parentRow.canonical_file_path}::chunk-a`,
      `${parsed.specFolder}::${parentRow.canonical_file_path}::chunk-b`,
      `${parsed.specFolder}::${parentRow.canonical_file_path}::chunk-c`,
    ]);
  });
});
