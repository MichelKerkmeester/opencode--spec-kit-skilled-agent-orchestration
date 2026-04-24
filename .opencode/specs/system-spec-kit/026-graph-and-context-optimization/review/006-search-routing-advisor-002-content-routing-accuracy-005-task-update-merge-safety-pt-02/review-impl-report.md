# Implementation Deep Review Report

## 1. Executive Summary

Verdict: changes requested.

Counts: P0 = 1, P1 = 2, P2 = 0. Confidence: high for the security containment gap and task-id matching bug because both are grounded in direct code paths and current scoped tests do not exercise the risky cases.

All 10 requested iterations completed. Convergence criteria are met: all four dimensions were covered, final three iterations had zero churn, and the final severity-weighted new-findings ratio was 0.

## 2. Scope

Primary packet code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts` | Merge guard and task-update matching |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Canonical routed save integration |
| `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts` | Merge guard tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | Handler-level routed task-update tests |

Related production code read to verify the Tier 3 security path: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`.

Spec docs were not reviewed for drift. Findings that cite only Markdown, `description.json`, or `graph-metadata.json` were excluded.

## 3. Method

Ran the required scoped Vitest command at every iteration:

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/anchor-merge-operation.vitest.ts tests/handler-memory-save.vitest.ts --reporter=default`

Each run passed with `2 passed` test files and `77 passed | 3 skipped` tests.

Checked git history with `git log --stat` for the audited files. The packet implementation landed in `29624f3a71 feat(026): implement all 5 remaining gap phases`; later commits `d640f4617d`, `b960887dbf`, `434e283db4`, and `ba0dbea718` touched the same handler/test surface.

Used `rg`, `find`, `nl -ba`, and direct file reads to verify code layout, line evidence, and absence of targeted tests for the edge cases.

## 4. Findings By Severity

| Severity | ID | Finding | Required Code Evidence |
| --- | --- | --- | --- |
| P0 | P0-IMPL-001 | Tier 3 `target_doc` can escape the spec folder before canonical merge writes | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1443`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1503`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859` |
| P1 | P1-IMPL-002 | Task update matching treats dependency mentions as target-task matches | `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:542`, `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:573`, `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:576`, `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts:464` |
| P1 | P1-IMPL-003 | Focused tests miss the two high-risk negative cases introduced by routing and merge safety | `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:405`, `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts:434`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1494`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625` |

No P2 findings.

## 5. Findings By Dimension

Correctness: `P1-IMPL-002`. The merge guard matches any occurrence of `Tnnn` or `CHK-nnn` on a checklist line, so dependency text can be counted as the target task.

Security: `P0-IMPL-001`. Tier 3 response validation preserves arbitrary `target_doc` strings, and `memory-save.ts` resolves those strings with `path.join` without an allowlist or containment check before reading and merging.

Robustness: no standalone new finding. Existing merge-error surfacing paths return rejected results without mutating files for the tested zero/duplicate cases.

Testing: `P1-IMPL-003`. The current focused tests cover zero-match, duplicate-own-id, and benign Tier 3 routing, but not the two edge cases that would expose the open P0/P1 issues.

## 6. Adversarial Self-Check For P0

`P0-IMPL-001` is reproducible by code inspection without needing a new test file:

Expected: a Tier 3 target document is one of the canonical routing docs or is proven to stay under `specFolderAbsolute`.

Actual:

- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859` carries through any string `raw.target_doc`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160` resolves non-special targets with `path.join(specFolderAbsolute, routedDocPath)`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427` uses `effectiveDecision.target.docPath`.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1443` reads the resulting path and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1503` sends it to the merge operation.

There is no containment guard between those steps. A malicious or compromised Tier 3 service can return a high-confidence non-drop route with `target_doc` containing `../` segments. If the escaped target exists and has the requested anchor, the canonical merge path can write outside the packet.

## 7. Remediation Order

1. Fix `P0-IMPL-001`: add a canonical routed target allowlist, reject `..` and absolute-looking target docs, resolve with `path.resolve`, and require the resolved path to remain under `specFolderAbsolute`.
2. Fix `P1-IMPL-002`: parse checklist lines so the target id must appear in the item identifier slot immediately after the checkbox, or otherwise use a structured task-line parser shared by prevalidation and in-anchor update.
3. Fix `P1-IMPL-003`: add regression tests for both fixes before changing behavior.

## 8. Test Additions Needed

Add an `anchorMergeOperation` test where `T002` is the own identifier on one checklist line and appears as dependency text on a different checklist line. The expected behavior should update only the own `T002` line.

Add a handler-level task-update test with the same dependency mention shape to prove `atomicSaveMemory` no longer rejects the legitimate update as ambiguous.

Add a Tier 3 natural-routing test whose mocked JSON response returns `target_doc: '../escaped.md'` or another traversal attempt. The expected behavior should be `success: false`, `status: 'rejected'`, and no filesystem mutation outside the spec folder.

Add a benign Tier 3 test to prove canonical allowlisted targets such as `implementation-summary.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `handover.md`, and `research/research.md` still route.

## 9. Appendix: Iteration List + Churn

| Iteration | Dimension | New Findings | Churn |
| --- | --- | --- | --- |
| 001 | correctness | P1-IMPL-002 | 1.00 |
| 002 | security | P0-IMPL-001 | 1.00 |
| 003 | robustness | none | 0.00 |
| 004 | testing | P1-IMPL-003 | 0.50 |
| 005 | correctness | none | 0.00 |
| 006 | security | none | 0.00 |
| 007 | robustness | none | 0.00 |
| 008 | testing | none | 0.00 |
| 009 | correctness | none | 0.00 |
| 010 | security | none | 0.00 |

Artifacts:

- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `review-impl/iterations/iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `review-impl/deltas/iter-010.jsonl`
- `review-impl/review-impl-report.md`
