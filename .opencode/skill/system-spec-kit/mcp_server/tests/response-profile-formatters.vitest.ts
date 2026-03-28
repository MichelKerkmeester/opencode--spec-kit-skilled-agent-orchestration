import { describe, expect, it } from 'vitest';

import { applyProfileToEnvelope } from '../lib/response/profile-formatters';

describe('response profile envelope preservation', () => {
  const baseEnvelope = JSON.stringify({
    summary: 'Found 2 results',
    data: {
      count: 2,
      totalCount: 17,
      truncated: true,
      searchMetadata: {
        strategy: 'hybrid',
        evidenceGap: true,
      },
      results: [
        { id: 1, score: 0.9, title: 'Alpha' },
        { id: 2, score: 0.8, title: 'Beta' },
      ],
    },
    hints: ['Inspect the top result first'],
    meta: {
      tool: 'memory_search',
      tokenCount: 42,
      cacheHit: false,
    },
  });

  it('preserves non-results metadata fields for quick profile', () => {
    const profiled = JSON.parse(applyProfileToEnvelope('quick', baseEnvelope, true));

    expect(profiled.data.totalCount).toBe(17);
    expect(profiled.data.truncated).toBe(true);
    expect(profiled.data.searchMetadata).toEqual({
      strategy: 'hybrid',
      evidenceGap: true,
    });
    expect(profiled.data.topResult).toMatchObject({ id: 1, title: 'Alpha' });
    expect(profiled.data.results).toBeUndefined();
    expect(profiled.meta.responseProfile).toBe('quick');
  });

  it('preserves metadata fields for research profile', () => {
    const profiled = JSON.parse(applyProfileToEnvelope('research', baseEnvelope, true));

    expect(profiled.data.totalCount).toBe(17);
    expect(profiled.data.truncated).toBe(true);
    expect(profiled.data.searchMetadata).toEqual({
      strategy: 'hybrid',
      evidenceGap: true,
    });
    expect(profiled.data.results).toHaveLength(2);
    expect(profiled.data.count).toBe(2);
  });
});
