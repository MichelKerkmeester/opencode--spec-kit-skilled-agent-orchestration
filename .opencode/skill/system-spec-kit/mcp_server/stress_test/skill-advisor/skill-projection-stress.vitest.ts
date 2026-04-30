import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  createFixtureProjection,
  loadAdvisorProjection,
} from '../../skill_advisor/lib/scorer/projection.js';
import type { SkillEdgeProjection, SkillProjection } from '../../skill_advisor/lib/scorer/types.js';

function skillProjection(id: string): SkillProjection {
  return {
    id,
    kind: 'skill',
    family: 'stress',
    category: 'stress',
    name: id,
    description: `${id} projection stress skill`,
    keywords: ['projection', id],
    domains: ['projection'],
    intentSignals: ['projection stress'],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
  };
}

describe('sa-020 — Skill projection', () => {
  let tmpDir: string;
  let workspaceRoot: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(process.cwd(), 'stress-sa-020-'));
    workspaceRoot = join(tmpDir, 'workspace');
    mkdirSync(workspaceRoot, { recursive: true });
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function writeSkill(index: number): void {
    const skillDir = join(workspaceRoot, '.opencode', 'skill', `projection-${index}`);
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(
      join(skillDir, 'graph-metadata.json'),
      JSON.stringify({
        skill_id: `projection-${index}`,
        family: 'stress',
        category: 'projection',
        domains: ['projection', `domain-${index % 13}`],
        intent_signals: ['projection stress', `intent-${index % 17}`],
        derived: {
          trigger_phrases: [`trigger-${index}`, `shared-${index % 19}`],
          key_topics: ['skill projection'],
        },
      }, null, 2),
      'utf8',
    );
    writeFileSync(
      join(skillDir, 'SKILL.md'),
      [
        '---',
        `name: projection-${index}`,
        `description: Projection stress skill ${index}`,
        '---',
        '',
        '<!-- Keywords: projection, stress, skill graph -->',
        '',
        `# Projection ${index}`,
      ].join('\n'),
      'utf8',
    );
  }

  it('loads 1000+ filesystem skills into a bounded advisor projection', () => {
    for (let index = 0; index < 1_000; index += 1) {
      writeSkill(index);
    }

    const projection = loadAdvisorProjection(workspaceRoot);
    const loadedSkill = projection.skills.find((skill) => skill.id === 'projection-999');

    expect(projection.source).toBe('filesystem');
    expect(projection.skills.length).toBeGreaterThanOrEqual(1_000);
    expect(loadedSkill).toEqual(expect.objectContaining({
      id: 'projection-999',
      lifecycleStatus: 'active',
    }));
    expect(loadedSkill?.derivedTriggers).toContain('trigger-999');
  });

  it('keeps projection output stable across repeated fixture calls', () => {
    const skills = Array.from({ length: 1_000 }, (_, index) => skillProjection(`stable-${index}`));
    const edges: SkillEdgeProjection[] = skills.slice(1).map((skill, index) => ({
      sourceId: skills[index]!.id,
      targetId: skill.id,
      edgeType: 'related',
      weight: 0.5,
      context: 'stress-edge',
    }));

    const snapshots = Array.from({ length: 50 }, () => createFixtureProjection(skills, edges));

    expect(snapshots.every((snapshot) => snapshot.skills.length === 1_000)).toBe(true);
    expect(snapshots.every((snapshot) => snapshot.edges.length === 999)).toBe(true);
    expect(snapshots.map((snapshot) => snapshot.skills[500]?.id)).toEqual(Array(50).fill('stable-500'));
  });

  it('preserves edge-node anomalies and empty edge sets without throwing', () => {
    const emptyProjection = createFixtureProjection([skillProjection('isolated')], []);
    const danglingProjection = createFixtureProjection([skillProjection('edge-target')], [{
      sourceId: 'missing-source',
      targetId: 'edge-target',
      edgeType: 'related',
      weight: 1,
      context: 'dangling stress edge',
    }]);

    expect(emptyProjection.edges).toEqual([]);
    expect(emptyProjection.skills).toHaveLength(1);
    expect(danglingProjection.edges).toEqual([
      expect.objectContaining({
        sourceId: 'missing-source',
        targetId: 'edge-target',
      }),
    ]);
  });
});
