// ────────────────────────────────────────────────────────────────
// MODULE: Token Metrics Formatter
// ────────────────────────────────────────────────────────────────
// FORMATTERS: TOKEN METRICS
// ────────────────────────────────────────────────────────────────
// 1. TYPES 
// ────────────────────────────────────────────────────────────────
// 2. TOKEN ESTIMATION 
// ────────────────────────────────────────────────────────────────
// Canonical implementation in shared — re-exported with original name for backward compatibility
import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
export const estimateTokens = estimateTokenCount;
// ────────────────────────────────────────────────────────────────
// 3. TOKEN METRICS CALCULATION 
// ────────────────────────────────────────────────────────────────
export function calculateTokenMetrics(allMatches, returnedResults) {
    // Estimate tokens if ALL matches returned full content
    const hypotheticalFullTokens = returnedResults.reduce((sum, r) => {
        return sum + (r.tier === 'WARM' ? estimateTokens(r.content) * 3 : estimateTokens(r.content));
    }, 0);
    // Actual tokens returned
    const actualTokens = returnedResults.reduce((sum, r) => {
        return sum + estimateTokens(r.content || '');
    }, 0);
    // Count by tier
    const hotCount = returnedResults.filter(r => r.tier === 'HOT').length;
    const warmCount = returnedResults.filter(r => r.tier === 'WARM').length;
    const coldExcluded = allMatches.length - returnedResults.length;
    // Hot tokens (full content)
    const hotTokens = returnedResults
        .filter(r => r.tier === 'HOT')
        .reduce((sum, r) => sum + estimateTokens(r.content || ''), 0);
    // Warm tokens (summaries)
    const warmTokens = returnedResults
        .filter(r => r.tier === 'WARM')
        .reduce((sum, r) => sum + estimateTokens(r.content || ''), 0);
    // Estimate savings
    const estimatedSavings = warmCount > 0 || coldExcluded > 0 ?
        Math.round((1 - actualTokens / Math.max(hypotheticalFullTokens, 1)) * 100) : 0;
    return {
        actualTokens: actualTokens,
        hotTokens: hotTokens,
        warmTokens: warmTokens,
        hotCount: hotCount,
        warmCount: warmCount,
        coldExcluded: coldExcluded,
        estimatedSavingsPercent: Math.max(0, estimatedSavings),
        note: 'Token estimates use ~4 chars/token approximation'
    };
}
/* ───────────────────────────────────────────────────────────────
   4. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
//# sourceMappingURL=token-metrics.js.map