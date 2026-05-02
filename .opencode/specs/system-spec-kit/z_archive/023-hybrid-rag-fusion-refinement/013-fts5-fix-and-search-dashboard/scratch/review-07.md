# Review Iteration 07 — Configuration (Part 1): Feature Flags

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Feature flags, env vars, circuit breakers that could disable search channels  
**Files reviewed:** `search-flags.ts`, `bm25-index.ts`, `query-classifier.ts`, `query-router.ts`, `hybrid-search.ts`, `rollout-policy.ts`, `shared/embeddings.ts`, `cross-encoder.ts`, `retry-manager.ts`

---

## Bottom Line

No single feature flag or breaker cleanly explains "0 results for any query." Configuration can suppress individual lanes, but the `active_memory_projection` INNER JOIN remains the stronger universal-root-cause candidate.

---

## Findings

### F07-1: P1 — SPECKIT_ROLLOUT_PERCENT=0 can disable most search features

- **File:** `mcp_server/lib/cognitive/rollout-policy.ts:5-27,59-74`
- **Env var:** `SPECKIT_ROLLOUT_PERCENT` (default: `100`)
- **Description:** Every flag in `search-flags.ts` that calls `isFeatureEnabled(...)` is disabled when `SPECKIT_ROLLOUT_PERCENT=0`. That can turn off fallback, graph-context, recovery, MMR, cross-encoder, etc. However, it does NOT directly disable the base fts/vector/bm25 plumbing by itself.
- **Fix:** Check runtime env for `SPECKIT_ROLLOUT_PERCENT=0`. Add startup logging of effective rollout and resolved search flags.

### F07-2: P1 — Embedding circuit breaker can suppress vector lane

- **File:** `shared/embeddings.ts:46-57,66-99`
- **Env vars:** `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` (default: `true`), `SPECKIT_EMBEDDING_CB_THRESHOLD` (default: `3`), `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` (default: `60000`)
- **Description:** Default-on breaker opens after 3 consecutive embedding failures, suppressing embedding calls for 60s. That can disable the vector lane entirely. Should not zero ALL queries unless remaining lexical lanes are also broken.
- **Fix:** Check logs for `[embeddings] Circuit breaker OPEN`. Temporarily set `SPECKIT_EMBEDDING_CIRCUIT_BREAKER=false` for diagnosis.

### F07-3: P2 — Complexity router narrows simple queries to minimal channel set

- **File:** `query-classifier.ts:39-48`, `query-router.ts:63-71,138-163`, `hybrid-search.ts:999-1013,1054-1108`
- **Env var:** `SPECKIT_COMPLEXITY_ROUTER` (default: `true`)
- **Description:** Simple queries routed to `['vector','fts']`, moderate to `['vector','fts','bm25']`, complex to all 5. If vector is broken and FTS is empty, simple queries go to 0 while bm25/graph are excluded. Does NOT explain "all queries" since complex queries run every lane.
- **Fix:** Set `SPECKIT_COMPLEXITY_ROUTER=false` for debugging.

### F07-4: P2 — ENABLE_BM25 default recently changed but in wrong direction

- **File:** `bm25-index.ts:79-84`
- **Env var:** `ENABLE_BM25` (default: `true` when unset since commit `3571249f284` on 2026-03-31)
- **Description:** Missing env var no longer disables BM25. Change goes OPPOSITE direction of regression. Also: unrecognized non-empty values fail closed.
- **Fix:** Set `ENABLE_BM25=true` explicitly and warn on unknown values.

---

## Complete Env Var Catalog

### Global Gating
| Env var | Default | Source |
|---------|---------|--------|
| `SPECKIT_ROLLOUT_PERCENT` | `100` | `rollout-policy.ts:5-27` |

### Embedding/Vector
| Env var | Default | Source |
|---------|---------|--------|
| `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` | `true` | `shared/embeddings.ts:46` |
| `SPECKIT_EMBEDDING_CB_THRESHOLD` | `3` | `shared/embeddings.ts:49` |
| `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` | `60000` | `shared/embeddings.ts:52` |

### Channel Toggles
| Env var | Default | Source |
|---------|---------|--------|
| `ENABLE_BM25` | `true` | `bm25-index.ts:79-84` |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | `query-classifier.ts:45-48` |

### search-flags.ts (all default ON via isFeatureEnabled)
65+ flags including: `SPECKIT_SESSION_BOOST`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_MMR`, `SPECKIT_CROSS_ENCODER`, `SPECKIT_SEARCH_FALLBACK`, `SPECKIT_DEGREE_BOOST`, `SPECKIT_CONTEXT_HEADERS`, `SPECKIT_EMPTY_RESULT_RECOVERY_V1`, etc.

### Mode/Opt-in Flags
| Env var | Default | Source |
|---------|---------|--------|
| `SPECKIT_FILE_WATCHER` | `false` | `search-flags.ts:300-308` |
| `RERANKER_LOCAL` | `false` | `search-flags.ts:310-318` |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | `bounded_runtime` | `search-flags.ts:215-228` |
