// ───────────────────────────────────────────────────────────────
// MODULE: Alignment Validator
// ───────────────────────────────────────────────────────────────
// Spec folder alignment checking and tree-thinning application
// for file change lists. Extracted from workflow.ts to reduce module size.

import * as path from 'node:path';
import { extractSpecFolderContext } from '../extractors/spec-folder-extractor.js';
import { normalizeFilePath, getParentDirectory, buildAlignmentKeywords } from './workflow-path-utils.js';
import { capText } from './workflow-accessors.js';
import type { FileChange } from '../types/session-types.js';
import type { ThinningResult } from './tree-thinning.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type AlignmentTargets = {
  fileTargets: string[];
  keywordTargets: string[];
};

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const PREFERRED_PARENT_FILES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'readme.md',
]);

type FileChangeWithMergeMetadata = FileChange & {
  merged_sources?: string[];
  MERGED_PROVENANCE?: string;
};

function dedupeStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

function stripMergedSummary(description: string): string {
  return description.replace(/\s*\|\s*\(merged from \d+ sources?\)\s*$/i, '').trim();
}

function updateMergedCarrier(
  file: FileChange,
  mergedSources: string[],
  mergedContent: string,
): void {
  const target = file as FileChangeWithMergeMetadata;
  const allMergedSources = dedupeStrings([
    ...(target.merged_sources ?? []),
    ...mergedSources,
  ]);

  target.merged_sources = allMergedSources;
  target.MERGED_PROVENANCE = capText(
    dedupeStrings([
      target.MERGED_PROVENANCE ?? '',
      mergedContent,
    ]).join(' | '),
    900,
  );

  const baseDescription = target._synthetic
    ? `Tree-thinning merged ${allMergedSources.length} small files`
    : stripMergedSummary(target.DESCRIPTION || '');
  const mergedSummary = `(merged from ${allMergedSources.length} source${allMergedSources.length === 1 ? '' : 's'})`;

  target.DESCRIPTION = capText(
    baseDescription.length > 0
      ? `${baseDescription} | ${mergedSummary}`
      : mergedSummary,
    900,
  );
}

// ───────────────────────────────────────────────────────────────
// 3. FUNCTIONS
// ───────────────────────────────────────────────────────────────

export async function resolveAlignmentTargets(specFolderPath: string): Promise<AlignmentTargets> {
  const keywordTargets = buildAlignmentKeywords(specFolderPath);
  const fileTargets = new Set<string>();

  try {
    const specContext = await extractSpecFolderContext(path.resolve(specFolderPath));
    for (const entry of specContext.FILES) {
      const normalized = normalizeFilePath(entry.FILE_PATH).toLowerCase();
      if (normalized) {
        fileTargets.add(normalized);
      }
    }
  } catch (_error: unknown) {
    // Fall back to keyword-only alignment when spec docs are unavailable.
  }

  return {
    fileTargets: Array.from(fileTargets),
    keywordTargets,
  };
}

export function matchesAlignmentTarget(filePath: string, alignmentTargets: AlignmentTargets): boolean {
  const normalizedPath = normalizeFilePath(filePath).toLowerCase();

  if (alignmentTargets.fileTargets.some((target) => (
    normalizedPath === target
    || normalizedPath.endsWith(`/${target}`)
    || normalizedPath.includes(`/${target}/`)
  ))) {
    return true;
  }

  return alignmentTargets.keywordTargets.some((keyword) => normalizedPath.includes(keyword));
}

export function pickCarrierIndex(indices: number[], files: FileChange[]): number {
  for (const idx of indices) {
    const filename = path.basename(files[idx].FILE_PATH).toLowerCase();
    if (PREFERRED_PARENT_FILES.has(filename)) {
      return idx;
    }
  }
  return indices[0];
}

export function compactMergedContent(value: string): string {
  return value
    .replace(/<!--\s*merged from:\s*([^>]+)\s*-->/gi, 'Merged from $1:')
    .replace(/\n\s*---\s*\n/g, ' | ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Apply tree-thinning decisions to the semantic file-change list that feeds
 * context template rendering.
 *
 * Behavior:
 * - `keep` and `content-as-summary` rows remain as individual entries.
 * - `merged-into-parent` rows are removed as standalone entries.
 * - Each merged group contributes a compact merge note to a carrier file in the
 *   same parent directory (or to a synthetic merged entry when no carrier exists).
 *
 * This makes tree thinning effective in the generated context output (instead of
 * only being computed/logged), while preserving merge provenance for recoverability.
 */
export function applyThinningToFileChanges(
  files: FileChange[],
  thinningResult: ThinningResult
): FileChange[] {
  if (!Array.isArray(files) || files.length === 0) {
    return files;
  }

  const actionByPath = new Map<string, string>(
    thinningResult.thinned.map((entry) => [normalizeFilePath(entry.path), entry.action])
  );

  const originalByPath = new Map<string, FileChange>();
  for (const file of files) {
    originalByPath.set(normalizeFilePath(file.FILE_PATH), file);
  }

  const reducedFiles: FileChange[] = files
    .filter((file) => {
      const action = actionByPath.get(normalizeFilePath(file.FILE_PATH)) ?? 'keep';
      return action !== 'merged-into-parent';
    })
    .map((file) => ({ ...file }));

  const indicesByParent = new Map<string, number[]>();
  for (let i = 0; i < reducedFiles.length; i++) {
    const parent = getParentDirectory(reducedFiles[i].FILE_PATH);
    const existing = indicesByParent.get(parent) ?? [];
    existing.push(i);
    indicesByParent.set(parent, existing);
  }

  for (const mergedGroup of thinningResult.merged) {
    const normalizedChildren = mergedGroup.childPaths.map(normalizeFilePath);
    const childFiles = normalizedChildren
      .map((childPath) => originalByPath.get(childPath))
      .filter((f): f is FileChange => !!f);

    if (childFiles.length === 0) {
      continue;
    }

    const mergedContent = compactMergedContent(mergedGroup.mergedSummary);
    const mergedSources = childFiles.map((f) => f.FILE_PATH);

    const parentDir = normalizeFilePath(mergedGroup.parentPath || '');
    const carrierIndices = indicesByParent.get(parentDir) ?? [];

    if (carrierIndices.length > 0) {
      const carrierIdx = pickCarrierIndex(carrierIndices, reducedFiles);
      updateMergedCarrier(reducedFiles[carrierIdx], mergedSources, mergedContent);
      continue;
    }

    const syntheticPath = parentDir.length > 0
      ? `${parentDir}/(merged-small-files)`
      : '(merged-small-files)';

    const syntheticEntry = {
      FILE_PATH: syntheticPath,
      DESCRIPTION: '',
      ACTION: 'Merged',
      _synthetic: true,
    } as FileChange;
    updateMergedCarrier(syntheticEntry, mergedSources, mergedContent);

    const idx = reducedFiles.push(syntheticEntry) - 1;
    const updatedIndices = indicesByParent.get(parentDir) ?? [];
    updatedIndices.push(idx);
    indicesByParent.set(parentDir, updatedIndices);
  }

  return reducedFiles;
}
