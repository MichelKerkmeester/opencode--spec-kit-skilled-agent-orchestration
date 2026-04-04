#!/usr/bin/env npx tsx
"use strict";
// ---------------------------------------------------------------
// MODULE: Run Bm25 Baseline
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. RUN BM25 BASELINE
// ───────────────────────────────────────────────────────────────
//
// Execute the BM25-only baseline against the
// Live production context-index.sqlite and record results in the
// Eval DB. Produces the contingency decision (PAUSE/RATIONALIZE/
// PROCEED) with bootstrap 95% CI for statistical significance.
//
// Usage:
//   npx tsx scripts/evals/run-bm25-baseline.ts [--skip-hard-negatives] [--verbose]
//
// Output:
//   - Prints metrics, contingency decision, and bootstrap CI
//   - Records results to speckit-eval.db (eval_metric_snapshots)
//   - Writes full result JSON to /tmp/bm25-baseline-result.json
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
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const api_1 = require("../../mcp_server/api");
// -- Config ------------------------------------------------------
const DB_DIR = path.resolve(__dirname, '../../mcp_server/database');
const PROD_DB_PATH = path.join(DB_DIR, 'context-index.sqlite');
const OUTPUT_PATH = '/tmp/bm25-baseline-result.json';
const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const SKIP_HARD_NEGATIVES = args.includes('--skip-hard-negatives');
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
    log('BM25-ONLY BASELINE MEASUREMENT (T008)');
    divider();
    // 1. Verify production DB exists
    if (!fs.existsSync(PROD_DB_PATH)) {
        console.error(`ERROR: Production DB not found at ${PROD_DB_PATH}`);
        process.exit(1);
    }
    log(`Production DB: ${PROD_DB_PATH}`);
    // 2. Open production DB (read-only)
    const prodDb = new better_sqlite3_1.default(PROD_DB_PATH, { readonly: true });
    prodDb.pragma('journal_mode = WAL');
    verbose('Production DB opened (read-only)');
    // 3. Verify FTS5 is available
    if (!(0, api_1.isFts5Available)(prodDb)) {
        console.error('ERROR: memory_fts FTS5 table not found in production DB');
        prodDb.close();
        process.exit(1);
    }
    // Check memory count
    const memCount = prodDb.prepare('SELECT COUNT(*) as c FROM memory_index').get().c;
    log(`Production memories: ${memCount}`);
    // 4. Initialize eval DB
    const evalDb = (0, api_1.initEvalDb)(DB_DIR);
    log(`Eval DB initialized: ${path.join(DB_DIR, 'speckit-eval.db')}`);
    // 5. Load ground truth into eval DB
    const gtResult = (0, api_1.loadGroundTruth)(evalDb);
    log(`Ground truth loaded: ${gtResult.queriesInserted} queries, ${gtResult.relevancesInserted} relevances`);
    if (gtResult.queriesInserted === 0 && gtResult.relevancesInserted === 0) {
        verbose('Ground truth already present (INSERT OR IGNORE)');
    }
    // 6. Create BM25SearchFn adapter
    //    Wraps fts5Bm25Search() to match the BM25SearchFn signature:
    //    (query: string, limit: number) => BM25SearchResult[]
    const searchFn = (query, limit) => {
        const ftsResults = (0, api_1.fts5Bm25Search)(prodDb, query, { limit });
        return ftsResults.map(r => ({
            id: r.id,
            score: r.fts_score,
            source: 'bm25',
        }));
    };
    // 7. Run baseline
    log('');
    log('Running BM25 baseline...');
    const config = {
        skipHardNegatives: SKIP_HARD_NEGATIVES,
    };
    const startTime = Date.now();
    const result = await (0, api_1.runBM25Baseline)(searchFn, config);
    const elapsed = Date.now() - startTime;
    // 8. Record to eval DB
    (0, api_1.recordBaselineMetrics)(evalDb, result);
    log(`Results recorded to eval DB`);
    // 9. Print results
    log('');
    divider();
    log('BASELINE METRICS');
    divider();
    log(`  MRR@5:       ${result.metrics.mrr5.toFixed(4)}`);
    log(`  NDCG@10:     ${result.metrics.ndcg10.toFixed(4)}`);
    log(`  Recall@20:   ${result.metrics.recall20.toFixed(4)}`);
    log(`  HitRate@1:   ${result.metrics.hitRate1.toFixed(4)}`);
    log(`  Query count: ${result.queryCount}`);
    log(`  Elapsed:     ${elapsed}ms`);
    log('');
    divider();
    log('CONTINGENCY DECISION');
    divider();
    const cd = result.contingencyDecision;
    log(`  Action:     ${cd.action}`);
    log(`  MRR@5:      ${cd.bm25MRR.toFixed(4)}`);
    log(`  Threshold:  ${cd.threshold}`);
    log(`  ${cd.interpretation}`);
    if (result.bootstrapCI) {
        log('');
        divider();
        log('BOOTSTRAP 95% CI (REQ-S0-004)');
        divider();
        const ci = result.bootstrapCI;
        log(`  Point estimate:  ${ci.pointEstimate.toFixed(4)}`);
        log(`  95% CI:          [${ci.ciLower.toFixed(4)}, ${ci.ciUpper.toFixed(4)}]`);
        log(`  CI width:        ${ci.ciWidth.toFixed(4)}`);
        log(`  Sample size:     ${ci.sampleSize}`);
        log(`  Iterations:      ${ci.iterations}`);
        log(`  Tested boundary: ${ci.testedBoundary}`);
        log(`  Significant:     ${ci.isSignificant ? 'YES (p<0.05)' : 'NO'}`);
    }
    // 10. Write full result to JSON
    const output = {
        ...result,
        elapsedMs: elapsed,
        productionMemoryCount: memCount,
        scriptVersion: '1.0.0',
    };
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
    log('');
    log(`Full result written to: ${OUTPUT_PATH}`);
    // Cleanup
    prodDb.close();
    divider();
    log('Done.');
}
main().catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
//# sourceMappingURL=run-bm25-baseline.js.map