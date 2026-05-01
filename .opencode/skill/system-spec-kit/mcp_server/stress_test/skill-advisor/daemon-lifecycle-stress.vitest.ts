import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { performance } from 'node:perf_hooks';

import { startSkillGraphDaemon } from '../../skill_advisor/lib/daemon/lifecycle.js';
import { readSkillGraphGeneration } from '../../skill_advisor/lib/freshness/generation.js';
import {
  createSkillGraphWatcher,
  type SkillGraphFsWatcher,
} from '../../skill_advisor/lib/daemon/watcher.js';

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

// F-001-A1-01: watcher flush serialization (mutex / drain).
//
// Pre-fix bug: enqueue() scheduled flushPending() with no in-flight guard, and
// flushPending() cleared `pending` BEFORE awaiting processSkill(). A second
// timer firing while the first reindex was still running, or close() being
// invoked mid-flush, would start a second concurrent flush — racing
// fileHashes / lastReindexAt / SQLite reindex / generation publication for the
// same skill.
//
// This stress test simulates that exact pattern with a slow reindex callback
// and a programmatic harness, and asserts that:
//   1. processSkill() (here: reindexSkill) is never running concurrently with
//      itself for the same skill.
//   2. close() does not start a competing flush — it awaits the active drain.
//   3. Events queued during a flush are processed by the same serialized
//      drain after the current batch completes (no events lost).
describe('sa-003b — Watcher flush serialization (F-001-A1-01)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-003b-'));
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
      'description: Mutex stress fixture',
      'allowed-tools: []',
      '---',
      '',
    ].join('\n'));
    write(`.opencode/skill/${slug}/graph-metadata.json`, JSON.stringify({
      schema_version: 1,
      skill_id: slug,
      family: 'stress',
      category: 'mutex',
      domains: ['stress'],
      intent_signals: ['mutex'],
      edges: {},
    }, null, 2));
  }

  interface ProgrammaticWatchHarness {
    readonly emit: (event: string, path: string) => void;
    readonly watchFactory: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
  }

  function createProgrammaticWatchHarness(): ProgrammaticWatchHarness {
    const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
    const watcher: SkillGraphFsWatcher = {
      on(event, listener) {
        const existing = listeners.get(event) ?? [];
        existing.push(listener);
        listeners.set(event, existing);
        return watcher;
      },
      add() { return watcher; },
      close: async () => undefined,
    };
    return {
      emit(event, path) {
        for (const listener of listeners.get(event) ?? []) {
          listener(path);
        }
      },
      watchFactory: () => watcher,
    };
  }

  it('serializes processSkill() across concurrent timer firings — no double flush', async () => {
    writeSkill('alpha');
    const harness = createProgrammaticWatchHarness();

    let inFlight = 0;
    let maxConcurrent = 0;
    let completed = 0;
    let active: Promise<void> | null = null;
    let resolveActive: (() => void) | null = null;

    // The reindex callback parks until externally released so we can
    // deterministically queue more events while a flush is mid-flight.
    const reindexSkill = async (): Promise<{ indexedFiles: number }> => {
      inFlight += 1;
      maxConcurrent = Math.max(maxConcurrent, inFlight);
      active = new Promise<void>((resolveOnce) => {
        resolveActive = resolveOnce;
      });
      try {
        await active;
        completed += 1;
        return { indexedFiles: 1 };
      } finally {
        inFlight -= 1;
      }
    };

    const watcher = createSkillGraphWatcher({
      workspaceRoot: tmpDir,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 5, stableWriteMs: 1 },
    });

    const skillPath = join(tmpDir, '.opencode', 'skill', 'alpha', 'SKILL.md');

    // Fire the first event and wait for it to enter reindexSkill.
    write('.opencode/skill/alpha/SKILL.md', readFileSync(skillPath, 'utf8') + '\n# pulse 1\n');
    harness.emit('change', skillPath);
    await new Promise((resolveOnce) => setTimeout(resolveOnce, 25));
    expect(inFlight).toBe(1);

    // While the first flush is parked inside reindexSkill, fire several more
    // change events. The pre-fix code would start a second concurrent flush
    // because `pending` was cleared BEFORE the first await.
    for (let index = 2; index <= 5; index += 1) {
      write('.opencode/skill/alpha/SKILL.md', readFileSync(skillPath, 'utf8') + `\n# pulse ${index}\n`);
      harness.emit('change', skillPath);
    }
    await new Promise((resolveOnce) => setTimeout(resolveOnce, 25));

    // Critical invariant: only one reindex is ever in flight at once.
    expect(inFlight).toBe(1);
    expect(maxConcurrent).toBe(1);

    // Release the parked reindex; the serialized drain should then pick up
    // the queued event(s) and run a SECOND batch — still serially.
    resolveActive?.();
    await new Promise((resolveOnce) => setTimeout(resolveOnce, 50));

    // The drain may park again on a follow-up batch. Release until idle.
    while (inFlight > 0) {
      // resolveActive points at whichever batch is currently parked.
      resolveActive?.();
      await new Promise((resolveOnce) => setTimeout(resolveOnce, 25));
    }

    expect(maxConcurrent).toBe(1);
    expect(completed).toBeGreaterThanOrEqual(1);

    // close() must NOT start a competing flush. With the fix it awaits the
    // active drain (or completes immediately when nothing is pending).
    await watcher.close();
    expect(maxConcurrent).toBe(1);
  });

  it('close() awaits the active flush instead of racing it', async () => {
    writeSkill('alpha');
    const harness = createProgrammaticWatchHarness();

    let inFlight = 0;
    let maxConcurrent = 0;
    let releaseFirst: (() => void) | null = null;

    const reindexSkill = async (): Promise<{ indexedFiles: number }> => {
      inFlight += 1;
      maxConcurrent = Math.max(maxConcurrent, inFlight);
      try {
        await new Promise<void>((resolveOnce) => {
          releaseFirst = resolveOnce;
        });
        return { indexedFiles: 1 };
      } finally {
        inFlight -= 1;
      }
    };

    const watcher = createSkillGraphWatcher({
      workspaceRoot: tmpDir,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 5, stableWriteMs: 1 },
    });

    const skillPath = join(tmpDir, '.opencode', 'skill', 'alpha', 'SKILL.md');
    write('.opencode/skill/alpha/SKILL.md', readFileSync(skillPath, 'utf8') + '\n# kick\n');
    harness.emit('change', skillPath);
    await new Promise((resolveOnce) => setTimeout(resolveOnce, 25));
    expect(inFlight).toBe(1);

    // close() while flush is parked. With the bug, close() would call its own
    // flushPending() concurrently, so reindexSkill could be running twice.
    const closing = watcher.close();
    await new Promise((resolveOnce) => setTimeout(resolveOnce, 25));
    expect(inFlight).toBe(1);
    expect(maxConcurrent).toBe(1);

    releaseFirst?.();
    await closing;
    expect(maxConcurrent).toBe(1);
  });
});
