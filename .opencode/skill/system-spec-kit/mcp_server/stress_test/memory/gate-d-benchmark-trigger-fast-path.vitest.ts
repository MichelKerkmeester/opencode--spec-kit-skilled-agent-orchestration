// ───────────────────────────────────────────────────────────────
// MODULE: Gate D Trigger Fast-Path Benchmark Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises trigger-only memory matching latency and legacy memory filtering.

import { beforeEach, describe, expect, it, vi } from 'vitest';

interface MockMemoryRow {
  id: number;
  spec_folder: string;
  file_path: string;
  title: string | null;
  trigger_phrases: string;
  embedding_status: string;
  importance_weight: number | null;
  document_type: string | null;
  anchor_id: string | null;
  content_text: string | null;
}

const mockDbState = vi.hoisted(() => ({
  rows: [] as MockMemoryRow[],
}));

const mockDb = vi.hoisted(() => ({
  prepare: () => ({
    all: () => mockDbState.rows,
  }),
}));

vi.mock('../../core/index.js', () => ({
  ALLOWED_BASE_PATHS: [],
  checkDatabaseUpdated: vi.fn(async () => false),
}));

vi.mock('../../utils/index.js', () => ({
  toErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

vi.mock('../../utils/validators.js', () => ({
  createFilePathValidator: vi.fn(() => (filePath: string) => filePath),
}));

vi.mock('../../lib/search/vector-index-store.js', () => ({
  initialize_db: vi.fn(() => null),
}));

vi.mock('../../lib/search/vector-index.js', () => ({
  initializeDb: vi.fn(),
  getDb: vi.fn(() => mockDb),
}));

vi.mock('../../lib/cognitive/working-memory.js', () => ({
  getWorkingMemory: vi.fn(() => []),
  activateMemory: vi.fn(() => undefined),
}));

vi.mock('../../lib/cognitive/attention-decay.js', () => ({
  applyDecay: vi.fn(() => ({ decayedCount: 0 })),
  getDb: vi.fn(() => null),
}));

vi.mock('../../lib/cognitive/co-activation.js', () => ({
  activateRelatedMemories: vi.fn(() => []),
}));

vi.mock('../../lib/cognitive/tier-classifier.js', () => ({
  classifyTier: vi.fn(() => 'HOT'),
  getStateStats: vi.fn(() => ({ HOT: 1, WARM: 0, COLD: 0, DORMANT: 0, ARCHIVED: 0 })),
}));

vi.mock('../../formatters/index.js', () => ({
  calculateTokenMetrics: vi.fn(() => ({ total: 0, byTier: { HOT: 0, WARM: 0, COLD: 0, DORMANT: 0, ARCHIVED: 0 } })),
}));

vi.mock('../../lib/response/envelope.js', () => ({
  createMCPSuccessResponse: vi.fn(({ data }: { data: Record<string, unknown> }) => ({
    content: [{ type: 'text', text: JSON.stringify({ data }) }],
    isError: false,
  })),
  createMCPEmptyResponse: vi.fn(({ data }: { data: Record<string, unknown> }) => ({
    content: [{ type: 'text', text: JSON.stringify({ data }) }],
    isError: false,
  })),
  createMCPErrorResponse: vi.fn(({ error }: { error: string }) => ({
    content: [{ type: 'text', text: JSON.stringify({ error }) }],
    isError: true,
  })),
}));

vi.mock('../../lib/telemetry/consumption-logger.js', () => ({
  initConsumptionLog: vi.fn(() => undefined),
  logConsumptionEvent: vi.fn(() => undefined),
}));

vi.mock('../../lib/eval/eval-logger.js', () => ({
  logSearchQuery: vi.fn(() => ({ queryId: 7, evalRunId: 8 })),
  logFinalResult: vi.fn(() => undefined),
}));

vi.mock('../../lib/session/session-manager.js', () => ({
  resolveTrustedSession: vi.fn(() => ({
    requestedSessionId: null,
    effectiveSessionId: null,
    trusted: false,
    error: null,
  })),
}));

import { clearCache } from '../../lib/parsing/trigger-matcher.js';
import { handle_memory_match_triggers } from '../../handlers/memory-triggers.js';

interface TriggerEnvelope {
  data: {
    results: Array<Record<string, unknown>>;
  };
}

function buildSpecDocContent(title: string, triggerPhrases: string[]): string {
  return [
    '---',
    `title: "${title}"`,
    'trigger_phrases:',
    ...triggerPhrases.map((phrase) => `  - "${phrase}"`),
    'importance_tier: "important"',
    'contextType: "implementation"',
    '---',
    '',
    '# Fixture',
  ].join('\n');
}

function setMockDbRows(rows: MockMemoryRow[]): void {
  mockDbState.rows = rows;
}

function percentile(sortedDurations: number[], ratio: number): number {
  const index = Math.min(sortedDurations.length - 1, Math.floor(sortedDurations.length * ratio));
  return sortedDurations[index] ?? 0;
}

function summarizeDurations(durations: number[]) {
  const sorted = [...durations].sort((left, right) => left - right);
  return {
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
  };
}

function isTriggerEnvelope(value: unknown): value is TriggerEnvelope {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const data = (value as Record<string, unknown>).data;
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false;
  return Array.isArray((data as Record<string, unknown>).results);
}

function parseTriggerEnvelope(text: string): TriggerEnvelope {
  const parsed: unknown = JSON.parse(text);
  if (!isTriggerEnvelope(parsed)) {
    throw new Error('Expected trigger envelope with results array');
  }
  return parsed;
}

describe('Gate D benchmark — trigger fast path', () => {
  beforeEach(() => {
    clearCache();
    setMockDbRows([
      {
        id: 3001,
        spec_folder: 'system-spec-kit/026-gate-d',
        file_path: '/.opencode/specs/system-spec-kit/026-gate-d/spec.md',
        title: 'Gate D spec',
        trigger_phrases: '[]',
        embedding_status: 'success',
        importance_weight: 0.9,
        document_type: 'spec',
        anchor_id: null,
        content_text: buildSpecDocContent('Gate D spec', ['reader ready', 'canonical resume']),
      },
      {
        id: 3002,
        spec_folder: 'system-spec-kit/026-gate-d',
        file_path: '/.opencode/specs/system-spec-kit/026-gate-d/implementation-summary.md',
        title: 'Gate D continuity',
        trigger_phrases: '[]',
        embedding_status: 'success',
        importance_weight: 0.8,
        document_type: 'continuity',
        anchor_id: '_memory.continuity',
        content_text: buildSpecDocContent('Gate D continuity', ['next safe action']),
      },
    ]);
  });

  // Deep-review benchmark coverage for the Gate D trigger fast path latency budget.
  it('keeps the canonical trigger fast path under the Gate D latency budget', async () => {
    const durations: number[] = [];
    const ITERATIONS = 120;

    for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
      const start = performance.now();
      const response = await handle_memory_match_triggers({
        prompt: 'reader ready canonical resume',
        include_cognitive: false,
        limit: 3,
      });
      const elapsedMs = performance.now() - start;
      durations.push(elapsedMs);

      const envelope = parseTriggerEnvelope(response.content[0].text);
      const results = envelope.data.results;
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((row) => !String(row.filePath ?? '').includes('/memory/'))).toBe(true);
    }

    const summary = summarizeDurations(durations);
    if (process.env.DEBUG_STRESS_TEST === 'true') {
      console.log(`[gate-d-benchmark][trigger] p50=${summary.p50.toFixed(2)}ms p95=${summary.p95.toFixed(2)}ms p99=${summary.p99.toFixed(2)}ms iterations=${ITERATIONS}`);
    }

    expect(summary.p95).toBeLessThan(10);
  });
});
