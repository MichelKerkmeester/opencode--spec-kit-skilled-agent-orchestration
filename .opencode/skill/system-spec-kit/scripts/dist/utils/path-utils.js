"use strict";
// ---------------------------------------------------------------
// MODULE: Path Utils
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePath = sanitizePath;
exports.getPathBasename = getPathBasename;
// ───────────────────────────────────────────────────────────────
// 1. PATH UTILS
// ───────────────────────────────────────────────────────────────
// Secure path sanitization and resolution with traversal protection (CWE-22)
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
// Node stdlib
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Internal modules
const logger_1 = require("./logger");
// ───────────────────────────────────────────────────────────────
// 3. PATH SANITIZATION
// ───────────────────────────────────────────────────────────────
function sanitizePath(inputPath, allowedBases = null) {
    if (!inputPath || typeof inputPath !== 'string') {
        throw new Error('Invalid path: path must be a non-empty string');
    }
    const normalized = path_1.default.normalize(inputPath);
    // CWE-22: Check for null bytes
    if (normalized.includes('\0')) {
        (0, logger_1.structuredLog)('warn', 'Path contains null bytes', { inputPath });
        throw new Error(`Invalid path: contains null bytes: ${inputPath}`);
    }
    const resolved = path_1.default.resolve(inputPath);
    let canonicalResolved = resolved;
    try {
        canonicalResolved = fs_1.default.realpathSync(resolved);
    }
    catch (error) {
        if (error instanceof Error) {
            // Path may not exist yet. Canonicalize parent when possible.
        }
        try {
            const parentCanonical = fs_1.default.realpathSync(path_1.default.dirname(resolved));
            canonicalResolved = path_1.default.join(parentCanonical, path_1.default.basename(resolved));
        }
        catch (error) {
            if (error instanceof Error) {
                // Fall back to the unresolved path when the parent cannot be canonicalized.
            }
            canonicalResolved = resolved;
        }
    }
    const bases = allowedBases || [
        process.cwd(),
        path_1.default.join(process.cwd(), 'specs'),
        path_1.default.join(process.cwd(), '.opencode')
    ];
    const isAllowed = bases.some((base) => {
        try {
            const resolvedBase = path_1.default.resolve(base);
            let canonicalBase = resolvedBase;
            try {
                canonicalBase = fs_1.default.realpathSync(resolvedBase);
            }
            catch (error) {
                if (error instanceof Error) {
                    // Fall back to the unresolved base path when realpath fails.
                }
                canonicalBase = resolvedBase;
            }
            const relative = path_1.default.relative(canonicalBase, canonicalResolved);
            return relative === '' || (!relative.startsWith('..') && !path_1.default.isAbsolute(relative));
        }
        catch (error) {
            if (error instanceof Error) {
                return false;
            }
            return false;
        }
    });
    if (!isAllowed) {
        (0, logger_1.structuredLog)('warn', 'Path outside allowed directories', {
            inputPath,
            resolved: canonicalResolved,
            allowedBases: bases
        });
        throw new Error(`Path outside allowed directories: ${inputPath}`);
    }
    return canonicalResolved;
}
// ───────────────────────────────────────────────────────────────
// 4. UTILITIES
// ───────────────────────────────────────────────────────────────
function getPathBasename(p) {
    if (!p || typeof p !== 'string')
        return '';
    return p.replace(/\\/g, '/').split('/').pop() || '';
}
//# sourceMappingURL=path-utils.js.map