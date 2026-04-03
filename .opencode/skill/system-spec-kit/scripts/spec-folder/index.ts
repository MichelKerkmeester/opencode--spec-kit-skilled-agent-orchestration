// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Folder Index
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
// Barrel export for spec folder detection, validation, and setup modules
import { detectSpecFolder, filterArchiveFolders } from './folder-detector';
import {
  ALIGNMENT_CONFIG,
  extractConversationTopics,
  extractObservationKeywords,
  calculateAlignmentScore,
  computeTelemetrySchemaDocsFieldDiffs,
  formatTelemetrySchemaDocsDriftDiffs,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
} from './alignment-validator';
import { setupContextDirectory } from './directory-setup';
import {
  buildNestedChangelogData,
  generateNestedChangelogMarkdown,
  writeNestedChangelog,
} from './nested-changelog';

// ───────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  ALIGNMENT_CONFIG,
  detectSpecFolder,
  filterArchiveFolders,
  setupContextDirectory,
  extractConversationTopics,
  extractObservationKeywords,
  calculateAlignmentScore,
  buildNestedChangelogData,
  computeTelemetrySchemaDocsFieldDiffs,
  formatTelemetrySchemaDocsDriftDiffs,
  generateNestedChangelogMarkdown,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
  writeNestedChangelog,
};
