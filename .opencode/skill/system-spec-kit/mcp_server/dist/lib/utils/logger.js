// ───────────────────────────────────────────────────────────────
// MODULE: Logger
// ───────────────────────────────────────────────────────────────
// Structured logging that writes ALL output to stderr.
// In MCP servers, stdout is reserved for JSON-RPC — diagnostic
// Output on stdout corrupts the protocol stream.
// ───────────────────────────────────────────────────────────────
// 1. TYPES
/** Numeric severity for level comparison */
const LEVEL_VALUES = {
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
function getMinLevel() {
    const env = process.env.LOG_LEVEL?.toLowerCase();
    if (env && env in LEVEL_VALUES)
        return env;
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
function log(level, prefix, message, data) {
    if (LEVEL_VALUES[level] < LEVEL_VALUES[getMinLevel()])
        return;
    const tag = level.toUpperCase().padEnd(5); // DEBUG, INFO , WARN , ERROR
    const base = `${tag} ${prefix} ${message}`;
    if (data && Object.keys(data).length > 0) {
        // Append compact JSON metadata on the same line
        console.error(`${base} ${JSON.stringify(data)}`);
    }
    else {
        console.error(base);
    }
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
export function createLogger(moduleName) {
    const prefix = `[${moduleName}]`;
    return {
        debug: (message, data) => log('debug', prefix, message, data),
        info: (message, data) => log('info', prefix, message, data),
        warn: (message, data) => log('warn', prefix, message, data),
        error: (message, data) => log('error', prefix, message, data),
    };
}
// ───────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────
export { log };
//# sourceMappingURL=logger.js.map