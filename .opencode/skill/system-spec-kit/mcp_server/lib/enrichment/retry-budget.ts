export interface RetryBudgetEntry {
  memoryId: number;
  step: string;
  reason: string;
  attempts: number;
  firstFailedAt: string;
  lastFailedAt: string;
}

const MAX_RETRIES = 3;
const budget = new Map<string, RetryBudgetEntry>();

function key(memoryId: number, step: string, reason: string): string {
  return `${memoryId}::${step}::${reason}`;
}

export function shouldRetry(memoryId: number, step: string, reason: string): boolean {
  const entry = budget.get(key(memoryId, step, reason));
  return !entry || entry.attempts < MAX_RETRIES;
}

export function recordFailure(memoryId: number, step: string, reason: string): RetryBudgetEntry {
  const budgetKey = key(memoryId, step, reason);
  const now = new Date().toISOString();
  const existing = budget.get(budgetKey);
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
  budget.set(budgetKey, entry);
  return entry;
}

export function clearBudget(memoryId?: number): void {
  if (memoryId === undefined) {
    budget.clear();
    return;
  }

  for (const budgetKey of budget.keys()) {
    if (budgetKey.startsWith(`${memoryId}::`)) {
      budget.delete(budgetKey);
    }
  }
}

export function getBudgetSize(): number {
  return budget.size;
}
