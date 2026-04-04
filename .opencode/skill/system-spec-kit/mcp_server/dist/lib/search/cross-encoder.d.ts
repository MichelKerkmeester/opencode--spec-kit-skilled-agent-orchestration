interface ProviderConfigEntry {
    name: string;
    model: string;
    endpoint: string;
    apiKeyEnv: string;
    maxDocuments: number;
    timeout: number;
}
declare const PROVIDER_CONFIG: Record<string, ProviderConfigEntry>;
declare const LENGTH_PENALTY: {
    readonly shortThreshold: 50;
    readonly longThreshold: 2000;
    readonly shortPenalty: 0.9;
    readonly longPenalty: 0.95;
};
interface RerankDocument {
    id: number | string;
    content: string;
    title?: string;
    [key: string]: unknown;
}
interface RerankResult {
    id: number | string;
    score: number;
    originalRank: number;
    rerankerScore: number;
    provider: string;
    /**
     * P3-16: Discriminator for score origin.
     *   'cross-encoder' — score from a neural reranker (Voyage / Cohere API or local model)
     *   'fallback'      — synthetic positional score (0–0.5) when no provider is available
     */
    scoringMethod: 'cross-encoder' | 'fallback';
    [key: string]: unknown;
}
interface RerankerStatus {
    available: boolean;
    provider: string | null;
    model: string | null;
    latency: {
        avg: number;
        p95: number;
        count: number;
    };
}
/**
 * Phase C: Enforce cache size bound.
 * Follows the enforceCacheBound() pattern from graph-signals.ts.
 * When the cache exceeds MAX_CACHE_ENTRIES, evicts the oldest entry
 * by timestamp to prevent unbounded memory growth.
 */
declare function enforceCacheBound(): void;
interface CircuitState {
    failures: number;
    openedAt: number | null;
}
declare function getCircuit(provider: string): CircuitState;
declare function isCircuitOpen(provider: string): boolean;
declare function recordSuccess(provider: string): void;
declare function recordFailure(provider: string): void;
declare function resolveProvider(): string | null;
declare function calculateLengthPenalty(contentLength: number): number;
declare function applyLengthPenalty(results: RerankResult[]): RerankResult[];
declare function generateCacheKey(query: string, docIds: Array<number | string>, provider?: string, optionBits?: string): string;
declare function rerankVoyage(query: string, documents: RerankDocument[]): Promise<RerankResult[]>;
declare function rerankCohere(query: string, documents: RerankDocument[]): Promise<RerankResult[]>;
declare function rerankLocal(query: string, documents: RerankDocument[]): Promise<RerankResult[]>;
declare function rerankResults(query: string, documents: RerankDocument[], options?: {
    limit?: number;
    useCache?: boolean;
    applyLengthPenalty?: boolean;
}): Promise<RerankResult[]>;
declare function isRerankerAvailable(): boolean;
declare function getRerankerStatus(): RerankerStatus;
declare function resetSession(): void;
declare function resetProvider(): void;
export { PROVIDER_CONFIG, LENGTH_PENALTY, resolveProvider, calculateLengthPenalty, applyLengthPenalty, generateCacheKey, rerankVoyage, rerankCohere, rerankLocal, rerankResults, isRerankerAvailable, getRerankerStatus, resetSession, resetProvider, };
export type { RerankDocument, RerankResult, RerankerStatus, ProviderConfigEntry, };
/**
 * G3: Internal circuit breaker functions exposed for unit testing.
 * Not intended for production use outside the test harness.
 */
export declare const __testables: {
    getCircuit: typeof getCircuit;
    isCircuitOpen: typeof isCircuitOpen;
    recordSuccess: typeof recordSuccess;
    recordFailure: typeof recordFailure;
    circuitBreakers: Map<string, CircuitState>;
    CIRCUIT_FAILURE_THRESHOLD: number;
    CIRCUIT_COOLDOWN_MS: number;
    enforceCacheBound: typeof enforceCacheBound;
    MAX_CACHE_ENTRIES: number;
    cache: Map<string, {
        results: RerankResult[];
        timestamp: number;
    }>;
};
//# sourceMappingURL=cross-encoder.d.ts.map