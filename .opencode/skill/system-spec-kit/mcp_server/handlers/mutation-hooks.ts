// ───────────────────────────────────────────────────────────────
// MODULE: Mutation Hooks
// ───────────────────────────────────────────────────────────────
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import * as toolCache from '../lib/cache/tool-cache.js';
import { clearConstitutionalCache } from '../hooks/memory-surface.js';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals.js';
import { clearRelatedCache } from '../lib/cognitive/co-activation.js';
import { clearDegreeCache } from '../lib/search/graph-search-fn.js';

import type { MutationHookResult } from './memory-crud-types.js';

// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Shared post-mutation hook wiring
// Feature catalog: Mutation hook result contract expansion


export type { MutationHookResult };

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  const startTime = Date.now();
  const errors: string[] = [];

  let triggerCacheCleared = false;
  try {
    triggerMatcher.clearCache();
    triggerCacheCleared = true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mutation-hooks] triggerMatcher.clearCache failed for operation="${operation}":`,
      message
    );
    errors.push(`triggerMatcher.clearCache: ${message}`);
    triggerCacheCleared = false;
  }

  let toolCacheInvalidated = 0;
  try {
    toolCacheInvalidated = toolCache.invalidateOnWrite(operation, context);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mutation-hooks] toolCache.invalidateOnWrite failed for operation="${operation}":`,
      message
    );
    errors.push(`toolCache.invalidateOnWrite: ${message}`);
    toolCacheInvalidated = 0;
  }

  let constitutionalCacheCleared = false;
  try {
    clearConstitutionalCache();
    constitutionalCacheCleared = true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mutation-hooks] clearConstitutionalCache failed for operation="${operation}":`,
      message
    );
    errors.push(`clearConstitutionalCache: ${message}`);
    constitutionalCacheCleared = false;
  }

  let graphSignalsCacheCleared = false;
  try {
    clearGraphSignalsCache();
    clearDegreeCache();
    graphSignalsCacheCleared = true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mutation-hooks] graph cache invalidation failed for operation="${operation}":`,
      message
    );
    errors.push(`graphCacheInvalidation: ${message}`);
    graphSignalsCacheCleared = false;
  }

  let coactivationCacheCleared = false;
  try {
    clearRelatedCache();
    coactivationCacheCleared = true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mutation-hooks] clearRelatedCache failed for operation="${operation}":`,
      message
    );
    errors.push(`clearRelatedCache: ${message}`);
    coactivationCacheCleared = false;
  }

  return {
    latencyMs: Date.now() - startTime,
    triggerCacheCleared,
    constitutionalCacheCleared,
    toolCacheInvalidated,
    graphSignalsCacheCleared,
    coactivationCacheCleared,
    errors,
  };
}

export { runPostMutationHooks };
