// ───────────────────────────────────────────────────────────────
// MODULE: Working Memory
// ───────────────────────────────────────────────────────────────
// Session-based attention management
// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
// Only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
// The working_memory table, NOT memory_index. This is intentionally
// Independent of FSRS long-term decay — different time scale, different
// Domain (ephemeral session attention vs persistent memory scoring).
// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
// Ensures stable resting state and explicit low-score eviction.
import type Database from 'better-sqlite3';
import { isFeatureEnabled } from './rollout-policy.js';

// Feature catalog: Tool-result extraction to working memory
// Feature catalog: Working Memory Session Cleanup Timestamp Fix


/* --- 1. CONFIGURATION --- */

interface WorkingMemoryConfigType {
  enabled: boolean;
  maxCapacity: number;
  sessionTimeoutMs: number;
}

const WORKING_MEMORY_CONFIG: WorkingMemoryConfigType = {
  enabled: process.env.SPECKIT_WORKING_MEMORY !== 'false',
  maxCapacity: 7, // Miller's Law: 7 +/- 2
  sessionTimeoutMs: 1800000, // 30 minutes
};

const EVENT_DECAY_FACTOR = 0.85;
const MENTION_BOOST_FACTOR = 0.05;
const DECAY_FLOOR = 0.05;
const DELETE_THRESHOLD = 0.01;
const EVENT_COUNTER_MODULUS = 2 ** 31;
// Cap mention_count to prevent unbounded integer growth in long-lived
// Sessions. The mention boost formula (mention_count * MENTION_BOOST_FACTOR)
// Would produce unreasonably large scores without a ceiling.
const MAX_MENTION_COUNT = 100;

/* --- 2. SCHEMA SQL --- */

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS working_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    memory_id INTEGER,
    attention_score REAL DEFAULT 1.0,
    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
    focus_count INTEGER DEFAULT 1,
    event_counter INTEGER NOT NULL DEFAULT 0,
    mention_count INTEGER NOT NULL DEFAULT 0,
    source_tool TEXT,
    source_call_id TEXT,
    extraction_rule_id TEXT,
    redaction_applied INTEGER NOT NULL DEFAULT 0,
    UNIQUE(session_id, memory_id),
    FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
  )
`;

const INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);
  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
`;

/* --- 3. INTERFACES --- */

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

/* --- 4. MODULE STATE --- */

let db: Database.Database | null = null;
let schemaEnsured = false;
const sessionModeRegistry = new Map<string, string>();

/* --- 5. INITIALIZATION --- */

function init(database: Database.Database): void {
  db = database;
  schemaEnsured = false;
  ensureSchema();
}

function ensureSchema(): void {
  if (!db || schemaEnsured) return;

  try {
    db.exec(SCHEMA_SQL);
    const wmColumns = (db.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
      .map(column => column.name);

    if (!wmColumns.includes('event_counter')) {
      db.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
    }
    if (!wmColumns.includes('mention_count')) {
      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
    }
    if (!wmColumns.includes('source_tool')) {
      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
    }
    if (!wmColumns.includes('source_call_id')) {
      db.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
    }
    if (!wmColumns.includes('extraction_rule_id')) {
      db.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
    }
    if (!wmColumns.includes('redaction_applied')) {
      db.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
    }

    migrateLegacyWorkingMemorySchema();
    db.exec(INDEX_SQL);
    schemaEnsured = true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] Schema creation failed: ${msg}`);
  }
}

function migrateLegacyWorkingMemorySchema(): void {
  if (!db) return;

  const tableInfo = db.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
  ).get() as { sql?: string | null } | undefined;
  const tableSql = tableInfo?.sql ?? '';
  const needsMigration = tableSql.includes('ON DELETE CASCADE') || tableSql.includes('memory_id INTEGER NOT NULL');

  if (!needsMigration) {
    return;
  }

  db.exec(`
    ALTER TABLE working_memory RENAME TO working_memory_old;
    ${SCHEMA_SQL};
    INSERT INTO working_memory (
      id,
      session_id,
      memory_id,
      attention_score,
      added_at,
      last_focused,
      focus_count,
      event_counter,
      mention_count,
      source_tool,
      source_call_id,
      extraction_rule_id,
      redaction_applied
    )
    SELECT
      id,
      session_id,
      memory_id,
      attention_score,
      added_at,
      last_focused,
      focus_count,
      COALESCE(event_counter, 0),
      COALESCE(mention_count, 0),
      source_tool,
      source_call_id,
      extraction_rule_id,
      COALESCE(redaction_applied, 0)
    FROM working_memory_old;
    DROP TABLE working_memory_old;
  `);
}

/* --- 6. SESSION MANAGEMENT --- */

function getOrCreateSession(sessionId: string | null = null): string {
  if (sessionId) return sessionId;

  // Generate a new session ID
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `wm-${timestamp}-${random}`;
}

function clearSession(sessionId: string): number {
  if (!db) return 0;
  ensureSchema();

  try {
    const result = (db.prepare(
      'DELETE FROM working_memory WHERE session_id = ?'
    ) as Database.Statement).run(sessionId);
    sessionModeRegistry.delete(sessionId);
    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] clearSession error: ${msg}`);
    return 0;
  }
}

function cleanupOldSessions(): number {
  if (!db) return 0;
  ensureSchema();

  try {
    const timeoutSeconds = Math.floor(WORKING_MEMORY_CONFIG.sessionTimeoutMs / 1000);
    const nowIso = new Date(Date.now()).toISOString();
    const staleSessionIds = (db.prepare(
      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
    ) as Database.Statement).all(nowIso, timeoutSeconds) as Array<{ session_id: string }>;
    const result = (db.prepare(
      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
    ) as Database.Statement).run(nowIso, timeoutSeconds);
    for (const row of staleSessionIds) {
      sessionModeRegistry.delete(row.session_id);
    }
    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] cleanupOldSessions error: ${msg}`);
    return 0;
  }
}

/* --- 7. WORKING MEMORY OPERATIONS --- */

function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
  if (!db) return [];
  ensureSchema();

  try {
    return (db.prepare(`
      SELECT * FROM working_memory
      WHERE session_id = ?
        AND memory_id IS NOT NULL
      ORDER BY attention_score DESC
    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getWorkingMemory error: ${msg}`);
    return [];
  }
}

function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
  if (!db) return [];
  ensureSchema();

  try {
    return (db.prepare(`
      SELECT m.*, wm.attention_score, wm.focus_count, wm.last_focused
      FROM working_memory wm
      JOIN memory_index m ON wm.memory_id = m.id
      WHERE wm.session_id = ?
      ORDER BY wm.attention_score DESC
    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getSessionMemories error: ${msg}`);
    return [];
  }
}

function sessionExists(sessionId: string): boolean {
  return getLatestSessionEventCounter(sessionId) !== null;
}

function getSessionEventCounter(sessionId: string): number {
  const current = getLatestSessionEventCounter(sessionId);
  return current === null ? 0 : current;
}

function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
  if (!db) return [];
  ensureSchema();

  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
  const safeFloor = Math.max(0, Math.min(1, floor));

  try {
    return (db.prepare(`
      SELECT
        wm.memory_id AS memoryId,
        COALESCE(m.title, '') AS title,
        COALESCE(m.file_path, '') AS filePath,
        wm.attention_score AS attentionScore
      FROM working_memory wm
      LEFT JOIN memory_index m ON wm.memory_id = m.id
      WHERE wm.session_id = ?
        AND wm.memory_id IS NOT NULL
        AND wm.attention_score > ?
      ORDER BY wm.attention_score DESC, wm.last_focused DESC
      LIMIT ?
    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
    return [];
  }
}

function getSessionInferredMode(sessionId: string): string | null {
  const mode = sessionModeRegistry.get(sessionId);
  return typeof mode === 'string' && mode.length > 0 ? mode : null;
}

function setSessionInferredMode(sessionId: string, mode: string): void {
  const normalizedSessionId = sessionId.trim();
  const normalizedMode = mode.trim();
  if (normalizedSessionId.length === 0 || normalizedMode.length === 0) {
    return;
  }
  sessionModeRegistry.set(normalizedSessionId, normalizedMode);
}

/**
 * Calculate attention tier for an entry.
 */
function calculateTier(attentionScore: number): string {
  if (attentionScore >= 0.8) return 'focused';
  if (attentionScore >= 0.5) return 'active';
  if (attentionScore >= 0.2) return 'peripheral';
  return 'fading';
}

/**
 * Set or update the attention score for a memory in working memory.
 */
function setAttentionScore(
  sessionId: string,
  memoryId: number,
  score: number
): boolean {
  if (!db) return false;
  ensureSchema();

  const clampedScore = Math.max(0, Math.min(1, score));

  try {
    const currentEventCounter = nextEventCounter(sessionId);

    const existing = (db.prepare(
      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;

    if (existing) {
      (db.prepare(`
        UPDATE working_memory
        SET attention_score = ?,
            last_focused = CURRENT_TIMESTAMP,
            focus_count = focus_count + 1,
            mention_count = MIN(mention_count + 1, ${MAX_MENTION_COUNT}),
            event_counter = ?
        WHERE session_id = ? AND memory_id = ?
      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
    } else {
      // Check capacity
      enforceMemoryLimit(sessionId);

      (db.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
        VALUES (?, ?, ?, ?, 0)
      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
    }

    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
    return false;
  }
}

function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
  if (!db) return false;
  ensureSchema();

  const {
    sessionId,
    memoryId,
    attentionScore,
    sourceTool,
    sourceCallId,
    extractionRuleId,
    redactionApplied,
  } = input;

  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
    return false;
  }

  const clampedScore = Math.max(0, Math.min(1, attentionScore));

  try {
    const currentEventCounter = nextEventCounter(sessionId);

    (db.prepare(`
      INSERT INTO working_memory (
        session_id,
        memory_id,
        attention_score,
        event_counter,
        mention_count,
        source_tool,
        source_call_id,
        extraction_rule_id,
        redaction_applied
      ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)
      ON CONFLICT(session_id, memory_id) DO UPDATE SET
        attention_score = CASE
          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
          ELSE working_memory.attention_score
        END,
        last_focused = CURRENT_TIMESTAMP,
        focus_count = working_memory.focus_count + 1,
        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
        event_counter = excluded.event_counter,
        source_tool = excluded.source_tool,
        source_call_id = excluded.source_call_id,
        extraction_rule_id = excluded.extraction_rule_id,
        redaction_applied = excluded.redaction_applied
    `) as Database.Statement).run(
      sessionId,
      memoryId,
      clampedScore,
      currentEventCounter,
      sourceTool,
      sourceCallId,
      extractionRuleId,
      redactionApplied ? 1 : 0
    );

    // If focus_count is still 1 after the upsert, this row was newly inserted.
    // Capacity checks should run only for new rows to avoid evicting on updates.
    const currentRow = (db.prepare(
      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
    ) as Database.Statement).get(sessionId, memoryId) as { focus_count?: number } | undefined;
    if ((currentRow?.focus_count ?? 0) === 1) {
      enforceMemoryLimit(sessionId);
    }

    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] upsertExtractedEntry error: ${msg}`);
    return false;
  }
}

function nextEventCounter(sessionId: string): number {
  if (!db) return 0;

  const current = getLatestSessionEventCounter(sessionId);
  if (current === null) {
    return 0;
  }

  return (current + 1) % EVENT_COUNTER_MODULUS;
}

/**
 * Enforce working memory capacity limit by LRU eviction.
 *
 * LRU is defined as the least-recently focused entries first (`last_focused ASC`).
 * `id ASC` is used as a deterministic tie-breaker when timestamps are equal.
 */
function enforceMemoryLimit(sessionId: string): number {
  if (!db) return 0;

  try {
    const count = (db.prepare(
      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
    ) as Database.Statement).get(sessionId) as { count: number };

    if (count.count < WORKING_MEMORY_CONFIG.maxCapacity) return 0;

    const excess = count.count - WORKING_MEMORY_CONFIG.maxCapacity + 1;
    const result = (db.prepare(`
      DELETE FROM working_memory
      WHERE id IN (
        SELECT id FROM working_memory
        WHERE session_id = ?
          AND memory_id IS NOT NULL
        ORDER BY last_focused ASC, id ASC
        LIMIT ?
      )
    `) as Database.Statement).run(sessionId, excess);

    return (result as { changes: number }).changes;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] enforceMemoryLimit error: ${msg}`);
    return 0;
  }
}

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
function batchUpdateScores(sessionId: string): number {
  if (!db) return 0;
  ensureSchema();

  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
    return 0;
  }

  try {
    const currentEventCounter = getCurrentEventCounter(sessionId);
    const entries = (db.prepare(`
      SELECT id, attention_score, event_counter, mention_count
      FROM working_memory
      WHERE session_id = ?
        AND memory_id IS NOT NULL
    `) as Database.Statement).all(sessionId) as Array<{
      id: number;
      attention_score: number;
      event_counter: number;
      mention_count: number;
    }>;

    if (entries.length === 0) {
      return 0;
    }

    const updateStmt = db.prepare(`
      UPDATE working_memory
      SET attention_score = ?,
          event_counter = event_counter + 1
      WHERE id = ?
    `) as Database.Statement;

    const deleteStmt = db.prepare(`
      DELETE FROM working_memory
      WHERE id = ?
    `) as Database.Statement;

    let changedRows = 0;
    db.transaction(() => {
      for (const entry of entries) {
        const eventsElapsed = calculateEventDistance(currentEventCounter, entry.event_counter);
        const decayBase = entry.attention_score * Math.pow(EVENT_DECAY_FACTOR, eventsElapsed);
        const mentionBoost = Math.min(entry.mention_count, MAX_MENTION_COUNT) * MENTION_BOOST_FACTOR;
        const rawScore = decayBase + mentionBoost;

        if (rawScore < DELETE_THRESHOLD) {
          const deleteResult = deleteStmt.run(entry.id) as { changes: number };
          changedRows += deleteResult.changes;
          continue;
        }

        // Clamp to [DECAY_FLOOR, 1.0].
        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
        const updateResult = updateStmt.run(nextScore, entry.id) as { changes: number };
        changedRows += updateResult.changes;
      }
    })();

    return changedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
    return 0;
  }
}

function getCurrentEventCounter(sessionId: string): number {
  const current = getLatestSessionEventCounter(sessionId);
  if (current === null) {
    return 0;
  }

  return current;
}

function getLatestSessionEventCounter(sessionId: string): number | null {
  if (!db) return null;

  try {
    const row = (db.prepare(`
      SELECT event_counter
      FROM working_memory
      WHERE session_id = ?
        AND memory_id IS NOT NULL
      ORDER BY last_focused DESC, id DESC
      LIMIT 1
    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };

    if (!row || typeof row.event_counter !== 'number' || Number.isNaN(row.event_counter)) {
      return null;
    }

    return row.event_counter;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getLatestSessionEventCounter error: ${msg}`);
    return null;
  }
}

function calculateEventDistance(currentCounter: number, entryCounter: number): number {
  const normalizedCurrent = ((currentCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
  const normalizedEntry = ((entryCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
  return (normalizedCurrent - normalizedEntry + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
}

/* --- 8. UTILITY FUNCTIONS --- */

function isEnabled(): boolean {
  return WORKING_MEMORY_CONFIG.enabled;
}

function getConfig(): WorkingMemoryConfigType {
  return { ...WORKING_MEMORY_CONFIG };
}

function getSessionStats(sessionId: string): SessionStats | null {
  if (!db) return null;
  ensureSchema();

  try {
    const stats = (db.prepare(`
      SELECT
        COUNT(*) as totalEntries,
        AVG(attention_score) as avgAttention,
        MAX(attention_score) as maxAttention,
        MIN(attention_score) as minAttention,
        SUM(focus_count) as totalFocusEvents
      FROM working_memory
      WHERE session_id = ?
        AND memory_id IS NOT NULL
    `) as Database.Statement).get(sessionId) as {
      totalEntries: number;
      avgAttention: number;
      maxAttention: number;
      minAttention: number;
      totalFocusEvents: number;
    } | undefined;

    if (!stats || stats.totalEntries === 0) return null;

    return {
      sessionId,
      totalEntries: stats.totalEntries,
      avgAttention: Math.round((stats.avgAttention || 0) * 100) / 100,
      maxAttention: stats.maxAttention || 0,
      minAttention: stats.minAttention || 0,
      totalFocusEvents: stats.totalFocusEvents || 0,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getSessionStats error: ${msg}`);
    return null;
  }
}

/* --- 9. EXPORTS --- */

export {
  WORKING_MEMORY_CONFIG,
  SCHEMA_SQL,
  INDEX_SQL,

  // Initialization
  init,
  ensureSchema,

  // Session management
  getOrCreateSession,
  clearSession,
  cleanupOldSessions,

  // Working memory operations
  getWorkingMemory,
  getSessionMemories,
  sessionExists,
  getSessionEventCounter,
  getSessionPromptContext,
  getSessionInferredMode,
  setSessionInferredMode,
  calculateTier,
  setAttentionScore,
  upsertExtractedEntry,
  enforceMemoryLimit,
  batchUpdateScores,
  DECAY_FLOOR,
  DELETE_THRESHOLD,
  EVENT_DECAY_FACTOR,
  MENTION_BOOST_FACTOR,
  EVENT_COUNTER_MODULUS,
  MAX_MENTION_COUNT,

  // Utilities
  isEnabled,
  getConfig,
  getSessionStats,
};

export type {
  WorkingMemoryConfigType,
  WorkingMemoryEntry,
  SessionInfo,
  SessionStats,
  SessionPromptContextEntry,
  ExtractedEntryInput,
};
