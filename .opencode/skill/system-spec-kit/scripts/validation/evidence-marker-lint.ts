#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Evidence Marker Lint
// ───────────────────────────────────────────────────────────────
// Strict-mode bridge for evidence-marker-audit.ts. Warns on invalid
// markers and exits 1 under --strict so validate.sh can elevate it.

import path from 'node:path';

import {
  auditFolder,
  type Marker,
} from './evidence-marker-audit.js';

type ResultStatus = 'pass' | 'warn';

export interface EvidenceMarkerLintResult {
  readonly rule: 'EVIDENCE_MARKER_LINT';
  readonly status: ResultStatus;
  readonly code: 'clean' | 'invalid_markers';
  readonly message: string;
  readonly details: string[];
  readonly malformed: number;
  readonly unclosed: number;
}

interface CliOptions {
  folder: string;
  json: boolean;
  strict: boolean;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parseArgs(argv: string[]): CliOptions {
  let folder = '';
  let json = false;
  let strict = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      console.log([
        'evidence-marker-lint — validate [EVIDENCE: ...] markers',
        '',
        'Usage:',
        '  node evidence-marker-lint.js --folder <spec-folder> [--json] [--strict]',
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

function formatMarkerDetail(folderPath: string, marker: Marker): string {
  const relativePath = path.relative(folderPath, marker.file) || path.basename(marker.file);
  const rawPreview = marker.raw.replace(/\s+/g, ' ').trim();
  return `${relativePath}:${marker.line}:${marker.col + 1} ${marker.status} ${rawPreview}`;
}

/**
 * Lint evidence markers within a spec folder using the audit parser.
 *
 * @param folderPath - Spec folder to scan
 * @returns Structured pass/warn result for validate.sh bridging
 */
export async function lintEvidenceMarkers(
  folderPath: string,
): Promise<EvidenceMarkerLintResult> {
  const resolvedFolder = path.resolve(folderPath);
  const auditResult = await auditFolder(resolvedFolder, { rewrap: false });
  const invalidMarkers = auditResult.markers.filter((marker) => marker.status !== 'ok');

  if (invalidMarkers.length === 0) {
    return {
      rule: 'EVIDENCE_MARKER_LINT',
      status: 'pass',
      code: 'clean',
      message: 'Evidence marker lint passed: all markers closed with balanced brackets',
      details: [
        `filesScanned=${auditResult.filesScanned}`,
        `totalMarkers=${auditResult.totalMarkers}`,
      ],
      malformed: 0,
      unclosed: 0,
    };
  }

  return {
    rule: 'EVIDENCE_MARKER_LINT',
    status: 'warn',
    code: 'invalid_markers',
    message: `Evidence marker lint found ${auditResult.malformed} malformed and ${auditResult.unclosed} unclosed markers`,
    details: [
      `filesScanned=${auditResult.filesScanned}`,
      `totalMarkers=${auditResult.totalMarkers}`,
      ...invalidMarkers.map((marker) => formatMarkerDetail(resolvedFolder, marker)),
    ],
    malformed: auditResult.malformed,
    unclosed: auditResult.unclosed,
  };
}

function printBridgeOutput(result: EvidenceMarkerLintResult): void {
  process.stdout.write(`rule\t${result.rule}\n`);
  process.stdout.write(`status\t${result.status}\n`);
  process.stdout.write(`message\t${result.message}\n`);
  for (const detail of result.details) {
    process.stdout.write(`detail\t${detail}\n`);
  }
}

async function runCli(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = await lintEvidenceMarkers(options.folder);

    if (options.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    } else {
      printBridgeOutput(result);
    }

    if (result.status === 'warn' && options.strict) {
      process.exit(1);
    }
  } catch (error: unknown) {
    process.stderr.write(`${toErrorMessage(error)}\n`);
    process.exit(2);
  }
}

if (require.main === module) {
  void runCli();
}
