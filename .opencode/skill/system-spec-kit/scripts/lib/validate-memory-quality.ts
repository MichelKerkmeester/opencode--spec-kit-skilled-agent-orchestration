// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// ---------------------------------------------------------------
// ---------------------------------------------------------------
// 1. VALIDATE MEMORY QUALITY
// ---------------------------------------------------------------
// Post-render quality gate for generated memory files
//
// Canonical location: lib/validate-memory-quality.ts
// This module contains pure validation logic with no memory/ dependencies.
// The memory/validate-memory-quality.ts file re-exports from here for
// backward compatibility (CLI entry point + existing importers).

import fs from 'fs';
import path from 'path';
import { structuredLog } from '../utils/logger';
import type { ContaminationAuditRecord } from './content-filter';
import type { DataSource } from '../utils/input-normalizer';
import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';

type ValidationRuleSeverity = 'low' | 'medium' | 'high';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';

interface ValidationRuleMetadata {
  ruleId: QualityRuleId;
  severity: ValidationRuleSeverity;
  blockOnWrite: boolean;
  blockOnIndex: boolean;
  appliesToSources: 'all' | readonly KnownDataSource[];
  reason: string;
}

interface ValidationDispositionResult {
  disposition: ValidationDisposition;
  blockingRuleIds: QualityRuleId[];
  indexBlockingRuleIds: QualityRuleId[];
  softRuleIds: QualityRuleId[];
}

const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata> = {
  V1: {
    ruleId: 'V1',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Placeholder leakage in required durable-memory fields corrupts the saved output contract.',
  },
  V2: {
    ruleId: 'V2',
    severity: 'medium',
    blockOnWrite: false,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Structured content can be saved for inspection, but placeholder leakage with real tool evidence should not reach the semantic index.',
  },
  V3: {
    ruleId: 'V3',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Malformed spec_folder routing metadata invalidates the saved memory target.',
  },
  V4: {
    ruleId: 'V4',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Fallback-decision phrasing is a soft signal and should not block durable indexing on otherwise strong memories.',
  },
  V5: {
    ruleId: 'V5',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Sparse trigger phrases are diagnostic, but not enough to reject an otherwise valid rendered memory.',
  },
  V6: {
    ruleId: 'V6',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Template placeholder remnants are tracked as soft diagnostics when upstream template-contract validation already passed.',
  },
  V7: {
    ruleId: 'V7',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Tool-count contradictions are useful diagnostics, but not durable-index blockers on their own.',
  },
  V8: {
    ruleId: 'V8',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Foreign-spec contamination would corrupt both the saved memory and the semantic index.',
  },
  V9: {
    ruleId: 'V9',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'A contaminated title undermines retrieval quality and saved-memory truthfulness.',
  },
  V10: {
    ruleId: 'V10',
    severity: 'low',
    blockOnWrite: false,
    blockOnIndex: false,
    appliesToSources: 'all',
    reason: 'Session-source mismatch is diagnostic and should remain visible without forcing write-only saves.',
  },
  V11: {
    ruleId: 'V11',
    severity: 'high',
    blockOnWrite: true,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'API-error-dominated content is not a trustworthy memory surface.',
  },
  V12: {
    ruleId: 'V12',
    severity: 'medium',
    blockOnWrite: false,
    blockOnIndex: true,
    appliesToSources: 'all',
    reason: 'Memory content with zero topical overlap with spec trigger_phrases suggests off-target capture.',
  },
};

const HARD_BLOCK_RULES: readonly QualityRuleId[] = Object.values(VALIDATION_RULE_METADATA)
  .filter((metadata) => metadata.blockOnWrite)
  .map((metadata) => metadata.ruleId);

interface RuleResult {
  ruleId: QualityRuleId;
  passed: boolean;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  failedRules: QualityRuleId[];
  ruleResults: RuleResult[];
  contaminationAudit: ContaminationAuditRecord;
}

const FALLBACK_DECISION_REGEX = /No (specific )?decisions were made/i;
const NON_OPTIONAL_FIELDS = ['decisions', 'next_actions', 'blockers', 'readiness'];
const PLACEHOLDER_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /(^|\|)\s*\/100\b/m, label: 'dangling score denominator' },
  { pattern: /Confidence:\s*%/i, label: 'empty confidence percent' },
  { pattern: /\|\s*(Knowledge|Uncertainty|Context) Score\s*\|\s*\/100\s*\|/i, label: 'empty preflight score' },
  { pattern: /\|\s*Timestamp\s*\|\s*\|\s*Session start\s*\|/i, label: 'empty preflight timestamp' },
  { pattern: /-\s*Readiness:\s*$/im, label: 'empty readiness value' },
  { pattern: /(^title:\s*"|^#\s+)To promote a memory to constitutional tier/im, label: 'template instructional banner leakage' },
  { pattern: /^<!--\s*Template Configuration Comments/im, label: 'template configuration leakage' },
  { pattern: /^<!--\s*SESSION CONTEXT DOCUMENTATION v/im, label: 'template footer leakage' },
];
const EXECUTION_SIGNAL_PATTERNS = [
  /\*\*Tool:\s+/i,                         // actual tool invocation
  /\|\s*Tool Executions\s*\|\s*[1-9]/i,    // table says non-zero tools
  /\btool_calls?\b/i,                      // explicit tool_call reference
];
const SPEC_ID_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/g;
const TITLE_CONTAMINATION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /^(to promote a memory|epistemic state captured at session start|table of contents)\b/i, label: 'template instructional heading' },
  { pattern: /^\[[^\]]+\]$/i, label: 'placeholder bracket title' },
  { pattern: /^(untitled|draft|todo|tbd)(?:\s+(memory|session|summary|document|notes?))?$/i, label: 'generic stub title' },
  { pattern: /^\d{3}(?:-[a-z0-9][a-z0-9-]*)?$/i, label: 'spec-id-only title' },
];

function extractFrontMatter(content: string): string {
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    return frontMatterMatch[1];
  }

  const fencedYamlMatch = content.match(/```yaml\n([\s\S]*?)\n```/i);
  return fencedYamlMatch ? fencedYamlMatch[1] : '';
}

function stripCodeSegments(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '\n')
    .replace(/`[^`\n]+`/g, ' ');
}

function extractYamlValue(frontMatter: string, key: string): string | null {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = frontMatter.match(new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim() : null;
}

function extractYamlValueFromContent(content: string, key: string): string | null {
  const frontMatter = extractFrontMatter(content);
  const direct = extractYamlValue(frontMatter, key);
  if (direct) {
    return direct.replace(/^['"]|['"]$/g, '');
  }

  const fencedBlocks = content.match(/```yaml\n([\s\S]*?)\n```/gi) ?? [];
  for (const block of fencedBlocks) {
    const inner = block.replace(/^```yaml\n/i, '').replace(/\n```$/i, '');
    const value = extractYamlValue(inner, key);
    if (value) {
      return value.replace(/^['"]|['"]$/g, '');
    }
  }

  return null;
}

function parseYamlList(frontMatter: string, key: string): string[] {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const inlineMatch = frontMatter.match(new RegExp(`^${escapedKey}:\\s*\\[(.*)\\]\\s*$`, 'm'));
  if (inlineMatch) {
    const rawInline = inlineMatch[1].trim();
    if (!rawInline) {
      return [];
    }

    const quoted = rawInline.replace(/'/g, '"');
    try {
      const parsed = JSON.parse(`[${quoted}]`);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Fall through to comma-delimited parsing.
      }
    }

    return rawInline
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter((item) => item.length > 0);
  }

  const lines = frontMatter.split('\n');
  const keyRegex = new RegExp(`^${escapedKey}:\\s*$`);
  const list: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (!inList && keyRegex.test(line)) {
      inList = true;
      continue;
    }

    if (!inList) {
      continue;
    }

    const listItemMatch = line.match(/^\s*-\s*(.+)$/);
    if (listItemMatch) {
      list.push(listItemMatch[1].replace(/^['"]|['"]$/g, '').trim());
      continue;
    }

    if (line.trim() === '[]') {
      return [];
    }

    if (line.trim() !== '') {
      break;
    }
  }

  return list;
}

function parseYamlListFromContent(content: string, key: string): string[] {
  const frontMatter = extractFrontMatter(content);
  const direct = parseYamlList(frontMatter, key);
  if (direct.length > 0) {
    return direct;
  }

  const fencedBlocks = content.match(/```yaml\n([\s\S]*?)\n```/gi) ?? [];
  for (const block of fencedBlocks) {
    const inner = block.replace(/^```yaml\n/i, '').replace(/\n```$/i, '');
    const list = parseYamlList(inner, key);
    if (list.length > 0) {
      return list;
    }
  }

  return direct;
}

function parseToolCount(content: string): number {
  const raw = extractYamlValueFromContent(content, 'tool_count');
  if (raw) {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  // Fallback: parse from rendered markdown table (| Tool Executions | N |)
  const tableMatch = content.match(/\|\s*Tool Executions\s*\|\s*(\d+)\s*\|/i);
  if (tableMatch) {
    const parsed = Number.parseInt(tableMatch[1], 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function parseYamlIntegerFromContent(content: string, key: string): number | null {
  const raw = extractYamlValueFromContent(content, key);
  if (!raw) {
    return null;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasSignificantFileCountDivergence(
  filesystemFileCount: number | null,
  capturedFileCount: number | null,
): boolean {
  if (filesystemFileCount === null || capturedFileCount === null) {
    return false;
  }

  const maxCount = Math.max(filesystemFileCount, capturedFileCount);
  const minCount = Math.min(filesystemFileCount, capturedFileCount);
  if (maxCount <= 2) {
    return false;
  }

  // When one count is 0, the session produced no file references
  // (newly created specs, research sessions, non-file-tool CLIs).
  // Not a divergence signal -- skip.
  if (minCount === 0) {
    return false;
  }

  const ratio = maxCount / minCount;
  const absoluteDifference = maxCount - minCount;
  return ratio >= 2 && absoluteDifference >= 5;
}

function countDistinctSpecIds(content: string): Map<string, number> {
  const matches = content.match(SPEC_ID_REGEX) ?? [];
  const counts = new Map<string, number>();

  for (const match of matches) {
    counts.set(match, (counts.get(match) ?? 0) + 1);
  }

  return counts;
}

function countSpecIdsInValues(values: string[]): Map<string, number> {
  return countDistinctSpecIds(values.join('\n'));
}

function extractCurrentSpecId(specFolder: string): string | null {
  const matches = specFolder.match(SPEC_ID_REGEX);
  return matches ? matches[matches.length - 1] : null;
}

/**
 * CG-07c: Extract all spec IDs from the full spec folder path.
 * Child specs (nested paths) legitimately reference parent spec IDs,
 * so all ancestor IDs must be treated as "allowed" rather than foreign.
 * Example: "010-perfect-session-capturing/012-template-compliance"
 *   -> allowed = { "010-perfect-session-capturing", "012-template-compliance" }
 */
function extractAllowedSpecIds(specFolder: string): Set<string> {
  const matches = specFolder.match(SPEC_ID_REGEX) ?? [];
  return new Set(matches);
}

function extractFirstHeading(content: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : '';
}

function ruleAppliesToSource(
  metadata: ValidationRuleMetadata,
  source?: DataSource | string | null,
): boolean {
  if (metadata.appliesToSources === 'all') {
    return true;
  }

  const capabilities = getSourceCapabilities(source);
  return metadata.appliesToSources.includes(capabilities.source);
}

function getRuleMetadata(ruleId: QualityRuleId): ValidationRuleMetadata {
  return VALIDATION_RULE_METADATA[ruleId];
}

function shouldBlockWrite(ruleId: QualityRuleId, source?: DataSource | string | null): boolean {
  const metadata = getRuleMetadata(ruleId);
  return metadata.blockOnWrite && ruleAppliesToSource(metadata, source);
}

function shouldBlockIndex(ruleId: QualityRuleId, source?: DataSource | string | null): boolean {
  const metadata = getRuleMetadata(ruleId);
  return metadata.blockOnIndex && ruleAppliesToSource(metadata, source);
}

function determineValidationDisposition(
  failedRules: readonly QualityRuleId[],
  source?: DataSource | string | null,
): ValidationDispositionResult {
  const blockingRuleIds = failedRules.filter((ruleId) => shouldBlockWrite(ruleId, source));
  if (blockingRuleIds.length > 0) {
    return {
      disposition: 'abort_write',
      blockingRuleIds,
      indexBlockingRuleIds: blockingRuleIds,
      softRuleIds: failedRules.filter((ruleId) => !blockingRuleIds.includes(ruleId)),
    };
  }

  const indexBlockingRuleIds = failedRules.filter((ruleId) => shouldBlockIndex(ruleId, source));
  if (indexBlockingRuleIds.length > 0) {
    return {
      disposition: 'write_skip_index',
      blockingRuleIds: [],
      indexBlockingRuleIds,
      softRuleIds: failedRules.filter((ruleId) => !indexBlockingRuleIds.includes(ruleId)),
    };
  }

  return {
    disposition: 'write_and_index',
    blockingRuleIds: [],
    indexBlockingRuleIds: [],
    softRuleIds: [...failedRules],
  };
}

function hasExecutionSignals(content: string): boolean {
  return EXECUTION_SIGNAL_PATTERNS.some((pattern) => pattern.test(content));
}

function validateMemoryQualityContent(content: string): ValidationResult {
  const frontMatter = extractFrontMatter(content);
  const toolCount = parseToolCount(content);
  const specFolder = extractYamlValueFromContent(content, 'spec_folder') || '';

  const ruleResults: RuleResult[] = [];

  const v1FailedField = NON_OPTIONAL_FIELDS.find((field) => {
    const pattern = new RegExp(`^${field}:.*\\[TBD\\]`, 'im');
    return pattern.test(content);
  });
  ruleResults.push({
    ruleId: 'V1',
    passed: !v1FailedField,
    message: v1FailedField
      ? `placeholder leakage: field=${v1FailedField}`
      : 'ok',
  });

  const hasNaPlaceholder = /\[N\/A\]/i.test(content);
  ruleResults.push({
    ruleId: 'V2',
    passed: !(toolCount > 0 && hasNaPlaceholder),
    message: toolCount > 0 && hasNaPlaceholder
      ? 'placeholder leakage: [N/A] present with tool execution data'
      : 'ok',
  });

  const malformedSpecFolder =
    /\*\*|\*|\[/.test(specFolder) ||
    /Before I proceed/i.test(specFolder);
  ruleResults.push({
    ruleId: 'V3',
    passed: !malformedSpecFolder,
    message: malformedSpecFolder ? 'malformed spec_folder' : 'ok',
  });

  const hasFallbackDecision = FALLBACK_DECISION_REGEX.test(content);
  ruleResults.push({
    ruleId: 'V4',
    passed: !hasFallbackDecision,
    message: hasFallbackDecision ? 'fallback decision text present' : 'ok',
  });

  const triggerPhrases = parseYamlListFromContent(content, 'trigger_phrases');
  const sparseSemantic = toolCount >= 5 && triggerPhrases.length === 0;
  ruleResults.push({
    ruleId: 'V5',
    passed: !sparseSemantic,
    message: sparseSemantic ? 'sparse semantic fields: trigger_phrases empty' : 'ok',
  });

  const placeholderContent = stripCodeSegments(content);
  const placeholderLeak = PLACEHOLDER_PATTERNS.find(({ pattern }) => pattern.test(placeholderContent));
  ruleResults.push({
    ruleId: 'V6',
    passed: !placeholderLeak,
    message: placeholderLeak ? `placeholder leakage: ${placeholderLeak.label}` : 'ok',
  });

  const contradictoryToolState = toolCount === 0 && hasExecutionSignals(content);
  ruleResults.push({
    ruleId: 'V7',
    passed: !contradictoryToolState,
    message: contradictoryToolState ? 'contradictory tool state: tool_count is 0 but execution artifacts are present' : 'ok',
  });

  const currentSpecId = extractCurrentSpecId(specFolder);
  // CG-07c: Use the full set of allowed IDs (current + all ancestors in path).
  // Child spec memory files legitimately reference parent spec IDs, so ancestor
  // IDs must not be treated as foreign contamination.
  const allowedSpecIds = extractAllowedSpecIds(specFolder);
  const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const specIdCounts = countDistinctSpecIds(bodyContent);
  const keyTopics = parseYamlListFromContent(content, 'key_topics');
  const frontmatterSpecCounts = countSpecIdsInValues([...triggerPhrases, ...keyTopics]);
  const foreignFrontmatterMentions = [...frontmatterSpecCounts.entries()]
    .filter(([specId]) => !allowedSpecIds.has(specId))
    .map(([specId, count]) => `${specId} x${count}`);
  let dominatesForeignSpec = false;
  let scatteredForeignSpec = false;
  const scatteredForeignMentions: string[] = [];
  if (specIdCounts.size > 0) {
    const currentSpecMentions = currentSpecId ? (specIdCounts.get(currentSpecId) ?? 0) : 0;
    let strongestForeignMentions = 0;
    let totalForeignMentions = 0;
    for (const [specId, count] of specIdCounts.entries()) {
      if (!allowedSpecIds.has(specId)) {
        totalForeignMentions += count;
        if (count > strongestForeignMentions) {
          strongestForeignMentions = count;
        }
        if (count <= 2) {
          scatteredForeignMentions.push(`${specId} x${count}`);
        }
      }
    }
    dominatesForeignSpec = strongestForeignMentions >= 3 && strongestForeignMentions >= currentSpecMentions + 2;
    scatteredForeignSpec = scatteredForeignMentions.length >= 2 && totalForeignMentions >= 2 && strongestForeignMentions <= 2;
  }
  const frontmatterForeignSpec = foreignFrontmatterMentions.length > 0;
  const v8Matches = [
    ...(frontmatterForeignSpec ? foreignFrontmatterMentions.map((match) => `frontmatter:${match}`) : []),
    ...(dominatesForeignSpec ? ['body:foreign spec ids dominate rendered content'] : []),
    ...(scatteredForeignSpec ? scatteredForeignMentions.map((match) => `body-scattered:${match}`) : []),
  ];
  ruleResults.push({
    ruleId: 'V8',
    passed: v8Matches.length === 0,
    message: v8Matches.length > 0
      ? `spec relevance mismatch: ${v8Matches.join(', ')}`
      : 'ok',
  });

  const titleValue = extractYamlValueFromContent(content, 'title') || extractFirstHeading(content);
  const titlePatternMatch = TITLE_CONTAMINATION_PATTERNS.find(({ pattern }) => pattern.test(titleValue));
  ruleResults.push({
    ruleId: 'V9',
    passed: !titlePatternMatch,
    message: titlePatternMatch ? `contaminated title: ${titlePatternMatch.label}` : 'ok',
  });

  const capturedFileCount = parseYamlIntegerFromContent(content, 'captured_file_count');
  const filesystemFileCount = parseYamlIntegerFromContent(content, 'filesystem_file_count');
  const divergentSessionSource = hasSignificantFileCountDivergence(filesystemFileCount, capturedFileCount);
  ruleResults.push({
    ruleId: 'V10',
    passed: !divergentSessionSource,
    message: divergentSessionSource
      ? `session source mismatch: filesystem_file_count=${filesystemFileCount}, captured_file_count=${capturedFileCount}`
      : 'ok',
  });

  // V11: API error content leakage — detect error-dominated memory content
  const ERROR_VOCAB = /\b(?:error|api_error|request_id|req_\w+|500|503|429|overloaded|internal.server)\b/i;
  const API_ERROR_PATTERN = /\bAPI\s+Error:\s*\d{3}\b/i;
  const JSON_ERROR_PATTERN = /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error|rate_limit_error|server_error)/i;
  const descriptionValue = extractYamlValueFromContent(content, 'description') || '';
  const hasErrorDescription = API_ERROR_PATTERN.test(descriptionValue) || JSON_ERROR_PATTERN.test(descriptionValue);
  const hasErrorTitle = API_ERROR_PATTERN.test(titleValue) || JSON_ERROR_PATTERN.test(titleValue);
  const errorTriggerCount = triggerPhrases.filter((tp) => ERROR_VOCAB.test(tp)).length;
  const errorDominatedTriggers = triggerPhrases.length > 0 && (errorTriggerCount / triggerPhrases.length) > 0.5;
  const v11Failed = hasErrorDescription || hasErrorTitle || errorDominatedTriggers;
  ruleResults.push({
    ruleId: 'V11',
    passed: !v11Failed,
    message: v11Failed
      ? `error content leakage: ${[
          hasErrorDescription ? 'description' : '',
          hasErrorTitle ? 'title' : '',
          errorDominatedTriggers ? `trigger_phrases(${errorTriggerCount}/${triggerPhrases.length})` : '',
        ].filter(Boolean).join(', ')}`
      : 'ok',
  });

  // V12: Topical coherence — check if memory content overlaps with spec's trigger_phrases
  let v12Failed = false;
  let v12Message = 'ok';
  if (specFolder) {
    // Try to find and read the spec.md file
    const specMdCandidates = [
      path.resolve(specFolder, 'spec.md'),
      // specFolder might be just a relative path or short name
    ];
    let specTriggerPhrases: string[] = [];
    for (const candidate of specMdCandidates) {
      if (fs.existsSync(candidate)) {
        try {
          const specContent = fs.readFileSync(candidate, 'utf-8');
          specTriggerPhrases = parseYamlListFromContent(specContent, 'trigger_phrases');
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          structuredLog('warn', 'Failed to read spec.md during V12 topical coherence validation', {
            candidate,
            specFolder,
            error: message,
          });
        }
        break;
      }
    }
    if (specTriggerPhrases.length > 0) {
      const lowerContent = content.toLowerCase();
      const hasOverlap = specTriggerPhrases.some(phrase => lowerContent.includes(phrase.toLowerCase()));
      if (!hasOverlap) {
        v12Failed = true;
        v12Message = `V12_TOPICAL_MISMATCH: zero of ${specTriggerPhrases.length} spec trigger_phrases found in memory content`;
      }
    }
  }
  ruleResults.push({
    ruleId: 'V12',
    passed: !v12Failed,
    message: v12Message,
  });

  const failedRules = ruleResults.filter((rule) => !rule.passed).map((rule) => rule.ruleId);
  const contaminationAudit: ContaminationAuditRecord = {
    stage: 'post-render',
    timestamp: new Date().toISOString(),
    patternsChecked: [
      'frontmatter:trigger_phrases',
      'frontmatter:key_topics',
      'body:foreign-spec-dominance',
      'body:foreign-spec-scatter',
      ...TITLE_CONTAMINATION_PATTERNS.map(({ label }) => `title:${label}`),
    ],
    matchesFound: [
      ...v8Matches,
      ...(titlePatternMatch ? [`title:${titlePatternMatch.label}`] : []),
    ],
    actionsTaken: [
      `failed_rules:${failedRules.filter((ruleId) => ruleId === 'V8' || ruleId === 'V9').join(',') || 'none'}`,
    ],
    passedThrough: [
      `current_spec:${currentSpecId ?? 'unknown'}`,
      `trigger_phrases:${triggerPhrases.length}`,
      `key_topics:${keyTopics.length}`,
      `captured_file_count:${capturedFileCount ?? 'unknown'}`,
      `filesystem_file_count:${filesystemFileCount ?? 'unknown'}`,
    ],
  };
  structuredLog('info', 'contamination_audit', contaminationAudit);

  return {
    valid: failedRules.length === 0,
    failedRules,
    ruleResults,
    contaminationAudit,
  };
}

function validateMemoryQualityFile(filePath: string): ValidationResult {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`Cannot read ${filePath}: ${message}`);
    return {
      valid: false,
      failedRules: ['V1'],
      ruleResults: [{ ruleId: 'V1', passed: false, message: `Cannot read file: ${message}` }],
      contaminationAudit: {
        stage: 'post-render',
        timestamp: new Date().toISOString(),
        patternsChecked: [],
        matchesFound: [`file-read-error:${message}`],
        actionsTaken: ['failed_rules:V1'],
        passedThrough: [],
      },
    };
  }
  return validateMemoryQualityContent(content);
}

export {
  HARD_BLOCK_RULES,
  VALIDATION_RULE_METADATA,
  determineValidationDisposition,
  getRuleMetadata,
  shouldBlockIndex,
  shouldBlockWrite,
  validateMemoryQualityContent,
  validateMemoryQualityFile,
};

export type {
  ValidationDisposition,
  ValidationDispositionResult,
  ValidationRuleMetadata,
  ValidationRuleSeverity,
  QualityRuleId,
  ValidationResult,
  RuleResult,
};
