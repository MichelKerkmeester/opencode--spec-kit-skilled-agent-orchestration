// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Watcher
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import chokidar from 'chokidar';
import { indexSkillMetadata } from '../../../lib/skill-graph/skill-graph-db.js';
import { runDaemonStateMutation } from './state-mutation.js';
import { workspaceRelativeFilePath } from '../derived/provenance.js';
import { computeAdvisorSourceSignature } from '../freshness.js';
import { publishSkillGraphGeneration } from '../freshness/generation.js';
import { errorMessage } from '../utils/error-format.js';
import { findAdvisorWorkspaceRoot } from '../utils/workspace-root.js';

export interface WatchTarget {
  readonly path: string;
  readonly skillSlug: string;
  readonly reason: 'skill-md' | 'graph-metadata' | 'derived-key-file';
}

export interface ReindexRequest {
  readonly skillSlug: string;
  readonly skillDir: string;
  readonly changedPaths: readonly string[];
}

export interface ReindexResult {
  readonly indexedFiles?: number;
  readonly skippedFiles?: number;
  readonly warnings?: readonly string[];
}

export interface WatcherBackpressureOptions {
  readonly debounceMs?: number;
  readonly stableWriteMs?: number;
  readonly stormEventLimit?: number;
  readonly stormWindowMs?: number;
  readonly circuitCooldownMs?: number;
  readonly busyRetryDelaysMs?: readonly number[];
}

export interface SkillGraphWatcherOptions {
  readonly workspaceRoot: string;
  readonly skillsRoot?: string;
  readonly generationReason?: string;
  readonly watchFactory?: (paths: string[], options: Record<string, unknown>) => SkillGraphFsWatcher;
  readonly reindexSkill?: (request: ReindexRequest) => Promise<ReindexResult> | ReindexResult;
  readonly quarantineDbPath?: string;
  readonly backpressure?: WatcherBackpressureOptions;
  readonly now?: () => number;
}

export interface SkillGraphWatcherStatus {
  readonly watchedPaths: number;
  readonly pendingEvents: number;
  readonly circuitOpen: boolean;
  readonly quarantinedSkills: number;
  readonly lastReindexAt: string | null;
  readonly diagnostics: readonly string[];
}

export interface SkillGraphFsWatcher {
  on: (event: string, listener: (...args: unknown[]) => void) => SkillGraphFsWatcher;
  add?: (paths: string | string[]) => SkillGraphFsWatcher;
  // F-003-A3-01: chokidar exposes unwatch(); we accept it as an optional capability
  // so refreshTargets() can prune paths that disappeared between scans. Test
  // harnesses without unwatch fall back to add-only behavior; real chokidar
  // wires this to its native unsubscribe.
  unwatch?: (paths: string | string[]) => SkillGraphFsWatcher;
  close: () => Promise<void>;
  getWatched?: () => Record<string, string[]>;
}

export interface SkillGraphWatcher {
  readonly targets: readonly WatchTarget[];
  status: () => SkillGraphWatcherStatus;
  refreshTargets: () => void;
  // F-001-A1-01: drain any queued reindex work without closing the watcher.
  flush: () => Promise<void>;
  // F-001-A1-02: lifecycle uses this to silence reindex generation writes
  // during shutdown; pending flushes still run for hash bookkeeping but never
  // call publishSkillGraphGeneration().
  suppressGenerationPublication: (value: boolean) => void;
  close: () => Promise<void>;
}

interface PendingSkill {
  readonly skillSlug: string;
  readonly skillDir: string;
  readonly changedPaths: Set<string>;
}

const SKILL_MD = 'SKILL.md';
const GRAPH_METADATA = 'graph-metadata.json';
const DEFAULT_DEBOUNCE_MS = 2_000;
const DEFAULT_STABLE_WRITE_MS = 1_000;
const DEFAULT_STORM_EVENT_LIMIT = 20;
const DEFAULT_STORM_WINDOW_MS = 10_000;
const DEFAULT_CIRCUIT_COOLDOWN_MS = 10_000;
const DEFAULT_BUSY_RETRY_DELAYS_MS = [250, 500, 1_000] as const;
const TEMP_SUFFIX_PATTERN = /(?:\.tmp|\.swp|~)$/i;
// F-003-A3-02: cap diagnostics array so a long-running daemon does not leak the
// process heap with one entry per watcher event. 100 keeps enough recent
// context for triage; aggregate counters cover the long tail and are exposed as
// a single `COUNTERS:...` synthetic line at the head of status().diagnostics so
// the public return type (readonly string[]) does not change.
const DIAGNOSTICS_RING_BUFFER_CAP = 100;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultSkillsRoot(workspaceRoot: string): string {
  // Centralized canonicalize step; the relative `.opencode/skill` suffix is
  // unique to this caller. See `lib/utils/workspace-root.ts` for the shared
  // walk-up helper used by handlers/bench/test code.
  return join(findAdvisorWorkspaceRoot(workspaceRoot, { maxDepth: 0 }), '.opencode', 'skill');
}

function isSqliteBusyError(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  const message = errorMessage(error);
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

export async function runWithBusyRetry<T>(operation: () => Promise<T> | T, delaysMs: readonly number[]): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error: unknown) {
      if (!isSqliteBusyError(error) || attempt >= delaysMs.length) {
        throw error;
      }
      await sleep(delaysMs[attempt]);
      attempt += 1;
    }
  }
}

function hashFile(filePath: string): string | null {
  try {
    return createHash('sha256').update(readFileSync(filePath)).digest('hex');
  } catch (error: unknown) {
    const code = error instanceof Error && 'code' in error ? (error as NodeJS.ErrnoException).code : null;
    if (code === 'ENOENT') return null;
    throw error;
  }
}

function isWithin(parent: string, child: string): boolean {
  const relativePath = relative(parent, child);
  return relativePath === '' || (!relativePath.startsWith(`..${sep}`) && relativePath !== '..' && !relativePath.startsWith('/'));
}

function walkSkillDirectories(skillsRoot: string): string[] {
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => join(skillsRoot, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

// F-004-A4-04: Malformed graph-metadata.json previously vanished into a bare
// `catch {}`, dropping every derived key-file watch target without a trace.
// Surface the parse failure through an optional onMalformed callback so the
// caller can record a diagnostic (e.g. MALFORMED_GRAPH_METADATA:<path>:<reason>)
// and operators can act on it. The callback is optional so the public
// `discoverWatchTargets` signature stays backward-compatible.
function parseDerivedKeyFiles(
  graphMetadataPath: string,
  workspaceRoot: string,
  onMalformed?: (filePath: string, reason: string) => void,
): string[] {
  if (!existsSync(graphMetadataPath)) return [];
  try {
    const parsed: unknown = JSON.parse(readFileSync(graphMetadataPath, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      // F-004-A4-04: top-level shape is wrong but JSON parsed; still flag it so
      // the caller knows the schema drifted away from the documented contract.
      onMalformed?.(graphMetadataPath, 'top-level value is not an object');
      return [];
    }
    const derived = (parsed as { derived?: unknown }).derived;
    if (derived === undefined) return [];
    if (typeof derived !== 'object' || derived === null || Array.isArray(derived)) {
      onMalformed?.(graphMetadataPath, 'derived field is not an object');
      return [];
    }
    const keyFiles = (derived as { key_files?: unknown }).key_files;
    if (keyFiles === undefined) return [];
    if (!Array.isArray(keyFiles)) {
      onMalformed?.(graphMetadataPath, 'derived.key_files is not an array');
      return [];
    }
    return keyFiles
      .filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
      .map((entry) => workspaceRelativeFilePath(workspaceRoot, entry))
      .filter((entry): entry is string => entry !== null)
      .map((entry) => resolve(workspaceRoot, entry))
      .filter((entry) => existsSync(entry));
  } catch (error: unknown) {
    // F-004-A4-04: previously this catch silently dropped JSON.parse errors;
    // now we surface a reason string so operators see WHY targets disappeared.
    onMalformed?.(graphMetadataPath, errorMessage(error));
    return [];
  }
}

// F-004-A4-04: optional onMalformed callback lets the watcher record a
// diagnostic when graph-metadata.json fails to parse. Default callers (tests,
// external consumers) keep the original two-arg signature.
export function discoverWatchTargets(
  workspaceRoot: string,
  skillsRoot = defaultSkillsRoot(workspaceRoot),
  onMalformed?: (filePath: string, reason: string) => void,
): WatchTarget[] {
  const root = resolve(workspaceRoot);
  const targets: WatchTarget[] = [];
  for (const skillDir of walkSkillDirectories(skillsRoot)) {
    const skillSlug = basename(skillDir);
    const skillMd = join(skillDir, SKILL_MD);
    const graphMetadata = join(skillDir, GRAPH_METADATA);
    if (existsSync(skillMd)) {
      targets.push({ path: skillMd, skillSlug, reason: 'skill-md' });
    }
    if (existsSync(graphMetadata)) {
      targets.push({ path: graphMetadata, skillSlug, reason: 'graph-metadata' });
      for (const keyFile of parseDerivedKeyFiles(graphMetadata, root, onMalformed)) {
        targets.push({ path: keyFile, skillSlug, reason: 'derived-key-file' });
      }
    }
  }

  const seen = new Set<string>();
  return targets.filter((target) => {
    const key = `${target.path}:${target.skillSlug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function skillSlugForPath(filePath: string, targets: readonly WatchTarget[], skillsRoot: string): string | null {
  const normalized = resolve(filePath);
  const direct = targets.find((target) => resolve(target.path) === normalized);
  if (direct) return direct.skillSlug;

  for (const skillDir of walkSkillDirectories(skillsRoot)) {
    if (isWithin(skillDir, normalized)) {
      return basename(skillDir);
    }
  }
  return null;
}

function hasValidSkillMarkdown(skillPath: string): boolean {
  if (!existsSync(skillPath)) return true;
  const raw = readFileSync(skillPath, 'utf8');
  if (!raw.startsWith('---\n')) return false;
  const end = raw.indexOf('\n---', 4);
  if (end <= 4) return false;
  const frontmatter = raw.slice(4, end);
  return /^name:\s*\S+/m.test(frontmatter) && /^description:\s*.+/m.test(frontmatter);
}

function quarantineDbPath(workspaceRoot: string, override?: string): string {
  return override ?? join(resolve(workspaceRoot), '.opencode', 'skill', '.advisor-state', 'skill-graph-daemon-lease.sqlite');
}

function initializeQuarantineDb(db: { exec: (sql: string) => void }): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS quarantined_skill (
      skill_slug TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at TEXT NOT NULL,
      recovered_at TEXT
    );
  `);
}

export function quarantineSkill(workspaceRoot: string, skillSlug: string, filePath: string, reason: string, dbPath?: string): void {
  runDaemonStateMutation(quarantineDbPath(workspaceRoot, dbPath), initializeQuarantineDb, (db) => {
    db.prepare(`
      INSERT INTO quarantined_skill (skill_slug, path, reason, quarantined_at, recovered_at)
      VALUES (?, ?, ?, ?, NULL)
      ON CONFLICT(skill_slug) DO UPDATE SET
        path = excluded.path,
        reason = excluded.reason,
        quarantined_at = excluded.quarantined_at,
        recovered_at = NULL
    `).run(skillSlug, filePath, reason, new Date().toISOString());
  });
}

export function recoverQuarantinedSkill(workspaceRoot: string, skillSlug: string, dbPath?: string): void {
  runDaemonStateMutation(quarantineDbPath(workspaceRoot, dbPath), initializeQuarantineDb, (db) => {
    db.prepare(`
      UPDATE quarantined_skill
      SET recovered_at = ?
      WHERE skill_slug = ? AND recovered_at IS NULL
    `).run(new Date().toISOString(), skillSlug);
  });
}

export function countActiveQuarantines(workspaceRoot: string, dbPath?: string): number {
  return runDaemonStateMutation(quarantineDbPath(workspaceRoot, dbPath), initializeQuarantineDb, (db) => {
    const row = db.prepare('SELECT COUNT(*) AS count FROM quarantined_skill WHERE recovered_at IS NULL').get() as { count: number };
    return row.count;
  });
}

function fsyncPath(targetPath: string): void {
  let fd: number | null = null;
  try {
    fd = openSync(targetPath, 'r');
    fsyncSync(fd);
  } finally {
    if (fd !== null) closeSync(fd);
  }
}

export function writeFileAtomic(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    writeFileSync(tmpPath, content, 'utf8');
    fsyncPath(tmpPath);
    renameSync(tmpPath, filePath);
    fsyncPath(dirname(filePath));
  } catch (error: unknown) {
    const code = error instanceof Error && 'code' in error ? (error as NodeJS.ErrnoException).code : null;
    if (code !== 'ENOENT') {
      try { rmSync(tmpPath, { force: true }); } catch { /* best effort */ }
      throw error;
    }
  }
}

export function createSkillGraphWatcher(options: SkillGraphWatcherOptions): SkillGraphWatcher {
  const workspaceRoot = resolve(options.workspaceRoot);
  const skillsRoot = resolve(options.skillsRoot ?? defaultSkillsRoot(workspaceRoot));
  // F-003-A3-02: diagnostics + counters are declared up front so the malformed
  // metadata callback (used by the initial discoverWatchTargets() scan below)
  // can record events before the watcher even starts.
  const diagnostics: string[] = [];
  const diagnosticCounts = new Map<string, number>();

  // F-003-A3-02: replace direct `diagnostics.push(...)` with a helper that
  // enforces the ring buffer cap and bumps the aggregate counter. Counters
  // survive the buffer rotation so operators can see "we hit 4,200
  // WATCHER_ERROR events" even though only the last 100 strings are retained.
  function pushDiagnostic(entry: string): void {
    diagnostics.push(entry);
    if (diagnostics.length > DIAGNOSTICS_RING_BUFFER_CAP) {
      diagnostics.splice(0, diagnostics.length - DIAGNOSTICS_RING_BUFFER_CAP);
    }
    const colonIndex = entry.indexOf(':');
    const key = colonIndex > 0 ? entry.slice(0, colonIndex) : entry;
    diagnosticCounts.set(key, (diagnosticCounts.get(key) ?? 0) + 1);
  }

  // F-004-A4-04: invoked by parseDerivedKeyFiles when graph-metadata.json is
  // malformed; the closure pushes a diagnostic so operators see the malformed
  // path + reason instead of silently losing key-file watch targets.
  const recordMalformedMetadata = (filePath: string, reason: string): void => {
    pushDiagnostic(`MALFORMED_GRAPH_METADATA:${filePath}:${reason}`);
  };
  let targets = discoverWatchTargets(workspaceRoot, skillsRoot, recordMalformedMetadata);
  const targetPaths = targets.map((target) => target.path);
  const watcher = (options.watchFactory ?? chokidar.watch)(targetPaths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: options.backpressure?.stableWriteMs ?? DEFAULT_STABLE_WRITE_MS },
    atomic: true,
    followSymlinks: false,
    ignored: (targetPath: string) => TEMP_SUFFIX_PATTERN.test(targetPath),
  }) as SkillGraphFsWatcher;

  const debounceMs = options.backpressure?.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const stormEventLimit = options.backpressure?.stormEventLimit ?? DEFAULT_STORM_EVENT_LIMIT;
  const stormWindowMs = options.backpressure?.stormWindowMs ?? DEFAULT_STORM_WINDOW_MS;
  const circuitCooldownMs = options.backpressure?.circuitCooldownMs ?? DEFAULT_CIRCUIT_COOLDOWN_MS;
  const busyRetryDelaysMs = options.backpressure?.busyRetryDelaysMs ?? DEFAULT_BUSY_RETRY_DELAYS_MS;
  const now = options.now ?? (() => Date.now());
  const fileHashes = new Map<string, string>();
  const pending = new Map<string, PendingSkill>();
  const eventTimes: number[] = [];

  let debounceTimer: NodeJS.Timeout | null = null;
  let circuitOpenUntil = 0;
  let closed = false;
  let suppressGenerationPublication = false;
  let lastReindexAt: string | null = null;
  // Serialization primitive for F-001-A1-01: only one flush drain runs at a
  // time, regardless of how many timers or close() calls fire concurrently.
  // Events queued while a flush is running are picked up by the same drain
  // loop after the active batch settles.
  let flushPromise: Promise<void> | null = null;

  const defaultReindex = async (): Promise<ReindexResult> => indexSkillMetadata(skillsRoot);
  const reindexSkill = options.reindexSkill ?? defaultReindex;

  // F-003-A3-01: target refresh previously only added new paths; removed paths
  // stayed under chokidar's watch forever, leaking listeners + per-path file
  // descriptors for the daemon's lifetime. We now compute path additions AND
  // removals, call watcher.unwatch() for the removals (when the harness
  // exposes it), and prune the file-hash + pending-reindex caches so a later
  // re-add starts from a clean state.
  function refreshTargets(): void {
    const refreshed = discoverWatchTargets(workspaceRoot, skillsRoot, recordMalformedMetadata);
    const knownPaths = new Set(targets.map((target) => target.path));
    const refreshedPaths = new Set(refreshed.map((target) => target.path));
    const additions = refreshed.filter((target) => !knownPaths.has(target.path));
    const removals = targets.filter((target) => !refreshedPaths.has(target.path));
    targets = refreshed;
    if (additions.length > 0) {
      watcher.add?.(additions.map((target) => target.path));
    }
    if (removals.length > 0) {
      const removedPaths = removals.map((target) => target.path);
      watcher.unwatch?.(removedPaths);
      // Prune cached file hashes so a future re-add does not skip the first
      // reindex on a stale "unchanged" comparison.
      for (const removedPath of removedPaths) {
        fileHashes.delete(removedPath);
      }
      // F-003-A3-01: also drop pending reindex requests whose owning skill no
      // longer has any watched paths, so the queue cannot retain phantom work
      // for skills that have been deleted on disk.
      const livingSlugs = new Set(refreshed.map((target) => target.skillSlug));
      for (const slug of [...pending.keys()]) {
        if (!livingSlugs.has(slug)) {
          pending.delete(slug);
        }
      }
    }
  }

  function trackStorm(): void {
    const currentTime = now();
    eventTimes.push(currentTime);
    while (eventTimes.length > 0 && currentTime - eventTimes[0] > stormWindowMs) {
      eventTimes.shift();
    }
    if (eventTimes.length > stormEventLimit) {
      circuitOpenUntil = currentTime + circuitCooldownMs;
      // F-003-A3-02: route through pushDiagnostic so the entry counts toward
      // the REINDEX_STORM_CIRCUIT_OPEN aggregate even after the ring buffer
      // rolls over.
      pushDiagnostic(`REINDEX_STORM_CIRCUIT_OPEN:${eventTimes.length}`);
    }
  }

  function enqueue(filePath: string): void {
    if (closed || TEMP_SUFFIX_PATTERN.test(filePath)) return;
    const normalizedPath = resolve(filePath);
    const skillSlug = skillSlugForPath(normalizedPath, targets, skillsRoot);
    if (!skillSlug) return;
    const skillDir = join(skillsRoot, skillSlug);
    const pendingSkill = pending.get(skillSlug) ?? {
      skillSlug,
      skillDir,
      changedPaths: new Set<string>(),
    };
    pendingSkill.changedPaths.add(normalizedPath);
    pending.set(skillSlug, pendingSkill);
    trackStorm();

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const delay = now() < circuitOpenUntil ? Math.max(circuitOpenUntil - now(), debounceMs) : debounceMs;
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void flushPending();
    }, delay);
  }

  async function processSkill(request: PendingSkill): Promise<void> {
    const skillMdPath = join(request.skillDir, SKILL_MD);
    if (!hasValidSkillMarkdown(skillMdPath)) {
      quarantineSkill(workspaceRoot, request.skillSlug, skillMdPath, 'MALFORMED_SKILL_MD', options.quarantineDbPath);
      // F-003-A3-02: counter key 'QUARANTINED' tracks total quarantine events
      // even after the ring buffer drops the per-skill string entries.
      pushDiagnostic(`QUARANTINED:${request.skillSlug}`);
      return;
    }
    recoverQuarantinedSkill(workspaceRoot, request.skillSlug, options.quarantineDbPath);

    const changedPaths = [...request.changedPaths];
    const missingChangedPaths = changedPaths.filter((changedPath) => !existsSync(changedPath));
    const changedHashInputs = changedPaths
      .map((changedPath) => [changedPath, hashFile(changedPath)] as const)
      .filter(([, hash]) => hash !== null);
    if (changedHashInputs.length === 0 && missingChangedPaths.length === 0) {
      return;
    }
    const unchanged = missingChangedPaths.length === 0
      && changedHashInputs.every(([changedPath, hash]) => fileHashes.get(changedPath) === hash);
    if (unchanged) {
      return;
    }

    await runWithBusyRetry(async () => {
      await reindexSkill({
        skillSlug: request.skillSlug,
        skillDir: request.skillDir,
        changedPaths,
      });
    }, busyRetryDelaysMs);

    for (const [changedPath, hash] of changedHashInputs) {
      if (hash) fileHashes.set(changedPath, hash);
    }
    for (const changedPath of missingChangedPaths) {
      fileHashes.delete(changedPath);
    }
    // F-001-A1-02: shutdown() may have flipped suppression on while this flush
    // was already running. Skip the live-state publication so the daemon does
    // not overwrite the terminal `unavailable` generation.
    if (!suppressGenerationPublication) {
      publishSkillGraphGeneration({
        workspaceRoot,
        changedPaths,
        reason: options.generationReason ?? 'skill-graph-daemon-reindex',
        state: 'live',
        sourceSignature: computeAdvisorSourceSignature(workspaceRoot),
      });
    }
    lastReindexAt = new Date().toISOString();
    refreshTargets();
  }

  // F-001-A1-01: serialized drain. Only one drainPending() runs at a time,
  // tracked via flushPromise. Concurrent triggers (debounce timer + close()
  // for example) all await the same promise. After a batch finishes, if more
  // events were queued while the batch was running, drain again on the same
  // serialized chain — no parallel processSkill() calls for the same skill.
  async function flushPending(): Promise<void> {
    if (flushPromise) {
      return flushPromise;
    }
    flushPromise = drainPending().finally(() => {
      flushPromise = null;
    });
    return flushPromise;
  }

  async function drainPending(): Promise<void> {
    while (pending.size > 0) {
      const batch = [...pending.values()];
      pending.clear();
      for (const request of batch) {
        try {
          await processSkill(request);
        } catch (error: unknown) {
          const code = error instanceof Error && 'code' in error ? (error as NodeJS.ErrnoException).code : null;
          if (code === 'ENOENT') {
            continue;
          }
          // F-003-A3-02: route through pushDiagnostic so REINDEX_FAILED counts
          // accumulate even after the ring buffer drops the per-skill strings.
          pushDiagnostic(`REINDEX_FAILED:${request.skillSlug}:${errorMessage(error)}`);
        }
      }
    }
  }

  watcher.on('add', (targetPath: unknown) => {
    if (typeof targetPath === 'string') enqueue(targetPath);
  });
  watcher.on('change', (targetPath: unknown) => {
    if (typeof targetPath === 'string') enqueue(targetPath);
  });
  watcher.on('unlink', (targetPath: unknown) => {
    if (typeof targetPath === 'string') enqueue(targetPath);
  });
  watcher.on('error', (error: unknown) => {
    // F-003-A3-02: WATCHER_ERROR counter tracks the total number of error
    // events even after the ring buffer rotates older entries out.
    pushDiagnostic(`WATCHER_ERROR:${errorMessage(error)}`);
  });

  return {
    get targets() {
      return targets;
    },
    status: () => {
      // F-003-A3-02: prepend a synthetic COUNTERS:... line so callers see the
      // long-tail aggregate even after the ring buffer has dropped the
      // original event strings. The line is regenerated on every status() call
      // and is NOT stored in the buffer (so it does not double-count itself).
      // Sorting keeps the output deterministic across calls.
      const counterLine = diagnosticCounts.size === 0
        ? null
        : `COUNTERS:${[...diagnosticCounts.entries()]
            .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
            .map(([key, count]) => `${key}=${count}`)
            .join(',')}`;
      const diagnosticLines = counterLine === null ? [...diagnostics] : [counterLine, ...diagnostics];
      return {
        watchedPaths: targets.length,
        pendingEvents: [...pending.values()].reduce((total, item) => total + item.changedPaths.size, 0),
        circuitOpen: now() < circuitOpenUntil,
        quarantinedSkills: countActiveQuarantines(workspaceRoot, options.quarantineDbPath),
        lastReindexAt,
        diagnostics: diagnosticLines,
      };
    },
    refreshTargets,
    // F-001-A1-02: lifecycle.ts calls suppressGenerationPublication(true) before
    // tearing the watcher down, so any queued processSkill() that runs during
    // close()/flushPending() will not write a 'live' generation that would
    // overwrite the terminal 'unavailable' state.
    suppressGenerationPublication: (value: boolean) => {
      suppressGenerationPublication = value;
    },
    // F-001-A1-01: public drain hook. Lifecycle.ts uses this to quiesce the
    // queue before publishing the final terminal state.
    flush: () => flushPending(),
    close: async () => {
      closed = true;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      // Await any in-flight drain AND any newly enqueued work; the serialized
      // flushPending() handles both.
      await flushPending();
      await watcher.close();
    },
  };
}

export const __testables = {
  defaultSkillsRoot,
  hasValidSkillMarkdown,
  isSqliteBusyError,
  quarantineDbPath,
  skillSlugForPath,
  withBusyRetry: runWithBusyRetry,
};
