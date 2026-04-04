"use strict";
// ---------------------------------------------------------------
// MODULE: Logger
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.structuredLog = structuredLog;
// ───────────────────────────────────────────────────────────────
// 3. LOGGING
// ───────────────────────────────────────────────────────────────
function structuredLog(level, message, data = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...data
    };
    const jsonOutput = JSON.stringify(logEntry);
    const writeStructuredEntry = () => {
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
//# sourceMappingURL=logger.js.map