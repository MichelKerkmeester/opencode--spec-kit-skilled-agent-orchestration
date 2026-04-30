// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Budget Allocator Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises context-preservation budget allocation from feature catalog
// 22--context-preservation-and-code-graph/10-budget-allocator.

import { describe, expect, it } from 'vitest';

import {
  allocateBudget,
  createDefaultSources,
  DEFAULT_FLOORS,
} from '../../code_graph/lib/budget-allocator.js';

describe('code graph budget allocator stress behavior', () => {
  it('redistributes unused source floors to higher-priority context sources', () => {
    const result = allocateBudget(createDefaultSources(
      DEFAULT_FLOORS.constitutional + 300,
      DEFAULT_FLOORS.codeGraph + 500,
      DEFAULT_FLOORS.cocoIndex,
      0,
      200,
    ));

    const constitutional = result.allocations.find((item) => item.name === 'constitutional');
    const codeGraph = result.allocations.find((item) => item.name === 'codeGraph');
    const triggered = result.allocations.find((item) => item.name === 'triggered');

    expect(constitutional?.granted).toBe(DEFAULT_FLOORS.constitutional + 300);
    expect(codeGraph?.granted).toBeGreaterThan(DEFAULT_FLOORS.codeGraph);
    expect(triggered?.granted).toBe(0);
    expect(result.totalUsed).toBeLessThanOrEqual(result.totalBudget);
  });

  it('trims low-priority overflow before protected context floors exceed the cap', () => {
    const result = allocateBudget([
      { name: 'constitutional', floor: 700, actualSize: 1_000 },
      { name: 'codeGraph', floor: 1_200, actualSize: 2_000 },
      { name: 'cocoIndex', floor: 900, actualSize: 2_000 },
      { name: 'sessionState', floor: 0, actualSize: 1_000 },
      { name: 'triggered', floor: 400, actualSize: 2_000 },
    ], 2_000);

    const constitutional = result.allocations.find((item) => item.name === 'constitutional');
    const triggered = result.allocations.find((item) => item.name === 'triggered');

    expect(result.totalUsed).toBe(2_000);
    expect(constitutional?.granted).toBeGreaterThan(0);
    expect(triggered?.dropped).toBeGreaterThan(triggered?.granted ?? 0);
  });
});
