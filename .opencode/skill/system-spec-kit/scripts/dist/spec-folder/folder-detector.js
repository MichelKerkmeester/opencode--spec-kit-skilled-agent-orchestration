"use strict";
// ---------------------------------------------------------------
// MODULE: Folder Detector
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_HELPERS = exports.ALIGNMENT_CONFIG = void 0;
exports.detectSpecFolder = detectSpecFolder;
exports.filterArchiveFolders = filterArchiveFolders;
// ───────────────────────────────────────────────────────────────
// 1. FOLDER DETECTOR
// ───────────────────────────────────────────────────────────────
// Detects, lists, and resolves spec folders with interactive selection and alignment scoring
// Node stdlib
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
const node_child_process_1 = require("node:child_process");
// External packages
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// Internal modules
const paths_1 = require("@spec-kit/shared/paths");
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const prompt_utils_1 = require("../utils/prompt-utils");
const core_1 = require("../core");
const alignment_validator_1 = require("./alignment-validator");
Object.defineProperty(exports, "ALIGNMENT_CONFIG", { enumerable: true, get: function () { return alignment_validator_1.ALIGNMENT_CONFIG; } });
const session_activity_signal_1 = require("../lib/session-activity-signal");
function getSpecFolderFromCollectedData(collectedData) {
    if (!collectedData || typeof collectedData !== 'object') {
        return null;
    }
    const specFolder = collectedData.SPEC_FOLDER;
    return typeof specFolder === 'string' && specFolder.trim().length > 0
        ? specFolder
        : null;
}
function getSpecFolderFromSessionRow(row) {
    if (!row || typeof row !== 'object') {
        return null;
    }
    const specFolder = row.spec_folder;
    return typeof specFolder === 'string' && specFolder.trim().length > 0
        ? specFolder
        : null;
}
/* ───────────────────────────────────────────────────────────────
   2. HELPER FUNCTIONS
------------------------------------------------------------------*/
const TEST_FIXTURE_MARKERS = ['test', 'tests', 'fixture', 'fixtures'];
const SCRATCH_MARKERS = ['scratch', 'tmp', 'temp'];
const SESSION_LOOKBACK_HOURS = 24;
const SESSION_ROW_LIMIT = 25;
const LOW_CONFIDENCE_RECENCY_WINDOW_MS = 10 * 60 * 1000;
const RECENT_CHILD_WINDOW_MS = SESSION_LOOKBACK_HOURS * 60 * 60 * 1000;
function filterArchiveFolders(folders) {
    return folders.filter((folder) => !(0, alignment_validator_1.isArchiveFolder)(folder));
}
function isInteractiveTTY() {
    return Boolean(process.stdout.isTTY && process.stdin.isTTY && process.env.AUTO_SAVE_MODE !== 'true');
}
function normalizeSlashes(value) {
    return value.replace(/\\/g, '/');
}
function splitPathSegments(value) {
    return normalizeSlashes(value).split('/').filter(Boolean);
}
function parseTimestamp(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return 0;
    }
    const raw = value.trim();
    const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
    const withZone = /[zZ]$|[+\-]\d{2}:\d{2}$/.test(normalized) ? normalized : `${normalized}Z`;
    const parsed = Date.parse(withZone);
    return Number.isFinite(parsed) ? parsed : 0;
}
function getSessionTimestamp(row) {
    return parseTimestamp(row.created_at) || parseTimestamp(row.updated_at);
}
function isPathWithin(parentPath, childPath) {
    return (0, path_security_1.validateFilePath)(childPath, [parentPath]) !== null;
}
function isNotFoundFsError(error) {
    const nodeErr = error;
    return nodeErr?.code === 'ENOENT' || nodeErr?.code === 'ENOTDIR';
}
function isUnderApprovedSpecsRoots(specPath) {
    const approvedRoots = [
        path.join(core_1.CONFIG.PROJECT_ROOT, 'specs'),
        path.join(core_1.CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
    ];
    return (0, path_security_1.validateFilePath)(specPath, approvedRoots) !== null;
}
function normalizeSpecReferenceForLookup(specFolderRef) {
    const normalized = normalizeSlashes(specFolderRef.trim()).replace(/^\.\//, '');
    if (normalized.startsWith('.opencode/specs/')) {
        return normalized.slice('.opencode/specs/'.length);
    }
    if (normalized.startsWith('specs/')) {
        return normalized.slice('specs/'.length);
    }
    return normalized;
}
function getRelativePathToSpecsRoot(specPath, specsDirs) {
    for (const specsDir of specsDirs) {
        if (!isPathWithin(specsDir, specPath))
            continue;
        const relative = normalizeSlashes(path.relative(specsDir, specPath));
        if (relative.length > 0 && !relative.startsWith('..')) {
            return relative;
        }
    }
    return null;
}
function getCanonicalSpecKey(specPath, specsDirs) {
    const relative = getRelativePathToSpecsRoot(specPath, specsDirs);
    return relative || path.resolve(specPath);
}
function getRootPreferenceIndex(specPath, specsDirs) {
    for (let index = 0; index < specsDirs.length; index += 1) {
        if (isPathWithin(specsDirs[index], specPath)) {
            return index;
        }
    }
    return Number.MAX_SAFE_INTEGER;
}
function shouldPreferPath(currentPath, candidatePath, specsDirs) {
    const currentIndex = getRootPreferenceIndex(currentPath, specsDirs);
    const candidateIndex = getRootPreferenceIndex(candidatePath, specsDirs);
    if (candidateIndex !== currentIndex) {
        return candidateIndex < currentIndex;
    }
    return path.resolve(candidatePath).localeCompare(path.resolve(currentPath)) < 0;
}
function getPathTokens(relativePath) {
    return splitPathSegments(relativePath)
        .flatMap((segment) => segment.toLowerCase().split(/[^a-z0-9]+/))
        .filter(Boolean);
}
function assessFolderQuality(relativePath) {
    const segments = splitPathSegments(relativePath);
    const tokens = getPathTokens(relativePath);
    const archiveHit = segments.some((segment) => (0, alignment_validator_1.isArchiveFolder)(segment));
    const testFixtureHit = TEST_FIXTURE_MARKERS.some((marker) => tokens.includes(marker));
    const scratchHit = SCRATCH_MARKERS.some((marker) => tokens.includes(marker));
    let score = 100;
    const reasons = [];
    if (archiveHit) {
        score -= 90;
        reasons.push('archive');
    }
    if (testFixtureHit) {
        score -= 45;
        reasons.push('test/fixture');
    }
    if (scratchHit) {
        score -= 30;
        reasons.push('scratch');
    }
    const clampedScore = Math.max(0, score);
    const label = archiveHit ? 'archive'
        : testFixtureHit ? 'test-fixture'
            : scratchHit ? 'scratch'
                : 'active';
    return {
        score: clampedScore,
        label,
        reasons,
        isArchive: archiveHit,
        isTestFixture: testFixtureHit,
        isScratch: scratchHit,
    };
}
function parseFolderIdVector(relativePath) {
    return splitPathSegments(relativePath).map((segment) => {
        const match = segment.match(/^(\d{3})-/);
        return match ? Number.parseInt(match[1], 10) : -1;
    });
}
function compareIdVectorsDesc(a, b) {
    const maxLength = Math.max(a.length, b.length);
    for (let index = 0; index < maxLength; index += 1) {
        const aValue = a[index] ?? -1;
        const bValue = b[index] ?? -1;
        if (aValue !== bValue) {
            return bValue - aValue;
        }
    }
    return 0;
}
function pickPreferredCandidates(candidates) {
    const active = candidates.filter((candidate) => !candidate.quality.isArchive &&
        !candidate.quality.isTestFixture &&
        !candidate.quality.isScratch);
    if (active.length > 0) {
        return active;
    }
    const nonArchiveNonFixture = candidates.filter((candidate) => !candidate.quality.isArchive &&
        !candidate.quality.isTestFixture);
    if (nonArchiveNonFixture.length > 0) {
        return nonArchiveNonFixture;
    }
    const nonArchive = candidates.filter((candidate) => !candidate.quality.isArchive);
    if (nonArchive.length > 0) {
        return nonArchive;
    }
    return candidates;
}
function compareSessionCandidates(a, b) {
    if (a.quality.score !== b.quality.score) {
        return b.quality.score - a.quality.score;
    }
    if (a.recencyMs !== b.recencyMs) {
        return b.recencyMs - a.recencyMs;
    }
    return a.canonicalKey.localeCompare(b.canonicalKey);
}
function rankSessionCandidates(candidates) {
    return [...pickPreferredCandidates(candidates)].sort(compareSessionCandidates);
}
function assessSessionConfidence(candidates) {
    if (candidates.length === 0) {
        return { lowConfidence: true, reason: 'no candidates resolved from session learning rows' };
    }
    const top = candidates[0];
    if (top.quality.label !== 'active') {
        return { lowConfidence: true, reason: `top candidate quality is "${top.quality.label}"` };
    }
    if (candidates.length === 1) {
        return { lowConfidence: false, reason: 'single active candidate' };
    }
    const second = candidates[1];
    const qualityGap = top.quality.score - second.quality.score;
    const recencyGapMs = Math.abs(top.recencyMs - second.recencyMs);
    if (qualityGap <= 0 && recencyGapMs <= LOW_CONFIDENCE_RECENCY_WINDOW_MS) {
        return { lowConfidence: true, reason: 'top candidates tie on quality with near-identical recency' };
    }
    if (qualityGap < 10 && recencyGapMs <= LOW_CONFIDENCE_RECENCY_WINDOW_MS) {
        return { lowConfidence: true, reason: 'top candidates have a narrow score gap' };
    }
    return { lowConfidence: false, reason: 'clear ranked winner' };
}
function getCandidateParentRelativePath(relativePath) {
    const segments = splitPathSegments(relativePath);
    if (segments.length <= 1) {
        return null;
    }
    return segments.slice(0, -1).join('/');
}
function cloneAutoDetectCandidate(candidate) {
    return {
        ...candidate,
        idVector: [...candidate.idVector],
    };
}
function applyParentAffinityBoost(candidates) {
    const now = Date.now();
    const clones = candidates.map(cloneAutoDetectCandidate);
    for (const candidate of clones) {
        const childCandidates = clones.filter((other) => (getCandidateParentRelativePath(other.relativePath) === candidate.relativePath
            && now - other.mtimeMs <= RECENT_CHILD_WINDOW_MS));
        candidate.recentlyActiveChildCount = childCandidates.length;
        if (childCandidates.length > 3) {
            candidate.effectiveDepth = Math.max(candidate.depth, ...childCandidates.map((child) => child.depth));
        }
    }
    return clones;
}
function parseGitStatusPath(rawPath) {
    const trimmed = rawPath.trim();
    if (trimmed.length === 0) {
        return null;
    }
    const renamed = trimmed.includes(' -> ')
        ? trimmed.split(' -> ').pop() || trimmed
        : trimmed;
    return normalizeSlashes(renamed.replace(/^"+|"+$/g, '').trim()) || null;
}
function collectGitStatusPaths(specsDirs) {
    try {
        const output = (0, node_child_process_1.execFileSync)('git', ['status', '--porcelain', '--untracked-files=all'], {
            cwd: core_1.CONFIG.PROJECT_ROOT,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        });
        const paths = new Set();
        for (const line of output.split(/\r?\n/)) {
            if (line.length < 4) {
                continue;
            }
            const parsed = parseGitStatusPath(line.slice(3));
            if (!parsed) {
                continue;
            }
            const resolved = path.resolve(core_1.CONFIG.PROJECT_ROOT, parsed);
            if (!specsDirs.some((specsDir) => isPathWithin(specsDir, resolved))) {
                continue;
            }
            paths.add(resolved);
        }
        return [...paths];
    }
    catch (error) {
        if (process.env.DEBUG && error instanceof Error) {
            console.debug(`   [Priority 2.7] git status lookup skipped: ${error.message}`);
        }
        return [];
    }
}
function annotateAutoDetectCandidates(candidates, specsDirs, collectedData) {
    const gitStatusPaths = collectGitStatusPaths(specsDirs);
    const boostedCandidates = applyParentAffinityBoost(candidates);
    return boostedCandidates.map((candidate) => {
        const gitStatusCount = gitStatusPaths.filter((changedPath) => isPathWithin(candidate.path, changedPath)).length;
        const sessionActivity = (0, session_activity_signal_1.buildSessionActivitySignal)(collectedData, candidate.relativePath);
        return {
            ...candidate,
            gitStatusCount,
            sessionActivityBoost: sessionActivity.confidenceBoost,
            sessionActivitySignalCount: sessionActivity.toolCallPaths.length
                + sessionActivity.gitChangedFiles.length
                + sessionActivity.transcriptMentions.length,
        };
    });
}
function compareGitStatusCandidates(a, b) {
    if (a.gitStatusCount !== b.gitStatusCount) {
        return b.gitStatusCount - a.gitStatusCount;
    }
    return compareAutoDetectCandidates(a, b);
}
function rankGitStatusCandidates(candidates) {
    return [...pickPreferredCandidates(candidates.filter((candidate) => candidate.gitStatusCount > 0))]
        .sort(compareGitStatusCandidates);
}
function assessGitStatusConfidence(candidates) {
    if (candidates.length === 0) {
        return { lowConfidence: true, reason: 'no git-status candidates matched spec paths' };
    }
    if (candidates.length === 1) {
        return { lowConfidence: false, reason: 'single git-status candidate' };
    }
    const top = candidates[0];
    const second = candidates[1];
    if (top.gitStatusCount === second.gitStatusCount) {
        return { lowConfidence: true, reason: 'top git-status candidates tie on changed file count' };
    }
    return { lowConfidence: false, reason: 'clear git-status winner' };
}
function compareSessionActivityCandidates(a, b) {
    if (a.sessionActivityBoost !== b.sessionActivityBoost) {
        return b.sessionActivityBoost - a.sessionActivityBoost;
    }
    if (a.sessionActivitySignalCount !== b.sessionActivitySignalCount) {
        return b.sessionActivitySignalCount - a.sessionActivitySignalCount;
    }
    return compareAutoDetectCandidates(a, b);
}
function rankSessionActivityCandidates(candidates) {
    return [...pickPreferredCandidates(candidates.filter((candidate) => candidate.sessionActivityBoost > 0))]
        .sort(compareSessionActivityCandidates);
}
function assessSessionActivityConfidence(candidates) {
    if (candidates.length === 0) {
        return { lowConfidence: true, reason: 'no session activity matched candidate folders' };
    }
    if (candidates.length === 1) {
        return { lowConfidence: false, reason: 'single session-activity candidate' };
    }
    const top = candidates[0];
    const second = candidates[1];
    if (top.sessionActivityBoost === second.sessionActivityBoost
        && top.sessionActivitySignalCount === second.sessionActivitySignalCount) {
        return { lowConfidence: true, reason: 'top session-activity candidates tie on boost and signal count' };
    }
    return { lowConfidence: false, reason: 'clear session-activity winner' };
}
function compareAutoDetectCandidates(a, b) {
    if (a.quality.score !== b.quality.score) {
        return b.quality.score - a.quality.score;
    }
    if (a.gitStatusCount !== b.gitStatusCount) {
        return b.gitStatusCount - a.gitStatusCount;
    }
    if (a.sessionActivityBoost !== b.sessionActivityBoost) {
        return b.sessionActivityBoost - a.sessionActivityBoost;
    }
    if (a.effectiveDepth !== b.effectiveDepth) {
        return b.effectiveDepth - a.effectiveDepth;
    }
    if (a.recentlyActiveChildCount !== b.recentlyActiveChildCount) {
        return b.recentlyActiveChildCount - a.recentlyActiveChildCount;
    }
    const idCompare = compareIdVectorsDesc(a.idVector, b.idVector);
    if (idCompare !== 0) {
        return idCompare;
    }
    if (a.mtimeMs !== b.mtimeMs) {
        return b.mtimeMs - a.mtimeMs;
    }
    return a.canonicalKey.localeCompare(b.canonicalKey);
}
function rankAutoDetectCandidates(candidates) {
    return [...pickPreferredCandidates(candidates)].sort(compareAutoDetectCandidates);
}
function assessAutoDetectConfidence(candidates) {
    if (candidates.length === 0) {
        return { lowConfidence: true, reason: 'no auto-detect candidates available' };
    }
    const top = candidates[0];
    if (top.quality.label !== 'active') {
        return { lowConfidence: true, reason: `top auto-detect candidate quality is "${top.quality.label}"` };
    }
    if (candidates.length < 2) {
        return { lowConfidence: false, reason: 'single active auto-detect candidate' };
    }
    const second = candidates[1];
    const sameQuality = top.quality.score === second.quality.score;
    const sameGitStatus = top.gitStatusCount === second.gitStatusCount;
    const sameActivity = top.sessionActivityBoost === second.sessionActivityBoost;
    const sameDepth = top.effectiveDepth === second.effectiveDepth;
    const sameChildActivity = top.recentlyActiveChildCount === second.recentlyActiveChildCount;
    const sameIdVector = compareIdVectorsDesc(top.idVector, second.idVector) === 0;
    if (sameQuality && sameGitStatus && sameActivity && sameDepth && sameChildActivity && sameIdVector) {
        return { lowConfidence: true, reason: 'top auto-detect candidates tie except for recency/path tiebreakers' };
    }
    return { lowConfidence: false, reason: 'clear ranked winner' };
}
function formatCandidatePathForLog(candidatePath, specsDirs) {
    for (const specsDir of specsDirs) {
        if (!isPathWithin(specsDir, candidatePath))
            continue;
        const rootRelative = normalizeSlashes(path.relative(core_1.CONFIG.PROJECT_ROOT, specsDir));
        const folderRelative = normalizeSlashes(path.relative(specsDir, candidatePath));
        if (!folderRelative.startsWith('..')) {
            return `${rootRelative}/${folderRelative}`;
        }
    }
    return normalizeSlashes(path.relative(core_1.CONFIG.PROJECT_ROOT, candidatePath));
}
function logSelectionRationale(priorityLabel, candidatePath, specsDirs, quality, reason) {
    console.log(`   [${priorityLabel}] Selected ${formatCandidatePathForLog(candidatePath, specsDirs)} | quality=${quality.label} | ${reason}`);
}
async function pathIsDirectory(candidatePath) {
    try {
        const stat = await fs.stat(candidatePath);
        return stat.isDirectory();
    }
    catch (_error) {
        if (_error instanceof Error) {
            return false;
        }
        return false;
    }
}
async function collectSpecParentCache(specsDirs) {
    const parentCache = new Map();
    for (const specsDir of specsDirs) {
        try {
            const entries = await fs.readdir(specsDir);
            const parentFolders = new Set();
            for (const entry of entries) {
                const entryPath = path.join(specsDir, entry);
                if (!(await pathIsDirectory(entryPath)))
                    continue;
                if (core_1.SPEC_FOLDER_PATTERN.test(entry)) {
                    parentFolders.add(entry);
                    continue;
                }
                if (!/^\d{2}--[a-z][a-z0-9-]*$/.test(entry))
                    continue;
                const categoryEntries = await fs.readdir(entryPath);
                for (const categoryChild of categoryEntries) {
                    if (!core_1.SPEC_FOLDER_PATTERN.test(categoryChild))
                        continue;
                    const categoryChildPath = path.join(entryPath, categoryChild);
                    if (await pathIsDirectory(categoryChildPath)) {
                        parentFolders.add(normalizeSlashes(path.join(entry, categoryChild)));
                    }
                }
            }
            parentCache.set(specsDir, Array.from(parentFolders));
        }
        catch (_error) {
            if (_error instanceof Error) {
                parentCache.set(specsDir, []);
                continue;
            }
            parentCache.set(specsDir, []);
        }
    }
    return parentCache;
}
async function resolveSessionSpecFolderPaths(rawSpecFolder, specsDirs, parentCache) {
    const resolvedPaths = new Set();
    const trimmed = rawSpecFolder.trim();
    if (trimmed.length === 0) {
        return [];
    }
    const addCandidate = async (candidatePath) => {
        const resolved = path.resolve(candidatePath);
        const withinSpecsRoot = specsDirs.some((specsDir) => isPathWithin(specsDir, resolved));
        if (!withinSpecsRoot) {
            throw new Error('Path escapes specs root');
        }
        if (await pathIsDirectory(resolved)) {
            resolvedPaths.add(resolved);
        }
    };
    if (path.isAbsolute(trimmed)) {
        const resolvedSpecFolder = path.resolve(trimmed);
        const approvedRoot = specsDirs.find((specsDir) => isPathWithin(specsDir, resolvedSpecFolder));
        if (!approvedRoot) {
            console.warn(`Skipping session_learning spec_folder outside specs roots: ${resolvedSpecFolder}`);
        }
        else {
            await addCandidate(resolvedSpecFolder);
            const relativeToSpecs = getRelativePathToSpecsRoot(resolvedSpecFolder, specsDirs);
            if (relativeToSpecs) {
                for (const specsDir of specsDirs) {
                    await addCandidate(path.join(specsDir, relativeToSpecs));
                }
            }
        }
    }
    const normalizedReference = normalizeSpecReferenceForLookup(trimmed);
    if (normalizedReference.length === 0) {
        return Array.from(resolvedPaths);
    }
    const segments = splitPathSegments(normalizedReference);
    if (segments.length === 0) {
        return Array.from(resolvedPaths);
    }
    if (segments.length === 1 && core_1.SPEC_FOLDER_PATTERN.test(segments[0])) {
        const childName = segments[0];
        for (const specsDir of specsDirs) {
            await addCandidate(path.join(specsDir, childName));
        }
        for (const specsDir of specsDirs) {
            const parents = parentCache.get(specsDir) || [];
            for (const parentFolder of parents) {
                await addCandidate(path.join(specsDir, parentFolder, childName));
            }
        }
        return Array.from(resolvedPaths);
    }
    if (segments.length >= 2 &&
        core_1.SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
        for (const specsDir of specsDirs) {
            await addCandidate(path.join(specsDir, ...segments));
        }
        return Array.from(resolvedPaths);
    }
    for (const specsDir of specsDirs) {
        await addCandidate(path.join(specsDir, normalizedReference));
    }
    return Array.from(resolvedPaths);
}
async function buildSessionCandidates(rows, specsDirs) {
    const parentCache = await collectSpecParentCache(specsDirs);
    const byCanonicalKey = new Map();
    for (const row of rows) {
        const specFolder = getSpecFolderFromSessionRow(row);
        if (!specFolder)
            continue;
        const trimmedSpecFolder = specFolder.trim();
        // Fix F6 — validate session-learning paths against approved roots.
        if (path.isAbsolute(trimmedSpecFolder)) {
            const resolvedAbsoluteSpecFolder = path.resolve(trimmedSpecFolder);
            if (!isUnderApprovedSpecsRoots(resolvedAbsoluteSpecFolder)) {
                console.warn(`[folder-detector] Skipping session-learning row with unapproved absolute spec_folder: ${resolvedAbsoluteSpecFolder}`);
                continue;
            }
        }
        const recencyMs = getSessionTimestamp(row);
        const recencyIso = recencyMs > 0 ? new Date(recencyMs).toISOString() : 'unknown';
        const resolvedPaths = await resolveSessionSpecFolderPaths(trimmedSpecFolder, specsDirs, parentCache);
        for (const resolvedPath of resolvedPaths) {
            const canonicalKey = getCanonicalSpecKey(resolvedPath, specsDirs);
            const qualityPath = getRelativePathToSpecsRoot(resolvedPath, specsDirs) || path.basename(resolvedPath);
            const quality = assessFolderQuality(qualityPath);
            const existing = byCanonicalKey.get(canonicalKey);
            if (!existing) {
                byCanonicalKey.set(canonicalKey, {
                    path: resolvedPath,
                    canonicalKey,
                    quality,
                    recencyMs,
                    recencyIso,
                    sourceSpecFolder: specFolder,
                });
                continue;
            }
            if (shouldPreferPath(existing.path, resolvedPath, specsDirs)) {
                existing.path = resolvedPath;
            }
            if (recencyMs > existing.recencyMs) {
                existing.recencyMs = recencyMs;
                existing.recencyIso = recencyIso;
                existing.sourceSpecFolder = specFolder;
            }
        }
    }
    return Array.from(byCanonicalKey.values());
}
async function promptSessionCandidateSelection(rankedCandidates, specsDirs, reason) {
    const shortlist = rankedCandidates.slice(0, Math.min(3, rankedCandidates.length));
    console.log(`   [Priority 2.5] Low-confidence session match: ${reason}`);
    shortlist.forEach((candidate, index) => {
        const display = formatCandidatePathForLog(candidate.path, specsDirs);
        console.log(`   ${index + 1}. ${display} (quality=${candidate.quality.label}, recency=${candidate.recencyIso})`);
    });
    console.log(`   ${shortlist.length + 1}. Skip session-learning selection and continue\n`);
    const choice = await (0, prompt_utils_1.promptUserChoice)(`   Select target folder (1-${shortlist.length + 1}): `, shortlist.length + 1);
    if (choice <= shortlist.length) {
        return shortlist[choice - 1];
    }
    return null;
}
async function collectAutoDetectCandidates(specsDirs) {
    const byCanonicalKey = new Map();
    const upsertCandidate = (folderPath, mtimeMs) => {
        const canonicalKey = getCanonicalSpecKey(folderPath, specsDirs);
        const relativePath = getRelativePathToSpecsRoot(folderPath, specsDirs) || path.basename(folderPath);
        const quality = assessFolderQuality(relativePath);
        const candidate = {
            path: folderPath,
            canonicalKey,
            relativePath,
            folderName: path.basename(folderPath),
            quality,
            depth: splitPathSegments(relativePath).length,
            effectiveDepth: splitPathSegments(relativePath).length,
            idVector: parseFolderIdVector(relativePath),
            mtimeMs,
            gitStatusCount: 0,
            sessionActivityBoost: 0,
            sessionActivitySignalCount: 0,
            recentlyActiveChildCount: 0,
        };
        const existing = byCanonicalKey.get(canonicalKey);
        if (!existing) {
            byCanonicalKey.set(canonicalKey, candidate);
            return;
        }
        if (mtimeMs > existing.mtimeMs) {
            existing.mtimeMs = mtimeMs;
        }
        if (shouldPreferPath(existing.path, folderPath, specsDirs)) {
            existing.path = folderPath;
        }
    };
    for (const specsDir of specsDirs) {
        let topEntries = [];
        try {
            topEntries = await fs.readdir(specsDir);
        }
        catch (_error) {
            if (_error instanceof Error) {
                continue;
            }
            continue;
        }
        for (const topFolder of topEntries) {
            const topPath = path.join(specsDir, topFolder);
            let topStat;
            try {
                topStat = await fs.stat(topPath);
            }
            catch (_error) {
                if (_error instanceof Error) {
                    continue;
                }
                continue;
            }
            if (!topStat.isDirectory())
                continue;
            if (/^\d{2}--[a-z][a-z0-9-]*$/.test(topFolder)) {
                let categoryEntries = [];
                try {
                    categoryEntries = await fs.readdir(topPath);
                }
                catch (_error) {
                    if (_error instanceof Error) {
                        void _error.message;
                    }
                    continue;
                }
                for (const parentFolder of categoryEntries) {
                    if (!core_1.SPEC_FOLDER_PATTERN.test(parentFolder))
                        continue;
                    const parentPath = path.join(topPath, parentFolder);
                    try {
                        const parentStat = await fs.stat(parentPath);
                        if (!parentStat.isDirectory())
                            continue;
                        upsertCandidate(parentPath, parentStat.mtimeMs);
                        let childEntries = [];
                        try {
                            childEntries = await fs.readdir(parentPath);
                        }
                        catch (_error) {
                            if (_error instanceof Error) {
                                void _error.message;
                            }
                            continue;
                        }
                        for (const childFolder of childEntries) {
                            if (!core_1.SPEC_FOLDER_PATTERN.test(childFolder))
                                continue;
                            const childPath = path.join(parentPath, childFolder);
                            try {
                                const childStat = await fs.stat(childPath);
                                if (childStat.isDirectory()) {
                                    upsertCandidate(childPath, childStat.mtimeMs);
                                }
                            }
                            catch (_error) {
                                if (_error instanceof Error) {
                                    void _error.message;
                                }
                            }
                        }
                    }
                    catch (_error) {
                        if (_error instanceof Error) {
                            void _error.message;
                        }
                    }
                }
                continue;
            }
            if (!core_1.SPEC_FOLDER_PATTERN.test(topFolder))
                continue;
            upsertCandidate(topPath, topStat.mtimeMs);
            let childEntries = [];
            try {
                childEntries = await fs.readdir(topPath);
            }
            catch (_error) {
                if (_error instanceof Error) {
                    void _error.message;
                }
                continue;
            }
            for (const childFolder of childEntries) {
                if (!core_1.SPEC_FOLDER_PATTERN.test(childFolder))
                    continue;
                const childPath = path.join(topPath, childFolder);
                try {
                    const childStat = await fs.stat(childPath);
                    if (childStat.isDirectory()) {
                        upsertCandidate(childPath, childStat.mtimeMs);
                    }
                }
                catch (_error) {
                    if (_error instanceof Error) {
                        // Unreadable child, skip and continue scanning.
                    }
                }
            }
        }
    }
    return Array.from(byCanonicalKey.values());
}
async function promptAutoDetectCandidateSelection(rankedCandidates, specsDirs, reason) {
    const shortlist = rankedCandidates.slice(0, Math.min(5, rankedCandidates.length));
    console.log(`   [Priority 4] Low-confidence auto-detect: ${reason}`);
    shortlist.forEach((candidate, index) => {
        const display = formatCandidatePathForLog(candidate.path, specsDirs);
        console.log(`   ${index + 1}. ${display} (quality=${candidate.quality.label}, depth=${candidate.depth})`);
    });
    console.log('');
    const choice = await (0, prompt_utils_1.promptUserChoice)(`   Confirm target folder (1-${shortlist.length}): `, shortlist.length);
    return shortlist[choice - 1];
}
function buildSessionCandidatesForTesting(inputs) {
    return inputs.map((input, index) => {
        const relative = normalizeSpecReferenceForLookup(input.path);
        return {
            path: input.path,
            canonicalKey: input.canonicalKey || `candidate-${index}`,
            quality: assessFolderQuality(relative),
            recencyMs: input.recencyMs,
            recencyIso: input.recencyMs > 0 ? new Date(input.recencyMs).toISOString() : 'unknown',
            sourceSpecFolder: input.path,
        };
    });
}
function buildAutoCandidatesForTesting(inputs) {
    return inputs.map((input, index) => {
        const relativePath = input.relativePath || normalizeSpecReferenceForLookup(input.path);
        return {
            path: input.path,
            canonicalKey: input.canonicalKey || `candidate-${index}`,
            relativePath,
            folderName: path.basename(relativePath),
            quality: assessFolderQuality(relativePath),
            depth: splitPathSegments(relativePath).length,
            effectiveDepth: input.effectiveDepth ?? splitPathSegments(relativePath).length,
            idVector: parseFolderIdVector(relativePath),
            mtimeMs: input.mtimeMs,
            gitStatusCount: input.gitStatusCount ?? 0,
            sessionActivityBoost: input.sessionActivityBoost ?? 0,
            sessionActivitySignalCount: input.sessionActivitySignalCount ?? 0,
            recentlyActiveChildCount: input.recentlyActiveChildCount ?? 0,
        };
    });
}
const TEST_HELPERS = {
    normalizeSpecReferenceForLookup,
    assessFolderQuality,
    isPathWithin,
    isUnderApprovedSpecsRoots,
    resolveSessionSpecFolderPaths: async (rawSpecFolder, specsDirs) => {
        const parentCache = await collectSpecParentCache(specsDirs);
        return resolveSessionSpecFolderPaths(rawSpecFolder, specsDirs, parentCache);
    },
    collectAutoDetectCandidates,
    rankSessionCandidates: (inputs) => rankSessionCandidates(buildSessionCandidatesForTesting(inputs)),
    rankAutoDetectCandidates: (inputs) => rankAutoDetectCandidates(buildAutoCandidatesForTesting(inputs)),
    rankGitStatusCandidates: (inputs) => rankGitStatusCandidates(buildAutoCandidatesForTesting(inputs)),
    rankSessionActivityCandidates: (inputs) => rankSessionActivityCandidates(buildAutoCandidatesForTesting(inputs)),
    assessSessionConfidence: (inputs) => assessSessionConfidence(rankSessionCandidates(buildSessionCandidatesForTesting(inputs))),
    assessAutoDetectConfidence: (inputs) => assessAutoDetectConfidence(rankAutoDetectCandidates(buildAutoCandidatesForTesting(inputs))),
    assessGitStatusConfidence: (inputs) => assessGitStatusConfidence(rankGitStatusCandidates(buildAutoCandidatesForTesting(inputs))),
    assessSessionActivityConfidence: (inputs) => assessSessionActivityConfidence(rankSessionActivityCandidates(buildAutoCandidatesForTesting(inputs))),
    decideSessionAction: (inputs, interactive) => {
        const ranked = rankSessionCandidates(buildSessionCandidatesForTesting(inputs));
        const confidence = assessSessionConfidence(ranked);
        if (!confidence.lowConfidence) {
            return { action: 'select', reason: confidence.reason };
        }
        return { action: interactive ? 'confirm' : 'skip', reason: confidence.reason };
    },
    decideAutoDetectAction: (inputs, interactive) => {
        const ranked = rankAutoDetectCandidates(buildAutoCandidatesForTesting(inputs));
        const confidence = assessAutoDetectConfidence(ranked);
        if (!confidence.lowConfidence) {
            return { action: 'select', reason: confidence.reason };
        }
        return { action: interactive ? 'confirm' : 'fallback', reason: confidence.reason };
    },
};
exports.TEST_HELPERS = TEST_HELPERS;
/** Print the standard "no spec folder found" error message. */
function printNoSpecFolderError(commandName = 'memory') {
    console.error('\n Cannot save context: No spec folder found\n');
    console.error(`${commandName} requires a spec folder to save memory documentation.`);
    console.error('Every conversation with file changes must have a spec folder per conversation-documentation rules.\n');
    console.error('Please create a spec folder first:');
    console.error('  mkdir -p specs/###-feature-name/');
    console.error('  OR: mkdir -p .opencode/specs/###-feature-name/\n');
    console.error(`Then re-run ${commandName}.\n`);
}
/* ───────────────────────────────────────────────────────────────
   3. FOLDER DETECTION
------------------------------------------------------------------*/
async function detectSpecFolder(collectedData = null, options = {}) {
    const cwd = process.cwd();
    const explicitSpecFolderArg = options.specFolderArg !== undefined
        ? options.specFolderArg
        : core_1.CONFIG.SPEC_FOLDER_ARG;
    const existingSpecsDirs = (0, core_1.getAllExistingSpecsDirs)();
    const specsDirsForDetection = existingSpecsDirs.length > 0 ? existingSpecsDirs : [];
    if (existingSpecsDirs.length > 1) {
        console.log('   Multiple specs directories found; deterministic ranking will evaluate aliases across all roots.');
    }
    const specsDir = (0, core_1.findActiveSpecsDir)();
    const defaultSpecsDir = path.join(core_1.CONFIG.PROJECT_ROOT, 'specs');
    // Priority 1: CLI argument
    if (explicitSpecFolderArg) {
        const specArg = explicitSpecFolderArg;
        const specFolderPath = path.isAbsolute(specArg)
            ? specArg
            : specArg.startsWith('specs/')
                ? path.join(core_1.CONFIG.PROJECT_ROOT, specArg)
                : specArg.startsWith('.opencode/specs/')
                    ? path.join(core_1.CONFIG.PROJECT_ROOT, specArg)
                    : path.join(specsDir || defaultSpecsDir, specArg);
        try {
            if (!isUnderApprovedSpecsRoots(specFolderPath)) {
                throw new Error(`Spec folder path must be under specs/ or .opencode/specs/: ${specArg}`);
            }
            await fs.access(specFolderPath);
            console.log(`   Using spec folder from CLI argument: ${path.basename(specFolderPath)}`);
            if (collectedData) {
                const activeSpecsDir = specsDir || defaultSpecsDir;
                // Pass relative path from specs root (multi-segment) instead of just basename
                // so alignment validator can extract topics from all path segments.
                // Use path.sep boundary check to avoid matching specs-archive/ against specs/.
                const specsDirWithSep = activeSpecsDir.endsWith(path.sep) ? activeSpecsDir : activeSpecsDir + path.sep;
                const folderRelPath = specFolderPath.startsWith(specsDirWithSep)
                    ? path.relative(activeSpecsDir, specFolderPath)
                    : path.basename(specFolderPath);
                const alignmentResult = await (0, alignment_validator_1.validateContentAlignment)(collectedData, folderRelPath, activeSpecsDir);
                if (alignmentResult.useAlternative && alignmentResult.selectedFolder) {
                    console.log(`   ALIGNMENT_BYPASSED (CLI-explicit): "${alignmentResult.selectedFolder}" may be a better match, but respecting explicit CLI argument`);
                }
            }
            return specFolderPath;
        }
        catch (error) {
            if (!isNotFoundFsError(error)) {
                // Before re-throwing non-ENOENT errors (e.g., isUnderApprovedSpecsRoots rejection),
                // try resolving via basename extraction when the arg contains a specs prefix path.
                // This handles full paths like ".opencode/specs/02--cat/022-parent/003-child" where
                // the prefix resolution produces a valid absolute path that fails root validation
                // due to category-prefixed intermediate segments.
                const baseName = path.basename(specArg);
                if (core_1.SPEC_FOLDER_PATTERN.test(baseName)) {
                    const childResult = await (0, core_1.findChildFolderAsync)(baseName);
                    if (childResult) {
                        console.log(`   Resolved from full path "${specArg}" via child search: ${path.basename(childResult)}`);
                        return childResult;
                    }
                }
                throw error;
            }
            // Try nested multi-segment resolution (e.g., "005-memory/002-upgrade" or "02--cat/022-parent/008-child")
            const argParts = specArg.split('/');
            if (argParts.length >= 2 && core_1.SPEC_FOLDER_PATTERN.test(argParts[argParts.length - 1])) {
                for (const dir of existingSpecsDirs) {
                    const nestedPath = path.join(dir, ...argParts);
                    try {
                        await fs.access(nestedPath);
                        console.log(`   Using spec folder from CLI argument (nested): ${argParts.join('/')}`);
                        return nestedPath;
                    }
                    catch (_error) {
                        if (_error instanceof Error) {
                            // Not found in this specs dir, continue searching
                        }
                    }
                }
            }
            // Bare child search across all parents
            const childResult = await (0, core_1.findChildFolderAsync)(specArg);
            if (childResult) {
                return childResult;
            }
            // When specArg is a multi-segment path (e.g., "022-parent/010-child/003-sub") and
            // findChildFolderAsync failed (it only matches single-segment names), try extracting
            // the basename for child resolution.
            if (argParts.length >= 2) {
                const baseName = path.basename(specArg);
                if (core_1.SPEC_FOLDER_PATTERN.test(baseName)) {
                    const baseChildResult = await (0, core_1.findChildFolderAsync)(baseName);
                    if (baseChildResult) {
                        console.log(`   Resolved from multi-segment path "${specArg}" via child search: ${path.basename(baseChildResult)}`);
                        return baseChildResult;
                    }
                }
            }
            console.error(`\n Specified spec folder not found: ${explicitSpecFolderArg}\n`);
            console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');
            try {
                const searchDir = specsDir || defaultSpecsDir;
                const entries = await fs.readdir(searchDir);
                const available = entries
                    .filter((name) => /^\d{3}-/.test(name))
                    .filter((name) => !(0, alignment_validator_1.isArchiveFolder)(name))
                    .sort()
                    .reverse();
                if (available.length > 0) {
                    console.error('Available spec folders:');
                    available.slice(0, 10).forEach((folder) => {
                        console.error(`  - ${folder}`);
                    });
                }
            }
            catch (_error) {
                if (_error instanceof Error) {
                    // Silently ignore if we can't read specs directory
                }
            }
            console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
            throw new Error(`Spec folder not found: ${explicitSpecFolderArg}`);
        }
    }
    // Priority 2: JSON data field
    const specFolderFromData = getSpecFolderFromCollectedData(collectedData);
    if (specFolderFromData && collectedData) {
        const activeDir = specsDir || defaultSpecsDir;
        const specFolderPath = path.isAbsolute(specFolderFromData)
            ? specFolderFromData
            : specFolderFromData.startsWith('specs/')
                ? path.join(core_1.CONFIG.PROJECT_ROOT, specFolderFromData)
                : specFolderFromData.startsWith('.opencode/specs/')
                    ? path.join(core_1.CONFIG.PROJECT_ROOT, specFolderFromData)
                    : path.join(activeDir, specFolderFromData);
        const alignmentFolderName = path.basename(specFolderPath);
        const alignmentBaseDir = path.dirname(specFolderPath);
        try {
            if (!isUnderApprovedSpecsRoots(specFolderPath)) {
                throw new Error(`Spec folder path must be under specs/ or .opencode/specs/: ${specFolderFromData}`);
            }
            await fs.access(specFolderPath);
            console.log(`   Using spec folder from data: ${specFolderFromData}`);
            const alignmentResult = await (0, alignment_validator_1.validateFolderAlignment)(collectedData, alignmentFolderName, alignmentBaseDir);
            if (alignmentResult.proceed) {
                if (alignmentResult.useAlternative) {
                    if (!alignmentResult.selectedFolder) {
                        throw new Error('Expected selectedFolder to be set when useAlternative is true');
                    }
                    return path.join(alignmentBaseDir, alignmentResult.selectedFolder);
                }
                return specFolderPath;
            }
        }
        catch (error) {
            if (!isNotFoundFsError(error)) {
                throw error;
            }
            // Try nested multi-segment resolution for JSON data value
            const dataParts = specFolderFromData.split('/');
            if (dataParts.length >= 2 && core_1.SPEC_FOLDER_PATTERN.test(dataParts[dataParts.length - 1])) {
                for (const dir of existingSpecsDirs) {
                    const nestedPath = path.join(dir, ...dataParts);
                    try {
                        await fs.access(nestedPath);
                        console.log(`   Using spec folder from data (nested): ${dataParts.join('/')}`);
                        if (collectedData) {
                            const lastPart = dataParts[dataParts.length - 1];
                            const parentDir = path.join(dir, ...dataParts.slice(0, -1));
                            const alignmentResult = await (0, alignment_validator_1.validateFolderAlignment)(collectedData, lastPart, parentDir);
                            if (alignmentResult.proceed && alignmentResult.useAlternative && alignmentResult.selectedFolder) {
                                const altPath = path.join(parentDir, alignmentResult.selectedFolder);
                                try {
                                    await fs.access(altPath);
                                    return altPath;
                                }
                                catch (_error) {
                                    if (_error instanceof Error) {
                                        // Alternative not found as nested, use original
                                    }
                                }
                            }
                        }
                        return nestedPath;
                    }
                    catch (nestedError) {
                        if (nestedError instanceof Error) {
                            void nestedError.message;
                        }
                        if (!isNotFoundFsError(nestedError)) {
                            throw nestedError;
                        }
                        // Not found in this specs dir, continue searching
                    }
                }
            }
            // Bare child search across all parents
            const childResult = await (0, core_1.findChildFolderAsync)(specFolderFromData);
            if (childResult) {
                return childResult;
            }
            console.warn(`   Spec folder from data not found: ${specFolderFromData}`);
        }
    }
    // Priority 2.5: Session learning DB lookup (most recent preflight spec folder)
    try {
        const db = new better_sqlite3_1.default(paths_1.DB_PATH, { readonly: true });
        try {
            const rows = db.prepare(`SELECT spec_folder, created_at, updated_at
         FROM session_learning
         WHERE created_at > datetime('now', '-' || ? || ' hours')
         ORDER BY created_at DESC
         LIMIT ?`).all(SESSION_LOOKBACK_HOURS, SESSION_ROW_LIMIT);
            const sessionCandidates = await buildSessionCandidates(rows, specsDirsForDetection);
            const rankedSessionCandidates = rankSessionCandidates(sessionCandidates);
            if (rankedSessionCandidates.length > 0) {
                const confidence = assessSessionConfidence(rankedSessionCandidates);
                let selected = rankedSessionCandidates[0];
                if (confidence.lowConfidence) {
                    if (isInteractiveTTY()) {
                        const confirmed = await promptSessionCandidateSelection(rankedSessionCandidates, specsDirsForDetection, confidence.reason);
                        if (confirmed) {
                            selected = confirmed;
                        }
                        else {
                            console.log('   [Priority 2.5] Session-learning selection skipped by user; falling through.');
                            selected = null;
                        }
                    }
                    else {
                        console.warn(`   [Priority 2.5] Low-confidence session match (${confidence.reason}); falling through.`);
                        selected = null;
                    }
                }
                if (selected) {
                    logSelectionRationale('Priority 2.5', selected.path, specsDirsForDetection, selected.quality, `source=session_learning, recency=${selected.recencyIso}, reason=${confidence.reason}`);
                    return selected.path;
                }
            }
        }
        finally {
            db.close();
        }
    }
    catch (err) {
        if (err instanceof Error && process.env.DEBUG) {
            console.debug(`   [Priority 2.5] Session learning lookup skipped: ${err.message}`);
        }
        // DB not available, table missing, or folder doesn't exist — fall through to next priority
        if (process.env.DEBUG && !(err instanceof Error)) {
            console.debug(`   [Priority 2.5] Session learning lookup skipped: ${String(err)}`);
        }
    }
    const autoDetectSpecsDirs = specsDirsForDetection.length > 0
        ? specsDirsForDetection
        : (specsDir ? [specsDir] : []);
    let cachedAutoDetectCandidates = null;
    const loadAutoDetectCandidates = async () => {
        if (cachedAutoDetectCandidates) {
            return cachedAutoDetectCandidates;
        }
        const discoveredCandidates = await collectAutoDetectCandidates(autoDetectSpecsDirs);
        cachedAutoDetectCandidates = annotateAutoDetectCandidates(discoveredCandidates, autoDetectSpecsDirs, collectedData);
        return cachedAutoDetectCandidates;
    };
    // Priority 2.7: Git-status signal for spec paths
    if (autoDetectSpecsDirs.length > 0) {
        const gitStatusCandidates = rankGitStatusCandidates(await loadAutoDetectCandidates());
        if (gitStatusCandidates.length > 0) {
            const confidence = assessGitStatusConfidence(gitStatusCandidates);
            let selected = gitStatusCandidates[0];
            if (confidence.lowConfidence) {
                console.warn(`   [Priority 2.7] Low-confidence git-status match (${confidence.reason}); falling through.`);
                selected = null;
            }
            if (selected) {
                logSelectionRationale('Priority 2.7', selected.path, autoDetectSpecsDirs, selected.quality, `git_status=${selected.gitStatusCount}, reason=${confidence.reason}`);
                return selected.path;
            }
        }
    }
    // Priority 3: Current working directory
    for (const detectedSpecsDir of specsDirsForDetection) {
        const resolvedSpecsDir = path.resolve(detectedSpecsDir);
        const resolvedCwd = path.resolve(cwd);
        const relativeFromSpecsDir = path.relative(resolvedSpecsDir, resolvedCwd);
        if (relativeFromSpecsDir === '' ||
            relativeFromSpecsDir.startsWith('..') ||
            path.isAbsolute(relativeFromSpecsDir)) {
            continue;
        }
        const segments = relativeFromSpecsDir.split(path.sep).filter(Boolean);
        const specSegments = [];
        for (const segment of segments) {
            if (core_1.SPEC_FOLDER_PATTERN.test(segment)) {
                specSegments.push(segment);
                if (specSegments.length === 2) {
                    break;
                }
            }
            else if (specSegments.length > 0) {
                break;
            }
        }
        if (specSegments.length > 0) {
            return path.join(resolvedSpecsDir, ...specSegments);
        }
    }
    // Priority 3.5: Session-activity signal
    if (autoDetectSpecsDirs.length > 0 && collectedData) {
        const sessionActivityCandidates = rankSessionActivityCandidates(await loadAutoDetectCandidates());
        if (sessionActivityCandidates.length > 0) {
            const confidence = assessSessionActivityConfidence(sessionActivityCandidates);
            let selected = sessionActivityCandidates[0];
            if (confidence.lowConfidence) {
                console.warn(`   [Priority 3.5] Low-confidence session-activity match (${confidence.reason}); falling through.`);
                selected = null;
            }
            if (selected) {
                logSelectionRationale('Priority 3.5', selected.path, autoDetectSpecsDirs, selected.quality, `activity_boost=${selected.sessionActivityBoost.toFixed(2)}, signals=${selected.sessionActivitySignalCount}, reason=${confidence.reason}`);
                return selected.path;
            }
        }
    }
    // Priority 4: Auto-detect from specs directory
    if (autoDetectSpecsDirs.length === 0) {
        printNoSpecFolderError();
        throw new Error('No specs/ directory found');
    }
    try {
        const autoDetectCandidates = await loadAutoDetectCandidates();
        const rankedAutoDetectCandidates = rankAutoDetectCandidates(autoDetectCandidates);
        if (rankedAutoDetectCandidates.length === 0) {
            printNoSpecFolderError();
            throw new Error('No spec folders found in specs/ directory');
        }
        let selectedAutoCandidate = rankedAutoDetectCandidates[0];
        const autoConfidence = assessAutoDetectConfidence(rankedAutoDetectCandidates);
        if (autoConfidence.lowConfidence) {
            if (isInteractiveTTY()) {
                selectedAutoCandidate = await promptAutoDetectCandidateSelection(rankedAutoDetectCandidates, autoDetectSpecsDirs, autoConfidence.reason);
            }
            else {
                console.warn(`   [Priority 4] Low-confidence auto-detect (${autoConfidence.reason}); using deterministic fallback.`);
            }
        }
        logSelectionRationale('Priority 4', selectedAutoCandidate.path, autoDetectSpecsDirs, selectedAutoCandidate.quality, `ranking=quality>git-status>activity>depth>id>mtime, confidence=${autoConfidence.reason}`);
        if (!collectedData || rankedAutoDetectCandidates.length === 1 || process.env.AUTO_SAVE_MODE === 'true') {
            return selectedAutoCandidate.path;
        }
        const conversationTopics = (0, alignment_validator_1.extractConversationTopics)(collectedData);
        const alignmentTarget = path.basename(selectedAutoCandidate.path);
        const alignmentScore = (0, alignment_validator_1.calculateAlignmentScore)(conversationTopics, alignmentTarget);
        if (alignmentScore >= alignment_validator_1.ALIGNMENT_CONFIG.THRESHOLD) {
            return selectedAutoCandidate.path;
        }
        if (!isInteractiveTTY()) {
            console.warn(`   [Priority 4] Alignment score ${alignmentScore}% below threshold; keeping deterministic fallback candidate.`);
            return selectedAutoCandidate.path;
        }
        console.log('\n   Conversation topic may not align with most recent spec folder');
        console.log(`   Selected: ${formatCandidatePathForLog(selectedAutoCandidate.path, autoDetectSpecsDirs)} (${alignmentScore}% match)\n`);
        const alternatives = rankedAutoDetectCandidates.slice(0, Math.min(5, rankedAutoDetectCandidates.length)).map((candidate) => ({
            candidate,
            score: (0, alignment_validator_1.calculateAlignmentScore)(conversationTopics, path.basename(candidate.path))
        }));
        alternatives.sort((a, b) => b.score - a.score);
        console.log('   Alternative spec folders:');
        alternatives.forEach((alt, index) => {
            console.log(`   ${index + 1}. ${formatCandidatePathForLog(alt.candidate.path, autoDetectSpecsDirs)} (${alt.score}% match)`);
        });
        console.log(`   ${alternatives.length + 1}. Specify custom folder path\n`);
        const choice = await (0, prompt_utils_1.promptUserChoice)(`   Select target folder (1-${alternatives.length + 1}): `, alternatives.length + 1);
        if (choice <= alternatives.length) {
            return alternatives[choice - 1].candidate.path;
        }
        else {
            const customPathInput = (await (0, prompt_utils_1.promptUser)('   Enter spec folder name: ')).trim();
            if (customPathInput.length === 0) {
                throw new Error('Custom spec folder path cannot be empty');
            }
            if (path.isAbsolute(customPathInput)) {
                throw new Error('Custom spec folder path must be relative to specs root');
            }
            const customBaseDir = specsDir || autoDetectSpecsDirs[0] || defaultSpecsDir;
            const normalizedCustomPath = normalizeSlashes(customPathInput).replace(/^\.\//, '');
            const customSegments = splitPathSegments(normalizedCustomPath);
            if (customSegments.length === 0 ||
                customSegments.length > 2 ||
                customSegments.some((segment) => !core_1.SPEC_FOLDER_PATTERN.test(segment))) {
                throw new Error('Custom spec folder must be NNN-name or NNN-parent/NNN-child');
            }
            const resolvedCustomPath = path.resolve(customBaseDir, ...customSegments);
            if (!isPathWithin(customBaseDir, resolvedCustomPath) || !isUnderApprovedSpecsRoots(resolvedCustomPath)) {
                throw new Error(`Custom spec folder path escapes approved specs roots: ${customPathInput}`);
            }
            return resolvedCustomPath;
        }
    }
    catch (error) {
        const nodeErr = error;
        if (nodeErr?.code === 'ENOENT') {
            printNoSpecFolderError('save-context');
            throw new Error('specs/ directory not found');
        }
        throw error;
    }
}
//# sourceMappingURL=folder-detector.js.map