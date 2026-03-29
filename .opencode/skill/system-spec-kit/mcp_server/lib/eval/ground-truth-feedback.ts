// ───────────────────────────────────────────────────────────────
// MODULE: Ground Truth Feedback
// ───────────────────────────────────────────────────────────────
// Feature catalog: Synthetic ground truth corpus
//
// Ground Truth Expansion via Feedback + LLM-Judge
//
// Phase B: Collect implicit feedback from user memory selections.
// When a user selects a memory from search results, that selection
// Is recorded as implicit relevance signal for ground truth expansion.
//
// Phase C: LLM-judge relevance labeling for ground truth expansion.
// This module provides a deterministic judge implementation that
// Scores query-memory relevance using lexical overlap heuristics.
// It can be replaced with a model-backed judge later without
// Changing the persistence or agreement APIs.
//
// Design notes:
//   - Selections are persisted to the eval DB for durability.
//   - LLM-judge interface is deterministic (non-stub fallback).
//   - Agreement rate target: >= 80% between LLM-judge and manual labels.
import { initEvalDb, getEvalDb } from './eval-db.js';

/* --- 1. TYPES --- */

/** Context about how a user selected a memory. */
export interface SelectionContext {
  /** The search mode used (e.g. "search", "context", "trigger"). */
  searchMode?: string;
  /** The intent type of the query. */
  intent?: string;
  /** The rank position of the selected result. */
  selectedRank?: number;
  /** Total results shown to the user. */
  totalResultsShown?: number;
  /** Session ID for grouping selections. */
  sessionId?: string;
  /** Free-form notes. */
  notes?: string;
}

/** A recorded user selection event. */
export interface UserSelection {
  /** Auto-incremented row ID. */
  id: number;
  /** The query ID (from eval_queries) or a generated query hash. */
  queryId: string;
  /** The memory ID that was selected. */
  memoryId: number;
  /** Context about the selection. */
  context: SelectionContext;
  /** ISO timestamp of the selection. */
  timestamp: string;
}

/** A relevance label produced by the LLM-judge. */
export interface LlmJudgeLabel {
  /** The query ID. */
  queryId: string;
  /** The memory ID being judged. */
  memoryId: number;
  /**
   * Relevance grade assigned by the LLM-judge.
   *   0 = not relevant
   *   1 = partially relevant
   *   2 = relevant
   *   3 = highly relevant
   */
  relevance: number;
  /** Confidence score from the LLM-judge (0-1). */
  confidence: number;
  /** Optional reasoning from the LLM-judge. */
  reasoning?: string;
}

/** A manual relevance label for agreement comparison. */
export interface ManualLabel {
  /** The query ID. */
  queryId: string;
  /** The memory ID. */
  memoryId: number;
  /** Relevance grade assigned by a human annotator (0-3). */
  relevance: number;
}

/** Result of computing agreement between LLM-judge and manual labels. */
export interface JudgeAgreementResult {
  /** Total number of overlapping query-memory pairs compared. */
  totalPairs: number;
  /** Number of pairs where LLM-judge and manual labels agree exactly. */
  exactAgreement: number;
  /** Exact agreement rate = exactAgreement / totalPairs. */
  exactAgreementRate: number;
  /** Number of pairs within +-1 grade tolerance. */
  tolerantAgreement: number;
  /** Tolerant agreement rate = tolerantAgreement / totalPairs. */
  tolerantAgreementRate: number;
  /** Whether the exact agreement rate meets the >=80% target. */
  meetsTarget: boolean;
  /** The target agreement rate used. */
  targetRate: number;
  /** Mean absolute grade difference. */
  meanGradeDifference: number;
}

/** Summary of the ground truth corpus. */
export interface GroundTruthCorpusSummary {
  /** Total ground truth pairs from manual curation. */
  manualPairs: number;
  /** Total ground truth pairs from user selections. */
  selectionPairs: number;
  /** Total ground truth pairs from LLM-judge labeling. */
  llmJudgePairs: number;
  /** Grand total across all sources. */
  totalPairs: number;
}

/* --- 2. SCHEMA DDL --- */

const FEEDBACK_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS eval_user_selections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id TEXT NOT NULL,
    memory_id INTEGER NOT NULL,
    search_mode TEXT,
    intent TEXT,
    selected_rank INTEGER,
    total_results_shown INTEGER,
    session_id TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS eval_llm_judge_labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id TEXT NOT NULL,
    memory_id INTEGER NOT NULL,
    relevance INTEGER NOT NULL DEFAULT 0,
    confidence REAL NOT NULL DEFAULT 0,
    reasoning TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(query_id, memory_id)
  );
`;

/* --- 3. INTERNAL HELPERS --- */

let _feedbackSchemaEnsured = false;

/**
 * Get the eval DB instance. Prefers the already-initialized singleton
 * (via getEvalDb) to avoid overwriting test DB paths. Falls back to
 * initEvalDb() if no singleton exists yet.
 */
function getDb() {
  try {
    return getEvalDb();
  } catch {
    return initEvalDb();
  }
}

const JUDGE_MIN_TERM_LENGTH = 3;

const JUDGE_STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'onto', 'over',
  'under', 'about', 'after', 'before', 'between', 'through', 'during', 'while',
  'when', 'where', 'what', 'which', 'would', 'could', 'should', 'have', 'has',
  'had', 'were', 'was', 'are', 'is', 'been', 'being', 'then', 'than', 'also',
  'into', 'within', 'without', 'your', 'their', 'there', 'here', 'just', 'only',
]);

function tokenizeForJudge(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= JUDGE_MIN_TERM_LENGTH)
    .filter((token) => !JUDGE_STOP_WORDS.has(token));
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Ensure the feedback tables exist.
 * Idempotent — safe to call multiple times.
 */
function ensureFeedbackSchema(): void {
  if (_feedbackSchemaEnsured) return;
  try {
    const db = getDb();
    db.exec(FEEDBACK_SCHEMA_SQL);
    _feedbackSchemaEnsured = true;
  } catch {
    // Non-fatal
  }
}

/**
 * Reset the schema-ensured flag (for testing only).
 */
export function resetFeedbackSchemaFlag(): void {
  _feedbackSchemaEnsured = false;
}

/* --- 4. PHASE B: USER SELECTION TRACKING --- */

/**
 * Record a user's selection of a memory from search results.
 *
 * This captures implicit relevance feedback: when a user selects
 * a memory, it signals that the memory was relevant to their query.
 *
 * Fail-safe: never throws. Returns the selection ID or 0 on failure.
 *
 * @param queryId - Identifier for the query (can be eval_queries.id or a hash).
 * @param memoryId - The memory ID that was selected.
 * @param selectionContext - Context about the selection event.
 * @returns The inserted row ID, or 0 on failure.
 */
export function recordUserSelection(
  queryId: string,
  memoryId: number,
  selectionContext: SelectionContext = {},
): number {
  try {
    ensureFeedbackSchema();
    const db = getDb();

    const result = db.prepare(`
      INSERT INTO eval_user_selections
        (query_id, memory_id, search_mode, intent, selected_rank,
         total_results_shown, session_id, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      queryId,
      memoryId,
      selectionContext.searchMode ?? null,
      selectionContext.intent ?? null,
      selectionContext.selectedRank ?? null,
      selectionContext.totalResultsShown ?? null,
      selectionContext.sessionId ?? null,
      selectionContext.notes ?? null,
    );

    return typeof result.lastInsertRowid === 'bigint'
      ? Number(result.lastInsertRowid)
      : result.lastInsertRowid as number;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[ground-truth-feedback] recordUserSelection failed (non-fatal):', msg);
    return 0;
  }
}

/**
 * Retrieve user selection history.
 *
 * @param queryId - Optional filter by query ID. Omit for all selections.
 * @param limit - Maximum number of results. Default 100.
 * @returns Array of UserSelection records, newest first.
 */
export function getSelectionHistory(
  queryId?: string,
  limit: number = 100,
): UserSelection[] {
  try {
    ensureFeedbackSchema();
    const db = getDb();

    const whereClause = queryId ? 'WHERE query_id = ?' : '';
    const params = queryId ? [queryId, limit] : [limit];

    const rows = db.prepare(`
      SELECT id, query_id, memory_id, search_mode, intent,
             selected_rank, total_results_shown, session_id, notes,
             created_at
      FROM eval_user_selections
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `).all(...params) as Array<{
      id: number;
      query_id: string;
      memory_id: number;
      search_mode: string | null;
      intent: string | null;
      selected_rank: number | null;
      total_results_shown: number | null;
      session_id: string | null;
      notes: string | null;
      created_at: string;
    }>;

    return rows.map(row => ({
      id: row.id,
      queryId: row.query_id,
      memoryId: row.memory_id,
      context: {
        searchMode: row.search_mode ?? undefined,
        intent: row.intent ?? undefined,
        selectedRank: row.selected_rank ?? undefined,
        totalResultsShown: row.total_results_shown ?? undefined,
        sessionId: row.session_id ?? undefined,
        notes: row.notes ?? undefined,
      },
      timestamp: row.created_at,
    }));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[ground-truth-feedback] getSelectionHistory failed (non-fatal):', msg);
    return [];
  }
}

/* --- 5. PHASE C: LLM-JUDGE LABELING --- */

/**
 * Generate LLM-judge relevance labels for query-selection pairs.
 *
 * Deterministic fallback implementation for LLM-judge relevance labels.
 *
 * Uses lexical overlap between query and memory content to assign
 * relevance grades (0-3) and confidence (0-1). This provides an
 * operational Phase C path without external model dependencies.
 *
 * Scoring bands (query token overlap):
 *   - >= 0.45 or strong phrase match => relevance 3
 *   - >= 0.25                       => relevance 2
 *   - >= 0.10                       => relevance 1
 *   - otherwise                     => relevance 0
 *
 * @param querySelectionPairs - Pairs of query text and memory content to judge.
 * @returns Array of deterministic LlmJudgeLabel values.
 */
export function generateLlmJudgeLabels(
  querySelectionPairs: Array<{ queryId: string; memoryId: number; queryText: string; memoryContent: string }>,
): LlmJudgeLabel[] {
  return querySelectionPairs.map(pair => ({
    ...(() => {
      const queryText = pair.queryText ?? '';
      const memoryContent = pair.memoryContent ?? '';
      const queryTokens = [...new Set(tokenizeForJudge(queryText))];
      const memoryTokenSet = new Set(tokenizeForJudge(memoryContent));

      if (queryTokens.length === 0 || memoryTokenSet.size === 0) {
        return {
          queryId: pair.queryId,
          memoryId: pair.memoryId,
          relevance: 0,
          confidence: 0,
          reasoning: 'Heuristic judge: insufficient lexical signal (empty query or content tokens)',
        };
      }

      const matchedTerms = queryTokens.filter((token) => memoryTokenSet.has(token));
      const overlap = matchedTerms.length / queryTokens.length;
      const normalizedQuery = queryText.trim().toLowerCase();
      const phraseMatch = normalizedQuery.length >= 12 && memoryContent.toLowerCase().includes(normalizedQuery);

      let relevance = 0;
      if (phraseMatch || overlap >= 0.45) {
        relevance = 3;
      } else if (overlap >= 0.25) {
        relevance = 2;
      } else if (overlap >= 0.1) {
        relevance = 1;
      }

      const confidenceBase = 0.2 + (overlap * 0.7) + (phraseMatch ? 0.1 : 0);
      const confidence = Math.round(clamp01(confidenceBase) * 1000) / 1000;

      return {
        queryId: pair.queryId,
        memoryId: pair.memoryId,
        relevance,
        confidence,
        reasoning: `Heuristic judge: overlap=${overlap.toFixed(3)} matched=${matchedTerms.length}/${queryTokens.length} phraseMatch=${phraseMatch}`,
      };
    })(),
  }));
}

/**
 * Persist LLM-judge labels to the eval database.
 *
 * Uses INSERT OR REPLACE to update existing judgments for the same
 * query-memory pair.
 *
 * @param labels - Array of LlmJudgeLabel to persist.
 * @returns Number of labels successfully inserted/updated.
 */
export function saveLlmJudgeLabels(labels: LlmJudgeLabel[]): number {
  try {
    ensureFeedbackSchema();
    const db = getDb();

    const insert = db.prepare(`
      INSERT OR REPLACE INTO eval_llm_judge_labels
        (query_id, memory_id, relevance, confidence, reasoning)
      VALUES (?, ?, ?, ?, ?)
    `);

    let count = 0;
    const insertAll = db.transaction(() => {
      for (const label of labels) {
        const result = insert.run(
          label.queryId,
          label.memoryId,
          label.relevance,
          label.confidence,
          label.reasoning ?? null,
        );
        if (result.changes > 0) count++;
      }
    });

    insertAll();
    return count;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[ground-truth-feedback] saveLlmJudgeLabels failed (non-fatal):', msg);
    return 0;
  }
}

/* --- 6. AGREEMENT COMPUTATION --- */

/**
 * Compute agreement rate between LLM-judge labels and manual labels.
 *
 * Matches labels by (queryId, memoryId) pairs and computes:
 *   - Exact agreement: both labels assign the same relevance grade.
 *   - Tolerant agreement: labels differ by at most 1 grade.
 *   - Mean grade difference: average |llm_grade - manual_grade|.
 *
 * Target: exact agreement rate >= 80%.
 *
 * @param llmLabels - Labels from the LLM-judge.
 * @param manualLabels - Labels from human annotators.
 * @param targetRate - Target agreement rate. Default 0.80 (80%).
 * @returns JudgeAgreementResult with agreement metrics.
 */
export function computeJudgeAgreement(
  llmLabels: LlmJudgeLabel[],
  manualLabels: ManualLabel[],
  targetRate: number = 0.80,
): JudgeAgreementResult {
  // Build manual label lookup: "queryId:memoryId" → relevance
  const manualMap = new Map<string, number>();
  for (const m of manualLabels) {
    const key = `${m.queryId}:${m.memoryId}`;
    manualMap.set(key, m.relevance);
  }

  // Compare overlapping pairs
  let exactAgreement = 0;
  let tolerantAgreement = 0;
  let totalGradeDiff = 0;
  let totalPairs = 0;

  for (const llm of llmLabels) {
    const key = `${llm.queryId}:${llm.memoryId}`;
    const manualRelevance = manualMap.get(key);

    if (manualRelevance === undefined) continue;

    totalPairs++;
    const diff = Math.abs(llm.relevance - manualRelevance);
    totalGradeDiff += diff;

    if (diff === 0) {
      exactAgreement++;
      tolerantAgreement++;
    } else if (diff <= 1) {
      tolerantAgreement++;
    }
  }

  const exactAgreementRate = totalPairs > 0 ? exactAgreement / totalPairs : 0;
  const tolerantAgreementRate = totalPairs > 0 ? tolerantAgreement / totalPairs : 0;
  const meanGradeDifference = totalPairs > 0 ? totalGradeDiff / totalPairs : 0;

  return {
    totalPairs,
    exactAgreement,
    exactAgreementRate,
    tolerantAgreement,
    tolerantAgreementRate,
    meetsTarget: exactAgreementRate >= targetRate,
    targetRate,
    meanGradeDifference,
  };
}

/* --- 7. CORPUS SIZE --- */

/**
 * Count the total ground truth pairs across all sources.
 *
 * Aggregates:
 *   - Manual/synthetic pairs from eval_ground_truth table.
 *   - User selection pairs from eval_user_selections table.
 *   - LLM-judge pairs from eval_llm_judge_labels table.
 *
 * @returns GroundTruthCorpusSummary with per-source and total counts.
 */
export function getGroundTruthCorpusSize(): GroundTruthCorpusSummary {
  try {
    ensureFeedbackSchema();
    const db = getDb();

    // Manual/synthetic ground truth
    const manualRow = db.prepare(
      'SELECT COUNT(*) as cnt FROM eval_ground_truth',
    ).get() as { cnt: number } | undefined;
    const manualPairs = manualRow?.cnt ?? 0;

    // User selection pairs (distinct query_id + memory_id combinations)
    const selectionRow = db.prepare(
      'SELECT COUNT(DISTINCT query_id || \':\' || memory_id) as cnt FROM eval_user_selections',
    ).get() as { cnt: number } | undefined;
    const selectionPairs = selectionRow?.cnt ?? 0;

    // LLM-judge pairs
    const llmRow = db.prepare(
      'SELECT COUNT(*) as cnt FROM eval_llm_judge_labels',
    ).get() as { cnt: number } | undefined;
    const llmJudgePairs = llmRow?.cnt ?? 0;

    return {
      manualPairs,
      selectionPairs,
      llmJudgePairs,
      totalPairs: manualPairs + selectionPairs + llmJudgePairs,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('[ground-truth-feedback] getGroundTruthCorpusSize failed (non-fatal):', msg);
    return {
      manualPairs: 0,
      selectionPairs: 0,
      llmJudgePairs: 0,
      totalPairs: 0,
    };
  }
}
