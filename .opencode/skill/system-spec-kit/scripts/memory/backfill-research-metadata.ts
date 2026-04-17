#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Backfill Research Metadata
// ───────────────────────────────────────────────────────────────
// Missing-only backfill for research/*/iterations folders so
// description.json + graph-metadata.json exist for iteration packs.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
  deriveGraphMetadata,
  extractKeywords,
  loadPerFolderDescription,
  savePerFolderDescription,
  serializeGraphMetadata,
  slugifyFolderName,
  type PerFolderDescription,
} from '@spec-kit/mcp-server/api';

const ITERATION_PARENT_RE = /^\d{3}(?:[-_].+)?$/;
const DESCRIPTION_FILENAME = 'description.json';
const GRAPH_METADATA_FILENAME = 'graph-metadata.json';

export interface ResearchMetadataBackfillOptions {
  specFolderPath: string;
  dryRun?: boolean;
  now?: string;
}

export interface ResearchMetadataBackfillFailure {
  directory: string;
  error: string;
}

export interface ResearchMetadataBackfillSummary {
  specFolderPath: string;
  dryRun: boolean;
  iterationDirectories: string[];
  descriptionCreated: number;
  graphCreated: number;
  unchanged: number;
  failed: number;
  failures: ResearchMetadataBackfillFailure[];
}

interface CliOptions {
  specFolderPath: string;
  dryRun: boolean;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function formatNow(now?: string): string {
  return now ?? new Date().toISOString();
}

function resolveSpecsRoot(targetPath: string): string {
  let current = path.resolve(targetPath);
  while (true) {
    if (path.basename(current) === 'specs') {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not locate containing specs root for ${targetPath}`);
    }
    current = parent;
  }
}

function buildDescriptionDescription(iterationsDir: string): string {
  const parentName = path.basename(path.dirname(iterationsDir));
  return `Research iteration artifacts for ${parentName}.`;
}

function buildDescriptionRecord(
  iterationsDir: string,
  specsRoot: string,
  now?: string,
): PerFolderDescription {
  const relativePath = path.relative(specsRoot, iterationsDir).replace(/\\/g, '/');
  const existing = loadPerFolderDescription(iterationsDir);
  const parentName = path.basename(path.dirname(iterationsDir));
  const description = buildDescriptionDescription(iterationsDir);
  const specIdMatch = parentName.match(/^(\d+)/);
  const folderSlug = slugifyFolderName(`${parentName}-iterations`);

  return {
    specFolder: relativePath,
    description,
    keywords: extractKeywords(`${description} ${relativePath}`),
    lastUpdated: formatNow(now),
    specId: specIdMatch?.[1] ?? '',
    folderSlug,
    parentChain: relativePath.split('/').filter(Boolean).slice(0, -1),
    memorySequence: existing?.memorySequence ?? 0,
    memoryNameHistory: existing?.memoryNameHistory ?? [],
  };
}

function writeGraphMetadataFile(filePath: string, content: string): void {
  const tempPath = `${filePath}.tmp-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  try {
    fs.writeFileSync(tempPath, content, 'utf-8');
    fs.renameSync(tempPath, filePath);
  } finally {
    try {
      fs.unlinkSync(tempPath);
    } catch {
      // Temp file already renamed or never created.
    }
  }
}

export function collectResearchIterationDirectories(
  specFolderPath: string,
  failures: ResearchMetadataBackfillFailure[] = [],
): string[] {
  const researchRoot = path.join(path.resolve(specFolderPath), 'research');
  if (!fs.existsSync(researchRoot)) {
    return [];
  }

  const discovered = new Set<string>();

  function walk(currentPath: string): void {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch (error: unknown) {
      failures.push({
        directory: currentPath,
        error: toErrorMessage(error),
      });
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const childPath = path.join(currentPath, entry.name);
      if (entry.name === 'iterations' && ITERATION_PARENT_RE.test(path.basename(path.dirname(childPath)))) {
        discovered.add(childPath);
      }
      walk(childPath);
    }
  }

  walk(researchRoot);
  return Array.from(discovered).sort();
}

export function hasResearchIterationDirectories(specFolderPath: string): boolean {
  return collectResearchIterationDirectories(specFolderPath).length > 0;
}

export function runBackfillResearchMetadata(
  options: ResearchMetadataBackfillOptions,
): ResearchMetadataBackfillSummary {
  const failures: ResearchMetadataBackfillFailure[] = [];
  const dryRun = options.dryRun ?? true;
  const specFolderPath = path.resolve(options.specFolderPath);
  const specsRoot = resolveSpecsRoot(specFolderPath);
  const iterationDirectories = collectResearchIterationDirectories(specFolderPath, failures);
  const summary: ResearchMetadataBackfillSummary = {
    specFolderPath,
    dryRun,
    iterationDirectories,
    descriptionCreated: 0,
    graphCreated: 0,
    unchanged: 0,
    failed: failures.length,
    failures,
  };

  for (const iterationsDir of iterationDirectories) {
    const descriptionPath = path.join(iterationsDir, DESCRIPTION_FILENAME);
    const graphMetadataPath = path.join(iterationsDir, GRAPH_METADATA_FILENAME);
    const missingDescription = !fs.existsSync(descriptionPath);
    const missingGraph = !fs.existsSync(graphMetadataPath);

    if (!missingDescription && !missingGraph) {
      summary.unchanged += 1;
      continue;
    }

    try {
      if (missingDescription) {
        summary.descriptionCreated += 1;
        if (!dryRun) {
          savePerFolderDescription(
            buildDescriptionRecord(iterationsDir, specsRoot, options.now),
            iterationsDir,
          );
        }
      }

      if (missingGraph) {
        summary.graphCreated += 1;
        if (!dryRun) {
          const metadata = deriveGraphMetadata(iterationsDir, null, { now: formatNow(options.now) });
          writeGraphMetadataFile(graphMetadataPath, serializeGraphMetadata(metadata));
        }
      }
    } catch (error: unknown) {
      summary.failed += 1;
      summary.failures.push({
        directory: iterationsDir,
        error: toErrorMessage(error),
      });
    }
  }

  return summary;
}

function parseArgs(argv: string[]): CliOptions {
  let specFolderPath = '';
  let dryRun = true;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      console.log([
        'backfill-research-metadata — missing-only metadata repair for research iterations',
        '',
        'Usage:',
        '  node backfill-research-metadata.js <spec-folder> [--dry-run|--apply]',
      ].join('\n'));
      process.exit(0);
    }

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg === '--apply') {
      dryRun = false;
      continue;
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown argument: ${arg}`);
    }

    if (specFolderPath) {
      throw new Error('Expected exactly one spec folder path');
    }

    specFolderPath = arg;
  }

  if (!specFolderPath) {
    throw new Error('Spec folder path is required');
  }

  return {
    specFolderPath,
    dryRun,
  };
}

function runCli(): void {
  const summary = runBackfillResearchMetadata(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (summary.failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runCli();
}
