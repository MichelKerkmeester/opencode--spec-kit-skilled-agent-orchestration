// ───────────────────────────────────────────────────────────────
// MODULE: Logger
// ───────────────────────────────────────────────────────────────
// Structured logging that writes ALL output to stderr.
// In MCP servers, stdout is reserved for JSON-RPC — diagnostic
// Output on stdout corrupts the protocol stream.
// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** Log severity levels (ascending) */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Numeric severity for level comparison */
const LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION

// ───────────────────────────────────────────────────────────────
/** Minimum log level — messages below this are suppressed.
 *  Set via LOG_LEVEL env var (default: 'info'). */
function getMinLevel(): LogLevel {
  const env = process.env.LOG_LEVEL?.toLowerCase();
  if (env && env in LEVEL_VALUES) return env as LogLevel;
  return 'info';
}

// ───────────────────────────────────────────────────────────────
// 3. CORE LOGGING

// ───────────────────────────────────────────────────────────────
/**
 * Write a structured log message to stderr.
 *
 * @param level   - Severity level
 * @param prefix  - Module prefix, e.g. '[VectorIndex]'
 * @param message - Human-readable message
 * @param data    - Optional structured metadata (omitted if empty)
 */
function log(level: LogLevel, prefix: string, message: string, data?: Record<string, unknown>): void {
  if (LEVEL_VALUES[level] < LEVEL_VALUES[getMinLevel()]) return;

  const tag = level.toUpperCase().padEnd(5); // DEBUG, INFO , WARN , ERROR
  const base = `${tag} ${prefix} ${message}`;

  if (data && Object.keys(data).length > 0) {
    // Append compact JSON metadata on the same line
    console.error(`${base} ${JSON.stringify(data)}`);
  } else {
    console.error(base);
  }
}

// ───────────────────────────────────────────────────────────────
// 4. NAMED LOGGER FACTORY

// ───────────────────────────────────────────────────────────────
/** A logger instance scoped to a specific module prefix. */
export interface Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
}

/**
 * Create a logger scoped to a module name.
 *
 * @example
 *   const logger = createLogger('VectorIndex');
 *   logger.info('Migration v5 applied');
 *   // stderr: "INFO  [VectorIndex] Migration v5 applied"
 *
 * @example
 *   const logger = createLogger('session-manager');
 *   logger.warn('Cleanup failed', { sessionId: 'abc', elapsed: 42 });
 *   // stderr: 'WARN  [session-manager] Cleanup failed {"sessionId":"abc","elapsed":42}'
 */
export function createLogger(moduleName: string): Logger {
  const prefix = `[${moduleName}]`;
  return {
    debug: (message, data?) => log('debug', prefix, message, data),
    info:  (message, data?) => log('info',  prefix, message, data),
    warn:  (message, data?) => log('warn',  prefix, message, data),
    error: (message, data?) => log('error', prefix, message, data),
  };
}

// ───────────────────────────────────────────────────────────────
// 5. EXPORTS

// ───────────────────────────────────────────────────────────────
export { log };
