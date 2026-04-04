#!/usr/bin/env node
"use strict";
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality (re-export shim)
// ---------------------------------------------------------------
// Canonical implementation lives in ../lib/validate-memory-quality.ts.
// This file re-exports everything for backward compatibility and
// serves as the CLI entry point (node validate-memory-quality.js).
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMemoryQualityFile = exports.validateMemoryQualityContent = exports.shouldBlockWrite = exports.shouldBlockIndex = exports.getRuleMetadata = exports.determineValidationDisposition = exports.VALIDATION_RULE_METADATA = exports.HARD_BLOCK_RULES = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Re-export all values and types from the canonical location
var validate_memory_quality_1 = require("../lib/validate-memory-quality");
Object.defineProperty(exports, "HARD_BLOCK_RULES", { enumerable: true, get: function () { return validate_memory_quality_1.HARD_BLOCK_RULES; } });
Object.defineProperty(exports, "VALIDATION_RULE_METADATA", { enumerable: true, get: function () { return validate_memory_quality_1.VALIDATION_RULE_METADATA; } });
Object.defineProperty(exports, "determineValidationDisposition", { enumerable: true, get: function () { return validate_memory_quality_1.determineValidationDisposition; } });
Object.defineProperty(exports, "getRuleMetadata", { enumerable: true, get: function () { return validate_memory_quality_1.getRuleMetadata; } });
Object.defineProperty(exports, "shouldBlockIndex", { enumerable: true, get: function () { return validate_memory_quality_1.shouldBlockIndex; } });
Object.defineProperty(exports, "shouldBlockWrite", { enumerable: true, get: function () { return validate_memory_quality_1.shouldBlockWrite; } });
Object.defineProperty(exports, "validateMemoryQualityContent", { enumerable: true, get: function () { return validate_memory_quality_1.validateMemoryQualityContent; } });
Object.defineProperty(exports, "validateMemoryQualityFile", { enumerable: true, get: function () { return validate_memory_quality_1.validateMemoryQualityFile; } });
// CLI entry point — preserved here since this is the file invoked
// as `node validate-memory-quality.js <path>`.
const validate_memory_quality_2 = require("../lib/validate-memory-quality");
function main() {
    const inputPath = process.argv[2];
    if (!inputPath) {
        console.error('Usage: node validate-memory-quality.js <memory-file-path>');
        process.exit(2);
    }
    const resolvedPath = path_1.default.resolve(inputPath);
    if (!fs_1.default.existsSync(resolvedPath)) {
        console.error(`File not found: ${resolvedPath}`);
        process.exit(2);
    }
    const result = (0, validate_memory_quality_2.validateMemoryQualityFile)(resolvedPath);
    if (!result.valid) {
        console.error(`QUALITY_GATE_FAIL: ${result.failedRules.join(', ')}`);
        for (const failed of result.ruleResults.filter((rule) => !rule.passed)) {
            console.error(`${failed.ruleId}: ${failed.message}`);
        }
        process.exit(1);
    }
    console.log('QUALITY_GATE_PASS');
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=validate-memory-quality.js.map