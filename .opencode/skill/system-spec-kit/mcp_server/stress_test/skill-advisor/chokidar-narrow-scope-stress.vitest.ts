import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { discoverWatchTargets } from '../../skill_advisor/lib/daemon/watcher.js';

describe('sa-001 — Chokidar narrow-scope watcher', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-001-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function write(relativePath: string, content = 'fixture\n'): void {
    const filePath = join(tmpDir, relativePath);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
  }

  function writeSkill(slug: string): void {
    write(`.opencode/skill/${slug}/SKILL.md`, [
      '---',
      `name: ${slug}`,
      'description: Stress fixture',
      'allowed-tools: []',
      '---',
      '',
    ].join('\n'));
    write(`.opencode/skill/${slug}/graph-metadata.json`, JSON.stringify({
      schema_version: 1,
      skill_id: slug,
      family: 'stress',
      category: 'watcher',
      domains: ['stress'],
      intent_signals: ['watcher'],
      edges: {},
    }, null, 2));
  }

  it('narrows discovery to SKILL.md and graph-metadata.json amid 100 unrelated files', async () => {
    writeSkill('alpha');
    for (let index = 0; index < 125; index += 1) {
      write(`.opencode/skill/alpha/noise/file-${index}.txt`, `noise-${index}\n`);
    }

    const targets = discoverWatchTargets(tmpDir);
    const targetNames = targets.map((target) => target.path.replace(tmpDir, ''));

    expect(targets).toHaveLength(2);
    expect(targetNames).toEqual([
      '/.opencode/skill/alpha/SKILL.md',
      '/.opencode/skill/alpha/graph-metadata.json',
    ]);
    expect(targets.every((target) => target.reason === 'skill-md' || target.reason === 'graph-metadata')).toBe(true);
  });

  it('discovers narrow targets under 100ms with deep unrelated directories', async () => {
    writeSkill('alpha');
    for (let index = 0; index < 40; index += 1) {
      write(`.opencode/skill/alpha/deep/a/b/c/d/e/f/noise-${index}.md`, '# ignored\n');
      write(`.opencode/skill/alpha/deep/a/b/c/d/e/f/g/h/noise-${index}.json`, '{}\n');
    }

    const startedAt = performance.now();
    const targets = discoverWatchTargets(tmpDir);
    const elapsedMs = performance.now() - startedAt;

    expect(targets).toHaveLength(2);
    expect(elapsedMs).toBeLessThan(100);
  });
});
