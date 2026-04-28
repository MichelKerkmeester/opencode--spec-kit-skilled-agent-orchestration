// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness Rebuild From Source
// ───────────────────────────────────────────────────────────────

import { existsSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { runWithBusyRetry } from '../daemon/watcher.js';
import { checkSqliteIntegrity } from './sqlite-integrity.js';
import type { SkillGraphTrustState } from './trust-state.js';

export interface RebuildFromSourceOptions<TSummary = unknown> {
  readonly dbPath: string;
  readonly skillsRoot: string;
  readonly indexer: (skillsRoot: string) => TSummary | Promise<TSummary>;
  readonly backupSuffix?: string;
}

export interface RebuildFromSourceResult<TSummary = unknown> {
  readonly rebuilt: boolean;
  readonly stateDuringRebuild: SkillGraphTrustState;
  readonly stateAfterRebuild: SkillGraphTrustState;
  readonly backupPath: string | null;
  readonly summary: TSummary | null;
  readonly diagnostics: string[];
}

const DEFAULT_REBUILD_BUSY_RETRY_DELAYS_MS = [250, 500, 1_000] as const;
const rebuildLeases = new Map<string, Promise<void>>();

async function withRebuildLease<T>(dbPath: string, operation: () => Promise<T>): Promise<T> {
  const previous = rebuildLeases.get(dbPath);
  if (previous) {
    await previous.catch(() => undefined);
  }

  let releaseLease!: () => void;
  const current = new Promise<void>((resolve) => {
    releaseLease = resolve;
  });
  rebuildLeases.set(dbPath, current);

  try {
    return await operation();
  } finally {
    if (rebuildLeases.get(dbPath) === current) {
      rebuildLeases.delete(dbPath);
    }
    releaseLease();
  }
}

export { checkSqliteIntegrity } from './sqlite-integrity.js';

export async function rebuildFromSource<TSummary = unknown>(
  options: RebuildFromSourceOptions<TSummary>,
): Promise<RebuildFromSourceResult<TSummary>> {
  return withRebuildLease(options.dbPath, () => runWithBusyRetry(async () => {
    const integrity = checkSqliteIntegrity(options.dbPath);
    if (integrity.ok) {
      return {
        rebuilt: false,
        stateDuringRebuild: 'live',
        stateAfterRebuild: 'live',
        backupPath: null,
        summary: null,
        diagnostics: [],
      };
    }

    const suffix = options.backupSuffix ?? `${Date.now()}.corrupt`;
    const backupPath = join(dirname(options.dbPath), `${options.dbPath.split('/').pop()}.${suffix}`);
    const diagnostics = [`corrupt-sqlite:${integrity.reason}`];

    if (existsSync(options.dbPath)) {
      try {
        renameSync(options.dbPath, backupPath);
      } catch {
        rmSync(options.dbPath, { force: true });
        diagnostics.push('corrupt-sqlite:backup-rename-failed');
      }
    }

    const summary = await options.indexer(options.skillsRoot);
    return {
      rebuilt: true,
      stateDuringRebuild: 'unavailable',
      stateAfterRebuild: 'live',
      backupPath: existsSync(backupPath) ? backupPath : null,
      summary,
      diagnostics,
    };
  }, DEFAULT_REBUILD_BUSY_RETRY_DELAYS_MS));
}
