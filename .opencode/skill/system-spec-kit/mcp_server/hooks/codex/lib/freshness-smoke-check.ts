// ───────────────────────────────────────────────────────────────
// MODULE: Codex Freshness Smoke Check
// ───────────────────────────────────────────────────────────────

import { performance } from 'node:perf_hooks';
import { buildStartupBrief, type StartupBriefResult } from '../../../code_graph/lib/startup-brief.js';

export interface CodexFreshnessSmokeCheckResult {
  readonly fresh: boolean;
  readonly lastUpdateAt: string | null;
  readonly latencyMs: number;
}

export interface CodexFreshnessSmokeCheckDependencies {
  readonly buildStartup?: typeof buildStartupBrief;
  readonly now?: () => number;
}

function isFreshStartupContext(result: StartupBriefResult): boolean {
  return result.startupSurface.trim().length > 0 && result.graphState === 'ready';
}

export function smokeCheckCodexColdStartContext(
  dependencies: CodexFreshnessSmokeCheckDependencies = {},
): CodexFreshnessSmokeCheckResult {
  const now = dependencies.now ?? performance.now.bind(performance);
  const startedAt = now();
  try {
    const result = (dependencies.buildStartup ?? buildStartupBrief)();
    return {
      fresh: isFreshStartupContext(result),
      lastUpdateAt: result.sharedPayload?.provenance.lastUpdated ?? result.graphSummary?.lastScan ?? null,
      latencyMs: Number((now() - startedAt).toFixed(3)),
    };
  } catch {
    return {
      fresh: false,
      lastUpdateAt: null,
      latencyMs: Number((now() - startedAt).toFixed(3)),
    };
  }
}
