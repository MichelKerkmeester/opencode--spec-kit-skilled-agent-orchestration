// ---------------------------------------------------------------
// MODULE: Mutation Hooks
// ---------------------------------------------------------------

import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { clearConstitutionalCache } from '../hooks/memory-surface';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';

export interface MutationHookResult {
  latencyMs: number;
  triggerCacheCleared: boolean;
  constitutionalCacheCleared: boolean;
  toolCacheInvalidated: number;
  graphSignalsCacheCleared: boolean;
  coactivationCacheCleared: boolean;
}

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  const startTime = Date.now();

  let triggerCacheCleared = false;
  try {
    triggerMatcher.clearCache();
    triggerCacheCleared = true;
  } catch {
    triggerCacheCleared = false;
  }

  const toolCacheInvalidated = toolCache.invalidateOnWrite(operation, context);

  let constitutionalCacheCleared = false;
  try {
    clearConstitutionalCache();
    constitutionalCacheCleared = true;
  } catch {
    constitutionalCacheCleared = false;
  }

  let graphSignalsCacheCleared = false;
  try {
    clearGraphSignalsCache();
    graphSignalsCacheCleared = true;
  } catch {
    graphSignalsCacheCleared = false;
  }

  let coactivationCacheCleared = false;
  try {
    clearRelatedCache();
    coactivationCacheCleared = true;
  } catch {
    coactivationCacheCleared = false;
  }

  return {
    latencyMs: Date.now() - startTime,
    triggerCacheCleared,
    constitutionalCacheCleared,
    toolCacheInvalidated,
    graphSignalsCacheCleared,
    coactivationCacheCleared,
  };
}

export { runPostMutationHooks };
