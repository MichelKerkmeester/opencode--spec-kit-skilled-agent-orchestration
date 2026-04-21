import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { coerceSharedPayloadEnvelope } from '../lib/context/opencode-transport.js';
import {
  type SharedPayloadEnvelope,
  validateStructuralTrustPayload,
} from '../lib/context/shared-payload.js';

function makeSharedPayloadEnvelope(): SharedPayloadEnvelope {
  return {
    kind: 'resume',
    summary: 'resume summary',
    sections: [{
      key: 'resume-surface',
      title: 'Resume Surface',
      content: 'resume content',
      source: 'session',
    }],
    provenance: {
      producer: 'session_resume',
      sourceSurface: 'session_resume',
      trustState: 'live',
      generatedAt: '2026-04-16T00:00:00.000Z',
      lastUpdated: null,
      sourceRefs: ['session_resume'],
    },
  };
}

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

describe('shared payload envelope coercion', () => {
  it('rejects invalid kind unions', () => {
    const payload = {
      ...makeSharedPayloadEnvelope(),
      kind: 'startupish',
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'Invalid shared payload envelope kind "startupish"',
    );
  });

  it('rejects invalid producer unions', () => {
    const payload = {
      ...makeSharedPayloadEnvelope(),
      provenance: {
        ...makeSharedPayloadEnvelope().provenance,
        producer: 'session_cache',
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'Invalid shared payload envelope provenance.producer "session_cache"',
    );
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
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ready',
      })),
    }));

    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      queryOutline: vi.fn(() => [{
        name: 'handleOutline',
        kind: 'function',
        fqName: 'src/file.ts::handleOutline',
        startLine: 7,
        signature: '() => void',
        symbolId: 'sym-1',
      }]),
      getDb: vi.fn(),
      resolveSubjectFilePath: vi.fn((subject: string) => subject),
      queryEdgesFrom: vi.fn(() => []),
      queryEdgesTo: vi.fn(() => []),
      getLastDetectorProvenance: vi.fn(() => 'structured'),
      queryStartupHighlights: vi.fn(() => []),
    }));

    const { handleCodeGraphQuery } = await import('../code-graph/handlers/query.js');
    const result = await handleCodeGraphQuery({ operation: 'outline', subject: 'src/file.ts' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.parserProvenance).toBe('ast');
    expect(parsed.data.evidenceStatus).toBe('confirmed');
    expect(parsed.data.freshnessAuthority).toBe('live');
    expect(parsed.data.graphMetadata).toEqual({
      detectorProvenance: 'structured',
      detectorProvenanceSource: 'last-persisted-scan',
    });
    expect(parsed.data).not.toHaveProperty('trust');
    expect(parsed.data).not.toHaveProperty('confidence');
  });

  it('fails closed when query emission validation rejects the trust payload', async () => {
    vi.doMock('../code-graph/lib/ensure-ready.js', () => ({
      ensureCodeGraphReady: vi.fn(async () => ({
        freshness: 'fresh',
        action: 'none',
        inlineIndexPerformed: false,
        reason: 'ready',
      })),
    }));

    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      queryOutline: vi.fn(() => []),
      getDb: vi.fn(),
      resolveSubjectFilePath: vi.fn((subject: string) => subject),
      queryEdgesFrom: vi.fn(() => []),
      queryEdgesTo: vi.fn(() => []),
      getLastDetectorProvenance: vi.fn(() => 'structured'),
      queryStartupHighlights: vi.fn(() => []),
    }));

    const sharedPayload = await import('../lib/context/shared-payload.js');
    vi.spyOn(sharedPayload, 'attachStructuralTrustFields').mockImplementation(() => {
      throw new sharedPayload.StructuralTrustPayloadError(
        'code_graph_query outline payload rejects collapsed scalar fields: trust.',
      );
    });

    const { handleCodeGraphQuery } = await import('../code-graph/handlers/query.js');

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

  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
    vi.doMock('../handlers/memory-context.js', () => ({
      handleMemoryContext: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            data: { resumed: true },
          }),
        }],
      })),
    }));

    vi.doMock('../code-graph/lib/code-graph-db.js', () => ({
      getStats: vi.fn(() => ({
        lastScanTimestamp: '2026-04-08T12:00:00.000Z',
        totalNodes: 42,
        totalEdges: 17,
        totalFiles: 9,
      })),
    }));

    vi.doMock('../lib/utils/cocoindex-path.js', () => ({
      isCocoIndexAvailable: vi.fn(() => true),
    }));

    vi.doMock('../lib/session/context-metrics.js', () => ({
      recordBootstrapEvent: vi.fn(),
      recordMetricEvent: vi.fn(),
      computeQualityScore: vi.fn(() => ({ level: 'healthy' })),
    }));

    vi.doMock('../handlers/session-health.js', () => ({
      handleSessionHealth: vi.fn(async () => ({
        content: [{
          type: 'text',
          text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
        }],
      })),
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

    const { handleSessionResume } = await import('../handlers/session-resume.js');
    const resumeResult = await handleSessionResume({ specFolder: 'specs/026-root' });
    const parsedResume = JSON.parse(resumeResult.content[0].text);
    const resumeStructuralSection = parsedResume.data.payloadContract.sections.find(
      (section: { key: string }) => section.key === 'structural-context',
    );

    expect(resumeStructuralSection?.structuralTrust).toEqual({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });

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
