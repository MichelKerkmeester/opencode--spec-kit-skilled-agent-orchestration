/** Tiered search result for token metric calculation */
export interface TieredResult {
    tier?: string;
    content?: string | null;
    [key: string]: unknown;
}
/** Token metrics breakdown */
export interface TokenMetrics {
    actualTokens: number;
    hotTokens: number;
    warmTokens: number;
    hotCount: number;
    warmCount: number;
    coldExcluded: number;
    estimatedSavingsPercent: number;
    note: string;
}
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
export declare const estimateTokens: typeof estimateTokenCount;
export declare function calculateTokenMetrics(allMatches: unknown[], returnedResults: TieredResult[]): TokenMetrics;
//# sourceMappingURL=token-metrics.d.ts.map