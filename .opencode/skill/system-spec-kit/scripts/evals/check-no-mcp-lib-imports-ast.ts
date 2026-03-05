// ---------------------------------------------------------------
// MODULE: Import Policy Checker (AST)
// AST-based enforcement for prohibited @spec-kit/mcp-server/{lib,core} imports.
// Includes deep transitive re-export traversal for local barrel files.
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';

interface AllowlistException {
  file: string;
  import: string;
  owner: string;
  reason: string;
  removeWhen: string;
  createdAt?: string;
  lastReviewedAt?: string;
  expiresAt?: string;
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
  targetFile: string;
}

interface ReExportHit {
  line: number;
  importPath: string;
}

interface ParsedFileResult {
  directViolations: Violation[];
  localImports: LocalImport[];
  localReExports: string[];
  forbiddenReExports: ReExportHit[];
}

interface ReExportTrace {
  viaFile: string;
  importPath: string;
}

const SCRIPTS_ROOT = path.resolve(__dirname, '..');

function resolveAllowlistPath(): string | null {
  const candidates = [
    // Source layout (tsx): scripts/evals/check-no-mcp-lib-imports-ast.ts
    path.resolve(__dirname, 'import-policy-allowlist.json'),
    // Compiled layout (node): scripts/dist/evals/check-no-mcp-lib-imports-ast.js
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

const DIRECT_PROHIBITED_PREFIXES = [
  '@spec-kit/mcp-server/lib/',
  '@spec-kit/mcp-server/core/',
];

const RELATIVE_PROHIBITED_RE = /^\.\.(?:\/\.\.)*\/mcp_server\/(?:lib|core)\//;

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
    if (normalizedFile !== exception.file && relativeFile !== exception.file) {
      continue;
    }

    if (exception.import.endsWith('/*')) {
      const prefix = exception.import.slice(0, -2);
      if (importPath.startsWith(prefix)) return true;
    }

    if (importPath === exception.import) return true;
  }

  return false;
}

function isLocalRelativeImport(importPath: string): boolean {
  return importPath.startsWith('./') || importPath.startsWith('../');
}

function isProhibitedImportPath(importPath: string): boolean {
  return DIRECT_PROHIBITED_PREFIXES.some((prefix) => importPath.startsWith(prefix)) || RELATIVE_PROHIBITED_RE.test(importPath);
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
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
      continue;
    }
    if (candidate.startsWith(SCRIPTS_ROOT)) {
      return candidate;
    }
    return null;
  }

  return null;
}

function getModuleSpecifierText(moduleSpecifier: ts.Expression): string | null {
  if (ts.isStringLiteral(moduleSpecifier) || ts.isNoSubstitutionTemplateLiteral(moduleSpecifier)) {
    return moduleSpecifier.text;
  }
  return null;
}

function getNodeLine(sourceFile: ts.SourceFile, node: ts.Node): number {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return line + 1;
}

function parseFile(filePath: string, allowlist: Allowlist): ParsedFileResult {
  const sourceText = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const directViolations: Violation[] = [];
  const localImports: LocalImport[] = [];
  const localReExports: string[] = [];
  const forbiddenReExports: ReExportHit[] = [];

  function registerLocalDependency(importPath: string, line: number, isReExport: boolean): void {
    if (!isLocalRelativeImport(importPath)) return;
    const targetFile = resolveLocalImportTarget(filePath, importPath);
    if (!targetFile) return;
    localImports.push({ line, importPath, targetFile });
    if (isReExport) {
      localReExports.push(targetFile);
    }
  }

  function registerProhibitedImport(importPath: string, line: number, isReExport: boolean): void {
    if (!isProhibitedImportPath(importPath)) return;
    if (!isAllowlisted(filePath, importPath, allowlist)) {
      directViolations.push({ file: filePath, line, importPath });
    }
    if (isReExport) {
      forbiddenReExports.push({ line, importPath });
    }
  }

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      const importPath = getModuleSpecifierText(node.moduleSpecifier);
      if (importPath) {
        const line = getNodeLine(sourceFile, node.moduleSpecifier);
        registerLocalDependency(importPath, line, false);
        registerProhibitedImport(importPath, line, false);
      }
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      const importPath = getModuleSpecifierText(node.moduleSpecifier);
      if (importPath) {
        const line = getNodeLine(sourceFile, node.moduleSpecifier);
        registerLocalDependency(importPath, line, true);
        registerProhibitedImport(importPath, line, true);
      }
    }

    if (ts.isCallExpression(node) && node.arguments.length > 0) {
      const firstArg = node.arguments[0];

      const isRequireCall = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      if (!isRequireCall && !isDynamicImport) {
        ts.forEachChild(node, visit);
        return;
      }

      if (!ts.isStringLiteral(firstArg) && !ts.isNoSubstitutionTemplateLiteral(firstArg)) {
        ts.forEachChild(node, visit);
        return;
      }

      const importPath = firstArg.text;
      const line = getNodeLine(sourceFile, firstArg);
      registerLocalDependency(importPath, line, false);
      registerProhibitedImport(importPath, line, false);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { directViolations, localImports, localReExports, forbiddenReExports };
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

function collectForbiddenReExports(
  filePath: string,
  parsedByFile: Map<string, ParsedFileResult>,
  cache: Map<string, ReExportTrace[]>,
  visiting: Set<string>,
): ReExportTrace[] {
  const cached = cache.get(filePath);
  if (cached) return cached;

  if (visiting.has(filePath)) {
    return [];
  }

  visiting.add(filePath);
  const parsed = parsedByFile.get(filePath);
  if (!parsed) {
    visiting.delete(filePath);
    cache.set(filePath, []);
    return [];
  }

  const traces: ReExportTrace[] = parsed.forbiddenReExports.map((hit) => ({
    viaFile: filePath,
    importPath: hit.importPath,
  }));

  for (const reExportTarget of parsed.localReExports) {
    traces.push(...collectForbiddenReExports(reExportTarget, parsedByFile, cache, visiting));
  }

  visiting.delete(filePath);

  const deduped = new Map<string, ReExportTrace>();
  for (const trace of traces) {
    deduped.set(`${trace.viaFile}::${trace.importPath}`, trace);
  }
  const result = [...deduped.values()];
  cache.set(filePath, result);
  return result;
}

function dedupeViolations(violations: Violation[]): Violation[] {
  const deduped = new Map<string, Violation>();
  for (const violation of violations) {
    const key = [
      violation.file,
      String(violation.line),
      violation.importPath,
      violation.viaFile || '',
      violation.viaImportPath || '',
    ].join('::');
    deduped.set(key, violation);
  }
  return [...deduped.values()];
}

function main(): void {
  const allowlist = loadAllowlist();
  const tsFiles = findTsFiles(SCRIPTS_ROOT);
  const parsedByFile = new Map<string, ParsedFileResult>();
  const allViolations: Violation[] = [];

  for (const file of tsFiles) {
    const parsed = parseFile(file, allowlist);
    parsedByFile.set(file, parsed);
    allViolations.push(...parsed.directViolations);
  }

  const reExportCache = new Map<string, ReExportTrace[]>();
  for (const [file, parsed] of parsedByFile.entries()) {
    for (const localImport of parsed.localImports) {
      const traces = collectForbiddenReExports(localImport.targetFile, parsedByFile, reExportCache, new Set<string>());
      for (const trace of traces) {
        if (isAllowlisted(file, trace.importPath, allowlist)) {
          continue;
        }
        allViolations.push({
          file,
          line: localImport.line,
          importPath: localImport.importPath,
          viaFile: trace.viaFile,
          viaImportPath: trace.importPath,
        });
      }
    }
  }

  const violations = dedupeViolations(allViolations);

  if (violations.length === 0) {
    console.log('AST import policy check passed: no prohibited @spec-kit/mcp-server/{lib,core}/* imports found.');
    process.exit(0);
  }

  console.error(`AST import policy check FAILED: ${violations.length} violation(s) found:\n`);
  for (const violation of violations) {
    const relPath = path.relative(SCRIPTS_ROOT, violation.file);
    if (violation.viaFile) {
      const viaRelPath = path.relative(SCRIPTS_ROOT, violation.viaFile);
      const reExportDetail = violation.viaImportPath ? ` (re-exports ${violation.viaImportPath})` : '';
      console.error(`  ${relPath}:${violation.line} → ${violation.importPath} (transitive violation via ${viaRelPath}${reExportDetail})`);
      continue;
    }
    console.error(`  ${relPath}:${violation.line} → ${violation.importPath}`);
  }

  console.error('\nTo fix: use @spec-kit/mcp-server/api/* or add a governed allowlist exception.');
  process.exit(1);
}

main();
