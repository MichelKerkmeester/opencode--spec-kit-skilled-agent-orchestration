import { describe, expect, it, vi } from 'vitest';

import { collectSessionData } from '../extractors/collect-session-data';
import { normalizeInputData, validateInputData } from '../utils/input-normalizer';

describe('phase and status capture', () => {
  it('accepts explicit phase, status, and completion fields without unknown-field warnings', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rawPayload = {
      sessionSummary: 'Completed the render-layer fixes and verified the final save output.',
      phase: 'IMPLEMENTATION',
      status: 'COMPLETED',
      completionPercent: 100,
    };

    try {
      validateInputData(rawPayload, 'test-packet');
      expect(
        warnSpy.mock.calls.some((call) => call.join(' ').includes('Unknown field in input data'))
      ).toBe(false);

      const normalized = normalizeInputData(rawPayload);
      expect((normalized as Record<string, unknown>).projectPhase).toBe('IMPLEMENTATION');
      expect((normalized as Record<string, unknown>).sessionStatus).toBe('COMPLETED');
      expect((normalized as Record<string, unknown>).completionPercent).toBe(100);

      const sessionData = await collectSessionData({
        _source: 'file',
        ...normalized,
      } as never, 'test-packet');

      expect(sessionData.PROJECT_PHASE).toBe('IMPLEMENTATION');
      expect(sessionData.SESSION_STATUS).toBe('COMPLETED');
      expect(sessionData.COMPLETION_PERCENT).toBe(100);
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('falls back to contextType-derived phase and git-derived status when explicit fields are absent', async () => {
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'The packet still has working-tree edits to finish.',
      contextType: 'review',
      repositoryState: 'dirty',
    } as never, 'test-packet');

    expect(sessionData.PROJECT_PHASE).toBe('REVIEW');
    expect(sessionData.SESSION_STATUS).toBe('IN_PROGRESS');
    expect(sessionData.COMPLETION_PERCENT).toBe(95);
  });
});
