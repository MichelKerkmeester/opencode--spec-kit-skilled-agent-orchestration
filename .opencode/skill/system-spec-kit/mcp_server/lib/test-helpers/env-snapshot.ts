// ───────────────────────────────────────────────────────────────
// MODULE: Test Env Snapshot Helper
// ───────────────────────────────────────────────────────────────
// Snapshot a list of process.env keys at call time and return a
// restore() function that re-sets each key to its captured value
// (re-set if it had a value, delete if it was undefined).
//
// Used by tests that mutate process.env to ensure restoration runs
// even when assertions fail. Pair with vitest's beforeEach/afterEach:
//
//   let restoreEnv: () => void;
//   beforeEach(() => { restoreEnv = snapshotEnv(['MY_VAR']); });
//   afterEach(() => { restoreEnv(); });
//
// Closes packet-049 sub-phase 009 finding F-015-C5-04 / F-015-C5-05
// (env-leak across tests). Test-only infrastructure; no product
// surface depends on this module.

/**
 * Snapshot the current values of the given process.env keys.
 *
 * @param keys env keys to capture
 * @returns restore() function that resets each key to its captured value
 */
export function snapshotEnv(keys: readonly string[]): () => void {
  const captured = new Map<string, string | undefined>();
  for (const key of keys) {
    captured.set(key, process.env[key]);
  }
  return function restore(): void {
    for (const [key, value] of captured) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  };
}
