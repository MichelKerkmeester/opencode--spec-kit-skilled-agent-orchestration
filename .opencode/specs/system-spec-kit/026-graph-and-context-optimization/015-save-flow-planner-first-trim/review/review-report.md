---
title: "Deep review report — packet 015 save-flow planner-first trim"
timestamp: "2026-04-15T09:24:10Z"
runtime: "cli-copilot --effort high"
iterationsCompleted: 10
overallVerdict: "REMEDIATION-REQUIRED"
totals:
  P0: 3
  P1: 5
  P2: 1
---

# Deep Review Report

## 1. Verdict

**REMEDIATION-REQUIRED.** The review converged across all 10 requested dimensions, but three P0 findings remain:

- **F001** — load-bearing `content-router.ts` contains behavioral changes rather than preservation-only trim.
- **F002** — explicit full-auto fallback dropped the pre-015 `POST_SAVE_FINGERPRINT` safety rule.
- **F003** — planner-ready responses misclassify template-contract failures as advisories instead of blockers.

## 2. Iteration ledger

| Iteration | Dimension | Status | New findings |
| --- | --- | --- | --- |
| 1 | Load-bearing preservation | insight | P0: 1 |
| 2 | Fallback equivalence | insight | P0: 1 |
| 3 | Flag wire completeness | complete | none |
| 4 | Follow-up API integrity | complete | none |
| 5 | Planner response classification | insight | P0: 1 |
| 6 | Eight-category routing preservation | complete | none |
| 7 | Dead-branch audit | insight | P1: 1, P2: 1 |
| 8 | Test coverage gap sweep | insight | P1: 1 |
| 9 | Docs vs runtime drift | insight | P1: 2 |
| 10 | Residual sweep + synthesis | insight | P1: 1 |

## 3. Aggregate findings

### P0

1. **F001** — load-bearing router file carries new control flow. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:248-255] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:536-634]
2. **F002** — full-auto fallback drops `POST_SAVE_FINGERPRINT`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1534-1569] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2991-3004]
3. **F003** — planner-ready responses downgrade template-contract failures into advisories. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1735-1744] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1952-1970]

### P1

1. **F004** — deferred enrichment skip returns success-shaped status. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225]
2. **F006** — deferred follow-up helpers lack execution-level coverage. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:100-128] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:206-225]
3. **F007** — packet docs still reference pre-015 follow-up tool names. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/spec.md:155] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-save-flow-planner-first-trim/plan.md:128]
4. **F008** — env reference overstates `hybrid` as a real planner mode. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:98]
5. **F009** — release notes overstate hybrid support and unchanged router/load-bearing preservation. [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.1.0.md:145] [SOURCE: .opencode/changelog/01--system-spec-kit/v3.4.1.0.md:272-273]

### P2

1. **F005** — `hybrid` planner mode is exposed but currently behaves like `plan-only`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:123-135] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2469-2470]

## 4. Top remediation priorities

1. **Restore full-auto safety parity** by reinstating `POST_SAVE_FINGERPRINT` validation on canonical full-auto fallback (`F002`).
2. **Promote template-contract failures to planner blockers** so the planner surface cannot mislead callers into treating required template violations as optional (`F003`).
3. **Resolve the load-bearing router preservation contradiction** by either reverting the behavioral router delta or explicitly documenting and narrowing the allowed exception (`F001`).

## 5. Clean verification evidence

- All four new Phase 015 flags are wired to real branches.
- Follow-up APIs are implemented and re-exported.
- The eight routing categories plus Tier 1/Tier 2 heuristics are preserved.
- The required focused vitest sweep passed (`223` tests).
- `npm run build` passed in both expected system-spec-kit packages (`scripts`, `mcp_server`).
- `test-bug-fixes.js` remained green (`27 / 0 / 0`).
- The residual sweep for deprecated Phase 012 surfaces returned zero active references.
- The `axios` lockfile resolution in `mcp-code-mode` is `1.15.0`.

## 6. Coverage and documentation assessment

- **Coverage:** core planner/full-auto routing is covered well enough to prove parity on the main path, but deferred follow-up execution remains under-tested.
- **Packet docs:** packet-local spec/plan still reference old follow-up tool names.
- **Reference docs:** `ENV_REFERENCE.md` and the release notes overstate `hybrid` support.

## 7. Residual sweep summary

- **Deprecated references:** clean.
- **Lockfile dependency check:** clean.
- **Build targets:** clean for the two release-note build packages.
- **Standing regression script:** clean.
- **Changelog honesty:** one remaining P1 mismatch (`F009`).

## 8. Convergence summary

The review converged without stalled iterations. Iterations 1-6 established the primary runtime shape; iterations 7-10 narrowed the residual risk to observability, coverage, and documentation honesty after the main correctness issues were already isolated. No additional P0s emerged after iteration 5, which suggests the critical defect set is now stable rather than still expanding.

## 9. Artifact inventory

- Iterations: `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- Findings registry: `review/deep-review-findings-registry.json`
- Strategy log: `review/deep-review-strategy.md`
- State log: `review/deep-review-state.jsonl`
- Synthesis report: `review/review-report.md`
