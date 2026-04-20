// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for all extractor modules (files, diagrams, conversations, decisions, sessions)
export * from './file-extractor.js';
export * from './diagram-extractor.js';
export * from './conversation-extractor.js';
export * from './decision-extractor.js';
export * from './session-extractor.js';
export * from '../lib/session-activity-signal.js';
/** Re-export extractor functions and helpers. */
export {
  buildImplementationGuideData,
  hasImplementationWork,
  extractMainTopic,
  extractWhatBuilt,
  extractKeyFilesWithRoles,
  generateExtensionGuide,
  extractCodePatterns,
} from './implementation-guide-extractor.js';
/** Re-export shared extractor types. */
export type {
  ImplementationGuideData,
  ImplementationStep,
  KeyFileWithRole,
  ExtensionGuide,
  CodePattern,
  FileInput,
} from './implementation-guide-extractor.js';
export * from './collect-session-data.js';
export * from './contamination-filter.js';
export * from './quality-scorer.js';
export * from './spec-folder-extractor.js';
export * from './git-context-extractor.js';
