import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { scoreAdvisorPrompt } from '../../skill_advisor/lib/scorer/fusion.js';
import { createFixtureProjection } from '../../skill_advisor/lib/scorer/projection.js';
import type { SkillProjection } from '../../skill_advisor/lib/scorer/types.js';

function skillProjection(input: {
  readonly id: string;
  readonly keywords?: readonly string[];
  readonly intentSignals?: readonly string[];
  readonly derivedTriggers?: readonly string[];
  readonly domains?: readonly string[];
}): SkillProjection {
  return {
    id: input.id,
    kind: 'skill',
    family: 'stress',
    category: 'stress',
    name: input.id,
    description: `${input.id} five-lane stress projection`,
    keywords: input.keywords ?? [],
    domains: input.domains ?? ['stress', 'advisor'],
    intentSignals: input.intentSignals ?? [],
    derivedTriggers: input.derivedTriggers ?? [],
    derivedKeywords: input.derivedTriggers ?? [],
    sourcePath: null,
    lifecycleStatus: 'active',
  };
}

describe('sa-019 — Five-lane fusion', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(process.cwd(), 'stress-sa-019-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('keeps a 500+ skill corpus routable when one skill has strong lane agreement', () => {
    const skills = Array.from({ length: 550 }, (_, index) => skillProjection({
      id: `stress-skill-${index}`,
      keywords: [`keyword-${index}`, `shared-${index % 17}`],
      intentSignals: [`intent-${index % 23}`],
      derivedTriggers: [`derived-${index % 31}`],
      domains: [`domain-${index % 11}`],
    }));
    const target = skillProjection({
      id: 'stress-target',
      keywords: ['packet 044 stress routing', 'five lane fusion'],
      intentSignals: ['generate vitest stress tests'],
      derivedTriggers: ['code graph skill advisor remediation'],
      domains: ['system-spec-kit', 'stress'],
    });
    const projection = createFixtureProjection([...skills, target]);

    const result = scoreAdvisorPrompt('generate vitest stress tests for packet 044 five lane fusion remediation', {
      workspaceRoot: tmpDir,
      projection,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
      includeAllCandidates: true,
    });

    expect(result.topSkill).toBe('stress-target');
    expect(result.metrics.candidateCount).toBeGreaterThan(500);
    expect(result.recommendations[0]).toEqual(expect.objectContaining({
      skill: 'stress-target',
      dominantLane: expect.any(String),
    }));
    expect(result.recommendations[0]?.laneContributions).toHaveLength(5);
  });

  it('surfaces lane thrash as ambiguity instead of hiding a close top-two', () => {
    const projection = createFixtureProjection([
      skillProjection({
        id: 'alpha-lane',
        keywords: ['routing stress', 'fusion audit'],
        intentSignals: ['routing stress'],
        derivedTriggers: ['alpha-derived'],
      }),
      skillProjection({
        id: 'beta-lane',
        keywords: ['routing stress', 'fusion audit'],
        intentSignals: ['routing stress'],
        derivedTriggers: ['beta-derived'],
      }),
      skillProjection({
        id: 'gamma-shadow',
        keywords: ['unrelated'],
        intentSignals: ['unrelated'],
        derivedTriggers: ['routing stress'],
      }),
    ]);

    const result = scoreAdvisorPrompt('implement routing stress fusion audit', {
      workspaceRoot: tmpDir,
      projection,
      confidenceThreshold: 0,
      uncertaintyThreshold: 1,
      includeAllCandidates: true,
    });

    expect(result.recommendations.slice(0, 2).map((entry) => entry.skill)).toEqual(['alpha-lane', 'beta-lane']);
    expect(result.ambiguous).toBe(true);
    expect(result.recommendations[0]?.ambiguousWith).toContain('beta-lane');
  });

  it('returns UNKNOWN for degenerate prompts without manufacturing candidates', () => {
    const projection = createFixtureProjection(Array.from({ length: 500 }, (_, index) => skillProjection({
      id: `degenerate-${index}`,
      keywords: [],
      intentSignals: [],
      derivedTriggers: [],
    })));

    const result = scoreAdvisorPrompt('     !!! ???     ', {
      workspaceRoot: tmpDir,
      projection,
      includeAllCandidates: true,
    });

    expect(result.unknown).toBe(true);
    expect(result.topSkill).toBeNull();
    expect(result.recommendations).toEqual([]);
  });
});
