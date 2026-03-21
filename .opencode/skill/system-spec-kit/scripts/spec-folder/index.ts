// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
   EXPORTS - Primary (camelCase)
------------------------------------------------------------------*/

export {
  ALIGNMENT_CONFIG,
  detectSpecFolder,
  filterArchiveFolders,
  setupContextDirectory,
  extractConversationTopics,
  extractObservationKeywords,
  calculateAlignmentScore,
  computeTelemetrySchemaDocsFieldDiffs,
  formatTelemetrySchemaDocsDriftDiffs,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
};

