#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. VALIDATE MEMORY QUALITY
// ───────────────────────────────────────────────────────────────
// Post-render quality gate for generated memory files

import fs from 'fs';
import path from 'path';
import { structuredLog } from '../utils/logger';
import type { ContaminationAuditRecord } from '../lib/content-filter';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10';

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
  /\*\*Tool:\s+/i,
  /\|\s*Tool Executions\s*\|\s*[1-9]/i,
  /\btool_calls?\b/i,
  /\*\*Key Files:\*\*/i,
  /### Files (Modified|Created)/i,
  /`[^`]+\.(ts|tsx|js|jsx|py|sh|md|json|jsonc|yml|yaml|toml|css|html)`/i,
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

  if (minCount === 0) {
    return maxCount >= 4;
  }

  const ratio = maxCount / minCount;
  const absoluteDifference = maxCount - minCount;
  return ratio >= 2 && absoluteDifference >= 3;
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

function extractFirstHeading(content: string): string {
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : '';
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
  const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const specIdCounts = countDistinctSpecIds(bodyContent);
  const keyTopics = parseYamlListFromContent(content, 'key_topics');
  const frontmatterSpecCounts = countSpecIdsInValues([...triggerPhrases, ...keyTopics]);
  const foreignFrontmatterMentions = [...frontmatterSpecCounts.entries()]
    .filter(([specId]) => specId !== currentSpecId)
    .map(([specId, count]) => `${specId} x${count}`);
  let dominatesForeignSpec = false;
  let scatteredForeignSpec = false;
  const scatteredForeignMentions: string[] = [];
  if (specIdCounts.size > 0) {
    const currentSpecMentions = currentSpecId ? (specIdCounts.get(currentSpecId) ?? 0) : 0;
    let strongestForeignMentions = 0;
    let totalForeignMentions = 0;
    for (const [specId, count] of specIdCounts.entries()) {
      if (specId !== currentSpecId) {
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

function main(): void {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node validate-memory-quality.js <memory-file-path>');
    process.exit(2);
  }

  const resolvedPath = path.resolve(inputPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(2);
  }

  const result = validateMemoryQualityFile(resolvedPath);
  if (!result.valid) {
    console.error(`QUALITY_GATE_FAIL: ${result.failedRules.join(', ')}`);
    for (const failed of result.ruleResults.filter((rule) => !rule.passed)) {
      console.error(`${failed.ruleId}: ${failed.message}`);
    }
    process.exit(1);
  }

  console.log('QUALITY_GATE_PASS');
}

if (require.main === module) {
  main();
}

export {
  validateMemoryQualityContent,
  validateMemoryQualityFile,
};

export type {
  QualityRuleId,
  ValidationResult,
  RuleResult,
};
