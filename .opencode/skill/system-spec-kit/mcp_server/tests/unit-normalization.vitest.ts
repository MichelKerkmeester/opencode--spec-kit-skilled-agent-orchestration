// TEST: NORMALIZATION LAYER (vitest migration POC)
// Converted from: unit-normalization.test.ts (custom runner)
import { describe, it, expect } from 'vitest';
import { dbRowToMemory, memoryToDbRow, partialDbRowToMemory } from '@spec-kit/shared/normalization';
import type { Memory, MemoryDbRow } from '@spec-kit/shared/types';

/* --- Fixtures --- */

function makeFullDbRow(): MemoryDbRow {
  return {
    id: 42,
    spec_folder: 'specs/007-auth',
    file_path: 'specs/007-auth/memory/ctx-001.md',
    anchor_id: 'auth-flow',
    title: 'Authentication flow decision',
    trigger_phrases: 'auth, login, session',
    importance_weight: 0.85,
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-02-01T14:00:00Z',
    embedding_model: 'gte-small',
    embedding_generated_at: '2025-01-15T10:31:00Z',
    embedding_status: 'completed',
    retry_count: 0,
    last_retry_at: null,
    failure_reason: null,
    base_importance: 0.9,
    decay_half_life_days: 60,
    is_pinned: 1,
    access_count: 15,
    last_accessed: 1706800000,
    importance_tier: 'critical',
    session_id: 'sess-abc123',
    context_type: 'decision',
    channel: 'manual',
    content_hash: 'sha256-abc',
    expires_at: null,
    confidence: 0.95,
    validation_count: 3,
    stability: 4.5,
    difficulty: 0.3,
    last_review: '2025-02-01T12:00:00Z',
    review_count: 5,
    file_mtime_ms: 1706800000000,
    document_type: 'memory',
    spec_level: 1,
  };
}

function makeFullMemory(): Memory {
  return {
    id: 42,
    specFolder: 'specs/007-auth',
    filePath: 'specs/007-auth/memory/ctx-001.md',
    anchorId: 'auth-flow',
    title: 'Authentication flow decision',
    triggerPhrases: 'auth, login, session',
    importanceWeight: 0.85,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-02-01T14:00:00Z',
    embeddingModel: 'gte-small',
    embeddingGeneratedAt: '2025-01-15T10:31:00Z',
    embeddingStatus: 'completed',
    retryCount: 0,
    lastRetryAt: null,
    failureReason: null,
    baseImportance: 0.9,
    decayHalfLifeDays: 60,
    isPinned: true,
    accessCount: 15,
    lastAccessed: 1706800000,
    importanceTier: 'critical',
    sessionId: 'sess-abc123',
    contextType: 'decision',
    channel: 'manual',
    contentHash: 'sha256-abc',
    expiresAt: null,
    confidence: 0.95,
    validationCount: 3,
    stability: 4.5,
    difficulty: 0.3,
    lastReview: '2025-02-01T12:00:00Z',
    reviewCount: 5,
    fileMtimeMs: 1706800000000,
    documentType: 'memory',
    specLevel: 1,
  };
}

/* --- Tests --- */

describe('Normalization Layer (T001-T007)', () => {
  it('T001: dbRowToMemory converts snake_case to camelCase', () => {
    const row = makeFullDbRow();
    const memory = dbRowToMemory(row);

    expect(memory.specFolder).toBe('specs/007-auth');
    expect(memory.filePath).toBe('specs/007-auth/memory/ctx-001.md');
    expect(memory.anchorId).toBe('auth-flow');
    expect(memory.importanceWeight).toBe(0.85);
    expect(memory.createdAt).toBe('2025-01-15T10:30:00Z');
    expect(memory.embeddingModel).toBe('gte-small');
    expect(memory.embeddingStatus).toBe('completed');
    expect(memory.importanceTier).toBe('critical');
    expect(memory.contextType).toBe('decision');
    expect(memory.contentHash).toBe('sha256-abc');
    expect(memory.decayHalfLifeDays).toBe(60);
    expect(memory.baseImportance).toBe(0.9);
  });

  it('T002: memoryToDbRow converts camelCase to snake_case', () => {
    const memory = makeFullMemory();
    const row = memoryToDbRow(memory);

    expect(row.spec_folder).toBe('specs/007-auth');
    expect(row.file_path).toBe('specs/007-auth/memory/ctx-001.md');
    expect(row.anchor_id).toBe('auth-flow');
    expect(row.importance_weight).toBe(0.85);
    expect(row.created_at).toBe('2025-01-15T10:30:00Z');
    expect(row.embedding_model).toBe('gte-small');
    expect(row.embedding_status).toBe('completed');
    expect(row.importance_tier).toBe('critical');
    expect(row.context_type).toBe('decision');
    expect(row.content_hash).toBe('sha256-abc');
    expect(row.decay_half_life_days).toBe(60);
  });

  it('T003: partialDbRowToMemory handles partial rows', () => {
    const partialRow = {
      id: 99,
      spec_folder: 'specs/010-search',
      file_path: 'specs/010-search/memory/ctx-001.md',
      importance_weight: 0.5,
    };

    const memory = partialDbRowToMemory(partialRow);

    expect(memory.id).toBe(99);
    expect(memory.specFolder).toBe('specs/010-search');
    expect(memory.filePath).toBe('specs/010-search/memory/ctx-001.md');
    expect(memory.importanceWeight).toBe(0.5);
    expect(memory.title).toBeUndefined();
    expect(memory.anchorId).toBeUndefined();
    expect(memory.embeddingModel).toBeUndefined();
  });

  it('T004: Round-trip preserves all fields', () => {
    const originalMemory = makeFullMemory();
    const dbRow = memoryToDbRow(originalMemory);
    const roundTrippedRow: MemoryDbRow = { ...dbRow, id: originalMemory.id } as MemoryDbRow;
    const roundTripped = dbRowToMemory(roundTrippedRow);

    for (const key of Object.keys(originalMemory) as Array<keyof Memory>) {
      expect(roundTripped[key]).toEqual(originalMemory[key]);
    }
  });

  it('T005: Null fields preserved correctly (not string "null")', () => {
    const row = makeFullDbRow();
    row.anchor_id = null;
    row.last_retry_at = null;
    row.failure_reason = null;
    row.embedding_generated_at = null;
    row.content_hash = null;
    row.expires_at = null;
    row.last_review = null;
    row.file_mtime_ms = null;

    const memory = dbRowToMemory(row);

    const nullFields: Array<keyof Memory> = [
      'anchorId', 'lastRetryAt', 'failureReason',
      'embeddingGeneratedAt', 'contentHash', 'expiresAt',
      'lastReview', 'fileMtimeMs',
    ];

    for (const field of nullFields) {
      expect(memory[field]).toBeNull();
      expect(memory[field]).not.toBe('null');
      expect(memory[field]).not.toBe('undefined');
    }

    // Reverse direction
    const backToRow = memoryToDbRow(memory);
    expect(backToRow.anchor_id).not.toBe('null');
    expect(backToRow.last_retry_at).not.toBe('null');
  });

  it('T006: Date fields converted properly', () => {
    const row = makeFullDbRow();
    const memory = dbRowToMemory(row);

    expect(memory.createdAt).toBe('2025-01-15T10:30:00Z');
    expect(memory.updatedAt).toBe('2025-02-01T14:00:00Z');
    expect(memory.embeddingGeneratedAt).toBe('2025-01-15T10:31:00Z');
    expect(memory.lastReview).toBe('2025-02-01T12:00:00Z');

    expect(typeof memory.createdAt).toBe('string');
    expect(typeof memory.lastAccessed).toBe('number');
    expect(memory.lastAccessed).toBe(1706800000);
  });

  it('T007: Numeric fields and isPinned boolean conversion', () => {
    const row = makeFullDbRow();
    const memory = dbRowToMemory(row);

    // Numeric fields preserved
    expect(memory.id).toBe(42);
    expect(memory.importanceWeight).toBe(0.85);
    expect(memory.retryCount).toBe(0);
    expect(memory.baseImportance).toBe(0.9);
    expect(memory.decayHalfLifeDays).toBe(60);
    expect(memory.accessCount).toBe(15);
    expect(memory.confidence).toBe(0.95);
    expect(memory.validationCount).toBe(3);
    expect(memory.stability).toBe(4.5);
    expect(memory.difficulty).toBe(0.3);
    expect(memory.reviewCount).toBe(5);
    expect(memory.fileMtimeMs).toBe(1706800000000);

    // IsPinned: SQLite integer → boolean
    expect(memory.isPinned).toBe(true);
    expect(typeof memory.isPinned).toBe('boolean');

    const rowUnpinned = { ...makeFullDbRow(), is_pinned: 0 };
    expect(dbRowToMemory(rowUnpinned).isPinned).toBe(false);

    // Boolean → integer round-trip
    expect(memoryToDbRow(memory).is_pinned).toBe(1);
    expect(memoryToDbRow({ ...memory, isPinned: false }).is_pinned).toBe(0);
  });
});
