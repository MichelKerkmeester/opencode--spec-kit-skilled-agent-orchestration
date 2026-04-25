// ───────────────────────────────────────────────────────────────
// MODULE: Gold Query Verifier
// ───────────────────────────────────────────────────────────────
// Loads and validates the code-graph gold query battery.

import { readFileSync } from 'node:fs';
import { createLogger } from '../../lib/utils/logger.js';

const logger = createLogger('GoldQueryVerifier');

interface GoldQueryProbe {
  operation: string;
  subject: string;
  expectedSymbolsPath: string;
}

export interface GoldQuery {
  id: string;
  category: string;
  query: string;
  source_file: string;
  source_line?: number;
  expected_top_K_symbols: string[];
  probe?: GoldQueryProbe;
}

export interface GoldBattery {
  schema_version: 1;
  pass_policy: {
    overall_pass_rate: number;
    edge_focus_pass_rate: number;
  };
  queries: GoldQuery[];
}

export interface ProbeResult {
  queryId: string;
  category: string;
  probe: {
    operation: string;
    subject: string;
    expectedSymbolsPath?: string;
    limit?: number;
  };
  matchedSymbols: string[];
  missingSymbols: string[];
  status: 'passed' | 'failed' | 'blocked' | 'error';
  reason?: string;
}

export interface VerifyResult {
  batteryPath: string;
  queryCount: number;
  pass_policy: GoldBattery['pass_policy'];
  overall_pass_rate: number;
  edge_focus_pass_rate: number;
  overallPassRate: number;
  categoryPassRates: Record<string, number>;
  missingSymbols: string[];
  unexpectedErrors: string[];
  passed: boolean;
  probes: ProbeResult[];
}

interface OutlineProbe {
  operation: 'outline';
  subject: string;
  limit: number;
}

interface QuerySymbolNode {
  name?: string;
  fqName?: string;
}

interface ParsedOutlinePayload {
  status: 'ok' | 'blocked' | 'error';
  nodes: QuerySymbolNode[];
  reason?: string;
}

interface BatteryExecutionOptions {
  failFast?: boolean;
  includeDetails?: boolean;
}

const EDGE_FOCUS_CATEGORIES = new Set([
  'cross-module',
  'exported-type',
  'regression-detection',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getRequiredString(
  record: Record<string, unknown>,
  fieldName: string,
  context: string,
): string {
  const value = record[fieldName];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${context} must include a non-empty string "${fieldName}"`);
  }
  return value;
}

function getOptionalProbe(
  record: Record<string, unknown>,
  context: string,
): GoldQueryProbe | undefined {
  const probe = record.probe;
  if (probe === undefined) {
    return undefined;
  }

  if (!isRecord(probe)) {
    throw new Error(`${context}.probe must be an object when present`);
  }

  return {
    operation: getRequiredString(probe, 'operation', `${context}.probe`),
    subject: getRequiredString(probe, 'subject', `${context}.probe`),
    expectedSymbolsPath: getRequiredString(probe, 'expectedSymbolsPath', `${context}.probe`),
  };
}

function getRequiredStringArray(
  record: Record<string, unknown>,
  fieldName: string,
  context: string,
): string[] {
  const value = record[fieldName];
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${context} must include a non-empty array "${fieldName}"`);
  }

  const normalized = value.map((entry, index) => {
    if (typeof entry !== 'string' || entry.trim().length === 0) {
      throw new Error(`${context}.${fieldName}[${index}] must be a non-empty string`);
    }
    return entry;
  });

  return normalized;
}

function getRequiredRate(
  record: Record<string, unknown>,
  keys: readonly string[],
  context: string,
): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      if (value < 0 || value > 1) {
        throw new Error(`${context}.${key} must be between 0 and 1`);
      }
      return value;
    }
  }

  throw new Error(`${context} must include one of: ${keys.join(', ')}`);
}

function parseSourceLocation(queryRecord: Record<string, unknown>, context: string): {
  source_file: string;
  source_line?: number;
} {
  const rawSourceFile = queryRecord.source_file;
  if (typeof rawSourceFile === 'string' && rawSourceFile.trim().length > 0) {
    return { source_file: rawSourceFile };
  }

  const rawSourceFileLine = queryRecord['source_file:line'];
  if (typeof rawSourceFileLine !== 'string' || rawSourceFileLine.trim().length === 0) {
    throw new Error(`${context} must include "source_file" or "source_file:line"`);
  }

  const match = /^(.*):(\d+)$/.exec(rawSourceFileLine);
  if (!match) {
    throw new Error(`${context} has invalid "source_file:line" format: ${rawSourceFileLine}`);
  }

  const sourceFile = match[1];
  const sourceLine = Number.parseInt(match[2], 10);
  if (sourceFile.trim().length === 0 || !Number.isInteger(sourceLine) || sourceLine < 1) {
    throw new Error(`${context} has invalid "source_file:line" value: ${rawSourceFileLine}`);
  }

  return {
    source_file: sourceFile,
    source_line: sourceLine,
  };
}

function parseQuery(record: unknown, index: number): GoldQuery {
  const context = `gold battery query at index ${index}`;
  if (!isRecord(record)) {
    throw new Error(`${context} must be an object`);
  }

  const sourceLocation = parseSourceLocation(record, context);
  const probe = getOptionalProbe(record, context);
  if (probe) {
    logger.warn('Ignoring unsupported v2 probe hook in v1 gold battery query', {
      queryId: record.id,
      operation: probe.operation,
      subject: probe.subject,
      expectedSymbolsPath: probe.expectedSymbolsPath,
    });
  }

  return {
    id: getRequiredString(record, 'id', context),
    category: getRequiredString(record, 'category', context),
    query: getRequiredString(record, 'query', context),
    source_file: sourceLocation.source_file,
    ...(sourceLocation.source_line !== undefined ? { source_line: sourceLocation.source_line } : {}),
    expected_top_K_symbols: getRequiredStringArray(record, 'expected_top_K_symbols', context),
    ...(probe ? { probe } : {}),
  };
}

function normalizeSymbol(value: string): string {
  return value.trim().toLowerCase();
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function parseOutlinePayload(response: unknown): ParsedOutlinePayload {
  if (!isRecord(response)) {
    throw new Error('Query response must be an object');
  }

  const content = response.content;
  if (!Array.isArray(content) || content.length === 0) {
    throw new Error('Query response must include non-empty content');
  }

  const textContent = content.find((item) => isRecord(item) && item.type === 'text' && typeof item.text === 'string');
  if (!isRecord(textContent) || typeof textContent.text !== 'string') {
    throw new Error('Query response must include text content');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(textContent.text) as unknown;
  } catch (error) {
    throw new Error(
      `Failed to parse query payload JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!isRecord(parsed)) {
    throw new Error('Query payload must be a JSON object');
  }

  const status = parsed.status;
  if (status === 'blocked' || status === 'error') {
    return {
      status,
      nodes: [],
      reason: asNonEmptyString(parsed.error) ?? asNonEmptyString(parsed.reason) ?? `Query returned status "${status}"`,
    };
  }

  if (status !== 'ok') {
    throw new Error(`Unsupported query status: ${typeof status === 'string' ? status : String(status)}`);
  }

  const rawData = parsed.data;
  if (!isRecord(rawData)) {
    throw new Error('Query payload with status "ok" must include object data');
  }

  const rawNodes = rawData.nodes;
  if (!Array.isArray(rawNodes)) {
    throw new Error('Query payload data must include array nodes');
  }

  const nodes = rawNodes
    .filter(isRecord)
    .map(node => ({
      ...(asNonEmptyString(node.name) ? { name: asNonEmptyString(node.name) } : {}),
      ...(asNonEmptyString(node.fqName) ? { fqName: asNonEmptyString(node.fqName) } : {}),
    }));

  return {
    status: 'ok',
    nodes,
  };
}

function buildProbeResult(
  goldQuery: GoldQuery,
  probe: OutlineProbe,
  matchedSymbols: string[],
  missingSymbols: string[],
  status: ProbeResult['status'],
  reason: string | undefined,
  includeDetails: boolean,
): ProbeResult {
  const baseResult: ProbeResult = {
    queryId: goldQuery.id,
    category: goldQuery.category,
    probe,
    matchedSymbols,
    missingSymbols,
    status,
    ...(reason ? { reason } : {}),
  };

  if (includeDetails || status !== 'passed') {
    return baseResult;
  }

  return {
    ...baseResult,
    matchedSymbols: [],
    missingSymbols: [],
  };
}

export async function executeBattery(
  battery: GoldBattery,
  query: (args: any) => Promise<any>,
  opts?: BatteryExecutionOptions,
): Promise<VerifyResult> {
  const failFast = opts?.failFast ?? false;
  const includeDetails = opts?.includeDetails ?? false;
  const probes: ProbeResult[] = [];
  const missingSymbols = new Set<string>();
  const unexpectedErrors: string[] = [];
  const categoryTotals = new Map<string, { total: number; passed: number }>();

  let passedCount = 0;
  let edgeFocusPassedCount = 0;
  let edgeFocusTotalCount = 0;

  for (const goldQuery of battery.queries) {
    const probe: OutlineProbe = {
      operation: 'outline',
      subject: goldQuery.source_file,
      limit: 200,
    };

    const categoryCounter = categoryTotals.get(goldQuery.category) ?? { total: 0, passed: 0 };
    categoryCounter.total += 1;
    categoryTotals.set(goldQuery.category, categoryCounter);

    if (EDGE_FOCUS_CATEGORIES.has(goldQuery.category)) {
      edgeFocusTotalCount += 1;
    }

    try {
      const rawResponse = await query(probe);
      const parsed = parseOutlinePayload(rawResponse);

      if (parsed.status !== 'ok') {
        const status = parsed.status;
        const reason = parsed.reason ?? `Query returned status "${status}"`;
        probes.push(
          buildProbeResult(goldQuery, probe, [], [...goldQuery.expected_top_K_symbols], status, reason, includeDetails),
        );
        unexpectedErrors.push(`${goldQuery.id}: ${reason}`);
        goldQuery.expected_top_K_symbols.forEach(symbol => missingSymbols.add(symbol));
        if (failFast) {
          break;
        }
        continue;
      }

      const discoveredSymbols = new Set<string>();
      for (const node of parsed.nodes) {
        if (node.name) {
          discoveredSymbols.add(normalizeSymbol(node.name));
        }
        if (node.fqName) {
          discoveredSymbols.add(normalizeSymbol(node.fqName));
        }
      }

      const matched: string[] = [];
      const missing: string[] = [];
      for (const expectedSymbol of goldQuery.expected_top_K_symbols) {
        if (discoveredSymbols.has(normalizeSymbol(expectedSymbol))) {
          matched.push(expectedSymbol);
        } else {
          missing.push(expectedSymbol);
          missingSymbols.add(expectedSymbol);
        }
      }

      const status: ProbeResult['status'] = missing.length === 0 ? 'passed' : 'failed';
      const reason = missing.length === 0
        ? undefined
        : `Missing expected symbols: ${missing.join(', ')}`;

      if (status === 'passed') {
        passedCount += 1;
        categoryCounter.passed += 1;
        if (EDGE_FOCUS_CATEGORIES.has(goldQuery.category)) {
          edgeFocusPassedCount += 1;
        }
      }

      probes.push(buildProbeResult(goldQuery, probe, matched, missing, status, reason, includeDetails));
      if (failFast && status !== 'passed') {
        break;
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      probes.push(
        buildProbeResult(
          goldQuery,
          probe,
          [],
          [...goldQuery.expected_top_K_symbols],
          'error',
          reason,
          includeDetails,
        ),
      );
      unexpectedErrors.push(`${goldQuery.id}: ${reason}`);
      goldQuery.expected_top_K_symbols.forEach(symbol => missingSymbols.add(symbol));
      if (failFast) {
        break;
      }
    }
  }

  const queryCount = battery.queries.length;
  const overallPassRate = queryCount === 0 ? 0 : passedCount / queryCount;
  const edgeFocusPassRate = edgeFocusTotalCount === 0 ? overallPassRate : edgeFocusPassedCount / edgeFocusTotalCount;
  const categoryPassRates = Object.fromEntries(
    [...categoryTotals.entries()].map(([category, counts]) => [
      category,
      counts.total === 0 ? 0 : counts.passed / counts.total,
    ]),
  );

  return {
    batteryPath: '<in-memory>',
    queryCount,
    pass_policy: battery.pass_policy,
    overall_pass_rate: overallPassRate,
    edge_focus_pass_rate: edgeFocusPassRate,
    overallPassRate,
    categoryPassRates,
    missingSymbols: [...missingSymbols],
    unexpectedErrors,
    passed:
      overallPassRate >= battery.pass_policy.overall_pass_rate
      && edgeFocusPassRate >= battery.pass_policy.edge_focus_pass_rate,
    probes,
  };
}

export function loadGoldBattery(path: string): GoldBattery {
  const raw = readFileSync(path, 'utf8');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (error) {
    throw new Error(
      `Failed to parse gold battery JSON at ${path}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!isRecord(parsed)) {
    throw new Error(`Gold battery at ${path} must be a JSON object`);
  }

  if (parsed.schema_version !== 1) {
    throw new Error(`Gold battery at ${path} must declare schema_version === 1`);
  }

  const passPolicyValue = parsed.pass_policy;
  if (!isRecord(passPolicyValue)) {
    throw new Error(`Gold battery at ${path} must include an object "pass_policy"`);
  }

  const queriesValue = parsed.queries;
  if (!Array.isArray(queriesValue)) {
    throw new Error(`Gold battery at ${path} must include an array "queries"`);
  }

  return {
    schema_version: 1,
    pass_policy: {
      overall_pass_rate: getRequiredRate(
        passPolicyValue,
        ['overall_pass_rate', 'overall_top_k_symbol_pass_floor'],
        'pass_policy',
      ),
      edge_focus_pass_rate: getRequiredRate(
        passPolicyValue,
        ['edge_focus_pass_rate', 'edge_focus_pass_floor'],
        'pass_policy',
      ),
    },
    queries: queriesValue.map((query, index) => parseQuery(query, index)),
  };
}
