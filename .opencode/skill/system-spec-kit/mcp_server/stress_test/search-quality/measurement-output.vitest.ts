import { dirname } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  runMeasurement,
  type MeasurementVariant,
} from './measurement-fixtures.js';
import type { SearchQualityWorkstream } from './corpus.js';

const WORKSTREAMS = new Set(['W3', 'W4', 'W5', 'W6', 'W7', 'all']);
const VARIANTS = new Set(['baseline', 'variant']);

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
  if (!WORKSTREAMS.has(value)) {
    throw new Error(`Unsupported workstream: ${value}`);
  }
  return value as SearchQualityWorkstream | 'all';
}

function normalizeVariant(value: string | undefined): MeasurementVariant {
  if (!value) return 'baseline';
  if (!VARIANTS.has(value)) {
    throw new Error(`Unsupported measurement variant: ${value}`);
  }
  return value as MeasurementVariant;
}
