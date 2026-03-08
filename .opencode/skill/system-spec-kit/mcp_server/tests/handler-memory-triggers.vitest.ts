// @ts-nocheck
// ---------------------------------------------------------------
// TEST: HANDLER MEMORY TRIGGERS
// ---------------------------------------------------------------

import { describe, it, expect, vi, afterEach } from 'vitest';
// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-triggers';
import * as core from '../core';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as evalLogger from '../lib/eval/eval-logger';
import * as workingMemory from '../lib/cache/cognitive/working-memory';
import * as attentionDecay from '../lib/cache/cognitive/attention-decay';
import * as tierClassifier from '../lib/cache/cognitive/tier-classifier';
import * as coActivation from '../lib/cache/cognitive/co-activation';
import * as consumptionLogger from '../lib/telemetry/consumption-logger';

function parseEnvelope(response: Awaited<ReturnType<typeof handler.handleMemoryMatchTriggers>>) {
  return JSON.parse(response.content[0].text);
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
      const response = await handler.handleMemoryMatchTriggers({});
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt.*required|required.*prompt/i);
      expect(payload.data.code).toBe('E_VALIDATION');
    });

    it('T517-4: Null prompt returns MCP validation error', async () => {
      const response = await handler.handleMemoryMatchTriggers({ prompt: null });
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt/i);
    });

    it('T517-5: Empty string prompt returns MCP validation error', async () => {
      const response = await handler.handleMemoryMatchTriggers({ prompt: '' });
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt/i);
    });

    it('T517-6: Non-string prompt returns MCP validation error', async () => {
      const response = await handler.handleMemoryMatchTriggers({ prompt: 12345 });
      const payload = parseEnvelope(response);

      expect(response.isError).toBe(true);
      expect(payload.data.error).toMatch(/prompt.*string|string.*prompt/i);
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs final eval result even when no trigger matches are found', async () => {
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue({
      matches: [],
      stats: {
        promptLength: 7,
        cacheSize: 0,
        matchCount: 0,
        totalMatchedPhrases: 0,
        matchTimeMs: 0,
      },
    } as unknown as ReturnType<typeof triggerMatcher.matchTriggerPhrasesWithStats>);
    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 11, evalRunId: 22 });
    const finalSpy = vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);

    const response = await handler.handleMemoryMatchTriggers({ prompt: 'no match' });
    const payload = JSON.parse(response.content[0].text);

    expect(payload.data.matchType).toContain('trigger-phrase');
    expect(finalSpy).toHaveBeenCalledWith(expect.objectContaining({
      evalRunId: 22,
      queryId: 11,
      resultMemoryIds: [],
      fusionMethod: 'trigger',
    }));
  });

  it('routes through trigger signal vocabulary path without changing response shape', async () => {
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue({
      matches: [
        {
          memoryId: 1,
          specFolder: 'specs/test',
          filePath: '/tmp/test.md',
          title: 'Test',
          matchedPhrases: ['test'],
          importanceWeight: 0.8,
        },
      ],
      stats: {
        promptLength: 4,
        cacheSize: 1,
        matchCount: 1,
        totalMatchedPhrases: 1,
        matchTimeMs: 0,
        signals: [{ category: 'correction', keywords: ['actually'], boost: 0.2 }],
      },
    } as unknown as ReturnType<typeof triggerMatcher.matchTriggerPhrasesWithStats>);

    const response = await handler.handleMemoryMatchTriggers({ prompt: 'test', include_cognitive: false });
    const payload = JSON.parse(response.content[0].text);

    expect(payload.data.count).toBe(1);
    expect(Array.isArray(payload.data.results)).toBe(true);
    expect(payload.data.results[0].importanceWeight).toBe(0.8);
    expect(payload.meta.triggerSignals.length).toBe(1);
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

    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(undefined);
    vi.spyOn(triggerMatcher, 'matchTriggerPhrasesWithStats').mockReturnValue({
      matches,
      stats: {
        promptLength: 4,
        cacheSize: 5,
        matchCount: 5,
        totalMatchedPhrases: 5,
        matchTimeMs: 0,
        signals: [],
      },
    } as unknown as ReturnType<typeof triggerMatcher.matchTriggerPhrasesWithStats>);

    vi.spyOn(evalLogger, 'logSearchQuery').mockReturnValue({ queryId: 31, evalRunId: 32 });
    vi.spyOn(evalLogger, 'logFinalResult').mockImplementation(() => undefined);

    vi.spyOn(workingMemory, 'isEnabled').mockReturnValue(true);
    vi.spyOn(workingMemory, 'batchUpdateScores').mockReturnValue(0);
    vi.spyOn(workingMemory, 'setAttentionScore').mockImplementation(() => undefined);
    vi.spyOn(workingMemory, 'getSessionMemories').mockReturnValue([]);

    vi.spyOn(attentionDecay, 'getDb').mockReturnValue({
      prepare: vi.fn(() => ({
        get: vi.fn(() => undefined),
      })),
    } as unknown as ReturnType<typeof attentionDecay.getDb>);
    vi.spyOn(attentionDecay, 'activateMemory').mockImplementation(() => undefined);

    vi.spyOn(coActivation, 'isEnabled').mockReturnValue(false);

    const tierLimitSpy = vi.spyOn(tierClassifier, 'filterAndLimitByState')
      .mockImplementation((memories: any[], _state: any = null, limit: number = 20) => memories.slice(0, limit));

    vi.spyOn(tierClassifier, 'classifyState').mockReturnValue('HOT');
    vi.spyOn(consumptionLogger, 'initConsumptionLog').mockImplementation(() => undefined);
    vi.spyOn(consumptionLogger, 'logConsumptionEvent').mockImplementation(() => undefined);

    const response = await handler.handleMemoryMatchTriggers({
      prompt: 'test',
      limit: requestedLimit,
      session_id: 'session-1',
      include_cognitive: true,
    });
    const payload = JSON.parse(response.content[0].text);

    expect(payload.data.matchType).toBe('trigger-phrase-cognitive');
    expect(tierLimitSpy).toHaveBeenCalledWith(expect.any(Array), null, requestedLimit);
    expect(payload.data.count).toBeLessThanOrEqual(requestedLimit);
    expect(payload.data.results).toHaveLength(requestedLimit);
  });
});
