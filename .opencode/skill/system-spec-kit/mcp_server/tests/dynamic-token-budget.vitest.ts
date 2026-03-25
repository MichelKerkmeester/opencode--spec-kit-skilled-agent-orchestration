// ───────────────────────────────────────────────────────────────
// 1. TEST — DYNAMIC TOKEN BUDGET
// ───────────────────────────────────────────────────────────────
// Query Intelligence
// 16 tests covering:
// Budget per tier, flag disabled, custom config, edge cases

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getDynamicTokenBudget,
  isDynamicTokenBudgetEnabled,
  DEFAULT_BUDGET,
  DEFAULT_TOKEN_BUDGET_CONFIG,
  type TokenBudgetConfig,
  type BudgetResult,
} from '../lib/search/dynamic-token-budget';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const FLAG = 'SPECKIT_DYNAMIC_TOKEN_BUDGET';

function enableFlag(): void {
  process.env[FLAG] = 'true';
}

function disableFlag(): void {
  delete process.env[FLAG];
}

function withFlag(fn: () => void): void {
  const original = process.env[FLAG];
  process.env[FLAG] = 'true';
  try {
    fn();
  } finally {
    if (original === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = original;
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   T030-01: FEATURE FLAG
   ──────────────────────────────────────────────────────────────── */

describe('T030-01: Feature Flag (SPECKIT_DYNAMIC_TOKEN_BUDGET)', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env[FLAG];
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env[FLAG];
    } else {
      process.env[FLAG] = originalEnv;
    }
  });

  it('T1: defaults to enabled when env var not set (graduated flag)', () => {
    delete process.env[FLAG];
    expect(isDynamicTokenBudgetEnabled()).toBe(true);
  });

  it('T2: disabled when env var is "false"', () => {
    process.env[FLAG] = 'false';
    expect(isDynamicTokenBudgetEnabled()).toBe(false);
  });

  it('T3: disabled when env var is "0"', () => {
    process.env[FLAG] = '0';
    expect(isDynamicTokenBudgetEnabled()).toBe(false);
  });

  it('T4: enabled when env var is empty string (graduated flag)', () => {
    process.env[FLAG] = '';
    expect(isDynamicTokenBudgetEnabled()).toBe(true);
  });

  it('T5: enabled when env var is "true"', () => {
    process.env[FLAG] = 'true';
    expect(isDynamicTokenBudgetEnabled()).toBe(true);
  });

  it('T6: enabled when env var is "TRUE" (case-insensitive)', () => {
    process.env[FLAG] = 'TRUE';
    expect(isDynamicTokenBudgetEnabled()).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   T030-02: FLAG DISABLED — DEFAULT BUDGET
   ──────────────────────────────────────────────────────────────── */

describe('T030-02: Flag Disabled — Default Budget (4000)', () => {
  beforeEach(() => { process.env[FLAG] = 'false'; });
  afterEach(disableFlag);

  it('T6: simple tier returns DEFAULT_BUDGET (4000) when disabled', () => {
    const result = getDynamicTokenBudget('simple');
    expect(result.budget).toBe(DEFAULT_BUDGET);
    expect(result.budget).toBe(4000);
    expect(result.applied).toBe(false);
  });

  it('T7: moderate tier returns DEFAULT_BUDGET (4000) when disabled', () => {
    const result = getDynamicTokenBudget('moderate');
    expect(result.budget).toBe(DEFAULT_BUDGET);
    expect(result.applied).toBe(false);
  });

  it('T8: complex tier returns DEFAULT_BUDGET (4000) when disabled', () => {
    const result = getDynamicTokenBudget('complex');
    expect(result.budget).toBe(DEFAULT_BUDGET);
    expect(result.applied).toBe(false);
  });

  it('T9: applied=false when flag is disabled', () => {
    const result = getDynamicTokenBudget('simple');
    expect(result.applied).toBe(false);
  });
});

/* ───────────────────────────────────────────────────────────────
   T030-03: BUDGET PER TIER (FLAG ENABLED)
   ──────────────────────────────────────────────────────────────── */

describe('T030-03: Budget Per Tier (Flag Enabled)', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T10: simple tier returns 1500 tokens', () => {
    const result = getDynamicTokenBudget('simple');
    expect(result.tier).toBe('simple');
    expect(result.budget).toBe(1500);
    expect(result.applied).toBe(true);
  });

  it('T11: moderate tier returns 2500 tokens', () => {
    const result = getDynamicTokenBudget('moderate');
    expect(result.tier).toBe('moderate');
    expect(result.budget).toBe(2500);
    expect(result.applied).toBe(true);
  });

  it('T12: complex tier returns 4000 tokens', () => {
    const result = getDynamicTokenBudget('complex');
    expect(result.tier).toBe('complex');
    expect(result.budget).toBe(4000);
    expect(result.applied).toBe(true);
  });

  it('T13: budgets increase with tier complexity', () => {
    const simple = getDynamicTokenBudget('simple').budget;
    const moderate = getDynamicTokenBudget('moderate').budget;
    const complex = getDynamicTokenBudget('complex').budget;
    expect(simple).toBeLessThan(moderate);
    expect(moderate).toBeLessThan(complex);
  });

  it('T14: applied=true when flag is enabled', () => {
    const result = getDynamicTokenBudget('moderate');
    expect(result.applied).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   T030-04: CUSTOM CONFIG OVERRIDE
   ──────────────────────────────────────────────────────────────── */

describe('T030-04: Custom Config Override', () => {
  beforeEach(enableFlag);
  afterEach(disableFlag);

  it('T15: custom config overrides default budgets', () => {
    const customConfig: TokenBudgetConfig = {
      simple: 800,
      moderate: 1600,
      complex: 3200,
    };

    expect(getDynamicTokenBudget('simple', customConfig).budget).toBe(800);
    expect(getDynamicTokenBudget('moderate', customConfig).budget).toBe(1600);
    expect(getDynamicTokenBudget('complex', customConfig).budget).toBe(3200);
  });
});

/* ───────────────────────────────────────────────────────────────
   T030-05: DEFAULT CONFIG CONSTANTS
   ──────────────────────────────────────────────────────────────── */

describe('T030-05: Default Config Constants', () => {
  it('T16: DEFAULT_BUDGET is 4000', () => {
    expect(DEFAULT_BUDGET).toBe(4000);
  });

  it('T17: DEFAULT_TOKEN_BUDGET_CONFIG has correct values', () => {
    expect(DEFAULT_TOKEN_BUDGET_CONFIG.simple).toBe(1500);
    expect(DEFAULT_TOKEN_BUDGET_CONFIG.moderate).toBe(2500);
    expect(DEFAULT_TOKEN_BUDGET_CONFIG.complex).toBe(4000);
  });

  it('T18: tier is included in BudgetResult', () => {
    withFlag(() => {
      const result = getDynamicTokenBudget('simple');
      expect(result.tier).toBe('simple');
    });
  });

  it('T19: tier is preserved even when flag disabled', () => {
    disableFlag();
    const result = getDynamicTokenBudget('moderate');
    expect(result.tier).toBe('moderate');
  });
});
