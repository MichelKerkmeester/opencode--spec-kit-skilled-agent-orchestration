# Independent Review Pass 2 of Packet 003

## Verdict
NOT READY (P0 blockers)

## P0 Findings (blockers, if any)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/resource-map.md:202`, `plan.md:196`, `tasks.md:163` — audit-D scope math contradicts itself. `resource-map` says §2.5g is **33 MODIFY**, but its subcounts are `feature_catalog (22)` + `manual_testing_playbook (8)` + `stress_test (0)` = **30**. `plan.md:196` says audit-D added 30, then `plan.md:230` says 33 across those same 22+8 files. `tasks.md:163-171` covers only 22+8 plus NO-OP stress_test. Reconcile to one source of truth: either list the missing 3 MODIFY files or change all totals from 33/65/83 to 30/62/80.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/resource-map.md:49`, `resource-map.md:415`, `plan.md:143`, `tasks.md:72` — `templates/manifest/README.md` is assigned to different phases/counts. `resource-map` §1 says Phase 1 has 20 new files and does not list the README; §6 says Phase 4 creates it. `plan` Gate 1 and `tasks` T-117a say it is a Phase 1 add. Put the README in one phase and update Created totals accordingly.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/plan.md:130`, `checklist.md:112`, `review/audit-D-response.md:1` — workflow-invariance still covers only the original 6 surface categories and omits audit-D’s AI-readable `feature_catalog/` and `manual_testing_playbook/` surfaces. Since audit-D explicitly found banned-vocabulary leaks there, the CI guardrail or Gate 4 must include those paths, not only ad hoc cleanup tasks.

## P1 Findings
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/plan.md:58`, `decision-record.md:48`, `decision-record.md:70` — stale post-reorg labels remain in authored docs: `011/research/research.md`, “Packet 011”, “packet (012)”, and `T-101 through T-420`. Use `../002-template-greenfield-redesign/...`, packet 002/003 language, and T-101 through T-434.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/plan.md:235`, `tasks.md:165` — the `capability-flags.ts` source-path issue is only “may be needed” in the plan and disappears from the task acceptance criteria. Audit-D requires either a source rename or a CI exemption. Pick one and encode it in T-431 plus Gate 4.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/tasks.md:173-176` — T-430 appears after T-434, then legacy T-420 appears after that. It is understandable, but it breaks sequencing. Move T-430 after T-429 or rename it T-435; remove or archive T-420 instead of keeping it as an active unchecked task.

## P2 Findings
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/plan.md:390-396` — L3 Critical Path still has old estimates: Phase 1 6-10h, Phase 3 5-8h, Phase 4 2-3h, total 17-21h. L2 now says 10-15h, 7-12h, 8-13h, total 29-46h. Update the critical path.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/resource-map.md:438-441` — rollback blast radius is stale: 51 deleted, 18 modified, 20 added conflicts with the current summary of 57 deleted, 83 modified, 21 created.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/checklist.md:129-137` — Gate 4 checklist does not mention audit-D catalog/playbook verification, stress_test NO-OP verification, or `capability-flags.ts` rename/exemption. Add those once the P0 count issue is resolved.

## What's improved since pass 1
- Resource-map now explicitly accounts for root cross-cutting template deletions.
- Phase 1 has been reframed as non-production-path-only instead of zero existing-file changes.
- The workflow-invariance test now names the original 6 required surface categories.
- Audit A/B/C/D provenance is linked from `resource-map.md`.
- Stress-test surfaces are consistently marked NO-OP in `resource-map`, `tasks`, and audit-D.

## Summary
The packet is much stronger than pass 1, but not ready: the audit-D file count and Phase 1 README placement are internally inconsistent, and the CI guardrail misses the new audit-D AI-readable surfaces. Fix those three blockers, then the remaining issues are cleanup-level alignment.
