// ───────────────────────────────────────────────────────────────
// MODULE: Structural Indexer
// ───────────────────────────────────────────────────────────────
// Structural code parser with dual-backend support:
// - Tree-sitter WASM (default): AST-accurate symbol extraction
// - Regex fallback (SPECKIT_PARSER=regex): lightweight, no WASM deps
// Extracts symbols and relationships from JS/TS/Python/Shell.

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, relative, resolve } from 'node:path';
import type {
  CodeNode, CodeEdge, ParseResult, SupportedLanguage,
  IndexerConfig, SymbolKind, DetectorProvenance, EdgeType,
} from './indexer-types.js';
import {
  DEFAULT_EDGE_WEIGHTS,
  generateSymbolId,
  generateContentHash,
  detectLanguage,
} from './indexer-types.js';
import { isFileStale } from './code-graph-db.js';
import { shouldIndexForCodeGraph } from '../../lib/utils/index-scope.js';
import { resolveCanonicalPath } from '../../lib/utils/canonical-path.js';
import { isSpeckitMetricsEnabled, speckitMetrics } from '../../skill_advisor/lib/metrics.js';
import { runPhases, type Phase } from './phase-runner.js';

interface IgnoreInstance {
  add(patterns: string | string[]): IgnoreInstance;
  ignores(pathname: string): boolean;
}

type IgnoreFactory = () => IgnoreInstance;

interface GitignoreContext {
  baseDir: string;
  matcher: IgnoreInstance;
}

interface FileFindResult {
  files: string[];
  excludedByDefault: number;
  excludedByGitignore: number;
}

type PathAlias = NonNullable<IndexerConfig['pathAliases']>[number];

export interface ModuleResolver {
  resolve(fromFile: string, specifier: string): string | undefined;
}

interface TsconfigCompilerOptions {
  baseUrl?: string;
  paths?: Record<string, string[] | string>;
}

interface TsconfigShape {
  extends?: string;
  compilerOptions?: TsconfigCompilerOptions;
}

interface WorkspaceCandidate {
  originalPath: string;
  canonicalPath: string;
}

export interface IndexFilesOptions {
  skipFreshFiles?: boolean;
  specificFiles?: string[];
}

export interface IndexFilesResult extends Array<ParseResult> {
  preParseSkippedCount: number;
}

const require = createRequire(import.meta.url);
let ignoreFactory: IgnoreFactory | null = null;
const MAX_GITIGNORE_BYTES = 1024 * 1024;
const FIND_FILES_MAX_DEPTH = 20;
const FIND_FILES_MAX_NODES = 50_000;
const parseResultCaptures = new WeakMap<ParseResult, RawCapture[]>();
const MODULE_RESOLUTION_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.d.ts'];
const MODULE_EXTENSION_FALLBACKS: Record<string, string[]> = {
  '.js': ['.ts', '.tsx', '.mts', '.cts', '.jsx', '.js'],
  '.jsx': ['.tsx', '.jsx', '.js'],
  '.mjs': ['.mts', '.mjs'],
  '.cjs': ['.cts', '.cjs'],
};

function resolveIgnoreFactory(ignoreModule: unknown): IgnoreFactory | null {
  let candidate = ignoreModule;
  for (let i = 0; i < 4; i++) {
    if (
      candidate
      && (typeof candidate === 'object' || typeof candidate === 'function')
      && 'default' in Object(candidate)
      && (candidate as { default?: unknown }).default !== candidate
    ) {
      candidate = (candidate as { default?: unknown }).default;
      continue;
    }
    if (typeof candidate === 'function') {
      return candidate as IgnoreFactory;
    }
    break;
  }
  return null;
}

interface ParserAdapter {
  parse(
    content: string,
    language: SupportedLanguage,
    edgeWeights?: Partial<Record<EdgeType, number>>,
  ): ParseResult;
}

export type ParserBackend = 'treesitter' | 'regex';

export function detectorProvenanceFromParserBackend(backend: ParserBackend): DetectorProvenance {
  return backend === 'treesitter' ? 'ast' : 'structured';
}

function buildEdgeMetadata(
  confidence: number,
  detectorProvenance: DetectorProvenance,
  evidenceClass: 'EXTRACTED' | 'INFERRED' | 'AMBIGUOUS',
): NonNullable<CodeEdge['metadata']> {
  const reason = detectorProvenance === 'heuristic'
    ? 'heuristic-name-match'
    : evidenceClass === 'AMBIGUOUS'
      ? 'ambiguous-test-association'
      : evidenceClass === 'INFERRED'
        ? 'inferred-structural-relation'
        : `${detectorProvenance}-structural-extraction`;
  const step = evidenceClass === 'EXTRACTED'
    ? 'extract'
    : evidenceClass === 'INFERRED'
      ? 'resolve'
      : 'link';

  return {
    confidence,
    detectorProvenance,
    evidenceClass,
    reason,
    step,
  };
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
  moduleSpecifier?: string;
  importKind?: 'value' | 'type';
  exportKind?: 'named' | 'star' | 'declaration';
}

export function rememberParseResultCaptures<T extends ParseResult>(result: T, captures: RawCapture[]): T {
  parseResultCaptures.set(result, captures);
  return result;
}

function getParseResultCaptures(result: ParseResult): RawCapture[] | undefined {
  return parseResultCaptures.get(result);
}

export function getRememberedParseResultCaptures(result: ParseResult): RawCapture[] {
  return getParseResultCaptures(result) ?? [];
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

function parseImportCaptureNames(
  clause: string,
  statementImportKind: RawCapture['importKind'],
): Array<{ name: string; importKind: RawCapture['importKind'] }> {
  const captures: Array<{ name: string; importKind: RawCapture['importKind'] }> = [];
  const defaultAndRemainderMatch = clause.match(/^(\w+)\s*,\s*(.+)$/);
  let remainder = clause.trim();

  if (defaultAndRemainderMatch) {
    captures.push({ name: defaultAndRemainderMatch[1], importKind: statementImportKind });
    remainder = defaultAndRemainderMatch[2].trim();
  }

  const namespaceMatch = remainder.match(/^\*\s+as\s+(\w+)$/);
  if (namespaceMatch) {
    captures.push({ name: namespaceMatch[1], importKind: statementImportKind });
    return captures;
  }

  const namedImportsMatch = remainder.match(/^\{([^}]*)\}$/);
  if (namedImportsMatch) {
    for (const rawSpecifier of namedImportsMatch[1].split(',')) {
      const trimmedSpecifier = rawSpecifier.trim();
      if (!trimmedSpecifier) {
        continue;
      }

      const importKind: RawCapture['importKind'] = statementImportKind === 'type'
        || /^type\b/.test(trimmedSpecifier)
        ? 'type'
        : 'value';
      const normalizedSpecifier = trimmedSpecifier.replace(/^type\s+/, '');
      const importedName = normalizedSpecifier.split(/\s+as\s+/)[0]?.trim();
      if (importedName) {
        captures.push({ name: importedName, importKind });
      }
    }
    return captures;
  }

  const defaultImportMatch = remainder.match(/^(\w+)$/);
  if (defaultImportMatch) {
    captures.push({ name: defaultImportMatch[1], importKind: statementImportKind });
  }

  return captures;
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
      ? line.match(/^import\s+(type\s+)?(.+?)\s+from\s+['"](.+?)['"]/)
      : null;
    if (importMatch) {
      const statementImportKind: RawCapture['importKind'] = importMatch[1] ? 'type' : 'value';
      const names = parseImportCaptureNames(importMatch[2], statementImportKind);
      const moduleSpecifier = importMatch[3];
      for (const entry of names) {
        if (entry.name) {
          captures.push({
            name: entry.name, kind: 'import', startLine: lineNum,
            endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
            endColumn: line.length,
            moduleSpecifier,
            importKind: entry.importKind,
          });
        }
      }
    }

    // Exports
    const exportStarMatch = braceDepth === 0 ? line.match(/^export\s+\*\s+from\s+['"](.+?)['"]/) : null;
    if (exportStarMatch) {
      captures.push({
        name: '*', kind: 'export', startLine: lineNum,
        endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
        endColumn: line.length,
        moduleSpecifier: exportStarMatch[1],
        exportKind: 'star',
      });
    }

    const exportMatch = braceDepth === 0 ? line.match(/^export\s+\{([^}]+)\}(?:\s+from\s+['"](.+?)['"])?/) : null;
    if (exportMatch) {
      const moduleSpecifier = exportMatch[2];
      const exportKind: RawCapture['exportKind'] = moduleSpecifier ? 'named' : 'declaration';
      const names = exportMatch[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim());
      for (const name of names) {
        if (name) {
          captures.push({
            name, kind: 'export', startLine: lineNum,
            endLine: findBraceBlockEndLine(lines, i), startColumn: 0,
            endColumn: line.length,
            ...(moduleSpecifier ? { moduleSpecifier } : {}),
            exportKind,
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
  parse(
    content: string,
    language: SupportedLanguage,
    edgeWeights?: Partial<Record<EdgeType, number>>,
  ): ParseResult {
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
      const detectorProvenance = detectorProvenanceFromParserBackend('regex');
      const edges = extractEdges(nodes, contentLines, captures, detectorProvenance, edgeWeights);

      return rememberParseResultCaptures({
        filePath: '',
        language,
        nodes,
        edges,
        detectorProvenance,
        contentHash,
        parseHealth: captures.length > 0 ? 'clean' : 'recovered',
        parseErrors: [],
        parseDurationMs: Date.now() - startTime,
      }, captures);
    } catch (err: unknown) {
      return {
        filePath: '',
        language,
        nodes: [],
        edges: [],
        detectorProvenance: detectorProvenanceFromParserBackend('regex'),
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

export function getRequestedParserBackend(): ParserBackend {
  return (process.env.SPECKIT_PARSER ?? 'treesitter') === 'regex' ? 'regex' : 'treesitter';
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

  const attachedResult = { ...result, filePath, nodes, edges };
  const captures = getParseResultCaptures(result);
  if (captures) {
    parseResultCaptures.set(attachedResult, captures);
  }
  return attachedResult;
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

  const seenSymbolIds = new Set<string>([moduleNode.symbolId]);
  const symbolNodes = captures.flatMap(c => {
    const fqName = getCaptureFqName(c);
    const symbolId = generateSymbolId(filePath, fqName, c.kind);
    if (seenSymbolIds.has(symbolId)) return [];
    seenSymbolIds.add(symbolId);
    const rangeText = lines.slice(c.startLine - 1, c.endLine).join('\n');
    return [{
      symbolId,
      filePath,
      fqName,
      kind: c.kind,
      name: c.name,
      startLine: c.startLine,
      endLine: c.endLine,
      startColumn: c.startColumn,
      endColumn: c.endColumn,
      language,
      signature: c.signature,
      contentHash: generateContentHash(rangeText),
    }];
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
  baseDetectorProvenance: DetectorProvenance = 'structured',
  edgeWeights: Partial<Record<EdgeType, number>> = {},
): CodeEdge[] {
  const edges: CodeEdge[] = [];
  const resolvedWeights: Record<EdgeType, number> = {
    ...DEFAULT_EDGE_WEIGHTS,
    ...edgeWeights,
  };
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
        edgeType: 'CONTAINS', weight: resolvedWeights.CONTAINS,
        metadata: buildEdgeMetadata(resolvedWeights.CONTAINS, baseDetectorProvenance, 'EXTRACTED'),
      });
    }
  }

  // IMPORTS (confidence 1.0)
  const imports = nodes.filter(n => n.kind === 'import');
  for (const imp of imports) {
    const capture = captureByFqName.get(imp.fqName);
    if (capture?.moduleSpecifier) {
      continue;
    }
    const target = preferredKinds(imp.name, ['function', 'class', 'interface', 'type_alias', 'enum', 'variable', 'module'], imp.symbolId);
    if (target && target.symbolId !== imp.symbolId) {
      edges.push({
        sourceId: imp.symbolId, targetId: target.symbolId,
        edgeType: 'IMPORTS', weight: resolvedWeights.IMPORTS,
        metadata: buildEdgeMetadata(resolvedWeights.IMPORTS, baseDetectorProvenance, 'EXTRACTED'),
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
        edgeType: 'EXPORTS', weight: resolvedWeights.EXPORTS,
        metadata: buildEdgeMetadata(resolvedWeights.EXPORTS, baseDetectorProvenance, 'EXTRACTED'),
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
          edgeType: 'EXTENDS', weight: resolvedWeights.EXTENDS,
          metadata: buildEdgeMetadata(resolvedWeights.EXTENDS, baseDetectorProvenance, 'EXTRACTED'),
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
            edgeType: 'IMPLEMENTS', weight: resolvedWeights.IMPLEMENTS,
            metadata: buildEdgeMetadata(resolvedWeights.IMPLEMENTS, baseDetectorProvenance, 'EXTRACTED'),
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
            edgeType: 'CALLS', weight: resolvedWeights.CALLS,
            metadata: buildEdgeMetadata(resolvedWeights.CALLS, 'heuristic', 'INFERRED'),
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
          weight: resolvedWeights.DECORATES,
          metadata: buildEdgeMetadata(resolvedWeights.DECORATES, baseDetectorProvenance, 'EXTRACTED'),
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
          weight: resolvedWeights.OVERRIDES,
          metadata: buildEdgeMetadata(resolvedWeights.OVERRIDES, baseDetectorProvenance, 'INFERRED'),
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
          weight: resolvedWeights.TYPE_OF,
          metadata: buildEdgeMetadata(resolvedWeights.TYPE_OF, baseDetectorProvenance, 'EXTRACTED'),
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
  edgeWeights?: Partial<Record<EdgeType, number>>,
): Promise<ParseResult> {
  const startTime = Date.now();
  const contentHash = generateContentHash(content);

  try {
    const parser = await getParser();
    const parserResult = parser.parse(content, language, edgeWeights);
    return attachFilePath(parserResult, filePath);
  } catch (err: unknown) {
    return {
      filePath, language,
      nodes: [], edges: [], contentHash,
      detectorProvenance: detectorProvenanceFromParserBackend(getRequestedParserBackend()),
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
  if (!shouldIndexForCodeGraph(fullPath)) {
    return true;
  }
  const relativePath = normalizeGlobPath(relative(rootDir, fullPath));
  const candidatePath = isDirectory ? `${relativePath}/` : relativePath;
  return excludePatterns.some(pattern => pattern.test(candidatePath));
}

function loadIgnoreFactory(): IgnoreFactory {
  if (ignoreFactory) {
    return ignoreFactory;
  }

  try {
    ignoreFactory = resolveIgnoreFactory(require('ignore'));
  } catch {
    const eslintPackagePath = require.resolve('eslint/package.json');
    ignoreFactory = resolveIgnoreFactory(require(join(dirname(eslintPackagePath), 'node_modules/ignore/index.js')));
  }

  if (!ignoreFactory) {
    throw new Error('ignore package did not export a factory function');
  }
  return ignoreFactory;
}

function loadGitignore(
  directoryPath: string,
  gitignoreCache: Map<string, IgnoreInstance | null>,
): IgnoreInstance | null {
  if (gitignoreCache.has(directoryPath)) {
    return gitignoreCache.get(directoryPath) ?? null;
  }

  try {
    const gitignorePath = resolve(directoryPath, '.gitignore');
    const stats = statSync(gitignorePath);
    if (stats.size > MAX_GITIGNORE_BYTES) {
      console.warn(
        `[structural-indexer] Skipping oversized .gitignore (${stats.size} bytes > ${MAX_GITIGNORE_BYTES} bytes): ${gitignorePath}`,
      );
      gitignoreCache.set(directoryPath, null);
      return null;
    }
    const content = readFileSync(gitignorePath, 'utf-8');
    const factory = loadIgnoreFactory();
    const matcher = factory();
    matcher.add(content.split(/\r?\n/));
    gitignoreCache.set(directoryPath, matcher);
    return matcher;
  } catch {
    gitignoreCache.set(directoryPath, null);
    return null;
  }
}

function isGitignored(
  fullPath: string,
  isDirectory: boolean,
  contexts: GitignoreContext[],
): boolean {
  return contexts.some(({ baseDir, matcher }) => {
    const relativePath = normalizeGlobPath(relative(baseDir, fullPath));
    if (relativePath.startsWith('../') || relativePath === '..' || relativePath === '') {
      return false;
    }
    const candidatePath = isDirectory ? `${relativePath}/` : relativePath;
    return matcher.ignores(candidatePath);
  });
}

/** Recursive file finder matching extension from glob pattern */
function findFiles(rootDir: string, pattern: string, excludeGlobs: string[], maxSize: number): FileFindResult {
  const extMatch = pattern.match(/\*\.(\w+)$/);
  const targetExt = extMatch ? '.' + extMatch[1] : null;
  const results: string[] = [];
  const excludePatterns = excludeGlobs.map(globToRegExp);
  const gitignoreCache = new Map<string, IgnoreInstance | null>();
  let excludedByDefault = 0;
  let excludedByGitignore = 0;
  let visitedNodes = 0;
  let abortedByNodeLimit = false;

  function walk(currentDir: string, inheritedGitignores: GitignoreContext[], depth: number): void {
    if (abortedByNodeLimit) {
      return;
    }
    if (depth >= FIND_FILES_MAX_DEPTH) {
      console.warn(`[structural-indexer] Aborting descent at maxDepth=${FIND_FILES_MAX_DEPTH}: ${currentDir}`);
      return;
    }

    const localGitignore = loadGitignore(currentDir, gitignoreCache);
    const activeGitignores = localGitignore
      ? [...inheritedGitignores, { baseDir: currentDir, matcher: localGitignore }]
      : inheritedGitignores;
    let entries;
    try {
      entries = readdirSync(currentDir, { withFileTypes: true });
    } catch { return; }

    for (const entry of entries) {
      visitedNodes += 1;
      if (visitedNodes > FIND_FILES_MAX_NODES) {
        console.warn(`[structural-indexer] Aborting walk after ${FIND_FILES_MAX_NODES} filesystem nodes at ${currentDir}`);
        abortedByNodeLimit = true;
        return;
      }
      const fullPath = resolve(currentDir, entry.name);
      if (shouldExcludePath(rootDir, fullPath, excludePatterns, entry.isDirectory())) {
        excludedByDefault++;
        continue;
      }
      if (isGitignored(fullPath, entry.isDirectory(), activeGitignores)) {
        excludedByGitignore++;
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath, activeGitignores, depth + 1);
      } else if (entry.isFile()) {
        if (targetExt && !entry.name.endsWith(targetExt)) continue;
        try {
          const stat = statSync(fullPath);
          if (stat.size <= maxSize) {
            results.push(normalizeFilesystemPath(fullPath));
          } else {
            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
          }
        } catch { /* skip */ }
      }
    }
  }

  walk(rootDir, [], 0);
  return { files: results, excludedByDefault, excludedByGitignore };
}

function collectSpecificFiles(rootDir: string, specificFiles: string[], maxSize: number): string[] {
  const dedupedFiles: string[] = [];
  const seenFiles = new Set<string>();
  const canonicalWorkspaceRoot = resolveCanonicalPath(resolve(rootDir));

  for (const filePath of specificFiles) {
    const absolutePath = normalizeFilesystemPath(resolve(filePath));
    const workspaceCandidate = resolveWorkspaceCandidateWithinRoot(absolutePath, canonicalWorkspaceRoot);
    if (!workspaceCandidate || seenFiles.has(workspaceCandidate.canonicalPath)) {
      continue;
    }

    const relativePath = normalizeGlobPath(relative(rootDir, workspaceCandidate.originalPath));
    if (relativePath === '..' || relativePath.startsWith('../')) {
      continue;
    }
    if (!shouldIndexForCodeGraph(workspaceCandidate.canonicalPath)) {
      continue;
    }

    try {
      const stat = statSync(workspaceCandidate.originalPath);
      if (!stat.isFile()) {
        continue;
      }
      if (stat.size > maxSize) {
        console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${workspaceCandidate.originalPath}`);
        continue;
      }
    } catch {
      continue;
    }

    seenFiles.add(workspaceCandidate.canonicalPath);
    dedupedFiles.push(workspaceCandidate.originalPath);
  }

  return dedupedFiles;
}

function clonePathAlias(alias: PathAlias): PathAlias {
  return {
    prefix: alias.prefix,
    suffixWildcard: alias.suffixWildcard,
    targets: [...alias.targets],
  };
}

function getPathAliasKey(prefix: string, suffixWildcard: boolean): string {
  return `${prefix}::${suffixWildcard ? 'wildcard' : 'exact'}`;
}

function stripJsonComments(text: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      result += char;
      continue;
    }

    if (char === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') {
        i++;
      }
      if (i < text.length) {
        result += '\n';
      }
      continue;
    }

    if (char === '/' && next === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
        i++;
      }
      i += 1;
      continue;
    }

    result += char;
  }

  return result.replace(/,\s*([}\]])/g, '$1');
}

function normalizeFilesystemPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function isWithinWorkspaceRoot(canonicalWorkspaceRoot: string, canonicalCandidatePath: string): boolean {
  const workspacePrefix = canonicalWorkspaceRoot.endsWith('/')
    ? canonicalWorkspaceRoot
    : `${canonicalWorkspaceRoot}/`;
  return canonicalCandidatePath === canonicalWorkspaceRoot
    || canonicalCandidatePath.startsWith(workspacePrefix);
}

function resolveWorkspaceCandidateWithinRoot(
  candidatePath: string,
  canonicalWorkspaceRoot: string,
): WorkspaceCandidate | undefined {
  try {
    const originalPath = normalizeFilesystemPath(resolve(candidatePath));
    const canonicalPath = normalizeFilesystemPath(realpathSync(candidatePath));
    return isWithinWorkspaceRoot(canonicalWorkspaceRoot, canonicalPath)
      ? { originalPath, canonicalPath }
      : undefined;
  } catch {
    return undefined;
  }
}

function parseTsconfigFile(tsconfigPath: string, canonicalWorkspaceRoot: string): TsconfigShape {
  const workspaceTsconfigPath = resolveWorkspaceCandidateWithinRoot(tsconfigPath, canonicalWorkspaceRoot);
  if (!workspaceTsconfigPath) {
    throw new Error(`tsconfig path resolved outside workspace root: ${tsconfigPath}`);
  }

  const rawText = readFileSync(workspaceTsconfigPath.originalPath, 'utf-8');
  return JSON.parse(stripJsonComments(rawText)) as TsconfigShape;
}

function resolveTsconfigExtendsPath(
  tsconfigPath: string,
  extendsValue: string,
  canonicalWorkspaceRoot: string,
): string | undefined {
  let resolvedExtendsPath: string;
  if (extendsValue.startsWith('.') || extendsValue.startsWith('/')) {
    const normalized = extendsValue.endsWith('.json') ? extendsValue : `${extendsValue}.json`;
    resolvedExtendsPath = resolve(dirname(tsconfigPath), normalized);
    return resolveWorkspaceCandidateWithinRoot(resolvedExtendsPath, canonicalWorkspaceRoot)?.originalPath;
  }

  try {
    resolvedExtendsPath = require.resolve(extendsValue, { paths: [dirname(tsconfigPath)] });
  } catch {
    const normalized = extendsValue.endsWith('.json') ? extendsValue : `${extendsValue}.json`;
    resolvedExtendsPath = require.resolve(normalized, { paths: [dirname(tsconfigPath)] });
  }

  return resolveWorkspaceCandidateWithinRoot(resolvedExtendsPath, canonicalWorkspaceRoot)?.originalPath;
}

function normalizePathAliases(
  paths: TsconfigCompilerOptions['paths'],
  targetBaseDir: string,
): Map<string, PathAlias> {
  const normalized = new Map<string, PathAlias>();
  if (!paths) {
    return normalized;
  }

  for (const [pattern, rawTargets] of Object.entries(paths)) {
    const targets = Array.isArray(rawTargets) ? rawTargets : [rawTargets];
    const suffixWildcard = pattern.endsWith('*');
    const prefix = suffixWildcard ? pattern.slice(0, -1) : pattern;
    normalized.set(pattern, {
      prefix,
      suffixWildcard,
      targets: targets.map((target) => resolve(targetBaseDir, target)),
    });
  }

  return normalized;
}

function loadTsconfigSettings(
  tsconfigPath: string,
  canonicalWorkspaceRoot: string,
  depth = 0,
  visited = new Set<string>(),
): { tsconfigPath: string; baseUrl: string; pathAliases: PathAlias[] } {
  const workspaceTsconfigPath = resolveWorkspaceCandidateWithinRoot(tsconfigPath, canonicalWorkspaceRoot);
  if (!workspaceTsconfigPath) {
    throw new Error(`tsconfig path resolved outside workspace root: ${tsconfigPath}`);
  }

  const parsed = parseTsconfigFile(workspaceTsconfigPath.originalPath, canonicalWorkspaceRoot);
  visited.add(workspaceTsconfigPath.canonicalPath);

  const inherited = typeof parsed.extends === 'string' && parsed.extends.trim().length > 0 && depth < 16
    ? (
      // If an extends target escapes the workspace root, stop walking and keep
      // the local parse instead of crashing resolver setup.
        (() => {
          const extendedPath = resolveTsconfigExtendsPath(
            workspaceTsconfigPath.originalPath,
            parsed.extends.trim(),
            canonicalWorkspaceRoot,
          );
          if (!extendedPath || visited.has(extendedPath)) {
            return null;
          }
          return extendedPath
            ? loadTsconfigSettings(extendedPath, canonicalWorkspaceRoot, depth + 1, visited)
            : null;
        })()
      )
    : null;
  const compilerOptions = parsed.compilerOptions ?? {};
  const localBaseUrl = typeof compilerOptions.baseUrl === 'string'
    ? resolve(dirname(workspaceTsconfigPath.originalPath), compilerOptions.baseUrl)
    : undefined;
  const aliasBaseDir = localBaseUrl ?? dirname(workspaceTsconfigPath.originalPath);
  const mergedAliases = new Map<string, PathAlias>();

  for (const alias of inherited?.pathAliases ?? []) {
    mergedAliases.set(getPathAliasKey(alias.prefix, alias.suffixWildcard), clonePathAlias(alias));
  }
  for (const [pattern, alias] of normalizePathAliases(compilerOptions.paths, aliasBaseDir)) {
    const suffixWildcard = pattern.endsWith('*');
    const prefix = suffixWildcard ? pattern.slice(0, -1) : pattern;
    mergedAliases.set(getPathAliasKey(prefix, suffixWildcard), alias);
  }

  return {
    tsconfigPath: workspaceTsconfigPath.originalPath,
    baseUrl: localBaseUrl ?? inherited?.baseUrl ?? dirname(workspaceTsconfigPath.originalPath),
    pathAliases: [...mergedAliases.values()],
  };
}

function buildModuleResolutionCandidates(basePath: string): string[] {
  const candidates = new Set<string>([basePath]);
  const extension = extname(basePath);

  if (extension.length === 0) {
    for (const candidateExtension of MODULE_RESOLUTION_EXTENSIONS) {
      candidates.add(`${basePath}${candidateExtension}`);
      candidates.add(resolve(basePath, `index${candidateExtension}`));
    }
    return [...candidates];
  }

  for (const fallbackExtension of MODULE_EXTENSION_FALLBACKS[extension] ?? []) {
    candidates.add(`${basePath.slice(0, -extension.length)}${fallbackExtension}`);
  }

  return [...candidates];
}

function resolveModuleFile(basePath: string, canonicalWorkspaceRoot: string): string | undefined {
  for (const candidate of buildModuleResolutionCandidates(basePath)) {
    const workspaceCandidate = resolveWorkspaceCandidateWithinRoot(candidate, canonicalWorkspaceRoot);
    if (!workspaceCandidate) {
      continue;
    }

    try {
      const stats = statSync(workspaceCandidate.originalPath);
      if (stats.isFile()) {
        return workspaceCandidate.originalPath;
      }
    } catch {
      continue;
    }
  }
  return undefined;
}

function createModuleResolver(
  baseUrl: string,
  pathAliases: PathAlias[],
  workspaceRoot = baseUrl,
): ModuleResolver {
  const normalizedBaseUrl = resolve(baseUrl);
  const canonicalWorkspaceRoot = resolveCanonicalPath(resolve(workspaceRoot));
  const normalizedAliases = pathAliases.map((alias) => ({
    ...alias,
    targets: alias.targets.map((target) => resolve(normalizedBaseUrl, target)),
  }));

  return {
    resolve(fromFile: string, specifier: string): string | undefined {
      if (specifier.startsWith('.') || specifier.startsWith('/')) {
        return resolveModuleFile(resolve(dirname(fromFile), specifier), canonicalWorkspaceRoot);
      }

      for (const alias of normalizedAliases) {
        const aliasRemainder = alias.suffixWildcard
          ? (specifier.startsWith(alias.prefix) ? specifier.slice(alias.prefix.length) : null)
          : (specifier === alias.prefix ? '' : null);
        if (aliasRemainder === null) {
          continue;
        }

        for (const target of alias.targets) {
          const candidate = alias.suffixWildcard
            ? target.replace(/\*$/, aliasRemainder)
            : target;
          const resolvedTarget = resolveModuleFile(candidate, canonicalWorkspaceRoot);
          if (resolvedTarget) {
            return resolvedTarget;
          }
        }
      }

      return undefined;
    },
  };
}

function getResolvedImportEdgeWeight(
  importKind: RawCapture['importKind'] | undefined,
  importWeight: number,
): number {
  if (importKind === 'type') {
    return Math.min(importWeight, 0.5);
  }

  return importWeight;
}

function findNearestTsconfig(rootDir: string): string | undefined {
  const canonicalWorkspaceRoot = resolveCanonicalPath(resolve(rootDir));
  let currentDir = normalizeFilesystemPath(resolve(rootDir));

  while (true) {
    const candidate = resolve(currentDir, 'tsconfig.json');
    const workspaceCandidate = resolveWorkspaceCandidateWithinRoot(candidate, canonicalWorkspaceRoot);
    if (workspaceCandidate) {
      try {
        const stats = statSync(workspaceCandidate.originalPath);
        if (stats.isFile()) {
          return workspaceCandidate.originalPath;
        }
      } catch {
        // Keep walking upward.
      }
    }

    const parentDir = dirname(currentDir);
    const canonicalParentDir = normalizeFilesystemPath(resolveCanonicalPath(parentDir));
    if (parentDir === currentDir || !isWithinWorkspaceRoot(canonicalWorkspaceRoot, canonicalParentDir)) {
      return undefined;
    }
    currentDir = parentDir;
  }
}

function loadTsconfigResolverFromPath(tsconfigPath: string, workspaceRoot = dirname(tsconfigPath)): ModuleResolver {
  const canonicalWorkspaceRoot = resolveCanonicalPath(resolve(workspaceRoot));
  const { baseUrl, pathAliases } = loadTsconfigSettings(tsconfigPath, canonicalWorkspaceRoot);
  return createModuleResolver(baseUrl, pathAliases, workspaceRoot);
}

export function loadTsconfigResolver(rootDir: string): ModuleResolver {
  try {
    const tsconfigPath = findNearestTsconfig(rootDir);
    if (!tsconfigPath) {
      return createModuleResolver(rootDir, [], rootDir);
    }
    return loadTsconfigResolverFromPath(tsconfigPath, rootDir);
  } catch (error: unknown) {
    console.warn(
      `[structural-indexer] Failed to load tsconfig resolver from ${rootDir}: ${error instanceof Error ? error.message : String(error)}`,
    );
    return createModuleResolver(rootDir, [], rootDir);
  }
}

function getConfiguredModuleResolver(config: IndexerConfig): ModuleResolver {
  if (config.tsconfigPath && !config.baseUrl && !config.pathAliases) {
    try {
      return loadTsconfigResolverFromPath(resolve(config.rootDir, config.tsconfigPath), config.rootDir);
    } catch (error: unknown) {
      console.warn(
        `[structural-indexer] Failed to load configured tsconfig resolver from ${config.rootDir}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return createModuleResolver(config.rootDir, [], config.rootDir);
    }
  }

  if (config.baseUrl || config.pathAliases) {
    return createModuleResolver(
      config.baseUrl ? resolve(config.rootDir, config.baseUrl) : config.rootDir,
      config.pathAliases ?? [],
      config.rootDir,
    );
  }

  return loadTsconfigResolver(config.rootDir);
}

export function finalizeIndexResults(
  results: ParseResult[],
  moduleResolver: ModuleResolver = createModuleResolver('.', []),
  edgeWeights: Partial<Record<EdgeType, number>> = {},
): ParseResult[] {
  const resolvedWeights: Record<EdgeType, number> = {
    ...DEFAULT_EDGE_WEIGHTS,
    ...edgeWeights,
  };
  const globalSeenIds = new Set<string>();
  let droppedDuplicateNodes = 0;
  let droppedReconciledEdges = 0;
  for (const result of results) {
    const dedupedNodes: CodeNode[] = [];
    for (const node of result.nodes) {
      if (globalSeenIds.has(node.symbolId)) {
        droppedDuplicateNodes++;
        continue;
      }
      globalSeenIds.add(node.symbolId);
      dedupedNodes.push(node);
    }
    result.nodes = dedupedNodes;

    const retainedSourceIds = new Set(dedupedNodes.map((node) => node.symbolId));
    const reconciledEdges = result.edges.filter((edge) => retainedSourceIds.has(edge.sourceId));
    droppedReconciledEdges += result.edges.length - reconciledEdges.length;
    result.edges = reconciledEdges;
  }

  if (droppedDuplicateNodes > 0) {
    console.info(`[structural-indexer] dropped ${droppedDuplicateNodes} cross-file duplicate symbol nodes`);
  }
  if (droppedReconciledEdges > 0) {
    console.info(`[structural-indexer] dropped ${droppedReconciledEdges} edge(s) whose source nodes were removed by dedup`);
  }

  const nodesByFile = new Map<string, CodeNode[]>();
  const nodesByFileAndName = new Map<string, Map<string, CodeNode[]>>();
  const capturesByFile = new Map<string, RawCapture[]>();
  for (const result of results) {
    nodesByFile.set(result.filePath, result.nodes);
    capturesByFile.set(result.filePath, getParseResultCaptures(result) ?? []);
    const nodesByName = new Map<string, CodeNode[]>();
    for (const node of result.nodes) {
      const bucket = nodesByName.get(node.name) ?? [];
      bucket.push(node);
      nodesByName.set(node.name, bucket);
    }
    nodesByFileAndName.set(result.filePath, nodesByName);
  }

  const preferredKinds = (
    filePath: string,
    name: string,
    excludeId?: string,
  ): CodeNode | undefined => {
    const candidates = nodesByFileAndName.get(filePath)?.get(name) ?? [];
    for (const kind of ['function', 'class', 'interface', 'type_alias', 'enum', 'variable', 'module'] satisfies SymbolKind[]) {
      const match = candidates.find((candidate) => candidate.kind === kind && candidate.symbolId !== excludeId);
      if (match) {
        return match;
      }
    }
    return candidates.find((candidate) => candidate.symbolId !== excludeId);
  };

  const resolveExportedNode = (
    filePath: string,
    name: string,
    visited = new Set<string>(),
  ): CodeNode | undefined => {
    const visitKey = `${filePath}::${name}`;
    if (visited.has(visitKey)) {
      return undefined;
    }
    visited.add(visitKey);

    const directNode = preferredKinds(filePath, name);
    if (directNode && directNode.kind !== 'export' && directNode.kind !== 'import') {
      return directNode;
    }

    const exportCaptures = capturesByFile.get(filePath) ?? [];
    for (const capture of exportCaptures) {
      if (capture.kind !== 'export' || !capture.moduleSpecifier) {
        continue;
      }
      if (capture.exportKind === 'named' && capture.name !== name) {
        continue;
      }

      const resolvedTargetFile = moduleResolver.resolve(filePath, capture.moduleSpecifier);
      if (!resolvedTargetFile) {
        continue;
      }

      const resolvedTarget = resolveExportedNode(resolvedTargetFile, name, visited);
      if (resolvedTarget) {
        return resolvedTarget;
      }
    }

    return undefined;
  };

  for (const result of results) {
    const captures = capturesByFile.get(result.filePath) ?? [];
    if (captures.length === 0) {
      continue;
    }

    const retainedSourceIds = new Set(result.nodes.map((node) => node.symbolId));
    const existingEdgeKeys = new Set(result.edges.map((edge) => `${edge.sourceId}|${edge.targetId}|${edge.edgeType}`));
    for (const capture of captures) {
      if (capture.kind !== 'import' || !capture.moduleSpecifier) {
        continue;
      }

      const sourceId = generateSymbolId(result.filePath, getCaptureFqName(capture), capture.kind);
      if (!retainedSourceIds.has(sourceId)) {
        continue;
      }

      const resolvedTargetFile = moduleResolver.resolve(result.filePath, capture.moduleSpecifier);
      if (!resolvedTargetFile) {
        continue;
      }

      const targetNode = resolveExportedNode(resolvedTargetFile, capture.name);
      if (!targetNode) {
        continue;
      }

      const edgeKey = `${sourceId}|${targetNode.symbolId}|IMPORTS`;
      if (existingEdgeKeys.has(edgeKey)) {
        continue;
      }

      result.edges.push({
        sourceId,
        targetId: targetNode.symbolId,
        edgeType: 'IMPORTS',
        weight: getResolvedImportEdgeWeight(capture.importKind, resolvedWeights.IMPORTS),
        metadata: {
          ...buildEdgeMetadata(
            getResolvedImportEdgeWeight(capture.importKind, resolvedWeights.IMPORTS),
            result.detectorProvenance,
            'EXTRACTED',
          ),
          moduleSpecifier: capture.moduleSpecifier,
          ...(capture.importKind ? { importKind: capture.importKind } : {}),
          resolvedFilePath: resolvedTargetFile,
          ...(targetNode.filePath !== resolvedTargetFile ? { resolvedSymbolFilePath: targetNode.filePath } : {}),
        },
      });
      existingEdgeKeys.add(edgeKey);
    }
  }

  // Cross-file TESTED_BY edges (heuristic, confidence 0.6)
  const testPattern = /[./](?:test|spec|vitest)\./;
  for (const result of results) {
    if (!testPattern.test(result.filePath)) continue;
    const testedPath = result.filePath.replace(/\.(test|spec|vitest)\./, '.');
    const testedNodes = nodesByFile.get(testedPath);
    if (!testedNodes) continue;

    for (const testNode of result.nodes) {
      for (const testedNode of testedNodes) {
        result.edges.push({
          sourceId: testNode.symbolId, targetId: testedNode.symbolId,
          edgeType: 'TESTED_BY', weight: resolvedWeights.TESTED_BY,
          metadata: buildEdgeMetadata(resolvedWeights.TESTED_BY, 'heuristic', 'AMBIGUOUS'),
        });
      }
    }
  }

  return results;
}

/**
 * Phases that compose the scan flow.
 *
 * The flow is decomposed into typed phases declared with explicit
 * `inputs[]` / `output` so the phase-runner can topologically sort,
 * reject cycles/duplicates/missing-deps, and pass each phase ONLY
 * the outputs of phases it lists in `inputs` (R-002-1, R-002-2).
 *
 * The decomposition mirrors the existing inline flow — it does not
 * change behavior, ordering, or persistence semantics:
 *   1. find-candidates  → discovers candidate files
 *   2. parse-candidates → reads + parses each candidate
 *   3. finalize         → cross-file dedup + heuristic edges
 *   4. emit-metrics     → speckit metrics histograms/counters
 */
type FindCandidatesOutput = { candidateFiles: string[] };
type ParseCandidatesOutput = { results: ParseResult[]; preParseSkippedCount: number };
type FinalizeOutput = { finalizedResults: ParseResult[]; preParseSkippedCount: number };

function buildIndexPhases(
  config: IndexerConfig,
  options: IndexFilesOptions,
  speckitScanStart: number,
  scanOutcomeRef: { value: 'success' | 'error' },
): Phase[] {
  const skipFreshFiles = options.skipFreshFiles ?? true;
  const moduleResolver = getConfiguredModuleResolver(config);

  const findCandidates: Phase<Record<string, unknown>, FindCandidatesOutput> = {
    name: 'find-candidates',
    inputs: [],
    run() {
      if (options.specificFiles && options.specificFiles.length > 0) {
        const candidateFiles = collectSpecificFiles(
          config.rootDir,
          options.specificFiles,
          config.maxFileSizeBytes,
        );
        console.info(`[structural-indexer] refreshed ${candidateFiles.length} specific file(s)`);
        return { candidateFiles };
      }

      const allFiles = new Set<string>();
      let excludedByDefault = 0;
      let excludedByGitignore = 0;

      for (const pattern of config.includeGlobs) {
        const found = findFiles(config.rootDir, pattern, config.excludeGlobs, config.maxFileSizeBytes);
        excludedByDefault += found.excludedByDefault;
        excludedByGitignore += found.excludedByGitignore;
        found.files.forEach(f => allFiles.add(f));
      }

      console.info(`[structural-indexer] scanned ${allFiles.size} files (excluded: gitignored=${excludedByGitignore}, default=${excludedByDefault})`);
      return { candidateFiles: [...allFiles] };
    },
  };

  const parseCandidates: Phase<{ 'find-candidates': FindCandidatesOutput }, ParseCandidatesOutput> = {
    name: 'parse-candidates',
    inputs: ['find-candidates'],
    async run(deps) {
      const { candidateFiles } = deps['find-candidates'];
      const results: ParseResult[] = [];
      let preParseSkippedCount = 0;

      for (const file of candidateFiles) {
        const language = detectLanguage(file);
        if (!language || !config.languages.includes(language)) continue;

        // P1 perf: skip read+parse for files whose mtime matches the DB record.
        // isFileStale returns true when the file is absent from the DB or its
        // mtime has changed — only then do we pay the I/O + parse cost.
        if (skipFreshFiles && !isFileStale(file)) {
          preParseSkippedCount++;
          continue;
        }

        try {
          const content = readFileSync(file, 'utf-8');
          const result = await parseFile(file, content, language, config.edgeWeights);
          results.push(result);
        } catch { /* skip unreadable */ }
      }

      return { results, preParseSkippedCount };
    },
  };

  const finalize: Phase<{ 'parse-candidates': ParseCandidatesOutput }, FinalizeOutput> = {
    name: 'finalize',
    inputs: ['parse-candidates'],
    run(deps) {
      const { results, preParseSkippedCount } = deps['parse-candidates'];
      const finalizedResults = finalizeIndexResults(results, moduleResolver, config.edgeWeights);
      return { finalizedResults, preParseSkippedCount };
    },
  };

  const emitMetrics: Phase<{ finalize: FinalizeOutput }, FinalizeOutput> = {
    name: 'emit-metrics',
    inputs: ['finalize'],
    run(deps) {
      const finalize = deps.finalize;
      if (isSpeckitMetricsEnabled()) {
        speckitMetrics.recordHistogram(
          'spec_kit.graph.scan_duration_ms',
          Date.now() - speckitScanStart,
          { outcome: scanOutcomeRef.value },
        );
        const runtimeLabel = process.env.SPECKIT_RUNTIME ?? 'unknown';
        for (const r of finalize.finalizedResults) {
          for (const edge of r.edges) {
            speckitMetrics.incrementCounter(
              'spec_kit.graph.edge_detection_total',
              { edge_type: edge.edgeType, runtime: runtimeLabel },
            );
          }
        }
      }
      return finalize;
    },
  };

  return [findCandidates, parseCandidates, finalize, emitMetrics];
}

/** Index all matching files in the workspace */
export async function indexFiles(config: IndexerConfig, options: IndexFilesOptions = {}): Promise<IndexFilesResult> {
  const speckitScanStart = isSpeckitMetricsEnabled() ? Date.now() : 0;
  const scanOutcomeRef: { value: 'success' | 'error' } = { value: 'success' };

  const phases = buildIndexPhases(config, options, speckitScanStart, scanOutcomeRef);

  // R-007-P2-2: Wrap runPhases in try/catch/finally so error outcomes still
  // emit the spec_kit.graph.scan_duration_ms histogram. The emit-metrics
  // phase itself only fires on the happy path (since a prior phase failure
  // short-circuits the runner); the catch block backfills the missing
  // histogram entry with `outcome: 'error'` for operator visibility.
  try {
    const outputs = await runPhases(phases);
    const emitOutput = outputs['emit-metrics'] as FinalizeOutput;

    // Preserve the array-with-preParseSkippedCount shape exported by the
    // historical inline flow so existing callers (handlers/scan.ts,
    // ensure-ready.ts) keep working unchanged (R-002-3 backward compat).
    const finalizedResults = emitOutput.finalizedResults as IndexFilesResult;
    finalizedResults.preParseSkippedCount = emitOutput.preParseSkippedCount;
    return finalizedResults;
  } catch (error: unknown) {
    scanOutcomeRef.value = 'error';
    if (isSpeckitMetricsEnabled()) {
      try {
        speckitMetrics.recordHistogram(
          'spec_kit.graph.scan_duration_ms',
          Date.now() - speckitScanStart,
          { outcome: 'error' },
        );
      } catch (_metricErr: unknown) {
        // Best-effort: never let metric emission failures mask the original
        // Indexer error.
      }
    }
    throw error;
  }
}
