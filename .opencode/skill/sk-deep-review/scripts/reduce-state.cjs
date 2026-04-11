// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review State Reducer                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_DIMENSIONS = ['correctness', 'security', 'traceability', 'maintainability'];
const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
const SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 };

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
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function zeroSeverityMap() {
  return { P0: 0, P1: 0, P2: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into an array of records, preserving both iteration and
 * event rows while skipping malformed lines.
 *
 * @param {string} jsonlContent - Newline-delimited JSON string
 * @returns {Array<Object>} Parsed records
 */
function parseJsonl(jsonlContent) {
  const records = [];

  for (const rawLine of jsonlContent.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    try {
      records.push(JSON.parse(line));
    } catch (_error) {
      continue;
    }
  }

  return records;
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
  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);

  const focusSection = extractSection(markdown, 'Focus');
  const findingsSection = extractSection(markdown, 'Findings');
  const ruledOutSection = extractSection(markdown, 'Ruled Out');
  const deadEndsSection = extractSection(markdown, 'Dead Ends');
  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
  const assessmentSection = extractSection(markdown, 'Assessment');

  const p0Block = extractSubsection(findingsSection, 'P0');
  const p1Block = extractSubsection(findingsSection, 'P1');
  const p2Block = extractSubsection(findingsSection, 'P2');

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

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function buildFindingRegistry(iterationFiles, iterationRecords) {
  const findingById = new Map();

  for (const iteration of iterationFiles) {
    for (const finding of iteration.findings) {
      const existing = findingById.get(finding.findingId);
      if (!existing) {
        findingById.set(finding.findingId, {
          ...finding,
          dimension: deriveDimension(finding, iteration),
          firstSeen: iteration.run,
          lastSeen: iteration.run,
          status: 'active',
          transitions: [{
            iteration: iteration.run,
            from: null,
            to: finding.severity,
            reason: 'Initial discovery',
          }],
        });
      } else {
        existing.lastSeen = iteration.run;
        if (existing.severity !== finding.severity) {
          existing.transitions.push({
            iteration: iteration.run,
            from: existing.severity,
            to: finding.severity,
            reason: 'Severity adjusted in later iteration',
          });
          existing.severity = finding.severity;
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

function buildBlockedStopHistory(records) {
  return records
    .filter((record) => record?.type === 'event' && record?.event === 'blocked_stop')
    .map((record) => {
      const legacyLegalStop = record.legalStop && typeof record.legalStop === 'object'
        ? record.legalStop
        : {};
      return {
        run: typeof record.run === 'number' ? record.run : 0,
        blockedBy: Array.isArray(record.blockedBy)
          ? record.blockedBy
          : Array.isArray(legacyLegalStop.blockedBy)
            ? legacyLegalStop.blockedBy
            : [],
        gateResults: record.gateResults && typeof record.gateResults === 'object'
          ? record.gateResults
          : legacyLegalStop.gateResults && typeof legacyLegalStop.gateResults === 'object'
            ? legacyLegalStop.gateResults
            : {},
        recoveryStrategy: normalizeText(record.recoveryStrategy || ''),
        timestamp: normalizeText(record.timestamp || ''),
      };
    });
}

function buildRegistry(strategyDimensions, iterationFiles, iterationRecords, config) {
  const { openFindings, resolvedFindings } = buildFindingRegistry(iterationFiles, iterationRecords);
  const dimensionCoverage = buildDimensionCoverage(iterationRecords, strategyDimensions);
  const findingsBySeverity = buildFindingsBySeverity(openFindings);
  const convergenceScore = computeConvergenceScore(iterationRecords);
  const blockedStopHistory = buildBlockedStopHistory(iterationRecords);

  const repeatedFindings = openFindings.filter((finding) => finding.lastSeen - finding.firstSeen >= 1);

  return {
    sessionId: config.sessionId || '',
    generation: config.generation ?? 1,
    lineageMode: config.lineageMode || 'new',
    openFindings,
    resolvedFindings,
    blockedStopHistory,
    repeatedFindings,
    dimensionCoverage,
    findingsBySeverity,
    openFindingsCount: openFindings.length,
    resolvedFindingsCount: resolvedFindings.length,
    convergenceScore,
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

function replaceAnchorSection(content, anchorId, heading, body) {
  const pattern = new RegExp(`<!-- ANCHOR:${anchorId} -->[\\s\\S]*?<!-- \\/ANCHOR:${anchorId} -->`, 'm');
  const replacement = [
    `<!-- ANCHOR:${anchorId} -->`,
    `## ${heading}`,
    body.trim() ? body.trim() : '[None yet]',
    '',
    `<!-- /ANCHOR:${anchorId} -->`,
  ].join('\n');

  if (!pattern.test(content)) {
    return content;
  }
  return content.replace(pattern, replacement);
}

function updateStrategyContent(strategyContent, registry, iterationFiles) {
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

  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
    || REQUIRED_DIMENSIONS.find((dimension) => !registry.dimensionCoverage[dimension])
    || '[All dimensions covered]';

  let updated = strategyContent;
  updated = replaceAnchorSection(updated, 'review-dimensions', '3. REVIEW DIMENSIONS (remaining)', remainingDimensions);
  updated = replaceAnchorSection(updated, 'completed-dimensions', '4. COMPLETED DIMENSIONS', completedDimensions);
  updated = replaceAnchorSection(updated, 'running-findings', '5. RUNNING FINDINGS', runningFindings);
  updated = replaceAnchorSection(
    updated,
    'exhausted-approaches',
    '9. EXHAUSTED APPROACHES (do not retry)',
    buildExhaustedApproaches(iterationFiles),
  );
  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
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
    `- Status: ${String(config.status || 'initialized').toUpperCase()}`,
    `- Iteration: ${iterationRecords.filter((record) => record.type === 'iteration').length} of ${config.maxIterations || 0}`,
    `- Provisional Verdict: ${verdict}`,
    `- hasAdvisories: ${hasAdvisories}`,
    `- Session ID: ${config.sessionId || '[Unknown session]'}`,
    `- Lifecycle Mode: ${config.lineageMode || 'new'}`,
    `- Generation: ${config.generation ?? 1}`,
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
    '<!-- ANCHOR:trend -->',
    '## 6. TREND',
    `- Last 3 ratios: ${lastThreeRatios}`,
    `- convergenceScore: ${Number(registry.convergenceScore || 0).toFixed(2)}`,
    `- openFindings: ${registry.openFindingsCount}`,
    `- repeatedFindings: ${registry.repeatedFindings.length}`,
    '',
    '<!-- /ANCHOR:trend -->',
    '<!-- ANCHOR:next-focus -->',
    '## 7. NEXT FOCUS',
    nextFocus,
    '',
    '<!-- /ANCHOR:next-focus -->',
    '<!-- ANCHOR:active-risks -->',
    '## 8. ACTIVE RISKS',
    ...(latestIteration?.status === 'error'
      ? ['- Latest iteration reported error status.']
      : severity.P0 > 0
        ? [`- ${severity.P0} active P0 finding(s) blocking release.`]
        : ['- None active beyond normal review uncertainty.']),
    '',
    '<!-- /ANCHOR:active-risks -->',
    '',
  ].join('\n');
}

/**
 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
 *
 * @param {string} specFolder - Path to the spec folder containing a review/ directory
 * @param {Object} [options] - Reducer options
 * @param {boolean} [options.write=true] - Write outputs to disk when true
 * @returns {Object} Paths and content for registry, strategy, and dashboard
 */
function reduceReviewState(specFolder, options = {}) {
  const write = options.write !== false;
  const resolvedSpecFolder = path.resolve(specFolder);
  const reviewDir = path.join(resolvedSpecFolder, 'review');
  const configPath = path.join(reviewDir, 'deep-review-config.json');
  const stateLogPath = path.join(reviewDir, 'deep-review-state.jsonl');
  const strategyPath = path.join(reviewDir, 'deep-review-strategy.md');
  const registryPath = path.join(reviewDir, 'deep-review-findings-registry.json');
  const dashboardPath = path.join(reviewDir, 'deep-review-dashboard.md');
  const iterationDir = path.join(reviewDir, 'iterations');

  const config = readJson(configPath);
  const records = parseJsonl(readUtf8(stateLogPath));
  const strategyContent = fs.existsSync(strategyPath) ? readUtf8(strategyPath) : '';
  const strategyDimensions = parseStrategyDimensions(strategyContent);
  const iterationFiles = fs.existsSync(iterationDir)
    ? fs.readdirSync(iterationDir)
        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
        .sort()
        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
    : [];

  const registry = buildRegistry(strategyDimensions, iterationFiles, records, config);
  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles);
  const dashboard = renderDashboard(config, registry, records, iterationFiles);

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
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const specFolder = process.argv[2];
  if (!specFolder) {
    process.stderr.write('Usage: node .opencode/skill/sk-deep-review/scripts/reduce-state.cjs <spec-folder>\n');
    process.exit(1);
  }

  const result = reduceReviewState(specFolder, { write: true });
  process.stdout.write(
    `${JSON.stringify(
      {
        registryPath: result.registryPath,
        dashboardPath: result.dashboardPath,
        strategyPath: result.strategyPath,
        openFindingsCount: result.registry.openFindingsCount,
        resolvedFindingsCount: result.registry.resolvedFindingsCount,
        convergenceScore: result.registry.convergenceScore,
      },
      null,
      2,
    )}\n`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  REQUIRED_DIMENSIONS,
  SEVERITY_KEYS,
  SEVERITY_WEIGHTS,
  parseIterationFile,
  parseJsonl,
  parseFindingLine,
  reduceReviewState,
};
