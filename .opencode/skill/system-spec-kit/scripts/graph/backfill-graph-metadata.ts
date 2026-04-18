// ───────────────────────────────────────────────────────────────
// MODULE: Backfill Graph Metadata
// Usage:
//   node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js [--dry-run] [--root <specs-dir>]
//   node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js [--dry-run] --active-only [--root <specs-dir>]
//
// Default behavior is inclusive: all packet folders under the selected specs root
// are refreshed, including z_archive/ and z_future/. Use --active-only only when
// you intentionally want to skip archived trees.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import {
  deriveGraphMetadata,
  loadGraphMetadata,
  refreshGraphMetadataForSpecFolder,
  type GraphMetadata,
} from '@spec-kit/mcp-server/api';

const SPEC_FOLDER_RE = /^\d{3}(?:[-_].+)?$/;
const EXCLUDED_DIRS = new Set(['memory', 'scratch', 'node_modules', '.git']);
const ARCHIVE_SEGMENT_RE = /(^|\/)(z_archive|z_future)(\/|$)/;

interface BackfillSummary {
  dryRun: boolean;
  root: string;
  totalSpecFolders: number;
  created: number;
  refreshed: number;
  existing: number;
  lineageStamped: number;
  reviewFlags: Array<{ specFolder: string; flags: string[] }>;
}

export interface BackfillOptions {
  dryRun: boolean;
  root: string;
  activeOnly?: boolean;
}

function resolveRepoRoot(): string {
  const cwdCandidate = path.resolve(process.cwd());
  if (fs.existsSync(path.join(cwdCandidate, '.opencode', 'specs'))) {
    return cwdCandidate;
  }

  let current = path.resolve(__dirname);
  let lastMatch: string | null = null;
  while (true) {
    if (fs.existsSync(path.join(current, '.opencode', 'specs'))) {
      lastMatch = current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  if (lastMatch) {
    return lastMatch;
  }
  return path.resolve(__dirname, '..', '..', '..', '..', '..');
}

function parseArgs(argv: string[]): { dryRun: boolean; root: string; activeOnly: boolean } {
  let dryRun = false;
  let root = path.join(resolveRepoRoot(), '.opencode', 'specs');
  let activeOnly = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--active-only') {
      activeOnly = true;
      continue;
    }
    if (arg === '--include-archive') {
      activeOnly = false;
      continue;
    }
    if (arg === '--root') {
      root = path.resolve(argv[index + 1] ?? root);
      index += 1;
    }
  }

  return { dryRun, root, activeOnly };
}

function isSpecFolder(dirPath: string): boolean {
  const base = path.basename(dirPath);
  return SPEC_FOLDER_RE.test(base) && fs.existsSync(path.join(dirPath, 'spec.md'));
}

function isArchivedTraversalPath(dirPath: string): boolean {
  return ARCHIVE_SEGMENT_RE.test(dirPath.replace(/\\/g, '/'));
}

/**
 * Collect spec folders eligible for graph-metadata refresh.
 *
 * @param root - Specs root to traverse
 * @param options - Traversal controls such as `activeOnly`
 * @returns Sorted list of discovered spec-folder paths
 */
export function collectSpecFolders(
  root: string,
  options: Pick<BackfillOptions, 'activeOnly'> = {},
): string[] {
  const folders: string[] = [];
  const activeOnly = options.activeOnly ?? false;

  function walk(currentPath: string): void {
    if (activeOnly && isArchivedTraversalPath(currentPath)) {
      return;
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    if (isSpecFolder(currentPath)) {
      folders.push(currentPath);
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (EXCLUDED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
        continue;
      }
      walk(path.join(currentPath, entry.name));
    }
  }

  walk(root);
  return folders.sort();
}

/**
 * Derive human-review flags for a refreshed graph-metadata payload.
 *
 * @param specFolderPath - Absolute path to the packet folder being inspected
 * @param metadata - Derived or refreshed graph metadata for the packet
 * @returns List of review flags describing low-confidence derivations
 */
export function collectReviewFlags(specFolderPath: string, metadata: GraphMetadata): string[] {
  const flags: string[] = [];
  const specDoc = fs.existsSync(path.join(specFolderPath, 'spec.md'))
    ? fs.readFileSync(path.join(specFolderPath, 'spec.md'), 'utf-8')
    : '';
  const planDoc = fs.existsSync(path.join(specFolderPath, 'plan.md'))
    ? fs.readFileSync(path.join(specFolderPath, 'plan.md'), 'utf-8')
    : '';

  if (metadata.derived.status === 'planned' && !/\nstatus:\s*["']?(planned|complete|in_progress|blocked)/i.test(`${specDoc}\n${planDoc}`)) {
    flags.push('ambiguous_status');
  }
  if (
    metadata.derived.causal_summary === 'Packet metadata derived from canonical spec documents.'
    || metadata.derived.causal_summary.trim().length < 40
  ) {
    flags.push('missing_summary');
  }
  if (/(depends on|supersedes|related to)/i.test(`${specDoc}\n${planDoc}`)) {
    flags.push('prose_relationship_hints');
  }
  if (metadata.derived.source_docs.length < 3) {
    flags.push('thin_source_docs');
  }

  return flags;
}

/**
 * Backfill graph-metadata files across the selected specs tree.
 *
 * @param options - Backfill execution options
 * @returns Aggregate summary of created, refreshed, and flagged packets
 */
export function runBackfill({ dryRun, root, activeOnly = false }: BackfillOptions): BackfillSummary {
  const specFolders = collectSpecFolders(root, { activeOnly });
  const summary: BackfillSummary = {
    dryRun,
    root,
    totalSpecFolders: specFolders.length,
    created: 0,
    refreshed: 0,
    existing: 0,
    lineageStamped: 0,
    reviewFlags: [],
  };

  for (const specFolderPath of specFolders) {
    const graphPath = path.join(specFolderPath, 'graph-metadata.json');
    const existing = loadGraphMetadata(graphPath);
    const saveLineage = existing?.derived.save_lineage ?? 'graph_only';
    if (existing) {
      summary.existing += 1;
    }

    const metadata = dryRun
      ? deriveGraphMetadata(specFolderPath, existing, { saveLineage })
      : refreshGraphMetadataForSpecFolder(specFolderPath, { saveLineage }).metadata;

    if (!existing) {
      summary.created += 1;
    } else {
      summary.refreshed += 1;
      if (!dryRun && !existing.derived.save_lineage && metadata.derived.save_lineage === 'graph_only') {
        summary.lineageStamped += 1;
      }
    }

    const flags = collectReviewFlags(specFolderPath, metadata);
    if (flags.length > 0) {
      summary.reviewFlags.push({
        specFolder: metadata.spec_folder,
        flags,
      });
    }
  }

  return summary;
}

function run(): void {
  const summary = runBackfill(parseArgs(process.argv.slice(2)));
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (require.main === module) {
  run();
}
