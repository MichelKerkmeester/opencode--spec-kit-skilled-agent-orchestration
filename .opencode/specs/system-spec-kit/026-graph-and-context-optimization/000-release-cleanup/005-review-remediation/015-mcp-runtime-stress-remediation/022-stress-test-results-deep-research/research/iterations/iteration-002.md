# Iteration 002 - Live Handler Gate and Harness Parity

## Focus

Live handler embed-readiness gate trace + deterministic test seam recommendation, plus the harness-vs-handler envelope parity gap. This follows strategy iteration 2 and answers RQ2 and RQ3.

## Sources Read

- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/022-stress-test-results-deep-research/research/deep-research-strategy.md:11`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:61`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:621`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:930`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:969`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1169`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1191`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1410`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:559`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:564`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:569`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:574`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:22`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:29`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts:29`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts:46`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts:84`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts:143`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:4`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/metrics.ts:70`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/baseline.vitest.ts:47`

## Findings

- **P1 - The 30s live-handler block originates inside `handleMemorySearch` on cache miss.** The handler imports `isEmbeddingModelReady` and `waitForEmbeddingModel` from core (`memory-search.ts:61`), checks readiness only on cache misses (`memory-search.ts:927`), waits up to 30000ms (`memory-search.ts:928`), then throws `Embedding model not ready after 30s timeout. Try again later.` (`memory-search.ts:930`). Core readiness is a module-level boolean (`db-state.ts:559`, `db-state.ts:564`), and `waitForEmbeddingModel` polls every 500ms until timeout (`db-state.ts:569`, `db-state.ts:574`). Rationale: this exactly matches the v1.0.3 direct probe failure and explains why no live handler envelope emitted.

- **P1 - The live handler is wired to emit envelopes and audits after the readiness gate, so bypassing readiness is enough to test the downstream telemetry path.** `memory_search` places the `queryPlan` into `PipelineConfig` (`memory-search.ts:969`), builds a `SearchDecisionEnvelope` after pipeline execution (`memory-search.ts:1169`), attaches it to response metadata (`memory-search.ts:1191`), and records it through `recordSearchDecision` (`memory-search.ts:1410`). Rationale: the missing proof is not source wiring; it is deterministic execution through the readiness gate and pipeline.

- **P1 - Smallest deterministic live-handler seam: test-only readiness mock plus seeded pipeline/DB fixture, not probe warmup alone.** Existing memory-search tests already mock `checkDatabaseUpdated`, `waitForEmbeddingModel`, and `isEmbeddingModelReady` to avoid real DB/readiness blockage (`memory-search-integration.vitest.ts:22`, `memory-search-integration.vitest.ts:29`). Rationale: a warmup probe still depends on external model state; a test-only bypass or exported `setEmbeddingModelReady(true)` in a fixture is deterministic. To keep "live handler" meaningful, the future test should still call `handleMemorySearch`, route a seeded corpus row through the handler, and point `SPECKIT_SEARCH_DECISION_AUDIT_PATH` at a temp file.

- **P1 - Harness telemetry parity gap is structural: current harness result types cannot carry envelopes, audit rows, or shadow rows.** `SearchQualityChannelOutput` only carries candidates, refusal, citations, answer, and latency (`harness.ts:29`); `SearchQualityCaseResult` only carries per-channel candidates, final relevance, citation/refusal policy, and latency (`harness.ts:46`). The harness loops through injectable channel runners and pushes normalized captures (`harness.ts:84`, `harness.ts:113`, `harness.ts:143`). Rationale: the packet-local wrapper was necessary because there is no native telemetry slot to preserve a `SearchDecisionEnvelope` or shadow record.

- **P2 - Smallest harness change: add a telemetry-preservation field, not production imports in the DB-agnostic harness.** The corpus explicitly says fixtures encode expected outcomes and do not call production memory stores (`corpus.ts:4`), and metrics summarize quality from run cases (`metrics.ts:70`). Rationale: keep the harness database-agnostic by adding optional `telemetry` fields to `SearchQualityChannelOutput`, `SearchQualityChannelCapture`, and `SearchQualityCaseResult`, then add a new export helper or `options.telemetryBuilder` that can write envelope/audit/shadow JSONL from runner-supplied telemetry. This avoids turning the harness into a production module wrapper while making telemetry export first-class.

## New Info Ratio

0.72. The readiness origin, existing mock seam, and exact harness type gap are new relative to iteration 1.

## Open Questions Surfaced

- Should Phase K prefer a mocked readiness seam or a seeded fixture that calls `setEmbeddingModelReady(true)`?
- Should harness telemetry be runner-supplied only, or should `runSearchQualityHarness` accept a `telemetryBuilder` callback?
- Should the future live-handler test require real `executePipeline` or allow a mocked pipeline to isolate envelope/audit behavior?

## Convergence Signal

continue. RQ2 and RQ3 are answered at source level; trigger policy and cross-cycle meaning remain open.
