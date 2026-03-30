// ───────────────────────────────────────────────────────────────
// MODULE: Errors
// ───────────────────────────────────────────────────────────────
// LIB: ERRORS BARREL
export {
  ErrorCodes,
  MemoryError,
  withTimeout,
  userFriendlyError,
  isTransientError,
  isPermanentError,
  buildErrorResponse,
  createErrorWithHint,
  ERROR_CODES,
  RECOVERY_HINTS,
  DEFAULT_HINT,
  TOOL_SPECIFIC_HINTS,
  getRecoveryHint,
  hasSpecificHint,
  getAvailableHints,
  getErrorCodes,
  getDefaultErrorCodeForTool,
} from './errors/index.js';

export type {
  ErrorResponseData,
  ErrorResponseMeta,
  ErrorResponse,
  LegacyErrorCodeKey,
  Severity,
  RecoveryHint,
  RecoveryHintMap,
  ToolSpecificHintMap,
  ErrorCodeKey,
  ErrorCodeValue,
} from './errors/index.js';
