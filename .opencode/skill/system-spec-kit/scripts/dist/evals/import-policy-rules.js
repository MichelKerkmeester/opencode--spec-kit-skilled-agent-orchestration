"use strict";
// ---------------------------------------------------------------
// MODULE: Import Policy Rules
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProhibitedImportPath = isProhibitedImportPath;
// ───────────────────────────────────────────────────────────────
// 1. IMPORT POLICY RULES
// ───────────────────────────────────────────────────────────────
// Shared detection rules for prohibited scripts -> internal runtime imports.
const path = __importStar(require("path"));
const PROHIBITED_PACKAGE_IMPORTS = [
    '@spec-kit/mcp-server/lib',
    '@spec-kit/mcp-server/core',
    '@spec-kit/mcp-server/handlers',
];
const RELATIVE_INTERNAL_RUNTIME_IMPORT_RE = /^\.\.(?:\/\.\.)*\/(?:mcp_server\/(?:lib|core|handlers)|shared)(?:$|\/)/;
function normalizeRelativeImportPath(importPath) {
    if (!importPath.startsWith('.')) {
        return importPath;
    }
    // Normalize Windows backslashes before POSIX normalization
    const normalizedPath = path.posix.normalize(importPath.replace(/\\/g, '/'));
    if (normalizedPath === '.') {
        return './';
    }
    if (normalizedPath === '..' || normalizedPath.startsWith('../')) {
        return normalizedPath;
    }
    return normalizedPath.startsWith('./') ? normalizedPath : `./${normalizedPath}`;
}
/**
 * Normalize package-scoped import paths that contain `..` traversal segments.
 * E.g., `@spec-kit/mcp-server/api/../lib/foo` → `@spec-kit/mcp-server/lib/foo`
 */
function normalizePackageImportPath(importPath) {
    if (importPath.startsWith('.') || !importPath.includes('..')) {
        return importPath;
    }
    // Split into segments and collapse '..' traversals
    const segments = importPath.split('/');
    const resolved = [];
    for (const segment of segments) {
        if (segment === '..' && resolved.length > 0) {
            resolved.pop();
        }
        else {
            resolved.push(segment);
        }
    }
    return resolved.join('/');
}
/** Returns whether the import path violates the evaluation policy rules. */
function isProhibitedImportPath(importPath) {
    const normalizedImportPath = normalizeRelativeImportPath(importPath);
    const normalizedPackagePath = normalizePackageImportPath(normalizedImportPath);
    return PROHIBITED_PACKAGE_IMPORTS.some((baseImport) => (normalizedPackagePath === baseImport || normalizedPackagePath.startsWith(`${baseImport}/`))) || RELATIVE_INTERNAL_RUNTIME_IMPORT_RE.test(normalizedPackagePath);
}
//# sourceMappingURL=import-policy-rules.js.map