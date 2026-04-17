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

/** Optional metadata describing who produced a cached payload and how it was recovered. */
export interface RecoveredCompactMetadata {
  producer?: string;
  trustState?: string;
  sourceSurface?: string;
}

/**
 * Patterns used to strip lines that look like role prefixes or
 * instruction injections from recovered transcript payloads.
 * Exported for tests; hooks should prefer sanitizeRecoveredPayload.
 */
export const RECOVERED_TRANSCRIPT_STRIP_PATTERNS: readonly RegExp[] = [
  /^\s*(?:system|developer|assistant|user)\s*:/i,
  /^\s*\[(?:system|developer|assistant|user)\]\s*:/i,
  /^\s*(?:you are\b|important:|follow(?: these)? instructions\b|ignore (?:all|previous)|system prompt\b|developer note\b|role:|policy:)/i,
  /^\s*#{1,6}\s*(?:system|developer|assistant|user|instructions?|prompt)\b/i,
  /^\s*<(?:\/)?(?:system|developer|assistant|user|instructions?)\b/i,
];

function normalizeRecoveredPayloadLine(line: string): string {
  return line.normalize('NFKC').replace(/[\u00AD\u200B-\u200F\uFEFF]/g, '');
}

function normalizeRecoveredPayloadLineForMatching(line: string): string {
  return line.replace(/[\u0395\u03B5]/g, (char) => (char === '\u0395' ? 'E' : 'e'));
}

/** URL-escape a provenance field value so forged markers cannot break out of the marker line. */
export function escapeProvenanceField(value: unknown, fallback: string): string {
  return encodeURIComponent(typeof value === 'string' ? value : fallback);
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
  const provenanceLine = metadata
    ? `[PROVENANCE: producer=${escapeProvenanceField(metadata.producer, 'hook-cache')}; trustState=${escapeProvenanceField(metadata.trustState, 'cached')}; sourceSurface=${escapeProvenanceField(metadata.sourceSurface, 'compact')}]`
    : null;
  return [
    `[SOURCE: hook-cache, cachedAt: ${cachedAt}]`,
    ...(provenanceLine ? [provenanceLine] : []),
    sanitizedPayload,
    '[/SOURCE]',
  ].join('\n');
}
