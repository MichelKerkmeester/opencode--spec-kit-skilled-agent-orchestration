// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Compat Daemon Probe
// ───────────────────────────────────────────────────────────────

import { resolve } from 'node:path';

import type { AdvisorFreshness, AdvisorStatusOutput } from '../../schemas/advisor-tool-schemas.js';
// F-016-D1-04: Pull `readAdvisorStatus` through the advisor-lib seam so
// compat code does not depend directly on a sibling handler module. The
// handler keeps the implementation; this module is just the seam.
import { readAdvisorStatus } from './advisor-status-reader.js';

export interface AdvisorDaemonProbeInput {
  readonly workspaceRoot: string;
  readonly timeoutMs?: number;
  readonly statusReader?: (input: { workspaceRoot: string }) => AdvisorStatusOutput;
}

export interface AdvisorDaemonProbeResult {
  readonly available: boolean;
  readonly freshness: AdvisorFreshness;
  readonly trustState: AdvisorStatusOutput['trustState'];
  readonly generation: number;
  readonly daemonPid?: number;
  readonly reason: string | null;
}

const AVAILABLE_FRESHNESS: ReadonlySet<AdvisorFreshness> = new Set(['live', 'stale']);

function unavailable(reason: string): AdvisorDaemonProbeResult {
  return {
    available: false,
    freshness: 'unavailable',
    trustState: {
      state: 'unavailable',
      reason,
      generation: 0,
      checkedAt: new Date().toISOString(),
      lastLiveAt: null,
    },
    generation: 0,
    reason,
  };
}

export function probeAdvisorDaemon(input: AdvisorDaemonProbeInput): AdvisorDaemonProbeResult {
  if (process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1') {
    return unavailable('ADVISOR_DISABLED');
  }

  try {
    const statusReader = input.statusReader ?? readAdvisorStatus;
    const status = statusReader({ workspaceRoot: resolve(input.workspaceRoot) });
    const reason = status.errors?.[0] ?? status.trustState.reason ?? null;
    return {
      available: AVAILABLE_FRESHNESS.has(status.freshness),
      freshness: status.freshness,
      trustState: status.trustState,
      generation: status.generation,
      ...(status.daemonPid ? { daemonPid: status.daemonPid } : {}),
      reason,
    };
  } catch (error: unknown) {
    const code = error instanceof Error && error.name ? error.name : 'PROBE_FAILED';
    return unavailable(code.toUpperCase().replace(/[^A-Z0-9_]/g, '_'));
  }
}

