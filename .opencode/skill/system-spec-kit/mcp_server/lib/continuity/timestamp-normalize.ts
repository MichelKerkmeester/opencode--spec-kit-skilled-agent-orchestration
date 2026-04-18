// ───────────────────────────────────────────────────────────────
// MODULE: Continuity timestamp precision normalization
// ───────────────────────────────────────────────────────────────

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const MIDNIGHT_UTC_RE = /T00:00:00(?:\.000)?(?:Z|\+00:00)$/;

function normalizeToCanonicalIso(raw: string): string {
  if (DATE_ONLY_RE.test(raw)) {
    return `${raw}T00:00:00Z`;
  }

  const parsed = Date.parse(raw);
  if (Number.isNaN(parsed)) {
    throw new RangeError(`Invalid ISO-8601 timestamp: ${raw}`);
  }

  return new Date(parsed).toISOString().replace('.000Z', 'Z');
}

export function isLowPrecision(raw: string): boolean {
  return DATE_ONLY_RE.test(raw) || MIDNIGHT_UTC_RE.test(raw);
}

export function normalizeTimestampPrecision(raw: string): string {
  return normalizeToCanonicalIso(raw);
}

export function comparePrecisionAware(
  a: string,
  b: string,
  thresholdMs: number,
): 'fresh' | 'stale' | 'low_precision_bypass' {
  if (isLowPrecision(a) || isLowPrecision(b)) {
    return 'low_precision_bypass';
  }

  const aMs = Date.parse(normalizeToCanonicalIso(a));
  const bMs = Date.parse(normalizeToCanonicalIso(b));
  const deltaMs = Math.abs(aMs - bMs);

  return deltaMs > thresholdMs ? 'stale' : 'fresh';
}
