// ---------------------------------------------------------------
// MODULE: Check Architecture Boundaries
// ---------------------------------------------------------------
// NOTE: This script enforces shared/ neutrality and mcp_server/scripts/ wrapper-only rules.
// The companion check for Scripts -> MCP-internals import policy lives in:
//   check-no-mcp-lib-imports-ast.ts (AST-based, with allowlist governance)
// Both checks should be run together for full boundary compliance.

// ───────────────────────────────────────────────────────────────
// 1. CHECK ARCHITECTURE BOUNDARIES
// ───────────────────────────────────────────────────────────────
// Enforces two rules from ARCHITECTURE.md that were
// Previously documentation-only:
//   GAP A — shared/ must not import from mcp_server/ or scripts/
//   GAP B — mcp_server/scripts/ files must be thin wrappers only

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';

// ───────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────
interface GapAViolation {
  file: string;
  line: number;
  importPath: string;
}

interface GapBViolation {
  file: string;
  reasons: string[];
}

interface WrapperSignals {
  substantiveLines: number;
  hasChildProcessImport: boolean;
  hasChildProcessSpawnExecUsage: boolean;
  hasScriptsDistReference: boolean;
  hasScriptsSourceReference: boolean;
}

// ───────────────────────────────────────────────────────────────
// 4. CONSTANTS
// ───────────────────────────────────────────────────────────────
const REQUIRED_ROOT_DIRS = ['shared', 'mcp_server', 'scripts'] as const;

// Absolute prohibition — shared/ must remain neutral (no allowlist)
const SHARED_PROHIBITED_PACKAGE_PREFIXES = ['@spec-kit/mcp-server', '@spec-kit/scripts'];

// 50 lines is generous for a spawn+exit wrapper; anything larger
// Indicates logic that belongs in scripts/ instead
const MAX_SUBSTANTIVE_LINES = 50;
const PACKAGE_ROOT = resolvePackageRoot(__dirname);
const CHILD_PROCESS_MODULE_SPECIFIERS = new Set(['child_process', 'node:child_process']);
const CHILD_PROCESS_WRAPPER_APIS = new Set(['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']);

// ───────────────────────────────────────────────────────────────
// 5. HELPERS
// ───────────────────────────────────────────────────────────────
function findSourceFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist') continue;
        walk(fullPath);
      } else if (
        (entry.name.endsWith('.ts') || entry.name.endsWith('.js') || entry.name.endsWith('.mjs') || entry.name.endsWith('.cjs'))
        && !entry.name.endsWith('.d.ts')
      ) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function resolvePackageRoot(startDir: string): string {
  let cursor = path.resolve(startDir);
  while (true) {
    const hasRequiredDirs = REQUIRED_ROOT_DIRS.every((dirName) => fs.existsSync(path.join(cursor, dirName)));
    if (hasRequiredDirs) return cursor;

    const parent = path.dirname(cursor);
    if (parent === cursor) {
      throw new Error(`Unable to resolve package root from: ${startDir}`);
    }
    cursor = parent;
  }
}

function resolveCheckRoot(packageRoot: string): string {
  const resolvedRoot = path.resolve(packageRoot);
  const missingDirs = REQUIRED_ROOT_DIRS.filter((dirName) => !fs.existsSync(path.join(resolvedRoot, dirName)));
  if (missingDirs.length > 0) {
    throw new Error(`Invalid package root "${resolvedRoot}" — missing directories: ${missingDirs.join(', ')}`);
  }
  return resolvedRoot;
}

function normalizeImportPath(importPath: string): string {
  return importPath.replace(/\\/g, '/');
}

function isWithinDirectory(candidatePath: string, directoryPath: string): boolean {
  const relative = path.relative(directoryPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function isStringLiteralLike(node: ts.Node): node is ts.StringLiteral | ts.NoSubstitutionTemplateLiteral {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node);
}

function isChildProcessModuleSpecifier(moduleSpecifier: string): boolean {
  return CHILD_PROCESS_MODULE_SPECIFIERS.has(moduleSpecifier);
}

function isScriptsDistReference(importPath: string): boolean {
  const normalized = normalizeImportPath(importPath);
  return normalized.includes('scripts/dist/') || normalized.endsWith('scripts/dist') || normalized.startsWith('@spec-kit/scripts/dist');
}

function isScriptsSourceReference(importPath: string): boolean {
  const normalized = normalizeImportPath(importPath);
  if (normalized.startsWith('@spec-kit/scripts')) return true;
  return normalized.includes('/scripts/') || normalized.startsWith('scripts/');
}

function isProhibitedForShared(importPath: string, sourceFilePath: string, packageRoot: string): boolean {
  const normalizedImportPath = normalizeImportPath(importPath);
  const isProhibitedPackageImport = SHARED_PROHIBITED_PACKAGE_PREFIXES.some((prefix) => {
    return normalizedImportPath === prefix || normalizedImportPath.startsWith(`${prefix}/`);
  });
  if (isProhibitedPackageImport) return true;

  if (path.isAbsolute(importPath)) {
    const resolvedAbsolutePath = path.resolve(importPath);
    return (
      isWithinDirectory(resolvedAbsolutePath, path.join(packageRoot, 'mcp_server')) ||
      isWithinDirectory(resolvedAbsolutePath, path.join(packageRoot, 'scripts'))
    );
  }

  if (!normalizedImportPath.startsWith('.')) return false;

  const resolvedImportPath = path.resolve(path.dirname(sourceFilePath), normalizedImportPath);
  return (
    isWithinDirectory(resolvedImportPath, path.join(packageRoot, 'mcp_server')) ||
    isWithinDirectory(resolvedImportPath, path.join(packageRoot, 'scripts'))
  );
}

function extractModuleSpecifiers(content: string, filePath: string): Array<{ importPath: string; line: number }> {
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const hits: Array<{ importPath: string; line: number }> = [];

  function pushHit(moduleSpecifier: ts.Node): void {
    if (!isStringLiteralLike(moduleSpecifier)) return;
    const { line } = sourceFile.getLineAndCharacterOfPosition(moduleSpecifier.getStart(sourceFile));
    hits.push({ importPath: moduleSpecifier.text, line: line + 1 });
  }

  function visit(node: ts.Node): void {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
      pushHit(node.moduleSpecifier);
    }

    if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      pushHit(node.moduleSpecifier);
    }

    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression) {
      pushHit(node.moduleReference.expression);
    }

    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && isStringLiteralLike(node.argument.literal)) {
      pushHit(node.argument.literal);
    }

    if (ts.isCallExpression(node) && node.arguments.length > 0) {
      const firstArg = node.arguments[0];
      const isRequireCall = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      if ((isRequireCall || isDynamicImport) && isStringLiteralLike(firstArg)) {
        const { line } = sourceFile.getLineAndCharacterOfPosition(firstArg.getStart(sourceFile));
        hits.push({ importPath: firstArg.text, line: line + 1 });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return hits;
}

function countSubstantiveLines(content: string): number {
  const lines = content.split('\n');
  let count = 0;
  let inBlockComment = false;

  for (const line of lines) {
    if (inBlockComment) {
      if (line.indexOf('*/') !== -1) inBlockComment = false;
      continue;
    }

    const openIdx = line.indexOf('/*');
    if (openIdx !== -1) {
      const closeIdx = line.indexOf('*/', openIdx + 2);
      if (closeIdx === -1) {
        inBlockComment = true;
        continue;
      }
    }

    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('//')) continue;

    count++;
  }

  return count;
}

function collectWrapperSignals(content: string, filePath: string): WrapperSignals {
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const childProcessCallableBindings = new Set<string>();
  const childProcessNamespaceBindings = new Set<string>();
  let hasChildProcessImport = false;
  let hasChildProcessSpawnExecUsage = false;
  let hasScriptsDistReference = false;
  let hasScriptsSourceReference = false;

  function markPathReference(rawPath: string): void {
    if (!rawPath.includes('/') && !rawPath.includes('@spec-kit')) return;
    if (isScriptsSourceReference(rawPath)) hasScriptsSourceReference = true;
    if (isScriptsDistReference(rawPath)) hasScriptsDistReference = true;
  }

  function registerChildProcessImportClause(importClause: ts.ImportClause | undefined): void {
    if (!importClause) return;

    if (importClause.name) {
      childProcessNamespaceBindings.add(importClause.name.text);
    }

    const namedBindings = importClause.namedBindings;
    if (!namedBindings) return;

    if (ts.isNamespaceImport(namedBindings)) {
      childProcessNamespaceBindings.add(namedBindings.name.text);
      return;
    }

    for (const element of namedBindings.elements) {
      const importedName = element.propertyName?.text ?? element.name.text;
      if (CHILD_PROCESS_WRAPPER_APIS.has(importedName)) {
        childProcessCallableBindings.add(element.name.text);
      }
    }
  }

  function registerChildProcessRequireBinding(name: ts.BindingName): void {
    if (ts.isIdentifier(name)) {
      childProcessNamespaceBindings.add(name.text);
      return;
    }

    if (!ts.isObjectBindingPattern(name)) return;
    for (const element of name.elements) {
      if (!ts.isIdentifier(element.name)) continue;
      const importedName = element.propertyName && ts.isIdentifier(element.propertyName)
        ? element.propertyName.text
        : element.name.text;
      if (CHILD_PROCESS_WRAPPER_APIS.has(importedName)) {
        childProcessCallableBindings.add(element.name.text);
      }
    }
  }

  function isRequireCall(node: ts.CallExpression): boolean {
    return ts.isIdentifier(node.expression) && node.expression.text === 'require';
  }

  function markSpawnExecUsage(node: ts.CallExpression): void {
    const expression = node.expression;

    if (ts.isIdentifier(expression) && childProcessCallableBindings.has(expression.text)) {
      hasChildProcessSpawnExecUsage = true;
      return;
    }

    if (!ts.isPropertyAccessExpression(expression)) return;
    if (!ts.isIdentifier(expression.expression)) return;
    if (!childProcessNamespaceBindings.has(expression.expression.text)) return;
    if (CHILD_PROCESS_WRAPPER_APIS.has(expression.name.text)) {
      hasChildProcessSpawnExecUsage = true;
    }
  }

  function visit(node: ts.Node): void {
    if (isStringLiteralLike(node)) {
      markPathReference(node.text);
    }

    if (ts.isImportDeclaration(node) && isStringLiteralLike(node.moduleSpecifier)) {
      const moduleSpecifier = node.moduleSpecifier.text;
      markPathReference(moduleSpecifier);
      if (isChildProcessModuleSpecifier(moduleSpecifier)) {
        hasChildProcessImport = true;
        registerChildProcessImportClause(node.importClause);
      }
    }

    if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference) && node.moduleReference.expression && isStringLiteralLike(node.moduleReference.expression)) {
      const moduleSpecifier = node.moduleReference.expression.text;
      markPathReference(moduleSpecifier);
      if (isChildProcessModuleSpecifier(moduleSpecifier)) {
        hasChildProcessImport = true;
        childProcessNamespaceBindings.add(node.name.text);
      }
    }

    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer) && isRequireCall(node.initializer) && node.initializer.arguments.length > 0 && isStringLiteralLike(node.initializer.arguments[0])) {
      const moduleSpecifier = node.initializer.arguments[0].text;
      markPathReference(moduleSpecifier);
      if (isChildProcessModuleSpecifier(moduleSpecifier)) {
        hasChildProcessImport = true;
        registerChildProcessRequireBinding(node.name);
      }
    }

    if (ts.isCallExpression(node)) {
      if (isRequireCall(node) && node.arguments.length > 0 && isStringLiteralLike(node.arguments[0])) {
        const moduleSpecifier = node.arguments[0].text;
        markPathReference(moduleSpecifier);
        if (isChildProcessModuleSpecifier(moduleSpecifier)) {
          hasChildProcessImport = true;
        }
      }

      if (node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length > 0 && isStringLiteralLike(node.arguments[0])) {
        markPathReference(node.arguments[0].text);
      }

      markSpawnExecUsage(node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    substantiveLines: countSubstantiveLines(content),
    hasChildProcessImport,
    hasChildProcessSpawnExecUsage,
    hasScriptsDistReference,
    hasScriptsSourceReference,
  };
}

// ───────────────────────────────────────────────────────────────
// 6. CORE LOGIC
// ───────────────────────────────────────────────────────────────
function checkSharedNeutrality(packageRoot = PACKAGE_ROOT): GapAViolation[] {
  const resolvedRoot = resolveCheckRoot(packageRoot);
  const sharedDir = path.join(resolvedRoot, 'shared');
  const sourceFiles = findSourceFiles(sharedDir);
  const violations: GapAViolation[] = [];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const moduleSpecifiers = extractModuleSpecifiers(content, file);

    for (const specifier of moduleSpecifiers) {
      if (isProhibitedForShared(specifier.importPath, file, resolvedRoot)) {
        violations.push({ file, line: specifier.line, importPath: specifier.importPath });
      }
    }
  }

  return violations;
}

function checkWrapperOnly(packageRoot = PACKAGE_ROOT): GapBViolation[] {
  const resolvedRoot = resolveCheckRoot(packageRoot);
  const wrappersDir = path.join(resolvedRoot, 'mcp_server', 'scripts');
  const violations: GapBViolation[] = [];

  if (!fs.existsSync(wrappersDir)) return violations;

  // Non-recursive scan — only top-level wrappers, not nested dirs
  const entries = fs.readdirSync(wrappersDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) continue;

    const fullPath = path.join(wrappersDir, entry.name);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const reasons: string[] = [];
    const signals = collectWrapperSignals(content, fullPath);

    if (signals.substantiveLines > MAX_SUBSTANTIVE_LINES) {
      reasons.push(`${signals.substantiveLines} substantive lines (max ${MAX_SUBSTANTIVE_LINES})`);
    }

    if (!signals.hasChildProcessImport) {
      reasons.push('missing child_process import');
    }

    if (!signals.hasChildProcessSpawnExecUsage) {
      reasons.push('no child_process spawn/exec usage');
    }

    if (!signals.hasScriptsDistReference) {
      reasons.push('no reference to scripts/dist/');
    }

    if (signals.hasScriptsSourceReference && !signals.hasScriptsDistReference) {
      reasons.push('references scripts/ without scripts/dist/');
    }

    if (reasons.length > 0) {
      violations.push({ file: fullPath, reasons });
    }
  }

  return violations;
}

function runArchitectureBoundaryCheck(packageRoot = PACKAGE_ROOT): { gapAViolations: GapAViolation[]; gapBViolations: GapBViolation[] } {
  const resolvedRoot = resolveCheckRoot(packageRoot);
  const gapAViolations = checkSharedNeutrality(resolvedRoot);
  const gapBViolations = checkWrapperOnly(resolvedRoot);
  return { gapAViolations, gapBViolations };
}

// ───────────────────────────────────────────────────────────────
// 7. MAIN
// ───────────────────────────────────────────────────────────────
function main(): void {
  const { gapAViolations, gapBViolations } = runArchitectureBoundaryCheck();
  const resolvedRoot = resolveCheckRoot(PACKAGE_ROOT);

  let failed = false;

  if (gapAViolations.length > 0) {
    failed = true;
    console.error(`GAP A FAILED: shared/ neutrality — ${gapAViolations.length} violation(s):\n`);
    for (const v of gapAViolations) {
      const relPath = path.relative(resolvedRoot, v.file);
      console.error(`  ${relPath}:${v.line} → ${v.importPath}`);
    }
    console.error('\nFix: shared/ must not import from mcp_server/ or scripts/. Use only external packages or peer shared/ modules.\n');
  }

  if (gapBViolations.length > 0) {
    failed = true;
    console.error(`GAP B FAILED: mcp_server/scripts/ wrapper-only — ${gapBViolations.length} violation(s):\n`);
    for (const v of gapBViolations) {
      const relPath = path.relative(resolvedRoot, v.file);
      console.error(`  ${relPath}: ${v.reasons.join('; ')}`);
    }
    console.error('\nFix: mcp_server/scripts/ files must be thin wrappers (≤50 lines, child_process import, scripts/dist/ reference).\n');
  }

  if (failed) {
    process.exit(1);
  }

  console.log('Architecture boundary check passed: shared/ neutrality OK, mcp_server/scripts/ wrappers OK.');
  process.exit(0);
}

if (require.main === module) {
  main();
}

export {
  checkSharedNeutrality,
  checkWrapperOnly,
  countSubstantiveLines,
  extractModuleSpecifiers,
  findSourceFiles,
  resolvePackageRoot,
  runArchitectureBoundaryCheck,
};
