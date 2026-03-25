# Iteration 012: Spec-Code Traceability

## Findings

### 1. Root packet: `022-hybrid-rag-fusion/spec.md`

| Claim | Verdict | Evidence |
| --- | --- | --- |
| Root Level 3+ companion docs exist | PASS | `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` are all present under `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`. |
| Directory totals `399` / `21` are current | FAIL | `spec.md:38` claims `399` total directories under `022` and `21` top-level directories. Live audit on 2026-03-25 found `403` directories under `022` and `23` top-level child directories (`24` if the root directory itself is included). |
| Key numbered child counts `001=12`, `007=22`, `008=6`, `009=20`, `011=1`, `015=22` are current | PASS | Live counts match exactly: `001=12`, `007=22`, `008=6`, `009=20`, `011=1`, `015=22`. |
| Feature Catalog Count `222 feature files` is accurate | PASS (qualified) | Raw markdown count under `.opencode/skill/system-spec-kit/feature_catalog/` is `224`, but excluding `feature_catalog.md` and `feature_catalog_in_simple_terms.md` leaves `222` feature docs, which matches the spec wording. |
| Root phase map statuses are truthful | FAIL | The phase map in `spec.md:91-109` drifts from child spec status fields. Material mismatches include `006-feature-catalog` (`In Progress` vs `Completed — all 13 checks passed...`), `010-template-compliance-enforcement` (`Draft` vs `In Progress`), `013-agents-alignment` (`Complete` vs `In Progress ... pending`), and `016-019` (`Complete` vs `In Progress ... pending completion evidence`). |
| Phase `009` and phase `015` truth is preserved | PASS | Phase `009` still has `20` numbered children. Phase `015` still has `22` numbered children with `4 Complete`, `15 Not Started`, and `3 Draft` child specs, so the root packet is correct that `015` remains in progress. |
| `spec_validate_local.out` is described honestly | PASS | Root spec `REQ-006` (`spec.md:130`), edge-case note (`spec.md:183`), and acceptance scenario 6 (`spec.md:243`) consistently describe `spec_validate_local.out` as historical/debugging context rather than pass evidence. |
| Root packet includes acceptance-scenario coverage | PASS | `spec.md:236-243` contains 6 acceptance scenarios, satisfying `REQ-008`. |

### 2. Epic packet: `001-hybrid-rag-fusion-epic/spec.md`

| Claim | Verdict | Evidence |
| --- | --- | --- |
| Parent Level 3 companion docs exist | PASS | `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` all exist in the epic folder. |
| Epic currently has 12 direct children | PASS | Live subtree count is 12 numbered child folders, matching `spec.md:41` and `REQ-002`. |
| Parent/root relationship is current | PASS | `spec.md:38-40` points to `../spec.md` and successor `../002-indexing-normalization/spec.md`; those targets exist. |
| Sprint-child specs point to the live parent and siblings | PASS | Recursive validation of the epic reports `PHASE_LINKS: Phase links valid (12 phases verified)`, so the parent/sibling navigation contract is structurally satisfied. |
| Parent phase map statuses are truthful | PARTIAL / FAIL | The phase map in `spec.md:93-104` materially drifts on at least two rows: `007-sprint-6-indexing-and-graph` is claimed `Draft` but child `spec.md:28` says `Implemented (Sprint 6a complete, Sprint 6b deferred)`, and `011-research-based-refinement` is claimed `Draft` but child `spec.md:27` says `Implemented`. |
| Parent packet includes validator coverage scenarios | PASS | `spec.md:231-238` contains 6 acceptance scenarios, satisfying `REQ-008`. |

### 3. Release-control packet: `012-pre-release-fixes-alignment-preparation/spec.md`

| Claim | Verdict | Evidence |
| --- | --- | --- |
| Status line is current: “code gates are green, but release-control validation is still blocked by unresolved recursive validator debt across the `007` child packet family” | FAIL / STALE | `spec.md:16` is outdated. A live strict recursive validation run on 2026-03-25 now reports `Errors: 0  Warnings: 44` with `RESULT: FAILED (strict)`, not `91 errors and 72 warnings`. The current strict failure is also not isolated to `007`; the root packet and other phase packets (for example `002`, `003`, `004`, and `007`) all emit warnings. The “code gates are green” half of the status line could not be re-verified live because a current root `npm test` run did not finish within the audit window. |
| Completed Work Phases `7 (Phases 1-7 complete)` and Active Work Phase `None — all phases complete` are accurate | FAIL | `spec.md:22-23` contradicts the same file’s work history and scope. `spec.md:51` explicitly says “Phase 4: Full-Tree Remediation (in progress)”, and `plan.md` states Phases `4-7` remain the release path. |
| `v1`, `v2`, and `v3` review figures are preserved accurately | PASS (historical) | `spec.md:24-26` is corroborated by `research.md` (49 findings / 10-agent audit), `plan.md` (84/100 and 42/100 review history), archived review state, and packet memory artifacts. These are historically backed review snapshots. |
| Live Review Scope `119 spec directories, 19 direct phases` is current | PARTIAL / STALE | `19` direct phases is still correct, but a live audit now finds `124` spec directories under the `022` tree, so `spec.md:27` is stale as a current-state claim. |

### 4. 012 deliverables

| Deliverable claim | Verdict | Evidence |
| --- | --- | --- |
| `research.md` — “Original 49-finding audit with file-backed evidence” | PASS | File exists and records the original 10-agent / 49-finding audit, including `49 findings (4 P0, 19 P1, 26 P2)`. |
| `review-report.md` — “Complete, current” | FAIL / STALE | File exists, but it is not current. `review-report.md:20` still claims recursive strict validation fails with `91 errors and 72 warnings` isolated to `007`; the live run now reports `0 errors, 44 warnings` and broader warning scope. |
| `tasks.md` — “Complete, requires follow-up updates” | PASS | File exists and matches the described historical-plus-active remediation backlog structure, including the `58 findings -> 67 concrete release tasks` execution model. |
| `checklist.md` — “Complete, requires follow-up updates” | PARTIAL | File exists and contains both historical verification evidence and open gate items, but it also repeats stale recursive-validation evidence (`91 errors and 72 warnings` tied to `007`). |
| `plan.md` — “Rewritten” | PASS | File exists and lays out the remaining Phases `4 -> 7`, consistent with the broadened release-control scope. |
| `spec.md` — “Rewritten” | PASS | File exists and the objective/scope sections were rewritten for the full-tree remediation program, but several status/count claims inside the rewritten packet are now stale. |
| `scratch/agent-NN-*.md` — “Complete” | PASS | Archived raw agent outputs exist under `scratch/archive-audit-agents/agent-01-...md` through `agent-10-...md`. |

### 5. Requirements claimed as met inside the 012 packet

| Claimed-as-met item | Verdict | Evidence |
| --- | --- | --- |
| “All 6 v3 P0 blockers are cleared with file-backed evidence” | FAIL / NOT TRUSTWORTHY | The same packet still contains stale live-state claims (`119` spec dirs, “all phases complete”), the root packet still has stale directory totals and phase-map statuses, and the current strict validator failure is broader than the packet says. The blanket P0-clearance claim is therefore not traceable to the current live tree. |
| “All 12 code correctness and security P1 findings are fixed and verified” | UNVERIFIED LIVE | Current file evidence does not directly refute this, but the audit could not re-confirm it through a completed live workspace test run. The supporting claim currently depends on historical review artifacts, not a fresh completed live test pass during this audit. |
| “Workspace verification passes for the live implementation” | UNVERIFIED LIVE | `review-report.md:26` says a workspace `npm run test` passed on 2026-03-25, and the CLI smoke command `node scripts/dist/memory/generate-context.js --help` still works. However, a fresh root `npm test` launched during this audit did not complete within an extended wait and was stopped, so the claim is not freshly re-verified. |
| “Recursive validation ... still reports 91 errors and 72 warnings inside the `007` child packet family” (unchecked criterion evidence) | FAIL / STALE EVIDENCE | The criterion is still correctly unchecked, but its evidence text is stale. The current live strict recursive validation result is `Errors: 0  Warnings: 44`, and the warning debt is not limited to `007`. |

## Summary

The three specs are only partially traceable to the live tree.

The strongest matches are structural: root and epic companion docs exist, the root numbered-child counts are mostly correct, the epic still has 12 direct children, and the 012 packet’s core deliverables are present.

The biggest drifts are current-state claims. The root packet still overstates directory totals and has a stale phase-status map. The epic packet still marks sprint `007` and `011` as `Draft` even though their child specs now say `Implemented`. The 012 release-control packet is the most stale: it says all phases are complete while Phase 4 is still in progress, its “119 spec directories” count is behind the live tree (`124`), and its blocker/evidence language still cites `91 errors / 72 warnings` even though the current strict recursive validator reports `0 errors / 44 warnings`.

Bottom line: the documentation tree is usable for orientation, but not yet trustworthy as a live release-control authority without another truth-sync pass.

## JSONL

{"type":"iteration","run":12,"dimensions":["traceability"],"strict_validation":{"result":"failed","mode":"--recursive --strict","errors":0,"warnings":44},"workspace_test":{"status":"unverified_live","note":"root npm test did not complete within audit window"},"root":{"directory_totals":"fail","numbered_child_counts":"pass","feature_catalog_count":"pass_with_qualifier","phase_map_statuses":"fail"},"epic":{"direct_child_count":"pass","phase_map_statuses":"partial_fail","navigation":"pass"},"phase012":{"status_line":"fail_stale","completed_work_phases":"fail","live_review_scope":"partial_fail","deliverables":{"research":"pass","review_report":"fail_stale","tasks":"pass","checklist":"partial","plan":"pass","spec":"pass","scratch_agent_archives":"pass"},"claimed_met":{"p0_blockers_cleared":"fail","code_p1_fixed":"unverified_live","workspace_verification_passes":"unverified_live"}}}
