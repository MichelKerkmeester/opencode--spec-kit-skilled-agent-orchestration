import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('session_bootstrap Gate D reader-ready messaging', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('keeps bootstrap messaging on the 3-level resume ladder without legacy fallback wording', async () => {
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
                  generatedAt: '2026-04-11T00:00:00.000Z',
                  lastUpdated: '2026-04-11T00:00:00.000Z',
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
          text: JSON.stringify({
            status: 'ok',
            data: { state: 'warning', hints: ['health warning'] },
          }),
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
      })),
    }));

    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
    const result = await handleSessionBootstrap({ specFolder: 'specs/026-root' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.nextActions).toEqual(expect.arrayContaining([
      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
      'Resume recovery follows `handover.md` -> `_memory.continuity` -> spec docs.',
    ]));

    const messagingSurface = [...parsed.data.nextActions, ...parsed.data.hints].join(' ');
    expect(messagingSurface).not.toContain('memory_context({ input: "resume previous work"');
    expect(messagingSurface).not.toMatch(/\barchived\b/i);
    expect(messagingSurface).not.toMatch(/\blegacy\b/i);
    expect(messagingSurface).not.toMatch(/\bD0\b/i);
  });
});
