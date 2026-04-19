# Deep Review Report: 010-search-and-routing-tuning

## 1. Executive Summary

- Release Readiness Verdict: CONDITIONAL
- Iterations completed: 20 of 20
- Scope: promoted root metadata, child-root prompts and review artifacts for `001` to `003`, and the live runtime/test surfaces those packets claim to describe
- Active findings: 0 P0, 5 P1, 0 P2
- hasAdvisories: false

The promoted `010-search-and-routing-tuning` tree is not promotion-clean yet. The shipped runtime no longer exhibits the older Stage 3 and metadata-only routing defects carried by some child review outputs, but the promoted packet family still has five active P1 issues: one live prompt still targets the retired 006 path, promoted child review artifacts were not regenerated after the move, 003 still overclaims a zero-legacy-metadata corpus, 002 still contradicts itself about completion state, and promoted 003 tasks still cite retired 019 root docs as completion evidence.

## 2. Planning Trigger

Route this outcome to `/spec_kit:plan`, not publish or changelog follow-up, because the remaining issues are promotion-integrity defects that affect recovery, review replay, and operator trust:

- Prompt remediation: fix the live `002` deep-research prompt so it dispatches against the promoted 010 path.
- Review lineage refresh: regenerate the promoted child root review packets so they reflect current promoted targets and current runtime reality.
- Graph-metadata truth sync: align the 003 closeout claims with the actual promoted root metadata corpus.
- Root-state reconciliation: make `002-content-routing-accuracy` publish one authoritative completion state.
- Task-evidence cleanup: replace retired 019 references in promoted 003 completion evidence.

## 3. Active Finding Registry

- **R010-F001 [P1 | traceability]** The promoted `002` deep-research prompt still launches the retired 006 packet. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md:8] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/spec.md:6]
- **R010-F002 [P1 | traceability]** Promoted child root review artifacts still preserve pre-promotion 017 / 018 / 019 verdicts even though the live runtime no longer matches those old claims. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/001-search-fusion-tuning/review/review-report.md:11] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/review/review-report.md:12] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1054] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1157] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/review/deep-review-dashboard.md:18]
- **R010-F003 [P1 | correctness]** `003-graph-metadata-validation` claims zero legacy plaintext `graph-metadata` files remain, but the promoted root packets `001`, `002`, and `003` still store text-format metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:10] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/implementation-summary.md:21] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/001-search-fusion-tuning/graph-metadata.json:1] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json:1] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/graph-metadata.json:1]
- **R010-F004 [P1 | traceability]** Root `002-content-routing-accuracy` still publishes contradictory completion state across canonical docs and metadata. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/spec.md:3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/tasks.md:3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/checklist.md:3] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/002-content-routing-accuracy/graph-metadata.json:3]
- **R010-F005 [P1 | traceability]** Promoted `003` tasks still cite retired `019` root docs as completion evidence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/tasks.md:13] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/review/deep-review-dashboard.md:18]

## 4. Remediation Workstreams

- **Workstream A: Promotion launch-surface cleanup**
  Update `002-content-routing-accuracy/prompts/deep-research-prompt.md` so the operator-facing launch command targets the promoted `010` path.
- **Workstream B: Child review lineage refresh**
  Re-run or rewrite the promoted child root review packets for `001`, `002`, and `003` so their dashboards and reports reflect the current promoted targets and shipped runtime state.
- **Workstream C: Graph metadata truth-sync**
  Refresh the three promoted root `graph-metadata.json` files into canonical JSON and only keep the zero-legacy-file claim if a fresh corpus scan actually proves it.
- **Workstream D: Root status coherence**
  Reconcile `002-content-routing-accuracy` so `spec.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json` publish one authoritative state.
- **Workstream E: Promoted task-evidence cleanup**
  Replace retired `019` references in `003-graph-metadata-validation/tasks.md` with promoted `010` evidence or explicitly reopen the task.

## 5. Spec Seed

- Open a remediation child under `010-search-and-routing-tuning/` for prompt and review-artifact promotion cleanup.
- Open a metadata-only follow-on for canonical JSON regeneration of the promoted root graph-metadata files and the 003 closeout wording that depends on that scan.
- If root state normalization for `002` is kept separate, open a narrow child packet dedicated to canonical completion-state reconciliation.
- If the 003 task evidence cleanup is handled separately, open a traceability-only child packet for promoted evidence refresh.

## 6. Plan Seed

1. Fix the live `002-content-routing-accuracy` prompt invocation to the promoted `010` path.
2. Re-run or regenerate the root deep-review packets for `001`, `002`, and `003` so their targets, findings, and verdicts match current reality.
3. Convert the promoted root `graph-metadata.json` files to canonical JSON and rerun the supporting scan that drives the zero-legacy-file claim.
4. Normalize the root `002` packet status across `spec.md`, `tasks.md`, `checklist.md`, and graph metadata.
5. Replace retired `019` evidence references in the promoted `003` task list with current promoted evidence or explicitly reopen the task.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | fail | Promoted packet surfaces still point at retired paths or stale review conclusions despite the live runtime showing those specific bugs are fixed. |
| `checklist_evidence` | core | fail | Promoted 003 tasks still cite retired 019 evidence and root 002 still exposes contradictory completion state. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog surface is owned directly by the promoted coordination parent. |
| `playbook_capability` | overlay | notApplicable | No playbook surface is owned directly by `010-search-and-routing-tuning`. |

## 8. Deferred Items

- Strict validation on the promoted root and child roots still reports broad template and anchor debt. That debt is real, but it was lower signal than the five line-cited promotion defects above.
- The promoted coordination parent itself still lacks root `spec.md`, `plan.md`, and `tasks.md`, which keeps strict validation red at the root. I kept that in the appendix rather than the active registry because it cannot be cited as a file-line contradiction in the same way as the five active findings.
- The archived preexisting root review packet under `review/archive-invalid-2026-04-13T16-59-27Z/` was inconsistent because it lacked JSONL lineage; it was preserved as a recovery snapshot and not treated as authoritative review evidence.

## 9. Audit Appendix

### Iteration Allocation

| Iterations | Allocation | Outcome |
|------------|------------|---------|
| 1-2 | 003 closeout reality check plus active prompt-path verification | Found R010-F003 and R010-F001 |
| 3-8 | Child root review replay and promoted packet status / task evidence checks | Found R010-F002, R010-F004, and R010-F005 |
| 9-14 | Security, correctness replays, and validator-backed stabilization | No new findings; disproved the carried-forward live runtime defects |
| 15-20 | Packet-wide stabilization and final synthesis | No new findings; severity remained stable |

### Verification Summary

| Target | Result |
|--------|--------|
| `010-search-and-routing-tuning/` | `validate.sh --strict` failed: missing root `spec.md`, `plan.md`, and `tasks.md`; missing successor references under promoted child roots |
| `001-search-fusion-tuning/` | `validate.sh --strict` failed: missing `plan.md`, `implementation-summary.md`, `decision-record.md`; malformed legacy graph metadata and root doc-integrity issues |
| `002-content-routing-accuracy/` | `validate.sh --strict` failed: missing `plan.md`, `implementation-summary.md`, `decision-record.md`; contradictory root packet state and malformed legacy graph metadata |
| `003-graph-metadata-validation/` | `validate.sh --strict` failed: missing `decision-record.md`; task evidence still references retired `019/...` docs and malformed legacy graph metadata |

### Key Commands

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning`
- `rg -n "006-continuity-refactor-gates/002-content-routing-accuracy|017-research-search-fusion-tuning|018-research-content-routing-accuracy|019-research-graph-metadata-validation" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning`
- `nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts | sed -n '190,225p'`
- `nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1042,1065p'`
- `nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts | sed -n '1140,1185p'`

### Convergence / Stop Reason

- Stop reason: operator-requested `maxIterations=20` reached
- Last two iteration ratios: `0.00 -> 0.00`
- Final active severity mix: `0 P0 / 5 P1 / 0 P2`
- Result: the review stabilized, but the five remaining promotion-integrity issues block PASS
