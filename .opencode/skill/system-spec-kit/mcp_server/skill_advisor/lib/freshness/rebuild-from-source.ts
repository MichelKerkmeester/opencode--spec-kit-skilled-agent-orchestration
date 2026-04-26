// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness Rebuild From Source
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { existsSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { errorMessage } from '../utils/error-format.js';
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

function isCorruptionError(error: unknown): boolean {
  return /database disk image is malformed|file is not a database|SQLITE_CORRUPT|SQLITE_NOTADB|malformed/i.test(errorMessage(error));
}

export function checkSqliteIntegrity(dbPath: string): { ok: true } | { ok: false; reason: string } {
  if (!existsSync(dbPath)) {
    return { ok: false, reason: 'SQLITE_ABSENT' };
  }

  let db: Database.Database | null = null;
  try {
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
    const row = db.prepare('PRAGMA quick_check').get() as { quick_check?: string } | undefined;
    const value = row?.quick_check ?? 'unknown';
    if (value !== 'ok') {
      return { ok: false, reason: `SQLITE_QUICK_CHECK_${value}` };
    }
    return { ok: true };
  } catch (error: unknown) {
    if (isCorruptionError(error)) {
      return {
        ok: false,
        reason: errorMessage(error),
      };
    }
    throw error;
  } finally {
    db?.close();
  }
}

export async function rebuildFromSource<TSummary = unknown>(
  options: RebuildFromSourceOptions<TSummary>,
): Promise<RebuildFromSourceResult<TSummary>> {
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
}
