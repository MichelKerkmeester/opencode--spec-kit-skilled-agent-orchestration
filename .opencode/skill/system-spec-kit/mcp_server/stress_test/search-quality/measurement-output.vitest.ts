// ───────────────────────────────────────────────────────────────
// MODULE: Search Quality Measurement Output Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises extended measurement corpus output and optional JSON emission.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  runMeasurement,
  type MeasurementVariant,
} from './measurement-fixtures.js';
import type { SearchQualityWorkstream } from './corpus.js';

const WORKSTREAMS = ['W3', 'W4', 'W5', 'W6', 'W7', 'all'] as const;
const VARIANTS = ['baseline', 'variant'] as const;
type MeasurementWorkstream = (typeof WORKSTREAMS)[number];

function isMeasurementWorkstream(value: string): value is MeasurementWorkstream {
  return WORKSTREAMS.includes(value as MeasurementWorkstream);
}

function isMeasurementVariant(value: string): value is MeasurementVariant {
  return VARIANTS.includes(value as MeasurementVariant);
}

describe('search-quality measurement output', () => {
  it('runs the extended measurement corpus and optionally writes JSON output', async () => {
    const workstream = normalizeWorkstream(process.env.SPECKIT_SEARCH_QUALITY_WORKSTREAM);
    const variant = normalizeVariant(process.env.SPECKIT_SEARCH_QUALITY_VARIANT);
    const runId = process.env.SPECKIT_SEARCH_QUALITY_RUN_ID;
    const outputPath = process.env.SPECKIT_SEARCH_QUALITY_OUTPUT;

    const measurement = await runMeasurement({ workstream, variant, runId });

    expect(measurement.cases.length).toBeGreaterThan(0);
    expect(measurement.summary.precisionAt3).toBeGreaterThanOrEqual(0);
    expect(measurement.summary.recallAt3).toBeGreaterThanOrEqual(0);
    expect(measurement.summary.latency.p95).toBeGreaterThanOrEqual(measurement.summary.latency.p50);
    expect(measurement.summary.refusalSurvival).toBeGreaterThanOrEqual(0);
    expect(measurement.summary.citationQuality).toBeGreaterThanOrEqual(0);

    if (outputPath) {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, `${JSON.stringify(measurement, null, 2)}\n`, 'utf8');
    }
  });
});

function normalizeWorkstream(value: string | undefined): SearchQualityWorkstream | 'all' {
  if (!value) return 'all';
  if (!isMeasurementWorkstream(value)) {
    throw new Error(`Unsupported workstream: ${value}`);
  }
  return value;
}

function normalizeVariant(value: string | undefined): MeasurementVariant {
  if (!value) return 'baseline';
  if (!isMeasurementVariant(value)) {
    throw new Error(`Unsupported measurement variant: ${value}`);
  }
  return value;
}
