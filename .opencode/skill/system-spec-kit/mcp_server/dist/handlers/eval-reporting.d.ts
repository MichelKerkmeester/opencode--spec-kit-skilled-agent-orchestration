import { type AblationChannel } from '../lib/eval/ablation-framework.js';
import type { MCPResponse } from './types.js';
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
/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
 * @param args - Ablation arguments (channels, queries, recallK, mode)
 * @returns MCP response with ablation report or K-sensitivity results
 */
declare function handleEvalRunAblation(args: RunAblationArgs): Promise<MCPResponse>;
/**
 * Run Multi-K RRF sensitivity analysis.
 *
 * 1. Runs hybridSearchEnhanced for each representative query
 * 2. Converts results to per-query RankedList[] groups
 * 3. Aggregates per-query sensitivity and formats the report
 */
declare function handleEvalKSensitivity(args: KSensitivityArgs): Promise<MCPResponse>;
declare function handleEvalReportingDashboard(args: ReportingDashboardArgs): Promise<MCPResponse>;
export { handleEvalRunAblation, handleEvalReportingDashboard, handleEvalKSensitivity, };
declare const handle_eval_run_ablation: typeof handleEvalRunAblation;
declare const handle_eval_reporting_dashboard: typeof handleEvalReportingDashboard;
declare const handle_eval_k_sensitivity: typeof handleEvalKSensitivity;
export { handle_eval_run_ablation, handle_eval_reporting_dashboard, handle_eval_k_sensitivity, };
//# sourceMappingURL=eval-reporting.d.ts.map