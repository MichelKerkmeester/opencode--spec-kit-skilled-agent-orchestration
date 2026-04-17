// ───────────────────────────────────────────────────────────────
// MODULE: Exhaustiveness
// ───────────────────────────────────────────────────────────────

export function assertNever(x: never, context?: string): never {
  throw new Error(
    `Exhaustiveness violation: unexpected value ${JSON.stringify(x)}${context ? ` (${context})` : ''}`,
  );
}
