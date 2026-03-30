// ───────────────────────────────────────────────────────────────
// MODULE: Index
// ───────────────────────────────────────────────────────────────
export {
  ErrorCodes,
  MemoryError,
  withTimeout,
  userFriendlyError,
  isTransientError,
  isPermanentError,
  buildErrorResponse,
  getDefaultErrorCodeForTool,
  createErrorWithHint,
} from './core.js';

export type {
  ErrorResponseData,
  ErrorResponseMeta,
  ErrorResponse,
  LegacyErrorCodeKey,
} from './core.js';

export {
  ERROR_CODES,
  RECOVERY_HINTS,
  DEFAULT_HINT,
  TOOL_SPECIFIC_HINTS,
  getRecoveryHint,
  hasSpecificHint,
  getAvailableHints,
  getErrorCodes,
} from './recovery-hints.js';

export type {
  Severity,
  RecoveryHint,
  RecoveryHintMap,
  ToolSpecificHintMap,
  ErrorCodeKey,
  ErrorCodeValue,
} from './recovery-hints.js';
