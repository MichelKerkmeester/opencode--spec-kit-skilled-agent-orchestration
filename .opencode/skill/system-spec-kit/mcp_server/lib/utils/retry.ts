// ---------------------------------------------------------------
// MODULE: Retry
// ---------------------------------------------------------------
// REQ-032: Retry Logic with exponential backoff
// Tasks: T101-T104, T185-T191
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

export interface ErrorClassification {
  type: 'transient' | 'permanent' | 'unknown';
  shouldRetry: boolean;
  reason: string;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
}

export interface RetryOptions {
  operationName: string;
  maxRetries?: number;
  baseDelayMs?: number;
  onRetry?: (attemptNum: number, error: Error, delay: number) => void;
}

export interface AttemptLogEntry {
  errorType: string;
  classificationReason: string;
}

type ErrorWithStatus = Error & {
  status?: unknown;
  response?: {
    status?: unknown;
  };
};

type ErrorWithCode = Error & {
  code?: unknown;
  cause?: {
    code?: unknown;
  };
};

// ---------------------------------------------------------------
// 2. RETRY ERROR CLASS
// ---------------------------------------------------------------

export class RetryError extends Error {
  isPermanent?: boolean;
  retriesExhausted?: boolean;
  cause?: Error;
  attemptLog: AttemptLogEntry[];

  constructor(message: string, options?: {
    isPermanent?: boolean;
    retriesExhausted?: boolean;
    cause?: Error;
    attemptLog?: AttemptLogEntry[];
  }) {
    super(message);
    this.name = 'RetryError';
    this.isPermanent = options?.isPermanent;
    this.retriesExhausted = options?.retriesExhausted;
    this.cause = options?.cause;
    this.attemptLog = options?.attemptLog ?? [];
  }
}

// ---------------------------------------------------------------
// 3. CONSTANTS
// ---------------------------------------------------------------

export const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 5000,
  exponentialBase: 2,
};

// Transient HTTP status codes
const TRANSIENT_HTTP_CODES = new Set([408, 429, 500, 502, 503, 504, 520, 521, 522, 523, 524]);

// Permanent HTTP status codes
const PERMANENT_HTTP_CODES = new Set([400, 401, 403, 404]);

// Transient network error codes
const TRANSIENT_NETWORK_CODES = new Set([
  'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'ENETUNREACH', 'EHOSTUNREACH',
]);

// Transient message patterns
const TRANSIENT_MESSAGE_PATTERNS: RegExp[] = [
  /rate limit/i,
  /timeout/i,
  /SQLITE_BUSY/i,
];

// Permanent message patterns
const PERMANENT_MESSAGE_PATTERNS: RegExp[] = [
  /invalid api key/i,
  /authentication failed/i,
  /forbidden/i,
];

// ---------------------------------------------------------------
// 4. HELPER FUNCTIONS
// ---------------------------------------------------------------

/**
 * Extract HTTP status code from an error object.
 * Checks error.status, error.response?.status, then tries to parse from error.message.
 */
export function extractStatusCode(error: Error): number | undefined {
  const err = error as ErrorWithStatus;

  // Direct .status property
  if (typeof err.status === 'number') {
    return err.status;
  }

  // Nested .response.status
  if (err.response && typeof err.response.status === 'number') {
    return err.response.status;
  }

  // Parse from message (e.g. "HTTP 502 Bad Gateway")
  const match = error.message.match(/\bHTTP\s+(\d{3})\b/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  return undefined;
}

/**
 * Extract network error code from an error object.
 * Checks error.code, then error.cause?.code.
 */
export function extractErrorCode(error: Error): string | undefined {
  const err = error as ErrorWithCode;

  if (typeof err.code === 'string') {
    return err.code;
  }

  if (err.cause && typeof err.cause.code === 'string') {
    return err.cause.code;
  }

  return undefined;
}

// ---------------------------------------------------------------
// 5. ERROR CLASSIFICATION
// ---------------------------------------------------------------

/**
 * Classify an error as transient, permanent, or unknown.
 * Uses HTTP status codes, network error codes, and message pattern matching.
 */
export function classifyError(error: Error): ErrorClassification {
  // 1. Check HTTP status code
  const statusCode = extractStatusCode(error);
  if (statusCode !== undefined) {
    if (TRANSIENT_HTTP_CODES.has(statusCode)) {
      return {
        type: 'transient',
        shouldRetry: true,
        reason: `HTTP ${statusCode} is a transient error`,
      };
    }
    if (PERMANENT_HTTP_CODES.has(statusCode)) {
      return {
        type: 'permanent',
        shouldRetry: false,
        reason: `HTTP ${statusCode} is a permanent error`,
      };
    }
  }

  // 2. Check network error code
  const errorCode = extractErrorCode(error);
  if (errorCode !== undefined && TRANSIENT_NETWORK_CODES.has(errorCode)) {
    return {
      type: 'transient',
      shouldRetry: true,
      reason: `Network error ${errorCode} is transient`,
    };
  }

  // 3. Check message patterns - transient
  for (const pattern of TRANSIENT_MESSAGE_PATTERNS) {
    if (pattern.test(error.message)) {
      return {
        type: 'transient',
        shouldRetry: true,
        reason: `Message matches transient pattern: ${pattern}`,
      };
    }
  }

  // 4. Check message patterns - permanent
  for (const pattern of PERMANENT_MESSAGE_PATTERNS) {
    if (pattern.test(error.message)) {
      return {
        type: 'permanent',
        shouldRetry: false,
        reason: `Message matches permanent pattern: ${pattern}`,
      };
    }
  }

  // 5. Unknown
  return {
    type: 'unknown',
    shouldRetry: false,
    reason: 'Error could not be classified',
  };
}

/**
 * Check if an error is transient (should be retried).
 */
export function isTransientError(error: Error): boolean {
  return classifyError(error).type === 'transient';
}

/**
 * Check if an error is permanent (should NOT be retried).
 */
export function isPermanentError(error: Error): boolean {
  return classifyError(error).type === 'permanent';
}

// ---------------------------------------------------------------
// 6. BACKOFF CALCULATION
// ---------------------------------------------------------------

/**
 * Calculate the backoff delay for a given attempt number.
 * Formula: baseDelayMs * exponentialBase^attempt, capped at maxDelayMs.
 */
export function calculateBackoff(attempt: number, config?: Partial<RetryConfig>): number {
  const merged = { ...DEFAULT_CONFIG, ...config };
  const delay = merged.baseDelayMs * Math.pow(merged.exponentialBase, attempt);
  return Math.min(delay, merged.maxDelayMs);
}

/**
 * Get the full sequence of backoff delays for the configured number of retries.
 * Returns array of backoff values for attempts 0..maxRetries-1.
 */
export function getBackoffSequence(config?: Partial<RetryConfig>): number[] {
  const merged = { ...DEFAULT_CONFIG, ...config };
  const sequence: number[] = [];
  for (let i = 0; i < merged.maxRetries; i++) {
    sequence.push(calculateBackoff(i, merged));
  }
  return sequence;
}

// ---------------------------------------------------------------
// 7. RETRY WITH BACKOFF
// ---------------------------------------------------------------

/**
 * Sleep for a given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async function with exponential backoff.
 *
 * - Retries fn up to maxRetries times on transient errors
 * - Uses calculateBackoff for delays between retries
 * - On permanent error: throws immediately with RetryError (isPermanent=true)
 * - On exhausted retries: throws RetryError (retriesExhausted=true)
 * - On success: returns result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULT_CONFIG.maxRetries;
  const baseDelayMs = options.baseDelayMs ?? DEFAULT_CONFIG.baseDelayMs;
  const attemptLog: AttemptLogEntry[] = [];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const classification = classifyError(error);

      attemptLog.push({
        errorType: classification.type,
        classificationReason: classification.reason,
      });

      // Permanent error: fail fast
      if (classification.type === 'permanent') {
        throw new RetryError(
          `[${options.operationName}] Permanent error: ${error.message}`,
          {
            isPermanent: true,
            cause: error,
            attemptLog,
          },
        );
      }

      // Last attempt exhausted
      if (attempt >= maxRetries) {
        throw new RetryError(
          `[${options.operationName}] Retries exhausted after ${attempt + 1} attempts: ${error.message}`,
          {
            retriesExhausted: true,
            cause: error,
            attemptLog,
          },
        );
      }

      // Calculate delay and wait before next retry
      const delay = calculateBackoff(attempt, {
        baseDelayMs,
        maxDelayMs: DEFAULT_CONFIG.maxDelayMs,
        exponentialBase: DEFAULT_CONFIG.exponentialBase,
      });

      // Call onRetry callback if provided
      if (options.onRetry) {
        options.onRetry(attempt, error, delay);
      }

      await sleep(delay);
    }
  }

  // AI-GUARD: Should never reach here, but TypeScript needs this
  throw new RetryError(`[${options.operationName}] Unexpected retry loop exit`, { attemptLog });
}

// ---------------------------------------------------------------
// 8. WITH RETRY WRAPPER
// ---------------------------------------------------------------

/**
 * Creates a wrapped version of fn that automatically retries using retryWithBackoff.
 */
export function withRetry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions,
): (...args: TArgs) => Promise<TReturn> {
  return (...args: TArgs) => retryWithBackoff(() => fn(...args), options);
}
