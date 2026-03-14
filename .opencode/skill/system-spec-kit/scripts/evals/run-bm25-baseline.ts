#!/usr/bin/env npx tsx
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

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

import {
  fts5Bm25Search, isFts5Available,
  runBM25Baseline, recordBaselineMetrics,
  loadGroundTruth, initEvalDb,
  type BM25SearchFn, type BM25SearchResult, type BM25BaselineResult,
} from '../../mcp_server/api';

// -- Config ------------------------------------------------------

const DB_DIR = path.resolve(__dirname, '../../mcp_server/database');
const PROD_DB_PATH = path.join(DB_DIR, 'context-index.sqlite');
const OUTPUT_PATH = '/tmp/bm25-baseline-result.json';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const SKIP_HARD_NEGATIVES = args.includes('--skip-hard-negatives');

// -- Helpers -----------------------------------------------------

function log(msg: string): void {
  console.log(msg);
}

function verbose(msg: string): void {
  if (VERBOSE) console.log(`  [verbose] ${msg}`);
}

function divider(): void {
  log('-'.repeat(60));
}

// -- Main --------------------------------------------------------

async function main(): Promise<void> {
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
  const prodDb = new Database(PROD_DB_PATH, { readonly: true });
  prodDb.pragma('journal_mode = WAL');
  verbose('Production DB opened (read-only)');

  // 3. Verify FTS5 is available
  if (!isFts5Available(prodDb)) {
    console.error('ERROR: memory_fts FTS5 table not found in production DB');
    prodDb.close();
    process.exit(1);
  }

  // Check memory count
  const memCount = (prodDb.prepare(
    'SELECT COUNT(*) as c FROM memory_index'
  ).get() as { c: number }).c;
  log(`Production memories: ${memCount}`);

  // 4. Initialize eval DB
  const evalDb = initEvalDb(DB_DIR);
  log(`Eval DB initialized: ${path.join(DB_DIR, 'speckit-eval.db')}`);

  // 5. Load ground truth into eval DB
  const gtResult = loadGroundTruth(evalDb);
  log(`Ground truth loaded: ${gtResult.queriesInserted} queries, ${gtResult.relevancesInserted} relevances`);
  if (gtResult.queriesInserted === 0 && gtResult.relevancesInserted === 0) {
    verbose('Ground truth already present (INSERT OR IGNORE)');
  }

  // 6. Create BM25SearchFn adapter
  //    Wraps fts5Bm25Search() to match the BM25SearchFn signature:
  //    (query: string, limit: number) => BM25SearchResult[]
  const searchFn: BM25SearchFn = (query: string, limit: number): BM25SearchResult[] => {
    const ftsResults = fts5Bm25Search(prodDb, query, { limit });
    return ftsResults.map(r => ({
      id: r.id,
      score: r.fts_score,
      source: 'bm25' as const,
    }));
  };

  // 7. Run baseline
  log('');
  log('Running BM25 baseline...');
  const config = {
    skipHardNegatives: SKIP_HARD_NEGATIVES,
  };

  const startTime = Date.now();
  const result: BM25BaselineResult = await runBM25Baseline(searchFn, config);
  const elapsed = Date.now() - startTime;

  // 8. Record to eval DB
  recordBaselineMetrics(evalDb, result);
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
