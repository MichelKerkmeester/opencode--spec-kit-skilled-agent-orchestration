# T3-15: Error Handling & Circuit Breaker Analysis (Codex gpt-5.3-codex)

## Agent: Codex CLI (read-only sandbox)
## Date: 2026-03-07
## Source: `/tmp/codex-t3-15.txt` (275 lines)

---

## Summary

Comprehensive error handling analysis of all TypeScript files in `mcp_server/` (handlers/ + lib/), classifying every `catch` block and identifying circuit breaker gaps.

### Error Handling Totals

Computed from per-file catch counts across all scanned files:

| Category | Description |
|----------|-------------|
| PROPER | catch + log + throw/reject (correct pattern) |
| SWALLOWED | catch with log-only or empty body (error silenced) |
| OVERLY_BROAD | catch with return/fallback but no re-throw (may mask failures) |

### Highest-Risk Files (by weighted risk score)

Risk score formula: `swallowed×4 + overly_broad×2 + noop_catches×5 + floating_promises + (external_api_without_circuit_breaker ? 3 : 0)`

| File | Catches | Proper | Swallowed | Overly Broad | Risk Score |
|------|:-------:|:------:|:---------:|:------------:|:----------:|
| lib/search/vector-index-schema.ts | 73 | 1 | 54 | 18 | ~254 |
| lib/session/session-manager.ts | 25 | 0 | 6 | 19 | ~62 |
| lib/storage/causal-edges.ts | 19 | 0 | 5 | 14 | ~48 |
| lib/storage/checkpoints.ts | 16 | 0 | 5 | 11 | ~42 |
| lib/storage/transaction-manager.ts | 12 | 0 | 4 | 8 | ~32 |
| lib/search/vector-index-queries.ts | 10 | 0 | 3 | 7 | ~26 |
| lib/search/vector-index-store.ts | 11 | 1 | 7 | 3 | ~34 |
| lib/storage/reconsolidation.ts | 7 | 1 | 3 | 3 | ~18 |
| lib/telemetry/consumption-logger.ts | 8 | 0 | 2 | 6 | ~20 |

### Circuit Breaker Analysis

**No circuit breaker patterns found anywhere in `mcp_server/`.** Searched for:
- `CircuitBreaker`, `circuit breaker`, `halfOpen`, `HALF_OPEN`
- `failureCount`, `consecutiveFailures`, `resetTimeout`
- `tripped`, `cooldown` (contextual — only found in user-facing messages)

**Result:** 0 circuit breaker implementations. Only false-positive matches:
- `quality-loop.ts:191` — "short-circuits" (metaphorical, not a CB pattern)
- `memory-index.ts:161` — "cooldown period" (user-facing advice string, not CB)
- `working-memory.ts:435` — "tie-breaker" (sort order, not CB)

### External API Calls Without Circuit Breakers

| File | API Calls | Risk |
|------|-----------|:----:|
| lib/search/cross-encoder.ts | `fetch()` to Voyage rerank API, Cohere rerank API, local model endpoint | HIGH |
| lib/providers/retry-manager.ts | `embeddings.create()` via OpenAI/Voyage/Cohere SDKs | HIGH |

These external API calls have retry logic (retry-manager) but no circuit breaker to prevent cascading failures during extended outages.

### Floating Promises (Sample)

Floating promises (async function calls without `await`, `.catch()`, or `void`) were scanned but none were flagged in the production code. The analysis confirmed the codebase properly awaits or handles async operations.

### No-op Catches

No `.catch(() => {})` or `.catch(() => undefined)` no-op patterns found in production code.

### Recommendations

1. **P1: vector-index-schema.ts** — 54 swallowed catches is extreme. Many are in migration/DDL code where failures are intentionally non-fatal, but should be reviewed case-by-case.
2. **P1: Add circuit breaker** for `cross-encoder.ts` external rerank calls (Voyage, Cohere) — already has retry, needs CB for sustained outage protection.
3. **P2: session-manager.ts** — 6 swallowed + 19 overly broad catches. Many are "best effort" session cleanup, but the sheer volume warrants review.
4. **P2: Add circuit breaker** for embedding provider calls in retry-manager.ts — retry queue handles transient failures but not sustained provider outages.
5. **P3: causal-edges.ts, checkpoints.ts** — edge/checkpoint operations intentionally catch and log, but should distinguish recoverable vs unrecoverable errors.
