---
title: "Tasks: Review Remediation (010/007)"
description: "Themed task list — 21 P1 + 12 actionable P2 findings"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Review Remediation (010/007)

<!-- SPECKIT_LEVEL: 2 -->

## T-A — `detect_changes` MCP Wiring Decision (P1)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| R-007-2 | Decide: wire `detect_changes` as MCP tool OR mark internal-only across all docs | pending | Branch decision; affects T-B |
| R-007-14 | Sync chosen path across `code_graph/tools/code-graph-tools.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `handlers/index.ts`, 6 umbrella docs | pending | After R-007-2 |

## T-B — Verification Evidence Sync (P1, after T-A)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| R-007-1 | Update 001 implementation-summary status to reflect post-scrub state (no LICENSE quote needed) | pending | Trivial — minutes |
| R-007-5 | Run vitest + tsc + validate.sh for 002; capture real output in implementation-summary | pending | |
| R-007-7 | Run vitest + tsc + validate.sh for 003; capture real output | pending | |
| R-007-15 | Run sk-doc DQI scoring + validate.sh for 006; capture real output | pending | |
| R-007-19 | Update 002 checklist to remove premature PASS marks | pending | |
| R-007-20 | Update 003 checklist to remove premature PASS marks | pending | |
| R-007-21 | Update 005 checklist to remove premature PASS marks | pending | |

## T-C — Public API Surface Gaps (P1, parallel with T-D/E/F)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| R-007-6 | Add `minConfidence` to `tool-input-schemas.ts` strict Zod, `tool-schemas.ts` JSON, allowed-parameter ledger; extend `tool-input-schema.vitest.ts` | pending | |
| R-007-10 | Decide: expose `affordances` via advisor-recommend input schema OR document compile-time-only; sync `advisor-tool-schemas.ts` + `advisor-recommend.ts` | pending | |

## T-D — Sanitization Hardening (P1+P2)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| R-007-3 | Diff-parser: canonicalize each candidate path; reject anything outside `canonicalRootDir` (`code_graph/handlers/detect-changes.ts:122-152`) | pending | P1 security |
| R-007-4 | Diff-parser: track expected hunk line counts so multi-file diffs don't eat the next file's headers (`code_graph/lib/diff-parser.ts:179-190`) | pending | P1 correctness |
| R-007-8 | Compiler: decide `conflicts_with` affordance contract (validate-or-serialize) (`skill_graph_compiler.py:834-847`) | pending | P1 |
| R-007-9 | Affordance-normalizer: broaden prompt-injection denylist in both TS + PY (`affordance-normalizer.ts:59`, `skill_graph_compiler.py:59`) | pending | P1 |
| R-007-11 | Trust-badges: reject incomplete explicit `trustBadges` (or merge per-field) (`formatters/search-results.ts:235-246, 609-613`) | pending | P1 |
| R-007-P2-1 | Phase runner: reject duplicate `output` keys same as duplicate names (`code_graph/lib/phase-runner.ts:87-89, 174-186`) | pending | P2 |
| R-007-P2-3 | Edge metadata: allowlist `reason`/`step` on read path (`code-graph-db.ts:763`, `query.ts:614-615`, `code-graph-context.ts:545`) | pending | P2 |
| R-007-P2-8 | Shared adversarial fixture for TS + PY sanitizers (`tests/affordance-normalizer.test.ts:51`, `python/test_skill_advisor.py:1457`) | pending | P2 |
| R-007-P2-10 | Memory: sanitize/cap explicit `extractionAge`/`lastAccessAge` strings (`formatters/search-results.ts:239-243`) | pending | P2 |
| R-007-P2-11 | Memory: trace flag `{attempted, derivedCount, failureReason}` for badge derivation (`formatters/search-results.ts:271-275, 348-350`) | pending | P2 |

## T-E — Test Rig Fixes (P1, parallel)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| R-007-13 | Trust-badges: rewrite mock-resolution via DI override or real-DB fixture; unskip describe block (`tests/memory/trust-badges.test.ts:77`) | pending | P1 — addresses Wave-3 known follow-up |

## T-F — Doc + Label Cleanup (P1+P2)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| R-007-12 | Memory_search cache: include causal-edge generation in cache key (`handlers/memory-search.ts:880-1190`, `lib/cache/tool-cache.ts:56-58`) | pending | P1 — staleness fix |
| R-007-16 | INSTALL_GUIDE: fix Python smoke-test path (after `cd .../mcp_server`, use `skill_advisor/tests/python/test_skill_advisor.py`) (`INSTALL_GUIDE.md:521`) | pending | P1 |
| R-007-17 | Tool-count canonicalization across umbrella docs (root README, system-spec-kit/README.md) | pending | P1 |
| R-007-18 | Restore or remove `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` link in root README | pending | P1 |
| R-007-P2-2 | Wrap `runPhases` in try/finally so error metrics emit (`code_graph/lib/structural-indexer.ts:1407-1516`) | pending | P2 |
| R-007-P2-4 | `computeBlastRadius`: request `limit + 1` to detect true overflow (`query.ts:859, 897`) | pending | P2 |
| R-007-P2-5 | `computeBlastRadius`: multi-subject seed preservation when sibling fails (`query.ts:1048-1058`) | pending | P2 |
| R-007-P2-6 | Failure-fallback: stable `code` + warning log/metric (`query.ts:1121-1135`) | pending | P2 |
| R-007-P2-7 | Extract shared relationship-edge mapper from 4 switch branches (`query.ts:1229, 1258, 1287, 1315`) | pending | P2 |
| R-007-P2-9 | Affordance debug counters for received/accepted/dropped-unsafe/dropped-empty/dropped-unknown (`affordance-normalizer.ts:153-157`, `skill_graph_compiler.py:407`) | pending | P2 |
| R-007-P2-12 | Add phase-naming alias note (012 → 010) in 6 sub-phase doc headers OR normalize labels | pending | P2 |

## Cross-cutting tasks

| ID | Task | Status |
|----|------|--------|
| R-007-X1 | Re-run /spec_kit:deep-review:auto over 010 (3 iters, verify pass): P0=0, P1≤2 | pending |
| R-007-X2 | Update phase-review-summary.md with post-remediation severity counts | pending |
| R-007-X3 | Push all 010/007 changes to main with conventional commits | pending |

## Dependencies

```
T-A (R-007-2) → T-A (R-007-14) → T-B (all 7 tasks)
                                 │
                                 ├─ T-C (R-007-6, R-007-10) ─┐
                                 ├─ T-D (10 tasks) ─────────┤
                                 └─ T-E (R-007-13) ─────────┤
                                                            ▼
                                                 T-F (11 tasks)
                                                            │
                                                            ▼
                                                 R-007-X1 → X2 → X3
```

## References

- spec.md, plan.md, checklist.md (this folder)
- 010/review/phase-review-summary.md (cross-sub-phase findings)
