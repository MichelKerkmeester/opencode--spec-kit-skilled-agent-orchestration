#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Continuity Freshness Validator
// ───────────────────────────────────────────────────────────────
// Warns when implementation-summary continuity lags graph metadata
// by more than the 10-minute heuristic one-sided policy budget.

import fs from 'node:fs';
import path from 'node:path';

const yaml = require('js-yaml') as { load: (source: string) => unknown };

const CONTINUITY_STALENESS_THRESHOLD_MS = 10 * 60 * 1000;
const FRONTMATTER_RE = /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/;

type ResultStatus = 'pass' | 'warn' | 'fail';

export interface ContinuityFreshnessResult {
  readonly rule: 'CONTINUITY_FRESHNESS';
  readonly status: ResultStatus;
  readonly code:
    | 'fresh'
    | 'stale'
    | 'clock_drift'
    | 'implementation_summary_missing'
    | 'missing_frontmatter'
    | 'missing_graph_metadata'
    | 'missing_graph_timestamp'
    | 'invalid_graph_metadata'
    | 'invalid_timestamp'
    | 'invalid_frontmatter';
  readonly message: string;
  readonly details: string[];
  readonly continuityTimestamp?: string;
  readonly graphTimestamp?: string;
  readonly deltaMs?: number;
}

interface CliOptions {
  folder: string;
  json: boolean;
  strict: boolean;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function extractFrontmatter(markdown: string): string | null {
  return markdown.match(FRONTMATTER_RE)?.[1] ?? null;
}

function readContinuityTimestamp(markdown: string): {
  timestamp: string | null;
  parseError: string | null;
} {
  const frontmatterBlock = extractFrontmatter(markdown);
  if (!frontmatterBlock) {
    return { timestamp: null, parseError: null };
  }

  try {
    const parsed = yaml.load(frontmatterBlock);
    const timestamp = (
      typeof parsed === 'object'
      && parsed !== null
      && '_memory' in parsed
      && typeof (parsed as { _memory?: unknown })._memory === 'object'
      && (parsed as { _memory?: unknown })._memory !== null
      && 'continuity' in ((parsed as { _memory: Record<string, unknown> })._memory)
      && typeof ((parsed as { _memory: { continuity?: unknown } })._memory.continuity) === 'object'
      && ((parsed as { _memory: { continuity?: unknown } })._memory.continuity) !== null
      && 'last_updated_at' in ((parsed as { _memory: { continuity: Record<string, unknown> } })._memory.continuity)
      && typeof ((parsed as { _memory: { continuity: { last_updated_at?: unknown } } })._memory.continuity.last_updated_at) === 'string'
    )
      ? ((parsed as { _memory: { continuity: { last_updated_at: string } } })._memory.continuity.last_updated_at)
      : null;

    return { timestamp, parseError: null };
  } catch (error: unknown) {
    return { timestamp: null, parseError: toErrorMessage(error) };
  }
}

function parseTimestamp(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function readGraphMetadataTimestamp(graphMetadataPath: string): {
  timestamp?: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(fs.readFileSync(graphMetadataPath, 'utf-8')) as {
      derived?: { last_save_at?: unknown };
    };
    return typeof parsed?.derived?.last_save_at === 'string'
      ? { timestamp: parsed.derived.last_save_at }
      : {};
  } catch (error: unknown) {
    return { error: toErrorMessage(error) };
  }
}

function buildPass(
  code: ContinuityFreshnessResult['code'],
  message: string,
  details: string[] = [],
  extra: Partial<ContinuityFreshnessResult> = {},
): ContinuityFreshnessResult {
  return {
    rule: 'CONTINUITY_FRESHNESS',
    status: 'pass',
    code,
    message,
    details,
    ...extra,
  };
}

function buildWarn(
  code: ContinuityFreshnessResult['code'],
  message: string,
  details: string[] = [],
  extra: Partial<ContinuityFreshnessResult> = {},
): ContinuityFreshnessResult {
  return {
    rule: 'CONTINUITY_FRESHNESS',
    status: 'warn',
    code,
    message,
    details,
    ...extra,
  };
}

function buildFail(
  code: Extract<ContinuityFreshnessResult['code'], 'invalid_graph_metadata'>,
  message: string,
  details: string[] = [],
): ContinuityFreshnessResult {
  return {
    rule: 'CONTINUITY_FRESHNESS',
    status: 'fail',
    code,
    message,
    details,
  };
}

/**
 * Validate that packet continuity metadata stays close to graph-metadata save time.
 *
 * @param folderPath - Spec folder to validate
 * @returns Structured pass/warn/fail result for validate.sh bridging
 */
export function validateContinuityFreshness(
  folderPath: string,
): ContinuityFreshnessResult {
  const specFolderPath = path.resolve(folderPath);
  const implementationSummaryPath = path.join(specFolderPath, 'implementation-summary.md');
  const graphMetadataPath = path.join(specFolderPath, 'graph-metadata.json');

  if (!fs.existsSync(implementationSummaryPath)) {
    return buildPass(
      'implementation_summary_missing',
      'Continuity freshness skipped: implementation-summary.md missing',
    );
  }

  const implementationSummary = fs.readFileSync(implementationSummaryPath, 'utf-8');
  const { timestamp: continuityTimestamp, parseError } = readContinuityTimestamp(implementationSummary);
  if (parseError) {
    return buildWarn(
      'invalid_frontmatter',
      'Continuity freshness could not parse implementation-summary frontmatter',
      [parseError],
    );
  }
  if (!continuityTimestamp) {
    return buildPass(
      'missing_frontmatter',
      'Continuity freshness skipped: _memory.continuity.last_updated_at missing',
    );
  }

  if (!fs.existsSync(graphMetadataPath)) {
    return buildPass(
      'missing_graph_metadata',
      'Continuity freshness skipped: graph-metadata.json missing',
      [],
      { continuityTimestamp },
    );
  }

  const graphTimestampResult = readGraphMetadataTimestamp(graphMetadataPath);
  if (graphTimestampResult.error) {
    return buildFail(
      'invalid_graph_metadata',
      'Continuity freshness could not load graph-metadata.json',
      [graphTimestampResult.error],
    );
  }
  const graphMetadataTimestamp = graphTimestampResult.timestamp;

  if (!graphMetadataTimestamp) {
    return buildPass(
      'missing_graph_timestamp',
      'Continuity freshness skipped: graph-metadata.json has no derived.last_save_at',
      [],
      { continuityTimestamp },
    );
  }

  const continuityMs = parseTimestamp(continuityTimestamp);
  const graphMs = parseTimestamp(graphMetadataTimestamp);
  if (continuityMs === null || graphMs === null) {
    return buildWarn(
      'invalid_timestamp',
      'Continuity freshness could not parse one or more timestamps',
      [
        `continuity=${continuityTimestamp}`,
        `graph=${graphMetadataTimestamp}`,
      ],
      {
        continuityTimestamp,
        graphTimestamp: graphMetadataTimestamp,
      },
    );
  }

  const deltaMs = graphMs - continuityMs;
  if (deltaMs > CONTINUITY_STALENESS_THRESHOLD_MS) {
    return buildWarn(
      'stale',
      'Continuity last_updated_at lags graph-metadata derived.last_save_at by more than the 10-minute heuristic policy budget',
      [
        `deltaMs=${deltaMs}`,
        `continuity=${continuityTimestamp}`,
        `graph=${graphMetadataTimestamp}`,
      ],
      {
        continuityTimestamp,
        graphTimestamp: graphMetadataTimestamp,
        deltaMs,
      },
    );
  }

  if (deltaMs < 0) {
    return buildPass(
      'clock_drift',
      'Continuity timestamp is newer than graph-metadata; treating as benign clock drift',
      [
        `deltaMs=${deltaMs}`,
        `continuity=${continuityTimestamp}`,
        `graph=${graphMetadataTimestamp}`,
      ],
      {
        continuityTimestamp,
        graphTimestamp: graphMetadataTimestamp,
        deltaMs,
      },
    );
  }

  return buildPass(
    'fresh',
    'Continuity last_updated_at is within the 10-minute heuristic policy budget',
    [
      `deltaMs=${deltaMs}`,
      `continuity=${continuityTimestamp}`,
      `graph=${graphMetadataTimestamp}`,
    ],
    {
      continuityTimestamp,
      graphTimestamp: graphMetadataTimestamp,
      deltaMs,
    },
  );
}

function parseArgs(argv: string[]): CliOptions {
  let folder = '';
  let json = false;
  let strict = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      console.log([
        'continuity-freshness — validate implementation-summary continuity freshness',
        '',
        'Usage:',
        '  node continuity-freshness.js --folder <spec-folder> [--json] [--strict]',
      ].join('\n'));
      process.exit(0);
    }
    if (arg === '--folder') {
      folder = argv[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--json') {
      json = true;
      continue;
    }
    if (arg === '--strict') {
      strict = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!folder) {
    throw new Error('--folder is required');
  }

  return { folder, json, strict };
}

function printBridgeOutput(result: ContinuityFreshnessResult): void {
  process.stdout.write(`rule\t${result.rule}\n`);
  process.stdout.write(`status\t${result.status}\n`);
  process.stdout.write(`message\t${result.message}\n`);
  for (const detail of result.details) {
    process.stdout.write(`detail\t${detail}\n`);
  }
}

function runCli(): void {
  const options = parseArgs(process.argv.slice(2));
  const result = validateContinuityFreshness(options.folder);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    printBridgeOutput(result);
  }

  if (result.status === 'fail') {
    process.exit(2);
  }
  if (result.status === 'warn' && options.strict) {
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}
