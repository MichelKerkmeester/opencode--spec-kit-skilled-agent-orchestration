import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import * as core from '../core';
import * as handler from '../handlers/session-learning';
import * as vectorIndex from '../lib/search/vector-index';

type LearningHistoryResponse = Awaited<ReturnType<typeof handler.handleGetLearningHistory>>;

interface LearningHistoryEnvelope {
  data: {
    count: number;
    learningHistory: Array<{
      sessionId: string | null;
      phase: 'preflight' | 'complete';
    }>;
    summary?: {
      totalTasks: number;
      completedTasks: number;
    };
  };
}

function parseEnvelope(response: LearningHistoryResponse): LearningHistoryEnvelope {
  return JSON.parse(response.content[0].text) as LearningHistoryEnvelope;
}

describe('Session learning history normalization', () => {
  let database: Database.Database;

  beforeEach(() => {
    database = new Database(':memory:');
    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(database as unknown as ReturnType<typeof vectorIndex.getDb>);
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    handler.ensureSchema(database as unknown as Parameters<typeof handler.ensureSchema>[0]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    database.close();
  });

  it('normalizes sessionId before filtering learning history queries', async () => {
    await handler.handleTaskPreflight({
      specFolder: 'specs/session-history-normalization',
      taskId: 'history-task',
      knowledgeScore: 15,
      uncertaintyScore: 75,
      contextScore: 25,
      sessionId: 'normalized-session',
    });
    await handler.handleTaskPostflight({
      specFolder: 'specs/session-history-normalization',
      taskId: 'history-task',
      knowledgeScore: 40,
      uncertaintyScore: 55,
      contextScore: 45,
      sessionId: 'normalized-session',
    });

    const response = await handler.handleGetLearningHistory({
      specFolder: 'specs/session-history-normalization',
      sessionId: '  normalized-session  ',
      includeSummary: true,
    });
    const envelope = parseEnvelope(response);

    expect(envelope.data.count).toBe(1);
    expect(envelope.data.learningHistory).toHaveLength(1);
    expect(envelope.data.learningHistory[0]).toMatchObject({
      sessionId: 'normalized-session',
      phase: 'complete',
    });
    expect(envelope.data.summary).toMatchObject({
      totalTasks: 1,
      completedTasks: 1,
    });
  });
});
