// ---------------------------------------------------------------
// MODULE: ESM Entry Helpers
// ---------------------------------------------------------------

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Return whether the current module URL is the process entrypoint.
 *
 * @param importMetaUrl - Caller-provided `import.meta.url`
 * @returns True when the caller is being executed directly by Node
 */
export function isMainModule(importMetaUrl: string): boolean {
  const entrypoint = process.argv[1];
  if (!entrypoint) {
    return false;
  }

  return importMetaUrl === pathToFileURL(path.resolve(entrypoint)).href;
}

/**
 * Resolve the containing directory for an ESM module URL.
 *
 * @param importMetaUrl - Caller-provided `import.meta.url`
 * @returns Absolute directory path for the caller module
 */
export function dirnameFromImportMeta(importMetaUrl: string): string {
  return path.dirname(fileURLToPath(importMetaUrl));
}
