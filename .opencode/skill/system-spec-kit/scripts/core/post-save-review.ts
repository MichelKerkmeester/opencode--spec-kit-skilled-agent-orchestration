// ---------------------------------------------------------------
// MODULE: Post-Save Quality Review
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. POST-SAVE QUALITY REVIEW
// ───────────────────────────────────────────────────────────────
// After writing a memory file, reads it back and compares frontmatter
// against the original JSON payload to detect silent field overrides.

import * as fs from 'node:fs';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
------------------------------------------------------------------*/

export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ReviewIssue {
  severity: IssueSeverity;
  field: string;
  message: string;
  fix: string;
}

export interface PostSaveReviewResult {
  status: 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED';
  issues: ReviewIssue[];
  skipReason?: string;
}

export interface PostSaveReviewInput {
  savedFilePath: string;
  collectedData: {
    sessionSummary?: string;
    _manualTriggerPhrases?: string[];
    importanceTier?: string;
    importance_tier?: string;
    contextType?: string;
    context_type?: string;
    keyDecisions?: unknown[];
    _manualDecisions?: unknown[];
    _source?: string;
  } | null;
  inputMode?: string;
}

/* ───────────────────────────────────────────────────────────────
   2. FRONTMATTER PARSING
------------------------------------------------------------------*/

/**
 * Extract YAML frontmatter key-value pairs from a memory markdown file.
 * Parses only simple `key: value` lines between `---` delimiters.
 */
function parseFrontmatter(content: string): Record<string, string> {
  const lines = content.split('\n');
  const result: Record<string, string> = {};

  if (lines[0]?.trim() !== '---') return result;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '---') break;

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      const value = line.substring(colonIdx + 1).trim();
      result[key] = value;
    }
  }

  return result;
}

/**
 * Extract key-value pairs from the fenced YAML block under
 * `## MEMORY METADATA`. Some authoritative runtime fields, including
 * `decision_count`, are recorded there instead of in the top frontmatter.
 */
function parseMemoryMetadataBlock(content: string): Record<string, string> {
  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml\s*([\s\S]*?)```/);
  if (!match || !match[1]) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#')) {
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx <= 0) {
      continue;
    }

    const key = line.substring(0, colonIdx).trim();
    const value = line.substring(colonIdx + 1).trim();
    if (key.length > 0 && value.length > 0) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Parse a YAML array field from frontmatter.
 * Handles both inline `[a, b]` and multiline `- a\n- b` formats.
 */
function parseFrontmatterArray(content: string, fieldName: string): string[] {
  const lines = content.split('\n');
  const result: string[] = [];

  let inFrontmatter = false;
  let foundField = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      }
      break; // End of frontmatter
    }

    if (!inFrontmatter) continue;

    if (line.startsWith(`${fieldName}:`)) {
      foundField = true;
      // Check for inline array format: field: [a, b, c]
      const inlineMatch = line.match(/:\s*\[(.+)\]/);
      if (inlineMatch) {
        return inlineMatch[1]
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
      continue;
    }

    if (foundField) {
      if (line.match(/^\s+-\s+/)) {
        const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
        if (value) result.push(value);
      } else {
        break; // No longer in array
      }
    }
  }

  return result;
}

/* ───────────────────────────────────────────────────────────────
   3. GENERIC TITLE DETECTION
------------------------------------------------------------------*/

const GENERIC_TITLES = new Set([
  'next steps',
  'session summary',
  'context save',
  'manual context save',
  'development session',
  'session in progress',
  'continue implementation',
  'implementation session',
]);

function isGenericTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase().replace(/['"]/g, '');
  return GENERIC_TITLES.has(normalized) || normalized.length < 10;
}

/* ───────────────────────────────────────────────────────────────
   4. PATH FRAGMENT DETECTION
------------------------------------------------------------------*/

const PATH_FRAGMENT_PATTERNS = [
  /^[a-z]{1,4}$/, // Very short single words (likely folder tokens)
  /^(?:and|the|for|with|from|into|this|that|then)$/i, // Stopwords
  /^(?:src|lib|dist|node_modules|scripts|utils|core|config)$/i, // Directory names
  /^(?:index|main|app|server|client|test|spec)$/i, // Generic file stems
  // Phase 004 T031: Multi-token path fragment patterns (e.g., "system spec kit/022")
  /\w+[\s/\\-]+\w+[\s/\\-]+\d{2,3}/, // Multi-word path with trailing number (folder prefix)
  /^\d{1,3}[\s-]+\w+/, // Leading number-dash-word pattern (e.g., "022-hybrid")
  /[/\\]/, // Any phrase containing path separators
];

function isPathFragment(phrase: string): boolean {
  const trimmed = phrase.trim();
  return PATH_FRAGMENT_PATTERNS.some(pattern => pattern.test(trimmed));
}

/* ───────────────────────────────────────────────────────────────
   5. REVIEW LOGIC
------------------------------------------------------------------*/

/**
 * Review a saved memory file against the original JSON payload.
 * Detects silent field overrides/discards that defeat JSON mode.
 */
export function reviewPostSaveQuality(input: PostSaveReviewInput): PostSaveReviewResult {
  const { savedFilePath, collectedData, inputMode } = input;

  // Skip conditions
  if (!collectedData) {
    return { status: 'SKIPPED', issues: [], skipReason: 'No collected data to compare against' };
  }

  if (inputMode === 'captured') {
    return { status: 'SKIPPED', issues: [], skipReason: `Input mode is ${inputMode} — no JSON payload to compare` };
  }

  if (collectedData._source && collectedData._source !== 'file') {
    return { status: 'SKIPPED', issues: [], skipReason: `Source is ${collectedData._source}, not file (JSON mode)` };
  }

  // Read saved file
  let fileContent: string;
  try {
    fileContent = fs.readFileSync(savedFilePath, 'utf8');
  } catch {
    return { status: 'SKIPPED', issues: [], skipReason: `Could not read saved file: ${savedFilePath}` };
  }

  const frontmatter = parseFrontmatter(fileContent);
  const memoryMetadata = parseMemoryMetadataBlock(fileContent);
  const issues: ReviewIssue[] = [];

  // Check 1: Title quality
  if (collectedData.sessionSummary && collectedData.sessionSummary.length > 15) {
    const savedTitle = frontmatter['title'] || '';
    if (isGenericTitle(savedTitle)) {
      const suggestedTitle = collectedData.sessionSummary.substring(0, 80);
      issues.push({
        severity: 'HIGH',
        field: 'title',
        message: `"${savedTitle}" — should reflect sessionSummary`,
        fix: `Edit frontmatter title to: "${suggestedTitle}"`,
      });
    }
  }

  // Check 2: Trigger phrases
  if (collectedData._manualTriggerPhrases && collectedData._manualTriggerPhrases.length > 0) {
    const savedTriggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
    const pathFragments = savedTriggers.filter(t => isPathFragment(t));

    if (pathFragments.length > 0) {
      issues.push({
        severity: 'HIGH',
        field: 'trigger_phrases',
        message: `contains path fragments ${JSON.stringify(pathFragments)}`,
        fix: `Replace with: ${JSON.stringify(collectedData._manualTriggerPhrases.slice(0, 5))}`,
      });
    }

    // Check if manual phrases are missing from saved triggers
    const savedLower = new Set(savedTriggers.map(t => t.toLowerCase()));
    const missingPhrases = collectedData._manualTriggerPhrases.filter(
      p => !savedLower.has(p.toLowerCase())
    );
    if (missingPhrases.length > 0 && pathFragments.length === 0) {
      issues.push({
        severity: 'MEDIUM',
        field: 'trigger_phrases',
        message: `missing manual phrases: ${JSON.stringify(missingPhrases.slice(0, 3))}`,
        fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
      });
    }
  }

  // Check 3: importance_tier mismatch
  const explicitTier = collectedData.importanceTier || collectedData.importance_tier;
  if (explicitTier) {
    const savedTier = frontmatter['importance_tier'] || '';
    if (savedTier && savedTier !== explicitTier) {
      issues.push({
        severity: 'MEDIUM',
        field: 'importance_tier',
        message: `"${savedTier}" — payload specified "${explicitTier}"`,
        fix: `Change to "${explicitTier}" in frontmatter`,
      });
    }
  }

  // Check 4: decision_count = 0 when payload has keyDecisions
  const payloadDecisions = collectedData.keyDecisions || collectedData._manualDecisions || [];
  if (payloadDecisions.length > 0) {
    const savedDecisionCount = parseInt(
      frontmatter['decision_count'] || memoryMetadata['decision_count'] || '0',
      10
    );
    if (savedDecisionCount === 0) {
      issues.push({
        severity: 'MEDIUM',
        field: 'decision_count',
        message: `0 — payload has ${payloadDecisions.length} keyDecisions`,
        fix: `Verify decisions were propagated; expected decision_count >= ${payloadDecisions.length}`,
      });
    }
  }

  // Check 5: contextType mismatch
  const explicitContextType = collectedData.contextType || collectedData.context_type;
  if (explicitContextType) {
    const savedContextType = frontmatter['context_type'] || '';
    if (savedContextType && savedContextType !== explicitContextType) {
      issues.push({
        severity: 'LOW',
        field: 'context_type',
        message: `"${savedContextType}" — payload specified "${explicitContextType}"`,
        fix: `Change to "${explicitContextType}" in frontmatter`,
      });
    }
  }

  // Check 6: Generic description
  const savedDescription = frontmatter['description'] || '';
  if (savedDescription) {
    const genericDescriptions = [
      'session focused on implementing and testing features',
      'development session',
      'context save',
    ];
    const isGenericDesc = genericDescriptions.some(
      g => savedDescription.toLowerCase().includes(g)
    );
    if (isGenericDesc && collectedData.sessionSummary && collectedData.sessionSummary.length > 20) {
      issues.push({
        severity: 'LOW',
        field: 'description',
        message: 'Generic boilerplate description',
        fix: `Replace with sessionSummary: "${collectedData.sessionSummary.substring(0, 100)}"`,
      });
    }
  }

  if (issues.length === 0) {
    return { status: 'PASSED', issues: [] };
  }

  return { status: 'ISSUES_FOUND', issues };
}

/* ───────────────────────────────────────────────────────────────
   5b. SCORE FEEDBACK FROM REVIEW FINDINGS (Phase 002 T034-T035)
------------------------------------------------------------------*/

// ADR-003: Penalty values per finding severity
const REVIEW_SEVERITY_PENALTIES: Record<IssueSeverity, number> = {
  HIGH: -0.10,
  MEDIUM: -0.05,
  LOW: -0.02,
};

/**
 * Compute a quality score penalty based on post-save review findings.
 * Returns a negative number (penalty) to be added to the quality_score.
 * The penalty is capped at -0.30 to prevent the score from going below a floor.
 */
export function computeReviewScorePenalty(issues: ReviewIssue[]): number {
  let penalty = 0;
  for (const issue of issues) {
    penalty += REVIEW_SEVERITY_PENALTIES[issue.severity] || 0;
  }
  // Cap penalty at -0.30 to keep score in meaningful range
  return Math.max(penalty, -0.30);
}

/* ───────────────────────────────────────────────────────────────
   6. OUTPUT FORMATTING
------------------------------------------------------------------*/

/**
 * Print the post-save quality review result to stdout in machine-readable format.
 */
export function printPostSaveReview(result: PostSaveReviewResult): void {
  const status = result.status;
  const findings = result.issues;
  const scorePenalty = findings.length > 0 ? computeReviewScorePenalty(findings) : 0;

  if (result.status === 'SKIPPED') {
    console.log(`\nPOST-SAVE QUALITY REVIEW -- SKIPPED (${result.skipReason})\n`);
    console.log(JSON.stringify({ status, issues: findings, scorePenalty }, null, 2));
    return;
  }

  if (result.status === 'PASSED') {
    console.log('\nPOST-SAVE QUALITY REVIEW -- PASSED (0 issues)\n');
    console.log(JSON.stringify({ status, issues: findings, scorePenalty }, null, 2));
    return;
  }

  const highCount = result.issues.filter(i => i.severity === 'HIGH').length;
  const medCount = result.issues.filter(i => i.severity === 'MEDIUM').length;
  const lowCount = result.issues.filter(i => i.severity === 'LOW').length;

  console.log(`\nPOST-SAVE QUALITY REVIEW -- ${result.issues.length} issues found\n`);

  for (const issue of result.issues) {
    console.log(`[${issue.severity}] ${issue.field}: ${issue.message}`);
    console.log(`  Fix: ${issue.fix}\n`);
  }

  if (highCount > 0) {
    console.log('The AI MUST manually patch HIGH severity fields before continuing.\n');
  } else if (medCount > 0) {
    console.log('MEDIUM issues should be patched when practical.\n');
  }

  console.log(JSON.stringify({ status, issues: findings, scorePenalty }, null, 2));
}
