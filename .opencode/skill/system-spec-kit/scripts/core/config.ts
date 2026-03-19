// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CONFIG
// ───────────────────────────────────────────────────────────────
// Central configuration loader — reads JSONC config, resolves paths, exports CONFIG object
import * as path from 'path';
import * as fsSync from 'fs';
import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
import { structuredLog } from '../utils/logger';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** Represents workflow config. */
export interface WorkflowConfig {
  maxResultPreview: number;
  maxConversationMessages: number;
  maxToolOutputLines: number;
  messageTimeWindow: number;
  contextPreviewHeadLines: number;
  contextPreviewTailLines: number;
  timezoneOffsetHours: number;
  maxFilesInMemory: number;
  maxObservations: number;
  minPromptLength: number;
  maxContentPreview: number;
  toolPreviewLines: number;
  toolOutputMaxLength: number;
  timestampMatchToleranceMs: number;
  qualityAbortThreshold: number;
  learningWeights: {
    knowledge: number;
    context: number;
    uncertainty: number;
  };
}

/** Represents spec kit config. */
export interface SpecKitConfig {
  SKILL_VERSION: string;
  MESSAGE_COUNT_TRIGGER: number;
  MAX_RESULT_PREVIEW: number;
  MAX_CONVERSATION_MESSAGES: number;
  MAX_TOOL_OUTPUT_LINES: number;
  TRUNCATE_FIRST_LINES: number;
  TRUNCATE_LAST_LINES: number;
  MESSAGE_TIME_WINDOW: number;
  TIMEZONE_OFFSET_HOURS: number;
  TOOL_PREVIEW_LINES: number;
  TEMPLATE_DIR: string;
  PROJECT_ROOT: string;
  DATA_FILE: string | null;
  SPEC_FOLDER_ARG: string | null;
  MAX_FILES_IN_MEMORY: number;
  MAX_OBSERVATIONS: number;
  MIN_PROMPT_LENGTH: number;
  MAX_CONTENT_PREVIEW: number;
  TOOL_OUTPUT_MAX_LENGTH: number;
  TIMESTAMP_MATCH_TOLERANCE_MS: number;
  QUALITY_ABORT_THRESHOLD: number;
  LEARNING_WEIGHTS: WorkflowConfig['learningWeights'];
}

/* ───────────────────────────────────────────────────────────────
   2. PATH CONSTANTS
------------------------------------------------------------------*/

// F-08: Stable root detection — walk up from __dirname looking for package.json
// Instead of relying on fragile relative __dirname offset
function findScriptsRoot(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    const candidate = path.resolve(dir, '..');
    if (fsSync.existsSync(path.join(candidate, 'package.json'))) {
      return candidate;
    }
    if (candidate === dir) break; // filesystem root
    dir = candidate;
  }
  // Fallback to original __dirname-relative resolution
  return path.resolve(startDir, '..', '..');
}

const SCRIPTS_DIR: string = findScriptsRoot(__dirname);

/* ───────────────────────────────────────────────────────────────
   3. CONFIG VALIDATION
------------------------------------------------------------------*/

/**
 * Validates merged config values and falls back to defaults for invalid entries.
 * Never throws — logs warnings and returns a safe config.
 */
export function normalizeQualityAbortThreshold(
  value: number,
  defaultValue: number,
  log: typeof structuredLog = structuredLog,
): number {
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

function validateConfig(merged: WorkflowConfig, defaults: WorkflowConfig): WorkflowConfig {
  const validated = { ...merged };

  // Positive integer fields (must be > 0)
  const positiveFields: (keyof WorkflowConfig)[] = [
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
      structuredLog('warn',
        `Config validation: "${field}" has invalid value (${JSON.stringify(value)}). ` +
        `Must be a positive number. Falling back to default: ${defaults[field]}`
      );
      (validated as Record<string, unknown>)[field] = defaults[field];
    }
  }

  validated.qualityAbortThreshold = normalizeQualityAbortThreshold(
    validated.qualityAbortThreshold,
    defaults.qualityAbortThreshold,
  );

  // Non-negative integer fields (must be >= 0)
  const nonNegativeFields: (keyof WorkflowConfig)[] = [
    'contextPreviewHeadLines',
    'contextPreviewTailLines',
  ];

  for (const field of nonNegativeFields) {
    const value = validated[field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      structuredLog('warn',
        `Config validation: "${field}" has invalid value (${JSON.stringify(value)}). ` +
        `Must be a non-negative number. Falling back to default: ${defaults[field]}`
      );
      (validated as Record<string, unknown>)[field] = defaults[field];
    }
  }

  // Timezone offset: valid range is -12 to +14
  if (
    typeof validated.timezoneOffsetHours !== 'number' ||
    !Number.isFinite(validated.timezoneOffsetHours) ||
    validated.timezoneOffsetHours < -12 ||
    validated.timezoneOffsetHours > 14
  ) {
    structuredLog('warn',
      `Config validation: "timezoneOffsetHours" has invalid value (${JSON.stringify(validated.timezoneOffsetHours)}). ` +
      `Must be between -12 and 14. Falling back to default: ${defaults.timezoneOffsetHours}`
    );
    validated.timezoneOffsetHours = defaults.timezoneOffsetHours;
  }

  // Learning weights: object must exist and each weight must be between 0 and 1
  if (
    typeof validated.learningWeights !== 'object' ||
    validated.learningWeights === null
  ) {
    structuredLog('warn',
      `Config validation: "learningWeights" has invalid value (${JSON.stringify(validated.learningWeights)}). ` +
      'Must be an object. Falling back to default learning weights.'
    );
    validated.learningWeights = { ...defaults.learningWeights };
  }

  const learningWeightFields: (keyof WorkflowConfig['learningWeights'])[] = [
    'knowledge',
    'context',
    'uncertainty',
  ];

  for (const field of learningWeightFields) {
    const value = validated.learningWeights[field];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
      structuredLog('warn',
        `Config validation: "learningWeights.${field}" has invalid value (${JSON.stringify(value)}). ` +
        `Must be a number between 0 and 1. Falling back to default: ${defaults.learningWeights[field]}`
      );
      validated.learningWeights[field] = defaults.learningWeights[field];
    }
  }

  return validated;
}

/* ───────────────────────────────────────────────────────────────
   4. CONFIG LOADER
------------------------------------------------------------------*/

function loadConfig(): WorkflowConfig {
  const defaultConfig: WorkflowConfig = {
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

  const configPath: string = path.join(SCRIPTS_DIR, '..', 'config', 'config.jsonc');

  try {
    if (fsSync.existsSync(configPath)) {
      const configContent: string = fsSync.readFileSync(configPath, 'utf-8');

      // F-09: Strip JSONC comments and parse directly — no brace-depth extraction needed
      const stripped: string = stripJsoncComments(configContent).trim();

      if (!stripped) {
        structuredLog('warn', 'Config file is empty or contains only comments. Using defaults.');
        return defaultConfig;
      }

      const userConfig = JSON.parse(stripped) as Partial<WorkflowConfig>;
      const merged = { ...defaultConfig, ...userConfig };
      merged.learningWeights = {
        ...defaultConfig.learningWeights,
        ...(userConfig.learningWeights || {}),
      };
      return validateConfig(merged, defaultConfig);
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    structuredLog('warn', `Failed to load config.jsonc: ${errMsg}. Using default configuration values`);
  }

  return defaultConfig;
}

/* ───────────────────────────────────────────────────────────────
   5. CONFIG OBJECT
------------------------------------------------------------------*/

const userConfig: WorkflowConfig = loadConfig();

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
const CONFIG: SpecKitConfig = {
  ...STATIC_CONFIG,
  DATA_FILE: null,
  SPEC_FOLDER_ARG: null,
};

/* ───────────────────────────────────────────────────────────────
   6. SPECS DIRECTORY UTILITIES
------------------------------------------------------------------*/

function getSpecsDirectories(): string[] {
  return [
    path.join(CONFIG.PROJECT_ROOT, 'specs'),
    path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs')
  ];
}

function findActiveSpecsDir(): string | null {
  const possibleDirs = getSpecsDirectories();
  for (const dir of possibleDirs) {
    if (fsSync.existsSync(dir)) {
      return dir;
    }
  }
  return null;
}

function getAllExistingSpecsDirs(): string[] {
  const existing = getSpecsDirectories().filter((dir) => fsSync.existsSync(dir));
  const seenRealPaths = new Set<string>();
  const deduped: string[] = [];

  for (const dir of existing) {
    let realPath = dir;
    try {
      realPath = fsSync.realpathSync(dir);
    } catch (_error: unknown) {
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

/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
------------------------------------------------------------------*/

export {
  CONFIG,
  getSpecsDirectories,
  findActiveSpecsDir,
  getAllExistingSpecsDirs,
};
