// ───────────────────────────────────────────────────────────────
// MODULE: Json Helpers
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────
// 2. SAFE JSON PARSING
// ───────────────────────────────────────────────────────────────
/** Parses JSON and returns a fallback value on failure. */
export function safeJsonParse(str, fallback) {
    if (!str)
        return fallback;
    try {
        return JSON.parse(str);
    }
    catch {
        return fallback;
    }
}
/** Stringifies JSON and returns a fallback value on failure. */
export function safeJsonStringify(value, fallback = 'null', space) {
    try {
        return JSON.stringify(value, null, space);
    }
    catch {
        return fallback;
    }
}
/** Parses JSON and validates the expected top-level value type. */
export function safeJsonParseTyped(str, expectedType, fallback) {
    const parsed = safeJsonParse(str, fallback);
    switch (expectedType) {
        case 'array':
            return (Array.isArray(parsed) ? parsed : fallback);
        case 'object':
            return (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
                ? parsed
                : fallback;
        case 'string':
            return (typeof parsed === 'string' ? parsed : fallback);
        case 'number':
            return (typeof parsed === 'number' && !isNaN(parsed) ? parsed : fallback);
        default:
            return parsed;
    }
}
/* ───────────────────────────────────────────────────────────────
   3. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
//# sourceMappingURL=json-helpers.js.map