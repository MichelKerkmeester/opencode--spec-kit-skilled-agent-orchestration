"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow Path Utils
// ───────────────────────────────────────────────────────────────
// File path normalization and spec folder file listing utilities.
// Named workflow-path-utils to avoid conflicts with any existing path-utils.
// Extracted from workflow.ts to reduce module size.
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
exports.normalizeFilePath = normalizeFilePath;
exports.getParentDirectory = getParentDirectory;
exports.isWithinDirectory = isWithinDirectory;
exports.resolveTreeThinningContent = resolveTreeThinningContent;
exports.listSpecFolderKeyFiles = listSpecFolderKeyFiles;
exports.buildKeyFiles = buildKeyFiles;
exports.buildAlignmentKeywords = buildAlignmentKeywords;
const path = __importStar(require("node:path"));
const fsSync = __importStar(require("node:fs"));
const path_security_1 = require("@spec-kit/shared/utils/path-security");
// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────
function normalizeFilePath(rawPath) {
    return rawPath
        .replace(/\\/g, '/')
        .replace(/^\.\//, '')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '');
}
function getParentDirectory(filePath) {
    const normalized = normalizeFilePath(filePath);
    const idx = normalized.lastIndexOf('/');
    return idx >= 0 ? normalized.slice(0, idx) : '';
}
function isWithinDirectory(parentDir, candidatePath) {
    return (0, path_security_1.validateFilePath)(candidatePath, [parentDir]) !== null;
}
function resolveTreeThinningContent(file, specFolderPath) {
    const rawPath = typeof file.FILE_PATH === 'string' ? file.FILE_PATH.trim() : '';
    if (rawPath.length === 0) {
        return file.DESCRIPTION || '';
    }
    const candidatePath = path.isAbsolute(rawPath)
        ? rawPath
        : path.resolve(specFolderPath, rawPath);
    if (!isWithinDirectory(path.resolve(specFolderPath), path.resolve(candidatePath))) {
        return file.DESCRIPTION || '';
    }
    try {
        const stat = fsSync.statSync(candidatePath);
        if (!stat.isFile()) {
            return file.DESCRIPTION || '';
        }
        return fsSync.readFileSync(candidatePath, 'utf8').slice(0, 500) || file.DESCRIPTION || '';
    }
    catch (_error) {
        return file.DESCRIPTION || '';
    }
}
function listSpecFolderKeyFiles(specFolderPath) {
    const collected = [];
    // Rec 4: Exclude iteration directories that inflate key_files without adding retrieval value
    const ignoredDirs = new Set(['memory', 'scratch', '.git', 'node_modules', 'iterations']);
    const visit = (currentDir, relativeDir) => {
        const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isSymbolicLink()) {
                continue;
            }
            if (entry.isDirectory()) {
                if (ignoredDirs.has(entry.name)) {
                    continue;
                }
                visit(path.join(currentDir, entry.name), path.join(relativeDir, entry.name));
                continue;
            }
            if (!entry.isFile() || !/\.(?:md|json)$/i.test(entry.name)) {
                continue;
            }
            collected.push(normalizeFilePath(path.join(relativeDir, entry.name)));
        }
    };
    try {
        visit(specFolderPath, '');
    }
    catch (_error) {
        return [];
    }
    // Rec 4: Cap filesystem enumeration at 20 files sorted by name
    return collected
        .filter((f) => !f.includes('research/iterations/') && !f.includes('review/iterations/'))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 20)
        .map((filePath) => ({ FILE_PATH: filePath }));
}
function buildKeyFiles(effectiveFiles, specFolderPath) {
    const explicitKeyFiles = effectiveFiles
        .filter((file) => !file.FILE_PATH.includes('(merged-small-files)'))
        .map((file) => ({ FILE_PATH: file.FILE_PATH }));
    if (explicitKeyFiles.length > 0) {
        return explicitKeyFiles;
    }
    return listSpecFolderKeyFiles(specFolderPath);
}
function buildAlignmentKeywords(specFolderPath) {
    const ALIGNMENT_STOPWORDS = new Set(['ops', 'app', 'api', 'cli', 'lib', 'src', 'dev', 'hub', 'log', 'run']);
    const keywords = new Set();
    const normalizedSpecPath = specFolderPath
        .replace(/\\/g, '/')
        .trim();
    const rawSegments = normalizedSpecPath.split('/').filter(Boolean);
    const specLikeSegments = rawSegments.filter((segment) => /^\d{3}-/.test(segment));
    // Only use the spec folder lineage (parent/child) for alignment keywords.
    // Including arbitrary absolute path segments (e.g. temp dirs) creates false positives.
    const relevantSegments = specLikeSegments.length > 0
        ? specLikeSegments.slice(-2)
        : [path.posix.basename(normalizedSpecPath)];
    const segments = relevantSegments
        .map((segment) => segment.replace(/^\d+--?/, '').trim().toLowerCase())
        .filter(Boolean);
    for (const segment of segments) {
        if (segment.length >= 2) {
            keywords.add(segment);
        }
        for (const token of segment.split(/[-_]/)) {
            if (token.length >= 3 && !ALIGNMENT_STOPWORDS.has(token)) {
                keywords.add(token);
            }
        }
    }
    return Array.from(keywords);
}
//# sourceMappingURL=workflow-path-utils.js.map