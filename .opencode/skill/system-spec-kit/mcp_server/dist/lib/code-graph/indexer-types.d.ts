/** Node types extracted by the structural indexer */
export type SymbolKind = 'function' | 'class' | 'method' | 'interface' | 'type_alias' | 'variable' | 'enum' | 'module' | 'import' | 'export' | 'parameter';
/** Edge types for relationships between symbols */
export type EdgeType = 'CONTAINS' | 'CALLS' | 'IMPORTS' | 'EXPORTS' | 'EXTENDS' | 'IMPLEMENTS' | 'TESTED_BY' | 'DECORATES' | 'OVERRIDES' | 'TYPE_OF';
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
export declare function generateSymbolId(filePath: string, fqName: string, kind: SymbolKind): string;
/** Generate a content hash for change detection */
export declare function generateContentHash(content: string): string;
/** Detect language from file extension */
export declare function detectLanguage(filePath: string): SupportedLanguage | null;
/** Get default indexer configuration */
export declare function getDefaultConfig(rootDir: string): IndexerConfig;
//# sourceMappingURL=indexer-types.d.ts.map