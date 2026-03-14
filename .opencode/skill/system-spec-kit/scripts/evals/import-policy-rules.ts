// ---------------------------------------------------------------
// MODULE: Import Policy Rules
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. IMPORT POLICY RULES
// ───────────────────────────────────────────────────────────────
// Shared detection rules for prohibited scripts -> internal runtime imports.

import * as path from 'path';

const PROHIBITED_PACKAGE_IMPORTS = [
  '@spec-kit/mcp-server/lib',
  '@spec-kit/mcp-server/core',
  '@spec-kit/mcp-server/handlers',
];

const RELATIVE_INTERNAL_RUNTIME_IMPORT_RE = /^\.\.(?:\/\.\.)*\/mcp_server\/(?:lib|core|handlers)(?:$|\/)/;

function normalizeRelativeImportPath(importPath: string): string {
  if (!importPath.startsWith('.')) {
    return importPath;
  }

  const normalizedPath = path.posix.normalize(importPath);

  if (normalizedPath === '.') {
    return './';
  }

  if (normalizedPath === '..' || normalizedPath.startsWith('../')) {
    return normalizedPath;
  }

  return normalizedPath.startsWith('./') ? normalizedPath : `./${normalizedPath}`;
}

/** Returns whether the import path violates the evaluation policy rules. */
export function isProhibitedImportPath(importPath: string): boolean {
  const normalizedImportPath = normalizeRelativeImportPath(importPath);

  return PROHIBITED_PACKAGE_IMPORTS.some((baseImport) => (
    normalizedImportPath === baseImport || normalizedImportPath.startsWith(`${baseImport}/`)
  )) || RELATIVE_INTERNAL_RUNTIME_IMPORT_RE.test(normalizedImportPath);
}
