#!/usr/bin/env npx tsx
"use strict";
// ---------------------------------------------------------------
// MODULE: Run Ablation
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. RUN ABLATION
// ───────────────────────────────────────────────────────────────
//
// Runtime entry point for the ablation framework. Runs controlled
// Ablation studies that selectively disable one search channel at
// A time, measuring Recall@20 delta against a full-pipeline baseline.
//
// Usage:
//   SPECKIT_ABLATION=true npx tsx scripts/evals/run-ablation.ts [--channels vector,bm25,fts5] [--verbose]
//
// Output:
//   - Prints formatted ablation report (markdown table)
//   - Records results to speckit-eval.db (eval_metric_snapshots)
//   - Writes full result JSON to /tmp/ablation-result.json
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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const api_1 = require("../../mcp_server/api");
// -- Config ------------------------------------------------------
function resolveScriptsWorkspaceRoot() {
    const directParent = path.resolve(__dirname, '..');
    if (path.basename(directParent) === 'scripts')
        return directParent;
    const nestedParent = path.resolve(__dirname, '..', '..');
    if (path.basename(nestedParent) === 'scripts')
        return nestedParent;
    return directParent;
}
const SCRIPTS_ROOT = resolveScriptsWorkspaceRoot();
const DB_DIR = path.resolve(SCRIPTS_ROOT, '../mcp_server/database');
const PROD_DB_PATH = path.join(DB_DIR, 'context-index.sqlite');
const OUTPUT_PATH = '/tmp/ablation-result.json';
const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
// Parse --channels flag (e.g., --channels vector,bm25,fts5)
function parseChannels() {
    const idx = args.indexOf('--channels');
    if (idx === -1 || idx + 1 >= args.length)
        return api_1.ALL_CHANNELS;
    const raw = args[idx + 1].split(',').map(s => s.trim());
    const valid = raw.filter(ch => api_1.ALL_CHANNELS.includes(ch));
    if (valid.length === 0) {
        console.warn(`[ablation] No valid channels in "${args[idx + 1]}". Using all: ${api_1.ALL_CHANNELS.join(', ')}`);
        return api_1.ALL_CHANNELS;
    }
    return valid;
}
// -- Helpers -----------------------------------------------------
function log(msg) {
    console.log(msg);
}
function verbose(msg) {
    if (VERBOSE)
        console.log(`  [verbose] ${msg}`);
}
function divider() {
    log('-'.repeat(60));
}
// -- Main --------------------------------------------------------
async function main() {
    log('');
    log('ABLATION STUDY (R13-S3)');
    divider();
    // 1. Check flag
    if (!(0, api_1.isAblationEnabled)()) {
        console.error('ERROR: SPECKIT_ABLATION=true is required to run ablation studies.');
        console.error('Usage: SPECKIT_ABLATION=true npx tsx scripts/evals/run-ablation.ts');
        process.exit(1);
    }
    // 2. Verify production DB exists
    if (!fs.existsSync(PROD_DB_PATH)) {
        console.error(`ERROR: Production DB not found at ${PROD_DB_PATH}`);
        process.exit(1);
    }
    log(`Production DB: ${PROD_DB_PATH}`);
    // 3. Initialize vector index and hybrid search (opens the production DB)
    // F-22 — Guard null dereference: check db before passing to initHybridSearch
    const db = api_1.vectorIndex.initializeDb(PROD_DB_PATH);
    if (!db) {
        console.error('ERROR: Could not initialize database');
        process.exit(1);
    }
    (0, api_1.initHybridSearch)(db, api_1.vectorIndex.vectorSearch);
    verbose('Vector index and hybrid search initialized');
    const memCount = db.prepare('SELECT COUNT(*) as c FROM memory_index').get().c;
    log(`Production memories: ${memCount}`);
    const gtAlignment = (0, api_1.assertGroundTruthAlignment)(db, {
        dbPath: PROD_DB_PATH,
        context: 'cli ablation',
    });
    log(`Ground truth alignment: ${gtAlignment.parentRelevanceCount}/${gtAlignment.totalRelevances} `
        + `parent relevances across ${gtAlignment.parentMemoryCount} memory IDs`);
    // 4. Initialize eval DB
    (0, api_1.initEvalDb)(DB_DIR);
    log(`Eval DB initialized: ${path.join(DB_DIR, 'speckit-eval.db')}`);
    // 5. Parse channels to ablate
    const channels = parseChannels();
    log(`Channels to ablate: ${channels.join(', ')}`);
    // 6. Create search function adapter
    // The ablation framework passes a set of disabled channels; we convert
    // To HybridSearchOptions flags and run hybridSearchEnhanced.
    const searchFn = async (query, disabledChannels) => {
        const channelFlags = (0, api_1.toHybridSearchFlags)(disabledChannels);
        const embedding = await (0, api_1.generateQueryEmbedding)(query);
        const results = await (0, api_1.hybridSearchEnhanced)(query, embedding, {
            limit: 20,
            useVector: channelFlags.useVector,
            useBm25: channelFlags.useBm25,
            useFts: channelFlags.useFts,
            useGraph: channelFlags.useGraph,
            triggerPhrases: channelFlags.useTrigger ? undefined : [],
            forceAllChannels: true,
            evaluationMode: true,
        });
        return results.map((r, idx) => ({
            memoryId: Number(r.parentMemoryId ?? r.id),
            score: r.score,
            rank: idx + 1,
        }));
    };
    // 7. Run ablation study
    log('');
    log('Running ablation study...');
    const startTime = Date.now();
    const report = await (0, api_1.runAblation)(searchFn, {
        channels,
    });
    const elapsed = Date.now() - startTime;
    if (!report) {
        console.error('ERROR: Ablation study returned null (check SPECKIT_ABLATION flag and ground truth data)');
        process.exit(1);
    }
    // 8. Store results in eval DB
    const stored = (0, api_1.storeAblationResults)(report);
    log(`Results stored to eval DB: ${stored ? 'YES' : 'FAILED'}`);
    // 9. Print formatted report
    log('');
    divider();
    log((0, api_1.formatAblationReport)(report));
    divider();
    log(`Total elapsed: ${elapsed}ms`);
    // 10. Write full result to JSON
    const output = {
        ...report,
        scriptElapsedMs: elapsed,
        productionMemoryCount: memCount,
        scriptVersion: '1.0.0',
    };
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    log('');
    log(`Full result written to: ${OUTPUT_PATH}`);
    divider();
    log('Done.');
}
main().catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
//# sourceMappingURL=run-ablation.js.map