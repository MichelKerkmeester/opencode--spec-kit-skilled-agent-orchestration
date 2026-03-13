// TEST: Contextual Tree Headers (Sprint 9 P1-4 / T063-T065)
import { describe, expect, it } from 'vitest';
import { __testables, truncateToBudget, estimateResultTokens } from '../lib/search/hybrid-search';

type InjectContextualTreeInput = Parameters<typeof __testables.injectContextualTree>[0];
type InjectContextualTreeResult = ReturnType<typeof __testables.injectContextualTree>;

function getContent(row: InjectContextualTreeResult): string | undefined {
  const content = (row as Record<string, unknown>).content;
  return typeof content === 'string' ? content : undefined;
}

describe('Contextual tree injection', () => {
  it('T063: injects contextual header in expected format', () => {
    const row: InjectContextualTreeInput = {
      id: 1,
      score: 1,
      source: 'hybrid',
      file_path: '/workspace/.opencode/specs/parent-seg/child-seg/memory/context.md',
      content: 'Original content body',
    };

    const cache = new Map<string, string>([
      [
        'parent-seg/child-seg',
        'Adds contextual tree injection and several additional retrieval capabilities for Sprint 9 validation coverage',
      ],
    ]);

    const injected = __testables.injectContextualTree(row, cache);
    const injectedContent = getContent(injected) ?? '';
    const [header = ''] = injectedContent.split('\n');

    expect(header.startsWith('[parent-seg > child-seg')).toBe(true);
    expect(header.includes(' — ')).toBe(true);
    expect(header.endsWith(']')).toBe(true);
    expect(header.length).toBeLessThanOrEqual(100);
  });

  it('T064: skips injection when content is null/undefined (includeContent=false mode)', () => {
    const row: InjectContextualTreeInput = {
      id: 2,
      score: 1,
      source: 'hybrid',
      file_path: '/workspace/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/019-sprint-9-extra-features/memory/context.md',
      content: undefined,
    };

    const cache = new Map<string, string>([
      ['022-hybrid-rag-fusion/019-sprint-9-extra-features', 'Description'],
    ]);

    const injected = __testables.injectContextualTree(row, cache);
    expect(injected).toBe(row);
    expect(getContent(injected)).toBeUndefined();
  });

  it('T065: preserves post-truncation ordering after contextual headers are injected', () => {
    const rows: InjectContextualTreeInput[] = [
      {
        id: 11,
        score: 0.99,
        source: 'hybrid',
        file_path: '/workspace/.opencode/specs/root/a/memory/a.md',
        content: 'A'.repeat(420),
      },
      {
        id: 22,
        score: 0.89,
        source: 'hybrid',
        file_path: '/workspace/.opencode/specs/root/b/memory/b.md',
        content: 'B'.repeat(420),
      },
      {
        id: 33,
        score: 0.79,
        source: 'hybrid',
        file_path: '/workspace/.opencode/specs/root/c/memory/c.md',
        content: 'C'.repeat(420),
      },
    ];

    const sorted = [...rows].sort((a, b) => b.score - a.score);
    const budgetForTopTwo =
      estimateResultTokens(sorted[0]) + estimateResultTokens(sorted[1]) + 2;
    const truncated = truncateToBudget(rows, budgetForTopTwo, {
      includeContent: true,
      queryId: 'ctx-order-preservation',
    });

    expect(truncated.truncated).toBe(true);
    expect(truncated.results.map((row) => row.id)).toEqual([11, 22]);

    const cache = new Map<string, string>([
      ['root/a', 'alpha'],
      ['root/b', 'beta'],
      ['root/c', 'gamma'],
    ]);
    const injected = truncated.results.map((row) => __testables.injectContextualTree(row, cache));

    expect(injected.map((row) => row.id)).toEqual([11, 22]);
    expect(getContent(injected[0])?.startsWith('[root > a')).toBe(true);
    expect(getContent(injected[1])?.startsWith('[root > b')).toBe(true);
  });

  it('T066: adjusted token budget reserves header overhead and avoids overflow after injection', () => {
    const rows: InjectContextualTreeInput[] = [
      {
        id: 101,
        score: 0.9,
        source: 'hybrid',
        file_path: '/workspace/.opencode/specs/core/alpha/memory/alpha.md',
        content: 'Alpha content '.repeat(90),
      },
      {
        id: 102,
        score: 0.8,
        source: 'hybrid',
        file_path: '/workspace/.opencode/specs/core/beta/memory/beta.md',
        content: 'Beta content '.repeat(90),
      },
    ];

    const pipelineBudget = rows.reduce((sum, row) => sum + estimateResultTokens(row), 0);
    const adjustedBudget = Math.max(pipelineBudget - rows.length * 26, 200);
    const truncated = truncateToBudget(rows, adjustedBudget, {
      includeContent: true,
      queryId: 'ctx-budget-overhead',
    });

    const cache = new Map<string, string>([
      ['core/alpha', 'core alpha context'],
      ['core/beta', 'core beta context'],
    ]);
    const injected = truncated.results.map((row) => __testables.injectContextualTree(row, cache));
    const postInjectionTokens = injected.reduce((sum, row) => sum + estimateResultTokens(row), 0);

    expect(postInjectionTokens).toBeLessThanOrEqual(pipelineBudget);
  });
});
