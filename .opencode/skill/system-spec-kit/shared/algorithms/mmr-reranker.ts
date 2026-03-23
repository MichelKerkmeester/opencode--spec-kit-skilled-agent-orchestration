// ---------------------------------------------------------------
// MODULE: MMR Reranker
// ---------------------------------------------------------------
// Maximal Marginal Relevance for post-fusion diversity pruning.

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/** Default maximum number of candidates to process before MMR selection. */

// Feature catalog: Hybrid search pipeline

const DEFAULT_MAX_CANDIDATES = 20;

/* ---------------------------------------------------------------
   2. INTERFACES
   --------------------------------------------------------------- */

/** A search result candidate eligible for MMR reranking. */
export interface MMRCandidate {
  id: number | string;
  /** Relevance score from the upstream retrieval system. */
  score: number;
  /** Dense embedding vector for similarity computation. */
  embedding: Float32Array;
  content?: string;
}

/** Configuration for the MMR reranking pass. */
export interface MMRConfig {
  /** Trade-off weight: 0 = maximum diversity, 1 = maximum relevance. */
  lambda: number;
  /** Maximum number of results to return. */
  limit: number;
  /** Hard cap on input candidates processed before MMR (default 20). */
  maxCandidates?: number;
}

/* ---------------------------------------------------------------
   3. CORE FUNCTIONS
   --------------------------------------------------------------- */

/**
 * Compute cosine similarity between two embedding vectors.
 * Returns 0 when either vector has zero magnitude to avoid division by zero.
 */
export function computeCosine(
  a: Float32Array | number[],
  b: Float32Array | number[],
): number {
  if (a.length === 0 || b.length === 0) return 0;

  const maxLen = Math.max(a.length, b.length);
  const minLen = Math.min(a.length, b.length);

  if (minLen < maxLen) {
    const ratio = 1 - minLen / maxLen;
    if (ratio > 0.1) {
      throw new Error(
        `computeCosine: vector length mismatch exceeds 10% (${a.length} vs ${b.length})`,
      );
    }
    console.warn(
      `computeCosine: padding shorter vector (${minLen} → ${maxLen})`,
    );
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < maxLen; i++) {
    const ai = i < a.length ? a[i] : 0;
    const bi = i < b.length ? b[i] : 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  const result = denom === 0 ? 0 : dot / denom;
  return Number.isFinite(result) ? result : 0;
}

/**
 * Apply Maximal Marginal Relevance reranking to diversify search results.
 */
export function applyMMR(
  candidates: MMRCandidate[],
  config: MMRConfig,
): MMRCandidate[] {
  let rawLambda = config.lambda;
  const {
    limit,
    maxCandidates: rawMaxCandidates = DEFAULT_MAX_CANDIDATES,
  } = config;

  if (limit <= 0) return [];

  if (!Number.isFinite(rawLambda)) rawLambda = 0.5;
  const lambda = Math.max(0, Math.min(1, rawLambda));
  const maxCandidates = Math.max(0, rawMaxCandidates);

  const pool = candidates.slice(0, maxCandidates);
  if (pool.length === 0) return [];

  const selected: MMRCandidate[] = [];
  const remaining = new Set(pool.map((_, i) => i));

  let bestIdx = 0;
  let bestScore = -Infinity;
  for (const i of remaining) {
    if (pool[i].score > bestScore) {
      bestScore = pool[i].score;
      bestIdx = i;
    }
  }
  selected.push(pool[bestIdx]);
  remaining.delete(bestIdx);

  while (selected.length < limit && remaining.size > 0) {
    let mmrBestIdx = -1;
    let mmrBestScore = -Infinity;

    for (const i of remaining) {
      const relevance = pool[i].score;

      let maxSim = -Infinity;
      for (const sel of selected) {
        const sim = computeCosine(pool[i].embedding, sel.embedding);
        if (sim > maxSim) maxSim = sim;
      }

      const mmrScore = lambda * relevance - (1 - lambda) * maxSim;
      if (mmrScore > mmrBestScore) {
        mmrBestScore = mmrScore;
        mmrBestIdx = i;
      }
    }

    if (mmrBestIdx >= 0) {
      selected.push(pool[mmrBestIdx]);
      remaining.delete(mmrBestIdx);
    } else {
      break;
    }
  }

  return selected;
}

/* ---------------------------------------------------------------
   4. EXPORTS
   --------------------------------------------------------------- */

export { DEFAULT_MAX_CANDIDATES };
