import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { startSkillGraphDaemon } from '../../skill_advisor/lib/daemon/lifecycle.js';
import { readSkillGraphGeneration } from '../../skill_advisor/lib/freshness/generation.js';
import type { SkillGraphFsWatcher } from '../../skill_advisor/lib/daemon/watcher.js';

describe('sa-003 — Daemon lifecycle restarts', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-003-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function write(relativePath: string, content: string): void {
    const filePath = join(tmpDir, relativePath);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
  }

  function writeSkill(slug: string): void {
    write(`.opencode/skill/${slug}/SKILL.md`, [
      '---',
      `name: ${slug}`,
      'description: Lifecycle stress fixture',
      'allowed-tools: []',
      '---',
      '',
    ].join('\n'));
    write(`.opencode/skill/${slug}/graph-metadata.json`, JSON.stringify({
      schema_version: 1,
      skill_id: slug,
      family: 'stress',
      category: 'lifecycle',
      domains: ['stress'],
      intent_signals: ['lifecycle'],
      edges: {},
    }, null, 2));
  }

  function watchFactory(): SkillGraphFsWatcher {
    const watcher: SkillGraphFsWatcher = {
      on: () => watcher,
      add: () => watcher,
      close: async () => undefined,
    };
    return watcher;
  }

  it('survives 50 boot/shutdown cycles under 10s without EMFILE', async () => {
    writeSkill('alpha');
    const startedAt = performance.now();
    const errors: unknown[] = [];

    for (let index = 0; index < 50; index += 1) {
      try {
        const daemon = await startSkillGraphDaemon({
          workspaceRoot: tmpDir,
          leaseDbPath: join(tmpDir, `lease-${index}.sqlite`),
          quarantineDbPath: join(tmpDir, `quarantine-${index}.sqlite`),
          ownerId: `daemon-${index}`,
          heartbeatMs: 0,
          watchFactory,
          reindexSkill: async () => ({ indexedFiles: 0 }),
        });
        expect(daemon.active).toBe(true);
        await daemon.shutdown(`cycle-${index}`);
      } catch (error: unknown) {
        errors.push(error);
      }
    }

    const elapsedMs = performance.now() - startedAt;
    expect(errors.map((error) => String(error))).not.toContain('Error: EMFILE');
    expect(errors).toHaveLength(0);
    expect(elapsedMs).toBeLessThan(10_000);
  });

  it('keeps status envelope stable across restarts with monotonic generation', async () => {
    writeSkill('alpha');
    const generations: number[] = [];
    const watchedPathCounts: number[] = [];

    for (let index = 0; index < 5; index += 1) {
      const daemon = await startSkillGraphDaemon({
        workspaceRoot: tmpDir,
        leaseDbPath: join(tmpDir, 'lease.sqlite'),
        quarantineDbPath: join(tmpDir, 'quarantine.sqlite'),
        ownerId: `daemon-${index}`,
        heartbeatMs: 0,
        watchFactory,
        reindexSkill: async () => ({ indexedFiles: 0 }),
      });
      const status = daemon.status();
      generations.push(status.generation);
      watchedPathCounts.push(status.watcher.watchedPaths);
      await daemon.shutdown(`restart-${index}`);
    }

    const finalGeneration = readSkillGraphGeneration(tmpDir).generation;
    expect(new Set(watchedPathCounts)).toEqual(new Set([2]));
    expect(generations.every((value, index, all) => index === 0 || value >= all[index - 1]!)).toBe(true);
    expect(finalGeneration).toBeGreaterThanOrEqual(generations.at(-1) ?? 0);
  });
});
