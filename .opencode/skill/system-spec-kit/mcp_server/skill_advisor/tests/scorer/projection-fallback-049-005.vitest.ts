// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Projection SQLite-Fallback Test (049/005, F-004-A4-01)
// ───────────────────────────────────────────────────────────────
//
// Asserts that loadAdvisorProjection() distinguishes three cases:
//   1. SQLite read succeeds → source: 'sqlite'.
//   2. SQLite DB does not exist → source: 'filesystem' (legitimate first run).
//   3. SQLite read THROWS → source: 'filesystem-fallback' with fallbackReason
//      populated AND a console.warn surfaced for operator visibility.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadAdvisorProjection } from '../../lib/scorer/projection.js';

const workspaces: string[] = [];

function workspace(name: string): string {
  const root = join(tmpdir(), `${name}-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  workspaces.push(root);
  return root;
}

function write(filePath: string, content: string | Buffer): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of workspaces.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('F-004-A4-01: loadAdvisorProjection surfaces SQLite failures explicitly', () => {
  it('returns source=filesystem when the SQLite DB does not exist (legitimate first run)', () => {
    const root = workspace('advisor-projection-no-db');
    // Create a single skill on disk so the filesystem projection has content.
    const skillDir = join(root, '.opencode', 'skill', 'sample-skill');
    write(join(skillDir, 'SKILL.md'), [
      '---',
      'name: sample-skill',
      'description: Sample test skill',
      '---',
      '# sample-skill',
      '',
    ].join('\n'));
    write(join(skillDir, 'graph-metadata.json'), JSON.stringify({
      schema_version: 1,
      skill_id: 'sample-skill',
      family: 'system',
      category: 'test',
      domains: ['test'],
      intent_signals: ['test'],
    }));

    const projection = loadAdvisorProjection(root);
    expect(projection.source).toBe('filesystem');
    expect(projection.fallbackReason).toBeUndefined();
  });

  it('returns source=filesystem-fallback with a reason when the SQLite DB is corrupt', () => {
    const root = workspace('advisor-projection-corrupt-db');
    // Write a corrupt sqlite file at the path that loadSqliteProjection looks
    // for. better-sqlite3 will throw when it tries to open this.
    const dbPath = join(root, '.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database', 'skill-graph.sqlite');
    write(dbPath, Buffer.from('this is not a valid SQLite database'));
    // Also add a filesystem skill so the fallback has content to return.
    const skillDir = join(root, '.opencode', 'skill', 'sample-skill');
    write(join(skillDir, 'SKILL.md'), [
      '---',
      'name: sample-skill',
      'description: Sample test skill',
      '---',
      '# sample-skill',
      '',
    ].join('\n'));
    write(join(skillDir, 'graph-metadata.json'), JSON.stringify({
      schema_version: 1,
      skill_id: 'sample-skill',
      family: 'system',
      category: 'test',
    }));

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const projection = loadAdvisorProjection(root);
    expect(projection.source).toBe('filesystem-fallback');
    expect(projection.fallbackReason).toBeDefined();
    expect(projection.fallbackReason!.length).toBeGreaterThan(0);
    expect(warnSpy).toHaveBeenCalled();
    expect(warnSpy.mock.calls[0]?.[0]).toContain('SQLite projection failed');
    // Filesystem fallback still returns the on-disk skill content.
    expect(projection.skills.some((entry) => entry.id === 'sample-skill')).toBe(true);
  });
});
