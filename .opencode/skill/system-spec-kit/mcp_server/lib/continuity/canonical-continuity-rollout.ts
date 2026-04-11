import * as vectorIndex from '../search/vector-index.js';

export const CANONICAL_CONTINUITY_FLAG_KEY = 'canonical_continuity_rollout' as const;
export const CANONICAL_CONTINUITY_CACHE_TTL_MS = 1_000;
export const CANONICAL_CONTINUITY_CACHE_BYPASS_AFTER_WRITE_MS = 60_000;

export type CanonicalContinuityRolloutState =
  | 'off'
  | 'shadow_only';

export interface CanonicalContinuityRolloutRecord {
  flagKey: typeof CANONICAL_CONTINUITY_FLAG_KEY;
  state: CanonicalContinuityRolloutState;
  bucketPercent: number;
  version: number;
  cooldownUntil: string | null;
  overrideMode: string;
  changedBy: string;
  changedReason: string;
  changedAt: string;
  incidentId: string | null;
}

interface CachedRolloutRecord {
  value: CanonicalContinuityRolloutRecord;
  loadedAt: number;
  bypassUntil: number;
}

interface CanonicalContinuityRolloutReadOptions {
  bypassCache?: boolean;
  nowMs?: number;
}

interface FeatureFlagRow {
  flag_key: string;
  state: string;
  bucket_percent: number;
  version: number;
  cooldown_until: string | null;
  override_mode: string;
  changed_by: string;
  changed_reason: string;
  changed_at: string;
  incident_id: string | null;
}

let rolloutCache: CachedRolloutRecord | null = null;

function getDb(): ReturnType<typeof vectorIndex.getDb> {
  return vectorIndex.getDb();
}

function getNow(): number {
  return Date.now();
}

function ensureFeatureFlagTables(db: NonNullable<ReturnType<typeof vectorIndex.getDb>>): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS feature_flags (
      flag_key TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      bucket_percent INTEGER NOT NULL,
      version INTEGER NOT NULL,
      cooldown_until TEXT NULL,
      override_mode TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_reason TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      incident_id TEXT NULL
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS feature_flag_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flag_key TEXT NOT NULL,
      from_state TEXT NOT NULL,
      to_state TEXT NOT NULL,
      resolved_state TEXT NULL,
      transition_kind TEXT NOT NULL,
      trigger_metric TEXT NULL,
      trigger_window TEXT NULL,
      trigger_value TEXT NULL,
      approved_by TEXT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

function normalizeState(value: string | null | undefined): CanonicalContinuityRolloutState {
  return value === 'shadow_only' ? 'shadow_only' : 'off';
}

function buildDefaultRecord(): CanonicalContinuityRolloutRecord {
  return {
    flagKey: CANONICAL_CONTINUITY_FLAG_KEY,
    state: 'off',
    bucketPercent: 0,
    version: 0,
    cooldownUntil: null,
    overrideMode: 'none',
    changedBy: 'system-default',
    changedReason: 'flag_uninitialized',
    changedAt: new Date(0).toISOString(),
    incidentId: null,
  };
}

function mapRow(row: FeatureFlagRow | undefined): CanonicalContinuityRolloutRecord {
  if (!row) {
    return buildDefaultRecord();
  }

  return {
    flagKey: CANONICAL_CONTINUITY_FLAG_KEY,
    state: normalizeState(row.state),
    bucketPercent: row.bucket_percent,
    version: row.version,
    cooldownUntil: row.cooldown_until,
    overrideMode: row.override_mode,
    changedBy: row.changed_by,
    changedReason: row.changed_reason,
    changedAt: row.changed_at,
    incidentId: row.incident_id,
  };
}

export function clearCanonicalContinuityRolloutCache(): void {
  rolloutCache = null;
}

export function getCanonicalContinuityRolloutRecord(
  options: CanonicalContinuityRolloutReadOptions = {},
): CanonicalContinuityRolloutRecord {
  const nowMs = options.nowMs ?? getNow();
  const shouldBypassCache = options.bypassCache === true || (rolloutCache !== null && nowMs < rolloutCache.bypassUntil);
  if (!shouldBypassCache && rolloutCache && nowMs < rolloutCache.loadedAt + CANONICAL_CONTINUITY_CACHE_TTL_MS) {
    return rolloutCache.value;
  }

  const db = getDb();
  if (!db) {
    const fallback = buildDefaultRecord();
    rolloutCache = { value: fallback, loadedAt: nowMs, bypassUntil: 0 };
    return fallback;
  }

  ensureFeatureFlagTables(db);
  const row = db.prepare(`
    SELECT flag_key, state, bucket_percent, version, cooldown_until, override_mode,
           changed_by, changed_reason, changed_at, incident_id
    FROM feature_flags
    WHERE flag_key = ?
  `).get(CANONICAL_CONTINUITY_FLAG_KEY) as FeatureFlagRow | undefined;

  const value = mapRow(row);
  rolloutCache = { value, loadedAt: nowMs, bypassUntil: rolloutCache?.bypassUntil ?? 0 };
  return value;
}

export function isCanonicalContinuityShadowOnlyEnabled(): boolean {
  return getCanonicalContinuityRolloutRecord().state === 'shadow_only';
}

export function isCanonicalContinuityShadowDualWriteEnabled(): boolean {
  return isCanonicalContinuityShadowOnlyEnabled();
}

export function activateCanonicalContinuityShadowOnly(args: {
  changedBy: string;
  reason: string;
  incidentId?: string | null;
  overrideMode?: string;
  bucketPercent?: number;
  nowMs?: number;
}): CanonicalContinuityRolloutRecord {
  const db = getDb();
  if (!db) {
    throw new Error('Canonical continuity rollout requires an initialized database.');
  }

  ensureFeatureFlagTables(db);
  const nowMs = args.nowMs ?? getNow();
  const nowIso = new Date(nowMs).toISOString();
  const previous = getCanonicalContinuityRolloutRecord({ bypassCache: true, nowMs });
  const nextVersion = previous.version + 1;
  const bucketPercent = args.bucketPercent ?? 100;
  const overrideMode = args.overrideMode ?? 'manual';

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO feature_flags (
        flag_key,
        state,
        bucket_percent,
        version,
        cooldown_until,
        override_mode,
        changed_by,
        changed_reason,
        changed_at,
        incident_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(flag_key) DO UPDATE SET
        state = excluded.state,
        bucket_percent = excluded.bucket_percent,
        version = excluded.version,
        cooldown_until = excluded.cooldown_until,
        override_mode = excluded.override_mode,
        changed_by = excluded.changed_by,
        changed_reason = excluded.changed_reason,
        changed_at = excluded.changed_at,
        incident_id = excluded.incident_id
    `).run(
      CANONICAL_CONTINUITY_FLAG_KEY,
      'shadow_only',
      bucketPercent,
      nextVersion,
      null,
      overrideMode,
      args.changedBy,
      args.reason,
      nowIso,
      args.incidentId ?? null,
    );

    db.prepare(`
      INSERT INTO feature_flag_events (
        flag_key,
        from_state,
        to_state,
        resolved_state,
        transition_kind,
        trigger_metric,
        trigger_window,
        trigger_value,
        approved_by,
        reason,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      CANONICAL_CONTINUITY_FLAG_KEY,
      previous.state,
      'shadow_only',
      null,
      'manual_activation',
      null,
      null,
      null,
      args.changedBy,
      args.reason,
      nowIso,
    );
  });

  tx();

  const value: CanonicalContinuityRolloutRecord = {
    flagKey: CANONICAL_CONTINUITY_FLAG_KEY,
    state: 'shadow_only',
    bucketPercent,
    version: nextVersion,
    cooldownUntil: null,
    overrideMode,
    changedBy: args.changedBy,
    changedReason: args.reason,
    changedAt: nowIso,
    incidentId: args.incidentId ?? null,
  };

  rolloutCache = {
    value,
    loadedAt: nowMs,
    bypassUntil: 0,
  };

  return value;
}
