"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow Accessors
// ───────────────────────────────────────────────────────────────
// Safe typed accessors for reading values from loosely-typed objects.
// Extracted from workflow.ts to reduce module size.
Object.defineProperty(exports, "__esModule", { value: true });
exports.readNamedObject = readNamedObject;
exports.readStringArray = readStringArray;
exports.readNumber = readNumber;
exports.readString = readString;
exports.capText = capText;
exports.summarizeAuditCounts = summarizeAuditCounts;
// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────
/** Accepts both Record<string, unknown> (readNamedObject results) and typed interfaces
 * (CollectedDataFull) without requiring an index signature on the typed interface.
 * Each helper casts to Record internally -- safe because all values are runtime-checked. */
function readNamedObject(source, ...keys) {
    if (!source) {
        return null;
    }
    const src = source;
    for (const key of keys) {
        const value = src[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value;
        }
    }
    return null;
}
function readStringArray(source, ...keys) {
    if (!source) {
        return [];
    }
    const src = source;
    for (const key of keys) {
        const value = src[key];
        if (Array.isArray(value)) {
            return value
                .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
                .filter(Boolean);
        }
    }
    return [];
}
function readNumber(source, fallback, ...keys) {
    if (!source) {
        return fallback;
    }
    const src = source;
    for (const key of keys) {
        const value = src[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
    }
    return fallback;
}
function readString(source, fallback, ...keys) {
    if (!source) {
        return fallback;
    }
    const src = source;
    for (const key of keys) {
        const value = src[key];
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }
    return fallback;
}
function capText(value, maxLength) {
    if (value.length <= maxLength) {
        return value;
    }
    const truncated = value.slice(0, maxLength - 3).trim();
    return `${truncated}...`;
}
function summarizeAuditCounts(counts) {
    return [...counts.entries()].map(([label, count]) => `${label} x${count}`);
}
//# sourceMappingURL=workflow-accessors.js.map