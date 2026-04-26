// ───────────────────────────────────────────────────────────────
// MODULE: Advisor JSON Guards
// ───────────────────────────────────────────────────────────────
// Shared narrowing + parse helpers used by derived metadata extraction,
// the scorer projection layer, and adapter normalizers. Centralizes the
// "parse JSON, assert it is a string-keyed object, otherwise empty"
// pattern so its behavior cannot drift between callers.

import { existsSync, readFileSync } from 'node:fs';

/**
 * Type-guard for plain object records (i.e. excludes `null` and arrays).
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parse a JSON string and return it iff the result is a plain object.
 * Returns `null` on parse failure or any other shape (array, scalar, null).
 */
export function parseJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Parse a JSON string and return it as a `string[]` filtered to string entries.
 * Returns `[]` on parse failure or any non-array shape. Non-string entries are
 * dropped.
 */
export function parseJsonStringArray(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === 'string')
      : [];
  } catch {
    return [];
  }
}

/**
 * Read the file at `filePath` and parse it as a JSON object. Returns `null`
 * when the file does not exist, fails to parse, or does not parse to an
 * object shape. Throws only when `readFileSync` itself fails for a non-ENOENT
 * reason (the caller is expected to surface that as a hard error).
 */
export function readJsonObject(filePath: string): Record<string, unknown> | null {
  if (!existsSync(filePath)) return null;
  return parseJsonObject(readFileSync(filePath, 'utf8'));
}
