// ---------------------------------------------------------------
// MODULE: Post-Save Quality Review
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. POST-SAVE QUALITY REVIEW
// ───────────────────────────────────────────────────────────────
// After writing a memory file, read it back and compare the rendered
// markdown against the original JSON payload to detect silent drift.

import * as fs from 'node:fs';

import {
  emitMemoryMetric,
  METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM,
  METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL,
  METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL,
  METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL,
  METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL,
  METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL,
  METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL,
  METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL,
} from '../lib/memory-telemetry';
import { sanitizeTriggerPhrase, type TriggerPhraseSanitizeReason } from '../lib/trigger-phrase-sanitizer';
import { resolveSaveMode, SaveMode, type SaveModeInput } from '../types/save-mode';
import { structuredLog } from '../utils/logger';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
------------------------------------------------------------------*/

export type IssueSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ReviewStatus = 'PASSED' | 'ISSUES_FOUND' | 'SKIPPED' | 'REJECTED' | 'REVIEWER_ERROR';
export type ReviewCheckId =
  | 'PSR-1'
  | 'PSR-2'
  | 'PSR-3'
  | 'PSR-4'
  | 'PSR-5'
  | 'PSR-6'
  | 'D1'
  | 'D2'
  | 'D3'
  | 'D4'
  | 'D5'
  | 'D6'
  | 'D7'
  | 'D8'
  | 'DUP1'
  | 'DUP2'
  | 'DUP3'
  | 'DUP4'
  | 'DUP5'
  | 'DUP6'
  | 'DUP7';

export interface ReviewIssue {
  checkId?: ReviewCheckId;
  severity: IssueSeverity;
  field: string;
  message: string;
  fix: string;
}

export interface PostSaveReviewResult {
  status: ReviewStatus;
  issues: ReviewIssue[];
  skipReason?: string;
  reviewerError?: string;
  blocking?: boolean;
  blockerReason?: string;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
}

export interface PostSaveReviewInput {
  savedFilePath: string;
  content?: string;
  collectedData: ({
    sessionSummary?: string;
    _manualTriggerPhrases?: string[];
    importanceTier?: string;
    importance_tier?: string;
    contextType?: string;
    context_type?: string;
    keyDecisions?: unknown[];
    _manualDecisions?: unknown[];
    _source?: string;
    headRef?: string | null;
    commitRef?: string | null;
    repositoryState?: string | null;
    isDetachedHead?: boolean | null;
    provenanceExpected?: boolean;
  } & SaveModeInput) | null;
  inputMode?: string;
}

type D3Reason = Extract<TriggerPhraseSanitizeReason, 'path_fragment' | 'standalone_stopword' | 'synthetic_bigram'>;

type AnchorState = {
  comment: string | null;
  closingComment: string | null;
  htmlId: string | null;
  tocTarget: string | null;
};

type GuardrailTelemetryContext = {
  inputMode: string;
  saveMode: SaveMode;
  provenanceExpected: boolean;
  overviewLength: number;
  d3Counts: Record<D3Reason, number>;
  continuationPattern: string | null;
  anchorViolationCount: number;
};

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
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

const DECISION_PLACEHOLDER_PATTERN = /\b(?:observation|user)\s+decision\s+\d+\b/i;
const HIGH_GUARDRAIL_CHECKS = new Set<ReviewCheckId>(['D1', 'D2', 'D4', 'D7']);
const CONTINUATION_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'extended', pattern: /\bextended\b/i },
  { label: 'continuation', pattern: /\bcontinu(?:ation|e)\b/i },
  { label: 'resume', pattern: /\bresume\b/i },
  { label: 'follow_up', pattern: /\bfollow[- ]up\b/i },
  { label: 'part', pattern: /\bpart\s*\d+\b/i },
  { label: 'round', pattern: /\bround\s*\d+\b/i },
  { label: 'iteration', pattern: /\biter(?:ation)?\s*\d+\b/i },
  { label: 'iterations_total', pattern: /\b\d+[- ]*iterations?(?:[- ]*total[- ]*\d+)?\b/i },
];

/* ───────────────────────────────────────────────────────────────
   3. PARSING HELPERS
------------------------------------------------------------------*/

function normalizeInputMode(inputMode: string | undefined, saveMode: SaveMode): string {
  if (typeof inputMode === 'string' && inputMode.trim().length > 0) {
    return inputMode.trim().toLowerCase();
  }
  return saveMode;
}

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

function extractMemoryMetadataYaml(content: string): string {
  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml\s*([\s\S]*?)```/);
  return match?.[1] ?? '';
}

function parseMemoryMetadataBlock(content: string): Record<string, string> {
  const yamlBlock = extractMemoryMetadataYaml(content);
  if (!yamlBlock) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const rawLine of yamlBlock.split('\n')) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#') || line.endsWith(':')) {
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

function normalizeScalarValue(value: string | undefined): string {
  return (value || '')
    .trim()
    .replace(/\s+#.*$/u, '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

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
      break;
    }

    if (!inFrontmatter) continue;

    if (line.startsWith(`${fieldName}:`)) {
      foundField = true;
      const inlineMatch = line.match(/:\s*\[(.+)\]/);
      if (inlineMatch) {
        return inlineMatch[1]
          .split(',')
          .map((entry) => entry.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
      continue;
    }

    if (foundField) {
      if (line.match(/^\s+-\s+/)) {
        const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
        if (value) {
          result.push(value);
        }
      } else {
        break;
      }
    }
  }

  return result;
}

function extractYamlListEntries(yamlBlock: string, fieldName: string): string[] {
  if (!yamlBlock) {
    return [];
  }

  const lines = yamlBlock.split('\n');
  const fieldIndex = lines.findIndex((line) => line.trim() === `${fieldName}:`);
  if (fieldIndex === -1) {
    return [];
  }

  const entries: string[] = [];
  for (let index = fieldIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      continue;
    }
    if (trimmed === '[]') {
      return [];
    }
    if (/^- /.test(trimmed)) {
      entries.push(trimmed.replace(/^- /, '').replace(/^['"]|['"]$/g, ''));
      continue;
    }
    if (!/^\s/.test(line)) {
      break;
    }
  }

  return entries.filter(Boolean);
}

function extractSection(content: string, sectionName: string): string {
  const escapedSectionName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^##\\s+(?:\\d+\\.\\s+)?${escapedSectionName}\\s*$([\\s\\S]*?)(?=^##\\s+(?:\\d+\\.\\s+)?[^\\n]+$|\\Z)`,
    'im',
  );
  return pattern.exec(content)?.[1]?.trim() ?? '';
}

function stripSectionScaffolding(sectionContent: string): string {
  return sectionContent
    .split('\n')
    .filter((line) => !line.trim().startsWith('<!--') && !line.trim().startsWith('<a id='))
    .join('\n')
    .trim();
}

function extractOverviewAnchorState(content: string): AnchorState {
  const tocTarget = Array.from(content.matchAll(/^- \[OVERVIEW\]\(#([^)]+)\)\s*$/gim))[0]?.[1] ?? null;
  const blockMatch = content.match(
    /<!-- ANCHOR:([a-z0-9-]+) -->\s*\n(?:<a id="([^"]+)"><\/a>\s*\n)?(?:\s*\n)?##\s+(?:\d+\.\s+)?OVERVIEW[\s\S]*?<!-- \/ANCHOR:([a-z0-9-]+) -->/i,
  );

  return {
    comment: blockMatch?.[1] ?? null,
    htmlId: blockMatch?.[2] ?? null,
    closingComment: blockMatch?.[3] ?? null,
    tocTarget,
  };
}

function extractSupersedesEntries(content: string): string[] {
  return extractYamlListEntries(extractMemoryMetadataYaml(content), 'supersedes');
}

function extractMetadataTriggerPhrases(content: string): string[] {
  return extractYamlListEntries(extractMemoryMetadataYaml(content), 'trigger_phrases');
}

function normalizeProposition(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`"'*:_|()[\]{}]/g, ' ')
    .replace(/\b(?:decision\s+\d+|selected|rationale|context|key outcomes?)\b/g, ' ')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractOverviewOutcomes(overviewSection: string): string[] {
  const match = overviewSection.match(/\*\*Key Outcomes\*\*:\s*([\s\S]*?)(?=\n\*\*[^|\n]|\n\| |\n##|\Z)/i);
  if (!match) {
    return [];
  }

  return match[1]
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^- /, '').trim())
    .filter(Boolean);
}

function extractDecisionTitles(decisionsSection: string): string[] {
  return Array.from(decisionsSection.matchAll(/^###\s+Decision\s+\d+:\s+(.+)$/gim), (match) => match[1].trim()).filter(Boolean);
}

function extractDecisionRationales(decisionsSection: string): string[] {
  return Array.from(decisionsSection.matchAll(/^\*\*Rationale\*\*:\s+(.+)$/gim), (match) => match[1].trim()).filter(Boolean);
}

function extractCompletedClosureCandidates(content: string): string[] {
  const candidates: string[] = [];
  const pendingMatches = Array.from(content.matchAll(/^- No pending tasks.*$/gim), (match) => match[0].trim());
  const continuationMatches = Array.from(content.matchAll(/^Next:\s+(.+)$/gim), (match) => match[1].trim());
  const nextActionMatches = Array.from(content.matchAll(/^\|\s*Next Action\s*\|\s*([^|]+)\|$/gim), (match) => match[1].trim());
  candidates.push(...pendingMatches, ...continuationMatches, ...nextActionMatches);
  return candidates.filter(Boolean);
}

function extractLastContextLines(content: string): string[] {
  return Array.from(content.matchAll(/^- Last:\s+(.+)$/gim), (match) => match[1].trim()).filter(Boolean);
}

function countMergedFromClauses(text: string): number {
  return (text.match(/merged from/gi) ?? []).length;
}

function isGenericTitle(title: string): boolean {
  const normalized = title.trim().toLowerCase().replace(/['"]/g, '');
  return GENERIC_TITLES.has(normalized) || normalized.length < 10;
}

function detectContinuationPattern(title: string): string | null {
  for (const candidate of CONTINUATION_PATTERNS) {
    if (candidate.pattern.test(title)) {
      return candidate.label;
    }
  }
  return null;
}

function buildD3Counts(triggerPhrases: string[]): Record<D3Reason, number> {
  return triggerPhrases.reduce<Record<D3Reason, number>>((counts, phrase) => {
    const verdict = sanitizeTriggerPhrase(phrase);
    if (
      verdict.keep === false &&
      verdict.reason &&
      (verdict.reason === 'path_fragment' || verdict.reason === 'standalone_stopword' || verdict.reason === 'synthetic_bigram')
    ) {
      counts[verdict.reason] += 1;
    }
    return counts;
  }, {
    path_fragment: 0,
    standalone_stopword: 0,
    synthetic_bigram: 0,
  });
}

function countGuardrailSeverities(issues: ReviewIssue[]): {
  high: number;
  medium: number;
  dupHigh: number;
  dupMedium: number;
} {
  return issues.reduce((counts, issue) => {
    if (!issue.checkId || (!issue.checkId.startsWith('D') && !issue.checkId.startsWith('DUP'))) {
      return counts;
    }

    const isDupCheck = issue.checkId.startsWith('DUP');
    if (issue.severity === 'HIGH') {
      counts.high += 1;
      if (isDupCheck) {
        counts.dupHigh += 1;
      }
    } else if (issue.severity === 'MEDIUM') {
      counts.medium += 1;
      if (isDupCheck) {
        counts.dupMedium += 1;
      }
    }
    return counts;
  }, { high: 0, medium: 0, dupHigh: 0, dupMedium: 0 });
}

function emitD3Metrics(counts: Record<D3Reason, number>, labels: Record<string, string>): void {
  if (counts.path_fragment > 0) {
    emitMemoryMetric(METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL, counts.path_fragment, {
      ...labels,
      reason: 'path_fragment',
    });
  }
  if (counts.standalone_stopword > 0) {
    emitMemoryMetric(METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL, counts.standalone_stopword, {
      ...labels,
      reason: 'stopword',
    });
  }
  if (counts.synthetic_bigram > 0) {
    emitMemoryMetric(METRIC_M3_MEMORY_SAVE_TRIGGER_PHRASE_REJECTED_TOTAL, counts.synthetic_bigram, {
      ...labels,
      reason: 'bigram',
    });
  }
}

function emitGuardrailTelemetry(
  issues: ReviewIssue[],
  context: GuardrailTelemetryContext,
  anchorState: AnchorState,
): void {
  const labels = {
    input_mode: context.inputMode,
    save_mode: context.saveMode,
  };

  emitMemoryMetric(METRIC_M1_MEMORY_SAVE_OVERVIEW_LENGTH_HISTOGRAM, context.overviewLength, labels);
  emitD3Metrics(context.d3Counts, labels);

  if (context.continuationPattern) {
    emitMemoryMetric(METRIC_M5_MEMORY_SAVE_CONTINUATION_SIGNAL_HIT_TOTAL, 1, {
      ...labels,
      pattern: context.continuationPattern,
    });
  }

  if (context.anchorViolationCount > 0) {
    emitMemoryMetric(METRIC_M7_MEMORY_SAVE_TEMPLATE_ANCHOR_VIOLATIONS_TOTAL, context.anchorViolationCount, labels);
  }

  for (const issue of issues) {
    if (!issue.checkId || !issue.checkId.startsWith('D')) {
      continue;
    }

    emitMemoryMetric(METRIC_M8_MEMORY_SAVE_REVIEW_VIOLATION_TOTAL, 1, {
      ...labels,
      check_id: issue.checkId,
      severity: issue.severity,
    });
    structuredLog('warn', 'memory_save_review_violation', {
      check_id: issue.checkId,
      severity: issue.severity,
      field: issue.field,
      message: issue.message,
      input_mode: context.inputMode,
    });

    if (issue.checkId === 'D2') {
      emitMemoryMetric(METRIC_M2_MEMORY_SAVE_DECISION_FALLBACK_USED_TOTAL, 1, labels);
    }

    if (issue.checkId === 'D4') {
      emitMemoryMetric(METRIC_M4_MEMORY_SAVE_FRONTMATTER_TIER_DRIFT_TOTAL, 1, labels);
    }

    if (issue.checkId === 'D7' && context.provenanceExpected) {
      emitMemoryMetric(METRIC_M6_MEMORY_SAVE_GIT_PROVENANCE_MISSING_TOTAL, 1, labels);
      structuredLog('warn', 'memory_save_git_provenance_degraded', {
        provenance_expected: context.provenanceExpected,
        head_ref_present: issue.message.includes('head_ref') === false,
        commit_ref_present: issue.message.includes('commit_ref') === false,
        repository_state_present: issue.message.includes('repository_state') === false,
      });
    }

    if (issue.checkId === 'D8') {
      structuredLog('warn', 'memory_save_template_contract_violation', {
        anchor_comment: anchorState.comment,
        anchor_closing_comment: anchorState.closingComment,
        anchor_html_id: anchorState.htmlId,
        toc_target: anchorState.tocTarget,
      });
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   4. REVIEW LOGIC
------------------------------------------------------------------*/

export function reviewPostSaveQuality(input: PostSaveReviewInput): PostSaveReviewResult {
  const { savedFilePath, content, collectedData, inputMode } = input;

  if (!collectedData) {
    // SKIPPED is intentional-only now: missing payload means there is nothing valid to compare.
    return { status: 'SKIPPED', issues: [], skipReason: 'No collected data to compare against' };
  }

  const saveMode = resolveSaveMode({
    saveMode: collectedData.saveMode,
    save_mode: collectedData.save_mode,
    _source: collectedData._source,
    inputMode,
  });
  if (saveMode !== SaveMode.Json) {
    // JSON-mode saves are the only ones with a reviewer contract today.
    return { status: 'SKIPPED', issues: [], skipReason: `SaveMode is ${saveMode}, not json` };
  }

  try {
    // Follow-up: the reviewer still does multiple focused string parses, but they
    // now operate on in-memory content for the workflow hot path instead of rereading disk.
    const fileContent = typeof content === 'string' ? content : fs.readFileSync(savedFilePath, 'utf8');
    const normalizedInputMode = normalizeInputMode(inputMode, saveMode);
    const frontmatter = parseFrontmatter(fileContent);
    const memoryMetadataYaml = extractMemoryMetadataYaml(fileContent);
    const memoryMetadata = parseMemoryMetadataBlock(fileContent);
    const issues: ReviewIssue[] = [];

    const savedTitle = normalizeScalarValue(frontmatter.title);
    const savedTriggers = parseFrontmatterArray(fileContent, 'trigger_phrases');
    const metadataTriggers = extractMetadataTriggerPhrases(fileContent);
    const savedTier = normalizeScalarValue(frontmatter.importance_tier);
    const metadataTier = normalizeScalarValue(memoryMetadata.importance_tier);
    const savedContextType = normalizeScalarValue(frontmatter.contextType || frontmatter.context_type);
    const metadataContextType = normalizeScalarValue(memoryMetadata.context_type || memoryMetadata.contextType);
    const metadataHasContextType = /(^|\n)context_type:\s*/m.test(memoryMetadataYaml) || /(^|\n)contextType:\s*/m.test(memoryMetadataYaml);
    const metadataHasTriggerPhrases = /(^|\n)trigger_phrases:\s*/m.test(memoryMetadataYaml);
    const overview = stripSectionScaffolding(extractSection(fileContent, 'OVERVIEW'));
    const decisionsSection = stripSectionScaffolding(extractSection(fileContent, 'DECISIONS'));
    const supersedes = extractSupersedesEntries(fileContent);
    const anchorState = extractOverviewAnchorState(fileContent);
    const closureCandidates = extractCompletedClosureCandidates(fileContent);
    const lastContextLines = extractLastContextLines(fileContent);
    const payloadSummary = (collectedData.sessionSummary || '').trim();
    const payloadDecisions = Array.isArray(collectedData.keyDecisions) && collectedData.keyDecisions.length > 0
      ? collectedData.keyDecisions
      : Array.isArray(collectedData._manualDecisions)
        ? collectedData._manualDecisions
        : [];
    const explicitTier = normalizeScalarValue(collectedData.importanceTier || collectedData.importance_tier);
    const explicitContextType = normalizeScalarValue(collectedData.contextType || collectedData.context_type);
    const continuationPattern = detectContinuationPattern(savedTitle);
    const d3Counts = buildD3Counts(savedTriggers);
    const provenanceExpected = collectedData.provenanceExpected === true;

    // Baseline checks.
    if (payloadSummary.length > 15 && isGenericTitle(savedTitle)) {
      issues.push({
        checkId: 'PSR-1',
        severity: 'HIGH',
        field: 'title',
        message: `"${savedTitle}" — should reflect sessionSummary`,
        fix: `Edit frontmatter title to: "${payloadSummary.substring(0, 80)}"`,
      });
    }

    if (Array.isArray(collectedData._manualTriggerPhrases) && collectedData._manualTriggerPhrases.length > 0) {
      const pathFragments = savedTriggers.filter((phrase) => sanitizeTriggerPhrase(phrase).reason === 'path_fragment');
      if (pathFragments.length > 0) {
        issues.push({
          checkId: 'PSR-2',
          severity: 'HIGH',
          field: 'trigger_phrases',
          message: `contains path fragments ${JSON.stringify(pathFragments)}`,
          fix: `Replace with: ${JSON.stringify(collectedData._manualTriggerPhrases.slice(0, 5))}`,
        });
      }

      const savedLower = new Set(savedTriggers.map((entry) => entry.toLowerCase()));
      const missingPhrases = collectedData._manualTriggerPhrases.filter(
        (phrase) => !savedLower.has(phrase.toLowerCase()),
      );
      if (missingPhrases.length > 0 && pathFragments.length === 0) {
        issues.push({
          checkId: 'PSR-2',
          severity: 'MEDIUM',
          field: 'trigger_phrases',
          message: `missing manual phrases: ${JSON.stringify(missingPhrases.slice(0, 3))}`,
          fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
        });
      }
    }

    if (explicitTier && savedTier && savedTier !== explicitTier) {
      issues.push({
        checkId: 'PSR-3',
        severity: 'MEDIUM',
        field: 'importance_tier',
        message: `"${savedTier}" — payload specified "${explicitTier}"`,
        fix: `Change to "${explicitTier}" in frontmatter`,
      });
    }

    if (payloadDecisions.length > 0) {
      const savedDecisionCount = parseInt(
        frontmatter.decision_count || memoryMetadata.decision_count || '0',
        10,
      );
      if (savedDecisionCount === 0) {
        issues.push({
          checkId: 'PSR-4',
          severity: 'MEDIUM',
          field: 'decision_count',
          message: `0 — payload has ${payloadDecisions.length} keyDecisions`,
          fix: `Verify decisions were propagated; expected decision_count >= ${payloadDecisions.length}`,
        });
      }
    }

    if (explicitContextType) {
      if (savedContextType && savedContextType !== explicitContextType) {
        issues.push({
          checkId: 'PSR-5',
          severity: 'LOW',
          field: 'context_type',
          message: `"${savedContextType}" — payload specified "${explicitContextType}"`,
          fix: `Change to "${explicitContextType}" in frontmatter`,
        });
      }
    }

    const placeholderObservationCount = (fileContent.match(/^### OBSERVATION:\s*(?:Observation)?\s*$/gim) ?? []).length;
    if (placeholderObservationCount >= 2) {
      issues.push({
        checkId: 'DUP1',
        severity: 'MEDIUM',
        field: 'observations',
        message: `generic observation placeholder headings repeated ${placeholderObservationCount} times`,
        fix: 'Suppress blank-title observation headings before the template renders them',
      });
    }

    const normalizedOutcomePropositions = new Set(
      extractOverviewOutcomes(overview)
        .map(normalizeProposition)
        .filter(Boolean),
    );
    const normalizedDecisionTitlePropositions = new Set(
      extractDecisionTitles(decisionsSection)
        .map(normalizeProposition)
        .filter(Boolean),
    );
    const normalizedDecisionRationales = new Set(
      extractDecisionRationales(decisionsSection)
        .map(normalizeProposition)
        .filter(Boolean),
    );
    const duplicatedDecisionPropositions = Array.from(normalizedOutcomePropositions).filter((proposition) => (
      proposition.length > 0
      && normalizedDecisionTitlePropositions.has(proposition)
      && normalizedDecisionRationales.has(proposition)
    ));
    if (duplicatedDecisionPropositions.length > 0) {
      issues.push({
        checkId: 'DUP2',
        severity: 'MEDIUM',
        field: 'decisions',
        message: `decision proposition is repeated across outcomes, title, and rationale: ${JSON.stringify(duplicatedDecisionPropositions.slice(0, 3))}`,
        fix: 'Deduplicate repeated decision propositions across Key Outcomes, decision titles, and fallback rationale',
      });
    }

    const closureSignals = closureCandidates.filter((candidate) => (
      /(complete|completed|canonical|follow[- ]on|no pending|no immediate work|outside this memory|optional downstream)/i.test(candidate)
    ));
    if (closureSignals.length >= 3) {
      issues.push({
        checkId: 'DUP3',
        severity: 'MEDIUM',
        field: 'continuation',
        message: `completed-session closure guidance is repeated across ${closureSignals.length} surfaces`,
        fix: 'Keep completed-session closure guidance on the canonical Next Action surface only',
      });
    }

    const clippedLastLine = lastContextLines.find((line) => !/[.?!…]$/.test(line) && !line.endsWith('...'));
    if (clippedLastLine) {
      issues.push({
        checkId: 'DUP4',
        severity: 'MEDIUM',
        field: 'resume_context',
        message: `Last context ends as a clipped fragment: "${clippedLastLine}"`,
        fix: 'Trim Last resume context at a sentence or word boundary, or add an explicit ellipsis',
      });
    }

    if (metadataHasContextType && (savedContextType || metadataContextType) && savedContextType !== metadataContextType) {
      issues.push({
        checkId: 'DUP5',
        severity: 'MEDIUM',
        field: 'context_type',
        message: `frontmatter contextType is "${savedContextType || 'missing'}" but MEMORY METADATA is "${metadataContextType || 'missing'}"`,
        fix: 'Render MEMORY METADATA context_type from the same resolved frontmatter contextType value',
      });
    }

    const normalizedSavedTriggers = Array.from(new Set(savedTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
    const normalizedMetadataTriggers = Array.from(new Set(metadataTriggers.map((trigger) => trigger.trim().toLowerCase()).filter(Boolean))).sort();
    if (metadataHasTriggerPhrases && JSON.stringify(normalizedSavedTriggers) !== JSON.stringify(normalizedMetadataTriggers)) {
      issues.push({
        checkId: 'DUP5',
        severity: 'HIGH',
        field: 'trigger_phrases',
        message: `frontmatter trigger_phrases ${JSON.stringify(normalizedSavedTriggers)} drift from MEMORY METADATA ${JSON.stringify(normalizedMetadataTriggers)}`,
        fix: 'Render MEMORY METADATA trigger_phrases from the same resolved frontmatter trigger list',
      });
    }

    const redundantSectionIdentityMatches = fileContent.match(/<!-- ANCHOR:[a-z0-9-]+ -->\s*\n<a id="[^"]+"><\/a>\s*\n(?:\s*\n)?##/gi) ?? [];
    if (redundantSectionIdentityMatches.length > 0) {
      issues.push({
        checkId: 'DUP6',
        severity: 'MEDIUM',
        field: 'anchors',
        message: `redundant section identity scaffolding detected in ${redundantSectionIdentityMatches.length} section opener(s)`,
        fix: 'Keep markdown headers plus ANCHOR comments, and remove legacy HTML id scaffolding',
      });
    }

    const inflatedFileRow = fileContent
      .split('\n')
      .map((line) => line.trim())
      .find((line) => line.startsWith('| `') && countMergedFromClauses(line) >= 2);
    if (inflatedFileRow) {
      issues.push({
        checkId: 'DUP7',
        severity: 'MEDIUM',
        field: 'files',
        message: `FILES row description contains repeated merged provenance inflation: "${inflatedFileRow}"`,
        fix: 'Move verbose merged provenance out of FILES descriptions and keep only one merged summary clause',
      });
    }

    const savedDescription = normalizeScalarValue(frontmatter.description);
    if (savedDescription) {
      const genericDescriptions = [
        'session focused on implementing and testing features',
        'development session',
        'context save',
      ];
      const isGenericDesc = genericDescriptions.some((entry) => savedDescription.toLowerCase().includes(entry));
      if (isGenericDesc && payloadSummary.length > 20) {
        issues.push({
          checkId: 'PSR-6',
          severity: 'LOW',
          field: 'description',
          message: 'Generic boilerplate description',
          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
        });
      }
    }

    // CHECK-D1: overview truncation / ellipsis integrity.
    if (payloadSummary.length > 0 && overview.length > 0) {
    const trimmedOverview = overview.trimEnd();
    const usesAsciiEllipsis = trimmedOverview.endsWith('...');
    const usesUnicodeEllipsis = trimmedOverview.endsWith('…');
    const overviewCore = (
      usesAsciiEllipsis
        ? trimmedOverview.slice(0, -3)
        : usesUnicodeEllipsis
          ? trimmedOverview.slice(0, -1)
          : trimmedOverview
    ).trimEnd();
    const payloadOverflow = payloadSummary.length >= overviewCore.length + 40;
    const nextChar = payloadSummary.charAt(overviewCore.length);
    const coreEndsMidWord = /[A-Za-z0-9]$/.test(overviewCore) && /[A-Za-z0-9]/.test(nextChar);
    const plainMidTokenEnding = !usesAsciiEllipsis && !usesUnicodeEllipsis && /[A-Za-z0-9]$/.test(trimmedOverview);

      if (payloadOverflow && (usesAsciiEllipsis || coreEndsMidWord || plainMidTokenEnding)) {
        issues.push({
          checkId: 'D1',
          severity: 'HIGH',
          field: 'overview',
          message: 'OVERVIEW appears truncated mid-token or with non-canonical ellipsis handling',
          fix: 'Re-render the OVERVIEW from the full session summary using the boundary-safe truncation helper',
        });
      }
    }

    // CHECK-D2: lexical placeholder contamination.
    if (payloadDecisions.length > 0 && DECISION_PLACEHOLDER_PATTERN.test(decisionsSection)) {
      issues.push({
        checkId: 'D2',
        severity: 'HIGH',
        field: 'decisions',
        message: 'DECISIONS contains observation/user placeholder labels despite authored decisions in the payload',
        fix: 'Preserve authored decision arrays before any lexical fallback branch runs',
      });
    }

    // CHECK-D3: trigger phrase sanitization.
    if (Object.values(d3Counts).some((count) => count > 0)) {
      const details = [
        d3Counts.path_fragment > 0 ? `path_fragment=${d3Counts.path_fragment}` : null,
        d3Counts.standalone_stopword > 0 ? `stopword=${d3Counts.standalone_stopword}` : null,
        d3Counts.synthetic_bigram > 0 ? `bigram=${d3Counts.synthetic_bigram}` : null,
      ].filter(Boolean).join(', ');

      issues.push({
        checkId: 'D3',
        severity: 'MEDIUM',
        field: 'trigger_phrases',
        message: `trigger_phrases contains unsanitized junk (${details})`,
        fix: 'Run trigger phrases through the Phase 3 sanitizer before render and persist only the kept phrases',
      });
    }

    // CHECK-D4: frontmatter vs metadata tier drift.
    if (savedTier && metadataTier && savedTier !== metadataTier) {
      issues.push({
        checkId: 'D4',
        severity: 'HIGH',
        field: 'importance_tier',
        message: `frontmatter is "${savedTier}" but MEMORY METADATA is "${metadataTier}"`,
        fix: 'Render both importance_tier locations from the same resolved value',
      });
    }

    // CHECK-D5: continuation signal without supersedes.
    if (continuationPattern && supersedes.length === 0) {
      issues.push({
        checkId: 'D5',
        severity: 'MEDIUM',
        field: 'causal_links.supersedes',
        message: `continuation-style title matched "${continuationPattern}" but causal_links.supersedes is empty`,
        fix: 'Populate causal_links.supersedes when a continuation save has a valid predecessor',
      });
    }

    // CHECK-D6: duplicate trigger phrases.
    if (savedTriggers.length > 0) {
      const seen = new Set<string>();
      const duplicates = new Set<string>();

      for (const phrase of savedTriggers) {
        const normalized = phrase.trim().toLowerCase();
        if (seen.has(normalized)) {
          duplicates.add(normalized);
        } else {
          seen.add(normalized);
        }
      }

      if (duplicates.size > 0) {
        issues.push({
          checkId: 'D6',
          severity: 'MEDIUM',
          field: 'trigger_phrases',
          message: `duplicate trigger phrases detected: ${JSON.stringify(Array.from(duplicates))}`,
          fix: 'Deduplicate trigger_phrases before the saved frontmatter is rendered',
        });
      }
    }

    // CHECK-D7: provenance required but missing.
    if (provenanceExpected) {
      const headRef = normalizeScalarValue(memoryMetadata.head_ref || frontmatter.head_ref);
      const commitRef = normalizeScalarValue(memoryMetadata.commit_ref || frontmatter.commit_ref);
      const repositoryState = normalizeScalarValue(memoryMetadata.repository_state || frontmatter.repository_state);
      const missingFields = [
        headRef ? null : 'head_ref',
        commitRef ? null : 'commit_ref',
        repositoryState && repositoryState !== 'unavailable' ? null : 'repository_state',
      ].filter(Boolean);

      if (missingFields.length > 0) {
        issues.push({
          checkId: 'D7',
          severity: 'HIGH',
          field: 'git_provenance',
          message: `expected git provenance fields are missing: ${missingFields.join(', ')}`,
          fix: 'Keep JSON-mode provenance extraction authoritative and pass provenanceExpected into the reviewer contract',
        });
      }
    }

    // CHECK-D8: overview TOC / comment anchor consistency.
    const overviewAnchorSurfacePresent = overview.length > 0
      || anchorState.tocTarget !== null
      || anchorState.comment !== null
      || anchorState.closingComment !== null;
    if (
      overviewAnchorSurfacePresent &&
      (
        anchorState.tocTarget !== 'overview'
        || anchorState.comment !== 'overview'
        || anchorState.closingComment !== 'overview'
      )
    ) {
      issues.push({
        checkId: 'D8',
        severity: 'MEDIUM',
        field: 'anchors',
        message: `OVERVIEW anchor mismatch (toc=${anchorState.tocTarget ?? 'missing'}, comment=${anchorState.comment ?? 'missing'}, closing=${anchorState.closingComment ?? 'missing'})`,
        fix: 'Keep the OVERVIEW TOC target and comment anchors aligned on "overview"',
      });
    }

    emitGuardrailTelemetry(issues, {
      inputMode: normalizedInputMode,
      saveMode,
      provenanceExpected,
      overviewLength: overview.length,
      d3Counts,
      continuationPattern,
      anchorViolationCount: issues.some((issue) => issue.checkId === 'D8') ? 1 : 0,
    }, anchorState);

    const highCount = issues.filter((issue) => issue.severity === 'HIGH').length;
    const mediumCount = issues.filter((issue) => issue.severity === 'MEDIUM').length;
    const lowCount = issues.filter((issue) => issue.severity === 'LOW').length;

    if (issues.length === 0) {
      return {
        status: 'PASSED',
        issues: [],
      };
    }

    const guardrailCounts = countGuardrailSeverities(issues);
    const blocking = guardrailCounts.high >= 2 || (guardrailCounts.high >= 1 && guardrailCounts.medium >= 2);
    const blockerReason = blocking
      ? `Composite blocker fired (${guardrailCounts.high} HIGH, ${guardrailCounts.medium} MEDIUM guardrail findings; DUP=${guardrailCounts.dupHigh} HIGH/${guardrailCounts.dupMedium} MEDIUM)`
      : undefined;

    return {
      status: blocking ? 'REJECTED' : 'ISSUES_FOUND',
      issues,
      blocking,
      blockerReason,
      highCount,
      mediumCount,
      lowCount,
    };
  } catch (error: unknown) {
    const reviewerError = `Unexpected reviewer failure for ${savedFilePath}: ${error instanceof Error ? error.message : String(error)}`;
    return {
      status: 'REVIEWER_ERROR',
      issues: [],
      reviewerError,
    };
  }
}

/* ───────────────────────────────────────────────────────────────
   5. SCORE FEEDBACK FROM REVIEW FINDINGS
------------------------------------------------------------------*/

const REVIEW_SEVERITY_PENALTIES: Record<IssueSeverity, number> = {
  HIGH: -0.10,
  MEDIUM: -0.05,
  LOW: -0.02,
};

export function computeReviewScorePenalty(issues: ReviewIssue[]): number {
  let penalty = 0;
  for (const issue of issues) {
    penalty += REVIEW_SEVERITY_PENALTIES[issue.severity] || 0;
  }
  return Math.max(penalty, -0.30);
}

/* ───────────────────────────────────────────────────────────────
   6. OUTPUT FORMATTING
------------------------------------------------------------------*/

export function printPostSaveReview(result: PostSaveReviewResult): void {
  const scorePenalty = result.issues.length > 0 ? computeReviewScorePenalty(result.issues) : 0;
  const payload = {
    status: result.status,
    issues: result.issues,
    scorePenalty,
    blocking: result.blocking ?? false,
    blockerReason: result.blockerReason,
  };

  if (result.status === 'SKIPPED') {
    console.log(`\nPOST-SAVE QUALITY REVIEW -- SKIPPED (${result.skipReason})\n`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (result.status === 'REVIEWER_ERROR') {
    console.log(`\nPOST-SAVE QUALITY REVIEW -- REVIEWER ERROR (${result.reviewerError || 'unknown reviewer error'})\n`);
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (result.status === 'PASSED') {
    console.log('\nPOST-SAVE QUALITY REVIEW -- PASSED (0 issues)\n');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const highCount = result.highCount ?? result.issues.filter((issue) => issue.severity === 'HIGH').length;
  const mediumCount = result.mediumCount ?? result.issues.filter((issue) => issue.severity === 'MEDIUM').length;

  if (result.status === 'REJECTED') {
    console.log(`\nPOST-SAVE QUALITY REVIEW -- REJECTED (${result.blockerReason})\n`);
  } else {
    console.log(`\nPOST-SAVE QUALITY REVIEW -- ${result.issues.length} issues found\n`);
  }

  for (const issue of result.issues) {
    const checkLabel = issue.checkId ? `${issue.checkId} ` : '';
    console.log(`[${issue.severity}] ${checkLabel}${issue.field}: ${issue.message}`);
    console.log(`  Fix: ${issue.fix}\n`);
  }

  if (result.status === 'REJECTED') {
    console.log('The save is REJECTED because the composite blocker fired.\n');
  } else if (highCount > 0) {
    console.log('The AI MUST manually patch HIGH severity fields before continuing.\n');
  } else if (mediumCount > 0) {
    console.log('MEDIUM issues should be patched when practical.\n');
  }

  console.log(JSON.stringify(payload, null, 2));
}
