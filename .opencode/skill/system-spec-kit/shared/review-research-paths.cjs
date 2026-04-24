// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Review Research Paths                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const MODE_CONFIG_FILE = {
  research: 'deep-research-config.json',
  review: 'deep-review-config.json',
};

const MODE_STATE_FILE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
};

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

function normalizeSpecFolderReference(specFolder) {
  if (!specFolder) {
    return null;
  }

  const normalized = String(specFolder)
    .trim()
    .replace(/\\/g, '/')
    .replace(/\/+$/g, '');

  if (!normalized) {
    return null;
  }

  const opencodeSpecsMarker = '/.opencode/specs/';
  const specsMarker = '/specs/';
  const opencodeIndex = normalized.lastIndexOf(opencodeSpecsMarker);
  if (opencodeIndex !== -1) {
    return normalized.slice(opencodeIndex + opencodeSpecsMarker.length);
  }

  const specsIndex = normalized.lastIndexOf(specsMarker);
  if (specsIndex !== -1) {
    return normalized.slice(specsIndex + specsMarker.length);
  }

  return normalized
    .replace(/^\.\/+/, '')
    .replace(/^\.opencode\/specs\//, '')
    .replace(/^specs\//, '');
}

function findAncestorSpecFolder(specFolder) {
  let current = path.resolve(specFolder);

  while (true) {
    const parent = path.dirname(current);

    if (parent === current || path.basename(parent) === 'specs') {
      return null;
    }

    if (fs.existsSync(path.join(parent, 'spec.md'))) {
      return parent;
    }

    current = parent;
  }
}

function readPacketSpecFolder(packetDir, mode) {
  const configPath = path.join(packetDir, MODE_CONFIG_FILE[mode]);
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return normalizeSpecFolderReference(config.specFolder);
    } catch (_error) {
      // Fall through to state log probing.
    }
  }

  const stateLogPath = path.join(packetDir, MODE_STATE_FILE[mode]);
  if (!fs.existsSync(stateLogPath)) {
    return null;
  }

  try {
    const lines = fs.readFileSync(stateLogPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }
      const parsed = JSON.parse(line);
      return normalizeSpecFolderReference(parsed.specFolder);
    }
  } catch (_error) {
    return null;
  }

  return null;
}

function listPacketDirectories(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  return fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /-pt-\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));
}

function findExistingPacket(rootDir, specFolder, mode) {
  const targetSpecFolder = normalizeSpecFolderReference(specFolder);

  if (!targetSpecFolder) {
    return null;
  }

  const matches = [];
  for (const packetName of listPacketDirectories(rootDir)) {
    const packetDir = path.join(rootDir, packetName);
    if (readPacketSpecFolder(packetDir, mode) === targetSpecFolder) {
      matches.push(packetName);
    }
  }

  return matches.at(-1) || null;
}

/**
 * Resolve the canonical artifact directory for review or research output.
 * Root specs keep research/ and review/ directly under the root spec folder.
 * Child phases and sub-phases keep local research/ and review/ folders, and
 * packet directories live under those local owner folders.
 *
 * Subfolder naming convention: {phaseSlug}-pt-{NN}
 *   - phaseSlug: the FULL immediate child phase segment under the spec tree
 *     root (e.g. "019-system-hardening")
 *   - NN: sequential two-digit counter scoped to that phase within the
 *     artifact root directory; allocated by counting existing same-prefix
 *     entries at call time
 *
 * Example:
 *   - root spec run → {spec_folder}/research/
 *   - child phase run → {spec_folder}/research/{packet-name}
 *   - sub-phase run → {spec_folder}/review/{packet-name}
 *
 * @param {string} specFolder - Absolute or relative path to the target spec folder
 * @param {'review'|'research'} [mode='review'] - Which artifact type to resolve
 *
 * For child phases, all workflow-owned artifacts for a single run must share
 * the same packet directory under the local owner folder:
 *   - review:   {specFolder}/review/{packet-name}/
 *   - research: {specFolder}/research/{packet-name}/
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
  const rootDir = path.join(resolved, mode);
  const artifactArchiveRoot = path.join(resolved, `${mode}_archive`);
  const ancestorSpecFolder = findAncestorSpecFolder(resolved);

  if (!ancestorSpecFolder) {
    return {
      rootDir,
      subfolder: null,
      artifactDir: rootDir,
      artifactArchiveRoot,
    };
  }

  const existingPacket = findExistingPacket(rootDir, resolved, mode);
  const subfolder = existingPacket || allocateShortSubfolder(rootDir, path.basename(resolved));
  const artifactDir = path.join(rootDir, subfolder);

  return {
    rootDir,
    subfolder,
    artifactDir,
    artifactArchiveRoot: path.join(artifactArchiveRoot, subfolder),
  };
}

module.exports = {
  resolveArtifactRoot,
  allocateShortSubfolder,
  normalizeSpecFolderReference,
};
