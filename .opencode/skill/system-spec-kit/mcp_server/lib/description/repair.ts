// ───────────────────────────────────────────────────────────────
// MODULE: description.json merge-preserving repair helper
// ───────────────────────────────────────────────────────────────

export type MergePreserveInput<T extends Record<string, unknown>> = {
  partial: Record<string, unknown>;
  canonicalOverrides: T;
};

export type MergePreserveResult<T extends Record<string, unknown>> = {
  merged: T & Record<string, unknown>;
  overriddenKeys: string[];
  preservedKeys: string[];
};

export function mergePreserveRepair<T extends Record<string, unknown>>(
  input: MergePreserveInput<T>,
): MergePreserveResult<T> {
  const merged: T & Record<string, unknown> = {
    ...input.partial,
  } as T & Record<string, unknown>;
  const mergedRecord = merged as Record<string, unknown>;
  const overriddenKeys: string[] = [];
  const preservedKeys: string[] = [];

  for (const key of Object.keys(input.partial)) {
    if (!Object.prototype.hasOwnProperty.call(input.canonicalOverrides, key)) {
      preservedKeys.push(key);
    }
  }

  for (const [key, value] of Object.entries(input.canonicalOverrides)) {
    mergedRecord[key] = value;
    overriddenKeys.push(key);
  }

  return {
    merged,
    overriddenKeys,
    preservedKeys,
  };
}
