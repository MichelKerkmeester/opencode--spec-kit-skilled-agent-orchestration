// ---------------------------------------------------------------
// MODULE: Check Architecture Boundaries
// ---------------------------------------------------------------
// Enforces two rules from ARCHITECTURE.md that were
// previously documentation-only:
//   GAP A — shared/ must not import from mcp_server/ or scripts/
//   GAP B — mcp_server/scripts/ files must be thin wrappers only

// 1. IMPORTS

import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';

// ---------------------------------------------------------------------------
// 2. TYPE DEFINITIONS
// ---------------------------------------------------------------------------

interface GapAViolation {
  file: string;
  line: number;
  importPath: string;
}

interface GapBViolation {
  file: string;
  reasons: string[];
}

// ---------------------------------------------------------------------------
// 3. CONSTANTS
// ---------------------------------------------------------------------------

const PACKAGE_ROOT = path.resolve(__dirname, '../..');

// AI-WHY: absolute prohibition — shared/ must remain neutral (no allowlist)
const SHARED_PROHIBITED_PATTERNS = [
  /\.\.(?:\/\.\.)*\/mcp_server\//,
  /\.\.(?:\/\.\.)*\/scripts\//,
  /^@spec-kit\/mcp-server\//,
  /^@spec-kit\/scripts\//,
];

// AI-WHY: 50 lines is generous for a spawn+exit wrapper; anything larger
// indicates logic that belongs in scripts/ instead
const MAX_SUBSTANTIVE_LINES = 50;

// ---------------------------------------------------------------------------
// 4. HELPERS
// ---------------------------------------------------------------------------

function findTsFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;
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

function isProhibitedForShared(importPath: string): boolean {
  return SHARED_PROHIBITED_PATTERNS.some((re) => re.test(importPath));
}

function extractModuleSpecifiers(content: string, filePath: string): Array<{ importPath: string; line: number }> {
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const hits: Array<{ importPath: string; line: number }> = [];

  function pushHit(moduleSpecifier: ts.Expression): void {
    if (!ts.isStringLiteral(moduleSpecifier) && !ts.isNoSubstitutionTemplateLiteral(moduleSpecifier)) return;
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

    if (ts.isCallExpression(node) && node.arguments.length > 0) {
      const firstArg = node.arguments[0];
      const isRequireCall = ts.isIdentifier(node.expression) && node.expression.text === 'require';
      const isDynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      if ((isRequireCall || isDynamicImport) && (ts.isStringLiteral(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg))) {
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

// ---------------------------------------------------------------------------
// 5. CORE LOGIC
// ---------------------------------------------------------------------------

function checkSharedNeutrality(): GapAViolation[] {
  const sharedDir = path.join(PACKAGE_ROOT, 'shared');
  const tsFiles = findTsFiles(sharedDir);
  const violations: GapAViolation[] = [];

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const moduleSpecifiers = extractModuleSpecifiers(content, file);

    for (const specifier of moduleSpecifiers) {
      if (isProhibitedForShared(specifier.importPath)) {
        violations.push({ file, line: specifier.line, importPath: specifier.importPath });
      }
    }
  }

  return violations;
}

function checkWrapperOnly(): GapBViolation[] {
  const wrappersDir = path.join(PACKAGE_ROOT, 'mcp_server', 'scripts');
  const violations: GapBViolation[] = [];

  if (!fs.existsSync(wrappersDir)) return violations;

  // AI-WHY: non-recursive scan — only top-level wrappers, not nested dirs
  const entries = fs.readdirSync(wrappersDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) continue;

    const fullPath = path.join(wrappersDir, entry.name);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const reasons: string[] = [];

    const substantive = countSubstantiveLines(content);
    if (substantive > MAX_SUBSTANTIVE_LINES) {
      reasons.push(`${substantive} substantive lines (max ${MAX_SUBSTANTIVE_LINES})`);
    }

    if (!content.includes('child_process')) {
      reasons.push('missing child_process import');
    }

    if (!content.includes('scripts/dist/')) {
      reasons.push('no reference to scripts/dist/');
    }

    if (reasons.length > 0) {
      violations.push({ file: fullPath, reasons });
    }
  }

  return violations;
}

// ---------------------------------------------------------------------------
// 6. MAIN
// ---------------------------------------------------------------------------

function main(): void {
  const gapAViolations = checkSharedNeutrality();
  const gapBViolations = checkWrapperOnly();

  let failed = false;

  if (gapAViolations.length > 0) {
    failed = true;
    console.error(`GAP A FAILED: shared/ neutrality — ${gapAViolations.length} violation(s):\n`);
    for (const v of gapAViolations) {
      const relPath = path.relative(PACKAGE_ROOT, v.file);
      console.error(`  ${relPath}:${v.line} → ${v.importPath}`);
    }
    console.error('\nFix: shared/ must not import from mcp_server/ or scripts/. Use only external packages or peer shared/ modules.\n');
  }

  if (gapBViolations.length > 0) {
    failed = true;
    console.error(`GAP B FAILED: mcp_server/scripts/ wrapper-only — ${gapBViolations.length} violation(s):\n`);
    for (const v of gapBViolations) {
      const relPath = path.relative(PACKAGE_ROOT, v.file);
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

main();
