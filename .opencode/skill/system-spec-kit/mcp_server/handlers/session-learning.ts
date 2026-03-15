// ───────────────────────────────────────────────────────────────
// MODULE: Session Learning
// ───────────────────────────────────────────────────────────────
import * as vectorIndex from '../lib/search/vector-index';
import { checkDatabaseUpdated } from '../core';
import { MemoryError, ErrorCodes } from '../lib/errors';
import { toErrorMessage } from '../utils';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse } from '../lib/response/envelope';

// Shared handler types
import type { MCPResponse, DatabaseExtended as Database } from './types';

// Feature catalog: Post-task learning measurement (task_postflight)
// Feature catalog: Learning history (memory_get_learning_history)


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

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

interface PreflightRecord extends Record<string, unknown> {
  id: number;
  pre_knowledge_score: number;
  pre_uncertainty_score: number;
  pre_context_score: number;
  knowledge_gaps?: string;
}

interface ScoreParam {
  name: string;
  value: number | undefined | null;
}

/* ───────────────────────────────────────────────────────────────
   2. SCHEMA MANAGEMENT
──────────────────────────────────────────────────────────────── */

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS session_learning (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spec_folder TEXT NOT NULL,
    task_id TEXT NOT NULL,
    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
    session_id TEXT,
    -- Preflight scores (baseline)
    pre_knowledge_score INTEGER,
    pre_uncertainty_score INTEGER,
    pre_context_score INTEGER,
    knowledge_gaps TEXT,
    -- Postflight scores (final)
    post_knowledge_score INTEGER,
    post_uncertainty_score INTEGER,
    post_context_score INTEGER,
    -- Calculated deltas
    delta_knowledge REAL,
    delta_uncertainty REAL,
    delta_context REAL,
    learning_index REAL,
    -- Gap tracking
    gaps_closed TEXT,
    new_gaps_discovered TEXT,
    -- Timestamps
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    UNIQUE(spec_folder, task_id)
  )
`;

const INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_session_learning_spec_folder
  ON session_learning(spec_folder)
`;

let schemaInitialized = false;

/** Initialize the session_learning table schema if not already created */
function ensureSchema(database: Database): void {
  if (schemaInitialized) return;

  try {
    database.exec(SCHEMA_SQL);
    database.exec(INDEX_SQL);
    schemaInitialized = true;
    console.error('[session-learning] Schema initialized');
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[session-learning] Schema initialization failed:', message);
    throw new MemoryError(
      ErrorCodes.DATABASE_ERROR,
      'Failed to initialize session_learning schema',
      { originalError: message }
    );
  }
}

/**
 * T304: Validate that all score parameters are present and within 0-100 range.
 * Extracted from duplicate blocks in handleTaskPreflight and handleTaskPostflight.
 */
function validateScores(
  knowledgeScore: number | undefined | null,
  uncertaintyScore: number | undefined | null,
  contextScore: number | undefined | null
): void {
  const scores: ScoreParam[] = [
    { name: 'knowledgeScore', value: knowledgeScore },
    { name: 'uncertaintyScore', value: uncertaintyScore },
    { name: 'contextScore', value: contextScore }
  ];

  for (const score of scores) {
    if (score.value === undefined || score.value === null) {
      throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, `${score.name} is required`, { param: score.name });
    }
    if (typeof score.value !== 'number' || score.value < 0 || score.value > 100) {
      throw new MemoryError(ErrorCodes.INVALID_PARAMETER, `${score.name} must be a number between 0 and 100`, { param: score.name, value: score.value });
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   3. TASK PREFLIGHT HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
async function handleTaskPreflight(args: PreflightArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();
  const {
    specFolder: spec_folder,
    taskId,
    knowledgeScore: knowledge_score,
    uncertaintyScore: uncertainty_score,
    contextScore: context_score,
    knowledgeGaps = [],
    sessionId: session_id = null
  } = args;

  if (!spec_folder) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'specFolder is required', { param: 'specFolder' });
  }
  if (!taskId) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'taskId is required', { param: 'taskId' });
  }

  // T304: Consolidated score validation
  validateScores(knowledge_score, uncertainty_score, context_score);

  const database: Database | null = vectorIndex.getDb();
  if (!database) {
    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Database not initialized. Server may still be starting up.', {});
  }

  ensureSchema(database);

  const now = new Date().toISOString();
  const gapsJson = JSON.stringify(knowledgeGaps);

  // Check for existing record before INSERT to prevent silent data loss
  const existing = database.prepare(
    'SELECT id, phase FROM session_learning WHERE spec_folder = ? AND task_id = ?'
  ).get(spec_folder, taskId) as { id: number; phase: string } | undefined;

  if (existing) {
    if (existing.phase === 'complete') {
      throw new MemoryError(
        ErrorCodes.INVALID_PARAMETER,
        `Learning record already exists and is complete for spec_folder="${spec_folder}", task_id="${taskId}" (id=${existing.id}). Completed records cannot be overwritten.`,
        { existingId: existing.id, phase: existing.phase }
      );
    }
    // Phase is 'preflight' — allow re-recording baseline (UPDATE, not replace)
    const updateStmt = database.prepare(`
      UPDATE session_learning
      SET session_id = ?, pre_knowledge_score = ?, pre_uncertainty_score = ?, pre_context_score = ?, knowledge_gaps = ?, updated_at = ?
      WHERE id = ?
    `);

    try {
      updateStmt.run(
        session_id,
        knowledge_score,
        uncertainty_score,
        context_score,
        gapsJson,
        now,
        existing.id
      );

      console.error(`[session-learning] Preflight updated (existing): spec=${spec_folder}, task=${taskId}, id=${existing.id}`);

      return createMCPSuccessResponse({
        tool: 'task_preflight',
        summary: `Preflight baseline updated for ${taskId} (re-recorded)`,
        data: {
          success: true,
          record: {
            id: existing.id,
            specFolder: spec_folder,
            taskId: taskId,
            phase: 'preflight',
            baseline: {
              knowledge: knowledge_score,
              uncertainty: uncertainty_score,
              context: context_score
            },
            knowledgeGaps: knowledgeGaps,
            timestamp: now
          },
          note: 'Existing preflight record was updated (not replaced)'
        }
      });
    } catch (e: unknown) {
      const message = toErrorMessage(e);
      throw new MemoryError(ErrorCodes.DATABASE_ERROR, `Failed to update preflight record: ${message}`, {});
    }
  }

  const stmt = database.prepare(`
    INSERT INTO session_learning
    (spec_folder, task_id, phase, session_id, pre_knowledge_score, pre_uncertainty_score, pre_context_score, knowledge_gaps, created_at, updated_at)
    VALUES (?, ?, 'preflight', ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      spec_folder,
      taskId,
      session_id,
      knowledge_score,
      uncertainty_score,
      context_score,
      gapsJson,
      now,
      now
    );

    const recordId = result.lastInsertRowid;
    console.error(`[session-learning] Preflight recorded: spec=${spec_folder}, task=${taskId}, id=${recordId}`);

    return createMCPSuccessResponse({
      tool: 'task_preflight',
      summary: `Preflight baseline captured for ${taskId}`,
      data: {
        success: true,
        record: {
          id: Number(recordId),
          specFolder: spec_folder,
          taskId: taskId,
          phase: 'preflight',
          baseline: {
            knowledge: knowledge_score,
            uncertainty: uncertainty_score,
            context: context_score
          },
          knowledgeGaps: knowledgeGaps,
          timestamp: now
        }
      },
      hints: [
        `Call task_postflight with taskId: "${taskId}" after completing the task`,
        'Knowledge gaps can guide your exploration focus'
      ]
    });
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[session-learning] Failed to insert preflight record:', message);
    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to store preflight record', { originalError: message });
  }
}

/* ───────────────────────────────────────────────────────────────
   4. TASK POSTFLIGHT HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
async function handleTaskPostflight(args: PostflightArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();
  const {
    specFolder: spec_folder,
    taskId,
    knowledgeScore: knowledge_score,
    uncertaintyScore: uncertainty_score,
    contextScore: context_score,
    gapsClosed = [],
    newGapsDiscovered = []
  } = args;

  if (!spec_folder) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'specFolder is required', { param: 'specFolder' });
  }
  if (!taskId) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'taskId is required', { param: 'taskId' });
  }

  // T304: Consolidated score validation
  validateScores(knowledge_score, uncertainty_score, context_score);

  const database: Database | null = vectorIndex.getDb();
  if (!database) {
    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Database not initialized. Server may still be starting up.', {});
  }

  ensureSchema(database);

  const now = new Date().toISOString();

  // Allow re-correction by accepting
  // Both 'preflight' (first postflight) and 'complete' (re-posted postflight) records.
  const preflightRecord = database.prepare(`
    SELECT * FROM session_learning
    WHERE spec_folder = ? AND task_id = ? AND phase IN ('preflight', 'complete')
    ORDER BY CASE phase WHEN 'preflight' THEN 0 ELSE 1 END
    LIMIT 1
  `).get(spec_folder, taskId) as PreflightRecord | undefined;

  if (!preflightRecord) {
    throw new MemoryError(
      ErrorCodes.FILE_NOT_FOUND,
      `No preflight record found for spec_folder="${spec_folder}" and task_id="${taskId}". Call task_preflight first.`,
      { specFolder: spec_folder, taskId: taskId }
    );
  }

  const deltaKnowledge = knowledge_score - preflightRecord.pre_knowledge_score;
  const deltaUncertainty = preflightRecord.pre_uncertainty_score - uncertainty_score;
  const deltaContext = context_score - preflightRecord.pre_context_score;

  const learningIndex = (deltaKnowledge * 0.4) + (deltaUncertainty * 0.35) + (deltaContext * 0.25);
  const learningIndexRounded = Math.round(learningIndex * 100) / 100;

  let interpretation: string;
  if (learningIndexRounded >= 40) {
    interpretation = 'Significant learning session - substantial knowledge gains';
  } else if (learningIndexRounded >= 15) {
    interpretation = 'Moderate learning session - meaningful progress';
  } else if (learningIndexRounded >= 5) {
    interpretation = 'Incremental learning - some progress made';
  } else if (learningIndexRounded >= 0) {
    interpretation = 'Execution-focused session - minimal new learning';
  } else {
    interpretation = 'Knowledge regression detected - may indicate scope expansion or new complexities discovered';
  }

  const gapsClosedJson = JSON.stringify(gapsClosed);
  const newGapsJson = JSON.stringify(newGapsDiscovered);

  try {
    database.prepare(`
      UPDATE session_learning SET
        phase = 'complete',
        post_knowledge_score = ?,
        post_uncertainty_score = ?,
        post_context_score = ?,
        delta_knowledge = ?,
        delta_uncertainty = ?,
        delta_context = ?,
        learning_index = ?,
        gaps_closed = ?,
        new_gaps_discovered = ?,
        completed_at = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      knowledge_score,
      uncertainty_score,
      context_score,
      deltaKnowledge,
      deltaUncertainty,
      deltaContext,
      learningIndexRounded,
      gapsClosedJson,
      newGapsJson,
      now,
      now,
      preflightRecord.id
    );

    console.error(`[session-learning] Postflight recorded: spec=${spec_folder}, task=${taskId}, LI=${learningIndexRounded}`);

    let originalGaps: string[] = [];
    try {
      originalGaps = preflightRecord.knowledge_gaps ? JSON.parse(preflightRecord.knowledge_gaps) : [];
    } catch (_error: unknown) {
      originalGaps = [];
    }

    return createMCPSuccessResponse({
      tool: 'task_postflight',
      summary: `Learning measured: LI=${learningIndexRounded} (${interpretation.split(' - ')[0]})`,
      data: {
        success: true,
        record: {
          id: preflightRecord.id,
          specFolder: spec_folder,
          taskId: taskId,
          baseline: {
            knowledge: preflightRecord.pre_knowledge_score,
            uncertainty: preflightRecord.pre_uncertainty_score,
            context: preflightRecord.pre_context_score
          },
          final: {
            knowledge: knowledge_score,
            uncertainty: uncertainty_score,
            context: context_score
          },
          deltas: {
            knowledge: deltaKnowledge,
            uncertainty: deltaUncertainty,
            context: deltaContext
          },
          learningIndex: learningIndexRounded,
          interpretation: interpretation,
          formula: 'LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25)',
          gaps: {
            original: originalGaps,
            closed: gapsClosed,
            newDiscovered: newGapsDiscovered
          },
          timestamp: now
        }
      },
      hints: [
        interpretation,
        gapsClosed.length > 0 ? `${gapsClosed.length} knowledge gaps closed` : null,
        newGapsDiscovered.length > 0 ? `${newGapsDiscovered.length} new gaps discovered for future sessions` : null
      ].filter(Boolean) as string[]
    });
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[session-learning] Failed to update postflight record:', message);
    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to store postflight record', { originalError: message });
  }
}

/* ───────────────────────────────────────────────────────────────
   5. LEARNING HISTORY HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_get_learning_history tool - retrieves learning records with optional summary stats */
async function handleGetLearningHistory(args: LearningHistoryArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();
  const {
    specFolder: spec_folder,
    sessionId: session_id,
    limit = 10,
    onlyComplete: only_complete = false,
    includeSummary: include_summary = true
  } = args;

  if (!spec_folder) {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'specFolder is required', { param: 'specFolder' });
  }

  const safeLimit = Math.min(Math.max(1, limit), 100);

  const database: Database | null = vectorIndex.getDb();
  if (!database) {
    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Database not initialized. Server may still be starting up.', {});
  }

  ensureSchema(database);

  try {
    let sql = `
      SELECT * FROM session_learning
      WHERE spec_folder = ?
    `;
    const params: unknown[] = [spec_folder];

    if (session_id) {
      sql += ' AND session_id = ?';
      params.push(session_id);
    }

    if (only_complete) {
      sql += " AND phase = 'complete'";
    }

    sql += ' ORDER BY updated_at DESC LIMIT ?';
    params.push(safeLimit);

    const rows = database.prepare(sql).all(...params) as Record<string, unknown>[];

    const learningHistory: LearningHistoryRow[] = rows.map((row: Record<string, unknown>) => {
      let knowledgeGaps: string[] = [];
      let gapsClosed: string[] = [];
      let newGapsDiscovered: string[] = [];

      try { knowledgeGaps = row.knowledge_gaps ? JSON.parse(row.knowledge_gaps as string) : []; } catch (_error: unknown) { /* ignore */ }
      try { gapsClosed = row.gaps_closed ? JSON.parse(row.gaps_closed as string) : []; } catch (_error: unknown) { /* ignore */ }
      try { newGapsDiscovered = row.new_gaps_discovered ? JSON.parse(row.new_gaps_discovered as string) : []; } catch (_error: unknown) { /* ignore */ }

      const baseResult: LearningHistoryBaseRow = {
        taskId: row.task_id as string,
        specFolder: row.spec_folder as string,
        sessionId: (row.session_id as string | null) ?? null,
        phase: row.phase as 'preflight' | 'complete',
        preflight: {
          knowledge: (row.pre_knowledge_score as number | null) ?? null,
          uncertainty: (row.pre_uncertainty_score as number | null) ?? null,
          context: (row.pre_context_score as number | null) ?? null,
          timestamp: (row.created_at as string | null) ?? null,
        },
        knowledgeGaps: knowledgeGaps,
        createdAt: (row.created_at as string | null) ?? null,
      };

      if (row.phase === 'complete') {
        return {
          ...baseResult,
          phase: 'complete',
          postflight: {
            knowledge: (row.post_knowledge_score as number | null) ?? null,
            uncertainty: (row.post_uncertainty_score as number | null) ?? null,
            context: (row.post_context_score as number | null) ?? null,
            timestamp: (row.completed_at as string | null) ?? null,
          },
          deltas: {
            knowledge: (row.delta_knowledge as number | null) ?? null,
            uncertainty: (row.delta_uncertainty as number | null) ?? null,
            context: (row.delta_context as number | null) ?? null,
          },
          learningIndex: (row.learning_index as number | null) ?? null,
          gapsClosed: gapsClosed,
          newGapsDiscovered: newGapsDiscovered,
          completedAt: (row.completed_at as string | null) ?? null,
        };
      }

      return {
        ...baseResult,
        phase: 'preflight',
      };
    });

    let responseSummary: LearningHistorySummary | null = null;
    if (include_summary) {
      // T503: Build summary SQL with the same filters as the records query
      let summarySql = `
        SELECT
          COUNT(*) as total_tasks,
          COUNT(CASE WHEN phase = 'complete' THEN 1 END) as completed_tasks,
          AVG(CASE WHEN phase = 'complete' THEN learning_index END) as avg_learning_index,
          MAX(CASE WHEN phase = 'complete' THEN learning_index END) as max_learning_index,
          MIN(CASE WHEN phase = 'complete' THEN learning_index END) as min_learning_index,
          AVG(CASE WHEN phase = 'complete' THEN delta_knowledge END) as avg_knowledge_gain,
          AVG(CASE WHEN phase = 'complete' THEN delta_uncertainty END) as avg_uncertainty_reduction,
          AVG(CASE WHEN phase = 'complete' THEN delta_context END) as avg_context_improvement
        FROM session_learning
        WHERE spec_folder = ?
      `;
      const summaryParams: unknown[] = [spec_folder];

      if (session_id) {
        summarySql += ' AND session_id = ?';
        summaryParams.push(session_id);
      }

      if (only_complete) {
        summarySql += " AND phase = 'complete'";
      }

      const stats = database.prepare(summarySql).get(...summaryParams) as Record<string, unknown>;

      const summary: LearningHistorySummary = {
        totalTasks: Number(stats.total_tasks ?? 0),
        completedTasks: Number(stats.completed_tasks ?? 0),
        averageLearningIndex: stats.avg_learning_index !== null
          ? Math.round((stats.avg_learning_index as number) * 100) / 100
          : null,
        maxLearningIndex: stats.max_learning_index !== null
          ? Math.round((stats.max_learning_index as number) * 100) / 100
          : null,
        minLearningIndex: stats.min_learning_index !== null
          ? Math.round((stats.min_learning_index as number) * 100) / 100
          : null,
        averageKnowledgeGain: stats.avg_knowledge_gain !== null
          ? Math.round((stats.avg_knowledge_gain as number) * 100) / 100
          : null,
        averageUncertaintyReduction: stats.avg_uncertainty_reduction !== null
          ? Math.round((stats.avg_uncertainty_reduction as number) * 100) / 100
          : null,
        averageContextImprovement: stats.avg_context_improvement !== null
          ? Math.round((stats.avg_context_improvement as number) * 100) / 100
          : null
      };

      if (stats.avg_learning_index !== null) {
        const avgLI = stats.avg_learning_index as number;
        if (avgLI > 15) {
          summary.interpretation = 'Strong learning trend - significant knowledge gains across tasks';
        } else if (avgLI > 7) {
          summary.interpretation = 'Positive learning trend - moderate knowledge improvement';
        } else if (avgLI > 0) {
          summary.interpretation = 'Slight learning trend - minor improvements detected';
        } else if (avgLI === 0) {
          summary.interpretation = 'Neutral - no measurable change in knowledge state';
        } else {
          summary.interpretation = 'Negative trend - knowledge regression detected across tasks';
        }
      }

      responseSummary = summary;
    }

    const completedCount = learningHistory.filter(h => h.phase === 'complete').length;
    const summaryText = completedCount > 0
      ? `Learning history: ${learningHistory.length} records (${completedCount} complete)`
      : `Learning history: ${learningHistory.length} preflight records`;

    const hints: string[] = [];
    if (completedCount === 0 && learningHistory.length > 0) {
      hints.push('Call task_postflight to complete learning measurement');
    }
    if (responseSummary?.interpretation) {
      hints.push(responseSummary.interpretation as string);
    }

    return createMCPSuccessResponse({
      tool: 'memory_get_learning_history',
      summary: summaryText,
      data: {
        specFolder: spec_folder,
        count: learningHistory.length,
        learningHistory: learningHistory,
        ...(responseSummary && { summary: responseSummary })
      },
      hints
    });
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.error('[session-learning] Failed to get learning history:', message);
    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to retrieve learning history', { originalError: message });
  }
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleTaskPreflight,
  handleTaskPostflight,
  handleGetLearningHistory,
  ensureSchema,
};

// Backward-compatible aliases (snake_case)
const handle_task_preflight = handleTaskPreflight;
const handle_task_postflight = handleTaskPostflight;
const handle_get_learning_history = handleGetLearningHistory;
const ensure_schema = ensureSchema;

export {
  handle_task_preflight,
  handle_task_postflight,
  handle_get_learning_history,
  ensure_schema,
};
