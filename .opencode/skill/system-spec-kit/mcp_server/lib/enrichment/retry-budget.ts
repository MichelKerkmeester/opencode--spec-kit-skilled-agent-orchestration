// ───────────────────────────────────────────────────────────────
// MODULE: Retry Budget
// ───────────────────────────────────────────────────────────────

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

/** Clear all retry state, or only the entries for one memory when provided. */
export function clearBudget(memoryId?: number): void {
  if (memoryId === undefined) {
    retryBudget.clear();
    return;
  }

  for (const budgetKey of retryBudget.keys()) {
    if (budgetKey.startsWith(`${memoryId}::`)) {
      retryBudget.delete(budgetKey);
    }
  }
}

/** Expose the current retry-budget size for diagnostics and tests. */
export function getBudgetSize(): number {
  return retryBudget.size;
}
