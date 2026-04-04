import type Database from 'better-sqlite3';
interface WorkingMemoryConfigType {
    enabled: boolean;
    maxCapacity: number;
    sessionTimeoutMs: number;
}
declare const WORKING_MEMORY_CONFIG: WorkingMemoryConfigType;
declare const EVENT_DECAY_FACTOR = 0.85;
declare const MENTION_BOOST_FACTOR = 0.05;
declare const DECAY_FLOOR = 0.05;
declare const DELETE_THRESHOLD = 0.01;
declare const EVENT_COUNTER_MODULUS: number;
declare const MAX_MENTION_COUNT = 100;
declare const SCHEMA_SQL = "\n  CREATE TABLE IF NOT EXISTS working_memory (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    session_id TEXT NOT NULL,\n    memory_id INTEGER,\n    attention_score REAL DEFAULT 1.0,\n    added_at TEXT DEFAULT CURRENT_TIMESTAMP,\n    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,\n    focus_count INTEGER DEFAULT 1,\n    event_counter INTEGER NOT NULL DEFAULT 0,\n    mention_count INTEGER NOT NULL DEFAULT 0,\n    source_tool TEXT,\n    source_call_id TEXT,\n    extraction_rule_id TEXT,\n    redaction_applied INTEGER NOT NULL DEFAULT 0,\n    UNIQUE(session_id, memory_id),\n    FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL\n  )\n";
declare const INDEX_SQL = "\n  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);\n  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);\n  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);\n  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);\n  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);\n";
interface WorkingMemoryEntry {
    id: number;
    session_id: string;
    memory_id: number;
    attention_score: number;
    added_at: string;
    last_focused: string;
    focus_count: number;
    event_counter: number;
    mention_count: number;
    source_tool?: string | null;
    source_call_id?: string | null;
    extraction_rule_id?: string | null;
    redaction_applied?: number;
}
interface ExtractedEntryInput {
    sessionId: string;
    memoryId: number;
    attentionScore: number;
    sourceTool: string;
    sourceCallId: string;
    extractionRuleId: string;
    redactionApplied: boolean;
}
interface SessionInfo {
    sessionId: string;
    memoryCount: number;
    avgAttention: number;
    createdAt: string;
    lastActivity: string;
}
interface SessionStats {
    sessionId: string;
    totalEntries: number;
    avgAttention: number;
    maxAttention: number;
    minAttention: number;
    totalFocusEvents: number;
}
interface SessionPromptContextEntry {
    memoryId: number;
    title: string;
    filePath: string;
    attentionScore: number;
}
declare function init(database: Database.Database): void;
declare function ensureSchema(): void;
declare function getOrCreateSession(sessionId?: string | null): string;
declare function clearSession(sessionId: string): number;
declare function cleanupOldSessions(): number;
declare function getWorkingMemory(sessionId: string): WorkingMemoryEntry[];
declare function getSessionMemories(sessionId: string): Array<Record<string, unknown>>;
declare function sessionExists(sessionId: string): boolean;
declare function getSessionEventCounter(sessionId: string): number;
declare function getSessionPromptContext(sessionId: string, floor?: number, limit?: number): SessionPromptContextEntry[];
declare function getSessionInferredMode(sessionId: string): string | null;
declare function setSessionInferredMode(sessionId: string, mode: string): void;
/**
 * Calculate attention tier for an entry.
 */
declare function calculateTier(attentionScore: number): string;
/**
 * Set or update the attention score for a memory in working memory.
 */
declare function setAttentionScore(sessionId: string, memoryId: number, score: number): boolean;
declare function upsertExtractedEntry(input: ExtractedEntryInput): boolean;
/**
 * Enforce working memory capacity limit by LRU eviction.
 *
 * LRU is defined as the least-recently focused entries first (`last_focused ASC`).
 * `id ASC` is used as a deterministic tie-breaker when timestamps are equal.
 */
declare function enforceMemoryLimit(sessionId: string): number;
/**
 * Batch update attention scores with decay.
 *
 * Separates the decay floor from the delete threshold to prevent the
 * decay/delete race condition:
 *   - decayFloor (0.05): scores are clamped here, never decay below this
 *   - deleteThreshold (0.01): only entries below this are pruned
 * This gives floored memories a stable resting state instead of immediate
 * deletion. Entries can only reach below deleteThreshold through explicit
 * score-setting or extended inactivity cleanup.
 */
declare function batchUpdateScores(sessionId: string): number;
declare function isEnabled(): boolean;
declare function getConfig(): WorkingMemoryConfigType;
declare function getSessionStats(sessionId: string): SessionStats | null;
export { WORKING_MEMORY_CONFIG, SCHEMA_SQL, INDEX_SQL, init, ensureSchema, getOrCreateSession, clearSession, cleanupOldSessions, getWorkingMemory, getSessionMemories, sessionExists, getSessionEventCounter, getSessionPromptContext, getSessionInferredMode, setSessionInferredMode, calculateTier, setAttentionScore, upsertExtractedEntry, enforceMemoryLimit, batchUpdateScores, DECAY_FLOOR, DELETE_THRESHOLD, EVENT_DECAY_FACTOR, MENTION_BOOST_FACTOR, EVENT_COUNTER_MODULUS, MAX_MENTION_COUNT, isEnabled, getConfig, getSessionStats, };
export type { WorkingMemoryConfigType, WorkingMemoryEntry, SessionInfo, SessionStats, SessionPromptContextEntry, ExtractedEntryInput, };
//# sourceMappingURL=working-memory.d.ts.map