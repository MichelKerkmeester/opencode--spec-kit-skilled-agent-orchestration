import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
interface SessionConfig {
    sessionTtlMinutes: number;
    maxEntriesPerSession: number;
    enabled: boolean;
    dbUnavailableMode: 'allow' | 'block';
}
interface InitResult {
    success: boolean;
    error?: string;
}
interface MemoryInput {
    id?: number;
    file_path?: string;
    anchorId?: string;
    anchor_id?: string;
    content_hash?: string;
    title?: string;
}
interface MarkResult {
    success: boolean;
    hash?: string;
    skipped?: boolean;
    error?: string;
}
interface MarkBatchResult {
    success: boolean;
    markedCount: number;
    skipped?: boolean;
    error?: string;
}
interface SessionStats {
    totalSent: number;
    oldestEntry: string | null;
    newestEntry: string | null;
}
interface FilterResult {
    filtered: MemoryInput[];
    dedupStats: {
        enabled: boolean;
        filtered: number;
        total: number;
        tokenSavingsEstimate?: string;
        sessionId?: string;
    };
}
interface CleanupResult {
    success: boolean;
    deletedCount: number;
}
interface StaleCleanupResult {
    success: boolean;
    workingMemoryDeleted: number;
    sentMemoriesDeleted: number;
    sessionStateDeleted: number;
    errors: string[];
}
interface SessionState {
    sessionId: string;
    status: string;
    specFolder: string | null;
    currentTask: string | null;
    lastAction: string | null;
    contextSummary: string | null;
    pendingWork: string | null;
    tenantId: string | null;
    userId: string | null;
    agentId: string | null;
    data: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    _recovered: boolean;
}
interface SessionIdentityScope {
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
}
interface SessionStateInput extends SessionIdentityScope {
    specFolder?: string | null;
    currentTask?: string | null;
    lastAction?: string | null;
    contextSummary?: string | null;
    pendingWork?: string | null;
    data?: Record<string, unknown> | null;
}
interface RecoverResult {
    success: boolean;
    state?: SessionState | null;
    _recovered?: boolean;
    error?: string;
}
interface InterruptedSession {
    sessionId: string;
    specFolder: string | null;
    currentTask: string | null;
    lastAction: string | null;
    contextSummary: string | null;
    pendingWork: string | null;
    updatedAt: string;
}
interface InterruptedSessionsResult {
    success: boolean;
    sessions: InterruptedSession[];
    error?: string;
}
interface ResetResult {
    success: boolean;
    interruptedCount: number;
    error?: string;
}
interface CheckpointResult {
    success: boolean;
    filePath?: string;
    note?: string;
    error?: string;
}
interface ContinueSessionInput {
    sessionId: string;
    specFolder?: string | null;
    currentTask?: string | null;
    lastAction?: string | null;
    contextSummary?: string | null;
    pendingWork?: string | null;
    tenantId?: string | null;
    userId?: string | null;
    agentId?: string | null;
    data?: Record<string, unknown> | null;
}
interface TrustedSessionResolution {
    requestedSessionId: string | null;
    effectiveSessionId: string;
    trusted: boolean;
    error?: string;
}
/**
 * Session configuration with defaults from spec.md (R7 mitigation)
 * - Session TTL: 30 minutes
 * - Cap at 100 entries per session
 */
declare const SESSION_CONFIG: SessionConfig;
declare function init(database: Database): InitResult;
declare function getDb(): Database | null;
declare function isTrackedSession(sessionId: string): boolean;
declare function resolveTrustedSession(requestedSessionId?: string | null, scope?: SessionIdentityScope): TrustedSessionResolution;
declare function ensureSchema(): InitResult;
declare function generateMemoryHash(memory: MemoryInput): string;
declare function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean;
declare function shouldSendMemoriesBatch(sessionId: string, memories: MemoryInput[], markAsSent?: boolean): Map<number, boolean>;
declare function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult;
declare function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult;
declare function cleanupExpiredSessions(): CleanupResult;
/**
 * T302: Clean up stale sessions across all session-related tables.
 *
 * Targets:
 *   - working_memory: entries with last_focused older than threshold
 *   - session_sent_memories: entries with sent_at older than threshold
 *   - session_state: completed/interrupted sessions older than threshold
 *
 * Preserves:
 *   - session_learning records (permanent, never cleaned)
 *   - Active sessions (session_state with status='active')
 *
 * @param thresholdMs - Inactivity threshold in milliseconds (default: STALE_SESSION_THRESHOLD_MS / 24h)
 */
declare function cleanupStaleSessions(thresholdMs?: number): StaleCleanupResult;
declare function clearSession(sessionId: string): CleanupResult;
declare function getSessionStats(sessionId: string): SessionStats;
declare function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult;
declare function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult;
declare function isEnabled(): boolean;
declare function getConfig(): SessionConfig;
declare function ensureSessionStateSchema(): InitResult;
declare function saveSessionState(sessionId: string, state?: SessionStateInput): InitResult;
declare function completeSession(sessionId: string): InitResult;
declare function resetInterruptedSessions(): ResetResult;
declare function recoverState(sessionId: string, scope?: SessionIdentityScope): RecoverResult;
declare function getInterruptedSessions(scope?: SessionIdentityScope): InterruptedSessionsResult;
declare function generateContinueSessionMd(sessionState: ContinueSessionInput): string;
declare function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult;
declare function checkpointSession(sessionId: string, state: SessionStateInput, specFolderPath?: string | null): CheckpointResult;
declare function shutdown(): void;
export { init, ensureSchema, getDb, generateMemoryHash, shouldSendMemory, shouldSendMemoriesBatch, markMemorySent, markMemoriesSentBatch, cleanupExpiredSessions, cleanupStaleSessions, clearSession, getSessionStats, isTrackedSession, resolveTrustedSession, filterSearchResults, markResultsSent, ensureSessionStateSchema, saveSessionState, completeSession, resetInterruptedSessions, recoverState, getInterruptedSessions, generateContinueSessionMd, writeContinueSessionMd, checkpointSession, isEnabled, getConfig, SESSION_CONFIG as CONFIG, shutdown, };
//# sourceMappingURL=session-manager.d.ts.map