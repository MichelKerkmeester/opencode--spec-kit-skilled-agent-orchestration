// ───────────────────────────────────────────────────────────────
// MODULE: Daemon Watcher Resource-Leak / Silent-Error Tests (049/005)
// ───────────────────────────────────────────────────────────────
//
// Covers findings closed by sub-phase 049/005:
//   - F-003-A3-01: refreshTargets() unwatches removed paths and prunes caches.
//   - F-003-A3-02: diagnostics ring buffer caps at 100 entries; aggregate
//     counters survive rotation and are exposed via the COUNTERS: synthetic
//     line at the head of status().diagnostics.
//   - F-004-A4-04: malformed graph-metadata.json records a
//     MALFORMED_GRAPH_METADATA diagnostic with the underlying reason instead
//     of silently dropping derived key-file watch targets.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSkillGraphWatcher,
  discoverWatchTargets,
  type SkillGraphFsWatcher,
} from '../lib/daemon/watcher.js';

interface WatchHarness {
  readonly emit: (event: string, path: string) => void;
  readonly added: string[];
  readonly removed: string[];
  readonly watchFactory: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
  readonly watcher: SkillGraphFsWatcher;
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

function writeSkill(
  root: string,
  slug: string,
  options: { malformedMetadata?: 'invalid-json' | 'derived-string' | 'key-files-string'; keyFiles?: string[] } = {},
): void {
  const dir = skillDir(root, slug);
  write(join(dir, 'SKILL.md'), [
    '---',
    `name: ${slug}`,
    'description: Test skill',
    'allowed-tools: []',
    '---',
    `# ${slug}`,
    '',
  ].join('\n'));
  let metadataContent: string;
  if (options.malformedMetadata === 'invalid-json') {
    metadataContent = '{this is not valid json';
  } else if (options.malformedMetadata === 'derived-string') {
    metadataContent = JSON.stringify({ schema_version: 1, skill_id: slug, derived: 'this should be an object' });
  } else if (options.malformedMetadata === 'key-files-string') {
    metadataContent = JSON.stringify({ schema_version: 1, skill_id: slug, derived: { key_files: 'should-be-array' } });
  } else {
    metadataContent = JSON.stringify({
      schema_version: 1,
      skill_id: slug,
      family: 'system',
      category: 'test',
      domains: ['test'],
      intent_signals: ['test'],
      derived: options.keyFiles ? { key_files: options.keyFiles } : undefined,
      edges: {},
    }, null, 2);
  }
  write(join(dir, 'graph-metadata.json'), metadataContent);
}

function createWatchHarness(): WatchHarness {
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>();
  const added: string[] = [];
  const removed: string[] = [];
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
    unwatch(paths) {
      removed.push(...(Array.isArray(paths) ? paths : [paths]));
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
    removed,
    watcher,
    watchFactory: () => watcher,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  for (const root of workspaces.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('F-003-A3-01: refreshTargets unwatches removed paths and prunes caches', () => {
  it('calls watcher.unwatch() for paths that disappear between scans', async () => {
    const root = workspace('skill-graph-unwatch');
    writeSkill(root, 'alpha');
    writeSkill(root, 'beta');
    const harness = createWatchHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    const initialCount = watcher.status().watchedPaths;
    expect(initialCount).toBeGreaterThan(0);

    // Remove the beta skill from disk; refreshTargets() should detect the
    // removed paths and forward them to watcher.unwatch().
    rmSync(skillDir(root, 'beta'), { recursive: true, force: true });
    watcher.refreshTargets();

    // beta had two watch targets (SKILL.md + graph-metadata.json), so unwatch
    // should have received both.
    expect(harness.removed.length).toBeGreaterThanOrEqual(2);
    expect(harness.removed.some((entry) => entry.includes('beta'))).toBe(true);
    expect(watcher.status().watchedPaths).toBeLessThan(initialCount);

    await watcher.close();
  });

  it('keeps the public refreshTargets signature stable when watcher.unwatch is missing', async () => {
    // Ensures harnesses without unwatch() (legacy fixtures) still function.
    const root = workspace('skill-graph-unwatch-legacy');
    writeSkill(root, 'alpha');
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
      // Note: no unwatch property at all.
      close: async () => undefined,
    };

    const watcherInstance = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: () => watcher,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    rmSync(skillDir(root, 'alpha'), { recursive: true, force: true });
    expect(() => watcherInstance.refreshTargets()).not.toThrow();
    await watcherInstance.close();
  });
});

describe('F-003-A3-02: diagnostics ring buffer caps at 100 entries with aggregate counters', () => {
  it('drops oldest diagnostics when more than 100 fire and surfaces a COUNTERS line', async () => {
    const root = workspace('skill-graph-ringbuffer');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    // Fire 250 watcher errors. Without the cap diagnostics would grow to 250;
    // with the cap diagnostics holds at most 100 entries plus the synthetic
    // COUNTERS: line prepended by status().
    for (let attempt = 0; attempt < 250; attempt += 1) {
      harness.emit('error', `simulated error #${attempt}`);
    }

    const status = watcher.status();
    // COUNTERS: + at most 100 ring buffer entries = 101 total.
    expect(status.diagnostics.length).toBeLessThanOrEqual(101);
    // The buffered entries are the MOST RECENT, not the oldest, so the very
    // first error (#0) must be gone but the last (#249) must remain.
    expect(status.diagnostics.some((line) => line.includes('simulated error #249'))).toBe(true);
    expect(status.diagnostics.some((line) => line.includes('simulated error #0:'))).toBe(false);
    // COUNTERS line preserves the long-tail aggregate.
    const counterLine = status.diagnostics.find((line) => line.startsWith('COUNTERS:'));
    expect(counterLine).toBeDefined();
    expect(counterLine).toContain('WATCHER_ERROR=250');

    await watcher.close();
  });

  it('omits the COUNTERS line when no diagnostics have been recorded', async () => {
    const root = workspace('skill-graph-empty-counters');
    writeSkill(root, 'alpha');
    const harness = createWatchHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    expect(watcher.status().diagnostics).toEqual([]);
    await watcher.close();
  });
});

describe('F-004-A4-04: malformed graph-metadata.json records diagnostic instead of silently dropping targets', () => {
  it('records MALFORMED_GRAPH_METADATA diagnostic when JSON.parse fails', async () => {
    const root = workspace('skill-graph-malformed-json');
    writeSkill(root, 'alpha', { malformedMetadata: 'invalid-json' });
    const harness = createWatchHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    const status = watcher.status();
    const malformedLine = status.diagnostics.find((line) => line.startsWith('MALFORMED_GRAPH_METADATA:'));
    expect(malformedLine).toBeDefined();
    expect(malformedLine).toContain('graph-metadata.json');
    // Counter survives even if/when the buffer rotates.
    const counterLine = status.diagnostics.find((line) => line.startsWith('COUNTERS:'));
    expect(counterLine).toContain('MALFORMED_GRAPH_METADATA=');

    await watcher.close();
  });

  it('records a diagnostic when derived is the wrong shape', async () => {
    const root = workspace('skill-graph-derived-string');
    writeSkill(root, 'alpha', { malformedMetadata: 'derived-string' });
    const harness = createWatchHarness();

    const watcher = createSkillGraphWatcher({
      workspaceRoot: root,
      watchFactory: harness.watchFactory,
      reindexSkill: vi.fn(async () => ({ indexedFiles: 1 })),
      backpressure: { debounceMs: 20, stableWriteMs: 5 },
    });

    const status = watcher.status();
    const malformedLine = status.diagnostics.find((line) => line.startsWith('MALFORMED_GRAPH_METADATA:'));
    expect(malformedLine).toBeDefined();
    expect(malformedLine).toMatch(/derived field is not an object/);

    await watcher.close();
  });

  it('discoverWatchTargets stays backward-compatible without the callback', () => {
    const root = workspace('skill-graph-discover-bc');
    writeSkill(root, 'alpha', { malformedMetadata: 'invalid-json' });
    // Two-arg signature must still work without the new optional callback.
    const targets = discoverWatchTargets(root);
    // skill.md still found; only the derived-key-files were dropped.
    expect(targets.some((target) => target.reason === 'skill-md')).toBe(true);
  });
});
