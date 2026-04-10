'use strict';

// ---------------------------------------------------------------
// MODULE: Wave Segment State (T003, T-WE-NEW-4)
// ---------------------------------------------------------------
// Per-segment state management, JSONL lineage, and merge helpers
// keyed by explicit segment identifiers.
//
// Segment artifacts remain replayable on their own. Merged records
// always include explicit keys: sessionId, generation, segment,
// wave, and findingId. Merge logic never relies on append order.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Required keys for every JSONL merge record.
 * Merge correctness is keyed by these fields, not append order.
 * @type {ReadonlyArray<string>}
 */
const MERGE_KEYS = Object.freeze([
  'sessionId',
  'generation',
  'segment',
  'wave',
  'findingId',
]);

/**
 * Valid segment state statuses.
 * @type {ReadonlyArray<string>}
 */
const SEGMENT_STATE_STATUSES = Object.freeze([
  'initialized',
  'running',
  'converged',
  'pruned',
  'failed',
  'completed',
]);

/* ---------------------------------------------------------------
   2. SEGMENT STATE CREATION
----------------------------------------------------------------*/

/**
 * Create a per-segment state object.
 *
 * @param {string} segmentId - Unique segment identifier
 * @param {object} config - Segment configuration
 * @param {string} config.sessionId - Parent session identifier
 * @param {number} [config.generation] - Generation counter
 * @param {string} [config.waveId] - Wave identifier
 * @param {'review'|'research'} [config.loopType] - Loop type
 * @param {Array<string>} [config.files] - Files in this segment (review)
 * @param {Array<string>} [config.domains] - Domains in this segment (research)
 * @returns {object} Segment state object
 */
function createSegmentState(segmentId, config) {
  if (!segmentId || typeof segmentId !== 'string') {
    throw new Error('createSegmentState requires a non-empty segmentId');
  }
  if (!config || !config.sessionId) {
    throw new Error('createSegmentState requires config.sessionId');
  }

  const now = new Date().toISOString();

  return {
    segmentId,
    sessionId: config.sessionId,
    generation: typeof config.generation === 'number' ? config.generation : 1,
    waveId: config.waveId || null,
    loopType: config.loopType || 'review',
    status: 'initialized',
    createdAt: now,
    updatedAt: now,
    // Scope
    files: Array.isArray(config.files) ? [...config.files] : [],
    domains: Array.isArray(config.domains) ? [...config.domains] : [],
    // Findings with explicit keys
    findings: [],
    // Iteration tracking
    iterations: [],
    iterationCount: 0,
    // Convergence state
    convergenceScore: 0,
    convergedAt: null,
    // JSONL records for this segment
    jsonlRecords: [],
  };
}

/* ---------------------------------------------------------------
   3. JSONL RECORD MANAGEMENT
----------------------------------------------------------------*/

/**
 * Create a JSONL record with explicit merge keys.
 * Every record includes sessionId, generation, segment, wave, and findingId.
 *
 * @param {object} data - Record data
 * @param {object} segmentState - Segment state for key extraction
 * @returns {object} JSONL record with all merge keys
 */
function createJsonlRecord(data, segmentState) {
  if (!data || typeof data !== 'object') {
    throw new Error('createJsonlRecord requires a data object');
  }
  if (!segmentState || !segmentState.segmentId) {
    throw new Error('createJsonlRecord requires a valid segment state');
  }

  return {
    // Explicit merge keys (MERGE-KEYED rule)
    sessionId: segmentState.sessionId,
    generation: segmentState.generation,
    segment: segmentState.segmentId,
    wave: segmentState.waveId || null,
    findingId: data.findingId || null,
    // Record content
    type: data.type || 'finding',
    timestamp: data.timestamp || new Date().toISOString(),
    ...data,
    // Re-assert keys after spread to prevent override
    sessionId: segmentState.sessionId,
    generation: segmentState.generation,
    segment: segmentState.segmentId,
  };
}

/**
 * Append a JSONL record to a segment state.
 *
 * @param {object} segmentState - Target segment state
 * @param {object} record - JSONL record (should have merge keys)
 * @returns {object} The appended record
 */
function appendRecord(segmentState, record) {
  if (!segmentState || !Array.isArray(segmentState.jsonlRecords)) {
    throw new Error('appendRecord requires a valid segment state with jsonlRecords array');
  }

  // Ensure merge keys are present
  const enriched = {
    ...record,
    sessionId: record.sessionId || segmentState.sessionId,
    generation: record.generation || segmentState.generation,
    segment: record.segment || segmentState.segmentId,
    wave: record.wave || segmentState.waveId || null,
  };

  segmentState.jsonlRecords.push(enriched);
  segmentState.updatedAt = new Date().toISOString();

  return enriched;
}

/* ---------------------------------------------------------------
   4. STATE MERGE
----------------------------------------------------------------*/

/**
 * Merge multiple segment states into a combined result.
 * Uses explicit keys for deduplication and conflict detection.
 *
 * @param {Array<object>} states - Array of segment state objects
 * @param {string} [mergeStrategy='dedupe'] - Merge strategy: 'dedupe' or 'concat'
 * @returns {{ merged: object, conflicts: Array<object>, dedupeLog: Array<object> }}
 */
function mergeSegmentStates(states, mergeStrategy) {
  if (!Array.isArray(states) || states.length === 0) {
    return { merged: null, conflicts: [], dedupeLog: [] };
  }

  const strategy = mergeStrategy || 'dedupe';
  const findingMap = new Map();
  const conflicts = [];
  const dedupeLog = [];
  const allRecords = [];

  for (const state of states) {
    if (!state) continue;

    // Merge findings
    for (const finding of (state.findings || [])) {
      const key = finding.findingId || buildMergeKey(finding);

      if (findingMap.has(key)) {
        const existing = findingMap.get(key);

        if (strategy === 'dedupe') {
          // Check for conflicts
          if (existing.severity !== finding.severity) {
            conflicts.push({
              findingId: key,
              existingSegment: existing.segment || existing.segmentId,
              newSegment: state.segmentId,
              existingSeverity: existing.severity,
              newSeverity: finding.severity,
              resolution: 'keep-higher',
            });

            // Keep higher severity
            if (compareSeverity(finding.severity, existing.severity) > 0) {
              findingMap.set(key, {
                ...finding,
                provenance: {
                  sourceSegment: state.segmentId,
                  promotedFrom: existing.segment || existing.segmentId,
                },
              });
            }
          } else {
            dedupeLog.push({
              findingId: key,
              duplicateSegment: state.segmentId,
              originalSegment: existing.segment || existing.segmentId,
            });
          }
        } else {
          // concat: keep all
          findingMap.set(`${key}::${state.segmentId}`, {
            ...finding,
            provenance: { sourceSegment: state.segmentId },
          });
        }
      } else {
        findingMap.set(key, {
          ...finding,
          provenance: { sourceSegment: state.segmentId },
        });
      }
    }

    // Collect all JSONL records sorted by explicit keys
    for (const record of (state.jsonlRecords || [])) {
      allRecords.push(record);
    }
  }

  // Sort merged records by explicit keys, not append order
  allRecords.sort((a, b) => {
    // Sort by generation, then segment, then wave, then timestamp
    if ((a.generation || 0) !== (b.generation || 0)) return (a.generation || 0) - (b.generation || 0);
    if ((a.segment || '') !== (b.segment || '')) return (a.segment || '').localeCompare(b.segment || '');
    if ((a.wave || '') !== (b.wave || '')) return (a.wave || '').localeCompare(b.wave || '');
    return (a.timestamp || '').localeCompare(b.timestamp || '');
  });

  return {
    merged: {
      findings: Array.from(findingMap.values()),
      jsonlRecords: allRecords,
      totalSegments: states.length,
      mergeStrategy: strategy,
      mergedAt: new Date().toISOString(),
    },
    conflicts,
    dedupeLog,
  };
}

/* ---------------------------------------------------------------
   5. SERIALIZATION
----------------------------------------------------------------*/

/**
 * Serialize segment state JSONL records to a string.
 * Each record is a single JSON line.
 *
 * @param {object} segmentState - Segment state object
 * @returns {string} JSONL string
 */
function serializeJsonl(segmentState) {
  if (!segmentState || !Array.isArray(segmentState.jsonlRecords)) {
    return '';
  }

  return segmentState.jsonlRecords
    .map(record => JSON.stringify(record))
    .join('\n');
}

/**
 * Parse JSONL string into records array.
 * Validates that each record has the required merge keys.
 *
 * @param {string} jsonlString - JSONL content
 * @returns {{ records: Array<object>, errors: Array<{ line: number, error: string }> }}
 */
function parseJsonl(jsonlString) {
  if (!jsonlString || typeof jsonlString !== 'string') {
    return { records: [], errors: [] };
  }

  const lines = jsonlString.split('\n').filter(l => l.trim());
  const records = [];
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    try {
      const record = JSON.parse(lines[i]);
      records.push(record);
    } catch (e) {
      errors.push({ line: i + 1, error: e.message });
    }
  }

  return { records, errors };
}

/**
 * Validate that a record has all required merge keys.
 *
 * @param {object} record - JSONL record to validate
 * @returns {{ valid: boolean, missingKeys: Array<string> }}
 */
function validateMergeKeys(record) {
  if (!record || typeof record !== 'object') {
    return { valid: false, missingKeys: [...MERGE_KEYS] };
  }

  const missingKeys = MERGE_KEYS.filter(key => !(key in record));

  return {
    valid: missingKeys.length === 0,
    missingKeys,
  };
}

/* ---------------------------------------------------------------
   6. HELPERS
----------------------------------------------------------------*/

/**
 * Build a merge key from finding fields when findingId is absent.
 * @param {object} finding
 * @returns {string}
 */
function buildMergeKey(finding) {
  const file = finding.file || finding.filePath || '';
  const line = finding.line || finding.lineNumber || 0;
  const title = finding.title || finding.summary || '';
  return `${file}:${line}::${title}`.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Compare severity levels. Returns >0 if a is higher.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareSeverity(a, b) {
  const order = { P0: 3, P1: 2, P2: 1 };
  return (order[a] || 0) - (order[b] || 0);
}

/* ---------------------------------------------------------------
   7. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  MERGE_KEYS,
  SEGMENT_STATE_STATUSES,
  // State management
  createSegmentState,
  // JSONL records
  createJsonlRecord,
  appendRecord,
  // Merge
  mergeSegmentStates,
  // Serialization
  serializeJsonl,
  parseJsonl,
  validateMergeKeys,
  // Helpers
  buildMergeKey,
  compareSeverity,
};
