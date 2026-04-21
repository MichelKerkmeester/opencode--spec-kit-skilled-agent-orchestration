import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../handlers/session-resume.js', () => ({
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
            summary: 'resume payload',
            sections: [
              {
                key: 'structural-context',
                title: 'Structural Context',
                content: 'resume structural context',
                source: 'code-graph',
                certainty: 'exact',
                structuralTrust: {
                  parserProvenance: 'ast',
                  evidenceStatus: 'confirmed',
                  freshnessAuthority: 'live',
                },
              },
            ],
            provenance: {
              producer: 'session_resume',
              sourceSurface: 'session_resume',
              // M8 / T-SHP-01: trustState values live on the canonical
              // SharedPayloadTrustState vocabulary. The previous 'ready'
              // fabrication is rejected by the transport coercer.
              trustState: 'live',
              generatedAt: '2026-04-10T00:00:00.000Z',
              lastUpdated: null,
              sourceRefs: ['session-snapshot'],
            },
          },
        },
      }),
    }],
  })),
}));

vi.mock('../handlers/session-health.js', () => ({
  handleSessionHealth: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
    }],
  })),
}));

vi.mock('../handlers/skill-graph/status.js', () => ({
  handleSkillGraphStatus: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'ok',
        data: {
          totalSkills: 6,
          totalEdges: 9,
          lastIndexedAt: '2026-04-21T08:00:00.000Z',
          families: [
            { name: 'sk-code', count: 2 },
            { name: 'system', count: 4 },
          ],
          categories: [{ name: 'workflow', count: 6 }],
          staleness: {
            trackedSkills: 6,
            freshSourceFiles: 6,
            changedSourceFiles: 0,
            missingSourceFiles: 0,
            staleSkillIds: [],
          },
          validation: {
            brokenEdgeCount: 0,
            weightBandViolations: 0,
            unsupportedSchemaVersionCount: 0,
            isHealthy: true,
          },
          dbStatus: 'ready',
        },
      }),
    }],
  })),
}));

vi.mock('../handlers/skill-graph/query.js', () => ({
  handleSkillGraphQuery: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        status: 'ok',
        data: {
          queryType: 'hub_skills',
          minInbound: 2,
          skills: [
            {
              node: {
                id: 'system-spec-kit',
                family: 'system',
                category: 'documentation',
                sourcePath: '/private/source/path',
                contentHash: 'secret-hash',
              },
              inboundCount: 4,
            },
          ],
        },
      }),
    }],
  })),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  recordBootstrapEvent: vi.fn(),
}));

vi.mock('../lib/session/session-snapshot.js', () => ({
  buildStructuralBootstrapContract: vi.fn(() => ({
    status: 'ready',
    summary: 'Code graph: 42 files, 1200 nodes, 800 edges (fresh)',
    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
    sourceSurface: 'session_bootstrap',
  })),
}));

import { handleSessionBootstrap } from '../handlers/session-bootstrap.js';
import { handleSessionResume } from '../handlers/session-resume.js';
import { handleSessionHealth } from '../handlers/session-health.js';
import { handleSkillGraphStatus } from '../handlers/skill-graph/status.js';
import { handleSkillGraphQuery } from '../handlers/skill-graph/query.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';

describe('session-bootstrap handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
    const result = await handleSessionBootstrap({ specFolder: 'specs/024-root' });
    const parsed = JSON.parse(result.content[0].text);

    expect(handleSessionResume).toHaveBeenCalledWith({ specFolder: 'specs/024-root' });
    expect(handleSessionHealth).toHaveBeenCalledTimes(1);
    expect(parsed.data.resume.memory).toEqual({ resumed: true });
    expect(parsed.data.health.state).toBe('ok');
    expect(parsed.data.payloadContract.kind).toBe('bootstrap');
    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
    expect(parsed.data.skillGraphTopology).toMatchObject({
      status: 'ready',
      totalSkills: 6,
      totalEdges: 9,
      familyDistribution: [
        { name: 'sk-code', count: 2 },
        { name: 'system', count: 4 },
      ],
      hubSkills: [
        {
          skillId: 'system-spec-kit',
          family: 'system',
          category: 'documentation',
          inboundCount: 4,
        },
      ],
      lastIndexedAt: '2026-04-21T08:00:00.000Z',
    });
    expect(JSON.stringify(parsed.data.skillGraphTopology)).not.toContain('/private/source/path');
    expect(JSON.stringify(parsed.data.skillGraphTopology)).not.toContain('secret-hash');
    expect(handleSkillGraphStatus).toHaveBeenCalledTimes(1);
    expect(handleSkillGraphQuery).toHaveBeenCalledWith({
      queryType: 'hub_skills',
      minInbound: 2,
      limit: 5,
    });
    expect(parsed.data.opencodeTransport.systemTransform.title).toContain('Startup Digest');
    expect(parsed.data.graphOps.previewPolicy.mode).toBe('metadata-only');
    expect(result.structuredContent).toMatchObject({
      resume: expect.any(Object),
      health: expect.any(Object),
      hints: expect.any(Array),
      nextActions: expect.any(Array),
    });
    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
    expect(parsed.data.payloadContract.sections).toEqual(expect.arrayContaining([
      expect.objectContaining({
        key: 'skill-graph-topology',
        source: 'skill-graph',
        content: expect.stringContaining('Skill graph: 6 skills, 9 edges'),
      }),
    ]));
    expect(parsed.data.nextActions).toEqual(expect.arrayContaining([
      'Structural context available. Use code_graph_query for structural lookups.',
      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
      'Resume recovery follows `handover.md` -> `_memory.continuity` -> spec docs.',
    ]));
    expect(recordBootstrapEvent).toHaveBeenCalledWith('tool', expect.any(Number), 'full');
  });

  it('adds a structural hint when the bootstrap contract is stale', async () => {
    vi.mocked(buildStructuralBootstrapContract).mockReturnValueOnce({
      status: 'stale',
      summary: 'Code graph is stale',
      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
      sourceSurface: 'session_bootstrap',
    } as never);

    const result = await handleSessionBootstrap({});
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.structuralContext.status).toBe('stale');
    expect(result.structuredContent).toMatchObject({
      structuralContext: expect.objectContaining({ status: 'stale' }),
    });
    expect(parsed.data.payloadContract.provenance.trustState).toBe('stale');
    expect(parsed.data.graphOps.readiness.canonical).toBe('stale');
    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
    expect(parsed.data.nextActions).toContain('Run `code_graph_scan` if the graph needs a broader refresh, then re-run `session_bootstrap`.');
  });
});
