/** Log level for structured logging */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/** Structured log entry shape */
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    [key: string]: unknown;
}
declare function structuredLog(level: LogLevel, message: string, data?: Record<string, unknown>): void;
export { structuredLog };
//# sourceMappingURL=logger.d.ts.map