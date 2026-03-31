// ───────────────────────────────────────────────────────────────
// MODULE: Structural Indexer
// ───────────────────────────────────────────────────────────────
// Regex-based structural code parser. Extracts symbols and
// relationships from JS/TS/Python/Shell source files.
// Tree-sitter WASM integration planned as future enhancement.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  CodeNode, CodeEdge, ParseResult, SupportedLanguage,
  IndexerConfig, SymbolKind,
} from './indexer-types.js';
import { generateSymbolId, generateContentHash, detectLanguage } from './indexer-types.js';

interface RawCapture {
  name: string;
  kind: SymbolKind;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  signature?: string;
  parentName?: string;
}

/** Parse JavaScript/TypeScript source for structural symbols */
function parseJsTs(content: string): RawCapture[] {
  const captures: RawCapture[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Functions
    const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/);
    if (funcMatch) {
      captures.push({ name: funcMatch[1], kind: 'function', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length, signature: line.trim() });
    }

    // Arrow functions assigned to const
    const arrowMatch = line.match(/(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(/);
    if (arrowMatch && !funcMatch) {
      captures.push({ name: arrowMatch[1], kind: 'function', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length, signature: line.trim() });
    }

    // Classes
    const classMatch = line.match(/(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?/);
    if (classMatch) {
      captures.push({ name: classMatch[1], kind: 'class', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length, signature: line.trim() });
    }

    // Interfaces
    const ifaceMatch = line.match(/(?:export\s+)?interface\s+(\w+)/);
    if (ifaceMatch) {
      captures.push({ name: ifaceMatch[1], kind: 'interface', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
    }

    // Type aliases
    const typeMatch = line.match(/(?:export\s+)?type\s+(\w+)\s*=/);
    if (typeMatch) {
      captures.push({ name: typeMatch[1], kind: 'type_alias', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
    }

    // Enums
    const enumMatch = line.match(/(?:export\s+)?enum\s+(\w+)/);
    if (enumMatch) {
      captures.push({ name: enumMatch[1], kind: 'enum', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
    }

    // Imports
    const importMatch = line.match(/import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"](.+?)['"]/);
    if (importMatch) {
      const names = importMatch[1]
        ? importMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim())
        : [importMatch[2]];
      for (const name of names) {
        if (name) {
          captures.push({ name, kind: 'import', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
        }
      }
    }

    // Exports
    const exportMatch = line.match(/export\s+\{([^}]+)\}/);
    if (exportMatch) {
      const names = exportMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
      for (const name of names) {
        if (name) {
          captures.push({ name, kind: 'export', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
        }
      }
    }
  }
  return captures;
}

/** Parse Python source for structural symbols */
function parsePython(content: string): RawCapture[] {
  const captures: RawCapture[] = [];
  const lines = content.split('\n');
  let currentClass: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    const classMatch = line.match(/^class\s+(\w+)/);
    if (classMatch) {
      currentClass = classMatch[1];
      captures.push({ name: classMatch[1], kind: 'class', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
      continue;
    }

    const funcMatch = line.match(/^(\s*)def\s+(\w+)/);
    if (funcMatch) {
      const indent = funcMatch[1].length;
      const name = funcMatch[2];
      if (indent > 0 && currentClass) {
        captures.push({ name, kind: 'method', startLine: lineNum, endLine: lineNum, startColumn: indent, endColumn: line.length, parentName: currentClass });
      } else {
        currentClass = null;
        captures.push({ name, kind: 'function', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
      }
    }

    const importMatch = line.match(/^(?:from\s+(\S+)\s+)?import\s+(.+)/);
    if (importMatch) {
      const names = importMatch[2].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
      for (const name of names) {
        if (name && name !== '*') {
          captures.push({ name, kind: 'import', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
        }
      }
    }

    if (line.trim().length > 0 && !line.startsWith(' ') && !line.startsWith('\t') && !classMatch) {
      currentClass = null;
    }
  }
  return captures;
}

/** Parse Bash source for structural symbols */
function parseBash(content: string): RawCapture[] {
  const captures: RawCapture[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const funcMatch = line.match(/^(?:function\s+)?(\w+)\s*\(\s*\)/);
    if (funcMatch) {
      captures.push({ name: funcMatch[1], kind: 'function', startLine: lineNum, endLine: lineNum, startColumn: 0, endColumn: line.length });
    }
  }
  return captures;
}

/** Convert raw captures to CodeNode[] */
function capturesToNodes(
  captures: RawCapture[],
  filePath: string,
  language: SupportedLanguage,
  content: string,
): CodeNode[] {
  return captures.map(c => ({
    symbolId: generateSymbolId(filePath, c.parentName ? c.parentName + '.' + c.name : c.name, c.kind),
    filePath,
    fqName: c.parentName ? c.parentName + '.' + c.name : c.name,
    kind: c.kind,
    name: c.name,
    startLine: c.startLine,
    endLine: c.endLine,
    startColumn: c.startColumn,
    endColumn: c.endColumn,
    language,
    signature: c.signature,
    contentHash: generateContentHash(content.split('\n').slice(c.startLine - 1, c.endLine).join('\n')),
  }));
}

/** Extract edges from nodes and source content */
export function extractEdges(nodes: CodeNode[]): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const nodesByName = new Map<string, CodeNode>();
  for (const n of nodes) nodesByName.set(n.name, n);

  // CONTAINS: class -> method
  const classes = nodes.filter(n => n.kind === 'class');
  const methods = nodes.filter(n => n.kind === 'method');
  for (const method of methods) {
    const parent = classes.find(c => method.fqName.startsWith(c.name + '.'));
    if (parent) {
      edges.push({ sourceId: parent.symbolId, targetId: method.symbolId, edgeType: 'CONTAINS', weight: 1.0 });
    }
  }

  // IMPORTS
  const imports = nodes.filter(n => n.kind === 'import');
  for (const imp of imports) {
    const target = nodesByName.get(imp.name);
    if (target && target.symbolId !== imp.symbolId) {
      edges.push({ sourceId: imp.symbolId, targetId: target.symbolId, edgeType: 'IMPORTS', weight: 1.0 });
    }
  }

  // EXPORTS
  const exports = nodes.filter(n => n.kind === 'export');
  for (const exp of exports) {
    const target = nodesByName.get(exp.name);
    if (target && target.symbolId !== exp.symbolId) {
      edges.push({ sourceId: target.symbolId, targetId: exp.symbolId, edgeType: 'EXPORTS', weight: 1.0 });
    }
  }

  return edges;
}

/** Parse a single file and return structural analysis */
export async function parseFile(
  filePath: string,
  content: string,
  language: SupportedLanguage,
): Promise<ParseResult> {
  const startTime = Date.now();
  const contentHash = generateContentHash(content);

  try {
    let captures: RawCapture[];
    switch (language) {
      case 'javascript':
      case 'typescript':
        captures = parseJsTs(content);
        break;
      case 'python':
        captures = parsePython(content);
        break;
      case 'bash':
        captures = parseBash(content);
        break;
      default:
        captures = [];
    }

    const nodes = capturesToNodes(captures, filePath, language, content);
    const edges = extractEdges(nodes);

    return {
      filePath, language, nodes, edges, contentHash,
      parseHealth: captures.length > 0 ? 'clean' : 'recovered',
      parseErrors: [],
      parseDurationMs: Date.now() - startTime,
    };
  } catch (err) {
    return {
      filePath, language,
      nodes: [], edges: [], contentHash,
      parseHealth: 'error',
      parseErrors: [err instanceof Error ? err.message : String(err)],
      parseDurationMs: Date.now() - startTime,
    };
  }
}

/** Recursive file finder matching extension from glob pattern */
function findFiles(dir: string, pattern: string, excludeGlobs: string[], maxSize: number): string[] {
  const extMatch = pattern.match(/\*\.(\w+)$/);
  const targetExt = extMatch ? '.' + extMatch[1] : null;
  const results: string[] = [];

  function walk(currentDir: string): void {
    let entries;
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch { return; }

    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
        walk(fullPath);
      } else if (entry.isFile()) {
        if (targetExt && !entry.name.endsWith(targetExt)) continue;
        try {
          const stat = statSync(fullPath);
          if (stat.size <= maxSize) results.push(fullPath);
        } catch { /* skip */ }
      }
    }
  }

  walk(dir);
  return results;
}

/** Index all matching files in the workspace */
export async function indexFiles(config: IndexerConfig): Promise<ParseResult[]> {
  const results: ParseResult[] = [];
  const allFiles = new Set<string>();

  for (const pattern of config.includeGlobs) {
    const found = findFiles(config.rootDir, pattern, config.excludeGlobs, config.maxFileSizeBytes);
    found.forEach(f => allFiles.add(f));
  }

  for (const file of allFiles) {
    const language = detectLanguage(file);
    if (!language || !config.languages.includes(language)) continue;

    try {
      const content = readFileSync(file, 'utf-8');
      const result = await parseFile(file, content, language);
      results.push(result);
    } catch { /* skip unreadable */ }
  }

  return results;
}
