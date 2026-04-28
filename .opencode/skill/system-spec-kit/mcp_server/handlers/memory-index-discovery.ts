// ────────────────────────────────────────────────────────────────
// MODULE: Memory Index Discovery Helpers
// ────────────────────────────────────────────────────────────────

/* ------- 1. DEPENDENCIES ------- */

import fs from 'fs';
import path from 'path';

import { toErrorMessage } from '../utils/index.js';
import {
  extractSpecFolderFromGraphMetadataPath,
  GRAPH_METADATA_FILENAME,
  isGraphMetadataPath,
  matchesSpecDocumentPath,
  SPEC_DOCUMENT_FILENAMES,
  shouldDescendSpecDiscoveryDirectory,
} from '../lib/config/spec-doc-paths.js';
import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import { isIndexableConstitutionalMemoryPath, shouldIndexForMemory } from '../lib/utils/index-scope.js';

// Feature catalog: Workspace scanning and indexing (memory_index_scan)
// Feature catalog: Spec folder description discovery


/* ------- 2. CONSTANTS ------- */

const SPEC_DISCOVERY_MAX_DEPTH = 20;
const SPEC_DISCOVERY_MAX_NODES = 50_000;

interface DiscoveryWalkState {
  visitedNodes: number;
  maxNodesExceeded: boolean;
  depthExceeded: boolean;
  warnings: string[];
}

function shouldAbortDiscoveryWalk(state: DiscoveryWalkState, label: string): boolean {
  if (state.maxNodesExceeded) {
    return true;
  }

  state.visitedNodes += 1;
  if (state.visitedNodes > SPEC_DISCOVERY_MAX_NODES) {
    const warning = `[memory-index-discovery] ${label} aborted after ${SPEC_DISCOVERY_MAX_NODES} filesystem nodes`;
    console.warn(warning);
    state.warnings.push(warning);
    state.maxNodesExceeded = true;
    return true;
  }

  return false;
}

/* ------- 3. DISCOVERY FUNCTIONS ------- */

export interface SpecDiscoveryOptions {
  specFolder?: string | null;
}

export interface DiscoveryCapExceeded {
  maxNodes: boolean;
  depth: boolean;
  gitignoreSize: boolean;
}

export type DiscoveryFileList = string[] & {
  warnings: string[];
  capExceeded: DiscoveryCapExceeded;
};

function createDiscoveryState(): DiscoveryWalkState {
  return {
    visitedNodes: 0,
    maxNodesExceeded: false,
    depthExceeded: false,
    warnings: [],
  };
}

function attachDiscoveryMetadata(results: string[], state: DiscoveryWalkState): DiscoveryFileList {
  return Object.assign(results, {
    warnings: [...state.warnings],
    capExceeded: {
      maxNodes: state.maxNodesExceeded,
      depth: state.depthExceeded,
      gitignoreSize: false,
    },
  });
}

function matchesScopedSpecFolder(candidatePath: string, specsRoot: string, specFolder?: string | null): boolean {
  if (!specFolder) {
    return true;
  }

  const normalizedSpecFolder = specFolder.replace(/\\/g, '/').replace(/\/+$/, '');
  const relativePath = path.relative(specsRoot, candidatePath).replace(/\\/g, '/');
  return (
    relativePath === normalizedSpecFolder
    || relativePath.startsWith(`${normalizedSpecFolder}/`)
  );
}

/**
 * Discover spec folder documents (.opencode/specs/ directory tree).
 * Gated by SPEC_DOCUMENT_FILENAMES (see lib/config/spec-doc-paths.ts) —
 * currently: spec.md, plan.md, tasks.md, checklist.md, decision-record.md,
 * implementation-summary.md, research.md (incl. research/research.md),
 * handover.md, resource-map.md, description.json.
 *
 * Excludes scratch/, memory/, iterations/, and hidden directories.
 */
export function findSpecDocuments(workspacePath: string, options: SpecDiscoveryOptions = {}): DiscoveryFileList {
  // Respect explicit opt-out to disable spec document indexing.
  if (process.env.SPECKIT_INDEX_SPEC_DOCS === 'false') {
    return attachDiscoveryMetadata([], createDiscoveryState());
  }

  const results: string[] = [];
  const seenCanonicalRoots = new Set<string>();
  const seenCanonicalFiles = new Set<string>();

  const state = createDiscoveryState();

  function walkSpecsDir(specsRoot: string, dir: string, depth = 0): void {
    if (state.maxNodesExceeded) {
      return;
    }
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (shouldAbortDiscoveryWalk(state, 'spec document discovery')) {
          return;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (depth >= SPEC_DISCOVERY_MAX_DEPTH) {
            const warning = `[memory-index-discovery] spec document discovery skipped ${fullPath} after reaching maxDepth=${SPEC_DISCOVERY_MAX_DEPTH}`;
            console.warn(warning);
            state.warnings.push(warning);
            state.depthExceeded = true;
            continue;
          }
          if (!shouldDescendSpecDiscoveryDirectory(fullPath, entry.name)) {
            continue;
          }
          walkSpecsDir(specsRoot, fullPath, depth + 1);
        } else if (entry.isFile() && SPEC_DOCUMENT_FILENAMES.has(entry.name.toLowerCase())) {
          if (!shouldIndexForMemory(fullPath)) {
            continue;
          }
          if (!matchesSpecDocumentPath(fullPath, entry.name.toLowerCase())) {
            continue;
          }

          // Enforce optional specFolder scope before including a candidate file.
          if (!matchesScopedSpecFolder(fullPath, specsRoot, options.specFolder)) {
            continue;
          }

          const fileKey = getCanonicalPathKey(fullPath);
          if (seenCanonicalFiles.has(fileKey)) {
            continue;
          }

          seenCanonicalFiles.add(fileKey);
          results.push(fullPath);
        }
      }
    } catch (_error: unknown) {
      // Ignore unreadable directories so discovery remains best-effort.
    }
  }

  // Gate D canonical continuity makes .opencode/specs authoritative.
  // Only fall back to the legacy specs/ root when the canonical root is absent.
  const canonicalSpecsRoot = path.join(workspacePath, '.opencode', 'specs');
  const legacySpecsRoot = path.join(workspacePath, 'specs');
  const specsRoots = fs.existsSync(canonicalSpecsRoot)
    ? [canonicalSpecsRoot]
    : [legacySpecsRoot];

  for (const specsRoot of specsRoots) {
    if (!fs.existsSync(specsRoot)) continue;

    const rootKey = getCanonicalPathKey(specsRoot);
    if (seenCanonicalRoots.has(rootKey)) {
      continue;
    }

    seenCanonicalRoots.add(rootKey);
    walkSpecsDir(specsRoot, specsRoot);
  }

  return attachDiscoveryMetadata(results, state);
}

/**
 * Detect the spec documentation level from a spec.md file.
 * Reads first 2KB looking for <!-- SPECKIT_LEVEL: N --> marker.
 * Falls back to document completeness heuristic if marker not found.
 */
export function detectSpecLevel(specPath: string): number | null {
  try {
    // Read only the first 2KB because SPECKIT_LEVEL markers live in the header.
    const fd = fs.openSync(specPath, 'r');
    let bytesRead = 0;
    const buffer = Buffer.alloc(2048);
    try {
      bytesRead = fs.readSync(fd, buffer, 0, 2048, 0);
    } finally {
      fs.closeSync(fd);
    }

    const header = buffer.toString('utf-8', 0, bytesRead);

    // Parse SPECKIT_LEVEL marker when present.
    const levelMatch = header.match(/<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/i);
    if (levelMatch) {
      const levelStr = levelMatch[1];
      if (levelStr === '3+') return 4;
      const level = parseInt(levelStr, 10);
      if (level >= 1 && level <= 3) return level;
    }

    // Heuristic fallback: check sibling files.
    const dir = path.dirname(specPath);
    try {
      const siblings = fs.readdirSync(dir).map(f => f.toLowerCase());
      const hasDecisionRecord = siblings.includes('decision-record.md');
      const hasChecklist = siblings.includes('checklist.md');

      if (hasDecisionRecord) return 3;
      if (hasChecklist) return 2;
      return 1;
    } catch (_error: unknown) {
      return null;
    }
  } catch (_error: unknown) {
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
          const normalizedName = file.name.toLowerCase();
          if (file.isFile() && normalizedName.endsWith('.md')) {
            const fullPath = path.join(constitutionalDir, file.name);
            if (!shouldIndexForMemory(fullPath)) continue;
            if (!isIndexableConstitutionalMemoryPath(fullPath)) continue;
            results.push(fullPath);
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

/** Discover graph-metadata.json files from spec folder roots. */
export function findGraphMetadataFiles(workspacePath: string, options: SpecDiscoveryOptions = {}): DiscoveryFileList {
  const results: string[] = [];
  const seenCanonicalFiles = new Set<string>();
  const state = createDiscoveryState();
  const canonicalSpecsRoot = path.join(workspacePath, '.opencode', 'specs');
  const legacySpecsRoot = path.join(workspacePath, 'specs');
  const specsRoots = fs.existsSync(canonicalSpecsRoot)
    ? [canonicalSpecsRoot]
    : [legacySpecsRoot];

  function walk(dir: string, specsRoot: string, depth = 0): void {
    if (state.maxNodesExceeded) {
      return;
    }
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (shouldAbortDiscoveryWalk(state, 'graph metadata discovery')) {
          return;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (depth >= SPEC_DISCOVERY_MAX_DEPTH) {
            const warning = `[memory-index-discovery] graph metadata discovery skipped ${fullPath} after reaching maxDepth=${SPEC_DISCOVERY_MAX_DEPTH}`;
            console.warn(warning);
            state.warnings.push(warning);
            state.depthExceeded = true;
            continue;
          }
          if (!shouldDescendSpecDiscoveryDirectory(fullPath, entry.name)) {
            continue;
          }
          walk(fullPath, specsRoot, depth + 1);
          continue;
        }

        if (!entry.isFile() || entry.name !== GRAPH_METADATA_FILENAME) {
          continue;
        }
        if (!shouldIndexForMemory(fullPath)) {
          continue;
        }
        if (!isGraphMetadataPath(fullPath)) {
          continue;
        }
        if (!matchesScopedSpecFolder(fullPath, specsRoot, options.specFolder)) {
          continue;
        }

        const specFolder = extractSpecFolderFromGraphMetadataPath(fullPath);
        if (!specFolder) {
          continue;
        }

        const fileKey = getCanonicalPathKey(fullPath);
        if (seenCanonicalFiles.has(fileKey)) {
          continue;
        }
        seenCanonicalFiles.add(fileKey);
        results.push(fullPath);
      }
    } catch (_error: unknown) {
      // Keep discovery best-effort.
    }
  }

  for (const specsRoot of specsRoots) {
    if (!fs.existsSync(specsRoot)) {
      continue;
    }
    walk(specsRoot, specsRoot);
  }

  return attachDiscoveryMetadata(results, state);
}
