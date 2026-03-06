// ---------------------------------------------------------------
// MODULE: Rollout Policy
// ---------------------------------------------------------------

const DEFAULT_ROLLOUT_PERCENT = 100;

function getRolloutPercent(): number {
  const raw = process.env.SPECKIT_ROLLOUT_PERCENT;
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    return DEFAULT_ROLLOUT_PERCENT;
  }

  return Math.max(0, Math.min(100, parsed));
}

function deterministicBucket(identity: string): number {
  let hash = 0;
  for (let i = 0; i < identity.length; i += 1) {
    hash = (hash * 31 + identity.charCodeAt(i)) >>> 0;
  }
  return hash % 100;
}

function isIdentityInRollout(identity: string): boolean {
  const rolloutPercent = getRolloutPercent();
  if (rolloutPercent >= 100) return true;
  if (rolloutPercent <= 0) return false;
  return deterministicBucket(identity) < rolloutPercent;
}

function isFeatureEnabled(flagName: string, identity?: string): boolean {
  const rawFlag = process.env[flagName]?.toLowerCase()?.trim();
  // Treat 'false' and '0' as explicitly disabled; everything else (including undefined) is enabled
  if (rawFlag === 'false' || rawFlag === '0') return false;

  const rolloutPercent = getRolloutPercent();
  if (rolloutPercent >= 100) return true;
  if (rolloutPercent <= 0) return false;

  if (!identity || identity.trim().length === 0) {
    return true;
  }

  return isIdentityInRollout(identity);
}

export {
  getRolloutPercent,
  deterministicBucket,
  isIdentityInRollout,
  isFeatureEnabled,
};
