// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Review Runtime Capabilities Resolver                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** @type {string} Default path to the machine-readable runtime capability matrix. */
const DEFAULT_CAPABILITY_PATH = path.join(__dirname, '..', 'assets', 'runtime_capabilities.json');

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load and validate the runtime capability matrix from disk.
 *
 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
 * @returns {{ capabilityPath: string, matrix: Object }} Resolved path and parsed matrix
 * @throws {Error} If the matrix file is missing or malformed
 */
function loadRuntimeCapabilities(capabilityPath = DEFAULT_CAPABILITY_PATH) {
  const resolvedPath = path.resolve(capabilityPath);
  const parsed = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

  if (!Array.isArray(parsed.runtimes)) {
    throw new Error(`Invalid runtime capability matrix at ${resolvedPath}: missing runtimes array`);
  }

  return {
    capabilityPath: resolvedPath,
    matrix: parsed,
  };
}

/**
 * List all known runtime IDs from the capability matrix.
 *
 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
 * @returns {string[]} Array of runtime identifier strings
 */
function listRuntimeCapabilityIds(capabilityPath = DEFAULT_CAPABILITY_PATH) {
  const { matrix } = loadRuntimeCapabilities(capabilityPath);
  return matrix.runtimes.map((runtime) => runtime.id);
}

/**
 * Resolve a single runtime's capability record by ID.
 *
 * @param {string} runtimeId - Runtime identifier to look up
 * @param {string} [capabilityPath] - Path to runtime_capabilities.json
 * @returns {{ capabilityPath: string, runtime: Object }} Resolved path and runtime record
 * @throws {Error} If the runtime ID is not found in the matrix
 */
function resolveRuntimeCapability(runtimeId, capabilityPath = DEFAULT_CAPABILITY_PATH) {
  const { capabilityPath: resolvedPath, matrix } = loadRuntimeCapabilities(capabilityPath);
  const runtime = matrix.runtimes.find((entry) => entry.id === runtimeId);

  if (!runtime) {
    throw new Error(
      `Unknown deep-review runtime "${runtimeId}". Known runtimes: ${matrix.runtimes.map((entry) => entry.id).join(', ')}. Matrix: ${resolvedPath}`,
    );
  }

  return {
    capabilityPath: resolvedPath,
    runtime,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const runtimeId = process.argv[2];

  if (!runtimeId) {
    process.stdout.write(
      `${JSON.stringify(
        {
          capabilityPath: path.resolve(DEFAULT_CAPABILITY_PATH),
          runtimeIds: listRuntimeCapabilityIds(),
        },
        null,
        2,
      )}\n`,
    );
    process.exit(0);
  }

  process.stdout.write(`${JSON.stringify(resolveRuntimeCapability(runtimeId), null, 2)}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_CAPABILITY_PATH,
  listRuntimeCapabilityIds,
  loadRuntimeCapabilities,
  resolveRuntimeCapability,
};
