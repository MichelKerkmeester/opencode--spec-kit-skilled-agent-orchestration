/** Log severity levels (ascending) */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/**
 * Write a structured log message to stderr.
 *
 * @param level   - Severity level
 * @param prefix  - Module prefix, e.g. '[VectorIndex]'
 * @param message - Human-readable message
 * @param data    - Optional structured metadata (omitted if empty)
 */
declare function log(level: LogLevel, prefix: string, message: string, data?: Record<string, unknown>): void;
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
export declare function createLogger(moduleName: string): Logger;
export { log };
//# sourceMappingURL=logger.d.ts.map