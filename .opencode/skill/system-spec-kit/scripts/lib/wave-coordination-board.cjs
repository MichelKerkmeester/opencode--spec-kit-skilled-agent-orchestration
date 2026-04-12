'use strict';

// ---------------------------------------------------------------
// MODULE: Wave Coordination Board (T003, T-WE-NEW-4)
// ---------------------------------------------------------------
// Reducer-owned board.json execution ledger, status transitions,
// conflict tracking, and derived dashboard renderer helpers.
//
// board.json is the canonical execution ledger.
// dashboard.md is a derived human-readable render, never manually edited.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Valid board-level statuses.
 * @type {ReadonlyArray<string>}
 */
const BOARD_STATUSES = Object.freeze([
  'initialized',
  'planning',
  'executing',
  'merging',
  'completed',
  'failed',
]);

/**
 * Allowed board status transitions.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const BOARD_STATUS_TRANSITIONS = Object.freeze({
  initialized: Object.freeze(['planning', 'failed']),
  planning: Object.freeze(['executing', 'failed']),
  executing: Object.freeze(['merging', 'failed']),
  merging: Object.freeze(['completed', 'failed']),
  completed: Object.freeze([]),
  failed: Object.freeze([]),
});

/**
 * Valid finding merge states.
 * @type {ReadonlyArray<string>}
 */
const FINDING_MERGE_STATES = Object.freeze([
  'original',
  'promoted',
  'duplicate',
  'conflict',
  'resolved',
  'pruned',
]);

/**
 * Check whether a value is a non-empty string.
 * @param {unknown} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/* ---------------------------------------------------------------
   2. BOARD CREATION
----------------------------------------------------------------*/

/**
 * Create a new coordination board.
 * The board is machine-first and reducer-owned.
 *
 * @param {object} options
 * @param {string} options.sessionId - Session identifier
 * @param {number} [options.generation] - Generation counter
 * @param {'review'|'research'} options.loopType - Loop type
 * @param {string} [options.target] - Review/research target
 * @returns {object} Board object (serializable to board.json)
 */
function createBoard(options) {
  if (!options || !isNonEmptyString(options.sessionId)) {
    return null;
  }
  if (options.loopType !== 'review' && options.loopType !== 'research') {
    return null;
  }

  const now = new Date().toISOString();

  return {
    schema: 'wave-board-v1',
    sessionId: options.sessionId,
    generation: typeof options.generation === 'number' ? options.generation : 1,
    loopType: options.loopType,
    target: options.target || '',
    status: 'initialized',
    createdAt: now,
    updatedAt: now,
    segments: [],
    waves: [],
    findings: [],
    conflicts: [],
    dedupeLog: [],
    promotions: [],
    mergeHistory: [],
    stats: {
      totalSegments: 0,
      completedSegments: 0,
      prunedSegments: 0,
      failedSegments: 0,
      totalFindings: 0,
      promotedFindings: 0,
      duplicateFindings: 0,
      conflictFindings: 0,
    },
  };
}

/* ---------------------------------------------------------------
   3. BOARD UPDATE
----------------------------------------------------------------*/

/**
 * Merge segment results into the coordination board.
 * Updates segment status, findings, conflicts, and deduplication log.
 *
 * @param {object} board - The board object
 * @param {Array<object>} segmentResults - Results from completed segments
 * @returns {object} Updated board (mutates in-place and returns)
 */
function updateBoard(board, segmentResults) {
  if (!board || typeof board !== 'object') {
    return null;
  }
  if (!Array.isArray(segmentResults)) {
    return board;
  }

  const now = new Date().toISOString();
  board.updatedAt = now;

  for (const result of segmentResults) {
    if (!result) continue;

    const segmentId = result.segmentId || `seg-unknown-${Date.now()}`;

    // Update segment record
    const existingSegment = board.segments.find(s => s.segmentId === segmentId);
    if (existingSegment) {
      existingSegment.status = result.status || 'completed';
      existingSegment.completedAt = now;
      existingSegment.findingCount = result.findings ? result.findings.length : 0;
    } else {
      board.segments.push({
        segmentId,
        status: result.status || 'completed',
        startedAt: result.startedAt || now,
        completedAt: now,
        findingCount: result.findings ? result.findings.length : 0,
        waveId: result.waveId || null,
      });
    }

    // Process findings with explicit keys
    if (Array.isArray(result.findings)) {
      for (const finding of result.findings) {
        const findingRecord = buildFindingRecord(finding, segmentId, board, result);
        mergeFinding(board, findingRecord);
      }
    }
  }

  // Update stats
  recalculateStats(board);

  return board;
}

/* ---------------------------------------------------------------
   4. FINDING RECORDS AND MERGE
----------------------------------------------------------------*/

/**
 * Build a board finding record with explicit key fields.
 * Keys: sessionId, generation, segment, wave, findingId.
 *
 * @param {object} finding - Raw finding from a segment
 * @param {string} segmentId - Segment that produced this finding
 * @param {object} board - Board context for sessionId/generation
 * @returns {object} Board finding record
 */
function buildFindingRecord(finding, segmentId, board, segmentResult) {
  if (!finding || typeof finding !== 'object' || !board || typeof board !== 'object') {
    return null;
  }
  // Fall back to the segment result's waveId if the finding itself has no wave info
  const resolvedWave = finding.wave || finding.waveId || (segmentResult && segmentResult.waveId) || null;

  return {
    // Explicit merge keys (never rely on append order)
    sessionId: board.sessionId,
    generation: board.generation,
    segment: segmentId,
    wave: resolvedWave,
    findingId: finding.findingId || generateFindingId(finding, segmentId),
    // Finding content
    title: finding.title || finding.summary || '',
    severity: finding.severity || 'P2',
    file: finding.file || finding.filePath || null,
    line: finding.line || finding.lineNumber || null,
    dimension: finding.dimension || null,
    domain: finding.domain || null,
    evidence: finding.evidence || null,
    mergeState: 'original',
    mergedAt: new Date().toISOString(),
    provenance: {
      sourceSegment: segmentId,
      sourceWave: resolvedWave,
      originalFindingId: finding.findingId || null,
    },
  };
}

/**
 * Merge a finding record into the board.
 * Uses the full 5-key composite for exact-merge dedupe.
 * Preserves conflict and duplicate metadata.
 *
 * @param {object} board - Board object
 * @param {object} findingRecord - Finding record to merge
 */
function mergeFinding(board, findingRecord) {
  if (!board || typeof board !== 'object' || !findingRecord || typeof findingRecord !== 'object') {
    return board;
  }
  const mergeKey = buildFindingCompositeKey(findingRecord);
  const existingIndex = board.findings.findIndex(
    (existingRecord) => buildFindingCompositeKey(existingRecord) === mergeKey,
  );
  const siblingIndex = board.findings.findIndex((existingRecord) => {
    if (buildFindingCompositeKey(existingRecord) === mergeKey) return false;
    return buildFindingGroupKey(existingRecord) === buildFindingGroupKey(findingRecord);
  });

  if (existingIndex >= 0) {
    const existing = board.findings[existingIndex];

    if (hasFindingConflict(existing, findingRecord)) {
      board.conflicts.push({
        findingId: findingRecord.findingId,
        mergeKey,
        existingSegment: existing.segment,
        newSegment: findingRecord.segment,
        existingSeverity: existing.severity,
        newSeverity: findingRecord.severity,
        resolution: 'pending',
        detectedAt: new Date().toISOString(),
      });

      if (compareSeverity(findingRecord.severity, existing.severity) >= 0) {
        findingRecord.mergeState = compareSeverity(findingRecord.severity, existing.severity) > 0
          ? 'promoted'
          : 'resolved';
        board.findings[existingIndex] = findingRecord;
      } else {
        findingRecord.mergeState = 'conflict';
      }
    } else {
      board.dedupeLog.push({
        findingId: findingRecord.findingId,
        mergeKey,
        duplicateSegment: findingRecord.segment,
        originalSegment: existing.segment,
        deduplicatedAt: new Date().toISOString(),
      });
      findingRecord.mergeState = 'duplicate';
    }
  } else if (siblingIndex >= 0) {
    const sibling = board.findings[siblingIndex];

    if (hasFindingConflict(sibling, findingRecord)) {
      board.conflicts.push({
        findingId: findingRecord.findingId,
        mergeKey,
        existingSegment: sibling.segment,
        newSegment: findingRecord.segment,
        existingSeverity: sibling.severity,
        newSeverity: findingRecord.severity,
        resolution: 'pending',
        detectedAt: new Date().toISOString(),
      });

      if (compareSeverity(findingRecord.severity, sibling.severity) > 0) {
        findingRecord.mergeState = 'promoted';
        board.promotions.push({
          findingId: findingRecord.findingId,
          mergeKey,
          fromSeverity: sibling.severity,
          toSeverity: findingRecord.severity,
          fromSegment: sibling.segment,
          toSegment: findingRecord.segment,
          promotedAt: new Date().toISOString(),
        });
      } else {
        findingRecord.mergeState = 'conflict';
      }
    }

    board.findings.push(findingRecord);
  } else {
    board.findings.push(findingRecord);
  }

  // Record merge history
  board.mergeHistory.push({
    findingId: findingRecord.findingId,
    mergeKey,
    segment: findingRecord.segment,
    mergeState: findingRecord.mergeState,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Transition the authoritative board status using the allowed-transition matrix.
 *
 * @param {object} board
 * @param {string} targetStatus
 * @returns {{ success: boolean, previousStatus: string, currentStatus: string, error?: string }}
 */
function transitionBoardStatus(board, targetStatus) {
  if (!board || typeof board !== 'object') {
    return { success: false, previousStatus: 'unknown', currentStatus: 'unknown', error: 'Invalid board' };
  }

  if (!BOARD_STATUSES.includes(targetStatus)) {
    return {
      success: false,
      previousStatus: board.status || 'unknown',
      currentStatus: board.status || 'unknown',
      error: `Invalid target status: ${targetStatus}`,
    };
  }

  const allowedStatuses = BOARD_STATUS_TRANSITIONS[board.status];
  if (!Array.isArray(allowedStatuses)) {
    return {
      success: false,
      previousStatus: board.status || 'unknown',
      currentStatus: board.status || 'unknown',
      error: `Invalid current status: ${board.status}`,
    };
  }

  if (!allowedStatuses.includes(targetStatus)) {
    return {
      success: false,
      previousStatus: board.status,
      currentStatus: board.status,
      error: `Cannot transition board from "${board.status}" to "${targetStatus}" (allowed next status(es): ${allowedStatuses.length > 0 ? allowedStatuses.join(', ') : 'none'})`,
    };
  }

  const previousStatus = board.status;
  board.status = targetStatus;
  board.updatedAt = new Date().toISOString();
  return {
    success: true,
    previousStatus,
    currentStatus: targetStatus,
  };
}

/* ---------------------------------------------------------------
   5. DASHBOARD RENDERING
----------------------------------------------------------------*/

/**
 * Generate dashboard.md content from board.json.
 * This is a derived render, never manually edited.
 *
 * @param {object} board - Board object
 * @returns {string} Markdown dashboard content
 */
function renderDashboard(board) {
  if (!board) return '# Wave Execution Dashboard\n\nNo board data available.\n';

  const lines = [];

  lines.push('# Wave Execution Dashboard');
  lines.push('');
  lines.push('> Auto-generated from board.json. Do not edit manually.');
  lines.push('');

  // Status section
  lines.push('## Status');
  lines.push('');
  lines.push(`| Field | Value |`);
  lines.push(`|-------|-------|`);
  lines.push(`| Session | ${board.sessionId || 'N/A'} |`);
  lines.push(`| Generation | ${board.generation || 1} |`);
  lines.push(`| Loop Type | ${board.loopType || 'N/A'} |`);
  lines.push(`| Status | ${board.status || 'unknown'} |`);
  lines.push(`| Target | ${board.target || 'N/A'} |`);
  lines.push(`| Updated | ${board.updatedAt || 'N/A'} |`);
  lines.push('');

  // Stats section
  lines.push('## Statistics');
  lines.push('');
  const s = board.stats || {};
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Total Segments | ${s.totalSegments || 0} |`);
  lines.push(`| Completed | ${s.completedSegments || 0} |`);
  lines.push(`| Pruned | ${s.prunedSegments || 0} |`);
  lines.push(`| Failed | ${s.failedSegments || 0} |`);
  lines.push(`| Total Findings | ${s.totalFindings || 0} |`);
  lines.push(`| Promoted | ${s.promotedFindings || 0} |`);
  lines.push(`| Duplicates | ${s.duplicateFindings || 0} |`);
  lines.push(`| Conflicts | ${s.conflictFindings || 0} |`);
  lines.push('');

  // Segments section
  if (board.segments && board.segments.length > 0) {
    lines.push('## Segments');
    lines.push('');
    lines.push(`| Segment | Status | Findings | Wave |`);
    lines.push(`|---------|--------|---------|------|`);
    for (const seg of board.segments) {
      lines.push(`| ${seg.segmentId} | ${seg.status} | ${seg.findingCount || 0} | ${seg.waveId || '-'} |`);
    }
    lines.push('');
  }

  // Conflicts section
  if (board.conflicts && board.conflicts.length > 0) {
    lines.push('## Conflicts');
    lines.push('');
    lines.push(`| Finding | Segments | Severities | Resolution |`);
    lines.push(`|---------|----------|------------|------------|`);
    for (const conflict of board.conflicts) {
      lines.push(`| ${conflict.findingId} | ${conflict.existingSegment} vs ${conflict.newSegment} | ${conflict.existingSeverity} vs ${conflict.newSeverity} | ${conflict.resolution} |`);
    }
    lines.push('');
  }

  // Promotions section
  if (board.promotions && board.promotions.length > 0) {
    lines.push('## Promotions');
    lines.push('');
    lines.push(`| Finding | From | To | Segment |`);
    lines.push(`|---------|------|----|---------|`);
    for (const promo of board.promotions) {
      lines.push(`| ${promo.findingId} | ${promo.fromSeverity} | ${promo.toSeverity} | ${promo.toSegment} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/* ---------------------------------------------------------------
   6. HELPERS
----------------------------------------------------------------*/

/**
 * Generate a deterministic finding ID from finding content.
 * ID is segment-independent so cross-segment dedup works correctly.
 * @param {object} finding
 * @param {string} _segmentId - Unused, kept for API compatibility
 * @returns {string}
 */
function generateFindingId(finding, _segmentId) {
  const file = finding.file || finding.filePath || '';
  const line = finding.line || finding.lineNumber || 0;
  const title = finding.title || finding.summary || '';
  const hash = simpleHash(`${file}:${line}::${title}`);
  return `f-${hash}`;
}

/**
 * Simple string hash for deterministic IDs.
 * @param {string} str
 * @returns {string}
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Compare two severity values. Returns >0 if a is higher severity.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareSeverity(a, b) {
  const order = { P0: 3, P1: 2, P2: 1 };
  return (order[a] || 0) - (order[b] || 0);
}

/**
 * Build the canonical 5-key merge-dedup key for a finding record.
 * @param {object} findingRecord
 * @returns {string}
 */
function buildFindingCompositeKey(findingRecord) {
  return [
    normalizeMergeKeyPart(findingRecord && findingRecord.sessionId),
    normalizeMergeKeyPart(findingRecord && findingRecord.generation),
    normalizeMergeKeyPart(findingRecord && findingRecord.segment),
    normalizeMergeKeyPart(findingRecord && findingRecord.wave),
    normalizeMergeKeyPart(findingRecord && findingRecord.findingId),
  ].join('::');
}

/**
 * Build the logical finding-group key used for cross-segment comparisons.
 * @param {object} findingRecord
 * @returns {string}
 */
function buildFindingGroupKey(findingRecord) {
  return [
    normalizeMergeKeyPart(findingRecord && findingRecord.sessionId),
    normalizeMergeKeyPart(findingRecord && findingRecord.generation),
    normalizeMergeKeyPart(findingRecord && findingRecord.findingId),
  ].join('::');
}

/**
 * Normalize a merge-key component into a stable string.
 * @param {unknown} value
 * @returns {string}
 */
function normalizeMergeKeyPart(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Determine whether two finding records disagree on authoritative fields.
 * @param {object} existing
 * @param {object} candidate
 * @returns {boolean}
 */
function hasFindingConflict(existing, candidate) {
  return existing.severity !== candidate.severity ||
    existing.evidence !== candidate.evidence;
}

/**
 * Recalculate board stats from current state.
 * @param {object} board
 */
function recalculateStats(board) {
  if (!board || typeof board !== 'object') return null;
  const segments = board.segments || [];
  board.stats = {
    totalSegments: segments.length,
    completedSegments: segments.filter(s => s.status === 'completed').length,
    prunedSegments: segments.filter(s => s.status === 'pruned').length,
    failedSegments: segments.filter(s => s.status === 'failed').length,
    totalFindings: (board.findings || []).length,
    promotedFindings: (board.promotions || []).length,
    duplicateFindings: (board.dedupeLog || []).length,
    conflictFindings: (board.conflicts || []).length,
  };
  return board.stats;
}

/* ---------------------------------------------------------------
   7. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  BOARD_STATUSES,
  BOARD_STATUS_TRANSITIONS,
  FINDING_MERGE_STATES,
  // Board operations
  createBoard,
  updateBoard,
  transitionBoardStatus,
  // Finding operations
  buildFindingRecord,
  mergeFinding,
  // Dashboard
  renderDashboard,
  // Helpers
  generateFindingId,
  recalculateStats,
  compareSeverity,
};
