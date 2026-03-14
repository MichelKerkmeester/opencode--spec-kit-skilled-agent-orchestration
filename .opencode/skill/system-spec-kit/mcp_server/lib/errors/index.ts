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
  createErrorWithHint,
} from './core';

export type {
  ErrorResponseData,
  ErrorResponseMeta,
  ErrorResponse,
  LegacyErrorCodeKey,
} from './core';

export {
  ERROR_CODES,
  RECOVERY_HINTS,
  DEFAULT_HINT,
  TOOL_SPECIFIC_HINTS,
  getRecoveryHint,
  hasSpecificHint,
  getAvailableHints,
  getErrorCodes,
} from './recovery-hints';

export type {
  Severity,
  RecoveryHint,
  RecoveryHintMap,
  ToolSpecificHintMap,
  ErrorCodeKey,
  ErrorCodeValue,
} from './recovery-hints';
