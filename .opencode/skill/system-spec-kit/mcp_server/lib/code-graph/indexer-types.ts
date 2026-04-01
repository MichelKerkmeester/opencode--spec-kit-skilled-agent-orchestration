// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Indexer Types
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';

/** Node types extracted by the structural indexer */
export type SymbolKind =
  | 'function' | 'class' | 'method' | 'interface'
  | 'type_alias' | 'variable' | 'enum' | 'module'
  | 'import' | 'export' | 'parameter';

/** Edge types for relationships between symbols */
export type EdgeType =
  | 'CONTAINS' | 'CALLS' | 'IMPORTS' | 'EXPORTS'
  | 'EXTENDS' | 'IMPLEMENTS' | 'TESTED_BY'
  | 'DECORATES' | 'OVERRIDES' | 'TYPE_OF';

/** Languages supported by the structural indexer */
export type SupportedLanguage = 'javascript' | 'typescript' | 'python' | 'bash';

/** A structural symbol node extracted from source code */
export interface CodeNode {
  symbolId: string;
  filePath: string;
  fqName: string;
  kind: SymbolKind;
  name: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  language: SupportedLanguage;
  signature?: string;
  docstring?: string;
  contentHash: string;
}

/** A directional edge between two symbol nodes */
export interface CodeEdge {
  sourceId: string;
  targetId: string;
  edgeType: EdgeType;
  weight: number;
  metadata?: Record<string, string>;
}

/** Result of parsing a single file */
export interface ParseResult {
  filePath: string;
  language: SupportedLanguage;
  nodes: CodeNode[];
  edges: CodeEdge[];
  contentHash: string;
  parseHealth: 'clean' | 'recovered' | 'error';
  parseErrors: string[];
  parseDurationMs: number;
}

/** Configuration for the structural indexer */
export interface IndexerConfig {
  rootDir: string;
  includeGlobs: string[];
  excludeGlobs: string[];
  maxFileSizeBytes: number;
  languages: SupportedLanguage[];
}

/** Generate a deterministic symbol ID from file path, qualified name, and kind */
export function generateSymbolId(filePath: string, fqName: string, kind: SymbolKind): string {
  return createHash('sha256')
    .update(filePath + '::' + fqName + '::' + kind)
    .digest('hex')
    .slice(0, 16);
}

/** Generate a content hash for change detection */
export function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}

/** Detect language from file extension */
export function detectLanguage(filePath: string): SupportedLanguage | null {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js': case 'mjs': case 'cjs': case 'jsx':
      return 'javascript';
    case 'ts': case 'mts': case 'cts': case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'sh': case 'bash': case 'zsh':
      return 'bash';
    default:
      return null;
  }
}

/** Get default indexer configuration */
export function getDefaultConfig(rootDir: string): IndexerConfig {
  return {
    rootDir,
    includeGlobs: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs', '**/*.py', '**/*.sh', '**/*.bash', '**/*.zsh'],
    excludeGlobs: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/vendor/**'],
    maxFileSizeBytes: 102_400,
    languages: ['javascript', 'typescript', 'python', 'bash'],
  };
}
