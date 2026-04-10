'use strict';

// ---------------------------------------------------------------
// MODULE: Replay Corpus Builder (T001)
// ---------------------------------------------------------------
// Extracts replay corpus from packet JSONL data for offline
// loop optimization. Packet family 040 is REQUIRED. 028 is an
// optional holdout. 042 is excluded until traces exist.
// ---------------------------------------------------------------

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Supported packet families and their corpus roles.
 * @type {Readonly<Record<string, { role: string; required: boolean; compatibilityGrade: string }>>}
 */
const PACKET_FAMILIES = Object.freeze({
  '040': { role: 'primary', required: true, compatibilityGrade: 'full' },
  '028': { role: 'holdout', required: false, compatibilityGrade: 'legacy' },
  '042': { role: 'excluded', required: false, compatibilityGrade: 'none' },
});

/**
 * Required fields for a valid corpus entry.
 * @type {ReadonlyArray<string>}
 */
const REQUIRED_ENTRY_FIELDS = Object.freeze([
  'id',
  'packetFamily',
  'sourceRun',
  'config',
  'iterations',
  'stopOutcome',
]);

/**
 * JSONL record types that carry iteration data.
 * @type {ReadonlySet<string>}
 */
const ITERATION_TYPES = new Set(['iteration']);

/**
 * JSONL record types that carry stop/event data.
 * @type {ReadonlySet<string>}
 */
const EVENT_TYPES = new Set(['event']);

/* ---------------------------------------------------------------
   2. CORPUS ENTRY SCHEMA
----------------------------------------------------------------*/

/**
 * Validate a single corpus entry against the expected schema.
 *
 * @param {object} entry - The corpus entry to validate.
 * @returns {{ valid: boolean; errors: string[] }}
 */
function validateCorpusEntry(entry) {
  const errors = [];

  if (!entry || typeof entry !== 'object') {
    return { valid: false, errors: ['Entry must be a non-null object'] };
  }

  for (const field of REQUIRED_ENTRY_FIELDS) {
    if (entry[field] === undefined || entry[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (entry.packetFamily && !PACKET_FAMILIES[entry.packetFamily]) {
    errors.push(`Unknown packet family: ${entry.packetFamily}`);
  }

  if (entry.packetFamily === '042') {
    errors.push('Packet family 042 is excluded until implementation traces exist');
  }

  if (entry.iterations && !Array.isArray(entry.iterations)) {
    errors.push('iterations must be an array');
  }

  if (entry.iterations && Array.isArray(entry.iterations) && entry.iterations.length === 0) {
    errors.push('iterations must not be empty');
  }

  if (entry.config && typeof entry.config !== 'object') {
    errors.push('config must be an object');
  }

  if (entry.stopOutcome && typeof entry.stopOutcome !== 'object') {
    errors.push('stopOutcome must be an object');
  }

  return { valid: errors.length === 0, errors };
}

/* ---------------------------------------------------------------
   3. JSONL PARSING
----------------------------------------------------------------*/

/**
 * Parse JSONL content into an array of records.
 *
 * @param {string} content - Raw JSONL string.
 * @returns {object[]} Parsed records.
 */
function parseJSONL(content) {
  const lines = content.trim().split('\n');
  const records = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed));
    } catch (_err) {
      // Skip malformed lines
    }
  }

  return records;
}

/* ---------------------------------------------------------------
   4. CORPUS BUILDING
----------------------------------------------------------------*/

/**
 * Extract a single corpus entry from a set of parsed JSONL records.
 *
 * @param {object[]} records - Parsed JSONL records from a single run.
 * @param {string} packetFamily - The packet family identifier (e.g., '040').
 * @param {string} sourceRunId - Identifier for the source run.
 * @returns {object} A corpus entry.
 */
function extractCorpusEntry(records, packetFamily, sourceRunId) {
  const configRecord = records.find((r) => r.type === 'config') || {};
  const iterations = records.filter((r) => ITERATION_TYPES.has(r.type));
  const events = records.filter((r) => EVENT_TYPES.has(r.type));

  // Find the terminal event (synthesis_complete, stop_decision, etc.)
  const stopEvent = events.find(
    (e) =>
      e.event === 'synthesis_complete' ||
      e.event === 'stop_decision' ||
      e.event === 'stopped',
  );

  const familyInfo = PACKET_FAMILIES[packetFamily] || {
    role: 'unknown',
    required: false,
    compatibilityGrade: 'unknown',
  };

  const entry = {
    id: `${packetFamily}-${sourceRunId}`,
    packetFamily,
    sourceRun: sourceRunId,
    compatibilityGrade: familyInfo.compatibilityGrade,
    role: familyInfo.role,
    config: {
      maxIterations: configRecord.maxIterations || null,
      convergenceThreshold: configRecord.convergenceThreshold || null,
      stuckThreshold: configRecord.stuckThreshold || null,
      mode: configRecord.mode || null,
      topic: configRecord.topic || null,
    },
    iterations: iterations.map((iter) => ({
      run: iter.run,
      status: iter.status,
      focus: iter.focus || null,
      findingsCount: iter.findingsCount || 0,
      newInfoRatio: iter.newInfoRatio ?? iter.newFindingsRatio ?? null,
      convergenceSignals: iter.convergenceSignals || null,
      durationMs: iter.durationMs || null,
      timestamp: iter.timestamp || null,
    })),
    stopOutcome: stopEvent
      ? {
          stopReason: stopEvent.stopReason || stopEvent.decision || null,
          legalStop: stopEvent.legalStop || null,
          totalIterations: stopEvent.totalIterations || iterations.length,
          verdict: stopEvent.verdict || null,
        }
      : {
          stopReason: 'unknown',
          legalStop: null,
          totalIterations: iterations.length,
          verdict: null,
        },
    metadata: {
      extractedAt: new Date().toISOString(),
      sourceRecordCount: records.length,
      hasGraphMetrics: iterations.some(
        (i) => i.convergenceSignals && i.convergenceSignals.graphCoverage !== undefined,
      ),
      hasWaveMetrics: iterations.some(
        (i) => i.convergenceSignals && i.convergenceSignals.waveSegments !== undefined,
      ),
    },
  };

  return entry;
}

/**
 * Build a replay corpus from a packet family's JSONL data.
 *
 * @param {string} packetFamily - The packet family identifier ('040', '028', '042').
 * @param {object} [options={}] - Options.
 * @param {string} [options.fixturesDir] - Path to the fixtures directory.
 * @param {string} [options.jsonlContent] - Raw JSONL content (alternative to reading from disk).
 * @param {string} [options.sourceRunId] - Run identifier for the corpus entry.
 * @returns {{ corpus: object[]; errors: string[]; warnings: string[]; familyInfo: object }}
 */
function buildCorpus(packetFamily, options = {}) {
  const errors = [];
  const warnings = [];
  const corpus = [];

  // Check family validity
  const familyInfo = PACKET_FAMILIES[packetFamily];
  if (!familyInfo) {
    errors.push(`Unknown packet family: ${packetFamily}`);
    return { corpus, errors, warnings, familyInfo: null };
  }

  // 042 is excluded
  if (packetFamily === '042') {
    errors.push(
      'Packet family 042 is excluded until implementation traces exist',
    );
    return { corpus, errors, warnings, familyInfo };
  }

  // 028 holdout warning
  if (packetFamily === '028') {
    warnings.push(
      'Packet family 028 is an optional holdout with legacy compatibility grading',
    );
  }

  let records;

  if (options.jsonlContent) {
    records = parseJSONL(options.jsonlContent);
  } else if (options.fixturesDir) {
    const jsonlPath = path.join(
      options.fixturesDir,
      packetFamily,
      'sample-iterations.jsonl',
    );
    if (!fs.existsSync(jsonlPath)) {
      errors.push(`JSONL fixture not found: ${jsonlPath}`);
      return { corpus, errors, warnings, familyInfo };
    }
    const content = fs.readFileSync(jsonlPath, 'utf8');
    records = parseJSONL(content);
  } else {
    errors.push('Either fixturesDir or jsonlContent must be provided');
    return { corpus, errors, warnings, familyInfo };
  }

  if (records.length === 0) {
    errors.push('No valid JSONL records found');
    return { corpus, errors, warnings, familyInfo };
  }

  const sourceRunId =
    options.sourceRunId ||
    (records.find((r) => r.sessionId) || {}).sessionId ||
    `${packetFamily}-run-1`;

  const entry = extractCorpusEntry(records, packetFamily, sourceRunId);
  const validation = validateCorpusEntry(entry);

  if (!validation.valid) {
    errors.push(...validation.errors);
  } else {
    corpus.push(entry);
  }

  // Mark unavailable metrics explicitly (REQ-009)
  if (!entry.metadata.hasGraphMetrics) {
    warnings.push(
      `Corpus entry ${entry.id}: graph metrics unavailable (older trace format)`,
    );
  }
  if (!entry.metadata.hasWaveMetrics) {
    warnings.push(
      `Corpus entry ${entry.id}: wave metrics unavailable (older trace format)`,
    );
  }

  return { corpus, errors, warnings, familyInfo };
}

/* ---------------------------------------------------------------
   5. CORPUS PERSISTENCE
----------------------------------------------------------------*/

/**
 * Save a corpus to disk as a JSON file.
 *
 * @param {object[]} corpus - The corpus entries.
 * @param {string} outputPath - File path for the output.
 */
function saveCorpus(corpus, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(corpus, null, 2), 'utf8');
}

/**
 * Load a saved corpus from disk.
 *
 * @param {string} corpusPath - Path to the corpus JSON file.
 * @returns {object[]} The loaded corpus entries.
 */
function loadCorpus(corpusPath) {
  if (!fs.existsSync(corpusPath)) {
    throw new Error(`Corpus file not found: ${corpusPath}`);
  }
  const content = fs.readFileSync(corpusPath, 'utf8');
  return JSON.parse(content);
}

/* ---------------------------------------------------------------
   6. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  PACKET_FAMILIES,
  REQUIRED_ENTRY_FIELDS,
  buildCorpus,
  validateCorpusEntry,
  extractCorpusEntry,
  parseJSONL,
  saveCorpus,
  loadCorpus,
};
