import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SHARED_PAYLOAD_CERTAINTY_VALUES,
  canPublishMultiplier,
  createPublicationMethodologyMetadata,
  createPublishableMetricField,
} from '../lib/context/shared-payload.js';

const VALID_METHODOLOGY = {
  schemaVersion: 'measurement-contract/v1',
  methodologyStatus: 'provisional' as const,
  provenance: ['session_resume'],
};

describe('shared payload certainty contract', () => {
  it('supports every certainty status through the publishable metric helper', () => {
    const fields = SHARED_PAYLOAD_CERTAINTY_VALUES.map((certainty) => createPublishableMetricField({
      key: `metric-${certainty}`,
      value: 1,
      certainty,
      authority: certainty === 'exact' ? 'provider_counted' : certainty,
      methodology: VALID_METHODOLOGY,
    }));

    expect(fields.map((field) => field.certainty)).toEqual([...SHARED_PAYLOAD_CERTAINTY_VALUES]);
  });

  it('blocks multiplier publication without provider-counted authority', () => {
    const canPublish = canPublishMultiplier({
      promptTokens: { certainty: 'exact', authority: 'provider_counted' },
      completionTokens: { certainty: 'exact', authority: 'provider_counted' },
      cacheReadTokens: { certainty: 'estimated', authority: 'estimated' },
      cacheWriteTokens: { certainty: 'unknown', authority: 'unknown' },
    });

    expect(canPublish).toBe(false);
  });

  it('requires methodology metadata for publication-grade rows', () => {
    expect(() => createPublicationMethodologyMetadata({
      schemaVersion: '',
      methodologyStatus: 'provisional',
      provenance: [],
    })).toThrow('schemaVersion');

    expect(() => createPublishableMetricField({
      key: 'promptTokens',
      value: 128,
      certainty: 'exact',
      authority: 'provider_counted',
      methodology: {
        schemaVersion: 'measurement-contract/v1',
        methodologyStatus: 'published',
        provenance: ['session_resume', 'session_resume'],
      },
    })).not.toThrow();
  });
});

describe('session_resume certainty contract', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('surfaces certainty fields in the shared resume payload', async () => {
    vi.doMock('../handlers/memory-context.js', () => ({
      handleMemoryContext: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({ status: 'ok', data: { memories: ['active packet'] } }),
        }],
      })),
    }));

    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      getStats: vi.fn(() => ({
        totalFiles: 12,
        totalNodes: 44,
        totalEdges: 21,
        lastScanTimestamp: '2026-04-08T12:00:00.000Z',
        dbFileSize: 2048,
        schemaVersion: 1,
        nodesByKind: {},
        edgesByType: {},
        parseHealthSummary: {},
      })),
    }));

    vi.doMock('../lib/code-graph/ensure-ready.js', () => ({
      getGraphFreshness: vi.fn(() => 'stale'),
    }));

    vi.doMock('../lib/utils/cocoindex-path.js', () => ({
      isCocoIndexAvailable: vi.fn(() => true),
    }));

    vi.doMock('../lib/session/context-metrics.js', () => ({
      computeQualityScore: vi.fn(() => ({
        level: 'healthy',
        score: 1,
        factors: { recency: 1, recovery: 1, graphFreshness: 1, continuity: 1 },
      })),
      recordMetricEvent: vi.fn(),
      recordBootstrapEvent: vi.fn(),
    }));

    vi.doMock('../lib/session/session-snapshot.js', () => ({
      buildStructuralBootstrapContract: vi.fn(() => ({
        status: 'ready',
        summary: 'Structural context ready',
        recommendedAction: 'Use code_graph_query for structural lookups.',
        sourceSurface: 'session_resume',
        provenance: { lastUpdated: '2026-04-08T12:00:00.000Z' },
      })),
    }));

    const { handleSessionResume } = await import('../handlers/session-resume.js');
    const result = await handleSessionResume({});
    const parsed = JSON.parse(result.content[0].text);

    const sections = Object.fromEntries(
      parsed.data.payloadContract.sections.map((section: { key: string; certainty: string }) => [
        section.key,
        section.certainty,
      ]),
    );
    const structuralSection = parsed.data.payloadContract.sections.find(
      (section: { key: string }) => section.key === 'structural-context',
    );

    expect(parsed.data.payloadContract.summary).toContain('memory=defaulted');
    expect(parsed.data.payloadContract.summary).toContain('graph=exact');
    expect(parsed.data.payloadContract.summary).toContain('cocoindex=exact');
    expect(parsed.data.payloadContract.summary).toContain('structural=exact');
    expect(sections).toMatchObject({
      'memory-resume': 'defaulted',
      'code-graph-status': 'exact',
      'cocoindex-status': 'exact',
      'structural-context': 'exact',
    });
  });
});

describe('session_bootstrap certainty contract', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('surfaces certainty fields in the shared bootstrap payload', async () => {
    vi.doMock('../handlers/session-resume.js', () => ({
      handleSessionResume: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            data: {
              memory: { resumed: true },
              hints: ['resume ok'],
              payloadContract: {
                kind: 'resume',
                summary: 'Resume payload: structural=exact',
                sections: [{
                  key: 'structural-context',
                  title: 'Structural Context',
                  content: 'Code graph ready',
                  source: 'code-graph',
                  certainty: 'exact',
                  structuralTrust: {
                    parserProvenance: 'ast',
                    evidenceStatus: 'confirmed',
                    freshnessAuthority: 'live',
                  },
                }],
                provenance: {
                  producer: 'session_resume',
                  sourceSurface: 'session_resume',
                  trustState: 'live',
                  generatedAt: '2026-04-08T12:00:00.000Z',
                  lastUpdated: '2026-04-08T12:00:00.000Z',
                  sourceRefs: ['session-snapshot'],
                },
              },
            },
          }),
        }],
      })),
    }));

    vi.doMock('../handlers/session-health.js', () => ({
      handleSessionHealth: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
        }],
      })),
    }));

    vi.doMock('../lib/session/context-metrics.js', () => ({
      recordBootstrapEvent: vi.fn(),
    }));

    vi.doMock('../lib/session/session-snapshot.js', () => ({
      buildStructuralBootstrapContract: vi.fn(() => ({
        status: 'ready',
        summary: 'Structural context ready',
        recommendedAction: 'Use code_graph_query for structural lookups.',
        sourceSurface: 'session_bootstrap',
        provenance: { lastUpdated: '2026-04-08T12:00:00.000Z' },
      })),
    }));

    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
    const result = await handleSessionBootstrap({ specFolder: 'specs/026-root' });
    const parsed = JSON.parse(result.content[0].text);

    const sections = Object.fromEntries(
      parsed.data.payloadContract.sections.map((section: { key: string; certainty: string }) => [
        section.key,
        section.certainty,
      ]),
    );
    const structuralSection = parsed.data.payloadContract.sections.find(
      (section: { key: string }) => section.key === 'structural-context',
    );

    expect(parsed.data.payloadContract.summary).toContain('resume=estimated');
    expect(parsed.data.payloadContract.summary).toContain('health=estimated');
    expect(parsed.data.payloadContract.summary).toContain('structural=exact');
    expect(parsed.data.payloadContract.summary).toContain('nextActions=defaulted');
    expect(sections).toMatchObject({
      'resume-surface': 'estimated',
      'health-surface': 'estimated',
      'structural-context': 'exact',
      'next-actions': 'defaulted',
    });
    expect(structuralSection?.structuralTrust).toEqual({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
  });
});
