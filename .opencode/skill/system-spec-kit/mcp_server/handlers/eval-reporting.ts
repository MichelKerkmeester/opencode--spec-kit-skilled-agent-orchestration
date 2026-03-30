// ────────────────────────────────────────────────────────────────
// MODULE: Eval Reporting
// ────────────────────────────────────────────────────────────────

import path from 'path';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import {
  init as initHybridSearch,
  hybridSearchEnhanced,
  bm25Search,
  ftsSearch,
} from '../lib/search/hybrid-search.js';
import { generateQueryEmbedding } from '../lib/providers/embeddings.js';
import { MemoryError, ErrorCodes } from '../lib/errors.js';
import { createMCPSuccessResponse } from '../lib/response/envelope.js';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  assertGroundTruthAlignment,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework.js';
import {
  generateDashboardReport,
  formatReportJSON,
  formatReportText,
} from '../lib/eval/reporting-dashboard.js';
import {
  analyzeKValueSensitivityBatch,
  formatKValueReport,
} from '../lib/eval/k-value-analysis.js';
import {
  createUnifiedGraphSearchFn,
  computeDegreeScores,
  DEGREE_CHANNEL_WEIGHT,
} from '../lib/search/graph-search-fn.js';
import { isDegreeBoostEnabled } from '../lib/search/search-flags.js';
import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

import type { MCPResponse } from './types.js';

// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
// Feature catalog: Ablation studies (eval_run_ablation)


interface RunAblationArgs {
  mode?: 'ablation' | 'k_sensitivity';
  channels?: AblationChannel[];
  groundTruthQueryIds?: number[];
  recallK?: number;
  queries?: string[];
  storeResults?: boolean;
  includeFormattedReport?: boolean;
}

interface KSensitivityArgs {
  queries?: string[];
  limit?: number;
}

interface ReportingDashboardArgs {
  sprintFilter?: string[];
  channelFilter?: string[];
  metricFilter?: string[];
  limit?: number;
  format?: 'text' | 'json';
}

function normalizeChannels(input?: string[]): AblationChannel[] {
  if (!Array.isArray(input) || input.length === 0) return ALL_CHANNELS;
  const valid = input.filter((value): value is AblationChannel =>
    (ALL_CHANNELS as string[]).includes(value)
  );
  return valid.length > 0 ? valid : ALL_CHANNELS;
}

function initializeEvalHybridSearch(database: ReturnType<typeof vectorIndex.getDb>) {
  const graphSearchFn = createUnifiedGraphSearchFn(database);
  initHybridSearch(database, vectorIndex.vectorSearch, graphSearchFn);
  return graphSearchFn;
}

function resolveEvalDbPath(): string | null {
  const configuredPath = process.env.SPECKIT_EVAL_DB_PATH?.trim();
  if (!configuredPath) {
    return null;
  }

  return path.resolve(process.cwd(), configuredPath);
}

async function withAblationDb<T>(
  run: (database: NonNullable<ReturnType<typeof vectorIndex.getDb>>, dbPath: string) => Promise<T>,
): Promise<T> {
  const overrideDbPath = resolveEvalDbPath();
  const activeDb = vectorIndex.getDb();

  if (!overrideDbPath) {
    if (!activeDb) {
      throw new MemoryError(
        ErrorCodes.DATABASE_ERROR,
        'Database not initialized. Server may still be starting up.',
        {}
      );
    }
    return run(activeDb, vectorIndex.getDbPath());
  }

  const currentDbPath = path.resolve(vectorIndex.getDbPath());
  if (currentDbPath === overrideDbPath) {
    if (!activeDb) {
      throw new MemoryError(
        ErrorCodes.DATABASE_ERROR,
        'Database not initialized. Server may still be starting up.',
        {}
      );
    }
    return run(activeDb, currentDbPath);
  }

  const previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  vectorIndex.closeDb();
  process.env.MEMORY_DB_PATH = overrideDbPath;

  try {
    const overrideDb = vectorIndex.initializeDb();
    return await run(overrideDb, vectorIndex.getDbPath());
  } finally {
    vectorIndex.closeDb();
    if (previousMemoryDbPath === undefined) {
      delete process.env.MEMORY_DB_PATH;
    } else {
      process.env.MEMORY_DB_PATH = previousMemoryDbPath;
    }
    vectorIndex.initializeDb();
  }
}

function buildRawFusionLists(
  database: NonNullable<ReturnType<typeof vectorIndex.getDb>>,
  graphSearchFn: ReturnType<typeof createUnifiedGraphSearchFn>,
  query: string,
  embedding: Float32Array | number[] | null,
  limit: number,
): RankedList[] {
  const lists: RankedList[] = [];

  if (embedding) {
    const vectorResults = vectorIndex.vectorSearch(embedding, {
      limit,
      minSimilarity: 0,
      includeConstitutional: false,
      includeArchived: false,
    });
    if (vectorResults.length > 0) {
      lists.push({
        source: 'vector',
        results: vectorResults.map((row) => ({ id: row.id as number | string })),
      });
    }
  }

  const ftsResults = ftsSearch(query, { limit });
  if (ftsResults.length > 0) {
    lists.push({
      source: 'fts',
      results: ftsResults.map((row) => ({ id: row.id })),
    });
  }

  const bm25Results = bm25Search(query, { limit });
  if (bm25Results.length > 0) {
    lists.push({
      source: 'bm25',
      results: bm25Results.map((row) => ({ id: row.id })),
    });
  }

  const graphResults = graphSearchFn(query, { limit });
  if (graphResults.length > 0) {
    lists.push({
      source: 'graph',
      results: graphResults.map((row) => ({ id: row.id as number | string })),
    });
  }

  if (isDegreeBoostEnabled()) {
    const allResultIds = new Set<number>();
    for (const list of lists) {
      for (const row of list.results) {
        if (typeof row.id === 'number') {
          allResultIds.add(row.id);
        }
      }
    }

    if (allResultIds.size > 0) {
      const degreeScores = computeDegreeScores(database, Array.from(allResultIds));
      const degreeItems = Array.from(degreeScores.entries())
        .map(([id, score]) => ({ id: Number(id), score }))
        .filter((item) => Number.isFinite(item.id) && item.score > 0)
        .sort((left, right) => right.score - left.score);

      if (degreeItems.length > 0) {
        lists.push({
          source: 'degree',
          results: degreeItems.map((item) => ({ id: item.id })),
          weight: DEGREE_CHANNEL_WEIGHT,
        });
      }
    }
  }

  return lists;
}

/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
 * @param args - Ablation arguments (channels, queries, recallK, mode)
 * @returns MCP response with ablation report or K-sensitivity results
 */
async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
  if (args.mode === 'k_sensitivity') {
    return handleEvalKSensitivity({
      queries: args.queries,
      limit: args.recallK,
    });
  }

  await checkDatabaseUpdated();

  if (!isAblationEnabled()) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
      { flag: 'SPECKIT_ABLATION' }
    );
  }

  const channels = normalizeChannels(args.channels as string[] | undefined);
  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
    ? Math.max(1, Math.floor(args.recallK))
    : 20;

  const report = await withAblationDb(async (db, dbPath) => {
    try {
      assertGroundTruthAlignment(db, {
        dbPath,
        context: 'eval_run_ablation',
      });
    } catch (error: unknown) {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        error instanceof Error ? error.message : String(error),
        { dbPath },
      );
    }

    initializeEvalHybridSearch(db);

    const searchFn: AblationSearchFn = async (query, disabledChannels) => {
      const channelFlags = toHybridSearchFlags(disabledChannels);
      const embedding = await generateQueryEmbedding(query);

      const searchOptions = {
        limit: recallK,
        useVector: channelFlags.useVector,
        useBm25: channelFlags.useBm25,
        useFts: channelFlags.useFts,
        useGraph: channelFlags.useGraph,
        triggerPhrases: channelFlags.useTrigger ? undefined : [],
        forceAllChannels: true,
        evaluationMode: true,
      };

      const results = await hybridSearchEnhanced(query, embedding, searchOptions);
      return results.map((row, index) => ({
        memoryId: Number(
          (row as Record<string, unknown>).parentMemoryId ?? row.id
        ),
        score: row.score,
        rank: index + 1,
      }));
    };

    return runAblation(searchFn, {
      channels,
      groundTruthQueryIds: args.groundTruthQueryIds,
      recallK,
      alignmentDb: db,
      alignmentDbPath: dbPath,
      alignmentContext: 'eval_run_ablation',
    });
  });

  if (!report) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Ablation run returned no report. Check feature flag and ground truth availability.',
      {}
    );
  }

  const shouldStore = args.storeResults !== false;
  const stored = shouldStore ? storeAblationResults(report) : false;
  const formatted = args.includeFormattedReport === false ? null : formatAblationReport(report);

  return createMCPSuccessResponse({
    tool: 'eval_run_ablation',
    summary: `Ablation run complete (${report.results.length} channels, baseline=${report.overallBaselineRecall.toFixed(4)})`,
    data: {
      report,
      stored,
      ...(formatted ? { formattedReport: formatted } : {}),
    },
    hints: [
      shouldStore
        ? (stored ? 'Ablation metrics stored to eval_metric_snapshots' : 'Ablation metrics storage failed')
        : 'Ablation metrics were not persisted (storeResults=false)',
    ],
  });
}

/** Representative queries used when no custom query set is provided. */
const DEFAULT_K_SENSITIVITY_QUERIES = [
  'memory retrieval',
  'hybrid search fusion',
  'context recall',
  'RRF scoring',
  'semantic search',
];

/**
 * Run Multi-K RRF sensitivity analysis.
 *
 * 1. Runs hybridSearchEnhanced for each representative query
 * 2. Converts results to per-query RankedList[] groups
 * 3. Aggregates per-query sensitivity and formats the report
 */
async function handleEvalKSensitivity(args: KSensitivityArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const db = vectorIndex.getDb();
  if (!db) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Database not initialized. Server may still be starting up.',
      {}
    );
  }

  const graphSearchFn = initializeEvalHybridSearch(db);

  const queries = Array.isArray(args.queries) && args.queries.length > 0
    ? args.queries
    : DEFAULT_K_SENSITIVITY_QUERIES;

  const limit = typeof args.limit === 'number' && Number.isFinite(args.limit)
    ? Math.max(1, Math.floor(args.limit))
    : 20;

  const queryLists: RankedList[][] = [];
  for (const query of queries) {
    const embedding = await generateQueryEmbedding(query);
    queryLists.push(buildRawFusionLists(db, graphSearchFn, query, embedding, limit));
  }

  const analysis = analyzeKValueSensitivityBatch(queryLists);
  const report = formatKValueReport(analysis);

  return createMCPSuccessResponse({
    tool: 'eval_run_ablation',
    summary: `K-sensitivity analysis complete (${queries.length} queries, ${analysis.totalItems} unique items)`,
    data: {
      report,
      queriesUsed: queries,
      totalItems: analysis.totalItems,
    },
    hints: [report.recommendation],
  });
}

async function handleEvalReportingDashboard(args: ReportingDashboardArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const report = await generateDashboardReport({
    sprintFilter: args.sprintFilter,
    channelFilter: args.channelFilter,
    metricFilter: args.metricFilter,
    limit: args.limit,
  });

  const format = args.format === 'json' ? 'json' : 'text';
  const formatted = format === 'json' ? formatReportJSON(report) : formatReportText(report);

  return createMCPSuccessResponse({
    tool: 'eval_reporting_dashboard',
    summary: `Dashboard generated (${report.sprints.length} sprint groups, ${report.totalEvalRuns} eval runs)`,
    data: {
      report,
      format,
      formatted,
    },
  });
}

export {
  handleEvalRunAblation,
  handleEvalReportingDashboard,
  handleEvalKSensitivity,
};

const handle_eval_run_ablation = handleEvalRunAblation;
const handle_eval_reporting_dashboard = handleEvalReportingDashboard;
const handle_eval_k_sensitivity = handleEvalKSensitivity;

export {
  handle_eval_run_ablation,
  handle_eval_reporting_dashboard,
  handle_eval_k_sensitivity,
};
