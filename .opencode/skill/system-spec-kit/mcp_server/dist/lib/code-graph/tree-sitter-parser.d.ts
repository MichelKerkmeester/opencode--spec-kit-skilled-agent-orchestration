import type { ParseResult, SupportedLanguage } from './indexer-types.js';
/** ParserAdapter interface — mirrors structural-indexer.ts:16-18 */
interface ParserAdapter {
    parse(content: string, language: SupportedLanguage): ParseResult;
}
export declare class TreeSitterParser implements ParserAdapter {
    parse(content: string, language: SupportedLanguage): ParseResult;
    /** Initialize WASM runtime — must be called before parse() */
    static init(): Promise<void>;
    /** Load a specific language grammar */
    static loadLanguage(language: SupportedLanguage): Promise<void>;
    /** Load all supported language grammars */
    static loadAllLanguages(): Promise<void>;
    /** Check if parser and grammars are loaded */
    static isReady(language?: SupportedLanguage): boolean;
}
export {};
//# sourceMappingURL=tree-sitter-parser.d.ts.map