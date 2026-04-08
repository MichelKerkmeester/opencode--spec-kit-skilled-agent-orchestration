import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSharedPayloadEnvelope,
  validateStructuralTrustPayload,
} from '../lib/context/shared-payload.js';

describe('graph payload validator contract', () => {
  it('rejects collapsed trust payloads', () => {
    expect(() => validateStructuralTrustPayload({
      trust: 'high',
    }, { label: 'graph payload' })).toThrow('collapsed scalar fields');
  });

  it('rejects missing trust-axis fields', () => {
    expect(() => validateStructuralTrustPayload({
      parserProvenance: 'ast',
      freshnessAuthority: 'live',
    } as never, { label: 'graph payload' })).toThrow(
      'Missing: evidenceStatus',
    );
  });

  it('accepts well-formed payloads with separate trust axes', () => {
    expect(validateStructuralTrustPayload({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    })).toEqual({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
  });
});

describe('code graph query trust emission', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/context/shared-payload.js');
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/context/shared-payload.js');
  });

  it('emits separate trust axes on code-graph payloads', async () => {
    vi.doMock('../lib/code-graph/ensure-ready.js', () => ({
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ready',
      })),
    }));

    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      queryOutline: vi.fn(() => [{
        name: 'handleOutline',
        kind: 'function',
        fqName: 'src/file.ts::handleOutline',
        startLine: 7,
        signature: '() => void',
        symbolId: 'sym-1',
      }]),
      getDb: vi.fn(),
      queryEdgesFrom: vi.fn(() => []),
      queryEdgesTo: vi.fn(() => []),
    }));

    const { handleCodeGraphQuery } = await import('../handlers/code-graph/query.js');
    const result = await handleCodeGraphQuery({ operation: 'outline', subject: 'src/file.ts' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.parserProvenance).toBe('ast');
    expect(parsed.data.evidenceStatus).toBe('confirmed');
    expect(parsed.data.freshnessAuthority).toBe('live');
    expect(parsed.data).not.toHaveProperty('trust');
    expect(parsed.data).not.toHaveProperty('confidence');
  });

  it('fails closed when query emission validation rejects the trust payload', async () => {
    vi.doMock('../lib/code-graph/ensure-ready.js', () => ({
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ready',
      })),
    }));

    vi.doMock('../lib/code-graph/code-graph-db.js', () => ({
      queryOutline: vi.fn(() => []),
      getDb: vi.fn(),
      queryEdgesFrom: vi.fn(() => []),
      queryEdgesTo: vi.fn(() => []),
    }));

    vi.doMock('../lib/context/shared-payload.js', async () => {
      const actual = await vi.importActual<typeof import('../lib/context/shared-payload.js')>(
        '../lib/context/shared-payload.js',
      );

      return {
        ...actual,
        attachStructuralTrustFields: vi.fn(() => {
          throw new actual.StructuralTrustPayloadError(
            'code_graph_query outline payload rejects collapsed scalar fields: trust.',
          );
        }),
      };
    });

    const { handleCodeGraphQuery } = await import('../handlers/code-graph/query.js');

    await expect(handleCodeGraphQuery({
      operation: 'outline',
      subject: 'src/file.ts',
    })).rejects.toThrow('collapsed scalar fields');
  });
});

describe('session bootstrap trust preservation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/context/shared-payload.js');
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doUnmock('../lib/context/shared-payload.js');
  });

  it('preserves separate trust axes through shared payload to bootstrap output', async () => {
    const resumePayload = createSharedPayloadEnvelope({
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
    });

    vi.doMock('../handlers/session-resume.js', () => ({
      handleSessionResume: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            data: {
              memory: { resumed: true },
              payloadContract: resumePayload,
              hints: ['resume ok'],
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
    const structuralSection = parsed.data.payloadContract.sections.find(
      (section: { key: string }) => section.key === 'structural-context',
    );

    expect(parsed.data.resume).toMatchObject({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
    expect(parsed.data.structuralContext).toMatchObject({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
    expect(structuralSection?.structuralTrust).toEqual({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
  });
});
