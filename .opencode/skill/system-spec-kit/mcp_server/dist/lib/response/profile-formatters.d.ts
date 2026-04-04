/** Supported response profile names. */
export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
/** Generic search result entry as it arrives in the response data. */
export interface SearchResultEntry extends Record<string, unknown> {
    id?: number | string;
    score?: number;
    rrfScore?: number;
    intentAdjustedScore?: number;
    similarity?: number;
    content?: string;
    file_path?: string;
    contextType?: string;
    context_type?: string;
    importance_tier?: string;
    memoryState?: string;
    why?: {
        summary?: string;
        topSignals?: string[];
        channelContribution?: Record<string, number>;
    };
    confidence?: {
        label?: string;
        value?: number;
        drivers?: string[];
    };
}
/** Input to the profile formatter: the parsed response envelope data. */
export interface ProfileFormatterInput {
    results: SearchResultEntry[];
    summary?: string;
    hints?: string[];
    meta?: Record<string, unknown>;
    /** Extra fields from the envelope (passed through in non-omitting profiles). */
    [key: string]: unknown;
}
/** Output of the `quick` profile formatter. */
export interface QuickProfile {
    topResult: SearchResultEntry | null;
    oneLineWhy: string;
    omittedCount: number;
    tokenReduction: {
        originalTokens: number;
        returnedTokens: number;
        savingsPercent: number;
    };
}
/** Output of the `research` profile formatter. */
export interface ResearchProfile {
    results: SearchResultEntry[];
    evidenceDigest: string;
    followUps: string[];
    count: number;
}
/** Output of the `resume` profile formatter. */
export interface ResumeProfile {
    state: string;
    nextSteps: string[];
    blockers: string[];
    topResult: SearchResultEntry | null;
}
/** Output of the `debug` profile formatter — passthrough + tokenStats. */
export interface DebugProfile {
    results: SearchResultEntry[];
    summary: string;
    hints: string[];
    meta: Record<string, unknown>;
    tokenStats: {
        totalTokens: number;
        resultCount: number;
        avgTokensPerResult: number;
    };
}
/** Union of all profile outputs. */
export type FormattedProfile = {
    profile: 'quick';
    data: QuickProfile;
} | {
    profile: 'research';
    data: ResearchProfile;
} | {
    profile: 'resume';
    data: ResumeProfile;
} | {
    profile: 'debug';
    data: DebugProfile;
};
import { isResponseProfileEnabled } from '../search/search-flags.js';
/**
 * Returns true when SPECKIT_RESPONSE_PROFILE_V1 is enabled.
 * Default: ON (graduated). Set SPECKIT_RESPONSE_PROFILE_V1=false to disable.
 */
export { isResponseProfileEnabled };
declare function resolveScore(result: SearchResultEntry): number;
declare function getOneLineWhy(result: SearchResultEntry, rank: number): string;
declare function buildEvidenceDigest(results: SearchResultEntry[]): string;
declare function buildFollowUps(results: SearchResultEntry[]): string[];
declare function extractNextSteps(results: SearchResultEntry[]): string[];
declare function extractBlockers(results: SearchResultEntry[]): string[];
/**
 * Format results as the `quick` profile.
 * Returns only the top result with a one-line explanation and an
 * omitted count. Maximises token reduction.
 */
declare function formatQuick(input: ProfileFormatterInput): QuickProfile;
/**
 * Format results as the `research` profile.
 * Returns all results with a synthesised evidence digest and
 * suggested follow-up queries.
 */
declare function formatResearch(input: ProfileFormatterInput): ResearchProfile;
/**
 * Format results as the `resume` profile.
 * Extracts state, next steps, and blockers — optimised for session
 * continuation workflows.
 */
declare function formatResume(input: ProfileFormatterInput): ResumeProfile;
/**
 * Format results as the `debug` profile.
 * Passthrough — all data preserved. Adds token statistics.
 */
declare function formatDebug(input: ProfileFormatterInput): DebugProfile;
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
export declare function applyResponseProfile(profile: string, input: ProfileFormatterInput, forceEnabled?: boolean): FormattedProfile | null;
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
export declare function applyProfileToEnvelope(profile: string, envelopeText: string, forceEnabled?: boolean): string;
export declare const __testables: {
    formatQuick: typeof formatQuick;
    formatResearch: typeof formatResearch;
    formatResume: typeof formatResume;
    formatDebug: typeof formatDebug;
    getOneLineWhy: typeof getOneLineWhy;
    buildEvidenceDigest: typeof buildEvidenceDigest;
    buildFollowUps: typeof buildFollowUps;
    extractNextSteps: typeof extractNextSteps;
    extractBlockers: typeof extractBlockers;
    resolveScore: typeof resolveScore;
};
//# sourceMappingURL=profile-formatters.d.ts.map