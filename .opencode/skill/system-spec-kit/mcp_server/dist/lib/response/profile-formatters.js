// ───────────────────────────────────────────────────────────────
// MODULE: Profile Formatters
// ───────────────────────────────────────────────────────────────
// REQ-D5-003: Mode-Aware Response Shape
//
// PURPOSE: Route search/context results through one of four named
// presentation profiles, each optimising for a different consumer:
//
//   quick    — topResult + oneLineWhy + omittedCount
//              Minimal response for fast decision-making. Best token savings.
//   research — results[] + evidenceDigest + followUps[]
//              Full result list with synthesis and suggested next queries.
//   resume   — state + nextSteps + blockers
//              Structured continuation shape for session recovery.
//   debug    — full trace, no omission
//              Complete raw response for debugging (flag-gated).
//
// FEATURE FLAG: SPECKIT_RESPONSE_PROFILE_V1 (default ON, graduated)
//
// Backward compatibility: when flag is OFF (or profile omitted), the
// original full response is returned unchanged.
import { estimateTokens } from '../../formatters/token-metrics.js';
import { resolveEffectiveScore } from '../search/pipeline/types.js';
// ── Feature flag ──────────────────────────────────────────────
import { isResponseProfileEnabled } from '../search/search-flags.js';
/**
 * Returns true when SPECKIT_RESPONSE_PROFILE_V1 is enabled.
 * Default: ON (graduated). Set SPECKIT_RESPONSE_PROFILE_V1=false to disable.
 */
export { isResponseProfileEnabled };
// ── Internal helpers ──────────────────────────────────────────
function resolveScore(result) {
    const row = {
        id: typeof result.id === 'number' ? result.id : 0,
        score: typeof result.score === 'number' ? result.score : undefined,
        rrfScore: typeof result.rrfScore === 'number' ? result.rrfScore : undefined,
        intentAdjustedScore: typeof result.intentAdjustedScore === 'number'
            ? result.intentAdjustedScore
            : undefined,
        similarity: typeof result.similarity === 'number'
            ? (result.similarity > 1 ? result.similarity : result.similarity * 100)
            : undefined,
    };
    return resolveEffectiveScore(row);
}
function getOneLineWhy(result, rank) {
    // Prefer structured why.summary from explainability module
    if (result.why?.summary) {
        return result.why.summary;
    }
    const score = resolveScore(result);
    const scoreStr = score > 0 ? ` (score: ${score.toFixed(2)})` : '';
    return rank === 0
        ? `Top result${scoreStr}`
        : `Result #${rank + 1}${scoreStr}`;
}
function buildEvidenceDigest(results) {
    if (results.length === 0)
        return 'No results found.';
    const contextTypes = [...new Set(results
            .map(r => r.contextType ?? r.context_type)
            .filter((ct) => typeof ct === 'string' && ct.length > 0))];
    const tiers = [...new Set(results
            .map(r => r.importance_tier)
            .filter((t) => typeof t === 'string' && t.length > 0))];
    const avgScore = results.reduce((sum, r) => sum + resolveScore(r), 0) / results.length;
    const parts = [
        `${results.length} result${results.length !== 1 ? 's' : ''} retrieved`,
    ];
    if (avgScore > 0) {
        parts.push(`avg score ${avgScore.toFixed(2)}`);
    }
    if (contextTypes.length > 0) {
        parts.push(`types: ${contextTypes.slice(0, 3).join(', ')}`);
    }
    if (tiers.length > 0) {
        parts.push(`tiers: ${tiers.join(', ')}`);
    }
    return parts.join('; ') + '.';
}
function buildFollowUps(results) {
    const followUps = [];
    if (results.length === 0) {
        followUps.push('Try broadening the query or removing specFolder filter');
        return followUps;
    }
    // Suggest anchor-specific follow-up if anchors were matched
    const anchoredResults = results.filter(r => r.why?.topSignals?.some(s => s.startsWith('anchor:')));
    if (anchoredResults.length > 0) {
        followUps.push('Search with anchors[] to retrieve specific sections directly');
    }
    // Suggest deeper search if top result has low score
    const topScore = resolveScore(results[0]);
    if (topScore < 0.5) {
        followUps.push('Low scores detected — consider adding more specific terms or using concepts[]');
    }
    // Suggest context retrieval if multiple results from same spec folder
    const specFolders = results
        .map(r => {
        const fp = r.file_path;
        if (!fp)
            return null;
        const match = fp.match(/specs\/([^/]+\/[^/]+)\//);
        return match ? match[1] : null;
    })
        .filter((f) => f !== null);
    const uniqueFolders = [...new Set(specFolders)];
    if (uniqueFolders.length === 1) {
        followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
    }
    return followUps.slice(0, 3);
}
function extractNextSteps(results) {
    const steps = [];
    for (const result of results.slice(0, 3)) {
        const why = result.why;
        if (!why)
            continue;
        const signals = why.topSignals ?? [];
        const hasAnchor = signals.some(s => s.startsWith('anchor:'));
        const anchors = signals
            .filter(s => s.startsWith('anchor:'))
            .map(s => s.slice('anchor:'.length));
        if (hasAnchor && anchors.length > 0) {
            steps.push(`Review ${anchors.join(', ')} section in result #${results.indexOf(result) + 1}`);
        }
    }
    // Look for memoryState hints
    const warmResults = results.filter(r => r.memoryState === 'WARM' || r.memoryState === 'HOT');
    if (warmResults.length > 0) {
        steps.push(`${warmResults.length} active memory item(s) ready for use`);
    }
    return steps.slice(0, 5);
}
function extractBlockers(results) {
    const blockers = [];
    const lowConfidence = results.filter(r => r.confidence?.label === 'low');
    if (lowConfidence.length > 0) {
        blockers.push(`${lowConfidence.length} result(s) have low confidence scores`);
    }
    const archivedOrCold = results.filter(r => r.memoryState === 'COLD' || r.memoryState === 'ARCHIVED');
    if (archivedOrCold.length > 0) {
        blockers.push(`${archivedOrCold.length} result(s) are cold/archived — may be stale`);
    }
    return blockers;
}
function computeTokenStats(text, resultCount) {
    const totalTokens = estimateTokens(text);
    return {
        totalTokens,
        resultCount,
        avgTokensPerResult: resultCount > 0 ? Math.round(totalTokens / resultCount) : 0,
    };
}
function getPreservedDataFields(data) {
    const preserved = { ...data };
    delete preserved.results;
    return preserved;
}
// ── Profile formatters ─────────────────────────────────────────
/**
 * Format results as the `quick` profile.
 * Returns only the top result with a one-line explanation and an
 * omitted count. Maximises token reduction.
 */
function formatQuick(input) {
    const { results } = input;
    const originalText = JSON.stringify(input);
    const originalTokens = estimateTokens(originalText);
    if (results.length === 0) {
        return {
            topResult: null,
            oneLineWhy: 'No results found',
            omittedCount: 0,
            tokenReduction: {
                originalTokens,
                returnedTokens: estimateTokens('{}'),
                savingsPercent: 99,
            },
        };
    }
    const topResult = results[0];
    const oneLineWhy = getOneLineWhy(topResult, 0);
    const omittedCount = results.length - 1;
    const quickPayload = { topResult, oneLineWhy, omittedCount };
    const returnedTokens = estimateTokens(JSON.stringify(quickPayload));
    const savingsPercent = originalTokens > 0
        ? Math.round(((originalTokens - returnedTokens) / originalTokens) * 100)
        : 0;
    return {
        topResult,
        oneLineWhy,
        omittedCount,
        tokenReduction: {
            originalTokens,
            returnedTokens,
            savingsPercent: Math.max(0, savingsPercent),
        },
    };
}
/**
 * Format results as the `research` profile.
 * Returns all results with a synthesised evidence digest and
 * suggested follow-up queries.
 */
function formatResearch(input) {
    const { results } = input;
    return {
        results,
        evidenceDigest: buildEvidenceDigest(results),
        followUps: buildFollowUps(results),
        count: results.length,
    };
}
/**
 * Format results as the `resume` profile.
 * Extracts state, next steps, and blockers — optimised for session
 * continuation workflows.
 */
function formatResume(input) {
    const { results, summary } = input;
    const stateDescription = typeof summary === 'string' && summary.trim().length > 0
        ? summary
        : results.length > 0
            ? `${results.length} result(s) available for continuation`
            : 'No prior context found for this session';
    return {
        state: stateDescription,
        nextSteps: extractNextSteps(results),
        blockers: extractBlockers(results),
        topResult: results.length > 0 ? results[0] : null,
    };
}
/**
 * Format results as the `debug` profile.
 * Passthrough — all data preserved. Adds token statistics.
 */
function formatDebug(input) {
    const { results, summary, hints, meta, ...rest } = input;
    const tokenStats = computeTokenStats(JSON.stringify(input), results.length);
    return {
        results,
        summary: typeof summary === 'string' ? summary : '',
        hints: Array.isArray(hints) ? hints : [],
        meta: {
            ...(meta ?? {}),
            ...rest,
        },
        tokenStats,
    };
}
// ── Public API ─────────────────────────────────────────────────
/**
 * Apply a named presentation profile to search results.
 *
 * Returns a tagged union with `profile` + `data` fields.
 * When the flag is OFF or profile is not recognized, returns `null`
 * so the caller can fall through to the original response.
 *
 * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
 * @param input         - Parsed response data containing results array
 * @param forceEnabled  - Override flag check (for testing)
 * @returns FormattedProfile or null if feature is disabled / profile unknown
 */
export function applyResponseProfile(profile, input, forceEnabled) {
    const enabled = forceEnabled !== undefined ? forceEnabled : isResponseProfileEnabled();
    if (!enabled)
        return null;
    const safeResults = Array.isArray(input.results) ? input.results : [];
    const safeInput = { ...input, results: safeResults };
    switch (profile) {
        case 'quick':
            return { profile: 'quick', data: formatQuick(safeInput) };
        case 'research':
            return { profile: 'research', data: formatResearch(safeInput) };
        case 'resume':
            return { profile: 'resume', data: formatResume(safeInput) };
        case 'debug':
            return { profile: 'debug', data: formatDebug(safeInput) };
        default:
            return null;
    }
}
/**
 * Apply a profile to an MCP response envelope text (JSON string).
 * Parses the envelope, applies the profile formatter, and returns
 * a new envelope JSON string with the profiled data.
 *
 * Returns the original text unchanged when:
 * - Flag is OFF
 * - Profile is unrecognised
 * - Parsing fails
 *
 * @param profile      - Profile name
 * @param envelopeText - JSON string of the MCP response envelope
 * @param forceEnabled - Override flag check (for testing)
 * @returns Modified envelope JSON string, or original on no-op
 */
export function applyProfileToEnvelope(profile, envelopeText, forceEnabled) {
    const enabled = forceEnabled !== undefined ? forceEnabled : isResponseProfileEnabled();
    if (!enabled)
        return envelopeText;
    let envelope;
    try {
        envelope = JSON.parse(envelopeText);
    }
    catch {
        return envelopeText;
    }
    const data = (envelope.data && typeof envelope.data === 'object')
        ? envelope.data
        : null;
    if (!data)
        return envelopeText;
    const results = Array.isArray(data.results)
        ? data.results
        : [];
    const preservedDataFields = getPreservedDataFields(data);
    const formatterInput = {
        results,
        summary: typeof envelope.summary === 'string' ? envelope.summary : undefined,
        hints: Array.isArray(envelope.hints) ? envelope.hints : undefined,
        meta: (envelope.meta && typeof envelope.meta === 'object')
            ? envelope.meta
            : undefined,
    };
    const formatted = applyResponseProfile(profile, formatterInput, forceEnabled);
    if (!formatted)
        return envelopeText;
    const newEnvelope = {
        ...envelope,
        data: {
            ...preservedDataFields,
            ...formatted.data,
        },
        meta: {
            ...(envelope.meta && typeof envelope.meta === 'object' ? envelope.meta : {}),
            responseProfile: formatted.profile,
        },
    };
    return JSON.stringify(newEnvelope, null, 2);
}
// ── Test surface ───────────────────────────────────────────────
export const __testables = {
    formatQuick,
    formatResearch,
    formatResume,
    formatDebug,
    getOneLineWhy,
    buildEvidenceDigest,
    buildFollowUps,
    extractNextSteps,
    extractBlockers,
    resolveScore,
};
//# sourceMappingURL=profile-formatters.js.map