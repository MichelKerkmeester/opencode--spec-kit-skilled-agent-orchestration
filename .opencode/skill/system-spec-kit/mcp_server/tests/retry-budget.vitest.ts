import { afterEach, describe, expect, it } from 'vitest';

import {
  clearAllBudgets,
  clearBudget,
  getBudgetSize,
  recordFailure,
  shouldRetry,
} from '../lib/enrichment/retry-budget.js';

describe('retry budget', () => {
  afterEach(() => {
    clearAllBudgets();
  });

  it('allows the first attempt for a fresh key', () => {
    expect(shouldRetry(1, 'causal_links', 'partial_causal_link_unresolved')).toBe(true);
  });

  it('allows the first three attempts and rejects the fourth', () => {
    const args = [11, 'causal_links', 'partial_causal_link_unresolved'] as const;

    expect(shouldRetry(...args)).toBe(true);
    recordFailure(...args);
    expect(shouldRetry(...args)).toBe(true);
    recordFailure(...args);
    expect(shouldRetry(...args)).toBe(true);
    recordFailure(...args);
    expect(shouldRetry(...args)).toBe(false);
  });

  it('increments attempts while preserving firstFailedAt', () => {
    const first = recordFailure(12, 'causal_links', 'partial_causal_link_unresolved');
    const second = recordFailure(12, 'causal_links', 'partial_causal_link_unresolved');

    expect(first.attempts).toBe(1);
    expect(second.attempts).toBe(2);
    expect(second.firstFailedAt).toBe(first.firstFailedAt);
    expect(Date.parse(second.lastFailedAt)).toBeGreaterThanOrEqual(Date.parse(first.lastFailedAt));
  });

  it('isolates budgets by memoryId', () => {
    recordFailure(21, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(21, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(21, 'causal_links', 'partial_causal_link_unresolved');

    expect(shouldRetry(21, 'causal_links', 'partial_causal_link_unresolved')).toBe(false);
    expect(shouldRetry(22, 'causal_links', 'partial_causal_link_unresolved')).toBe(true);
  });

  it('isolates budgets by step', () => {
    recordFailure(31, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(31, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(31, 'causal_links', 'partial_causal_link_unresolved');

    expect(shouldRetry(31, 'causal_links', 'partial_causal_link_unresolved')).toBe(false);
    expect(shouldRetry(31, 'entity_linking', 'partial_causal_link_unresolved')).toBe(true);
  });

  it('isolates budgets by reason', () => {
    recordFailure(41, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(41, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(41, 'causal_links', 'partial_causal_link_unresolved');

    expect(shouldRetry(41, 'causal_links', 'partial_causal_link_unresolved')).toBe(false);
    expect(shouldRetry(41, 'causal_links', 'partial_causal_link_errors')).toBe(true);
  });

  it('clearBudget(memoryId) removes only entries for that memory', () => {
    recordFailure(51, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(52, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(52, 'entity_linking', 'density_guard');

    clearBudget(52);

    expect(getBudgetSize()).toBe(1);
    expect(shouldRetry(51, 'causal_links', 'partial_causal_link_unresolved')).toBe(true);
    expect(shouldRetry(52, 'causal_links', 'partial_causal_link_unresolved')).toBe(true);
  });

  it('clearAllBudgets() removes every entry', () => {
    recordFailure(61, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(62, 'entity_linking', 'density_guard');

    clearAllBudgets();

    expect(getBudgetSize()).toBe(0);
    expect(shouldRetry(61, 'causal_links', 'partial_causal_link_unresolved')).toBe(true);
    expect(shouldRetry(62, 'entity_linking', 'density_guard')).toBe(true);
  });

  it('reports the current budget size accurately', () => {
    expect(getBudgetSize()).toBe(0);
    recordFailure(71, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(71, 'causal_links', 'partial_causal_link_unresolved');
    recordFailure(72, 'entity_linking', 'density_guard');

    expect(getBudgetSize()).toBe(2);
  });
});
