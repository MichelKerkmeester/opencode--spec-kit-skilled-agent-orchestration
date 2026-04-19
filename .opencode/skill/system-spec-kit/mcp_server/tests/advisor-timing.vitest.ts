import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildSkillAdvisorBrief,
  clearAdvisorBriefCacheForTests,
} from '../lib/skill-advisor/skill-advisor-brief.js';
import type { AdvisorFreshnessResult } from '../lib/skill-advisor/freshness.js';
import { getAdvisorFreshness } from '../lib/skill-advisor/freshness.js';
import { runAdvisorSubprocess } from '../lib/skill-advisor/subprocess.js';

vi.mock('../lib/skill-advisor/freshness.js', () => ({
  getAdvisorFreshness: vi.fn(),
}));

vi.mock('../lib/skill-advisor/subprocess.js', () => ({
  runAdvisorSubprocess: vi.fn(),
}));

interface LaneStats {
  readonly p50: number;
  readonly p95: number;
  readonly p99: number;
}

const workspaceRoot = '/tmp/advisor-timing';
const options = {
  workspaceRoot,
  runtime: 'codex' as const,
};

function freshness(sourceSignature = 'sig-live'): AdvisorFreshnessResult {
  return {
    state: 'live',
    generation: 1,
    sourceSignature,
    skillFingerprints: new Map([
      ['sk-code-opencode', { skillMdMtime: 1, skillMdSize: 10, graphMetaMtime: 1 }],
    ]),
    fallbackMode: 'sqlite',
    probedAt: '2026-04-19T10:00:00.000Z',
    diagnostics: null,
  };
}

function mockAdvisor(): void {
  vi.mocked(runAdvisorSubprocess).mockResolvedValue({
    ok: true,
    recommendations: [{
      skill: 'sk-code-opencode',
      confidence: 0.91,
      uncertainty: 0.23,
      passes_threshold: true,
    }],
    errorCode: null,
    exitCode: 0,
    signal: null,
    stderr: null,
    durationMs: 5,
    retriesAttempted: 0,
  });
}

function percentile(values: readonly number[], p: number): number {
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return Number(sorted[Math.max(0, index)]?.toFixed(3) ?? 0);
}

function stats(values: readonly number[]): LaneStats {
  return {
    p50: percentile(values, 50),
    p95: percentile(values, 95),
    p99: percentile(values, 99),
  };
}

beforeEach(() => {
  clearAdvisorBriefCacheForTests();
  vi.mocked(getAdvisorFreshness).mockReset();
  vi.mocked(runAdvisorSubprocess).mockReset();
  vi.mocked(getAdvisorFreshness).mockReturnValue(freshness());
  mockAdvisor();
});

describe('advisor timing harness', () => {
  it('records four lanes and gates only cache-hit p95', async () => {
    const coldDurations: number[] = [];
    for (let index = 0; index < 50; index += 1) {
      clearAdvisorBriefCacheForTests();
      const result = await buildSkillAdvisorBrief(`implement cold feature ${index}`, options);
      coldDurations.push(result.metrics.durationMs);
    }

    clearAdvisorBriefCacheForTests();
    const warmDurations: number[] = [];
    for (let index = 0; index < 50; index += 1) {
      const result = await buildSkillAdvisorBrief(`implement warm feature ${index}`, options);
      warmDurations.push(result.metrics.durationMs);
    }

    clearAdvisorBriefCacheForTests();
    await buildSkillAdvisorBrief('implement cache hit feature', options);
    const cacheHitDurations: number[] = [];
    for (let index = 0; index < 50; index += 1) {
      const result = await buildSkillAdvisorBrief('implement cache hit feature', options);
      expect(result.metrics.cacheHit).toBe(true);
      cacheHitDurations.push(result.metrics.durationMs);
    }

    clearAdvisorBriefCacheForTests();
    const cacheMissDurations: number[] = [];
    for (let index = 0; index < 50; index += 1) {
      vi.mocked(getAdvisorFreshness).mockReturnValue(freshness(`sig-miss-${index}`));
      const result = await buildSkillAdvisorBrief('implement invalidated cache feature', options);
      expect(result.metrics.cacheHit).toBe(false);
      cacheMissDurations.push(result.metrics.durationMs);
    }

    const laneStats = {
      cold: stats(coldDurations),
      warm: stats(warmDurations),
      cacheHit: stats(cacheHitDurations),
      cacheMiss: stats(cacheMissDurations),
    };
    console.info('advisor-timing-results', JSON.stringify(laneStats));

    expect(laneStats.cacheHit.p95).toBeLessThanOrEqual(50);
  });

  it('meets the corrected 30-turn replay cache hit-rate gate', async () => {
    clearAdvisorBriefCacheForTests();
    vi.mocked(getAdvisorFreshness).mockReturnValue(freshness('stable-replay-sig'));
    const uniquePrompts = Array.from({ length: 10 }, (_, index) => `implement replay feature ${index}`);
    const replay = [
      ...uniquePrompts,
      ...uniquePrompts,
      ...uniquePrompts,
    ];
    let hits = 0;

    for (const prompt of replay) {
      const result = await buildSkillAdvisorBrief(prompt, options);
      if (result.metrics.cacheHit) {
        hits += 1;
      }
    }

    const hitRate = hits / replay.length;
    console.info('advisor-timing-cache-hit-rate', JSON.stringify({ hits, total: replay.length, hitRate }));

    expect(hits).toBe(20);
    expect(hitRate).toBeGreaterThanOrEqual(0.6);
  });
});
