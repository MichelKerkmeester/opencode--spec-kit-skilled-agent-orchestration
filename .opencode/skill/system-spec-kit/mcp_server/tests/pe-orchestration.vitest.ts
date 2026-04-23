import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  findSimilarMemoriesMock: vi.fn(),
  reinforceExistingMemoryMock: vi.fn(),
  updateExistingMemoryMock: vi.fn(),
  logPeDecisionMock: vi.fn(),
  evaluateMemoryMock: vi.fn(),
}));

vi.mock('../handlers/pe-gating.js', () => ({
  findSimilarMemories: mocks.findSimilarMemoriesMock,
  reinforceExistingMemory: mocks.reinforceExistingMemoryMock,
  updateExistingMemory: mocks.updateExistingMemoryMock,
  logPeDecision: mocks.logPeDecisionMock,
}));

vi.mock('../handlers/memory-crud-utils.js', () => ({
  getMemoryHashSnapshot: vi.fn(() => null),
  appendMutationLedgerSafe: vi.fn(() => true),
}));

vi.mock('../lib/cognitive/prediction-error-gate.js', () => ({
  ACTION: {
    CREATE: 'CREATE',
    CREATE_LINKED: 'CREATE_LINKED',
    REINFORCE: 'REINFORCE',
    SUPERSEDE: 'SUPERSEDE',
    UPDATE: 'UPDATE',
  },
  evaluateMemory: mocks.evaluateMemoryMock,
}));

import { evaluateAndApplyPeDecision } from '../handlers/save/pe-orchestration';

describe('PE orchestration lineage guard', () => {
  afterEach(() => {
    mocks.findSimilarMemoriesMock.mockReset();
    mocks.reinforceExistingMemoryMock.mockReset();
    mocks.updateExistingMemoryMock.mockReset();
    mocks.logPeDecisionMock.mockReset();
    mocks.evaluateMemoryMock.mockReset();
  });

  it('downgrades a tasks.md update against a similar sibling checklist.md to CREATE', () => {
    const database = new Database(':memory:');
    const tasksPath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/tasks.md';
    const checklistPath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/checklist.md';

    mocks.findSimilarMemoriesMock.mockReturnValue([
      {
        id: 42,
        similarity: 0.91,
        content: 'similar sibling checklist content',
        stability: 1,
        difficulty: 1,
        file_path: checklistPath,
        canonical_file_path: checklistPath,
      },
    ]);
    mocks.evaluateMemoryMock.mockReturnValue({
      action: 'UPDATE',
      similarity: 0.91,
      existingMemoryId: 42,
      reason: 'High match, updating existing',
    });

    try {
      const result = evaluateAndApplyPeDecision(
        database,
        {
          specFolder: 'system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix',
          filePath: tasksPath,
          title: 'Memory Indexer Lineage Fix Tasks',
          triggerPhrases: ['026/010 memory indexer lineage fix'],
          content: 'Implement the tasks doc update',
          contentHash: 'tasks-hash',
          contextType: 'tasks',
          importanceTier: 'important',
          documentType: 'tasks',
        } as any,
        new Float32Array([0.1, 0.2, 0.3]),
        false,
        [],
        'success',
        tasksPath,
      );

      expect(result.decision.action).toBe('CREATE');
      expect(result.decision.existingMemoryId).toBeNull();
      expect(result.earlyReturn).toBeNull();
      expect(mocks.updateExistingMemoryMock).not.toHaveBeenCalled();
      expect(mocks.reinforceExistingMemoryMock).not.toHaveBeenCalled();
      expect(mocks.logPeDecisionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          reason: expect.stringContaining('new lineage chain'),
        }),
        'tasks-hash',
        'system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix',
      );
    } finally {
      database.close();
    }
  });

  it('downgrades cross-file reinforce decisions to CREATE before they can reuse a sibling row', () => {
    const database = new Database(':memory:');
    const tasksPath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/tasks.md';
    const checklistPath = '/workspace/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/checklist.md';

    mocks.findSimilarMemoriesMock.mockReturnValue([
      {
        id: 99,
        similarity: 0.98,
        content: 'duplicate-looking sibling checklist content',
        stability: 1,
        difficulty: 1,
        file_path: checklistPath,
        canonical_file_path: checklistPath,
      },
    ]);
    mocks.evaluateMemoryMock.mockReturnValue({
      action: 'REINFORCE',
      similarity: 0.98,
      existingMemoryId: 99,
      reason: 'Duplicate detected',
    });

    try {
      const result = evaluateAndApplyPeDecision(
        database,
        {
          specFolder: 'system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix',
          filePath: tasksPath,
          title: 'Memory Indexer Lineage Fix Tasks',
          triggerPhrases: ['candidate_changed fix'],
          content: 'Implement the tasks doc update',
          contentHash: 'tasks-hash-2',
          contextType: 'tasks',
          importanceTier: 'important',
          documentType: 'tasks',
        } as any,
        new Float32Array([0.1, 0.2, 0.3]),
        false,
        [],
        'success',
        tasksPath,
      );

      expect(result.decision.action).toBe('CREATE');
      expect(result.earlyReturn).toBeNull();
      expect(mocks.reinforceExistingMemoryMock).not.toHaveBeenCalled();
      expect(mocks.updateExistingMemoryMock).not.toHaveBeenCalled();
    } finally {
      database.close();
    }
  });
});
