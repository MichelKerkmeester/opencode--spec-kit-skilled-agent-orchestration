// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Error Diagnostics
// ───────────────────────────────────────────────────────────────

export type AdvisorErrorClass = 'timeout' | 'parse' | 'spawn' | 'unknown';

export interface AdvisorErrorDiagnostics {
  readonly errorClass: AdvisorErrorClass;
  readonly errorMessage?: string;
}

const MAX_ERROR_MESSAGE_LENGTH = 240;
const TIMEOUT_CODE_VALUES = new Set(['ETIMEDOUT', 'ESOCKETTIMEDOUT']);
const SPAWN_CODE_VALUES = new Set([
  'ENOENT',
  'EACCES',
  'EPERM',
  'EPIPE',
  'EMFILE',
  'ENFILE',
]);

function sanitizeAdvisorErrorMessage(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const compact = value.replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
  return compact ? compact.slice(0, MAX_ERROR_MESSAGE_LENGTH) : undefined;
}

function extractErrorMessage(error: unknown): string | undefined {
  if (error instanceof Error) {
    return sanitizeAdvisorErrorMessage(error.message);
  }
  if (typeof error === 'string') {
    return sanitizeAdvisorErrorMessage(error);
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error as { message?: unknown };
    return sanitizeAdvisorErrorMessage(message);
  }
  return undefined;
}

function extractErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }
  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code.toUpperCase() : undefined;
}

function classifyMessage(message: string | undefined): AdvisorErrorClass {
  if (!message) {
    return 'unknown';
  }
  const lowered = message.toLowerCase();
  if (/\b(timeout|timed out|time-out)\b/.test(lowered)) {
    return 'timeout';
  }
  if (/\b(parse|json|syntaxerror|unexpected token)\b/.test(lowered)) {
    return 'parse';
  }
  if (/\b(spawn|enoent|eacces|eperm|epipe|emfile|enfile)\b/.test(lowered)) {
    return 'spawn';
  }
  return 'unknown';
}

export function classifyAdvisorException(error: unknown): AdvisorErrorDiagnostics {
  const errorMessage = extractErrorMessage(error);
  const errorCode = extractErrorCode(error);
  if (errorCode && TIMEOUT_CODE_VALUES.has(errorCode)) {
    return { errorClass: 'timeout', ...(errorMessage ? { errorMessage } : {}) };
  }
  if (errorCode && SPAWN_CODE_VALUES.has(errorCode)) {
    return { errorClass: 'spawn', ...(errorMessage ? { errorMessage } : {}) };
  }
  if (error instanceof SyntaxError) {
    return { errorClass: 'parse', ...(errorMessage ? { errorMessage } : {}) };
  }
  return {
    errorClass: classifyMessage(errorMessage),
    ...(errorMessage ? { errorMessage } : {}),
  };
}

export function classifyAdvisorFailure(
  errorCode: string | null | undefined,
  errorDetails?: unknown,
): AdvisorErrorDiagnostics | null {
  if (!errorCode && errorDetails === undefined) {
    return null;
  }
  const normalizedCode = typeof errorCode === 'string' ? errorCode.toUpperCase() : null;
  const errorMessage = sanitizeAdvisorErrorMessage(errorDetails);
  if (normalizedCode === 'TIMEOUT' || normalizedCode === 'SIGNAL_KILLED') {
    return { errorClass: 'timeout', ...(errorMessage ? { errorMessage } : {}) };
  }
  if (
    normalizedCode === 'JSON_PARSE_FAILED'
    || normalizedCode === 'INVALID_JSON_SHAPE'
    || normalizedCode === 'PARSE_FAIL'
  ) {
    return { errorClass: 'parse', ...(errorMessage ? { errorMessage } : {}) };
  }
  if (
    normalizedCode === 'PYTHON_MISSING'
    || normalizedCode === 'SCRIPT_MISSING'
    || normalizedCode === 'SPAWN_ERROR'
  ) {
    return { errorClass: 'spawn', ...(errorMessage ? { errorMessage } : {}) };
  }
  return {
    errorClass: classifyMessage(errorMessage),
    ...(errorMessage ? { errorMessage } : {}),
  };
}
