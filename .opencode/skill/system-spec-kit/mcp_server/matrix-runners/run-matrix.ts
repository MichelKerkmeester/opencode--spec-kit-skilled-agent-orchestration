// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Meta Runner
// ───────────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { adapterCliClaudeCode } from './adapter-cli-claude-code.js';
import { adapterCliCodex } from './adapter-cli-codex.js';
import { adapterCliCopilot } from './adapter-cli-copilot.js';
import { adapterCliGemini } from './adapter-cli-gemini.js';
import { adapterCliOpencode } from './adapter-cli-opencode.js';

import type { AdapterInput, AdapterResult, AdapterStatus } from './adapter-common.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type MatrixExecutor = 'cli-codex' | 'cli-copilot' | 'cli-gemini' | 'cli-claude-code' | 'cli-opencode';

interface MatrixCell {
  readonly featureId: string;
  readonly featureName: string;
  readonly executor: MatrixExecutor;
  readonly applicable: boolean;
  readonly promptTemplate: string;
  readonly expectedSignal: string;
  readonly timeoutSeconds: number;
  readonly applicabilityReason?: string;
}

interface MatrixManifest {
  readonly version: string;
  readonly cells: readonly MatrixCell[];
  readonly executorApplicabilityRules: Record<string, readonly string[]>;
}

interface CliOptions {
  readonly outputDir: string;
  readonly filters: readonly string[];
  readonly executors: readonly MatrixExecutor[];
  readonly workingDir: string;
}

interface MatrixCellRecord {
  readonly cell_id: string;
  readonly featureId: string;
  readonly featureName: string;
  readonly executor: MatrixExecutor;
  readonly status: AdapterStatus;
  readonly durationMs: number;
  readonly evidence: AdapterResult['evidence'];
  readonly reason?: string;
  readonly recordedAt: string;
}

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CURRENT_FILE = fileURLToPath(import.meta.url);
const RUNNER_DIR = dirname(CURRENT_FILE);
const MANIFEST_PATH = join(RUNNER_DIR, 'matrix-manifest.json');
const DEFAULT_CONCURRENCY = 3;
const EXECUTORS: readonly MatrixExecutor[] = [
  'cli-codex',
  'cli-copilot',
  'cli-gemini',
  'cli-claude-code',
  'cli-opencode',
];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function parseCsv<T extends string>(value: string | undefined, allowed: readonly T[]): readonly T[] {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return [];
  }
  const allowedSet = new Set<string>(allowed);
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part): part is T => allowedSet.has(part));
}

function parseArgs(argv: readonly string[]): CliOptions {
  let outputDir = '';
  let filters: readonly string[] = [];
  let executors: readonly MatrixExecutor[] = [];
  let workingDir = process.cwd();

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--output') {
      outputDir = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--filter') {
      filters = (argv[index + 1] ?? '').split(',').map((item) => item.trim()).filter(Boolean);
      index += 1;
    } else if (arg === '--executors') {
      executors = parseCsv(argv[index + 1], EXECUTORS);
      index += 1;
    } else if (arg === '--working-dir') {
      workingDir = argv[index + 1] ?? process.cwd();
      index += 1;
    }
  }

  if (outputDir.length === 0) {
    throw new Error('Missing required --output <dir>');
  }

  return {
    outputDir: resolve(outputDir),
    filters,
    executors,
    workingDir: resolve(workingDir),
  };
}

function readManifest(): MatrixManifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as MatrixManifest;
}

function resolvePromptTemplate(template: string): string {
  const candidate = isAbsolute(template) ? template : join(RUNNER_DIR, template);
  return existsSync(candidate) ? readFileSync(candidate, 'utf8') : template;
}

function adapterFor(executor: MatrixExecutor): (input: AdapterInput) => Promise<AdapterResult> {
  switch (executor) {
    case 'cli-codex':
      return adapterCliCodex;
    case 'cli-copilot':
      return adapterCliCopilot;
    case 'cli-gemini':
      return adapterCliGemini;
    case 'cli-claude-code':
      return adapterCliClaudeCode;
    case 'cli-opencode':
      return adapterCliOpencode;
  }
}

function createNaResult(reason: string): AdapterResult {
  return {
    status: 'NA',
    durationMs: 0,
    evidence: { stdout: '', stderr: '', exitCode: 0 },
    reason,
  };
}

function asRecord(cell: MatrixCell, result: AdapterResult): MatrixCellRecord {
  return {
    cell_id: `${cell.featureId}-${cell.executor}`,
    featureId: cell.featureId,
    featureName: cell.featureName,
    executor: cell.executor,
    status: result.status,
    durationMs: result.durationMs,
    evidence: result.evidence,
    ...(result.reason ? { reason: result.reason } : {}),
    recordedAt: new Date().toISOString(),
  };
}

function writeCellRecord(outputDir: string, record: MatrixCellRecord): void {
  writeFileSync(
    join(outputDir, `${record.featureId}-${record.executor}.jsonl`),
    `${JSON.stringify(record)}\n`,
    'utf8',
  );
}

function summaryRows(records: readonly MatrixCellRecord[]): string {
  const header = 'cell_id\tfeature\texecutor\tstatus\tduration_ms\treason';
  const rows = records.map((record) => [
    record.cell_id,
    record.featureId,
    record.executor,
    record.status,
    String(record.durationMs),
    (record.reason ?? '').replace(/\s+/g, ' '),
  ].join('\t'));
  return `${[header, ...rows].join('\n')}\n`;
}

function rateLine(label: string, passed: number, applicable: number): string {
  const rate = applicable === 0 ? 'n/a' : `${((passed / applicable) * 100).toFixed(1)}%`;
  return `${label}\t${passed}/${applicable}\t${rate}`;
}

function aggregateRows(records: readonly MatrixCellRecord[], key: 'featureId' | 'executor'): string[] {
  const grouped = new Map<string, MatrixCellRecord[]>();
  for (const record of records) {
    const group = grouped.get(record[key]) ?? [];
    group.push(record);
    grouped.set(record[key], group);
  }

  return [...grouped.entries()].map(([label, group]) => {
    const applicable = group.filter((record) => record.status !== 'NA').length;
    const passed = group.filter((record) => record.status === 'PASS').length;
    return rateLine(label, passed, applicable);
  });
}

async function runWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await task(items[currentIndex] as T);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export async function runMatrix(options: CliOptions): Promise<readonly MatrixCellRecord[]> {
  const manifest = readManifest();
  const cells = manifest.cells.filter((cell) => {
    const featureMatch = options.filters.length === 0 || options.filters.includes(cell.featureId);
    const executorMatch = options.executors.length === 0 || options.executors.includes(cell.executor);
    return featureMatch && executorMatch;
  });

  mkdirSync(options.outputDir, { recursive: true });

  const records = await runWithConcurrency(cells, DEFAULT_CONCURRENCY, async (cell) => {
    const result = cell.applicable
      ? await adapterFor(cell.executor)({
        featureId: cell.featureId,
        promptTemplate: resolvePromptTemplate(cell.promptTemplate),
        expectedSignal: cell.expectedSignal,
        timeoutSeconds: cell.timeoutSeconds,
        workingDir: options.workingDir,
      })
      : createNaResult(cell.applicabilityReason ?? 'cell marked not applicable by manifest');
    const record = asRecord(cell, result);
    writeCellRecord(options.outputDir, record);
    return record;
  });

  writeFileSync(join(options.outputDir, 'summary.tsv'), summaryRows(records), 'utf8');
  const aggregate = [
    'Pass rate by feature',
    'label\tpassed/applicable\tpass_rate',
    ...aggregateRows(records, 'featureId'),
    '',
    'Pass rate by executor',
    'label\tpassed/applicable\tpass_rate',
    ...aggregateRows(records, 'executor'),
  ].join('\n');
  process.stdout.write(`${aggregate}\n`);

  return records;
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === CURRENT_FILE) {
  runMatrix(parseArgs(process.argv.slice(2))).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}

