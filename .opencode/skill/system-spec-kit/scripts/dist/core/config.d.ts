import { structuredLog } from '../utils/logger';
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
/**
 * Validates merged config values and falls back to defaults for invalid entries.
 * Never throws — logs warnings and returns a safe config.
 */
export declare function normalizeQualityAbortThreshold(value: number, defaultValue: number, log?: typeof structuredLog): number;
declare const CONFIG: SpecKitConfig;
declare function getSpecsDirectories(): string[];
declare function findActiveSpecsDir(): string | null;
declare function getAllExistingSpecsDirs(): string[];
export { CONFIG, getSpecsDirectories, findActiveSpecsDir, getAllExistingSpecsDirs, };
//# sourceMappingURL=config.d.ts.map