import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import * as core from '../core';
import * as handler from '../handlers/session-learning';
import * as vectorIndex from '../lib/search/vector-index';

describe('Session-learning regressions', () => {
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

  it('T081 resolves postflight against the matching session baseline', async () => {
    await handler.handleTaskPreflight({
      specFolder: 'specs/t081-session',
      taskId: 'shared-task',
      knowledgeScore: 10,
      uncertaintyScore: 80,
      contextScore: 15,
      sessionId: 'sess-a',
    });
    await handler.handleTaskPreflight({
      specFolder: 'specs/t081-session',
      taskId: 'shared-task',
      knowledgeScore: 70,
      uncertaintyScore: 40,
      contextScore: 65,
      sessionId: 'sess-b',
    });

    await handler.handleTaskPostflight({
      specFolder: 'specs/t081-session',
      taskId: 'shared-task',
      knowledgeScore: 90,
      uncertaintyScore: 20,
      contextScore: 85,
      sessionId: 'sess-b',
    });

    const sessA = database.prepare(`
      SELECT phase, post_knowledge_score
      FROM session_learning
      WHERE spec_folder = ? AND task_id = ? AND session_id = ?
      ORDER BY id ASC
    `).get('specs/t081-session', 'shared-task', 'sess-a') as { phase: string; post_knowledge_score: number | null };
    const sessB = database.prepare(`
      SELECT phase, pre_knowledge_score, post_knowledge_score, delta_knowledge
      FROM session_learning
      WHERE spec_folder = ? AND task_id = ? AND session_id = ?
      ORDER BY id ASC
    `).get('specs/t081-session', 'shared-task', 'sess-b') as {
      phase: string;
      pre_knowledge_score: number;
      post_knowledge_score: number;
      delta_knowledge: number;
    };

    expect(sessA.phase).toBe('preflight');
    expect(sessA.post_knowledge_score).toBeNull();
    expect(sessB.phase).toBe('complete');
    expect(sessB.pre_knowledge_score).toBe(70);
    expect(sessB.post_knowledge_score).toBe(90);
    expect(sessB.delta_knowledge).toBe(20);
  });

  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
    await handler.handleTaskPreflight({
      specFolder: 'specs/t081-session',
      taskId: 'ambiguous-task',
      knowledgeScore: 10,
      uncertaintyScore: 80,
      contextScore: 15,
      sessionId: 'sess-a',
    });
    await handler.handleTaskPreflight({
      specFolder: 'specs/t081-session',
      taskId: 'ambiguous-task',
      knowledgeScore: 70,
      uncertaintyScore: 40,
      contextScore: 65,
      sessionId: 'sess-b',
    });

    await expect(handler.handleTaskPostflight({
      specFolder: 'specs/t081-session',
      taskId: 'ambiguous-task',
      knowledgeScore: 90,
      uncertaintyScore: 20,
      contextScore: 85,
    })).rejects.toMatchObject({
      message: expect.stringContaining('Provide sessionId'),
    });
  });

  it('T082 preserves multiple completed learning cycles for the same task', async () => {
    await handler.handleTaskPreflight({
      specFolder: 'specs/t082-cycles',
      taskId: 'repeat-task',
      knowledgeScore: 20,
      uncertaintyScore: 70,
      contextScore: 30,
      sessionId: 'repeat-session',
    });
    await handler.handleTaskPostflight({
      specFolder: 'specs/t082-cycles',
      taskId: 'repeat-task',
      knowledgeScore: 40,
      uncertaintyScore: 50,
      contextScore: 45,
      sessionId: 'repeat-session',
    });

    await handler.handleTaskPreflight({
      specFolder: 'specs/t082-cycles',
      taskId: 'repeat-task',
      knowledgeScore: 50,
      uncertaintyScore: 40,
      contextScore: 55,
      sessionId: 'repeat-session',
    });
    await handler.handleTaskPostflight({
      specFolder: 'specs/t082-cycles',
      taskId: 'repeat-task',
      knowledgeScore: 75,
      uncertaintyScore: 25,
      contextScore: 80,
      sessionId: 'repeat-session',
    });

    const completedRows = database.prepare(`
      SELECT COUNT(*) AS total
      FROM session_learning
      WHERE spec_folder = ? AND task_id = ? AND session_id = ? AND phase = 'complete'
    `).get('specs/t082-cycles', 'repeat-task', 'repeat-session') as { total: number };

    expect(completedRows.total).toBe(2);
  });
});
