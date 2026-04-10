'use strict';

// ---------------------------------------------------------------
// MODULE: Wave Lifecycle (T-WE-NEW-1, T004)
// ---------------------------------------------------------------
// Orchestrator lifecycle helpers for fan-out, join, prune, promote,
// merge, and resume state transitions. Parallelism lives at the
// orchestrator layer; LEAF agents remain non-spawning workers.
//
// Fan-out/join is implemented as helper-module orchestration that
// safely performs parallel dispatch outside the YAML surface. The
// YAML workflow engine delegates to these helpers rather than
// requiring native parallel-step support.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Valid wave lifecycle phases in execution order.
 * @type {ReadonlyArray<string>}
 */
const LIFECYCLE_PHASES = Object.freeze([
  'prepass',
  'plan',
  'fan-out',
  'prune',
  'promote',
  'join',
  'merge',
]);

/**
 * Valid segment statuses.
 * @type {ReadonlyArray<string>}
 */
const SEGMENT_STATUSES = Object.freeze([
  'pending',
  'dispatched',
  'running',
  'converged',
  'pruned',
  'failed',
  'completed',
]);

/**
 * Maximum number of parallel segments per wave.
 * @type {number}
 */
const MAX_PARALLEL_SEGMENTS = 8;

/* ---------------------------------------------------------------
   2. FAN-OUT/JOIN PROOF
----------------------------------------------------------------*/

/**
 * Check if the current workflow supports parallel dispatch.
 * Returns a proof object describing the orchestration path.
 *
 * This is the canonical proof that wave execution has a viable
 * parallel dispatch mechanism before any wave-mode runtime build.
 *
 * @param {object} workflowEngine - Description of the workflow engine capabilities
 * @param {boolean} [workflowEngine.hasNativeParallel] - Whether engine supports parallel steps natively
 * @param {boolean} [workflowEngine.hasHelperOrchestration] - Whether helper-module orchestration is available
 * @returns {{ canFanOut: boolean, method: string, proof: string, maxParallel: number }}
 */
function canFanOut(workflowEngine) {
  if (!workflowEngine || typeof workflowEngine !== 'object') {
    return {
      canFanOut: false,
      method: 'none',
      proof: 'No workflow engine provided',
      maxParallel: 0,
    };
  }

  // Prefer helper-module orchestration (proven path for current YAML engine)
  if (workflowEngine.hasHelperOrchestration) {
    return {
      canFanOut: true,
      method: 'helper-module',
      proof: 'Helper-module orchestration wraps YAML engine for safe fan-out/join',
      maxParallel: MAX_PARALLEL_SEGMENTS,
    };
  }

  // Native parallel dispatch (future engine extension)
  if (workflowEngine.hasNativeParallel) {
    return {
      canFanOut: true,
      method: 'native',
      proof: 'YAML engine supports native parallel step dispatch',
      maxParallel: MAX_PARALLEL_SEGMENTS,
    };
  }

  return {
    canFanOut: false,
    method: 'none',
    proof: 'Neither helper orchestration nor native parallel dispatch available',
    maxParallel: 0,
  };
}

/* ---------------------------------------------------------------
   3. WAVE CONTEXT
----------------------------------------------------------------*/

/**
 * Create a wave execution context for tracking lifecycle state.
 *
 * @param {string} target - The review/research target identifier
 * @param {'review'|'research'} loopType - Type of deep loop
 * @param {object} [options] - Additional configuration
 * @param {string} [options.sessionId] - Session identifier (auto-generated if absent)
 * @param {number} [options.generation] - Generation counter (default: 1)
 * @returns {object} Wave context object
 */
function createWaveContext(target, loopType, options) {
  if (!target || typeof target !== 'string') {
    throw new Error('Wave context requires a non-empty target string');
  }
  if (loopType !== 'review' && loopType !== 'research') {
    throw new Error('loopType must be "review" or "research"');
  }

  const opts = options || {};
  const now = new Date().toISOString();

  return {
    target,
    loopType,
    sessionId: opts.sessionId || `wave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    generation: typeof opts.generation === 'number' ? opts.generation : 1,
    phase: 'prepass',
    createdAt: now,
    updatedAt: now,
    segments: [],
    waves: [],
    currentWave: null,
    mergedResults: [],
    status: 'initialized',
  };
}

/* ---------------------------------------------------------------
   4. FAN-OUT
----------------------------------------------------------------*/

/**
 * Dispatch a wave of segments for parallel execution.
 * Each segment becomes an independent worker dispatch.
 *
 * @param {Array<object>} segments - Segment descriptors from the planner
 * @param {object} config - Wave dispatch configuration
 * @param {string} config.sessionId - Session identifier
 * @param {number} config.generation - Generation counter
 * @param {number} config.waveNumber - Current wave number (1-based)
 * @param {number} [config.maxParallel] - Maximum parallel dispatches
 * @returns {{ waveId: string, dispatches: Array<object>, timestamp: string }}
 */
function dispatchWave(segments, config) {
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new Error('dispatchWave requires a non-empty segments array');
  }
  if (!config || !config.sessionId || !config.waveNumber) {
    throw new Error('dispatchWave requires config with sessionId and waveNumber');
  }

  const maxParallel = config.maxParallel || MAX_PARALLEL_SEGMENTS;
  const now = new Date().toISOString();
  const waveId = `${config.sessionId}-w${config.waveNumber}`;

  // Cap segments to maxParallel
  const activeSegments = segments.slice(0, maxParallel);

  const dispatches = activeSegments.map((segment, index) => ({
    dispatchId: `${waveId}-s${index}`,
    waveId,
    segmentId: segment.segmentId || `seg-${index}`,
    segmentIndex: index,
    status: 'dispatched',
    dispatchedAt: now,
    completedAt: null,
    result: null,
    error: null,
  }));

  return {
    waveId,
    dispatches,
    timestamp: now,
    sessionId: config.sessionId,
    generation: config.generation || 1,
    waveNumber: config.waveNumber,
    totalSegments: segments.length,
    activeSegments: activeSegments.length,
    deferredSegments: Math.max(0, segments.length - maxParallel),
  };
}

/* ---------------------------------------------------------------
   5. JOIN
----------------------------------------------------------------*/

/**
 * Merge strategy definitions for joining wave results.
 * @type {Readonly<Record<string, string>>}
 */
const MERGE_STRATEGIES = Object.freeze({
  CONCAT: 'concat',
  DEDUPE: 'dedupe',
  PRIORITY: 'priority',
});

/**
 * Join results from parallel workers back into a single result set.
 * Applies the specified merge strategy to handle duplicates and conflicts.
 *
 * @param {Array<object>} results - Results from completed segment dispatches
 * @param {string} [mergeStrategy='dedupe'] - How to merge: 'concat', 'dedupe', or 'priority'
 * @returns {{ merged: Array<object>, conflicts: Array<object>, stats: object }}
 */
function joinWave(results, mergeStrategy) {
  if (!Array.isArray(results)) {
    throw new Error('joinWave requires a results array');
  }

  const strategy = mergeStrategy || MERGE_STRATEGIES.DEDUPE;
  const conflicts = [];
  const findingMap = new Map();

  for (const result of results) {
    if (!result || !result.findings) continue;

    for (const finding of result.findings) {
      const key = buildFindingKey(finding);

      if (findingMap.has(key)) {
        const existing = findingMap.get(key);

        if (strategy === MERGE_STRATEGIES.CONCAT) {
          // Keep both under different composite keys
          const altKey = `${key}::${result.segmentId || 'unknown'}`;
          findingMap.set(altKey, {
            ...finding,
            mergedFrom: result.segmentId || 'unknown',
            mergeState: 'appended',
          });
        } else if (strategy === MERGE_STRATEGIES.PRIORITY) {
          // Keep higher severity
          if (compareSeverity(finding.severity, existing.severity) > 0) {
            conflicts.push({
              findingId: key,
              kept: finding,
              replaced: existing,
              reason: 'priority-upgrade',
            });
            findingMap.set(key, {
              ...finding,
              mergedFrom: result.segmentId || 'unknown',
              mergeState: 'promoted',
              priorSegment: existing.mergedFrom,
            });
          } else {
            conflicts.push({
              findingId: key,
              kept: existing,
              replaced: finding,
              reason: 'priority-kept',
            });
          }
        } else {
          // DEDUPE: keep first occurrence, record conflict
          conflicts.push({
            findingId: key,
            kept: existing,
            duplicate: finding,
            duplicateSegment: result.segmentId || 'unknown',
            reason: 'dedupe',
          });
        }
      } else {
        findingMap.set(key, {
          ...finding,
          mergedFrom: result.segmentId || 'unknown',
          mergeState: 'original',
        });
      }
    }
  }

  const merged = Array.from(findingMap.values());

  return {
    merged,
    conflicts,
    stats: {
      totalInput: results.reduce((sum, r) => sum + ((r && r.findings) ? r.findings.length : 0), 0),
      totalMerged: merged.length,
      totalConflicts: conflicts.length,
      mergeStrategy: strategy,
    },
  };
}

/* ---------------------------------------------------------------
   6. LIFECYCLE TRANSITIONS
----------------------------------------------------------------*/

/**
 * Advance the wave context to the next lifecycle phase.
 *
 * @param {object} waveContext - The wave context object
 * @param {string} targetPhase - The phase to transition to
 * @returns {{ success: boolean, previousPhase: string, currentPhase: string, error?: string }}
 */
function advancePhase(waveContext, targetPhase) {
  if (!waveContext || typeof waveContext !== 'object') {
    return { success: false, previousPhase: 'unknown', currentPhase: 'unknown', error: 'Invalid wave context' };
  }

  const currentIndex = LIFECYCLE_PHASES.indexOf(waveContext.phase);
  const targetIndex = LIFECYCLE_PHASES.indexOf(targetPhase);

  if (targetIndex < 0) {
    return {
      success: false,
      previousPhase: waveContext.phase,
      currentPhase: waveContext.phase,
      error: `Invalid target phase: ${targetPhase}`,
    };
  }

  // Allow forward transitions only (no backward jumps)
  if (targetIndex <= currentIndex) {
    return {
      success: false,
      previousPhase: waveContext.phase,
      currentPhase: waveContext.phase,
      error: `Cannot transition backward from "${waveContext.phase}" to "${targetPhase}"`,
    };
  }

  const previousPhase = waveContext.phase;
  waveContext.phase = targetPhase;
  waveContext.updatedAt = new Date().toISOString();

  return {
    success: true,
    previousPhase,
    currentPhase: targetPhase,
  };
}

/**
 * Check whether all segments in a wave have completed (or been pruned/failed).
 *
 * @param {Array<object>} dispatches - Dispatch records from dispatchWave
 * @returns {boolean}
 */
function isWaveComplete(dispatches) {
  if (!Array.isArray(dispatches) || dispatches.length === 0) return true;

  const terminalStatuses = new Set(['completed', 'converged', 'pruned', 'failed']);
  return dispatches.every(d => terminalStatuses.has(d.status));
}

/* ---------------------------------------------------------------
   7. HELPERS
----------------------------------------------------------------*/

/**
 * Build a deterministic finding key from its identifying fields.
 * Keys by findingId if present, otherwise by file:line + title.
 *
 * @param {object} finding
 * @returns {string}
 */
function buildFindingKey(finding) {
  if (!finding) return 'unknown';
  if (finding.findingId) return finding.findingId;

  const file = finding.file || finding.filePath || '';
  const line = finding.line || finding.lineNumber || 0;
  const title = finding.title || finding.summary || '';
  return `${file}:${line}::${title}`.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Compare two severity values. Returns >0 if a is higher severity.
 * P0 > P1 > P2.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compareSeverity(a, b) {
  const order = { P0: 3, P1: 2, P2: 1 };
  return (order[a] || 0) - (order[b] || 0);
}

/* ---------------------------------------------------------------
   8. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  LIFECYCLE_PHASES,
  SEGMENT_STATUSES,
  MAX_PARALLEL_SEGMENTS,
  MERGE_STRATEGIES,
  // Fan-out/join proof
  canFanOut,
  // Wave context
  createWaveContext,
  // Fan-out/join
  dispatchWave,
  joinWave,
  // Lifecycle
  advancePhase,
  isWaveComplete,
  // Helpers
  buildFindingKey,
  compareSeverity,
};
