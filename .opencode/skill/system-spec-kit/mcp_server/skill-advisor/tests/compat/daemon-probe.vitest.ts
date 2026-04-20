import { afterEach, describe, expect, it } from 'vitest';

import { probeAdvisorDaemon } from '../../lib/compat/daemon-probe.js';
import type { AdvisorStatusOutput } from '../../schemas/advisor-tool-schemas.js';

function status(freshness: AdvisorStatusOutput['freshness']): AdvisorStatusOutput {
  return {
    freshness,
    generation: freshness === 'absent' ? 0 : 4,
    trustState: {
      state: freshness,
      reason: freshness === 'stale' ? 'SOURCE_NEWER_THAN_SKILL_GRAPH' : null,
      generation: freshness === 'absent' ? 0 : 4,
      checkedAt: '2026-04-20T00:00:00.000Z',
      lastLiveAt: freshness === 'live' ? '2026-04-20T00:00:00.000Z' : null,
    },
    lastGenerationBump: freshness === 'absent' ? null : '2026-04-20T00:00:00.000Z',
    laneWeights: {
      explicit_author: 0.45,
      lexical: 0.3,
      graph_causal: 0.15,
      derived_generated: 0.1,
      semantic_shadow: 0,
    },
  };
}

afterEach(() => {
  delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
});

describe('compat daemon probe', () => {
  it('reports live and stale native advisor states as available', () => {
    expect(probeAdvisorDaemon({
      workspaceRoot: process.cwd(),
      statusReader: () => status('live'),
    })).toMatchObject({ available: true, freshness: 'live', generation: 4 });

    expect(probeAdvisorDaemon({
      workspaceRoot: process.cwd(),
      statusReader: () => status('stale'),
    })).toMatchObject({ available: true, freshness: 'stale', generation: 4 });
  });

  it('reports absent, unavailable, and disabled states as unavailable', () => {
    expect(probeAdvisorDaemon({
      workspaceRoot: process.cwd(),
      statusReader: () => status('absent'),
    })).toMatchObject({ available: false, freshness: 'absent' });

    expect(probeAdvisorDaemon({
      workspaceRoot: process.cwd(),
      statusReader: () => status('unavailable'),
    })).toMatchObject({ available: false, freshness: 'unavailable' });

    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    expect(probeAdvisorDaemon({
      workspaceRoot: process.cwd(),
      statusReader: () => status('live'),
    })).toMatchObject({ available: false, reason: 'ADVISOR_DISABLED' });
  });
});

