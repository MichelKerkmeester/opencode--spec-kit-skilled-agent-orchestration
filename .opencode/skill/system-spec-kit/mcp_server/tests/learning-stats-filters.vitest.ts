// ---------------------------------------------------------------
// TEST: LEARNING STATS FILTERS
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll } from 'vitest';

import * as handler from '../handlers/session-learning';
import * as vectorIndex from '../lib/search/vector-index';

type LearningHistoryRow = {
  sessionId?: string;
  phase?: string;
};

type LearningHistoryResponse = {
  summary?: {
    totalTasks: number;
    completedTasks: number;
  };
  learningHistory: LearningHistoryRow[];
};

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

let dbAvailable = false;

describe('T503: Learning Stats SQL Filter Tests [deferred - requires DB test fixtures]', () => {
  beforeAll(() => {
    try {
      const db = vectorIndex.getDb();
      if (db) {
        dbAvailable = true;
        handler.ensureSchema(db);
      }
    } catch {
      // DB not available
    }
  });

  // -----------------------------------------------------------
  // SUITE: Summary stats respect sessionId filter
  // -----------------------------------------------------------
  describe('T503: Summary stats respect sessionId filter', () => {
    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
      if (!dbAvailable) return;

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
      if (!dbAvailable) return;

      const sessA = `sess-A-${TS}`;

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
  });

  // -----------------------------------------------------------
  // SUITE: Summary stats respect onlyComplete filter
  // -----------------------------------------------------------
  describe('T503: Summary stats respect onlyComplete filter', () => {
    it('T503-02: onlyComplete records filter', async () => {
      if (!dbAvailable) return;

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
      if (!dbAvailable) return;

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

  // -----------------------------------------------------------
  // SUITE: Combined sessionId + onlyComplete filters
  // -----------------------------------------------------------
  describe('T503: Combined sessionId + onlyComplete filters', () => {
    it('T503-03: combined filters — 1 complete record', async () => {
      if (!dbAvailable) return;

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
      if (!dbAvailable) return;

      const sessC = `sess-C-${TS}`;

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
});
