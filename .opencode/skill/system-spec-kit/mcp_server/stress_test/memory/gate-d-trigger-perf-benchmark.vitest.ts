import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

type DatabaseModule = typeof import('better-sqlite3');
type DatabaseInstance = import('better-sqlite3').Database;
type TriggerHandlerModule = typeof import('../../handlers/memory-triggers.js');
type TriggerMatcherModule = typeof import('../../lib/parsing/trigger-matcher.js');
type CoreModule = typeof import('../../core/index.js');

interface MemoryRow {
  id: number;
  spec_folder: string;
  file_path: string;
  title: string;
  trigger_phrases: string;
  importance_weight: number;
  document_type: string | null;
  anchor_id: string | null;
  content_text: string | null;
}

interface PerfMetrics {
  warmupIterations: number;
  iterations: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  minMs: number;
  maxMs: number;
  averageMs: number;
  targetP95Ms: number;
  withinTarget: boolean;
}

const TARGET_P95_MS = 10;
const WARMUP_ITERATIONS = 50;
const MEASURED_ITERATIONS = 400;

const { dbHolder, mockInitializeDb, mockGetDb } = vi.hoisted(() => {
  const state = { current: null as DatabaseInstance | null };
  return {
    dbHolder: state,
    mockInitializeDb: vi.fn(() => {}),
    mockGetDb: vi.fn(() => state.current),
  };
});

vi.mock('../../lib/search/vector-index.js', () => ({
  initializeDb: mockInitializeDb,
  getDb: mockGetDb,
}));

function buildSpecDocContent(title: string, triggerPhrases: string[]): string {
  return [
    '---',
    `title: "${title}"`,
    'trigger_phrases:',
    ...triggerPhrases.map((phrase) => `  - "${phrase}"`),
    'importance_tier: "normal"',
    'contextType: "implementation"',
    '---',
    '',
    'Gate D canonical trigger benchmark fixture.',
  ].join('\n');
}

function buildContinuityContent(index: number): string {
  return [
    '# Continuity',
    '',
    '```continuity',
    '{',
    `  "packet_pointer": "specs/026-gate-d-${index}",`,
    '  "last_updated_at": "2026-04-11T18:00:00.000Z",',
    '  "last_updated_by": "gate-d-trigger-benchmark",',
    `  "recent_action": "Prepared continuity fixture ${index}",`,
    `  "next_safe_action": "Run canonical trigger benchmark ${index}"`,
    '}',
    '```',
    '',
    'Benchmark continuity body.',
  ].join('\n');
}

function createCanonicalRows(): MemoryRow[] {
  const rows: MemoryRow[] = [];

  rows.push({
    id: 1,
    spec_folder: 'system-spec-kit/026-gate-d',
    file_path: '/repo/specs/026/spec.md',
    title: 'Gate D Trigger Benchmark',
    trigger_phrases: JSON.stringify([
      'reader ready trigger benchmark',
      'canonical trigger fast path',
      'gate d trigger perf',
    ]),
    importance_weight: 0.95,
    document_type: 'spec',
    anchor_id: null,
    content_text: buildSpecDocContent('Gate D Trigger Benchmark', [
      'reader ready trigger benchmark',
      'canonical trigger fast path',
      'gate d trigger perf',
    ]),
  });

  for (let index = 0; index < 31; index += 1) {
    rows.push({
      id: index + 2,
      spec_folder: `system-spec-kit/026-gate-d/fixture-${index}`,
      file_path: `/repo/specs/026/fixture-${index}.md`,
      title: `Canonical Fixture ${index}`,
      trigger_phrases: JSON.stringify([
        `canonical retrieval fixture ${index}`,
        `reader ladder fixture ${index}`,
      ]),
      importance_weight: 0.5,
      document_type: index % 2 === 0 ? 'plan' : 'tasks',
      anchor_id: null,
      content_text: buildSpecDocContent(`Canonical Fixture ${index}`, [
        `canonical retrieval fixture ${index}`,
        `reader ladder fixture ${index}`,
      ]),
    });
  }

  for (let index = 0; index < 8; index += 1) {
    rows.push({
      id: 200 + index,
      spec_folder: `system-spec-kit/026-gate-d/continuity-${index}`,
      file_path: `/repo/specs/026/continuity-${index}.md`,
      title: `Continuity Fixture ${index}`,
      trigger_phrases: JSON.stringify([
        `continuity fallback ${index}`,
        `resume signal ${index}`,
      ]),
      importance_weight: 0.4,
      document_type: null,
      anchor_id: '_memory.continuity',
      content_text: buildContinuityContent(index),
    });
  }

  return rows;
}

function createMockDb(rows: MemoryRow[]): DatabaseInstance {
  const Database = require('better-sqlite3') as DatabaseModule;
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      title TEXT,
      trigger_phrases TEXT,
      importance_weight REAL,
      embedding_status TEXT DEFAULT 'success',
      document_type TEXT,
      anchor_id TEXT,
      content_text TEXT
    )
  `);

  const insert = db.prepare(`
    INSERT INTO memory_index (
      id, spec_folder, file_path, title, trigger_phrases, importance_weight,
      embedding_status, document_type, anchor_id, content_text
    )
    VALUES (?, ?, ?, ?, ?, ?, 'success', ?, ?, ?)
  `);

  for (const row of rows) {
    insert.run(
      row.id,
      row.spec_folder,
      row.file_path,
      row.title,
      row.trigger_phrases,
      row.importance_weight,
      row.document_type,
      row.anchor_id,
      row.content_text,
    );
  }

  return db;
}

function percentile(sortedValues: number[], fraction: number): number {
  const index = Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * fraction));
  return sortedValues[index] ?? 0;
}

function summarize(timesMs: number[]): PerfMetrics {
  const sorted = [...timesMs].sort((left, right) => left - right);
  const total = sorted.reduce((sum, value) => sum + value, 0);

  return {
    warmupIterations: WARMUP_ITERATIONS,
    iterations: MEASURED_ITERATIONS,
    p50Ms: percentile(sorted, 0.5),
    p95Ms: percentile(sorted, 0.95),
    p99Ms: percentile(sorted, 0.99),
    minMs: sorted[0] ?? 0,
    maxMs: sorted[sorted.length - 1] ?? 0,
    averageMs: sorted.length > 0 ? total / sorted.length : 0,
    targetP95Ms: TARGET_P95_MS,
    withinTarget: percentile(sorted, 0.95) < TARGET_P95_MS,
  };
}

function readTextPayload(response: Awaited<ReturnType<TriggerHandlerModule['handleMemoryMatchTriggers']>>): Record<string, unknown> {
  const text = response.content[0]?.text ?? '{}';
  return JSON.parse(text) as Record<string, unknown>;
}

describe('Gate D trigger fast-path benchmark', () => {
  let triggerHandler: TriggerHandlerModule;
  let triggerMatcher: TriggerMatcherModule;
  let core: CoreModule;
  let database: DatabaseInstance;

  beforeAll(async () => {
    triggerHandler = await import('../../handlers/memory-triggers.js');
    triggerMatcher = await import('../../lib/parsing/trigger-matcher.js');
    core = await import('../../core/index.js');
  });

  beforeEach(() => {
    database?.close?.();
    database = createMockDb(createCanonicalRows());
    dbHolder.current = database;
    mockGetDb.mockImplementation(() => dbHolder.current);
    mockInitializeDb.mockImplementation(() => {});
    triggerMatcher.clearCache();
    vi.restoreAllMocks();
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterAll(() => {
    database?.close?.();
    dbHolder.current = null;
  });

  it('reports p50/p95/p99 for the canonical trigger-only fast path', async () => {
    const prompt = 'Please run the reader ready trigger benchmark on the canonical trigger fast path';

    const warmupResponse = await triggerHandler.handleMemoryMatchTriggers({
      prompt,
      include_cognitive: false,
      limit: 3,
    });
    const warmupPayload = readTextPayload(warmupResponse);
    const warmupData = (warmupPayload.data ?? {}) as Record<string, unknown>;
    const warmupResults = Array.isArray(warmupData.results) ? warmupData.results : [];

    expect(warmupResponse.isError).toBe(false);
    expect(warmupResults.length).toBeGreaterThan(0);

    for (let iteration = 0; iteration < WARMUP_ITERATIONS; iteration += 1) {
      await triggerHandler.handleMemoryMatchTriggers({
        prompt,
        include_cognitive: false,
        limit: 3,
      });
    }

    const timesMs: number[] = [];

    for (let iteration = 0; iteration < MEASURED_ITERATIONS; iteration += 1) {
      const start = process.hrtime.bigint();
      const response = await triggerHandler.handleMemoryMatchTriggers({
        prompt,
        include_cognitive: false,
        limit: 3,
      });
      const end = process.hrtime.bigint();
      const payload = readTextPayload(response);
      const data = (payload.data ?? {}) as Record<string, unknown>;
      const results = Array.isArray(data.results) ? data.results : [];

      expect(response.isError).toBe(false);
      expect(results.length).toBeGreaterThan(0);

      timesMs.push(Number(end - start) / 1_000_000);
    }

    const metrics = summarize(timesMs);
    console.log(`TRIGGER_PERF_METRICS ${JSON.stringify(metrics)}`);

    expect(metrics.p50Ms).toBeGreaterThanOrEqual(0);
    expect(metrics.p95Ms).toBeGreaterThanOrEqual(metrics.p50Ms);
    expect(metrics.p99Ms).toBeGreaterThanOrEqual(metrics.p95Ms);
  });
});
