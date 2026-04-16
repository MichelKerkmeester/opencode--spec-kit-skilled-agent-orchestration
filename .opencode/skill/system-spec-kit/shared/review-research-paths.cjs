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
 * Resolve the root-level artifact directory for review or research output.
 * Walks up from specFolder to find the top-level parent spec (highest folder
 * with spec.md) and stops at the specs/ directory boundary.
 *
 * @param {string} specFolder - Absolute or relative path to the target spec folder
 * @param {'review'|'research'} [mode='review'] - Which artifact type to resolve
 * @returns {{ rootDir: string, subfolder: string|null }} Resolved packet root and child-phase suffix
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

  const relative = path.relative(root, resolved);
  const subfolder = relative.split(path.sep).join('-');

  return { rootDir, subfolder };
}

module.exports = { resolveArtifactRoot };
