// ---------------------------------------------------------------
// MODULE: Retry
// ---------------------------------------------------------------
// Canonical location (moved from mcp_server/lib/utils/retry.js)
// ---------------------------------------------------------------

import type { RetryConfig, ErrorClassification, RetryOptions, RetryAttemptLogEntry } from '../types.js';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

/** Defines default config. */
export const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,  // 1 second base delay
  maxDelayMs: 4000,   // 4 second max delay
  exponentialBase: 2, // Multiplier for exponential backoff
};

// ---------------------------------------------------------------
// 2. ERROR CLASSIFICATION
// ---------------------------------------------------------------

/** Defines transient http status codes. */
export const TRANSIENT_HTTP_STATUS_CODES: Set<number> = new Set([
  408, // Request Timeout
  429, // Too Many Requests (Rate Limited)
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
  520, // Cloudflare: Unknown Error
  521, // Cloudflare: Web Server Is Down
  522, // Cloudflare: Connection Timed Out
  523, // Cloudflare: Origin Is Unreachable
  524, // Cloudflare: A Timeout Occurred
]);

/** Defines permanent http status codes. */
export const PERMANENT_HTTP_STATUS_CODES: Set<number> = new Set([
  400, // Bad Request
  401, // Unauthorized
  403, // Forbidden
  404, // Not Found
  405, // Method Not Allowed
  410, // Gone
  422, // Unprocessable Entity
]);

/** Defines transient network errors. */
export const TRANSIENT_NETWORK_ERRORS: Set<string> = new Set([
  'ETIMEDOUT',     // Connection timed out
  'ECONNRESET',    // Connection reset by peer
  'ECONNREFUSED',  // Connection refused (service may be restarting)
  'ENOTFOUND',     // DNS lookup failed (may be transient)
  'ENETUNREACH',   // Network unreachable
  'EHOSTUNREACH',  // Host unreachable
  'EPIPE',         // Broken pipe
  'EAI_AGAIN',     // DNS lookup timeout
]);

/** Defines transient error patterns. */
export const TRANSIENT_ERROR_PATTERNS: readonly RegExp[] = [
  /timeout/i,
  /timed out/i,
  /temporarily unavailable/i,
  /rate limit/i,
  /too many requests/i,
  /service unavailable/i,
  /server error/i,
  /network error/i,
  /connection reset/i,
  /SQLITE_BUSY/,   // SQLite database is locked/busy
  /SQLITE_LOCKED/, // SQLite table is locked
];

/** Defines permanent error patterns. */
export const PERMANENT_ERROR_PATTERNS: readonly RegExp[] = [
  /unauthorized/i,
  /authentication failed/i,
  /invalid api key/i,
  /invalid_api_key/i,
  /forbidden/i,
  /access denied/i,
  /not found/i,
  /does not exist/i,
  /invalid request/i,
  /malformed/i,
];

// ---------------------------------------------------------------
// 3. ERROR TYPE DETECTION
// ---------------------------------------------------------------

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  response?: { status: number };
  cause?: unknown;
}

/** Extract status code. */
export function extractStatusCode(error: ErrorWithStatus): number | null {
  // Direct status property (common in fetch/axios)
  if (typeof error.status === 'number') {
    return error.status;
  }

  // Response object (fetch)
  if (error.response && typeof error.response.status === 'number') {
    return error.response.status;
  }

  // statusCode property (node http)
  if (typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  // Parse from error message (e.g., "HTTP 500 Internal Server Error")
  const messageMatch = error.message?.match(/\b([45]\d{2})\b/);
  if (messageMatch) {
    return parseInt(messageMatch[1], 10);
  }

  return null;
}

/** Extract error code. */
export function extractErrorCode(error: ErrorWithStatus): string | null {
  // Standard Node.js error code
  if (typeof error.code === 'string') {
    return error.code;
  }

  // Cause chain (Error.cause)
  if (error.cause && typeof error.cause === 'object') {
    const causeRecord = error.cause as Record<string, unknown>;
    if (typeof causeRecord.code === 'string') {
      return causeRecord.code;
    }
  }

  return null;
}

/** Classify error. */
export function classifyError(error: Error | null): ErrorClassification {
  if (!error) {
    return { type: 'unknown', reason: 'No error provided', shouldRetry: false };
  }

  const errorWithStatus: ErrorWithStatus = error;
  const statusCode = extractStatusCode(errorWithStatus);
  const errorCode = extractErrorCode(errorWithStatus);
  const message = error.message || String(error);

  // 1. Check HTTP status codes first (most reliable)
  if (statusCode) {
    if (PERMANENT_HTTP_STATUS_CODES.has(statusCode)) {
      return {
        type: 'permanent',
        reason: `HTTP ${statusCode} (permanent error)`,
        shouldRetry: false,
      };
    }
    if (TRANSIENT_HTTP_STATUS_CODES.has(statusCode)) {
      return {
        type: 'transient',
        reason: `HTTP ${statusCode} (transient error)`,
        shouldRetry: true,
      };
    }
  }

  // 2. Check network error codes
  if (errorCode && TRANSIENT_NETWORK_ERRORS.has(errorCode)) {
    return {
      type: 'transient',
      reason: `Network error: ${errorCode}`,
      shouldRetry: true,
    };
  }

  // 3. Check permanent error patterns (check before transient to fail fast)
  for (const pattern of PERMANENT_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return {
        type: 'permanent',
        reason: `Message matches permanent pattern: ${pattern.source}`,
        shouldRetry: false,
      };
    }
  }

  // 4. Check transient error patterns
  for (const pattern of TRANSIENT_ERROR_PATTERNS) {
    if (pattern.test(message)) {
      return {
        type: 'transient',
        reason: `Message matches transient pattern: ${pattern.source}`,
        shouldRetry: true,
      };
    }
  }

  // 5. Default: Unknown - conservative approach (don't retry by default)
  return {
    type: 'unknown',
    reason: 'Could not classify error type',
    shouldRetry: false,
  };
}

/** Is transient error. */
export function isTransientError(error: Error): boolean {
  return classifyError(error).shouldRetry;
}

/** Is permanent error. */
export function isPermanentError(error: Error): boolean {
  return classifyError(error).type === 'permanent';
}

// ---------------------------------------------------------------
// 4. BACKOFF CALCULATION
// ---------------------------------------------------------------

/** Provides calculate backoff. */
export function calculateBackoff(attempt: number, config: RetryConfig = DEFAULT_CONFIG): number {
  const { baseDelayMs, exponentialBase, maxDelayMs } = config;
  const delay = baseDelayMs * Math.pow(exponentialBase, attempt);
  return Math.min(delay, maxDelayMs);
}

/** Get backoff sequence. */
export function getBackoffSequence(config: RetryConfig = DEFAULT_CONFIG): number[] {
  const delays: number[] = [];
  for (let i = 0; i < config.maxRetries; i++) {
    delays.push(calculateBackoff(i, config));
  }
  return delays;
}

// ---------------------------------------------------------------
// 5. RETRY UTILITY
// ---------------------------------------------------------------

/** Sleep. */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface RetryError extends Error {
  cause?: unknown;
  attemptLog?: RetryAttemptLogEntry[];
  isPermanent?: boolean;
  retriesExhausted?: boolean;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Provides retry with backoff. */
export async function retryWithBackoff<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    operationName = 'operation',
    maxRetries = DEFAULT_CONFIG.maxRetries,
    baseDelayMs = DEFAULT_CONFIG.baseDelayMs,
    maxDelayMs = DEFAULT_CONFIG.maxDelayMs,
    exponentialBase = DEFAULT_CONFIG.exponentialBase,
    onRetry = null,
    shouldRetry = null,
  } = options;

  const config: RetryConfig = { maxRetries, baseDelayMs, maxDelayMs, exponentialBase };
  const attemptLog: RetryAttemptLogEntry[] = [];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const isRetry = attempt > 0;
    const attemptNum = attempt + 1;

    try {
      // Execute the operation
      const result = await fn();

      // Log successful attempt
      attemptLog.push({
        attempt: attemptNum,
        success: true,
        isRetry,
        timestamp: new Date().toISOString(),
      });

      if (isRetry) {
        console.error(
          `[retry] ${operationName} succeeded on attempt ${attemptNum}/${maxRetries + 1}`
        );
      }

      return result;

    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Classify the error
      const classification = classifyError(lastError);
      const { type: errorType, reason, shouldRetry: defaultShouldRetry } = classification;

      // CHK-185: Log retry attempt with error type
      attemptLog.push({
        attempt: attemptNum,
        success: false,
        isRetry,
        errorType,
        errorMessage: lastError.message,
        classificationReason: reason,
        timestamp: new Date().toISOString(),
      });

      console.error(
        `[retry] ${operationName} attempt ${attemptNum}/${maxRetries + 1} failed: ` +
        `[${errorType}] ${lastError.message}`
      );

      // CHK-184: Permanent errors fail fast (no retry)
      if (errorType === 'permanent') {
        console.error(
          `[retry] ${operationName} failed permanently (${reason}), not retrying`
        );
        const permanentError: RetryError = new Error(
          `${operationName} failed permanently: ${lastError.message}`
        );
        permanentError.cause = lastError;
        permanentError.attemptLog = attemptLog;
        permanentError.isPermanent = true;
        throw permanentError;
      }

      // Check if we should retry (custom function or default classification)
      const willRetry = shouldRetry
        ? shouldRetry(lastError, attempt, classification)
        : defaultShouldRetry;

      // CHK-183: Check if retries exhausted
      if (attempt >= maxRetries || !willRetry) {
        console.error(
          `[retry] ${operationName} exhausted retries (${attemptNum} attempts)`
        );
        const exhaustedError: RetryError = new Error(
          `${operationName} failed after ${attemptNum} attempts: ${lastError.message}`
        );
        exhaustedError.cause = lastError;
        exhaustedError.attemptLog = attemptLog;
        exhaustedError.retriesExhausted = true;
        throw exhaustedError;
      }

      // CHK-182: Calculate backoff delay
      const delay = calculateBackoff(attempt, config);

      console.error(
        `[retry] ${operationName} will retry in ${delay}ms ` +
        `(attempt ${attemptNum + 1}/${maxRetries + 1})`
      );

      // Call optional retry callback
      if (onRetry) {
        try {
          await onRetry(attempt, lastError, delay);
        } catch (callbackError: unknown) {
          if (callbackError instanceof Error) {
            void callbackError.message;
          }
          console.error(`[retry] onRetry callback error: ${getErrorMessage(callbackError)}`);
        }
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  // Should not reach here, but handle edge case
  throw lastError;
}

/** Provides with retry. */
export function withRetry<T, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<T>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<T> {
  return async (...args: TArgs): Promise<T> => {
    return retryWithBackoff(() => fn(...args), options);
  };
}
