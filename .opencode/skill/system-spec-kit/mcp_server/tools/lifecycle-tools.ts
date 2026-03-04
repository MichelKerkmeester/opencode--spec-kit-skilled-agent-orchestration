// ---------------------------------------------------------------
// MODULE: Lifecycle Tools
// ---------------------------------------------------------------
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// postflight, learning_history (T303).
// ---------------------------------------------------------------

import {
  handleMemoryIndexScan,
  handleMemoryIngestStart,
  handleMemoryIngestStatus,
  handleMemoryIngestCancel,
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  handleEvalRunAblation,
  handleEvalReportingDashboard,
} from '../handlers';
import { validateToolArgs } from '../schemas/tool-input-schemas';

import {
  MCPResponse, parseArgs,
  ScanArgs, PreflightArgs, PostflightArgs, LearningHistoryArgs,
  EvalRunAblationArgs, EvalReportingDashboardArgs,
  IngestStartArgs, IngestStatusArgs, IngestCancelArgs,
} from './types';

/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
  'memory_index_scan',
  'task_preflight',
  'task_postflight',
  'memory_get_learning_history',
  'memory_ingest_start',
  'memory_ingest_status',
  'memory_ingest_cancel',
  'eval_run_ablation',
  'eval_reporting_dashboard',
]);

/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
  switch (name) {
    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(validateToolArgs('memory_index_scan', args)));
    case 'task_preflight':             return handleTaskPreflight(parseArgs<PreflightArgs>(validateToolArgs('task_preflight', args)));
    case 'task_postflight':            return handleTaskPostflight(parseArgs<PostflightArgs>(validateToolArgs('task_postflight', args)));
    case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs<LearningHistoryArgs>(validateToolArgs('memory_get_learning_history', args)));
    case 'memory_ingest_start':        return handleMemoryIngestStart(parseArgs<IngestStartArgs>(validateToolArgs('memory_ingest_start', args)));
    case 'memory_ingest_status':       return handleMemoryIngestStatus(parseArgs<IngestStatusArgs>(validateToolArgs('memory_ingest_status', args)));
    case 'memory_ingest_cancel':       return handleMemoryIngestCancel(parseArgs<IngestCancelArgs>(validateToolArgs('memory_ingest_cancel', args)));
    case 'eval_run_ablation':          return handleEvalRunAblation(parseArgs<EvalRunAblationArgs>(validateToolArgs('eval_run_ablation', args)));
    case 'eval_reporting_dashboard':   return handleEvalReportingDashboard(parseArgs<EvalReportingDashboardArgs>(validateToolArgs('eval_reporting_dashboard', args)));
    default: return null;
  }
}
