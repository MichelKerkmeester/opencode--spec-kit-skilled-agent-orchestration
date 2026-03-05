// ---------------------------------------------------------------
// MODULE: Mutation Hooks
// ---------------------------------------------------------------

import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as toolCache from '../lib/cache/tool-cache';
import { clearConstitutionalCache } from '../hooks/memory-surface';
import { clearGraphSignalsCache } from '../lib/graph/graph-signals';
import { clearRelatedCache } from '../lib/cognitive/co-activation';

interface MutationHookResult {
  toolCacheInvalidated: number;
  graphSignalsCacheCleared: boolean;
  coactivationCacheCleared: boolean;
}

function runPostMutationHooks(
  operation: string,
  context: Record<string, unknown> = {}
): MutationHookResult {
  triggerMatcher.clearCache();
  const toolCacheInvalidated = toolCache.invalidateOnWrite(operation, context);
  clearConstitutionalCache();

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
    toolCacheInvalidated,
    graphSignalsCacheCleared,
    coactivationCacheCleared,
  };
}

export { runPostMutationHooks };
