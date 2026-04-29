import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { closeDb, initDb } from '../../code_graph/lib/code-graph-db.js';
import { handleCodeGraphQuery } from '../../code_graph/handlers/query.js';
import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import { mapGraphReadinessToTelemetry } from '../../lib/search/graph-readiness-mapper.js';
import { buildSearchDecisionEnvelope } from '../../lib/search/search-decision-envelope.js';

describe('W10 degraded-readiness integration', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    closeDb();
    vi.restoreAllMocks();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('captures actual empty code_graph_query degraded readiness in SearchDecisionEnvelope', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'w10-cg-empty-'));
    tempDirs.push(tempDir);
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir);
    initDb(tempDir);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'src/example.ts',
    });
    const parsed = JSON.parse(result.content[0]?.text ?? '{}') as {
      status: string;
      data?: Record<string, unknown>;
    };

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.blockReason).toBe('full_scan_required');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
      retryAfter: 'scan_complete',
    });

    const envelope = buildSearchDecisionEnvelope({
      requestId: 'w10-empty',
      queryPlan: createEmptyQueryPlan({ selectedChannels: ['code_graph_query'] }),
      degradedReadiness: mapGraphReadinessToTelemetry(parsed.data ?? {}),
      timestamp: '2026-04-29T00:00:00.000Z',
    });

    expect(envelope.degradedReadiness).toMatchObject({
      freshness: 'empty',
      action: 'full_scan',
      canonicalReadiness: 'missing',
      trustState: 'absent',
      blocked: true,
      degraded: true,
      graphAnswersOmitted: true,
      requiredAction: 'code_graph_scan',
    });
  });
});
