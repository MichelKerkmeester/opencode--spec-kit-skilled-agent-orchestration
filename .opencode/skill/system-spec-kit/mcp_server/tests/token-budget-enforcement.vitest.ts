// TEST: TOKEN BUDGET ENFORCEMENT
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import * as layerDefs from '../lib/architecture/layer-definitions';
import * as memoryContext from '../handlers/memory-context';

const PROJECT_ROOT = path.resolve(__dirname, '..');

describe('T205: Token Budget Enforcement [deferred - requires DB test fixtures]', () => {
  // =========================================================
  // T205-A: Layer Definition Token Budgets
  // =========================================================
  describe('T205-A: Layer Token Budgets', () => {
    it('T205-A1: All layer token budgets correct', () => {
      const budgets: Record<string, number> = {
        memory_context: 3500,
        memory_search: 3500,
        memory_save: 3500,
        memory_match_triggers: 3500,
        memory_list: 1000,
        memory_stats: 1000,
        memory_health: 1000,
        memory_update: 1000,
        memory_delete: 1000,
        memory_validate: 1000,
        checkpoint_create: 1000,
        checkpoint_list: 1000,
        checkpoint_restore: 1000,
        checkpoint_delete: 1000,
        memory_drift_why: 1500,
        task_preflight: 1500,
        task_postflight: 1500,
        memory_index_scan: 1000,
      };

      for (const [tool, expected] of Object.entries(budgets)) {
        const actual = layerDefs.getTokenBudget(tool);
        expect(actual, `${tool} budget`).toBe(expected);
      }
    });

    it('T205-A2: Unknown tool gets default budget (1000)', () => {
      const budget = layerDefs.getTokenBudget('nonexistent_tool');
      expect(budget).toBe(1000);
    });

    it('T205-A3: All 7 layers have positive token budgets', () => {
      const layers = layerDefs.LAYER_DEFINITIONS;
      for (const [id, layer] of Object.entries(layers)) {
        expect((layer as { tokenBudget: number }).tokenBudget, `${id} should have positive budget`).toBeGreaterThan(0);
      }
    });
  });

  // =========================================================
  // T205-B: enforceTokenBudget Function (memory-context.ts)
  // =========================================================
  describe('T205-B: enforceTokenBudget Function', () => {
    it('T205-B1: Small result under budget is not truncated', () => {
      const smallResult: Parameters<typeof memoryContext.enforceTokenBudget>[0] = {
        strategy: 'test',
        mode: 'quick',
        content: [{ type: 'text', text: '{"data":{"results":[{"id":1}]},"meta":{}}' }],
      };
      const { enforcement } = memoryContext.enforceTokenBudget(smallResult, 2000);
      expect(enforcement.enforced).toBe(false);
      expect(enforcement.truncated).toBe(false);
      expect(enforcement.actualTokens).toBeLessThanOrEqual(enforcement.budgetTokens);
    });

    it('T205-B2: Large result over budget IS truncated', () => {
      const results = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        title: `Memory ${i}`,
        content: 'A'.repeat(200),
        score: 1.0 - (i * 0.01),
      }));
      const mockResult: Parameters<typeof memoryContext.enforceTokenBudget>[0] = {
        strategy: 'test',
        mode: 'quick',
        content: [{
          type: 'text',
          text: JSON.stringify({ data: { results, count: 50 }, meta: {} })
        }]
      };

      const { enforcement } = memoryContext.enforceTokenBudget(mockResult, 500);
      expect(enforcement.enforced).toBe(true);
      expect(enforcement.truncated).toBe(true);
      expect(enforcement.originalResultCount).toBe(50);
      expect(enforcement.returnedResultCount).toBeLessThan(50);
      expect(enforcement.returnedResultCount).toBeGreaterThanOrEqual(1);
      expect(enforcement.actualTokens).toBeLessThanOrEqual(enforcement.budgetTokens);
    });

    it('T205-B3: Truncation preserves highest-scored results', () => {
      const results = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        title: `Memory ${i}`,
        content: 'B'.repeat(300),
        score: 1.0 - (i * 0.01),
      }));
      const mockResult: Parameters<typeof memoryContext.enforceTokenBudget>[0] = {
        strategy: 'test',
        mode: 'quick',
        content: [{
          type: 'text',
          text: JSON.stringify({ data: { results, count: 20 }, meta: {} })
        }]
      };

      const { result: truncatedResult, enforcement } = memoryContext.enforceTokenBudget(mockResult, 500);
      expect(enforcement.truncated).toBe(true);
      expect(enforcement.actualTokens).toBeLessThanOrEqual(enforcement.budgetTokens);
      const content = truncatedResult.content as Array<{ text: string }>;
      const parsed = JSON.parse(content[0].text) as { data: { results: Array<{ id: number }> } };
      const returnedIds = parsed.data.results.map((r) => r.id);
      expect(returnedIds[0]).toBe(0);
    });

    it('T205-B4: Non-envelope payload over budget reports truncated', () => {
      const nonEnvelopeResult: Parameters<typeof memoryContext.enforceTokenBudget>[0] = {
        strategy: 'test',
        mode: 'quick',
        content: [{ type: 'text', text: 'x'.repeat(5000) }],
      };
      const { enforcement } = memoryContext.enforceTokenBudget(nonEnvelopeResult, 500);
      expect(enforcement.enforced).toBe(true);
      expect(enforcement.truncated).toBe(true);
      expect(enforcement.actualTokens).toBeLessThanOrEqual(enforcement.budgetTokens);
    });

    it('T205-B5: Single structured result is compacted to fit within budget', () => {
      const results = [{
        id: 1,
        title: 'Oversized memory',
        content: 'C'.repeat(8000),
        score: 0.99,
      }];
      const mockResult: Parameters<typeof memoryContext.enforceTokenBudget>[0] = {
        strategy: 'test',
        mode: 'quick',
        content: [{
          type: 'text',
          text: JSON.stringify({ data: { results, count: 1 }, meta: {} })
        }]
      };

      const { result, enforcement } = memoryContext.enforceTokenBudget(mockResult, 500);
      expect(enforcement.enforced).toBe(true);
      expect(enforcement.truncated).toBe(true);
      expect(enforcement.originalResultCount).toBe(1);
      expect(enforcement.returnedResultCount).toBe(1);
      expect(enforcement.actualTokens).toBeLessThanOrEqual(enforcement.budgetTokens);

      const parsed = JSON.parse((result.content as Array<{ text: string }>)[0].text) as {
        data: { results: Array<{ content: string }>; count: number };
      };
      expect(parsed.data.count).toBe(1);
      expect(parsed.data.results[0].content.length).toBeLessThan(results[0].content.length);
    });
  });

  // =========================================================
  // T205-C: Dispatch-Level Enforcement (context-server.ts)
  // =========================================================
  describe('T205-C: Dispatch-Level Token Budget Enforcement', () => {
    it('T205-C1: Dispatch-level truncation logic present', () => {
      const serverSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'context-server.ts'),
        'utf8'
      );
      expect(serverSrc).toContain('innerResults.pop()');
    });

    it('T205-C2: Dispatch reports truncation metadata', () => {
      const serverSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'context-server.ts'),
        'utf8'
      );
      expect(serverSrc).toContain('tokenBudgetTruncated');
      expect(serverSrc).toContain('originalResultCount');
      expect(serverSrc).toContain('returnedResultCount');
    });

    it('T205-C3: Dispatch preserves at least 1 result', () => {
      const serverSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'context-server.ts'),
        'utf8'
      );
      expect(serverSrc).toContain('innerResults.length > 1');
    });

    it('T205-C4: Uses getTokenBudget for layer-specific budgets', () => {
      const serverSrc = fs.readFileSync(
        path.join(PROJECT_ROOT, 'context-server.ts'),
        'utf8'
      );
      expect(serverSrc).toContain('getTokenBudget(name)');
    });
  });

  // =========================================================
  // T205-D: Mode-Level Budgets (memory-context CONTEXT_MODES)
  // =========================================================
  describe('T205-D: Context Mode Token Budgets', () => {
    it('T205-D1: Mode budgets correct', () => {
      if (!memoryContext?.CONTEXT_MODES) return;

      const modes = memoryContext.CONTEXT_MODES;
      expect(modes.quick.tokenBudget).toBe(800);
      expect(modes.deep.tokenBudget).toBe(3500);
      expect(modes.focused.tokenBudget).toBe(3000);
      expect(modes.resume.tokenBudget).toBe(2000);
    });

    it('T205-D2: Auto mode delegates budget (undefined)', () => {
      if (!memoryContext?.CONTEXT_MODES) return;

      const modes = memoryContext.CONTEXT_MODES;
      expect(modes.auto.tokenBudget).toBeUndefined();
    });

    it('T205-D3: Budget ordering is logical (quick < resume < focused < deep)', () => {
      if (!memoryContext?.CONTEXT_MODES) return;

      const modes = memoryContext.CONTEXT_MODES;
      const quickBudget = modes.quick.tokenBudget;
      const resumeBudget = modes.resume.tokenBudget;
      const focusedBudget = modes.focused.tokenBudget;
      const deepBudget = modes.deep.tokenBudget;
      expect(quickBudget).toBeDefined();
      expect(resumeBudget).toBeDefined();
      expect(focusedBudget).toBeDefined();
      expect(deepBudget).toBeDefined();
      if (quickBudget === undefined || resumeBudget === undefined || focusedBudget === undefined || deepBudget === undefined) {
        throw new Error('Expected all non-auto mode budgets to be defined');
      }
      expect(quickBudget).toBeLessThan(resumeBudget);
      expect(resumeBudget).toBeLessThan(focusedBudget);
      expect(focusedBudget).toBeLessThan(deepBudget);
    });
  });
});
