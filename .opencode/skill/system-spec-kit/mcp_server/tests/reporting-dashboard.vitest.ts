// TEST: Reporting Dashboard
// Full reporting dashboard for eval infrastructure.
//
// Validates:
// RD-1  — generateDashboardReport() returns valid DashboardReport structure
// RD-2  — Report includes sprint-level metric aggregation (mean, min, max, latest)
// RD-3  — Report includes channel performance data
// RD-4  — Report includes trend entries with direction
// RD-5  — formatReportText() produces non-empty string with expected sections
// RD-6  — formatReportJSON() produces valid JSON matching DashboardReport shape
// RD-7  — Filter by sprint works correctly
// RD-8  — Empty database returns report with zero eval runs
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   MOCK: eval-db module
   reporting-dashboard.ts calls initEvalDb() (no args) internally.
   The singleton path check would cause it to open the real DB file
   instead of our test DB. We mock so initEvalDb always returns
   the in-memory test database.
──────────────────────────────────────────────────────────────── */

let testDb: InstanceType<typeof Database>;

vi.mock('../lib/eval/eval-db', () => ({
  initEvalDb: () => testDb,
  getEvalDb: () => testDb,
  closeEvalDb: () => {},
}));

import {
  generateDashboardReport,
  formatReportText,
  formatReportJSON,
  type DashboardReport,
  type ReportConfig,
} from '../lib/eval/reporting-dashboard';

/* ───────────────────────────────────────────────────────────────
   SCHEMA: Replicate the eval tables needed by reporting-dashboard.
──────────────────────────────────────────────────────────────── */

const EVAL_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS eval_metric_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eval_run_id INTEGER NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    channel TEXT,
    query_count INTEGER,
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS eval_channel_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eval_run_id INTEGER NOT NULL,
    query_id INTEGER NOT NULL,
    channel TEXT NOT NULL,
    result_memory_ids TEXT,
    scores TEXT,
    latency_ms REAL,
    hit_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`;

/* ───────────────────────────────────────────────────────────────
   HELPERS: Seed data into the test database.
──────────────────────────────────────────────────────────────── */

interface SnapshotSeed {
  eval_run_id: number;
  metric_name: string;
  metric_value: number;
  channel?: string | null;
  query_count?: number | null;
  metadata?: string | null;
  created_at?: string;
}

interface ChannelResultSeed {
  eval_run_id: number;
  query_id: number;
  channel: string;
  hit_count?: number;
  latency_ms?: number | null;
}

function seedSnapshots(db: InstanceType<typeof Database>, rows: SnapshotSeed[]): void {
  const stmt = db.prepare(`
    INSERT INTO eval_metric_snapshots
      (eval_run_id, metric_name, metric_value, channel, query_count, metadata, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of rows) {
    stmt.run(
      r.eval_run_id,
      r.metric_name,
      r.metric_value,
      r.channel ?? null,
      r.query_count ?? null,
      r.metadata ?? null,
      r.created_at ?? new Date().toISOString(),
    );
  }
}

function seedChannelResults(db: InstanceType<typeof Database>, rows: ChannelResultSeed[]): void {
  const stmt = db.prepare(`
    INSERT INTO eval_channel_results
      (eval_run_id, query_id, channel, hit_count, latency_ms)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const r of rows) {
    stmt.run(
      r.eval_run_id,
      r.query_id,
      r.channel,
      r.hit_count ?? 0,
      r.latency_ms ?? null,
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   SETUP / TEARDOWN
──────────────────────────────────────────────────────────────── */

beforeEach(() => {
  testDb = new Database(':memory:');
  testDb.pragma('journal_mode = WAL');
  testDb.exec(EVAL_SCHEMA_SQL);
});

afterEach(() => {
  try {
    testDb.close();
  } catch {
    // Ignore close errors on in-memory DB
  }
});

/* ===============================================================
   TEST SUITES
=============================================================== */

describe('Reporting Dashboard (R13-S3)', () => {

  /* --- S7-RD-8: Empty database --- */

  describe('S7-RD-8: Empty database returns report with zero eval runs', () => {
    it('returns a valid DashboardReport with all zeroed fields', async () => {
      const report = await generateDashboardReport();

      expect(report).toBeDefined();
      expect(report.totalEvalRuns).toBe(0);
      expect(report.totalSnapshots).toBe(0);
      expect(report.sprints).toEqual([]);
      expect(report.trends).toEqual([]);
      expect(typeof report.generatedAt).toBe('string');
      expect(typeof report.summary).toBe('string');
      expect(report.summary).toContain('0 eval run');
    });

    it('generatedAt is a valid ISO timestamp', async () => {
      const report = await generateDashboardReport();
      const parsed = new Date(report.generatedAt);
      expect(parsed.getTime()).not.toBeNaN();
    });
  });

  /* --- S7-RD-1: Valid DashboardReport structure --- */

  describe('S7-RD-1: generateDashboardReport() returns valid DashboardReport structure', () => {
    beforeEach(() => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.82,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 1,
          metric_name: 'mrr@5',
          metric_value: 0.75,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);
    });

    it('returns all required top-level fields', async () => {
      const report = await generateDashboardReport();

      // Top-level shape
      expect(report).toHaveProperty('generatedAt');
      expect(report).toHaveProperty('totalEvalRuns');
      expect(report).toHaveProperty('totalSnapshots');
      expect(report).toHaveProperty('sprints');
      expect(report).toHaveProperty('trends');
      expect(report).toHaveProperty('summary');

      expect(typeof report.generatedAt).toBe('string');
      expect(typeof report.totalEvalRuns).toBe('number');
      expect(typeof report.totalSnapshots).toBe('number');
      expect(Array.isArray(report.sprints)).toBe(true);
      expect(Array.isArray(report.trends)).toBe(true);
      expect(typeof report.summary).toBe('string');
    });

    it('totalEvalRuns and totalSnapshots reflect seeded data', async () => {
      const report = await generateDashboardReport();

      expect(report.totalEvalRuns).toBe(1);
      expect(report.totalSnapshots).toBe(2);
    });

    it('sprint report has required fields', async () => {
      const report = await generateDashboardReport();

      expect(report.sprints.length).toBe(1);
      const sprint = report.sprints[0];

      expect(sprint).toHaveProperty('sprint');
      expect(sprint).toHaveProperty('evalRunCount');
      expect(sprint).toHaveProperty('evalRunIds');
      expect(sprint).toHaveProperty('metrics');
      expect(sprint).toHaveProperty('channels');
      expect(sprint).toHaveProperty('firstSeen');
      expect(sprint).toHaveProperty('lastSeen');

      expect(sprint.sprint).toBe('sprint-1');
      expect(sprint.evalRunCount).toBe(1);
      expect(sprint.evalRunIds).toContain(1);
    });
  });

  /* --- S7-RD-2: Sprint-level metric aggregation --- */

  describe('S7-RD-2: Sprint-level metric aggregation (mean, min, max, latest)', () => {
    beforeEach(() => {
      // Two eval runs in the same sprint with varying metric values
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-11T10:00:00.000Z',
        },
        {
          eval_run_id: 3,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-12T10:00:00.000Z',
        },
      ]);
    });

    it('computes mean, min, max, latest, count correctly', async () => {
      const report = await generateDashboardReport();

      expect(report.sprints.length).toBe(1);
      const metrics = report.sprints[0].metrics;
      expect(metrics).toHaveProperty('ndcg@5');

      const ndcg = metrics['ndcg@5'];
      expect(ndcg.count).toBe(3);
      expect(ndcg.min).toBe(0.7);
      expect(ndcg.max).toBe(0.9);
      // Latest = value with most recent created_at (0.80 at 2026-01-12)
      expect(ndcg.latest).toBe(0.8);
      // Mean = (0.70 + 0.90 + 0.80) / 3 = 0.8
      expect(ndcg.mean).toBeCloseTo(0.8, 4);
    });

    it('aggregates multiple metrics independently', async () => {
      // Add a second metric type
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'mrr@5',
          metric_value: 0.60,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'mrr@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-11T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      const metrics = report.sprints[0].metrics;

      expect(Object.keys(metrics)).toContain('ndcg@5');
      expect(Object.keys(metrics)).toContain('mrr@5');

      // Ndcg@5 still has 3 values from beforeEach
      expect(metrics['ndcg@5'].count).toBe(3);
      // Mrr@5 has 2 values
      expect(metrics['mrr@5'].count).toBe(2);
      expect(metrics['mrr@5'].min).toBe(0.6);
      expect(metrics['mrr@5'].max).toBe(0.8);
    });
  });

  /* --- S7-RD-3: Channel performance data --- */

  describe('S7-RD-3: Report includes channel performance data', () => {
    beforeEach(() => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.85,
          channel: 'vector',
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.75,
          channel: 'bm25',
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:05:00.000Z',
        },
      ]);

      seedChannelResults(testDb, [
        { eval_run_id: 1, query_id: 1, channel: 'vector', hit_count: 5, latency_ms: 12.5 },
        { eval_run_id: 1, query_id: 2, channel: 'vector', hit_count: 3, latency_ms: 15.0 },
        { eval_run_id: 1, query_id: 1, channel: 'bm25', hit_count: 4, latency_ms: 8.0 },
        { eval_run_id: 1, query_id: 2, channel: 'bm25', hit_count: 2, latency_ms: 6.0 },
      ]);
    });

    it('aggregates channel hits, latency, and query counts', async () => {
      const report = await generateDashboardReport();

      expect(report.sprints.length).toBe(1);
      const channels = report.sprints[0].channels;

      expect(channels).toHaveProperty('vector');
      expect(channels).toHaveProperty('bm25');

      // Vector: 2 queries, hits = 5+3=8, avgLatency = (12.5+15.0)/2 = 13.75
      expect(channels['vector'].queryCount).toBe(2);
      expect(channels['vector'].hitCount).toBe(8);
      expect(channels['vector'].avgLatencyMs).toBeCloseTo(13.75, 1);

      // Bm25: 2 queries, hits = 4+2=6, avgLatency = (8.0+6.0)/2 = 7.0
      expect(channels['bm25'].queryCount).toBe(2);
      expect(channels['bm25'].hitCount).toBe(6);
      expect(channels['bm25'].avgLatencyMs).toBeCloseTo(7.0, 1);
    });

    it('weights grouped channel latency by query volume across runs', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.88,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-11T10:00:00.000Z',
        },
      ]);

      seedChannelResults(testDb, [
        { eval_run_id: 2, query_id: 1, channel: 'vector', hit_count: 4, latency_ms: 100.0 },
      ]);

      const report = await generateDashboardReport();
      const vector = report.sprints[0].channels['vector'];

      expect(vector.queryCount).toBe(3);
      expect(vector.hitCount).toBe(12);
      expect(vector.avgLatencyMs).toBeCloseTo((12.5 + 15.0 + 100.0) / 3, 4);
    });

    it('returns empty channels when no channel results exist', async () => {
      // Clear channel_results but keep snapshots
      testDb.exec('DELETE FROM eval_channel_results');

      const report = await generateDashboardReport();
      expect(report.sprints.length).toBe(1);
      expect(Object.keys(report.sprints[0].channels).length).toBe(0);
    });

    it('preserves per-channel metric summaries alongside aggregate metrics', async () => {
      const report = await generateDashboardReport();
      const sprint = report.sprints[0];

      expect(sprint.metrics['ndcg@5'].count).toBe(2);
      expect(sprint.channelMetrics['ndcg@5']).toBeDefined();
      expect(sprint.channelMetrics['ndcg@5']['vector'].latest).toBe(0.85);
      expect(sprint.channelMetrics['ndcg@5']['bm25'].latest).toBe(0.75);
    });
  });

  /* --- S7-RD-4: Trend entries with direction --- */

  describe('S7-RD-4: Trend entries with direction (improved/regressed/unchanged)', () => {
    beforeEach(() => {
      // Two sprints to produce trend comparison
      seedSnapshots(testDb, [
        // Iteration 1: ndcg@5 = 0.70
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        // Iteration 2: ndcg@5 = 0.85 (improved)
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.85,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
        // Iteration 1: mrr@5 = 0.80
        {
          eval_run_id: 1,
          metric_name: 'mrr@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        // Iteration 2: mrr@5 = 0.60 (regressed)
        {
          eval_run_id: 2,
          metric_name: 'mrr@5',
          metric_value: 0.60,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
        // Iteration 1: precision@5 = 0.50
        {
          eval_run_id: 1,
          metric_name: 'precision@5',
          metric_value: 0.50,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        // Iteration 2: precision@5 = 0.50 (unchanged)
        {
          eval_run_id: 2,
          metric_name: 'precision@5',
          metric_value: 0.50,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
      ]);
    });

    it('produces trend entries for all common metrics across sprints', async () => {
      const report = await generateDashboardReport();

      expect(report.trends.length).toBe(3);
      const trendNames = report.trends.map(t => t.metric).sort();
      expect(trendNames).toEqual(['mrr@5', 'ndcg@5', 'precision@5']);
    });

    it('marks improved trend correctly (higher-is-better metric increases)', async () => {
      const report = await generateDashboardReport();
      const ndcgTrend = report.trends.find(t => t.metric === 'ndcg@5');

      expect(ndcgTrend).toBeDefined();
      expect(ndcgTrend!.direction).toBe('improved');
      expect(ndcgTrend!.previous).toBe(0.7);
      expect(ndcgTrend!.current).toBe(0.85);
      expect(ndcgTrend!.delta).toBeCloseTo(0.15, 4);
      expect(ndcgTrend!.percentChange).toBeGreaterThan(0);
      expect(ndcgTrend!.previousLabel).toBe('sprint-1');
      expect(ndcgTrend!.currentLabel).toBe('sprint-2');
    });

    it('marks regressed trend correctly (higher-is-better metric decreases)', async () => {
      const report = await generateDashboardReport();
      const mrrTrend = report.trends.find(t => t.metric === 'mrr@5');

      expect(mrrTrend).toBeDefined();
      expect(mrrTrend!.direction).toBe('regressed');
      expect(mrrTrend!.delta).toBeLessThan(0);
      expect(mrrTrend!.percentChange).toBeLessThan(0);
    });

    it('marks unchanged trend when delta is negligible', async () => {
      const report = await generateDashboardReport();
      const precTrend = report.trends.find(t => t.metric === 'precision@5');

      expect(precTrend).toBeDefined();
      expect(precTrend!.direction).toBe('unchanged');
      expect(precTrend!.delta).toBe(0);
    });

    it('returns no trends when only one sprint exists', async () => {
      // Clear all data and seed just one sprint
      testDb.exec('DELETE FROM eval_metric_snapshots');
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      expect(report.trends).toEqual([]);
    });

    it('handles lower-is-better metric (inversion_rate) correctly', async () => {
      // Add inversion_rate data across two sprints
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'inversion_rate',
          metric_value: 0.30,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'inversion_rate',
          metric_value: 0.20,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      const invTrend = report.trends.find(t => t.metric === 'inversion_rate');

      expect(invTrend).toBeDefined();
      // Lower inversion_rate is better, and it went from 0.30 to 0.20 (decreased)
      expect(invTrend!.direction).toBe('improved');
      expect(invTrend!.delta).toBeLessThan(0);
    });
  });

  /* --- S7-RD-5: formatReportText --- */

  describe('S7-RD-5: formatReportText() produces non-empty string with expected sections', () => {
    it('formats an empty report with header sections', async () => {
      const report = await generateDashboardReport();
      const text = formatReportText(report);

      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
      expect(text).toContain('EVAL REPORTING DASHBOARD');
      expect(text).toContain('SUMMARY');
      expect(text).toContain('Total eval runs: 0');
      expect(text).toContain('Total metric snapshots: 0');
    });

    it('includes sprint details and metrics in formatted text', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.85,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      const text = formatReportText(report);

      expect(text).toContain('SPRINT: sprint-1');
      expect(text).toContain('Eval runs: 1');
      expect(text).toContain('ndcg@5');
      expect(text).toContain('Metrics:');
    });

    it('includes channel data in formatted text when present', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.85,
          channel: 'vector',
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);
      seedChannelResults(testDb, [
        { eval_run_id: 1, query_id: 1, channel: 'vector', hit_count: 5, latency_ms: 10.0 },
      ]);

      const report = await generateDashboardReport();
      const text = formatReportText(report);

      expect(text).toContain('Channels:');
      expect(text).toContain('Metric Channels:');
      expect(text).toContain('ndcg@5 [vector]');
      expect(text).toContain('vector');
    });

    it('includes TRENDS section when trends exist', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      const text = formatReportText(report);

      expect(text).toContain('TRENDS');
      expect(text).toContain('ndcg@5');
    });
  });

  /* --- S7-RD-6: formatReportJSON --- */

  describe('S7-RD-6: formatReportJSON() produces valid JSON matching DashboardReport shape', () => {
    it('produces valid JSON for an empty report', async () => {
      const report = await generateDashboardReport();
      const json = formatReportJSON(report);

      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(parsed).toBeDefined();
    });

    it('round-trips back to matching DashboardReport structure', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.82,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      const json = formatReportJSON(report);
      const parsed: DashboardReport = JSON.parse(json);

      // Verify the parsed JSON has the full shape
      expect(parsed.generatedAt).toBe(report.generatedAt);
      expect(parsed.totalEvalRuns).toBe(report.totalEvalRuns);
      expect(parsed.totalSnapshots).toBe(report.totalSnapshots);
      expect(parsed.sprints.length).toBe(report.sprints.length);
      expect(parsed.trends.length).toBe(report.trends.length);
      expect(parsed.summary).toBe(report.summary);
    });

    it('JSON output is pretty-printed (indented)', async () => {
      const report = await generateDashboardReport();
      const json = formatReportJSON(report);

      // Pretty-printed JSON has newlines and indentation
      expect(json).toContain('\n');
      expect(json).toContain('  ');
    });
  });

  /* --- S7-RD-7: Sprint filter --- */

  describe('S7-RD-7: Filter by sprint works correctly', () => {
    beforeEach(() => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.85,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
        {
          eval_run_id: 3,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'sprint-3' }),
          created_at: '2026-01-30T10:00:00.000Z',
        },
      ]);
    });

    it('filters to only the specified sprint', async () => {
      const report = await generateDashboardReport({ sprintFilter: ['sprint-2'] });

      expect(report.sprints.length).toBe(1);
      expect(report.sprints[0].sprint).toBe('sprint-2');
    });

    it('filters to multiple sprints', async () => {
      const report = await generateDashboardReport({
        sprintFilter: ['sprint-1', 'sprint-3'],
      });

      expect(report.sprints.length).toBe(2);
      const labels = report.sprints.map(s => s.sprint).sort();
      expect(labels).toEqual(['sprint-1', 'sprint-3']);
    });

    it('returns empty sprints when filter matches nothing', async () => {
      const report = await generateDashboardReport({
        sprintFilter: ['sprint-99'],
      });

      expect(report.sprints.length).toBe(0);
    });

    it('sprint filter uses case-insensitive partial matching', async () => {
      const report = await generateDashboardReport({
        sprintFilter: ['SPRINT-1'],
      });

      // The groupBySprint uses .toLowerCase().includes() for matching
      expect(report.sprints.length).toBe(1);
      expect(report.sprints[0].sprint).toBe('sprint-1');
    });

    it('without sprint filter returns all sprints', async () => {
      const report = await generateDashboardReport();

      expect(report.sprints.length).toBe(3);
    });

    it('limit applies after sprint grouping and report totals match the included scope', async () => {
      const crowdedSprintRows: SnapshotSeed[] = Array.from({ length: 41 }, (_, index) => ({
        eval_run_id: 3,
        metric_name: `metric-${index + 1}`,
        metric_value: 0.5 + (index / 1000),
        metadata: JSON.stringify({ sprint: 'sprint-3' }),
        created_at: '2026-01-30T10:00:00.000Z',
      }));

      seedSnapshots(testDb, crowdedSprintRows);

      const report = await generateDashboardReport({ limit: 2 });

      expect(report.sprints.length).toBe(2);
      expect(report.sprints.map((sprint) => sprint.sprint)).toEqual(['sprint-2', 'sprint-3']);
      expect(report.totalEvalRuns).toBe(2);
      expect(report.totalSnapshots).toBe(43);
      expect(report.summary).toContain('2 eval run(s) across 2 sprint group(s)');
    });
  });

  /* --- Additional edge cases --- */

  describe('Edge cases and fallback behavior', () => {
    it('uses "run-{id}" fallback label when metadata has no sprint field', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 42,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: null,
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      expect(report.sprints.length).toBe(1);
      expect(report.sprints[0].sprint).toBe('run-42');
    });

    it('uses sprintLabel field as fallback when sprint field is absent', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprintLabel: 'alpha-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      expect(report.sprints[0].sprint).toBe('alpha-1');
    });

    it('handles malformed JSON in metadata gracefully', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: 'not-valid-json{{{',
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);

      // Should not throw, falls back to run-{id} label
      const report = await generateDashboardReport();
      expect(report.sprints.length).toBe(1);
      expect(report.sprints[0].sprint).toBe('run-1');
    });

    it('metric filter restricts which metrics appear', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 1,
          metric_name: 'mrr@5',
          metric_value: 0.75,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport({ metricFilter: ['ndcg@5'] });

      expect(report.sprints.length).toBe(1);
      const metricNames = Object.keys(report.sprints[0].metrics);
      expect(metricNames).toEqual(['ndcg@5']);
      expect(metricNames).not.toContain('mrr@5');
    });

    it('channel filter restricts which channel results appear', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
      ]);
      seedChannelResults(testDb, [
        { eval_run_id: 1, query_id: 1, channel: 'vector', hit_count: 5, latency_ms: 10.0 },
        { eval_run_id: 1, query_id: 1, channel: 'bm25', hit_count: 3, latency_ms: 5.0 },
        { eval_run_id: 1, query_id: 1, channel: 'fts', hit_count: 2, latency_ms: 3.0 },
      ]);

      const report = await generateDashboardReport({ channelFilter: ['vector', 'bm25'] });

      const channelNames = Object.keys(report.sprints[0].channels);
      expect(channelNames).toContain('vector');
      expect(channelNames).toContain('bm25');
      expect(channelNames).not.toContain('fts');
    });

    it('summary includes trend information when trends exist', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'sprint-1' }),
          created_at: '2026-01-10T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'sprint-2' }),
          created_at: '2026-01-20T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      expect(report.summary).toContain('Trends:');
      expect(report.summary).toContain('improved');
    });

    it('sprints are sorted chronologically by recency bounds', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 3,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'sprint-C' }),
          created_at: '2026-03-01T10:00:00.000Z',
        },
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'sprint-A' }),
          created_at: '2026-01-01T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.80,
          metadata: JSON.stringify({ sprint: 'sprint-B' }),
          created_at: '2026-02-01T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport();
      const labels = report.sprints.map(s => s.sprint);
      expect(labels).toEqual(['sprint-A', 'sprint-B', 'sprint-C']);
    });

    it('limit keeps the most recently active sprint even when it started earlier', async () => {
      seedSnapshots(testDb, [
        {
          eval_run_id: 1,
          metric_name: 'ndcg@5',
          metric_value: 0.70,
          metadata: JSON.stringify({ sprint: 'long-running' }),
          created_at: '2026-01-01T10:00:00.000Z',
        },
        {
          eval_run_id: 1,
          metric_name: 'mrr@5',
          metric_value: 0.82,
          metadata: JSON.stringify({ sprint: 'long-running' }),
          created_at: '2026-03-30T10:00:00.000Z',
        },
        {
          eval_run_id: 2,
          metric_name: 'ndcg@5',
          metric_value: 0.90,
          metadata: JSON.stringify({ sprint: 'recent-but-older' }),
          created_at: '2026-03-01T10:00:00.000Z',
        },
      ]);

      const report = await generateDashboardReport({ limit: 1 });

      expect(report.sprints).toHaveLength(1);
      expect(report.sprints[0].sprint).toBe('long-running');
      expect(report.sprints[0].lastSeen).toBe('2026-03-30T10:00:00.000Z');
    });
  });
});
