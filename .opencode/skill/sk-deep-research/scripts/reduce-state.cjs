// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Research State Reducer                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
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
  return value.replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PARSERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse JSONL content into an array of records, skipping malformed lines.
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
  // Drop the `m` flag so `$` anchors to end-of-string, not end-of-line
  const pattern = new RegExp(`(?:^|\\n)##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'i');
  const match = markdown.match(pattern);
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

function parseReflectionValue(sectionText, label) {
  const match = sectionText.match(new RegExp(`-\\s+${escapeRegExp(label)}\\s*:\\s*(.+)`, 'i'));
  return match ? normalizeText(match[1]) : null;
}

/**
 * Parse a single iteration markdown file into a structured record.
 *
 * @param {string} iterationPath - Absolute path to an iteration-NNN.md file
 * @returns {Object} Parsed iteration with focus, findings, sources, and reflection fields
 */
function parseIterationFile(iterationPath) {
  const markdown = readUtf8(iterationPath);
  const runMatch = iterationPath.match(/iteration-(\d+)\.md$/);
  const headingMatch = markdown.match(/^#\s+Iteration\s+\d+:\s+(.+)$/m);
  const focusSection = extractSection(markdown, 'Focus');
  const findingsSection = extractSection(markdown, 'Findings');
  const ruledOutSection = extractSection(markdown, 'Ruled Out');
  const deadEndsSection = extractSection(markdown, 'Dead Ends');
  const sourcesSection = extractSection(markdown, 'Sources Consulted');
  const reflectionSection = extractSection(markdown, 'Reflection');
  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');

  return {
    path: iterationPath,
    run: runMatch ? Number(runMatch[1]) : 0,
    focus: normalizeText(focusSection || (headingMatch ? headingMatch[1] : 'Unknown focus')),
    findings: extractListItems(findingsSection),
    ruledOut: extractListItems(ruledOutSection),
    deadEnds: extractListItems(deadEndsSection),
    sources: extractListItems(sourcesSection),
    reflectionWorked: parseReflectionValue(reflectionSection, 'What worked and why'),
    reflectionFailed: parseReflectionValue(reflectionSection, 'What did not work and why'),
    reflectionDifferent: parseReflectionValue(reflectionSection, 'What I would do differently'),
    nextFocus: normalizeText(nextFocusSection),
  };
}

function parseStrategyQuestions(strategyContent) {
  const section = extractSection(strategyContent, '3. KEY QUESTIONS (remaining)');
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^- \[[ xX]\]\s+/.test(line))
    .map((line) => {
      const checked = /^- \[[xX]\]\s+/.test(line);
      const text = normalizeText(line.replace(/^- \[[ xX]\]\s+/, ''));
      return {
        checked,
        text,
      };
    });
}

function buildCoverageBySources(iterationFiles, iterationRecords) {
  const counter = {};
  const seen = new Set();

  for (const source of iterationFiles.flatMap((iteration) => iteration.sources).concat(
    iterationRecords.flatMap((record) => (Array.isArray(record.sourcesQueried) ? record.sourcesQueried : [])),
  )) {
    const normalized = normalizeText(source);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    let key = 'other';
    if (/^https?:\/\//i.test(normalized)) {
      try {
        key = new URL(normalized).hostname;
      } catch (_error) {
        key = 'web';
      }
    } else if (normalized.startsWith('memory:')) {
      key = 'memory';
    } else if (normalized.includes(':')) {
      key = 'code';
    }

    counter[key] = (counter[key] || 0) + 1;
  }

  return Object.fromEntries(Object.entries(counter).sort(([left], [right]) => left.localeCompare(right)));
}

function uniqueById(items) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }
    seen.add(item.id);
    result.push(item);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function buildRegistry(strategyQuestions, iterationFiles, iterationRecords) {
  const answeredSet = new Set(
    iterationRecords.flatMap((record) => (Array.isArray(record.answeredQuestions) ? record.answeredQuestions : [])).map(normalizeText),
  );

  const keyedQuestions = strategyQuestions.map((question, index) => {
    const normalized = normalizeText(question.text);
    const resolved = question.checked || answeredSet.has(normalized);
    return {
      id: `question-${index + 1}-${slugify(normalized)}`,
      text: normalized,
      addedAtIteration: 0,
      resolvedAtIteration: resolved
        ? iterationRecords.find((record) =>
            Array.isArray(record.answeredQuestions)
              && record.answeredQuestions.map(normalizeText).includes(normalized),
          )?.run ?? 0
        : null,
      resolved,
    };
  });

  const keyFindings = uniqueById(
    iterationFiles
      .flatMap((iteration) =>
        iteration.findings.map((finding, index) => ({
          id: `finding-${iteration.run}-${index + 1}-${slugify(finding)}`,
          text: finding,
          addedAtIteration: iteration.run,
          sources: iteration.sources,
        })),
      )
      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
  );

  const ruledOutDirections = uniqueById(
    iterationFiles
      .flatMap((iteration) =>
        iteration.deadEnds.concat(iteration.ruledOut).map((entry, index) => ({
          id: `ruled-out-${iteration.run}-${index + 1}-${slugify(entry)}`,
          text: entry,
          addedAtIteration: iteration.run,
        })),
      )
      .sort((left, right) => left.addedAtIteration - right.addedAtIteration || left.text.localeCompare(right.text)),
  );

  const coverageBySources = buildCoverageBySources(iterationFiles, iterationRecords);
  const latestIteration = iterationRecords.filter((record) => record.type === 'iteration').at(-1);
  const convergenceScore =
    latestIteration?.convergenceSignals?.compositeStop
    ?? latestIteration?.newInfoRatio
    ?? 0;

  return {
    openQuestions: keyedQuestions.filter((question) => !question.resolved).map((question) => ({
      id: question.id,
      text: question.text,
      addedAtIteration: question.addedAtIteration,
      resolvedAtIteration: null,
    })),
    resolvedQuestions: keyedQuestions.filter((question) => question.resolved).map((question) => ({
      id: question.id,
      text: question.text,
      addedAtIteration: question.addedAtIteration,
      resolvedAtIteration: question.resolvedAtIteration,
    })),
    keyFindings,
    ruledOutDirections,
    metrics: {
      iterationsCompleted: iterationRecords.filter((record) => record.type === 'iteration').length,
      openQuestions: keyedQuestions.filter((question) => !question.resolved).length,
      resolvedQuestions: keyedQuestions.filter((question) => question.resolved).length,
      keyFindings: keyFindings.length,
      convergenceScore,
      coverageBySources,
    },
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
      const key = entry;
      const bucket = grouped.get(key) || [];
      bucket.push(iteration.run);
      grouped.set(key, bucket);
    }
  }

  if (!grouped.size) {
    return '[No exhausted approach categories yet]';
  }

  const blocked = Array.from(grouped.entries())
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
    });

  return blocked.join('\n\n');
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
    throw new Error(`Missing anchor section ${anchorId} in strategy file`);
  }

  return content.replace(pattern, replacement);
}

function updateStrategyContent(strategyContent, registry, iterationFiles) {
  const answeredTexts = registry.resolvedQuestions.map((question) => question.text);
  const questionEntries = parseStrategyQuestions(strategyContent);
  const answeredSet = new Set(answeredTexts.map(normalizeText));
  const rewrittenQuestionLines = questionEntries.map((question) => {
    const checked = answeredSet.has(normalizeText(question.text));
    return `- [${checked ? 'x' : ' '}] ${question.text}`;
  });

  const whatWorked = iterationFiles
    .filter((iteration) => iteration.reflectionWorked)
    .map((iteration) => `${iteration.reflectionWorked} (iteration ${iteration.run})`);
  const whatFailed = iterationFiles
    .filter((iteration) => iteration.reflectionFailed)
    .map((iteration) => `${iteration.reflectionFailed} (iteration ${iteration.run})`);
  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
    || registry.openQuestions[0]?.text
    || '[All tracked questions are resolved]';

  let updated = strategyContent;
  updated = replaceAnchorSection(updated, 'key-questions', '3. KEY QUESTIONS (remaining)', rewrittenQuestionLines.join('\n'));
  updated = replaceAnchorSection(updated, 'answered-questions', '6. ANSWERED QUESTIONS', blockFromBulletList(answeredTexts));
  updated = replaceAnchorSection(updated, 'what-worked', '7. WHAT WORKED', blockFromBulletList(whatWorked));
  updated = replaceAnchorSection(updated, 'what-failed', '8. WHAT FAILED', blockFromBulletList(whatFailed));
  updated = replaceAnchorSection(updated, 'exhausted-approaches', '9. EXHAUSTED APPROACHES (do not retry)', buildExhaustedApproaches(iterationFiles));
  updated = replaceAnchorSection(
    updated,
    'ruled-out-directions',
    '10. RULED OUT DIRECTIONS',
    blockFromBulletList(registry.ruledOutDirections.map((entry) => `${entry.text} (iteration ${entry.addedAtIteration})`)),
  );
  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
  return updated;
}

function renderDashboard(config, registry, iterationRecords, iterationFiles) {
  const latestIteration = iterationRecords.at(-1);
  const ratios = iterationRecords
    .map((record) => (typeof record.newInfoRatio === 'number' ? record.newInfoRatio : null))
    .filter((value) => value !== null);
  const lastThreeRatios = ratios.slice(-3).map((value) => value.toFixed(2)).join(' -> ') || 'N/A';
  const nextFocus = iterationFiles.map((iteration) => iteration.nextFocus).filter(Boolean).at(-1)
    || registry.openQuestions[0]?.text
    || '[All tracked questions are resolved]';
  const progressRows = iterationRecords
    .map((record) => {
      const track = record.focusTrack || '-';
      const ratio = typeof record.newInfoRatio === 'number' ? record.newInfoRatio.toFixed(2) : '0.00';
      return `| ${record.run} | ${record.focus || 'unknown'} | ${track} | ${ratio} | ${record.findingsCount || 0} | ${record.status || 'complete'} |`;
    })
    .join('\n') || '| 0 | none yet | - | 0.00 | 0 | initialized |';

  return [
    '---',
    'title: Deep Research Dashboard',
    'description: Auto-generated reducer view over the research packet.',
    '---',
    '',
    '# Deep Research Dashboard - Session Overview',
    '',
    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
    '',
    '<!-- ANCHOR:overview -->',
    '## 1. OVERVIEW',
    '',
    'Reducer-generated observability surface for the active research packet.',
    '',
    '<!-- /ANCHOR:overview -->',
    '<!-- ANCHOR:status -->',
    '## 2. STATUS',
    `- Topic: ${config.topic || '[Unknown topic]'}`,
    `- Started: ${config.createdAt || '[Unknown start]'}`,
    `- Status: ${String(config.status || 'initialized').toUpperCase()}`,
    `- Iteration: ${registry.metrics.iterationsCompleted} of ${config.maxIterations || 0}`,
    `- Session ID: ${config.lineage?.sessionId || '[Unknown session]'}`,
    `- Parent Session: ${config.lineage?.parentSessionId || 'none'}`,
    `- Lifecycle Mode: ${config.lineage?.lineageMode || 'new'}`,
    `- Generation: ${config.lineage?.generation ?? 1}`,
    '',
    '<!-- /ANCHOR:status -->',
    '<!-- ANCHOR:progress -->',
    '## 3. PROGRESS',
    '',
    '| # | Focus | Track | Ratio | Findings | Status |',
    '|---|-------|-------|-------|----------|--------|',
    progressRows,
    '',
    `- iterationsCompleted: ${registry.metrics.iterationsCompleted}`,
    `- keyFindings: ${registry.metrics.keyFindings}`,
    `- openQuestions: ${registry.metrics.openQuestions}`,
    `- resolvedQuestions: ${registry.metrics.resolvedQuestions}`,
    '',
    '<!-- /ANCHOR:progress -->',
    '<!-- ANCHOR:questions -->',
    '## 4. QUESTIONS',
    `- Answered: ${registry.metrics.resolvedQuestions}/${registry.metrics.resolvedQuestions + registry.metrics.openQuestions}`,
    ...registry.resolvedQuestions.map((question) => `- [x] ${question.text}`),
    ...registry.openQuestions.map((question) => `- [ ] ${question.text}`),
    '',
    '<!-- /ANCHOR:questions -->',
    '<!-- ANCHOR:trend -->',
    '## 5. TREND',
    `- Last 3 ratios: ${lastThreeRatios}`,
    `- Stuck count: ${iterationRecords.filter((r) => r.status === 'stuck').length}`,
    '- Guard violations: none recorded by the reducer pass',
    `- convergenceScore: ${Number(registry.metrics.convergenceScore || 0).toFixed(2)}`,
    `- coverageBySources: ${JSON.stringify(registry.metrics.coverageBySources)}`,
    '',
    '<!-- /ANCHOR:trend -->',
    '<!-- ANCHOR:dead-ends -->',
    '## 6. DEAD ENDS',
    ...registry.ruledOutDirections.length
      ? registry.ruledOutDirections.map((entry) => `- ${entry.text} (iteration ${entry.addedAtIteration})`)
      : ['- None yet'],
    '',
    '<!-- /ANCHOR:dead-ends -->',
    '<!-- ANCHOR:next-focus -->',
    '## 7. NEXT FOCUS',
    nextFocus,
    '',
    '<!-- /ANCHOR:next-focus -->',
    '<!-- ANCHOR:active-risks -->',
    '## 8. ACTIVE RISKS',
    ...(latestIteration?.status === 'error'
      ? ['- Latest iteration reported error status.']
      : ['- None active beyond normal research uncertainty.']),
    '',
    '<!-- /ANCHOR:active-risks -->',
    '',
  ].join('\n');
}

/**
 * Reduce JSONL state, iteration files, and strategy into synchronized registry,
 * strategy, and dashboard outputs. Idempotent: repeated calls produce identical results.
 *
 * @param {string} specFolder - Path to the spec folder containing a research/ directory
 * @param {Object} [options] - Reducer options
 * @param {boolean} [options.write=true] - Write outputs to disk when true
 * @returns {Object} Paths and content for registry, strategy, and dashboard
 */
function reduceResearchState(specFolder, options = {}) {
  const write = options.write !== false;
  const resolvedSpecFolder = path.resolve(specFolder);
  const researchDir = path.join(resolvedSpecFolder, 'research');
  const configPath = path.join(researchDir, 'deep-research-config.json');
  const stateLogPath = path.join(researchDir, 'deep-research-state.jsonl');
  const strategyPath = path.join(researchDir, 'deep-research-strategy.md');
  const registryPath = path.join(researchDir, 'findings-registry.json');
  const dashboardPath = path.join(researchDir, 'deep-research-dashboard.md');
  const iterationDir = path.join(researchDir, 'iterations');

  const config = readJson(configPath);
  const records = parseJsonl(readUtf8(stateLogPath)).filter((record) => record.type === 'iteration');
  const strategyContent = readUtf8(strategyPath);
  const strategyQuestions = parseStrategyQuestions(strategyContent);
  const iterationFiles = fs.existsSync(iterationDir)
    ? fs.readdirSync(iterationDir)
        .filter((fileName) => /^iteration-\d+\.md$/.test(fileName))
        .sort()
        .map((fileName) => parseIterationFile(path.join(iterationDir, fileName)))
    : [];

  const registry = buildRegistry(strategyQuestions, iterationFiles, records);
  const strategy = updateStrategyContent(strategyContent, registry, iterationFiles);
  const dashboard = renderDashboard(config, registry, records, iterationFiles);

  if (write) {
    writeUtf8(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
    writeUtf8(strategyPath, strategy.endsWith('\n') ? strategy : `${strategy}\n`);
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
// 5. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const specFolder = process.argv[2];
  if (!specFolder) {
    process.stderr.write('Usage: node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>\n');
    process.exit(1);
  }

  const result = reduceResearchState(specFolder, { write: true });
  process.stdout.write(
    `${JSON.stringify(
      {
        registryPath: result.registryPath,
        dashboardPath: result.dashboardPath,
        strategyPath: result.strategyPath,
        iterationsCompleted: result.registry.metrics.iterationsCompleted,
      },
      null,
      2,
    )}\n`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  parseIterationFile,
  parseJsonl,
  reduceResearchState,
};
