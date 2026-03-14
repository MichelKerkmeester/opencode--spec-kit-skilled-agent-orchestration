// ───────────────────────────────────────────────────────────────
// MODULE: Mutation Hooks
// ───────────────────────────────────────────────────────────────
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { clearConstitutionalCache } from '../hooks/memory-surface';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';

import type { MutationHookResult } from './memory-crud-types';

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
    graphSignalsCacheCleared = true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(
      `[mutation-hooks] clearGraphSignalsCache failed for operation="${operation}":`,
      message
    );
    errors.push(`clearGraphSignalsCache: ${message}`);
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
