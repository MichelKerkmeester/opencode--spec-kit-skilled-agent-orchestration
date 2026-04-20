import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STRUCTURAL_TASK_SLICE = Object.freeze([
  'what calls handleSessionBootstrap',
  'what imports createMCPResponse',
  'show outline of session-prime.ts',
]);

const NON_STRUCTURAL_TASKS = Object.freeze([
  'find code that handles cached session summaries',
  'explain the purpose of the startup summary',
]);

describe('graph-first routing nudge helper', () => {
  it('fires for the frozen structural task slice only when readiness and scaffolding are true', async () => {
    const { maybeStructuralNudge } = await import('../context-server.js');

    for (const task of STRUCTURAL_TASK_SLICE) {
      expect(maybeStructuralNudge(task, {
        graphReady: true,
        activationScaffoldReady: true,
      })).toMatchObject({
        advisory: true,
        readiness: 'ready',
        preferredTool: 'code_graph_query',
      });
    }
  });

  it('does not fire when graph readiness or scaffolding is missing', async () => {
    const { maybeStructuralNudge } = await import('../context-server.js');

    expect(maybeStructuralNudge(STRUCTURAL_TASK_SLICE[0], {
      graphReady: false,
      activationScaffoldReady: true,
    })).toBeNull();

    expect(maybeStructuralNudge(STRUCTURAL_TASK_SLICE[1], {
      graphReady: true,
      activationScaffoldReady: false,
    })).toBeNull();
  });

  it('does not fire for non-structural queries', async () => {
    const { maybeStructuralNudge } = await import('../context-server.js');

    for (const task of NON_STRUCTURAL_TASKS) {
      expect(maybeStructuralNudge(task, {
        graphReady: true,
        activationScaffoldReady: true,
      })).toBeNull();
    }
  });
});

describe('session-prime startup surface', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('keeps startup priming generic instead of emitting a task-shaped structural routing hint', async () => {
    vi.doMock('../handlers/session-resume.js', () => ({
      getCachedSessionSummaryDecision: vi.fn(() => ({ status: 'rejected' })),
      logCachedSummaryDecision: vi.fn(),
    }));

    vi.doMock('../code-graph/lib/startup-brief.js', () => ({
      buildStartupBrief: vi.fn(() => ({
        startupSurface: '- Spec folder: none\n- Memory: startup summary only\n- What would you like to work on?',
        graphState: 'ready',
        graphOutline: 'Code graph ready',
      })),
    }));

    const { handleStartup } = await import('../hooks/claude/session-prime.ts');
    const sections = handleStartup({});

    expect(sections.some((section) => section.title === 'Structural Routing Hint')).toBe(false);
    expect(sections.some((section) => section.title === 'Structural Context')).toBe(true);
  });
});

describe('memory_context advisory metadata', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('threads the nudge into metadata for ready structural queries without changing the routed backend', async () => {
    vi.doMock('../core/db-state', async (importOriginal) => {
      const actual = await importOriginal() as Record<string, unknown>;
      return {
        ...actual,
        checkDatabaseUpdated: vi.fn(async () => false),
        waitForEmbeddingModel: vi.fn(async () => true),
        isEmbeddingModelReady: vi.fn(() => true),
      };
    });

    vi.doMock('../core', async (importOriginal) => {
      const actual = await importOriginal() as Record<string, unknown>;
      return {
        ...actual,
        checkDatabaseUpdated: vi.fn(async () => false),
        waitForEmbeddingModel: vi.fn(async () => true),
        isEmbeddingModelReady: vi.fn(() => true),
      };
    });

    vi.doMock('../handlers/memory-search', () => ({
      handleMemorySearch: vi.fn(async () => ({
        content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
        isError: false,
      })),
    }));

    vi.doMock('../handlers/memory-triggers', () => ({
      handleMemoryMatchTriggers: vi.fn(async () => ({
        content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
        isError: false,
      })),
    }));

    vi.doMock('../code-graph/lib/code-graph-context.js', () => ({
      buildContext: vi.fn(() => ({
        graphContext: { nodes: ['handleSessionBootstrap'] },
        textBrief: 'Graph context ready',
        combinedSummary: 'Graph context ready',
        nextActions: ['Use code_graph_query'],
        metadata: { totalNodes: 3 },
      })),
    }));

    const { handleMemoryContext } = await import('../handlers/memory-context.js');
    const result = await handleMemoryContext({ input: STRUCTURAL_TASK_SLICE[0] });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.meta.structuralRoutingNudge).toMatchObject({
      advisory: true,
      advisoryPreset: 'ready',
      preferredTool: 'code_graph_query',
    });
    expect(parsed.data.queryIntentRouting.routedBackend).toBe('structural');
    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
    expect(parsed.hints).toContain(parsed.data.structuralRoutingNudge.message);
  });

  it('does not add the nudge for semantic queries', async () => {
    vi.doMock('../core/db-state', async (importOriginal) => {
      const actual = await importOriginal() as Record<string, unknown>;
      return {
        ...actual,
        checkDatabaseUpdated: vi.fn(async () => false),
        waitForEmbeddingModel: vi.fn(async () => true),
        isEmbeddingModelReady: vi.fn(() => true),
      };
    });

    vi.doMock('../core', async (importOriginal) => {
      const actual = await importOriginal() as Record<string, unknown>;
      return {
        ...actual,
        checkDatabaseUpdated: vi.fn(async () => false),
        waitForEmbeddingModel: vi.fn(async () => true),
        isEmbeddingModelReady: vi.fn(() => true),
      };
    });

    vi.doMock('../handlers/memory-search', () => ({
      handleMemorySearch: vi.fn(async () => ({
        content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
        isError: false,
      })),
    }));

    vi.doMock('../handlers/memory-triggers', () => ({
      handleMemoryMatchTriggers: vi.fn(async () => ({
        content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
        isError: false,
      })),
    }));

    vi.doMock('../code-graph/lib/code-graph-context.js', () => ({
      buildContext: vi.fn(() => ({
        graphContext: { nodes: [] },
        textBrief: 'unused',
        combinedSummary: 'unused',
        nextActions: [],
        metadata: { totalNodes: 0 },
      })),
    }));

    const { handleMemoryContext } = await import('../handlers/memory-context.js');
    const result = await handleMemoryContext({ input: NON_STRUCTURAL_TASKS[0] });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.meta.structuralRoutingNudge).toBeNull();
    expect(parsed.data.structuralRoutingNudge).toBeUndefined();
  });
});

describe('session_bootstrap authority preservation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
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
        summary: 'Code graph ready',
        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
        sourceSurface: 'session_bootstrap',
      })),
    }));

    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
    const result = await handleSessionBootstrap({ specFolder: 'specs/026-root' });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.structuralRoutingNudge).toMatchObject({
      advisory: true,
      preservesAuthority: 'session_bootstrap',
    });
    expect(parsed.data.hints).toContain(parsed.data.structuralRoutingNudge.message);
    expect(parsed.data.nextActions).toEqual(expect.arrayContaining([
      'Structural context available. Use code_graph_query for structural lookups.',
      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
    ]));
    expect(parsed.data.nextActions).not.toContain(parsed.data.structuralRoutingNudge.message);
  });
});
