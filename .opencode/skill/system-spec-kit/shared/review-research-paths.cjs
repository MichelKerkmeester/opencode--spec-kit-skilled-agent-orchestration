// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Review Research Paths                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Allocate the next short artifact subfolder name under an artifact root
 * directory using the {phaseId}-pt-{NN} naming convention.
 *
 * The phase ID is extracted from the first three characters of the spec
 * folder's top-level phase segment (e.g. "019" from "019-system-hardening").
 * NN is a two-digit zero-padded counter: 1 + the number of existing pt-folders
 * whose phase prefix matches the requested phase, so repeated calls produce
 * sequential names without any stored counter.
 *
 * @param {string} rootDir  - Absolute path to the artifact root (research/ or review/)
 * @param {string} phaseId  - Three-digit phase identifier string (e.g. "019")
 * @returns {string} Short subfolder name, e.g. "019-pt-03"
 */
function allocateShortSubfolder(rootDir, phaseId) {
  let existingCount = 0;

  if (fs.existsSync(rootDir)) {
    const prefix = `${phaseId}-pt-`;
    existingCount = fs.readdirSync(rootDir).filter(
      (entry) => entry.startsWith(prefix),
    ).length;
  }

  const nn = String(existingCount + 1).padStart(2, '0');
  return `${phaseId}-pt-${nn}`;
}

/**
 * Resolve the root-level artifact directory for review or research output.
 * Walks up from specFolder to find the top-level parent spec (highest folder
 * with spec.md) and stops at the specs/ directory boundary.
 *
 * Subfolder naming convention: {phaseId}-pt-{NN}
 *   - phaseId: first three characters of the immediate child phase segment
 *     under the spec tree root (e.g. "019" from "019-system-hardening")
 *   - NN: sequential two-digit counter scoped to that phase within the
 *     artifact root directory; allocated by counting existing same-prefix
 *     entries at call time
 *
 * Example: a new research run for
 *   .../026-graph.../019-system-hardening/001-initial-research/004-desc-regen/
 * with two existing 019-pt-* folders produces subfolder "019-pt-03".
 *
 * @param {string} specFolder - Absolute or relative path to the target spec folder
 * @param {'review'|'research'} [mode='review'] - Which artifact type to resolve
 * @returns {{ rootDir: string, subfolder: string|null }} Resolved packet root and short child-phase subfolder
 */
function resolveArtifactRoot(specFolder, mode = 'review') {
  const resolved = path.resolve(specFolder);
  let current = resolved;
  let root = resolved;

  while (true) {
    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    if (path.basename(parent) === 'specs') {
      break;
    }

    if (fs.existsSync(path.join(parent, 'spec.md'))) {
      root = parent;
    }

    current = parent;
  }

  const rootDir = path.join(root, mode);

  if (resolved === root) {
    return { rootDir, subfolder: null };
  }

  // Derive phase ID: first path segment under root, first 3 characters
  const relative = path.relative(root, resolved);
  const firstSegment = relative.split(path.sep)[0];
  const phaseId = firstSegment.slice(0, 3);
  const subfolder = allocateShortSubfolder(rootDir, phaseId);

  return { rootDir, subfolder };
}

module.exports = { resolveArtifactRoot, allocateShortSubfolder };
