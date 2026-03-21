// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for all extractor modules (files, diagrams, conversations, decisions, sessions)
export * from './file-extractor';
export * from './diagram-extractor';
export * from './conversation-extractor';
export * from './decision-extractor';
export * from './session-extractor';
export * from '../lib/session-activity-signal';
/** Re-export extractor functions and helpers. */
export {
  buildImplementationGuideData,
  hasImplementationWork,
  extractMainTopic,
  extractWhatBuilt,
  extractKeyFilesWithRoles,
  generateExtensionGuide,
  extractCodePatterns,
} from './implementation-guide-extractor';
/** Re-export shared extractor types. */
export type {
  ImplementationGuideData,
  ImplementationStep,
  KeyFileWithRole,
  ExtensionGuide,
  CodePattern,
  FileInput,
} from './implementation-guide-extractor';
export * from './collect-session-data';
export * from './contamination-filter';
export * from './quality-scorer';
export * from './spec-folder-extractor';
export * from './git-context-extractor';
