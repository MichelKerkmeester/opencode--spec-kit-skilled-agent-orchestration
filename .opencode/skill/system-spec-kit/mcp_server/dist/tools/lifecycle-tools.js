// ───────────────────────────────────────────────────────────────
// MODULE: Lifecycle Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for L6-L7 lifecycle tools: index_scan, preflight,
// Postflight, learning_history (T303).
import { handleMemoryIndexScan, handleMemoryIngestStart, handleMemoryIngestStatus, handleMemoryIngestCancel, handleTaskPreflight, handleTaskPostflight, handleGetLearningHistory, handleEvalRunAblation, handleEvalReportingDashboard, handleSharedMemoryEnable, handleSharedMemoryStatus, handleSharedSpaceMembershipSet, handleSharedSpaceUpsert, handleSessionHealth, handleSessionResume, handleSessionBootstrap, } from '../handlers/index.js';
import { validateToolArgs } from '../schemas/tool-input-schemas.js';
import { parseArgs } from './types.js';
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
    'shared_space_upsert',
    'shared_space_membership_set',
    'shared_memory_status',
    'shared_memory_enable',
    'session_health',
    'session_resume',
    'session_bootstrap',
]);
/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name, args) {
    switch (name) {
        case 'memory_index_scan': return handleMemoryIndexScan(parseArgs(validateToolArgs('memory_index_scan', args)));
        case 'task_preflight': return handleTaskPreflight(parseArgs(validateToolArgs('task_preflight', args)));
        case 'task_postflight': return handleTaskPostflight(parseArgs(validateToolArgs('task_postflight', args)));
        case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs(validateToolArgs('memory_get_learning_history', args)));
        case 'memory_ingest_start': return handleMemoryIngestStart(parseArgs(validateToolArgs('memory_ingest_start', args)));
        case 'memory_ingest_status': return handleMemoryIngestStatus(parseArgs(validateToolArgs('memory_ingest_status', args)));
        case 'memory_ingest_cancel': return handleMemoryIngestCancel(parseArgs(validateToolArgs('memory_ingest_cancel', args)));
        case 'eval_run_ablation': return handleEvalRunAblation(parseArgs(validateToolArgs('eval_run_ablation', args)));
        case 'eval_reporting_dashboard': return handleEvalReportingDashboard(parseArgs(validateToolArgs('eval_reporting_dashboard', args)));
        case 'shared_space_upsert': return handleSharedSpaceUpsert(parseArgs(validateToolArgs('shared_space_upsert', args)));
        case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs(validateToolArgs('shared_space_membership_set', args)));
        case 'shared_memory_status': return handleSharedMemoryStatus(parseArgs(validateToolArgs('shared_memory_status', args)));
        case 'shared_memory_enable': return handleSharedMemoryEnable(parseArgs(validateToolArgs('shared_memory_enable', args)));
        case 'session_health': return handleSessionHealth();
        case 'session_resume': return handleSessionResume(parseArgs(validateToolArgs('session_resume', args)));
        case 'session_bootstrap': return handleSessionBootstrap(parseArgs(validateToolArgs('session_bootstrap', args)));
        default: return null;
    }
}
//# sourceMappingURL=lifecycle-tools.js.map