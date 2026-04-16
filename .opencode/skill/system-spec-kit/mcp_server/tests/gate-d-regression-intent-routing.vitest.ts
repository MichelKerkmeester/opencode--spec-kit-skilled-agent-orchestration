import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const GATE_D_SPEC_FOLDER = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/';
const CANONICAL_QUERY = 'find the canonical decision and task anchors for Gate D reader-ready';
const CANONICAL_ANCHORS = ['decision', 'task', 'spec_doc'];

const mocks = vi.hoisted(() => ({
  checkDatabaseUpdated: vi.fn(async () => false),
  classifyQueryIntent: vi.fn(() => ({
    intent: 'semantic',
    confidence: 0.22,
    matchedKeywords: ['decision', 'task'],
  })),
  classifyIntent: vi.fn(() => ({
    intent: 'find_decision',
    confidence: 0.98,
    fallback: false,
  })),
  getProfileForIntent: vi.fn(() => null),
  isValidIntent: vi.fn(() => true),
  getPressureLevel: vi.fn(() => ({
    level: 'none',
    ratio: null,
    source: 'test',
    warning: null,
  })),
  handleMemoryMatchTriggers: vi.fn(async () => makeCanonicalSurfaceResponse('triggers')),
  handleMemorySearch: vi.fn(async () => makeCanonicalSurfaceResponse('search')),
  buildResumeLadder: vi.fn(() => makeResumeLadderResult()),
  resolveTrustedSession: vi.fn(() => ({
    requestedSessionId: null,
    effectiveSessionId: 'gate-d-session',
    trusted: false,
    error: null,
  })),
  saveSessionState: vi.fn(() => ({ success: true })),
  getSessionInferredMode: vi.fn(() => null),
  getSessionEventCounter: vi.fn(() => 0),
  setSessionInferredMode: vi.fn(() => undefined),
  getSessionPromptContext: vi.fn(() => []),
  isExtendedTelemetryEnabled: vi.fn(() => false),
  initConsumptionLog: vi.fn(() => undefined),
  logConsumptionEvent: vi.fn(() => undefined),
  logSearchQuery: vi.fn(() => ({ queryId: 1, evalRunId: 1 })),
  logChannelResult: vi.fn(() => undefined),
  logFinalResult: vi.fn(() => undefined),
  getDb: vi.fn(() => null),
  isAutoResumeEnabled: vi.fn(() => false),
  isFolderDiscoveryEnabled: vi.fn(() => false),
  isPressurePolicyEnabled: vi.fn(() => false),
  isIntentAutoProfileEnabled: vi.fn(() => false),
  buildContext: vi.fn(() => ({
    graphContext: { nodes: [] },
    textBrief: 'graph context',
    combinedSummary: 'graph context',
    nextActions: [],
    metadata: { totalNodes: 0 },
  })),
}));

vi.mock('../core/index.js', () => ({
  checkDatabaseUpdated: mocks.checkDatabaseUpdated,
}));

vi.mock('../lib/search/intent-classifier.js', () => ({
  classifyIntent: mocks.classifyIntent,
  isValidIntent: mocks.isValidIntent,
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  getIntentDescription: vi.fn(() => 'intent description'),
  getProfileForIntent: mocks.getProfileForIntent,
}));

vi.mock('../lib/code-graph/query-intent-classifier.js', () => ({
  classifyQueryIntent: mocks.classifyQueryIntent,
}));

vi.mock('../lib/code-graph/code-graph-context.js', () => ({
  buildContext: mocks.buildContext,
}));

vi.mock('../handlers/memory-search.js', () => ({
  handleMemorySearch: mocks.handleMemorySearch,
}));

vi.mock('../handlers/memory-triggers.js', () => ({
  handleMemoryMatchTriggers: mocks.handleMemoryMatchTriggers,
}));

vi.mock('../lib/resume/resume-ladder.js', () => ({
  buildResumeLadder: mocks.buildResumeLadder,
}));

vi.mock('../lib/search/search-flags.js', () => ({
  isAutoResumeEnabled: mocks.isAutoResumeEnabled,
  isFolderDiscoveryEnabled: mocks.isFolderDiscoveryEnabled,
  isPressurePolicyEnabled: mocks.isPressurePolicyEnabled,
  isIntentAutoProfileEnabled: mocks.isIntentAutoProfileEnabled,
}));

vi.mock('../lib/cognitive/pressure-monitor.js', () => ({
  getPressureLevel: mocks.getPressureLevel,
}));

vi.mock('../lib/cognitive/working-memory.js', () => ({
  DECAY_FLOOR: 0.2,
  getSessionInferredMode: mocks.getSessionInferredMode,
  getSessionEventCounter: mocks.getSessionEventCounter,
  setSessionInferredMode: mocks.setSessionInferredMode,
  getSessionPromptContext: mocks.getSessionPromptContext,
}));

vi.mock('../lib/session/session-manager.js', () => ({
  resolveTrustedSession: mocks.resolveTrustedSession,
  saveSessionState: mocks.saveSessionState,
}));

vi.mock('../lib/telemetry/retrieval-telemetry.js', () => ({
  isExtendedTelemetryEnabled: mocks.isExtendedTelemetryEnabled,
  createTelemetry: vi.fn(() => ({})),
  recordMode: vi.fn(() => undefined),
  recordFallback: vi.fn(() => undefined),
  recordTransitionDiagnostics: vi.fn(() => undefined),
  toJSON: vi.fn((value: unknown) => value),
}));

vi.mock('../lib/telemetry/consumption-logger.js', () => ({
  initConsumptionLog: mocks.initConsumptionLog,
  logConsumptionEvent: mocks.logConsumptionEvent,
}));

vi.mock('../lib/eval/eval-logger.js', () => ({
  logSearchQuery: mocks.logSearchQuery,
  logChannelResult: mocks.logChannelResult,
  logFinalResult: mocks.logFinalResult,
}));

vi.mock('../lib/search/vector-index.js', () => ({
  getDb: mocks.getDb,
}));

import { handleMemoryContext } from '../handlers/memory-context';

function makeCanonicalRows(surface: 'search' | 'triggers'): Array<Record<string, unknown>> {
  return [
    {
      id: `${surface}-decision`,
      title: 'Gate D decision record',
      documentType: 'spec_doc',
      anchorId: 'decision',
      filePath: `${GATE_D_SPEC_FOLDER}decision-record.md`,
    },
    {
      id: `${surface}-tasks`,
      title: 'Gate D tasks',
      documentType: 'spec_doc',
      anchorId: 'task',
      filePath: `${GATE_D_SPEC_FOLDER}tasks.md`,
    },
    {
      id: `${surface}-continuity`,
      title: 'Canonical continuity',
      documentType: 'continuity',
      anchorId: '_memory.continuity',
      filePath: `${GATE_D_SPEC_FOLDER}implementation-summary.md`,
    },
  ];
}

function makeCanonicalSurfaceResponse(surface: 'search' | 'triggers') {
  const rows = makeCanonicalRows(surface);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          summary: `${surface} canonical reader surface`,
          data: {
            count: rows.length,
            results: rows,
            sourceContract: {
              archivedTierEnabled: false,
              legacyFallbackEnabled: false,
              preferredDocumentTypes: ['spec_doc', 'continuity'],
              retainedResults: rows.length,
              droppedNonCanonicalResults: 0,
            },
          },
          meta: {
            routedSurface: surface,
          },
        }),
      },
    ],
    isError: false,
  };
}

function makeResumeLadderResult() {
  return {
    source: 'spec_docs',
    specFolder: GATE_D_SPEC_FOLDER,
    resolution: {
      kind: 'explicit',
      requestedSpecFolder: GATE_D_SPEC_FOLDER,
      fallbackSpecFolder: null,
      resolvedSpecFolder: GATE_D_SPEC_FOLDER,
      folderPath: GATE_D_SPEC_FOLDER,
    },
    summary: 'Gate D decision record | Gate D tasks | Canonical continuity',
    recentAction: 'Review the canonical decision record',
    nextSafeAction: 'Review tasks.md and continue the packet.',
    blockers: [],
    keyFiles: [
      `${GATE_D_SPEC_FOLDER}decision-record.md`,
      `${GATE_D_SPEC_FOLDER}tasks.md`,
    ],
    hints: ['Resume mode reads canonical docs directly.'],
    documents: [
      {
        type: 'spec-doc',
        path: `${GATE_D_SPEC_FOLDER}decision-record.md`,
        relativePath: 'specs/gate-d/decision-record.md',
        fingerprint: 'sha256:decision-record',
        modifiedAt: '2026-04-11T12:00:00.000Z',
      },
      {
        type: 'spec-doc',
        path: `${GATE_D_SPEC_FOLDER}tasks.md`,
        relativePath: 'specs/gate-d/tasks.md',
        fingerprint: 'sha256:tasks',
        modifiedAt: '2026-04-11T12:00:00.000Z',
      },
    ],
    freshnessWinner: 'spec-docs',
  };
}

function parseEnvelope(response: Awaited<ReturnType<typeof handleMemoryContext>>): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function parseNestedPayload(envelope: Record<string, unknown>): Record<string, unknown> {
  const data = envelope.data as Record<string, unknown>;
  const content = data.content as Array<{ text: string }>;
  return JSON.parse(content[0].text) as Record<string, unknown>;
}

describe('Gate D intent routing regression', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // NOTE: This suite mocks handleMemorySearch/handleMemoryMatchTriggers so it
  // only verifies that handleMemoryContext *dispatches* to the right handler
  // with the right arguments.  It does NOT exercise the live canonical-filtering
  // pipeline (includeArchived, legacyFallbackEnabled, preferredDocumentTypes
  // enforcement) because the mock returns pre-built rows.
  //
  // A complementary integration suite that calls the real handleMemorySearch
  // against an in-memory DB (or at least against the real filtering code path)
  // is required to close this coverage gap.  See review finding S3.5 #13.

  it('routes canonical queries across auto, quick, deep, focused, and resume without archived or legacy-memory fallback', async () => {
    const cases = [
      {
        mode: 'auto' as const,
        intent: 'find_decision' as const,
        expectedMode: 'focused',
        expectedStrategy: 'focused',
        handler: 'search' as const,
      },
      {
        mode: 'quick' as const,
        expectedMode: 'quick',
        expectedStrategy: 'quick',
        handler: 'triggers' as const,
      },
      {
        mode: 'deep' as const,
        intent: 'find_spec' as const,
        expectedMode: 'deep',
        expectedStrategy: 'deep',
        handler: 'search' as const,
      },
      {
        mode: 'focused' as const,
        intent: 'find_decision' as const,
        expectedMode: 'focused',
        expectedStrategy: 'focused',
        handler: 'search' as const,
      },
      {
        mode: 'resume' as const,
        expectedMode: 'resume',
        expectedStrategy: 'resume',
        handler: 'resume' as const,
      },
    ];

    for (const testCase of cases) {
      mocks.handleMemorySearch.mockClear();
      mocks.handleMemoryMatchTriggers.mockClear();
      mocks.buildResumeLadder.mockClear();

      const response = await handleMemoryContext({
        input: CANONICAL_QUERY,
        mode: testCase.mode,
        intent: testCase.intent,
        specFolder: GATE_D_SPEC_FOLDER,
        anchors: CANONICAL_ANCHORS,
      });

      const envelope = parseEnvelope(response);
      const outerData = envelope.data as Record<string, unknown>;
      const queryIntentRouting = outerData.queryIntentRouting as Record<string, unknown> | undefined;

      expect(outerData.mode).toBe(testCase.expectedMode);
      expect(outerData.strategy).toBe(testCase.expectedStrategy);
      if (testCase.handler !== 'resume') {
        expect(queryIntentRouting?.routedBackend).toBe('semantic');
      }

      if (testCase.handler === 'search') {
        expect(mocks.handleMemorySearch).toHaveBeenCalledTimes(1);
        expect(mocks.handleMemoryMatchTriggers).not.toHaveBeenCalled();
        expect(mocks.buildResumeLadder).not.toHaveBeenCalled();

        const searchArgs = mocks.handleMemorySearch.mock.calls[0]?.[0] as Record<string, unknown>;
        expect(searchArgs).toMatchObject({
          query: CANONICAL_QUERY,
          specFolder: GATE_D_SPEC_FOLDER,
          anchors: CANONICAL_ANCHORS,
          includeConstitutional: true,
          useDecay: true,
        });
        expect(searchArgs.autoDetectIntent).toBe(false);
        expect(searchArgs.includeArchived).toBeUndefined();

        const nested = parseNestedPayload(envelope);
        const nestedData = nested.data as Record<string, unknown>;
        const results = nestedData.results as Array<Record<string, unknown>>;
        const sourceContract = nestedData.sourceContract as Record<string, unknown>;

        expect(results.some((row) => row.documentType === 'memory')).toBe(false);
        expect(results.some((row) => row.anchorId === 'decision')).toBe(true);
        expect(results.some((row) => row.anchorId === 'task')).toBe(true);
        expect(sourceContract).toMatchObject({
          archivedTierEnabled: false,
          legacyFallbackEnabled: false,
          preferredDocumentTypes: ['spec_doc', 'continuity'],
          retainedResults: 3,
          droppedNonCanonicalResults: 0,
        });
      } else if (testCase.handler === 'triggers') {
        expect(mocks.handleMemoryMatchTriggers).toHaveBeenCalledTimes(1);
        expect(mocks.handleMemorySearch).not.toHaveBeenCalled();
        expect(mocks.buildResumeLadder).not.toHaveBeenCalled();

        const triggerArgs = mocks.handleMemoryMatchTriggers.mock.calls[0]?.[0] as Record<string, unknown>;
        expect(triggerArgs).toMatchObject({
          prompt: CANONICAL_QUERY,
          specFolder: GATE_D_SPEC_FOLDER,
          limit: 5,
          include_cognitive: true,
        });

        const nested = parseNestedPayload(envelope);
        const nestedData = nested.data as Record<string, unknown>;
        const results = nestedData.results as Array<Record<string, unknown>>;
        const sourceContract = nestedData.sourceContract as Record<string, unknown>;

        expect(results.some((row) => row.documentType === 'memory')).toBe(false);
        expect(results.some((row) => row.anchorId === 'decision')).toBe(true);
        expect(results.some((row) => row.anchorId === 'task')).toBe(true);
        expect(sourceContract).toMatchObject({
          archivedTierEnabled: false,
          legacyFallbackEnabled: false,
          preferredDocumentTypes: ['spec_doc', 'continuity'],
          retainedResults: 3,
          droppedNonCanonicalResults: 0,
        });
      } else {
        expect(mocks.buildResumeLadder).toHaveBeenCalledTimes(1);
        expect(mocks.handleMemorySearch).not.toHaveBeenCalled();
        expect(mocks.handleMemoryMatchTriggers).not.toHaveBeenCalled();
        expect(mocks.buildResumeLadder).toHaveBeenCalledWith(expect.objectContaining({
          specFolder: GATE_D_SPEC_FOLDER,
          workspacePath: process.cwd(),
        }));

        const nested = parseNestedPayload(envelope);
        const nestedData = nested.data as Record<string, unknown>;
        const resumeLadder = nestedData.resumeLadder as Record<string, unknown>;

        expect(resumeLadder).toMatchObject({
          source: 'spec_docs',
          legacyMemoryFallback: false,
          archivedTierEnabled: false,
          requestedAnchors: CANONICAL_ANCHORS,
        });
      }
    }
  });
});
