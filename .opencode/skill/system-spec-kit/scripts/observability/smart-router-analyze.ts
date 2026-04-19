#!/usr/bin/env npx tsx
// ---------------------------------------------------------------
// MODULE: Smart Router Telemetry Analyzer
// ---------------------------------------------------------------
// Aggregates smart-router compliance JSONL into a markdown report.

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  ComplianceClass,
  ComplianceRecord,
} from './smart-router-telemetry.js';

export interface AnalyzerOptions {
  readonly workspaceRoot?: string;
  readonly inputPath?: string;
  readonly outputPath?: string;
  readonly timestamp?: string;
}

export interface PerSkillTelemetrySummary {
  readonly skill: string;
  readonly total: number;
  readonly classDistribution: Record<ComplianceClass, number>;
  readonly overloadRate: number;
  readonly underloadRate: number;
  readonly onDemandTriggerRate: number;
}

export interface TelemetryAnalysis {
  readonly generatedAt: string;
  readonly inputPath: string;
  readonly totalRecords: number;
  readonly parseErrors: number;
  readonly classDistribution: Record<ComplianceClass, number>;
  readonly perSkill: PerSkillTelemetrySummary[];
  readonly noData: boolean;
}

const DEFAULT_INPUT_PATH = '.opencode/skill/.smart-router-telemetry/compliance.jsonl';
const DEFAULT_OUTPUT_DIR = '.opencode/skill/system-spec-kit/scripts/observability';
const IS_CLI_ENTRY = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;
const CLASSES: ComplianceClass[] = [
  'always',
  'conditional_expected',
  'on_demand_expected',
  'extra',
  'missing_expected',
  'unknown_unparsed',
];

function locateWorkspaceRoot(startDir = process.cwd()): string {
  let current = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(current, '.opencode', 'skill'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return path.resolve(startDir);
    }
    current = parent;
  }
}

function emptyClassDistribution(): Record<ComplianceClass, number> {
  return {
    always: 0,
    conditional_expected: 0,
    on_demand_expected: 0,
    extra: 0,
    missing_expected: 0,
    unknown_unparsed: 0,
  };
}

function isComplianceClass(value: unknown): value is ComplianceClass {
  return typeof value === 'string' && (CLASSES as string[]).includes(value);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseRecord(line: string): ComplianceRecord | null {
  try {
    const parsed = JSON.parse(line) as Record<string, unknown>;
    if (
      typeof parsed.promptId === 'string'
      && typeof parsed.selectedSkill === 'string'
      && isStringList(parsed.predictedRoute)
      && isStringList(parsed.allowedResources)
      && isStringList(parsed.actualReads)
      && isComplianceClass(parsed.complianceClass)
      && typeof parsed.timestamp === 'string'
    ) {
      return parsed as ComplianceRecord;
    }
    return null;
  } catch {
    return null;
  }
}

function rate(numerator: number, denominator: number): number {
  return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : 0;
}

function hasOnDemandSignal(record: ComplianceRecord): boolean {
  return record.complianceClass === 'on_demand_expected'
    || record.predictedRoute.includes('ON_DEMAND')
    || record.allowedResources.some((resource) => resource.toLowerCase().startsWith('on_demand:'));
}

function isBaselineSkillRead(resourcePath: string): boolean {
  return resourcePath === 'SKILL.md' || resourcePath.endsWith('/SKILL.md');
}

function collapsePromptRecords(records: readonly ComplianceRecord[]): ComplianceRecord[] {
  const byPrompt = new Map<string, ComplianceRecord[]>();
  for (const record of records) {
    byPrompt.set(record.promptId, [...(byPrompt.get(record.promptId) ?? []), record]);
  }

  return [...byPrompt.values()].map((rows) => {
    const first = rows[0];
    if (!first) {
      throw new Error('internal error: empty prompt record group');
    }
    const actualReads = [...new Set(rows.flatMap((row) => row.actualReads))].sort();
    const observedSkills = [...new Set(rows.flatMap((row) => row.observedSkills ?? (row.observedSkill ? [row.observedSkill] : [])))].sort();
    const hasCrossSkill = observedSkills.some((skill) => skill !== first.selectedSkill);
    const nonBaselineReads = actualReads.filter((read) => !isBaselineSkillRead(read));
    const complianceClass: ComplianceClass = hasCrossSkill
      ? 'extra'
      : actualReads.length > 0 && nonBaselineReads.length === 0
        ? 'always'
        : rows.some((row) => row.complianceClass === 'extra')
          ? 'extra'
          : rows.some((row) => row.complianceClass === 'missing_expected')
            ? 'missing_expected'
            : rows.some((row) => row.complianceClass === 'on_demand_expected')
              ? 'on_demand_expected'
              : rows.some((row) => row.complianceClass === 'conditional_expected')
                ? 'conditional_expected'
                : rows.some((row) => row.complianceClass === 'unknown_unparsed')
                  ? 'unknown_unparsed'
                  : 'always';

    return {
      ...first,
      actualReads,
      ...(observedSkills.length > 0 ? { observedSkill: observedSkills.length === 1 ? observedSkills[0] : observedSkills.join(',') } : {}),
      ...(observedSkills.length > 0 ? { observedSkills } : {}),
      complianceClass,
      timestamp: rows[rows.length - 1]?.timestamp ?? first.timestamp,
    };
  });
}

export function analyzeTelemetryRecords(args: {
  readonly records: readonly ComplianceRecord[];
  readonly parseErrors?: number;
  readonly inputPath?: string;
  readonly generatedAt?: string;
}): TelemetryAnalysis {
  const classDistribution = emptyClassDistribution();
  const bySkill = new Map<string, ComplianceRecord[]>();
  const records = collapsePromptRecords(args.records);

  for (const record of records) {
    classDistribution[record.complianceClass] += 1;
    bySkill.set(record.selectedSkill, [...(bySkill.get(record.selectedSkill) ?? []), record]);
  }

  const perSkill = [...bySkill.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([skill, records]) => {
      const distribution = emptyClassDistribution();
      for (const record of records) {
        distribution[record.complianceClass] += 1;
      }
      return {
        skill,
        total: records.length,
        classDistribution: distribution,
        overloadRate: rate(distribution.extra, records.length),
        underloadRate: rate(distribution.missing_expected, records.length),
        onDemandTriggerRate: rate(records.filter(hasOnDemandSignal).length, records.length),
      };
    });

  return {
    generatedAt: args.generatedAt ?? new Date().toISOString(),
    inputPath: args.inputPath ?? DEFAULT_INPUT_PATH,
    totalRecords: records.length,
    parseErrors: args.parseErrors ?? 0,
    classDistribution,
    perSkill,
    noData: records.length === 0,
  };
}

export function readTelemetryJsonl(inputPath: string): { records: ComplianceRecord[]; parseErrors: number } {
  if (!fs.existsSync(inputPath)) {
    return { records: [], parseErrors: 0 };
  }
  const records: ComplianceRecord[] = [];
  let parseErrors = 0;
  for (const line of fs.readFileSync(inputPath, 'utf8').split('\n')) {
    if (line.trim().length === 0) {
      continue;
    }
    const record = parseRecord(line);
    if (record) {
      records.push(record);
    } else {
      parseErrors += 1;
    }
  }
  return { records, parseErrors };
}

function percent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatTelemetryAnalysisReport(analysis: TelemetryAnalysis): string {
  const lines: string[] = [
    '# Smart Router Telemetry Analysis Report',
    '',
    `Generated: ${analysis.generatedAt}`,
    `Input: ${analysis.inputPath}`,
    '',
  ];

  if (analysis.noData) {
    lines.push(
      '## Summary',
      '',
      'No telemetry data yet. Run the live-session wrapper first, then rerun this analyzer.',
      '',
      `Parse errors skipped: ${analysis.parseErrors}`,
      '',
    );
    return `${lines.join('\n')}\n`;
  }

  lines.push(
    '## Summary',
    '',
    `- Total records: ${analysis.totalRecords}`,
    `- Parse errors skipped: ${analysis.parseErrors}`,
    '',
    '## Compliance Class Distribution',
    '',
    '| Class | Count | Share |',
    '|-------|-------|-------|',
  );

  for (const className of CLASSES) {
    const count = analysis.classDistribution[className];
    lines.push(`| ${className} | ${count} | ${percent(rate(count, analysis.totalRecords))} |`);
  }

  lines.push(
    '',
    '## Per-Skill Compliance',
    '',
    '| Skill | Records | Always | Conditional | ON_DEMAND | Extra | Missing | Unknown | Over-Load Rate | Under-Load Rate | ON_DEMAND Trigger Rate |',
    '|-------|---------|--------|-------------|-----------|-------|---------|---------|----------------|-----------------|------------------------|',
  );

  for (const skill of analysis.perSkill) {
    lines.push([
      `| ${skill.skill}`,
      String(skill.total),
      String(skill.classDistribution.always),
      String(skill.classDistribution.conditional_expected),
      String(skill.classDistribution.on_demand_expected),
      String(skill.classDistribution.extra),
      String(skill.classDistribution.missing_expected),
      String(skill.classDistribution.unknown_unparsed),
      percent(skill.overloadRate),
      percent(skill.underloadRate),
      `${percent(skill.onDemandTriggerRate)} |`,
    ].join(' | '));
  }

  lines.push(
    '',
    '## Interpretation Notes',
    '',
    '- Over-load rate counts records classified as `extra`: the session read resources outside the predicted route.',
    '- Under-load rate counts records classified as `missing_expected`: the session missed a predicted required resource.',
    '- ON_DEMAND trigger rate counts records with an ON_DEMAND route or ON_DEMAND compliance class.',
    '- Static measurement records from `smart-router-measurement.ts` intentionally appear as `unknown_unparsed` and should not be mixed with live-session compliance conclusions.',
    '',
  );

  return `${lines.join('\n')}\n`;
}

function defaultOutputPath(workspaceRoot: string, timestamp: string): string {
  const safeTimestamp = timestamp.replace(/[:.]/g, '-');
  return path.join(workspaceRoot, DEFAULT_OUTPUT_DIR, `smart-router-analyze-report-${safeTimestamp}.md`);
}

export function analyzeTelemetryFile(options: AnalyzerOptions = {}): TelemetryAnalysis {
  const workspaceRoot = options.workspaceRoot ?? locateWorkspaceRoot();
  const inputPath = path.resolve(workspaceRoot, options.inputPath ?? DEFAULT_INPUT_PATH);
  const { records, parseErrors } = readTelemetryJsonl(inputPath);
  return analyzeTelemetryRecords({
    records,
    parseErrors,
    inputPath,
    generatedAt: options.timestamp,
  });
}

export function writeTelemetryAnalysisReport(analysis: TelemetryAnalysis, options: AnalyzerOptions = {}): string {
  const workspaceRoot = options.workspaceRoot ?? locateWorkspaceRoot();
  const outputPath = options.outputPath
    ? path.resolve(workspaceRoot, options.outputPath)
    : defaultOutputPath(workspaceRoot, analysis.generatedAt);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, formatTelemetryAnalysisReport(analysis), 'utf8');
  return outputPath;
}

function argValue(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function main(): void {
  const args = process.argv.slice(2);
  const workspaceRoot = path.resolve(argValue(args, '--workspace-root') ?? locateWorkspaceRoot());
  const analysis = analyzeTelemetryFile({
    workspaceRoot,
    inputPath: argValue(args, '--input'),
  });
  const outputPath = writeTelemetryAnalysisReport(analysis, {
    workspaceRoot,
    outputPath: argValue(args, '--output'),
  });
  process.stdout.write(`Smart-router analysis complete: ${analysis.totalRecords} records, ${analysis.parseErrors} parse errors\n`);
  process.stdout.write(`Report: ${outputPath}\n`);
}

if (IS_CLI_ENTRY) {
  main();
}
