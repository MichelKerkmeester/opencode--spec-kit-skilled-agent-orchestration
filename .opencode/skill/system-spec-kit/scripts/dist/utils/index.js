"use strict";
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceCapabilities = exports.generateContentSlug = exports.ensureUniqueMemoryFilename = exports.pickBestContentName = exports.isGenericContentTask = exports.isContaminatedMemoryName = exports.slugify = exports.normalizeMemoryNameCandidate = exports.isApiErrorContent = exports.normalizeToolStatus = exports.sanitizeToolInputPaths = exports.sanitizeToolDescription = exports.validateAnchors = exports.validateNoLeakedPlaceholders = exports.summarizeExchange = exports.truncateToolOutput = exports.formatTimestamp = exports.classifyConversationPhase = exports.isProseContext = exports.detectToolCall = exports.cleanDescription = exports.isDescriptionValid = exports.validateDescription = exports.getDescriptionTierRank = exports.toRelativePath = exports.promptUserChoice = exports.promptUser = exports.coerceFactsToText = exports.coerceFactToText = exports.transformOpenCodeCapture = exports.transformOpencodeCapture = exports.validateInputData = exports.normalizeInputData = exports.buildTechnicalContextObservation = exports.buildSessionSummaryObservation = exports.transformKeyDecision = exports.validateDataStructure = exports.evaluateCollectedDataSpecAffinity = exports.buildSpecAffinityTargets = exports.normalizeAbsolutePath = exports.toWorkspaceRelativePath = exports.isSameWorkspacePath = exports.getWorkspacePathVariants = exports.buildWorkspaceIdentity = exports.getPathBasename = exports.sanitizePath = exports.structuredLog = void 0;
// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for utility modules (logger, path, validation, file helpers)
var logger_1 = require("./logger");
Object.defineProperty(exports, "structuredLog", { enumerable: true, get: function () { return logger_1.structuredLog; } });
var path_utils_1 = require("./path-utils");
Object.defineProperty(exports, "sanitizePath", { enumerable: true, get: function () { return path_utils_1.sanitizePath; } });
Object.defineProperty(exports, "getPathBasename", { enumerable: true, get: function () { return path_utils_1.getPathBasename; } });
var workspace_identity_1 = require("./workspace-identity");
Object.defineProperty(exports, "buildWorkspaceIdentity", { enumerable: true, get: function () { return workspace_identity_1.buildWorkspaceIdentity; } });
Object.defineProperty(exports, "getWorkspacePathVariants", { enumerable: true, get: function () { return workspace_identity_1.getWorkspacePathVariants; } });
Object.defineProperty(exports, "isSameWorkspacePath", { enumerable: true, get: function () { return workspace_identity_1.isSameWorkspacePath; } });
Object.defineProperty(exports, "toWorkspaceRelativePath", { enumerable: true, get: function () { return workspace_identity_1.toWorkspaceRelativePath; } });
Object.defineProperty(exports, "normalizeAbsolutePath", { enumerable: true, get: function () { return workspace_identity_1.normalizeAbsolutePath; } });
var spec_affinity_1 = require("./spec-affinity");
Object.defineProperty(exports, "buildSpecAffinityTargets", { enumerable: true, get: function () { return spec_affinity_1.buildSpecAffinityTargets; } });
Object.defineProperty(exports, "evaluateCollectedDataSpecAffinity", { enumerable: true, get: function () { return spec_affinity_1.evaluateCollectedDataSpecAffinity; } });
var data_validator_1 = require("./data-validator");
Object.defineProperty(exports, "validateDataStructure", { enumerable: true, get: function () { return data_validator_1.validateDataStructure; } });
var input_normalizer_1 = require("./input-normalizer");
Object.defineProperty(exports, "transformKeyDecision", { enumerable: true, get: function () { return input_normalizer_1.transformKeyDecision; } });
Object.defineProperty(exports, "buildSessionSummaryObservation", { enumerable: true, get: function () { return input_normalizer_1.buildSessionSummaryObservation; } });
Object.defineProperty(exports, "buildTechnicalContextObservation", { enumerable: true, get: function () { return input_normalizer_1.buildTechnicalContextObservation; } });
Object.defineProperty(exports, "normalizeInputData", { enumerable: true, get: function () { return input_normalizer_1.normalizeInputData; } });
Object.defineProperty(exports, "validateInputData", { enumerable: true, get: function () { return input_normalizer_1.validateInputData; } });
Object.defineProperty(exports, "transformOpencodeCapture", { enumerable: true, get: function () { return input_normalizer_1.transformOpencodeCapture; } });
Object.defineProperty(exports, "transformOpenCodeCapture", { enumerable: true, get: function () { return input_normalizer_1.transformOpenCodeCapture; } });
var fact_coercion_1 = require("./fact-coercion");
Object.defineProperty(exports, "coerceFactToText", { enumerable: true, get: function () { return fact_coercion_1.coerceFactToText; } });
Object.defineProperty(exports, "coerceFactsToText", { enumerable: true, get: function () { return fact_coercion_1.coerceFactsToText; } });
var prompt_utils_1 = require("./prompt-utils");
Object.defineProperty(exports, "promptUser", { enumerable: true, get: function () { return prompt_utils_1.promptUser; } });
Object.defineProperty(exports, "promptUserChoice", { enumerable: true, get: function () { return prompt_utils_1.promptUserChoice; } });
var file_helpers_1 = require("./file-helpers");
Object.defineProperty(exports, "toRelativePath", { enumerable: true, get: function () { return file_helpers_1.toRelativePath; } });
Object.defineProperty(exports, "getDescriptionTierRank", { enumerable: true, get: function () { return file_helpers_1.getDescriptionTierRank; } });
Object.defineProperty(exports, "validateDescription", { enumerable: true, get: function () { return file_helpers_1.validateDescription; } });
Object.defineProperty(exports, "isDescriptionValid", { enumerable: true, get: function () { return file_helpers_1.isDescriptionValid; } });
Object.defineProperty(exports, "cleanDescription", { enumerable: true, get: function () { return file_helpers_1.cleanDescription; } });
var tool_detection_1 = require("./tool-detection");
Object.defineProperty(exports, "detectToolCall", { enumerable: true, get: function () { return tool_detection_1.detectToolCall; } });
Object.defineProperty(exports, "isProseContext", { enumerable: true, get: function () { return tool_detection_1.isProseContext; } });
Object.defineProperty(exports, "classifyConversationPhase", { enumerable: true, get: function () { return tool_detection_1.classifyConversationPhase; } });
var message_utils_1 = require("./message-utils");
Object.defineProperty(exports, "formatTimestamp", { enumerable: true, get: function () { return message_utils_1.formatTimestamp; } });
Object.defineProperty(exports, "truncateToolOutput", { enumerable: true, get: function () { return message_utils_1.truncateToolOutput; } });
Object.defineProperty(exports, "summarizeExchange", { enumerable: true, get: function () { return message_utils_1.summarizeExchange; } });
var validation_utils_1 = require("./validation-utils");
Object.defineProperty(exports, "validateNoLeakedPlaceholders", { enumerable: true, get: function () { return validation_utils_1.validateNoLeakedPlaceholders; } });
Object.defineProperty(exports, "validateAnchors", { enumerable: true, get: function () { return validation_utils_1.validateAnchors; } });
var tool_sanitizer_1 = require("./tool-sanitizer");
Object.defineProperty(exports, "sanitizeToolDescription", { enumerable: true, get: function () { return tool_sanitizer_1.sanitizeToolDescription; } });
Object.defineProperty(exports, "sanitizeToolInputPaths", { enumerable: true, get: function () { return tool_sanitizer_1.sanitizeToolInputPaths; } });
Object.defineProperty(exports, "normalizeToolStatus", { enumerable: true, get: function () { return tool_sanitizer_1.normalizeToolStatus; } });
Object.defineProperty(exports, "isApiErrorContent", { enumerable: true, get: function () { return tool_sanitizer_1.isApiErrorContent; } });
var slug_utils_1 = require("./slug-utils");
Object.defineProperty(exports, "normalizeMemoryNameCandidate", { enumerable: true, get: function () { return slug_utils_1.normalizeMemoryNameCandidate; } });
Object.defineProperty(exports, "slugify", { enumerable: true, get: function () { return slug_utils_1.slugify; } });
Object.defineProperty(exports, "isContaminatedMemoryName", { enumerable: true, get: function () { return slug_utils_1.isContaminatedMemoryName; } });
Object.defineProperty(exports, "isGenericContentTask", { enumerable: true, get: function () { return slug_utils_1.isGenericContentTask; } });
Object.defineProperty(exports, "pickBestContentName", { enumerable: true, get: function () { return slug_utils_1.pickBestContentName; } });
Object.defineProperty(exports, "ensureUniqueMemoryFilename", { enumerable: true, get: function () { return slug_utils_1.ensureUniqueMemoryFilename; } });
Object.defineProperty(exports, "generateContentSlug", { enumerable: true, get: function () { return slug_utils_1.generateContentSlug; } });
var source_capabilities_1 = require("./source-capabilities");
Object.defineProperty(exports, "getSourceCapabilities", { enumerable: true, get: function () { return source_capabilities_1.getSourceCapabilities; } });
//# sourceMappingURL=index.js.map