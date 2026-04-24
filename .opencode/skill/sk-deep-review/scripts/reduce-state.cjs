// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review State Reducer                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { resolveArtifactRoot } = require('../../system-spec-kit/shared/review-research-paths.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
const SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 };
const LIVE_LINEAGE_MODES = new Set(['new', 'resume', 'restart']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeUtf8(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readUtf8(filePath));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'entry';
}

function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    try { return String(value).replace(/\s+/g, ' ').trim(); }
    catch { return ''; }
  }
  return value.replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function zeroSeverityMap() {
  return { P0: 0, P1: 0, P2: 0 };
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeSeverity(value) {
  return SEVERITY_KEYS.includes(value) ? value : null;
}

function normalizeLineageMode(value) {
  const normalized = normalizeText(value).toLowerCase();
  return LIVE_LINEAGE_MODES.has(normalized) ? normalized : null;
}

function getNestedField(record, fieldName) {
  if (!record || typeof record !== 'object') {
    return undefined;
  }
  if (record[fieldName] !== undefined) {
    return record[fieldName];
  }
  if (record.details && typeof record.details === 'object' && record.details[fieldName] !== undefined) {
    return record.details[fieldName];
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into an array of records, preserving both iteration and
 * event rows. Backward-compatible array return.
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {Array<Object>} Parsed records (corrupt lines silently dropped — use parseJsonlDetailed for fail-closed behavior)
 */
function parseJsonl(jsonlContent) {
  return parseJsonlDetailed(jsonlContent).records;
}

/**
 * Parse JSONL content and report malformed lines (fail-closed pathway).
 *
 * Returns both the parsed records and a corruption warning list. The reducer
 * exit code is non-zero when warnings are present unless `--lenient` is passed.
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {{records: Array<Object>, corruptionWarnings: Array<{line: number, raw: string, error: string}>}}
 */
function parseJsonlDetailed(jsonlContent) {
  const records = [];
  const corruptionWarnings = [];
  let lineNumber = 0;

  for (const rawLine of jsonlContent.split('\n')) {
    lineNumber += 1;
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    try {
      records.push(JSON.parse(line));
    } catch (error) {
      corruptionWarnings.push({
        line: lineNumber,
        raw: rawLine.length > 200 ? `${rawLine.slice(0, 200)}...` : rawLine,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { records, corruptionWarnings };
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}

function extractSubsection(sectionText, subheading) {
  const pattern = new RegExp(`(?:^|\\n)###\\s+${escapeRegExp(subheading)}[^\\n]*\\n([\\s\\S]*?)(?=\\n###\\s|\\n##\\s|$)`, 'i');
  const match = sectionText.match(pattern);
  return match ? match[1].trim() : '';
}

function extractListItems(sectionText) {
  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^([-*]|\d+\.)\s+/.test(line))
    .map((line) => normalizeText(line.replace(/^([-*]|\d+\.)\s+/, '')))
    .filter(Boolean);
}

/**
 * Parse a finding line of the form: `- **F001**: Title — file:line — Description`
 *
 * @param {string} line - Raw finding bullet
 * @param {string} severity - P0, P1, or P2 context
 * @returns {Object|null} Structured finding or null when the line is not a finding
 */
function parseFindingLine(line, severity) {
  const match = line.match(/^\*\*(F\d+)\*\*\s*:\s*(.+?)(?:\s+[—-]\s+`?([^`]+?)`?)?(?:\s+[—-]\s+(.+))?$/);
  if (!match) {
    return null;
  }

  const [, findingId, title, evidenceRaw, description] = match;
  let file = null;
  let lineNumber = null;

  if (evidenceRaw) {
    const evidenceMatch = evidenceRaw.trim().match(/^(.+?):(\d+)(?:[:-].*)?$/);
    if (evidenceMatch) {
      file = evidenceMatch[1];
      lineNumber = Number(evidenceMatch[2]);
    } else {
      file = evidenceRaw.trim();
    }
  }

  return {
    findingId,
    severity,
    title: normalizeText(title),
    file,
    line: lineNumber,
    description: normalizeText(description || ''),
  };
}

function parseFindingsBlock(sectionText, severity) {
  if (!sectionText) {
    return [];
  }

  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^-\s+\*\*F\d+\*\*/.test(line))
    .map((line) => parseFindingLine(line.replace(/^-\s+/, ''), severity))
    .filter(Boolean);
}

/**
 * Parse a single iteration markdown file into a structured review record.
 *
 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
 * @returns {Object} Parsed iteration with focus, findings, cross-reference, and reflection fields
 */
function parseIterationFile(iterationPath) {
  const markdown = readUtf8(iterationPath);
  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+\s*[-:]\s+(.+)$/m);

  // Support both old schema (Focus/Findings/Ruled Out/Dead Ends/Assessment)
  // and live schema (Dispatcher/Files Reviewed/Findings - New/Traceability Checks/
  // Confirmed-Clean/Next Focus).
  const focusSection = extractSection(markdown, 'Focus') || extractSection(markdown, 'Dispatcher');
  const findingsSection = extractSection(markdown, 'Findings') || extractSection(markdown, 'Findings - New');
  const ruledOutSection = extractSection(markdown, 'Ruled Out') || extractSection(markdown, 'Confirmed-Clean Surfaces') || extractSection(markdown, 'Confirmed-Clean');
  const deadEndsSection = extractSection(markdown, 'Dead Ends') || extractSection(markdown, 'Traceability Checks');
  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus') || extractSection(markdown, 'Next Focus (recommendation)') || extractSection(markdown, 'Next Focus');
  const assessmentSection = extractSection(markdown, 'Assessment');
  const filesReviewedSection = extractSection(markdown, 'Files Reviewed');

  const p0Block = extractSubsection(findingsSection, 'P0') || extractSubsection(findingsSection, 'P0 Findings');
  const p1Block = extractSubsection(findingsSection, 'P1') || extractSubsection(findingsSection, 'P1 Findings');
  const p2Block = extractSubsection(findingsSection, 'P2') || extractSubsection(findingsSection, 'P2 Findings');

  const findings = [
    ...parseFindingsBlock(p0Block, 'P0'),
    ...parseFindingsBlock(p1Block, 'P1'),
    ...parseFindingsBlock(p2Block, 'P2'),
  ];

  const dimensionsAddressed = (assessmentSection.match(/Dimensions addressed:\s*(.+)/i) || [])[1];

  return {
    path: iterationPath,
    run: runMatch ? Number(runMatch[1]) : 0,
    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
    findings,
    ruledOut: extractListItems(ruledOutSection),
    deadEnds: extractListItems(deadEndsSection),
    nextFocus: normalizeText(nextFocusSection),
    dimensionsAddressed: dimensionsAddressed
      ? dimensionsAddressed.split(/[,;]/).map((value) => normalizeText(value).toLowerCase()).filter(Boolean)
      : [],
  };
}

function parseStrategyDimensions(strategyContent) {
  const section = extractSection(strategyContent, '3. REVIEW DIMENSIONS (remaining)')
    || extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
    .map((line) => {
      const checked = /^- \[[xX]\]\s+/.test(line);
      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
      return { checked, text };
    });
}

function uniqueById(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (seen.has(item.findingId)) {
      continue;
    }
    seen.add(item.findingId);
    result.push(item);
  }

  return result;
}

function normalizeTransitions(transitions, defaultIteration) {
  const result = [];
  const seen = new Set();
  const rawTransitions = Array.isArray(transitions) ? transitions : [];

  for (const entry of rawTransitions) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const iteration = isFiniteNumber(entry.iteration) ? entry.iteration : defaultIteration;
    const from = entry.from === null ? null : normalizeSeverity(entry.from);
    const to = normalizeSeverity(entry.to);
    if (!to) {
      continue;
    }
    const reason = normalizeText(entry.reason || '') || 'Claim adjudication';
    const key = `${iteration}|${from ?? 'null'}|${to}|${reason}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({ iteration, from, to, reason });
  }

  return result;
}

function mergeTransitions(existingTransitions, incomingTransitions) {
  return normalizeTransitions(
    []
      .concat(Array.isArray(existingTransitions) ? existingTransitions : [])
      .concat(Array.isArray(incomingTransitions) ? incomingTransitions : []),
    0,
  );
}

function buildClaimAdjudicationByFinding(records) {
  const adjudicationByFinding = new Map();

  for (const record of records) {
    if (record?.type !== 'event' || record?.event !== 'claim_adjudication') {
      continue;
    }

    const findingId = normalizeText(getNestedField(record, 'findingId') || '');
    const finalSeverity = normalizeSeverity(getNestedField(record, 'finalSeverity'));
    if (!findingId || !finalSeverity) {
      continue;
    }

    const run = isFiniteNumber(getNestedField(record, 'run'))
      ? getNestedField(record, 'run')
      : 0;
    adjudicationByFinding.set(findingId, {
      findingId,
      finalSeverity,
      transitions: normalizeTransitions(getNestedField(record, 'transitions'), run),
      reason: normalizeText(getNestedField(record, 'reason') || ''),
      run,
      timestamp: normalizeText(getNestedField(record, 'timestamp') || ''),
    });
  }

  return adjudicationByFinding;
}

function buildLineageState(config, records, terminalStop = null) {
  const latestLifecycleEvent = records
    .filter((record) => record?.type === 'event' && (record?.event === 'resumed' || record?.event === 'restarted'))
    .at(-1);
  const eventContinuedFromRun = latestLifecycleEvent
    ? getNestedField(latestLifecycleEvent, 'continuedFromRun') ?? getNestedField(latestLifecycleEvent, 'fromIteration')
    : undefined;
  const latestLifecycleMode = normalizeLineageMode(getNestedField(latestLifecycleEvent, 'lineageMode') || '');
  const configLineageMode = normalizeLineageMode(config.lineageMode || '');
  const lineageMode = latestLifecycleMode || configLineageMode || 'new';
  const configContinuedFromRun = isFiniteNumber(config.continuedFromRun)
    ? config.continuedFromRun
    : null;
  const continuedFromRun = terminalStop
    ? null
    : isFiniteNumber(eventContinuedFromRun)
      ? eventContinuedFromRun
      : lineageMode !== 'new'
        ? configContinuedFromRun
        : null;

  return {
    sessionId: normalizeText(getNestedField(latestLifecycleEvent, 'sessionId') || '') || normalizeText(config.sessionId || '') || '',
    parentSessionId: normalizeText(getNestedField(latestLifecycleEvent, 'parentSessionId') || '')
      || normalizeText(config.parentSessionId || '')
      || null,
    lineageMode,
    generation: isFiniteNumber(getNestedField(latestLifecycleEvent, 'generation'))
      ? getNestedField(latestLifecycleEvent, 'generation')
      : isFiniteNumber(config.generation)
        ? config.generation
        : 1,
    continuedFromRun,
  };
}

function buildTerminalStopState(records) {
  let latestSynthesis = null;
  let latestSynthesisIndex = -1;
  let latestIterationIndex = -1;
  let latestLifecycleIndex = -1;

  records.forEach((record, index) => {
    if (record?.type === 'iteration') {
      latestIterationIndex = index;
      return;
    }
    if (record?.type !== 'event') {
      return;
    }
    if (record.event === 'synthesis_complete') {
      latestSynthesis = record;
      latestSynthesisIndex = index;
    }
    if (record.event === 'resumed' || record.event === 'restarted') {
      latestLifecycleIndex = index;
    }
  });

  if (!latestSynthesis) {
    return null;
  }
  if (latestSynthesisIndex < Math.max(latestIterationIndex, latestLifecycleIndex)) {
    return null;
  }

  return {
    stopReason: normalizeText(getNestedField(latestSynthesis, 'stopReason') || '') || null,
    totalIterations: isFiniteNumber(getNestedField(latestSynthesis, 'totalIterations'))
      ? getNestedField(latestSynthesis, 'totalIterations')
      : null,
    timestamp: normalizeText(getNestedField(latestSynthesis, 'timestamp') || '') || null,
  };
}

function deriveDashboardStatus(config, records, terminalStop) {
  if (terminalStop) {
    return 'COMPLETE';
  }
  const rawStatus = normalizeText(config.status || '').toLowerCase() || 'initialized';
  if (rawStatus === 'complete' || rawStatus === 'completed') {
    return 'COMPLETE';
  }
  if (rawStatus === 'running') {
    return 'RUNNING';
  }
  return rawStatus.toUpperCase();
}

function createCorruptionError(stateLogPath, corruptionWarnings) {
  const preview = corruptionWarnings
    .slice(0, 3)
    .map((warning) => `  - line ${warning.line}: ${warning.error}`)
    .join('\n');
  const error = new Error(
    `[sk-deep-review] parseJsonl detected ${corruptionWarnings.length} corrupt line(s) in ${stateLogPath}:\n${preview}\n`
    + 'Pass --lenient to the reducer CLI (or lenient:true to reduceReviewState) to ignore corruption.',
  );
  error.code = 'STATE_CORRUPTION';
  error.corruptionWarnings = corruptionWarnings;
  error.stateLogPath = stateLogPath;
  return error;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function buildFindingRegistry(iterationFiles, iterationRecords) {
  const findingById = new Map();
  const claimAdjudicationByFinding = buildClaimAdjudicationByFinding(iterationRecords);

  for (const iteration of iterationFiles) {
    for (const finding of iteration.findings) {
      const claimAdjudication = claimAdjudicationByFinding.get(finding.findingId);
      const canonicalSeverity = claimAdjudication?.finalSeverity || finding.severity;
      const existing = findingById.get(finding.findingId);
      if (!existing) {
        findingById.set(finding.findingId, {
          ...finding,
          severity: canonicalSeverity,
          dimension: deriveDimension({ ...finding, severity: canonicalSeverity }, iteration),
          firstSeen: iteration.run,
          lastSeen: iteration.run,
          status: 'active',
          transitions: mergeTransitions(
            [{
              iteration: iteration.run,
              from: null,
              to: canonicalSeverity,
              reason: 'Initial discovery',
            }],
            claimAdjudication?.transitions,
          ),
        });
      } else {
        existing.lastSeen = iteration.run;
        if (existing.severity !== canonicalSeverity) {
          existing.transitions.push({
            iteration: iteration.run,
            from: existing.severity,
            to: canonicalSeverity,
            reason: 'Severity adjusted in later iteration',
          });
          existing.severity = canonicalSeverity;
        }
        if (claimAdjudication?.transitions?.length) {
          existing.transitions = mergeTransitions(existing.transitions, claimAdjudication.transitions);
        }
      }
    }
  }

  const resolvedIdSet = new Set();
  for (const record of iterationRecords) {
    if (Array.isArray(record.resolvedFindings)) {
      for (const id of record.resolvedFindings) {
        resolvedIdSet.add(id);
      }
    }
  }

  const openFindings = [];
  const resolvedFindings = [];
  for (const finding of findingById.values()) {
    if (resolvedIdSet.has(finding.findingId)) {
      finding.status = 'resolved';
      resolvedFindings.push(finding);
    } else {
      openFindings.push(finding);
    }
  }

  openFindings.sort(compareFindings);
  resolvedFindings.sort(compareFindings);

  return { openFindings, resolvedFindings };
}

function compareFindings(left, right) {
  const severityOrder = { P0: 0, P1: 1, P2: 2 };
  const severityDiff = (severityOrder[left.severity] ?? 9) - (severityOrder[right.severity] ?? 9);
  if (severityDiff !== 0) {
    return severityDiff;
  }
  return left.findingId.localeCompare(right.findingId);
}

function deriveDimension(finding, iteration) {
  const focus = `${iteration.focus} ${finding.title} ${finding.description}`.toLowerCase();
  for (const dimension of REQUIRED_DIMENSIONS) {
    if (focus.includes(dimension)) {
      return dimension;
    }
  }
  return iteration.dimensionsAddressed[0] || 'correctness';
}

function buildDimensionCoverage(iterationRecords, strategyDimensions) {
  const covered = {};
  for (const dimension of REQUIRED_DIMENSIONS) {
    covered[dimension] = false;
  }

  for (const record of iterationRecords) {
    if (!Array.isArray(record.dimensions)) {
      continue;
    }
    for (const dimension of record.dimensions) {
      const normalized = String(dimension).toLowerCase();
      if (normalized in covered) {
        covered[normalized] = true;
      }
    }
  }

  for (const entry of strategyDimensions) {
    if (!entry.checked) {
      continue;
    }
    const normalized = entry.text.toLowerCase();
    for (const dimension of REQUIRED_DIMENSIONS) {
      if (normalized.includes(dimension)) {
        covered[dimension] = true;
      }
    }
  }

  return covered;
}

function buildFindingsBySeverity(openFindings) {
  const counts = zeroSeverityMap();
  for (const finding of openFindings) {
    if (SEVERITY_KEYS.includes(finding.severity)) {
      counts[finding.severity] += 1;
    }
  }
  return counts;
}

function computeConvergenceScore(iterationRecords) {
  const latest = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
  if (!latest) {
    return 0;
  }
  return (
    latest?.convergenceSignals?.compositeStop
    ?? (typeof latest?.newFindingsRatio === 'number' ? 1 - latest.newFindingsRatio : 0)
    ?? 0
  );
}

function computeGraphConvergenceScore(signals) {
  if (!signals || typeof signals !== 'object' || Array.isArray(signals)) {
    return 0;
  }

  const namedScore = signals.blendedScore
    ?? signals.graphScore
    ?? signals.score
    ?? signals.convergenceScore
    ?? signals.compositeScore
    ?? signals.stopScore
    ?? signals.decisionScore;
  if (typeof namedScore === 'number' && Number.isFinite(namedScore)) {
    return namedScore;
  }

  const numericSignals = Object.values(signals)
    .filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (!numericSignals.length) {
    return 0;
  }

  const sum = numericSignals.reduce((total, value) => total + value, 0);
  return sum / numericSignals.length;
}

function buildGraphConvergenceRollup(records) {
  const latest = records
    .filter((record) => record?.type === 'event' && record?.event === 'graph_convergence')
    .at(-1);

  if (!latest) {
    return {
      score: 0,
      decision: null,
      blockers: [],
    };
  }

  return {
    score: computeGraphConvergenceScore(latest.signals),
    decision: normalizeText(latest.decision || '') || null,
    blockers: Array.isArray(latest.blockers) ? latest.blockers : [],
  };
}

/**
 * Phase 008 P1-02 closure: defensively normalize each entry in `blockedBy` so
 * the review dashboard cannot render `[object Object]` even if an older YAML
 * workflow accidentally passes structured graph blockers through the contract.
 *
 * Contract: `blockedBy` is `string[]` of gate names. If an entry is already a
 * string, pass it through. If it is a structured graph blocker object
 * (`{type, description, count, severity}`), prefer `.type`, then `.name`, then
 * a short JSON preview. If it is anything else, stringify it.
 */
function normalizeBlockedByList(value, legacyLegalStop) {
  const rawList = Array.isArray(value)
    ? value
    : Array.isArray(legacyLegalStop?.blockedBy)
      ? legacyLegalStop.blockedBy
      : [];

  return rawList.map((entry) => {
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry === 'object') {
      if (typeof entry.type === 'string' && entry.type.length > 0) return entry.type;
      if (typeof entry.name === 'string' && entry.name.length > 0) return entry.name;
      return 'graph_blocker';
    }
    return String(entry);
  });
}

/**
 * Format a blocked-by gate list into a human-readable string.
 * @param {Array<string|object>} blockedBy - List of gate names or structured gate objects.
 * @returns {string} Formatted comma-separated gate list.
 */
function formatBlockedByList(blockedBy) {
  if (!Array.isArray(blockedBy) || blockedBy.length === 0) {
    return 'unknown gates';
  }
  return blockedBy
    .map((entry) => normalizeText(String(entry || '')))
    .filter(Boolean)
    .join(', ') || 'unknown gates';
}

function buildBlockedStopHistory(records) {
  return records
    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
    .map((record) => {
      const nestedLegalStop = getNestedField(record, 'legalStop');
      const legacyLegalStop = nestedLegalStop && typeof nestedLegalStop === 'object'
        ? nestedLegalStop
        : {};
      const blockedByValue = getNestedField(record, 'blockedBy');
      const graphBlockerDetailValue = getNestedField(record, 'graphBlockerDetail');
      const blockedBy = normalizeBlockedByList(blockedByValue, legacyLegalStop);
      const graphBlockerDetail = Array.isArray(graphBlockerDetailValue)
        ? graphBlockerDetailValue
        : Array.isArray(blockedByValue) && blockedByValue.some((e) => e && typeof e === 'object')
          ? blockedByValue
          : [];

      return {
        run: isFiniteNumber(getNestedField(record, 'run')) ? getNestedField(record, 'run') : 0,
        blockedBy,
        graphBlockerDetail,
        gateResults: getNestedField(record, 'gateResults') && typeof getNestedField(record, 'gateResults') === 'object'
          ? getNestedField(record, 'gateResults')
          : legacyLegalStop.gateResults && typeof legacyLegalStop.gateResults === 'object'
            ? legacyLegalStop.gateResults
            : {},
        recoveryStrategy: normalizeText(getNestedField(record, 'recoveryStrategy') || ''),
        timestamp: normalizeText(getNestedField(record, 'timestamp') || ''),
      };
    });
}

function buildRegistry(strategyDimensions, iterationFiles, iterationRecords, config, corruptionWarnings = []) {
  const terminalStop = buildTerminalStopState(iterationRecords);
  const lineage = buildLineageState(config, iterationRecords, terminalStop);
  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
  const findingsBySeverity = buildFindingsBySeverity(openFindings);
  const convergenceScore = computeConvergenceScore(iterationRecords);
  const graphConvergence = buildGraphConvergenceRollup(iterationRecords);
  const blockedStopHistory = buildBlockedStopHistory(iterationRecords);
  const status = deriveDashboardStatus(config, iterationRecords, terminalStop);

  // Part C REQ-018: split repeatedFindings into two semantically distinct buckets
  // so persistent-same-severity findings and severity-churn findings don't collapse.
  const persistentSameSeverity = openFindings.filter((finding) => {
    if (finding.lastSeen - finding.firstSeen < 1) return false;
    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
    // Exclude the initial discovery transition from the "no change" count
    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
    return nontrivialTransitions.length === 0;
  });

  const severityChanged = openFindings.filter((finding) => {
    const transitions = Array.isArray(finding.transitions) ? finding.transitions : [];
    const nontrivialTransitions = transitions.filter((t) => t.from !== null);
    return nontrivialTransitions.length > 0;
  });

  // Deprecated: keep repeatedFindings for backward compatibility with older consumers.
  // New code should read persistentSameSeverity + severityChanged directly.
  const repeatedFindings = openFindings.filter((finding) => finding.lastSeen - finding.firstSeen >= 1);

  return {
    sessionId: lineage.sessionId,
    parentSessionId: lineage.parentSessionId,
    generation: lineage.generation,
    lineageMode: lineage.lineageMode,
    continuedFromRun: lineage.continuedFromRun,
    terminalStop,
    status,
    openFindings,
    resolvedFindings,
    blockedStopHistory,
    persistentSameSeverity,
    severityChanged,
    repeatedFindings,
    dimensionCoverage,
    findingsBySeverity,
    openFindingsCount: openFindings.length,
    resolvedFindingsCount: resolvedFindings.length,
    convergenceScore,
    graphConvergenceScore: graphConvergence.score,
    graphDecision: graphConvergence.decision,
    graphBlockers: graphConvergence.blockers,
    corruptionWarnings,
  };
}

function blockFromBulletList(items) {
  if (!items.length) {
    return '[None yet]';
  }
  return items.map((item) => `- ${item}`).join('\n');
}

function buildExhaustedApproaches(iterationFiles) {
  const grouped = new Map();

  for (const iteration of iterationFiles) {
    for (const entry of iteration.deadEnds.concat(iteration.ruledOut)) {
      const bucket = grouped.get(entry) || [];
      bucket.push(iteration.run);
      grouped.set(entry, bucket);
    }
  }

  if (!grouped.size) {
    return '[No exhausted approach categories yet]';
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([entry, runs]) => {
      const attemptCount = runs.length;
      const lastRun = Math.max(...runs);
      return [
        `### ${entry} -- BLOCKED (iteration ${lastRun}, ${attemptCount} attempts)`,
        `- What was tried: ${entry}`,
        `- Why blocked: Repeated iteration evidence ruled this direction out.`,
        `- Do NOT retry: ${entry}`,
      ].join('\n');
    })
    .join('\n\n');
}

function replaceAnchorSection(content, anchorId, heading, body, options = {}) {
  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
  const replacement = [
    `<!-- ANCHOR:${anchorId} -->`,
    `## ${heading}`,
    body.trim() ? body.trim() : '[None yet]',
    '',
    `<!-- /ANCHOR:${anchorId} -->`,
  ].join('\n');

  if (!pattern.test(content)) {
    if (options.createMissing) {
      const suffix = content.endsWith('\n') ? '' : '\n';
      return `${content}${suffix}\n${replacement}\n`;
    }
    throw new Error(
      `Missing machine-owned anchor "${anchorId}" in deep-review strategy file. `
      + 'Pass createMissing:true (or the reducer CLI flag --create-missing-anchors) to bootstrap.',
    );
  }
  return content.replace(pattern, replacement);
}

function updateStrategyContent(strategyContent, registry, iterationFiles, options = {}, iterationRecords = []) {
  // Early return when there is no strategy file to update. Empty content
  // cannot contain the machine-owned anchors and replaceAnchorSection would
  // correctly fail-close — but for that specific case we intentionally skip
  // rather than throw so bootstrap flows (no strategy yet) still work.
  if (!strategyContent) {
    return strategyContent;
  }

  const anchorOptions = { createMissing: Boolean(options.createMissingAnchors) };
  const severity = registry.findingsBySeverity;
  const runningFindings = [
    `- P0 (Blockers): ${severity.P0}`,
    `- P1 (Required): ${severity.P1}`,
    `- P2 (Suggestions): ${severity.P2}`,
    `- Resolved: ${registry.resolvedFindingsCount}`,
  ].join('\n');

  const completedDimensions = REQUIRED_DIMENSIONS
    .filter((dimension) => registry.dimensionCoverage[dimension])
    .map((dimension) => `- [x] ${dimension}`)
    .join('\n') || '[None yet]';

  const remainingDimensions = REQUIRED_DIMENSIONS
    .filter((dimension) => !registry.dimensionCoverage[dimension])
    .map((dimension) => `- [ ] ${dimension}`)
    .join('\n') || '[All dimensions complete]';

  // Default next-focus comes from latest iteration → first uncovered dimension → fallback.
  let nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
    || '[All dimensions covered]';

  // Part C REQ-014 / Phase 008 P1-03 closure: prefer the latest blocked-stop
  // recovery only when blocked-stop is genuinely the most recent loop event.
  // The earlier implementation read timestamps from the markdown iteration
  // files, but parseIterationFile() never captures timestamps, so
  // latestIterationTimestamp was always undefined and any historical
  // blocked-stop permanently pinned next-focus. Fix: source recency from the
  // JSONL iteration records (which do carry timestamps) instead.
  const latestBlockedStop = registry.blockedStopHistory?.at(-1);
  if (latestBlockedStop && latestBlockedStop.timestamp) {
    const latestIterationTimestamp = iterationRecords
      .filter((record) => record?.type === 'iteration' && typeof record.timestamp === 'string')
      .map((record) => record.timestamp)
      .at(-1);
    const blockedIsMostRecent = !latestIterationTimestamp
      || latestBlockedStop.timestamp >= latestIterationTimestamp;
    if (blockedIsMostRecent) {
      const blockers = formatBlockedByList(latestBlockedStop.blockedBy);
      const recovery = latestBlockedStop.recoveryStrategy || '[no recovery strategy provided]';
      nextFocus = [
        `BLOCKED on: ${blockers}`,
        `Recovery: ${recovery}`,
        'Address the blocking gates before the next iteration.',
      ].join('\n');
    }
  }

  let updated = strategyContent;
  updated = replaceAnchorSection(updated, 'review-dimensions', '3. REVIEW DIMENSIONS (remaining)', remainingDimensions, anchorOptions);
  updated = replaceAnchorSection(updated, 'completed-dimensions', '4. COMPLETED DIMENSIONS', completedDimensions, anchorOptions);
  updated = replaceAnchorSection(updated, 'running-findings', '5. RUNNING FINDINGS', runningFindings, anchorOptions);
  updated = replaceAnchorSection(
    updated,
    'exhausted-approaches',
    '9. EXHAUSTED APPROACHES (do not retry)',
    buildExhaustedApproaches(iterationFiles),
    anchorOptions,
  );
  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus, anchorOptions);
  return updated;
}

function renderDashboard(config, registry, iterationRecords, iterationFiles) {
  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
  const ratios = iterationRecords
    .filter((record) => record.type === 'iteration')
    .map((record) => (typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio : null))
    .filter((value) => value !== null);
  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
    || '[All dimensions covered]';

  const severity = registry.findingsBySeverity;
  const verdict = severity.P0 > 0
    ? 'FAIL'
    : severity.P1 > 0
      ? 'CONDITIONAL'
      : 'PASS';
  const hasAdvisories = verdict === 'PASS' && severity.P2 > 0;

  const progressRows = iterationRecords
    .filter((record) => record.type === 'iteration')
    .map((record) => {
      const dimensions = Array.isArray(record.dimensions) ? record.dimensions.join('/') : '-';
      const ratio = typeof record.newFindingsRatio === 'number' ? record.newFindingsRatio.toFixed(2) : '0.00';
      const summary = record.findingsSummary || {};
      const findings = `${summary.P0 ?? 0}/${summary.P1 ?? 0}/${summary.P2 ?? 0}`;
      return `| ${record.run} | ${record.focus || 'unknown'} | ${dimensions} | ${ratio} | ${findings} | ${record.status || 'complete'} |`;
    })
    .join('\n') || '| 0 | none yet | - | 0.00 | 0/0/0 | initialized |';

  const dimensionRows = REQUIRED_DIMENSIONS
    .map((dimension) => {
      const covered = registry.dimensionCoverage[dimension];
      const status = covered ? 'covered' : 'pending';
      const openInDimension = registry.openFindings.filter((finding) => finding.dimension === dimension).length;
      return `| ${dimension} | ${status} | ${openInDimension} |`;
    })
    .join('\n');

  return [
    '---',
    'title: Deep Review Dashboard',
    'description: Auto-generated reducer view over the review packet.',
    '---',
    '',
    '# Deep Review Dashboard - Session Overview',
    '',
    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
    '',
    '<!-- ANCHOR:overview -->',
    '## 1. OVERVIEW',
    '',
    'Reducer-generated observability surface for the active review packet.',
    '',
    '<!-- /ANCHOR:overview -->',
    '<!-- ANCHOR:status -->',
    '## 2. STATUS',
    `- Review Target: ${config.reviewTarget || '[Unknown target]'} (${config.reviewTargetType || 'unknown'})`,
    `- Started: ${config.createdAt || '[Unknown start]'}`,
    `- Status: ${registry.status || String(config.status || 'initialized').toUpperCase()}`,
    `- Iteration: ${iterationRecords.filter((record) => record.type === 'iteration').length} of ${config.maxIterations || 0}`,
    `- Provisional Verdict: ${verdict}`,
    `- hasAdvisories: ${hasAdvisories}`,
    `- Session ID: ${registry.sessionId || '[Unknown session]'}`,
    `- Parent Session: ${registry.parentSessionId ?? 'none'}`,
    `- Lifecycle Mode: ${registry.lineageMode || 'new'}`,
    `- Generation: ${registry.generation ?? 1}`,
    `- continuedFromRun: ${registry.continuedFromRun ?? 'none'}`,
    ...(registry.terminalStop?.stopReason ? [`- stopReason: ${registry.terminalStop.stopReason}`] : []),
    '',
    '<!-- /ANCHOR:status -->',
    '<!-- ANCHOR:findings-summary -->',
    '## 3. FINDINGS SUMMARY',
    '',
    '| Severity | Count |',
    '|----------|------:|',
    `| P0 (Blockers) | ${severity.P0} |`,
    `| P1 (Required) | ${severity.P1} |`,
    `| P2 (Suggestions) | ${severity.P2} |`,
    `| Resolved | ${registry.resolvedFindingsCount} |`,
    '',
    '<!-- /ANCHOR:findings-summary -->',
    '<!-- ANCHOR:progress -->',
    '## 4. PROGRESS',
    '',
    '| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |',
    '|---|-------|------------|-------|----------|--------|',
    progressRows,
    '',
    '<!-- /ANCHOR:progress -->',
    '<!-- ANCHOR:dimension-coverage -->',
    '## 5. DIMENSION COVERAGE',
    '',
    '| Dimension | Status | Open findings |',
    '|-----------|--------|--------------:|',
    dimensionRows,
    '',
    '<!-- /ANCHOR:dimension-coverage -->',
    '<!-- ANCHOR:blocked-stops -->',
    '## 6. BLOCKED STOPS',
    ...(registry.blockedStopHistory && registry.blockedStopHistory.length > 0
      ? registry.blockedStopHistory.flatMap((entry) => {
          const blockers = formatBlockedByList(entry.blockedBy);
          const gateSummary = entry.gateResults && typeof entry.gateResults === 'object'
            ? Object.entries(entry.gateResults)
                .map(([gate, result]) => {
                  const pass = result && typeof result === 'object' && 'pass' in result ? result.pass : '?';
                  return `${gate}: ${pass}`;
                })
                .join(', ')
            : '[no gate results]';
          return [
            `### Iteration ${entry.run} — blocked by [${blockers}]`,
            `- Recovery: ${entry.recoveryStrategy || '[no recovery strategy recorded]'}`,
            `- Gate results: ${gateSummary}`,
            `- Timestamp: ${entry.timestamp || '[no timestamp]'}`,
            '',
          ];
        })
      : ['No blocked-stop events recorded.', '']),
    '<!-- /ANCHOR:blocked-stops -->',
    '<!-- ANCHOR:graph-convergence -->',
    '## 7. GRAPH CONVERGENCE',
    `- graphConvergenceScore: ${Number(registry.graphConvergenceScore || 0).toFixed(2)}`,
    `- graphDecision: ${registry.graphDecision || 'none'}`,
    ...(Array.isArray(registry.graphBlockers) && registry.graphBlockers.length > 0
      ? [`- graphBlockers: ${registry.graphBlockers.map((b) => (typeof b === 'string' ? b : JSON.stringify(b))).join(', ')}`]
      : ['- graphBlockers: none']),
    '',
    '<!-- /ANCHOR:graph-convergence -->',
    '<!-- ANCHOR:trend -->',
    '## 8. TREND',
    `- Last 3 ratios: ${lastThreeRatios}`,
    `- convergenceScore: ${Number(registry.convergenceScore || 0).toFixed(2)}`,
    `- openFindings: ${registry.openFindingsCount}`,
    `- persistentSameSeverity: ${(registry.persistentSameSeverity || []).length}`,
    `- severityChanged: ${(registry.severityChanged || []).length}`,
    `- repeatedFindings (deprecated combined bucket): ${registry.repeatedFindings.length}`,
    '',
    '<!-- /ANCHOR:trend -->',
    '<!-- ANCHOR:corruption-warnings -->',
    '## 9. CORRUPTION WARNINGS',
    ...(Array.isArray(registry.corruptionWarnings) && registry.corruptionWarnings.length > 0
      ? registry.corruptionWarnings.map((w) => `- Line ${w.line}: ${w.error} (raw: ${w.raw})`)
      : ['No corrupt JSONL lines detected.']),
    '',
    '<!-- /ANCHOR:corruption-warnings -->',
    '<!-- ANCHOR:next-focus -->',
    '## 10. NEXT FOCUS',
    nextFocus,
    '',
    '<!-- /ANCHOR:next-focus -->',
    '<!-- ANCHOR:active-risks -->',
    '## 11. ACTIVE RISKS',
    ...(function buildActiveRisks() {
      // REQ-034 (042 closing audit, F015): surface non-P0 release-readiness
      // debt alongside P0s so the dashboard cannot hide P1 debt behind a
      // "None active" summary when activeP0 == 0. Gate debt on the latest
      // `blocked_stop` and `claim_adjudication` events so operators see
      // claim-adjudication and legal-stop gate failures, not just severity.
      const lines = [];
      if (latestIteration?.status === 'error') {
        lines.push('- Latest iteration reported error status.');
      }
      if (severity.P0 > 0) {
        lines.push(`- ${severity.P0} active P0 finding(s) blocking release.`);
      }
      if (severity.P1 > 0) {
        lines.push(`- ${severity.P1} active P1 finding(s) — required before release; not a P0 but still blocks PASS.`);
      }
      const latestClaimAdjudication = [...iterationRecords]
        .reverse()
        .find((record) => record
          && record.type === 'event'
          && record.event === 'claim_adjudication'
          && typeof getNestedField(record, 'passed') === 'boolean'
          && !normalizeText(getNestedField(record, 'findingId') || ''));
      const activeP0P1 = severity.P0 + severity.P1;
      const adjudicationActiveCount = isFiniteNumber(getNestedField(latestClaimAdjudication, 'activeP0P1'))
        ? getNestedField(latestClaimAdjudication, 'activeP0P1')
        : activeP0P1;
      if (latestClaimAdjudication && getNestedField(latestClaimAdjudication, 'passed') === false && activeP0P1 > 0 && adjudicationActiveCount > 0) {
        const missingPackets = getNestedField(latestClaimAdjudication, 'missingPackets');
        const missing = Array.isArray(missingPackets) && missingPackets.length > 0
          ? ` (missing packets: ${missingPackets.join(', ')})`
          : '';
        lines.push(`- Claim-adjudication gate last failed at run ${latestClaimAdjudication.run ?? '?'}${missing}. STOP is vetoed until every active P0/P1 has a typed claim-adjudication packet.`);
      }
      const latestBlockedStop = registry.blockedStopHistory?.at(-1);
      if (latestBlockedStop && Array.isArray(latestBlockedStop.blockedBy) && latestBlockedStop.blockedBy.length > 0) {
        lines.push(`- Latest blocked_stop at run ${latestBlockedStop.run ?? '?'}: ${formatBlockedByList(latestBlockedStop.blockedBy)}. Recovery: ${latestBlockedStop.recoveryStrategy || 'see dashboard §BLOCKED STOPS'}.`);
      }
      if (severity.P2 > 0 && lines.length === 0) {
        lines.push(`- ${severity.P2} active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.`);
      }
      if (lines.length === 0) {
        lines.push('- None active beyond normal review uncertainty.');
      }
      return lines;
    })(),
    '',
    '<!-- /ANCHOR:active-risks -->',
    '',
  ].join('\n');
}

/**
 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
 *
 * @param {string} specFolder - Path to the target spec folder for the review packet
 * @param {Object} [options] - Reducer options
 * @param {boolean} [options.write=true] - Write outputs to disk when true
 * @returns {Object} Paths and content for registry, strategy, and dashboard
 */
function reduceReviewState(specFolder, options = {}) {
  const write = options.write !== false;
  const lenient = Boolean(options.lenient);
  const createMissingAnchors = Boolean(options.createMissingAnchors);
  const resolvedSpecFolder = path.resolve(specFolder);
  const { artifactDir: reviewDir } = resolveArtifactRoot(resolvedSpecFolder, 'review');
  const configPath = path.join(reviewDir, 'deep-review-config.json');
  const stateLogPath = path.join(reviewDir, 'deep-review-state.jsonl');
  const strategyPath = path.join(reviewDir, 'deep-review-strategy.md');
  const registryPath = path.join(reviewDir, 'deep-review-findings-registry.json');
  const dashboardPath = path.join(reviewDir, 'deep-review-dashboard.md');
  const iterationDir = path.join(reviewDir, 'iterations');

  const config = readJson(configPath);
  const { records, corruptionWarnings } = parseJsonlDetailed(readUtf8(stateLogPath));
  const terminalStop = buildTerminalStopState(records);
  const lineage = buildLineageState(config, records, terminalStop);
  config.sessionId = lineage.sessionId || config.sessionId || '';
  config.parentSessionId = lineage.parentSessionId;
  config.lineageMode = lineage.lineageMode;
  config.generation = lineage.generation;
  config.continuedFromRun = lineage.continuedFromRun;
  if (terminalStop?.stopReason) {
    config.stopReason = terminalStop.stopReason;
  }
  const strategyContent = fs.existsSync(strategyPath) ? readUtf8(strategyPath) : '';
  const strategyDimensions = parseStrategyDimensions(strategyContent);
  const iterationFiles = fs.existsSync(iterationDir)
    ? fs.readdirSync(iterationDir)
        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
        .sort()
        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
    : [];

  const registry = buildRegistry(strategyDimensions, iterationFiles, records, config, corruptionWarnings);
  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles, { createMissingAnchors }, records);
  const dashboard = renderDashboard(config, registry, records, iterationFiles);

  if (corruptionWarnings.length > 0 && !lenient) {
    throw createCorruptionError(stateLogPath, corruptionWarnings);
  }

  if (write) {
    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    if (strategyContent) {
      writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
    }
    writeUtf8(dashboardPath, dashboard);
  }

  return {
    configPath,
    stateLogPath,
    strategyPath,
    registryPath,
    dashboardPath,
    registry,
    strategy,
    dashboard,
    corruptionWarnings,
    hasCorruption: corruptionWarnings.length > 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  const lenient = args.includes('--lenient');
  const createMissingAnchors = args.includes('--create-missing-anchors');
  const positional = args.filter((arg) => !arg.startsWith('--'));
  const specFolder = positional[0];

  if (!specFolder) {
    process.stderr.write(
      'Usage: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder> [--lenient] [--create-missing-anchors]\n',
    );
    process.exit(1);
  }

  try {
    const result = reduceReviewState(specFolder, { write: true, lenient, createMissingAnchors });
    process.stdout.write(
      `${JSON.stringify(
        {
          registryPath: result.registryPath,
          dashboardPath: result.dashboardPath,
          strategyPath: result.strategyPath,
          openFindingsCount: result.registry.openFindingsCount,
          resolvedFindingsCount: result.registry.resolvedFindingsCount,
          convergenceScore: result.registry.convergenceScore,
          graphConvergenceScore: result.registry.graphConvergenceScore,
          corruptionCount: result.corruptionWarnings.length,
        },
        null,
        2,
      )}\n`,
    );
  } catch (error) {
    if (error && error.code === 'STATE_CORRUPTION') {
      process.stderr.write(`${error.message}\n`);
      process.exit(2);
    }
    process.stderr.write(`[sk-deep-review] reducer failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(3);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  REQUIRED_DIMENSIONS,
  SEVERITY_KEYS,
  SEVERITY_WEIGHTS,
  buildGraphConvergenceRollup,
  parseIterationFile,
  parseJsonl,
  parseJsonlDetailed,
  parseFindingLine,
  replaceAnchorSection,
  reduceReviewState,
};
