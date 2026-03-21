// ───────────────────────────────────────────────────────────────
// MODULE: Eval Channel Tracking
// ───────────────────────────────────────────────────────────────
// Extracted from handlers/memory-search.ts
// Utilities for collecting eval channel attribution, resolving
// scores, building per-channel payloads, and summarizing graph
// walk diagnostics for telemetry.

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface EvalChannelPayload {
  channel: string;
  resultMemoryIds: number[];
  scores: number[];
}

interface GraphWalkDiagnostics {
  rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
  rowsWithGraphContribution: number;
  rowsWithAppliedBonus: number;
  capAppliedCount: number;
  maxRaw: number;
  maxNormalized: number;
  maxAppliedBonus: number;
}

/* ───────────────────────────────────────────────────────────────
   2. FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Resolve the best available numeric score from a result row.
 * Checks `score`, then `similarity`, then `rrfScore` — returns 0 if none found.
 */
function resolveEvalScore(row: Record<string, unknown>): number {
  const score = row.score;
  if (typeof score === 'number' && Number.isFinite(score)) {
    return score;
  }

  const similarity = row.similarity;
  if (typeof similarity === 'number' && Number.isFinite(similarity)) {
    return similarity;
  }

  const rrfScore = row.rrfScore;
  if (typeof rrfScore === 'number' && Number.isFinite(rrfScore)) {
    return rrfScore;
  }

  return 0;
}

/**
 * Collect all eval channel attributions from a result row.
 * Checks `sources` (array), `source` (string), and `channelAttribution` (array).
 * Falls back to `['hybrid']` if no channels are found.
 */
function collectEvalChannelsFromRow(row: Record<string, unknown>): string[] {
  const channels = new Set<string>();

  if (Array.isArray(row.sources)) {
    for (const source of row.sources) {
      if (typeof source === 'string' && source.trim().length > 0) {
        channels.add(source.trim());
      }
    }
  }

  if (typeof row.source === 'string' && row.source.trim().length > 0) {
    channels.add(row.source.trim());
  }

  if (Array.isArray(row.channelAttribution)) {
    for (const source of row.channelAttribution) {
      if (typeof source === 'string' && source.trim().length > 0) {
        channels.add(source.trim());
      }
    }
  }

  if (channels.size === 0) {
    channels.add('hybrid');
  }

  return Array.from(channels);
}

/**
 * Build per-channel eval payloads from an array of result rows.
 * Groups results by channel, deduplicates by memory ID (keeping highest score).
 */
function buildEvalChannelPayloads(rows: Array<Record<string, unknown>>): EvalChannelPayload[] {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  const byChannel = new Map<string, Map<number, number>>();

  for (const row of rows) {
    const rawId = row.id;
    if (typeof rawId !== 'number' || !Number.isInteger(rawId) || rawId <= 0) {
      continue;
    }

    const score = resolveEvalScore(row);
    const channels = collectEvalChannelsFromRow(row);

    for (const channel of channels) {
      const bucket = byChannel.get(channel) ?? new Map<number, number>();
      const existing = bucket.get(rawId);
      if (existing === undefined || score > existing) {
        bucket.set(rawId, score);
      }
      byChannel.set(channel, bucket);
    }
  }

  return Array.from(byChannel.entries()).map(([channel, idToScore]): EvalChannelPayload => {
    const entries = Array.from(idToScore.entries());
    return {
      channel,
      resultMemoryIds: entries.map(([id]) => id),
      scores: entries.map(([, score]) => score),
    };
  });
}

/**
 * Summarize graph walk diagnostics from result rows for telemetry.
 * Inspects `trace.graphContribution` on each row.
 */
function summarizeGraphWalkDiagnostics(
  rows: Array<Record<string, unknown>>,
): GraphWalkDiagnostics {
  let rolloutState: 'off' | 'trace_only' | 'bounded_runtime' = 'off';
  let rowsWithGraphContribution = 0;
  let rowsWithAppliedBonus = 0;
  let capAppliedCount = 0;
  let maxRaw = 0;
  let maxNormalized = 0;
  let maxAppliedBonus = 0;

  for (const row of rows) {
    const trace = row.trace && typeof row.trace === 'object'
      ? row.trace as Record<string, unknown>
      : null;
    const graphContribution = trace?.graphContribution && typeof trace.graphContribution === 'object'
      ? trace.graphContribution as Record<string, unknown>
      : null;
    if (!graphContribution) {
      continue;
    }

    rowsWithGraphContribution += 1;
    if (graphContribution.rolloutState === 'trace_only' || graphContribution.rolloutState === 'bounded_runtime') {
      rolloutState = graphContribution.rolloutState;
    }
    if (typeof graphContribution.appliedBonus === 'number' && graphContribution.appliedBonus > 0) {
      rowsWithAppliedBonus += 1;
      maxAppliedBonus = Math.max(maxAppliedBonus, graphContribution.appliedBonus);
    }
    if (graphContribution.capApplied === true) {
      capAppliedCount += 1;
    }
    if (typeof graphContribution.raw === 'number' && Number.isFinite(graphContribution.raw)) {
      maxRaw = Math.max(maxRaw, graphContribution.raw);
    }
    if (typeof graphContribution.normalized === 'number' && Number.isFinite(graphContribution.normalized)) {
      maxNormalized = Math.max(maxNormalized, graphContribution.normalized);
    }
  }

  return {
    rolloutState,
    rowsWithGraphContribution,
    rowsWithAppliedBonus,
    capAppliedCount,
    maxRaw,
    maxNormalized,
    maxAppliedBonus,
  };
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  resolveEvalScore,
  collectEvalChannelsFromRow,
  buildEvalChannelPayloads,
  summarizeGraphWalkDiagnostics,
};

export type {
  EvalChannelPayload,
  GraphWalkDiagnostics,
};
