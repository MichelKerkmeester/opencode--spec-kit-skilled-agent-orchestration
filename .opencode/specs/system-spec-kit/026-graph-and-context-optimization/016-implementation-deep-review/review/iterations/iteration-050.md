# Iteration 50 - test-quality - tests

## Dispatcher
- iteration: 50 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:42:04.203Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/stage2b-enrichment-extended.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2b-enrichment.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Silent-skip guards let the main cross-encoder contract tests pass even if the exported API disappears.** `T211-CE1` returns early when `crossEncoder.rerankResults` is missing, and `T211-LP1` through `T211-LP4` do the same for `calculateLengthPenalty` / `applyLengthPenalty` instead of failing the suite [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:158-225]. Those helpers are still part of the real public surface today [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:396-505; .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-584]. If a refactor drops or renames any of them, these tests would convert a production regression into a green run instead of a red one.

```json
{
  "claim": "search-limits-scoring.vitest.ts contains contract tests that silently pass when the cross-encoder exports under test disappear, so it can miss a real regression in the reranker API surface.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:158-225",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:396-505",
    ".opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-584"
  ],
  "counterevidenceSought": "I checked whether the implementation had already retired these helpers or whether another targeted suite necessarily fails on missing exports; neither was visible in the reviewed slice.",
  "alternativeExplanation": "The guards may have been added to tolerate transitional module shapes during a refactor, but the current implementation still exports the guarded symbols, so the tests are now suppressing failures on the live contract rather than handling an intentional optional API.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if another required test suite hard-fails on missing cross-encoder exports before merge, or if these helpers are explicitly documented as optional/internal-only rather than part of the supported test target."
}
```

### P2 Findings
- **`search-limits-scoring.vitest.ts` uses source-text presence/count assertions where behavior assertions are needed.** The `T211-HI1`-`T211-HI4` block opens `memory-search.ts`, `cross-encoder.ts`, and `stage3-rerank.ts` as strings and only checks occurrence counts / substring presence [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:229-267]. Because the underlying code path is executed nowhere in those tests, dead code, comments, or stale identifiers can keep the suite green while the actual option wiring regresses.
- **The shadow scheduler tests miss the concurrency/singleton guards that actually protect runtime correctness.** Production code explicitly short-circuits overlapping cycles via `evaluationInFlight`, rejects duplicate starts, and returns `false` on a second stop [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:395-397; .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:487-489; .opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:509-516]. The reviewed test file only exercises the happy-path `start -> running -> stop` flow once [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:221-263], so the no-double-scheduler / no-overlap guarantees are currently unguarded.

## Traceability Checks
- The reviewed stage-3 wiring still forwards `applyLengthPenalty` from pipeline config into `applyCrossEncoderReranking` and then into `crossEncoder.rerankResults` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146-150; .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:388-389], but `search-limits-scoring.vitest.ts` mostly verifies that via source inspection instead of execution. The code matches the intended contract; the test surface is the weak point.
- Dispatcher-suggested paths `shared-memory-handlers.vitest.ts` and `shared-payload-certainty.vitest.ts` do not exist under the current `mcp_server/tests` tree, so this iteration covered the reachable implementation-facing test files instead.

## Confirmed-Clean Surfaces
- **`session-manager.vitest.ts` + `lib/session/session-manager.ts`** — good behavioral coverage on deterministic hashing, dedup filtering, and `.claude`/`.opencode` path canonicalization; assertions operate on returned data and the backing in-memory SQLite table instead of source text.
- **`sqlite-fts.vitest.ts` + `lib/search/sqlite-fts.ts`** — solid matrix for FTS5 availability/fallback states, including compile-probe miss, missing table, no-such-module, and bm25 runtime failure paths.
- **`stage2-fusion.vitest.ts`, `stage2b-enrichment-extended.vitest.ts`, and `stage3-rerank-regression.vitest.ts`** — the reviewed assertions are mostly output-oriented (ordering, score flooring, metadata propagation) and line up with the implementation contracts they target.
- **`spec-doc-structure.vitest.ts` + `lib/validation/spec-doc-structure.ts`** — good mix of direct rule assertions and a strict `validate.sh` end-to-end pass case, which reduces false positives from pure helper-level mocking.

## Next Focus
- If a follow-on pass exists, target runtime guard coverage around `session_bootstrap` fail-closed trust handling and `shadow-evaluation-runtime` reentrancy / duplicate-start behavior.
