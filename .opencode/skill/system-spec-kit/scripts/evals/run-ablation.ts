#!/usr/bin/env npx tsx
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

import * as path from 'path';
import * as fs from 'fs';

import {
  runAblation, storeAblationResults, formatAblationReport,
  toHybridSearchFlags, isAblationEnabled, ALL_CHANNELS,
  assertGroundTruthAlignment,
  initEvalDb, generateQueryEmbedding,
  initHybridSearch, hybridSearchEnhanced, vectorIndex,
  type AblationChannel, type AblationSearchFn, type AblationReport,
} from '../../mcp_server/api';

// -- Config ------------------------------------------------------

function resolveScriptsWorkspaceRoot(): string {
  const directParent = path.resolve(__dirname, '..');
  if (path.basename(directParent) === 'scripts') return directParent;

  const nestedParent = path.resolve(__dirname, '..', '..');
  if (path.basename(nestedParent) === 'scripts') return nestedParent;

  return directParent;
}

const SCRIPTS_ROOT = resolveScriptsWorkspaceRoot();
const DB_DIR = path.resolve(SCRIPTS_ROOT, '../mcp_server/database');
const PROD_DB_PATH = path.join(DB_DIR, 'context-index.sqlite');
const OUTPUT_PATH = '/tmp/ablation-result.json';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');

// Parse --channels flag (e.g., --channels vector,bm25,fts5)
function parseChannels(): AblationChannel[] {
  const idx = args.indexOf('--channels');
  if (idx === -1 || idx + 1 >= args.length) return ALL_CHANNELS;
  const raw = args[idx + 1].split(',').map(s => s.trim()) as AblationChannel[];
  const valid = raw.filter(ch => ALL_CHANNELS.includes(ch));
  if (valid.length === 0) {
    console.warn(`[ablation] No valid channels in "${args[idx + 1]}". Using all: ${ALL_CHANNELS.join(', ')}`);
    return ALL_CHANNELS;
  }
  return valid;
}

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
  log('ABLATION STUDY (R13-S3)');
  divider();

  // 1. Check flag
  if (!isAblationEnabled()) {
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
  const db = vectorIndex.initializeDb(PROD_DB_PATH);
  if (!db) {
    console.error('ERROR: Could not initialize database');
    process.exit(1);
  }
  initHybridSearch(db, vectorIndex.vectorSearch);
  verbose('Vector index and hybrid search initialized');
  const memCount = (db.prepare(
    'SELECT COUNT(*) as c FROM memory_index'
  ).get() as { c: number }).c;
  log(`Production memories: ${memCount}`);
  const gtAlignment = assertGroundTruthAlignment(db, {
    dbPath: PROD_DB_PATH,
    context: 'cli ablation',
  });
  log(
    `Ground truth alignment: ${gtAlignment.parentRelevanceCount}/${gtAlignment.totalRelevances} `
    + `parent relevances across ${gtAlignment.parentMemoryCount} memory IDs`
  );

  // 4. Initialize eval DB
  initEvalDb(DB_DIR);
  log(`Eval DB initialized: ${path.join(DB_DIR, 'speckit-eval.db')}`);

  // 5. Parse channels to ablate
  const channels = parseChannels();
  log(`Channels to ablate: ${channels.join(', ')}`);

  // 6. Create search function adapter
  // The ablation framework passes a set of disabled channels; we convert
  // To HybridSearchOptions flags and run hybridSearchEnhanced.
  const searchFn: AblationSearchFn = async (query, disabledChannels) => {
    const channelFlags = toHybridSearchFlags(disabledChannels);
    const embedding = await generateQueryEmbedding(query);

    const results = await hybridSearchEnhanced(query, embedding, {
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
      memoryId: Number((r as Record<string, unknown>).parentMemoryId ?? r.id),
      score: r.score,
      rank: idx + 1,
    }));
  };

  // 7. Run ablation study
  log('');
  log('Running ablation study...');
  const startTime = Date.now();

  const report: AblationReport | null = await runAblation(searchFn, {
    channels,
  });

  const elapsed = Date.now() - startTime;

  if (!report) {
    console.error('ERROR: Ablation study returned null (check SPECKIT_ABLATION flag and ground truth data)');
    process.exit(1);
  }

  // 8. Store results in eval DB
  const stored = storeAblationResults(report);
  log(`Results stored to eval DB: ${stored ? 'YES' : 'FAILED'}`);

  // 9. Print formatted report
  log('');
  divider();
  log(formatAblationReport(report));
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
