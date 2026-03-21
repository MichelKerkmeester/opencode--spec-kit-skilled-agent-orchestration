// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for core modules (config, spec-folder utilities)
// Workflow.ts not exported here to avoid circular dependencies
// Import directly: import { runWorkflow } from './core/workflow';

export {
  CONFIG,
  getSpecsDirectories,
  findActiveSpecsDir,
  getAllExistingSpecsDirs,
} from './config';

export {
  SPEC_FOLDER_PATTERN,
  SPEC_FOLDER_BASIC_PATTERN,
  CATEGORY_FOLDER_PATTERN,
  SEARCH_MAX_DEPTH,
  findChildFolderSync,
  findChildFolderAsync,
} from './subfolder-utils';

