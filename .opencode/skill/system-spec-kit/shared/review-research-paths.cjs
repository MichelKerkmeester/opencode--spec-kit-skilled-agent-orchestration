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
 * Allocate the next artifact subfolder name under an artifact root directory
 * using the {phaseSlug}-pt-{NN} naming convention.
 *
 * The phase slug is the FULL first-segment folder name under the spec tree
 * root (e.g. "019-system-hardening").  NN is a two-digit zero-padded counter:
 * 1 + the number of existing pt-folders whose slug prefix matches the requested
 * phase, so repeated calls produce sequential names without any stored counter.
 *
 * @param {string} rootDir   - Absolute path to the artifact root (research/ or review/)
 * @param {string} phaseSlug - Full phase folder name (e.g. "019-system-hardening")
 * @returns {string} Subfolder name, e.g. "019-system-hardening-pt-03"
 */
function allocateShortSubfolder(rootDir, phaseSlug) {
  let existingCount = 0;

  if (fs.existsSync(rootDir)) {
    const prefix = `${phaseSlug}-pt-`;
    existingCount = fs.readdirSync(rootDir).filter(
      (entry) => entry.startsWith(prefix),
    ).length;
  }

  const nn = String(existingCount + 1).padStart(2, '0');
  return `${phaseSlug}-pt-${nn}`;
}

/**
 * Resolve the canonical artifact directory for review or research output.
 * Walks up from specFolder to find the top-level parent spec (highest folder
 * with spec.md) and stops at the specs/ directory boundary.
 *
 * Subfolder naming convention: {phaseSlug}-pt-{NN}
 *   - phaseSlug: the FULL immediate child phase segment under the spec tree
 *     root (e.g. "019-system-hardening")
 *   - NN: sequential two-digit counter scoped to that phase within the
 *     artifact root directory; allocated by counting existing same-prefix
 *     entries at call time
 *
 * Example: a new research run for
 *   .../026-graph.../019-system-hardening/001-initial-research/004-desc-regen/
 * with two existing 019-system-hardening-pt-* folders produces subfolder
 * "019-system-hardening-pt-03".
 *
 * @param {string} specFolder - Absolute or relative path to the target spec folder
 * @param {'review'|'research'} [mode='review'] - Which artifact type to resolve
 *
 * For child phases, all workflow-owned artifacts for a single run must share
 * the same packet directory under the spec tree root:
 *   - review:   {root}/review/{phaseSlug}-pt-{NN}/
 *   - research: {root}/research/{phaseSlug}-pt-{NN}/
 *
 * @returns {{
 *   rootDir: string,
 *   subfolder: string|null,
 *   artifactDir: string,
 *   artifactArchiveRoot: string
 * }} Resolved packet root plus canonical packet/archive directories
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
    return {
      rootDir,
      subfolder: null,
      artifactDir: rootDir,
      artifactArchiveRoot: path.join(
        path.dirname(rootDir),
        `${path.basename(rootDir)}_archive`,
      ),
    };
  }

  // Derive phase slug: full first path segment under root (e.g. "019-system-hardening")
  const relative = path.relative(root, resolved);
  const phaseSlug = relative.split(path.sep)[0];
  const subfolder = allocateShortSubfolder(rootDir, phaseSlug);
  const artifactDir = path.join(rootDir, subfolder);
  const artifactArchiveRoot = path.join(
    path.dirname(rootDir),
    `${path.basename(rootDir)}_archive`,
    subfolder,
  );

  return { rootDir, subfolder, artifactDir, artifactArchiveRoot };
}

module.exports = { resolveArtifactRoot, allocateShortSubfolder };
