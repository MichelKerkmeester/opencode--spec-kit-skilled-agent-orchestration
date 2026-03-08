// ---------------------------------------------------------------
// MODULE: Logger
// ---------------------------------------------------------------
// Structured logging with severity levels and JSON metadata output
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/** Log level for structured logging */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Structured log entry shape */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------
// 2. LOGGING
// ---------------------------------------------------------------

function structuredLog(level: LogLevel, message: string, data: Record<string, unknown> = {}): void {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  };

  const jsonOutput: string = JSON.stringify(logEntry);

  if (level === 'error') {
    console.error(jsonOutput);
  } else if (level === 'warn') {
    console.warn(jsonOutput);
  } else if (level === 'debug' && process.env.DEBUG) {
    console.log(jsonOutput);
  } else if (level === 'info') {
    console.log(jsonOutput);
  }
}

// ---------------------------------------------------------------
// 3. EXPORTS
// ---------------------------------------------------------------

export { structuredLog };
