// ───────────────────────────────────────────────────────────────
// TEST: PreCompact Hook
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureStateDir, loadState, updateState, getStatePath } from '../hooks/claude/hook-state.js';
import { truncateToTokenBudget, COMPACTION_TOKEN_BUDGET } from '../hooks/claude/shared.js';

describe('precompact hook', () => {
  const testSessionId = 'test-precompact';

  beforeEach(() => {
    ensureStateDir();
  });

  afterEach(() => {
    try { rmSync(getStatePath(testSessionId)); } catch { /* ok */ }
  });

  describe('context caching', () => {
    it('caches payload in hook state', () => {
      const payload = '## Active Files\n- /src/main.ts\n- /src/utils.ts';
      updateState(testSessionId, {
        pendingCompactPrime: {
          payload,
          cachedAt: new Date().toISOString(),
        },
      });

      const state = loadState(testSessionId);
      expect(state).not.toBeNull();
      expect(state!.pendingCompactPrime).not.toBeNull();
      expect(state!.pendingCompactPrime!.payload).toBe(payload);
    });

    it('overwrites previous cached payload', () => {
      updateState(testSessionId, {
        pendingCompactPrime: { payload: 'old', cachedAt: new Date().toISOString() },
      });
      updateState(testSessionId, {
        pendingCompactPrime: { payload: 'new', cachedAt: new Date().toISOString() },
      });

      const state = loadState(testSessionId);
      expect(state!.pendingCompactPrime!.payload).toBe('new');
    });
  });

  describe('token budget enforcement', () => {
    it('truncates payload exceeding budget', () => {
      const largePayload = 'a'.repeat(20000);
      const truncated = truncateToTokenBudget(largePayload, COMPACTION_TOKEN_BUDGET);
      expect(truncated.length).toBeLessThan(largePayload.length);
      expect(truncated).toContain('[...truncated');
    });

    it('keeps payload within budget', () => {
      const smallPayload = '## Context\n- file.ts';
      const result = truncateToTokenBudget(smallPayload, COMPACTION_TOKEN_BUDGET);
      expect(result).toBe(smallPayload);
    });
  });

  describe('transcript extraction', () => {
    it('extracts file paths from transcript lines', () => {
      const lines = [
        '{"message":{"content":"Reading /src/hooks/shared.ts"}}',
        '{"message":{"content":"Editing /src/lib/code-graph/indexer.ts"}}',
        'plain text with /some/path.js reference',
      ];
      const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
      const paths = new Set<string>();
      for (const line of lines) {
        const matches = line.match(pathRegex);
        if (matches) matches.forEach(m => paths.add(m));
      }
      expect(paths.size).toBeGreaterThan(0);
      expect([...paths]).toContain('/src/hooks/shared.ts');
    });
  });
});
