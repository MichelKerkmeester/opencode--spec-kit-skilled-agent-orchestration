# Deep Review Report: 010-search-and-routing-tuning

## 1. Executive Summary

- Release Readiness Verdict: CONDITIONAL
- Iterations completed: 20 of 20
- Scope: promoted root metadata, child-root prompts/reviews/docs for `001`-`003`, and the live runtime/test surfaces those packets claim to describe
- Active findings: 0 P0, 4 P1, 0 P2
- hasAdvisories: false

The promoted `010-search-and-routing-tuning` tree is not release-clean yet. The underlying 001 and 002 runtime fixes are present, but promotion integrity is incomplete: one live launch prompt still points at the old 006 path, root review artifacts still preserve pre-promotion 017/018/019 verdicts, the graph-metadata validation packet overclaims a zero-legacy-file result that the promoted roots do not satisfy, and the promoted `002` root still publishes contradictory completion state across its canonical surfaces.

## 2. Planning Trigger

Route this outcome to `/spec_kit:plan`, not publish or changelog follow-up, because the remaining issues are packet-integrity problems that affect recovery, review replay, and operator trust:

- Prompt remediation: fix the live `002` deep-research prompt so it dispatches against the promoted path.
- Review lineage refresh: regenerate the promoted root review outputs after migration instead of carrying old 017/018/019 conclusions forward.
- Metadata refresh: backfill or rewrite the promoted root `graph-metadata.json` files into canonical JSON and reconcile the zero-legacy-file claim.
- Root-state reconciliation: make the promoted `002` root expose one coherent completion state.

## 3. Active Finding Registry

- **F001 [P1 | traceability]** The live deep-research prompt for `002-content-routing-accuracy` still launches against the retired 006 path. Evidence: [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md:8`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/spec.md:6`].
- **F002 [P1 | traceability]** Promoted root deep-review artifacts were not regenerated after migration and still preserve pre-promotion 017/018/019 verdicts. Evidence: [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/review/review-report.md:11`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/review/review-report.md:12`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/review/deep-review-dashboard.md:18`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/review/deep-review-config.json:22`], [`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`], [`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1157`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:10`].
- **F003 [P1 | correctness]** `003-graph-metadata-validation` claims zero legacy plaintext `graph-metadata` files remain, but the promoted root packets `001`, `002`, and `003` still store legacy text-format metadata. Evidence: [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:10`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:21`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/graph-metadata.json:1`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json:1`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/graph-metadata.json:1`].
- **F004 [P1 | traceability]** Root `002-content-routing-accuracy` publishes contradictory completion state across canonical docs and metadata. Evidence: [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/spec.md:3`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/tasks.md:3`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/checklist.md:3`], [`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json:3`].

## 4. Remediation Workstreams

- **Workstream A: Promotion launch surface cleanup**
  Update `002-content-routing-accuracy/prompts/deep-research-prompt.md` so the operator-facing launch command targets the promoted `010` path.
- **Workstream B: Root review lineage refresh**
  Re-run or rewrite the promoted root review packets for `001`, `002`, and `003` so their dashboards/reports reflect the current promoted targets and currently-shipped runtime state.
- **Workstream C: Graph metadata truth-sync**
  Refresh the three promoted root `graph-metadata.json` files into canonical JSON and only keep the zero-legacy-file claim if a fresh corpus scan actually proves it.
- **Workstream D: Root status coherence**
  Reconcile `002-content-routing-accuracy` so `spec.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json` publish one authoritative status.

## 5. Spec Seed

- Open a remediation child under `010-search-and-routing-tuning/` for prompt + review-artifact migration cleanup.
- Open a metadata-only follow-on for canonical JSON regeneration of the promoted root graph-metadata files and any related 003 closeout wording.
- If status reconciliation for `002` is kept separate, open a narrow packet dedicated to root completion-state normalization and closeout docs.

## 6. Plan Seed

1. Fix the live `002-content-routing-accuracy` prompt invocation to the promoted `010` path.
2. Re-run or regenerate the root deep-review packets for `001`, `002`, and `003` so their targets, findings, and verdicts match current reality.
3. Convert the promoted root `graph-metadata.json` files to canonical JSON and rerun the supporting scan that drives the zero-legacy-file claim.
4. Normalize the root `002` packet status across `spec.md`, `tasks.md`, `checklist.md`, and graph metadata.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | fail | The promoted packet surfaces still point at retired paths or stale review conclusions despite the live runtime showing those specific fixes landed. |
| `checklist_evidence` | core | fail | Root review and closeout surfaces overstate promotion cleanliness; `002` still has contradictory root status and `003` still overclaims zero legacy metadata files. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog surface is owned by the promoted root packet. |
| `playbook_capability` | overlay | notApplicable | No playbook surface is owned directly by `010-search-and-routing-tuning`. |

## 8. Deferred Items

- Strict validation on the promoted roots still reports broad template/anchor debt across `001`, `002`, and `003`; this is real, but it looks more like packet-template modernization debt than a promotion-specific surprise.
- The `010` coordination parent itself still lacks root `spec.md`, `plan.md`, and `tasks.md`; validation flags that as a Level 1 failure. I kept it out of the active finding set because the higher-signal migration defects above are more directly tied to the user-requested promotion review.
- CocoIndex semantic discovery could not be used in this session because each attempted query returned a cancelled-tool response.

## 9. Audit Appendix

### Iteration Allocation

| Iterations | Allocation | Outcome |
|------------|------------|---------|
| 1-2 | Promotion metadata and prompt launch surfaces | Found F003 and F001 |
| 3-6 | Root review artifact replay against current runtime and root packet state | Found F002 and F004 |
| 7-12 | Security, cross-reference, and validator-backed stabilization | No new findings; confirmed the drift is traceability-focused |
| 13-20 | Review lineage, citation, resume-surface, and final convergence passes | No new findings; verdict stayed stable |

### Verification Summary

| Target | Result |
|--------|--------|
| `010-search-and-routing-tuning/` | `validate.sh --strict` failed: missing root `spec.md`, `plan.md`, `tasks.md`; missing successor links under the promoted child roots |
| `001-search-fusion-tuning/` | `validate.sh --strict` failed: missing `plan.md`, `implementation-summary.md`, `decision-record.md`; malformed legacy graph metadata and root doc-integrity issues |
| `002-content-routing-accuracy/` | `validate.sh --strict` failed: missing `plan.md`, `implementation-summary.md`, `decision-record.md`; contradictory root packet state and malformed legacy graph metadata |
| `003-graph-metadata-validation/` | `validate.sh --strict` failed: missing `decision-record.md`; root tasks still reference stale `019/...` docs and malformed legacy graph metadata |

### Key Commands

- `rg -n "006-canonical-continuity-refactor|018-research-content-routing-accuracy|019-research-graph-metadata-validation|006-continuity-refactor-gates/002-content-routing-accuracy" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy`
- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation`

### Convergence / Stop Reason

- Stop reason: operator-requested `maxIterations=20` reached
- Last two iteration ratios: `0.00 -> 0.00`
- Final active severity mix: `0 P0 / 4 P1 / 0 P2`
- Result: the review converged without surfacing any P0, but the four remaining promotion-integrity issues block PASS
