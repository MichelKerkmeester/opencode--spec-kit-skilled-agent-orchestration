// ---------------------------------------------------------------
// MODULE: Check Handler Cycles Ast
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CHECK HANDLER CYCLES AST
// ───────────────────────────────────────────────────────────────
// Detects circular import/re-export dependencies in mcp_server/handlers.

import * as fs from 'fs';
import * as path from 'path';
import ts from 'typescript';

function resolveHandlersRoot(): string {
  const candidates = [
    // Source layout (tsx): scripts/evals/check-handler-cycles-ast.ts
    path.resolve(__dirname, '../../mcp_server/handlers'),
    // Compiled layout (node): scripts/dist/evals/check-handler-cycles-ast.js
    path.resolve(__dirname, '../../../mcp_server/handlers'),
    // CWD fallbacks
    path.resolve(process.cwd(), '../mcp_server/handlers'),
    path.resolve(process.cwd(), 'mcp_server/handlers'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

const HANDLERS_ROOT = resolveHandlersRoot();

interface CycleRecord {
  nodes: string[];
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

function getModuleSpecifierText(moduleSpecifier: ts.Expression): string | null {
  if (ts.isStringLiteral(moduleSpecifier) || ts.isNoSubstitutionTemplateLiteral(moduleSpecifier)) {
    return moduleSpecifier.text;
  }
  return null;
}

function resolveLocalImportTarget(importingFile: string, importPath: string): string | null {
  if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
    return null;
  }

  const basePath = path.resolve(path.dirname(importingFile), importPath);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.mts`,
    `${basePath}.cts`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.mts'),
    path.join(basePath, 'index.cts'),
  ];

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
      continue;
    }
    if (candidate.startsWith(HANDLERS_ROOT)) {
      return candidate;
    }
    return null;
  }

  return null;
}

function buildDependencyGraph(files: string[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  const fileSet = new Set(files);

  for (const filePath of files) {
    const sourceText = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const deps = new Set<string>();

    function registerDependency(importPath: string): void {
      const target = resolveLocalImportTarget(filePath, importPath);
      if (!target) return;
      if (!fileSet.has(target)) return;
      if (target === filePath) return;
      deps.add(target);
    }

    function visit(node: ts.Node): void {
      if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
        const importPath = getModuleSpecifierText(node.moduleSpecifier);
        if (importPath) registerDependency(importPath);
      }

      if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
        const importPath = getModuleSpecifierText(node.moduleSpecifier);
        if (importPath) registerDependency(importPath);
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    graph.set(filePath, deps);
  }

  return graph;
}

function detectCycles(graph: Map<string, Set<string>>): CycleRecord[] {
  const cycles: CycleRecord[] = [];
  const seenCycleKeys = new Set<string>();
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const stack: string[] = [];

  function normalizeCycleKey(cycleNodes: string[]): string {
    const minNode = [...cycleNodes].sort()[0];
    const pivot = cycleNodes.indexOf(minNode);
    const rotated = cycleNodes.slice(pivot).concat(cycleNodes.slice(0, pivot));
    return rotated.join(' -> ');
  }

  function dfs(node: string): void {
    visited.add(node);
    inStack.add(node);
    stack.push(node);

    for (const dep of graph.get(node) ?? []) {
      if (!visited.has(dep)) {
        dfs(dep);
        continue;
      }

      if (!inStack.has(dep)) {
        continue;
      }

      const cycleStart = stack.indexOf(dep);
      if (cycleStart === -1) {
        continue;
      }

      const cycleNodes = stack.slice(cycleStart);
      const cycleKey = normalizeCycleKey(cycleNodes);
      if (seenCycleKeys.has(cycleKey)) {
        continue;
      }
      seenCycleKeys.add(cycleKey);
      cycles.push({ nodes: [...cycleNodes, dep] });
    }

    stack.pop();
    inStack.delete(node);
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      dfs(node);
    }
  }

  return cycles;
}

function main(): void {
  if (!fs.existsSync(HANDLERS_ROOT)) {
    console.error(`ERROR: handlers directory not found: ${HANDLERS_ROOT}`);
    process.exit(2);
  }

  const files = findTsFiles(HANDLERS_ROOT);
  const graph = buildDependencyGraph(files);
  const cycles = detectCycles(graph);

  if (cycles.length === 0) {
    console.log(`AST handler cycle check passed: no circular dependencies across ${files.length} handler files.`);
    process.exit(0);
  }

  console.error(`AST handler cycle check FAILED: ${cycles.length} cycle(s) detected:\n`);
  for (const cycle of cycles) {
    const relCycle = cycle.nodes.map((node) => path.relative(HANDLERS_ROOT, node));
    console.error(`  - ${relCycle.join(' -> ')}`);
  }
  console.error('\nResolve cycles by extracting shared utilities into neutral handler modules.');
  process.exit(1);
}

main();
