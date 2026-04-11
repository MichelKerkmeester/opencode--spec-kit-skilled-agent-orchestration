import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import * as vectorIndex from '../lib/search/vector-index.js';
import {
  activateCanonicalContinuityShadowOnly,
  CANONICAL_CONTINUITY_FLAG_KEY,
  CANONICAL_CONTINUITY_CACHE_TTL_MS,
  clearCanonicalContinuityRolloutCache,
  getCanonicalContinuityRolloutRecord,
  isCanonicalContinuityShadowDualWriteEnabled,
  isCanonicalContinuityShadowOnlyEnabled,
} from '../lib/continuity/canonical-continuity-rollout.js';

describe('canonical continuity rollout control plane', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearCanonicalContinuityRolloutCache();
  });

  it('defaults to off when no database is available', () => {
    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(null);

    expect(getCanonicalContinuityRolloutRecord()).toMatchObject({
      flagKey: CANONICAL_CONTINUITY_FLAG_KEY,
      state: 'off',
      bucketPercent: 0,
      version: 0,
    });
    expect(isCanonicalContinuityShadowOnlyEnabled()).toBe(false);
    expect(isCanonicalContinuityShadowDualWriteEnabled()).toBe(false);
  });

  it('activates S1 shadow_only and records an audit event', () => {
    const db = new Database(':memory:');
    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(
      db as unknown as ReturnType<typeof vectorIndex.getDb>,
    );

    const record = activateCanonicalContinuityShadowOnly({
      changedBy: 'gate-c',
      reason: 'Enable shadow-only dual-write baseline',
    });

    expect(record).toMatchObject({
      state: 'shadow_only',
      bucketPercent: 100,
      version: 1,
      changedBy: 'gate-c',
      changedReason: 'Enable shadow-only dual-write baseline',
    });
    expect(isCanonicalContinuityShadowOnlyEnabled()).toBe(true);
    expect(isCanonicalContinuityShadowDualWriteEnabled()).toBe(true);

    const storedFlag = db.prepare(`
      SELECT flag_key, state, bucket_percent, version, changed_by, changed_reason
      FROM feature_flags
      WHERE flag_key = ?
    `).get(CANONICAL_CONTINUITY_FLAG_KEY) as {
      flag_key: string;
      state: string;
      bucket_percent: number;
      version: number;
      changed_by: string;
      changed_reason: string;
    };
    expect(storedFlag).toMatchObject({
      flag_key: CANONICAL_CONTINUITY_FLAG_KEY,
      state: 'shadow_only',
      bucket_percent: 100,
      version: 1,
      changed_by: 'gate-c',
      changed_reason: 'Enable shadow-only dual-write baseline',
    });

    const event = db.prepare(`
      SELECT flag_key, from_state, to_state, transition_kind, approved_by
      FROM feature_flag_events
      WHERE flag_key = ?
    `).get(CANONICAL_CONTINUITY_FLAG_KEY) as {
      flag_key: string;
      from_state: string;
      to_state: string;
      transition_kind: string;
      approved_by: string | null;
    };
    expect(event).toMatchObject({
      flag_key: CANONICAL_CONTINUITY_FLAG_KEY,
      from_state: 'off',
      to_state: 'shadow_only',
      transition_kind: 'manual_activation',
      approved_by: 'gate-c',
    });
  });

  it('keeps a 1-second read cache unless callers explicitly bypass it', () => {
    const db = new Database(':memory:');
    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(
      db as unknown as ReturnType<typeof vectorIndex.getDb>,
    );

    activateCanonicalContinuityShadowOnly({
      changedBy: 'gate-c',
      reason: 'Prime cache semantics',
      nowMs: 1_000,
    });

    db.prepare(`
      UPDATE feature_flags
      SET state = ?, bucket_percent = ?, version = ?, changed_reason = ?
      WHERE flag_key = ?
    `).run('off', 0, 2, 'mutated underneath cache', CANONICAL_CONTINUITY_FLAG_KEY);

    const cached = getCanonicalContinuityRolloutRecord({ nowMs: 1_000 + CANONICAL_CONTINUITY_CACHE_TTL_MS - 1 });
    const bypassed = getCanonicalContinuityRolloutRecord({ nowMs: 1_000 + CANONICAL_CONTINUITY_CACHE_TTL_MS - 1, bypassCache: true });
    const expired = getCanonicalContinuityRolloutRecord({ nowMs: 1_000 + CANONICAL_CONTINUITY_CACHE_TTL_MS + 1 });

    expect(cached.state).toBe('shadow_only');
    expect(bypassed.state).toBe('off');
    expect(expired.state).toBe('off');
  });
});
