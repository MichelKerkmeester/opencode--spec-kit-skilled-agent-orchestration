// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Lease
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export interface LeaseOptions {
  readonly workspaceRoot: string;
  readonly leaseDbPath?: string;
  readonly ownerId?: string;
  readonly staleAfterMs?: number;
  readonly heartbeatMs?: number;
  readonly now?: () => number;
}

export interface LeaseAcquireResult {
  readonly acquired: boolean;
  readonly ownerId: string;
  readonly reason: 'acquired' | 'held_by_other';
  readonly incumbentOwnerId: string | null;
  readonly staleReclaimed: boolean;
}

export interface LeaseSnapshot {
  readonly workspaceKey: string;
  readonly ownerId: string;
  readonly pid: number;
  readonly acquiredAt: number;
  readonly heartbeatAt: number;
}

export interface SkillGraphLease {
  readonly ownerId: string;
  readonly acquired: boolean;
  readonly result: LeaseAcquireResult;
  heartbeat: () => void;
  release: () => void;
  close: () => void;
}

const DEFAULT_STALE_AFTER_MS = 30_000;
const DEFAULT_HEARTBEAT_MS = 5_000;
const LEASE_RELATIVE_PATH = join('.opencode', 'skill', '.advisor-state', 'skill-graph-daemon-lease.sqlite');

function defaultLeaseDbPath(workspaceRoot: string): string {
  return join(resolve(workspaceRoot), LEASE_RELATIVE_PATH);
}

function workspaceKey(workspaceRoot: string): string {
  return resolve(workspaceRoot);
}

function createOwnerId(): string {
  return `${process.pid}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
}

function ensureSchema(db: Database.Database): void {
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS skill_graph_daemon_lease (
      workspace_key TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      pid INTEGER NOT NULL,
      acquired_at INTEGER NOT NULL,
      heartbeat_at INTEGER NOT NULL
    );
  `);
}

export function openLeaseDatabase(workspaceRoot: string, leaseDbPath?: string): Database.Database {
  const dbPath = leaseDbPath ?? defaultLeaseDbPath(workspaceRoot);
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  ensureSchema(db);
  return db;
}

export function readLeaseSnapshot(
  workspaceRoot: string,
  options: Pick<LeaseOptions, 'leaseDbPath'> = {},
): LeaseSnapshot | null {
  const db = openLeaseDatabase(workspaceRoot, options.leaseDbPath);
  try {
    const row = db.prepare(`
      SELECT workspace_key, owner_id, pid, acquired_at, heartbeat_at
      FROM skill_graph_daemon_lease
      WHERE workspace_key = ?
    `).get(workspaceKey(workspaceRoot)) as {
      workspace_key: string;
      owner_id: string;
      pid: number;
      acquired_at: number;
      heartbeat_at: number;
    } | undefined;
    if (!row) return null;
    return {
      workspaceKey: row.workspace_key,
      ownerId: row.owner_id,
      pid: row.pid,
      acquiredAt: row.acquired_at,
      heartbeatAt: row.heartbeat_at,
    };
  } finally {
    db.close();
  }
}

export function acquireSkillGraphLease(options: LeaseOptions): SkillGraphLease {
  const workspace = workspaceKey(options.workspaceRoot);
  const ownerId = options.ownerId ?? createOwnerId();
  const staleAfterMs = options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS;
  const heartbeatMs = options.heartbeatMs ?? DEFAULT_HEARTBEAT_MS;
  const now = options.now ?? (() => Date.now());
  const db = openLeaseDatabase(options.workspaceRoot, options.leaseDbPath);
  let acquired = false;

  const reserve = db.transaction((): LeaseAcquireResult => {
    const currentTime = now();
    const row = db.prepare(`
      SELECT owner_id, heartbeat_at
      FROM skill_graph_daemon_lease
      WHERE workspace_key = ?
    `).get(workspace) as { owner_id: string; heartbeat_at: number } | undefined;

    const staleReclaimed = Boolean(row && currentTime - row.heartbeat_at >= staleAfterMs);
    if (row && !staleReclaimed && row.owner_id !== ownerId) {
      return {
        acquired: false,
        ownerId,
        reason: 'held_by_other',
        incumbentOwnerId: row.owner_id,
        staleReclaimed: false,
      };
    }

    db.prepare(`
      INSERT INTO skill_graph_daemon_lease (workspace_key, owner_id, pid, acquired_at, heartbeat_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(workspace_key) DO UPDATE SET
        owner_id = excluded.owner_id,
        pid = excluded.pid,
        acquired_at = excluded.acquired_at,
        heartbeat_at = excluded.heartbeat_at
    `).run(workspace, ownerId, process.pid, currentTime, currentTime);

    return {
      acquired: true,
      ownerId,
      reason: 'acquired',
      incumbentOwnerId: row?.owner_id ?? null,
      staleReclaimed,
    };
  });

  const result = reserve();
  acquired = result.acquired;
  let heartbeatTimer: NodeJS.Timeout | null = null;

  function heartbeat(): void {
    if (!acquired) return;
    const currentTime = now();
    db.prepare(`
      UPDATE skill_graph_daemon_lease
      SET heartbeat_at = ?, pid = ?
      WHERE workspace_key = ? AND owner_id = ?
    `).run(currentTime, process.pid, workspace, ownerId);
  }

  function release(): void {
    if (!acquired) return;
    db.prepare('DELETE FROM skill_graph_daemon_lease WHERE workspace_key = ? AND owner_id = ?')
      .run(workspace, ownerId);
    acquired = false;
  }

  function close(): void {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    release();
    db.close();
  }

  if (acquired && heartbeatMs > 0) {
    heartbeatTimer = setInterval(heartbeat, heartbeatMs);
    heartbeatTimer.unref?.();
  }

  return {
    ownerId,
    get acquired() {
      return acquired;
    },
    result,
    heartbeat,
    release,
    close,
  };
}

export const __testables = {
  defaultLeaseDbPath,
  workspaceKey,
};
