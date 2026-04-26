---
title: Deep Review Strategy
description: Mutable review strategy for the v5 remediation closure audit packet.
---

# Deep Review Strategy - v5 Remediation Closure Audit

## 2. TOPIC
Fresh v5 audit that re-verifies closure of F005-F010 and confirms F001-F004 plus NF001-NF003 remain closed after the remediation sweep.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - runtime retired-surface rejection and shared_space_id startup semantics still match the claimed contract
- [x] D2 Security - no new trust-boundary or stale-surface exposure was introduced by remediation
- [x] D3 Traceability - spec, checklist, changelog, agents, commands, workflows, feature catalog, playbooks, and runtime all describe the same contract
- [x] D4 Maintainability - no stale comments, dead refs, orphan tests, or broken cross-links remain in scope
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not modify audited implementation or documentation files.
- Do not overwrite or revise `review/`, `review/v2/`, `review/v3/`, or `review/v4/`.
- Do not use web sources; this audit is repo-only and read-only outside the new packet.

## 5. STOP CONDITIONS
- Stop after 10 iterations unless an unrecoverable packet-corruption issue blocks the loop.
- Any prior finding that is not actually fixed is an active blocker.
- Any newly confirmed P0 blocks PASS after adversarial self-check.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Runtime still rejects retired `specs/**/memory/*.md` paths, startup-drop semantics remain behaviorally aligned, and no correctness regression surfaced from the reviewed test cleanup. |
| D3 Traceability | FAIL | 2 | F005 remains open because `spec.md` still mixes every-startup semantics with one-time and first-launch wording even though the changelog, checklist, and runtime helper now align. |
| D2 Security | PASS | 8 | Save and index flows still reject retired paths, stay constrained to canonical documents, and keep deprecated shared_space_id handling fail-safe. |
| D4 Maintainability | PASS with advisories | 9 | F009 is closed and no stale test residue remains, but one new P2 temp-path wording advisory surfaced in save and handover docs. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 4 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 3 active
- **Delta this iteration:** +2 P0, -3 P1, +1 P2 overall since iteration 7 (F011 closed; F003 and NF002 escalated under packet severity rules)
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Re-checking the parser gate, save handler, startup helper, and regression tests together gave a fast correctness baseline with executable evidence instead of relying on prior packet summaries. (iteration 1)
- Narrowing F005 to the four claimed alignment surfaces showed the changelog is no longer the problem; `spec.md` is now the only audited surface still carrying one-time / first-launch drift. (iteration 2)
- The memory command-doc family split cleanly once reviewed together: `manage.md` now matches runtime, which isolates the remaining drift to `save.md` and `README.txt` instead of the whole command surface. (iteration 3)
- The workflow-family sweep confirmed the placeholder/path remediations landed broadly; only two confirm-variant prose blocks remain out of line, which cleanly separates closed F007 work from the still-open NF002 wording drift. (iteration 4)
- The create-command sweep confirmed the intended remediations actually landed in both workflow families: F010 is closed and NF001 stays closed, which isolates the residual drift to a documentation-only issue in `create/agent.md`. (iteration 5)
- The lifecycle-doc portion of the sweep confirms the core continuity contract is now canonical-spec-doc based, which keeps F004 closed even while the agent-manual parity issue reappears. (iteration 6)
- The discovery/feature-catalog slice confirms F008's core contract still holds, which lets the remaining catalog/playbook drift stay downgraded to P2 documentation accuracy issues. (iteration 7)
- The security sweep cleanly separated operator-facing traceability drift from runtime exposure risk: no new trust-boundary regression surfaced in save, index, validator, or startup helper logic. (iteration 8)
- The maintainability sweep confirmed the intended F009 comment fix landed and did not uncover broader stale-test residue, keeping the remaining quality drift in low-severity documentation examples. (iteration 9)
- The stabilization pass confirmed the final blocker set is smaller than the mid-loop open set: F011 closes, F002 stays derivative-only, and the remaining blockers are all prior expected-closed findings still open under the packet rule. (iteration 10)

## 9. WHAT FAILED
- No correctness defects surfaced in the first pass; deeper cross-surface traceability still needs a dedicated iteration. (iteration 1)
- The remediation did not fully converge because `001-remove-shared-memory/spec.md` still mixes the fixed every-startup story with older one-time migration wording. (iteration 2)
- The command-doc cleanup is incomplete: `memory/save.md` still uses continuity-artifact framing and `memory/README.txt` still drifts from the runtime's 3-source scan contract. (iteration 3)
- The workflow cleanup is not fully uniform because `spec_kit_plan_confirm.yaml` and `spec_kit_implement_confirm.yaml` still use continuity-artifact wording even though the rest of the family now uses canonical-spec-document phrasing. (iteration 4)
- `create/agent.md` still tells operators to load recent memory files even though the surrounding create-command contract is otherwise routed through canonical spec docs. (iteration 5)
- Cross-runtime deep-review manuals no longer agree on the reducer-facing iteration artifact schema, reopening F003 as a P1 parity defect. (iteration 6)
- The consolidated feature catalog and operator-facing verification summaries still lag behind the current lease-aware and full three-source discovery contract. (iteration 7)
- The blocker set remains documentation-driven; the security pass found no leverage to downgrade or invalidate the active P0/P1 traceability findings. (iteration 8)
- Mixed hard-coded `/tmp` examples still survive in save and handover docs even though the normalized temp-path form is already documented elsewhere. (iteration 9)
- The remaining open set still spans multiple operator-facing surfaces (`spec.md`, `memory/save.md`, README/confirm YAMLs, and cross-runtime agent manuals), so the packet cannot converge to PASS or CONDITIONAL. (iteration 10)

## 10. EXHAUSTED APPROACHES (do not retry)
None yet.

## 11. RULED OUT DIRECTIONS
- Legacy `/memory/` parsing support in `extractSpecFolder()` is not an active correctness bug because acceptance is still gated by `isMemoryFile()` and `memory-save`. (iteration 1, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955`)
- The startup helper/comment remediation did not introduce an obvious destructive side effect; the helper remains idempotent and swallows unsupported `DROP COLUMN` failures. (iteration 1, evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1534`)
- The changelog no longer carries the old first-launch-only wording; both reviewed entries now match the runtime helper's every-startup idempotent retry semantics. (iteration 2, evidence: `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md:94`)
- The checklist/runtime pairing remains aligned; the traceability blocker is isolated to `spec.md` in this pass. (iteration 2, evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md:53`)

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis complete - final report should capture 4 blocker findings, 0 active P1 findings, and 3 advisory P2 findings.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
- F001, F003, F008, NF001, and NF003 were previously closed and must remain closed.
- F002 should remain closed if F005's startup semantics are aligned everywhere.
- F004, NF002, F005, F006, F007, F009, and F010 were the live v4 closure risks and need direct re-verification in v5.
- The remediation explicitly touched changelog wording, memory command docs, spec-kit workflow YAMLs, create-command docs/YAMLs, scratch checkpoint paths, and the stale test comment.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 2 | `spec.md` still contradicts the every-startup runtime contract by mixing in one-time / first-launch wording. |
| `checklist_evidence` | core | pass | 2 | Checklist CHK-013 still matches the current helper semantics and startup call site. |
| `skill_agent` | overlay | pending | 0 | Pending runtime-agent parity sweep. |
| `agent_cross_runtime` | overlay | fail | 6 | `.opencode` and `.codex` still prescribe the legacy iteration artifact schema while `.claude` and `.gemini` require the reducer-readable canonical template. |
| `feature_catalog_code` | overlay | partial | 7 | F008 stays closed in its core form, but the master catalog is stale on lease semantics and the full three-source contract. |
| `playbook_capability` | overlay | partial | 7 | F004 remains functionally closed, but the playbook/catalog verification surface still under-describes graph-metadata coverage. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/**` | [D1] | 1 | 0 P0, 0 P1, 0 P2 | partial |
| `.opencode/skill/system-spec-kit/scripts/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/skill/system-spec-kit/feature_catalog/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/command/**` | [D3] | 3 | 1 P0, 1 P1, 0 P2 | partial |
| `.opencode/agent/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.claude/agents/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.codex/agents/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.gemini/agents/**` | [] | 0 | 0 P0, 0 P1, 0 P2 | pending |
| `.opencode/changelog/01--system-spec-kit/v3.4.0.0.md` | [D3] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/spec.md` | [D1,D3] | 2 | 1 P0, 0 P1, 0 P2 | partial |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup-playbooks/002-cleanup-and-audit/001-remove-shared-memory/checklist.md` | [D1,D3] | 2 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.05
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=review-v5-20260414T153445Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-04-14T15:34:45.588Z
<!-- MACHINE-OWNED: END -->
