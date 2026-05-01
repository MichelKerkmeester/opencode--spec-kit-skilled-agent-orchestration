// ───────────────────────────────────────────────────────────────
// MODULE: Checkpoint snapshot schema tests
// ───────────────────────────────────────────────────────────────
// F-005-A5-06: restoreCheckpoint validates the decompressed snapshot
// against CheckpointSnapshotSchema and quarantines malformed rows
// in result.errors instead of propagating untyped data.

import { describe, it, expect } from 'vitest';

import { CheckpointSnapshotSchema } from '../lib/storage/checkpoints.js';

describe('CheckpointSnapshotSchema (F-005-A5-06)', () => {
  it('accepts a minimal valid snapshot', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      memories: [],
      workingMemory: [],
      timestamp: '2025-01-01T00:00:00Z',
    })).not.toThrow();
  });

  it('accepts a full snapshot with manifest, tables, vectors, causalEdges', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      manifest: { snapshot: ['memory_index'], rebuild: ['vec_index'], skip: [] },
      tables: {
        memory_index: { columns: ['id', 'title'], rows: [{ id: 1, title: 'a' }] },
      },
      memories: [{ id: 1, title: 'memory' }],
      workingMemory: [],
      vectors: [{ rowid: 1, embedding: null }],
      causalEdges: [{ id: 1, source_id: '1', target_id: '2' }],
      timestamp: '2025-01-01T00:00:00Z',
    })).not.toThrow();
  });

  it('rejects when memories is not an array', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      memories: 'not-an-array',
      workingMemory: [],
      timestamp: '2025-01-01',
    })).toThrow();
  });

  it('rejects when memories contains a primitive (non-object) row', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      memories: [42, 'string-row', { id: 1 }],
      workingMemory: [],
      timestamp: '2025-01-01',
    })).toThrow();
  });

  it('rejects when timestamp is missing', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      memories: [],
      workingMemory: [],
    })).toThrow();
  });

  it('rejects when manifest sections are wrong type', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      manifest: { snapshot: 'bad', rebuild: [], skip: [] },
      memories: [],
      workingMemory: [],
      timestamp: '2025-01-01',
    })).toThrow();
  });

  it('rejects when a table snapshot has columns of wrong type', () => {
    expect(() => CheckpointSnapshotSchema.parse({
      memories: [],
      workingMemory: [],
      timestamp: '2025-01-01',
      tables: {
        memory_index: { columns: [42, 'title'], rows: [] },
      },
    })).toThrow();
  });

  it('passes through additional fields not enumerated in schema', () => {
    // The outer schema uses passthrough() so future fields don't break old snapshots.
    const parsed = CheckpointSnapshotSchema.parse({
      memories: [],
      workingMemory: [],
      timestamp: '2025-01-01',
      future_field: 'preserved',
    });
    expect((parsed as { future_field?: string }).future_field).toBe('preserved');
  });
});
