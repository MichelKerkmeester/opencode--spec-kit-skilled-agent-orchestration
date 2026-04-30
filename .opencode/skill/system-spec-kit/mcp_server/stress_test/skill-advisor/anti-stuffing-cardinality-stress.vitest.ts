import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  applyAntiStuffing,
  DEFAULT_MAX_TRIGGER_PHRASES,
} from '../../skill_advisor/lib/derived/anti-stuffing.js';

describe('sa-012 — Anti-stuffing cardinality caps', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'stress-sa-012-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('caps adversarial trigger cardinality from 500 generated phrases', async () => {
    const triggerPhrases = Array.from(
      { length: 500 },
      (_, index) => `derived routing phrase ${index}`,
    );

    const result = applyAntiStuffing(triggerPhrases, []);

    expect(result.rejected).toBe(false);
    expect(result.triggerPhrases.length).toBeLessThanOrEqual(DEFAULT_MAX_TRIGGER_PHRASES);
    expect(result.triggerPhrases).toHaveLength(DEFAULT_MAX_TRIGGER_PHRASES);
    expect(result.diagnostics).toContain(`TRIGGER_CAP_APPLIED:${DEFAULT_MAX_TRIGGER_PHRASES}`);
  });

  it('demotes high repetition density instead of promoting stuffed evidence', async () => {
    const triggerPhrases = [
      'alpha routing',
      'alpha trigger',
      'alpha skill',
      'alpha domain',
      'alpha workflow',
    ];

    const result = applyAntiStuffing(triggerPhrases, [], {
      repetitionThreshold: 0.3,
    });

    expect(result.rejected).toBe(false);
    expect(result.triggerPhrases).toEqual(triggerPhrases);
    expect(result.demotion).toBeGreaterThan(0);
    expect(result.demotion).toBeLessThan(1);
    expect(result.diagnostics.some((item) => item.startsWith('REPETITION_DENSITY_DEMOTED:'))).toBe(true);
  });
});
