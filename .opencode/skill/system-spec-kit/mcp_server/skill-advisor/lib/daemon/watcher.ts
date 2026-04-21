// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon Watcher
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import Database from 'better-sqlite3';
import chokidar from 'chokidar';
import { indexSkillMetadata } from '../../../lib/skill-graph/skill-graph-db.js';
import { workspaceRelativeFilePath } from '../derived/provenance.js';
import { publishSkillGraphGeneration } from '../freshness/generation.js';

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
  close: () => Promise<void>;
  getWatched?: () => Record<string, string[]>;
}

export interface SkillGraphWatcher {
  readonly targets: readonly WatchTarget[];
  status: () => SkillGraphWatcherStatus;
  refreshTargets: () => void;
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultSkillsRoot(workspaceRoot: string): string {
  return join(resolve(workspaceRoot), '.opencode', 'skill');
}

function isSqliteBusyError(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  const message = error instanceof Error ? error.message : String(error);
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

async function withBusyRetry<T>(operation: () => Promise<T> | T, delaysMs: readonly number[]): Promise<T> {
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

function parseDerivedKeyFiles(graphMetadataPath: string, workspaceRoot: string): string[] {
  if (!existsSync(graphMetadataPath)) return [];
  try {
    const parsed: unknown = JSON.parse(readFileSync(graphMetadataPath, 'utf8'));
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return [];
    const derived = (parsed as { derived?: unknown }).derived;
    if (typeof derived !== 'object' || derived === null || Array.isArray(derived)) return [];
    const keyFiles = (derived as { key_files?: unknown }).key_files;
    if (!Array.isArray(keyFiles)) return [];
    return keyFiles
      .filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
      .map((entry) => workspaceRelativeFilePath(workspaceRoot, entry))
      .filter((entry): entry is string => entry !== null)
      .map((entry) => resolve(workspaceRoot, entry))
      .filter((entry) => existsSync(entry));
  } catch {
    return [];
  }
}

export function discoverWatchTargets(workspaceRoot: string, skillsRoot = defaultSkillsRoot(workspaceRoot)): WatchTarget[] {
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
      for (const keyFile of parseDerivedKeyFiles(graphMetadata, root)) {
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

function openQuarantineDb(workspaceRoot: string, override?: string): Database.Database {
  const dbPath = quarantineDbPath(workspaceRoot, override);
  mkdirSync(dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS quarantined_skill (
      skill_slug TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      reason TEXT NOT NULL,
      quarantined_at TEXT NOT NULL,
      recovered_at TEXT
    );
  `);
  return db;
}

export function quarantineSkill(workspaceRoot: string, skillSlug: string, filePath: string, reason: string, dbPath?: string): void {
  const db = openQuarantineDb(workspaceRoot, dbPath);
  try {
    db.prepare(`
      INSERT INTO quarantined_skill (skill_slug, path, reason, quarantined_at, recovered_at)
      VALUES (?, ?, ?, ?, NULL)
      ON CONFLICT(skill_slug) DO UPDATE SET
        path = excluded.path,
        reason = excluded.reason,
        quarantined_at = excluded.quarantined_at,
        recovered_at = NULL
    `).run(skillSlug, filePath, reason, new Date().toISOString());
  } finally {
    db.close();
  }
}

export function recoverQuarantinedSkill(workspaceRoot: string, skillSlug: string, dbPath?: string): void {
  const db = openQuarantineDb(workspaceRoot, dbPath);
  try {
    db.prepare(`
      UPDATE quarantined_skill
      SET recovered_at = ?
      WHERE skill_slug = ? AND recovered_at IS NULL
    `).run(new Date().toISOString(), skillSlug);
  } finally {
    db.close();
  }
}

export function countActiveQuarantines(workspaceRoot: string, dbPath?: string): number {
  const db = openQuarantineDb(workspaceRoot, dbPath);
  try {
    const row = db.prepare('SELECT COUNT(*) AS count FROM quarantined_skill WHERE recovered_at IS NULL').get() as { count: number };
    return row.count;
  } finally {
    db.close();
  }
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
  let targets = discoverWatchTargets(workspaceRoot, skillsRoot);
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
  const diagnostics: string[] = [];
  let debounceTimer: NodeJS.Timeout | null = null;
  let circuitOpenUntil = 0;
  let closed = false;
  let lastReindexAt: string | null = null;

  const defaultReindex = async (): Promise<ReindexResult> => indexSkillMetadata(skillsRoot);
  const reindexSkill = options.reindexSkill ?? defaultReindex;

  function refreshTargets(): void {
    const refreshed = discoverWatchTargets(workspaceRoot, skillsRoot);
    const known = new Set(targets.map((target) => target.path));
    const additions = refreshed.filter((target) => !known.has(target.path));
    targets = refreshed;
    if (additions.length > 0) {
      watcher.add?.(additions.map((target) => target.path));
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
      diagnostics.push(`REINDEX_STORM_CIRCUIT_OPEN:${eventTimes.length}`);
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
      diagnostics.push(`QUARANTINED:${request.skillSlug}`);
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

    await withBusyRetry(async () => {
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
    publishSkillGraphGeneration({
      workspaceRoot,
      changedPaths,
      reason: options.generationReason ?? 'skill-graph-daemon-reindex',
      state: 'live',
    });
    lastReindexAt = new Date().toISOString();
    refreshTargets();
  }

  async function flushPending(): Promise<void> {
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
        const message = error instanceof Error ? error.message : String(error);
        diagnostics.push(`REINDEX_FAILED:${request.skillSlug}:${message}`);
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
    diagnostics.push(`WATCHER_ERROR:${error instanceof Error ? error.message : String(error)}`);
  });

  return {
    get targets() {
      return targets;
    },
    status: () => ({
      watchedPaths: targets.length,
      pendingEvents: [...pending.values()].reduce((total, item) => total + item.changedPaths.size, 0),
      circuitOpen: now() < circuitOpenUntil,
      quarantinedSkills: countActiveQuarantines(workspaceRoot, options.quarantineDbPath),
      lastReindexAt,
      diagnostics: [...diagnostics],
    }),
    refreshTargets,
    close: async () => {
      closed = true;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
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
  withBusyRetry,
};
