// ---------------------------------------------------------------
// MODULE: Subfolder Utils
// CORE: SUBFOLDER UTILS
// ---------------------------------------------------------------

import * as path from 'path';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { CONFIG, getSpecsDirectories } from './config';

/** Pattern for strict spec folder names: 3 digits + kebab-case suffix. */
export const SPEC_FOLDER_PATTERN: RegExp = /^\d{3}-[a-z][a-z0-9-]*$/;

/** Basic pattern for initial spec folder detection (less strict). */
export const SPEC_FOLDER_BASIC_PATTERN: RegExp = /^\d{3}-[a-zA-Z]/;

/** Pattern for category/organizational folders: 2 digits + double-hyphen + kebab-case (e.g., "02--system-spec-kit"). */
export const CATEGORY_FOLDER_PATTERN: RegExp = /^\d{2}--[a-z][a-z0-9-]*$/;

/** Maximum recursive search depth for child folder resolution. */
export const SEARCH_MAX_DEPTH = 4;

export interface FindChildOptions {
  /** Called when ambiguous matches are found. Defaults to console.error. */
  onAmbiguity?: (childName: string, paths: string[]) => void;
}

export interface PhaseFolderRejection {
  phaseFolderPath: string;
  owningRootSpecFolder: string;
  reason: 'child-phase-markers' | 'parent-phase-map' | 'legacy-phase-container';
  message: string;
}

/** Check if a directory entry is traversable during child folder search. */
function isTraversableFolder(name: string): boolean {
  return SPEC_FOLDER_PATTERN.test(name) || CATEGORY_FOLDER_PATTERN.test(name);
}

function isDirectorySync(filePath: string): boolean {
  try {
    return fsSync.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function readFileIfExistsSync(filePath: string): string | null {
  try {
    if (!fsSync.statSync(filePath).isFile()) {
      return null;
    }
    return fsSync.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function toProjectRelativePath(filePath: string): string {
  const relative = path.relative(CONFIG.PROJECT_ROOT, filePath).replace(/\\/g, '/');
  if (!relative.startsWith('..') && !path.isAbsolute(relative)) {
    return relative;
  }
  return path.resolve(filePath).replace(/\\/g, '/');
}

function hasChildPhaseMarkers(specContent: string): boolean {
  return /\.\.\/spec\.md/i.test(specContent) ||
    /^\|\s*\*\*Parent Spec\*\*/im.test(specContent) ||
    /^parent\s*:/im.test(specContent) ||
    /^phase\s*:\s*\d+\s+of\s+\d+/im.test(specContent);
}

function listImmediateChildSpecFoldersSync(parentPath: string): string[] {
  try {
    return fsSync.readdirSync(parentPath).filter((entry) => {
      if (!SPEC_FOLDER_PATTERN.test(entry)) {
        return false;
      }
      return isDirectorySync(path.join(parentPath, entry));
    });
  } catch {
    return [];
  }
}

function isLegacyPhaseContainerSync(parentPath: string): boolean {
  if (readFileIfExistsSync(path.join(parentPath, 'spec.md'))) {
    return false;
  }

  if (!isDirectorySync(path.join(parentPath, 'memory'))) {
    return false;
  }

  return listImmediateChildSpecFoldersSync(parentPath).length > 1;
}

function buildPhaseFolderRejection(
  phaseFolderPath: string,
  owningRootSpecFolder: string,
  reason: PhaseFolderRejection['reason']
): PhaseFolderRejection {
  const phaseDisplayPath = toProjectRelativePath(phaseFolderPath);
  const rootDisplayPath = toProjectRelativePath(owningRootSpecFolder);

  return {
    phaseFolderPath,
    owningRootSpecFolder,
    reason,
    message: [
      `Direct memory saves cannot target a phase folder: ${phaseDisplayPath}`,
      `Save to the owning root spec folder instead: ${rootDisplayPath}`,
      'Phase-folder targets are rejected deterministically and are not rerouted.'
    ].join('\n')
  };
}

export function getPhaseFolderRejectionSync(specFolderPath: string): PhaseFolderRejection | null {
  if (!specFolderPath) {
    return null;
  }

  const resolvedPath = path.resolve(specFolderPath);
  const parentPath = path.dirname(resolvedPath);
  const folderName = path.basename(resolvedPath);
  const parentFolderName = path.basename(parentPath);

  if (!SPEC_FOLDER_PATTERN.test(folderName) || !SPEC_FOLDER_PATTERN.test(parentFolderName)) {
    return null;
  }

  const childSpecContent = readFileIfExistsSync(path.join(resolvedPath, 'spec.md'));
  if (childSpecContent && hasChildPhaseMarkers(childSpecContent)) {
    return buildPhaseFolderRejection(resolvedPath, parentPath, 'child-phase-markers');
  }

  const parentSpecContent = readFileIfExistsSync(path.join(parentPath, 'spec.md'));
  if (parentSpecContent && /PHASE DOCUMENTATION MAP/i.test(parentSpecContent)) {
    return buildPhaseFolderRejection(resolvedPath, parentPath, 'parent-phase-map');
  }

  if (isLegacyPhaseContainerSync(parentPath)) {
    return buildPhaseFolderRejection(resolvedPath, parentPath, 'legacy-phase-container');
  }

  return null;
}

/** Find a bare child folder under all spec parents (sync, recursive up to SEARCH_MAX_DEPTH). */
export function findChildFolderSync(childName: string, options?: FindChildOptions): string | null {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];
  const visited = new Set<string>();
  const warnings: string[] = [];

  // Deduplicate aliased roots upfront to avoid duplicate traversal
  const uniqueRoots = new Map<string, string>();
  for (const specsDir of specsDirs) {
    if (!fsSync.existsSync(specsDir)) continue;
    let realRoot: string;
    try { realRoot = fsSync.realpathSync(specsDir); } catch { realRoot = path.resolve(specsDir); }
    if (!uniqueRoots.has(realRoot)) {
      uniqueRoots.set(realRoot, specsDir);
    }
  }

  function searchDir(dir: string, depth: number): void {
    if (depth > SEARCH_MAX_DEPTH) {
      warnings.push(`Search depth limit reached at: ${dir}`);
      return;
    }
    // Prevent cycle revisits via real-path tracking
    let realDir: string;
    try { realDir = fsSync.realpathSync(dir); } catch { realDir = path.resolve(dir); }
    if (visited.has(realDir)) return;
    visited.add(realDir);

    let dirents: fsSync.Dirent[];
    try {
      dirents = fsSync.readdirSync(dir, { withFileTypes: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      warnings.push(`Could not read directory ${dir}: ${msg}`);
      return;
    }

    for (const dirent of dirents) {
      if (dirent.isSymbolicLink()) continue;
      if (!dirent.isDirectory()) continue;

      if (dirent.name === childName) {
        matches.push(path.join(dir, dirent.name));
      } else if (isTraversableFolder(dirent.name)) {
        searchDir(path.join(dir, dirent.name), depth + 1);
      }
    }
  }

  for (const specsDir of uniqueRoots.values()) {
    searchDir(specsDir, 0);
  }

  if (warnings.length > 0 && process.env.DEBUG) {
    warnings.forEach((w) => console.warn(`   [subfolder-utils] ${w}`));
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    // Deduplicate aliased results (belt-and-suspenders with root dedup)
    const uniqueReal = [...new Set(matches.map((m) => {
      try { return fsSync.realpathSync(m); } catch { return m; }
    }))];
    if (uniqueReal.length === 1) {
      return matches[0];
    }
    const ambiguityHandler = options?.onAmbiguity ?? ((name: string, paths: string[]) => {
      console.error(`❌ Ambiguous child folder "${name}" found in multiple locations:`);
      paths.forEach((p) => console.error(`   - ${p}`));
    });
    ambiguityHandler(childName, matches);
    return null;
  }

  return null;
}

/** Find a bare child folder under all spec parents (async, recursive up to SEARCH_MAX_DEPTH). */
export async function findChildFolderAsync(childName: string, options?: FindChildOptions): Promise<string | null> {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];
  const visited = new Set<string>();
  const warnings: string[] = [];

  // Deduplicate aliased roots upfront to avoid duplicate traversal
  const uniqueRoots = new Map<string, string>();
  for (const specsDir of specsDirs) {
    try {
      await fs.access(specsDir);
      let realRoot: string;
      try { realRoot = await fs.realpath(specsDir); } catch { realRoot = path.resolve(specsDir); }
      if (!uniqueRoots.has(realRoot)) {
        uniqueRoots.set(realRoot, specsDir);
      }
    } catch {
      continue;
    }
  }

  async function searchDir(dir: string, depth: number): Promise<void> {
    if (depth > SEARCH_MAX_DEPTH) {
      warnings.push(`Search depth limit reached at: ${dir}`);
      return;
    }
    let realDir: string;
    try { realDir = await fs.realpath(dir); } catch { realDir = path.resolve(dir); }
    if (visited.has(realDir)) return;
    visited.add(realDir);

    let dirents: fsSync.Dirent[];
    try {
      dirents = await fs.readdir(dir, { withFileTypes: true }) as fsSync.Dirent[];
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      warnings.push(`Could not read directory ${dir}: ${msg}`);
      return;
    }

    for (const dirent of dirents) {
      if (dirent.isSymbolicLink()) continue;
      if (!dirent.isDirectory()) continue;

      if (dirent.name === childName) {
        matches.push(path.join(dir, dirent.name));
      } else if (isTraversableFolder(dirent.name)) {
        await searchDir(path.join(dir, dirent.name), depth + 1);
      }
    }
  }

  for (const specsDir of uniqueRoots.values()) {
    await searchDir(specsDir, 0);
  }

  if (warnings.length > 0 && process.env.DEBUG) {
    warnings.forEach((w) => console.warn(`   [subfolder-utils] ${w}`));
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    const uniqueReal = [...new Set(await Promise.all(matches.map(async (m) => {
      try { return await fs.realpath(m); } catch { return m; }
    })))];
    if (uniqueReal.length === 1) {
      return matches[0];
    }
    const ambiguityHandler = options?.onAmbiguity ?? ((name: string, paths: string[]) => {
      console.error(`❌ Ambiguous child folder "${name}" found in multiple locations:`);
      paths.forEach((p) => console.error(`   - ${p}`));
    });
    ambiguityHandler(childName, matches);
    return null;
  }

  return null;
}
