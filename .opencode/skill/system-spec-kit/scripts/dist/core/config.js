"use strict";
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
exports.normalizeQualityAbortThreshold = normalizeQualityAbortThreshold;
exports.getSpecsDirectories = getSpecsDirectories;
exports.findActiveSpecsDir = findActiveSpecsDir;
exports.getAllExistingSpecsDirs = getAllExistingSpecsDirs;
// ───────────────────────────────────────────────────────────────
// 1. CONFIG
// ───────────────────────────────────────────────────────────────
// Central configuration loader — reads JSONC config, resolves paths, exports CONFIG object
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
const jsonc_strip_1 = require("@spec-kit/shared/utils/jsonc-strip");
const logger_1 = require("../utils/logger");
/* ───────────────────────────────────────────────────────────────
   2. PATH CONSTANTS
------------------------------------------------------------------*/
// F-08: Stable root detection — walk up from __dirname looking for package.json
// Instead of relying on fragile relative __dirname offset
function findScriptsRoot(startDir) {
    let dir = startDir;
    for (let i = 0; i < 10; i++) {
        const candidate = path.resolve(dir, '..');
        if (fsSync.existsSync(path.join(candidate, 'package.json'))) {
            return candidate;
        }
        if (candidate === dir)
            break; // filesystem root
        dir = candidate;
    }
    // Fallback to original __dirname-relative resolution
    return path.resolve(startDir, '..', '..');
}
const SCRIPTS_DIR = findScriptsRoot(__dirname);
/* ───────────────────────────────────────────────────────────────
   3. CONFIG VALIDATION
------------------------------------------------------------------*/
/**
 * Validates merged config values and falls back to defaults for invalid entries.
 * Never throws — logs warnings and returns a safe config.
 */
function normalizeQualityAbortThreshold(value, defaultValue, log = logger_1.structuredLog) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 100) {
        log('warn', 'qualityAbortThreshold invalid or out of range 0.0-1.0 (or legacy 1-100), using default', {
            value,
        });
        return defaultValue;
    }
    if (value > 1) {
        const normalized = value / 100;
        log('warn', 'qualityAbortThreshold uses legacy 1-100 scale and was auto-converted to canonical 0.0-1.0', {
            value,
            normalized,
        });
        return normalized;
    }
    return value;
}
function validateConfig(merged, defaults) {
    const validated = { ...merged };
    // Positive integer fields (must be > 0)
    const positiveFields = [
        'maxResultPreview',
        'maxConversationMessages',
        'maxToolOutputLines',
        'messageTimeWindow',
        'maxFilesInMemory',
        'maxObservations',
        'minPromptLength',
        'maxContentPreview',
        'toolPreviewLines',
        'toolOutputMaxLength',
        'timestampMatchToleranceMs',
    ];
    for (const field of positiveFields) {
        const value = validated[field];
        if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
            (0, logger_1.structuredLog)('warn', `Config validation: "${field}" has invalid value (${JSON.stringify(value)}). ` +
                `Must be a positive number. Falling back to default: ${defaults[field]}`);
            validated[field] = defaults[field];
        }
    }
    validated.qualityAbortThreshold = normalizeQualityAbortThreshold(validated.qualityAbortThreshold, defaults.qualityAbortThreshold);
    // Non-negative integer fields (must be >= 0)
    const nonNegativeFields = [
        'contextPreviewHeadLines',
        'contextPreviewTailLines',
    ];
    for (const field of nonNegativeFields) {
        const value = validated[field];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
            (0, logger_1.structuredLog)('warn', `Config validation: "${field}" has invalid value (${JSON.stringify(value)}). ` +
                `Must be a non-negative number. Falling back to default: ${defaults[field]}`);
            validated[field] = defaults[field];
        }
    }
    // Timezone offset: valid range is -12 to +14
    if (typeof validated.timezoneOffsetHours !== 'number' ||
        !Number.isFinite(validated.timezoneOffsetHours) ||
        validated.timezoneOffsetHours < -12 ||
        validated.timezoneOffsetHours > 14) {
        (0, logger_1.structuredLog)('warn', `Config validation: "timezoneOffsetHours" has invalid value (${JSON.stringify(validated.timezoneOffsetHours)}). ` +
            `Must be between -12 and 14. Falling back to default: ${defaults.timezoneOffsetHours}`);
        validated.timezoneOffsetHours = defaults.timezoneOffsetHours;
    }
    // Learning weights: object must exist and each weight must be between 0 and 1
    if (typeof validated.learningWeights !== 'object' ||
        validated.learningWeights === null) {
        (0, logger_1.structuredLog)('warn', `Config validation: "learningWeights" has invalid value (${JSON.stringify(validated.learningWeights)}). ` +
            'Must be an object. Falling back to default learning weights.');
        validated.learningWeights = { ...defaults.learningWeights };
    }
    const learningWeightFields = [
        'knowledge',
        'context',
        'uncertainty',
    ];
    for (const field of learningWeightFields) {
        const value = validated.learningWeights[field];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
            (0, logger_1.structuredLog)('warn', `Config validation: "learningWeights.${field}" has invalid value (${JSON.stringify(value)}). ` +
                `Must be a number between 0 and 1. Falling back to default: ${defaults.learningWeights[field]}`);
            validated.learningWeights[field] = defaults.learningWeights[field];
        }
    }
    return validated;
}
/* ───────────────────────────────────────────────────────────────
   4. CONFIG LOADER
------------------------------------------------------------------*/
function loadConfig() {
    const defaultConfig = {
        maxResultPreview: 500,
        maxConversationMessages: 100,
        maxToolOutputLines: 100,
        messageTimeWindow: 300000,
        contextPreviewHeadLines: 50,
        contextPreviewTailLines: 20,
        timezoneOffsetHours: 0,
        maxFilesInMemory: 10,
        maxObservations: 15, // Raised from 3 to 15 to prevent 96% data loss (010-perfect-session-capturing)
        minPromptLength: 60,
        maxContentPreview: 500,
        toolPreviewLines: 10,
        toolOutputMaxLength: 500,
        timestampMatchToleranceMs: 5000,
        qualityAbortThreshold: 0.15,
        learningWeights: {
            knowledge: 0.4,
            context: 0.35,
            uncertainty: 0.25,
        },
    };
    const configPath = path.join(SCRIPTS_DIR, '..', 'config', 'config.jsonc');
    try {
        if (fsSync.existsSync(configPath)) {
            const configContent = fsSync.readFileSync(configPath, 'utf-8');
            // F-09: Strip JSONC comments and parse directly — no brace-depth extraction needed
            const stripped = (0, jsonc_strip_1.stripJsoncComments)(configContent).trim();
            if (!stripped) {
                (0, logger_1.structuredLog)('warn', 'Config file is empty or contains only comments. Using defaults.');
                return defaultConfig;
            }
            const userConfig = JSON.parse(stripped);
            const merged = { ...defaultConfig, ...userConfig };
            merged.learningWeights = {
                ...defaultConfig.learningWeights,
                ...(userConfig.learningWeights || {}),
            };
            return validateConfig(merged, defaultConfig);
        }
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        (0, logger_1.structuredLog)('warn', `Failed to load config.jsonc: ${errMsg}. Using default configuration values`);
    }
    return defaultConfig;
}
/* ───────────────────────────────────────────────────────────────
   5. CONFIG OBJECT
------------------------------------------------------------------*/
const userConfig = loadConfig();
// F-30: Immutable static config — frozen after initialization
const STATIC_CONFIG = Object.freeze({
    SKILL_VERSION: '1.7.2',
    MESSAGE_COUNT_TRIGGER: 20,
    MAX_RESULT_PREVIEW: userConfig.maxResultPreview,
    MAX_CONVERSATION_MESSAGES: userConfig.maxConversationMessages,
    MAX_TOOL_OUTPUT_LINES: userConfig.maxToolOutputLines,
    TRUNCATE_FIRST_LINES: userConfig.contextPreviewHeadLines,
    TRUNCATE_LAST_LINES: userConfig.contextPreviewTailLines,
    MESSAGE_TIME_WINDOW: userConfig.messageTimeWindow,
    TIMEZONE_OFFSET_HOURS: userConfig.timezoneOffsetHours,
    TOOL_PREVIEW_LINES: userConfig.toolPreviewLines,
    TEMPLATE_DIR: path.join(SCRIPTS_DIR, '..', 'templates'),
    PROJECT_ROOT: path.resolve(SCRIPTS_DIR, '..', '..', '..'),
    MAX_FILES_IN_MEMORY: userConfig.maxFilesInMemory,
    MAX_OBSERVATIONS: userConfig.maxObservations,
    MIN_PROMPT_LENGTH: userConfig.minPromptLength,
    MAX_CONTENT_PREVIEW: userConfig.maxContentPreview,
    TOOL_OUTPUT_MAX_LENGTH: userConfig.toolOutputMaxLength,
    TIMESTAMP_MATCH_TOLERANCE_MS: userConfig.timestampMatchToleranceMs,
    QUALITY_ABORT_THRESHOLD: userConfig.qualityAbortThreshold,
    LEARNING_WEIGHTS: Object.freeze({ ...userConfig.learningWeights }),
});
// Mutable runtime config — set by parseArguments()
const CONFIG = {
    ...STATIC_CONFIG,
    DATA_FILE: null,
    SPEC_FOLDER_ARG: null,
};
exports.CONFIG = CONFIG;
/* ───────────────────────────────────────────────────────────────
   6. SPECS DIRECTORY UTILITIES
------------------------------------------------------------------*/
function getSpecsDirectories() {
    return [
        path.join(CONFIG.PROJECT_ROOT, 'specs'),
        path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs')
    ];
}
function findActiveSpecsDir() {
    const possibleDirs = getSpecsDirectories();
    for (const dir of possibleDirs) {
        if (fsSync.existsSync(dir)) {
            return dir;
        }
    }
    return null;
}
function getAllExistingSpecsDirs() {
    const existing = getSpecsDirectories().filter((dir) => fsSync.existsSync(dir));
    const seenRealPaths = new Set();
    const deduped = [];
    for (const dir of existing) {
        let realPath = dir;
        try {
            realPath = fsSync.realpathSync(dir);
        }
        catch (_error) {
            if (_error instanceof Error) {
                void _error.message;
            }
            // Keep original dir if realpath resolution fails
        }
        if (!seenRealPaths.has(realPath)) {
            seenRealPaths.add(realPath);
            deduped.push(dir);
        }
    }
    return deduped;
}
//# sourceMappingURL=config.js.map