// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Scorer Fusion Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises scorer fusion and ambiguity behavior from feature catalog
// 04--scorer-fusion and 06--mcp-surface advisor recommendation paths.

import { describe, expect, it } from 'vitest';

import { scoreAdvisorPrompt } from '../../skill_advisor/lib/scorer/fusion.js';
import { createFixtureProjection } from '../../skill_advisor/lib/scorer/projection.js';
import type { SkillProjection } from '../../skill_advisor/lib/scorer/types.js';

function skillProjection(input: {
  readonly id: string;
  readonly keywords: readonly string[];
  readonly intentSignals: readonly string[];
  readonly derivedTriggers?: readonly string[];
}): SkillProjection {
  return {
    id: input.id,
    kind: 'skill',
    family: 'stress',
    category: 'stress',
    name: input.id,
    description: `${input.id} stress projection`,
    keywords: input.keywords,
    domains: ['stress', 'advisor'],
    intentSignals: input.intentSignals,
    derivedTriggers: input.derivedTriggers ?? [],
    derivedKeywords: input.derivedTriggers ?? [],
    sourcePath: null,
    lifecycleStatus: 'active',
  };
}

describe('skill advisor scorer fusion stress behavior', () => {
  it('keeps explicit workflow evidence ahead of weaker lexical candidates', () => {
    const projection = createFixtureProjection([
      skillProjection({
        id: 'sk-code-opencode',
        keywords: ['typescript standards', 'opencode alignment'],
        intentSignals: ['stress test alignment', 'typescript standards'],
      }),
      skillProjection({
        id: 'sk-doc',
        keywords: ['audit findings', 'packet documentation'],
        intentSignals: ['documentation'],
      }),
    ]);

    const result = scoreAdvisorPrompt('implement stress test alignment with typescript standards', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });

    expect(result.topSkill).toBe('sk-code-opencode');
    expect(result.unknown).toBe(false);
    expect(result.recommendations[0]?.dominantLane).not.toBeNull();
  });

  it('marks tied high-confidence candidates as ambiguous instead of hiding the tie', () => {
    const projection = createFixtureProjection([
      skillProjection({
        id: 'alpha-skill',
        keywords: ['stress alignment', 'coverage audit'],
        intentSignals: ['stress alignment'],
      }),
      skillProjection({
        id: 'beta-skill',
        keywords: ['stress alignment', 'coverage audit'],
        intentSignals: ['stress alignment'],
      }),
    ]);

    const result = scoreAdvisorPrompt('implement stress alignment coverage audit', {
      workspaceRoot: process.cwd(),
      projection,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
      includeAllCandidates: true,
    });

    expect(result.recommendations).toHaveLength(2);
    expect(result.ambiguous).toBe(true);
    expect(result.recommendations[0]?.ambiguousWith).toContain(result.recommendations[1]?.skill);
  });
});
