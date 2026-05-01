// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Watcher Orchestrator
// ───────────────────────────────────────────────────────────────
// F-016-D1-06: Internal helper extracted from `daemon/watcher.ts` so the
// watcher module owns *watching* (chokidar wiring, debounce timers, target
// discovery) while this module owns *orchestration* (skill-by-skill reindex
// dispatch, hash-bookkeeping, generation publication). The watcher
// constructs an Orchestrator, hands it the closures it needs, and delegates
// every per-skill batch to it.
//
// External API of `watcher.ts` is unchanged: every public symbol previously
// exported from there still resolves at the same path with the same
// signature. The orchestrator is module-internal — callers should NOT
// import it directly. It exists as its own module so the watcher can stay
// focused on chokidar wiring and the orchestration logic can be reasoned
// about in isolation.

import { existsSync } from 'node:fs';

import { computeAdvisorSourceSignature } from '../freshness.js';
import { publishSkillGraphGeneration } from '../freshness/generation.js';
import { errorMessage } from '../utils/error-format.js';
import {
  type ReindexRequest,
  type ReindexResult,
  type SkillGraphFsWatcher,
} from './watcher.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface PendingSkill {
  readonly skillSlug: string;
  readonly skillDir: string;
  readonly changedPaths: Set<string>;
}

export interface WatcherOrchestratorOptions {
  readonly workspaceRoot: string;
  readonly skillsRoot: string;
  readonly generationReason?: string;
  readonly busyRetryDelaysMs: readonly number[];
  readonly hashFile: (filePath: string) => string | null;
  readonly hasValidSkillMarkdown: (skillMdPath: string) => boolean;
  readonly quarantineSkill: (skillSlug: string, filePath: string, reason: string) => void;
  readonly recoverQuarantinedSkill: (skillSlug: string) => void;
  readonly reindexSkill: (request: ReindexRequest) => Promise<ReindexResult> | ReindexResult;
  readonly runWithBusyRetry: <T>(operation: () => Promise<T> | T, delaysMs: readonly number[]) => Promise<T>;
  readonly refreshTargets: () => void;
  readonly pushDiagnostic: (entry: string) => void;
  readonly fileHashes: Map<string, string>;
  readonly skillMdFilename: string;
}

export interface WatcherOrchestrator {
  /** F-001-A1-02: route generation publication suppression through the orchestrator. */
  setSuppressGenerationPublication: (value: boolean) => void;
  /** Last time a reindex completed; used by the watcher's status() output. */
  getLastReindexAt: () => string | null;
  /** Process a single pending skill batch. Errors are surfaced via diagnostics. */
  processSkill: (request: PendingSkill) => Promise<void>;
}

// ───────────────────────────────────────────────────────────────
// 2. FACTORY
// ───────────────────────────────────────────────────────────────

export function createWatcherOrchestrator(
  options: WatcherOrchestratorOptions,
): WatcherOrchestrator {
  let suppressGenerationPublication = false;
  let lastReindexAt: string | null = null;

  async function processSkill(request: PendingSkill): Promise<void> {
    const skillMdPath = `${request.skillDir}/${options.skillMdFilename}`;
    if (!options.hasValidSkillMarkdown(skillMdPath)) {
      options.quarantineSkill(request.skillSlug, skillMdPath, 'MALFORMED_SKILL_MD');
      // F-003-A3-02: counter key 'QUARANTINED' tracks total quarantine events
      // even after the ring buffer drops the per-skill string entries.
      options.pushDiagnostic(`QUARANTINED:${request.skillSlug}`);
      return;
    }
    options.recoverQuarantinedSkill(request.skillSlug);

    const changedPaths = [...request.changedPaths];
    const missingChangedPaths = changedPaths.filter((changedPath) => !existsSync(changedPath));
    const changedHashInputs = changedPaths
      .map((changedPath) => [changedPath, options.hashFile(changedPath)] as const)
      .filter(([, hash]) => hash !== null);
    if (changedHashInputs.length === 0 && missingChangedPaths.length === 0) {
      return;
    }
    const unchanged = missingChangedPaths.length === 0
      && changedHashInputs.every(([changedPath, hash]) => options.fileHashes.get(changedPath) === hash);
    if (unchanged) {
      return;
    }

    await options.runWithBusyRetry(async () => {
      await options.reindexSkill({
        skillSlug: request.skillSlug,
        skillDir: request.skillDir,
        changedPaths,
      });
    }, options.busyRetryDelaysMs);

    for (const [changedPath, hash] of changedHashInputs) {
      if (hash) options.fileHashes.set(changedPath, hash);
    }
    for (const changedPath of missingChangedPaths) {
      options.fileHashes.delete(changedPath);
    }
    // F-001-A1-02: shutdown() may have flipped suppression on while this flush
    // was already running. Skip the live-state publication so the daemon does
    // not overwrite the terminal `unavailable` generation.
    if (!suppressGenerationPublication) {
      publishSkillGraphGeneration({
        workspaceRoot: options.workspaceRoot,
        changedPaths,
        reason: options.generationReason ?? 'skill-graph-daemon-reindex',
        state: 'live',
        sourceSignature: computeAdvisorSourceSignature(options.workspaceRoot),
      });
    }
    lastReindexAt = new Date().toISOString();
    options.refreshTargets();
  }

  return {
    setSuppressGenerationPublication: (value: boolean) => {
      suppressGenerationPublication = value;
    },
    getLastReindexAt: () => lastReindexAt,
    processSkill,
  };
}

// Re-exported for the watcher module so it can format errors without
// importing utils/error-format.js a second time. Keeps the watcher's
// existing error-message contract consistent.
export { errorMessage };
