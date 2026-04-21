# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

Counts: P0: 0, P1: 2, P2: 2.

Confidence: high for scoped parser/test findings. The audit stayed on production/test code and did not reuse spec-doc drift findings from the prior review.

The implementation is broadly safe from crash/security regressions in the scoped surface, but it still has a correctness hole in checklist semantics: unchecked deferred or not-applicable rows keep implementation-summary-backed packets out of `complete`.

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Production parser/status derivation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Scoped regression tests |

Not reviewed as primary finding evidence: spec docs, `description.json`, `graph-metadata.json`, and the prior `review/review-report.md`.

## 3. Method

- Read packet `implementation-summary.md` and `graph-metadata.json` only to identify the code scope.
- Read both scoped code files with line numbers.
- Used grep/search for parser call sites and status-related tests.
- Checked git history for the scoped files, including the implementation commit line around `feat(026): implement all 5 remaining gap phases`.
- Ran scoped Vitest on every iteration: `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/graph-metadata-schema.vitest.ts --reporter=default`.
- All 10 Vitest runs passed with 22 tests.

## 4. Findings by Severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 findings | N/A |

### P1

| ID | Finding | Evidence |
| --- | --- | --- |
| IMPL-F001 | Deferred or not-applicable checklist items keep implementation-summary-backed packets `in_progress` | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1017`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1022` |
| IMPL-F004 | Status fallback tests miss deferred/not-applicable checklist semantics | `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:275`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:292`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:309` |

### P2

| ID | Finding | Evidence |
| --- | --- | --- |
| IMPL-F002 | Ordered markdown task lists are invisible to checklist completion | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1018`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1020` |
| IMPL-F003 | Non-canonical status strings can be persisted as derived status | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:153`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:174`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:40` |

## 5. Findings by Dimension

Correctness:

- IMPL-F001: checklist completion currently has no concept of accepted deferral or not-applicable rows.
- IMPL-F002: ordered task-list syntax is not recognized.

Security:

- No findings. Canonical doc reads are fixed-name reads, absolute key-file candidates are rejected, and graph metadata writes remain specs-root guarded.

Robustness:

- IMPL-F003: unbounded status vocabulary can leak typos/custom statuses into derived metadata.

Testing:

- IMPL-F004: the focused tests miss the deferred/not-applicable semantics needed to prevent IMPL-F001 from recurring.

## 6. Adversarial Self-Check for P0

No P0 findings were raised.

P0 challenge performed:

- Crash path: unreadable canonical docs return `unknown`, covered by parser behavior and tests.
- Security path: fixed canonical doc names and specs-root write validation prevent the scoped status fallback from adding traversal or write expansion.
- Wrong semantics path: checklist semantics are wrong enough to be P1, not P0, because they misclassify metadata status but do not destroy data or execute writes outside the packet.

## 7. Remediation Order

1. Fix IMPL-F001 by teaching checklist evaluation to distinguish blocking unchecked items from accepted deferred/not-applicable rows, or by formalizing that any unchecked row is blocking and updating packet closeout rules accordingly.
2. Add IMPL-F004 tests before or with the parser change.
3. Decide whether ordered task lists should be supported; either support them or document/validate against them.
4. Bound `derived.status` to canonical values or map unknown frontmatter values to `unknown`.

## 8. Test Additions Needed

- `implementation-summary.md` exists, checklist contains checked P0/P1 rows plus unchecked P2 `[DEFERRED: ...]`, expected derived status is the agreed completion state.
- Checklist contains unchecked not-applicable rows, expected derived status is the agreed completion state.
- Checklist contains ordered `1. [x] ...` task-list rows, expected behavior is either complete or explicit rejection.
- Frontmatter status contains an unknown typo, expected derived status does not silently persist an arbitrary value.

## 9. Appendix: Iteration List and Churn

| Iteration | Dimension | New findings | Churn | Vitest |
| --- | --- | ---: | ---: | --- |
| 001 | correctness | 2 | 0.60 | PASS |
| 002 | security | 0 | 0.12 | PASS |
| 003 | robustness | 1 | 0.18 | PASS |
| 004 | testing | 1 | 0.50 | PASS |
| 005 | correctness | 0 | 0.08 | PASS |
| 006 | security | 0 | 0.07 | PASS |
| 007 | robustness | 0 | 0.06 | PASS |
| 008 | testing | 0 | 0.04 | PASS |
| 009 | correctness | 0 | 0.03 | PASS |
| 010 | security | 0 | 0.02 | PASS |

Convergence: all four dimensions covered, final severity-weighted new findings ratio 0.00, and the final three iterations had churn <= 0.05.
