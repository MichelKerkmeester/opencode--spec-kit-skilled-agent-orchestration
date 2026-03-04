// ---------------------------------------------------------------
// MODULE: Tree Thinning
// Bottom-up merging of small files during spec folder context
// loading to reduce token overhead before the retrieval pipeline starts.
//
// This operates PRE-PIPELINE (context loading step) and does NOT affect
// pipeline stages or scoring.
// ---------------------------------------------------------------

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

export interface ThinningConfig {
  /** Files under this token count are merged into parent document */
  mergeThreshold: number;
  /** Files under this token count use content directly as summary */
  contentAsTextThreshold: number;
  /** Memory-specific thinning trigger threshold */
  memoryThinThreshold: number;
  /** Memory-specific threshold where text itself is the summary */
  memoryTextThreshold: number;
}

export const DEFAULT_THINNING_CONFIG: ThinningConfig = {
  mergeThreshold: 200,
  contentAsTextThreshold: 500,
  memoryThinThreshold: 300,
  memoryTextThreshold: 100,
};

export interface FileEntry {
  path: string;
  content: string;
}

export interface ThinFileEntry {
  path: string;
  content: string;
  tokenCount: number;
  action: 'keep' | 'content-as-summary' | 'merged-into-parent';
}

export interface MergedFileEntry {
  parentPath: string;
  childPaths: string[];
  mergedSummary: string;
}

export interface ThinningResult {
  thinned: ThinFileEntry[];
  merged: MergedFileEntry[];
  stats: {
    totalFiles: number;
    thinnedCount: number;
    mergedCount: number;
    tokensSaved: number;
  };
}

/* -----------------------------------------------------------------
   2. HELPERS
------------------------------------------------------------------*/

// Canonical shared implementation — imported and re-exported for backward compatibility
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
export { estimateTokenCount };

/**
 * Determine whether a file path is a memory file.
 * Memory files live under any directory segment named "memory".
 */
export function isMemoryFile(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.includes('/memory/');
}

/**
 * Derive the parent path from a child path by stripping the last segment.
 * Returns null for top-level files (no parent directory component).
 */
export function deriveParentPath(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, '/');
  const segments = normalized.split('/').filter(Boolean);
  if (segments.length <= 1) {
    return null;
  }
  segments.pop();
  return segments.join('/');
}

/**
 * Group file entries by their parent directory path.
 * Files without a parent are stored under the special key ''.
 */
function groupByParent(files: FileEntry[]): Map<string, FileEntry[]> {
  const groups = new Map<string, FileEntry[]>();
  for (const file of files) {
    const parent = deriveParentPath(file.path) ?? '';
    const list = groups.get(parent) ?? [];
    list.push(file);
    groups.set(parent, list);
  }
  return groups;
}

/**
 * Build a merged summary string from a set of child file entries.
 * Preserves all content with path headers to prevent content loss.
 */
function buildMergedSummary(children: FileEntry[]): string {
  return children
    .map((child) => {
      const header = `<!-- merged from: ${child.path} -->\n`;
      return `${header}${child.content}`;
    })
    .join('\n\n---\n\n');
}

/* -----------------------------------------------------------------
   3. CORE THINNING LOGIC
------------------------------------------------------------------*/

/**
 * Determine the action for a single file based on its token count
 * and whether it is a memory file.
 */
function resolveAction(
  tokenCount: number,
  memory: boolean,
  config: ThinningConfig
): ThinFileEntry['action'] {
  if (memory) {
    if (tokenCount < config.memoryTextThreshold) {
      // Text IS the summary — no separate summary pass needed
      return 'content-as-summary';
    }
    if (tokenCount < config.memoryThinThreshold) {
      // Memory thinning trigger: merge into parent
      return 'merged-into-parent';
    }
    return 'keep';
  }

  if (tokenCount < config.mergeThreshold) {
    return 'merged-into-parent';
  }
  if (tokenCount < config.contentAsTextThreshold) {
    return 'content-as-summary';
  }
  return 'keep';
}

/* -----------------------------------------------------------------
   4. PUBLIC API
------------------------------------------------------------------*/

/**
 * Apply bottom-up tree thinning to a collection of spec folder files.
 *
 * Processing order:
 *   1. Estimate token count for each file.
 *   2. Resolve per-file action based on thresholds.
 *   3. Group files-to-merge by parent directory.
 *   4. Produce MergedFileEntry records (content preserved, no loss).
 *   5. Return ThinningResult with stats.
 *
 * This function is PURE (no I/O) and operates pre-pipeline.
 * It does NOT modify pipeline stages or scoring.
 */
export function applyTreeThinning(
  files: FileEntry[],
  config?: Partial<ThinningConfig>
): ThinningResult {
  const cfg: ThinningConfig = { ...DEFAULT_THINNING_CONFIG, ...config };

  const thinned: ThinFileEntry[] = [];
  const toMerge: FileEntry[] = [];

  // Pass 1: classify each file
  for (const file of files) {
    const tokenCount = estimateTokenCount(file.content);
    const memory = isMemoryFile(file.path);
    const action = resolveAction(tokenCount, memory, cfg);

    thinned.push({ path: file.path, content: file.content, tokenCount, action });

    if (action === 'merged-into-parent') {
      toMerge.push(file);
    }
  }

  // Pass 2: build merged entries grouped by parent (bottom-up)
  const merged: MergedFileEntry[] = [];
  const byParent = groupByParent(toMerge);

  for (const [parentPath, children] of byParent.entries()) {
    if (children.length === 0) {
      continue;
    }
    merged.push({
      parentPath,
      childPaths: children.map((c) => c.path),
      mergedSummary: buildMergedSummary(children),
    });
  }

  // Stats
  const thinnedCount = thinned.filter(
    (f) => f.action === 'content-as-summary'
  ).length;
  const mergedCount = thinned.filter(
    (f) => f.action === 'merged-into-parent'
  ).length;

  // Tokens saved: estimate the overhead removed by not generating separate
  // summaries for content-as-summary files, and by collapsing merged children.
  // For merged files the parent holds them, so no token saving in content terms,
  // but we avoid a separate summary-generation pass (≈ half the tokens as overhead).
  const tokensSaved = thinned.reduce((acc, f) => {
    if (f.action === 'content-as-summary') {
      // Saved a dedicated summary generation pass (≈ tokenCount overhead)
      return acc + Math.floor(f.tokenCount * 0.5);
    }
    if (f.action === 'merged-into-parent') {
      // Saved individual file header overhead (small, ~20 tokens per file)
      return acc + 20;
    }
    return acc;
  }, 0);

  return {
    thinned,
    merged,
    stats: {
      totalFiles: files.length,
      thinnedCount,
      mergedCount,
      tokensSaved,
    },
  };
}
