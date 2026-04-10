// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Improvement Journal — Append-Only Audit Journal for Improvement Sessions║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS — Stop-Reason Taxonomy & Session Outcomes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Stop reasons explain WHY a session terminated.
 * Research finding (P0): do not overload stopReason with outcome semantics.
 * @type {Readonly<Record<string, string>>}
 */
const STOP_REASONS = Object.freeze({
  converged: 'converged',
  maxIterationsReached: 'maxIterationsReached',
  blockedStop: 'blockedStop',
  manualStop: 'manualStop',
  error: 'error',
  stuckRecovery: 'stuckRecovery',
});

/**
 * Session outcomes explain WHAT happened to the candidate.
 * Separate from stopReason per research finding (P0).
 * @type {Readonly<Record<string, string>>}
 */
const SESSION_OUTCOMES = Object.freeze({
  keptBaseline: 'keptBaseline',
  promoted: 'promoted',
  rolledBack: 'rolledBack',
  advisoryOnly: 'advisoryOnly',
});

/**
 * Valid event types for the improvement journal.
 * Journal captures lifecycle events and stop decisions (ADR-001: orchestrator only).
 * @type {Readonly<string[]>}
 */
const VALID_EVENT_TYPES = Object.freeze([
  'session_start',
  'session_initialized',
  'integration_scanned',
  'candidate_generated',
  'candidate_scored',
  'benchmark_completed',
  'gate_evaluation',
  'legal_stop_evaluated',
  'blocked_stop',
  'promotion_attempt',
  'promotion_attempted',
  'promotion_result',
  'rollback',
  'rollback_result',
  'trade_off_detected',
  'mutation_proposed',
  'mutation_outcome',
  'session_ended',
  'session_end',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate that an event object has the required fields and a valid event type.
 * @param {object} event - Event to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateEvent(event) {
  const errors = [];

  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event must be a non-null object'] };
  }

  if (!event.eventType || typeof event.eventType !== 'string') {
    errors.push('Event must have a string eventType');
  } else if (!VALID_EVENT_TYPES.includes(event.eventType)) {
    errors.push(`Invalid eventType: "${event.eventType}". Valid types: ${VALID_EVENT_TYPES.join(', ')}`);
  }

  if (event.eventType === 'session_ended' || event.eventType === 'session_end') {
    if (event.details && event.details.stopReason) {
      if (!Object.values(STOP_REASONS).includes(event.details.stopReason)) {
        errors.push(`Invalid stopReason: "${event.details.stopReason}". Valid reasons: ${Object.values(STOP_REASONS).join(', ')}`);
      }
    }
    if (event.details && event.details.sessionOutcome) {
      if (!Object.values(SESSION_OUTCOMES).includes(event.details.sessionOutcome)) {
        errors.push(`Invalid sessionOutcome: "${event.details.sessionOutcome}". Valid outcomes: ${Object.values(SESSION_OUTCOMES).join(', ')}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Append an event to the improvement journal (append-only JSONL).
 * ADR-001: Journal emission is orchestrator-only; this function is the single write point.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @param {object} event - Event object with { eventType, iteration?, candidateId?, details? }
 * @returns {{ success: boolean, errors?: string[] }}
 */
function emitEvent(journalPath, event) {
  const enrichedEvent = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  const validation = validateEvent(enrichedEvent);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // Ensure directory exists
  const dir = path.dirname(journalPath);
  fs.mkdirSync(dir, { recursive: true });

  // Append-only: use 'a' flag (NFR-R01: survives process restart, no in-memory buffering)
  const line = JSON.stringify(enrichedEvent) + '\n';
  fs.appendFileSync(journalPath, line, 'utf8');

  return { success: true };
}

/**
 * Read all events from a journal file.
 * Used for resume/replay semantics (REQ-AI-003).
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {object[]} Array of parsed event objects
 */
function readJournal(journalPath) {
  try {
    const content = fs.readFileSync(journalPath, 'utf8');
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch (_err) {
          return [];
        }
      });
  } catch (_err) {
    return [];
  }
}

/**
 * Get the last completed iteration number from a journal.
 * Used for resume semantics — continuedFromIteration field.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {number} Last completed iteration number, or 0 if none
 */
function getLastIteration(journalPath) {
  const events = readJournal(journalPath);
  let maxIteration = 0;
  for (const event of events) {
    if (typeof event.iteration === 'number' && event.iteration > maxIteration) {
      maxIteration = event.iteration;
    }
  }
  return maxIteration;
}

/**
 * Get the stop reason from the last session_ended event.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {{ stopReason: string|null, sessionOutcome: string|null }}
 */
function getSessionResult(journalPath) {
  const events = readJournal(journalPath);
  const endEvents = events.filter(
    (e) => e.eventType === 'session_ended' || e.eventType === 'session_end'
  );
  if (endEvents.length === 0) {
    return { stopReason: null, sessionOutcome: null };
  }
  const last = endEvents[endEvents.length - 1];
  return {
    stopReason: (last.details && last.details.stopReason) || null,
    sessionOutcome: (last.details && last.details.sessionOutcome) || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  STOP_REASONS,
  SESSION_OUTCOMES,
  VALID_EVENT_TYPES,
  validateEvent,
  emitEvent,
  readJournal,
  getLastIteration,
  getSessionResult,
};
