// ───────────────────────────────────────────────────────────────
// MODULE: W13 Decision Audit Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises search decision JSONL audit rows and SLA metric computation.

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import { buildSearchDecisionEnvelope } from '../../lib/search/search-decision-envelope.js';
import {
  computeSearchDecisionSlaMetrics,
  recordSearchDecision,
} from '../../lib/search/decision-audit.js';

describe('W13 decision audit', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('writes one JSONL audit row per envelope', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'w13-audit-'));
    tempDirs.push(tempDir);
    const auditPath = join(tempDir, 'search-decisions.jsonl');
    const envelope = buildSearchDecisionEnvelope({
      requestId: 'audit-1',
      tenantId: 'tenant-a',
      queryPlan: createEmptyQueryPlan(),
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 42,
    });

    const result = recordSearchDecision(envelope, { auditPath });
    const lines = readFileSync(auditPath, 'utf8').trim().split('\n');

    expect(result.written).toBe(true);
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0] ?? '{}')).toMatchObject({
      requestId: 'audit-1',
      tenantId: 'tenant-a',
      latencyMs: 42,
    });
  });

  it('computes SLA metrics from decision envelopes', () => {
    const envelopes = [
      buildSearchDecisionEnvelope({
        requestId: 'a',
        queryPlan: createEmptyQueryPlan(),
        rerankGateDecision: { shouldRerank: true, reason: 'eligible:complex-query', triggers: ['complex-query'] },
        latencyMs: 10,
      }),
      buildSearchDecisionEnvelope({
        requestId: 'b',
        queryPlan: createEmptyQueryPlan(),
        rerankGateDecision: { shouldRerank: false, reason: 'none', triggers: [] },
        latencyMs: 20,
      }),
    ];

    const metrics = computeSearchDecisionSlaMetrics(envelopes);

    expect(metrics.count).toBe(2);
    expect(metrics.averageLatencyMs).toBe(15);
    expect(metrics.p95LatencyMs).toBe(20);
    expect(metrics.rerankTriggerRate).toBe(0.5);
  });
});
