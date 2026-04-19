import { describe, expect, it } from 'vitest';
import {
  ADVISOR_ERROR_CODE_VALUES,
  ADVISOR_HOOK_FRESHNESS_VALUES,
  ADVISOR_HOOK_STATUS_VALUES,
  ADVISOR_RUNTIME_VALUES,
  buildAdvisorHookHealthSection,
  createAdvisorHookDiagnosticRecord,
  getAdvisorHookAlertThresholds,
  getAdvisorHookMetricDefinitions,
  serializeAdvisorHookDiagnosticRecord,
  validateAdvisorHookDiagnosticRecord,
} from '../lib/skill-advisor/metrics.js';

describe('advisor observability contract', () => {
  it('defines the speckit_advisor_hook metric namespace and closed labels', () => {
    expect(getAdvisorHookMetricDefinitions()).toEqual([
      {
        name: 'speckit_advisor_hook_duration_ms',
        type: 'histogram',
        labels: ['runtime', 'status', 'freshness', 'cacheHit'],
      },
      {
        name: 'speckit_advisor_hook_invocations_total',
        type: 'counter',
        labels: ['runtime', 'status'],
      },
      {
        name: 'speckit_advisor_hook_cache_hits_total',
        type: 'counter',
        labels: ['runtime'],
      },
      {
        name: 'speckit_advisor_hook_cache_misses_total',
        type: 'counter',
        labels: ['runtime'],
      },
      {
        name: 'speckit_advisor_hook_fail_open_total',
        type: 'counter',
        labels: ['runtime', 'errorCode'],
      },
      {
        name: 'speckit_advisor_hook_freshness_state',
        type: 'gauge',
        labels: ['runtime', 'state'],
      },
    ]);
    expect(ADVISOR_RUNTIME_VALUES).toEqual(['claude', 'gemini', 'copilot', 'codex']);
    expect(ADVISOR_HOOK_STATUS_VALUES).toEqual(['ok', 'skipped', 'degraded', 'fail_open']);
    expect(ADVISOR_HOOK_FRESHNESS_VALUES).toEqual(['live', 'stale', 'absent', 'unavailable']);
    expect(ADVISOR_ERROR_CODE_VALUES).toEqual(expect.arrayContaining([
      'TIMEOUT',
      'SCRIPT_MISSING',
      'SQLITE_BUSY',
      'PARSE_FAIL',
      'SIGNAL_KILLED',
      'GENERATION_COUNTER_CORRUPT',
    ]));
  });

  it('serializes AdvisorHookDiagnosticRecord JSONL without forbidden prompt-bearing fields', () => {
    const record = createAdvisorHookDiagnosticRecord({
      timestamp: '2026-04-19T10:00:00.000Z',
      runtime: 'codex',
      status: 'ok',
      freshness: 'live',
      durationMs: 12.4,
      cacheHit: true,
      skillLabel: 'sk-code-opencode',
      generation: 42,
    });
    const serialized = serializeAdvisorHookDiagnosticRecord(record);
    const parsed = JSON.parse(serialized) as Record<string, unknown>;

    expect(validateAdvisorHookDiagnosticRecord(parsed)).toBe(true);
    expect(serialized).not.toMatch(/prompt|promptFingerprint|promptExcerpt|stdout|stderr/);
    expect(Object.keys(parsed)).not.toEqual(expect.arrayContaining([
      'prompt',
      'promptFingerprint',
      'promptExcerpt',
      'stdout',
      'stderr',
    ]));
  });

  it('rejects diagnostic records with forbidden fields', () => {
    const record = {
      timestamp: '2026-04-19T10:00:00.000Z',
      runtime: 'codex',
      status: 'ok',
      freshness: 'live',
      durationMs: 12,
      cacheHit: true,
      prompt: 'do not serialize me',
    };

    expect(validateAdvisorHookDiagnosticRecord(record)).toBe(false);
  });

  it('builds advisor-hook-health with last-N records, rolling cache hit rate, and p95', () => {
    const records = Array.from({ length: 35 }, (_, index) => createAdvisorHookDiagnosticRecord({
      timestamp: `2026-04-19T10:00:${String(index).padStart(2, '0')}.000Z`,
      runtime: 'codex',
      status: index === 34 ? 'fail_open' : 'ok',
      freshness: index % 2 === 0 ? 'live' : 'stale',
      durationMs: index,
      cacheHit: index % 2 === 0,
      errorCode: index === 34 ? 'TIMEOUT' : undefined,
    }));
    const health = buildAdvisorHookHealthSection(records);

    expect(health.key).toBe('advisor-hook-health');
    expect(health.lastInvocations).toHaveLength(30);
    expect(health.rollingCacheHitRate).toBeGreaterThan(0);
    expect(health.rollingP95Ms).toBeGreaterThan(0);
    expect(health.rollingFailOpenRate).toBeCloseTo(1 / 30, 4);
  });

  it('keeps alert thresholds configurable through env', () => {
    const previous = process.env.SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS;
    process.env.SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS = '88';

    try {
      expect(getAdvisorHookAlertThresholds().cacheHitP95WarnMs).toBe(88);
    } finally {
      if (previous === undefined) {
        delete process.env.SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS;
      } else {
        process.env.SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS = previous;
      }
    }
  });
});
