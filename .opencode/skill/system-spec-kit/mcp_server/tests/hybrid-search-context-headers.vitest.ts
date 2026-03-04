// @ts-nocheck
// ---------------------------------------------------------------
// TEST: Contextual Tree Headers (Sprint 9 P1-4 / T063-T065)
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { __testables } from '../lib/search/hybrid-search';

describe('Contextual tree injection', () => {
  it('T063: injects contextual header in expected format', () => {
    const row = {
      id: 1,
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
    const [header] = injected.content.split('\n');

    expect(header.startsWith('[parent-seg > child-seg')).toBe(true);
    expect(header.includes(' — ')).toBe(true);
    expect(header.endsWith(']')).toBe(true);
    expect(header.length).toBeLessThanOrEqual(100);
  });

  it('T064: skips injection when content is null/undefined (includeContent=false mode)', () => {
    const row = {
      id: 2,
      file_path: '/workspace/.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/019-sprint-9-extra-features/memory/context.md',
      content: undefined,
    };

    const cache = new Map<string, string>([
      ['023-hybrid-rag-fusion-refinement/019-sprint-9-extra-features', 'Description'],
    ]);

    const injected = __testables.injectContextualTree(row, cache);
    expect(injected).toBe(row);
    expect(injected.content).toBeUndefined();
  });
});
