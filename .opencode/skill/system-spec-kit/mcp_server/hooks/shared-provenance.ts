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
  readonly producer?: string;
  readonly trustState?: string;
  readonly sourceSurface?: string;
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

const RECOVERED_PAYLOAD_HIDDEN_CHAR_PATTERN = /[\u00AD\u200B-\u200F\uFEFF]/g;
const RECOVERED_PAYLOAD_COMBINING_MARK_PATTERN = /\p{M}/gu;
const RECOVERED_PAYLOAD_CONFUSABLE_REPLACEMENTS = Object.freeze([
  [/\u0410/g, 'A'],
  [/\u0430/g, 'a'],
  [/\u0412/g, 'B'],
  [/\u0432/g, 'v'],
  [/\u0421/g, 'C'],
  [/\u0441/g, 'c'],
  [/\u0395|\u0415/g, 'E'],
  [/\u03B5|\u0435/g, 'e'],
  [/\u041D/g, 'H'],
  [/\u043D/g, 'h'],
  [/\u0406/g, 'I'],
  [/\u0456/g, 'i'],
  [/\u041A/g, 'K'],
  [/\u043A/g, 'k'],
  [/\u041C/g, 'M'],
  [/\u043C/g, 'm'],
  [/\u041E/g, 'O'],
  [/\u043E/g, 'o'],
  [/\u0420/g, 'P'],
  [/\u0440/g, 'p'],
  [/\u0405/g, 'S'],
  [/\u0455/g, 's'],
  [/\u0422/g, 'T'],
  [/\u0442/g, 't'],
  [/\u0425/g, 'X'],
  [/\u0445/g, 'x'],
  [/\u0423/g, 'Y'],
  [/\u0443/g, 'y'],
] as const);

function normalizeRecoveredPayloadLine(line: string): string {
  return line.normalize('NFKC').replace(RECOVERED_PAYLOAD_HIDDEN_CHAR_PATTERN, '');
}

export function foldUnicodeConfusablesToAscii(value: string): string {
  let normalized = normalizeRecoveredPayloadLine(value)
    .normalize('NFD')
    .replace(RECOVERED_PAYLOAD_COMBINING_MARK_PATTERN, '');
  for (const [pattern, replacement] of RECOVERED_PAYLOAD_CONFUSABLE_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized;
}

export function normalizeRecoveredPayloadLineForMatching(line: string): string {
  return foldUnicodeConfusablesToAscii(line);
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
