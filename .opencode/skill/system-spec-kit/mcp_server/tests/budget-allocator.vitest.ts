// ───────────────────────────────────────────────────────────────
// TEST: Budget Allocator
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import {
  allocateBudget,
  createDefaultSources,
  DEFAULT_FLOORS,
} from '../lib/code-graph/budget-allocator.js';

describe('budget allocator', () => {
  describe('DEFAULT_FLOORS', () => {
    it('has correct floor values', () => {
      expect(DEFAULT_FLOORS.constitutional).toBe(700);
      expect(DEFAULT_FLOORS.codeGraph).toBe(1200);
      expect(DEFAULT_FLOORS.cocoIndex).toBe(900);
      expect(DEFAULT_FLOORS.triggered).toBe(400);
      expect(DEFAULT_FLOORS.overflow).toBe(800);
    });
  });

  describe('allocateBudget', () => {
    it('assigns floors when all sources have enough content', () => {
      const sources = createDefaultSources(1000, 2000, 1500, 500);
      const result = allocateBudget(sources, 4000);
      expect(result.totalUsed).toBeLessThanOrEqual(4000);
      const constitutional = result.allocations.find(a => a.name === 'constitutional');
      expect(constitutional!.granted).toBeGreaterThanOrEqual(700);
    });

    it('redistributes overflow from empty sources', () => {
      const sources = createDefaultSources(1000, 2000, 0, 0);
      const result = allocateBudget(sources, 4000);
      // CocoIndex and triggered are empty, their floors + overflow go to others
      const constitutional = result.allocations.find(a => a.name === 'constitutional');
      expect(constitutional!.granted).toBeGreaterThanOrEqual(700);
      expect(result.totalUsed).toBeLessThanOrEqual(4000);
    });

    it('enforces total budget cap', () => {
      const sources = createDefaultSources(3000, 3000, 3000, 3000);
      const result = allocateBudget(sources, 4000);
      expect(result.totalUsed).toBeLessThanOrEqual(4000);
    });

    it('uses caller budgets above the default 4000-token layout', () => {
      const sources = createDefaultSources(10_000, 10_000, 10_000, 10_000, 10_000);
      const result = allocateBudget(sources, 8000);
      expect(result.totalUsed).toBe(8000);
      expect(result.totalBudget).toBe(8000);
    });

    it('handles all sources empty', () => {
      const sources = createDefaultSources(0, 0, 0, 0);
      const result = allocateBudget(sources, 4000);
      expect(result.totalUsed).toBe(0);
    });

    it('ensures constitutional always gets allocation when content exists', () => {
      const sources = createDefaultSources(100, 5000, 5000, 5000);
      const result = allocateBudget(sources, 4000);
      const constitutional = result.allocations.find(a => a.name === 'constitutional');
      expect(constitutional!.granted).toBe(100);
    });
  });

  describe('createDefaultSources', () => {
    it('creates 5 sources with correct names', () => {
      const sources = createDefaultSources(100, 200, 300, 400);
      expect(sources.length).toBe(5);
      expect(sources.map(s => s.name)).toEqual([
        'constitutional',
        'codeGraph',
        'cocoIndex',
        'sessionState',
        'triggered',
      ]);
      expect(sources.find(s => s.name === 'sessionState')).toMatchObject({ floor: 0, actualSize: 0 });
    });
  });
});
