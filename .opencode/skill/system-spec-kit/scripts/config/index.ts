// ---------------------------------------------------------------
// MODULE: Config Barrel
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CONFIG BARREL
// ───────────────────────────────────────────────────────────────
// Re-exports CONFIG and spec-directory utilities so that non-core
// modules (extractors, renderers, loaders, etc.) can import from
// '../config' instead of reaching into '../core'.
//
// This eliminates the upward-dependency from extractors → core
// while keeping the canonical implementation in core/config.ts.

export {
  CONFIG,
  getSpecsDirectories,
  findActiveSpecsDir,
  getAllExistingSpecsDirs,
} from '../core/config';

export type {
  SpecKitConfig,
  WorkflowConfig,
} from '../core/config';
