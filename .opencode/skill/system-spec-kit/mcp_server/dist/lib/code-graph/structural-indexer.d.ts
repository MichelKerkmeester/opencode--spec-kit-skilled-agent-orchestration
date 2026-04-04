import type { CodeNode, CodeEdge, ParseResult, SupportedLanguage, IndexerConfig, SymbolKind } from './indexer-types.js';
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
/**
 * Returns the active parser backend.
 *
 * SPECKIT_PARSER env var controls which backend is used:
 *   - 'treesitter' (default): AST-accurate parsing via web-tree-sitter WASM grammars
 *   - 'regex': Lightweight regex-based fallback with no WASM dependencies
 *
 * Tree-sitter is lazy-loaded on first call. If WASM init fails, falls back to regex automatically.
 */
export declare function getParser(): Promise<ParserAdapter>;
/** Convert raw captures to CodeNode[] */
export declare function capturesToNodes(captures: RawCapture[], filePath: string, language: SupportedLanguage, content: string): CodeNode[];
/** Extract edges from nodes, source content, and raw captures */
export declare function extractEdges(nodes: CodeNode[], contentLines?: string[], captures?: RawCapture[]): CodeEdge[];
/** Parse a single file and return structural analysis */
export declare function parseFile(filePath: string, content: string, language: SupportedLanguage): Promise<ParseResult>;
/** Index all matching files in the workspace */
export declare function indexFiles(config: IndexerConfig): Promise<ParseResult[]>;
export {};
//# sourceMappingURL=structural-indexer.d.ts.map