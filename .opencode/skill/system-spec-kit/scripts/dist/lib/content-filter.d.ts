/** Content type classification labels */
export type ContentType = 'noise' | 'empty' | 'duplicate' | 'lowQuality' | 'valid';
export interface NoisePatternConfig {
    pattern: string;
    flags?: string;
}
export interface ContaminationAuditRecord extends Record<string, unknown> {
    stage: 'extractor-scrub' | 'content-filter' | 'post-render';
    timestamp: string;
    patternsChecked: string[];
    matchesFound: string[];
    actionsTaken: string[];
    passedThrough: string[];
}
/** Filter pipeline configuration */
export interface FilterConfig {
    pipeline: {
        enabled: boolean;
        stages: string[];
    };
    noise: {
        enabled: boolean;
        minContentLength: number;
        minUniqueWords: number;
        patterns: Array<RegExp | string | NoisePatternConfig>;
    };
    dedupe: {
        enabled: boolean;
        hashLength: number;
        similarityThreshold: number;
    };
    quality: {
        enabled: boolean;
        warnThreshold: number;
        factors: QualityFactors;
    };
}
/** Quality score factor weights */
export interface QualityFactors {
    uniqueness: number;
    density: number;
    fileRefs: number;
    decisions: number;
}
/** Statistics from filtering pipeline execution */
export interface FilterStats {
    totalProcessed: number;
    noiseFiltered: number;
    duplicatesRemoved: number;
    qualityScore: number;
    contaminationAudit: ContaminationAuditRecord[];
    filtered: {
        noise: number;
        empty: number;
        duplicate: number;
        lowQuality: number;
    };
}
/** Prompt-like item that flows through the filter pipeline */
export interface PromptItem {
    prompt?: string;
    content?: string;
    [key: string]: unknown;
}
/** Filter pipeline instance with methods */
export interface FilterPipeline {
    config: FilterConfig;
    filter(prompts: PromptItem[]): PromptItem[];
    filterNoise(prompts: PromptItem[]): PromptItem[];
    deduplicate(prompts: PromptItem[]): PromptItem[];
    getQualityScore(): number;
    isLowQuality(): boolean;
    getStats(): FilterStats;
}
declare const NOISE_PATTERNS: readonly RegExp[];
declare function isNoiseContent(content: string, additionalPatterns?: readonly RegExp[]): boolean;
declare function createFilterPipeline(customConfig?: Partial<FilterConfig>): FilterPipeline;
export { createFilterPipeline, isNoiseContent, NOISE_PATTERNS, };
//# sourceMappingURL=content-filter.d.ts.map