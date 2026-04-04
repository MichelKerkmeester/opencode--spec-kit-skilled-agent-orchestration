"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Title Builder
// ───────────────────────────────────────────────────────────────
// Memory title construction and normalization utilities.
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
exports.normalizeMemoryTitleCandidate = normalizeMemoryTitleCandidate;
exports.truncateMemoryTitle = truncateMemoryTitle;
exports.slugToTitle = slugToTitle;
exports.buildMemoryTitle = buildMemoryTitle;
exports.buildMemoryDashboardTitle = buildMemoryDashboardTitle;
exports.extractSpecTitle = extractSpecTitle;
const path = __importStar(require("node:path"));
const fsSync = __importStar(require("node:fs"));
const slug_utils_1 = require("../utils/slug-utils");
const task_enrichment_1 = require("../utils/task-enrichment");
// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────
function normalizeMemoryTitleCandidate(raw) {
    return raw
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[\s\-:;,]+$/, '');
}
function truncateMemoryTitle(title, maxLength = 110) {
    if (title.length <= maxLength) {
        return title;
    }
    const truncated = title.slice(0, maxLength).trim();
    const lastSpace = truncated.lastIndexOf(' ');
    const wordBoundary = lastSpace > 0 ? truncated.slice(0, lastSpace).trim() : truncated;
    return `${wordBoundary}...`;
}
function slugToTitle(slug) {
    return slug
        .replace(/(?<=\d)-(?=\d)/g, '\x00') // protect digit-digit hyphens (dates like 2026-03-13)
        .replace(/-/g, ' ')
        .replace(/\x00/g, '-') // restore digit-digit hyphens
        .replace(/\s{2,}/g, ' ') // collapse consecutive spaces
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
function buildMemoryTitle(_implementationTask, _specFolderName, _date, contentSlug) {
    if (contentSlug && contentSlug.length > 0) {
        return truncateMemoryTitle(slugToTitle(contentSlug));
    }
    // Fallback (should not happen -- contentSlug is always available at call site)
    const preferredTitle = (0, slug_utils_1.pickBestContentName)([_implementationTask]);
    if (preferredTitle.length > 0) {
        return truncateMemoryTitle(normalizeMemoryTitleCandidate(preferredTitle));
    }
    const folderLeaf = _specFolderName.split('/').filter(Boolean).pop() || _specFolderName;
    const readableFolder = normalizeMemoryTitleCandidate(folderLeaf.replace(/^\d+-/, '').replace(/-/g, ' '));
    const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
    return truncateMemoryTitle(fallback);
}
function buildMemoryDashboardTitle(memoryTitle, specFolderName, contextFilename) {
    const specLeaf = specFolderName.split('/').filter(Boolean).pop() || specFolderName;
    const fileStem = path.basename(contextFilename, path.extname(contextFilename));
    const suffix = `[${specLeaf}/${fileStem}]`;
    if (memoryTitle.endsWith(suffix)) {
        return memoryTitle;
    }
    const maxLength = 120;
    const maxBaseLength = Math.max(24, maxLength - suffix.length - 1);
    let base = memoryTitle.trim();
    if (base.length > maxBaseLength) {
        const hardCut = base.slice(0, maxBaseLength).trim();
        const lastSpace = hardCut.lastIndexOf(' ');
        if (lastSpace >= Math.floor(maxBaseLength * 0.6)) {
            base = hardCut.slice(0, lastSpace);
        }
        else {
            base = hardCut;
        }
    }
    return `${base} ${suffix}`;
}
function extractSpecTitle(specFolderPath) {
    try {
        const specPath = path.join(specFolderPath, 'spec.md');
        const content = fsSync.readFileSync(specPath, 'utf-8');
        const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (!fmMatch)
            return '';
        const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
        if (!titleMatch || !titleMatch[1])
            return '';
        return (0, task_enrichment_1.normalizeSpecTitleForMemory)(titleMatch[1]);
    }
    catch (_error) {
        if (_error instanceof Error) {
            void _error.message;
        }
        return '';
    }
}
//# sourceMappingURL=title-builder.js.map