"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Workflow
// ───────────────────────────────────────────────────────────────
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
exports.stripWorkflowHtmlOutsideCodeFences = void 0;
exports.filterTriggerPhrases = filterTriggerPhrases;
exports.releaseFilesystemLock = releaseFilesystemLock;
exports.runWorkflow = runWorkflow;
// ───────────────────────────────────────────────────────────────
// 1. WORKFLOW
// ───────────────────────────────────────────────────────────────
// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
// Node stdlib
const path = __importStar(require("node:path"));
const fsSync = __importStar(require("node:fs"));
// Internal modules
const config_1 = require("./config");
const extractors_1 = require("../extractors");
const spec_folder_1 = require("../spec-folder");
const renderers_1 = require("../renderers");
const topic_extractor_1 = require("./topic-extractor");
const file_writer_1 = require("./file-writer");
const slug_utils_1 = require("../utils/slug-utils");
const task_enrichment_1 = require("../utils/task-enrichment");
const spec_affinity_1 = require("../utils/spec-affinity");
const memory_frontmatter_1 = require("../lib/memory-frontmatter");
const collect_session_data_1 = require("../extractors/collect-session-data");
const contamination_filter_1 = require("../extractors/contamination-filter");
const quality_scorer_1 = require("../extractors/quality-scorer");
const validate_memory_quality_1 = require("../lib/validate-memory-quality");
const spec_folder_extractor_1 = require("../extractors/spec-folder-extractor");
const git_context_extractor_1 = require("../extractors/git-context-extractor");
// Static imports replacing lazy require()
const flowchartGen = __importStar(require("../lib/flowchart-generator"));
const content_filter_1 = require("../lib/content-filter");
const semantic_summarizer_1 = require("../lib/semantic-summarizer");
const embeddings_1 = require("../lib/embeddings");
const memory_sufficiency_1 = require("@spec-kit/shared/parsing/memory-sufficiency");
const memory_template_contract_1 = require("@spec-kit/shared/parsing/memory-template-contract");
const spec_doc_health_1 = require("@spec-kit/shared/parsing/spec-doc-health");
const trigger_extractor_1 = require("../lib/trigger-extractor");
const memory_indexer_1 = require("./memory-indexer");
const simFactory = __importStar(require("../lib/simulation-factory"));
const post_save_review_1 = require("./post-save-review");
const data_loader_1 = require("../loaders/data-loader");
const tree_thinning_1 = require("./tree-thinning");
const logger_1 = require("../utils/logger");
const source_capabilities_1 = require("../utils/source-capabilities");
const input_normalizer_1 = require("../utils/input-normalizer");
// Extracted modules
const content_cleaner_1 = require("./content-cleaner");
const title_builder_1 = require("./title-builder");
const workflow_path_utils_1 = require("./workflow-path-utils");
const memory_metadata_1 = require("./memory-metadata");
const frontmatter_editor_1 = require("./frontmatter-editor");
const quality_gates_1 = require("./quality-gates");
const workflow_accessors_1 = require("./workflow-accessors");
const alignment_validator_1 = require("./alignment-validator");
// ───────────────────────────────────────────────────────────────
// 0. HELPERS
// ───────────────────────────────────────────────────────────────
// Phase 004 T011: Trigger phrase filter — suppresses path fragments, short tokens, and shingle subsets
const TRIGGER_ALLOW_LIST = new Set(['rag', 'bm25', 'mcp', 'adr', 'jwt', 'api', 'cli', 'llm', 'ai']);
function filterTriggerPhrases(phrases) {
    // Stage 1: Remove entries containing path separators (forward/backslash, multi-word path segments)
    let filtered = phrases.filter(p => {
        const trimmed = p.trim();
        if (trimmed.includes('/') || trimmed.includes('\\'))
            return false;
        // Multi-word path segment pattern: sequences like "system spec kit" that look like folder paths
        if (/^\d{1,3}\s/.test(trimmed))
            return false; // Leading number prefix (e.g., "022 hybrid rag")
        return true;
    });
    // Stage 2: Remove entries where every word is under 3 characters (unless in allow-list)
    filtered = filtered.filter(p => {
        const words = p.trim().split(/\s+/);
        if (words.length === 1 && words[0].length < 3 && !TRIGGER_ALLOW_LIST.has(words[0].toLowerCase())) {
            return false;
        }
        // Multi-word: keep if at least one word >= 3 chars or any word is in allow-list
        if (words.every(w => w.length < 3) && !words.some(w => TRIGGER_ALLOW_LIST.has(w.toLowerCase()))) {
            return false;
        }
        return true;
    });
    // Stage 3: Remove n-gram shingle phrases that are substrings of longer retained phrases
    const lowerPhrases = filtered.map(p => p.toLowerCase());
    filtered = filtered.filter((p, idx) => {
        const lower = lowerPhrases[idx];
        // Check if this phrase is a substring of any other (longer) phrase
        for (let j = 0; j < lowerPhrases.length; j++) {
            if (j !== idx && lowerPhrases[j].length > lower.length && lowerPhrases[j].includes(lower)) {
                return false;
            }
        }
        return true;
    });
    return filtered;
}
/**
 * Insert content after YAML frontmatter, preserving frontmatter at byte 0.
 * Frontmatter is a block delimited by `---\n` at position 0 and a closing `---\n`.
 * If no frontmatter is found, prepends the content (original behavior).
 */
function insertAfterFrontmatter(content, insertion) {
    if (!content.startsWith('---')) {
        return insertion + content;
    }
    // Find the closing --- (skip the opening ---)
    const closingIdx = content.indexOf('\n---', 3);
    if (closingIdx === -1) {
        return insertion + content;
    }
    // Find the end of the closing --- line
    const afterClosing = content.indexOf('\n', closingIdx + 4);
    const insertionPoint = afterClosing === -1 ? content.length : afterClosing + 1;
    return content.slice(0, insertionPoint) + insertion + content.slice(insertionPoint);
}
const FALLBACK_RETRY_MANAGER = {
    getRetryStats: () => ({ queue_size: 0 }),
    processRetryQueue: async () => ({ processed: 0, succeeded: 0, failed: 0 }),
};
/**
 * Shared helper for dynamic MCP-server API imports with consistent degradation.
 * All call sites log warnings on failure and return the provided fallback.
 */
async function tryImportMcpApi(specifier) {
    try {
        return await Promise.resolve(`${specifier}`).then(s => __importStar(require(s)));
    }
    catch (err) {
        console.warn(`[workflow] Failed to import ${specifier}: ${err instanceof Error ? err.message : String(err)}`);
        return null;
    }
}
let workflowRetryManagerPromise = null;
let workflowRetryManagerLoadError = null;
function isWorkflowRetryManagerAdapter(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value;
    return (typeof candidate.getRetryStats === 'function' &&
        typeof candidate.processRetryQueue === 'function');
}
async function loadWorkflowRetryManagerModule() {
    try {
        const module = await Promise.resolve().then(() => __importStar(require('@spec-kit/mcp-server/api/providers')));
        const candidate = module.retryManager;
        if (isWorkflowRetryManagerAdapter(candidate)) {
            workflowRetryManagerLoadError = null;
            return candidate;
        }
        workflowRetryManagerLoadError = 'Provider retryManager export is missing required methods';
        return FALLBACK_RETRY_MANAGER;
    }
    catch (error) {
        workflowRetryManagerLoadError = error instanceof Error ? error.message : String(error);
        return FALLBACK_RETRY_MANAGER;
    }
}
async function loadWorkflowRetryManager() {
    if (!workflowRetryManagerPromise) {
        workflowRetryManagerPromise = loadWorkflowRetryManagerModule();
    }
    return workflowRetryManagerPromise;
}
function consumeWorkflowRetryManagerLoadError() {
    const loadError = workflowRetryManagerLoadError;
    workflowRetryManagerLoadError = null;
    return loadError;
}
// ───────────────────────────────────────────────────────────────
// 2. WORKFLOW RUN LOCK
// ───────────────────────────────────────────────────────────────
let workflowRunQueue = Promise.resolve();
/** Filesystem lock directory for cross-process serialization. */
const WORKFLOW_MODULE_DIR = __dirname;
const WORKFLOW_LOCK_DIR = path.resolve(WORKFLOW_MODULE_DIR, '../../.workflow-lock');
const WORKFLOW_LOCK_OWNER_PATH = path.join(WORKFLOW_LOCK_DIR, 'owner.json');
const LEGACY_LOCK_STALE_MS = 5_000;
function writeWorkflowLockOwner() {
    const owner = {
        pid: process.pid,
        acquiredAt: new Date().toISOString(),
    };
    fsSync.writeFileSync(WORKFLOW_LOCK_OWNER_PATH, JSON.stringify(owner, null, 2), 'utf8');
}
function isProcessAlive(pid) {
    if (!Number.isInteger(pid) || pid <= 0) {
        return false;
    }
    try {
        process.kill(pid, 0);
        return true;
    }
    catch (err) {
        const code = err?.code;
        return code !== 'ESRCH';
    }
}
function clearWorkflowLockDir() {
    try {
        fsSync.rmSync(WORKFLOW_LOCK_DIR, { recursive: true, force: true });
    }
    catch (_err) {
        // Best-effort stale lock cleanup.
    }
}
function shouldClearStaleWorkflowLock() {
    try {
        const ownerRaw = fsSync.existsSync(WORKFLOW_LOCK_OWNER_PATH)
            ? fsSync.readFileSync(WORKFLOW_LOCK_OWNER_PATH, 'utf8')
            : null;
        if (ownerRaw) {
            const owner = JSON.parse(ownerRaw);
            return !isProcessAlive(typeof owner.pid === 'number' ? owner.pid : NaN);
        }
        const lockStats = fsSync.statSync(WORKFLOW_LOCK_DIR);
        return (Date.now() - lockStats.mtimeMs) >= LEGACY_LOCK_STALE_MS;
    }
    catch (_err) {
        return true;
    }
}
/**
 * Acquire the filesystem lock via atomic mkdir.
 * Uses exponential backoff; gives up after ~30 s total wait.
 */
async function acquireFilesystemLock() {
    const MAX_TOTAL_MS = 30_000;
    let waited = 0;
    let delay = 100;
    while (waited < MAX_TOTAL_MS) {
        try {
            fsSync.mkdirSync(WORKFLOW_LOCK_DIR, { recursive: false });
            writeWorkflowLockOwner();
            return true; // lock acquired
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                // Unexpected error (permissions, etc.) -- skip fs lock
                return false;
            }
            if (shouldClearStaleWorkflowLock()) {
                clearWorkflowLockDir();
                continue;
            }
            // Lock held by another process -- wait with backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
            waited += delay;
            delay = Math.min(delay * 2, 4_000);
        }
    }
    // Timed out -- proceed without fs lock (fallback to in-process queue)
    console.warn('[workflow] Filesystem lock acquisition timed out after 30 s; proceeding without fs lock.');
    return false;
}
function releaseFilesystemLock() {
    try {
        clearWorkflowLockDir();
    }
    catch (_err) {
        // Lock dir already removed or never created -- benign
    }
}
async function withWorkflowRunLock(operation) {
    // Belt: in-process promise queue (serialises concurrent calls in same process)
    const priorRun = workflowRunQueue;
    let releaseCurrentRun = () => undefined;
    workflowRunQueue = new Promise((resolve) => {
        releaseCurrentRun = resolve;
    });
    await priorRun;
    // Suspenders: filesystem-based lock (serialises across processes)
    const fsLockAcquired = await acquireFilesystemLock();
    try {
        return await operation();
    }
    finally {
        if (fsLockAcquired) {
            releaseFilesystemLock();
        }
        releaseCurrentRun();
    }
}
// ───────────────────────────────────────────────────────────────
// 3. CAPTURED-SESSION ENRICHMENT
// ───────────────────────────────────────────────────────────────
async function enrichCapturedSessionData(collectedData, specFolder, projectRoot) {
    // Only enrich runtime-captured inputs — file-backed JSON is authoritative
    if (collectedData._source === 'file')
        return collectedData;
    const enriched = { ...collectedData };
    try {
        // Run spec-folder and git extraction in parallel
        const [specContext, gitContext] = await Promise.all([
            (0, spec_folder_extractor_1.extractSpecFolderContext)(path.resolve(specFolder)).catch((err) => {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(`[workflow] enrichment degraded: ${msg}`);
                return null;
            }),
            (0, git_context_extractor_1.extractGitContext)(projectRoot, specFolder).catch((err) => {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(`[workflow] enrichment degraded: ${msg}`);
                return null;
            }),
        ]);
        // O1-11: Track which enrichment sources were available
        enriched._specContextLoaded = specContext !== null;
        enriched._gitContextLoaded = gitContext !== null;
        // Merge spec-folder observations (provenance-tagged, won't conflict with live data)
        if (specContext) {
            const existingObs = enriched.observations || [];
            enriched.observations = [
                ...existingObs,
                ...specContext.observations,
            ];
            // Merge FILES (deduplicate by path, prefer existing descriptions)
            const existingFiles = enriched.FILES || [];
            const existingPaths = new Set(existingFiles.map((f) => (f.FILE_PATH || f.path || '').toLowerCase()));
            const newFiles = specContext.FILES.filter((f) => !existingPaths.has(f.FILE_PATH.toLowerCase()));
            enriched.FILES = [...existingFiles, ...newFiles];
            // Merge trigger phrases
            if (specContext.triggerPhrases.length > 0) {
                enriched._manualTriggerPhrases = [
                    ...(enriched._manualTriggerPhrases || []),
                    ...specContext.triggerPhrases,
                ];
            }
            // Merge decisions
            if (specContext.decisions.length > 0) {
                enriched._manualDecisions = [
                    ...(enriched._manualDecisions || []),
                    ...specContext.decisions,
                ];
            }
            // Use spec summary if collectedData summary is missing or generic
            if (specContext.summary && (!enriched.SUMMARY || enriched.SUMMARY === 'Development session')) {
                enriched.SUMMARY = specContext.summary;
            }
            // Merge recentContext
            if (specContext.recentContext.length > 0) {
                enriched.recentContext = [
                    ...(enriched.recentContext || []),
                    ...specContext.recentContext,
                ];
            }
        }
        // Merge git context
        if (gitContext) {
            const existingObs = enriched.observations || [];
            enriched.observations = [
                ...existingObs,
                ...gitContext.observations,
            ];
            // Merge FILES (deduplicate by path)
            const existingFiles = enriched.FILES || [];
            const existingPaths = new Set(existingFiles.map((f) => (f.FILE_PATH || f.path || '').toLowerCase()));
            const newFiles = gitContext.FILES.filter((f) => !existingPaths.has(f.FILE_PATH.toLowerCase()));
            enriched.FILES = [...existingFiles, ...newFiles];
            // Append git summary to existing summary
            if (gitContext.summary) {
                const existing = enriched.SUMMARY || '';
                enriched.SUMMARY = existing
                    ? `${existing}. Git: ${gitContext.summary}`
                    : gitContext.summary;
            }
            // Propagate git provenance metadata for template rendering (M-007d)
            enriched.headRef = gitContext.headRef;
            enriched.commitRef = gitContext.commitRef;
            enriched.repositoryState = gitContext.repositoryState;
            enriched.isDetachedHead = gitContext.isDetachedHead;
        }
        const narrativeObservations = (enriched.observations || []).filter((observation) => observation?._synthetic !== true);
        // Synthetic observations provide file coverage but do not influence session narrative
        enriched._narrativeObservations = narrativeObservations;
    }
    catch (err) {
        // Enrichment failure is non-fatal — proceed with whatever data we have
        console.warn(`   Warning: Stateless enrichment failed: ${err instanceof Error ? err.message : String(err)}`);
    }
    return enriched;
}
// ───────────────────────────────────────────────────────────────
// 4. MAIN WORKFLOW
// ───────────────────────────────────────────────────────────────
/**
 * Main workflow orchestrator: coordinates data loading, extraction, rendering,
 * quality scoring, and atomic file output to produce a memory context file.
 *
 * @param options - Configuration controlling data source, spec folder, and output behavior.
 * @returns A WorkflowResult describing the output files, resolved spec folder, and stats.
 */
async function runWorkflow(options = {}) {
    return withWorkflowRunLock(async () => {
        const { dataFile, specFolderArg, collectedData: preloadedData, loadDataFn, collectSessionDataFn, silent = false, } = options;
        const hasDirectDataContext = (dataFile !== undefined ||
            preloadedData !== undefined ||
            loadDataFn !== undefined);
        const activeDataFile = dataFile ?? (hasDirectDataContext ? null : config_1.CONFIG.DATA_FILE);
        const activeSpecFolderArg = specFolderArg ?? (hasDirectDataContext ? null : config_1.CONFIG.SPEC_FOLDER_ARG);
        const log = silent ? () => { } : console.log.bind(console);
        const warn = silent ? () => { } : console.warn.bind(console);
        log('Starting memory skill workflow...\n');
        // Step 1: Load collected data
        log('Step 1: Loading collected data...');
        let collectedData;
        if (preloadedData) {
            // Rec 1: Normalize JSON-derived preloaded data so sessionSummary → userPrompts,
            // keyDecisions → _manualDecisions, filesChanged → FILES, etc.
            const normalized = (0, input_normalizer_1.normalizeInputData)(preloadedData);
            // P1-001 fix: Explicit field projection instead of unsafe spread merge.
            // Only overlay normalized fields that the normalizer actually produces,
            // preserving preloadedData's non-normalized fields (e.g., _source, _sessionId).
            const n = normalized;
            collectedData = Object.assign({}, preloadedData, {
                userPrompts: n.userPrompts ?? preloadedData.userPrompts,
                observations: n.observations ?? preloadedData.observations,
                recentContext: n.recentContext ?? preloadedData.recentContext,
                FILES: n.FILES ?? preloadedData.FILES,
                SPEC_FOLDER: n.SPEC_FOLDER ?? preloadedData.SPEC_FOLDER,
                _manualDecisions: n._manualDecisions ?? preloadedData._manualDecisions,
                _manualTriggerPhrases: n._manualTriggerPhrases ?? preloadedData._manualTriggerPhrases,
                TECHNICAL_CONTEXT: n.TECHNICAL_CONTEXT ?? preloadedData.TECHNICAL_CONTEXT,
                importanceTier: n.importanceTier ?? preloadedData.importanceTier,
                contextType: n.contextType ?? preloadedData.contextType,
                projectPhase: n.projectPhase ?? preloadedData.projectPhase,
            });
            log('   Using pre-loaded data (normalized)');
        }
        else if (loadDataFn) {
            // F-22: Guard loadDataFn result with explicit null check
            collectedData = (await loadDataFn()) || null;
            log('   Loaded via custom function');
        }
        else {
            collectedData = await (0, data_loader_1.loadCollectedData)({
                dataFile: activeDataFile,
                specFolderArg: activeSpecFolderArg,
            });
            log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
        }
        if (!collectedData) {
            throw new Error('No data available - provide dataFile, collectedData, or loadDataFn');
        }
        // Step 1.5: Captured-session alignment check
        // When no JSON data file was provided, data comes from the active OpenCode session.
        // Verify the captured content relates to the target spec folder to prevent
        // Cross-spec contamination (e.g., session working on spec A saved to spec B).
        const isCapturedSessionMode = collectedData._source !== 'file' && collectedData._isSimulation !== true;
        if (isCapturedSessionMode && activeSpecFolderArg && (collectedData.observations || collectedData.FILES)) {
            const alignmentTargets = await (0, alignment_validator_1.resolveAlignmentTargets)(activeSpecFolderArg);
            const specAffinityTargets = (0, spec_affinity_1.buildSpecAffinityTargets)(activeSpecFolderArg);
            const specAffinity = (0, spec_affinity_1.evaluateCollectedDataSpecAffinity)(collectedData, specAffinityTargets);
            if (!specAffinity.hasAnchor) {
                // Q1: Downgrade Block A from hard abort to warning when spec folder was explicitly
                // provided via CLI argument. The user's explicit intent overrides the anchor check.
                // Blocks B and C (file-path overlap) remain as hard blocks for safety.
                const alignMsg = `ALIGNMENT_WARNING: Captured-session content matched the workspace but not the target spec folder "${activeSpecFolderArg}". ` +
                    `No spec-specific anchors were found beyond workspace identity (matched files: ${specAffinity.matchedFileTargets.length}, ` +
                    `matched phrases: ${specAffinity.matchedPhrases.length}, matched spec id: ${specAffinity.matchedSpecId ? 'yes' : 'no'}). ` +
                    `Proceeding because spec folder was explicitly provided via CLI argument.`;
                warn(`   ${alignMsg}`);
            }
            const allFilePaths = (collectedData.observations || [])
                .flatMap((obs) => obs.files || [])
                .concat((collectedData.FILES || []).map((f) => f.FILE_PATH || f.path || ''));
            const totalPaths = allFilePaths.length;
            if (totalPaths > 0 && (alignmentTargets.keywordTargets.length > 0 || alignmentTargets.fileTargets.length > 0)) {
                const relevantPaths = allFilePaths.filter((fp) => {
                    return (0, alignment_validator_1.matchesAlignmentTarget)(fp, alignmentTargets);
                });
                const overlapRatio = relevantPaths.length / totalPaths;
                // RC-4: Raised from 0.05 to 0.15 — 5% threshold let mostly-foreign content through
                if (overlapRatio < 0.15) {
                    const alignMsg = `ALIGNMENT_BLOCK: Only ${(overlapRatio * 100).toFixed(0)}% of captured file paths relate to spec folder "${activeSpecFolderArg}". ` +
                        `The active session appears to be working on a different task (alignment keywords: [${alignmentTargets.keywordTargets.join(', ')}], ` +
                        `total paths: ${totalPaths}, matching: ${relevantPaths.length}). ` +
                        `Aborting to prevent cross-spec contamination. To force, pass data via JSON file.`;
                    warn(`   ${alignMsg}`);
                    throw new Error(alignMsg);
                }
            }
        }
        log();
        // Step 2: Detect spec folder with context alignment
        log('Step 2: Detecting spec folder...');
        const specFolder = await (0, spec_folder_1.detectSpecFolder)(collectedData, {
            specFolderArg: activeSpecFolderArg,
        });
        const specsDir = (0, config_1.findActiveSpecsDir)() || path.join(config_1.CONFIG.PROJECT_ROOT, 'specs');
        const normalizedSpecFolder = path.resolve(specFolder).replace(/\\/g, '/');
        const candidateSpecsDirs = Array.from(new Set([
            specsDir,
            ...(0, config_1.getSpecsDirectories)(),
            path.join(config_1.CONFIG.PROJECT_ROOT, 'specs'),
            path.join(config_1.CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
        ]));
        let specFolderName = '';
        for (const candidateRoot of candidateSpecsDirs) {
            const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
            const relative = path.relative(normalizedRoot, normalizedSpecFolder).replace(/\\/g, '/');
            if (relative &&
                relative !== '.' &&
                relative !== '..' &&
                !relative.startsWith('../') &&
                !path.isAbsolute(relative)) {
                specFolderName = relative;
                break;
            }
        }
        if (!specFolderName) {
            const marker = '/specs/';
            const markerIndex = normalizedSpecFolder.lastIndexOf(marker);
            specFolderName = markerIndex >= 0
                ? normalizedSpecFolder.slice(markerIndex + marker.length)
                : path.basename(normalizedSpecFolder);
        }
        log(`   Using: ${specFolder}\n`);
        // Step 3: Setup context directory
        log('Step 3: Setting up context directory...');
        const contextDir = await (0, spec_folder_1.setupContextDirectory)(specFolder);
        log(`   Created: ${contextDir}\n`);
        // F-23: Define contamination cleaning functions before enrichment
        let hadContamination = false;
        let contaminationMaxSeverity = null;
        const contaminationAuditTrail = [];
        const extractorPatternCounts = new Map();
        let extractorProcessedFieldCount = 0;
        let extractorCleanedFieldCount = 0;
        let extractorRemovedPhraseCount = 0;
        const captureSource = typeof collectedData?._source === 'string' ? collectedData._source : undefined;
        const captureCapabilities = (0, source_capabilities_1.getSourceCapabilities)(captureSource);
        const cleanContaminationText = (input) => {
            extractorProcessedFieldCount++;
            const filtered = (0, contamination_filter_1.filterContamination)(input, undefined, captureSource ? { captureSource: captureCapabilities.source, sourceCapabilities: captureCapabilities } : undefined);
            if (filtered.hadContamination) {
                hadContamination = true;
                extractorCleanedFieldCount++;
                extractorRemovedPhraseCount += filtered.removedPhrases.length;
                if (filtered.maxSeverity !== null) {
                    if (contaminationMaxSeverity === null || contamination_filter_1.SEVERITY_RANK[filtered.maxSeverity] > contamination_filter_1.SEVERITY_RANK[contaminationMaxSeverity]) {
                        contaminationMaxSeverity = filtered.maxSeverity;
                    }
                }
                for (const label of filtered.matchedPatterns) {
                    extractorPatternCounts.set(label, (extractorPatternCounts.get(label) ?? 0) + 1);
                }
            }
            return (0, content_cleaner_1.escapeLiteralAnchorExamples)(filtered.cleanedText);
        };
        const cleanObservations = (observations) => {
            if (!observations) {
                return observations;
            }
            // F-23: Clean ALL observations, not just provenanced ones
            return observations.map((observation) => {
                if (!observation) {
                    return observation;
                }
                return {
                    ...observation,
                    title: observation.title ? cleanContaminationText(observation.title) : observation.title,
                    narrative: observation.narrative ? cleanContaminationText(observation.narrative) : observation.narrative,
                    facts: observation.facts?.map((fact) => (typeof fact === 'string'
                        ? cleanContaminationText(fact)
                        : {
                            ...fact,
                            text: typeof fact.text === 'string' ? cleanContaminationText(fact.text) : fact.text
                        })),
                };
            });
        };
        // F-23: Pre-enrichment contamination cleaning pass
        {
            const preCleanedObservations = cleanObservations(collectedData.observations);
            const preCleanedSummary = (typeof collectedData.SUMMARY === 'string' && collectedData.SUMMARY.length > 0)
                ? cleanContaminationText(collectedData.SUMMARY) : collectedData.SUMMARY;
            // Phase 002 T010: Clean _JSON_SESSION_SUMMARY (raw sessionSummary title candidate)
            const preCleanedJsonSummary = (typeof collectedData._JSON_SESSION_SUMMARY === 'string' &&
                collectedData._JSON_SESSION_SUMMARY.length > 0)
                ? cleanContaminationText(collectedData._JSON_SESSION_SUMMARY)
                : collectedData._JSON_SESSION_SUMMARY;
            // Phase 002 T011: Clean _manualDecisions array entries
            const preCleanedDecisions = Array.isArray(collectedData._manualDecisions)
                ? collectedData._manualDecisions.map((d) => {
                    if (typeof d === 'string')
                        return cleanContaminationText(d);
                    if (d && typeof d === 'object') {
                        const obj = { ...d };
                        for (const key of Object.keys(obj)) {
                            if (typeof obj[key] === 'string')
                                obj[key] = cleanContaminationText(obj[key]);
                        }
                        return obj;
                    }
                    return d;
                })
                : collectedData._manualDecisions;
            // Phase 002 T012: Clean recentContext array entries
            const preCleanedRecentCtx = Array.isArray(collectedData.recentContext)
                ? collectedData.recentContext.map((entry) => ({
                    ...entry,
                    request: typeof entry.request === 'string' ? cleanContaminationText(entry.request) : entry.request,
                    learning: typeof entry.learning === 'string' ? cleanContaminationText(entry.learning) : entry.learning,
                }))
                : collectedData.recentContext;
            // Phase 002 T013-T014: Clean technicalContext KEY and VALUE strings
            const preCleanedTechCtx = Array.isArray(collectedData.TECHNICAL_CONTEXT)
                ? collectedData.TECHNICAL_CONTEXT.map((entry) => ({
                    KEY: typeof entry.KEY === 'string' ? cleanContaminationText(entry.KEY) : entry.KEY,
                    VALUE: typeof entry.VALUE === 'string' ? cleanContaminationText(entry.VALUE) : entry.VALUE,
                }))
                : collectedData.TECHNICAL_CONTEXT;
            // Only spread fields that exist on the original to avoid adding undefined keys
            const cleanedFields = {
                observations: preCleanedObservations,
                SUMMARY: preCleanedSummary,
            };
            if ('_JSON_SESSION_SUMMARY' in collectedData)
                cleanedFields._JSON_SESSION_SUMMARY = preCleanedJsonSummary;
            if ('_manualDecisions' in collectedData)
                cleanedFields._manualDecisions = preCleanedDecisions;
            if ('recentContext' in collectedData)
                cleanedFields.recentContext = preCleanedRecentCtx;
            if ('TECHNICAL_CONTEXT' in collectedData)
                cleanedFields.TECHNICAL_CONTEXT = preCleanedTechCtx;
            collectedData = { ...collectedData, ...cleanedFields };
            const extractorAudit = {
                stage: 'extractor-scrub',
                timestamp: new Date().toISOString(),
                patternsChecked: (0, contamination_filter_1.getContaminationPatternLabels)(),
                matchesFound: (0, workflow_accessors_1.summarizeAuditCounts)(extractorPatternCounts),
                actionsTaken: [
                    `cleaned_fields:${extractorCleanedFieldCount}`,
                    `removed_phrases:${extractorRemovedPhraseCount}`,
                ],
                passedThrough: [
                    `processed_fields:${extractorProcessedFieldCount}`,
                ],
            };
            contaminationAuditTrail.push(extractorAudit);
            (0, logger_1.structuredLog)('info', 'contamination_audit', extractorAudit);
            // Count-based severity escalation: mass low-severity matches indicate
            // pervasive contamination that warrants a higher penalty
            if (hadContamination && contaminationMaxSeverity === 'low' && extractorRemovedPhraseCount >= 10) {
                contaminationMaxSeverity = 'medium';
            }
            // O4-6: Escalate medium to high for pervasive contamination
            if (hadContamination && contaminationMaxSeverity === 'medium' && extractorRemovedPhraseCount >= 20) {
                contaminationMaxSeverity = 'high';
            }
        }
        // Step 3.5: Enrich captured-session data with spec folder and git context
        if (isCapturedSessionMode) {
            // Capture pre-enrichment file references so the post-check only judges
            // paths introduced by enrichment (not caller-provided direct inputs).
            const preEnrichmentPaths = new Set(((collectedData.observations || [])
                .flatMap((obs) => obs.files || [])
                .concat((collectedData.FILES || []).map((f) => f.FILE_PATH || f.path || '')))
                .map((fp) => fp.trim())
                .filter((fp) => fp.length > 0));
            log('Step 3.5: Enriching captured-session data...');
            collectedData = await enrichCapturedSessionData(collectedData, specFolder, config_1.CONFIG.PROJECT_ROOT);
            log('   Enrichment complete');
            // RC-4: Post-enrichment alignment re-check — enrichment can introduce
            // New foreign content (e.g., git context from other spec folders).
            // Re-verify alignment at a lower threshold (10%) to catch this.
            // Uses resolved specFolder (not raw activeSpecFolderArg) for accurate keyword matching.
            if (specFolder && (collectedData.observations || collectedData.FILES)) {
                const alignmentTargetsPost = await (0, alignment_validator_1.resolveAlignmentTargets)(specFolder);
                const allFilePathsPost = (collectedData.observations || [])
                    .flatMap((obs) => obs.files || [])
                    .concat((collectedData.FILES || []).map((f) => f.FILE_PATH || f.path || ''));
                const addedPathsPost = allFilePathsPost
                    .map((fp) => fp.trim())
                    .filter((fp) => fp.length > 0 && !preEnrichmentPaths.has(fp));
                const totalPathsPost = addedPathsPost.length;
                if (totalPathsPost > 0 && (alignmentTargetsPost.keywordTargets.length > 0 || alignmentTargetsPost.fileTargets.length > 0)) {
                    const relevantPathsPost = addedPathsPost.filter((fp) => {
                        return (0, alignment_validator_1.matchesAlignmentTarget)(fp, alignmentTargetsPost);
                    });
                    const overlapRatioPost = relevantPathsPost.length / totalPathsPost;
                    if (overlapRatioPost < 0.10) {
                        const postAlignMsg = `POST_ENRICHMENT_ALIGNMENT_BLOCK: After enrichment, only ${(overlapRatioPost * 100).toFixed(0)}% of file paths relate to spec folder "${specFolder}". ` +
                            `Enrichment may have introduced cross-spec contamination (alignment keywords: [${alignmentTargetsPost.keywordTargets.join(', ')}], ` +
                            `total paths: ${totalPathsPost}, matching: ${relevantPathsPost.length}). Aborting.`;
                        warn(`   ${postAlignMsg}`);
                        throw new Error(postAlignMsg);
                    }
                }
            }
            log();
        }
        // Clean FILE descriptions that may contain contamination from git commit subjects
        if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
            const preFileCleanedCount = extractorCleanedFieldCount;
            const preFileRemovedCount = extractorRemovedPhraseCount;
            const filesList = collectedData.FILES;
            collectedData = {
                ...collectedData,
                FILES: filesList.map((file) => ({
                    ...file,
                    DESCRIPTION: file.DESCRIPTION ? cleanContaminationText(file.DESCRIPTION) : file.DESCRIPTION,
                })),
            };
            const fileDescCleanedCount = extractorCleanedFieldCount - preFileCleanedCount;
            const fileDescRemovedCount = extractorRemovedPhraseCount - preFileRemovedCount;
            if (fileDescCleanedCount > 0) {
                const fileDescAudit = {
                    stage: 'extractor-scrub',
                    timestamp: new Date().toISOString(),
                    patternsChecked: (0, contamination_filter_1.getContaminationPatternLabels)(),
                    matchesFound: (0, workflow_accessors_1.summarizeAuditCounts)(extractorPatternCounts),
                    actionsTaken: [
                        `file_desc_cleaned:${fileDescCleanedCount}`,
                        `file_desc_removed_phrases:${fileDescRemovedCount}`,
                    ],
                    passedThrough: [
                        `total_files:${filesList.length}`,
                    ],
                };
                contaminationAuditTrail.push(fileDescAudit);
                (0, logger_1.structuredLog)('info', 'contamination_audit', fileDescAudit);
            }
        }
        // Steps 4-7: Parallel data extraction
        log('Steps 4-7: Extracting data (parallel execution)...\n');
        const sessionDataFn = collectSessionDataFn || collect_session_data_1.collectSessionData;
        if (!sessionDataFn) {
            throw new Error('Missing session data collector function.\n' +
                '  - If calling runWorkflow() directly, pass { collectSessionDataFn: yourFunction } in options\n' +
                '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData');
        }
        const rawUserPrompts = Array.isArray(collectedData?.userPrompts) ? collectedData.userPrompts : [];
        // F06-002: Type assertion with documented contract — CollectedDataFull is the canonical shape
        const collectedDataWithNarrative = collectedData;
        const filteredUserPrompts = rawUserPrompts.map((message) => {
            const cleanedPrompt = cleanContaminationText(message.prompt || '');
            return {
                ...message,
                prompt: cleanedPrompt,
            };
        });
        const filteredSummary = (typeof collectedData.SUMMARY === 'string' && collectedData.SUMMARY.length > 0)
            ? cleanContaminationText(collectedData.SUMMARY)
            : collectedData.SUMMARY;
        const filteredObservations = cleanObservations(collectedData.observations);
        const filteredNarrativeObservations = cleanObservations(collectedDataWithNarrative._narrativeObservations);
        collectedData = {
            ...collectedData,
            userPrompts: filteredUserPrompts,
            SUMMARY: filteredSummary,
            observations: filteredObservations,
            // P0-1: Force CLI-resolved spec folder into collectedData so all parallel
            // extractors (decisions, diagrams, conversations) see the authoritative value
            SPEC_FOLDER: specFolderName || collectedData.SPEC_FOLDER,
        };
        collectedDataWithNarrative._narrativeObservations = filteredNarrativeObservations;
        const narrativeObservations = Array.isArray(filteredNarrativeObservations)
            ? filteredNarrativeObservations || []
            : (collectedData.observations || []);
        const narrativeCollectedData = {
            ...collectedData,
            observations: narrativeObservations,
        };
        const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
            (async () => {
                log('   Collecting session data...');
                const result = await sessionDataFn(narrativeCollectedData, specFolderName, options.sessionId);
                log('   Session data collected');
                return result;
            })(),
            (async () => {
                log('   Extracting conversations...');
                const result = await (0, extractors_1.extractConversations)(collectedData);
                log(`   Found ${result.MESSAGES.length} messages`);
                return result;
            })(),
            (async () => {
                log('   Extracting decisions...');
                const result = await (0, extractors_1.extractDecisions)(collectedData);
                log(`   Found ${result.DECISIONS.length} decisions`);
                return result;
            })(),
            (async () => {
                log('   Extracting diagrams...');
                const result = await (0, extractors_1.extractDiagrams)(collectedData);
                log(`   Found ${result.DIAGRAMS.length} diagrams`);
                return result;
            })(),
            (async () => {
                log('   Generating workflow flowchart...');
                const phases = (0, extractors_1.extractPhasesFromData)(narrativeCollectedData);
                const patternType = flowchartGen.detectWorkflowPattern(phases);
                const phaseDetails = flowchartGen.buildPhaseDetails(phases);
                const features = flowchartGen.extractFlowchartFeatures(phases, patternType);
                const useCases = flowchartGen.getPatternUseCases(patternType);
                const useCaseTitle = specFolderName.replace(/^\d+-/, '').replace(/-/g, ' ');
                log(`   Workflow data generated (${patternType})`);
                return {
                    WORKFLOW_FLOWCHART: flowchartGen.generateWorkflowFlowchart(phases),
                    HAS_WORKFLOW_DIAGRAM: false,
                    PATTERN_TYPE: patternType.charAt(0).toUpperCase() + patternType.slice(1),
                    PATTERN_LINEAR: patternType === 'linear',
                    PATTERN_PARALLEL: patternType === 'parallel',
                    PHASES: phaseDetails,
                    HAS_PHASES: phaseDetails.length > 0,
                    USE_CASE_TITLE: useCaseTitle,
                    FEATURES: features,
                    USE_CASES: useCases
                };
            })()
        ]);
        log('\n   All extraction complete (parallel execution)\n');
        // O1-4: Use local variable instead of mutating extractor result in-place
        // Patch TOOL_COUNT for enriched captured-session saves so V7 does not flag
        // Synthetic file paths as contradictory with zero tool usage.
        // RC-9 fix: Guard against NaN/undefined TOOL_COUNT before any comparison.
        let patchedToolCount = Number.isFinite(sessionData.TOOL_COUNT) ? sessionData.TOOL_COUNT : 0;
        const enrichedFileCount = collectedData.FILES?.length ?? 0;
        const captureToolEvidenceCount = typeof collectedData._toolCallCount === 'number'
            && Number.isFinite(collectedData._toolCallCount)
            ? collectedData._toolCallCount
            : 0;
        const inferredToolCount = Math.max(enrichedFileCount, captureToolEvidenceCount);
        if (isCapturedSessionMode && patchedToolCount === 0 && inferredToolCount > 0) {
            patchedToolCount = inferredToolCount;
        }
        // Step 7.5: Generate semantic implementation summary
        log('Step 7.5: Generating semantic summary...');
        const allMessages = (collectedData?.userPrompts || []).map((m) => {
            const cleanedPrompt = m.prompt || '';
            return {
                prompt: cleanedPrompt,
                content: cleanedPrompt,
                timestamp: m.timestamp
            };
        });
        // Run content through filter pipeline for quality scoring
        const filterPipeline = (0, content_filter_1.createFilterPipeline)();
        const filteredMessages = filterPipeline.filter(allMessages);
        const normalizedMessages = filteredMessages.map((message) => {
            const prompt = typeof message.prompt === 'string'
                ? message.prompt
                : (typeof message.content === 'string' ? message.content : '');
            return {
                prompt,
                content: typeof message.content === 'string' ? message.content : prompt,
                timestamp: typeof message.timestamp === 'string' ? message.timestamp : undefined,
            };
        });
        const filterStats = filterPipeline.getStats();
        contaminationAuditTrail.push(...filterStats.contaminationAudit);
        log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
        if (filterPipeline.isLowQuality()) {
            warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
        }
        const implSummary = (0, semantic_summarizer_1.generateImplementationSummary)(normalizedMessages, (collectedData?.observations || []));
        const semanticFileChanges = (0, semantic_summarizer_1.extractFileChanges)(normalizedMessages, (collectedData?.observations || []));
        const enhancedFiles = (0, extractors_1.enhanceFilesWithSemanticDescriptions)(sessionData.FILES || [], semanticFileChanges);
        const IMPL_SUMMARY_MD = (0, semantic_summarizer_1.formatSummaryAsMarkdown)(implSummary);
        const HAS_IMPL = implSummary.filesCreated.length > 0 ||
            implSummary.filesModified.length > 0 ||
            implSummary.decisions.length > 0;
        log(`   Generated summary: ${implSummary.filesCreated.length} created, ${implSummary.filesModified.length} modified, ${implSummary.decisions.length} decisions\n`);
        // Step 7.6: Tree thinning — pre-pipeline token reduction
        // Operates on spec folder files BEFORE pipeline stages and scoring.
        // Bottom-up merging of small files reduces token overhead in the retrieval pipeline.
        log('Step 7.6: Applying tree thinning...');
        const thinFileInputs = enhancedFiles.map((f) => ({
            path: f.FILE_PATH,
            content: (0, workflow_path_utils_1.resolveTreeThinningContent)(f, specFolder),
        }));
        const thinningResult = (0, tree_thinning_1.applyTreeThinning)(thinFileInputs);
        const effectiveFiles = (0, alignment_validator_1.applyThinningToFileChanges)(enhancedFiles, thinningResult);
        const fileRowsReduced = Math.max(0, enhancedFiles.length - effectiveFiles.length);
        log(`   Tree thinning: ${thinningResult.stats.totalFiles} files, ` +
            `${thinningResult.stats.thinnedCount} content-as-summary, ` +
            `${thinningResult.stats.mergedCount} merged-into-parent, ` +
            `~${thinningResult.stats.tokensSaved} tokens saved, ` +
            `${fileRowsReduced} rendered rows reduced\n`);
        // Step 8: Populate templates
        log('Step 8: Populating template...');
        const specFolderBasename = path.basename(sessionData.SPEC_FOLDER || specFolderName);
        const folderBase = specFolderBasename.replace(/^\d+-/, '');
        let enrichedTask = implSummary.task;
        const dataSource = typeof collectedData?._source === 'string' ? collectedData._source : null;
        const specTitle = (0, title_builder_1.extractSpecTitle)(specFolder);
        const allowSpecTitleFallback = (0, task_enrichment_1.shouldEnrichTaskFromSpecTitle)(enrichedTask, dataSource, activeDataFile);
        if (allowSpecTitleFallback) {
            if (specTitle.length >= 8) {
                enrichedTask = specTitle;
                log(`   Enriched task from spec.md: "${enrichedTask}"`);
            }
        }
        const preferredMemoryTask = (0, task_enrichment_1.pickPreferredMemoryTask)(enrichedTask || '', specTitle, folderBase, [
            sessionData._JSON_SESSION_SUMMARY || '', // RC1: raw JSON sessionSummary as first candidate
            sessionData.QUICK_SUMMARY || '',
            sessionData.TITLE || '',
            sessionData.SUMMARY || '',
        ], allowSpecTitleFallback);
        // F-26: Load description.json to include memoryNameHistory in slug candidates
        let memoryNameHistoryForSlug = [];
        const slugApiModule = await tryImportMcpApi('@spec-kit/mcp-server/api');
        if (slugApiModule) {
            const pfDesc = slugApiModule.loadPerFolderDescription(path.resolve(specFolder));
            if (pfDesc?.memoryNameHistory) {
                memoryNameHistoryForSlug = pfDesc.memoryNameHistory;
            }
        }
        const contentSlug = (0, slug_utils_1.generateContentSlug)(preferredMemoryTask, folderBase, memoryNameHistoryForSlug);
        const rawCtxFilename = `${sessionData.DATE}_${sessionData.TIME}__${contentSlug}.md`;
        let ctxFilename = rawCtxFilename;
        const keyTopicsInitial = (0, topic_extractor_1.extractKeyTopics)(sessionData.SUMMARY, decisions.DECISIONS, specFolderName);
        const keyTopics = (0, frontmatter_editor_1.ensureMinSemanticTopics)(keyTopicsInitial, effectiveFiles, specFolderName);
        const memoryTitle = (0, title_builder_1.buildMemoryTitle)(preferredMemoryTask, specFolderName, sessionData.DATE, contentSlug);
        // Keep dashboard titles stable across duplicate-save retries so content dedup
        // compares the rendered memory itself, not a collision suffix.
        const memoryDashboardTitle = (0, title_builder_1.buildMemoryDashboardTitle)(memoryTitle, specFolderName, rawCtxFilename);
        const memoryDescription = (0, memory_frontmatter_1.deriveMemoryDescription)({
            summary: sessionData.SUMMARY,
            title: memoryTitle,
        });
        // Pre-extract trigger phrases for template embedding AND later indexing
        let preExtractedTriggers = [];
        try {
            // Build enriched text for trigger extraction from semantic session content only.
            const triggerSourceParts = [];
            if (sessionData.SUMMARY && sessionData.SUMMARY.length > 20) {
                triggerSourceParts.push(sessionData.SUMMARY);
            }
            decisions.DECISIONS.forEach((d) => {
                if (d.TITLE)
                    triggerSourceParts.push(d.TITLE);
                if (d.RATIONALE)
                    triggerSourceParts.push(d.RATIONALE);
                if (d.CONTEXT)
                    triggerSourceParts.push(d.CONTEXT);
                if (d.CHOSEN)
                    triggerSourceParts.push(d.CHOSEN);
            });
            effectiveFiles.forEach(f => {
                if (f._synthetic) {
                    return;
                }
                if (f.DESCRIPTION && !f.DESCRIPTION.includes('pending'))
                    triggerSourceParts.push(f.DESCRIPTION);
            });
            // Add spec folder name tokens as trigger source
            const folderNameForTriggers = specFolderName.replace(/^\d{1,3}-/, '').replace(/-/g, ' ');
            triggerSourceParts.push(folderNameForTriggers);
            const triggerSource = triggerSourceParts.join('\n');
            const autoExtractedTriggers = (0, trigger_extractor_1.extractTriggerPhrases)(triggerSource);
            const mergedTriggers = [];
            const seenMergedTriggers = new Set();
            // RC2: Merge manual trigger phrases from JSON into frontmatter triggers.
            // Manual phrases stay prepended, but the merged set still goes through the
            // same quality filter as auto-extracted phrases.
            if (collectedData?._manualTriggerPhrases && Array.isArray(collectedData._manualTriggerPhrases)) {
                for (const phrase of collectedData._manualTriggerPhrases) {
                    if (typeof phrase !== 'string') {
                        continue;
                    }
                    const trimmedPhrase = phrase.trim();
                    if (trimmedPhrase.length === 0) {
                        continue;
                    }
                    const loweredPhrase = trimmedPhrase.toLowerCase();
                    if (!seenMergedTriggers.has(loweredPhrase)) {
                        mergedTriggers.push(trimmedPhrase);
                        seenMergedTriggers.add(loweredPhrase);
                    }
                }
            }
            for (const phrase of autoExtractedTriggers) {
                const trimmedPhrase = phrase.trim();
                if (trimmedPhrase.length === 0) {
                    continue;
                }
                const loweredPhrase = trimmedPhrase.toLowerCase();
                if (!seenMergedTriggers.has(loweredPhrase)) {
                    mergedTriggers.push(trimmedPhrase);
                    seenMergedTriggers.add(loweredPhrase);
                }
            }
            // Phase 004 T011-T013: Filter the merged trigger set so manual phrases
            // follow the same quality rules as auto-extracted phrases.
            preExtractedTriggers = filterTriggerPhrases(mergedTriggers);
            const folderTokens = folderNameForTriggers.split(/\s+/).filter(t => t.length >= 3);
            const existingLower = new Set(preExtractedTriggers.map(p => p.toLowerCase()));
            // CG-04: Domain-specific stopwords for single-word trigger phrases from folder names
            const FOLDER_STOPWORDS = new Set([
                'system', 'spec', 'kit', 'hybrid', 'rag', 'fusion', 'agents', 'alignment',
                'opencode', 'config', 'setup', 'init', 'core', 'main', 'base', 'common',
                'shared', 'utils', 'helpers', 'tools', 'scripts', 'tests', 'docs', 'build',
                'deploy', 'release', 'version', 'update', 'fix', 'feature', 'enhancement',
                'refactor', 'cleanup', 'migration', 'integration', 'implementation',
                'based', 'features', 'perfect', 'session', 'capturing', 'pipeline',
                'quality', 'command', 'skill', 'memory', 'context', 'search', 'index',
                'generation', 'epic', 'audit', 'enforcement', 'remediation',
            ]);
            for (const token of folderTokens) {
                // CG-04: Skip single words that are domain stopwords
                if (FOLDER_STOPWORDS.has(token.toLowerCase())) {
                    continue;
                }
                if (!existingLower.has(token.toLowerCase())) {
                    preExtractedTriggers.push(token.toLowerCase());
                    existingLower.add(token.toLowerCase());
                }
            }
            preExtractedTriggers = (0, frontmatter_editor_1.ensureMinTriggerPhrases)(preExtractedTriggers, effectiveFiles, specFolderName);
            log(`   Pre-extracted ${preExtractedTriggers.length} trigger phrases`);
        }
        catch (e) {
            const errMsg = e instanceof Error ? e.message : String(e);
            warn(`   Warning: Pre-extraction of trigger phrases failed: ${errMsg}`);
        }
        const keyFiles = (0, workflow_path_utils_1.buildKeyFiles)(enhancedFiles, specFolder);
        const memoryClassification = (0, memory_metadata_1.buildMemoryClassificationContext)(collectedData, sessionData);
        const sessionDedup = (0, memory_metadata_1.buildSessionDedupContext)(collectedData, sessionData, memoryTitle);
        const causalLinks = (0, memory_metadata_1.buildCausalLinksContext)(collectedData);
        const effectiveDecisionCount = Math.max(sessionData.DECISION_COUNT, decisions.DECISIONS.length);
        const files = {
            [ctxFilename]: await (0, renderers_1.populateTemplate)('context', {
                ...sessionData,
                ...conversations,
                ...workflowData,
                // RC-9: Re-assert TOOL_COUNT after spreading conversations ONLY in
                // Captured-session mode, because conversations object contains TOOL_COUNT: 0
                // Which overwrites the patched value from captured-session enrichment.
                // Non-captured flows should keep conversations.TOOL_COUNT as-is.
                // O1-4: Uses patchedToolCount (local variable) instead of mutated sessionData.
                ...(isCapturedSessionMode ? { TOOL_COUNT: patchedToolCount } : {}),
                FILES: effectiveFiles,
                HAS_FILES: effectiveFiles.length > 0,
                MESSAGE_COUNT: conversations.MESSAGES.length,
                DECISION_COUNT: effectiveDecisionCount,
                DIAGRAM_COUNT: diagrams.DIAGRAMS.length,
                PHASE_COUNT: conversations.PHASE_COUNT,
                // P1-4: Convert 0-1 confidence to 0-100 for template percentage rendering
                DECISIONS: decisions.DECISIONS.map((d) => ({
                    ...d,
                    ...(() => {
                        const overallConfidence = d.CONFIDENCE <= 1 ? Math.round(d.CONFIDENCE * 100) : Math.round(d.CONFIDENCE);
                        const choiceConfidence = d.CHOICE_CONFIDENCE <= 1 ? Math.round(d.CHOICE_CONFIDENCE * 100) : Math.round(d.CHOICE_CONFIDENCE);
                        const rationaleConfidence = d.RATIONALE_CONFIDENCE <= 1 ? Math.round(d.RATIONALE_CONFIDENCE * 100) : Math.round(d.RATIONALE_CONFIDENCE);
                        return {
                            CHOICE_CONFIDENCE: choiceConfidence,
                            RATIONALE_CONFIDENCE: rationaleConfidence,
                            CONFIDENCE: overallConfidence,
                            HAS_SPLIT_CONFIDENCE: Math.abs(choiceConfidence - rationaleConfidence) > 10,
                        };
                    })(),
                })),
                HIGH_CONFIDENCE_COUNT: decisions.HIGH_CONFIDENCE_COUNT,
                MEDIUM_CONFIDENCE_COUNT: decisions.MEDIUM_CONFIDENCE_COUNT,
                LOW_CONFIDENCE_COUNT: decisions.LOW_CONFIDENCE_COUNT,
                FOLLOWUP_COUNT: decisions.FOLLOWUP_COUNT,
                HAS_AUTO_GENERATED: diagrams.HAS_AUTO_GENERATED,
                FLOW_TYPE: diagrams.FLOW_TYPE,
                AUTO_CONVERSATION_FLOWCHART: diagrams.AUTO_CONVERSATION_FLOWCHART,
                AUTO_DECISION_TREES: diagrams.AUTO_DECISION_TREES,
                DIAGRAMS: diagrams.DIAGRAMS,
                IMPLEMENTATION_SUMMARY: IMPL_SUMMARY_MD,
                HAS_IMPLEMENTATION_SUMMARY: HAS_IMPL,
                IMPL_TASK: implSummary.task,
                IMPL_SOLUTION: implSummary.solution,
                IMPL_FILES_CREATED: implSummary.filesCreated,
                IMPL_FILES_MODIFIED: implSummary.filesModified,
                IMPL_DECISIONS: implSummary.decisions,
                IMPL_OUTCOMES: implSummary.outcomes,
                HAS_IMPL_FILES_CREATED: implSummary.filesCreated.length > 0,
                HAS_IMPL_FILES_MODIFIED: implSummary.filesModified.length > 0,
                HAS_IMPL_DECISIONS: implSummary.decisions.length > 0,
                HAS_IMPL_OUTCOMES: implSummary.outcomes.length > 0 && implSummary.outcomes[0] !== 'Session completed',
                TOPICS: keyTopics,
                HAS_KEY_TOPICS: keyTopics.length > 0,
                TRIGGER_PHRASES: preExtractedTriggers,
                TRIGGER_PHRASES_YAML: (0, frontmatter_editor_1.renderTriggerPhrasesYaml)(preExtractedTriggers),
                KEY_FILES: keyFiles,
                ...memoryClassification,
                ...sessionDedup,
                ...causalLinks,
                RELATED_SESSIONS: [],
                PARENT_SPEC: sessionData.SPEC_FOLDER || '',
                CHILD_SESSIONS: [],
                EMBEDDING_MODEL: embeddings_1.MODEL_NAME || 'text-embedding-3-small',
                EMBEDDING_VERSION: '1.0',
                CHUNK_COUNT: 1,
                MEMORY_TITLE: memoryTitle,
                MEMORY_DASHBOARD_TITLE: memoryDashboardTitle,
                MEMORY_DESCRIPTION: memoryDescription,
                GRAPH_CONTEXT: '',
                HAS_GRAPH_CONTEXT: false,
                // Phase 004 T020: Bind toolCalls and exchanges from CollectedDataBase to template context
                hasToolCalls: Array.isArray(collectedData.toolCalls) &&
                    collectedData.toolCalls.length > 0,
                TOOL_CALLS_COMPACT: Array.isArray(collectedData.toolCalls)
                    ? collectedData.toolCalls
                        .slice(0, 3)
                        .map(tc => `\`${tc.tool || tc.name || 'unknown'}\` (${tc.count || 1})`)
                        .join(' | ')
                    : '',
                hasExchanges: Array.isArray(collectedData.exchanges) &&
                    collectedData.exchanges.length > 0,
                EXCHANGES_COMPACT: (() => {
                    const exchanges = collectedData.exchanges;
                    if (!Array.isArray(exchanges) || exchanges.length === 0)
                        return '';
                    const topics = exchanges
                        .slice(0, 3)
                        .map(ex => ex.topic || ex.userInput || 'exchange')
                        .filter(Boolean)
                        .map(t => `\`${t}\``)
                        .join(', ');
                    return `${exchanges.length} exchanges${topics ? ` \u2014 ${topics}` : ''}`;
                })(),
            }),
            'metadata.json': JSON.stringify({
                timestamp: `${sessionData.DATE} ${sessionData.TIME}`,
                messageCount: sessionData.MESSAGE_COUNT,
                decisionCount: decisions.DECISIONS.length,
                diagramCount: diagrams.DIAGRAMS.length,
                skillVersion: config_1.CONFIG.SKILL_VERSION,
                autoTriggered: (0, collect_session_data_1.shouldAutoSave)(sessionData.MESSAGE_COUNT),
                filtering: {
                    ...filterPipeline.getStats(),
                    // RC-7: Clarify the two scoring systems to prevent confusion.
                    // Metadata.json qualityScore is 0-100 (legacy scorer), while
                    // Frontmatter quality_score is 0.0-1.0 (v2 scorer). Different metrics.
                    _note: 'qualityScore is 0-100 scale (legacy scorer); frontmatter quality_score is 0.0-1.0 (v2 scorer)',
                },
                contaminationAudit: contaminationAuditTrail,
                semanticSummary: {
                    task: implSummary.task.substring(0, 100),
                    filesCreated: implSummary.filesCreated.length,
                    filesModified: implSummary.filesModified.length,
                    decisions: implSummary.decisions.length,
                    messageStats: implSummary.messageStats
                },
                fileCounts: {
                    fileCount: sessionData.FILE_COUNT,
                    capturedFileCount: sessionData.CAPTURED_FILE_COUNT,
                    filesystemFileCount: sessionData.FILESYSTEM_FILE_COUNT,
                    gitChangedFileCount: sessionData.GIT_CHANGED_FILE_COUNT,
                },
                sourceProvenance: {
                    transcriptPath: sessionData.SOURCE_TRANSCRIPT_PATH,
                    sessionId: sessionData.SOURCE_SESSION_ID,
                    sessionCreated: sessionData.SOURCE_SESSION_CREATED,
                    sessionUpdated: sessionData.SOURCE_SESSION_UPDATED,
                },
                embedding: {
                    status: 'pending',
                    model: embeddings_1.MODEL_NAME,
                    dimensions: embeddings_1.EMBEDDING_DIM
                }
            }, null, 2)
        };
        let duplicateExistingFilename = null;
        const existingRawPath = path.join(contextDir, rawCtxFilename);
        if (fsSync.existsSync(existingRawPath)) {
            try {
                const existingRawContent = fsSync.readFileSync(existingRawPath, 'utf-8');
                if (existingRawContent === files[ctxFilename]) {
                    duplicateExistingFilename = rawCtxFilename;
                }
                else {
                    const uniqueCtxFilename = (0, slug_utils_1.ensureUniqueMemoryFilename)(contextDir, rawCtxFilename);
                    if (uniqueCtxFilename !== ctxFilename) {
                        files[uniqueCtxFilename] = files[ctxFilename];
                        delete files[ctxFilename];
                        ctxFilename = uniqueCtxFilename;
                    }
                }
            }
            catch (e) {
                const errMsg = e instanceof Error ? e.message : String(e);
                warn(`   Warning: Could not preflight duplicate check for ${rawCtxFilename}: ${errMsg}`);
            }
        }
        const isSimulation = !collectedData || !!collectedData._isSimulation || simFactory.requiresSimulation(collectedData);
        log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);
        // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
        // Preserves HTML inside fenced code blocks (```...```) which is legitimate code.
        log('Step 8.5: Content cleaning...');
        const rawContent = files[ctxFilename];
        const cleanedContent = (0, content_cleaner_1.stripWorkflowHtmlOutsideCodeFences)(rawContent);
        // Only update if cleaning made changes
        if (cleanedContent !== rawContent) {
            files[ctxFilename] = cleanedContent;
            log('   Stripped leaked HTML tags from content (code blocks preserved)');
        }
        else {
            log('   No HTML cleaning needed');
        }
        // Step 8.6: Quality validation + scoring
        log('Step 8.6: Quality scoring...');
        const qualityValidation = (0, validate_memory_quality_1.validateMemoryQualityContent)(files[ctxFilename]);
        contaminationAuditTrail.push(qualityValidation.contaminationAudit);
        const metadataJson = JSON.parse(files['metadata.json']);
        metadataJson.contaminationAudit = contaminationAuditTrail;
        files['metadata.json'] = JSON.stringify(metadataJson, null, 2);
        const qualitySignals = qualityValidation.ruleResults.map((rule) => ({
            ruleId: rule.ruleId,
            passed: rule.passed,
        }));
        const sufficiencySnapshot = (0, memory_metadata_1.buildWorkflowMemoryEvidenceSnapshot)({
            title: memoryTitle,
            content: files[ctxFilename],
            triggerPhrases: preExtractedTriggers,
            files: effectiveFiles,
            observations: sessionData.OBSERVATIONS || [],
            decisions: decisions.DECISIONS,
            outcomes: sessionData.OUTCOMES || [],
            nextAction: sessionData.NEXT_ACTION,
            blockers: sessionData.BLOCKERS,
            recentContext: collectedData.recentContext,
        });
        const sufficiencyResult = (0, memory_sufficiency_1.evaluateMemorySufficiency)(sufficiencySnapshot);
        const qualityV2 = (0, quality_scorer_1.scoreMemoryQuality)({
            content: files[ctxFilename],
            validatorSignals: qualitySignals,
            hadContamination,
            contaminationSeverity: contaminationMaxSeverity,
            messageCount: conversations.MESSAGES.length,
            toolCount: patchedToolCount,
            decisionCount: effectiveDecisionCount,
            sufficiencyScore: sufficiencyResult.score,
            insufficientContext: !sufficiencyResult.pass,
        });
        files[ctxFilename] = (0, frontmatter_editor_1.injectQualityMetadata)(files[ctxFilename], qualityV2.score01, qualityV2.qualityFlags);
        // Step 8.5b: Spec document health annotation (non-blocking)
        let specDocHealth = null;
        try {
            const specFolderAbsForHealth = path.resolve(specFolder);
            specDocHealth = (0, spec_doc_health_1.evaluateSpecDocHealth)(specFolderAbsForHealth);
            if (!specDocHealth.pass) {
                log(`   Spec doc health: ${specDocHealth.errors} errors, ${specDocHealth.warnings} warnings (score: ${specDocHealth.score})`);
            }
            files[ctxFilename] = (0, frontmatter_editor_1.injectSpecDocHealthMetadata)(files[ctxFilename], specDocHealth);
        }
        catch (e) {
            // Non-blocking — health annotation failure must not prevent memory save
            log(`   Spec doc health check skipped: ${e instanceof Error ? e.message : String(e)}`);
        }
        // CG-07b: Validate template contract BEFORE any banner/warning is prepended.
        // Banners prepended after this point (low-quality, simulation, medium-quality)
        // would shift the frontmatter away from position 0, causing false
        // missing_frontmatter violations when the contract is checked later.
        const templateContractEarly = (0, memory_template_contract_1.validateMemoryTemplateContract)(files[ctxFilename]);
        if (!templateContractEarly.valid) {
            const contractDetails = templateContractEarly.violations
                .map((violation) => violation.sectionId ? `${violation.code}:${violation.sectionId}` : violation.code)
                .join(', ');
            const contractAbortMsg = `QUALITY_GATE_ABORT: Rendered memory violated template contract: ${contractDetails}`;
            warn(contractAbortMsg);
            throw new Error(contractAbortMsg);
        }
        if (filterStats.qualityScore < 20) {
            const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
            files[ctxFilename] = insertAfterFrontmatter(files[ctxFilename], warningHeader);
            log(`   Warning: Low quality session (${filterStats.qualityScore}/100) - warning header added`);
        }
        if (isSimulation) {
            const simWarning = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
            files[ctxFilename] = insertAfterFrontmatter(files[ctxFilename], simWarning);
            log('   Warning: Simulation mode: placeholder content warning added');
        }
        if (!qualityValidation.valid) {
            warn(`QUALITY_GATE_FAIL: ${qualityValidation.failedRules.join(', ')}`);
        }
        // Unified quality scoring: use v2 scorer for all decisions (abort, index, metadata)
        const qualityResult = qualityV2;
        log(`   Memory quality score: ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)})`);
        if (qualityResult.warnings.length > 0) {
            for (const warning of qualityResult.warnings) {
                warn(`   Quality warning: ${warning}`);
            }
        }
        if (qualityResult.dimensions && qualityResult.dimensions.length > 0) {
            const dimSummary = qualityResult.dimensions
                .filter((d) => !d.passed)
                .map((d) => d.id)
                .join(', ');
            if (dimSummary) {
                log(`   Failed dimensions: ${dimSummary}`);
            }
        }
        if (!sufficiencyResult.pass) {
            const insufficiencyAbortMsg = (0, quality_gates_1.formatSufficiencyAbort)(sufficiencyResult);
            warn(insufficiencyAbortMsg);
            throw new Error(insufficiencyAbortMsg);
        }
        const QUALITY_ABORT_THRESHOLD = config_1.CONFIG.QUALITY_ABORT_THRESHOLD;
        if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
            const abortMsg = `QUALITY_GATE_ABORT: Memory quality score ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}) ` +
                `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
                `This typically means the captured session data does not contain meaningful content for this spec folder. ` +
                `To force save, pass data via JSON file instead of runtime capture.`;
            warn(abortMsg);
            throw new Error(abortMsg);
        }
        const validationDisposition = (0, validate_memory_quality_1.determineValidationDisposition)(qualityValidation.failedRules, captureSource);
        if (validationDisposition.disposition === 'abort_write') {
            const failedContaminationRules = validationDisposition.blockingRuleIds.filter((ruleId) => ruleId === 'V8' || ruleId === 'V9');
            if (failedContaminationRules.length > 0) {
                const contaminationAbortMsg = `CONTAMINATION_GATE_ABORT: Critical contamination rules failed: [${failedContaminationRules.join(', ')}]. ` +
                    `Content contains cross-spec contamination that would corrupt the memory index. Aborting write.`;
                warn(contaminationAbortMsg);
                throw new Error(contaminationAbortMsg);
            }
            const validationAbortMsg = `QUALITY_GATE_ABORT: Save blocked due to failed validation rules: ${validationDisposition.blockingRuleIds.join(', ')}`;
            warn(validationAbortMsg);
            throw new Error(validationAbortMsg);
        }
        if (qualityValidation.failedRules.length > 0) {
            if (validationDisposition.disposition === 'write_skip_index') {
                warn(`QUALITY_GATE_WARN: Save continuing, but semantic indexing will be skipped due to validation rules: ` +
                    `${validationDisposition.indexBlockingRuleIds.join(', ')}`);
            }
            else if (captureCapabilities.inputMode === 'captured') {
                warn(`QUALITY_GATE_WARN: Captured-session save continuing despite soft validation failures: ${qualityValidation.failedRules.join(', ')}`);
            }
            else {
                warn(`QUALITY_GATE_WARN: Structured save continuing despite soft validation failures: ${qualityValidation.failedRules.join(', ')}`);
            }
        }
        // CG-07: Add warning banner for medium-quality scores (0.30-0.60)
        if (qualityResult.score01 < 0.6 && qualityResult.score01 >= QUALITY_ABORT_THRESHOLD) {
            const mediumQualityWarning = `> **Warning:** Memory quality score is ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}), which is below the recommended threshold of 0.60. Content may have issues with: ${qualityResult.warnings.slice(0, 3).join('; ')}.\n\n`;
            files[ctxFilename] = insertAfterFrontmatter(files[ctxFilename], mediumQualityWarning);
            log(`   Medium quality warning added (score: ${qualityResult.score100}/100)`);
        }
        // Phase 004 T035-T036: Pre-save overlap check (advisory, enabled by default — set SPECKIT_PRE_SAVE_DEDUP=false to disable)
        if (process.env.SPECKIT_PRE_SAVE_DEDUP !== 'false' && process.env.SPECKIT_PRE_SAVE_DEDUP !== '0') {
            try {
                const crypto = await Promise.resolve().then(() => __importStar(require('node:crypto')));
                const contentForHash = files[ctxFilename] || '';
                const fingerprint = crypto.createHash('sha1').update(contentForHash).digest('hex');
                // Query last 20 memories for this spec folder to detect overlaps
                const candidateFiles = fsSync.readdirSync(contextDir)
                    .filter((f) => f.endsWith('.md') && f !== ctxFilename)
                    .sort()
                    .slice(-12);
                const candidateFilesBySize = candidateFiles.filter((existingFile) => {
                    try {
                        const existingStats = fsSync.statSync(path.join(contextDir, existingFile));
                        return existingStats.size === Buffer.byteLength(contentForHash, 'utf8');
                    }
                    catch {
                        return false;
                    }
                });
                for (const existingFile of candidateFilesBySize) {
                    try {
                        const existingContent = fsSync.readFileSync(path.join(contextDir, existingFile), 'utf8');
                        const existingHash = crypto.createHash('sha1').update(existingContent).digest('hex');
                        if (existingHash === fingerprint) {
                            warn(`   [PRE-SAVE OVERLAP] Memory content matches existing "${existingFile}" — possible duplicate save`);
                            break;
                        }
                    }
                    catch (e) {
                        console.warn('[pre-save-overlap] File read failed:', e instanceof Error ? e.message : String(e));
                    }
                }
            }
            catch (overlapErr) {
                // Fail open — overlap detection is advisory, must not block save
                warn(`   Pre-save overlap check failed (advisory): ${overlapErr instanceof Error ? overlapErr.message : String(overlapErr)}`);
            }
        }
        // Step 9: Write files with atomic writes and rollback on failure
        log('Step 9: Writing files...');
        if (duplicateExistingFilename) {
            log(`   Skipping ${ctxFilename}: duplicate of existing ${duplicateExistingFilename}`);
            delete files[ctxFilename];
        }
        const writtenFiles = await (0, file_writer_1.writeFilesAtomically)(contextDir, files);
        // RC-6 fix: Check if the primary context file was actually written (it may
        // Have been skipped as a duplicate). Guard downstream operations accordingly.
        const ctxFileWritten = writtenFiles.includes(ctxFilename);
        // Update per-folder description.json memory tracking (only if file was written)
        if (ctxFileWritten) {
            try {
                const descApiModule = await tryImportMcpApi('@spec-kit/mcp-server/api');
                if (!descApiModule)
                    throw new Error('MCP server API unavailable for description update');
                const { loadPerFolderDescription: loadPFD, savePerFolderDescription: savePFD, generatePerFolderDescription: genPFD } = descApiModule;
                const specFolderAbsolute = path.resolve(specFolder);
                let existing = loadPFD(specFolderAbsolute);
                // F-36: Regenerate missing/corrupt description.json from spec.md + path structure
                if (!existing) {
                    const specsBaseDirs = Array.from(new Set([
                        ...(0, config_1.getSpecsDirectories)(),
                        path.join(config_1.CONFIG.PROJECT_ROOT, 'specs'),
                        path.join(config_1.CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
                    ]));
                    for (const base of specsBaseDirs) {
                        const regenerated = genPFD(specFolderAbsolute, path.resolve(base));
                        if (regenerated) {
                            savePFD(regenerated, specFolderAbsolute);
                            existing = regenerated;
                            log('   Regenerated missing description.json');
                            break;
                        }
                    }
                }
                if (existing) {
                    const MAX_MEMORY_SEQUENCE_RETRIES = 3;
                    const MEMORY_SEQUENCE_RETRY_DELAY_MS = 25;
                    let memorySequenceUpdated = false;
                    for (let attempt = 1; attempt <= MAX_MEMORY_SEQUENCE_RETRIES; attempt++) {
                        const sequenceSnapshot = attempt === 1 ? existing : loadPFD(specFolderAbsolute);
                        if (!sequenceSnapshot) {
                            break;
                        }
                        // Integration-tested via workflow-memory-tracking.vitest.ts (F3 coverage).
                        const rawSeq = Number(sequenceSnapshot.memorySequence) || 0;
                        // Defensive clamp handles Infinity/NaN/negative/overflow edge cases (F11 fix).
                        const expectedSeq = (Number.isSafeInteger(rawSeq) && rawSeq >= 0) ? rawSeq + 1 : 1;
                        sequenceSnapshot.memorySequence = expectedSeq;
                        sequenceSnapshot.memoryNameHistory = [
                            ...(sequenceSnapshot.memoryNameHistory || []).slice(-19),
                            ctxFilename,
                        ];
                        savePFD(sequenceSnapshot, specFolderAbsolute);
                        const verified = loadPFD(specFolderAbsolute);
                        if (verified && verified.memorySequence === expectedSeq) {
                            memorySequenceUpdated = true;
                            break;
                        }
                        if (attempt < MAX_MEMORY_SEQUENCE_RETRIES) {
                            console.warn(`[workflow] memorySequence lost-update detected on attempt ${attempt}; retrying`);
                            await new Promise((resolve) => setTimeout(resolve, MEMORY_SEQUENCE_RETRY_DELAY_MS));
                        }
                    }
                    if (!memorySequenceUpdated) {
                        console.warn('[workflow] memorySequence update could not be confirmed after 3 attempts; continuing');
                    }
                }
            }
            catch (descErr) {
                // F-34: Log error instead of silently swallowing
                console.warn(`[workflow] description.json tracking error: ${descErr instanceof Error ? descErr.message : String(descErr)}`);
            }
        }
        else {
            log('   Context file was a duplicate — skipping description tracking');
        }
        log();
        // Step 10: Success confirmation (file written; indexing runs in Step 11)
        log('Context file written.\n');
        log(`Location: ${contextDir}\n`);
        log('Files created:');
        for (const [filename, content] of Object.entries(files)) {
            const lines = content.split('\n').length;
            log(`  - ${filename} (${lines} lines)`);
        }
        log();
        log('Summary:');
        log(`  - ${conversations.MESSAGES.length} messages captured`);
        log(`  - ${effectiveDecisionCount} key decisions documented`);
        log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
        log(`  - Session duration: ${sessionData.DURATION}\n`);
        // Step 10.5: Post-save quality review (JSON mode only)
        if (ctxFileWritten && captureCapabilities.inputMode !== 'captured') {
            const savedFilePath = path.join(contextDir, ctxFilename);
            const jsonSessionSummary = typeof collectedData?._JSON_SESSION_SUMMARY === 'string'
                ? collectedData._JSON_SESSION_SUMMARY
                : undefined;
            const reviewResult = (0, post_save_review_1.reviewPostSaveQuality)({
                savedFilePath,
                collectedData: collectedData
                    ? {
                        ...collectedData,
                        sessionSummary: collectedData.sessionSummary || jsonSessionSummary,
                    }
                    : collectedData,
                inputMode: captureCapabilities.inputMode,
            });
            (0, post_save_review_1.printPostSaveReview)(reviewResult);
            // Phase 002 T035: Log post-save review score impact (advisory — does not patch saved file
            // to preserve content-based duplicate detection at line 1259)
            if (reviewResult.status === 'ISSUES_FOUND' && reviewResult.issues.length > 0) {
                const scorePenalty = (0, post_save_review_1.computeReviewScorePenalty)(reviewResult.issues);
                if (scorePenalty < 0) {
                    log(`   Post-save review: quality_score penalty ${scorePenalty.toFixed(2)} (${reviewResult.issues.length} issues found)`);
                }
            }
        }
        // Step 11: Semantic memory indexing
        log('Step 11: Indexing semantic memory...');
        let memoryId = null;
        let indexingStatus = null;
        const workflowWarnings = [];
        const persistIndexingStatus = async (status, reason, errorMessage) => {
            indexingStatus = {
                status,
                memoryId,
                ...(reason ? { reason } : {}),
                ...(errorMessage ? { errorMessage } : {}),
            };
            const persisted = await (0, memory_indexer_1.updateMetadataEmbeddingStatus)(contextDir, indexingStatus);
            if (!persisted) {
                const warning = `Failed to persist embedding metadata status to ${path.join(contextDir, 'metadata.json')}.`;
                workflowWarnings.push(warning);
                warn(`   Warning: ${warning}`);
            }
        };
        // RC-6 fix: Only index if the context file was actually written (not a duplicate skip)
        if (!ctxFileWritten) {
            log('   Skipping indexing — context file was a duplicate');
            await persistIndexingStatus('skipped_duplicate', 'Context file content matched an existing memory file, so semantic indexing was skipped.');
        }
        else {
            try {
                const indexDecision = (0, quality_gates_1.shouldIndexMemory)({
                    ctxFileWritten,
                    validationDisposition,
                    templateContractValid: templateContractEarly.valid,
                    sufficiencyPass: sufficiencyResult.pass,
                    qualityScore01: qualityResult.score01,
                    qualityAbortThreshold: QUALITY_ABORT_THRESHOLD,
                });
                if (indexDecision.shouldIndex) {
                    const embeddingSections = (0, semantic_summarizer_1.buildWeightedEmbeddingSections)(implSummary, files[ctxFilename]);
                    memoryId = await (0, memory_indexer_1.indexMemory)(contextDir, ctxFilename, files[ctxFilename], specFolderName, collectedData, preExtractedTriggers, embeddingSections);
                    if (memoryId !== null) {
                        log(`   Indexed as memory #${memoryId} (${embeddings_1.EMBEDDING_DIM} dimensions)`);
                        await persistIndexingStatus('indexed', qualityValidation.failedRules.length > 0
                            ? `Indexed despite soft validation failures: ${qualityValidation.failedRules.join(', ')}.`
                            : 'Indexed after all write and semantic-index gates passed.');
                        log('   Updated metadata.json with embedding info');
                    }
                    else {
                        log('   Embedding unavailable — semantic indexing skipped');
                        await persistIndexingStatus('skipped_embedding_unavailable', 'Embedding generation returned null, so semantic indexing was skipped for this saved memory.');
                    }
                }
                else {
                    log('   Index policy: skipping semantic indexing for this file');
                    await persistIndexingStatus(validationDisposition.disposition === 'write_skip_index' ? 'skipped_index_policy' : 'skipped_quality_gate', indexDecision.reason ?? 'Rendered memory failed validation, so semantic indexing was skipped.');
                }
            }
            catch (e) {
                const errMsg = e instanceof Error ? e.message : String(e);
                await persistIndexingStatus('failed_embedding', 'Embedding generation or semantic indexing failed after the memory file was written.', errMsg);
                warn(`   Warning: Embedding failed: ${errMsg}`);
                warn('   Context file saved without semantic indexing');
                warn('   Run "npm run rebuild" to retry indexing later');
            }
        }
        // Step 12: Opportunistic retry processing
        try {
            const retryManager = await loadWorkflowRetryManager();
            const retryManagerLoadIssue = consumeWorkflowRetryManagerLoadError();
            if (retryManagerLoadIssue) {
                warn(`   Warning: Retry manager unavailable; skipping retry queue processing (${retryManagerLoadIssue})`);
            }
            const retryStats = retryManager.getRetryStats();
            if (retryStats.queue_size > 0) {
                log('Step 12: Processing retry queue...');
                const results = await retryManager.processRetryQueue(3);
                if (results.processed > 0) {
                    log(`   Processed ${results.processed} pending embeddings`);
                    log(`   Succeeded: ${results.succeeded}, Failed: ${results.failed}`);
                }
            }
        }
        catch (e) {
            const errMsg = e instanceof Error ? e.message : String(e);
            warn(`   Warning: Retry processing error: ${errMsg}`);
        }
        log();
        return {
            contextDir,
            specFolder,
            specFolderName,
            contextFilename: ctxFilename,
            writtenFiles,
            memoryId,
            indexingStatus: indexingStatus ?? {
                status: 'failed_embedding',
                memoryId,
                reason: 'Indexing status was not finalized before workflow completion.',
            },
            warnings: workflowWarnings,
            stats: {
                messageCount: conversations.MESSAGES.length,
                decisionCount: decisions.DECISIONS.length,
                diagramCount: diagrams.DIAGRAMS.length,
                qualityScore: qualityResult.score,
                isSimulation
            }
        };
    });
}
// ───────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────
var content_cleaner_2 = require("./content-cleaner");
Object.defineProperty(exports, "stripWorkflowHtmlOutsideCodeFences", { enumerable: true, get: function () { return content_cleaner_2.stripWorkflowHtmlOutsideCodeFences; } });
//# sourceMappingURL=workflow.js.map