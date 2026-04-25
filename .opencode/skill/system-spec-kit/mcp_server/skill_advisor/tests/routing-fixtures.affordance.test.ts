// ───────────────────────────────────────────────────────────────
// MODULE: Affordance Routing Fixture Tests
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

describe('012/004 affordance routing fixtures', () => {
  it('improves recall for affordance-only prompts without changing default precision', () => {
    const projection = createFixtureProjection([
      skill({ id: 'mcp-figma' }),
    ]);

    const prompt = 'canvas swatch extractor';
    const baseline = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      confidenceThreshold: 0.55,
      includeAllCandidates: true,
    });
    const withAffordance = scoreAdvisorPrompt(prompt, {
      workspaceRoot: process.cwd(),
      projection,
      confidenceThreshold: 0.55,
      includeAllCandidates: true,
      affordances: [{
        skillId: 'mcp-figma',
        triggers: [prompt],
      }],
    });

    const baselineCandidate = baseline.recommendations.find((entry) => entry.skill === 'mcp-figma');
    const affordanceCandidate = withAffordance.recommendations.find((entry) => entry.skill === 'mcp-figma');
    const affordanceDerived = affordanceCandidate?.laneContributions.find((lane) => lane.lane === 'derived_generated');

    expect(baseline.topSkill).toBeNull();
    expect(baselineCandidate).toBeUndefined();
    expect(affordanceCandidate).toBeDefined();
    expect(affordanceDerived?.rawScore).toBeGreaterThan(0);
  });

  it('does not overpower explicit author triggers', () => {
    const projection = createFixtureProjection([
      skill({ id: 'explicit-skill', intentSignals: ['primary explicit workflow'] }),
      skill({ id: 'affordance-skill' }),
    ]);

    const result = scoreAdvisorPrompt('run the primary explicit workflow and component token inspector', {
      workspaceRoot: process.cwd(),
      projection,
      confidenceThreshold: 0.7,
      affordances: [{
        skillId: 'affordance-skill',
        triggers: ['component token inspector'],
      }],
    });

    expect(result.topSkill).toBe('explicit-skill');
    expect(result.recommendations[0]?.dominantLane).toBe('explicit_author');
  });
});
