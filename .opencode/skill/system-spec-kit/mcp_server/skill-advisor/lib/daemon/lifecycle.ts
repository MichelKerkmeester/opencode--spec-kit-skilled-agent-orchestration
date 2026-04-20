import { resolve } from 'node:path';
import { acquireSkillGraphLease, type SkillGraphLease } from './lease.js';
import { createSkillGraphWatcher, type SkillGraphWatcher, type SkillGraphWatcherOptions } from './watcher.js';
import { publishSkillGraphGeneration, readSkillGraphGeneration } from '../freshness/generation.js';
import { createTrustState, type TrustStateSnapshot } from '../freshness/trust-state.js';
import type { DaemonStatus } from '../../schemas/daemon-status.js';

export interface SkillGraphDaemonOptions extends Omit<SkillGraphWatcherOptions, 'workspaceRoot'> {
  readonly workspaceRoot: string;
  readonly leaseDbPath?: string;
  readonly ownerId?: string;
  readonly staleAfterMs?: number;
  readonly heartbeatMs?: number;
  readonly installSignalHandlers?: boolean;
}

export interface SkillGraphDaemon {
  readonly ownerId: string;
  readonly active: boolean;
  status: () => DaemonStatus;
  shutdown: (reason?: string) => Promise<void>;
}

export async function startSkillGraphDaemon(options: SkillGraphDaemonOptions): Promise<SkillGraphDaemon> {
  const workspaceRoot = resolve(options.workspaceRoot);
  const lease = acquireSkillGraphLease({
    workspaceRoot,
    leaseDbPath: options.leaseDbPath,
    ownerId: options.ownerId,
    staleAfterMs: options.staleAfterMs,
    heartbeatMs: options.heartbeatMs,
  });

  let watcher: SkillGraphWatcher | null = null;
  let trustState: TrustStateSnapshot = createTrustState({
    hasSources: true,
    hasArtifact: true,
    sourceChanged: false,
    daemonAvailable: lease.acquired,
    generation: readSkillGraphGeneration(workspaceRoot).generation,
    reason: lease.acquired ? null : 'LEASE_HELD_BY_OTHER',
  });
  let shuttingDown = false;

  if (lease.acquired) {
    if (lease.result.staleReclaimed) {
      publishSkillGraphGeneration({
        workspaceRoot,
        reason: 'STALE_LEASE_TAKEOVER_UNAVAILABLE',
        state: 'unavailable',
        changedPaths: [],
      });
    }
    watcher = createSkillGraphWatcher({
      ...options,
      workspaceRoot,
    });
    if (lease.result.staleReclaimed) {
      publishSkillGraphGeneration({
        workspaceRoot,
        reason: 'STALE_LEASE_TAKEOVER_LIVE',
        state: 'live',
        changedPaths: [],
      });
    }
  }

  async function shutdown(reason = 'DAEMON_SHUTDOWN'): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;
    trustState = createTrustState({
      hasSources: true,
      hasArtifact: true,
      sourceChanged: false,
      daemonAvailable: false,
      generation: readSkillGraphGeneration(workspaceRoot).generation,
      reason,
      lastLiveAt: trustState.lastLiveAt,
    });

    if (lease.acquired) {
      publishSkillGraphGeneration({
        workspaceRoot,
        reason,
        state: 'unavailable',
        changedPaths: [],
      });
    }

    await watcher?.close();
    watcher = null;
    lease.close();
  }

  if (options.installSignalHandlers ?? false) {
    const handler = () => {
      void shutdown('SIGTERM').finally(() => {
        process.exit(0);
      });
    };
    process.once('SIGTERM', handler);
    process.once('SIGINT', handler);
  }

  function status(): DaemonStatus {
    const generation = readSkillGraphGeneration(workspaceRoot);
    const watcherStatus = watcher?.status();
    const state = !lease.acquired
      ? 'degraded'
      : trustState.state === 'unavailable'
        ? 'unavailable'
        : watcherStatus && watcherStatus.quarantinedSkills > 0
          ? 'quarantined'
          : 'live';

    return {
      workspaceRoot,
      ownerId: lease.acquired ? lease.ownerId : null,
      state,
      trustState: trustState.state,
      generation: generation.generation,
      lastHeartbeatAt: new Date().toISOString(),
      lastScanAt: watcherStatus?.lastReindexAt ?? null,
      watcher: {
        enabled: Boolean(watcher),
        watchedPaths: watcherStatus?.watchedPaths ?? 0,
        pendingEvents: watcherStatus?.pendingEvents ?? 0,
        circuitOpen: watcherStatus?.circuitOpen ?? false,
      },
      quarantineCount: watcherStatus?.quarantinedSkills ?? 0,
      diagnostics: [
        ...(lease.result.acquired ? [] : [`LEASE_HELD_BY:${lease.result.incumbentOwnerId ?? 'unknown'}`]),
        ...(watcherStatus?.diagnostics ?? []),
      ],
    };
  }

  return {
    ownerId: lease.ownerId,
    get active() {
      return lease.acquired && !shuttingDown;
    },
    status,
    shutdown,
  };
}
