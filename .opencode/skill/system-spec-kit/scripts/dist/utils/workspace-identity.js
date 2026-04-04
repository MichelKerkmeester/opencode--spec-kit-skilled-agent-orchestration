"use strict";
// ---------------------------------------------------------------
// MODULE: Workspace Identity
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
exports.buildWorkspaceIdentity = buildWorkspaceIdentity;
exports.getWorkspacePathVariants = getWorkspacePathVariants;
exports.isSameWorkspacePath = isSameWorkspacePath;
exports.toWorkspaceRelativePath = toWorkspaceRelativePath;
exports.findNearestOpencodeDirectory = findNearestOpencodeDirectory;
exports.normalizeAbsolutePath = normalizeAbsolutePath;
// ───────────────────────────────────────────────────────────────
// 1. WORKSPACE IDENTITY
// ───────────────────────────────────────────────────────────────
// Normalizes backend-native workspace paths to the canonical repo-local
// .opencode anchor so native session capture can match equivalent roots
// across different CLI transcript formats.
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function normalizeRequestedPath(filePath) {
    return path.resolve(filePath).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
}
function normalizeAbsolutePath(filePath) {
    const resolved = path.resolve(filePath);
    try {
        return fs.realpathSync.native(resolved).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
    }
    catch {
        const suffix = [];
        let probe = resolved;
        while (!fs.existsSync(probe)) {
            const parent = path.dirname(probe);
            if (parent === probe) {
                return resolved.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
            }
            suffix.unshift(path.basename(probe));
            probe = parent;
        }
        try {
            const canonicalBase = fs.realpathSync.native(probe);
            return path.join(canonicalBase, ...suffix).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
        }
        catch {
            return resolved.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
        }
    }
}
function safeStat(filePath) {
    try {
        return fs.statSync(filePath);
    }
    catch {
        return null;
    }
}
function findNearestOpencodeDirectoryRaw(candidatePath) {
    let current = normalizeRequestedPath(candidatePath);
    const initialStats = safeStat(current);
    if (initialStats?.isFile()) {
        current = normalizeRequestedPath(path.dirname(current));
    }
    while (true) {
        if (path.posix.basename(current) === '.opencode') {
            return current;
        }
        const nestedOpencode = path.join(current, '.opencode');
        const nestedStats = safeStat(nestedOpencode);
        if (nestedStats?.isDirectory()) {
            return normalizeRequestedPath(nestedOpencode);
        }
        const parent = normalizeRequestedPath(path.dirname(current));
        if (parent === current) {
            return null;
        }
        current = parent;
    }
}
function findNearestOpencodeDirectory(candidatePath) {
    let current = normalizeAbsolutePath(candidatePath);
    const initialStats = safeStat(current);
    if (initialStats?.isFile()) {
        current = normalizeAbsolutePath(path.dirname(current));
    }
    while (true) {
        if (path.posix.basename(current) === '.opencode') {
            return current;
        }
        const nestedOpencode = path.join(current, '.opencode');
        const nestedStats = safeStat(nestedOpencode);
        if (nestedStats?.isDirectory()) {
            return normalizeAbsolutePath(nestedOpencode);
        }
        const parent = normalizeAbsolutePath(path.dirname(current));
        if (parent === current) {
            return null;
        }
        current = parent;
    }
}
function uniquePaths(paths) {
    const seen = new Set();
    const ordered = [];
    for (const value of paths) {
        if (!value) {
            continue;
        }
        const normalized = normalizeRequestedPath(value);
        if (seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        ordered.push(normalized);
    }
    return ordered;
}
function buildWorkspaceIdentity(workspacePath) {
    const requestedPath = normalizeRequestedPath(workspacePath);
    const inputPath = normalizeAbsolutePath(workspacePath);
    const rawCanonicalOpencodePath = findNearestOpencodeDirectoryRaw(requestedPath) ?? requestedPath;
    const canonicalOpencodePath = findNearestOpencodeDirectory(inputPath) ?? inputPath;
    const rawWorkspaceRoot = path.posix.basename(rawCanonicalOpencodePath) === '.opencode'
        ? normalizeRequestedPath(path.dirname(rawCanonicalOpencodePath))
        : rawCanonicalOpencodePath;
    const workspaceRoot = path.posix.basename(canonicalOpencodePath) === '.opencode'
        ? normalizeAbsolutePath(path.dirname(canonicalOpencodePath))
        : canonicalOpencodePath;
    return {
        canonicalOpencodePath,
        workspaceRoot,
        inputPath,
        matchPaths: uniquePaths([
            canonicalOpencodePath,
            workspaceRoot,
            inputPath,
            rawCanonicalOpencodePath,
            rawWorkspaceRoot,
            requestedPath,
        ]),
    };
}
function getWorkspacePathVariants(workspacePath) {
    return buildWorkspaceIdentity(workspacePath).matchPaths;
}
function isSameWorkspacePath(workspacePath, candidatePath) {
    if (typeof candidatePath !== 'string' || candidatePath.trim().length === 0) {
        return false;
    }
    const identity = buildWorkspaceIdentity(workspacePath);
    const requestedCandidate = normalizeRequestedPath(candidatePath);
    const normalizedCandidate = normalizeAbsolutePath(candidatePath);
    if (identity.matchPaths.includes(requestedCandidate) || identity.matchPaths.includes(normalizedCandidate)) {
        return true;
    }
    const candidateIdentity = findNearestOpencodeDirectory(normalizedCandidate) ?? findNearestOpencodeDirectoryRaw(requestedCandidate);
    return candidateIdentity !== null && normalizeAbsolutePath(candidateIdentity) === identity.canonicalOpencodePath;
}
function toWorkspaceRelativePath(workspacePath, maybeFilePath) {
    if (!maybeFilePath) {
        return '';
    }
    const normalizedInput = maybeFilePath.replace(/\\/g, '/');
    if (!path.isAbsolute(maybeFilePath)) {
        if (normalizedInput.startsWith('../')) {
            return '';
        }
        return normalizedInput.replace(/^\.\//, '').replace(/\/+$/, '');
    }
    const identity = buildWorkspaceIdentity(workspacePath);
    const normalizedAbsolute = normalizeAbsolutePath(maybeFilePath);
    const normalizedRoot = identity.workspaceRoot;
    if (normalizedAbsolute !== normalizedRoot && !normalizedAbsolute.startsWith(`${normalizedRoot}/`)) {
        return '';
    }
    return path.relative(normalizedRoot, normalizedAbsolute).replace(/\\/g, '/');
}
//# sourceMappingURL=workspace-identity.js.map