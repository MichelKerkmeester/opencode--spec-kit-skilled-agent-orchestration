"use strict";
// ---------------------------------------------------------------
// MODULE: Data Validator
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRESENCE_FLAG_MAPPINGS = exports.ARRAY_FLAG_MAPPINGS = void 0;
exports.ensureArrayOfObjects = ensureArrayOfObjects;
exports.hasArrayContent = hasArrayContent;
exports.validateDataStructure = validateDataStructure;
// ───────────────────────────────────────────────────────────────
// 3. CONFIGURATION
// ───────────────────────────────────────────────────────────────
const ARRAY_FLAG_MAPPINGS = {
    CODE_BLOCKS: 'HAS_CODE_BLOCKS',
    NOTES: 'HAS_NOTES',
    RELATED_FILES: 'HAS_RELATED_FILES',
    CAVEATS: 'HAS_CAVEATS',
    FOLLOWUP: 'HAS_FOLLOWUP',
    OPTIONS: 'HAS_OPTIONS',
    EVIDENCE: 'HAS_EVIDENCE',
    PHASES: 'HAS_PHASES',
    MESSAGES: 'HAS_MESSAGES'
};
exports.ARRAY_FLAG_MAPPINGS = ARRAY_FLAG_MAPPINGS;
const PRESENCE_FLAG_MAPPINGS = {
    DESCRIPTION: 'HAS_DESCRIPTION',
    RESULT_PREVIEW: 'HAS_RESULT',
    DECISION_TREE: 'HAS_DECISION_TREE'
};
exports.PRESENCE_FLAG_MAPPINGS = PRESENCE_FLAG_MAPPINGS;
// ───────────────────────────────────────────────────────────────
// 4. UTILITIES
// ───────────────────────────────────────────────────────────────
function ensureArrayOfObjects(value, objectKey) {
    if (!value)
        return [];
    if (!Array.isArray(value)) {
        return [{ [objectKey]: String(value) }];
    }
    if (value.length > 0 && typeof value[0] === 'string') {
        return value.map((item) => ({ [objectKey]: item }));
    }
    return value;
}
function hasArrayContent(value) {
    return Array.isArray(value) && value.length > 0;
}
// ───────────────────────────────────────────────────────────────
// 5. VALIDATION
// ───────────────────────────────────────────────────────────────
function validateDataStructure(data) {
    const validated = { ...data };
    for (const [field, flagField] of Object.entries(ARRAY_FLAG_MAPPINGS)) {
        validated[flagField] = hasArrayContent(validated[field]);
    }
    for (const [field, flagField] of Object.entries(PRESENCE_FLAG_MAPPINGS)) {
        if (validated[field]) {
            validated[flagField] = true;
        }
    }
    if (validated.PROS !== undefined) {
        validated.PROS = ensureArrayOfObjects(validated.PROS, 'PRO');
    }
    if (validated.CONS !== undefined) {
        validated.CONS = ensureArrayOfObjects(validated.CONS, 'CON');
    }
    validated.HAS_PROS_CONS = hasArrayContent(validated.PROS) || hasArrayContent(validated.CONS);
    for (const key in validated) {
        if (Array.isArray(validated[key])) {
            validated[key] = validated[key].map((item) => {
                if (typeof item === 'object' && item !== null) {
                    return validateDataStructure(item);
                }
                return item;
            });
        }
    }
    return validated;
}
//# sourceMappingURL=data-validator.js.map