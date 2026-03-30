// ───────────────────────────────────────────────────────────────
// MODULE: Rollout Policy
// ───────────────────────────────────────────────────────────────
// Feature catalog: Feature flag governance
const DEFAULT_ROLLOUT_PERCENT = 100;

/** Read the global rollout percentage from SPECKIT_ROLLOUT_PERCENT (0-100, default 100).
 * @returns Clamped integer percentage
 */
function getRolloutPercent(): number {
  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  const trimmed = raw.trim();
  // Accept only full integer strings. Values like `50abc` or `1e2` fall back.
  if (!/^-?\d+$/.test(trimmed)) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  return Math.max(0, Math.min(100, parsed));
}

/** Hash an identity string to a stable 0-99 bucket for rollout gating.
 * @param identity - Unique identity string (e.g., flagName, userId)
 * @returns Bucket number 0-99
 */
function deterministicBucket(identity: string): number {
  let hash = 0;
  for (let i = 0; i < identity.length; i += 1) {
    hash = (hash * 31 + identity.charCodeAt(i)) >>> 0;
  }
  return hash % 100;
}

/** Check if an identity falls within the current rollout percentage.
 * @param identity - Identity to check
 * @returns true if the identity's bucket is within rollout range
 */
function isIdentityInRollout(identity: string): boolean {
  const rolloutPercent = getRolloutPercent();
  if (rolloutPercent >= 100) return true;
  if (rolloutPercent <= 0) return false;
  return deterministicBucket(identity) < rolloutPercent;
}

/** Check if a feature flag is enabled. Treats undefined/missing as enabled (default ON).
 * Explicitly set 'false' or '0' to disable. Rollout gating applies when percent < 100.
 * @param flagName - Environment variable name (e.g., SPECKIT_HYDE)
 * @param identity - Optional identity for deterministic rollout bucketing
 * @returns true if the feature is enabled for this identity
 */
function isFeatureEnabled(flagName: string, identity?: string): boolean {
  const rawFlag = process.env[flagName]?.toLowerCase()?.trim();
  // Treat 'false' and '0' as explicitly disabled; everything else (including undefined) is enabled
  if (rawFlag === 'false' || rawFlag === '0') return false;

  const rolloutPercent = getRolloutPercent();
  if (rolloutPercent >= 100) return true;
  if (rolloutPercent <= 0) return false;

  const normalizedIdentity = identity?.trim();
  if (!normalizedIdentity) {
    return true;
  }

  return isIdentityInRollout(normalizedIdentity);
}

export {
  getRolloutPercent,
  deterministicBucket,
  isIdentityInRollout,
  isFeatureEnabled,
};
