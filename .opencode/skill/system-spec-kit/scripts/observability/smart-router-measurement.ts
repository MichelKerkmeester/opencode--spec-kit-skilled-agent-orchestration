#!/usr/bin/env npx tsx
// ---------------------------------------------------------------
// MODULE: Smart Router Measurement
// ---------------------------------------------------------------
// Static corpus harness for predicted smart-router loads. This measures
// advisor top-1 accuracy and predicted resource routes. It does not observe
// live AI file reads.

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildSkillAdvisorBrief,
  type AdvisorHookResult,
} from '../../mcp_server/skill-advisor/lib/skill-advisor-brief.js';
import { recordSmartRouterCompliance } from './smart-router-telemetry.js';

export interface CorpusRow {
  readonly id: string;
  readonly prompt: string;
  readonly skill_top_1?: string;
}

export interface RoutePrediction {
  readonly skill: string;
  readonly variant: string;
  readonly predictedRoute: string[];
  readonly allowedResources: string[];
  readonly alwaysResources: string[];
  readonly conditionalResources: string[];
  readonly onDemandResources: string[];
  readonly allowedResourceCount: number;
  readonly allowedBytes: number;
  readonly treeBytes: number;
  readonly briefBytes: number;
  readonly unknown: boolean;
}

export interface MeasurementPromptResult {
  readonly id: string;
  readonly labelSkill: string | null;
  readonly advisorTopSkill: string | null;
  readonly confidence: number | null;
  readonly uncertainty: number | null;
  readonly advisorStatus: string;
  readonly advisorFreshness: string;
  readonly correct: boolean;
  readonly prediction: RoutePrediction;
}

export interface SkillMeasurementSummary {
  readonly skill: string;
  readonly total: number;
  readonly correct: number;
  readonly accuracy: number;
  readonly onDemandHits: number;
  readonly onDemandHitRate: number;
  readonly averageAllowedResources: number;
  readonly medianAllowedResources: number;
  readonly averageBriefBytes: number;
  readonly averageTreeBytes: number;
  readonly averagePredictedContextBytes: number;
  readonly averageBriefSavingsRate: number;
  readonly averagePredictedContextSavingsRate: number;
}

export interface MeasurementSummary {
  readonly totalPrompts: number;
  readonly correct: number;
  readonly accuracy: number;
  readonly perSkill: SkillMeasurementSummary[];
  readonly allowedResourceDistribution: Record<string, number>;
  readonly results: MeasurementPromptResult[];
  readonly generatedAt: string;
  readonly caveat: string;
}

export interface MeasurementOptions {
  readonly workspaceRoot?: string;
  readonly corpusPath?: string;
  readonly outputPath?: string;
  readonly jsonlOutputPath?: string;
  readonly limit?: number;
  readonly corpusRows?: readonly CorpusRow[];
  readonly recordTelemetry?: boolean;
  readonly liveStream?: boolean;
  readonly telemetryOutputPath?: string;
  readonly buildBrief?: typeof buildSkillAdvisorBrief;
}

interface RouterModel {
  readonly variant: string;
  readonly routerText: string;
  readonly alwaysResources: string[];
  readonly intentResources: Map<string, string[]>;
  readonly intentKeywords: Map<string, string[]>;
  readonly onDemandKeywords: string[];
  readonly onDemandResources: string[];
  readonly referencedResources: string[];
  readonly unknown: boolean;
}

const DEFAULT_CORPUS_PATH = '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl';
const DEFAULT_REPORT_PATH = '.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-report.md';
const DEFAULT_JSONL_PATH = '.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl';
const DEFAULT_STATIC_COMPLIANCE_PATH = '.opencode/reports/smart-router-static/compliance.jsonl';
const UNKNOWN_RESOURCE = '__unknown_unparsed__';
const IS_CLI_ENTRY = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort();
}

function median(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? 0;
  }
  return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function readTextIfExists(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function markdownTreeBytes(skillDir: string): number {
  let total = 0;
  const skillMd = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMd)) {
    total += fs.statSync(skillMd).size;
  }
  for (const baseName of ['references', 'assets']) {
    const base = path.join(skillDir, baseName);
    if (!fs.existsSync(base)) {
      continue;
    }
    const pending = [base];
    while (pending.length > 0) {
      const current = pending.pop();
      if (!current) {
        continue;
      }
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const entryPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          pending.push(entryPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          total += fs.statSync(entryPath).size;
        }
      }
    }
  }
  return total;
}

function bytesForResources(skillDir: string, resources: readonly string[]): number {
  let total = fs.existsSync(path.join(skillDir, 'SKILL.md'))
    ? fs.statSync(path.join(skillDir, 'SKILL.md')).size
    : 0;
  for (const resource of resources) {
    const resourcePath = path.join(skillDir, resource);
    if (fs.existsSync(resourcePath) && fs.statSync(resourcePath).isFile()) {
      total += fs.statSync(resourcePath).size;
    }
  }
  return total;
}

function normalizeResource(value: string): string | null {
  let cleaned = value.trim().replace(/^["'`]+|["'`]+$/g, '').replace(/\\/g, '/');
  while (cleaned.startsWith('./')) {
    cleaned = cleaned.slice(2);
  }
  if (!cleaned.endsWith('.md')) {
    return null;
  }
  if (!cleaned.startsWith('references/') && !cleaned.startsWith('assets/')) {
    return null;
  }
  return cleaned;
}

function stackFolderPairs(routerText: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  const pairPattern = /"([A-Z_]+)"\s*:\s*\("([^"]+)",\s*"([^"]+)"\)/g;
  for (const match of routerText.matchAll(pairPattern)) {
    const category = match[2];
    const folder = match[3];
    if (category && folder) {
      pairs.push([category, folder]);
    }
  }
  return pairs;
}

function expandDynamicResource(resource: string, routerText: string): string[] {
  const normalized = normalizeResource(resource);
  if (!normalized) {
    return [];
  }
  if (normalized.includes('{category}') && normalized.includes('{folder}')) {
    return stackFolderPairs(routerText).map(([category, folder]) => (
      normalized.replace('{category}', category).replace('{folder}', folder)
    ));
  }
  if (normalized.includes('{') || normalized.includes('}')) {
    return [];
  }
  return [normalized];
}

function extractResources(text: string, routerText: string): string[] {
  const resources: string[] = [];
  const resourcePattern = /(?<![\w.-])((?:\.\/)?(?:references|assets)\/[A-Za-z0-9_./{}-]+\.md)/g;
  for (const match of text.matchAll(resourcePattern)) {
    const value = match[1];
    if (value) {
      resources.push(...expandDynamicResource(value, routerText));
    }
  }
  return uniqueSorted(resources);
}

function findRouterBlock(skillText: string): string {
  const marker = skillText.match(/^### Smart Router Pseudocode\s*$/m);
  if (marker?.index !== undefined) {
    const remainder = skillText.slice(marker.index + marker[0].length);
    const block = remainder.match(/```(?:python|text|bash)?\s*\n([\s\S]*?)```/);
    if (block?.[1]) {
      return block[1];
    }
  }

  const smartSection = skillText.match(/<!-- ANCHOR:smart-routing -->([\s\S]*?)<!-- \/ANCHOR:smart-routing -->/);
  if (smartSection?.[1]) {
    const blocks = [...smartSection[1].matchAll(/```(?:python|text|bash)?\s*\n([\s\S]*?)```/g)]
      .map((match) => match[1] ?? '')
      .filter(Boolean);
    return blocks.length > 0 ? blocks.join('\n\n') : smartSection[1];
  }

  return '';
}

function detectVariant(routerText: string): string {
  if (routerText.includes('INTENT_SIGNALS') && routerText.includes('RESOURCE_MAP')) {
    return 'canonical';
  }
  if (routerText.includes('INTENT_MODEL') && routerText.includes('LOAD_LEVELS')) {
    return 'intent_model_load_levels';
  }
  if (routerText.includes('DEFAULT_RESOURCES') && routerText.includes('ON_DEMAND_KEYWORDS')) {
    return 'default_resources_on_demand_keywords';
  }
  return 'unknown';
}

function findAssignmentBlock(routerText: string, name: string): string | null {
  const pattern = new RegExp(`^\\s*${name}\\s*=\\s*(?<value>\\[[\\s\\S]*?\\]|["'][\\s\\S]*?["'])`, 'm');
  const match = routerText.match(pattern);
  return match?.groups?.value ?? null;
}

function extractNamedAssignments(routerText: string, names: readonly string[]): string[] {
  const resources: string[] = [];
  for (const name of names) {
    const block = findAssignmentBlock(routerText, name);
    if (block) {
      resources.push(...extractResources(block, routerText));
    }
  }
  return resources;
}

function extractInitialSelected(routerText: string): string[] {
  const selected = routerText.match(/^\s*selected\s*=\s*\[(?<body>[\s\S]*?)\]/m);
  return selected?.groups?.body ? extractResources(selected.groups.body, routerText) : [];
}

function extractLoadingLevelsAlways(routerText: string): string[] {
  const resources: string[] = [];
  const alwaysPattern = /["']?ALWAYS["']?\s*:\s*\[(?<body>[\s\S]*?)\]/g;
  for (const match of routerText.matchAll(alwaysPattern)) {
    const body = match.groups?.body;
    if (body) {
      resources.push(...extractResources(body, routerText));
    }
  }
  return resources;
}

function extractAlwaysResources(routerText: string): string[] {
  return uniqueSorted([
    ...extractNamedAssignments(routerText, [
      'DEFAULT_RESOURCE',
      'DEFAULT_RESOURCES',
      'BASELINE_RESOURCE',
      'BASELINE_RESOURCES',
      'ALWAYS_RESOURCE',
      'ALWAYS_RESOURCES',
    ]),
    ...extractLoadingLevelsAlways(routerText),
    ...extractInitialSelected(routerText),
  ]);
}

function extractStringList(block: string): string[] {
  const values: string[] = [];
  for (const match of block.matchAll(/["']([^"']+)["']/g)) {
    if (match[1]) {
      values.push(match[1]);
    }
  }
  return values;
}

function extractIntentKeywords(routerText: string): Map<string, string[]> {
  const result = new Map<string, string[]>();
  const intentPattern = /["']([A-Z_]+)["']\s*:\s*\{[\s\S]*?["']keywords["']\s*:\s*\[(?<body>[\s\S]*?)\]/g;
  for (const match of routerText.matchAll(intentPattern)) {
    const intent = match[1];
    const body = match.groups?.body;
    if (intent && body) {
      result.set(intent, extractStringList(body));
    }
  }
  return result;
}

function extractMapBlock(routerText: string, name: string): string | null {
  const start = routerText.indexOf(`${name} = {`);
  if (start === -1) {
    return null;
  }
  let depth = 0;
  for (let index = start; index < routerText.length; index += 1) {
    const char = routerText[index];
    if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return routerText.slice(start, index + 1);
      }
    }
  }
  return null;
}

function extractIntentResources(routerText: string): Map<string, string[]> {
  const result = new Map<string, string[]>();
  const mapBlock = extractMapBlock(routerText, 'RESOURCE_MAP') ?? routerText;
  const entryPattern = /["']([A-Z_]+)["']\s*:\s*\[(?<body>[\s\S]*?)\](?:,|\n\s*\})/g;
  for (const match of mapBlock.matchAll(entryPattern)) {
    const intent = match[1];
    const body = match.groups?.body;
    if (intent && body) {
      result.set(intent, extractResources(body, routerText));
    }
  }
  return result;
}

function extractOnDemandKeywords(routerText: string): string[] {
  const block = findAssignmentBlock(routerText, 'ON_DEMAND_KEYWORDS')
    ?? routerText.match(/["']ON_DEMAND_KEYWORDS["']\s*:\s*\[(?<body>[\s\S]*?)\]/)?.groups?.body
    ?? '';
  return extractStringList(block).filter((value) => !value.endsWith('.md'));
}

function extractOnDemandResources(routerText: string): string[] {
  const block = findAssignmentBlock(routerText, 'ON_DEMAND')
    ?? routerText.match(/["']ON_DEMAND["']\s*:\s*\[(?<body>[\s\S]*?)\]/)?.groups?.body
    ?? '';
  return extractResources(block, routerText);
}

function parseRouterModel(skillDir: string): RouterModel {
  const skillText = readTextIfExists(path.join(skillDir, 'SKILL.md'));
  if (!skillText) {
    return {
      variant: 'missing_skill',
      routerText: '',
      alwaysResources: [],
      intentResources: new Map(),
      intentKeywords: new Map(),
      onDemandKeywords: [],
      onDemandResources: [],
      referencedResources: [],
      unknown: true,
    };
  }
  const routerText = findRouterBlock(skillText);
  const variant = detectVariant(routerText);
  const unknown = routerText.length === 0 || variant === 'unknown';
  return {
    variant,
    routerText,
    alwaysResources: extractAlwaysResources(routerText),
    intentResources: extractIntentResources(routerText),
    intentKeywords: extractIntentKeywords(routerText),
    onDemandKeywords: extractOnDemandKeywords(routerText),
    onDemandResources: extractOnDemandResources(routerText),
    referencedResources: extractResources(routerText, routerText),
    unknown,
  };
}

function routeIntents(model: RouterModel, prompt: string): string[] {
  const lowerPrompt = prompt.toLowerCase();
  const matched: string[] = [];
  for (const [intent, keywords] of model.intentKeywords.entries()) {
    if (keywords.some((keyword) => lowerPrompt.includes(keyword.toLowerCase()))) {
      matched.push(intent);
    }
  }
  if (matched.length === 0 && model.intentResources.size === 1) {
    const only = [...model.intentResources.keys()][0];
    return only ? [only] : [];
  }
  return matched;
}

function onDemandMatched(model: RouterModel, prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();
  return model.onDemandKeywords.some((keyword) => lowerPrompt.includes(keyword.toLowerCase()));
}

export function predictSmartRouterRoute(args: {
  readonly workspaceRoot: string;
  readonly skill: string;
  readonly prompt: string;
  readonly briefBytes?: number;
}): RoutePrediction {
  const skillDir = path.join(args.workspaceRoot, '.opencode', 'skill', args.skill);
  const model = parseRouterModel(skillDir);
  if (model.unknown) {
    return {
      skill: args.skill,
      variant: model.variant,
      predictedRoute: ['UNKNOWN'],
      allowedResources: [UNKNOWN_RESOURCE],
      alwaysResources: [],
      conditionalResources: [],
      onDemandResources: [],
      allowedResourceCount: 0,
      allowedBytes: bytesForResources(skillDir, []),
      treeBytes: markdownTreeBytes(skillDir),
      briefBytes: args.briefBytes ?? 0,
      unknown: true,
    };
  }

  const matchedIntents = routeIntents(model, args.prompt);
  const conditionalResources = uniqueSorted(matchedIntents.flatMap((intent) => model.intentResources.get(intent) ?? []));
  const matchedOnDemand = onDemandMatched(model, args.prompt);
  const onDemandResources = matchedOnDemand ? model.onDemandResources : [];
  const allowedResources = [
    ...model.alwaysResources.map((resource) => `always:${resource}`),
    ...conditionalResources.map((resource) => `conditional:${resource}`),
    ...onDemandResources.map((resource) => `on_demand:${resource}`),
  ];
  const rawResources = uniqueSorted([
    ...model.alwaysResources,
    ...conditionalResources,
    ...onDemandResources,
  ]);

  return {
    skill: args.skill,
    variant: model.variant,
    predictedRoute: [
      ...matchedIntents,
      ...(matchedOnDemand ? ['ON_DEMAND'] : []),
    ],
    allowedResources: allowedResources.length > 0 ? uniqueSorted(allowedResources) : [UNKNOWN_RESOURCE],
    alwaysResources: model.alwaysResources,
    conditionalResources,
    onDemandResources,
    allowedResourceCount: rawResources.length,
    allowedBytes: bytesForResources(skillDir, rawResources),
    treeBytes: markdownTreeBytes(skillDir),
    briefBytes: args.briefBytes ?? 0,
    unknown: allowedResources.length === 0,
  };
}

export function loadCorpus(corpusPath: string): CorpusRow[] {
  return fs.readFileSync(corpusPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const parsed = JSON.parse(line) as unknown;
      if (!isRecord(parsed) || typeof parsed.id !== 'string' || typeof parsed.prompt !== 'string') {
        throw new Error(`Invalid corpus row: ${line.slice(0, 120)}`);
      }
      return {
        id: parsed.id,
        prompt: parsed.prompt,
        ...(typeof parsed.skill_top_1 === 'string' ? { skill_top_1: parsed.skill_top_1 } : {}),
      };
    });
}

function distributionFor(results: readonly MeasurementPromptResult[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  for (const result of results) {
    const bucket = String(result.prediction.allowedResourceCount);
    distribution[bucket] = (distribution[bucket] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(distribution).sort(([left], [right]) => Number(left) - Number(right)));
}

function summarizeBySkill(results: readonly MeasurementPromptResult[]): SkillMeasurementSummary[] {
  const grouped = new Map<string, MeasurementPromptResult[]>();
  for (const result of results) {
    const skill = result.advisorTopSkill ?? 'UNKNOWN';
    grouped.set(skill, [...(grouped.get(skill) ?? []), result]);
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([skill, rows]) => {
      const correct = rows.filter((row) => row.correct).length;
      const onDemandHits = rows.filter((row) => row.prediction.onDemandResources.length > 0).length;
      const treeSavings = rows.map((row) => (
        row.prediction.treeBytes > 0
          ? 1 - (row.prediction.briefBytes / row.prediction.treeBytes)
          : 0
      ));
      const contextSavings = rows.map((row) => (
        row.prediction.treeBytes > 0
          ? 1 - (row.prediction.allowedBytes / row.prediction.treeBytes)
          : 0
      ));
      return {
        skill,
        total: rows.length,
        correct,
        accuracy: round(correct / rows.length),
        onDemandHits,
        onDemandHitRate: round(onDemandHits / rows.length),
        averageAllowedResources: round(average(rows.map((row) => row.prediction.allowedResourceCount)), 2),
        medianAllowedResources: round(median(rows.map((row) => row.prediction.allowedResourceCount)), 2),
        averageBriefBytes: round(average(rows.map((row) => row.prediction.briefBytes)), 2),
        averageTreeBytes: round(average(rows.map((row) => row.prediction.treeBytes)), 2),
        averagePredictedContextBytes: round(average(rows.map((row) => row.prediction.allowedBytes)), 2),
        averageBriefSavingsRate: round(average(treeSavings)),
        averagePredictedContextSavingsRate: round(average(contextSavings)),
      };
    });
}

export async function runMeasurement(options: MeasurementOptions = {}): Promise<MeasurementSummary> {
  const workspaceRoot = options.workspaceRoot ?? locateWorkspaceRoot();
  const corpusPath = path.resolve(workspaceRoot, options.corpusPath ?? DEFAULT_CORPUS_PATH);
  const rows = (options.corpusRows ? [...options.corpusRows] : loadCorpus(corpusPath))
    .slice(0, options.limit ?? undefined);
  const buildBrief = options.buildBrief ?? buildSkillAdvisorBrief;
  const shouldRecordTelemetry = options.recordTelemetry ?? true;
  const results: MeasurementPromptResult[] = [];

  for (const row of rows) {
    const hook = await buildBrief(row.prompt, {
      workspaceRoot,
      runtime: 'codex',
    });
    const top = hook.recommendations[0] ?? null;
    const advisorTopSkill = top?.skill ?? null;
    const prediction = predictSmartRouterRoute({
      workspaceRoot,
      skill: advisorTopSkill ?? 'UNKNOWN',
      prompt: row.prompt,
      briefBytes: Buffer.byteLength(hook.brief ?? '', 'utf8'),
    });
    const result: MeasurementPromptResult = {
      id: row.id,
      labelSkill: row.skill_top_1 ?? null,
      advisorTopSkill,
      confidence: top?.confidence ?? null,
      uncertainty: top?.uncertainty ?? null,
      advisorStatus: hook.status,
      advisorFreshness: hook.freshness,
      correct: advisorTopSkill !== null && advisorTopSkill === (row.skill_top_1 ?? null),
      prediction,
    };
    results.push(result);

    if (shouldRecordTelemetry) {
      recordSmartRouterCompliance({
        promptId: row.id,
        selectedSkill: advisorTopSkill ?? 'UNKNOWN',
        predictedRoute: prediction.predictedRoute,
        allowedResources: [UNKNOWN_RESOURCE, ...prediction.allowedResources],
        actualReads: [],
      }, {
        outputPath: options.liveStream
          ? undefined
          : path.resolve(workspaceRoot, options.telemetryOutputPath ?? DEFAULT_STATIC_COMPLIANCE_PATH),
      });
    }
  }

  const correct = results.filter((result) => result.correct).length;
  return {
    totalPrompts: results.length,
    correct,
    accuracy: results.length > 0 ? round(correct / results.length) : 0,
    perSkill: summarizeBySkill(results),
    allowedResourceDistribution: distributionFor(results),
    results,
    generatedAt: new Date().toISOString(),
    caveat: 'Static measurement only: predicted routes and advisor labels were measured. No live AI read behavior was observed.',
  };
}

function percent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatMeasurementReport(summary: MeasurementSummary): string {
  const lines: string[] = [
    '# Smart Router Static Measurement Report',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    '## Summary',
    '',
    `- Total prompts: ${summary.totalPrompts}`,
    `- Advisor top-1 accuracy vs corpus labels: ${summary.correct}/${summary.totalPrompts} (${percent(summary.accuracy)})`,
    `- Methodology caveat: ${summary.caveat}`,
    '',
    '## Per-Skill Accuracy And Savings',
    '',
    '| Skill | Prompts | Correct | Accuracy | ON_DEMAND Hit Rate | Avg Allowed Resources | Median Allowed Resources | Avg Brief Bytes | Avg Full Tree Bytes | Avg Predicted Context Bytes | Avg Brief Savings | Avg Predicted Context Savings |',
    '|-------|---------|---------|----------|--------------------|-----------------------|--------------------------|-----------------|---------------------|-----------------------------|-------------------|-------------------------------|',
  ];

  for (const row of summary.perSkill) {
    lines.push([
      `| ${row.skill}`,
      String(row.total),
      String(row.correct),
      percent(row.accuracy),
      percent(row.onDemandHitRate),
      row.averageAllowedResources.toFixed(2),
      row.medianAllowedResources.toFixed(2),
      row.averageBriefBytes.toFixed(2),
      row.averageTreeBytes.toFixed(2),
      row.averagePredictedContextBytes.toFixed(2),
      percent(row.averageBriefSavingsRate),
      `${percent(row.averagePredictedContextSavingsRate)} |`,
    ].join(' | '));
  }

  lines.push(
    '',
    '## Allowed-Resource Count Distribution',
    '',
    '| Allowed Resources | Prompt Count |',
    '|-------------------|--------------|',
  );

  for (const [bucket, count] of Object.entries(summary.allowedResourceDistribution)) {
    lines.push(`| ${bucket} | ${count} |`);
  }

  lines.push(
    '',
    '## Caveats',
    '',
    '- This report measures advisor output and the predicted SMART ROUTING resource route only.',
    '- It does not measure actual AI tool reads, skipped SKILL.md behavior, or whether a model followed a route.',
    '- Compliance JSONL records emitted by this static harness intentionally classify as `unknown_unparsed` to avoid implying live-session compliance.',
    '- Causal claims about AI reasoning require live-session telemetry collected with the wrapper.',
    '',
  );

  return `${lines.join('\n')}\n`;
}

export function writeMeasurementOutputs(summary: MeasurementSummary, options: MeasurementOptions = {}): void {
  const workspaceRoot = options.workspaceRoot ?? locateWorkspaceRoot();
  const reportPath = path.resolve(workspaceRoot, options.outputPath ?? DEFAULT_REPORT_PATH);
  const jsonlPath = path.resolve(workspaceRoot, options.jsonlOutputPath ?? DEFAULT_JSONL_PATH);

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, formatMeasurementReport(summary), 'utf8');

  fs.mkdirSync(path.dirname(jsonlPath), { recursive: true });
  const jsonlLines = [
    ...summary.results.map((result) => JSON.stringify({ type: 'prompt', ...result })),
    JSON.stringify({
      type: 'summary',
      totalPrompts: summary.totalPrompts,
      correct: summary.correct,
      accuracy: summary.accuracy,
      perSkill: summary.perSkill,
      allowedResourceDistribution: summary.allowedResourceDistribution,
      generatedAt: summary.generatedAt,
      caveat: summary.caveat,
    }),
  ];
  fs.writeFileSync(jsonlPath, `${jsonlLines.join('\n')}\n`, 'utf8');
}

function argValue(args: readonly string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const workspaceRoot = path.resolve(argValue(args, '--workspace-root') ?? locateWorkspaceRoot());
  const limitValue = argValue(args, '--limit');
  const summary = await runMeasurement({
    workspaceRoot,
    corpusPath: argValue(args, '--corpus'),
    limit: limitValue ? Number(limitValue) : undefined,
    recordTelemetry: !args.includes('--no-record-telemetry'),
    liveStream: args.includes('--live-stream'),
    telemetryOutputPath: argValue(args, '--telemetry-output'),
  });
  writeMeasurementOutputs(summary, {
    workspaceRoot,
    outputPath: argValue(args, '--output'),
    jsonlOutputPath: argValue(args, '--jsonl'),
  });
  const outputPath = path.resolve(workspaceRoot, argValue(args, '--output') ?? DEFAULT_REPORT_PATH);
  process.stdout.write(`Smart-router measurement complete: ${summary.correct}/${summary.totalPrompts} (${percent(summary.accuracy)})\n`);
  process.stdout.write(`Report: ${outputPath}\n`);
}

if (IS_CLI_ENTRY) {
  main().catch((error: unknown) => {
    process.stderr.write(`smart-router-measurement failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
}
