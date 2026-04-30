import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { performance } from 'node:perf_hooks';

import {
  acquireSkillGraphLease,
  openLeaseDatabase,
  readLeaseSnapshot,
  type SkillGraphLease,
} from '../../skill_advisor/lib/daemon/lease.js';

describe('sa-002 — Single-writer lease', () => {
  let tmpDir: string;
  let leases: SkillGraphLease[];

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'sa-stress-002-'));
    leases = [];
  });

  afterEach(() => {
    for (const lease of leases.splice(0)) {
      lease.close();
    }
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function leaseDbPath(): string {
    return join(tmpDir, 'lease.sqlite');
  }

  it('allows exactly one winner across 10 same-workspace acquisition attempts', async () => {
    const startedAt = performance.now();
    leases = await Promise.all(Array.from({ length: 10 }, async (_, index) => (
      acquireSkillGraphLease({
        workspaceRoot: tmpDir,
        leaseDbPath: leaseDbPath(),
        ownerId: `owner-${index}`,
        heartbeatMs: 0,
      })
    )));
    const elapsedMs = performance.now() - startedAt;

    const winners = leases.filter((lease) => lease.acquired);
    const losers = leases.filter((lease) => !lease.acquired);
    const snapshot = readLeaseSnapshot(tmpDir, { leaseDbPath: leaseDbPath() });

    expect(winners).toHaveLength(1);
    expect(losers).toHaveLength(9);
    expect(losers.every((lease) => lease.result.reason === 'held_by_other')).toBe(true);
    expect(snapshot?.ownerId).toBe(winners[0]?.ownerId);
    expect(elapsedMs).toBeLessThan(250);
  });

  it('reclaims after a holder heartbeat row is deleted', async () => {
    const first = acquireSkillGraphLease({
      workspaceRoot: tmpDir,
      leaseDbPath: leaseDbPath(),
      ownerId: 'first',
      heartbeatMs: 0,
    });
    leases.push(first);
    const db = openLeaseDatabase(tmpDir, leaseDbPath());
    try {
      db.prepare('DELETE FROM skill_graph_daemon_lease WHERE owner_id = ?').run('first');
    } finally {
      db.close();
    }

    const second = acquireSkillGraphLease({
      workspaceRoot: tmpDir,
      leaseDbPath: leaseDbPath(),
      ownerId: 'second',
      heartbeatMs: 0,
    });
    leases.push(second);

    expect(first.acquired).toBe(true);
    expect(second.acquired).toBe(true);
    expect(readLeaseSnapshot(tmpDir, { leaseDbPath: leaseDbPath() })?.ownerId).toBe('second');
  });

  it('exposes heartbeat aging through the lease snapshot and stale takeover path', async () => {
    const now = 10_000;
    const first = acquireSkillGraphLease({
      workspaceRoot: tmpDir,
      leaseDbPath: leaseDbPath(),
      ownerId: 'aged',
      heartbeatMs: 0,
      staleAfterMs: 500,
      now: () => now,
    });
    leases.push(first);
    const db = openLeaseDatabase(tmpDir, leaseDbPath());
    try {
      db.prepare('UPDATE skill_graph_daemon_lease SET heartbeat_at = ? WHERE owner_id = ?')
        .run(now - 1_000, 'aged');
    } finally {
      db.close();
    }

    const agedSnapshot = readLeaseSnapshot(tmpDir, { leaseDbPath: leaseDbPath() });
    const second = acquireSkillGraphLease({
      workspaceRoot: tmpDir,
      leaseDbPath: leaseDbPath(),
      ownerId: 'reclaimer',
      heartbeatMs: 0,
      staleAfterMs: 500,
      now: () => now,
    });
    leases.push(second);

    expect(agedSnapshot && now - agedSnapshot.heartbeatAt >= 500).toBe(true);
    expect(second.acquired).toBe(true);
    expect(second.result.staleReclaimed).toBe(true);
  });
});
