"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Alignment Validator
// ───────────────────────────────────────────────────────────────
// Spec folder alignment checking and tree-thinning application
// for file change lists. Extracted from workflow.ts to reduce module size.
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
exports.resolveAlignmentTargets = resolveAlignmentTargets;
exports.matchesAlignmentTarget = matchesAlignmentTarget;
exports.pickCarrierIndex = pickCarrierIndex;
exports.compactMergedContent = compactMergedContent;
exports.applyThinningToFileChanges = applyThinningToFileChanges;
const path = __importStar(require("node:path"));
const spec_folder_extractor_1 = require("../extractors/spec-folder-extractor");
const workflow_path_utils_1 = require("./workflow-path-utils");
const workflow_accessors_1 = require("./workflow-accessors");
// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────
const PREFERRED_PARENT_FILES = new Set([
    'spec.md',
    'plan.md',
    'tasks.md',
    'checklist.md',
    'readme.md',
]);
// ───────────────────────────────────────────────────────────────
// 3. FUNCTIONS
// ───────────────────────────────────────────────────────────────
async function resolveAlignmentTargets(specFolderPath) {
    const keywordTargets = (0, workflow_path_utils_1.buildAlignmentKeywords)(specFolderPath);
    const fileTargets = new Set();
    try {
        const specContext = await (0, spec_folder_extractor_1.extractSpecFolderContext)(path.resolve(specFolderPath));
        for (const entry of specContext.FILES) {
            const normalized = (0, workflow_path_utils_1.normalizeFilePath)(entry.FILE_PATH).toLowerCase();
            if (normalized) {
                fileTargets.add(normalized);
            }
        }
    }
    catch (_error) {
        // Fall back to keyword-only alignment when spec docs are unavailable.
    }
    return {
        fileTargets: Array.from(fileTargets),
        keywordTargets,
    };
}
function matchesAlignmentTarget(filePath, alignmentTargets) {
    const normalizedPath = (0, workflow_path_utils_1.normalizeFilePath)(filePath).toLowerCase();
    if (alignmentTargets.fileTargets.some((target) => (normalizedPath === target
        || normalizedPath.endsWith(`/${target}`)
        || normalizedPath.includes(`/${target}/`)))) {
        return true;
    }
    return alignmentTargets.keywordTargets.some((keyword) => normalizedPath.includes(keyword));
}
function pickCarrierIndex(indices, files) {
    for (const idx of indices) {
        const filename = path.basename(files[idx].FILE_PATH).toLowerCase();
        if (PREFERRED_PARENT_FILES.has(filename)) {
            return idx;
        }
    }
    return indices[0];
}
function compactMergedContent(value) {
    return value
        .replace(/<!--\s*merged from:\s*([^>]+)\s*-->/gi, 'Merged from $1:')
        .replace(/\n\s*---\s*\n/g, ' | ')
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Apply tree-thinning decisions to the semantic file-change list that feeds
 * context template rendering.
 *
 * Behavior:
 * - `keep` and `content-as-summary` rows remain as individual entries.
 * - `merged-into-parent` rows are removed as standalone entries.
 * - Each merged group contributes a compact merge note to a carrier file in the
 *   same parent directory (or to a synthetic merged entry when no carrier exists).
 *
 * This makes tree thinning effective in the generated context output (instead of
 * only being computed/logged), while preserving merge provenance for recoverability.
 */
function applyThinningToFileChanges(files, thinningResult) {
    if (!Array.isArray(files) || files.length === 0) {
        return files;
    }
    const actionByPath = new Map(thinningResult.thinned.map((entry) => [(0, workflow_path_utils_1.normalizeFilePath)(entry.path), entry.action]));
    const originalByPath = new Map();
    for (const file of files) {
        originalByPath.set((0, workflow_path_utils_1.normalizeFilePath)(file.FILE_PATH), file);
    }
    const reducedFiles = files
        .filter((file) => {
        const action = actionByPath.get((0, workflow_path_utils_1.normalizeFilePath)(file.FILE_PATH)) ?? 'keep';
        return action !== 'merged-into-parent';
    })
        .map((file) => ({ ...file }));
    const indicesByParent = new Map();
    for (let i = 0; i < reducedFiles.length; i++) {
        const parent = (0, workflow_path_utils_1.getParentDirectory)(reducedFiles[i].FILE_PATH);
        const existing = indicesByParent.get(parent) ?? [];
        existing.push(i);
        indicesByParent.set(parent, existing);
    }
    for (const mergedGroup of thinningResult.merged) {
        const normalizedChildren = mergedGroup.childPaths.map(workflow_path_utils_1.normalizeFilePath);
        const childFiles = normalizedChildren
            .map((childPath) => originalByPath.get(childPath))
            .filter((f) => !!f);
        if (childFiles.length === 0) {
            continue;
        }
        const childNames = childFiles.map((f) => path.basename(f.FILE_PATH));
        const mergedContent = compactMergedContent(mergedGroup.mergedSummary);
        const mergeNote = (0, workflow_accessors_1.capText)(`Tree-thinning merged ${childFiles.length} small files (${childNames.join(', ')}). ${mergedContent}`, 900);
        const parentDir = (0, workflow_path_utils_1.normalizeFilePath)(mergedGroup.parentPath || '');
        const carrierIndices = indicesByParent.get(parentDir) ?? [];
        if (carrierIndices.length > 0) {
            const carrierIdx = pickCarrierIndex(carrierIndices, reducedFiles);
            const existingDescription = reducedFiles[carrierIdx].DESCRIPTION || '';
            const mergedDescription = existingDescription.includes(mergeNote)
                ? existingDescription
                : (existingDescription.length > 0 ? `${existingDescription} | ${mergeNote}` : mergeNote);
            reducedFiles[carrierIdx].DESCRIPTION = (0, workflow_accessors_1.capText)(mergedDescription, 900);
            continue;
        }
        const syntheticPath = parentDir.length > 0
            ? `${parentDir}/(merged-small-files)`
            : '(merged-small-files)';
        const syntheticEntry = {
            FILE_PATH: syntheticPath,
            DESCRIPTION: mergeNote,
            ACTION: 'Merged',
            _synthetic: true,
        };
        const idx = reducedFiles.push(syntheticEntry) - 1;
        const updatedIndices = indicesByParent.get(parentDir) ?? [];
        updatedIndices.push(idx);
        indicesByParent.set(parentDir, updatedIndices);
    }
    return reducedFiles;
}
//# sourceMappingURL=alignment-validator.js.map