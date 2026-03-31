// ───────────────────────────────────────────────────────────────
// MODULE: Tree-Sitter WASM Parser
// ───────────────────────────────────────────────────────────────
// Implements ParserAdapter using web-tree-sitter with prebuilt
// WASM grammars. Cursor-based AST walk extracts RawCapture[]
// compatible with capturesToNodes()/extractEdges() from
// structural-indexer.ts.

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  CodeNode, CodeEdge, ParseResult, SupportedLanguage, SymbolKind,
} from './indexer-types.js';
import { generateContentHash, generateSymbolId } from './indexer-types.js';
import { extractEdges } from './structural-indexer.js';

// ── Types ──────────────────────────────────────────────────────

/** Same RawCapture shape used by the regex parser */
interface RawCapture {
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

/** ParserAdapter interface — mirrors structural-indexer.ts:16-18 */
interface ParserAdapter {
  parse(content: string, language: SupportedLanguage): ParseResult;
}

// ── Lazy initialization state ──────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ParserClass: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let parserInstance: any = null;
let initPromise: Promise<void> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const grammarCache = new Map<SupportedLanguage, any>();

const __dirname = dirname(fileURLToPath(import.meta.url));

function getGrammarPath(language: SupportedLanguage): string {
  const nameMap: Record<SupportedLanguage, string> = {
    javascript: 'tree-sitter-javascript',
    typescript: 'tree-sitter-typescript',
    python: 'tree-sitter-python',
    bash: 'tree-sitter-bash',
  };
  return resolve(__dirname, '../../node_modules/tree-sitter-wasms/out', `${nameMap[language]}.wasm`);
}

async function ensureInit(): Promise<void> {
  if (parserInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const mod = await import('web-tree-sitter');
    ParserClass = mod.default ?? mod;
    await ParserClass.init();
    parserInstance = new ParserClass();
  })();

  return initPromise;
}

async function getLanguageGrammar(language: SupportedLanguage): Promise<unknown> {
  const cached = grammarCache.get(language);
  if (cached) return cached;

  await ensureInit();

  const grammarPath = getGrammarPath(language);
  const lang = await ParserClass.Language.load(grammarPath);
  grammarCache.set(language, lang);
  return lang;
}

// ── Node type → SymbolKind mapping ─────────────────────────────

const JS_TS_KIND_MAP: Record<string, SymbolKind> = {
  function_declaration: 'function',
  generator_function_declaration: 'function',
  method_definition: 'method',
  class_declaration: 'class',
  abstract_class_declaration: 'class',
  interface_declaration: 'interface',
  type_alias_declaration: 'type_alias',
  enum_declaration: 'enum',
  import_statement: 'import',
  import_declaration: 'import',
  export_statement: 'export',
  export_declaration: 'export',
};

const PYTHON_KIND_MAP: Record<string, SymbolKind> = {
  function_definition: 'function',
  class_definition: 'class',
  decorated_definition: 'function',
  import_statement: 'import',
  import_from_statement: 'import',
};

const BASH_KIND_MAP: Record<string, SymbolKind> = {
  function_definition: 'function',
};

function getKindMap(language: SupportedLanguage): Record<string, SymbolKind> {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return JS_TS_KIND_MAP;
    case 'python':
      return PYTHON_KIND_MAP;
    case 'bash':
      return BASH_KIND_MAP;
  }
}

// ── Minimal tree-sitter SyntaxNode shape ───────────────────────

interface TSNode {
  type: string;
  isNamed: boolean;
  hasError: boolean;
  text: string;
  startPosition: { row: number; column: number };
  endPosition: { row: number; column: number };
  parent: TSNode | null;
  namedChildren: TSNode[];
  childForFieldName(name: string): TSNode | null;
}

// ── AST extraction helpers ─────────────────────────────────────

function extractName(node: TSNode, language: SupportedLanguage): string | null {
  const nameNode = node.childForFieldName('name');
  if (nameNode) return nameNode.text;

  if (node.type === 'variable_declarator') {
    return node.childForFieldName('name')?.text ?? null;
  }

  if (node.type === 'lexical_declaration') {
    for (const child of node.namedChildren) {
      if (child.type === 'variable_declarator') {
        return child.childForFieldName('name')?.text ?? null;
      }
    }
  }

  if (node.type === 'export_statement' || node.type === 'export_declaration') {
    const decl = node.childForFieldName('declaration');
    if (decl) return extractName(decl, language);
    return null;
  }

  if (node.type === 'import_statement' || node.type === 'import_declaration'
    || node.type === 'import_from_statement') {
    // Walk into import_clause → named_imports → import_specifier → name
    for (const child of node.namedChildren) {
      if (child.type === 'import_clause') {
        for (const inner of child.namedChildren) {
          if (inner.type === 'named_imports') {
            for (const spec of inner.namedChildren) {
              if (spec.type === 'import_specifier') {
                const n = spec.childForFieldName('name') ?? spec.childForFieldName('local');
                if (n) return n.text;
              }
            }
          }
          if (inner.type === 'identifier') return inner.text;
        }
      }
      if (child.type === 'import_specifier') {
        const n = child.childForFieldName('name') ?? child.childForFieldName('local');
        if (n) return n.text;
      }
    }
    // Python: import_from_statement has dotted_name + name
    for (const child of node.namedChildren) {
      if (child.type === 'dotted_name' || child.type === 'identifier') {
        return child.text;
      }
    }
  }

  if (node.type === 'decorated_definition') {
    for (const child of node.namedChildren) {
      if (child.type === 'function_definition' || child.type === 'class_definition') {
        return extractName(child, language);
      }
    }
  }

  return null;
}

function extractSignature(node: TSNode, lines: string[]): string {
  return lines[node.startPosition.row]?.trim() ?? node.text.split('\n')[0].trim();
}

function extractExtendsName(node: TSNode): string | undefined {
  const superclass = node.childForFieldName('superclass');
  if (superclass) return superclass.text;

  for (const child of node.namedChildren) {
    if (child.type === 'class_heritage') {
      for (const clause of child.namedChildren) {
        if (clause.type === 'extends_clause') {
          const value = clause.childForFieldName('value') ?? clause.namedChildren[0];
          return value?.text;
        }
      }
    }
  }

  // Python: superclasses argument_list
  const args = node.childForFieldName('superclasses');
  if (args?.namedChildren.length) return args.namedChildren[0].text;

  return undefined;
}

function extractImplementsNames(node: TSNode): string[] | undefined {
  for (const child of node.namedChildren) {
    if (child.type === 'class_heritage') {
      for (const clause of child.namedChildren) {
        if (clause.type === 'implements_clause') {
          return clause.namedChildren.map(n => n.text).filter(Boolean);
        }
      }
    }
  }
  return undefined;
}

function extractDecoratorNames(node: TSNode): string[] | undefined {
  const decorators: string[] = [];
  const parent = node.parent;
  if (parent?.type === 'decorated_definition') {
    for (const child of parent.namedChildren) {
      if (child.type === 'decorator') {
        const nameNode = child.childForFieldName('name') ?? child.namedChildren[0];
        if (nameNode) decorators.push(nameNode.text.replace(/^@/, ''));
      }
    }
  }
  for (const child of node.namedChildren) {
    if (child.type === 'decorator') {
      const nameNode = child.childForFieldName('name') ?? child.namedChildren[0];
      if (nameNode) decorators.push(nameNode.text.replace(/^@/, ''));
    }
  }
  return decorators.length > 0 ? [...new Set(decorators)] : undefined;
}

function extractTypeRefs(node: TSNode): string[] | undefined {
  const excluded = new Set([
    'string', 'number', 'boolean', 'void', 'any', 'unknown', 'never',
    'object', 'undefined', 'null', 'true', 'false',
  ]);
  const refs = new Set<string>();

  const returnType = node.childForFieldName('return_type');
  if (returnType) {
    for (const m of returnType.text.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? []) {
      if (!excluded.has(m)) refs.add(m);
    }
  }

  const params = node.childForFieldName('parameters');
  if (params) {
    for (const m of params.text.match(/:\s*([A-Z][A-Za-z0-9_]*)/g) ?? []) {
      const name = m.replace(/^:\s*/, '');
      if (!excluded.has(name)) refs.add(name);
    }
  }

  const value = node.childForFieldName('value') ?? node.childForFieldName('type');
  if (value) {
    for (const m of value.text.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? []) {
      if (!excluded.has(m)) refs.add(m);
    }
  }

  return refs.size > 0 ? [...refs] : undefined;
}

function resolveKind(node: TSNode, language: SupportedLanguage): SymbolKind | null {
  const kindMap = getKindMap(language);

  if (node.type === 'variable_declarator') {
    const value = node.childForFieldName('value');
    if (value && (value.type === 'arrow_function' || value.type === 'function_expression' || value.type === 'function')) {
      return 'function';
    }
    return 'variable';
  }

  if (node.type === 'lexical_declaration') {
    for (const child of node.namedChildren) {
      if (child.type === 'variable_declarator') {
        const value = child.childForFieldName('value');
        if (value && (value.type === 'arrow_function' || value.type === 'function_expression' || value.type === 'function')) {
          return 'function';
        }
        return 'variable';
      }
    }
  }

  if (node.type === 'export_statement' || node.type === 'export_declaration') {
    return 'export';
  }

  return kindMap[node.type] ?? null;
}

// ── AST walk to RawCapture[] ───────────────────────────────────

function walkAST(
  rootNode: TSNode,
  language: SupportedLanguage,
  lines: string[],
): RawCapture[] {
  const captures: RawCapture[] = [];
  const kindMap = getKindMap(language);

  function visit(node: TSNode, parentClassName?: string): void {
    const nodeType = node.type;
    const isRelevant = nodeType in kindMap
      || nodeType === 'variable_declarator'
      || nodeType === 'lexical_declaration';

    if (isRelevant && node.isNamed) {
      const kind = resolveKind(node, language);
      if (!kind) {
        for (const child of node.namedChildren) visit(child, parentClassName);
        return;
      }

      const name = extractName(node, language);
      if (!name) {
        for (const child of node.namedChildren) visit(child, parentClassName);
        return;
      }

      let effectiveKind = kind;
      // Detect methods: function inside a class body (JS/TS: class_body, Python: block under class_definition)
      if (kind === 'function' && parentClassName) {
        const parentType = node.parent?.type;
        if (parentType === 'class_body' || parentType === 'block') {
          effectiveKind = 'method';
        }
      }

      captures.push({
        name,
        kind: effectiveKind,
        startLine: node.startPosition.row + 1,
        endLine: node.endPosition.row + 1,
        startColumn: node.startPosition.column,
        endColumn: node.endPosition.column,
        signature: extractSignature(node, lines),
        parentName: parentClassName,
        extendsName: kind === 'class' ? extractExtendsName(node) : undefined,
        implementsNames: kind === 'class' ? extractImplementsNames(node) : undefined,
        decoratorNames: extractDecoratorNames(node),
        typeRefs: extractTypeRefs(node),
      });

      // Recurse into class body with class name as parent
      if (kind === 'class') {
        for (const child of node.namedChildren) visit(child, name);
        return;
      }

      // Extract parameters for functions/methods
      if (effectiveKind === 'function' || effectiveKind === 'method') {
        const params = node.childForFieldName('parameters');
        if (params) {
          for (const param of params.namedChildren) {
            if (['identifier', 'required_parameter', 'optional_parameter',
              'rest_pattern', 'typed_parameter', 'default_parameter'].includes(param.type)) {
              const paramName = param.childForFieldName('pattern')?.text
                ?? param.childForFieldName('name')?.text
                ?? (param.type === 'identifier' ? param.text : null);

              if (paramName && !paramName.startsWith('{') && !paramName.startsWith('[')) {
                const fqParent = parentClassName ? `${parentClassName}.${name}` : name;
                captures.push({
                  name: paramName.replace(/\?$/, ''),
                  kind: 'parameter',
                  startLine: param.startPosition.row + 1,
                  endLine: param.endPosition.row + 1,
                  startColumn: param.startPosition.column,
                  endColumn: param.endPosition.column,
                  parentName: fqParent,
                  signature: param.text,
                  typeRefs: extractTypeRefs(param),
                });
              }
            }
          }
        }
      }
    }

    // Export: emit export capture, then visit inner declaration
    if (nodeType === 'export_statement' || nodeType === 'export_declaration') {
      const name = extractName(node, language);
      if (name) {
        captures.push({
          name,
          kind: 'export',
          startLine: node.startPosition.row + 1,
          endLine: node.endPosition.row + 1,
          startColumn: node.startPosition.column,
          endColumn: node.endPosition.column,
          signature: extractSignature(node, lines),
        });
      }
      const decl = node.childForFieldName('declaration');
      if (decl) visit(decl, parentClassName);
      return;
    }

    // Decorated definition: visit inner (skip decorator nodes)
    if (nodeType === 'decorated_definition') {
      for (const child of node.namedChildren) {
        if (child.type !== 'decorator') visit(child, parentClassName);
      }
      return;
    }

    // Default: recurse into children
    if (!isRelevant) {
      for (const child of node.namedChildren) visit(child, parentClassName);
    }
  }

  visit(rootNode);
  return captures;
}

// ── capturesToNodes (mirrors structural-indexer logic) ──────────

function getModuleName(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? filePath;
  return fileName.replace(/\.[^.]+$/, '') || fileName || 'module';
}

function getCaptureFqName(capture: Pick<RawCapture, 'name' | 'parentName'>): string {
  return capture.parentName ? `${capture.parentName}.${capture.name}` : capture.name;
}

function capturesToNodes(
  captures: RawCapture[],
  language: SupportedLanguage,
  content: string,
): CodeNode[] {
  const filePath = ''; // attachFilePath fills this later
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

  if (content.trim().length === 0) return symbolNodes;
  return [moduleNode, ...symbolNodes];
}

// ── TreeSitterParser class ─────────────────────────────────────

export class TreeSitterParser implements ParserAdapter {
  parse(content: string, language: SupportedLanguage): ParseResult {
    if (!parserInstance) {
      return {
        filePath: '',
        language,
        nodes: [],
        edges: [],
        contentHash: generateContentHash(content),
        parseHealth: 'error',
        parseErrors: ['TreeSitterParser not initialized — call TreeSitterParser.init() first'],
        parseDurationMs: 0,
      };
    }

    const startTime = Date.now();
    const contentHash = generateContentHash(content);

    try {
      const lang = grammarCache.get(language);
      if (!lang) {
        return {
          filePath: '',
          language,
          nodes: [],
          edges: [],
          contentHash,
          parseHealth: 'error',
          parseErrors: [`Grammar not loaded for ${language} — call TreeSitterParser.loadLanguage() first`],
          parseDurationMs: Date.now() - startTime,
        };
      }

      parserInstance.setLanguage(lang);
      const tree = parserInstance.parse(content);
      const lines = content.split('\n');

      const captures = walkAST(tree.rootNode as TSNode, language, lines);
      const nodes = capturesToNodes(captures, language, content);
      const edges = extractEdges(nodes, lines, captures);

      const hasError = (tree.rootNode as TSNode).hasError;
      const parseHealth: ParseResult['parseHealth'] = hasError
        ? (captures.length > 0 ? 'recovered' : 'error')
        : (captures.length > 0 ? 'clean' : 'recovered');

      return {
        filePath: '',
        language,
        nodes,
        edges,
        contentHash,
        parseHealth,
        parseErrors: hasError ? ['Tree contains syntax errors (partial parse)'] : [],
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

  /** Initialize WASM runtime — must be called before parse() */
  static async init(): Promise<void> {
    await ensureInit();
  }

  /** Load a specific language grammar */
  static async loadLanguage(language: SupportedLanguage): Promise<void> {
    await getLanguageGrammar(language);
  }

  /** Load all supported language grammars */
  static async loadAllLanguages(): Promise<void> {
    const languages: SupportedLanguage[] = ['javascript', 'typescript', 'python', 'bash'];
    await Promise.all(languages.map(lang => getLanguageGrammar(lang)));
  }

  /** Check if parser and grammars are loaded */
  static isReady(language?: SupportedLanguage): boolean {
    if (!parserInstance) return false;
    if (language) return grammarCache.has(language);
    return grammarCache.size > 0;
  }
}
