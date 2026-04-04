type LocalRerankRow = Record<string, unknown> & {
    id: number | string;
    content?: string;
    file_path?: string;
    score?: number;
    rerankerScore?: number;
};
declare function resolveModelPath(): string;
declare function resolveRowText(row: LocalRerankRow): string;
declare function normalizeScore(value: number): number;
declare function extractNumericScore(value: unknown): number | null;
declare function scorePrompt(context: unknown, prompt: string): Promise<number>;
/**
 * Feature-flag gate for local reranking.
 * This guard is intentionally strict: local reranking only runs when the
 * operator opts in with `RERANKER_LOCAL=true`, has enough total RAM, and the
 * configured GGUF model file is available.
 */
export declare function canUseLocalReranker(): Promise<boolean>;
/**
 * Local GGUF reranking entrypoint for Stage 3.
 * Falls back to original ordering whenever preconditions fail or runtime
 * inference errors occur, preserving deterministic behavior.
 */
export declare function rerankLocal<T extends LocalRerankRow>(query: string, candidates: T[], topK: number): Promise<T[]>;
export declare function disposeLocalReranker(): Promise<void>;
export declare const __testables: {
    resolveModelPath: typeof resolveModelPath;
    resolveRowText: typeof resolveRowText;
    extractNumericScore: typeof extractNumericScore;
    normalizeScore: typeof normalizeScore;
    scorePrompt: typeof scorePrompt;
};
export {};
//# sourceMappingURL=local-reranker.d.ts.map