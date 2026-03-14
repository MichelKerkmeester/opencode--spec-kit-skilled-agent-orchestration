// TEST: Memory Summaries (TF-IDF Summarizer + Storage)
// Covers: TF-IDF extractive summarizer and memory summary storage
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';

import {
  computeTfIdf,
  extractKeySentences,
  generateSummary,
  __testables as tfidfTestables,
} from '../lib/search/tfidf-summarizer';

import {
  generateAndStoreSummary,
  querySummaryEmbeddings,
  checkScaleGate,
  __testables as summaryTestables,
} from '../lib/search/memory-summaries';

/* ───────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────── */

const { cosineSimilarity, float32ToBuffer, bufferToFloat32 } = summaryTestables;

interface StoredSummaryRow {
  memory_id: number;
  summary_text: string;
  summary_embedding: Buffer | null;
  key_sentences: string;
}

function expectRow<T>(row: T | undefined): T {
  expect(row).toBeDefined();
  return row as T;
}

/**
 * Deterministic mock embedding function.
 * Produces a fixed-size Float32Array (dim=8) derived from char codes.
 */
function mockEmbeddingFn(text: string): Promise<Float32Array> {
  const dim = 8;
  const arr = new Float32Array(dim);
  for (let i = 0; i < text.length; i++) {
    arr[i % dim] += text.charCodeAt(i) / 1000;
  }
  // Normalize to unit vector for meaningful cosine similarity
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += arr[i] * arr[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dim; i++) arr[i] /= norm;
  }
  return Promise.resolve(arr);
}

/**
 * Creates an in-memory SQLite database with the required schema.
 */
function createTestDb(): Database.Database {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path TEXT,
      title TEXT,
      embedding_status TEXT DEFAULT 'success'
    );
  `);

  db.exec(`
    CREATE TABLE memory_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL UNIQUE,
      summary_text TEXT NOT NULL,
      summary_embedding BLOB,
      key_sentences TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
}

/**
 * Insert a memory_index row for testing.
 */
function insertMemory(db: Database.Database, id: number, opts?: { specFolder?: string; title?: string; status?: string }): void {
  db.prepare(`
    INSERT INTO memory_index (id, spec_folder, file_path, title, embedding_status)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    opts?.specFolder ?? 'test-folder',
    `/test/path/memory-${id}.md`,
    opts?.title ?? `Memory ${id}`,
    opts?.status ?? 'success',
  );
}

/* ===============================================================
   1. TF-IDF Summarizer — computeTfIdf
   =============================================================== */

describe('computeTfIdf', () => {
  it('returns empty array for empty input', () => {
    const result = computeTfIdf([]);
    expect(result).toEqual([]);
  });

  it('returns score 0 for a single sentence (IDF=log(1/1)=0 for all terms)', () => {
    const result = computeTfIdf(['The quick brown fox jumps over the lazy dog']);
    expect(result).toHaveLength(1);
    // With only one sentence, every term appears in 1/1 sentences -> IDF = log(1) = 0
    // Therefore TF*IDF = 0 for all terms, total score = 0
    expect(result[0].score).toBe(0);
    expect(result[0].index).toBe(0);
  });

  it('scores longer sentences with more unique terms higher', () => {
    const sentences = [
      'cat',
      'the cat sat on the mat near the door by the window of the house',
    ];
    const result = computeTfIdf(sentences);
    // Sentence with more unique terms accumulates more TF-IDF mass
    const shortScore = result.find(r => r.index === 0)!.score;
    const longScore = result.find(r => r.index === 1)!.score;
    // The longer sentence has more unique terms, so likely higher raw score -> 1.0 after normalization
    expect(longScore).toBeGreaterThanOrEqual(shortScore);
  });

  it('gives common words across sentences lower IDF', () => {
    // 'the' appears in all three sentences -> IDF = log(3/3) = 0
    const sentences = [
      'the cat is here',
      'the dog is there',
      'the bird is everywhere',
    ];
    const result = computeTfIdf(sentences);
    // All should have scores, normalized to [0,1] range
    expect(result).toHaveLength(3);
    for (const r of result) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(1);
    }
  });

  it('normalizes all scores to [0, 1]', () => {
    const sentences = [
      'Alpha bravo charlie delta echo',
      'Foxtrot golf hotel india juliet',
      'Kilo lima mike november oscar',
      'Papa quebec romeo sierra tango',
    ];
    const result = computeTfIdf(sentences);
    const maxScore = Math.max(...result.map(r => r.score));
    expect(maxScore).toBe(1);
    for (const r of result) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(1);
    }
  });

  it('handles punctuation correctly by stripping it during tokenization', () => {
    const sentences = [
      'Hello, world! This is a test.',
      'Another sentence with punctuation: colons; semicolons.',
    ];
    const result = computeTfIdf(sentences);
    expect(result).toHaveLength(2);
    // Should not crash; punctuation-stripped tokens are used
    for (const r of result) {
      expect(r.score).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles empty sentences within the array', () => {
    const sentences = ['', 'A meaningful sentence about testing', ''];
    const result = computeTfIdf(sentences);
    expect(result).toHaveLength(3);
    // Empty sentences should score 0
    expect(result[0].score).toBe(0);
    expect(result[2].score).toBe(0);
    // The meaningful sentence should score 1 (it is the max)
    expect(result[1].score).toBe(1);
  });

  it('handles multiple sentences with distinct terms', () => {
    const sentences = [
      'quantum mechanics involves particles and waves',
      'culinary arts require precision and creativity',
      'database indexing improves query performance',
    ];
    const result = computeTfIdf(sentences);
    expect(result).toHaveLength(3);
    // All sentences have distinct terms -> each has high IDF terms
    // Scores should all be > 0
    for (const r of result) {
      expect(r.score).toBeGreaterThan(0);
    }
  });
});

/* ===============================================================
   2. TF-IDF Summarizer — extractKeySentences
   =============================================================== */

describe('extractKeySentences', () => {
  it('returns empty array for empty content', () => {
    expect(extractKeySentences('')).toEqual([]);
    expect(extractKeySentences('   ')).toEqual([]);
  });

  it('returns top-3 sentences by default', () => {
    const content = [
      'The architecture of the system defines how components interact.',
      'Performance testing revealed bottlenecks in the query layer.',
      'Security audits found no critical vulnerabilities in the codebase.',
      'Documentation was updated to reflect the new API endpoints.',
      'The deployment pipeline runs integration tests before merging.',
    ].join('\n');

    const result = extractKeySentences(content);
    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.length).toBeGreaterThan(0);
  });

  it('respects custom n parameter', () => {
    const content = [
      'Sentence one about algorithms and data structures.',
      'Sentence two about network protocols and security.',
      'Sentence three about user interface design patterns.',
      'Sentence four about database normalization techniques.',
      'Sentence five about continuous integration pipelines.',
    ].join('\n');

    const result = extractKeySentences(content, 2);
    expect(result).toHaveLength(2);
  });

  it('filters sentences shorter than 10 characters', () => {
    const content = 'Hi.\nThis is a sufficiently long sentence about software engineering practices.';
    const result = extractKeySentences(content);
    // "Hi." is 3 chars -> filtered out; only the long sentence survives
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('software engineering');
  });

  it('filters sentences longer than 500 characters', () => {
    const longSentence = 'A'.repeat(501);
    const normalSentence = 'This is a normal-length sentence about memory summaries and retrieval.';
    const content = `${longSentence}\n${normalSentence}`;
    const result = extractKeySentences(content);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('normal-length');
  });

  it('returns sentences in original document order (not score order)', () => {
    const content = [
      'First sentence about quantum computing breakthroughs.',
      'Second sentence about distributed database replication.',
      'Third sentence about machine learning model training.',
      'Fourth sentence about cryptographic hash functions.',
      'Fifth sentence about functional programming paradigms.',
    ].join('\n');

    const result = extractKeySentences(content, 3);
    // Find indices in original content
    const lines = content.split('\n');
    const indices = result.map(s => lines.findIndex(l => l === s));
    // Verify ascending order
    for (let i = 1; i < indices.length; i++) {
      expect(indices[i]).toBeGreaterThan(indices[i - 1]);
    }
  });
});

/* ===============================================================
   3. TF-IDF Summarizer — generateSummary
   =============================================================== */

describe('generateSummary', () => {
  it('returns summary and keySentences properties', () => {
    const content = [
      'The system uses vector embeddings for semantic search.',
      'TF-IDF scoring ranks sentences by term importance.',
      'Memory summaries provide compressed representations.',
      'Retrieval pipelines combine multiple search channels.',
    ].join('\n');

    const result = generateSummary(content);
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('keySentences');
    expect(typeof result.summary).toBe('string');
    expect(Array.isArray(result.keySentences)).toBe(true);
  });

  it('returns empty summary for empty content', () => {
    const result = generateSummary('');
    expect(result.summary).toBe('');
    expect(result.keySentences).toEqual([]);
  });

  it('extracts top 3 sentences from multi-paragraph content', () => {
    const content = [
      'The memory system indexes documents for fast retrieval.',
      'Embeddings are generated using transformer models.',
      'Cosine similarity measures vector closeness.',
      'TF-IDF weights terms by frequency and rarity.',
      'The fusion layer combines scores from multiple channels.',
      'Checkpoint snapshots preserve database state.',
    ].join('\n');

    const result = generateSummary(content);
    expect(result.keySentences.length).toBeLessThanOrEqual(3);
    expect(result.keySentences.length).toBeGreaterThan(0);
  });

  it('joins key sentences with a space as the summary', () => {
    const content = [
      'Alpha sentence about search pipelines and indexing strategies.',
      'Beta sentence about embedding generation and vector storage.',
      'Gamma sentence about result ranking and relevance scoring.',
      'Delta sentence about query expansion and synonym matching.',
    ].join('\n');

    const result = generateSummary(content);
    if (result.keySentences.length > 0) {
      const expectedSummary = result.keySentences.join(' ');
      expect(result.summary).toBe(expectedSummary);
    }
  });
});

/* ===============================================================
   4. Memory Summaries Storage — generateAndStoreSummary
   =============================================================== */

describe('generateAndStoreSummary', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    insertMemory(db, 1);
    insertMemory(db, 2);
  });

  it('stores summary in the database', async () => {
    const content = [
      'The indexing pipeline processes documents in batch mode.',
      'Each document is tokenized and embedded before storage.',
      'Retrieval uses cosine similarity over the embedding space.',
      'Results are ranked and filtered by relevance threshold.',
    ].join('\n');

    await generateAndStoreSummary(db, 1, content, mockEmbeddingFn);

    const row = expectRow(
      db.prepare('SELECT * FROM memory_summaries WHERE memory_id = ?').get(1) as StoredSummaryRow | undefined,
    );
    expect(row).toBeDefined();
    expect(row.summary_text).toBeTruthy();
    expect(row.memory_id).toBe(1);
  });

  it('returns stored=true on success', async () => {
    const content = 'The system provides comprehensive search capabilities for memory retrieval.';
    const result = await generateAndStoreSummary(db, 1, content, mockEmbeddingFn);
    expect(result.stored).toBe(true);
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it('returns stored=false for empty content', async () => {
    const result = await generateAndStoreSummary(db, 1, '', mockEmbeddingFn);
    expect(result.stored).toBe(false);
    expect(result.summary).toBe('');
  });

  it('stores embedding as a BLOB', async () => {
    const content = [
      'Vector embeddings capture semantic meaning of text.',
      'The dimensionality of embeddings affects search precision.',
      'Quantization reduces storage requirements for large indices.',
    ].join('\n');

    await generateAndStoreSummary(db, 1, content, mockEmbeddingFn);

    const row = expectRow(
      db.prepare('SELECT summary_embedding FROM memory_summaries WHERE memory_id = ?').get(1) as Pick<StoredSummaryRow, 'summary_embedding'> | undefined,
    );
    expect(row).toBeDefined();
    expect(row.summary_embedding).toBeInstanceOf(Buffer);
    expect(row.summary_embedding?.length ?? 0).toBeGreaterThan(0);
  });

  it('stores key_sentences as JSON string', async () => {
    const content = [
      'The first key insight about memory architecture.',
      'The second key insight about embedding strategies.',
      'The third key insight about retrieval optimization.',
      'The fourth key insight about result fusion.',
    ].join('\n');

    await generateAndStoreSummary(db, 1, content, mockEmbeddingFn);

    const row = expectRow(
      db.prepare('SELECT key_sentences FROM memory_summaries WHERE memory_id = ?').get(1) as Pick<StoredSummaryRow, 'key_sentences'> | undefined,
    );
    expect(row).toBeDefined();
    const parsed = JSON.parse(row.key_sentences) as string[];
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
  });

  it('handles embeddingFn returning null gracefully', async () => {
    const nullEmbeddingFn = async (_text: string): Promise<Float32Array | null> => null;
    const content = 'This content should be summarized but embedding will be null for testing purposes.';

    const result = await generateAndStoreSummary(db, 1, content, nullEmbeddingFn);
    expect(result.stored).toBe(true);

    const row = expectRow(
      db.prepare('SELECT summary_embedding FROM memory_summaries WHERE memory_id = ?').get(1) as Pick<StoredSummaryRow, 'summary_embedding'> | undefined,
    );
    expect(row.summary_embedding).toBeNull();
  });
});

/* ===============================================================
   5. Memory Summaries Storage — querySummaryEmbeddings
   =============================================================== */

describe('querySummaryEmbeddings', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns results sorted by similarity descending', async () => {
    insertMemory(db, 1);
    insertMemory(db, 2);
    insertMemory(db, 3);

    // Store summaries with different content to produce distinct embeddings
    await generateAndStoreSummary(db, 1, 'The search pipeline retrieves documents using vector similarity over embedding space.', mockEmbeddingFn);
    await generateAndStoreSummary(db, 2, 'Cooking recipes require precise measurements and timing for best results.', mockEmbeddingFn);
    await generateAndStoreSummary(db, 3, 'The retrieval system uses semantic search and vector embeddings for matching.', mockEmbeddingFn);

    // Query with embedding similar to memory 1 and 3 (search/retrieval topic)
    const queryEmb = await mockEmbeddingFn('search pipeline vector similarity retrieval');

    const results = querySummaryEmbeddings(db, queryEmb, 10);
    expect(results.length).toBe(3);
    // Results should be sorted by similarity descending
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].similarity).toBeGreaterThanOrEqual(results[i].similarity);
    }
  });

  it('returns empty array when no summaries exist', () => {
    const queryEmb = new Float32Array([1, 0, 0, 0, 0, 0, 0, 0]);
    const results = querySummaryEmbeddings(db, queryEmb, 10);
    expect(results).toEqual([]);
  });

  it('respects the limit parameter', async () => {
    // Insert 5 memories with summaries
    for (let i = 1; i <= 5; i++) {
      insertMemory(db, i);
      await generateAndStoreSummary(db, i, `Unique content about topic number ${i} with enough length to qualify as a sentence.`, mockEmbeddingFn);
    }

    const queryEmb = await mockEmbeddingFn('topic content');
    const results = querySummaryEmbeddings(db, queryEmb, 2);
    expect(results).toHaveLength(2);
  });

  it('computes cosine similarity correctly via stored embeddings', async () => {
    insertMemory(db, 1);

    const content = 'Testing cosine similarity computation through the query summary embeddings function.';
    await generateAndStoreSummary(db, 1, content, mockEmbeddingFn);

    // Query with the exact same text -> should produce similarity close to 1.0
    const { summary } = generateSummary(content);
    const queryEmb = await mockEmbeddingFn(summary);

    const results = querySummaryEmbeddings(db, queryEmb, 10);
    expect(results).toHaveLength(1);
    expect(results[0].similarity).toBeCloseTo(1.0, 1);
  });

  it('handles mismatched dimensions by returning similarity 0', async () => {
    insertMemory(db, 1);
    await generateAndStoreSummary(db, 1, 'Content for testing dimension mismatch in embeddings.', mockEmbeddingFn);

    // Query with different dimension (4 instead of 8)
    const queryEmb = new Float32Array([0.5, 0.5, 0.5, 0.5]);
    const results = querySummaryEmbeddings(db, queryEmb, 10);
    expect(results).toHaveLength(1);
    expect(results[0].similarity).toBe(0);
  });

  it('returns memoryId correctly mapped from the database', async () => {
    insertMemory(db, 42);
    insertMemory(db, 99);

    await generateAndStoreSummary(db, 42, 'Summary content for memory forty-two about algorithmic complexity.', mockEmbeddingFn);
    await generateAndStoreSummary(db, 99, 'Summary content for memory ninety-nine about data visualization.', mockEmbeddingFn);

    const queryEmb = await mockEmbeddingFn('algorithm complexity');
    const results = querySummaryEmbeddings(db, queryEmb, 10);

    const memoryIds = results.map(r => r.memoryId);
    expect(memoryIds).toContain(42);
    expect(memoryIds).toContain(99);
  });
});

/* ===============================================================
   6. Memory Summaries Storage — checkScaleGate
   =============================================================== */

describe('checkScaleGate', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns false when fewer than 5000 memories exist', () => {
    // Insert 10 memories
    for (let i = 1; i <= 10; i++) {
      insertMemory(db, i);
    }
    expect(checkScaleGate(db)).toBe(false);
  });

  it('returns true when more than 5000 memories exist', () => {
    // Bulk insert 5001 memories
    const stmt = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, embedding_status)
      VALUES (?, 'test', '/test/path.md', 'Memory', 'success')
    `);
    const insertMany = db.transaction(() => {
      for (let i = 1; i <= 5001; i++) {
        stmt.run(i);
      }
    });
    insertMany();

    expect(checkScaleGate(db)).toBe(true);
  });

  it('returns false for exactly 5000 memories', () => {
    const stmt = db.prepare(`
      INSERT INTO memory_index (id, spec_folder, file_path, title, embedding_status)
      VALUES (?, 'test', '/test/path.md', 'Memory', 'success')
    `);
    const insertMany = db.transaction(() => {
      for (let i = 1; i <= 5000; i++) {
        stmt.run(i);
      }
    });
    insertMany();

    expect(checkScaleGate(db)).toBe(false);
  });

  it('handles empty database', () => {
    expect(checkScaleGate(db)).toBe(false);
  });
});

/* ===============================================================
   7. Cosine Similarity (via __testables)
   =============================================================== */

describe('cosineSimilarity', () => {
  it('returns 1.0 for identical vectors', () => {
    const v = new Float32Array([1, 2, 3, 4]);
    expect(cosineSimilarity(v, v)).toBeCloseTo(1.0, 5);
  });

  it('returns 0 for orthogonal vectors', () => {
    const a = new Float32Array([1, 0, 0, 0]);
    const b = new Float32Array([0, 1, 0, 0]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 5);
  });

  it('returns -1.0 for opposite vectors', () => {
    const a = new Float32Array([1, 2, 3]);
    const b = new Float32Array([-1, -2, -3]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0, 5);
  });

  it('returns 0 for zero-length vectors', () => {
    const a = new Float32Array([0, 0, 0]);
    const b = new Float32Array([1, 2, 3]);
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});

/* ===============================================================
   8. Edge Cases
   =============================================================== */

describe('Edge cases', () => {
  it('handles very large content without errors', () => {
    // Build content with 200 sentences
    const sentences: string[] = [];
    for (let i = 0; i < 200; i++) {
      sentences.push(`Sentence number ${i} discusses topic ${i % 10} with unique terminology term${i}.`);
    }
    const content = sentences.join('\n');

    const result = generateSummary(content);
    expect(result.keySentences.length).toBeLessThanOrEqual(3);
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it('handles Unicode content correctly', () => {
    const content = [
      'Die Architektur des Systems definiert die Interaktion zwischen Komponenten.',
      'Les tests de performance ont revele des goulets dans la couche requete.',
      'El sistema utiliza busqueda semantica para recuperar documentos relevantes.',
      'Unicode characters like emojis and CJK are common in modern text processing.',
    ].join('\n');

    const result = generateSummary(content);
    expect(result.keySentences.length).toBeGreaterThan(0);
    expect(result.summary.length).toBeGreaterThan(0);
  });
});
