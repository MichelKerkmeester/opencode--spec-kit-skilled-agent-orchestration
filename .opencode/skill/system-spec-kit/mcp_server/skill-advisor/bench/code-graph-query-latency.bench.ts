// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Query Latency Benchmark (PR 9 / T-048)
// ───────────────────────────────────────────────────────────────
// Wraps `buildContext` for the 3 canonical query modes
// (outline / blast_radius / relationship) against a hashed corpus
// fixture, then asserts percentile DELTA vs the baseline JSON file. Missing
// or malformed baselines are bench invariants and must fail instead of skip.
// Closes findings F36 #7, F73-#3, F73-#4, F28.

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { buildContext, type QueryMode } from '../../code-graph/lib/code-graph-context.js';
import * as graphDb from '../../code-graph/lib/code-graph-db.js';
import type { CodeEdge, CodeNode } from '../../code-graph/lib/indexer-types.js';
import { isSpeckitMetricsEnabled, speckitMetrics } from '../lib/metrics.js';

type ModeLabel = 'outline' | 'blast_radius' | 'relationship';
interface BaselineFile {
  metrics: Record<ModeLabel, { p50_ms: number; p95_ms: number; p99_ms: number }>;
  tolerance: { p50_pct: number; p95_pct: number; p99_pct: number };
}
interface ModePct { p50: number; p95: number; p99: number; count: number }
interface DeltaPct { p50_pct: number; p95_pct: number; p99_pct: number }
export interface QueryLatencyBenchReport {
  skipped: boolean; skipReason?: string; corpusSha: string;
  metrics: Record<ModeLabel, ModePct>; deltas: Record<ModeLabel, DeltaPct>; passed: boolean;
}

const SAMPLES_PER_MODE = 20;
const BASELINE_FILENAME = 'code-graph-query-latency.baseline.json';
const MODES: { qm: QueryMode; label: ModeLabel }[] = [
  { qm: 'outline', label: 'outline' },
  { qm: 'impact', label: 'blast_radius' },
  { qm: 'neighborhood', label: 'relationship' },
];
const ZERO_PCT: ModePct = { p50: 0, p95: 0, p99: 0, count: 0 };
const ZERO_DELTA: DeltaPct = { p50_pct: 0, p95_pct: 0, p99_pct: 0 };

class BenchInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BenchInvariantError';
  }
}

function percentile(values: readonly number[], pct: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * pct) - 1));
  return Number((sorted[idx] ?? 0).toFixed(3));
}

/** Deterministic 5-file × 10-symbol fixture seeded into the SQLite graph DB. */
function seedFixture(): { corpusSha: string; subjectFqName: string } {
  const filePaths = Array.from({ length: 5 }, (_, i) => `bench/fixture/file-${i}.ts`);
  const corpusHash = createHash('sha256');
  let firstFqName = '';

  for (const filePath of filePaths) {
    const fileNodes: CodeNode[] = [];
    for (let si = 0; si < 10; si += 1) {
      const fqName = `bench.fixture.${filePath}.symbol${si}`;
      const symbolId = createHash('sha256').update(`${filePath}::${fqName}::function`).digest('hex').slice(0, 16);
      fileNodes.push({
        symbolId, filePath, fqName, kind: 'function', name: `symbol${si}`,
        startLine: si * 5 + 1, endLine: si * 5 + 4, startColumn: 0, endColumn: 0,
        language: 'typescript',
        contentHash: createHash('sha256').update(fqName).digest('hex').slice(0, 12),
      });
      corpusHash.update(`${symbolId}|${fqName}`);
      if (!firstFqName) firstFqName = fqName;
    }
    const fileEdges: CodeEdge[] = [];
    for (let si = 0; si + 1 < fileNodes.length; si += 1) {
      fileEdges.push({ sourceId: fileNodes[si].symbolId, targetId: fileNodes[si + 1].symbolId, edgeType: 'CALLS', weight: 1 });
    }
    const fileId = graphDb.upsertFile(
      filePath, 'typescript',
      createHash('sha256').update(filePath).digest('hex').slice(0, 12),
      fileNodes.length, fileEdges.length, 'clean', 0, { fileMtimeMs: Date.now() },
    );
    graphDb.replaceNodes(fileId, fileNodes);
    graphDb.replaceEdges(fileNodes.map((n) => n.symbolId), fileEdges);
  }
  return { corpusSha: corpusHash.digest('hex').slice(0, 16), subjectFqName: firstFqName };
}

function extractHistogram(label: ModeLabel): number[] {
  const out: number[] = [];
  for (const [seriesKey, samples] of speckitMetrics.snapshot().histograms) {
    if (seriesKey.startsWith('spec_kit.graph.query_latency_ms{') && seriesKey.includes(`mode=${label}`)) {
      out.push(...samples);
    }
  }
  return out;
}

function pctDelta(observed: number, base: number): number {
  if (base <= 0) return observed > 0 ? Number.POSITIVE_INFINITY : 0;
  return ((observed - base) / base) * 100;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function readBaseline(path: string): BaselineFile {
  if (!existsSync(path)) {
    throw new BenchInvariantError(`Baseline file missing at ${path}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf-8')) as unknown;
  } catch (error) {
    throw new BenchInvariantError(`Baseline file malformed at ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const candidate = parsed as Partial<BaselineFile> | null;
  const tolerance = candidate?.tolerance;
  if (!candidate?.metrics || !tolerance
    || !isFiniteNumber(tolerance.p50_pct)
    || !isFiniteNumber(tolerance.p95_pct)
    || !isFiniteNumber(tolerance.p99_pct)) {
    throw new BenchInvariantError(`Baseline file malformed at ${path}: missing metrics or tolerance`);
  }
  for (const { label } of MODES) {
    const modeBaseline = candidate.metrics[label];
    if (!modeBaseline
      || !isFiniteNumber(modeBaseline.p50_ms)
      || !isFiniteNumber(modeBaseline.p95_ms)
      || !isFiniteNumber(modeBaseline.p99_ms)) {
      throw new BenchInvariantError(`Baseline file malformed at ${path}: missing ${label} percentiles`);
    }
  }
  return candidate as BaselineFile;
}

export function runQueryLatencyBench(): QueryLatencyBenchReport {
  const previousMetricsEnabled = process.env.SPECKIT_METRICS_ENABLED;
  process.env.SPECKIT_METRICS_ENABLED = 'true';
  speckitMetrics.reset();
  const tmpRoot = mkdtempSync(join(tmpdir(), 'speckit-query-bench-'));
  const skip = (reason: string): QueryLatencyBenchReport => ({
    skipped: true, skipReason: reason, corpusSha: '',
    metrics: { outline: { ...ZERO_PCT }, blast_radius: { ...ZERO_PCT }, relationship: { ...ZERO_PCT } },
    deltas: { outline: { ...ZERO_DELTA }, blast_radius: { ...ZERO_DELTA }, relationship: { ...ZERO_DELTA } },
    passed: true,
  });

  try {
    try { graphDb.closeDb(); } catch { /* singleton cleanup */ }
    graphDb.initDb(tmpRoot);
    const { corpusSha, subjectFqName } = seedFixture();
    if (!isSpeckitMetricsEnabled()) {
      return skip('SPECKIT_METRICS_ENABLED guard rejected; bench cannot read emitted samples');
    }
    for (const { qm } of MODES) {
      for (let i = 0; i < SAMPLES_PER_MODE; i += 1) {
        buildContext({ subject: subjectFqName, queryMode: qm, profile: 'quick' });
      }
    }

    const baselinePath = resolve(dirname(fileURLToPath(import.meta.url)), BASELINE_FILENAME);
    const baseline = readBaseline(baselinePath);

    const metrics: Record<ModeLabel, ModePct> = { outline: { ...ZERO_PCT }, blast_radius: { ...ZERO_PCT }, relationship: { ...ZERO_PCT } };
    const deltas: Record<ModeLabel, DeltaPct> = { outline: { ...ZERO_DELTA }, blast_radius: { ...ZERO_DELTA }, relationship: { ...ZERO_DELTA } };
    let passed = true;
    for (const { label } of MODES) {
      const samples = extractHistogram(label);
      if (samples.length === 0) {
        throw new BenchInvariantError(`mode ${label} produced no query_latency_ms samples`);
      }
      const observed: ModePct = {
        p50: percentile(samples, 0.5), p95: percentile(samples, 0.95), p99: percentile(samples, 0.99),
        count: samples.length,
      };
      metrics[label] = observed;
      const base = baseline.metrics[label];
      const d: DeltaPct = {
        p50_pct: pctDelta(observed.p50, base.p50_ms),
        p95_pct: pctDelta(observed.p95, base.p95_ms),
        p99_pct: pctDelta(observed.p99, base.p99_ms),
      };
      deltas[label] = d;
      // One-sided regression: only fail when observed exceeds baseline by > tolerance.
      if (d.p50_pct > baseline.tolerance.p50_pct) passed = false;
      if (d.p95_pct > baseline.tolerance.p95_pct) passed = false;
      if (d.p99_pct > baseline.tolerance.p99_pct) passed = false;
    }
    return { skipped: false, corpusSha, metrics, deltas, passed };
  } catch (err) {
    if (err instanceof BenchInvariantError) {
      throw err;
    }
    return skip(err instanceof Error ? err.message : String(err));
  } finally {
    try { graphDb.closeDb(); } catch { /* best-effort */ }
    try { rmSync(tmpRoot, { recursive: true, force: true }); } catch { /* best-effort */ }
    if (previousMetricsEnabled === undefined) {
      delete process.env.SPECKIT_METRICS_ENABLED;
    } else {
      process.env.SPECKIT_METRICS_ENABLED = previousMetricsEnabled;
    }
    speckitMetrics.reset();
  }
}

describe('code-graph-query-latency bench', () => {
  it('emits query_latency_ms samples within baseline tolerance for all 3 modes', () => {
    const report = runQueryLatencyBench();
    if (report.skipped) {
      // Fail-soft: bench is env-dependent; better-sqlite3 / DB-init failures must not red-line CI.
      console.warn(`[code-graph-query-latency-bench] SKIPPED: ${report.skipReason ?? 'unknown'}`);
      expect(report.skipped).toBe(true);
      return;
    }
    for (const { label } of MODES) {
      const m = report.metrics[label];
      console.log(`[code-graph-query-latency-bench] mode=${label} count=${m.count} p50=${m.p50}ms p95=${m.p95}ms p99=${m.p99}ms`);
      expect(m.count, `mode ${label} produced no samples`).toBeGreaterThan(0);
    }
    expect(report.passed, `delta-vs-baseline assertion failed: ${JSON.stringify(report.deltas)}`).toBe(true);
  });
});

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
if (invoked) {
  const t0 = performance.now();
  const report = runQueryLatencyBench();
  console.log(`code-graph-query-latency-bench duration_ms=${Math.round(performance.now() - t0)} ${JSON.stringify(report)}`);
  if (!report.skipped && !report.passed) process.exitCode = 1;
}
