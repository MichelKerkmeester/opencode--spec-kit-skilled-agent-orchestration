// ---------------------------------------------------------------
// MODULE: Graph Search Compatibility Flag
// AI-WHY: Legacy compatibility shim retained for test/runtime imports.
// ---------------------------------------------------------------

import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';

/**
 * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
 */
export function isGraphUnifiedEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
}
