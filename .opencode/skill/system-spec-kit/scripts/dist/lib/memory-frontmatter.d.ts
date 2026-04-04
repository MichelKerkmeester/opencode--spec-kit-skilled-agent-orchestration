export declare const GENERIC_MEMORY_DESCRIPTION = "Session context memory template for Spec Kit indexing.";
export declare const LEGACY_GENERIC_MEMORY_TRIGGER_PHRASES: string[];
export declare function hasLegacyGenericTriggerPhrases(triggerPhrases: string[]): boolean;
export declare function containsLegacyGenericTriggerPhrase(triggerPhrases: string[]): boolean;
export declare function hasGenericMemoryDescription(description?: string | null): boolean;
export declare function sanitizeMemoryFrontmatterTitle(title?: string | null): string;
export declare function deriveMemoryDescription(options: {
    summary?: string | null;
    heading?: string | null;
    title?: string | null;
}): string;
export declare function deriveMemoryTriggerPhrases(options: {
    title?: string | null;
    description?: string | null;
    summary?: string | null;
    specFolder: string;
    existing?: string[];
}): string[];
//# sourceMappingURL=memory-frontmatter.d.ts.map