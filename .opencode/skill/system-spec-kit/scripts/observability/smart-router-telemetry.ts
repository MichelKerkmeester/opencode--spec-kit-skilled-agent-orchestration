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

function telemetryFilePath(): string {
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

function appendJsonl(record: ComplianceRecord): void {
  try {
    const outputPath = telemetryFilePath();
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.appendFileSync(
      outputPath,
      `${JSON.stringify(record)}\n`,
      'utf8'
    );
  } catch {
    // Observe-only: telemetry must never alter caller behavior.
  }
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

export function recordSmartRouterCompliance(
  input: Omit<ComplianceRecord, 'complianceClass' | 'timestamp'>
): ComplianceRecord {
  const record: ComplianceRecord = {
    promptId: sanitizeValue(input.promptId),
    selectedSkill: sanitizeValue(input.selectedSkill),
    predictedRoute: sanitizeList(input.predictedRoute),
    allowedResources: sanitizeList(input.allowedResources),
    actualReads: sanitizeList(input.actualReads),
    complianceClass: classifyCompliance(input.allowedResources, input.actualReads),
    timestamp: new Date().toISOString(),
  };

  appendJsonl(record);
  return record;
}
