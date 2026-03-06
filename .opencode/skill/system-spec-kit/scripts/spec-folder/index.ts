// ---------------------------------------------------------------
// MODULE: Spec Folder Index
// Barrel export for spec folder detection, validation, and setup modules
// ---------------------------------------------------------------

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
import { getPhaseFolderRejectionSync } from '../core';

/* -----------------------------------------------------------------
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
  getPhaseFolderRejectionSync,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
};

/* -----------------------------------------------------------------
   EXPORTS - Backwards compatibility aliases (snake_case)
------------------------------------------------------------------*/

export {
  detectSpecFolder as detect_spec_folder,
  filterArchiveFolders as filter_archive_folders,
  setupContextDirectory as setup_context_directory,
  extractObservationKeywords as extract_observation_keywords,
  validateContentAlignment as validate_content_alignment,
  validateTelemetrySchemaDocsDrift as validate_telemetry_schema_docs_drift,
};
