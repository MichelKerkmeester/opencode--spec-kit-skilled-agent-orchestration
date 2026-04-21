// ───────────────────────────────────────────────────────────────
// MODULE: Daemon Freshness Foundation Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { acquireSkillGraphLease, readLeaseSnapshot } from '../lib/daemon/lease.js';
import { startSkillGraphDaemon } from '../lib/daemon/lifecycle.js';
import {
  countActiveQuarantines,
  createSkillGraphWatcher,
  discoverWatchTargets,
  type SkillGraphFsWatcher,
} from '../lib/daemon/watcher.js';
import { clearCacheInvalidationListeners, getLastCacheInvalidation } from '../lib/freshness/cache-invalidation.js';
import { publishAfterCommit, readSkillGraphGeneration } from '../lib/freshness/generation.js';
import { rebuildFromSource } from '../lib/freshness/rebuild-from-source.js';
import { createTrustState, failOpenTrustState } from '../lib/freshness/trust-state.js';

interface WatchHarness {
  readonly emit: (event: string, path: string) => void;
  readonly added: string[];
  readonly watchFactory: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
}

const workspaces: string[] = [];

function workspace(name: string): string {
  const root = join(tmpdir(), `${name}-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  workspaces.push(root);
  return root;
}

function write(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function skillDir(root: string, slug: string): string {
  return join(root, '.opencode', 'skill', slug);
}

function writeSkill(root: string, slug: string, options: { malformedSkill?: boolean; keyFiles?: string[] } = {}): void {
  const dir = skillDir(root, slug);
  const skillContent = options.malformedSkill
    ? `# ${slug}\n`
    : [
      '---',
      `name: ${slug}`,
      'description: Test skill',
      'allowed-tools: []',
      '---',
      `# ${slug}`,
      '',
    ].join('\n');
  write(join(dir, 'SKILL.md'), skillContent);
  write(join(dir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: slug,
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: ['test'],
    derived: options.keyFiles ? { key_files: options.keyFiles } : undefined,
    edges: {},
  }, null, 2));
}

function createWatchHarness(): WatchHarness {
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  const added: string[] = [];
  const watcher: SkillGraphFsWatcher = {
    on(event, listener) {
      const existing = listeners.get(event) ?? [];
      existing.push(listener);
      listeners.set(event, existing);
      return watcher;
    },
    add(paths) {
      added.push(...(Array.isArray(paths) ? paths : [paths]));
      return watcher;
    },
    close: async () => undefined,
  };
  return {
    emit(event, path) {
      for (const listener of listeners.get(event) ?? []) {
        listener(path);
      }
    },
    added,
    watchFactory: () => watcher,
  };
}

async function advance(ms: number): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms);
  await Promise.resolve();
}

beforeEach(() => {
  vi.useFakeTimers();
  clearCacheInvalidationListeners();
});

afterEach(() => {
  vi.useRealTimers();
  clearCacheInvalidationListeners();
  for (const root of workspaces.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('skill graph watcher foundation', () => {
  it('AC-1 reindexes a changed SKILL.md and bumps generation after the reindex commit', async () => {
    const root = workspace('skill-graph-ac1');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();
    const reindexSkill = vi.fn(async () => ({ indexedFiles: 1 }));

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20, stableWriteMs: 10 },
    });

    const changed = join(skillDir(root, 'alpha'), 'SKILL.md');
    write(changed, readFileSync(changed, 'utf8') + '\nextra\n');
    harness.emit('change', changed);
    await advance(25);

    expect(reindexSkill).toHaveBeenCalledTimes(1);
    expect(readSkillGraphGeneration(root).generation).toBe(1);
    expect(getLastCacheInvalidation()?.changedPaths).toContain(changed);
    await watcher.close();
  });

  it('AC-7 coalesces atomic rename unlink/add into one reindex for the final filename', async () => {
    const root = workspace('skill-graph-rename');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();
    const reindexSkill = vi.fn(async () => ({ indexedFiles: 1 }));
    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20 },
    });

    const changed = join(skillDir(root, 'alpha'), 'graph-metadata.json');
    write(changed, readFileSync(changed, 'utf8').replace('"test"', '"test-renamed"'));
    harness.emit('unlink', changed);
    harness.emit('add', changed);
    await advance(25);

    expect(reindexSkill).toHaveBeenCalledTimes(1);
    await watcher.close();
  });

  it('AC-7 tolerates ENOENT when an editor rename removes a file before debounce fires', async () => {
    const root = workspace('skill-graph-enoent');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();
    const reindexSkill = vi.fn(async () => ({ indexedFiles: 1 }));
    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20 },
    });

    const changed = join(skillDir(root, 'alpha'), 'graph-metadata.json');
    harness.emit('change', changed);
    rmSync(changed, { force: true });
    await advance(25);

    expect(reindexSkill).not.toHaveBeenCalled();
    expect(watcher.status().diagnostics).toEqual([]);
    await watcher.close();
  });

  it('AC-3 retries SQLITE_BUSY with bounded backoff and eventually commits', async () => {
    const root = workspace('skill-graph-busy');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();
    const busy = Object.assign(new Error('SQLITE_BUSY: database is locked'), { code: 'SQLITE_BUSY' });
    const reindexSkill = vi.fn()
      .mockRejectedValueOnce(busy)
      .mockRejectedValueOnce(busy)
      .mockResolvedValue({ indexedFiles: 1 });
    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20, busyRetryDelaysMs: [5, 5, 5] },
    });

    const changed = join(skillDir(root, 'alpha'), 'SKILL.md');
    write(changed, readFileSync(changed, 'utf8') + '\nretry\n');
    harness.emit('change', changed);
    await advance(20);
    await advance(5);
    await advance(5);

    expect(reindexSkill).toHaveBeenCalledTimes(3);
    expect(readSkillGraphGeneration(root).generation).toBe(1);
    await watcher.close();
  });

  it('quarantines malformed SKILL.md and recovers when the file becomes valid', async () => {
    const root = workspace('skill-graph-quarantine');
    const quarantineDbPath = join(root, 'quarantine.sqlite');
    writeSkill(root, 'alpha', { malformedSkill: true });
    const harness = createWatchHarness();
    const reindexSkill = vi.fn(async () => ({ indexedFiles: 1 }));
    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      quarantineDbPath,
      watchFactory: harness.watchFactory,
      reindexSkill,
      backpressure: { debounceMs: 20 },
    });

    const changed = join(skillDir(root, 'alpha'), 'SKILL.md');
    harness.emit('change', changed);
    await advance(25);
    expect(reindexSkill).not.toHaveBeenCalled();
    expect(countActiveQuarantines(root, quarantineDbPath)).toBe(1);

    writeSkill(root, 'alpha');
    harness.emit('change', changed);
    await advance(25);
    expect(reindexSkill).toHaveBeenCalledTimes(1);
    expect(countActiveQuarantines(root, quarantineDbPath)).toBe(0);
    await watcher.close();
  });

  it('adds derived.key_files as dynamic narrow watch targets', () => {
    const root = workspace('skill-graph-key-files');
    write(join(root, 'docs', 'alpha.md'), '# alpha\n');
    writeSkill(root, 'alpha', { keyFiles: ['docs/alpha.md'] });

    const targets = discoverWatchTargets(root);

    expect(targets.map((target) => target.path)).toContain(join(root, 'docs', 'alpha.md'));
  });

  it('rejects absolute, escaping, and symlinked-out derived.key_files watch targets', () => {
    const root = workspace('skill-graph-key-files-contained');
    const outsideRoot = workspace('skill-graph-key-files-outside');
    const outsideSecret = join(outsideRoot, 'secret.md');
    const insideKeyFile = join(root, 'docs', 'alpha.md');
    const outsideLink = join(root, 'docs', 'outside-link.md');
    write(insideKeyFile, '# alpha\n');
    write(outsideSecret, '# secret\n');
    symlinkSync(outsideSecret, outsideLink);
    writeSkill(root, 'alpha', {
      keyFiles: [
        'docs/alpha.md',
        outsideSecret,
        relative(root, outsideSecret),
        'docs/outside-link.md',
      ],
    });

    const targetPaths = discoverWatchTargets(root).map((target) => target.path);

    expect(targetPaths).toContain(insideKeyFile);
    expect(targetPaths).not.toContain(outsideSecret);
    expect(targetPaths).not.toContain(join(root, relative(root, outsideSecret)));
    expect(targetPaths).not.toContain(outsideLink);
  });

  it('opens the reindex-storm circuit breaker and coalesces the burst', async () => {
    const root = workspace('skill-graph-storm');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();
    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: async () => ({ indexedFiles: 1 }),
      backpressure: {
        debounceMs: 20,
        stormEventLimit: 2,
        stormWindowMs: 100,
        circuitCooldownMs: 100,
      },
      now: () => Date.now(),
    });

    const changed = join(skillDir(root, 'alpha'), 'SKILL.md');
    harness.emit('change', changed);
    harness.emit('change', changed);
    harness.emit('change', changed);

    expect(watcher.status().circuitOpen).toBe(true);
    await watcher.close();
  });
});

describe('workspace-scoped single-writer lease', () => {
  it('AC-2 allows only one active daemon writer per workspace', () => {
    const root = workspace('skill-graph-lease');
    const leaseDbPath = join(root, 'lease.sqlite');
    const first = acquireSkillGraphLease({ workspaceRoot: root, leaseDbPath, ownerId: 'first', heartbeatMs: 0 });
    const second = acquireSkillGraphLease({ workspaceRoot: root, leaseDbPath, ownerId: 'second', heartbeatMs: 0 });

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(false);
    expect(second.result.incumbentOwnerId).toBe('first');
    first.close();
    second.close();
  });

  it('AC-4 reclaims a stale lease after heartbeat expiry', () => {
    const root = workspace('skill-graph-stale-lease');
    const leaseDbPath = join(root, 'lease.sqlite');
    let now = 1_000;
    const first = acquireSkillGraphLease({ workspaceRoot: root, leaseDbPath, ownerId: 'first', heartbeatMs: 0, staleAfterMs: 50, now: () => now });
    now = 2_000;
    const second = acquireSkillGraphLease({ workspaceRoot: root, leaseDbPath, ownerId: 'second', heartbeatMs: 0, staleAfterMs: 50, now: () => now });

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(true);
    expect(second.result.staleReclaimed).toBe(true);
    expect(readLeaseSnapshot(root, { leaseDbPath })?.ownerId).toBe('second');
    first.close();
    second.close();
  });
});

describe('freshness and generation foundation', () => {
  it('publishes generation only after the commit callback succeeds', async () => {
    const root = workspace('skill-graph-generation-order');
    await expect(publishAfterCommit(
      () => {
        throw new Error('rollback');
      },
      { workspaceRoot: root, reason: 'failed-commit' },
    )).rejects.toThrow('rollback');
    expect(readSkillGraphGeneration(root).generation).toBe(0);

    await publishAfterCommit(
      () => 'committed',
      { workspaceRoot: root, reason: 'successful-commit', changedPaths: ['alpha'] },
    );
    expect(readSkillGraphGeneration(root).generation).toBe(1);
    expect(getLastCacheInvalidation()?.reason).toBe('successful-commit');
  });

  it('covers all fail-open trust-state transitions', () => {
    expect(createTrustState({ hasSources: true, hasArtifact: true, sourceChanged: false, daemonAvailable: true, generation: 1 }).state).toBe('live');
    expect(createTrustState({ hasSources: true, hasArtifact: true, sourceChanged: true, daemonAvailable: true, generation: 1 }).state).toBe('stale');
    expect(createTrustState({ hasSources: true, hasArtifact: false, sourceChanged: false, daemonAvailable: true, generation: 1 }).state).toBe('absent');
    expect(failOpenTrustState('DAEMON_DOWN').state).toBe('unavailable');
  });

  it('AC-8 detects corrupted SQLite and rebuilds from source', async () => {
    const root = workspace('skill-graph-corrupt');
    const dbPath = join(root, 'skill-graph.sqlite');
    write(dbPath, 'not sqlite');
    const indexer = vi.fn(async () => ({ scannedFiles: 1 }));

    const result = await rebuildFromSource({ dbPath, skillsRoot: join(root, '.opencode', 'skill'), indexer });

    expect(result.rebuilt).toBe(true);
    expect(result.stateDuringRebuild).toBe('unavailable');
    expect(result.stateAfterRebuild).toBe('live');
    expect(result.summary).toEqual({ scannedFiles: 1 });
    expect(indexer).toHaveBeenCalledTimes(1);
  });

  it('valid SQLite skips source rebuild', async () => {
    const root = workspace('skill-graph-valid-db');
    const dbPath = join(root, 'skill-graph.sqlite');
    mkdirSync(dirname(dbPath), { recursive: true });
    const db = new Database(dbPath);
    db.exec('CREATE TABLE ok (id INTEGER PRIMARY KEY);');
    db.close();
    const indexer = vi.fn(async () => ({ scannedFiles: 1 }));

    const result = await rebuildFromSource({ dbPath, skillsRoot: root, indexer });

    expect(result.rebuilt).toBe(false);
    expect(indexer).not.toHaveBeenCalled();
  });

  it('AC-6 fails open when the daemon is absent', () => {
    const result = failOpenTrustState('DAEMON_ABSENT');

    expect(result.state).toBe('unavailable');
    expect(result.reason).toBe('DAEMON_ABSENT');
  });
});

describe('daemon lifecycle', () => {
  it('publishes unavailable before graceful shutdown', async () => {
    const root = workspace('skill-graph-lifecycle');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();
    const daemon = await startSkillGraphDaemon({
      workspaceRoot: root,
      leaseDbPath: join(root, 'lease.sqlite'),
      quarantineDbPath: join(root, 'lease.sqlite'),
      ownerId: 'daemon',
      heartbeatMs: 0,
      watchFactory: harness.watchFactory,
      reindexSkill: async () => ({ indexedFiles: 0 }),
    });

    expect(daemon.active).toBe(true);
    await daemon.shutdown('TEST_SHUTDOWN');

    expect(readSkillGraphGeneration(root).state).toBe('unavailable');
    expect(readSkillGraphGeneration(root).reason).toBe('TEST_SHUTDOWN');
  });

  it('demotes to unavailable during stale-lease takeover and returns to live', async () => {
    const root = workspace('skill-graph-takeover');
    writeSkill(root, 'alpha');
    const leaseDbPath = join(root, 'lease.sqlite');
    let now = 1_000;
    const stale = acquireSkillGraphLease({ workspaceRoot: root, leaseDbPath, ownerId: 'old', heartbeatMs: 0, staleAfterMs: 50, now: () => now });
    now = 2_000;
    const daemon = await startSkillGraphDaemon({
      workspaceRoot: root,
      leaseDbPath,
      quarantineDbPath: leaseDbPath,
      ownerId: 'new',
      heartbeatMs: 0,
      staleAfterMs: 50,
      watchFactory: createWatchHarness().watchFactory,
      reindexSkill: async () => ({ indexedFiles: 0 }),
    });

    expect(daemon.active).toBe(true);
    expect(readSkillGraphGeneration(root).state).toBe('live');
    expect(readSkillGraphGeneration(root).reason).toBe('STALE_LEASE_TAKEOVER_LIVE');
    stale.close();
    await daemon.shutdown('done');
  });
});
