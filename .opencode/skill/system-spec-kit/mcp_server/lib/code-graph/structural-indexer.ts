// ───────────────────────────────────────────────────────────────
// MODULE: Structural Indexer
// ───────────────────────────────────────────────────────────────
// Structural code parser with dual-backend support:
// - Tree-sitter WASM (default): AST-accurate symbol extraction
// - Regex fallback (SPECKIT_PARSER=regex): lightweight, no WASM deps
// Extracts symbols and relationships from JS/TS/Python/Shell.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import type {
  CodeNode, CodeEdge, ParseResult, SupportedLanguage,
  IndexerConfig, SymbolKind,
} from './indexer-types.js';
import { generateSymbolId, generateContentHash, detectLanguage } from './indexer-types.js';
import { isFileStale } from './code-graph-db.js';

interface ParserAdapter {
  parse(content: string, language: SupportedLanguage): ParseResult;
}

export interface RawCapture {
  name: string;
  kind: SymbolKind;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  signature?: string;
  parentName?: string;
  extendsName?: string;
  implementsNames?: string[];
  decoratorNames?: string[];
  typeRefs?: string[];
}

function findBraceBlockEndLine(lines: string[], startIndex: number): number {
  const startLine = lines[startIndex];
  const firstBraceIndex = startLine.indexOf('{');
  if (firstBraceIndex === -1) return startIndex + 1;

  let depth = 0;
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const columnStart = i === startIndex ? firstBraceIndex : 0;

    for (let j = columnStart; j < line.length; j++) {
      if (line[j] === '{') depth++;
      if (line[j] === '}') {
        depth--;
        if (depth === 0) return i + 1;
      }
    }
  }

  return startIndex + 1;
}

function getIndentLevel(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

function findPythonBlockEndLine(lines: string[], startIndex: number): number {
  const baseIndent = getIndentLevel(lines[startIndex]);
  let endLine = startIndex + 1;

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().length === 0) continue;

    const indent = getIndentLevel(line);
    if (indent <= baseIndent) break;
    endLine = i + 1;
  }

  return endLine;
}

function getCaptureFqName(capture: Pick<RawCapture, 'name' | 'parentName'>): string {
  return capture.parentName ? `${capture.parentName}.${capture.name}` : capture.name;
}

function splitTopLevel(text: string, delimiter: string): string[] {
  const parts: string[] = [];
  let current = '';
  let angleDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  for (const ch of text) {
    if (
      ch === delimiter &&
      angleDepth === 0 &&
      parenDepth === 0 &&
      bracketDepth === 0 &&
      braceDepth === 0
    ) {
      const part = current.trim();
      if (part) parts.push(part);
      current = '';
      continue;
    }

    current += ch;

    if (ch === '<') angleDepth++;
    else if (ch === '>') angleDepth = Math.max(0, angleDepth - 1);
    else if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth = Math.max(0, parenDepth - 1);
    else if (ch === '[') bracketDepth++;
    else if (ch === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    else if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth = Math.max(0, braceDepth - 1);
  }

  const tail = current.trim();
  if (tail) parts.push(tail);
  return parts;
}

function splitTopLevelOnce(text: string, delimiter: string): [string, string | undefined] {
  let angleDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (
      ch === delimiter &&
      angleDepth === 0 &&
      parenDepth === 0 &&
      bracketDepth === 0 &&
      braceDepth === 0
    ) {
      return [text.slice(0, i).trim(), text.slice(i + 1).trim()];
    }

    if (ch === '<') angleDepth++;
    else if (ch === '>') angleDepth = Math.max(0, angleDepth - 1);
    else if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth = Math.max(0, parenDepth - 1);
    else if (ch === '[') bracketDepth++;
    else if (ch === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    else if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth = Math.max(0, braceDepth - 1);
  }

  return [text.trim(), undefined];
}

function extractTypeReferences(typeExpression?: string): string[] | undefined {
  if (!typeExpression) return undefined;

  const excludedNames = new Set([
    'string', 'number', 'boolean', 'void', 'any', 'unknown', 'never',
    'object', 'undefined', 'null', 'true', 'false', 'keyof', 'typeof',
    'infer', 'extends', 'readonly', 'in', 'out', 'is', 'as',
  ]);

  const matches = typeExpression.match(/\b[A-Za-z_][A-Za-z0-9_]*\b/g) ?? [];
  const refs = matches.filter(name => !excludedNames.has(name));
  if (refs.length === 0) return undefined;
  return [...new Set(refs)];
}

function extractDecoratorNames(line: string): string[] {
  const matches = line.matchAll(/@([A-Za-z_][A-Za-z0-9_]*)/g);
  const names = [...matches].map(match => match[1]);
  return [...new Set(names)];
}

function consumeDecorators(pendingDecorators: string[]): string[] | undefined {
  if (pendingDecorators.length === 0) return undefined;
  const names = [...new Set(pendingDecorators)];
  pendingDecorators.length = 0;
  return names;
}

function countBraces(line: string): number {
  let depth = 0;
  for (const ch of line) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
  }
  return depth;
}

function extractParameterCaptures(
  paramsText: string,
  parentName: string,
  lineNum: number,
  lineLength: number,
): RawCapture[] {
  if (!paramsText.trim()) return [];

  const parameterCaptures: RawCapture[] = [];
  for (const param of splitTopLevel(paramsText, ',')) {
    let segment = param.trim();
    if (!segment || segment.startsWith('{') || segment.startsWith('[')) continue;

    segment = segment.replace(/^@\w+\s+/, '').trim();
    segment = segment.replace(/^(?:public|private|protected|readonly)\s+/, '').trim();
    segment = segment.replace(/^\.\.\./, '').trim();

    const [namePart, typePart] = splitTopLevelOnce(segment, ':');
    const [rawName] = splitTopLevelOnce(namePart, '=');
    const name = rawName.replace(/\?$/, '').trim();
    if (!name) continue;

    const typeText = typePart ? splitTopLevelOnce(typePart, '=')[0] : undefined;
    parameterCaptures.push({
      name,
      kind: 'parameter',
      startLine: lineNum,
      endLine: lineNum,
      startColumn: 0,
      endColumn: lineLength,
      parentName,
      signature: segment,
      typeRefs: extractTypeReferences(typeText),
    });
  }

  return parameterCaptures;
}

function getModuleName(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? filePath;
  return fileName.replace(/\.[^.]+$/, '') || fileName || 'module';
}

/** Parse JavaScript/TypeScript source for structural symbols */
function parseJsTs(content: string): RawCapture[] {
  const captures: RawCapture[] = [];
  const lines = content.split('\n');
  let currentClass: RawCapture | null = null;
  let braceDepth = 0;
  const pendingDecorators: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmedLine = line.trim();

    if (currentClass && lineNum > currentClass.endLine) {
      currentClass = null;
    }

    if (trimmedLine.startsWith('@')) {
      pendingDecorators.push(...extractDecoratorNames(trimmedLine));
      braceDepth += countBraces(line);
      continue;
    }

    if (trimmedLine.length === 0) {
      pendingDecorators.length = 0;
      braceDepth += countBraces(line);
      continue;
    }

    // Functions
    const funcMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?/);
    if (funcMatch) {
      const functionCapture: RawCapture = {
        name: funcMatch[1], kind: 'function', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length, signature: line.trim(),
        decoratorNames: consumeDecorators(pendingDecorators),
        typeRefs: extractTypeReferences(funcMatch[3]),
      };
      captures.push(functionCapture);
      captures.push(
        ...extractParameterCaptures(
          funcMatch[2] ?? '',
          getCaptureFqName(functionCapture),
          lineNum,
          line.length,
        ),
      );
    }

    // Arrow functions assigned to const/let/var
    const arrowMatch = line.match(
      /(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*(?::\s*([^=]+?))?\s*=>/,
    );
    if (arrowMatch && !funcMatch) {
      const functionCapture: RawCapture = {
        name: arrowMatch[1], kind: 'function', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length, signature: line.trim(),
        decoratorNames: consumeDecorators(pendingDecorators),
        typeRefs: extractTypeReferences(arrowMatch[3]),
      };
      captures.push(functionCapture);
      captures.push(
        ...extractParameterCaptures(
          arrowMatch[2] ?? '',
          getCaptureFqName(functionCapture),
          lineNum,
          line.length,
        ),
      );
    }

    // Classes (with extends and implements)
    const classMatch = line.match(/(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?/);
    if (classMatch) {
      const implNames = classMatch[3]
        ? classMatch[3].split(',').map(s => s.trim()).filter(Boolean)
        : undefined;
      currentClass = {
        name: classMatch[1], kind: 'class', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i),
        startColumn: 0, endColumn: line.length, signature: line.trim(),
        extendsName: classMatch[2] || undefined,
        implementsNames: implNames,
        decoratorNames: consumeDecorators(pendingDecorators),
      };
      captures.push(currentClass);
    }

    // Class methods — require at least one modifier keyword OR a method body opener `{`
    // to distinguish declarations from bare function calls like `baz()`
    const methodMatchWithModifier = currentClass
      ? line.match(
        /^\s*(?:(?:public|private|protected|static|readonly|abstract|async|override|get|set)\s+)+(?:\*\s*)?(#?\w+)\s*(?:<[^>]*>)?\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*\{?/,
      )
      : null;
    const methodMatchShorthand = currentClass && !methodMatchWithModifier
      ? line.match(
        /^\s*(#?\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*\{/,
      )
      : null;
    const methodMatch = methodMatchWithModifier ?? methodMatchShorthand;
    if (methodMatch && currentClass) {
      const methodName = methodMatch[1];
      if (methodName !== 'constructor') {
        const methodCapture: RawCapture = {
          name: methodName.replace(/^#/, ''),
          kind: 'method',
          startLine: lineNum,
          endLine: findBraceBlockEndLine(lines, i),
          startColumn: 0,
          endColumn: line.length,
          signature: line.trim(),
          parentName: currentClass.name,
          decoratorNames: consumeDecorators(pendingDecorators),
          typeRefs: extractTypeReferences(methodMatch[3]),
        };
        captures.push(methodCapture);
        captures.push(
          ...extractParameterCaptures(
            methodMatch[2] ?? '',
            getCaptureFqName(methodCapture),
            lineNum,
            line.length,
          ),
        );
      }
    }

    // Interfaces
    const ifaceMatch = line.match(/(?:export\s+)?interface\s+(\w+)/);
    if (ifaceMatch) {
      captures.push({
        name: ifaceMatch[1], kind: 'interface', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length,
      });
    }

    // Type aliases
    const typeMatch = line.match(/(?:export\s+)?type\s+(\w+)\s*=/);
    if (typeMatch) {
      captures.push({
        name: typeMatch[1], kind: 'type_alias', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length,
      });
    }

    // Enums
    const enumMatch = line.match(/(?:export\s+)?enum\s+(\w+)/);
    if (enumMatch) {
      captures.push({
        name: enumMatch[1], kind: 'enum', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length,
      });
    }

    // Imports
    const importMatch = braceDepth === 0
      ? line.match(/import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"](.+?)['"]/)
      : null;
    if (importMatch) {
      const names = importMatch[1]
        ? importMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim())
        : [importMatch[2]];
      for (const name of names) {
        if (name) {
          captures.push({
            name, kind: 'import', startLine: lineNum,
            endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
            endColumn: line.length,
          });
        }
      }
    }

    // Exports
    const exportMatch = braceDepth === 0 ? line.match(/export\s+\{([^}]+)\}/) : null;
    if (exportMatch) {
      const names = exportMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
      for (const name of names) {
        if (name) {
          captures.push({
            name, kind: 'export', startLine: lineNum,
            endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
            endColumn: line.length,
          });
        }
      }
    }

    // Variables
    const variableMatch = braceDepth === 0
      ? line.match(/(?:export\s+)?(?:const|let|var)\s+(\w+)(?:\s*:\s*([^=;]+))?/)
      : null;
    if (variableMatch) {
      captures.push({
        name: variableMatch[1],
        kind: 'variable',
        startLine: lineNum,
        endLine: lineNum,
        startColumn: 0,
        endColumn: line.length,
        signature: line.trim(),
        typeRefs: extractTypeReferences(variableMatch[2]),
      });
    }

    if (pendingDecorators.length > 0 && !funcMatch && !arrowMatch && !classMatch && !methodMatch) {
      pendingDecorators.length = 0;
    }

    braceDepth += countBraces(line);
  }
  return captures;
}

/** Parse Python source for structural symbols */
function parsePython(content: string): RawCapture[] {
  const captures: RawCapture[] = [];
  const lines = content.split('\n');
  let currentClass: RawCapture | null = null;
  let classIndent = 0; // indentation column of the class keyword
  let classMethodIndent = -1; // indent of the first def in the class body (auto-detected)
  const pendingDecorators: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmedLine = line.trim();

    if (currentClass && lineNum > currentClass.endLine) {
      currentClass = null;
      classIndent = 0;
      classMethodIndent = -1;
    }

    if (trimmedLine.startsWith('@')) {
      pendingDecorators.push(...extractDecoratorNames(trimmedLine));
      continue;
    }

    const classMatch = line.match(/^(\s*)class\s+(\w+)(?:\(([^)]*)\))?/);
    if (classMatch) {
      classIndent = classMatch[1].length;
      const bases = classMatch[3]
        ? classMatch[3].split(',').map(base => base.trim()).filter(Boolean)
        : [];
      currentClass = {
        name: classMatch[2], kind: 'class', startLine: lineNum,
        endLine: findPythonBlockEndLine(lines, i), startColumn: classIndent,
        endColumn: line.length,
        extendsName: bases[0],
        signature: line.trim(),
        decoratorNames: consumeDecorators(pendingDecorators),
      };
      captures.push(currentClass);
      continue;
    }

    const funcMatch = line.match(/^(\s*)def\s+(\w+)\s*\(([^)]*)\)\s*(?:->\s*([^:]+))?/);
    if (funcMatch) {
      const indent = funcMatch[1].length;
      const name = funcMatch[2];
      // Auto-detect class method indent from the first def inside the class body
      const isClassMemberLevel = currentClass && indent > classIndent && (
        classMethodIndent === -1
          ? (classMethodIndent = indent, true)
          : indent === classMethodIndent
      );
      if (isClassMemberLevel && currentClass) {
        const methodCapture: RawCapture = {
          name, kind: 'method', startLine: lineNum,
          endLine: findPythonBlockEndLine(lines, i), startColumn: indent,
          endColumn: line.length, parentName: currentClass.name,
          signature: line.trim(),
          decoratorNames: consumeDecorators(pendingDecorators),
          typeRefs: extractTypeReferences(funcMatch[4]),
        };
        captures.push(methodCapture);
        captures.push(
          ...extractParameterCaptures(
            funcMatch[3] ?? '',
            getCaptureFqName(methodCapture),
            lineNum,
            line.length,
          ),
        );
      } else {
        currentClass = null;
        const functionCapture: RawCapture = {
          name, kind: 'function', startLine: lineNum,
          endLine: findPythonBlockEndLine(lines, i), startColumn: 0,
          endColumn: line.length,
          signature: line.trim(),
          decoratorNames: consumeDecorators(pendingDecorators),
          typeRefs: extractTypeReferences(funcMatch[4]),
        };
        captures.push(functionCapture);
        captures.push(
          ...extractParameterCaptures(
            funcMatch[3] ?? '',
            getCaptureFqName(functionCapture),
            lineNum,
            line.length,
          ),
        );
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

    if (pendingDecorators.length > 0 && trimmedLine.length > 0 && !funcMatch) {
      pendingDecorators.length = 0;
    }

    if (trimmedLine.length > 0 && !line.startsWith(' ') && !line.startsWith('\t') && !classMatch) {
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
    // Match 'foo() {' or 'function foo() {' form
    const funcMatch = line.match(/^(?:function\s+)?(\w+)\s*\(\s*\)/);
    if (funcMatch) {
      captures.push({
        name: funcMatch[1], kind: 'function', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length,
      });
      continue;
    }
    // F042: Match 'function foo { }' and 'function foo() { }' (function keyword form without prior match)
    const funcKeywordMatch = line.match(/^function\s+(\w+)\s*(?:\(\s*\))?\s*\{?/);
    if (funcKeywordMatch) {
      captures.push({
        name: funcKeywordMatch[1], kind: 'function', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length,
      });
    }
  }
  return captures;
}

class RegexParser implements ParserAdapter {
  parse(content: string, language: SupportedLanguage): ParseResult {
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

      const nodes = capturesToNodes(captures, '', language, content);
      const contentLines = content.split('\n');
      const edges = extractEdges(nodes, contentLines, captures);

      return {
        filePath: '',
        language,
        nodes,
        edges,
        contentHash,
        parseHealth: captures.length > 0 ? 'clean' : 'recovered',
        parseErrors: [],
        parseDurationMs: Date.now() - startTime,
      };
    } catch (err: unknown) {
      return {
        filePath: '',
        language,
        nodes: [],
        edges: [],
        contentHash,
        parseHealth: 'error',
        parseErrors: [err instanceof Error ? err.message : String(err)],
        parseDurationMs: Date.now() - startTime,
      };
    }
  }
}

/** Cached tree-sitter parser instance (lazy-loaded to avoid circular import at module init) */
let treeSitterParser: ParserAdapter | null = null;

/**
 * Returns the active parser backend.
 *
 * SPECKIT_PARSER env var controls which backend is used:
 *   - 'treesitter' (default): AST-accurate parsing via web-tree-sitter WASM grammars
 *   - 'regex': Lightweight regex-based fallback with no WASM dependencies
 *
 * Tree-sitter is lazy-loaded on first call. If WASM init fails, falls back to regex automatically.
 */
export async function getParser(): Promise<ParserAdapter> {
  const parserEnv = process.env.SPECKIT_PARSER ?? 'treesitter';

  if (parserEnv === 'treesitter') {
    try {
      // Dynamic import avoids circular dependency (tree-sitter-parser imports extractEdges from here)
      const { TreeSitterParser } = await import('./tree-sitter-parser.js');
      if (treeSitterParser && TreeSitterParser.isReady()) {
        return treeSitterParser;
      }

      await TreeSitterParser.init();
      await TreeSitterParser.loadAllLanguages();
      treeSitterParser ??= new TreeSitterParser();
      return treeSitterParser;
    } catch (err: unknown) {
      // Reset so next call retries instead of returning a broken cached instance
      treeSitterParser = null;
      console.warn(`[structural-indexer] Tree-sitter init failed, falling back to regex: ${err instanceof Error ? err.message : String(err)}`);
      return new RegexParser();
    }
  }

  return new RegexParser();
}

function attachFilePath(result: ParseResult, filePath: string): ParseResult {
  const symbolIdMap = new Map<string, string>();
  const nodes = result.nodes.map(node => {
    const fqName = node.kind === 'module' ? getModuleName(filePath) : node.fqName;
    const name = node.kind === 'module' ? getModuleName(filePath) : node.name;
    const symbolId = generateSymbolId(filePath, fqName, node.kind);
    symbolIdMap.set(node.symbolId, symbolId);
    return { ...node, filePath, symbolId, fqName, name };
  });

  const edges = result.edges.map(edge => ({
    ...edge,
    sourceId: symbolIdMap.get(edge.sourceId) ?? edge.sourceId,
    targetId: symbolIdMap.get(edge.targetId) ?? edge.targetId,
  }));

  return { ...result, filePath, nodes, edges };
}

/** Convert raw captures to CodeNode[] */
export function capturesToNodes(
  captures: RawCapture[],
  filePath: string,
  language: SupportedLanguage,
  content: string,
): CodeNode[] {
  const lines = content.split('\n');
  const moduleNode: CodeNode = {
    symbolId: generateSymbolId(filePath, getModuleName(filePath), 'module'),
    filePath,
    fqName: getModuleName(filePath),
    kind: 'module',
    name: getModuleName(filePath),
    startLine: 1,
    endLine: Math.max(lines.length, 1),
    startColumn: 0,
    endColumn: lines[lines.length - 1]?.length ?? 0,
    language,
    contentHash: generateContentHash(content),
  };

  const symbolNodes = captures.map(c => {
    const rangeText = lines.slice(c.startLine - 1, c.endLine).join('\n');
    return {
      symbolId: generateSymbolId(filePath, getCaptureFqName(c), c.kind),
      filePath,
      fqName: getCaptureFqName(c),
      kind: c.kind,
      name: c.name,
      startLine: c.startLine,
      endLine: c.endLine,
      startColumn: c.startColumn,
      endColumn: c.endColumn,
      language,
      signature: c.signature,
      contentHash: generateContentHash(rangeText),
    };
  });

  if (content.trim().length === 0) {
    return symbolNodes;
  }

  return [moduleNode, ...symbolNodes];
}

/** Extract edges from nodes, source content, and raw captures */
export function extractEdges(
  nodes: CodeNode[],
  contentLines?: string[],
  captures?: RawCapture[],
): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const nodesByName = new Map<string, CodeNode[]>();
  const nodesByFqName = new Map<string, CodeNode>();
  for (const node of nodes) {
    const group = nodesByName.get(node.name) ?? [];
    group.push(node);
    nodesByName.set(node.name, group);
    nodesByFqName.set(node.fqName, node);
  }

  // Build capture lookup by name for extends/implements data
  const captureByFqName = new Map<string, RawCapture>();
  if (captures) {
    for (const capture of captures) {
      captureByFqName.set(getCaptureFqName(capture), capture);
    }
  }

  const preferredKinds = (
    name: string,
    kinds: SymbolKind[],
    excludeId?: string,
  ): CodeNode | undefined => {
    const candidates = nodesByName.get(name) ?? [];
    for (const kind of kinds) {
      const match = candidates.find(candidate => candidate.kind === kind && candidate.symbolId !== excludeId);
      if (match) return match;
    }
    return candidates.find(candidate => candidate.symbolId !== excludeId);
  };

  // CONTAINS: class -> method (confidence 1.0)
  const classes = nodes.filter(n => n.kind === 'class');
  const methods = nodes.filter(n => n.kind === 'method');
  for (const method of methods) {
    const parent = classes.find(c => method.fqName.startsWith(c.name + '.'));
    if (parent) {
      edges.push({
        sourceId: parent.symbolId, targetId: method.symbolId,
        edgeType: 'CONTAINS', weight: 1.0,
        metadata: { confidence: '1.0' },
      });
    }
  }

  // IMPORTS (confidence 1.0)
  const imports = nodes.filter(n => n.kind === 'import');
  for (const imp of imports) {
    const target = preferredKinds(imp.name, ['function', 'class', 'interface', 'type_alias', 'enum', 'variable', 'module'], imp.symbolId);
    if (target && target.symbolId !== imp.symbolId) {
      edges.push({
        sourceId: imp.symbolId, targetId: target.symbolId,
        edgeType: 'IMPORTS', weight: 1.0,
        metadata: { confidence: '1.0' },
      });
    }
  }

  // EXPORTS (confidence 1.0)
  const exports = nodes.filter(n => n.kind === 'export');
  for (const exp of exports) {
    const target = preferredKinds(exp.name, ['function', 'class', 'interface', 'type_alias', 'enum', 'variable', 'module'], exp.symbolId);
    if (target && target.symbolId !== exp.symbolId) {
      edges.push({
        sourceId: target.symbolId, targetId: exp.symbolId,
        edgeType: 'EXPORTS', weight: 1.0,
        metadata: { confidence: '1.0' },
      });
    }
  }

  // EXTENDS: class -> parent class (confidence 0.95)
  for (const cls of classes) {
    const cap = captureByFqName.get(cls.fqName);
    if (cap?.extendsName) {
      const parent = preferredKinds(cap.extendsName, ['class'], cls.symbolId);
      if (parent) {
        edges.push({
          sourceId: cls.symbolId, targetId: parent.symbolId,
          edgeType: 'EXTENDS', weight: 0.95,
          metadata: { confidence: '0.95' },
        });
      }
    }
  }

  // IMPLEMENTS: class -> interface (confidence 0.95)
  for (const cls of classes) {
    const cap = captureByFqName.get(cls.fqName);
    if (cap?.implementsNames) {
      for (const ifaceName of cap.implementsNames) {
        const iface = preferredKinds(ifaceName, ['interface', 'type_alias', 'import'], cls.symbolId);
        if (iface) {
          edges.push({
            sourceId: cls.symbolId, targetId: iface.symbolId,
            edgeType: 'IMPLEMENTS', weight: 0.95,
            metadata: { confidence: '0.95' },
          });
        }
      }
    }
  }

  // CALLS: function/method -> called function (confidence 0.8)
  if (contentLines) {
    const callableNodes = nodes.filter(
      n => n.kind === 'function' || n.kind === 'method',
    );
    const callPattern = /\b(\w+)\s*\(/g;

    for (const caller of callableNodes) {
      const bodyLines = contentLines.slice(caller.startLine - 1, caller.endLine);
      const bodyText = bodyLines.join('\n');
      const seen = new Set<string>();
      let match: RegExpExecArray | null;

      while ((match = callPattern.exec(bodyText)) !== null) {
        const calledName = match[1];
        // Skip self-references, keywords, and duplicates
        if (calledName === caller.name || seen.has(calledName)) continue;
        // Skip common JS/TS keywords that precede parens
        if (['if', 'for', 'while', 'switch', 'catch', 'return', 'throw', 'new', 'typeof', 'await', 'async', 'function', 'class', 'const', 'let', 'var'].includes(calledName)) continue;
        seen.add(calledName);

        const target = preferredKinds(calledName, ['function', 'method', 'class', 'variable'], caller.symbolId);
        if (target && target.symbolId !== caller.symbolId) {
          edges.push({
            sourceId: caller.symbolId, targetId: target.symbolId,
            edgeType: 'CALLS', weight: 0.8,
            metadata: { confidence: '0.8' },
          });
        }
      }
    }
  }

  // DECORATES: decorator symbol -> decorated class/function/method (confidence 0.9)
  if (captures) {
    for (const capture of captures) {
      if (!capture.decoratorNames?.length) continue;
      const decoratedNode = nodesByFqName.get(getCaptureFqName(capture));
      if (!decoratedNode) continue;

      for (const decoratorName of capture.decoratorNames) {
        const decoratorNode = preferredKinds(decoratorName, ['function', 'class', 'import', 'variable', 'method'], decoratedNode.symbolId);
        if (!decoratorNode) continue;

        edges.push({
          sourceId: decoratorNode.symbolId,
          targetId: decoratedNode.symbolId,
          edgeType: 'DECORATES',
          weight: 0.9,
          metadata: { confidence: '0.9' },
        });
      }
    }
  }

  // OVERRIDES: method -> parent class method (confidence 0.9)
  for (const method of methods) {
    const ownerCapture = captureByFqName.get(method.fqName);
    if (!ownerCapture?.parentName) continue;

    let parentClassCapture = captureByFqName.get(ownerCapture.parentName);
    let parentClassName = parentClassCapture?.extendsName;

    while (parentClassName) {
      const parentMethod = nodesByFqName.get(`${parentClassName}.${method.name}`);
      if (parentMethod?.kind === 'method') {
        edges.push({
          sourceId: method.symbolId,
          targetId: parentMethod.symbolId,
          edgeType: 'OVERRIDES',
          weight: 0.9,
          metadata: { confidence: '0.9' },
        });
        break;
      }

      parentClassCapture = captureByFqName.get(parentClassName);
      parentClassName = parentClassCapture?.extendsName;
    }
  }

  // TYPE_OF: symbol -> referenced type symbol (confidence 0.85)
  if (captures) {
    for (const capture of captures) {
      if (!capture.typeRefs?.length) continue;

      const sourceNode = nodesByFqName.get(getCaptureFqName(capture));
      if (!sourceNode) continue;

      for (const typeName of capture.typeRefs) {
        const typeNode = preferredKinds(typeName, ['class', 'interface', 'type_alias', 'enum', 'import'], sourceNode.symbolId);
        if (!typeNode) continue;

        edges.push({
          sourceId: sourceNode.symbolId,
          targetId: typeNode.symbolId,
          edgeType: 'TYPE_OF',
          weight: 0.85,
          metadata: { confidence: '0.85' },
        });
      }
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
    const parser = await getParser();
    const parserResult = parser.parse(content, language);
    return attachFilePath(parserResult, filePath);
  } catch (err: unknown) {
    return {
      filePath, language,
      nodes: [], edges: [], contentHash,
      parseHealth: 'error',
      parseErrors: [err instanceof Error ? err.message : String(err)],
      parseDurationMs: Date.now() - startTime,
    };
  }
}

function normalizeGlobPath(pathValue: string): string {
  return pathValue.replace(/\\/g, '/').replace(/^\.\//, '');
}

function globToRegExp(glob: string): RegExp {
  const normalized = normalizeGlobPath(glob);
  let pattern = '^';

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const next = normalized[i + 1];
    const nextThree = normalized.slice(i, i + 3);

    if (nextThree === '**/') {
      pattern += '(?:.*/)?';
      i += 2;
      continue;
    }

    if (char === '*' && next === '*') {
      pattern += '.*';
      i += 1;
      continue;
    }

    if (char === '*') {
      pattern += '[^/]*';
      continue;
    }

    if (char === '?') {
      pattern += '[^/]';
      continue;
    }

    if ('\\.^$+{}()|[]'.includes(char)) {
      pattern += `\\${char}`;
      continue;
    }

    pattern += char;
  }

  pattern += '$';
  return new RegExp(pattern);
}

function shouldExcludePath(
  rootDir: string,
  fullPath: string,
  excludePatterns: RegExp[],
  isDirectory: boolean,
): boolean {
  const relativePath = normalizeGlobPath(relative(rootDir, fullPath));
  const candidatePath = isDirectory ? `${relativePath}/` : relativePath;
  return excludePatterns.some(pattern => pattern.test(candidatePath));
}

/** Recursive file finder matching extension from glob pattern */
function findFiles(rootDir: string, pattern: string, excludeGlobs: string[], maxSize: number): string[] {
  const extMatch = pattern.match(/\*\.(\w+)$/);
  const targetExt = extMatch ? '.' + extMatch[1] : null;
  const results: string[] = [];
  const excludePatterns = excludeGlobs.map(globToRegExp);

  function walk(currentDir: string): void {
    let entries;
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch { return; }

    for (const entry of entries) {
      const fullPath = resolve(currentDir, entry.name);
      if (shouldExcludePath(rootDir, fullPath, excludePatterns, entry.isDirectory())) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        if (targetExt && !entry.name.endsWith(targetExt)) continue;
        try {
          const stat = statSync(fullPath);
          if (stat.size <= maxSize) {
            results.push(fullPath);
          } else {
            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
          }
        } catch { /* skip */ }
      }
    }
  }

  walk(rootDir);
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

    // P1 perf: skip read+parse for files whose mtime matches the DB record.
    // isFileStale returns true when the file is absent from the DB or its
    // mtime has changed — only then do we pay the I/O + parse cost.
    if (!isFileStale(file)) continue;

    try {
      const content = readFileSync(file, 'utf-8');
      const result = await parseFile(file, content, language);
      results.push(result);
    } catch { /* skip unreadable */ }
  }

  // Cross-file TESTED_BY edges (heuristic, confidence 0.6)
  const testPattern = /[./](?:test|spec|vitest)\./;
  const nodesByFile = new Map<string, CodeNode[]>();
  for (const r of results) {
    nodesByFile.set(r.filePath, r.nodes);
  }

  for (const result of results) {
    if (!testPattern.test(result.filePath)) continue;
    const testedPath = result.filePath.replace(/\.(test|spec|vitest)\./, '.');
    const testedNodes = nodesByFile.get(testedPath);
    if (!testedNodes) continue;

    for (const testNode of result.nodes) {
      for (const testedNode of testedNodes) {
        result.edges.push({
          sourceId: testNode.symbolId, targetId: testedNode.symbolId,
          edgeType: 'TESTED_BY', weight: 0.6,
          metadata: { confidence: '0.6' },
        });
      }
    }
  }

  return results;
}
