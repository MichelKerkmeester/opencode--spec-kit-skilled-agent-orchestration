"use strict";
// ---------------------------------------------------------------
// MODULE: Generate Context
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
exports.main = main;
exports.readAllStdin = readAllStdin;
exports.parseArguments = parseArguments;
exports.validateArguments = validateArguments;
exports.isValidSpecFolder = isValidSpecFolder;
exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const path_security_1 = require("@spec-kit/shared/utils/path-security");
const core_1 = require("../core");
const workflow_1 = require("../core/workflow");
const loaders_1 = require("../loaders");
const collect_session_data_1 = require("../extractors/collect-session-data");
// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID for deterministic Claude Code transcript selection

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
}
// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;
// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal) {
    if (shuttingDown)
        return; // prevent re-entrant handling
    shuttingDown = true;
    let lockReleaseFailed = false;
    try {
        (0, workflow_1.releaseFilesystemLock)();
    }
    catch (_err) {
        lockReleaseFailed = true;
    }
    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
    process.exit(lockReleaseFailed ? 1 : 0);
}
function installSignalHandlers() {
    if (signalHandlersInstalled) {
        return;
    }
    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
    signalHandlersInstalled = true;
}
// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput) {
    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
}
function isValidSpecFolder(folderPath) {
    const folderName = path.basename(folderPath);
    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
    // Extract the trailing portion that might be "parent/child"
    const trailingSegments = normalizedInput.split('/');
    // Check if the last two segments both match the spec folder pattern
    if (trailingSegments.length >= 2) {
        const lastTwo = trailingSegments.slice(-2);
        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
            // Both segments are valid spec folder names — valid nested spec folder
            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
            if (!hasSpecsParent) {
                // Fallback: check if the path resolves to an existing directory under any specs root
                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                    const candidate = path.join(specsDir, normalizedInput);
                    if (!path.isAbsolute(normalizedInput) &&
                        fsSync.existsSync(candidate) &&
                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
                        return { valid: true };
                    }
                }
                return {
                    valid: false,
                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
                };
            }
            return { valid: true };
        }
    }
    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
        if (/^\d{3}-/.test(folderName)) {
            if (/[A-Z]/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should be lowercase' };
            }
            if (/_/.test(folderName)) {
                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
            }
            if (!/^[a-z]/.test(folderName.slice(4))) {
                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
            }
        }
        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
    }
    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
    if (!hasSpecsParent) {
        // Fallback: check if bare name can be resolved via recursive child search
        // (findChildFolderSync in validateArguments handles this, so just report the error here)
        return {
            valid: false,
            reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
    }
    return { valid: true };
}
function resolveCliSpecFolderReference(rawArg) {
    const folderName = path.basename(rawArg);
    const explicitProjectScopedPath = !rawArg.endsWith('.json') && (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/'))
        ? path.join(core_1.CONFIG.PROJECT_ROOT, rawArg)
        : null;
    let resolvedNestedPath = null;
    if (!rawArg.endsWith('.json')) {
        if (path.isAbsolute(rawArg)) {
            const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
            const lastSegment = absoluteSegments.at(-1);
            const parentSegment = absoluteSegments.at(-2);
            if ((lastSegment && core_1.SPEC_FOLDER_PATTERN.test(lastSegment)) ||
                (parentSegment && lastSegment && core_1.SPEC_FOLDER_PATTERN.test(parentSegment) && core_1.SPEC_FOLDER_PATTERN.test(lastSegment))) {
                resolvedNestedPath = rawArg;
            }
        }
        let cleaned = rawArg;
        if (cleaned.startsWith('.opencode/specs/')) {
            cleaned = cleaned.slice('.opencode/specs/'.length);
        }
        else if (cleaned.startsWith('specs/')) {
            cleaned = cleaned.slice('specs/'.length);
        }
        cleaned = cleaned.replace(/\/+$/, '');
        if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
            resolvedNestedPath = explicitProjectScopedPath;
        }
        const segments = cleaned.split('/');
        if (!resolvedNestedPath && segments.length >= 2) {
            for (const specsDir of (0, core_1.getSpecsDirectories)()) {
                const candidate = path.join(specsDir, ...segments);
                if (fsSync.existsSync(candidate)) {
                    resolvedNestedPath = candidate;
                    break;
                }
            }
            if (!resolvedNestedPath && core_1.SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
                const activeDir = (0, core_1.findActiveSpecsDir)();
                if (activeDir) {
                    resolvedNestedPath = path.join(activeDir, ...segments);
                }
            }
        }
    }
    if (resolvedNestedPath) {
        return resolvedNestedPath;
    }
    const isSpecFolderPath = (rawArg.startsWith('specs/') ||
        rawArg.startsWith('.opencode/specs/') ||
        core_1.SPEC_FOLDER_BASIC_PATTERN.test(folderName)) && !rawArg.endsWith('.json');
    return isSpecFolderPath ? rawArg : null;
}
function extractPayloadSpecFolder(data) {
    for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
        const value = data[key];
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }
    return null;
}
async function readAllStdin(stdin = process.stdin) {
    return await new Promise((resolve, reject) => {
        let buffer = '';
        stdin.setEncoding('utf8');
        stdin.on('data', (chunk) => {
            buffer += chunk;
        });
        stdin.on('end', () => resolve(buffer));
        stdin.on('error', reject);
    });
}
function parseStructuredJson(rawJson, sourceLabel) {
    if (rawJson.trim().length === 0) {
        throw new Error(`${sourceLabel} requires a non-empty JSON object`);
    }
    let parsed;
    try {
        parsed = JSON.parse(rawJson);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSON provided via ${sourceLabel}: ${errMsg}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error(`${sourceLabel} requires a JSON object payload`);
    }
    return parsed;
}
async function parseStructuredModeArguments(mode, args, stdinReader) {
    if (mode === '--stdin' && process.stdin.isTTY) {
        console.error('--stdin requires piped input');
        process.exit(1);
    }
    const rawJson = mode === '--stdin'
        ? await stdinReader()
        : args[1];
    if (mode === '--json' && rawJson === undefined) {
        throw new Error('--json requires an inline JSON string argument');
    }
    // Validation: empty --json is a user error, not a crash
    if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
        console.log(JSON.stringify({ error: 'VALIDATION_ERROR', message: 'Empty --json input' }));
        process.exit(1);
    }
    const payload = parseStructuredJson(rawJson ?? '', mode);
    const explicitSpecFolderArg = args[mode === '--stdin' ? 1 : 2];
    const explicitTarget = explicitSpecFolderArg ? resolveCliSpecFolderReference(explicitSpecFolderArg) || explicitSpecFolderArg : null;
    const payloadTargetRaw = extractPayloadSpecFolder(payload);
    const payloadTarget = payloadTargetRaw ? (resolveCliSpecFolderReference(payloadTargetRaw) || payloadTargetRaw) : null;
    const specFolderArg = explicitTarget || payloadTarget;
    if (!specFolderArg) {
        throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
    }
    return {
        dataFile: null,
        specFolderArg,
        collectedData: {
            ...payload,
            _source: 'file',
        },
        sessionId: null,
    };
}
// ───────────────────────────────────────────────────────────────
// 5. CLI ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────
async function parseArguments(argv = process.argv.slice(2), stdinReader = readAllStdin) {
    // Extract --session-id <uuid> from argv before positional parsing
    let sessionId = null;
    const filteredArgv = [];
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--session-id') {
            const candidate = argv[i + 1];
            if (!candidate || candidate.startsWith('--') || candidate.trim().length === 0) {
                throw new Error('--session-id requires a non-empty value');
            }
            sessionId = candidate.trim();
            i++; // skip the value
            continue;
        }
        filteredArgv.push(argv[i]);
    }
    const [primaryArg, secondaryArg] = filteredArgv;
    if (!primaryArg) {
        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
    }
    if (primaryArg === '--stdin' || primaryArg === '--json') {
        const structured = await parseStructuredModeArguments(primaryArg, filteredArgv, stdinReader);
        return { ...structured, sessionId };
    }
    const resolvedSpecFolder = resolveCliSpecFolderReference(primaryArg);
    if (resolvedSpecFolder) {
        throw new Error('Direct spec folder mode is no longer supported. ' +
            'Use structured JSON via --json, --stdin, or a JSON temp file.');
    }
    return {
        dataFile: primaryArg,
        specFolderArg: secondaryArg || null,
        collectedData: null,
        sessionId,
    };
}
function validateArguments() {
    const specFolderArg = core_1.CONFIG.SPEC_FOLDER_ARG;
    if (!specFolderArg)
        return;
    const validation = isValidSpecFolder(specFolderArg);
    if (validation.warning) {
        console.warn(`   Warning: ${validation.warning}`);
    }
    if (validation.valid)
        return;
    // --- Subfolder support: before failing, try to find the folder as a child ---
    const inputBaseName = path.basename(specFolderArg);
    if (core_1.SPEC_FOLDER_PATTERN.test(inputBaseName)) {
        // Input looks like a valid spec folder name but wasn't found at top level.
        // Try finding it as a child folder inside any parent.
        const resolved = (0, core_1.findChildFolderSync)(inputBaseName);
        if (resolved) {
            console.error(`   Resolved child folder "${inputBaseName}" → ${resolved}`);
            core_1.CONFIG.SPEC_FOLDER_ARG = resolved;
            return;
        }
        // FindChildFolder logs its own error for ambiguous matches
    }
    console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
    console.error(`   Reason: ${validation.reason}`);
    console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');
    const specsDir = (0, core_1.findActiveSpecsDir)() || path.join(core_1.CONFIG.PROJECT_ROOT, 'specs');
    if (fsSync.existsSync(specsDir)) {
        try {
            const available = fsSync.readdirSync(specsDir);
            const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && core_1.SPEC_FOLDER_PATTERN.test(n));
            if (matches.length > 0) {
                console.error('Did you mean:');
                matches.forEach((m) => console.error(`  - ${m}`));
            }
            else {
                // --- Subfolder support: multi-level deep scan as fallback ---
                let deepMatches = [];
                const targetBase = path.basename(specFolderArg);
                for (const topEntry of available) {
                    const isSpec = core_1.SPEC_FOLDER_PATTERN.test(topEntry);
                    const isCategory = core_1.CATEGORY_FOLDER_PATTERN.test(topEntry);
                    if (!isSpec && !isCategory)
                        continue;
                    const topPath = path.join(specsDir, topEntry);
                    try {
                        if (!fsSync.statSync(topPath).isDirectory())
                            continue;
                        const topChildren = fsSync.readdirSync(topPath);
                        // Search direct children of spec/category folders
                        const childMatches = topChildren.filter((c) => c.includes(targetBase) && core_1.SPEC_FOLDER_PATTERN.test(c));
                        for (const child of childMatches) {
                            deepMatches.push(`${topEntry}/${child}`);
                        }
                        // For category folders, also search grandchildren (category/parent/child)
                        if (isCategory) {
                            for (const midEntry of topChildren) {
                                if (!core_1.SPEC_FOLDER_PATTERN.test(midEntry))
                                    continue;
                                const midPath = path.join(topPath, midEntry);
                                try {
                                    if (!fsSync.statSync(midPath).isDirectory())
                                        continue;
                                    const grandChildren = fsSync.readdirSync(midPath);
                                    const gcMatches = grandChildren.filter((c) => c.includes(targetBase) && core_1.SPEC_FOLDER_PATTERN.test(c));
                                    for (const gc of gcMatches) {
                                        deepMatches.push(`${topEntry}/${midEntry}/${gc}`);
                                    }
                                }
                                catch (_error) {
                                    if (_error instanceof Error) {
                                        /* skip unreadable dirs */
                                    }
                                }
                            }
                        }
                    }
                    catch (_error) {
                        if (_error instanceof Error) {
                            /* skip unreadable dirs */
                        }
                    }
                }
                if (deepMatches.length > 0) {
                    console.error('Did you mean (in subfolders):');
                    deepMatches.forEach((m) => console.error(`  - ${m}`));
                }
                else {
                    const allSpecs = available.filter((n) => core_1.SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
                        .sort().reverse().slice(0, 5);
                    if (allSpecs.length) {
                        console.error('Available spec folders:');
                        allSpecs.forEach((f) => console.error(`  - ${f}`));
                    }
                }
            }
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error('[generate-context] Failed to list spec folders:', errMsg);
        }
    }
    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
    process.exit(1);
}
// ───────────────────────────────────────────────────────────────
// 6. MAIN ENTRY POINT
// ───────────────────────────────────────────────────────────────
async function main(argv = process.argv.slice(2), stdinReader = readAllStdin) {
    console.error('Starting memory skill...\n');
    try {
        const parsed = await parseArguments(argv, stdinReader);
        core_1.CONFIG.DATA_FILE = parsed.dataFile;
        core_1.CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
        validateArguments();
        await (0, workflow_1.runWorkflow)({
            dataFile: parsed.collectedData ? undefined : core_1.CONFIG.DATA_FILE ?? undefined,
            specFolderArg: core_1.CONFIG.SPEC_FOLDER_ARG ?? undefined,
            collectedData: parsed.collectedData ?? undefined,
            loadDataFn: parsed.collectedData
                ? undefined
                : () => (0, loaders_1.loadCollectedData)({}),
            collectSessionDataFn: collect_session_data_1.collectSessionData,
            sessionId: parsed.sessionId ?? undefined,
        });
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);
        if (isExpected) {
            console.error(`\nError: ${errMsg}`);
        }
        else {
            console.error('Unexpected Error:', errMsg);
            if (error instanceof Error) {
                console.error(error.stack);
            }
        }
        process.exit(1);
    }
}
// ───────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────
if (require.main === module) {
    installSignalHandlers();
    main().catch((error) => {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error(`Fatal error: ${errMsg}`);
        if (error instanceof Error) {
            console.error(error.stack);
        }
        process.exit(1);
    });
}
//# sourceMappingURL=generate-context.js.map