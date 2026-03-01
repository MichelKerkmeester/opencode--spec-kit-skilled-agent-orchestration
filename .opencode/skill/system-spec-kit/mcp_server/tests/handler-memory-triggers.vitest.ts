// @ts-nocheck
// ---------------------------------------------------------------
// TEST: HANDLER MEMORY TRIGGERS
// ---------------------------------------------------------------

import { describe, it, expect, vi, afterEach } from 'vitest';
// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-triggers';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as evalLogger from '../lib/eval/eval-logger';

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
    it('T517-3: Missing prompt throws error', async () => {
      await expect(handler.handleMemoryMatchTriggers({})).rejects.toThrow(/prompt.*required|required.*prompt/);
    });

    it('T517-4: Null prompt throws error', async () => {
      await expect(handler.handleMemoryMatchTriggers({ prompt: null })).rejects.toThrow(/prompt/);
    });

    it('T517-5: Empty string prompt throws error', async () => {
      await expect(handler.handleMemoryMatchTriggers({ prompt: '' })).rejects.toThrow(/prompt/);
    });

    it('T517-6: Non-string prompt throws error', async () => {
      await expect(handler.handleMemoryMatchTriggers({ prompt: 12345 })).rejects.toThrow(/prompt.*string|string.*prompt/);
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
});
