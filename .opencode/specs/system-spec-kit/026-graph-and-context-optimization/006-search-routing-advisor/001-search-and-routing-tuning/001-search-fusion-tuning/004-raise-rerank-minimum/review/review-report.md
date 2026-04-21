# Deep Review Report: 004-raise-rerank-minimum

## Executive summary

**Verdict:** PASS  
**hasAdvisories:** true  
**Finding counts:** P0 = 0, P1 = 3, P2 = 3

The runtime change itself is sound: the Stage 3 minimum rerank gate is `4`, the threshold-sensitive tests still prove `3 => skip` and `4 => apply`, and the local GGUF path remains behind the same guard. The review findings are concentrated in packet traceability and maintenance surfaces introduced or left behind after the packet migration and later verification drift.

## Scope

Reviewed packet docs:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed runtime evidence:

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/local-reranker.vitest.ts`

## Method

The loop ran 10 iterations with the required rotation:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Each iteration read the packet state, focused on one dimension, wrote an iteration narrative, appended a delta record, and updated the append-only state log. Live verification was included to ground the review in current behavior:

- `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts --reporter=dot`

Current targeted verification passed with `23` tests.

## Findings by severity

### P0

| ID | Finding | Evidence | Notes |
| --- | --- | --- | --- |
| None | None | - | No P0 finding survived review. |

### P1

| ID | Finding | Evidence | Notes |
| --- | --- | --- | --- |
| F001 | `description.json` parent chain still points at the retired `010-search-and-routing-tuning` slug | `description.json:18` | The packet migration block already records the new `001-search-and-routing-tuning` location, so ancestry consumers can reconstruct the wrong lineage from the stale `parentChain` entry. |
| F002 | Packet-local research citations no longer resolve after migration | `plan.md:13` | The plan, tasks, and decision record still cite `../research/research.md`, but the current packet subtree has no sibling `research/research.md`, so the evidence chain is no longer directly reproducible from the packet. |
| F003 | Checklist evidence claim overstates what the implementation summary provides | `checklist.md:13` | The checklist claims the implementation record cites specific research lines, but the implementation summary contains no such citation. |

### P2

| ID | Finding | Evidence | Notes |
| --- | --- | --- | --- |
| F004 | Decision record lifecycle status is stale after completion | `decision-record.md:3` | `status: planned` contradicts the packet's otherwise complete state. |
| F005 | Implementation summary verification count drifted from the live suite | `implementation-summary.md:48` | The packet records `22` tests, but the current targeted suite reports `23`. |
| F006 | Generated metadata still advertises the pre-decision `4-5` ambiguity | `graph-metadata.json:25` | The packet is complete and the decision record locked the shipped threshold to `4`, but generated key topics still include `4-5`. |

## Findings by dimension

| Dimension | Result | Findings |
| --- | --- | --- |
| correctness | Clean | No correctness defect surfaced in the runtime gate or threshold-sensitive tests. |
| security | Clean | No security issue emerged from the threshold move or local fallback behavior. |
| traceability | Drift present | F001, F002, F003, F006 |
| maintainability | Drift present | F004, F005 |

## Adversarial self-check for P0

No P0 findings were recorded, so no P0 adjudication was required. The adversarial re-check instead re-ran the live runtime verification and re-read the Stage 3 gate plus local fallback evidence to confirm the correctness/security surfaces remained clean before leaving the verdict at PASS.

## Remediation order

1. Repair the packet's canonical traceability chain: update `description.json` ancestry and replace or restore the broken `../research/research.md` references across `plan.md`, `tasks.md`, and `decision-record.md`.
2. Fix the evidence/completion surfaces: align `checklist.md` with the actual implementation summary, change `decision-record.md` to a completed lifecycle status, and refresh the verification count in `implementation-summary.md`.
3. Regenerate packet metadata so `graph-metadata.json` and related generated surfaces reflect the final shipped `4` threshold rather than the old `4-5` ambiguity.

## Verification suggestions

1. After packet-doc repairs, rerun the packet metadata generation flow so `description.json` and `graph-metadata.json` are refreshed from the corrected docs.
2. Re-run:
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
   - `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts --reporter=dot`
3. Re-open the packet docs and confirm every cited evidence path resolves from the current packet tree without depending on the retired pre-migration layout.

## Appendix

| Iteration | Dimension | New findings | Ratio | Delta |
| --- | --- | --- | --- | --- |
| 001 | correctness | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-001.jsonl` |
| 002 | security | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-002.jsonl` |
| 003 | traceability | P0:0 P1:2 P2:0 | 1.00 | `review/deltas/iter-003.jsonl` |
| 004 | maintainability | P0:0 P1:1 P2:2 | 0.41 | `review/deltas/iter-004.jsonl` |
| 005 | correctness | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-005.jsonl` |
| 006 | security | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-006.jsonl` |
| 007 | traceability | P0:0 P1:0 P2:1 | 0.06 | `review/deltas/iter-007.jsonl` |
| 008 | maintainability | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-008.jsonl` |
| 009 | correctness | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-009.jsonl` |
| 010 | security | P0:0 P1:0 P2:0 | 0.00 | `review/deltas/iter-010.jsonl` |

Convergence note: all four dimensions were covered by iteration 004, no P0 findings were recorded, and iterations 008-010 formed the required three-pass low-churn tail (`<= 0.05`). The loop still ran through iteration 010 and closed with `stopReason = maxIterationsReached`, matching the requested 10-iteration packet.
