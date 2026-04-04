import type { CollectedDataBase, ContextItem, FileChange, GapDescription, Observation, OutcomeEntry, PendingTask, PostflightData, PreflightData, RecentContextEntry, SessionData, SpecFileEntry, ToolCounts, UserPrompt } from '../types/session-types';
export type { ContextItem, GapDescription, OutcomeEntry, PendingTask, PostflightData, PreflightData, SessionData, };
/** Aggregates preflight and postflight comparison results. */
export interface PreflightPostflightResult {
    HAS_PREFLIGHT_BASELINE: boolean;
    HAS_POSTFLIGHT_DELTA: boolean;
    PREFLIGHT_KNOW_SCORE: number | null;
    PREFLIGHT_UNCERTAINTY_SCORE: number | null;
    PREFLIGHT_CONTEXT_SCORE: number | null;
    PREFLIGHT_KNOW_ASSESSMENT: string;
    PREFLIGHT_UNCERTAINTY_ASSESSMENT: string;
    PREFLIGHT_CONTEXT_ASSESSMENT: string;
    PREFLIGHT_TIMESTAMP: string | null;
    PREFLIGHT_GAPS: GapDescription[];
    PREFLIGHT_CONFIDENCE: number | null;
    PREFLIGHT_UNCERTAINTY_RAW: number | null;
    PREFLIGHT_READINESS: string | null;
    POSTFLIGHT_KNOW_SCORE: number | null;
    POSTFLIGHT_UNCERTAINTY_SCORE: number | null;
    POSTFLIGHT_CONTEXT_SCORE: number | null;
    DELTA_KNOW_SCORE: string | null;
    DELTA_UNCERTAINTY_SCORE: string | null;
    DELTA_CONTEXT_SCORE: string | null;
    DELTA_KNOW_TREND: string;
    DELTA_UNCERTAINTY_TREND: string;
    DELTA_CONTEXT_TREND: string;
    LEARNING_INDEX: number | null;
    LEARNING_SUMMARY: string;
    GAPS_CLOSED: GapDescription[];
    NEW_GAPS: GapDescription[];
}
/** Captures the synthesized data needed to continue a session. */
export interface ContinueSessionData {
    SESSION_STATUS: string;
    COMPLETION_PERCENT: number;
    LAST_ACTIVITY_TIMESTAMP: string;
    SESSION_DURATION: string;
    CONTINUATION_COUNT: number;
    CONTEXT_SUMMARY: string;
    PENDING_TASKS: PendingTask[];
    NEXT_CONTINUATION_COUNT: number;
    RESUME_CONTEXT: ContextItem[];
}
/** Full collected session payload used by downstream extractors. */
export interface CollectedDataFull extends CollectedDataBase {
}
declare function getScoreAssessment(score: number | null | undefined, metric: string): string;
declare function getTrendIndicator(delta: number | null | undefined, invertedBetter?: boolean): string;
declare function calculateLearningIndex(deltaKnow: number | null | undefined, deltaUncert: number | null | undefined, deltaContext: number | null | undefined): number;
declare function extractPreflightPostflightData(collectedData: CollectedDataFull | null): PreflightPostflightResult;
declare function generateLearningSummary(deltaKnow: number, deltaUncert: number, deltaContext: number, learningIndex: number): string;
declare function determineSessionStatus(blockers: string, observations: Observation[], messageCount: number, collectedData?: CollectedDataFull | null): string;
declare function estimateCompletionPercent(observations: Observation[], messageCount: number, toolCounts: ToolCounts, sessionStatus: string, collectedData?: CollectedDataFull | null): number;
declare function extractPendingTasks(observations: Observation[], recentContext: RecentContextEntry[] | undefined, nextAction: string): PendingTask[];
declare function generateContextSummary(summary: string, observations: Observation[], projectPhase: string, decisionCount: number): string;
declare function generateResumeContext(files: FileChange[], specFiles: SpecFileEntry[], observations: Observation[]): ContextItem[];
interface ContinueSessionParams {
    observations: Observation[];
    userPrompts: UserPrompt[];
    toolCounts: ToolCounts;
    recentContext?: RecentContextEntry[];
    FILES: FileChange[];
    SPEC_FILES: SpecFileEntry[];
    summary: string;
    projectPhase: string;
    lastAction: string;
    nextAction: string;
    blockers: string;
    duration: string;
    decisionCount: number;
    collectedData?: CollectedDataFull | null;
}
declare function buildContinueSessionData(params: ContinueSessionParams): ContinueSessionData;
/** Auto-save detection based on message count threshold. */
declare function shouldAutoSave(messageCount: number): boolean;
declare function collectSessionData(collectedData: CollectedDataFull | null, specFolderName?: string | null, explicitSessionId?: string): Promise<SessionData>;
export { collectSessionData, shouldAutoSave, extractPreflightPostflightData, calculateLearningIndex, getScoreAssessment, getTrendIndicator, generateLearningSummary, buildContinueSessionData, determineSessionStatus, estimateCompletionPercent, extractPendingTasks, generateContextSummary, generateResumeContext, };
//# sourceMappingURL=collect-session-data.d.ts.map