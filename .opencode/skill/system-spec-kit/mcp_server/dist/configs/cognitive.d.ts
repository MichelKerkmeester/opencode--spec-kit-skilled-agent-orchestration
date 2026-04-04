export interface CognitiveConfig {
    coActivationPattern: RegExp;
    coActivationPatternSource: string;
    coActivationPatternFlags: string;
}
interface CognitiveConfigParseError {
    field: 'SPECKIT_COGNITIVE_COACTIVATION_PATTERN' | 'SPECKIT_COGNITIVE_COACTIVATION_FLAGS';
    message: string;
}
interface CognitiveConfigParseResult {
    success: boolean;
    data?: CognitiveConfig;
    errors: CognitiveConfigParseError[];
}
export declare function loadCognitiveConfigFromEnv(env?: NodeJS.ProcessEnv): CognitiveConfig;
export declare function safeParseCognitiveConfigFromEnv(env?: NodeJS.ProcessEnv): CognitiveConfigParseResult;
export declare const COGNITIVE_CONFIG: CognitiveConfig;
export {};
//# sourceMappingURL=cognitive.d.ts.map