// ---------------------------------------------------------------
// MODULE: Tree Thinning
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TREE THINNING
// ───────────────────────────────────────────────────────────────
// Bottom-up merging of small files during spec folder context
// Loading to reduce token overhead before the retrieval pipeline starts.
//
// This operates PRE-PIPELINE (context loading step) and does NOT affect
// Pipeline stages or scoring.

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** Represents thinning config. */
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

/** Defines default thinning config. */
export const DEFAULT_THINNING_CONFIG: ThinningConfig = {
  mergeThreshold: 200,
  contentAsTextThreshold: 500,
  memoryThinThreshold: 150,    // Fix 7: was 300 — too aggressive, merged substantial files
  memoryTextThreshold: 100,
};

/** Represents a file input for the thinning pipeline (path + content only). */
export interface ThinFileInput {
  path: string;
  content: string;
}

/** Compat alias for ThinFileInput. */
export type FileEntry = ThinFileInput;

/** Represents thin file entry. */
export interface ThinFileEntry {
  path: string;
  content: string;
  tokenCount: number;
  action: 'keep' | 'content-as-summary' | 'merged-into-parent';
}

/** Represents merged file entry. */
export interface MergedFileEntry {
  parentPath: string;
  childPaths: string[];
  mergedSummary: string;
}

/** Represents thinning result. */
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

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
------------------------------------------------------------------*/

// Canonical shared implementation — imported and re-exported for backward compatibility
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
/** Re-export for backward compatibility. Prefer direct import from @spec-kit/shared/utils/token-estimate. */
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
function groupByParent(files: ThinFileInput[]): Map<string, ThinFileInput[]> {
  const groups = new Map<string, ThinFileInput[]>();
  for (const file of files) {
    const parent = deriveParentPath(file.path) ?? '';
    const list = groups.get(parent) ?? [];
    list.push(file);
    groups.set(parent, list);
  }
  return groups;
}

/**
 * Generate a brief description from merged child file entries.
 * CG-06: Replace "description pending" with actual file-based descriptions.
 */
export function generateMergedDescription(children: ThinFileInput[]): string {
  const count = children.length;
  const fileNames = children
    .map((child) => {
      const parts = child.path.split('/');
      return parts[parts.length - 1] || child.path;
    })
    .filter(Boolean);

  if (fileNames.length === 0) {
    return `Modified ${count} file${count !== 1 ? 's' : ''}`;
  }

  const joined = fileNames.slice(0, 3).join(', ');
  const suffix = fileNames.length > 3 ? `, +${fileNames.length - 3} more` : '';
  const description = `Modified ${count} file${count !== 1 ? 's' : ''}: ${joined}${suffix}`;

  // Word-boundary truncation if too long
  if (description.length > 80) {
    const truncated = description.substring(0, 77);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }

  return description;
}

/**
 * Build a merged summary string from a set of child file entries.
 * Preserves all content with path headers to prevent content loss.
 */
function buildMergedSummary(children: ThinFileInput[]): string {
  const description = generateMergedDescription(children);
  const descHeader = `<!-- description: ${description} -->\n`;
  return descHeader + children
    .map((child) => {
      const header = `<!-- merged from: ${child.path} -->\n`;
      return `${header}${child.content}`;
    })
    .join('\n\n---\n\n');
}

/* ───────────────────────────────────────────────────────────────
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

/* ───────────────────────────────────────────────────────────────
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
  files: ThinFileInput[],
  config?: Partial<ThinningConfig>
): ThinningResult {
  const cfg: ThinningConfig = { ...DEFAULT_THINNING_CONFIG, ...config };

  const thinned: ThinFileEntry[] = [];
  const toMerge: ThinFileInput[] = [];

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
  // Fix 7: Cap at 3 children per parent — keep subsequent files separate
  const merged: MergedFileEntry[] = [];
  const byParent = groupByParent(toMerge);

  for (const [parentPath, children] of byParent.entries()) {
    if (children.length === 0) {
      continue;
    }
    const toMergeChildren = children.slice(0, 3);
    const toKeepChildren = children.slice(3);
    merged.push({
      parentPath,
      childPaths: toMergeChildren.map((c) => c.path),
      mergedSummary: buildMergedSummary(toMergeChildren),
    });
    // Upgrade overflow children back to 'keep' so they aren't lost
    for (const kept of toKeepChildren) {
      const entry = thinned.find((t) => t.path === kept.path);
      if (entry) {
        entry.action = 'keep';
      }
    }
  }

  // Stats
  const thinnedCount = thinned.filter(
    (f) => f.action === 'content-as-summary'
  ).length;
  const mergedCount = thinned.filter(
    (f) => f.action === 'merged-into-parent'
  ).length;

  // Tokens saved: estimate the overhead removed by not generating separate
  // Summaries for content-as-summary files, and by collapsing merged children.
  // For merged files the parent holds them, so no token saving in content terms,
  // But we avoid a separate summary-generation pass (≈ half the tokens as overhead).
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
