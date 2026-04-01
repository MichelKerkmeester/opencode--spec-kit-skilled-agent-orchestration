// ───────────────────────────────────────────────────────────────
// 1. HANDLER MEMORY CONTEXT TESTS
// ───────────────────────────────────────────────────────────────
// TEST: HANDLER MEMORY CONTEXT
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as core from '../core';
import * as layerDefs from '../lib/architecture/layer-definitions';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as sessionManager from '../lib/session/session-manager';
import { handleMemorySearch } from '../handlers/memory-search';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';

// Mock core/db-state to prevent real DB operations that cause timeouts.
// This must be hoisted before any handler imports.
// The handlers (memory-context, memory-search, memory-triggers) all import
// { checkDatabaseUpdated, waitForEmbeddingModel } from '../core' which
// Re-exports from './db-state'.
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

// Mock the sub-handlers (memory-search, memory-triggers) to avoid
// Requiring a real embedding model / database for mode-routing tests.
// These return valid MCP response shapes so the strategy executors succeed.
vi.mock('../handlers/memory-search', () => ({
  handleMemorySearch: vi.fn(async () => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
    isError: false,
  })),
}));

vi.mock('../handlers/memory-triggers', () => ({
  handleMemoryMatchTriggers: vi.fn(async () => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
    isError: false,
  })),
}));

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-context';

const mockedHandleMemorySearch = vi.mocked(handleMemorySearch);

async function withTimeout<T>(promise: Promise<T>, ms: number, name: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${name} exceeded ${ms}ms`)), ms)
    ),
  ]);
}

type ParsedContextResponse = {
  meta: {
    mode?: string;
    requestedMode?: string;
    tokenUsageSource?: string;
    tokenUsagePressure?: number | null;
    pressureLevel?: string;
    pressurePolicy: {
      applied?: boolean;
      overrideMode?: string;
      warning?: string | null;
    };
    sessionLifecycle: {
      sessionScope?: string;
      requestedSessionId?: string | null;
      effectiveSessionId?: string;
      resumed?: boolean;
      eventCounterStart?: number;
      resumedContextCount?: number;
    };
  };
  data: {
    mode?: string;
    strategy?: string;
    content?: Array<{ text?: string }>;
    systemPromptContextInjected?: boolean;
    systemPromptContext?: Array<{ memoryId: number }>;
    details?: {
      layer?: string;
    };
  };
  hints?: string[];
  error?: boolean;
  mode?: string;
};

function parseResponse(result: Awaited<ReturnType<typeof handler.handleMemoryContext>>): ParsedContextResponse {
  return JSON.parse(result.content[0].text) as ParsedContextResponse;
}

function mockTrustedSession(sessionId: string): void {
  vi.spyOn(sessionManager, 'resolveTrustedSession').mockReturnValue({
    requestedSessionId: sessionId,
    effectiveSessionId: sessionId,
    trusted: true,
  });
}

describe('Handler Memory Context (T524) [deferred - requires DB test fixtures]', () => {
  const originalAutoResume = process.env.SPECKIT_AUTO_RESUME;
  const originalRolloutPercent = process.env.SPECKIT_ROLLOUT_PERCENT;

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalAutoResume === undefined) {
      delete process.env.SPECKIT_AUTO_RESUME;
    } else {
      process.env.SPECKIT_AUTO_RESUME = originalAutoResume;
    }
    if (originalRolloutPercent === undefined) {
      delete process.env.SPECKIT_ROLLOUT_PERCENT;
    } else {
      process.env.SPECKIT_ROLLOUT_PERCENT = originalRolloutPercent;
    }
  });

  // SUITE: Auto Mode Routing
  describe('Auto Mode Routing (T524-1 to T524-3)', () => {
    it('T524-1: Auto mode routes "resume" to resume strategy', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'resume where I left off on the authentication module',
        }),
        5000,
        'T524-1'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = parseResponse(result);

      const mode =
        parsed.meta?.mode ??
        parsed.data?.mode ??
        (parsed.error ? parsed.mode : undefined);

      expect(mode).toBe('resume');
    });

    it('T524-2: Short question routes to focused mode', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what is the auth flow?',
        }),
        5000,
        'T524-2'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = parseResponse(result);

      const mode =
        parsed.meta?.mode ??
        parsed.data?.mode ??
        (parsed.error ? parsed.mode : undefined);

      expect(mode).toBe('focused');
    });

    it('routes auto mode to resume when a caller session already exists without resume keywords', async () => {
      mockTrustedSession('session-auto-resume');
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what changed in this spec?',
          sessionId: 'session-auto-resume',
        }),
        5000,
        'auto-resume-session-context'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.mode).toBe('resume');
    });

    it('T524-3: Default mode is auto (adaptive strategy)', () => {
      expect(handler.CONTEXT_MODES).toBeTruthy();
      expect(handler.CONTEXT_MODES.auto).toBeTruthy();
      expect(handler.CONTEXT_MODES.auto.strategy).toBe('adaptive');
    });
  });

  // SUITE: Explicit Mode Selection
  describe('Explicit Mode Selection (T524-4)', () => {
    it('T524-4: Invalid mode falls back to focused', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'test query for invalid mode',
          mode: 'totally_invalid_mode' as unknown as Parameters<typeof handler.handleMemoryContext>[0]['mode'],
        }),
        5000,
        'T524-4'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = parseResponse(result);

      const mode =
        parsed.meta?.mode ??
        (parsed.data?.strategy === 'focused' ? 'focused' : undefined);

      expect(mode).toBe('focused');
    });

    it('keeps explicit focused mode intent-aware when no explicit intent is provided', async () => {
      await withTimeout(
        handler.handleMemoryContext({
          input: 'why did search ranking regress after the fusion change?',
          mode: 'focused',
        }),
        5000,
        'focused-intent-auto-detect'
      );

      // Intent classifier auto-detects intent for non-quick modes, so
      // autoDetectIntent is false (intent was pre-classified) and the
      // detected intent is forwarded to the search handler.
      expect(mockedHandleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
        autoDetectIntent: false,
      }));
    });
  });

  describe('Governed scope forwarding', () => {
    it('forwards response profile through routed search strategies', async () => {
      await withTimeout(
        handler.handleMemoryContext({
          input: 'trace auth context',
          mode: 'focused',
          profile: 'quick',
        }),
        5000,
        'profile-forward-focused'
      );

      expect(mockedHandleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
        profile: 'quick',
      }));
    });

    it('forwards governed scope fields through deep-mode search routing', async () => {
      await withTimeout(
        handler.handleMemoryContext({
          input: 'trace auth context',
          mode: 'deep',
          tenantId: 'tenant-a',
          userId: 'user-1',
          agentId: 'agent-1',
          sharedSpaceId: 'shared-1',
        }),
        5000,
        'scope-forward-deep'
      );

      expect(mockedHandleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
        query: 'trace auth context',
        tenantId: 'tenant-a',
        userId: 'user-1',
        agentId: 'agent-1',
        sharedSpaceId: 'shared-1',
      }));
    });

    it('forwards governed scope fields through resume-mode search routing', async () => {
      await withTimeout(
        handler.handleMemoryContext({
          input: 'resume session',
          mode: 'resume',
          tenantId: 'tenant-a',
          userId: 'user-1',
          agentId: 'agent-1',
          sharedSpaceId: 'shared-1',
        }),
        5000,
        'scope-forward-resume'
      );

      expect(mockedHandleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
        tenantId: 'tenant-a',
        userId: 'user-1',
        agentId: 'agent-1',
        sharedSpaceId: 'shared-1',
      }));
    });
  });

  // SUITE: Mode-Specific Token Budgets
  describe('Mode-Specific Token Budgets (T524-5)', () => {
    it('T524-5: Each mode has correct token budget', () => {
      const expectedBudgets: Record<string, number | undefined> = {
        auto: undefined,
        quick: 800,
        deep: 3500,
        focused: 3000,
        resume: 2000,
      };

      for (const [modeName, expectedBudget] of Object.entries(expectedBudgets)) {
        const mode = handler.CONTEXT_MODES[modeName];
        expect(mode).toBeTruthy();
        expect(mode.tokenBudget).toBe(expectedBudget);
      }
    });
  });

  // SUITE: tokenUsage Fallback Contract + Pressure Policy (T000f/T000g, T018-T020)
  describe('tokenUsage fallback contract and pressure policy lane', () => {
    it('T018/T019: 55% pressure keeps intent-selected mode (no override)', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what is the auth flow?',
          tokenUsage: 0.55,
        }),
        5000,
        'T018/T019-55'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.mode).toBe('focused');
      expect(parsed.meta.tokenUsageSource).toBe('caller');
      expect(parsed.meta.tokenUsagePressure).toBe(0.55);
      expect(parsed.meta.pressureLevel).toBe('none');
      expect(parsed.meta.pressurePolicy.applied).toBe(false);
      expect(parsed.meta.pressurePolicy.warning).toBeNull();
    });

    it('T018/T019: 65% pressure forces focused mode in auto', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'implement OAuth state and token refresh flow with threat model and rollout plan',
          tokenUsage: 0.65,
        }),
        5000,
        'T018/T019-65'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.requestedMode).toBe('auto');
      expect(parsed.meta.mode).toBe('focused');
      expect(parsed.meta.tokenUsageSource).toBe('caller');
      expect(parsed.meta.tokenUsagePressure).toBe(0.65);
      expect(parsed.meta.pressureLevel).toBe('focused');
      expect(parsed.meta.pressurePolicy.applied).toBe(true);
      expect(parsed.meta.pressurePolicy.overrideMode).toBe('focused');
      expect(parsed.meta.pressurePolicy.warning).toContain('Pressure policy override applied');
    });

    it('T018/T019: 85% pressure forces quick mode in auto', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what is the auth flow?',
          tokenUsage: 0.85,
        }),
        5000,
        'T018/T019-85'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.mode).toBe('quick');
      expect(parsed.meta.tokenUsageSource).toBe('caller');
      expect(parsed.meta.tokenUsagePressure).toBe(0.85);
      expect(parsed.meta.pressureLevel).toBe('quick');
      expect(parsed.meta.pressurePolicy.applied).toBe(true);
      expect(parsed.meta.pressurePolicy.overrideMode).toBe('quick');
      expect(parsed.meta.pressurePolicy.warning).toContain('forced mode quick');
    });

    it('T018/T019: out-of-range caller tokenUsage clamps to [0,1] and maps to quick', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what is the auth flow?',
          tokenUsage: 2.7,
        }),
        5000,
        'T018/T019-clamp'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.mode).toBe('quick');
      expect(parsed.meta.tokenUsageSource).toBe('caller');
      expect(parsed.meta.tokenUsagePressure).toBe(1);
      expect(parsed.meta.pressureLevel).toBe('quick');
    });

    it('T017: absent tokenUsage uses estimator fallback from runtime stats', async () => {
      // L1 token budget is 3500 — need ~0.8*3500=2800 tokens (~11200 chars) for quick pressure
      const highPressureInput = 'x'.repeat(12000);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: highPressureInput,
        }),
        5000,
        'T017-estimator'
      );

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.meta.mode).toBe('quick');
      expect(parsed.meta.tokenUsageSource).toBe('estimator');
      expect(parsed.meta.tokenUsagePressure).toBeGreaterThanOrEqual(0.8);
      expect(parsed.meta.tokenUsagePressure).toBeLessThanOrEqual(1);
      expect(parsed.meta.pressureLevel).toBe('quick');
    });

    it('T017: estimator unavailable logs WARN and keeps auto-selected mode', async () => {
      vi.spyOn(layerDefs, 'getLayerInfo').mockReturnValue({
        id: 'L1',
        name: 'Unavailable',
        description: 'Unavailable token estimator for test coverage',
        tokenBudget: 0,
        priority: 1,
        useCase: 'Test fallback behavior',
        tools: [],
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what is the auth flow?',
        }),
        5000,
        'T017-unavailable'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.mode).toBe('focused');
      expect(parsed.meta.tokenUsageSource).toBe('unavailable');
      expect(parsed.meta.tokenUsagePressure).toBeNull();
      expect(parsed.meta.pressureLevel).toBe('none');
      expect(parsed.meta.pressurePolicy.applied).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith(
        'tokenUsage not provided and estimator unavailable; pressure policy inactive'
      );
    });

    it('T018/T019: high pressure does not override explicit mode', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'deep analysis query',
          mode: 'deep',
          tokenUsage: 0.95,
        }),
        5000,
        'T018/T019-explicit'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.mode).toBe('deep');
      expect(parsed.meta.tokenUsageSource).toBe('caller');
      expect(parsed.meta.tokenUsagePressure).toBe(0.95);
      expect(parsed.meta.pressureLevel).toBe('quick');
      expect(parsed.meta.pressurePolicy.applied).toBe(false);
      expect(parsed.meta.pressurePolicy.warning).toBeNull();
    });

    it('T020: response metadata and hints expose applied pressure policy warning', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'implement OAuth state and token refresh flow with threat model and rollout plan',
          tokenUsage: 0.95,
        }),
        5000,
        'T020-warning-meta'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.pressurePolicy.applied).toBe(true);
      expect(parsed.meta.pressurePolicy.warning).toContain('Pressure policy override applied');
      expect(parsed.hints!.some((hint: string) => hint.includes('Pressure policy override applied'))).toBe(true);
    });
  });

  // SUITE: INTENT_TO_MODE Routing Configuration
  describe('INTENT_TO_MODE Routing (T524-6)', () => {
    it('T524-6: INTENT_TO_MODE mapping is correct', () => {
      const expectedMappings: Record<string, string> = {
        add_feature: 'deep',
        fix_bug: 'focused',
        refactor: 'deep',
        security_audit: 'deep',
        understand: 'focused',
      };

      for (const [intent, expectedMode] of Object.entries(expectedMappings)) {
        expect(handler.INTENT_TO_MODE[intent]).toBe(expectedMode);
      }
    });
  });

  // SUITE: Session lifecycle contract (T027k-T027m)
  describe('Session lifecycle metadata and resume context', () => {
    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'what changed in this spec?',
        }),
        5000,
        'T027k-ephemeral'
      );

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.meta.sessionLifecycle.sessionScope).toBe('ephemeral');
      expect(parsed.meta.sessionLifecycle.requestedSessionId).toBeNull();
      expect(typeof parsed.meta.sessionLifecycle.effectiveSessionId).toBe('string');
      expect(parsed.meta.sessionLifecycle.effectiveSessionId.length).toBeGreaterThan(20);
      expect(parsed.meta.sessionLifecycle.eventCounterStart).toBe(0);
      expect(parsed.meta.sessionLifecycle).not.toHaveProperty('transition');
    });

    it('T027ka: rejects caller sessionId when it is not server-managed', async () => {
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(false);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'continue tracking retrieval drift follow-up',
          sessionId: 'session-new',
        }),
        5000,
        'T027ka-caller-new-session'
      );

      const parsed = JSON.parse(result.content[0].text) as {
        data: {
          code?: string;
          error?: string;
        };
        hints?: string[];
      };
      expect(result.isError).toBe(true);
      expect(parsed.data.code).toBe('E_SESSION_SCOPE');
      expect(parsed.data.error).toContain('does not match a server-managed session');
      expect(parsed.hints).toContain(
        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
      );
    });

    it('T027l/T027m: caller session resume reports counter and injects top-5 context', async () => {
      mockTrustedSession('session-abc');
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);
      vi.spyOn(workingMemory, 'getSessionEventCounter').mockReturnValue(7);
      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
        {
          memoryId: 101,
          title: 'Decision memory',
          filePath: '/tmp/decision.md',
          attentionScore: 0.92,
        },
      ]);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'resume previous work on memory quality',
          sessionId: 'session-abc',
          mode: 'resume',
        }),
        5000,
        'T027l-resume'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.sessionLifecycle.sessionScope).toBe('caller');
      expect(parsed.meta.sessionLifecycle.requestedSessionId).toBe('session-abc');
      expect(parsed.meta.sessionLifecycle.effectiveSessionId).toBe('session-abc');
      expect(parsed.meta.sessionLifecycle.resumed).toBe(true);
      expect(parsed.meta.sessionLifecycle.eventCounterStart).toBe(7);
      expect(parsed.meta.sessionLifecycle.resumedContextCount).toBe(1);
      expect(parsed.meta.sessionLifecycle).not.toHaveProperty('transition');
      expect(parsed.data.systemPromptContextInjected).toBe(true);
      expect(parsed.data.systemPromptContext!.length).toBe(1);
      expect(parsed.data.systemPromptContext![0].memoryId).toBe(101);
    });

    it('injects session transition into traced nested results when includeTrace=true', async () => {
      mockTrustedSession('session-trace');
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);
      vi.mocked(handleMemorySearch).mockResolvedValueOnce({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              data: {
                results: [
                  {
                    id: 42,
                    trace: {
                      channelsUsed: ['vector'],
                    },
                  },
                ],
                count: 1,
              },
              meta: {},
            }),
          },
        ],
        isError: false,
      });

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'resume prior work',
          sessionId: 'session-trace',
          mode: 'resume',
          includeTrace: true,
        }),
        5000,
        'session-trace-injection'
      );

      const parsed = parseResponse(result);
      expect(parsed.meta.sessionLifecycle).not.toHaveProperty('transition');
      expect(handleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
        sessionTransition: expect.objectContaining({
          previousState: null,
          currentState: 'resume',
          confidence: 1,
          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
          reason: 'resumed session inferred resume mode',
        }),
      }));
    });

    it('uses the last inferred mode as previousState when a traced caller session resumes', async () => {
      mockTrustedSession('session-known');
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);
      vi.spyOn(workingMemory, 'getSessionEventCounter').mockReturnValue(4);
      vi.spyOn(workingMemory, 'getSessionInferredMode').mockReturnValue('focused');

      await withTimeout(
        handler.handleMemoryContext({
          input: 'resume previous work on memory quality',
          sessionId: 'session-known',
          mode: 'resume',
          includeTrace: true,
        }),
        5000,
        'session-trace-previous-state'
      );

      expect(handleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
        sessionTransition: expect.objectContaining({
          previousState: 'focused',
          currentState: 'resume',
          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
        }),
      }));
    });

    it('default-on contract: auto-resume injection runs when SPECKIT_AUTO_RESUME is unset', async () => {
      mockTrustedSession('session-default-on');
      delete process.env.SPECKIT_AUTO_RESUME;
      process.env.SPECKIT_ROLLOUT_PERCENT = '100';
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);
      vi.spyOn(workingMemory, 'getSessionEventCounter').mockReturnValue(3);
      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
        {
          memoryId: 201,
          title: 'Auto resume memory',
          filePath: '/tmp/auto-resume.md',
          attentionScore: 0.81,
        },
      ]);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'resume prior work',
          sessionId: 'session-default-on',
          mode: 'resume',
        }),
        5000,
        'auto-resume-default-on'
      );

      const parsed = parseResponse(result);
      expect(parsed.data.systemPromptContextInjected).toBe(true);
      expect(parsed.data.systemPromptContext!.length).toBe(1);
      expect(parsed.data.systemPromptContext![0].memoryId).toBe(201);
    });

    it('opt-out contract: SPECKIT_AUTO_RESUME=false disables context injection', async () => {
      mockTrustedSession('session-opt-out');
      process.env.SPECKIT_AUTO_RESUME = 'false';
      process.env.SPECKIT_ROLLOUT_PERCENT = '100';
      vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);
      vi.spyOn(workingMemory, 'getSessionEventCounter').mockReturnValue(2);
      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
        {
          memoryId: 301,
          title: 'Disabled auto-resume memory',
          filePath: '/tmp/disabled-auto-resume.md',
          attentionScore: 0.77,
        },
      ]);

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'resume prior work',
          sessionId: 'session-opt-out',
          mode: 'resume',
        }),
        5000,
        'auto-resume-opt-out'
      );

      const parsed = parseResponse(result);
      expect(parsed.data.systemPromptContextInjected).not.toBe(true);
      expect(parsed.data.systemPromptContext ?? []).toEqual([]);
    });
  });

  // SUITE: Error Response Structure
  describe('Error Response Structure (T524-7 to T524-8)', () => {
    it('returns an E_INTERNAL envelope when database state verification throws', async () => {
      vi.mocked(core.checkDatabaseUpdated).mockRejectedValueOnce(new Error('db unavailable'));

      const result = await withTimeout(
        handler.handleMemoryContext({ input: 'what is the auth flow?' }),
        5000,
        'db-state-envelope'
      );

      const parsed = JSON.parse(result.content[0].text) as {
        data: {
          code?: string;
          error?: string;
          details?: { layer?: string };
        };
        hints?: string[];
      };

      expect(result.isError).toBe(true);
      expect(parsed.data.code).toBe('E_INTERNAL');
      expect(parsed.data.error).toBe('Database state check failed: db unavailable');
      expect(parsed.data.details?.layer).toBe('L1:Orchestration');
      expect(parsed.hints).toContain('The memory database may be unavailable. Retry or check database connectivity.');
    });

    it('T524-7: Empty input error includes L1 layer metadata', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({ input: '' }),
        5000,
        'T524-7'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = parseResponse(result);
      expect(parsed.data.details!.layer).toBeTruthy();
      expect(parsed.data.details!.layer).toContain('L1');
    });

    it('T524-8: Error includes actionable hint', async () => {
      const result = await withTimeout(
        handler.handleMemoryContext({ input: '' }),
        5000,
        'T524-8'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = parseResponse(result);
      expect(parsed.hints).toBeTruthy();
      expect(Array.isArray(parsed.hints)).toBe(true);
      expect(parsed.hints!.length).toBeGreaterThan(0);
      expect(typeof parsed.hints![0]).toBe('string');
    });

    it('keeps successful retrievals when telemetry assembly throws', async () => {
      vi.spyOn(retrievalTelemetry, 'isExtendedTelemetryEnabled').mockReturnValue(true);
      vi.spyOn(retrievalTelemetry, 'createTelemetry').mockImplementation(() => {
        throw new Error('telemetry exploded');
      });

      const result = await withTimeout(
        handler.handleMemoryContext({ input: 'what is the auth flow?' }),
        5000,
        'telemetry-failsafe'
      );

      const parsed = parseResponse(result);
      expect(result.isError).toBe(false);
      expect(parsed.meta.mode).toBe('focused');
      expect(parsed.meta).not.toHaveProperty('_telemetry');
    });

    it('keeps successful retrievals when session inferred mode persistence throws', async () => {
      vi.spyOn(workingMemory, 'setSessionInferredMode').mockImplementation(() => {
        throw new Error('session write failed');
      });

      const result = await withTimeout(
        handler.handleMemoryContext({ input: 'what is the auth flow?' }),
        5000,
        'session-write-failsafe'
      );

      const parsed = parseResponse(result);
      expect(result.isError).toBe(false);
      expect(parsed.meta.mode).toBe('focused');
    });

    it('returns an error envelope when the routed strategy returns an MCP error response', async () => {
      mockedHandleMemorySearch.mockResolvedValueOnce({
        content: [{
          type: 'text',
          text: JSON.stringify({
            data: {
              error: 'upstream search failed',
              code: 'E_SEARCH_DOWN',
              details: { layer: 'L2:Core' },
            },
            hints: ['retry search'],
            meta: { isError: true, severity: 'error' },
          }),
        }],
        isError: true,
      });

      const result = await withTimeout(
        handler.handleMemoryContext({
          input: 'why is retrieval failing?',
          mode: 'focused',
        }),
        5000,
        'strategy-error-envelope'
      );

      const parsed = JSON.parse(result.content[0].text) as {
        data: { code?: string; error?: string; details?: { upstream?: { layer?: string } } };
        hints?: string[];
      };

      expect(result.isError).toBe(true);
      expect(parsed.data.code).toBe('E_SEARCH_DOWN');
      expect(parsed.data.error).toBe('upstream search failed');
      expect(parsed.data.details?.upstream?.layer).toBe('L2:Core');
      expect(parsed.hints).toContain('retry search');
    });
  });
});
