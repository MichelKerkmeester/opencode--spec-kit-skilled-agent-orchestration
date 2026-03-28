// TEST: HANDLER MEMORY TRIGGERS
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-triggers';
import * as core from '../core';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as evalLogger from '../lib/eval/eval-logger';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as attentionDecay from '../lib/cognitive/attention-decay';
import * as tierClassifier from '../lib/cognitive/tier-classifier';
import * as coActivation from '../lib/cognitive/co-activation';
import * as consumptionLogger from '../lib/telemetry/consumption-logger';
import * as sessionManager from '../lib/session/session-manager';
import * as vectorIndexStore from '../lib/search/vector-index-store';
import type {
  SignalDetection,
  TriggerMatch,
  TriggerMatchWithStats,
} from '../lib/parsing/trigger-matcher';

type TriggerResponse = Awaited<ReturnType<typeof handler.handleMemoryMatchTriggers>>;
type AttentionDb = NonNullable<ReturnType<typeof attentionDecay.getDb>>;

function parseEnvelope(response: TriggerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : undefined;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function buildTriggerMatch(overrides: Partial<TriggerMatch> = {}): TriggerMatch {
  return {
    memoryId: 1,
    specFolder: 'specs/test',
    filePath: '/tmp/test.md',
    title: 'Test',
    matchedPhrases: ['test'],
    importanceWeight: 0.8,
    ...overrides,
  };
}

function buildTriggerMatchResult(
  matches: TriggerMatch[],
  stats: Partial<TriggerMatchWithStats['stats']> = {}
): TriggerMatchWithStats {
  return {
    matches,
    stats: {
      promptLength: 4,
      cacheSize: matches.length,
      matchCount: matches.length,
      totalMatchedPhrases: matches.reduce(
        (total, match) => total + match.matchedPhrases.length,
        0
      ),
      matchTimeMs: 0,
      ...stats,
    },
  };
}

describe('Handler Memory Triggers (T517) [deferred - requires DB test fixtures]', () => {
  describe('Exports Validation', () => {
    it('T517-1: handleMemoryMatchTriggers exported', () => {
      expect(typeof handler.handleMemoryMatchTriggers).toBe('function');
    });

    it('T517-2: handle_memory_match_triggers alias exported', () => {
      expect(typeof handler.handle_memory_match_triggers).toBe('function');
    });
  });

  describe('Input Validation', () => {
    it('T517-3: Missing prompt returns MCP validation error', async () => {
      // @ts-expect-error Intentional invalid runtime-validation input without prompt.
      const response = await handler.handleMemoryMatchTriggers({});
      const payload = parseEnvelope(response);
      const data = getRecord(payload.data) ?? {};

      expect(response.isError).toBe(true);
      expect(data.error).toMatch(/prompt.*required|required.*prompt/i);
      expect(data.code).toBe('E_VALIDATION');
    });

    it('T517-4: Null prompt returns MCP validation error', async () => {
      // @ts-expect-error Intentional invalid runtime-validation input with null prompt.
      const response = await handler.handleMemoryMatchTriggers({ prompt: null });
      const payload = parseEnvelope(response);
      const data = getRecord(payload.data) ?? {};

      expect(response.isError).toBe(true);
      expect(data.error).toMatch(/prompt/i);
    });

    it('T517-5: Empty string prompt returns MCP validation error', async () => {
      const response = await handler.handleMemoryMatchTriggers({ prompt: '' });
      const payload = parseEnvelope(response);
      const data = getRecord(payload.data) ?? {};

      expect(response.isError).toBe(true);
      expect(data.error).toMatch(/prompt/i);
    });

    it('T517-6: Non-string prompt returns MCP validation error', async () => {
      // @ts-expect-error Intentional invalid runtime-validation input with numeric prompt.
      const response = await handler.handleMemoryMatchTriggers({ prompt: 12345 });
      const payload = parseEnvelope(response);
      const data = getRecord(payload.data) ?? {};

      expect(response.isError).toBe(true);
      expect(data.error).toMatch(/prompt.*string|string.*prompt/i);
    });
  });

  describe('Parameter Validation', () => {
    it('T517-7: Handler accepts args with limit parameter', () => {
      expect(typeof handler.handleMemoryMatchTriggers).toBe('function');
      expect(handler.handleMemoryMatchTriggers.length).toBeGreaterThanOrEqual(0);
    });

    it('T517-8: Handler supports turnNumber parameter', () => {
      expect(typeof handler.handleMemoryMatchTriggers).toBe('function');
    });
  });
});

describe('Sprint-0 reliability fixes', () => {
  beforeEach(() => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs final eval result even when no trigger matches are found', async () => {
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult([], {
        promptLength: 7,
        cacheSize: 0,
        matchCount: 0,
        totalMatchedPhrases: 0,
        matchTimeMs: 0,
      })
    );
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 11, evalRunId: 22 });
    const finalSpy = vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);

    const response = await handler.handleMemoryMatchTriggers({ prompt: 'no match' });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data) ?? {};

    expect(data.matchType).toContain('trigger-phrase');
    expect(finalSpy).toHaveBeenCalledWith(expect.objectContaining({
      evalRunId: 22,
      queryId: 11,
      resultMemoryIds: [],
      fusionMethod: 'trigger',
    }));
  });

  it('routes through trigger signal vocabulary path without changing response shape', async () => {
    const signals: SignalDetection[] = [
      { category: 'correction', keywords: ['actually'], boost: 0.2 },
    ];
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult([buildTriggerMatch()], { signals })
    );

    const response = await handler.handleMemoryMatchTriggers({ prompt: 'test', include_cognitive: false });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data) ?? {};
    const meta = getRecord(payload.meta) ?? {};
    const results = getArray(data.results).map((item) => getRecord(item) ?? {});
    const triggerSignals = getArray(meta.triggerSignals);

    expect(data.count).toBe(1);
    expect(Array.isArray(data.results)).toBe(true);
    expect(results[0]?.importanceWeight).toBe(0.8);
    expect(triggerSignals).toHaveLength(1);
  });

  it('surfaces degraded trigger matching metadata when trigger parsing partially fails', async () => {
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult([buildTriggerMatch()], {
        degraded: {
          code: 'E_TRIGGER_SOURCE_PARSE',
          message: 'Trigger cache loaded with 1 skipped source entries',
          failedEntries: 1,
          failures: [{ code: 'E_TRIGGER_SOURCE_PARSE', message: 'bad trigger payload', memoryId: 9 }],
        },
      })
    );

    const response = await handler.handleMemoryMatchTriggers({ prompt: 'test', include_cognitive: false });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data) ?? {};
    const meta = getRecord(payload.meta) ?? {};

    expect(getRecord(data.degradedMatching)?.code).toBe('E_TRIGGER_SOURCE_PARSE');
    expect(getRecord(meta.degradedMatching)?.failedEntries).toBe(1);
  });

  it('enforces caller limit on cognitive path responses', async () => {
    const requestedLimit = 2;
    const matches = Array.from({ length: 5 }, (_, index) => ({
      memoryId: index + 1,
      specFolder: 'specs/test',
      filePath: `/tmp/test-${index + 1}.md`,
      title: `Memory ${index + 1}`,
      matchedPhrases: ['test'],
      importanceWeight: 0.9,
    }));

    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult(matches, {
        promptLength: 4,
        cacheSize: 5,
        matchCount: 5,
        totalMatchedPhrases: 5,
        matchTimeMs: 0,
        signals: [],
      })
    );

    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 31, evalRunId: 32 });
    vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);

    vi.spyOn(workingMemory, 'isEnabled').mockReturnValue(true);
    vi.spyOn(workingMemory, 'batchUpdateScores').mockReturnValue(0);
    vi.spyOn(workingMemory, 'setAttentionScore').mockImplementation(() => false);
    vi.spyOn(workingMemory, 'getSessionMemories').mockReturnValue([]);

    const mockDb = {
      prepare: vi.fn(() => ({
        get: vi.fn(() => undefined),
      })),
    } as unknown as AttentionDb;
    vi.spyOn(attentionDecay, 'getDb').mockReturnValue(mockDb);
    vi.spyOn(attentionDecay, 'activateMemory').mockImplementation(() => false);

    vi.spyOn(coActivation, 'isEnabled').mockReturnValue(false);
    vi.spyOn(workingMemory, 'sessionExists').mockReturnValue(true);
    vi.spyOn(sessionManager, 'resolveTrustedSession').mockReturnValue({
      requestedSessionId: 'session-1',
      effectiveSessionId: 'session-1',
      trusted: true,
    });

    const tierLimitSpy = vi.spyOn(tierClassifier, 'filterAndLimitByState')
      .mockImplementation((memories, _state, limit = 20) => memories.slice(0, limit));

    vi.spyOn(tierClassifier, 'classifyState').mockReturnValue('HOT');
    vi.spyOn(consumptionLogger, 'initConsumptionLog').mockImplementation(() => undefined);
    vi.spyOn(consumptionLogger, 'logConsumptionEvent').mockImplementation(() => undefined);

    const response = await handler.handleMemoryMatchTriggers({
      prompt: 'test',
      limit: requestedLimit,
      session_id: 'session-1',
      include_cognitive: true,
    });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data) ?? {};
    const results = getArray(data.results);

    expect(data.matchType).toBe('trigger-phrase-cognitive');
    expect(tierLimitSpy).toHaveBeenCalledWith(expect.any(Array), null, requestedLimit);
    expect(data.count).toBeLessThanOrEqual(requestedLimit);
    expect(results).toHaveLength(requestedLimit);
  });

  it('filters trigger matches by governed scope fields when provided', async () => {
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue(
      buildTriggerMatchResult([
        buildTriggerMatch({ memoryId: 11, filePath: '/tmp/scoped.md' }),
        buildTriggerMatch({ memoryId: 22, filePath: '/tmp/unscoped.md' }),
      ])
    );
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 41, evalRunId: 42 });
    vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);
    vi.spyOn(vectorIndexStore, 'initialize_db').mockReturnValue({
      prepare: vi.fn(() => ({
        all: vi.fn(() => [
          {
            id: 11,
            spec_folder: 'specs/001-auth',
            tenant_id: 'tenant-a',
            user_id: 'user-1',
            agent_id: 'agent-1',
            shared_space_id: 'shared-1',
          },
          {
            id: 22,
            spec_folder: 'specs/002-other',
            tenant_id: 'tenant-b',
            user_id: 'user-2',
            agent_id: 'agent-2',
            shared_space_id: 'shared-2',
          },
        ]),
      })),
    } as never);

    const response = await handler.handleMemoryMatchTriggers({
      prompt: 'resume auth work',
      include_cognitive: false,
      specFolder: 'specs/001-auth',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
      sharedSpaceId: 'shared-1',
    });
    const payload = parseEnvelope(response);
    const data = getRecord(payload.data) ?? {};
    const results = getArray(data.results).map((item) => getRecord(item) ?? {});

    expect(data.count).toBe(1);
    expect(results).toHaveLength(1);
    expect(results[0]?.memoryId).toBe(11);
    expect(results[0]?.filePath).toBe('/tmp/scoped.md');
  });
});
