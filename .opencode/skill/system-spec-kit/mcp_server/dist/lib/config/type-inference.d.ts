import type { MemoryTypeName, MemoryTypeConfig } from './memory-types.js';
interface InferMemoryTypeParams {
    filePath?: string;
    content?: string;
    title?: string;
    triggerPhrases?: string[] | string;
    importanceTier?: string | null;
}
interface InferenceResult {
    type: MemoryTypeName;
    source: 'frontmatter_explicit' | 'importance_tier' | 'file_path' | 'keywords' | 'default';
    confidence: number;
}
interface DetailedTypeSuggestion extends InferenceResult {
    explanation: string;
    typeConfig: MemoryTypeConfig;
}
interface TypeValidationResult {
    valid: boolean;
    warnings: string[];
}
interface MemoryForBatchInference {
    filePath?: string;
    file_path?: string;
    content?: string;
    title?: string;
    triggerPhrases?: string[] | string;
    importanceTier?: string | null;
    importance_tier?: string | null;
}
/**
 * Provides the inferTypeFromPath helper.
 */
export declare function inferTypeFromPath(filePath: string | null | undefined): MemoryTypeName | null;
/**
 * Provides the extractExplicitType helper.
 */
export declare function extractExplicitType(content: string | null | undefined): MemoryTypeName | null;
/**
 * Provides the inferTypeFromTier helper.
 */
export declare function inferTypeFromTier(content: string | null | undefined): MemoryTypeName | null;
/**
 * Provides the inferTypeFromKeywords helper.
 */
export declare function inferTypeFromKeywords(title: string | null | undefined, triggerPhrases: string[] | string | null | undefined, content: string | null | undefined): MemoryTypeName | null;
/**
 * Provides the inferMemoryType helper.
 */
export declare function inferMemoryType(params: InferMemoryTypeParams): InferenceResult;
export declare function inferMemoryTypesBatch(memories: MemoryForBatchInference[]): Map<string, InferenceResult>;
export declare function getTypeSuggestionDetailed(params: InferMemoryTypeParams): DetailedTypeSuggestion;
export declare function validateInferredType(inferredType: string, filePath: string | null | undefined): TypeValidationResult;
export {};
//# sourceMappingURL=type-inference.d.ts.map