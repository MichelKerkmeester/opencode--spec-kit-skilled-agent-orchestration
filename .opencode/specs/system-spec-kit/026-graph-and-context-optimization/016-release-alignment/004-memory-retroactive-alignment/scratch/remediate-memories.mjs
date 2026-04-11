#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const REQUIRED_FIELDS = [
  'title',
  'description',
  'trigger_phrases',
  'importance_tier',
  'contextType',
  'quality_score',
  'quality_flags',
];

const TARGET_TRIGGER_PHRASE_COUNT = 15;
const FRONTMATTER_SCORE_PATTERN = /(?:\b\d+\/100\b|(?<!\S)\/100\b)/g;
const NUMERIC_SCORE_PATTERN = /\b(\d{1,3})\/100\b/g;
const UNAVAILABLE_SCORE_PATTERN = /\[(?:N\/A|TBD|UNKNOWN)\]\/100\b/gi;
const BARE_SCORE_PATTERN = /(^|[\s|:(>])\/100\b/gm;
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'into',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'that',
  'the',
  'their',
  'this',
  'to',
  'up',
  'via',
  'was',
  'were',
  'with',
]);

function findRepoRoot(startDir) {
  let currentDir = startDir;

  while (true) {
    const hasOpencode = fs.existsSync(path.join(currentDir, '.opencode'));
    const hasAgents = fs.existsSync(path.join(currentDir, 'AGENTS.md'));

    if (hasOpencode && hasAgents) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);

    if (parentDir === currentDir) {
      throw new Error(`Unable to locate repo root from ${startDir}`);
    }

    currentDir = parentDir;
  }
}

const repoRoot = findRepoRoot(__dirname);
const auditReportPath = path.join(__dirname, 'audit-report.md');
const jsYamlPath = path.join(
  repoRoot,
  '.opencode/skill/system-spec-kit/scripts/node_modules/js-yaml'
);
const { load: loadYaml, dump: dumpYaml } = require(jsYamlPath);

function getMemoryFiles() {
  const stdout = execFileSync(
    'find',
    ['.opencode/specs', '-path', '*/memory/*.md', '-type', 'f'],
    {
      cwd: repoRoot,
      encoding: 'utf8',
    }
  );

  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

function shouldExcludeMemoryPath(filePath) {
  const baseName = path.basename(filePath);

  if (baseName === 'SKILL.md' || baseName === 'README.md') {
    return true;
  }

  if (filePath.includes('/skills/memory/')) {
    return true;
  }

  return false;
}

function extractFrontmatter(content) {
  const normalizedContent = content.startsWith('\uFEFF') ? content.slice(1) : content;
  const match = normalizedContent.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/);

  if (!match) {
    return {
      hasFrontmatter: false,
      frontmatterText: '',
      bodyText: content,
    };
  }

  const bom = content.startsWith('\uFEFF') ? '\uFEFF' : '';
  const rawBlockLength = match[0].length + bom.length;

  return {
    hasFrontmatter: true,
    frontmatterText: match[1],
    bodyText: content.slice(rawBlockLength),
  };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseFrontmatter(frontmatterText) {
  if (!frontmatterText.trim()) {
    return { data: {}, parseError: null };
  }

  try {
    const parsed = loadYaml(frontmatterText);

    if (!isPlainObject(parsed)) {
      return {
        data: {},
        parseError: 'Frontmatter did not parse to a YAML mapping',
      };
    }

    return { data: parsed, parseError: null };
  } catch (error) {
    return {
      data: {},
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
}

function asTrimmedString(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function coerceNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.trim());

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function sanitizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
    .filter(Boolean);
}

function humanizeFilename(filePath) {
  const baseName = path.basename(filePath, '.md');
  const withoutTimestamp = baseName.replace(/^\d{2}-\d{2}-\d{2}_\d{2}-\d{2}__/, '');
  const normalized = withoutTimestamp
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return 'Untitled Memory';
  }

  return normalized
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[|*_>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveTitle(bodyText, filePath) {
  const headingMatch = bodyText.match(/^#\s+(.+)$/m);

  if (headingMatch) {
    return headingMatch[1].trim();
  }

  return humanizeFilename(filePath);
}

function deriveDescription(bodyText, fallbackTitle) {
  const cleanBody = stripMarkdown(bodyText);

  if (!cleanBody) {
    return fallbackTitle.slice(0, 100);
  }

  return cleanBody.slice(0, 100).trim();
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function extractHeadingText(bodyText) {
  return bodyText
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, '').trim())
    .filter(Boolean);
}

function extractPathPhrases(filePath) {
  return filePath
    .split('/')
    .map((segment) =>
      segment
        .replace(/^z_archive$/i, 'archive')
        .replace(/^\d{3,}-/, '')
        .replace(/^\d{2}-\d{2}-\d{2}_\d{2}-\d{2}__/, '')
        .replace(/[_-]+/g, ' ')
        .trim()
    )
    .filter((segment) => segment && !['.opencode', 'specs', 'memory', 'quarantine'].includes(segment));
}

function buildPhraseCandidates(title, description, filePath, bodyText) {
  const candidates = [];
  const sources = [
    title,
    description,
    humanizeFilename(filePath),
    ...extractHeadingText(bodyText),
    ...extractPathPhrases(filePath),
  ];

  for (const source of sources) {
    const normalized = stripMarkdown(source).toLowerCase();

    if (normalized && normalized.split(/\s+/).length <= 8) {
      candidates.push(normalized);
    }

    const tokens = tokenize(source);

    for (let size = 3; size >= 1; size -= 1) {
      for (let index = 0; index <= tokens.length - size; index += 1) {
        const phrase = tokens.slice(index, index + size).join(' ');

        if (phrase.length >= 3 && phrase.length <= 60) {
          candidates.push(phrase);
        }
      }
    }
  }

  return candidates;
}

function normalizeTriggerPhrases(existingPhrases, title, description, filePath, bodyText) {
  const phrases = [];
  const seen = new Set();

  for (const phrase of existingPhrases) {
    const normalized = stripMarkdown(phrase).toLowerCase();

    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      phrases.push(normalized);
    }
  }

  if (phrases.length >= TARGET_TRIGGER_PHRASE_COUNT) {
    return phrases;
  }

  for (const candidate of buildPhraseCandidates(title, description, filePath, bodyText)) {
    const normalized = candidate.trim().toLowerCase();

    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    phrases.push(normalized);

    if (phrases.length >= TARGET_TRIGGER_PHRASE_COUNT) {
      break;
    }
  }

  return phrases;
}

function replaceBodyScorePlaceholders(bodyText) {
  return bodyText
    .replace(
      /\[RETROACTIVE: original (?:\/100|\[RETROACTIVE: score unavailable\] scale)\]/g,
      '[RETROACTIVE: original 100-point scale]'
    )
    .replace(UNAVAILABLE_SCORE_PATTERN, '[RETROACTIVE: score unavailable]')
    .replace(
      NUMERIC_SCORE_PATTERN,
      (_, scoreValue) => `${scoreValue} [RETROACTIVE: original 100-point scale]`
    )
    .replace(BARE_SCORE_PATTERN, (_, prefix) => `${prefix}[RETROACTIVE: score unavailable]`);
}

function replaceScorePlaceholders(value) {
  if (typeof value === 'string') {
    return value.replace(FRONTMATTER_SCORE_PATTERN, '[RETROACTIVE: estimated]');
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceScorePlaceholders(item));
  }

  if (isPlainObject(value)) {
    const output = {};

    for (const [key, childValue] of Object.entries(value)) {
      output[key] = replaceScorePlaceholders(childValue);
    }

    return output;
  }

  return value;
}

function getMissingFields(data) {
  const missing = [];

  if (!asTrimmedString(data.title)) {
    missing.push('title');
  }

  if (!asTrimmedString(data.description)) {
    missing.push('description');
  }

  if (!Array.isArray(data.trigger_phrases)) {
    missing.push('trigger_phrases');
  }

  if (!asTrimmedString(data.importance_tier)) {
    missing.push('importance_tier');
  }

  if (!asTrimmedString(data.contextType)) {
    missing.push('contextType');
  }

  if (coerceNumber(data.quality_score) === null) {
    missing.push('quality_score');
  }

  if (!Array.isArray(data.quality_flags)) {
    missing.push('quality_flags');
  }

  return missing;
}

function classifyTier({ hasFrontmatter, parseError, missingFields, qualityScore, inArchive }) {
  if (!hasFrontmatter || parseError || inArchive || (qualityScore !== null && qualityScore < 0.5)) {
    return 'C';
  }

  if (missingFields.length <= 2 && (qualityScore === null || qualityScore >= 0.8)) {
    return 'A';
  }

  if (
    (missingFields.length >= 3 && missingFields.length <= 5) ||
    (qualityScore !== null && qualityScore >= 0.5 && qualityScore <= 0.79) ||
    missingFields.length > 0
  ) {
    return 'B';
  }

  return 'A';
}

function auditFile(filePath) {
  const absolutePath = path.join(repoRoot, filePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const { hasFrontmatter, frontmatterText, bodyText } = extractFrontmatter(content);
  const { data, parseError } = parseFrontmatter(frontmatterText);
  const qualityScore = coerceNumber(data.quality_score);
  const missingFields = getMissingFields(data);
  const inArchive = filePath.includes('z_archive');
  const frontmatterHasScorePattern = FRONTMATTER_SCORE_PATTERN.test(frontmatterText);
  FRONTMATTER_SCORE_PATTERN.lastIndex = 0;
  const fileHasScorePattern = FRONTMATTER_SCORE_PATTERN.test(content);
  FRONTMATTER_SCORE_PATTERN.lastIndex = 0;
  const triggerPhraseCount = sanitizeArray(data.trigger_phrases).length;

  return {
    filePath,
    absolutePath,
    content,
    hasFrontmatter,
    frontmatterText,
    bodyText,
    data,
    parseError,
    missingFields,
    qualityScore,
    inArchive,
    triggerPhraseCount,
    frontmatterHasScorePattern,
    fileHasScorePattern,
    tier: classifyTier({
      hasFrontmatter,
      parseError,
      missingFields,
      qualityScore,
      inArchive,
    }),
  };
}

function defaultQualityScore(tier) {
  if (tier === 'A') {
    return 0.7;
  }

  if (tier === 'B') {
    return 0.5;
  }

  return 0.3;
}

function buildNormalizedFrontmatter(audit) {
  const source = isPlainObject(audit.data) ? { ...audit.data } : {};
  const changes = [];
  const originalTriggerPhrases = sanitizeArray(source.trigger_phrases);
  const originalQualityFlags = sanitizeArray(source.quality_flags);
  const originalQualityScore = coerceNumber(source.quality_score);

  const title = asTrimmedString(source.title) || deriveTitle(audit.bodyText, audit.filePath);

  if (!asTrimmedString(source.title)) {
    changes.push(`added title: ${title}`);
  }

  const description =
    asTrimmedString(source.description) || deriveDescription(audit.bodyText, title);

  if (!asTrimmedString(source.description)) {
    changes.push('added description from body preview');
  }

  const triggerPhrases = normalizeTriggerPhrases(
    originalTriggerPhrases,
    title,
    description,
    audit.filePath,
    audit.bodyText
  );

  if (!Array.isArray(source.trigger_phrases)) {
    changes.push('added trigger_phrases array');
  }

  if (triggerPhrases.length > originalTriggerPhrases.length) {
    changes.push(
      `expanded trigger_phrases from ${originalTriggerPhrases.length} to ${triggerPhrases.length}`
    );
  }

  const importanceTier = audit.inArchive
    ? 'deprecated'
    : asTrimmedString(source.importance_tier) || 'normal';

  if (audit.inArchive && source.importance_tier !== 'deprecated') {
    changes.push('set importance_tier to deprecated for z_archive path');
  } else if (!asTrimmedString(source.importance_tier)) {
    changes.push(`added importance_tier: ${importanceTier}`);
  }

  const contextType = asTrimmedString(source.contextType) || 'general';

  if (!asTrimmedString(source.contextType)) {
    changes.push('added contextType: general');
  }

  const qualityScore =
    originalQualityScore === null ? defaultQualityScore(audit.tier) : originalQualityScore;

  if (originalQualityScore === null) {
    changes.push(`added quality_score: ${qualityScore.toFixed(2)}`);
  }

  const qualityFlags = [...originalQualityFlags];
  const qualityFlagSet = new Set(qualityFlags);

  if (!Array.isArray(source.quality_flags)) {
    changes.push('added quality_flags array');
  }

  if (audit.inArchive && !qualityFlagSet.has('deprecated_retroactive')) {
    qualityFlagSet.add('deprecated_retroactive');
    qualityFlags.push('deprecated_retroactive');
    changes.push('added quality_flags entry: deprecated_retroactive');
  }

  if (!qualityFlagSet.has('retroactive_reviewed')) {
    qualityFlagSet.add('retroactive_reviewed');
    qualityFlags.push('retroactive_reviewed');
    changes.push('added quality_flags entry: retroactive_reviewed');
  }

  if (originalQualityScore !== null && originalQualityScore < 0.7 && !qualityFlagSet.has('needs_review')) {
    qualityFlagSet.add('needs_review');
    qualityFlags.push('needs_review');
    changes.push('added quality_flags entry: needs_review');
  }

  const normalized = {};

  normalized.title = title;
  normalized.description = description;
  normalized.trigger_phrases = triggerPhrases;
  normalized.importance_tier = importanceTier;
  normalized.contextType = contextType;
  normalized.quality_score = qualityScore;
  normalized.quality_flags = qualityFlags;

  for (const [key, value] of Object.entries(source)) {
    if (!REQUIRED_FIELDS.includes(key)) {
      normalized[key] = value;
    }
  }

  const replaced = replaceScorePlaceholders(normalized);
  const beforeDump = JSON.stringify(normalized);
  const afterDump = JSON.stringify(replaced);

  if (beforeDump !== afterDump) {
    changes.push('replaced /100 placeholders in frontmatter values');
  }

  return { data: replaced, changes };
}

function renderFrontmatter(data) {
  return dumpYaml(data, {
    lineWidth: 1000,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
  }).trimEnd();
}

function buildPatchedContent(audit) {
  const { data, changes } = buildNormalizedFrontmatter(audit);
  const frontmatter = renderFrontmatter(data);
  const nextBodyText = replaceBodyScorePlaceholders(audit.bodyText);

  if (nextBodyText !== audit.bodyText) {
    changes.push('replaced /100 score markers in body content');
  }

  const nextContent = `---\n${frontmatter}\n---\n${nextBodyText}`;

  return { nextContent, changes };
}

function writeAuditReport(rawFiles, excludedFiles, auditRows, remediationResults, validationSummary) {
  const tierCounts = { A: 0, B: 0, C: 0 };

  for (const row of auditRows) {
    tierCounts[row.tier] += 1;
  }

  const reportLines = [
    '# Audit Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Audit Scan Summary',
    '',
    `- Raw \`find\` matches: ${rawFiles.length}`,
    `- Excluded false positives: ${excludedFiles.length}`,
    `- Actionable memory files audited: ${auditRows.length}`,
    `- Files with frontmatter: ${auditRows.filter((row) => row.hasFrontmatter).length}`,
    `- Files without frontmatter: ${auditRows.filter((row) => !row.hasFrontmatter).length}`,
    `- Files in z_archive paths: ${auditRows.filter((row) => row.inArchive).length}`,
    `- Files with /100 in frontmatter in scanned set: ${auditRows.filter((row) => row.frontmatterHasScorePattern).length}`,
    `- Files with /100 anywhere in scanned set: ${auditRows.filter((row) => row.fileHasScorePattern).length}`,
    `- Tier A count: ${tierCounts.A}`,
    `- Tier B count: ${tierCounts.B}`,
    `- Tier C count: ${tierCounts.C}`,
    '',
    '## Required Fields',
    '',
    '- `title`',
    '- `description`',
    '- `trigger_phrases`',
    '- `importance_tier`',
    '- `contextType`',
    '- `quality_score`',
    '- `quality_flags`',
    '',
    '## Per-File Audit',
    '',
    '| File | Tier | Missing Fields | quality_score | trigger_phrases | z_archive | /100 in file | Parse Error |',
    '| --- | --- | --- | ---: | ---: | --- | --- | --- |',
  ];

  for (const row of auditRows) {
    reportLines.push(
      `| \`${row.filePath}\` | ${row.tier} | ${row.missingFields.length ? row.missingFields.join(', ') : 'none'} | ${
        row.qualityScore === null ? 'missing' : row.qualityScore.toFixed(2)
      } | ${row.triggerPhraseCount} | ${row.inArchive ? 'yes' : 'no'} | ${
        row.fileHasScorePattern ? 'yes' : 'no'
      } | ${row.parseError ? row.parseError.replace(/\|/g, '\\|') : 'none'} |`
    );
  }

  reportLines.push(
    '',
    '## Phase 2 Remediation Summary',
    '',
    `- Files changed: ${remediationResults.changedCount}`,
     `- Files unchanged: ${remediationResults.unchangedCount}`,
     `- Files with /100 body markers remediated: ${remediationResults.bodyUpdatedCount}`,
     '',
     '## Phase 3 Validation Summary',
     '',
     `- Files missing required fields after remediation: ${validationSummary.invalidFiles.length}`,
     `- Files with /100 in frontmatter after remediation: ${validationSummary.frontmatterScorePatternCount}`,
     `- Files with /100 anywhere after remediation: ${validationSummary.fileScorePatternCount}`,
     `- Files carrying retroactive_reviewed flag: ${validationSummary.retroactiveReviewedCount}`,
     `- Files still below ${TARGET_TRIGGER_PHRASE_COUNT} trigger phrases: ${validationSummary.belowTargetTriggerPhraseCount}`,
     `- Average trigger_phrases count: ${validationSummary.averageTriggerPhraseCount.toFixed(2)}`,
     `- Average quality_score across non-deprecated files: ${validationSummary.averageQualityScore.toFixed(2)}`,
     '',
     '## Notes',
     '',
     '- Writable surfaces were limited to frontmatter plus in-place /100 scale normalization inside existing body content.',
     '- The script does not invent new anchored sections; it only normalizes metadata, trigger phrases, flags, and inline /100 markers.',
     '- False positives from the raw `find` glob (for example skill docs under `skills/memory/`) were excluded from remediation.',
     ''
  );

  if (excludedFiles.length > 0) {
    reportLines.push('## Excluded False Positives', '');

    for (const filePath of excludedFiles) {
      reportLines.push(`- \`${filePath}\``);
    }

    reportLines.push('');
  }

  fs.writeFileSync(auditReportPath, `${reportLines.join('\n')}\n`, 'utf8');
}

function validateFiles(filePaths) {
  const invalidFiles = [];
  let frontmatterScorePatternCount = 0;
  let fileScorePatternCount = 0;
  let nonDeprecatedScoreTotal = 0;
  let nonDeprecatedScoreCount = 0;
  let retroactiveReviewedCount = 0;
  let belowTargetTriggerPhraseCount = 0;
  let triggerPhraseTotal = 0;

  for (const filePath of filePaths) {
    const absolutePath = path.join(repoRoot, filePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    const { frontmatterText } = extractFrontmatter(content);
    const { data } = parseFrontmatter(frontmatterText);
    const missingFields = getMissingFields(data);

    if (missingFields.length > 0) {
      invalidFiles.push({ filePath, missingFields });
    }

    if (FRONTMATTER_SCORE_PATTERN.test(frontmatterText)) {
      frontmatterScorePatternCount += 1;
    }

    FRONTMATTER_SCORE_PATTERN.lastIndex = 0;

    if (FRONTMATTER_SCORE_PATTERN.test(content)) {
      fileScorePatternCount += 1;
    }

    FRONTMATTER_SCORE_PATTERN.lastIndex = 0;

    const importanceTier = asTrimmedString(data.importance_tier);
    const qualityScore = coerceNumber(data.quality_score);
    const triggerPhraseCount = sanitizeArray(data.trigger_phrases).length;
    const qualityFlags = sanitizeArray(data.quality_flags);

    triggerPhraseTotal += triggerPhraseCount;

    if (triggerPhraseCount < TARGET_TRIGGER_PHRASE_COUNT) {
      belowTargetTriggerPhraseCount += 1;
    }

    if (qualityFlags.includes('retroactive_reviewed')) {
      retroactiveReviewedCount += 1;
    }

    if (importanceTier !== 'deprecated' && qualityScore !== null) {
      nonDeprecatedScoreTotal += qualityScore;
      nonDeprecatedScoreCount += 1;
    }
  }

  return {
    invalidFiles,
    frontmatterScorePatternCount,
    fileScorePatternCount,
    retroactiveReviewedCount,
    belowTargetTriggerPhraseCount,
    averageTriggerPhraseCount: filePaths.length > 0 ? triggerPhraseTotal / filePaths.length : 0,
    averageQualityScore:
      nonDeprecatedScoreCount > 0 ? nonDeprecatedScoreTotal / nonDeprecatedScoreCount : 0,
  };
}

function main() {
  const rawMemoryFiles = getMemoryFiles();
  const excludedFiles = rawMemoryFiles.filter((filePath) => shouldExcludeMemoryPath(filePath));
  const memoryFiles = rawMemoryFiles.filter((filePath) => !shouldExcludeMemoryPath(filePath));
  const auditRows = memoryFiles.map((filePath) => auditFile(filePath));
  let changedCount = 0;
  let unchangedCount = 0;
  let bodyUpdatedCount = 0;

  console.log(`AUDIT: raw find matched ${rawMemoryFiles.length} files`);
  console.log(`AUDIT: excluded ${excludedFiles.length} false positives`);
  console.log(`AUDIT: actionable memory files ${memoryFiles.length}`);

  for (const audit of auditRows) {
    const { nextContent, changes } = buildPatchedContent(audit);

    if (nextContent === audit.content) {
      unchangedCount += 1;
      console.log(`UNCHANGED ${audit.filePath}`);
      continue;
    }

    const patchedBodyText = extractFrontmatter(nextContent).bodyText;

    if (
      patchedBodyText !== audit.bodyText &&
      FRONTMATTER_SCORE_PATTERN.test(patchedBodyText)
    ) {
      FRONTMATTER_SCORE_PATTERN.lastIndex = 0;
      throw new Error(`Body content still contains /100 markers for ${audit.filePath}`);
    }

    FRONTMATTER_SCORE_PATTERN.lastIndex = 0;

    fs.writeFileSync(audit.absolutePath, nextContent, 'utf8');

    changedCount += 1;

    if (patchedBodyText !== audit.bodyText) {
      bodyUpdatedCount += 1;
    }

    console.log(`PATCHED ${audit.filePath}`);

    for (const change of changes) {
      console.log(`  - ${change}`);
    }
  }

  const validationSummary = validateFiles(memoryFiles);

  writeAuditReport(
    rawMemoryFiles,
    excludedFiles,
    auditRows,
      {
        changedCount,
        unchangedCount,
        bodyUpdatedCount,
      },
      validationSummary
    );

  console.log('');
  console.log('VALIDATION SUMMARY');
  console.log(`- required fields missing after remediation: ${validationSummary.invalidFiles.length}`);
  console.log(
    `- files with /100 in frontmatter after remediation: ${validationSummary.frontmatterScorePatternCount}`
  );
  console.log(
    `- files with /100 anywhere after remediation: ${validationSummary.fileScorePatternCount}`
  );
  console.log(
    `- files carrying retroactive_reviewed flag: ${validationSummary.retroactiveReviewedCount}`
  );
  console.log(
    `- files still below ${TARGET_TRIGGER_PHRASE_COUNT} trigger phrases: ${validationSummary.belowTargetTriggerPhraseCount}`
  );
  console.log(
    `- average trigger_phrases count: ${validationSummary.averageTriggerPhraseCount.toFixed(2)}`
  );
  console.log(
    `- average quality_score across non-deprecated files: ${validationSummary.averageQualityScore.toFixed(2)}`
  );
  console.log(`- audit report: ${path.relative(repoRoot, auditReportPath)}`);

  if (validationSummary.invalidFiles.length > 0) {
    console.log('- invalid files:');

    for (const invalidFile of validationSummary.invalidFiles) {
      console.log(`  - ${invalidFile.filePath}: ${invalidFile.missingFields.join(', ')}`);
    }
  }
}

main();
