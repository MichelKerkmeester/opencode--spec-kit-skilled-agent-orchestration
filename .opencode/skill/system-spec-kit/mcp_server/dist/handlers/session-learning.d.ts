import type { MCPResponse, DatabaseExtended as Database } from './types.js';
interface PreflightArgs {
    specFolder: string;
    taskId: string;
    knowledgeScore: number;
    uncertaintyScore: number;
    contextScore: number;
    knowledgeGaps?: string[];
    sessionId?: string | null;
}
interface PostflightArgs {
    specFolder: string;
    taskId: string;
    knowledgeScore: number;
    uncertaintyScore: number;
    contextScore: number;
    gapsClosed?: string[];
    newGapsDiscovered?: string[];
    sessionId?: string | null;
}
interface LearningHistoryArgs {
    specFolder: string;
    sessionId?: string;
    limit?: number;
    onlyComplete?: boolean;
    includeSummary?: boolean;
}
export interface LearningScoreSnapshot {
    knowledge: number | null;
    uncertainty: number | null;
    context: number | null;
    timestamp: string | null;
}
export interface LearningDeltaSnapshot {
    knowledge: number | null;
    uncertainty: number | null;
    context: number | null;
}
export interface LearningHistoryBaseRow {
    taskId: string;
    specFolder: string;
    sessionId: string | null;
    phase: 'preflight' | 'complete';
    preflight: LearningScoreSnapshot;
    knowledgeGaps: string[];
    createdAt: string | null;
}
export interface PreflightLearningHistoryRow extends LearningHistoryBaseRow {
    phase: 'preflight';
}
export interface CompletedLearningHistoryRow extends LearningHistoryBaseRow {
    phase: 'complete';
    postflight: LearningScoreSnapshot;
    deltas: LearningDeltaSnapshot;
    learningIndex: number | null;
    gapsClosed: string[];
    newGapsDiscovered: string[];
    completedAt: string | null;
}
export type LearningHistoryRow = PreflightLearningHistoryRow | CompletedLearningHistoryRow;
export interface LearningHistorySummary {
    totalTasks: number;
    completedTasks: number;
    averageLearningIndex: number | null;
    maxLearningIndex: number | null;
    minLearningIndex: number | null;
    averageKnowledgeGain: number | null;
    averageUncertaintyReduction: number | null;
    averageContextImprovement: number | null;
    interpretation?: string;
}
export interface LearningHistoryPayload {
    specFolder: string;
    count: number;
    learningHistory: LearningHistoryRow[];
    summary?: LearningHistorySummary;
}
/** Initialize the session_learning table schema if not already created */
declare function ensureSchema(database: Database): void;
/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
declare function handleTaskPreflight(args: PreflightArgs): Promise<MCPResponse>;
/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
declare function handleTaskPostflight(args: PostflightArgs): Promise<MCPResponse>;
/** Handle memory_get_learning_history tool - retrieves learning records with optional summary stats */
declare function handleGetLearningHistory(args: LearningHistoryArgs): Promise<MCPResponse>;
export { handleTaskPreflight, handleTaskPostflight, handleGetLearningHistory, ensureSchema, };
declare const handle_task_preflight: typeof handleTaskPreflight;
declare const handle_task_postflight: typeof handleTaskPostflight;
declare const handle_get_learning_history: typeof handleGetLearningHistory;
declare const ensure_schema: typeof ensureSchema;
export { handle_task_preflight, handle_task_postflight, handle_get_learning_history, ensure_schema, };
//# sourceMappingURL=session-learning.d.ts.map