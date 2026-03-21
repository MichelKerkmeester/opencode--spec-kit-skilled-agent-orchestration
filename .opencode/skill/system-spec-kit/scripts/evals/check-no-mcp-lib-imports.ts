// ---------------------------------------------------------------
// MODULE: Check No Mcp Lib Imports
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CHECK NO MCP LIB IMPORTS
// ───────────────────────────────────────────────────────────────
// Scans scripts/ for prohibited internal runtime imports.
// Violations not in the allowlist cause a non-zero exit.

import * as fs from 'fs';
import * as path from 'path';

import { isProhibitedImportPath } from './import-policy-rules';

interface AllowlistException {
  file: string;
  import: string;
  owner: string;
  reason: string;
  removeWhen: string;
  createdAt?: string;      // ISO date
  lastReviewedAt?: string; // ISO date
  expiresAt?: string;      // ISO date — warnings when past
}

interface Allowlist {
  description: string;
  exceptions: AllowlistException[];
}

interface Violation {
  file: string;
  line: number;
  importPath: string;
  viaFile?: string;
  viaImportPath?: string;
}

interface LocalImport {
  line: number;
  importPath: string;
}

interface ReExportHit {
  line: number;
  importPath: string;
}

interface ScanFileResult {
  violations: Violation[];
  localImports: LocalImport[];
}

// When running from dist/evals/, __dirname resolves to dist/ which is wrong.
// Detect compiled mode and go up one additional level to reach the source scripts/ root.
const SCRIPTS_ROOT = (() => {
  const candidate = path.resolve(__dirname, '..');
  if (candidate.includes(`${path.sep}dist`) || candidate.endsWith(`${path.sep}dist`)) {
    return path.resolve(candidate, '..');
  }
  return candidate;
})();

function resolveAllowlistPath(): string | null {
  const candidates = [
    // Source layout (tsx): scripts/evals/check-no-mcp-lib-imports.ts
    path.resolve(__dirname, 'import-policy-allowlist.json'),
    // Compiled layout (node): scripts/dist/evals/check-no-mcp-lib-imports.js
    path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
    // CWD fallbacks
    path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
    path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

const REEXPORT_FROM_RE = /\bexport\s+(?:\*\s*|\{[^}]*\}\s*)from\s+['"`]([^'"`]+)['"`]/;

function loadAllowlist(): Allowlist {
  const allowlistPath = resolveAllowlistPath();
  if (!allowlistPath) {
    console.warn('Warning: import-policy-allowlist.json not found, treating all violations as errors');
    return { description: '', exceptions: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(allowlistPath, 'utf-8'));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: Failed to parse ${allowlistPath}: ${message}`);
    process.exit(2);
  }
}

function isAllowlisted(filePath: string, importPath: string, allowlist: Allowlist): boolean {
  const relativeFile = path.relative(SCRIPTS_ROOT, filePath).replace(/\\/g, '/');
  const normalizedFile = `scripts/${relativeFile}`;

  for (const exception of allowlist.exceptions) {
    // Check if file matches
    if (normalizedFile !== exception.file && relativeFile !== exception.file) {
      continue;
    }

    // Wildcard match for internal runtime prefixes such as @spec-kit/mcp-server/lib/*
    if (exception.import.endsWith('/*')) {
      const prefix = exception.import.slice(0, -2);
      if (importPath.startsWith(prefix)) return true;
    }

    // Exact match
    if (importPath === exception.import) return true;
  }
  return false;
}

/** Extract the import path from a matched line, preferring the path after from/import/require */
function extractImportPath(line: string): string {
  // Try 'from "path"' or "from 'path'" first (most common for static imports)
  const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/);
  if (fromMatch) return fromMatch[1];
  // Try require("path") or import("path")
  const callMatch = line.match(/(?:require|import)\s*\(\s*['"]([^'"]+)['"]/);
  if (callMatch) return callMatch[1];
  // Fallback: first quoted string
  const fallback = line.match(/['"]([^'"]+)['"]/);
  return fallback ? fallback[1] : '<unknown>';
}

function extractModuleSpecifier(line: string): string | null {
  const fromMatch = line.match(/\b(?:import|export)\b[^;]*?\bfrom\s+['"`]([^'"`]+)['"`]/);
  if (fromMatch) return fromMatch[1];

  const sideEffectImportMatch = line.match(/\bimport\s+['"`]([^'"`]+)['"`]/);
  if (sideEffectImportMatch) return sideEffectImportMatch[1];

  const callMatch = line.match(/(?:require|import)\s*\(\s*['"`]([^'"`]+)['"`]/);
  if (callMatch) return callMatch[1];

  return null;
}

function isLocalRelativeImport(importPath: string): boolean {
  return importPath.startsWith('./') || importPath.startsWith('../');
}

function resolveLocalImportTarget(importingFile: string, importPath: string): string | null {
  const basePath = path.resolve(path.dirname(importingFile), importPath);

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.mts`,
    `${basePath}.cts`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    `${basePath}.cjs`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.mts'),
    path.join(basePath, 'index.cts'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.mjs'),
    path.join(basePath, 'index.cjs'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

function findForbiddenReExports(filePath: string): ReExportHit[] {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return [];
  }

  const hits: ReExportHit[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inBlockComment) {
      const closeIdx = line.indexOf('*/');
      if (closeIdx !== -1) inBlockComment = false;
      continue;
    }

    const openIdx = line.indexOf('/*');
    if (openIdx !== -1) {
      const closeIdx = line.indexOf('*/', openIdx + 2);
      if (closeIdx === -1) {
        inBlockComment = true;
        const beforeComment = line.slice(0, openIdx);
        const beforeMatch = beforeComment.match(REEXPORT_FROM_RE);
        if (beforeMatch && isProhibitedImportPath(beforeMatch[1])) {
          hits.push({ line: i + 1, importPath: beforeMatch[1] });
        }
        continue;
      }
    }

    if (line.trimStart().startsWith('//')) continue;

    const match = line.match(REEXPORT_FROM_RE);
    if (match && isProhibitedImportPath(match[1])) {
      hits.push({ line: i + 1, importPath: match[1] });
    }
  }

  return hits;
}

function scanLineForViolations(
  line: string,
  lineIndex: number,
  filePath: string,
  allowlist: Allowlist,
  violations: Violation[],
): void {
  const importPath = extractModuleSpecifier(line);
  if (!importPath || !isProhibitedImportPath(importPath)) {
    return;
  }

  if (!isAllowlisted(filePath, importPath, allowlist)) {
    violations.push({ file: filePath, line: lineIndex + 1, importPath });
  }
}

function scanFile(filePath: string, allowlist: Allowlist): ScanFileResult {
  const violations: Violation[] = [];
  const localImports: LocalImport[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track block comments — handle mid-line /* starts and */ ends
    if (inBlockComment) {
      const closeIdx = line.indexOf('*/');
      if (closeIdx !== -1) {
        inBlockComment = false;
        // Content after */ could contain code — but import statements
        // Spanning block comment boundaries are not valid TS, so skip line
      }
      continue;
    }
    const openIdx = line.indexOf('/*');
    if (openIdx !== -1) {
      const closeIdx = line.indexOf('*/', openIdx + 2);
      if (closeIdx === -1) {
        // Block comment opens but doesn't close on this line
        inBlockComment = true;
        // Only scan content before the /* for imports
        const beforeComment = line.slice(0, openIdx);
        if (beforeComment.trim()) {
          const importPath = extractModuleSpecifier(beforeComment);
          if (importPath && isLocalRelativeImport(importPath)) {
            localImports.push({ line: i + 1, importPath });
          }
          scanLineForViolations(beforeComment, i, filePath, allowlist, violations);
        }
        continue;
      }
      // Inline block comment (/* ... */ on same line) — strip it and scan remainder
      // For simplicity, skip the line if the comment precedes the import-like content
    }
    if (line.trimStart().startsWith('//')) continue;

    const importPath = extractModuleSpecifier(line);
    if (importPath && isLocalRelativeImport(importPath)) {
      localImports.push({ line: i + 1, importPath });
    }

    scanLineForViolations(line, i, filePath, allowlist, violations);
  }

  return { violations, localImports };
}

function scanTransitiveViolations(filePath: string, localImports: LocalImport[], allowlist: Allowlist): Violation[] {
  const violations: Violation[] = [];
  const reExportCache = new Map<string, ReExportHit[]>();

  for (const localImport of localImports) {
    const targetFile = resolveLocalImportTarget(filePath, localImport.importPath);
    if (!targetFile) continue;

    let reExports = reExportCache.get(targetFile);
    if (!reExports) {
      reExports = findForbiddenReExports(targetFile);
      reExportCache.set(targetFile, reExports);
    }

    for (const reExport of reExports) {
      if (isAllowlisted(filePath, reExport.importPath, allowlist)) {
        continue;
      }
      violations.push({
        file: filePath,
        line: localImport.line,
        importPath: localImport.importPath,
        viaFile: targetFile,
        viaImportPath: reExport.importPath,
      });
    }
  }

  return violations;
}

function findTsFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        walk(fullPath);
      } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function main(): void {
  const allowlist = loadAllowlist();
  const tsFiles = findTsFiles(SCRIPTS_ROOT);
  const allViolations: Violation[] = [];

  for (const file of tsFiles) {
    const scanResult = scanFile(file, allowlist);
    allViolations.push(...scanResult.violations);

    const transitiveViolations = scanTransitiveViolations(file, scanResult.localImports, allowlist);
    allViolations.push(...transitiveViolations);
  }

  if (allViolations.length === 0) {
    console.log('Import policy check passed: no prohibited @spec-kit/mcp-server/{lib,core,handlers} internal imports found.');
    process.exit(0);
  }

  console.error(`Import policy check FAILED: ${allViolations.length} violation(s) found:\n`);
  for (const v of allViolations) {
    const relPath = path.relative(SCRIPTS_ROOT, v.file);
    if (v.viaFile) {
      const viaRelPath = path.relative(SCRIPTS_ROOT, v.viaFile);
      const reExportDetail = v.viaImportPath ? ` (re-exports ${v.viaImportPath})` : '';
      console.error(`  ${relPath}:${v.line} → ${v.importPath} (transitive violation via ${viaRelPath}${reExportDetail})`);
      continue;
    }
    console.error(`  ${relPath}:${v.line} → ${v.importPath}`);
  }
  console.error('\nTo fix: either use @spec-kit/mcp-server/api/* or add to import-policy-allowlist.json');
  process.exit(1);
}

main();
