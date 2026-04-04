"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: File Extractor
// ───────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectObservationType = detectObservationType;
exports.extractFilesFromData = extractFilesFromData;
exports.enhanceFilesWithSemanticDescriptions = enhanceFilesWithSemanticDescriptions;
exports.buildObservationsWithAnchors = buildObservationsWithAnchors;
exports.deduplicateObservations = deduplicateObservations;
// ───────────────────────────────────────────────────────────────
// 1. FILE EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts file references, descriptions, and observation types from session data
const config_1 = require("../config");
const fact_coercion_1 = require("../utils/fact-coercion");
const file_helpers_1 = require("../utils/file-helpers");
const path_utils_1 = require("../utils/path-utils");
const anchor_generator_1 = require("../lib/anchor-generator");
const ACTION_MAP = {
    created: 'Created',
    modified: 'Modified',
    deleted: 'Deleted',
    read: 'Read',
    renamed: 'Renamed',
    add: 'Created',
    added: 'Created',
    modify: 'Modified',
    delete: 'Deleted',
    rename: 'Renamed',
};
function normalizeFileAction(action) {
    return ACTION_MAP[action.toLowerCase()] || 'Modified';
}
/* ───────────────────────────────────────────────────────────────
   2. OBSERVATION TYPE DETECTION
------------------------------------------------------------------*/
function detectObservationType(obs) {
    if (obs.type && obs.type !== 'observation')
        return obs.type;
    const text = ((obs.title || '') + ' ' + (obs.narrative || '')).toLowerCase();
    const facts = (0, fact_coercion_1.coerceFactsToText)(obs.facts).join(' ').toLowerCase();
    const combined = text + ' ' + facts;
    if (/\b(fix(?:ed|es|ing)?|bug|error|issue|broken|patch)\b/.test(combined))
        return 'bugfix';
    if (/\b(implement(?:ed|s|ing)?|add(?:ed|s|ing)?|creat(?:ed|es|ing)?|new feature|feature)\b/.test(combined))
        return 'feature';
    if (/\b(refactor(?:ed|s|ing)?|clean(?:ed|s|ing)?|restructur(?:ed|es|ing)?|reorganiz(?:ed|es|ing)?)\b/.test(combined))
        return 'refactor';
    if (/\b(decid(?:ed|es|ing)?|chose|select(?:ed|s|ing)?|option|alternative)\b/.test(combined))
        return 'decision';
    if (/\b(research(?:ed|ing)?|investigat(?:ed|es|ing)?|explor(?:ed|es|ing)?|analyz(?:ed|es|ing)?)\b/.test(combined))
        return 'research';
    if (/\b(test(?:ed|ing|s)?|spec(?:s)?|vitest|jest|assert(?:ed|ion|ions)?|coverage|pass(?:ed|es|ing)?|fail(?:ed|ing|s)?)\b/.test(combined))
        return 'test';
    if (/\b(docs?|readme|guide|markdown|template|commentary|document(?:ed|ing|ation)?)\b/.test(combined))
        return 'documentation';
    if (/\b(perf|performance|benchmark|latency|throughput|optimi[sz](?:e|ed|ing|ation))\b/.test(combined))
        return 'performance';
    if (/\b(discover(?:ed|s|ing)?|found|learn(?:ed|s|ing)?|realiz(?:ed|es|ing)?)\b/.test(combined))
        return 'discovery';
    return 'observation';
}
/* ───────────────────────────────────────────────────────────────
   3. FILE EXTRACTION
------------------------------------------------------------------*/
function extractFilesFromData(collectedData, observations) {
    const ACTION_NORMALIZE = {
        add: 'Created',
        modify: 'Modified',
        delete: 'Deleted',
        rename: 'Renamed',
        created: 'Created',
        modified: 'Modified',
        deleted: 'Deleted',
        renamed: 'Renamed',
        read: 'Read',
    };
    const filesMap = new Map();
    const sourcePathToKey = new Map();
    if (!collectedData)
        collectedData = {};
    if (!observations)
        observations = [];
    const addFile = (rawPath, description, action, provenance, synthetic, modificationMagnitude) => {
        const normalized = (0, file_helpers_1.toRelativePath)(rawPath, config_1.CONFIG.PROJECT_ROOT);
        if (!normalized)
            return;
        const canonicalSourcePath = (0, file_helpers_1.toCanonicalRelativePath)(rawPath, config_1.CONFIG.PROJECT_ROOT);
        if (!canonicalSourcePath)
            return;
        // F-20: Use full canonical source path as map key to prevent truncation-based collisions
        let mapKey = sourcePathToKey.get(canonicalSourcePath) ?? canonicalSourcePath;
        if (!sourcePathToKey.has(canonicalSourcePath) && filesMap.has(canonicalSourcePath)) {
            let suffix = 2;
            while (filesMap.has(`${canonicalSourcePath}-${suffix}`)) {
                suffix++;
            }
            mapKey = `${canonicalSourcePath}-${suffix}`;
            console.warn(`Warning: Disambiguating colliding path '${canonicalSourcePath}' as '${mapKey}'`);
        }
        sourcePathToKey.set(canonicalSourcePath, mapKey);
        const existing = filesMap.get(mapKey);
        const cleaned = (0, file_helpers_1.cleanDescription)(description);
        const cleanedTierRank = (0, file_helpers_1.getDescriptionTierRank)((0, file_helpers_1.validateDescription)(cleaned).tier);
        const nextProvenance = provenance ?? existing?._provenance;
        const nextSynthetic = synthetic ?? existing?._synthetic;
        const nextMagnitude = modificationMagnitude && modificationMagnitude !== 'unknown'
            ? modificationMagnitude
            : (existing?.MODIFICATION_MAGNITUDE ?? modificationMagnitude ?? 'unknown');
        if (existing) {
            // Merge: always prefer a more specific action when the existing one is generic
            const mergedAction = action || existing.action;
            const mergedProvenance = nextProvenance || existing._provenance;
            const mergedSynthetic = nextSynthetic ?? existing._synthetic;
            const existingTierRank = (0, file_helpers_1.getDescriptionTierRank)((0, file_helpers_1.validateDescription)(existing.description).tier);
            if (cleanedTierRank > existingTierRank
                || (cleanedTierRank === existingTierRank && cleaned.length > existing.description.length)) {
                // Better description available — use it, and merge action/provenance
                filesMap.set(mapKey, {
                    description: cleaned,
                    action: mergedAction,
                    MODIFICATION_MAGNITUDE: nextMagnitude,
                    ...(mergedProvenance ? { _provenance: mergedProvenance } : {}),
                    ...(mergedSynthetic !== undefined ? { _synthetic: mergedSynthetic } : {}),
                });
            }
            else {
                // Keep existing description, but still merge action and provenance if newer
                const needsUpdate = (action && action !== existing.action)
                    || nextMagnitude !== existing.MODIFICATION_MAGNITUDE
                    || (mergedProvenance && mergedProvenance !== existing._provenance)
                    || (mergedSynthetic !== existing._synthetic);
                if (needsUpdate) {
                    filesMap.set(mapKey, {
                        ...existing,
                        action: mergedAction,
                        MODIFICATION_MAGNITUDE: nextMagnitude,
                        ...(mergedProvenance ? { _provenance: mergedProvenance } : {}),
                        ...(mergedSynthetic !== undefined ? { _synthetic: mergedSynthetic } : {}),
                    });
                }
            }
        }
        else {
            filesMap.set(mapKey, {
                description: cleaned || 'Modified during session',
                action,
                MODIFICATION_MAGNITUDE: nextMagnitude,
                ...(nextProvenance ? { _provenance: nextProvenance } : {}),
                ...(nextSynthetic !== undefined ? { _synthetic: nextSynthetic } : {}),
            });
        }
    };
    // Source 1: FILES array (primary input format)
    if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
        for (const fileInfo of collectedData.FILES) {
            const filePath = fileInfo.FILE_PATH || fileInfo.path;
            const description = fileInfo.DESCRIPTION || fileInfo.description || 'Modified during session';
            const action = fileInfo.ACTION ?? fileInfo.action;
            const normalizedAction = action ? (ACTION_NORMALIZE[action.toLowerCase()] ?? action) : undefined;
            const modificationMagnitude = fileInfo.MODIFICATION_MAGNITUDE;
            if (filePath) {
                addFile(filePath, description, normalizedAction, fileInfo._provenance, fileInfo._synthetic, modificationMagnitude);
            }
        }
    }
    // Source 2: files_modified array (legacy format)
    // F-16: Always pass 'Modified' action for filesModified entries
    if (collectedData.filesModified && Array.isArray(collectedData.filesModified)) {
        for (const fileInfo of collectedData.filesModified) {
            addFile(fileInfo.path, fileInfo.changes_summary || 'Modified during session', 'Modified');
        }
    }
    // Source 3: observations
    for (const obs of observations) {
        if (obs.files) {
            for (const file of obs.files) {
                addFile(file, 'Modified during session');
            }
        }
        if (obs.facts) {
            for (const fact of obs.facts) {
                if (typeof fact === 'object' && fact !== null && 'files' in fact) {
                    const factObj = fact;
                    if (factObj.files && Array.isArray(factObj.files)) {
                        for (const file of factObj.files) {
                            addFile(file, 'Modified during session');
                        }
                    }
                }
            }
        }
    }
    const filesEntries = Array.from(filesMap.entries());
    const withValidDesc = filesEntries.filter(([, data]) => (0, file_helpers_1.isDescriptionValid)(data.description));
    const withFallback = filesEntries.filter(([, data]) => !(0, file_helpers_1.isDescriptionValid)(data.description));
    const allFiles = [...withValidDesc, ...withFallback];
    if (allFiles.length > config_1.CONFIG.MAX_FILES_IN_MEMORY) {
        console.warn(`Warning: Truncating files list from ${allFiles.length} to ${config_1.CONFIG.MAX_FILES_IN_MEMORY}`);
    }
    return allFiles
        .slice(0, config_1.CONFIG.MAX_FILES_IN_MEMORY)
        .map(([filePath, data]) => ({
        FILE_PATH: filePath,
        DESCRIPTION: data.description,
        ...(data.action ? { ACTION: data.action } : {}),
        MODIFICATION_MAGNITUDE: data.MODIFICATION_MAGNITUDE,
        ...(data._provenance ? { _provenance: data._provenance } : {}),
        ...(data._synthetic !== undefined ? { _synthetic: data._synthetic } : {}),
    }));
}
/* ───────────────────────────────────────────────────────────────
   4. SEMANTIC DESCRIPTION ENHANCEMENT
------------------------------------------------------------------*/
function enhanceFilesWithSemanticDescriptions(files, semanticFileChanges) {
    return files.map((file) => {
        const filePath = file.FILE_PATH;
        const fileBasename = (0, path_utils_1.getPathBasename)(filePath);
        // Priority 1: Exact full path match
        if (semanticFileChanges.has(filePath)) {
            const info = semanticFileChanges.get(filePath);
            // F-19: Only overwrite ACTION when existing is missing or generic 'Modified'
            const preserveAction = file.ACTION && file.ACTION !== 'Modified';
            return {
                ...file,
                DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
                ACTION: preserveAction ? file.ACTION : normalizeFileAction(info.action)
            };
        }
        // Priority 2: Basename match only if unique
        let matchCount = 0;
        let basenameMatch = null;
        for (const [matchPath, info] of semanticFileChanges) {
            const pathBasename = (0, path_utils_1.getPathBasename)(matchPath);
            if (pathBasename === fileBasename) {
                matchCount++;
                basenameMatch = { path: matchPath, info };
            }
        }
        if (matchCount > 1) {
            console.warn(`   Warning: Multiple files with basename '${fileBasename}' - using default description`);
        }
        if (matchCount === 1 && basenameMatch) {
            const info = basenameMatch.info;
            // F-19: Preserve specific actions (Created/Deleted/Renamed/Read)
            const preserveAction = file.ACTION && file.ACTION !== 'Modified';
            return {
                ...file,
                DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
                ACTION: preserveAction ? file.ACTION : normalizeFileAction(info.action)
            };
        }
        return file;
    });
}
/* ───────────────────────────────────────────────────────────────
   5. OBSERVATION ANCHORING
------------------------------------------------------------------*/
function buildObservationsWithAnchors(observations, specFolder) {
    const usedAnchorIds = [];
    const specNumber = (0, anchor_generator_1.extractSpecNumber)(specFolder);
    // Deduplicate observations: merge repeated tool calls on the same file
    const deduped = deduplicateObservations(observations || []);
    return deduped
        .filter((obs) => obs != null)
        .map((obs) => {
        const coercedFacts = (0, fact_coercion_1.coerceFactsToText)(obs.facts, {
            component: 'file-extractor',
            fieldPath: 'observations[].facts',
        });
        const category = (0, anchor_generator_1.categorizeSection)(obs.title || 'Observation', obs.narrative || '');
        let anchorId = (0, anchor_generator_1.generateAnchorId)(obs.title || 'Observation', category, specNumber);
        anchorId = (0, anchor_generator_1.validateAnchorUniqueness)(anchorId, usedAnchorIds);
        usedAnchorIds.push(anchorId);
        const obsType = detectObservationType(obs);
        return {
            TYPE: obsType.toUpperCase(),
            TITLE: obs.title || 'Observation',
            NARRATIVE: obs.narrative || '',
            HAS_FILES: !!(obs.files && obs.files.length > 0),
            FILES_LIST: obs.files ? obs.files.join(', ') : '',
            HAS_FACTS: coercedFacts.length > 0,
            FACTS_LIST: coercedFacts.join(' | '),
            ANCHOR_ID: anchorId,
            IS_DECISION: obsType === 'decision'
        };
    });
}
/**
 * Deduplicate observations that represent repeated tool calls on the same file.
 * Merges consecutive observations with identical titles into a single entry with
 * a count annotation and combined facts.
 */
function deduplicateObservations(observations) {
    if (observations.length <= 1)
        return observations;
    const result = [];
    const mergeTracker = new Map();
    for (const obs of observations) {
        const title = (obs.title || '').trim();
        // Skip empty titles
        if (!title) {
            result.push(obs);
            continue;
        }
        // Create a dedup key from normalized title + file list
        const filesKey = (obs.files || []).sort().join('|');
        const dedupKey = `${title.toLowerCase()}::${filesKey}`;
        const existing = mergeTracker.get(dedupKey);
        if (existing) {
            // Merge: increment count, combine unique facts
            existing.count++;
            if (obs.facts) {
                const existingFacts = existing.obs.facts || [];
                const existingFactStrings = new Set(existingFacts.map((fact) => (0, fact_coercion_1.coerceFactToText)(fact).text));
                for (const fact of obs.facts) {
                    const factStr = (0, fact_coercion_1.coerceFactToText)(fact).text;
                    if (factStr && !existingFactStrings.has(factStr)) {
                        existingFacts.push(fact);
                        existingFactStrings.add(factStr);
                    }
                }
                existing.obs.facts = existingFacts;
            }
            // Update narrative with count
            if (existing.count === 2) {
                existing.obs.narrative = `${existing.obs.narrative || title} (repeated ${existing.count} times)`;
            }
            else {
                existing.obs.narrative = (existing.obs.narrative || title).replace(/\(repeated \d+ times\)/, `(repeated ${existing.count} times)`);
            }
        }
        else {
            // Deep copy nested arrays to prevent mutation of the original observations
            const obsCopy = { ...obs, facts: obs.facts ? [...obs.facts] : undefined, files: obs.files ? [...obs.files] : undefined };
            mergeTracker.set(dedupKey, { obs: obsCopy, count: 1, index: result.length });
            result.push(obsCopy);
        }
    }
    return result;
}
//# sourceMappingURL=file-extractor.js.map