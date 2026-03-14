// ───────────────────────────────────────────────────────────────
// 1. MUTATION FEEDBACK
// ───────────────────────────────────────────────────────────────
import type { MutationHookResult } from '../handlers/memory-crud-types';

function buildMutationHookFeedback(operation: string, hookResult: MutationHookResult): {
  data: {
    operation: string;
    latencyMs: number;
    triggerCacheCleared: boolean;
    constitutionalCacheCleared: boolean;
    graphSignalsCacheCleared: boolean;
    coactivationCacheCleared: boolean;
    toolCacheInvalidated: number;
  };
  hints: string[];
} {
  const hints: string[] = [];

  hints.push(
    'Post-mutation cache clear: ' +
      `trigger=${hookResult.triggerCacheCleared ? 'ok' : 'failed'}, ` +
      `constitutional=${hookResult.constitutionalCacheCleared ? 'ok' : 'failed'}, ` +
      `graphSignals=${hookResult.graphSignalsCacheCleared ? 'ok' : 'failed'}, ` +
      `coactivation=${hookResult.coactivationCacheCleared ? 'ok' : 'failed'}`
  );
  hints.push(
    `Tool cache invalidation: invalidated ${hookResult.toolCacheInvalidated} entries for operation "${operation}"`
  );

  const anyCacheClearFailed =
    !hookResult.triggerCacheCleared ||
    !hookResult.constitutionalCacheCleared ||
    !hookResult.graphSignalsCacheCleared ||
    !hookResult.coactivationCacheCleared;

  if (anyCacheClearFailed) {
    hints.push('Warning (non-fatal): one or more post-mutation cache clear operations failed');
  }

  return {
    data: {
      operation,
      latencyMs: hookResult.latencyMs,
      triggerCacheCleared: hookResult.triggerCacheCleared,
      constitutionalCacheCleared: hookResult.constitutionalCacheCleared,
      graphSignalsCacheCleared: hookResult.graphSignalsCacheCleared,
      coactivationCacheCleared: hookResult.coactivationCacheCleared,
      toolCacheInvalidated: hookResult.toolCacheInvalidated,
    },
    hints,
  };
}

export { buildMutationHookFeedback };
