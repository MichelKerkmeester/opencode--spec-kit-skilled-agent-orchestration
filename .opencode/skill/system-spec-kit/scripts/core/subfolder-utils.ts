// ---------------------------------------------------------------
// MODULE: Subfolder Utils
// CORE: SUBFOLDER UTILS
// ---------------------------------------------------------------

import * as path from 'path';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { getSpecsDirectories } from './config';

/** Pattern for strict spec folder names: 3 digits + kebab-case suffix. */
export const SPEC_FOLDER_PATTERN: RegExp = /^\d{3}-[a-z][a-z0-9-]*$/;

/** Basic pattern for initial spec folder detection (less strict). */
export const SPEC_FOLDER_BASIC_PATTERN: RegExp = /^\d{3}-[a-zA-Z]/;

/** Pattern for category/organizational folders: 2 digits + double-hyphen + kebab-case (e.g., "02--system-spec-kit"). */
export const CATEGORY_FOLDER_PATTERN: RegExp = /^\d{2}--[a-z][a-z0-9-]*$/;

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

/** Find a bare child folder under all spec parents (sync, recursive up to MAX_DEPTH). */
export function findChildFolderSync(childName: string): string | null {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];
  const MAX_DEPTH = 4;

  function searchDir(dir: string, depth: number): void {
    if (depth > MAX_DEPTH) return;
    let entries: string[];
    try {
      entries = fsSync.readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      if (!isDirectorySync(entryPath)) continue;
      if (entry === childName) {
        matches.push(entryPath);
      } else if (isTraversableFolder(entry)) {
        searchDir(entryPath, depth + 1);
      }
    }
  }

  for (const specsDir of specsDirs) {
    if (!fsSync.existsSync(specsDir)) continue;
    searchDir(specsDir, 0);
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    // Deduplicate aliased roots (specs/ vs .opencode/specs/ pointing to same real path)
    const uniqueReal = [...new Set(matches.map((m) => {
      try { return fsSync.realpathSync(m); } catch { return m; }
    }))];
    if (uniqueReal.length === 1) {
      return matches[0];
    }
    console.error(`❌ Ambiguous child folder "${childName}" found in multiple locations:`);
    matches.forEach((m: string) => console.error(`   - ${m}`));
    return null;
  }

  return null;
}

/** Find a bare child folder under all spec parents (async, recursive up to MAX_DEPTH). */
export async function findChildFolderAsync(childName: string): Promise<string | null> {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];
  const MAX_DEPTH = 4;

  async function searchDir(dir: string, depth: number): Promise<void> {
    if (depth > MAX_DEPTH) return;
    let entries: string[];
    try {
      entries = await fs.readdir(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const entryPath = path.join(dir, entry);
      try {
        const stat = await fs.stat(entryPath);
        if (!stat.isDirectory()) continue;
        if (entry === childName) {
          matches.push(entryPath);
        } else if (isTraversableFolder(entry)) {
          await searchDir(entryPath, depth + 1);
        }
      } catch (_error: unknown) {
        continue;
      }
    }
  }

  for (const specsDir of specsDirs) {
    try {
      await fs.access(specsDir);
    } catch (_error: unknown) {
      continue;
    }
    await searchDir(specsDir, 0);
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    // Deduplicate aliased roots (specs/ vs .opencode/specs/ pointing to same real path)
    const uniqueReal = [...new Set(await Promise.all(matches.map(async (m) => {
      try { return await fs.realpath(m); } catch { return m; }
    })))];
    if (uniqueReal.length === 1) {
      return matches[0];
    }
    console.error(`❌ Ambiguous child folder "${childName}" found in multiple locations:`);
    matches.forEach((m: string) => console.error(`   - ${m}`));
    return null;
  }

  return null;
}
