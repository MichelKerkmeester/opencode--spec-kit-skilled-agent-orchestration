// ───────────────────────────────────────────────────────────────
// MODULE: Alignment Validator
// ───────────────────────────────────────────────────────────────
// Spec folder alignment checking and tree-thinning application
// for file change lists. Extracted from workflow.ts to reduce module size.

import * as path from 'node:path';
import { extractSpecFolderContext } from '../extractors/spec-folder-extractor';
import { normalizeFilePath, getParentDirectory, buildAlignmentKeywords } from './workflow-path-utils';
import { capText } from './workflow-accessors';
import type { FileChange } from '../types/session-types';
import type { ThinningResult } from './tree-thinning';

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

    const childNames = childFiles.map((f) => path.basename(f.FILE_PATH));
    const mergedContent = compactMergedContent(mergedGroup.mergedSummary);

    const mergeNote = capText(
      `Tree-thinning merged ${childFiles.length} small files (${childNames.join(', ')}). ${mergedContent}`,
      900,
    );

    const parentDir = normalizeFilePath(mergedGroup.parentPath || '');
    const carrierIndices = indicesByParent.get(parentDir) ?? [];

    if (carrierIndices.length > 0) {
      const carrierIdx = pickCarrierIndex(carrierIndices, reducedFiles);
      const existingDescription = reducedFiles[carrierIdx].DESCRIPTION || '';
      const mergedDescription = existingDescription.includes(mergeNote)
        ? existingDescription
        : (existingDescription.length > 0 ? `${existingDescription} | ${mergeNote}` : mergeNote);
      reducedFiles[carrierIdx].DESCRIPTION = capText(
        mergedDescription,
        900,
      );
      continue;
    }

    const syntheticPath = parentDir.length > 0
      ? `${parentDir}/(merged-small-files)`
      : '(merged-small-files)';

    const syntheticEntry: FileChange = {
      FILE_PATH: syntheticPath,
      DESCRIPTION: mergeNote,
      ACTION: 'Merged',
      _synthetic: true,
    };

    const idx = reducedFiles.push(syntheticEntry) - 1;
    const updatedIndices = indicesByParent.get(parentDir) ?? [];
    updatedIndices.push(idx);
    indicesByParent.set(parentDir, updatedIndices);
  }

  return reducedFiles;
}
