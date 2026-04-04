/** Signal category detected in user prompt */
export type SignalCategory = 'correction' | 'preference' | 'reinforcement' | 'neutral';
/** Result of signal detection for a prompt */
export interface SignalDetection {
    category: SignalCategory;
    keywords: string[];
    boost: number;
}
/** Trigger cache entry for a single phrase-to-memory mapping */
export interface TriggerCacheEntry {
    triggerId: number;
    phrase: string;
    regex: RegExp;
    memoryId: number;
    specFolder: string;
    filePath: string;
    title: string | null;
    importanceWeight: number;
}
/** Match result grouped by memory */
export interface TriggerMatch {
    memoryId: number;
    specFolder: string;
    filePath: string;
    title: string | null;
    importanceWeight: number;
    matchedPhrases: string[];
    [key: string]: unknown;
}
/** Match result with additional statistics */
export interface TriggerMatchWithStats {
    matches: TriggerMatch[];
    stats: TriggerMatchStats;
}
/** Statistics about a trigger matching operation */
export interface TriggerMatchStats {
    promptLength: number;
    cacheSize: number;
    matchCount: number;
    totalMatchedPhrases: number;
    matchTimeMs: number;
    signals?: SignalDetection[];
    degraded?: TriggerMatcherDegradedState;
}
/** Cache statistics */
export interface CacheStats {
    size: number;
    timestamp: number;
    ageMs: number | null;
    regexCacheSize: number;
    maxRegexCacheSize: number;
}
export interface TriggerMatcherFailure {
    code: string;
    message: string;
    memoryId?: number;
    filePath?: string;
}
export interface TriggerMatcherDegradedState {
    code: string;
    message: string;
    failedEntries: number;
    failures: TriggerMatcherFailure[];
}
/** Memory result from getMemoriesByPhrase */
export interface MemoryByPhrase {
    memoryId: number;
    specFolder: string;
    filePath: string;
    title: string | null;
    importanceWeight: number;
}
/** Execution time log entry */
export interface ExecutionLogEntry {
    timestamp: string;
    operation: string;
    durationMs: number;
    target: string;
    [key: string]: unknown;
}
/** Trigger matcher configuration */
export interface TriggerMatcherConfig {
    CACHE_TTL_MS: number;
    DEFAULT_LIMIT: number;
    MIN_PHRASE_LENGTH: number;
    MAX_PROMPT_LENGTH: number;
    WARN_THRESHOLD_MS: number;
    LOG_EXECUTION_TIME: boolean;
    MAX_REGEX_CACHE_SIZE: number;
}
/**
 * Defines the CONFIG constant.
 */
export declare const CONFIG: TriggerMatcherConfig;
/** Log hook execution time for monitoring and debugging */
export declare function logExecutionTime(operation: string, durationMs: number, details?: Record<string, unknown>): ExecutionLogEntry | undefined;
export declare function normalizeTriggerText(text: string): string;
/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
export declare function getCachedRegex(phrase: string): RegExp;
/** Load all trigger phrases from the index into memory */
export declare function loadTriggerCache(): TriggerCacheEntry[];
/** Clear the trigger cache (useful for testing or after updates) */
export declare function clearCache(): void;
/** Get cache statistics */
export declare function getCacheStats(): CacheStats;
/** Normalize string for Unicode-safe comparison */
export declare function normalizeUnicode(str: string, stripAccents?: boolean): string;
/** Check if a phrase exists in text with word boundaries */
export declare function matchPhraseWithBoundary(text: string, phrase: string, precompiledRegex?: RegExp | null): boolean;
/** Keywords for CORRECTION signals — user is correcting a prior statement */
export declare const CORRECTION_KEYWORDS: string[];
/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
export declare const PREFERENCE_KEYWORDS: string[];
/** Keywords for REINFORCEMENT signals — user is confirming or praising a prior result */
export declare const REINFORCEMENT_KEYWORDS: string[];
/**
 * Detect importance signals in a user prompt.
 * Returns an array of detected SignalDetection entries.
 * Only active when the SPECKIT_SIGNAL_VOCAB env var is set.
 */
export declare function detectSignals(prompt: string): SignalDetection[];
/**
 * Apply signal boosts to matched results.
 * Boosts are additive; importanceWeight is capped at 1.0.
 * Only called when SPECKIT_SIGNAL_VOCAB is enabled.
 */
export declare function applySignalBoosts(matches: TriggerMatch[], signals: SignalDetection[]): TriggerMatch[];
/** Match user prompt against trigger phrases using exact string matching */
export declare function matchTriggerPhrases(userPrompt: string, limit?: number): TriggerMatch[];
/** Match trigger phrases with additional stats */
export declare function matchTriggerPhrasesWithStats(userPrompt: string, limit?: number): TriggerMatchWithStats;
/** Get all unique trigger phrases in the cache */
export declare function getAllPhrases(): string[];
export declare function getTriggerCandidates(userPrompt: string, cache?: TriggerCacheEntry[]): TriggerCacheEntry[];
/** Get memories by trigger phrase */
export declare function getMemoriesByPhrase(phrase: string): MemoryByPhrase[];
/** Refresh trigger cache (forces reload on next access) */
export declare function refreshTriggerCache(): TriggerCacheEntry[];
//# sourceMappingURL=trigger-matcher.d.ts.map