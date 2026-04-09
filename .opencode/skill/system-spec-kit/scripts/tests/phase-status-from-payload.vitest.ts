import { describe, expect, it } from 'vitest';

import { collectSessionData } from '../extractors/collect-session-data';

describe('phase and status capture', () => {
  it('respects explicit phase and status fields from structured payloads', async () => {
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'Completed the render-layer fixes and verified the final save output.',
      phase: 'IMPLEMENTATION',
      status: 'COMPLETED',
      completionPercent: 100,
    } as never, 'test-packet');

    expect(sessionData.PROJECT_PHASE).toBe('IMPLEMENTATION');
    expect(sessionData.SESSION_STATUS).toBe('COMPLETED');
    expect(sessionData.COMPLETION_PERCENT).toBe(100);
  });

  it('falls back to repository state when explicit status is absent', async () => {
    const sessionData = await collectSessionData({
      _source: 'file',
      sessionSummary: 'The packet still has working-tree edits to finish.',
      repositoryState: 'dirty',
    } as never, 'test-packet');

    expect(sessionData.SESSION_STATUS).toBe('IN_PROGRESS');
  });
});
