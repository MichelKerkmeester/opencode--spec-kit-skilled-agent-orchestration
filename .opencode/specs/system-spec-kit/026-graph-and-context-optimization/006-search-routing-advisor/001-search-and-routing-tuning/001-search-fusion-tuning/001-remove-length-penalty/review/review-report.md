# Deep Review Report - 001 Remove Length Penalty

## 1. Executive summary

**Verdict: CONDITIONAL**. The runtime slice is behaviorally stable and the security review stayed clean, but the packet finished with **0 P0**, **6 P1**, and **1 P2** finding. The blocking theme is not reranker correctness; it is packet drift after renumbering and post-remediation follow-on work, which leaves core traceability surfaces (`description.json`, `plan.md`, `checklist.md`, `implementation-summary.md`, `decision-record.md`) inconsistent with one another.

`hasAdvisories: true`

## 2. Scope

Reviewed packet docs:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed implementation and tests:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`

## 3. Method

1. Initialized a fresh review packet and rotated dimensions in the required order: correctness, security, traceability, maintainability.
2. Read state before each iteration, then compared packet claims against the shipped reranker implementation and targeted test surfaces.
3. Re-ran the packet's targeted TypeScript/Vitest verification command to distinguish stale packet evidence from actual runtime behavior.
4. Recorded 10 iteration narratives, 10 delta JSONL files, an append-only state log, a deduped findings registry, and this synthesis report.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| None | — | No confirmed P0 finding. | — |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-P1-001 | Traceability | `description.json` still advertises the retired `010-search-and-routing-tuning` parent node after renumbering. | [SOURCE: description.json:2] [SOURCE: description.json:13-18] [SOURCE: description.json:25-31] |
| DR-P1-002 | Traceability | `plan.md` still tells follow-on work to remove helper surfaces that the shipped implementation intentionally kept as compatibility no-ops. | [SOURCE: plan.md:8] [SOURCE: plan.md:13-14] [SOURCE: implementation-summary.md:39-41] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577] |
| DR-P1-003 | Traceability | `checklist.md` records a targeted verification result of `15 files / 363 tests` for the documented four-suite command. | [SOURCE: checklist.md:9] |
| DR-P1-004 | Maintainability | `decision-record.md` still reports `status: planned` even though the packet is complete. | [SOURCE: decision-record.md:1-3] [SOURCE: spec.md:1-7] |
| DR-P1-005 | Maintainability | The ADR still documents temporary `lp` cache-bucket duplication after tasks and implementation-summary say that fix already landed. | [SOURCE: decision-record.md:10] [SOURCE: tasks.md:11] [SOURCE: implementation-summary.md:52-53] |
| DR-P1-006 | Traceability | `implementation-summary.md` now carries its own incompatible exact test count (`4 files / 126 tests`) for the same four-suite command. | [SOURCE: implementation-summary.md:47-48] [SOURCE: checklist.md:9] |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-P2-001 | Maintainability | No-op `LENGTH_PENALTY`, `calculateLengthPenalty()`, and `applyLengthPenalty()` remain public compatibility exports, extending the contract and test surface. | [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:62-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230-239] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:569-577] |

## 5. Findings by dimension

| Dimension | Result | Notes |
|-----------|--------|-------|
| Correctness | PASS | The code no longer applies live length-based scoring, and the inert request path behaves as documented. |
| Security | PASS | Provider resolution, warnings, and fallback handling remained within the expected trust boundary; no secret disclosure or exploit surface emerged. |
| Traceability | CONDITIONAL | The packet's hierarchy metadata, plan, checklist, and implementation summary no longer agree on the packet's current state. |
| Maintainability | CONDITIONAL | The ADR state is stale, and the no-op compatibility surface remains public debt. |

## 6. Adversarial self-check for P0

No P0 finding survived adversarial re-check. The strongest candidates were packet-traceability failures, but rereading the code and tests showed the underlying runtime behavior is correct and the risk stays at P1/P2 packet-governance severity rather than a release-blocking behavior or security defect.

## 7. Remediation order

1. Regenerate packet metadata so `description.json` and related lineage surfaces reflect the current `001-search-and-routing-tuning` hierarchy.
2. Reconcile `plan.md` with the shipped compatibility posture: helpers remain inert and exported; the retired `lp` cache-key split is already gone.
3. Replace stale exact verification counts in `checklist.md` and `implementation-summary.md` with one fresh capture from the same targeted TypeScript/Vitest run.
4. Update `decision-record.md` so status and consequences match the delivered packet state, then decide whether the remaining no-op export surface should stay for another compatibility cycle or move into the next cleanup phase.

## 8. Verification suggestions

- Re-run:
  - `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
  - `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts`
- Capture the exact current totals from that same command once and reuse them in both `checklist.md` and `implementation-summary.md`.
- Refresh packet metadata after the fixes: regenerate `description.json` / `graph-metadata.json`, then re-index the packet continuity surfaces.
- If the compatibility no-op surface is intentionally retained, record that decision explicitly in the ADR instead of leaving it implied across tests and summary prose.

## 9. Appendix

### Iteration list + delta churn

| Iteration | Dimension | newFindingsRatio | New findings | Notes |
|-----------|-----------|------------------|--------------|-------|
| 001 | Correctness | 0.00 | 0 | Clean baseline; no live length multiplier remained. |
| 002 | Security | 0.00 | 0 | Clean provider/logging audit. |
| 003 | Traceability | 0.54 | 3 P1 | Parent-chain drift, plan drift, checklist evidence drift. |
| 004 | Maintainability | 0.43 | 2 P1, 1 P2 | ADR status drift, ADR consequence drift, public no-op exports. |
| 005 | Correctness | 0.06 | 0 new / 1 refined | Stabilization confirmed documentation-only issue for helper removal. |
| 006 | Security | 0.00 | 0 | No new security evidence. |
| 007 | Traceability | 0.18 | 1 P1 | Implementation-summary exact test count split into its own stale claim. |
| 008 | Maintainability | 0.08 | 0 new / 1 refined | Advisory-only export debt revalidated. |
| 009 | Correctness | 0.00 | 0 | Composite stop blocked by unresolved traceability gates. |
| 010 | Security | 0.00 | 0 | Terminal pass before max-iteration stop. |

### Artifact set

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/deep-review-strategy.md`
- `review/deep-review-dashboard.md`
- `review/review-report.md`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
