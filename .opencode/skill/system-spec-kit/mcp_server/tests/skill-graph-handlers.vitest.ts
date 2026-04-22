import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleSkillGraphQuery } from '../handlers/skill-graph/query.js';
import { handleSkillGraphScan } from '../handlers/skill-graph/scan.js';
import { closeDb, getDb, indexSkillMetadata, initDb } from '../lib/skill-graph/skill-graph-db.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

function writeGraphMetadata(skillRoot: string, skillId: string, edges: Record<string, unknown[]> = {}): void {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: skillId,
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: [skillId],
    derived: {},
    edges,
  }), 'utf8');
}

function parsePayload(result: HandlerResponse): Record<string, unknown> {
  return JSON.parse(result.content[0].text) as Record<string, unknown>;
}

function assertNoInternalFields(value: unknown, path = 'root'): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNoInternalFields(entry, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    expect(Object.keys(record), path).not.toContain('sourcePath');
    expect(Object.keys(record), path).not.toContain('contentHash');
    for (const [key, nestedValue] of Object.entries(record)) {
      assertNoInternalFields(nestedValue, `${path}.${key}`);
    }
  }
}

describe('skill graph handlers', () => {
  afterEach(() => {
    closeDb();
    vi.restoreAllMocks();
  });

  it('redacts internal node fields from every query response shape', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-handlers-'));
    const skillRoot = join(root, 'skills');

    try {
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha', {
        depends_on: [{ target: 'beta', weight: 0.8, context: 'alpha uses beta' }],
      });
      writeGraphMetadata(skillRoot, 'beta', {
        enhances: [{ target: 'alpha', weight: 0.5, context: 'beta complements alpha' }],
      });
      writeGraphMetadata(skillRoot, 'gamma');
      indexSkillMetadata(skillRoot);

      const queryResults = await Promise.all([
        handleSkillGraphQuery({ queryType: 'depends_on', skillId: 'alpha' }),
        handleSkillGraphQuery({ queryType: 'dependents', skillId: 'beta' }),
        handleSkillGraphQuery({ queryType: 'enhances', skillId: 'beta' }),
        handleSkillGraphQuery({ queryType: 'enhanced_by', skillId: 'alpha' }),
        handleSkillGraphQuery({ queryType: 'family_members', family: 'system' }),
        handleSkillGraphQuery({ queryType: 'transitive_path', sourceSkillId: 'alpha', targetSkillId: 'beta' }),
        handleSkillGraphQuery({ queryType: 'hub_skills', minInbound: 1 }),
        handleSkillGraphQuery({ queryType: 'orphans' }),
        handleSkillGraphQuery({ queryType: 'subgraph', skillId: 'alpha', depth: 2 }),
      ]);

      for (const result of queryResults) {
        const payload = parsePayload(result);
        expect(payload.status).toBe('ok');
        assertNoInternalFields(payload.data);
      }
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('preserves the live graph when a custom scan root contains no skills', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-handlers-'));
    const workspace = join(root, 'workspace');
    const skillRoot = join(workspace, '.opencode', 'skill');
    const emptyRoot = join(workspace, 'empty-skills');

    try {
      mkdirSync(emptyRoot, { recursive: true });
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha');

      const firstScan = parsePayload(await handleSkillGraphScan({}));
      expect(firstScan.status).toBe('ok');
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([{ id: 'alpha' }]);

      const emptyScan = parsePayload(await handleSkillGraphScan({ skillsRoot: 'empty-skills' }));

      expect(emptyScan.status).toBe('ok');
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([{ id: 'alpha' }]);
      expect(emptyScan.data).toMatchObject({
        scannedFiles: 0,
        indexedFiles: 0,
        deletedNodes: 0,
      });
      expect(JSON.stringify(emptyScan.data)).toContain('EMPTY-SKILL-SCAN');
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
