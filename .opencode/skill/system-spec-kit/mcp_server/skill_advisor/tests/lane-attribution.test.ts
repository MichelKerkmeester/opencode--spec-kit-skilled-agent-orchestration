// ───────────────────────────────────────────────────────────────
// MODULE: Affordance Lane Attribution Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
import { createFixtureProjection } from '../lib/scorer/projection.js';
import type { SkillProjection } from '../lib/scorer/types.js';

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  const { id, ...rest } = overrides;
  return {
    id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: `.opencode/skill/${id}/graph-metadata.json`,
    lifecycleStatus: 'active',
    ...rest,
  };
}

describe('012/004 affordance lane attribution', () => {
  it('routes affordance evidence through derived and graph-causal lanes only', () => {
    const projection = createFixtureProjection([
      skill({ id: 'mcp-chrome-devtools' }),
      skill({ id: 'sk-code' }),
    ]);

    const result = scoreAdvisorPrompt('browser recorder failure', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      affordances: [{
        skillId: 'mcp-chrome-devtools',
        triggers: ['browser recorder failure'],
        enhances: [{ target: 'sk-code', weight: 0.8 }],
      }],
    });

    const chrome = result.recommendations.find((entry) => entry.skill === 'mcp-chrome-devtools');
    const web = result.recommendations.find((entry) => entry.skill === 'sk-code');
    const chromeDerived = chrome?.laneContributions.find((lane) => lane.lane === 'derived_generated');
    const webGraph = web?.laneContributions.find((lane) => lane.lane === 'graph_causal');

    expect(chromeDerived?.rawScore).toBeGreaterThan(0);
    expect(webGraph?.rawScore).toBeGreaterThan(0);
    expect(result.recommendations.flatMap((entry) => entry.laneContributions.map((lane) => lane.lane))).toEqual(
      expect.arrayContaining(['explicit_author', 'lexical', 'graph_causal', 'derived_generated', 'semantic_shadow']),
    );
    expect(result.recommendations.flatMap((entry) => entry.laneContributions.map((lane) => lane.lane))).not.toContain('affordance');
  });
});
