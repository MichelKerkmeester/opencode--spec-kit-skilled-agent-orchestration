// ───────────────────────────────────────────────────────────────
// MODULE: Session Manager
// ───────────────────────────────────────────────────────────────
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
// Import working-memory for immediate cleanup on session end (GAP 2).
import * as workingMemory from '../cognitive/working-memory.js';

// Feature catalog: Session-manager transaction gap fixes


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
──────────────────────────────────────────────────────────────── */

/**
 * Session configuration with defaults from spec.md (R7 mitigation)
 * - Session TTL: 30 minutes
 * - Cap at 100 entries per session
 */
const SESSION_CONFIG: SessionConfig = {
  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
  enabled: process.env.DISABLE_SESSION_DEDUP !== 'true',
  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
};

/* ───────────────────────────────────────────────────────────────
   3. DATABASE REFERENCE
──────────────────────────────────────────────────────────────── */

let db: Database | null = null;
// Track periodic cleanup interval for expired sessions
let cleanupInterval: ReturnType<typeof setInterval> | null = null;
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

// Track stale session cleanup interval (runs hourly)
let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours

function init(database: Database): InitResult {
  if (!database) {
    console.error('[session-manager] WARNING: init() called with null database');
    return { success: false, error: 'Database reference is required' };
  }
  db = database;

  const schemaResult = ensureSchema();
  if (!schemaResult.success) {
    return schemaResult;
  }

  cleanupExpiredSessions();

  // Set up periodic cleanup instead of only running once at init (P4-18).
  // Clear any existing interval first (in case of reinitializeDatabase).
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  cleanupInterval = setInterval(() => {
    try {
      cleanupExpiredSessions();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[session-manager] Periodic cleanup failed: ${message}`);
    }
  }, CLEANUP_INTERVAL_MS);
  // Ensure interval doesn't prevent process exit (unref allows GC on idle)
  if (cleanupInterval && typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
    cleanupInterval.unref();
  }

  // Run stale session cleanup on startup and set up hourly interval
  try {
    cleanupStaleSessions();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
  }

  if (staleCleanupInterval) {
    clearInterval(staleCleanupInterval);
  }
  staleCleanupInterval = setInterval(() => {
    try {
      cleanupStaleSessions();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
    }
  }, STALE_CLEANUP_INTERVAL_MS);
  if (staleCleanupInterval && typeof staleCleanupInterval === 'object' && 'unref' in staleCleanupInterval) {
    staleCleanupInterval.unref();
  }

  return { success: true };
}

function getDb(): Database | null {
  return db;
}

function hasTable(tableName: string): boolean {
  if (!db) return false;

  try {
    const row = db.prepare(
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
    ).get(tableName) as { 1?: number } | undefined;
    return Boolean(row);
  } catch {
    return false;
  }
}

function hasSessionStateRecord(sessionId: string): boolean {
  if (!db || !hasTable('session_state')) return false;

  try {
    const row = db.prepare(
      'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1'
    ).get(sessionId) as { 1?: number } | undefined;
    return Boolean(row);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] hasSessionStateRecord failed: ${message}`);
    return false;
  }
}

function hasSentMemoryRecord(sessionId: string): boolean {
  if (!db || !hasTable('session_sent_memories')) return false;

  try {
    const row = db.prepare(
      'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1'
    ).get(sessionId) as { 1?: number } | undefined;
    return Boolean(row);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] hasSentMemoryRecord failed: ${message}`);
    return false;
  }
}

function isTrackedSession(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') {
    return false;
  }

  const normalizedSessionId = sessionId.trim();
  if (normalizedSessionId.length === 0) {
    return false;
  }

  return workingMemory.sessionExists(normalizedSessionId)
    || hasSessionStateRecord(normalizedSessionId)
    || hasSentMemoryRecord(normalizedSessionId);
}

function normalizeIdentityValue(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function getSessionIdentityRecord(sessionId: string): {
  tenantId: string | null;
  userId: string | null;
  agentId: string | null;
} | null {
  if (!db || !hasTable('session_state')) {
    return null;
  }

  const row = db.prepare(`
    SELECT tenant_id, user_id, agent_id
    FROM session_state
    WHERE session_id = ?
    LIMIT 1
  `).get(sessionId) as Record<string, unknown> | undefined;

  if (!row) {
    return null;
  }

  return {
    tenantId: normalizeIdentityValue(row.tenant_id),
    userId: normalizeIdentityValue(row.user_id),
    agentId: normalizeIdentityValue(row.agent_id),
  };
}

function getIdentityMismatch(
  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
  scope: SessionIdentityScope = {},
): string | null {
  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
    return 'tenantId';
  }

  const requestedUserId = normalizeIdentityValue(scope.userId);
  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
    return 'userId';
  }

  const requestedAgentId = normalizeIdentityValue(scope.agentId);
  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
    return 'agentId';
  }

  return null;
}

function hasCorroboratedIdentity(
  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
}

function resolveTrustedSession(
  requestedSessionId: string | null = null,
  scope: SessionIdentityScope = {},
): TrustedSessionResolution {
  const normalizedSessionId = typeof requestedSessionId === 'string' && requestedSessionId.trim().length > 0
    ? requestedSessionId.trim()
    : null;

  if (!normalizedSessionId) {
    return {
      requestedSessionId: null,
      effectiveSessionId: crypto.randomUUID(),
      trusted: false,
    };
  }

  if (!isTrackedSession(normalizedSessionId)) {
    return {
      requestedSessionId: normalizedSessionId,
      effectiveSessionId: '',
      trusted: false,
      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
    };
  }

  const storedIdentity = getSessionIdentityRecord(normalizedSessionId);
  if (!hasCorroboratedIdentity(storedIdentity)) {
    return {
      requestedSessionId: normalizedSessionId,
      effectiveSessionId: '',
      trusted: false,
      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
    };
  }

  const mismatch = getIdentityMismatch(storedIdentity, scope);
  if (mismatch) {
    return {
      requestedSessionId: normalizedSessionId,
      effectiveSessionId: '',
      trusted: false,
      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
    };
  }

  return {
    requestedSessionId: normalizedSessionId,
    effectiveSessionId: normalizedSessionId,
    trusted: true,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. SCHEMA MANAGEMENT
──────────────────────────────────────────────────────────────── */

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS session_sent_memories (
    session_id TEXT NOT NULL,
    memory_hash TEXT NOT NULL,
    memory_id INTEGER,
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id, memory_hash)
  );
`;

const INDEX_SQL: string[] = [
  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
  'CREATE INDEX IF NOT EXISTS idx_session_sent_time ON session_sent_memories(sent_at);',
];

function ensureSchema(): InitResult {
  if (!db) {
    return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  }

  try {
    db.exec(SCHEMA_SQL);
    for (const indexSql of INDEX_SQL) {
      db.exec(indexSql);
    }
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] Schema creation failed: ${message}`);
    return { success: false, error: message };
  }
}

/* ───────────────────────────────────────────────────────────────
   5. HASH GENERATION
──────────────────────────────────────────────────────────────── */

function generateMemoryHash(memory: MemoryInput): string {
  if (!memory) {
    throw new Error('Memory object is required for hash generation');
  }

  let hashInput: string;

  if (memory.content_hash) {
    hashInput = memory.content_hash;
  } else if (memory.id !== undefined) {
    // Support both anchor_id (snake_case) and anchorId (camelCase) — callers may pass either form (P4-16).
    hashInput = `${memory.id}:${memory.anchor_id || memory.anchorId || ''}:${memory.file_path || ''}`;
  } else {
    hashInput = JSON.stringify({
      // Prefer anchor_id (canonical), fall back to anchorId for legacy callers (P4-16)
      anchor: memory.anchor_id || memory.anchorId,
      path: memory.file_path,
      title: memory.title,
    });
  }

  // Use 128-bit (32 hex chars) instead of
  // 64-bit (16 hex chars) to reduce collision probability.
  return crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 32);
}

/* ───────────────────────────────────────────────────────────────
   6. DEDUPLICATION METHODS
──────────────────────────────────────────────────────────────── */

function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
  if (!SESSION_CONFIG.enabled) return true;
  if (!db) {
    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
    console.warn(`[session-manager] Database not initialized. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} memory.`);
    return allow;
  }
  if (!sessionId || typeof sessionId !== 'string') return true;

  try {
    const memoryObj: MemoryInput = typeof memory === 'number' ? { id: memory } : memory;
    const hash = generateMemoryHash(memoryObj);

    const stmt = db.prepare(`
      SELECT 1 FROM session_sent_memories
      WHERE session_id = ? AND memory_hash = ?
      LIMIT 1
    `);
    const exists = stmt.get(sessionId, hash);
    return !exists;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] shouldSendMemory check failed: ${message}`);
    return SESSION_CONFIG.dbUnavailableMode === 'allow';
  }
}

function shouldSendMemoriesBatch(
  sessionId: string,
  memories: MemoryInput[],
  markAsSent: boolean = false
): Map<number, boolean> {
  const result = new Map<number, boolean>();

  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
    memories.forEach((m) => {
      if (m.id != null) {
        result.set(m.id, true);
      }
    });
    return result;
  }

  if (!db) {
    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
    memories.forEach((m) => {
      if (m.id != null) {
        result.set(m.id, allow);
      }
    });
    return result;
  }

  try {
    const now = new Date().toISOString();
    const existingStmt = db.prepare(`
      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
    `);
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
      VALUES (?, ?, ?, ?)
    `);

    const evaluateBatch = () => {
      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
      const existingHashes = new Set(existingRows.map((r) => r.memory_hash));

      for (const memory of memories) {
        const hash = generateMemoryHash(memory);
        let shouldSend = !existingHashes.has(hash);
        if (shouldSend && markAsSent) {
          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
          shouldSend = insertResult.changes > 0;
        }
        if (shouldSend) {
          existingHashes.add(hash);
        }
        // Preserve first-occurrence decision for the same memory ID — prevents double-counting.
        if (memory.id != null && !result.has(memory.id)) {
          result.set(memory.id, shouldSend);
        }
      }

      if (markAsSent) {
        // Check + mark + cap enforcement stay in one transaction to avoid duplicate injection races.
        enforceEntryLimit(sessionId);
      }
    };

    if (markAsSent) {
      const inTransaction = (db as unknown as { inTransaction?: boolean }).inTransaction === true;
      if (inTransaction) {
        evaluateBatch();
      } else {
        db.exec('BEGIN IMMEDIATE');
        try {
          evaluateBatch();
          db.exec('COMMIT');
        } catch (transactionError: unknown) {
          try {
            db.exec('ROLLBACK');
          } catch {
            // Ignore rollback errors after failed transaction.
          }
          throw transactionError;
        }
      }
    } else {
      evaluateBatch();
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] shouldSendMemoriesBatch failed: ${message}`);
    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
    memories.forEach((m) => {
      if (m.id != null) {
        result.set(m.id, allow);
      }
    });
    return result;
  }
}

function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
  if (!SESSION_CONFIG.enabled) return { success: true, skipped: true };
  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Valid sessionId is required' };
  }

  try {
    const memoryObj: MemoryInput = typeof memory === 'number' ? { id: memory } : memory;
    const hash = generateMemoryHash(memoryObj);
    const memoryId = memoryObj.id || null;

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
      VALUES (?, ?, ?, ?)
    `);

    // Transaction ensures atomic insert + limit enforcement, preventing concurrent race past entry limit.
    db.transaction(() => {
      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
      // EnforceEntryLimit inside tx — atomic with insert to prevent row count races.
      enforceEntryLimit(sessionId);
    })();

    return { success: true, hash };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] markMemorySent failed: ${message}`);
    return { success: false, error: message };
  }
}

function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
  if (!SESSION_CONFIG.enabled) return { success: true, markedCount: 0, skipped: true };
  if (!db) return { success: false, markedCount: 0, error: 'Database not initialized. Server may still be starting up.' };
  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
  }

  try {
    const now = new Date().toISOString();
    let markedCount = 0;

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
      VALUES (?, ?, ?, ?)
    `);

    const runBatch = db.transaction(() => {
      for (const memory of memories) {
        const hash = generateMemoryHash(memory);
        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
        if (result.changes > 0) {
          markedCount++;
        }
      }
      // EnforceEntryLimit inside tx — atomic with inserts to prevent row count races.
      enforceEntryLimit(sessionId);
    });

    runBatch();

    return { success: true, markedCount };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] markMemoriesSentBatch failed: ${message}`);
    return { success: false, markedCount: 0, error: message };
  }
}

/* ───────────────────────────────────────────────────────────────
   7. SESSION PERSISTENCE
──────────────────────────────────────────────────────────────── */

function enforceEntryLimit(sessionId: string): void {
  if (!db || !sessionId) return;

  try {
    const countStmt = db.prepare(`
      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
    `);
    const row = countStmt.get(sessionId) as { count: number } | undefined;
    const count = row?.count ?? 0;

    if (count <= SESSION_CONFIG.maxEntriesPerSession) return;

    const excess = count - SESSION_CONFIG.maxEntriesPerSession;
    const deleteStmt = db.prepare(`
      DELETE FROM session_sent_memories
      WHERE session_id = ? AND rowid IN (
        SELECT rowid FROM session_sent_memories
        WHERE session_id = ?
        ORDER BY sent_at ASC
        LIMIT ?
      )
    `);
    deleteStmt.run(sessionId, sessionId, excess);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] enforce_entry_limit failed: ${message}`);
  }
}

function cleanupExpiredSessions(): CleanupResult {
  if (!db) return { success: false, deletedCount: 0 };

  try {
    const cutoffMs = Date.now() - SESSION_CONFIG.sessionTtlMinutes * 60 * 1000;
    const cutoffIso = new Date(cutoffMs).toISOString();

    const stmt = db.prepare(`
      DELETE FROM session_sent_memories WHERE sent_at < ?
    `);
    const result = stmt.run(cutoffIso);

    return { success: true, deletedCount: result.changes };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] cleanup_expired_sessions failed: ${message}`);
    return { success: false, deletedCount: 0 };
  }
}

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
function cleanupStaleSessions(thresholdMs: number = STALE_SESSION_THRESHOLD_MS): StaleCleanupResult {
  if (!db) {
    return { success: false, workingMemoryDeleted: 0, sentMemoriesDeleted: 0, sessionStateDeleted: 0, errors: ['Database not initialized'] };
  }

  const errors: string[] = [];
  let workingMemoryDeleted = 0;
  let sentMemoriesDeleted = 0;
  let sessionStateDeleted = 0;
  const cutoffIso = new Date(Date.now() - thresholdMs).toISOString();

  // 1. Clean stale working_memory entries
  try {
    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
    const wmResult = wmStmt.run(cutoffIso);
    workingMemoryDeleted = wmResult.changes;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // Table may not exist if working-memory module was never initialized
    if (!msg.includes('no such table')) {
      errors.push(`working_memory cleanup: ${msg}`);
    }
  }

  // 2. Clean stale session_sent_memories entries
  try {
    const smStmt = db.prepare('DELETE FROM session_sent_memories WHERE sent_at < ?');
    const smResult = smStmt.run(cutoffIso);
    sentMemoriesDeleted = smResult.changes;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes('no such table')) {
      errors.push(`session_sent_memories cleanup: ${msg}`);
    }
  }

  // 3. Clean completed/interrupted session_state entries (NEVER clean active sessions)
  try {
    const ssStmt = db.prepare(
      `DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?`
    );
    const ssResult = ssStmt.run(cutoffIso);
    sessionStateDeleted = ssResult.changes;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes('no such table')) {
      errors.push(`session_state cleanup: ${msg}`);
    }
  }

  const totalDeleted = workingMemoryDeleted + sentMemoriesDeleted + sessionStateDeleted;
  if (totalDeleted > 0) {
    console.error(
      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
      `${sentMemoriesDeleted} sent_memories, ${sessionStateDeleted} session_state entries ` +
      `(threshold: ${Math.round(thresholdMs / 3600000)}h)`
    );
  }

  if (errors.length > 0) {
    console.warn(`[session-manager] Stale cleanup had ${errors.length} error(s): ${errors.join('; ')}`);
  }

  return {
    success: errors.length === 0,
    workingMemoryDeleted,
    sentMemoriesDeleted,
    sessionStateDeleted,
    errors,
  };
}

function clearSession(sessionId: string): CleanupResult {
  if (!db || !sessionId) return { success: false, deletedCount: 0 };

  try {
    const stmt = db.prepare(`
      DELETE FROM session_sent_memories WHERE session_id = ?
    `);
    const result = stmt.run(sessionId);

    // Immediately clear working memory for cleared session (GAP 2).
    try {
      workingMemory.clearSession(sessionId);
    } catch (wmErr: unknown) {
      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
    }

    return { success: true, deletedCount: result.changes };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] clear_session failed: ${message}`);
    return { success: false, deletedCount: 0 };
  }
}

function getSessionStats(sessionId: string): SessionStats {
  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };

  try {
    const stmt = db.prepare(`
      SELECT
        COUNT(*) as total_sent,
        MIN(sent_at) as oldest_entry,
        MAX(sent_at) as newest_entry
      FROM session_sent_memories
      WHERE session_id = ?
    `);
    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;

    return {
      totalSent: row?.total_sent || 0,
      oldestEntry: row?.oldest_entry || null,
      newestEntry: row?.newest_entry || null,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[session-manager] get_session_stats failed: ${message}`);
    return { totalSent: 0, oldestEntry: null, newestEntry: null };
  }
}

/* ───────────────────────────────────────────────────────────────
   8. INTEGRATION HELPERS
──────────────────────────────────────────────────────────────── */

function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
    return {
      filtered: results || [],
      dedupStats: { enabled: false, filtered: 0, total: results?.length || 0 },
    };
  }

  // Reserve unsent hashes while filtering so concurrent searches cannot both inject.
  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
  const seenBatchHashes = new Set<string>();
  const filtered = results.filter((r) => {
    if (r.id != null && shouldSendMap.get(r.id) === false) {
      return false;
    }
    try {
      const hash = generateMemoryHash(r);
      if (seenBatchHashes.has(hash)) {
        return false;
      }
      seenBatchHashes.add(hash);
    } catch {
      // If hash generation fails unexpectedly, preserve existing behavior.
      return true;
    }
    return true;
  });
  const filteredCount = results.length - filtered.length;

  return {
    filtered,
    dedupStats: {
      enabled: true,
      filtered: filteredCount,
      total: results.length,
      tokenSavingsEstimate: filteredCount > 0 ? `~${filteredCount * 200} tokens` : '0',
    },
  };
}

function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
    return { success: true, markedCount: 0 };
  }

  return markMemoriesSentBatch(sessionId, results);
}

function isEnabled(): boolean {
  return SESSION_CONFIG.enabled;
}

function getConfig(): SessionConfig {
  return { ...SESSION_CONFIG };
}

/* ───────────────────────────────────────────────────────────────
   9. SESSION STATE MANAGEMENT
──────────────────────────────────────────────────────────────── */

const SESSION_STATE_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS session_state (
    session_id TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'interrupted')),
    spec_folder TEXT,
    current_task TEXT,
    last_action TEXT,
    context_summary TEXT,
    pending_work TEXT,
    state_data TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

const SESSION_STATE_INDEX_SQL: string[] = [
  'CREATE INDEX IF NOT EXISTS idx_session_state_status ON session_state(status);',
  'CREATE INDEX IF NOT EXISTS idx_session_state_updated ON session_state(updated_at);',
  'CREATE INDEX IF NOT EXISTS idx_session_state_identity_scope ON session_state(tenant_id, user_id, agent_id);',
];

const SESSION_STATE_MIGRATIONS: Array<{ column: string; sql: string }> = [
  { column: 'tenant_id', sql: 'ALTER TABLE session_state ADD COLUMN tenant_id TEXT;' },
  { column: 'user_id', sql: 'ALTER TABLE session_state ADD COLUMN user_id TEXT;' },
  { column: 'agent_id', sql: 'ALTER TABLE session_state ADD COLUMN agent_id TEXT;' },
];

function getTableColumns(tableName: string): Set<string> {
  if (!db) {
    return new Set();
  }

  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name?: string }>;
  return new Set(
    rows
      .map((row) => row.name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0),
  );
}

function ensureSessionStateSchema(): InitResult {
  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };

  try {
    db.exec(SESSION_STATE_SCHEMA_SQL);
    const existingColumns = getTableColumns('session_state');
    for (const migration of SESSION_STATE_MIGRATIONS) {
      if (!existingColumns.has(migration.column)) {
        db.exec(migration.sql);
      }
    }
    for (const indexSql of SESSION_STATE_INDEX_SQL) {
      db.exec(indexSql);
    }
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] Session state schema creation failed: ${message}`);
    return { success: false, error: message };
  }
}

function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Valid sessionId is required' };
  }

  try {
    ensureSessionStateSchema();
    const now = new Date().toISOString();
    const stateData = state.data ? JSON.stringify(state.data) : null;
    const tenantId = normalizeIdentityValue(state.tenantId);
    const userId = normalizeIdentityValue(state.userId);
    const agentId = normalizeIdentityValue(state.agentId);

    const stmt = db.prepare(`
      INSERT INTO session_state (
        session_id, status, spec_folder, current_task, last_action,
        context_summary, pending_work, state_data,
        tenant_id, user_id, agent_id,
        created_at, updated_at
      )
      VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(session_id) DO UPDATE SET
        status = 'active',
        spec_folder = COALESCE(excluded.spec_folder, session_state.spec_folder),
        current_task = COALESCE(excluded.current_task, session_state.current_task),
        last_action = COALESCE(excluded.last_action, session_state.last_action),
        context_summary = COALESCE(excluded.context_summary, session_state.context_summary),
        pending_work = COALESCE(excluded.pending_work, session_state.pending_work),
        state_data = COALESCE(excluded.state_data, session_state.state_data),
        tenant_id = COALESCE(excluded.tenant_id, session_state.tenant_id),
        user_id = COALESCE(excluded.user_id, session_state.user_id),
        agent_id = COALESCE(excluded.agent_id, session_state.agent_id),
        updated_at = excluded.updated_at
    `);

    stmt.run(
      sessionId,
      state.specFolder || null,
      state.currentTask || null,
      state.lastAction || null,
      state.contextSummary || null,
      state.pendingWork || null,
      stateData,
      tenantId,
      userId,
      agentId,
      now,
      now
    );

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] save_session_state failed: ${message}`);
    return { success: false, error: message };
  }
}

function completeSession(sessionId: string): InitResult {
  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };

  try {
    const stmt = db.prepare(`
      UPDATE session_state
      SET status = 'completed', updated_at = ?
      WHERE session_id = ?
    `);
    stmt.run(new Date().toISOString(), sessionId);

    // Immediately clear working memory for completed session (GAP 2).
    try {
      workingMemory.clearSession(sessionId);
    } catch (wmErr: unknown) {
      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] complete_session failed: ${message}`);
    return { success: false, error: message };
  }
}

function resetInterruptedSessions(): ResetResult {
  if (!db) return { success: false, interruptedCount: 0, error: 'Database not initialized. Server may still be starting up.' };

  try {
    ensureSessionStateSchema();
    const stmt = db.prepare(`
      UPDATE session_state
      SET status = 'interrupted', updated_at = ?
      WHERE status = 'active'
    `);
    const result = stmt.run(new Date().toISOString());

    return { success: true, interruptedCount: result.changes };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] reset_interrupted_sessions failed: ${message}`);
    return { success: false, interruptedCount: 0, error: message };
  }
}

function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  if (!sessionId || typeof sessionId !== 'string') {
    return { success: false, error: 'Valid sessionId is required' };
  }

  try {
    ensureSessionStateSchema();

    const stmt = db.prepare(`
      SELECT session_id, status, spec_folder, current_task, last_action,
             context_summary, pending_work, state_data,
             tenant_id, user_id, agent_id,
             created_at, updated_at
      FROM session_state
      WHERE session_id = ?
    `);
    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;

    if (!row) {
      return { success: true, state: null, _recovered: false };
    }

    const storedIdentity = {
      tenantId: normalizeIdentityValue(row.tenant_id),
      userId: normalizeIdentityValue(row.user_id),
      agentId: normalizeIdentityValue(row.agent_id),
    };
    const mismatch = getIdentityMismatch(storedIdentity, scope);
    if (mismatch) {
      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
    }

    const state: SessionState = {
      sessionId: row.session_id as string,
      status: row.status as string,
      specFolder: (row.spec_folder as string) || null,
      currentTask: (row.current_task as string) || null,
      lastAction: (row.last_action as string) || null,
      contextSummary: (row.context_summary as string) || null,
      pendingWork: (row.pending_work as string) || null,
      tenantId: storedIdentity.tenantId,
      userId: storedIdentity.userId,
      agentId: storedIdentity.agentId,
      data: row.state_data ? JSON.parse(row.state_data as string) : null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      _recovered: row.status === 'interrupted',
    };

    if (row.status === 'interrupted') {
      const updateStmt = db.prepare(`
        UPDATE session_state
        SET status = 'active', updated_at = ?
        WHERE session_id = ?
      `);
      updateStmt.run(new Date().toISOString(), sessionId);
    }

    return { success: true, state, _recovered: state._recovered };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] recover_state failed: ${message}`);
    return { success: false, error: message };
  }
}

function getInterruptedSessions(scope: SessionIdentityScope = {}): InterruptedSessionsResult {
  if (!db) return { success: false, sessions: [], error: 'Database not initialized. Server may still be starting up.' };

  try {
    ensureSessionStateSchema();
    const stmt = db.prepare(`
      SELECT session_id, spec_folder, current_task, last_action,
             context_summary, pending_work, updated_at,
             tenant_id, user_id, agent_id
      FROM session_state
      WHERE status = 'interrupted'
      ORDER BY updated_at DESC
    `);
    const rows = stmt.all() as Record<string, unknown>[];
    const filteredRows = rows.filter((row) => {
      const storedIdentity = {
        tenantId: normalizeIdentityValue(row.tenant_id),
        userId: normalizeIdentityValue(row.user_id),
        agentId: normalizeIdentityValue(row.agent_id),
      };
      return getIdentityMismatch(storedIdentity, scope) === null;
    });

    return {
      success: true,
      sessions: filteredRows.map((row) => ({
        sessionId: row.session_id as string,
        specFolder: (row.spec_folder as string) || null,
        currentTask: (row.current_task as string) || null,
        lastAction: (row.last_action as string) || null,
        contextSummary: (row.context_summary as string) || null,
        pendingWork: (row.pending_work as string) || null,
        updatedAt: row.updated_at as string,
      })),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] get_interrupted_sessions failed: ${message}`);
    return { success: false, sessions: [], error: message };
  }
}

/* ───────────────────────────────────────────────────────────────
   10. CONTINUE SESSION GENERATION
──────────────────────────────────────────────────────────────── */

function generateContinueSessionMd(sessionState: ContinueSessionInput): string {
  const {
    sessionId,
    specFolder,
    currentTask,
    lastAction,
    contextSummary,
    pendingWork,
    data,
  } = sessionState;

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const resumeCommand = specFolder
    ? `/spec_kit:resume ${specFolder}`
    : sessionId
      ? `memory_search({ sessionId: "${sessionId}" })`
      : 'memory_search({ query: "last session" })';

  const content = `# CONTINUE SESSION

> **Generated:** ${dateStr}
> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
> **Pattern Source:** Adopted from seu-claude's CONTINUE_SESSION.md approach.

---

## Session State

| Field | Value |
|-------|-------|
| **Session ID** | \`${sessionId || 'N/A'}\` |
| **Spec Folder** | ${specFolder || 'N/A'} |
| **Current Task** | ${currentTask || 'N/A'} |
| **Last Action** | ${lastAction || 'N/A'} |
| **Status** | Active |
| **Updated** | ${timestamp} |

---

## Context Summary

${contextSummary || '_No context summary available._'}

---

## Pending Work

${pendingWork || '_No pending work recorded._'}

---

## Quick Resume

To continue this session, use:

\`\`\`
${resumeCommand}
\`\`\`

${data ? `
---

## Additional State Data

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
` : ''}
---

*This file is auto-generated on session checkpoint. It provides a human-readable recovery mechanism alongside SQLite persistence.*
`;

  return content;
}

function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
  if (!sessionId || !specFolderPath) {
    return { success: false, error: 'sessionId and specFolderPath are required' };
  }

  try {
    const recoverResult = recoverState(sessionId);
    if (!recoverResult.success || !recoverResult.state) {
      const minimalState: ContinueSessionInput = {
        sessionId,
        specFolder: specFolderPath,
      };
      const content = generateContinueSessionMd(minimalState);
      const filePath = path.join(specFolderPath, 'CONTINUE_SESSION.md');
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, filePath };
    }

    const content = generateContinueSessionMd(recoverResult.state);
    const filePath = path.join(specFolderPath, 'CONTINUE_SESSION.md');
    fs.writeFileSync(filePath, content, 'utf8');

    return { success: true, filePath };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[session-manager] write_continue_session_md failed: ${message}`);
    return { success: false, error: message };
  }
}

function checkpointSession(
  sessionId: string,
  state: SessionStateInput,
  specFolderPath: string | null = null
): CheckpointResult {
  const saveResult = saveSessionState(sessionId, state);
  if (!saveResult.success) {
    return { success: false, error: saveResult.error };
  }

  const folderPath = specFolderPath || state.specFolder;
  if (folderPath && fs.existsSync(folderPath)) {
    return writeContinueSessionMd(sessionId, folderPath);
  }

  return { success: true, note: 'State saved to SQLite, no spec folder for CONTINUE_SESSION.md' };
}

/* ───────────────────────────────────────────────────────────────
   11. SHUTDOWN
──────────────────────────────────────────────────────────────── */

// Clear all background intervals on shutdown (GAP 1).
function shutdown(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
  if (staleCleanupInterval) {
    clearInterval(staleCleanupInterval);
    staleCleanupInterval = null;
  }
}

/* ───────────────────────────────────────────────────────────────
   12. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Initialization
  init,
  ensureSchema,
  getDb,

  // Hash generation
  generateMemoryHash,

  // Deduplication methods (T002)
  shouldSendMemory,
  shouldSendMemoriesBatch,
  markMemorySent,
  markMemoriesSentBatch,

  // Session persistence (T003)
  cleanupExpiredSessions,
  cleanupStaleSessions,
  clearSession,
  getSessionStats,
  isTrackedSession,
  resolveTrustedSession,

  // Integration helpers (T004)
  filterSearchResults,
  markResultsSent,

  // Session State Management (T073: Crash Recovery)
  ensureSessionStateSchema,
  saveSessionState,
  completeSession,

  // Crash Recovery (T074-T075)
  resetInterruptedSessions,
  recoverState,
  getInterruptedSessions,

  // CONTINUE_SESSION.md Generation (T071-T072)
  generateContinueSessionMd,
  writeContinueSessionMd,
  checkpointSession,

  // Configuration
  isEnabled,
  getConfig,
  SESSION_CONFIG as CONFIG,

  // Shutdown (GAP 1)
  shutdown,
};
