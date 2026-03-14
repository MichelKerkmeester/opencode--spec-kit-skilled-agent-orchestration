// ───────────────────────────────────────────────────────────────
// MODULE: Prediction Error Gate
// ───────────────────────────────────────────────────────────────
// Feature catalog: Prediction-error save arbitration
import type Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const THRESHOLD = {
  DUPLICATE: 0.95,
  HIGH_MATCH: 0.85,
  MEDIUM_MATCH: 0.70,
  LOW_MATCH: 0.50,
} as const;

const ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  SUPERSEDE: 'SUPERSEDE',
  REINFORCE: 'REINFORCE',
  CREATE_LINKED: 'CREATE_LINKED',
} as const;

type ActionType = typeof ACTION[keyof typeof ACTION];

const CONTRADICTION_PATTERNS: Array<{
  pattern: RegExp;
  type: string;
  description: string;
}> = [
  { pattern: /\bnot\b.*\bbut\b/i, type: 'negation', description: 'Direct negation detected' },
  { pattern: /\binstead\b/i, type: 'replacement', description: 'Alternative approach suggested' },
  { pattern: /\bno longer\b/i, type: 'deprecation', description: 'Previous approach deprecated' },
  { pattern: /\bwrong\b|\bincorrect\b/i, type: 'correction', description: 'Correction applied' },
  { pattern: /\bactually\b/i, type: 'clarification', description: 'Clarification of prior understanding' },
  { pattern: /\bshould not\b|\bshouldn't\b/i, type: 'prohibition', description: 'Prohibited pattern identified' },
  { pattern: /\bobsolete\b|\bdeprecated\b/i, type: 'obsolescence', description: 'Knowledge marked obsolete' },
  { pattern: /\bcontradicts?\b/i, type: 'explicit', description: 'Explicit contradiction statement' },
];

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface EvaluationResult {
  action: ActionType;
  similarity: number;
  existingMemoryId: number | null;
  contradiction: ContradictionResult | null;
  reason: string;
}

interface ContradictionResult {
  detected: boolean;
  type: string | null;
  description: string | null;
  confidence: number;
}

interface ConflictRecord {
  action: ActionType;
  new_memory_hash: string;
  existing_memory_id: number | null;
  similarity: number;
  reason: string;
  contradiction_detected: number;
  contradiction_type: string | null;
  new_content_preview: string;
  existing_content_preview: string;
  spec_folder: string | null;
}

interface ConflictStats {
  total: number;
  byAction: Record<string, number>;
  contradictions: number;
  averageSimilarity: number;
}

interface BatchEvaluationResult {
  results: EvaluationResult[];
  stats: {
    total: number;
    creates: number;
    updates: number;
    supersedes: number;
    reinforces: number;
    contradictions: number;
  };
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;
}

/* ───────────────────────────────────────────────────────────────
   5. CORE FUNCTIONS
----------------------------------------------------------------*/

/**
 * Truncate content to a preview length.
 */
function truncateContent(content: string | null | undefined, maxLength: number = 200): string {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
}

/**
 * Detect contradictions between new and existing content.
 *
 * Runs pattern detection on new and existing content SEPARATELY to avoid
 * false positives from concatenation (e.g., old "not X" + new "X" matching
 * negation patterns across document boundaries).
 *
 * Strategy: contradiction signals in the NEW content (e.g., "actually",
 * "no longer", "instead") indicate the author is correcting/replacing
 * existing knowledge. We only flag a contradiction when the new content
 * contains such a signal AND the existing content does NOT contain the
 * same signal (ruling out inherited phrasing).
 */
function detectContradiction(
  newContent: string,
  existingContent: string
): ContradictionResult {
  if (!newContent || !existingContent) {
    return { detected: false, type: null, description: null, confidence: 0 };
  }

  const newLower = newContent.toLowerCase();
  const existingLower = existingContent.toLowerCase();
  let maxConfidence = 0;
  let detectedType: string | null = null;
  let detectedDescription: string | null = null;

  // Specificity-based confidence per contradiction type:
  // General/weak signals get lower confidence, explicit/strong signals get higher
  const PATTERN_CONFIDENCE: Record<string, number> = {
    clarification: 0.45,   // "actually" — weakest, often conversational
    replacement: 0.55,     // "instead" — moderate signal
    negation: 0.60,        // "not...but" — moderate
    prohibition: 0.65,     // "should not/shouldn't" — moderate-strong
    correction: 0.70,      // "wrong/incorrect" — strong
    deprecation: 0.75,     // "no longer" — strong
    obsolescence: 0.80,    // "obsolete/deprecated" — very strong
    explicit: 0.85,        // "contradicts" — strongest signal
  };

  for (const { pattern, type, description } of CONTRADICTION_PATTERNS) {
    const matchesNew = pattern.test(newLower);
    const matchesExisting = pattern.test(existingLower);

    // A contradiction is signaled when:
    // 1. The NEW content contains the contradiction marker (primary signal), OR
    // 2. The pattern appears in one document but not the other (asymmetric signal)
    // We exclude cases where both documents contain the same pattern (inherited phrasing).
    if (matchesNew && !matchesExisting) {
      // New content introduces a contradiction/correction signal not present in old
      const confidence = PATTERN_CONFIDENCE[type] ?? 0.5;
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        detectedType = type;
        detectedDescription = description;
      }
    } else if (matchesExisting && !matchesNew) {
      // Existing content had a signal that new content dropped — weaker signal
      const confidence = (PATTERN_CONFIDENCE[type] ?? 0.5) * 0.6;
      if (confidence > maxConfidence) {
        maxConfidence = confidence;
        detectedType = type;
        detectedDescription = description;
      }
    }
    // If both match the same pattern, it's likely inherited phrasing, not a contradiction
  }

  return {
    detected: maxConfidence > 0,
    type: detectedType,
    description: detectedDescription,
    confidence: maxConfidence,
  };
}

/**
 * Evaluate whether a new memory should create, update, or supersede existing.
 */
function evaluateMemory(
  newContentHash: string,
  newContent: string,
  candidates: Array<{
    id: number;
    similarity: number;
    content?: string;
    file_path?: string;
    [key: string]: unknown;
  }>,
  options: {
    specFolder?: string;
  } = {}
): EvaluationResult {
  if (!candidates || candidates.length === 0) {
    // T-09: Log no-candidate CREATE decisions for full audit trail
    if (db) {
      const record = formatConflictRecord(
        ACTION.CREATE, newContentHash, null, 0,
        'No existing candidates found',
        { detected: false, type: null, description: null, confidence: 0 },
        truncateContent(newContent), '',
        options.specFolder || null
      );
      logConflict(record);
    }
    return {
      action: ACTION.CREATE,
      similarity: 0,
      existingMemoryId: null,
      contradiction: null,
      reason: 'No existing candidates found',
    };
  }

  // Filter relevant candidates
  const relevant = filterRelevantCandidates(candidates);
  if (relevant.length === 0) {
    // T-09: Log filtered-out CREATE decisions for full audit trail
    if (db) {
      const record = formatConflictRecord(
        ACTION.CREATE, newContentHash, null, 0,
        'No relevant candidates after filtering',
        { detected: false, type: null, description: null, confidence: 0 },
        truncateContent(newContent), '',
        options.specFolder || null
      );
      logConflict(record);
    }
    return {
      action: ACTION.CREATE,
      similarity: 0,
      existingMemoryId: null,
      contradiction: null,
      reason: 'No relevant candidates after filtering',
    };
  }

  // Take the top candidate
  const topCandidate = relevant[0];
  const similarity = topCandidate.similarity; // Already normalized to 0-1 by findSimilarMemories

  // Check for contradiction
  const existingContent = (topCandidate.content || '') as string;
  const contradiction = detectContradiction(newContent, existingContent);

  // Decision logic based on similarity thresholds
  let action: ActionType;
  let reason: string;

  if (similarity >= THRESHOLD.DUPLICATE) {
    action = ACTION.REINFORCE;
    reason = `Duplicate detected (similarity: ${(similarity * 100).toFixed(1)}%)`;
  } else if (similarity >= THRESHOLD.HIGH_MATCH) {
    if (contradiction.detected) {
      action = ACTION.SUPERSEDE;
      reason = `High match with contradiction: ${contradiction.description}`;
    } else {
      action = ACTION.UPDATE;
      reason = `High match, updating existing (similarity: ${(similarity * 100).toFixed(1)}%)`;
    }
  } else if (similarity >= THRESHOLD.MEDIUM_MATCH) {
    action = ACTION.CREATE_LINKED;
    reason = `Medium match, creating linked memory (similarity: ${(similarity * 100).toFixed(1)}%)`;
  } else {
    action = ACTION.CREATE;
    reason = `Low/no match (similarity: ${(similarity * 100).toFixed(1)}%)`;
  }

  // T-09: Log ALL PE decisions (including low/no-match CREATE) to memory_conflicts
  // For full decision audit trail. Previously only logged when similarity >= LOW_MATCH.
  if (db) {
    const record = formatConflictRecord(
      action,
      newContentHash,
      topCandidate.id,
      similarity,
      reason,
      contradiction,
      truncateContent(newContent),
      truncateContent(existingContent),
      options.specFolder || null
    );
    logConflict(record);
  }

  return {
    action,
    similarity,
    existingMemoryId: topCandidate.id,
    contradiction,
    reason,
  };
}

/**
 * Filter candidates to relevant ones.
 */
function filterRelevantCandidates(
  candidates: Array<{ id: number; similarity: number; [key: string]: unknown }>
): Array<{ id: number; similarity: number; [key: string]: unknown }> {
  return candidates
    .filter(c => c.similarity >= THRESHOLD.LOW_MATCH)
    .sort((a, b) => b.similarity - a.similarity);
}

/**
 * Format a conflict record for logging.
 */
function formatConflictRecord(
  action: ActionType,
  newMemoryHash: string,
  existingMemoryId: number | null,
  similarity: number,
  reason: string,
  contradiction: ContradictionResult,
  newContentPreview: string,
  existingContentPreview: string,
  specFolder: string | null
): ConflictRecord {
  return {
    action,
    new_memory_hash: newMemoryHash,
    existing_memory_id: existingMemoryId,
    similarity,
    reason,
    contradiction_detected: contradiction.detected ? 1 : 0,
    contradiction_type: contradiction.type,
    new_content_preview: newContentPreview,
    existing_content_preview: existingContentPreview,
    spec_folder: specFolder,
  };
}

/**
 * Log a conflict record to the database.
 */
function logConflict(record: ConflictRecord): void {
  if (!db) return;

  try {
    (db.prepare(`
      INSERT INTO memory_conflicts (
        action, new_memory_hash, existing_memory_id, similarity,
        reason, contradiction_detected, contradiction_type,
        new_content_preview, existing_content_preview, spec_folder
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `) as Database.Statement).run(
      record.action,
      record.new_memory_hash,
      record.existing_memory_id,
      record.similarity,
      record.reason,
      record.contradiction_detected,
      record.contradiction_type,
      record.new_content_preview,
      record.existing_content_preview,
      record.spec_folder
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[prediction-error-gate] logConflict error: ${msg}`);
  }
}

/**
 * Get conflict statistics.
 */
function getConflictStats(specFolder: string | null = null): ConflictStats {
  if (!db) {
    return { total: 0, byAction: {}, contradictions: 0, averageSimilarity: 0 };
  }

  try {
    const folderFilter = specFolder ? 'WHERE spec_folder = ?' : '';
    const params = specFolder ? [specFolder] : [];

    const total = (db.prepare(
      `SELECT COUNT(*) as count FROM memory_conflicts ${folderFilter}`
    ) as Database.Statement).get(...params) as { count: number };

    const byAction = (db.prepare(
      `SELECT action, COUNT(*) as count FROM memory_conflicts ${folderFilter} GROUP BY action`
    ) as Database.Statement).all(...params) as Array<{ action: string; count: number }>;

    const contradictions = (db.prepare(
      `SELECT COUNT(*) as count FROM memory_conflicts WHERE contradiction_detected = 1 ${specFolder ? 'AND spec_folder = ?' : ''}`
    ) as Database.Statement).get(...params) as { count: number };

    const avgSim = (db.prepare(
      `SELECT AVG(similarity) as avg_sim FROM memory_conflicts ${folderFilter}`
    ) as Database.Statement).get(...params) as { avg_sim: number | null };

    const actionMap: Record<string, number> = {};
    for (const row of byAction) {
      actionMap[row.action] = row.count;
    }

    return {
      total: total.count,
      byAction: actionMap,
      contradictions: contradictions.count,
      averageSimilarity: Math.round((avgSim.avg_sim || 0) * 100) / 100,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[prediction-error-gate] getConflictStats error: ${msg}`);
    return { total: 0, byAction: {}, contradictions: 0, averageSimilarity: 0 };
  }
}

/**
 * Get recent conflicts.
 */
function getRecentConflicts(limit: number = 10): Array<Record<string, unknown>> {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT * FROM memory_conflicts
      ORDER BY timestamp DESC
      LIMIT ?
    `) as Database.Statement).all(limit) as Array<Record<string, unknown>>;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[prediction-error-gate] getRecentConflicts error: ${msg}`);
    return [];
  }
}

/**
 * Batch evaluate multiple memories.
 */
function batchEvaluate(
  items: Array<{
    contentHash: string;
    content: string;
    candidates: Array<{ id: number; similarity: number; [key: string]: unknown }>;
  }>,
  options: { specFolder?: string } = {}
): BatchEvaluationResult {
  const results: EvaluationResult[] = [];
  const stats = { total: 0, creates: 0, updates: 0, supersedes: 0, reinforces: 0, contradictions: 0 };

  for (const item of items) {
    const result = evaluateMemory(item.contentHash, item.content, item.candidates, options);
    results.push(result);
    stats.total++;

    switch (result.action) {
      case ACTION.CREATE:
      case ACTION.CREATE_LINKED:
        stats.creates++;
        break;
      case ACTION.UPDATE:
        stats.updates++;
        break;
      case ACTION.SUPERSEDE:
        stats.supersedes++;
        break;
      case ACTION.REINFORCE:
        stats.reinforces++;
        break;
    }

    if (result.contradiction?.detected) {
      stats.contradictions++;
    }
  }

  return { results, stats };
}

/**
 * Calculate similarity statistics for a set of candidates.
 */
function calculateSimilarityStats(
  candidates: Array<{ similarity: number; [key: string]: unknown }>
): { min: number; max: number; avg: number; count: number } {
  if (!candidates || candidates.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }

  const similarities = candidates.map(c => c.similarity);
  const sum = similarities.reduce((a, b) => a + b, 0);

  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
  return {
    min: similarities.reduce((a, b) => Math.min(a, b), Infinity),
    max: similarities.reduce((a, b) => Math.max(a, b), -Infinity),
    avg: Math.round((sum / similarities.length) * 100) / 100,
    count: similarities.length,
  };
}

/**
 * Get action priority for sorting.
 */
function getActionPriority(action: ActionType): number {
  const priorities: Record<string, number> = {
    [ACTION.SUPERSEDE]: 1,
    [ACTION.UPDATE]: 2,
    [ACTION.CREATE_LINKED]: 3,
    [ACTION.CREATE]: 4,
    [ACTION.REINFORCE]: 5,
  };
  return priorities[action] || 99;
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
----------------------------------------------------------------*/

export {
  // Constants
  THRESHOLD,
  ACTION,
  CONTRADICTION_PATTERNS,

  // Core functions
  init,
  evaluateMemory,
  detectContradiction,
  formatConflictRecord,
  logConflict,
  getConflictStats,
  getRecentConflicts,
  batchEvaluate,
  calculateSimilarityStats,
  filterRelevantCandidates,
  getActionPriority,
  truncateContent,
};

export type {
  ActionType,
  EvaluationResult,
  ContradictionResult,
  ConflictRecord,
  ConflictStats,
  BatchEvaluationResult,
};
