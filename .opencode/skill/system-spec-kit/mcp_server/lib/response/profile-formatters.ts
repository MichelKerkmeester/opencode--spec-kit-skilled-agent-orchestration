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
import { resolveEffectiveScore, type PipelineRow } from '../search/pipeline/types.js';

// ── Types ──────────────────────────────────────────────────────

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
export type FormattedProfile =
  | { profile: 'quick'; data: QuickProfile }
  | { profile: 'research'; data: ResearchProfile }
  | { profile: 'resume'; data: ResumeProfile }
  | { profile: 'debug'; data: DebugProfile };

// ── Feature flag ──────────────────────────────────────────────

import { isResponseProfileEnabled } from '../search/search-flags.js';

/**
 * Returns true when SPECKIT_RESPONSE_PROFILE_V1 is enabled.
 * Default: ON (graduated). Set SPECKIT_RESPONSE_PROFILE_V1=false to disable.
 */
export { isResponseProfileEnabled };

// ── Internal helpers ──────────────────────────────────────────

function resolveScore(result: SearchResultEntry): number {
  const row: PipelineRow = {
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

function getOneLineWhy(result: SearchResultEntry, rank: number): string {
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

function buildEvidenceDigest(results: SearchResultEntry[]): string {
  if (results.length === 0) return 'No results found.';

  const contextTypes = [...new Set(
    results
      .map(r => r.contextType ?? r.context_type)
      .filter((ct): ct is string => typeof ct === 'string' && ct.length > 0)
  )];

  const tiers = [...new Set(
    results
      .map(r => r.importance_tier)
      .filter((t): t is string => typeof t === 'string' && t.length > 0)
  )];

  const avgScore = results.reduce((sum, r) => sum + resolveScore(r), 0) / results.length;

  const parts: string[] = [
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

function buildFollowUps(results: SearchResultEntry[]): string[] {
  const followUps: string[] = [];

  if (results.length === 0) {
    followUps.push('Try broadening the query or removing specFolder filter');
    return followUps;
  }

  // Suggest anchor-specific follow-up if anchors were matched
  const anchoredResults = results.filter(
    r => r.why?.topSignals?.some(s => s.startsWith('anchor:'))
  );
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
      const fp = r.file_path as string | undefined;
      if (!fp) return null;
      const match = fp.match(/specs\/([^/]+\/[^/]+)\//);
      return match ? match[1] : null;
    })
    .filter((f): f is string => f !== null);
  const uniqueFolders = [...new Set(specFolders)];
  if (uniqueFolders.length === 1) {
    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
  }

  return followUps.slice(0, 3);
}

function extractNextSteps(results: SearchResultEntry[]): string[] {
  const steps: string[] = [];

  for (const result of results.slice(0, 3)) {
    const why = result.why;
    if (!why) continue;

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

function extractBlockers(results: SearchResultEntry[]): string[] {
  const blockers: string[] = [];

  const lowConfidence = results.filter(r => r.confidence?.label === 'low');
  if (lowConfidence.length > 0) {
    blockers.push(`${lowConfidence.length} result(s) have low confidence scores`);
  }

  const archivedOrCold = results.filter(
    r => r.memoryState === 'COLD' || r.memoryState === 'ARCHIVED'
  );
  if (archivedOrCold.length > 0) {
    blockers.push(`${archivedOrCold.length} result(s) are cold/archived — may be stale`);
  }

  return blockers;
}

function computeTokenStats(text: string, resultCount: number) {
  const totalTokens = estimateTokens(text);
  return {
    totalTokens,
    resultCount,
    avgTokensPerResult: resultCount > 0 ? Math.round(totalTokens / resultCount) : 0,
  };
}

function getPreservedDataFields(data: Record<string, unknown>): Record<string, unknown> {
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
function formatQuick(input: ProfileFormatterInput): QuickProfile {
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
function formatResearch(input: ProfileFormatterInput): ResearchProfile {
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
function formatResume(input: ProfileFormatterInput): ResumeProfile {
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
function formatDebug(input: ProfileFormatterInput): DebugProfile {
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
export function applyResponseProfile(
  profile: string,
  input: ProfileFormatterInput,
  forceEnabled?: boolean
): FormattedProfile | null {
  const enabled = forceEnabled !== undefined ? forceEnabled : isResponseProfileEnabled();
  if (!enabled) return null;

  const safeResults: SearchResultEntry[] = Array.isArray(input.results) ? input.results : [];
  const safeInput: ProfileFormatterInput = { ...input, results: safeResults };

  switch (profile as ResponseProfile) {
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
export function applyProfileToEnvelope(
  profile: string,
  envelopeText: string,
  forceEnabled?: boolean
): string {
  const enabled = forceEnabled !== undefined ? forceEnabled : isResponseProfileEnabled();
  if (!enabled) return envelopeText;

  let envelope: Record<string, unknown>;
  try {
    envelope = JSON.parse(envelopeText) as Record<string, unknown>;
  } catch {
    return envelopeText;
  }

  const data = (envelope.data && typeof envelope.data === 'object')
    ? envelope.data as Record<string, unknown>
    : null;

  if (!data) return envelopeText;

  const results: SearchResultEntry[] = Array.isArray(data.results)
    ? data.results as SearchResultEntry[]
    : [];
  const preservedDataFields = getPreservedDataFields(data);

  const formatterInput: ProfileFormatterInput = {
    results,
    summary: typeof envelope.summary === 'string' ? envelope.summary : undefined,
    hints: Array.isArray(envelope.hints) ? envelope.hints as string[] : undefined,
    meta: (envelope.meta && typeof envelope.meta === 'object')
      ? envelope.meta as Record<string, unknown>
      : undefined,
  };

  const formatted = applyResponseProfile(profile, formatterInput, forceEnabled);
  if (!formatted) return envelopeText;

  const newEnvelope: Record<string, unknown> = {
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
