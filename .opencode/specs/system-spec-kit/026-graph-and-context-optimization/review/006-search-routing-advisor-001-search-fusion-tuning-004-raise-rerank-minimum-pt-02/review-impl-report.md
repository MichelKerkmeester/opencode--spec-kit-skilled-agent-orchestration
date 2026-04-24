# Implementation Deep Review Report: 004-raise-rerank-minimum

## Executive summary

Verdict: PASS with implementation advisories.

Counts: P0 = 0, P1 = 1, P2 = 2. Confidence: medium-high for the audited implementation surface.

The shipped threshold change is present and the direct 3-row/4-row boundary works for both the mocked cross-encoder path and mocked local GGUF path. The surviving issues are not spec-doc drift. They are code/test concerns around what the threshold counts in the real Stage 3 order and whether tests cover the full production path.

## Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Production Stage 3 rerank gate, local/remote provider branch, MPAB collapse |
| `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts` | Threshold-sensitive Stage 3 regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts` | Local reranker guardrail coverage named by the packet verification |

Context-only files used to discover scope:

| File | Use |
| --- | --- |
| `implementation-summary.md` | Identified claimed implementation and verification files |
| `graph-metadata.json` | Cross-checked derived key files |

Spec docs were not reviewed for drift in this pass, and spec-doc-only findings from the prior `review/` packet were not carried forward.

## Method

Vitest was run once per iteration:

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts --reporter=default`

All 10 runs passed: `2` files, `23` tests each run.

Git history checks:

| Commit | Relevance |
| --- | --- |
| `d8ea31810c feat(026): implement 10 sub-phases + 30-iteration deep review` | Actual implementation commit for `MIN_RESULTS_FOR_RERANK` from 2 to 4 and boundary tests |
| `2958485d9f refactor(026): reorganize phase folders from 7 to 11 focused phases` | Packet reorganization commit recorded as `closed_by_commit` |

Search/read method:

- Read the packet implementation summary and graph metadata for scope only.
- Read Stage 3 rerank implementation and the two named Vitest files with line numbers.
- Used `rg` for exact symbol/layout checks around `MIN_RESULTS_FOR_RERANK`, `applyCrossEncoderReranking`, `rerankLocal`, and candidate slicing.
- CocoIndex MCP search was attempted but returned cancelled; `ccc search` fallback failed because the sandbox could not access `/Users/michelkerkmeester/.cocoindex_code/daemon.log`.

## Findings by severity

### P0

| ID | Finding | Code evidence | Status |
| --- | --- | --- | --- |
| None | No P0 findings | - | - |

### P1

| ID | Finding | Code evidence | Status |
| --- | --- | --- | --- |
| IMPL-F001 | No `executeStage3` boundary test covers the rerank threshold before MPAB chunk collapse | `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:146`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:253`, `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:137`, `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:165` | Open |

### P2

| ID | Finding | Code evidence | Status |
| --- | --- | --- | --- |
| IMPL-F002 | The minimum rerank gate counts raw rows, not distinct documents after chunk collapse | `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:492`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:534` | Open |
| IMPL-F003 | Local reranker candidate-cap test does not exercise the production cap path | `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:259`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:292`, `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:291`, `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts:306` | Open |

## Findings by dimension

| Dimension | Findings |
| --- | --- |
| correctness | IMPL-F002 |
| security | None |
| robustness | None |
| testing | IMPL-F001, IMPL-F003 |

## Adversarial self-check for P0

No P0 was found.

Self-check performed:

- Re-read the actual threshold line and branch: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:49` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:321`.
- Verified the direct boundary tests prove the isolated behavior: `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:145` through `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:162`.
- Re-ran the scoped Vitest command 10 times with all runs passing.

Expected vs actual for the strongest possible P0 claim:

| Claim | Expected | Actual | P0? |
| --- | --- | --- | --- |
| Three raw candidates should skip rerank | `applied === false`, no provider call | Covered and passing in tests | No |
| Four raw candidates should apply rerank | `applied === true`, one provider call | Covered and passing in tests | No |
| Local GGUF path should share the same raw-row threshold | Three skips, four applies | Covered through mocked local provider | No |

The remaining concerns are coverage and threshold unit semantics, not crash/data-loss/security defects.

## Remediation order

1. Add a full `executeStage3()` test with four chunk rows that collapse to fewer than four parent documents. Decide whether the desired behavior is "rerank raw chunks" or "rerank only when distinct parent/document count is at least four", then assert that policy directly.
2. If the desired unit is final parent documents, change the Stage 3 gate to count distinct parent/document identities before provider invocation. If the desired unit is raw chunks, update the comment and test name to say "rows/chunks" rather than "docs".
3. Replace the local-reranker cap test with a mocked model/context path that reaches the scoring loop and asserts only the first 50 candidates are scored.

## Test additions needed

| Test | Purpose |
| --- | --- |
| `executeStage3` with 3 non-chunk rows | Prove full-stage metadata and provider calls match direct guard |
| `executeStage3` with 4 non-chunk rows | Prove full-stage apply path |
| `executeStage3` with 4 chunk rows / 1 parent | Freeze the intended threshold unit around MPAB |
| `local-reranker` mocked successful model with 60 candidates | Prove production `MAX_RERANK_CANDIDATES` cap, not just JavaScript slice behavior |

## Appendix: iteration list + churn

| Iteration | Dimension | New findings | Churn | Delta |
| --- | --- | --- | --- | --- |
| 001 | correctness | IMPL-F002 | 1.000 | `review-impl/deltas/iter-001.jsonl` |
| 002 | security | none | 0.000 | `review-impl/deltas/iter-002.jsonl` |
| 003 | robustness | none | 0.000 | `review-impl/deltas/iter-003.jsonl` |
| 004 | testing | IMPL-F001 | 0.500 | `review-impl/deltas/iter-004.jsonl` |
| 005 | correctness | none | 0.000 | `review-impl/deltas/iter-005.jsonl` |
| 006 | security | none | 0.000 | `review-impl/deltas/iter-006.jsonl` |
| 007 | robustness | none | 0.000 | `review-impl/deltas/iter-007.jsonl` |
| 008 | testing | IMPL-F003 | 0.333 | `review-impl/deltas/iter-008.jsonl` |
| 009 | correctness | none | 0.000 | `review-impl/deltas/iter-009.jsonl` |
| 010 | security | none | 0.000 | `review-impl/deltas/iter-010.jsonl` |
