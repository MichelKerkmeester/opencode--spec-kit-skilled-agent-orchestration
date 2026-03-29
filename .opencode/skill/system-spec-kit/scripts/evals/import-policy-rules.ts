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

const RELATIVE_INTERNAL_RUNTIME_IMPORT_RE =
  /^\.\.(?:\/\.\.)*\/(?:mcp_server\/(?:lib|core|handlers)|shared)(?:$|\/)/;

function normalizeRelativeImportPath(importPath: string): string {
  if (!importPath.startsWith('.')) {
    return importPath;
  }

  // Normalize Windows backslashes before POSIX normalization
  const normalizedPath = path.posix.normalize(importPath.replace(/\\/g, '/'));

  if (normalizedPath === '.') {
    return './';
  }

  if (normalizedPath === '..' || normalizedPath.startsWith('../')) {
    return normalizedPath;
  }

  return normalizedPath.startsWith('./') ? normalizedPath : `./${normalizedPath}`;
}

/**
 * Normalize package-scoped import paths that contain `..` traversal segments.
 * E.g., `@spec-kit/mcp-server/api/../lib/foo` → `@spec-kit/mcp-server/lib/foo`
 */
function normalizePackageImportPath(importPath: string): string {
  if (importPath.startsWith('.') || !importPath.includes('..')) {
    return importPath;
  }
  // Split into segments and collapse '..' traversals
  const segments = importPath.split('/');
  const resolved: string[] = [];
  for (const segment of segments) {
    if (segment === '..' && resolved.length > 0) {
      resolved.pop();
    } else {
      resolved.push(segment);
    }
  }
  return resolved.join('/');
}

/** Returns whether the import path violates the evaluation policy rules. */
export function isProhibitedImportPath(importPath: string): boolean {
  const normalizedImportPath = normalizeRelativeImportPath(importPath);
  const normalizedPackagePath = normalizePackageImportPath(normalizedImportPath);

  return PROHIBITED_PACKAGE_IMPORTS.some((baseImport) => (
    normalizedPackagePath === baseImport || normalizedPackagePath.startsWith(`${baseImport}/`)
  )) || RELATIVE_INTERNAL_RUNTIME_IMPORT_RE.test(normalizedPackagePath);
}
