"use strict";
// ---------------------------------------------------------------
// MODULE: Index
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChildFolderAsync = exports.findChildFolderSync = exports.SEARCH_MAX_DEPTH = exports.CATEGORY_FOLDER_PATTERN = exports.SPEC_FOLDER_BASIC_PATTERN = exports.SPEC_FOLDER_PATTERN = exports.getAllExistingSpecsDirs = exports.findActiveSpecsDir = exports.getSpecsDirectories = exports.CONFIG = void 0;
// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for core modules (config, spec-folder utilities)
// Workflow.ts not exported here to avoid circular dependencies
// Import directly: import { runWorkflow } from './core/workflow';
var config_1 = require("./config");
Object.defineProperty(exports, "CONFIG", { enumerable: true, get: function () { return config_1.CONFIG; } });
Object.defineProperty(exports, "getSpecsDirectories", { enumerable: true, get: function () { return config_1.getSpecsDirectories; } });
Object.defineProperty(exports, "findActiveSpecsDir", { enumerable: true, get: function () { return config_1.findActiveSpecsDir; } });
Object.defineProperty(exports, "getAllExistingSpecsDirs", { enumerable: true, get: function () { return config_1.getAllExistingSpecsDirs; } });
var subfolder_utils_1 = require("./subfolder-utils");
Object.defineProperty(exports, "SPEC_FOLDER_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.SPEC_FOLDER_PATTERN; } });
Object.defineProperty(exports, "SPEC_FOLDER_BASIC_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.SPEC_FOLDER_BASIC_PATTERN; } });
Object.defineProperty(exports, "CATEGORY_FOLDER_PATTERN", { enumerable: true, get: function () { return subfolder_utils_1.CATEGORY_FOLDER_PATTERN; } });
Object.defineProperty(exports, "SEARCH_MAX_DEPTH", { enumerable: true, get: function () { return subfolder_utils_1.SEARCH_MAX_DEPTH; } });
Object.defineProperty(exports, "findChildFolderSync", { enumerable: true, get: function () { return subfolder_utils_1.findChildFolderSync; } });
Object.defineProperty(exports, "findChildFolderAsync", { enumerable: true, get: function () { return subfolder_utils_1.findChildFolderAsync; } });
//# sourceMappingURL=index.js.map