// ────────────────────────────────────────────────────────────────
// MODULE: Cognitive Configuration
// ────────────────────────────────────────────────────────────────
import { z } from 'zod';
const DEFAULT_COACTIVATION_PATTERN = '\\b(memory|context|decision|implementation|bug)\\b';
const DEFAULT_COACTIVATION_FLAGS = 'i';
const MAX_PATTERN_LENGTH = 256;
const VALID_REGEX_FLAGS = /^[dgimsuvy]*$/;
function ensurePatternSafety(pattern) {
    if (pattern.length === 0) {
        throw new Error('[cognitive-config] Empty regex pattern is not allowed');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new Error(`[cognitive-config] Regex pattern exceeds max length (${MAX_PATTERN_LENGTH})`);
    }
    if (/\([^)]*[+*][^)]*\)[+*{?]/.test(pattern)) {
        throw new Error('[cognitive-config] Unsafe regex rejected: nested quantifier group detected');
    }
    if (/\\[1-9]/.test(pattern)) {
        throw new Error('[cognitive-config] Unsafe regex rejected: backreferences are not allowed');
    }
}
const envSchema = z.object({
    SPECKIT_COGNITIVE_COACTIVATION_PATTERN: z.string().trim().default(DEFAULT_COACTIVATION_PATTERN),
    SPECKIT_COGNITIVE_COACTIVATION_FLAGS: z
        .string()
        .trim()
        .default(DEFAULT_COACTIVATION_FLAGS)
        .refine((flags) => VALID_REGEX_FLAGS.test(flags), {
        message: '[cognitive-config] Invalid regex flags',
    }),
});
function toParseError(field, message) {
    return { field, message };
}
export function loadCognitiveConfigFromEnv(env = process.env) {
    const parsed = safeParseCognitiveConfigFromEnv(env);
    if (!parsed.success || !parsed.data) {
        const errorText = parsed.errors.map((error) => `${error.field}: ${error.message}`).join('; ');
        throw new Error(`[cognitive-config] Validation failed: ${errorText}`);
    }
    return parsed.data;
}
export function safeParseCognitiveConfigFromEnv(env = process.env) {
    const schemaResult = envSchema.safeParse(env);
    if (!schemaResult.success) {
        const errors = schemaResult.error.issues.map((issue) => {
            const field = issue.path[0] === 'SPECKIT_COGNITIVE_COACTIVATION_FLAGS'
                ? 'SPECKIT_COGNITIVE_COACTIVATION_FLAGS'
                : 'SPECKIT_COGNITIVE_COACTIVATION_PATTERN';
            return toParseError(field, issue.message);
        });
        return { success: false, errors };
    }
    const source = schemaResult.data.SPECKIT_COGNITIVE_COACTIVATION_PATTERN;
    const flags = schemaResult.data.SPECKIT_COGNITIVE_COACTIVATION_FLAGS;
    const errors = [];
    try {
        ensurePatternSafety(source);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(toParseError('SPECKIT_COGNITIVE_COACTIVATION_PATTERN', message));
    }
    let compiled = null;
    try {
        compiled = new RegExp(source, flags);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push(toParseError('SPECKIT_COGNITIVE_COACTIVATION_PATTERN', `[cognitive-config] Invalid regex pattern: ${message}`));
    }
    if (errors.length > 0 || compiled === null) {
        return { success: false, errors };
    }
    return {
        success: true,
        data: {
            coActivationPattern: compiled,
            coActivationPatternSource: source,
            coActivationPatternFlags: flags,
        },
        errors: [],
    };
}
export const COGNITIVE_CONFIG = loadCognitiveConfigFromEnv(process.env);
//# sourceMappingURL=cognitive.js.map