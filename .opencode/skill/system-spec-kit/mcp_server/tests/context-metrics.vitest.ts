// ───────────────────────────────────────────────────────────────
// TEST: Context Metrics
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi } from 'vitest';

// Mock code-graph-db to avoid real DB access in computeGraphFreshness
vi.mock('../lib/code-graph/code-graph-db.js', () => ({
  getStats: vi.fn(() => ({
    totalFiles: 5,
    totalNodes: 20,
    totalEdges: 10,
    lastScanTimestamp: new Date().toISOString(),
    dbFileSize: 1024,
    schemaVersion: 1,
    nodesByKind: {},
    edgesByType: {},
    parseHealthSummary: {},
  })),
}));

import {
  recordMetricEvent,
  getSessionMetrics,
  computeQualityScore,
  type SessionMetrics,
  type QualityScore,
  type MetricEvent,
} from '../lib/session/context-metrics.js';

describe('context-metrics', () => {
  describe('getSessionMetrics', () => {
    it('returns a valid SessionMetrics snapshot', () => {
      const metrics: SessionMetrics = getSessionMetrics();
      expect(metrics.sessionId).toMatch(/^sess_/);
      expect(metrics.startedAt).toBeTruthy();
      expect(typeof metrics.toolCallCount).toBe('number');
      expect(typeof metrics.primed).toBe('boolean');
    });
  });

  describe('recordMetricEvent', () => {
    it('increments toolCallCount on tool_call event', () => {
      const before = getSessionMetrics().toolCallCount;
      recordMetricEvent({ kind: 'tool_call', toolName: 'test_tool' });
      const after = getSessionMetrics().toolCallCount;
      expect(after).toBe(before + 1);
    });

    it('sets primed to true after first tool_call', () => {
      recordMetricEvent({ kind: 'tool_call' });
      expect(getSessionMetrics().primed).toBe(true);
    });

    it('increments memoryRecoveryCalls on memory_recovery event', () => {
      const before = getSessionMetrics().memoryRecoveryCalls;
      recordMetricEvent({ kind: 'memory_recovery' });
      expect(getSessionMetrics().memoryRecoveryCalls).toBe(before + 1);
    });

    it('increments codeGraphQueries on code_graph_query event', () => {
      const before = getSessionMetrics().codeGraphQueries;
      recordMetricEvent({ kind: 'code_graph_query' });
      expect(getSessionMetrics().codeGraphQueries).toBe(before + 1);
    });

    it('tracks spec folder transitions', () => {
      const before = getSessionMetrics().specFolderTransitions;
      recordMetricEvent({ kind: 'spec_folder_change', specFolder: 'specs/001-test' });
      recordMetricEvent({ kind: 'spec_folder_change', specFolder: 'specs/002-other' });
      expect(getSessionMetrics().specFolderTransitions).toBeGreaterThanOrEqual(before + 2);
      expect(getSessionMetrics().currentSpecFolder).toBe('specs/002-other');
    });

    it('does not increment transition for same spec folder', () => {
      recordMetricEvent({ kind: 'spec_folder_change', specFolder: 'specs/same' });
      const before = getSessionMetrics().specFolderTransitions;
      recordMetricEvent({ kind: 'spec_folder_change', specFolder: 'specs/same' });
      expect(getSessionMetrics().specFolderTransitions).toBe(before);
    });
  });

  describe('computeQualityScore', () => {
    it('returns a QualityScore with valid shape', () => {
      const score: QualityScore = computeQualityScore();
      expect(score.level).toMatch(/^(healthy|degraded|critical)$/);
      expect(score.score).toBeGreaterThanOrEqual(0);
      expect(score.score).toBeLessThanOrEqual(1);
      expect(score.factors).toBeDefined();
      expect(typeof score.factors.recency).toBe('number');
      expect(typeof score.factors.recovery).toBe('number');
      expect(typeof score.factors.graphFreshness).toBe('number');
      expect(typeof score.factors.continuity).toBe('number');
    });

    it('has recency > 0 after a recent tool call', () => {
      recordMetricEvent({ kind: 'tool_call' });
      const score = computeQualityScore();
      expect(score.factors.recency).toBeGreaterThan(0);
    });

    it('has recovery = 1.0 after memory recovery', () => {
      recordMetricEvent({ kind: 'memory_recovery' });
      const score = computeQualityScore();
      expect(score.factors.recovery).toBe(1.0);
    });
  });
});
