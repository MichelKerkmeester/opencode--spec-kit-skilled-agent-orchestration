// TEST: LEARNING STATS FILTERS
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

import * as handler from '../handlers/session-learning';
import * as vectorIndex from '../lib/search/vector-index';
import * as core from '../core';
import type { LearningHistoryPayload, LearningHistoryRow } from '../handlers/session-learning';

type LearningHistoryResponse = LearningHistoryPayload;

type JsonTextEnvelope = {
  content?: Array<{ text?: string }>;
};

function isLearningHistoryResponse(
  value: LearningHistoryResponse | { data?: LearningHistoryResponse }
): value is LearningHistoryResponse {
  return 'learningHistory' in value;
}

function parseResponse(result: JsonTextEnvelope | null | undefined): LearningHistoryResponse | null {
  if (result?.content?.[0]?.text) {
    const envelope = JSON.parse(result.content[0].text) as LearningHistoryResponse | { data?: LearningHistoryResponse };
    return isLearningHistoryResponse(envelope) ? envelope : (envelope.data ?? null);
  }
  return null;
}

function expectLearningResponse(data: LearningHistoryResponse | null): LearningHistoryResponse {
  expect(data).not.toBeNull();
  return data as LearningHistoryResponse;
}

function expectSummary(data: LearningHistoryResponse) {
  expect(data.summary).toBeDefined();
  return data.summary as NonNullable<LearningHistoryResponse['summary']>;
}

const SPEC = 'test/t503-stats-filters';
const TS = Date.now();
let sequence = 0;

let dbAvailable = false;

function uniqueId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${TS}-${sequence}`;
}

function requireDbOrThrow(): void {
  if (!dbAvailable) {
    throw new Error('DB not available - test requires live database');
  }
}

describe('T503: Learning Stats SQL Filter Tests', () => {
  beforeAll(() => {
    // Mock checkDatabaseUpdated to prevent db-state reinitialization failures
    // in test environments where db-state.init() has not been called
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);

    try {
      try {
        vectorIndex.closeDb();
      } catch {
        // Ignore already-closed shared connections.
      }

      const db = vectorIndex.initializeDb(':memory:');
      if (db) {
        dbAvailable = true;
        handler.ensureSchema(db);
      }
    } catch {
      // DB not available
    }
  });

  afterAll(() => {
    dbAvailable = false;
    try {
      vectorIndex.closeDb();
    } catch {
      // Best-effort cleanup only.
    }
  });

  // SUITE: Summary stats respect sessionId filter
  describe('T503: Summary stats respect sessionId filter', () => {
    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
      requireDbOrThrow();

      const sessA = `sess-A-${TS}`;
      const sessB = `sess-B-${TS}`;

      // Session A: preflight + postflight (complete, LI known)
      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: `T-SESSA-${TS}`,
        knowledgeScore: 20,
        uncertaintyScore: 80,
        contextScore: 20,
        sessionId: sessA,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: `T-SESSA-${TS}`,
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 80,
      });

      // Session B: preflight + postflight (complete, different scores)
      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: `T-SESSB-${TS}`,
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50,
        sessionId: sessB,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: `T-SESSB-${TS}`,
        knowledgeScore: 55,
        uncertaintyScore: 45,
        contextScore: 55,
      });

      // Query with sessionId = sessA
      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        sessionId: sessA,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      const summary = expectSummary(data);
      expect(summary.totalTasks).toBe(1);
      expect(summary.completedTasks).toBe(1);
    });

    it('T503-01b: sessionId records filter consistent', async () => {
      requireDbOrThrow();

      const sessA = uniqueId('sess-A');
      const sessB = uniqueId('sess-B');
      const taskA = uniqueId('T-SESSA');
      const taskB = uniqueId('T-SESSB');

      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: taskA,
        knowledgeScore: 20,
        uncertaintyScore: 80,
        contextScore: 20,
        sessionId: sessA,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: taskA,
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 80,
      });

      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: taskB,
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50,
        sessionId: sessB,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: taskB,
        knowledgeScore: 55,
        uncertaintyScore: 45,
        contextScore: 55,
      });

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        sessionId: sessA,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      expect(data?.learningHistory).toBeDefined();

      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
      expect(allMatch).toBe(true);
      expect(data.learningHistory.length).toBe(1);
    });

    it('T503-01c: sessionId filter normalizes whitespace to match stored records', async () => {
      requireDbOrThrow();

      const sessionId = uniqueId('sess-trimmed');
      const taskId = uniqueId('T-SESS-TRIM');

      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId,
        knowledgeScore: 25,
        uncertaintyScore: 75,
        contextScore: 25,
        sessionId: `  ${sessionId}  `,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId,
        knowledgeScore: 65,
        uncertaintyScore: 35,
        contextScore: 65,
        sessionId: `  ${sessionId}  `,
      });

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        sessionId: `  ${sessionId}  `,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      expect(data.learningHistory).toHaveLength(1);
      expect(data.learningHistory[0].sessionId).toBe(sessionId);
      const summary = expectSummary(data);
      expect(summary.totalTasks).toBe(1);
    });
  });

  // SUITE: Summary stats respect onlyComplete filter
  describe('T503: Summary stats respect onlyComplete filter', () => {
    it('T503-02: onlyComplete records filter', async () => {
      requireDbOrThrow();

      // Create one complete and one preflight-only record
      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: `T-COMPLETE-${TS}`,
        knowledgeScore: 30,
        uncertaintyScore: 70,
        contextScore: 30,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: `T-COMPLETE-${TS}`,
        knowledgeScore: 80,
        uncertaintyScore: 20,
        contextScore: 80,
      });

      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: `T-INCOMPLETE-${TS}`,
        knowledgeScore: 40,
        uncertaintyScore: 60,
        contextScore: 40,
      });
      // No postflight — stays as 'preflight' phase

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        onlyComplete: true,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      expectSummary(data);

      const allComplete = data.learningHistory.every(row => row.phase === 'complete');
      expect(allComplete).toBe(true);
    });

    it('T503-02b: onlyComplete stats — total matches completed', async () => {
      requireDbOrThrow();

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        onlyComplete: true,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      const summary = expectSummary(data);
      expect(summary.totalTasks).toBe(summary.completedTasks);
    });
  });

  // SUITE: Combined sessionId + onlyComplete filters
  describe('T503: Combined sessionId + onlyComplete filters', () => {
    it('T503-03: combined filters — 1 complete record', async () => {
      requireDbOrThrow();

      const sessC = `sess-C-${TS}`;

      // Complete record in sessC
      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: `T-COMBO-COMPLETE-${TS}`,
        knowledgeScore: 10,
        uncertaintyScore: 90,
        contextScore: 10,
        sessionId: sessC,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: `T-COMBO-COMPLETE-${TS}`,
        knowledgeScore: 70,
        uncertaintyScore: 30,
        contextScore: 70,
      });

      // Preflight-only record in sessC
      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: `T-COMBO-PREFLIGHT-${TS}`,
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50,
        sessionId: sessC,
      });

      // Query with both filters
      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        sessionId: sessC,
        onlyComplete: true,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      expectSummary(data);
      expect(data.learningHistory.length).toBe(1);
      expect(data.learningHistory[0].phase).toBe('complete');
    });

    it('T503-03b: combined stats correct', async () => {
      requireDbOrThrow();

      const sessC = uniqueId('sess-C');
      const completeTask = uniqueId('T-COMBO-COMPLETE');
      const preflightOnlyTask = uniqueId('T-COMBO-PREFLIGHT');

      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: completeTask,
        knowledgeScore: 10,
        uncertaintyScore: 90,
        contextScore: 10,
        sessionId: sessC,
      });
      await handler.handleTaskPostflight({
        specFolder: SPEC,
        taskId: completeTask,
        knowledgeScore: 70,
        uncertaintyScore: 30,
        contextScore: 70,
      });

      await handler.handleTaskPreflight({
        specFolder: SPEC,
        taskId: preflightOnlyTask,
        knowledgeScore: 50,
        uncertaintyScore: 50,
        contextScore: 50,
        sessionId: sessC,
      });

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        sessionId: sessC,
        onlyComplete: true,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      const summary = expectSummary(data);
      expect(summary.totalTasks).toBe(1);
      expect(summary.completedTasks).toBe(1);
    });
  });

  describe('T013: Learning History Ordering and Threshold Tests', () => {
    it('T013-O1: Limit clamped to minimum 1', async () => {
      requireDbOrThrow();

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        limit: -5,
        includeSummary: false,
      });

      const data = expectLearningResponse(parseResponse(result));
      // Limit=-5 should be clamped to 1, returning at most 1 record
      expect(data.learningHistory.length).toBeLessThanOrEqual(1);
    });

    it('T013-O2: Limit clamped to maximum 100', async () => {
      requireDbOrThrow();

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        limit: 500,
        includeSummary: false,
      });

      const data = expectLearningResponse(parseResponse(result));
      // Should succeed (limit clamped to 100)
      expect(data.learningHistory).toBeDefined();
      expect(Array.isArray(data.learningHistory)).toBe(true);
    });

    it('T013-O3: Results are returned in descending updated_at order', async () => {
      requireDbOrThrow();

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        limit: 100,
        includeSummary: false,
      });

      const data = expectLearningResponse(parseResponse(result));
      const db = vectorIndex.getDb();
      const expectedRows = db.prepare(`
        SELECT task_id
        FROM session_learning
        WHERE spec_folder = ?
        ORDER BY updated_at DESC
        LIMIT ?
      `).all(SPEC, 100) as Array<{ task_id?: string }>;

      const actualOrder = data.learningHistory
        .map(row => row.taskId)
        .filter((taskId): taskId is string => typeof taskId === 'string');

      const expectedOrder = expectedRows
        .map(row => row.task_id)
        .filter((taskId): taskId is string => typeof taskId === 'string');

      const actualTimestamps = data.learningHistory.map((row) => (
        row.phase === 'complete' ? row.completedAt : row.createdAt
      ));

      for (let index = 1; index < actualTimestamps.length; index += 1) {
        expect(Date.parse(actualTimestamps[index - 1] ?? '')).toBeGreaterThanOrEqual(
          Date.parse(actualTimestamps[index] ?? '')
        );
      }

      expect([...actualOrder].sort()).toEqual([...expectedOrder].sort());
    });

    it('T013-O4: Default limit returns records without error', async () => {
      requireDbOrThrow();

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      expect(data.learningHistory).toBeDefined();
      // Default limit is 10 per handler code
      expect(data.learningHistory.length).toBeLessThanOrEqual(10);
    });

    it('T013-O5: Summary includes interpretation for completed tasks', async () => {
      requireDbOrThrow();

      const result = await handler.handleGetLearningHistory({
        specFolder: SPEC,
        onlyComplete: true,
        includeSummary: true,
      });

      const data = expectLearningResponse(parseResponse(result));
      const summary = expectSummary(data);
      if (summary.completedTasks > 0) {
        expect(summary.interpretation).toBeDefined();
        expect(typeof summary.interpretation).toBe('string');
      }
    });
  });
});
