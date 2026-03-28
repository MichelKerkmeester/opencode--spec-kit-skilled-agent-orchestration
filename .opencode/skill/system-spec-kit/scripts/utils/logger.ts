// ---------------------------------------------------------------
// MODULE: Logger
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. LOGGER
// ───────────────────────────────────────────────────────────────
// Structured logging with severity levels and JSON metadata output.
// Always emit to stderr so MCP/server callers keep stdout reserved for protocol/data output.
// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Log level for structured logging */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Structured log entry shape */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

// ───────────────────────────────────────────────────────────────
// 3. LOGGING
// ───────────────────────────────────────────────────────────────
function structuredLog(level: LogLevel, message: string, data: Record<string, unknown> = {}): void {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  };

  const jsonOutput: string = JSON.stringify(logEntry);
  const writeStructuredEntry = (): void => {
    process.stderr.write(`${jsonOutput}\n`);
  };

  if (level === 'debug') {
    if (process.env.DEBUG) {
      writeStructuredEntry();
    }
    return;
  }

  writeStructuredEntry();
}

// ───────────────────────────────────────────────────────────────
// 4. EXPORTS
// ───────────────────────────────────────────────────────────────
export { structuredLog };
