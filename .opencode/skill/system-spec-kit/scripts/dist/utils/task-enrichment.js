"use strict";
// ---------------------------------------------------------------
// MODULE: Task Enrichment
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSpecTitleForMemory = normalizeSpecTitleForMemory;
exports.shouldEnrichTaskFromSpecTitle = shouldEnrichTaskFromSpecTitle;
exports.pickPreferredMemoryTask = pickPreferredMemoryTask;
// ───────────────────────────────────────────────────────────────
// 1. TASK ENRICHMENT
// ───────────────────────────────────────────────────────────────
// Shared helpers for memory task title enrichment decisions
const slug_utils_1 = require("./slug-utils");
function hasJsonDataFile(dataFilePath) {
    return typeof dataFilePath === 'string' && dataFilePath.trim().length > 0;
}
/** Normalizes a spec title for reuse in memory task enrichment. */
function normalizeSpecTitleForMemory(title) {
    return (0, slug_utils_1.normalizeMemoryNameCandidate)(title);
}
/** Returns whether the spec title should enrich the stored memory task. */
function shouldEnrichTaskFromSpecTitle(task, source, dataFilePath) {
    if (source === 'file' || hasJsonDataFile(dataFilePath)) {
        return false;
    }
    const normalizedTask = (0, slug_utils_1.normalizeMemoryNameCandidate)(task);
    return (0, slug_utils_1.isGenericContentTask)(normalizedTask) || (0, slug_utils_1.isContaminatedMemoryName)(normalizedTask);
}
/** Picks the preferred task label for memory storage. */
function pickPreferredMemoryTask(task, specTitle, folderBase, sessionCandidates = [], allowSpecTitleFallback = true) {
    const candidates = allowSpecTitleFallback
        ? [task, specTitle, ...sessionCandidates, folderBase]
        : [task, ...sessionCandidates, folderBase];
    return (0, slug_utils_1.pickBestContentName)(candidates)
        || (0, slug_utils_1.normalizeMemoryNameCandidate)(folderBase);
}
//# sourceMappingURL=task-enrichment.js.map