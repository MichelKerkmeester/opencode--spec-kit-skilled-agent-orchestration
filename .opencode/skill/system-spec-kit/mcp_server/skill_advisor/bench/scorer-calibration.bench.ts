// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Calibration Bench
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { isSpeckitMetricsEnabled, speckitMetrics } from '../lib/metrics.js';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import { loadAdvisorProjection } from '../lib/scorer/projection.js';
import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

process.env.SPECKIT_METRICS_ENABLED = 'true';

interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1: string;
}

interface ReliabilityBucket {
  readonly bucket: string;
  readonly n: number;
  readonly accuracy: number;
  readonly avgConfidence: number;
}

interface CalibrationBaseline {
  readonly version: string;
  readonly generatedAt: string;
  readonly corpusSha: string;
  readonly corpusRows: number;
  readonly brierScore: number;
  readonly expectedCalibrationError: number;
  readonly reliability: readonly ReliabilityBucket[];
  readonly tolerance: {
    readonly brierDeltaPct: number;
    readonly eceDeltaPct: number;
  };
}

interface Prediction {
  readonly id: string;
  readonly prompt: string;
  readonly trueSkill: string | null;
  readonly predictedSkill: string | null;
  readonly confidence: number;
  readonly correct: 0 | 1;
}

interface BucketAccumulator {
  n: number;
  confidenceSum: number;
  correctSum: number;
}

interface CalibrationReport {
  readonly baseline: CalibrationBaseline;
  readonly predictions: readonly Prediction[];
  readonly brierDeltaPct: number;
  readonly eceDeltaPct: number;
  readonly passed: boolean;
}

const SPECKIT_BENCH_CORPUS_PATH = '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl';
const BASELINE_FILENAME = 'scorer-calibration-baseline.json';
const BUCKET_COUNT = 10;
const BENCH_TIMEOUT_MS = process.env.CI ? 300_000 : 180_000;

function workspaceRoot(): string {
  const start = dirname(fileURLToPath(import.meta.url));
  const sentinel = '.opencode/skill/system-spec-kit/SKILL.md';
  const candidate = findAdvisorWorkspaceRoot(start, { maxDepth: 12, sentinel });
  if (!existsSync(resolve(candidate, sentinel))) {
    throw new Error('Unable to locate workspace root.');
  }
  return candidate;
}

function roundMetric(value: number): number {
  return Number(value.toFixed(6));
}

function bucketLabel(index: number): string {
  return `${(index / BUCKET_COUNT).toFixed(1)}-${((index + 1) / BUCKET_COUNT).toFixed(1)}`;
}

function confidenceBucket(confidence: number): number {
  return Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor(confidence * BUCKET_COUNT)));
}

function pctDelta(observed: number, baseline: number): number {
  if (baseline === 0) return observed === 0 ? 0 : Number.POSITIVE_INFINITY;
  return roundMetric(((observed - baseline) / baseline) * 100);
}

function goldSkill(row: CorpusRow): string | null {
  return row.skill_top_1 === 'none' ? null : row.skill_top_1;
}

function readCorpus(path: string): CorpusRow[] {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as CorpusRow);
}

function corpusSha(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function baselinePath(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), BASELINE_FILENAME);
}

function readBaseline(path: string): CalibrationBaseline {
  if (!existsSync(path)) {
    throw new Error(`Scorer calibration baseline missing at ${path}`);
  }
  return JSON.parse(readFileSync(path, 'utf8')) as CalibrationBaseline;
}

function computeReliability(predictions: readonly Prediction[]): ReliabilityBucket[] {
  const buckets = Array.from({ length: BUCKET_COUNT }, () => ({
    n: 0,
    confidenceSum: 0,
    correctSum: 0,
  } satisfies BucketAccumulator));

  for (const prediction of predictions) {
    const bucket = buckets[confidenceBucket(prediction.confidence)];
    bucket.n += 1;
    bucket.confidenceSum += prediction.confidence;
    bucket.correctSum += prediction.correct;
  }

  return buckets.map((bucket, index) => ({
    bucket: bucketLabel(index),
    n: bucket.n,
    accuracy: bucket.n === 0 ? 0 : roundMetric(bucket.correctSum / bucket.n),
    avgConfidence: bucket.n === 0 ? 0 : roundMetric(bucket.confidenceSum / bucket.n),
  }));
}

function computeEce(reliability: readonly ReliabilityBucket[], total: number): number {
  return roundMetric(reliability.reduce((sum, bucket) => (
    sum + (bucket.n / total) * Math.abs(bucket.avgConfidence - bucket.accuracy)
  ), 0));
}

function createBaseline(args: {
  corpusHash: string;
  corpusRows: number;
  brierScore: number;
  expectedCalibrationError: number;
  reliability: readonly ReliabilityBucket[];
}): CalibrationBaseline {
  return {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    corpusSha: args.corpusHash,
    corpusRows: args.corpusRows,
    brierScore: args.brierScore,
    expectedCalibrationError: args.expectedCalibrationError,
    reliability: args.reliability,
    tolerance: { brierDeltaPct: 50, eceDeltaPct: 50 },
  };
}

export function runScorerCalibrationBench(root = workspaceRoot()): CalibrationReport {
  const corpusPath = resolve(root, SPECKIT_BENCH_CORPUS_PATH);
  const rows = readCorpus(corpusPath);
  const projection = loadAdvisorProjection(root);
  speckitMetrics.reset();

  const predictions = rows.map((row) => {
    const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot: root, projection, includeAllCandidates: true });
    const top = result.topSkill === null
      ? null
      : result.recommendations.find((recommendation) => recommendation.skill === result.topSkill) ?? null;
    const predictedSkill = top?.skill ?? null;
    const confidence = top?.confidence ?? 0;
    const correct: 0 | 1 = predictedSkill === goldSkill(row) ? 1 : 0;
    const brierObservation = (confidence - correct) ** 2;
    speckitMetrics.recordBrierScore(brierObservation);
    return {
      id: row.id,
      prompt: row.prompt,
      trueSkill: goldSkill(row),
      predictedSkill,
      confidence,
      correct,
    } satisfies Prediction;
  });

  const brierScore = roundMetric(predictions.reduce((sum, prediction) => (
    sum + (prediction.confidence - prediction.correct) ** 2
  ), 0) / predictions.length);
  const reliability = computeReliability(predictions);
  const expectedCalibrationError = computeEce(reliability, predictions.length);
  const candidateBaseline = createBaseline({
    corpusHash: corpusSha(corpusPath),
    corpusRows: rows.length,
    brierScore,
    expectedCalibrationError,
    reliability,
  });

  const path = baselinePath();
  if (process.env.SPECKIT_WRITE_SCORER_CALIBRATION_BASELINE === '1') {
    writeFileSync(path, `${JSON.stringify(candidateBaseline, null, 2)}\n`, 'utf8');
  }

  const baseline = readBaseline(path);
  const brierDeltaPct = pctDelta(brierScore, baseline.brierScore);
  const eceDeltaPct = pctDelta(expectedCalibrationError, baseline.expectedCalibrationError);
  const passed = Math.abs(brierDeltaPct) <= baseline.tolerance.brierDeltaPct
    && Math.abs(eceDeltaPct) <= baseline.tolerance.eceDeltaPct;
  const brierMean = speckitMetrics.snapshot().brierMean.get('spec_kit.scorer.confidence_brier_score{}');

  console.log(`advisor-scorer-calibration ${JSON.stringify({
    corpusSha: candidateBaseline.corpusSha,
    corpusRows: rows.length,
    brierScore,
    expectedCalibrationError,
    brierDeltaPct,
    eceDeltaPct,
    reliability,
    metricBrierMean: brierMean === undefined ? null : roundMetric(brierMean),
  })}`);

  expect(isSpeckitMetricsEnabled()).toBe(true);
  expect(roundMetric(brierMean ?? -1)).toBe(brierScore);
  expect(baseline.corpusSha).toBe(candidateBaseline.corpusSha);
  expect(baseline.corpusRows).toBe(candidateBaseline.corpusRows);

  return { baseline, predictions, brierDeltaPct, eceDeltaPct, passed };
}

describe('scorer calibration bench', () => {
  it('keeps Brier score and ECE within baseline tolerance', () => {
    const started = performance.now();
    const report = runScorerCalibrationBench();
    console.log(`advisor-scorer-calibration-duration ${JSON.stringify({ durationMs: Math.round(performance.now() - started) })}`);
    expect(report.passed, `calibration delta exceeded tolerance: ${JSON.stringify({
      brierDeltaPct: report.brierDeltaPct,
      eceDeltaPct: report.eceDeltaPct,
      tolerance: report.baseline.tolerance,
    })}`).toBe(true);
  }, BENCH_TIMEOUT_MS);
});
