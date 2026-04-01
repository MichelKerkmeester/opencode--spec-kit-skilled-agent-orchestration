import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Memory Context Session State Persistence', () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('persists an auto-discovered spec folder in the initial session state save', async () => {
    const handleMemorySearch = vi.fn(async () => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify({ data: { count: 0, results: [] } }),
        },
      ],
    }));
    const saveSessionState = vi.fn(() => ({ success: true }));

    vi.doMock('../core', () => ({
      checkDatabaseUpdated: vi.fn(async () => false),
    }));
    vi.doMock('../lib/architecture/layer-definitions', () => ({
      getLayerInfo: vi.fn(() => ({ tokenBudget: 2000 })),
      getRecommendedLayers: vi.fn(() => []),
    }));
    vi.doMock('../lib/search/intent-classifier', () => ({
      classifyIntent: vi.fn(() => ({
        intent: 'find_spec',
        confidence: 0.92,
        scores: {
          add_feature: 0,
          fix_bug: 0,
          refactor: 0,
          security_audit: 0,
          understand: 0.18,
          find_spec: 0.92,
          find_decision: 0.44,
        },
        keywords: ['spec'],
        rankedIntents: [
          { intent: 'find_spec', confidence: 0.92, score: 0.92 },
          { intent: 'find_decision', confidence: 0.44, score: 0.44 },
          { intent: 'understand', confidence: 0.18, score: 0.18 },
        ],
      })),
    }));
    vi.doMock('../handlers/memory-search', () => ({
      handleMemorySearch,
    }));
    vi.doMock('../handlers/memory-triggers', () => ({
      handleMemoryMatchTriggers: vi.fn(async () => ({
        content: [
          {
            type: 'text',
            text: JSON.stringify({ data: { count: 0, results: [] } }),
          },
        ],
      })),
    }));
    vi.doMock('../lib/response/envelope', () => ({
      createMCPResponse: vi.fn(({ data }: { data: Record<string, unknown> }) => ({
        content: [
          {
            type: 'text',
            text: JSON.stringify({ data }),
          },
        ],
      })),
      createMCPErrorResponse: vi.fn(({ error }: { error: string }) => ({
        content: [
          {
            type: 'text',
            text: JSON.stringify({ data: { error } }),
          },
        ],
      })),
    }));
    vi.doMock('../formatters/token-metrics', () => ({
      estimateTokens: vi.fn(() => 10),
    }));
    vi.doMock('../lib/cognitive/pressure-monitor', () => ({
      getPressureLevel: vi.fn(() => ({
        level: 'none',
        ratio: null,
        source: 'unavailable',
        warning: null,
      })),
    }));
    vi.doMock('../lib/cognitive/working-memory', () => ({
      getSessionInferredMode: vi.fn(() => null),
      getSessionEventCounter: vi.fn(() => 0),
      setSessionInferredMode: vi.fn(),
      getSessionPromptContext: vi.fn(() => []),
      DECAY_FLOOR: 0,
    }));
    vi.doMock('../lib/session/session-manager', () => ({
      resolveTrustedSession: vi.fn(() => ({
        requestedSessionId: null,
        effectiveSessionId: 'session-123',
        trusted: false,
      })),
      saveSessionState,
    }));
    vi.doMock('../lib/telemetry/retrieval-telemetry', () => ({
      isExtendedTelemetryEnabled: vi.fn(() => false),
    }));
    vi.doMock('../lib/telemetry/consumption-logger', () => ({
      initConsumptionLog: vi.fn(),
      logConsumptionEvent: vi.fn(),
    }));
    vi.doMock('../lib/search/session-transition', () => ({
      attachSessionTransitionTrace: vi.fn((result: unknown) => result),
      buildSessionTransitionTrace: vi.fn(() => ({})),
    }));
    vi.doMock('../lib/eval/eval-logger', () => ({
      logSearchQuery: vi.fn(() => ({ queryId: 0, evalRunId: 0 })),
      logChannelResult: vi.fn(),
      logFinalResult: vi.fn(),
    }));
    vi.doMock('../lib/search/vector-index', () => ({
      getDb: vi.fn(() => null),
    }));
    vi.doMock('../lib/search/folder-discovery', () => ({
      getSpecsBasePaths: vi.fn(() => ['/tmp/specs']),
      discoverSpecFolder: vi.fn(() => '02--system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement'),
    }));
    vi.doMock('../lib/search/search-flags', async (importOriginal) => {
      const actual = await importOriginal() as Record<string, unknown>;
      return {
        ...actual,
        isAutoResumeEnabled: vi.fn(() => false),
        isFolderDiscoveryEnabled: vi.fn(() => true),
        isPressurePolicyEnabled: vi.fn(() => false),
      };
    });
    vi.doMock('../utils', () => ({
      toErrorMessage: vi.fn((error: unknown) => error instanceof Error ? error.message : String(error)),
    }));

    const { handleMemoryContext } = await import('../handlers/memory-context');

    await handleMemoryContext({
      input: 'find the hybrid rag memory database refinement spec and related context',
    });

    expect(saveSessionState).toHaveBeenCalledOnce();
    expect(saveSessionState).toHaveBeenCalledWith(
      'session-123',
      expect.objectContaining({
        specFolder: '02--system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement',
      }),
    );
    expect(handleMemorySearch).toHaveBeenCalledWith(
      expect.objectContaining({
        folderBoost: expect.objectContaining({
          folder: '02--system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement',
        }),
      }),
    );
  });
});
