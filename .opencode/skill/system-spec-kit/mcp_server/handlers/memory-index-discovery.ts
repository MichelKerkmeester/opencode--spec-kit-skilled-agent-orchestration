// ---------------------------------------------------------------
// MODULE: Memory Index Discovery Helpers
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';

import { toErrorMessage } from '../utils';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

/** Well-known spec folder document filenames. */
const SPEC_DOCUMENT_FILENAMES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  'research.md',
  'handover.md',
]);

/** Directories to exclude from spec document discovery. */
const SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules']);

/** Constitutional markdown basenames intentionally excluded from indexing. */
const EXCLUDED_CONSTITUTIONAL_BASENAMES = new Set(['readme.md', 'readme.txt']);

export interface SpecDiscoveryOptions {
  specFolder?: string | null;
}

/**
 * Discover spec folder documents (.opencode/specs/ directory tree).
 * Finds spec.md, plan.md, tasks.md, checklist.md, decision-record.md,
 * implementation-summary.md, research.md, handover.md.
 *
 * Excludes scratch/, memory/, and hidden directories.
 */
export function findSpecDocuments(workspacePath: string, options: SpecDiscoveryOptions = {}): string[] {
  // Feature flag: allow opt-out.
  if (process.env.SPECKIT_INDEX_SPEC_DOCS === 'false') {
    return [];
  }

  const results: string[] = [];
  const seenCanonicalRoots = new Set<string>();
  const seenCanonicalFiles = new Set<string>();

  function walkSpecsDir(specsRoot: string, dir: string): void {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Skip excluded directories and hidden dirs.
          if (SPEC_DOC_EXCLUDE_DIRS.has(entry.name) || entry.name.startsWith('.')) {
            continue;
          }
          walkSpecsDir(specsRoot, path.join(dir, entry.name));
        } else if (entry.isFile() && SPEC_DOCUMENT_FILENAMES.has(entry.name.toLowerCase())) {
          const fullPath = path.join(dir, entry.name);

          // If specFolder filter is provided, check it matches.
          if (options.specFolder) {
            const normalizedSpecFolder = options.specFolder.replace(/\\/g, '/').replace(/\/+$/, '');
            const relativePath = path.relative(specsRoot, fullPath).replace(/\\/g, '/');
            if (
              relativePath !== normalizedSpecFolder &&
              !relativePath.startsWith(`${normalizedSpecFolder}/`)
            ) {
              continue;
            }
          }

          const fileKey = getCanonicalPathKey(fullPath);
          if (seenCanonicalFiles.has(fileKey)) {
            continue;
          }

          seenCanonicalFiles.add(fileKey);
          results.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read.
    }
  }

  // Check both possible specs locations.
  const specsRoots = [
    path.join(workspacePath, '.opencode', 'specs'),
    path.join(workspacePath, 'specs'),
  ];

  for (const specsRoot of specsRoots) {
    if (!fs.existsSync(specsRoot)) continue;

    const rootKey = getCanonicalPathKey(specsRoot);
    if (seenCanonicalRoots.has(rootKey)) {
      continue;
    }

    seenCanonicalRoots.add(rootKey);
    walkSpecsDir(specsRoot, specsRoot);
  }

  return results;
}

/**
 * Detect the spec documentation level from a spec.md file.
 * Reads first 2KB looking for <!-- SPECKIT_LEVEL: N --> marker.
 * Falls back to document completeness heuristic if marker not found.
 */
export function detectSpecLevel(specPath: string): number | null {
  try {
    // Read first 2KB for the level marker.
    const fd = fs.openSync(specPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);

    // Look for SPECKIT_LEVEL marker.
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // AI-WHY: Heuristic fallback: check sibling files.
    const dir = path.dirname(specPath);
    try {
      const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
      const hasDecisionRecord = siblings.includes('decision-record.md');
      const hasChecklist = siblings.includes('checklist.md');

      if (hasDecisionRecord) return 3;
      if (hasChecklist) return 2;
      return 1;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/** Discover constitutional memory files from skill constitutional directories. */
export function findConstitutionalFiles(workspacePath: string): string[] {
  const results: string[] = [];
  const skillDir = path.join(workspacePath, '.opencode', 'skill');

  if (!fs.existsSync(skillDir)) return results;

  try {
    const skillEntries = fs.readdirSync(skillDir, { withFileTypes: true });
    for (const entry of skillEntries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const constitutionalDir = path.join(skillDir, entry.name, 'constitutional');
      if (!fs.existsSync(constitutionalDir)) continue;
      try {
        const files = fs.readdirSync(constitutionalDir, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.md')) {
            if (EXCLUDED_CONSTITUTIONAL_BASENAMES.has(file.name.toLowerCase())) continue;
            results.push(path.join(constitutionalDir, file.name));
          }
        }
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`Warning: Could not read constitutional dir ${constitutionalDir}:`, message);
      }
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn(`Warning: Could not read skill directory:`, message);
  }
  return results;
}
