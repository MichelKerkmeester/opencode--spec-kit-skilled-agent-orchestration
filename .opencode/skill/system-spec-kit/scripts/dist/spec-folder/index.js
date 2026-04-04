"use strict";
// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Folder Index
// ───────────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeNestedChangelog = exports.validateFolderAlignment = exports.validateContentAlignment = exports.validateTelemetrySchemaDocsDrift = exports.generateNestedChangelogMarkdown = exports.formatTelemetrySchemaDocsDriftDiffs = exports.computeTelemetrySchemaDocsFieldDiffs = exports.buildNestedChangelogData = exports.calculateAlignmentScore = exports.extractObservationKeywords = exports.extractConversationTopics = exports.setupContextDirectory = exports.filterArchiveFolders = exports.detectSpecFolder = exports.ALIGNMENT_CONFIG = void 0;
// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
// Barrel export for spec folder detection, validation, and setup modules
const folder_detector_1 = require("./folder-detector");
Object.defineProperty(exports, "detectSpecFolder", { enumerable: true, get: function () { return folder_detector_1.detectSpecFolder; } });
Object.defineProperty(exports, "filterArchiveFolders", { enumerable: true, get: function () { return folder_detector_1.filterArchiveFolders; } });
const alignment_validator_1 = require("./alignment-validator");
Object.defineProperty(exports, "ALIGNMENT_CONFIG", { enumerable: true, get: function () { return alignment_validator_1.ALIGNMENT_CONFIG; } });
Object.defineProperty(exports, "extractConversationTopics", { enumerable: true, get: function () { return alignment_validator_1.extractConversationTopics; } });
Object.defineProperty(exports, "extractObservationKeywords", { enumerable: true, get: function () { return alignment_validator_1.extractObservationKeywords; } });
Object.defineProperty(exports, "calculateAlignmentScore", { enumerable: true, get: function () { return alignment_validator_1.calculateAlignmentScore; } });
Object.defineProperty(exports, "computeTelemetrySchemaDocsFieldDiffs", { enumerable: true, get: function () { return alignment_validator_1.computeTelemetrySchemaDocsFieldDiffs; } });
Object.defineProperty(exports, "formatTelemetrySchemaDocsDriftDiffs", { enumerable: true, get: function () { return alignment_validator_1.formatTelemetrySchemaDocsDriftDiffs; } });
Object.defineProperty(exports, "validateTelemetrySchemaDocsDrift", { enumerable: true, get: function () { return alignment_validator_1.validateTelemetrySchemaDocsDrift; } });
Object.defineProperty(exports, "validateContentAlignment", { enumerable: true, get: function () { return alignment_validator_1.validateContentAlignment; } });
Object.defineProperty(exports, "validateFolderAlignment", { enumerable: true, get: function () { return alignment_validator_1.validateFolderAlignment; } });
const directory_setup_1 = require("./directory-setup");
Object.defineProperty(exports, "setupContextDirectory", { enumerable: true, get: function () { return directory_setup_1.setupContextDirectory; } });
const nested_changelog_1 = require("./nested-changelog");
Object.defineProperty(exports, "buildNestedChangelogData", { enumerable: true, get: function () { return nested_changelog_1.buildNestedChangelogData; } });
Object.defineProperty(exports, "generateNestedChangelogMarkdown", { enumerable: true, get: function () { return nested_changelog_1.generateNestedChangelogMarkdown; } });
Object.defineProperty(exports, "writeNestedChangelog", { enumerable: true, get: function () { return nested_changelog_1.writeNestedChangelog; } });
//# sourceMappingURL=index.js.map