// ───────────────────────────────────────────────────────────────
// MODULE: Exhaustiveness
// ───────────────────────────────────────────────────────────────

/**
 * Throw an error for a branch that should be statically unreachable.
 *
 * @param unexpectedValue - Value that escaped exhaustive narrowing
 * @param context - Optional call-site context for clearer diagnostics
 * @returns Never returns; always throws
 */
export function assertNever(
  unexpectedValue: never,
  context?: string,
): never {
  throw new Error(
    `Exhaustiveness violation: unexpected value ${JSON.stringify(unexpectedValue)}${context ? ` (${context})` : ''}`,
  );
}
