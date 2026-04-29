import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import { buildSearchDecisionEnvelope } from '../../lib/search/search-decision-envelope.js';
import type { ShadowDeltaRecord } from '../../skill_advisor/lib/shadow/shadow-sink.js';
import {
  type SearchQualityCase,
  type SearchQualityChannel,
  type SearchQualityCorpus,
} from './corpus.js';
import {
  runSearchQualityHarness,
  type SearchQualityCandidate,
  type SearchQualityChannelOutput,
  type SearchQualityRunners,
} from './harness.js';

const TELEMETRY_CORPUS: SearchQualityCorpus = {
  version: 'harness-telemetry-export-test-v1',
  cases: [
    {
      id: 'telemetry-memory',
      query: 'memory telemetry export case',
      source: 'paraphrase',
      expectedRelevantIds: ['telemetry-memory-hit'],
      expectedChannels: ['memory_search'],
      citationExpectation: {
        requiredIds: ['telemetry-memory-hit'],
      },
      notes: 'Inline harness telemetry fixture for memory search.',
    },
    {
      id: 'telemetry-code-graph',
      query: 'code graph telemetry export case',
      source: 'degraded-readiness',
      expectedRelevantIds: ['telemetry-code-graph-hit'],
      expectedChannels: ['code_graph_query'],
      citationExpectation: {
        requiredIds: ['telemetry-code-graph-hit'],
      },
      notes: 'Inline harness telemetry fixture for code graph search.',
    },
  ],
};

describe('search-quality harness telemetry export', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('preserves runner telemetry on channel captures and case results', async () => {
    const run = await runSearchQualityHarness(TELEMETRY_CORPUS, createTelemetryRunners(), {
      runId: 'telemetry-preservation',
    });

    expect(run.cases).toHaveLength(2);

    for (const result of run.cases) {
      const capture = result.channelCaptures[0];

      expect(capture?.telemetry?.envelope?.requestId).toBe(`envelope-${result.caseId}-${capture.channel}`);
      expect(capture?.telemetry?.auditRows?.[0]?.requestId).toBe(`audit-${result.caseId}-${capture.channel}`);
      expect(capture?.telemetry?.shadowRows?.[0]).toMatchObject({
        prompt: result.query,
        recommendation: capture.channel,
      });
      expect(result.telemetry?.envelopes).toHaveLength(1);
      expect(result.telemetry?.auditRows).toHaveLength(1);
      expect(result.telemetry?.shadowRows).toHaveLength(1);
    }
  });

  it('writes envelope, audit, and shadow rows to sibling JSONL files', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'harness-telemetry-export-'));
    tempDirs.push(tempDir);
    const basePath = join(tempDir, 'telemetry');

    await runSearchQualityHarness(TELEMETRY_CORPUS, createTelemetryRunners(), {
      runId: 'telemetry-export',
      telemetryExportPath: basePath,
    });

    const envelopeRows = readJsonl(`${basePath}.envelopes.jsonl`);
    const auditRows = readJsonl(`${basePath}.audit.jsonl`);
    const shadowRows = readJsonl(`${basePath}.shadow.jsonl`);

    expect(envelopeRows).toHaveLength(2);
    expect(auditRows).toHaveLength(2);
    expect(shadowRows).toHaveLength(2);
    expect(envelopeRows[0]).toMatchObject({
      envelopeVersion: 1,
      requestId: 'envelope-telemetry-memory-memory_search',
    });
    expect(auditRows[1]).toMatchObject({
      envelopeVersion: 1,
      requestId: 'audit-telemetry-code-graph-code_graph_query',
    });
    expect(shadowRows[0]).toMatchObject({
      recommendation: 'memory_search',
      liveScore: 0.7,
      shadowScore: 0.8,
    });
  });

  it('does not create JSONL files when telemetry export is omitted', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'harness-telemetry-no-export-'));
    tempDirs.push(tempDir);
    const basePath = join(tempDir, 'telemetry');

    const run = await runSearchQualityHarness(TELEMETRY_CORPUS, createTelemetryRunners(), {
      runId: 'telemetry-no-export',
    });

    expect(run.cases[0]?.telemetry?.envelopes).toHaveLength(1);
    expect(existsSync(`${basePath}.envelopes.jsonl`)).toBe(false);
    expect(existsSync(`${basePath}.audit.jsonl`)).toBe(false);
    expect(existsSync(`${basePath}.shadow.jsonl`)).toBe(false);
  });
});

function createTelemetryRunners(): SearchQualityRunners {
  return {
    memory_search: (testCase) => telemetryOutput(testCase, 'memory_search'),
    code_graph_query: (testCase) => telemetryOutput(testCase, 'code_graph_query'),
  };
}

function telemetryOutput(
  testCase: SearchQualityCase,
  channel: SearchQualityChannel,
): SearchQualityChannelOutput {
  const candidateId = `${testCase.id}-hit`;
  const envelope = buildSearchDecisionEnvelope({
    requestId: `envelope-${testCase.id}-${channel}`,
    queryPlan: createEmptyQueryPlan(),
    timestamp: '2026-04-29T09:00:00.000Z',
    latencyMs: 3,
  });
  const auditRow = buildSearchDecisionEnvelope({
    requestId: `audit-${testCase.id}-${channel}`,
    queryPlan: createEmptyQueryPlan(),
    timestamp: '2026-04-29T09:00:01.000Z',
    latencyMs: 4,
  });
  const shadowRow: ShadowDeltaRecord = {
    prompt: testCase.query,
    recommendation: channel,
    liveScore: 0.7,
    shadowScore: 0.8,
    delta: 0.1,
    dominantLane: 'semantic_shadow',
    timestamp: '2026-04-29T09:00:02.000Z',
  };

  return {
    candidates: [candidate(candidateId, `${testCase.id} candidate`, channel)],
    citationIds: [candidateId],
    latencyMs: 1,
    telemetry: {
      envelope,
      auditRows: [auditRow],
      shadowRows: [shadowRow],
    },
  };
}

function candidate(
  id: string,
  title: string,
  channel: SearchQualityChannel,
): SearchQualityCandidate {
  return {
    id,
    title,
    channel,
    rank: 1,
    score: 1,
    citationIds: [id],
  };
}

function readJsonl(path: string): unknown[] {
  return readFileSync(path, 'utf8')
    .trim()
    .split('\n')
    .map((line) => JSON.parse(line) as unknown);
}
