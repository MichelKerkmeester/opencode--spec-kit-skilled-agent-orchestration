// ───────────────────────────────────────────────────────────────
// MODULE: sa-022 / sa-023 — Scorer Extras Stress Test
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { runLaneAblation } from '../../skill_advisor/lib/scorer/ablation.js';
import { scoreAdvisorPrompt } from '../../skill_advisor/lib/scorer/fusion.js';
import { createFixtureProjection } from '../../skill_advisor/lib/scorer/projection.js';
import { DEFAULT_SCORER_WEIGHTS, SCORER_LANES } from '../../skill_advisor/lib/scorer/weights-config.js';
import type { ScorerLane, SkillProjection } from '../../skill_advisor/lib/scorer/types.js';

function skillProjection(input: {
  readonly id: string;
  readonly keywords?: readonly string[];
  readonly intentSignals?: readonly string[];
  readonly derivedTriggers?: readonly string[];
}): SkillProjection {
  return {
    id: input.id,
    kind: 'skill',
    family: 'stress',
    category: 'stress',
    name: input.id,
    description: `${input.id} scorer extras stress projection`,
    keywords: input.keywords ?? [],
    domains: ['stress', 'advisor'],
    intentSignals: input.intentSignals ?? [],
    derivedTriggers: input.derivedTriggers ?? [],
    derivedKeywords: input.derivedTriggers ?? [],
    sourcePath: null,
    lifecycleStatus: 'active',
  };
}

describe('sa-022 / sa-023 — scorer extras', () => {
  it('emits complete prompt-safe lane attribution across a wide candidate set', () => {
    const target = skillProjection({
      id: 'lane-attribution-target',
      keywords: ['packet 044 scorer extras', 'lane attribution'],
      intentSignals: ['generate stress tests'],
      derivedTriggers: ['skill advisor scorer extras'],
    });
    const projection = createFixtureProjection([
      ...Array.from({ length: 240 }, (_, index) => skillProjection({
        id: `background-skill-${index}`,
        keywords: [`background-${index}`, `shared-${index % 13}`],
        intentSignals: [`background intent ${index % 17}`],
        derivedTriggers: [`background derived ${index % 19}`],
      })),
      target,
    ]);

    const result = scoreAdvisorPrompt('generate packet 044 scorer extras lane attribution stress tests', {
      workspaceRoot: process.cwd(),
      projection,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
      includeAllCandidates: true,
    });
    const recommendation = result.recommendations[0];

    expect(recommendation?.skill).toBe('lane-attribution-target');
    expect(recommendation?.laneContributions.map((entry) => entry.lane)).toEqual([...SCORER_LANES]);
    expect(recommendation?.laneContributions).toHaveLength(5);
    for (const contribution of recommendation?.laneContributions ?? []) {
      expect(contribution.rawScore).toBeGreaterThanOrEqual(0);
      expect(contribution.weight).toBe(DEFAULT_SCORER_WEIGHTS[contribution.lane]);
      expect(contribution.weightedScore).toBeGreaterThanOrEqual(0);
      expect(contribution.shadowOnly).toBe(contribution.lane === 'semantic_shadow');
      expect(JSON.stringify(contribution)).not.toContain('private@example.com');
    }
    expect(recommendation?.dominantLane).not.toBe('semantic_shadow');
  });

  it('runs lane-by-lane ablation without mutating live scorer weights', () => {
    const projection = createFixtureProjection([
      skillProjection({
        id: 'explicit-heavy',
        keywords: ['explicit heavy'],
        intentSignals: ['explicit heavy'],
      }),
      skillProjection({
        id: 'metadata-route',
        derivedTriggers: ['xqzv generated marker'],
      }),
    ]);
    const weightsBefore = JSON.stringify(DEFAULT_SCORER_WEIGHTS);

    const report = runLaneAblation({
      workspaceRoot: process.cwd(),
      projection,
      cases: [
        { prompt: 'implement explicit heavy workflow', expectedSkill: 'explicit-heavy' },
        { prompt: 'implement xqzv generated marker', expectedSkill: 'metadata-route' },
      ],
    });

    expect(report.baseline).toEqual(expect.objectContaining({
      disabledLane: 'none',
      total: 2,
    }));
    expect(report.baseline.correct).toBeGreaterThan(0);
    expect(report.baseline.accuracy).toBeGreaterThan(0);
    expect(report.lanes.map((slice) => slice.disabledLane).sort()).toEqual([...SCORER_LANES].sort());
    expect(report.lanes.every((slice) => slice.total === 2)).toBe(true);

    const derivedSlice = report.lanes.find((slice) => slice.disabledLane === 'derived_generated');
    expect(derivedSlice).toEqual(expect.objectContaining({
      disabledLane: 'derived_generated',
      total: 2,
    }));
    expect(JSON.stringify(DEFAULT_SCORER_WEIGHTS)).toBe(weightsBefore);
  });

  it('keeps every ablation slice labeled with a valid scorer lane', () => {
    const projection = createFixtureProjection([
      skillProjection({
        id: 'stress-route',
        keywords: ['stress route'],
        intentSignals: ['stress route'],
        derivedTriggers: ['stress route'],
      }),
    ]);
    const validLanes = new Set<ScorerLane>(SCORER_LANES);

    const report = runLaneAblation({
      workspaceRoot: process.cwd(),
      projection,
      cases: Array.from({ length: 25 }, () => ({
        prompt: 'implement stress route',
        expectedSkill: 'stress-route',
      })),
    });

    expect(report.lanes).toHaveLength(SCORER_LANES.length);
    for (const slice of report.lanes) {
      expect(validLanes.has(slice.disabledLane as ScorerLane)).toBe(true);
      expect(slice.accuracy).toBeGreaterThanOrEqual(0);
      expect(slice.accuracy).toBeLessThanOrEqual(1);
    }
  });
});
