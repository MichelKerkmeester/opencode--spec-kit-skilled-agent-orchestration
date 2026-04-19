// ---------------------------------------------------------------
// MODULE: Smart Router Telemetry
// ---------------------------------------------------------------

import * as fs from 'node:fs';
import * as path from 'node:path';

export type ComplianceClass =
  | 'always'
  | 'conditional_expected'
  | 'on_demand_expected'
  | 'extra'
  | 'missing_expected'
  | 'unknown_unparsed';

export type ComplianceRecord = {
  promptId: string;
  selectedSkill: string;
  observedSkill?: string | null;
  observedSkills?: string[];
  predictedRoute: string[];
  allowedResources: string[];
  actualReads: string[];
  complianceClass: ComplianceClass;
  timestamp: string;
};

type ResourceTier = 'always' | 'conditional_expected' | 'on_demand_expected';

type ParsedResource = {
  path: string;
  tier: ResourceTier;
  unknown: boolean;
  required: boolean;
};

const UNKNOWN_MARKERS = new Set([
  'unknown_unparsed',
  '__unknown_unparsed__',
  'unknown:unparsed',
]);

const TIER_PREFIXES: Record<string, ResourceTier> = {
  always: 'always',
  conditional: 'conditional_expected',
  conditional_expected: 'conditional_expected',
  on_demand: 'on_demand_expected',
  on_demand_expected: 'on_demand_expected',
  expected: 'conditional_expected',
};

const TELEMETRY_PATH_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_PATH';
const TELEMETRY_DIR_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_DIR';

type ComplianceInput = Omit<ComplianceRecord, 'complianceClass' | 'timestamp'>;

const activePromptInputs = new Map<string, ComplianceInput>();

function sanitizeValue(value: string): string {
  return value
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeList(values: string[]): string[] {
  return values
    .map((value) => sanitizeValue(String(value)))
    .filter((value) => value.length > 0);
}

function parseAllowedResource(value: string): ParsedResource {
  const sanitized = sanitizeValue(value);
  const lowered = sanitized.toLowerCase();

  if (UNKNOWN_MARKERS.has(lowered)) {
    return { path: sanitized, tier: 'always', unknown: true, required: false };
  }

  const prefixMatch = sanitized.match(/^([a-z_]+):(.*)$/i);
  if (prefixMatch) {
    const prefix = prefixMatch[1].toLowerCase();
    const tier = TIER_PREFIXES[prefix];
    if (tier) {
      return {
        path: sanitizeValue(prefixMatch[2]),
        tier,
        unknown: false,
        required: prefix === 'expected',
      };
    }
    return { path: sanitized, tier: 'always', unknown: true, required: false };
  }

  return { path: sanitized, tier: 'always', unknown: false, required: false };
}

function tierRank(tier: ResourceTier): number {
  if (tier === 'on_demand_expected') {
    return 3;
  }
  if (tier === 'conditional_expected') {
    return 2;
  }
  return 1;
}

function classForTier(tier: ResourceTier): ComplianceClass {
  return tier;
}

function locateRepoRoot(startDir: string): string {
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

export function telemetryFilePath(outputPath?: string): string {
  if (outputPath && outputPath.trim().length > 0) {
    return path.resolve(outputPath);
  }

  const pathOverride = process.env[TELEMETRY_PATH_ENV];
  if (pathOverride && pathOverride.trim().length > 0) {
    return path.resolve(pathOverride);
  }

  const override = process.env[TELEMETRY_DIR_ENV];
  if (override && override.trim().length > 0) {
    return path.join(path.resolve(override), 'compliance.jsonl');
  }

  const repoRoot = locateRepoRoot(process.cwd());
  return path.join(repoRoot, '.opencode', 'skill', '.smart-router-telemetry', 'compliance.jsonl');
}

function appendJsonl(record: ComplianceRecord, outputPath?: string): void {
  try {
    const resolvedOutputPath = telemetryFilePath(outputPath);
    fs.mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
    fs.appendFileSync(
      resolvedOutputPath,
      `${JSON.stringify(record)}\n`,
      'utf8'
    );
  } catch {
    // Observe-only: telemetry must never alter caller behavior.
  }
}

function unique(values: string[]): string[] {
  return [...new Set(sanitizeList(values))].sort();
}

export function classifyCompliance(allowed: string[], actual: string[]): ComplianceClass {
  const allowedResources = sanitizeList(allowed).map(parseAllowedResource);
  const actualReads = sanitizeList(actual);

  if (allowedResources.length === 0 || allowedResources.some((resource) => resource.unknown)) {
    return 'unknown_unparsed';
  }

  const allowedByPath = new Map<string, ResourceTier>();
  for (const resource of allowedResources) {
    if (resource.path.length === 0) {
      continue;
    }
    const existingTier = allowedByPath.get(resource.path);
    if (!existingTier || tierRank(resource.tier) > tierRank(existingTier)) {
      allowedByPath.set(resource.path, resource.tier);
    }
  }

  const actualSet = new Set(actualReads);
  if (actualSet.size === 0) {
    return 'missing_expected';
  }

  for (const read of actualSet) {
    if (!allowedByPath.has(read)) {
      return 'extra';
    }
  }

  for (const resource of allowedResources) {
    if (resource.required && !actualSet.has(resource.path)) {
      return 'missing_expected';
    }
  }

  let highestTier: ResourceTier = 'always';
  for (const resourcePath of actualSet) {
    const tier = allowedByPath.get(resourcePath) ?? 'always';
    if (tierRank(tier) > tierRank(highestTier)) {
      highestTier = tier;
    }
  }

  return classForTier(highestTier);
}

function classForInput(input: ComplianceInput): ComplianceClass {
  const observedSkills = unique([
    ...(input.observedSkills ?? []),
    ...(input.observedSkill ? [input.observedSkill] : []),
  ]);
  const selectedSkill = sanitizeValue(input.selectedSkill);
  if (observedSkills.some((skill) => skill !== selectedSkill)) {
    return 'extra';
  }
  return classifyCompliance(input.allowedResources, input.actualReads);
}

function buildRecord(input: ComplianceInput): ComplianceRecord {
  const observedSkills = unique([
    ...(input.observedSkills ?? []),
    ...(input.observedSkill ? [input.observedSkill] : []),
  ]);
  const observedSkill = observedSkills.length === 1 ? observedSkills[0] : observedSkills.join(',');
  const baseRecord: ComplianceRecord = {
    promptId: sanitizeValue(input.promptId),
    selectedSkill: sanitizeValue(input.selectedSkill),
    ...(observedSkill ? { observedSkill } : {}),
    ...(observedSkills.length > 0 ? { observedSkills } : {}),
    predictedRoute: sanitizeList(input.predictedRoute),
    allowedResources: sanitizeList(input.allowedResources),
    actualReads: sanitizeList(input.actualReads),
    complianceClass: classForInput(input),
    timestamp: new Date().toISOString(),
  };
  return baseRecord;
}

export function recordSmartRouterCompliance(
  input: ComplianceInput,
  options: { readonly outputPath?: string } = {},
): ComplianceRecord {
  const record = buildRecord(input);
  appendJsonl(record, options.outputPath);
  return record;
}

export function startSmartRouterCompliancePrompt(input: ComplianceInput): void {
  const promptId = sanitizeValue(input.promptId);
  activePromptInputs.set(promptId, {
    promptId,
    selectedSkill: sanitizeValue(input.selectedSkill),
    predictedRoute: sanitizeList(input.predictedRoute),
    allowedResources: sanitizeList(input.allowedResources),
    actualReads: sanitizeList(input.actualReads),
    observedSkills: unique([
      ...(input.observedSkills ?? []),
      ...(input.observedSkill ? [input.observedSkill] : []),
    ]),
  });
}

export function recordSmartRouterPromptObservation(input: ComplianceInput): void {
  const promptId = sanitizeValue(input.promptId);
  const existing = activePromptInputs.get(promptId);
  if (!existing) {
    startSmartRouterCompliancePrompt(input);
    return;
  }

  activePromptInputs.set(promptId, {
    ...existing,
    predictedRoute: unique([...existing.predictedRoute, ...sanitizeList(input.predictedRoute)]),
    allowedResources: unique([...existing.allowedResources, ...sanitizeList(input.allowedResources)]),
    actualReads: unique([...existing.actualReads, ...sanitizeList(input.actualReads)]),
    observedSkills: unique([
      ...(existing.observedSkills ?? []),
      ...(input.observedSkills ?? []),
      ...(input.observedSkill ? [input.observedSkill] : []),
    ]),
  });
}

export function finalizeSmartRouterCompliancePrompt(
  promptId: string,
  options: { readonly outputPath?: string } = {},
): ComplianceRecord | null {
  const sanitizedPromptId = sanitizeValue(promptId);
  const input = activePromptInputs.get(sanitizedPromptId);
  if (!input) {
    return null;
  }
  activePromptInputs.delete(sanitizedPromptId);
  return recordSmartRouterCompliance(input, options);
}
