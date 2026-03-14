// ────────────────────────────────────────────────────────────────
// 1. EVAL REPORTING 
// ────────────────────────────────────────────────────────────────

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import { init as initHybridSearch, hybridSearchEnhanced } from '../lib/search/hybrid-search';
import { generateQueryEmbedding } from '../lib/providers/embeddings';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { createMCPSuccessResponse } from '../lib/response/envelope';
import {
  ALL_CHANNELS,
  isAblationEnabled,
  runAblation,
  storeAblationResults,
  formatAblationReport,
  toHybridSearchFlags,
  type AblationChannel,
  type AblationSearchFn,
} from '../lib/eval/ablation-framework';
import {
  generateDashboardReport,
  formatReportJSON,
  formatReportText,
} from '../lib/eval/reporting-dashboard';

import type { MCPResponse } from './types';

// Feature catalog: Reporting dashboard (eval_reporting_dashboard)
// Feature catalog: Ablation studies (eval_run_ablation)


interface RunAblationArgs {
  channels?: AblationChannel[];
  groundTruthQueryIds?: number[];
  recallK?: number;
  storeResults?: boolean;
  includeFormattedReport?: boolean;
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

async function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  if (!isAblationEnabled()) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'Ablation is disabled. Set SPECKIT_ABLATION=true to run ablation studies.',
      { flag: 'SPECKIT_ABLATION' }
    );
  }

  const db = vectorIndex.getDb();
  if (!db) {
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Database not initialized. Server may still be starting up.',
      {}
    );
  }

  initHybridSearch(db, vectorIndex.vectorSearch);

  const channels = normalizeChannels(args.channels as string[] | undefined);
  const recallK = typeof args.recallK === 'number' && Number.isFinite(args.recallK)
    ? Math.max(1, Math.floor(args.recallK))
    : 20;

  const searchFn: AblationSearchFn = async (query, disabledChannels) => {
    const channelFlags = toHybridSearchFlags(disabledChannels);
    const embedding = await generateQueryEmbedding(query);

    const searchOptions = {
      // Use recallK, not hardcoded 20
      limit: recallK,
      useVector: channelFlags.useVector,
      useBm25: channelFlags.useBm25,
      useFts: channelFlags.useFts,
      useGraph: channelFlags.useGraph,
      triggerPhrases: channelFlags.useTrigger ? undefined : [],
    };

    const results = await hybridSearchEnhanced(query, embedding, searchOptions);
    return results.map((row, index) => ({
      memoryId: Number(row.id),
      score: row.score,
      rank: index + 1,
    }));
  };

  const report = await runAblation(searchFn, {
    channels,
    groundTruthQueryIds: args.groundTruthQueryIds,
    recallK,
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
};

const handle_eval_run_ablation = handleEvalRunAblation;
const handle_eval_reporting_dashboard = handleEvalReportingDashboard;

export {
  handle_eval_run_ablation,
  handle_eval_reporting_dashboard,
};
