---
title: "Review Report: 042 Deep Research & Review Runtime Improvement Bundle [Closing Audit]"
description: "Synthesis of 10 Codex-driven deep review iterations against the entire 042 bundle. Verdict: CONDITIONAL — 0 P0, 10 P1, 6 P2."
---

# Review Report: 042 Bundle Closing Audit

## 1. Executive Summary

- **Verdict**: CONDITIONAL
- **activeP0**: 0
- **activeP1**: 10
- **activeP2**: 6
- **hasAdvisories**: false
- **Session**: `rvw-2026-04-11T13-50-06Z`
- **Scope**: Entire 042 bundle — `spec.md` plus all 8 phase folders (`001` through `008`) and shipped runtime code across `sk-deep-research`, `sk-deep-review`, `sk-improve-agent`, the `system-spec-kit` coverage-graph stack, 6 YAML workflows, vitest suites, changelog surfaces, and packet-root completion artifacts.
- **Stop reason**: `maxIterationsReached` (`10/10`, planned hard cap)
- **Coverage**: all 4 dimensions reached during the session: correctness, security, traceability, and maintainability
- **Convergence**: `newFindingsRatio` fell from `1.00` to `0.06`; final reducer `convergenceScore` is `0.94`, but legal release readiness remains blocked by 10 active P1 findings

The dominant pattern across the 10 iterations was contract drift, not isolated code polish. The bundle added meaningful reducer, workflow, and test hardening, but several user-visible promises still do not match the live execution path: STOP gating does not consume claim-adjudication state, lifecycle branches are advertised without persisted lineage transitions, and the coverage-graph namespace contract is still weak at both storage and documentation layers.

The second pattern was release-surface optimism outrunning evidence. Phase 008 closeout and packet-root summaries certify completion in places where the live review packet still records required debt, so operators can receive a "finished" signal even though the current closing audit is still CONDITIONAL.

## 2. Planning Trigger

CONDITIONAL routes to `/spec_kit:plan` for remediation before the 042 bundle can be treated as PASS. The next packet should preserve this closing audit as the baseline, open with the active P1 registry below, and sequence the remediation lanes in implementation dependency order so runtime and persistence fixes land before documentation and packet-root closeout updates.

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Origin | Key evidence | First seen | Last seen | Status |
|---|---|---|---|---|---|---:|---:|---|
| F001 | P1 | correctness | Canonical deep-review agent still emits an unparseable iteration schema | `I001` (`iteration-001.md:18`) | `.opencode/agent/deep-review.md:147`; `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:137-206` | 1 | 1 | active |
| F002 | P1 | correctness | Claim-adjudication is documented as a hard stop gate but never participates in STOP eligibility | `I001` (`iteration-001.md:19`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:574`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:388-429` | 1 | 1 | active |
| F003 | P2 | correctness | Review config JSONL collapses requested dimensions into one string element | `I001` (`iteration-001.md:22`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:260`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:259` | 1 | 1 | active |
| F004 | P1 | security | Coverage-graph writes are not session-isolated when IDs collide | `I002` (`iteration-002.md:19`) | `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:154`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:292-302` | 2 | 2 | active |
| F005 | P2 | security | Session-isolation regression omits the ID-collision path | `I002` (`iteration-002.md:22`) | `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:62`; `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:370-376` | 2 | 2 | active |
| F006 | P1 | security | Graph-event namespace contract is still undocumented on the visible path | `I003` (`iteration-003.md:19`) | `.opencode/skill/sk-deep-research/references/state_format.md:145`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:658-665` | 3 | 3 | active |
| F007 | P1 | traceability | Claim-adjudication state format still documents a prose block instead of the typed packet the workflow enforces | `I004` (`iteration-004.md:18`) | `.opencode/skill/sk-deep-review/references/state_format.md:621`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:619-628` | 4 | 4 | active |
| F008 | P1 | traceability | Deep-review quick reference teaches the wrong weighted convergence signal set | `I004` (`iteration-004.md:19`) | `.opencode/skill/sk-deep-review/references/quick_reference.md:145`; `.opencode/skill/sk-deep-review/references/convergence.md:165-171` | 4 | 4 | active |
| F009 | P2 | traceability | Convergence reference still describes a persisted `legalStop` synthesis payload the shipped JSONL schema does not write | `I004` (`iteration-004.md:22`) | `.opencode/skill/sk-deep-review/references/convergence.md:44`; `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:896` | 4 | 4 | active |
| F010 | P1 | correctness | Resume/restart/fork/completed-continue are exposed as live lifecycle branches without any matching lineage write path | `I005` (`iteration-005.md:19`) | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167`; `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:143-146` | 5 | 5 | active |
| F011 | P2 | traceability | Resume-event examples remain skeletal even where the visible state contract expects lineage metadata | `I005` (`iteration-005.md:22`) | `.opencode/skill/sk-deep-research/references/loop_protocol.md:83`; `.opencode/skill/sk-deep-review/references/state_format.md:240-243` | 5 | 5 | active |
| F012 | P1 | correctness | Improve-agent docs promise resumable lineage modes that the shipped workflow cannot execute or surface | `I006` (`iteration-006.md:19`) | `.opencode/skill/sk-improve-agent/SKILL.md:292`; `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:36-42` | 6 | 6 | active |
| F013 | P2 | traceability | Phase 008 implementation summary overclaims REQ-024 closure | `I008` (`iteration-008.md:19`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:59`; `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:61-91` | 8 | 8 | active |
| F014 | P1 | traceability | Phase 008 closeout claims full requirement closure while open review P1s remain | `I009` (`iteration-009.md:19`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md:157`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-dashboard.md:35` | 9 | 9 | active |
| F015 | P2 | traceability | Reducer-owned `ACTIVE RISKS` summary hides non-P0 release-readiness debt | `I009` (`iteration-009.md:22`) | `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:832`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/deep-review-dashboard.md:100` | 9 | 9 | active |
| F016 | P1 | traceability | Root packet completion surfaces still certify an obsolete four-phase "implemented" state | `I010` (`iteration-010.md:18`) | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md:60`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md:95`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md:98`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md:23` | 10 | 10 | active |

### Finding Digests

#### F001
- **Risk**: a canonical reviewer following `.opencode/agent/deep-review.md` can produce markdown the reducer does not parse, which drops real findings out of the registry and dashboard.
- **Carry-forward note**: fix the authoritative authoring contract before relying on any parser-driven closeout automation.

#### F002
- **Risk**: claim-adjudication failure is recorded but not consumed by the legal-stop tree, so synthesis can happen even when the required adjudication packet is invalid or absent.
- **Carry-forward note**: this is the highest-priority loop-control gap because it affects release gating directly.

#### F003
- **Risk**: the persisted config row serializes `reviewDimensions` as one string element, which weakens replay quality and future schema migrations.
- **Carry-forward note**: keep it coupled to F001 so the emitted state contract is fixed together with the authoring contract.

#### F004
- **Risk**: the coverage graph still mutates rows by bare ID, so two sessions reusing the same node or edge ID can overwrite each other.
- **Carry-forward note**: this is the core session-isolation defect; the other graph findings are downstream evidence, tests, and docs.

#### F005
- **Risk**: the current regression suite proves filtered reads on disjoint fixtures, not isolation under shared-ID collision.
- **Carry-forward note**: keep this behind F004 so the test is updated against the repaired storage contract rather than the current broken behavior.

#### F006
- **Risk**: visible review and research references do not tell operators how graph-event IDs must remain namespaced or unique per session.
- **Carry-forward note**: land after F004 so the documentation reflects the repaired runtime, not the old bare-ID behavior.

#### F007
- **Risk**: reviewers are told to write prose claim-adjudication blocks even though the confirm workflow now requires typed packet fields.
- **Carry-forward note**: pair with F002 because runtime gating and the visible packet contract must close together.

#### F008
- **Risk**: the quick reference teaches the wrong weighted convergence vote, which points operators at the wrong tuning levers during manual audits.
- **Carry-forward note**: repair alongside F009 so the quick reference, convergence reference, and persisted JSONL contract align.

#### F009
- **Risk**: `convergence.md` still shows a persisted `legalStop` synthesis payload that the JSONL schema no longer writes.
- **Carry-forward note**: keep this in the documentation lane unless the remediation packet decides to restore `legalStop` persistence instead.

#### F010
- **Risk**: review and research workflows advertise resume/restart/fork/completed-continue branches but only initialize `new` lineage metadata and never emit transition events.
- **Carry-forward note**: this is the lifecycle runtime defect; fix it before touching example rows or packet closeout claims.

#### F011
- **Risk**: even if F010 is fixed later, the visible resume examples are still under-specified and omit lineage metadata fields operators are told to expect.
- **Carry-forward note**: close in the same packet as F010, after the real lifecycle event payload is settled.

#### F012
- **Risk**: `sk-improve-agent` promises resumable lineage modes without any workflow inputs, runtime branches, or reducer ancestry output to support them.
- **Carry-forward note**: the remediation packet must choose between shipping the lifecycle feature or shrinking the claim surface.

#### F013
- **Risk**: phase 008 implementation summary claims REQ-024 is fully closed even though the cited test still misses collision behavior.
- **Carry-forward note**: do not fix this summary until F004/F005 are resolved or explicitly descoped.

#### F014
- **Risk**: phase 008 closeout says all 25 requirements are closed while the live review packet still carries required debt.
- **Carry-forward note**: this should only move once the runtime/doc fixes are either landed or reclassified.

#### F015
- **Risk**: the reducer-generated dashboard hides active release-readiness debt whenever there is no P0, which makes quick scans deceptively calm.
- **Carry-forward note**: land with root closeout reconciliation so the dashboard and packet summaries tell the same truth.

#### F016
- **Risk**: the packet root still presents 042 as a completed four-phase bundle even though phases 005-008 and the live review ledger are not absorbed there.
- **Carry-forward note**: treat this as the final closure lane because it depends on the outcome of every earlier remediation decision.

## 4. Remediation Workstreams

### Lane 1: Claim-Adjudication Stop Gate Wiring

- **Findings**: F002, F007
- **Why first**: the loop can currently synthesize after a failed claim-adjudication packet, so the closing audit cannot trust required-stop behavior until this lane is fixed.
- **Target surfaces**: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`, `.opencode/skill/sk-deep-review/references/state_format.md`, `.opencode/skill/sk-deep-review/references/loop_protocol.md`
- **Required decision**: either wire `claim_adjudication_passed` into the legal-stop gate or explicitly downgrade the documentation so claim adjudication is no longer described as STOP-blocking.
- **Exit condition**: a failed or missing typed adjudication packet demonstrably blocks STOP and the operator-facing schema shows the exact typed fields the workflow enforces.
- **Validation proof**: add or extend static contract tests around STOP gating and packet schema parity, then re-run the targeted parity suite.

### Lane 2: Coverage-Graph Session Isolation

- **Findings**: F004, F005, F006, F013
- **Why second**: this is the only active security lane, and every release-facing REQ-024 claim depends on the storage contract actually being session-safe under collision.
- **Target surfaces**: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`, `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`, `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-review/references/state_format.md`, phase 008 closeout docs
- **Required decision**: choose a stable storage namespace model such as composite primary keys or deterministic session-qualified IDs; then document that model on the visible graph-event contract.
- **Exit condition**: shared-ID collisions no longer overwrite prior session rows, the isolation test fails on the pre-fix path and passes on the repaired path, and REQ-024 closeout language cites the repaired test coverage honestly.
- **Validation proof**: targeted vitest for collision reuse plus any DB-level migration or query proof the packet introduces.

### Lane 3: Lifecycle Persistence Across Review, Research, and Improve-Agent

- **Findings**: F010, F011, F012
- **Why third**: lineage branches are currently advertised but not persisted, and the packet should decide once whether it is implementing those branches or retracting them.
- **Target surfaces**: `spec_kit_deep-review_confirm.yaml`, `spec_kit_deep-research_confirm.yaml`, `sk-deep-review` and `sk-deep-research` references, `sk-improve-agent` skill/command/workflow/reducer surfaces
- **Required decision**: either implement `resume` / `restart` / `fork` / `completed-continue` as real runtime branches with event emission and ancestry metadata or narrow every user-facing promise to match the current one-session model.
- **Exit condition**: review, research, and improve-agent all tell the same lifecycle story and produce auditable lineage metadata consistent with their visible contract.
- **Validation proof**: contract-parity checks plus reducer/state-log assertions for the chosen lineage model.

### Lane 4: Canonical Documentation and State Contract Cleanup

- **Findings**: F001, F003, F008, F009
- **Why fourth**: these are still serious, but they are safer to repair after the runtime and lifecycle decisions stop moving.
- **Target surfaces**: `.opencode/agent/deep-review.md`, `sk-deep-review` references, the deep-review config JSONL writer in both workflow mirrors
- **Required decision**: pick one canonical iteration schema and one canonical persisted stop schema, then make every example and writer match it.
- **Exit condition**: the canonical agent, workflow outputs, quick reference, convergence reference, and state-format reference all describe the same parser-accepted structures.
- **Validation proof**: reducer-parity tests and a sample iteration file that round-trips into the registry without manual fixes.

### Lane 5: Packet Root Release-Readiness Reconciliation

- **Findings**: F014, F015, F016
- **Why last**: packet closeout surfaces should only be rewritten after the runtime, state, and documentation decisions are resolved.
- **Target surfaces**: phase 008 `implementation-summary.md`, packet-root `spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and the reducer-owned `ACTIVE RISKS` branch
- **Required decision**: either hold the packet in an explicitly conditional state until follow-up work lands or rewrite the closeout surfaces to describe the remaining debt accurately.
- **Exit condition**: packet root and dashboard no longer imply release-ready completion while active required findings remain.
- **Validation proof**: strict packet validation plus a fresh closing review snapshot that matches the packet-root summary.

### Workstream Dependency Notes

- Lane 1 unlocks trustworthy stop semantics; until it lands, any later PASS-style synthesis is still suspect.
- Lane 2 is the only security lane and should not be deferred behind documentation cleanup.
- Lane 3 depends on a product decision as much as implementation effort: ship lineage branches for real, or retract them everywhere.
- Lane 4 should be treated as canonical-surface cleanup after runtime truth is stable; otherwise the docs may be rewritten twice.
- Lane 5 is a release-management lane, not a discovery lane. It should consume the outputs of the first four lanes rather than run in parallel with them.
- F001 and F003 are best handled together because the canonical authoring schema and persisted config schema are the same operator contract from two directions.
- F004, F005, F006, and F013 should stay in one packet because each later finding only makes sense once the storage-layer identity story is fixed.
- F010, F011, and F012 should share one owner if possible so review, research, and improve-agent do not diverge again during remediation.
- F014, F015, and F016 should be revalidated with a fresh dashboard snapshot after edits; static prose updates alone are not enough.
- If the follow-up packet needs to split, split between runtime/state fixes (lanes 1-3) and release-surface reconciliation (lanes 4-5), not inside a lane.

## 5. Spec Seed

1. **REQ-026 [correctness] Claim adjudication must participate in legal STOP eligibility.**
The deep-review runtime must treat a failed or missing typed claim-adjudication packet as a STOP veto until remediation or downgrade logic explicitly clears it. Applies to `spec_kit_deep-review_auto.yaml` and its operator-facing confirm mirror.

2. **REQ-027 [traceability] Claim-adjudication packet schema must be canonical on the visible path.**
`state_format.md`, `loop_protocol.md`, and confirm/runtime validation must name the same machine-readable fields for adjudicating P0/P1 findings.

3. **REQ-028 [security] Coverage-graph storage identity must be session-isolated under shared IDs.**
Coverage-graph writes must preserve `specFolder + loopType + sessionId + id` isolation semantics even when multiple sessions reuse the same node or edge ID.

4. **REQ-029 [traceability] Graph-event namespace rules must be documented and regression-tested.**
Review and research state-format references must define `graphEvents` payload shape, namespace expectations, and the collision regression that proves the contract.

5. **REQ-030 [correctness] Lifecycle branches must either persist lineage transitions or be removed from exposed runtime choices.**
Review, research, and improve-agent may not advertise `resume`, `restart`, `fork`, or `completed-continue` unless those branches write auditable ancestry metadata.

6. **REQ-031 [traceability] Lifecycle examples must include the full persisted event contract.**
If lifecycle branches remain supported, all resume/restart/fork/completed-continue examples must carry the same metadata fields the JSONL/state-format contract requires.

7. **REQ-032 [correctness] Canonical review iteration output must match reducer parsing and config persistence.**
The deep-review agent schema and both config writers must emit structures that the shipped reducer accepts without hand normalization.

8. **REQ-033 [traceability] Convergence and stop-contract references must match persisted JSONL reality.**
Quick references and convergence docs must describe the same weighted signals, blocked-stop schema, and synthesis payload shape the runtime actually writes.

9. **REQ-034 [traceability] Release-readiness surfaces must not certify PASS while required review debt remains.**
Phase closeout summaries, packet-root completion artifacts, and reducer-owned dashboard risk summaries must reflect active P1/P2 debt until a fresh PASS review exists.

## 6. Plan Seed

1. **T001 [correctness] Wire claim-adjudication into the deep-review legal-stop tree**  
Target files: `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`  
Findings: F002  
REQ: REQ-026

2. **T002 [traceability] Replace prose claim-adjudication examples with the typed packet contract**  
Target files: `.opencode/skill/sk-deep-review/references/state_format.md`, `.opencode/skill/sk-deep-review/references/loop_protocol.md`  
Findings: F007  
REQ: REQ-027

3. **T003 [security] Change coverage-graph upsert identity to a session-safe namespace**  
Target files: `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts`, related query helpers if needed  
Findings: F004  
REQ: REQ-028

4. **T004 [security] Add a collision-path regression for shared node and edge IDs across sessions**  
Target files: `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`  
Findings: F005  
REQ: REQ-029

5. **T005 [traceability] Document graphEvents payload schema and namespace expectations on review and research references**  
Target files: `.opencode/skill/sk-deep-research/references/state_format.md`, `.opencode/skill/sk-deep-review/references/state_format.md`  
Findings: F006  
REQ: REQ-029

6. **T006 [correctness] Implement or retract lifecycle branches on deep-review and deep-research workflows**  
Target files: `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`, any paired auto assets touched by the chosen solution  
Findings: F010  
REQ: REQ-030

7. **T007 [traceability] Normalize lifecycle event examples and state-format rows after the runtime decision lands**  
Target files: `sk-deep-review` and `sk-deep-research` `state_format.md`, `loop_protocol.md`, `quick_reference.md`  
Findings: F011  
REQ: REQ-031

8. **T008 [correctness] Decide whether improve-agent ships lineage modes or narrows its promise surface**  
Target files: `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/command/improve/agent.md`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs`  
Findings: F012  
REQ: REQ-030

9. **T009 [correctness] Align the canonical deep-review agent schema with reducer parsing and fix config-array serialization**  
Target files: `.opencode/agent/deep-review.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`  
Findings: F001, F003  
REQ: REQ-032

10. **T010 [traceability] Reconcile quick-reference and convergence docs with the live stop schema**  
Target files: `.opencode/skill/sk-deep-review/references/quick_reference.md`, `.opencode/skill/sk-deep-review/references/convergence.md`, `.opencode/skill/sk-deep-review/references/state_format.md`  
Findings: F008, F009  
REQ: REQ-033

11. **T011 [traceability] Rewrite phase 008 closeout claims against the post-remediation evidence set**  
Target files: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md`  
Findings: F013, F014  
REQ: REQ-034

12. **T012 [traceability] Reconcile packet-root completion surfaces and dashboard risk wording with the live review ledger**  
Target files: `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md`, `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md`, `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md`, `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`  
Findings: F015, F016  
REQ: REQ-034

## 7. Traceability Status

| Protocol | Class | Status | Evidence | Gap |
|---|---|---|---|---|
| `spec_code` | core | fail | Iterations 1, 2, 5, 6, 9, and 10 all recorded hard failures between packet/runtime claims and the shipped path; see F001, F002, F004, F010, F012, F014, F016 | Runtime and packet surfaces still promise behavior the code does not fully implement or gate |
| `checklist_evidence` | core | fail | `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md:95-97`; `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md:60-61`; F014, F016 | Completion artifacts certify implemented status without absorbing the live review debt |
| `feature_catalog_code` | overlay | fail | `.opencode/skill/sk-improve-agent/SKILL.md:292-294`; `.opencode/command/improve/agent.md:332-339`; `.opencode/skill/sk-deep-review/references/quick_reference.md:145-151`; F008, F012 | Operator-facing capability summaries market lifecycle and convergence behavior not supported by the live workflows |
| `playbook_capability` | overlay | partial | `.opencode/skill/sk-deep-review/references/state_format.md:621-635`; `.opencode/skill/sk-deep-review/references/convergence.md:44-87`; `.opencode/skill/sk-deep-research/references/loop_protocol.md:83`; F007, F009, F011 | The playbooks are structurally present and close to the live flow, but key packet examples and persisted schemas are still stale |

Traceability is strongest where the reducer and state log tell the truth about the current session, and weakest where packet-root or quick-reference surfaces compress that truth into earlier "implemented" or "low-risk follow-up" framing. The follow-up remediation packet should therefore treat every closeout artifact as downstream of the runtime contract, not as independent evidence.

## 8. Deferred Items

1. **F003 (P2)** — keep coupled to F001 so the config-array serialization is fixed against the settled canonical iteration contract, not an interim schema.
2. **F005 (P2)** — land only after F004 chooses the permanent storage namespace, then write the collision regression against that chosen model.
3. **F009 (P2)** — resolve after the team decides whether `legalStop` should return to persisted JSONL or remain an in-memory/convergence-only concept.
4. **F011 (P2)** — update the lifecycle examples only after F010 settles whether the lifecycle branches stay live.
5. **F013 (P2)** — rewrite the REQ-024 closeout language only after F004/F005 are closed or explicitly descoped.
6. **F015 (P2)** — revise reducer-owned risk summaries in the same packet that reconciles packet-root closeout wording, so dashboard and packet root ship together.
7. **Blocked downgrade check: lifecycle persistence** — iteration 7 found no new reducer or test evidence that downgrades F010/F012, so do not spend another audit pass here until runtime code or workflow branches actually change.
8. **Blocked downgrade check: graph isolation** — iteration 8 found no hidden collision coverage outside the dedicated isolation suite, so do not reopen REQ-024 closure claims without a new shared-ID regression.

## 9. Audit Appendix

### Iteration Table

| Run | Focus | Dimensions | New P0 | New P1 | New P2 | `newFindingsRatio` | Status |
|---|---|---|---:|---:|---:|---:|---|
| 1 | correctness contracts on review loop runtime | correctness, traceability | 0 | 2 | 1 | 1.00 | complete |
| 2 | security session scoping on coverage graph runtime | security, traceability, maintainability | 0 | 1 | 1 | 0.40 | complete |
| 3 | graph identity namespace contracts | security, traceability, maintainability | 0 | 1 | 0 | 0.17 | complete |
| 4 | confirm/reference contract drift on claim adjudication and convergence docs | traceability, maintainability | 0 | 2 | 1 | 0.33 | complete |
| 5 | lifecycle branch persistence across resume/restart/fork mirrors | correctness, traceability, maintainability | 0 | 1 | 1 | 0.18 | complete |
| 6 | improve-agent lifecycle mirror and snapshot claims | correctness, traceability, maintainability | 0 | 1 | 0 | 0.08 | complete |
| 7 | traceability closure on lifecycle persistence and claim-adjudication gating | traceability, correctness | 0 | 0 | 0 | 0.00 | complete |
| 8 | session-isolation closure claims and graph namespace coverage | traceability, maintainability | 0 | 0 | 1 | 0.08 | complete |
| 9 | release-readiness traceability on bundle summaries and reducer risk surfaces | traceability, maintainability | 0 | 1 | 1 | 0.13 | complete |
| 10 | root completion surface trustworthiness | traceability, maintainability | 0 | 1 | 0 | 0.06 | complete |

### Iteration Notes

- **Run 1** established the two highest-value correctness breaks on the review loop itself: parser mismatch and unused claim-adjudication gating.
- **Run 2** found the only active security runtime defect: bare-ID coverage-graph upserts still permit cross-session overwrite.
- **Run 3** converted the graph issue from storage-only to contract-visible by showing the namespace rule is not documented on the public path.
- **Run 4** shifted into operator references and found the strongest documentation blockers: typed adjudication drift and wrong convergence math in the quick reference.
- **Run 5** proved that review/research lifecycle branches are exposed without any persisted lineage transition path.
- **Run 6** showed that the same lifecycle over-promise exists on `sk-improve-agent`, extending the issue beyond the review/research runtime.
- **Run 7** attempted to downgrade the lifecycle and claim-adjudication findings and found no new reducer or test evidence sufficient to do so.
- **Run 8** attempted to downgrade the graph isolation findings and found no shared-ID regression evidence beyond the already-known blind spot.
- **Run 9** shifted into release readiness and found that phase 008 closeout and dashboard risk wording are both ahead of the evidence.
- **Run 10** confirmed that the packet root itself still certifies an obsolete completed state and therefore cannot be treated as trustworthy release guidance.

### Convergence Replay

| Run | `newFindingsRatio` | Cumulative P1 | Cumulative P2 | Interpretation |
|---|---:|---:|---:|---|
| 1 | 1.00 | 2 | 1 | First-pass discovery sweep on the live review loop |
| 2 | 0.40 | 3 | 2 | Security defect found; novelty still high |
| 3 | 0.17 | 4 | 2 | Graph namespace issue narrowed to contract visibility |
| 4 | 0.33 | 6 | 3 | Operator-reference drift produced a second novelty spike |
| 5 | 0.18 | 7 | 4 | Lifecycle persistence gap established |
| 6 | 0.08 | 8 | 4 | Improve-agent extended the lifecycle pattern |
| 7 | 0.00 | 8 | 4 | Closure attempt produced no downgrades and no new findings |
| 8 | 0.08 | 8 | 5 | One new advisory on REQ-024 overclaim |
| 9 | 0.13 | 9 | 6 | Release-readiness surfaces produced one required and one advisory finding |
| 10 | 0.06 | 10 | 6 | Final packet-root audit added the closing required finding |

The ratio trajectory was `1.00 -> 0.40 -> 0.17 -> 0.33 -> 0.18 -> 0.08 -> 0.00 -> 0.08 -> 0.13 -> 0.06`. That is convergent enough to stop hunting for new issue families, but not strong enough to grant PASS because the remaining issue families are still required release blockers. Final `convergenceScore`: `0.94`.

### File Coverage Matrix

The matrix below tracks evidence-backed hotspot coverage from the structured `filesReviewed` arrays in `deep-review-state.jsonl`.

| File | I1 | I2 | I3 | I4 | I5 | I6 | I7 | I8 | I9 | I10 |
|---|---|---|---|---|---|---|---|---|---|---|
| `.opencode/agent/deep-review.md` | X |  |  |  |  |  |  |  |  |  |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | X |  |  | X | X |  | X |  |  |  |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | X | X | X | X | X |  | X | X |  |  |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | X | X |  |  | X |  |  |  |  |  |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` |  |  | X |  | X |  | X | X |  |  |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | X | X |  | X | X |  | X |  | X |  |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | X | X |  |  | X |  | X |  |  |  |
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts` |  | X | X |  |  |  |  | X |  |  |
| `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts` |  | X |  |  |  |  |  | X |  |  |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts` |  |  |  |  |  |  | X | X |  |  |
| `.opencode/skill/sk-deep-research/references/state_format.md` |  |  | X |  | X |  |  |  |  |  |
| `.opencode/skill/sk-deep-review/references/state_format.md` |  |  | X | X | X |  |  |  |  |  |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` |  |  |  | X | X | X |  |  |  |  |
| `.opencode/skill/sk-deep-review/references/convergence.md` |  |  |  | X |  |  |  |  |  |  |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` |  | X |  | X | X |  |  |  |  |  |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` |  | X |  |  | X |  |  |  |  |  |
| `.opencode/skill/sk-improve-agent/SKILL.md` |  |  |  |  |  | X |  |  |  |  |
| `.opencode/command/improve/agent.md` |  |  |  |  |  | X |  |  |  |  |
| `.opencode/command/improve/assets/improve_agent-improver_auto.yaml` |  |  |  |  |  | X |  |  |  |  |
| `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml` |  |  |  |  |  | X |  |  |  |  |
| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` |  | X |  |  |  | X |  |  |  |  |
| `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md` | X | X | X | X |  | X | X | X | X |  |
| `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/implementation-summary.md` |  |  |  |  |  |  |  | X | X | X |
| `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md` | X |  |  |  |  | X |  |  | X | X |
| `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md` |  |  |  |  |  |  |  |  |  | X |
| `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/checklist.md` |  |  |  |  |  |  |  |  |  | X |
| `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/tasks.md` |  |  |  |  |  |  |  |  |  | X |
| `.opencode/changelog/13--sk-deep-review/v1.3.0.0.md` |  |  |  |  |  |  |  |  | X |  |
| `.opencode/changelog/15--sk-improve-agent/v1.2.0.0.md` |  |  |  |  |  |  |  |  | X |  |

### Dimension Breakdown

Active findings were concentrated in correctness, security, and traceability. Maintainability was exercised in 8 of the 10 iterations as a review lens, but it did not produce a standalone active finding family by the end of the session.

| Dimension | P1 | P2 | Total active |
|---|---:|---:|---:|
| correctness | 4 | 1 | 5 |
| security | 2 | 1 | 3 |
| traceability | 4 | 4 | 8 |
| maintainability | 0 | 0 | 0 |

Dimension normalization note: the reducer registry currently serializes bracket-prefixed dimension strings on F010, F011, F013, and F016. This report uses the intended primary dimension from the source iteration file so the handoff stays readable.

### Release Gate Snapshot

- **Loop correctness gate**: blocked by F001, F002, F003, F007
- **Security/isolation gate**: blocked by F004, with F005/F006/F013 proving coverage and documentation are not yet sufficient
- **Lifecycle lineage gate**: blocked by F010 and F012, with F011 documenting the example drift that would remain even after runtime repair
- **Operator reference gate**: blocked by F008 and F009 until quick references and persisted schema examples match
- **Phase 008 closeout gate**: blocked by F013 and F014
- **Packet-root release gate**: blocked by F015 and F016
- **Dashboard truthfulness gate**: blocked by F015 because non-P0 debt is hidden in the `ACTIVE RISKS` summary
- **Planning recommendation**: keep the next packet explicitly remediation-focused; this audit did not find evidence that a changelog-only closeout would be truthful
- **Current release-readiness state**: not PASS-ready
- **Minimum condition for re-review**: close all P1 findings or downgrade them with new file:line-backed evidence

### Methodology Notes

- Per-iteration engine: Codex CLI GPT-5.4 high fast mode
- Review mode: static review only; no runtime execution or test commands were run during this closing audit
- Source set read for synthesis: all 10 iteration files, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, and the canonical review-report contract in `state_format.md`
- Session hard cap: 10 iterations
- Final session counts: 16 active findings total, split `10 x P1` and `6 x P2`
- No `blocked_stop` event was recorded in `deep-review-state.jsonl`
- Phase 008 closing-audit findings `P1-01` through `P1-04` were treated as settled background context and were not re-reported as new findings in this session
- All findings carried forward here remain file:line-backed and tied to their iteration of origin
