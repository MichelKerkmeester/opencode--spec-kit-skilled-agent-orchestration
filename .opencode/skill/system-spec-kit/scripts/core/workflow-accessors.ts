// ───────────────────────────────────────────────────────────────
// MODULE: Workflow Accessors
// ───────────────────────────────────────────────────────────────
// Safe typed accessors for reading values from loosely-typed objects.
// Extracted from workflow.ts to reduce module size.

// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────

/** Accepts both Record<string, unknown> (readNamedObject results) and typed interfaces
 * (CollectedDataFull) without requiring an index signature on the typed interface.
 * Each helper casts to Record internally -- safe because all values are runtime-checked. */

export function readNamedObject(source: object | null | undefined, ...keys: string[]): Record<string, unknown> | null {
  if (!source) {
    return null;
  }
  const src = source as Record<string, unknown>;

  for (const key of keys) {
    const value = src[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }

  return null;
}

export function readStringArray(source: object | null | undefined, ...keys: string[]): string[] {
  if (!source) {
    return [];
  }
  const src = source as Record<string, unknown>;

  for (const key of keys) {
    const value = src[key];
    if (Array.isArray(value)) {
      return value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter(Boolean);
    }
  }

  return [];
}

export function readNumber(source: object | null | undefined, fallback: number, ...keys: string[]): number {
  if (!source) {
    return fallback;
  }
  const src = source as Record<string, unknown>;

  for (const key of keys) {
    const value = src[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return fallback;
}

export function readString(source: object | null | undefined, fallback: string, ...keys: string[]): string {
  if (!source) {
    return fallback;
  }
  const src = source as Record<string, unknown>;

  for (const key of keys) {
    const value = src[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback;
}

export function capText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength - 3).trim();
  return `${truncated}...`;
}

export function summarizeAuditCounts(counts: Map<string, number>): string[] {
  return [...counts.entries()].map(([label, count]) => `${label} x${count}`);
}
