// ───────────────────────────────────────────────────────────────
// MODULE: Lifecycle Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// Postflight, learning_history (T303).
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
  handleSessionHealth,
  handleSessionResume,
  handleSessionBootstrap,
} from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';

import { parseArgs } from './types.js';
import type {
  MCPResponse,
  ScanArgs,
  PreflightArgs,
  PostflightArgs,
  LearningHistoryArgs,
  EvalRunAblationArgs,
  EvalReportingDashboardArgs,
  IngestStartArgs,
  IngestStatusArgs,
  IngestCancelArgs,
  SessionResumeArgs,
  SessionBootstrapArgs,
} from './types.js';

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
  'session_health',
  'session_resume',
  'session_bootstrap',
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
    case 'session_health':             return handleSessionHealth();
    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
    default: return null;
  }
}
