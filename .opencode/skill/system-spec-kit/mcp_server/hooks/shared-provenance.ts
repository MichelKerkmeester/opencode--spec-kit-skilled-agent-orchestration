// ───────────────────────────────────────────────────────────────
// MODULE: Shared Provenance Helpers
// ───────────────────────────────────────────────────────────────
// Shared provenance helpers consumed by Claude, Gemini, and Copilot
// hook runtimes. Previously in hooks/claude/shared.ts; extracted per
// T-W1-HOK-02 to enable Copilot compact-cache parity in T-W1-HOK-01.
//
// These helpers sanitize recovered compact payloads (stripping
// adversarial system/developer/assistant/user prefixes) and wrap
// them with explicit provenance markers so downstream hooks can
// distinguish cached context from first-class user/assistant turns.

import {
  CANONICAL_FOLD_VERSION,
  canonicalFold,
  getUnicodeRuntimeFingerprint,
  type UnicodeRuntimeFingerprint,
} from '@spec-kit/shared/unicode-normalization';

/** Optional metadata describing who produced a cached payload and how it was recovered. */
export interface RecoveredCompactMetadata {
  readonly producer?: string;
  readonly trustState?: string;
  readonly sourceSurface?: string;
  readonly sanitizerVersion?: string;
  readonly runtimeFingerprint?: UnicodeRuntimeFingerprint;
}

/**
 * Patterns used to strip lines that look like role prefixes or
 * instruction injections from recovered transcript payloads.
 * Exported for tests; hooks should prefer sanitizeRecoveredPayload.
 */
export const RECOVERED_TRANSCRIPT_STRIP_PATTERNS: readonly RegExp[] = [
  /^\s*(?:system|developer|assistant|user)\s*:/i,
  /^\s*\[(?:system|developer|assistant|user)\]\s*:/i,
  /^\s*(?:you are\b|important:|follow(?: these)? instructions\b|ignore\s*:?\s*(?:all|previous)|system prompt\b|developer note\b|role:|policy:)/i,
  /^\s*(?:(?:f|q)\d+|ac-?\d+|phase\s+\d+|iter(?:ation)?\s+\d+)\b/i,
  /^\s*#{1,6}\s*(?:system|developer|assistant|user|instructions?|prompt)\b/i,
  /^\s*<(?:\/)?(?:system|developer|assistant|user|instructions?)\b/i,
];

function normalizeRecoveredPayloadLine(line: string): string {
  return canonicalFold(line);
}

export function foldUnicodeConfusablesToAscii(value: string): string {
  return canonicalFold(value);
}

export function normalizeRecoveredPayloadLineForMatching(line: string): string {
  return foldUnicodeConfusablesToAscii(line);
}

/** URL-escape a provenance field value so forged markers cannot break out of the marker line. */
export function escapeProvenanceField(value: unknown, fallback: string): string {
  return encodeURIComponent(typeof value === 'string' ? value : fallback);
}

export function buildRecoveredCompactMetadata(
  metadata: RecoveredCompactMetadata = {},
): Required<RecoveredCompactMetadata> {
  return {
    producer: metadata.producer ?? 'hook-cache',
    trustState: metadata.trustState ?? 'cached',
    sourceSurface: metadata.sourceSurface ?? 'compact',
    sanitizerVersion: metadata.sanitizerVersion ?? CANONICAL_FOLD_VERSION,
    runtimeFingerprint: metadata.runtimeFingerprint ?? getUnicodeRuntimeFingerprint(),
  };
}

/** Remove obvious system-instruction lines from recovered transcript text */
export function sanitizeRecoveredPayload(payload: string): string {
  return payload
    .split(/\r?\n/)
    .map((line) => normalizeRecoveredPayloadLine(line))
    .filter((line) => !RECOVERED_TRANSCRIPT_STRIP_PATTERNS.some((pattern) => pattern.test(normalizeRecoveredPayloadLineForMatching(line))))
    .join('\n')
    .trim();
}

/** Add explicit provenance markers around recovered compact context */
export function wrapRecoveredCompactPayload(
  payload: string,
  cachedAt: string,
  metadata?: RecoveredCompactMetadata,
): string {
  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  const provenance = metadata ? buildRecoveredCompactMetadata(metadata) : null;
  const fingerprint = provenance?.runtimeFingerprint
    ? `node=${escapeProvenanceField(provenance.runtimeFingerprint.node, 'unknown')},icu=${escapeProvenanceField(provenance.runtimeFingerprint.icu, 'unknown')},unicode=${escapeProvenanceField(provenance.runtimeFingerprint.unicode, 'unknown')}`
    : null;
  const provenanceLine = provenance
    ? `[PROVENANCE: producer=${escapeProvenanceField(provenance.producer, 'hook-cache')}; trustState=${escapeProvenanceField(provenance.trustState, 'cached')}; sourceSurface=${escapeProvenanceField(provenance.sourceSurface, 'compact')}; sanitizerVersion=${escapeProvenanceField(provenance.sanitizerVersion, CANONICAL_FOLD_VERSION)}; runtimeFingerprint=${escapeProvenanceField(fingerprint, 'unknown')}]`
    : null;
  return [
    `[SOURCE: hook-cache, cachedAt: ${cachedAt}]`,
    ...(provenanceLine ? [provenanceLine] : []),
    sanitizedPayload,
    '[/SOURCE]',
  ].join('\n');
}
