// ───────────────────────────────────────────────────────────────
// MODULE: Retry Budget
// ───────────────────────────────────────────────────────────────

/**
 * Tracks per-memory enrichment retry state for the current Node.js process only.
 *
 * @invariant ephemeral — budget entries do not persist across process restarts.
 * AsyncLocalStorage caller-context is request-scoped while this Map is process-scoped;
 * both are wiped on restart, so no retry carry-over survives a crash or fresh boot.
 * C4 (iter 5) documents that shared expectation explicitly for recovery analysis.
 */

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

/** Failure-tracking entry for a single enrichment step and retry reason. */
export interface RetryBudgetEntry {
  readonly memoryId: number;
  readonly step: string;
  readonly reason: string;
  readonly attempts: number;
  readonly firstFailedAt: string;
  readonly lastFailedAt: string;
}

export interface RetryTelemetryRecord {
  readonly type: 'event';
  readonly event: 'retry_attempt';
  readonly memoryId: string;
  readonly step: string;
  readonly reason: string;
  readonly attempt: number;
  readonly outcome: 'retry' | 'give_up' | 'resolved';
  readonly timestamp: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS & STATE
// ───────────────────────────────────────────────────────────────

const MAX_RETRIES = 3;
const retryBudget = new Map<string, RetryBudgetEntry>();

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function buildRetryBudgetKey(memoryId: number, step: string, reason: string): string {
  return `${memoryId}::${step}::${reason}`;
}

// ───────────────────────────────────────────────────────────────
// 4. EXPORTS
// ───────────────────────────────────────────────────────────────

/** Return whether the retry budget still permits another attempt. */
export function shouldRetry(memoryId: number, step: string, reason: string): boolean {
  const entry = retryBudget.get(buildRetryBudgetKey(memoryId, step, reason));
  return !entry || entry.attempts < MAX_RETRIES;
}

/** Return the current retry-budget entry for one memory/step/reason tuple. */
export function getRetryBudgetEntry(
  memoryId: number,
  step: string,
  reason: string,
): RetryBudgetEntry | undefined {
  return retryBudget.get(buildRetryBudgetKey(memoryId, step, reason));
}

/** Record a failed enrichment attempt and return the updated budget entry. */
export function recordFailure(memoryId: number, step: string, reason: string): RetryBudgetEntry {
  const budgetKey = buildRetryBudgetKey(memoryId, step, reason);
  const now = new Date().toISOString();
  const existing = retryBudget.get(budgetKey);
  const entry: RetryBudgetEntry = existing
    ? {
        ...existing,
        attempts: existing.attempts + 1,
        lastFailedAt: now,
      }
    : {
        memoryId,
        step,
        reason,
        attempts: 1,
        firstFailedAt: now,
        lastFailedAt: now,
      };
  retryBudget.set(budgetKey, entry);
  return entry;
}

/** Emit a structured retry telemetry event to the same stderr JSON channel used by runtime diagnostics. */
export function emitRetryTelemetry(record: RetryTelemetryRecord): void {
  console.warn(JSON.stringify(record));
}

/** Clear retry state for a single memory ID. */
export function clearBudget(memoryId: number): void {
  for (const budgetKey of retryBudget.keys()) {
    const entry = retryBudget.get(budgetKey);
    if (entry?.memoryId === memoryId) {
      retryBudget.delete(budgetKey);
    }
  }
}

/** Clear every retry budget entry in the current process. */
export function clearAllBudgets(): void {
  retryBudget.clear();
}

/** Expose the current retry-budget size for diagnostics and tests. */
export function getBudgetSize(): number {
  return retryBudget.size;
}
