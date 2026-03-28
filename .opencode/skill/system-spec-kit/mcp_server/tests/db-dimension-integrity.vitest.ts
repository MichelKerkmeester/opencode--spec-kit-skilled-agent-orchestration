import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { close_db, getEmbeddingDim, initializeDb } from '../lib/search/vector-index-store';

function createTempDbPath(label: string): { dir: string; dbPath: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${label}-`));
  return {
    dir,
    dbPath: path.join(dir, `${label}.sqlite`),
  };
}

function removeTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function setAllowedPaths(paths: string[]): void {
  process.env.MEMORY_ALLOWED_PATHS = paths.join(path.delimiter);
}

function expectDimensionMismatchOnReopen(dbPath: string, initialDim: string, reopenedDim: string): void {
  process.env.EMBEDDING_DIM = initialDim;
  const db = initializeDb(dbPath);
  expect(db).toBeTruthy();

  close_db();

  process.env.EMBEDDING_DIM = reopenedDim;
  expect(() => initializeDb(dbPath)).toThrow(/Dimension mismatch|DIMENSION MISMATCH/i);
}

describe('db-dimension-integrity', () => {
  const originalEmbeddingDim = process.env.EMBEDDING_DIM;
  const originalEmbeddingsProvider = process.env.EMBEDDINGS_PROVIDER;
  const originalVoyageApiKey = process.env.VOYAGE_API_KEY;
  const originalOpenaiApiKey = process.env.OPENAI_API_KEY;
  const originalAllowedPaths = process.env.MEMORY_ALLOWED_PATHS;

  afterEach(() => {
    close_db();
    if (originalEmbeddingDim === undefined) {
      delete process.env.EMBEDDING_DIM;
    } else {
      process.env.EMBEDDING_DIM = originalEmbeddingDim;
    }
    if (originalEmbeddingsProvider === undefined) {
      delete process.env.EMBEDDINGS_PROVIDER;
    } else {
      process.env.EMBEDDINGS_PROVIDER = originalEmbeddingsProvider;
    }
    if (originalVoyageApiKey === undefined) {
      delete process.env.VOYAGE_API_KEY;
    } else {
      process.env.VOYAGE_API_KEY = originalVoyageApiKey;
    }
    if (originalOpenaiApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalOpenaiApiKey;
    }
    if (originalAllowedPaths === undefined) {
      delete process.env.MEMORY_ALLOWED_PATHS;
    } else {
      process.env.MEMORY_ALLOWED_PATHS = originalAllowedPaths;
    }
  });

  it('custom-path + dimension mismatch rejects cleanly', () => {
    const { dir, dbPath } = createTempDbPath('custom-path-dimension-mismatch');
    setAllowedPaths([dir]);

    try {
      expectDimensionMismatchOnReopen(dbPath, '1024', '1536');
    } finally {
      removeTempDir(dir);
    }
  });

  it('explicit hf-local provider override beats VOYAGE_API_KEY for startup dimension resolution', () => {
    delete process.env.EMBEDDING_DIM;
    process.env.EMBEDDINGS_PROVIDER = 'hf-local';
    process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
    process.env.OPENAI_API_KEY = 'openai_test_key_1234567890';

    expect(getEmbeddingDim()).toBe(768);
  });

  it('placeholder API keys are ignored when resolving startup dimensions', () => {
    delete process.env.EMBEDDING_DIM;
    delete process.env.EMBEDDINGS_PROVIDER;
    process.env.VOYAGE_API_KEY = 'your-key-here';
    delete process.env.OPENAI_API_KEY;

    expect(getEmbeddingDim()).toBe(768);
  });

  it('concurrent DB paths via connection cache', () => {
    const first = createTempDbPath('connection-cache-one');
    const second = createTempDbPath('connection-cache-two');
    setAllowedPaths([first.dir, second.dir]);
    process.env.EMBEDDING_DIM = '1024';

    try {
      const firstDb = initializeDb(first.dbPath);
      const secondDb = initializeDb(second.dbPath);

      expect(firstDb).toBeTruthy();
      expect(secondDb).toBeTruthy();
      expect(firstDb).not.toBe(secondDb);

      close_db();
    } finally {
      removeTempDir(first.dir);
      removeTempDir(second.dir);
    }
  });

  it('reinitialization with different dimensions fails', () => {
    const { dir, dbPath } = createTempDbPath('reinit-dimension-failure');
    setAllowedPaths([dir]);

    try {
      expectDimensionMismatchOnReopen(dbPath, '1024', '768');
    } finally {
      removeTempDir(dir);
    }
  });

  it('startup dimension pre-validation', () => {
    const { dir, dbPath } = createTempDbPath('startup-prevalidation');
    setAllowedPaths([dir]);

    try {
      expectDimensionMismatchOnReopen(dbPath, '1024', '512');
    } finally {
      removeTempDir(dir);
    }
  });

  it('provider-resolved mismatch fails before reopening an existing DB', () => {
    const { dir, dbPath } = createTempDbPath('provider-resolved-mismatch');
    setAllowedPaths([dir]);
    delete process.env.EMBEDDING_DIM;
    process.env.VOYAGE_API_KEY = 'voyage_test_key_1234567890';
    delete process.env.EMBEDDINGS_PROVIDER;
    delete process.env.OPENAI_API_KEY;

    try {
      const db = initializeDb(dbPath);
      expect(db).toBeTruthy();

      close_db();

      process.env.EMBEDDINGS_PROVIDER = 'hf-local';
      expect(() => initializeDb(dbPath)).toThrow(/EMBEDDING DIMENSION MISMATCH|Refusing to bootstrap/i);
    } finally {
      removeTempDir(dir);
    }
  });

  it('in-memory DB does not pollute file-backed dimension state', () => {
    const { dir, dbPath } = createTempDbPath('memory-isolation');
    setAllowedPaths([dir]);

    try {
      process.env.EMBEDDING_DIM = '1024';
      const fileDb = initializeDb(dbPath);
      expect(fileDb).toBeTruthy();
      close_db();

      process.env.EMBEDDING_DIM = '768';
      const memoryDb = initializeDb(':memory:');
      expect(memoryDb).toBeTruthy();
      close_db();

      process.env.EMBEDDING_DIM = '1024';
      const reopenedFileDb = initializeDb(dbPath);
      expect(reopenedFileDb).toBeTruthy();
    } finally {
      removeTempDir(dir);
    }
  });
});
