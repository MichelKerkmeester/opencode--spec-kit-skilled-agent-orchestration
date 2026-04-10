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
  if (!options || !options.sessionId) {
    throw new Error('createBoard requires options.sessionId');
  }
  if (options.loopType !== 'review' && options.loopType !== 'research') {
    throw new Error('createBoard requires loopType "review" or "research"');
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
    throw new Error('updateBoard requires a valid board object');
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
        const findingRecord = buildFindingRecord(finding, segmentId, board);
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
function buildFindingRecord(finding, segmentId, board) {
  return {
    // Explicit merge keys (never rely on append order)
    sessionId: board.sessionId,
    generation: board.generation,
    segment: segmentId,
    wave: finding.wave || finding.waveId || null,
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
      sourceWave: finding.wave || finding.waveId || null,
      originalFindingId: finding.findingId || null,
    },
  };
}

/**
 * Merge a finding record into the board.
 * Uses findingId as the primary key for deduplication.
 * Preserves conflict and duplicate metadata.
 *
 * @param {object} board - Board object
 * @param {object} findingRecord - Finding record to merge
 */
function mergeFinding(board, findingRecord) {
  const existingIndex = board.findings.findIndex(
    f => f.findingId === findingRecord.findingId
  );

  if (existingIndex >= 0) {
    const existing = board.findings[existingIndex];

    // Check for conflict: same findingId, different evidence or severity
    if (existing.severity !== findingRecord.severity ||
        existing.evidence !== findingRecord.evidence) {
      board.conflicts.push({
        findingId: findingRecord.findingId,
        existingSegment: existing.segment,
        newSegment: findingRecord.segment,
        existingSeverity: existing.severity,
        newSeverity: findingRecord.severity,
        resolution: 'pending',
        detectedAt: new Date().toISOString(),
      });

      // If new finding has higher severity, promote it
      if (compareSeverity(findingRecord.severity, existing.severity) > 0) {
        findingRecord.mergeState = 'promoted';
        board.promotions.push({
          findingId: findingRecord.findingId,
          fromSeverity: existing.severity,
          toSeverity: findingRecord.severity,
          fromSegment: existing.segment,
          toSegment: findingRecord.segment,
          promotedAt: new Date().toISOString(),
        });
        board.findings[existingIndex] = findingRecord;
      } else {
        findingRecord.mergeState = 'conflict';
      }
    } else {
      // Exact duplicate
      board.dedupeLog.push({
        findingId: findingRecord.findingId,
        duplicateSegment: findingRecord.segment,
        originalSegment: existing.segment,
        deduplicatedAt: new Date().toISOString(),
      });
      findingRecord.mergeState = 'duplicate';
    }
  } else {
    board.findings.push(findingRecord);
  }

  // Record merge history
  board.mergeHistory.push({
    findingId: findingRecord.findingId,
    segment: findingRecord.segment,
    mergeState: findingRecord.mergeState,
    timestamp: new Date().toISOString(),
  });
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
 * @param {object} finding
 * @param {string} segmentId
 * @returns {string}
 */
function generateFindingId(finding, segmentId) {
  const file = finding.file || finding.filePath || '';
  const line = finding.line || finding.lineNumber || 0;
  const title = finding.title || finding.summary || '';
  const hash = simpleHash(`${file}:${line}::${title}`);
  return `f-${segmentId}-${hash}`;
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
 * Recalculate board stats from current state.
 * @param {object} board
 */
function recalculateStats(board) {
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
}

/* ---------------------------------------------------------------
   7. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  BOARD_STATUSES,
  FINDING_MERGE_STATES,
  // Board operations
  createBoard,
  updateBoard,
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
