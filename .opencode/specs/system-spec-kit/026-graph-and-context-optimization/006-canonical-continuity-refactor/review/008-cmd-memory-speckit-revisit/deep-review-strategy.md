---
title: "Deep Review Strategy - 008-cmd-memory-speckit-revisit"
description: "Session tracking for Batch 3/5 review of 008-cmd-memory-speckit-revisit."
---

# Deep Review Strategy - 008-cmd-memory-speckit-revisit

## 1. OVERVIEW

Batch review packet for `008-cmd-memory-speckit-revisit`.

## 2. TOPIC

Verify that the authoritative `memory` and `spec_kit` command surfaces match the post-canonical-continuity runtime behavior, with special attention to save and scan semantics.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness - Canonical save command behavior
- [x] D2 Security - No unsafe or legacy shared-memory command claims
- [x] D3 Traceability - Command docs versus handler behavior
- [x] D4 Maintainability - Scan/save guidance clarity for operators
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- No runtime code changes.
- No README-only review outside the command files.

## 5. STOP CONDITIONS

- Stop at 2 iterations max for this batch allocation.
- Stop early only if both passes add no new findings.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | `/memory:save` under-documents the canonical save side effects by omitting graph-metadata refresh. |
| D3 Traceability | CONDITIONAL | 1-2 | `save.md` and `manage.md` each drift from the handler behavior in a different way. |
| D2 Security | PASS | 2 | No live shared-memory or unsafe recovery wording remained in the reviewed command surfaces. |
| D4 Maintainability | CONDITIONAL | 2 | The scan-pipeline documentation understates a now-live indexed artifact class. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +1 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Iteration 1: Comparing `memory/save.md` directly against the CLI help text and workflow hook exposed the save-side-effect gap immediately.
- Iteration 2: Reading `memory/manage.md` beside `memory-index.ts` made the missing graph-metadata scan source easy to confirm.

## 9. WHAT FAILED

- No failed review approaches in this packet.

## 10. EXHAUSTED APPROACHES (do not retry)

- None.

## 11. RULED OUT DIRECTIONS

- `/spec_kit:resume` itself already documents `graph-metadata.json` correctly and does not drive the command-surface drift here.
- The reviewed command docs no longer advertise live shared-memory command modes.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Complete after 2 iterations. The active fixes are to describe graph-metadata refresh explicitly in `/memory:save` and to update `/memory:manage` from a 3-source to a 4-source scan model.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Packet `008` revisited the command docs after canonical continuity replaced memory-file-first recovery.
- Packet `011` added graph-metadata refresh and indexing to the canonical save and scan workflows.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1-2 | `/memory:save` and `/memory:manage` both under-describe the live save/scan behavior. |
| `checklist_evidence` | core | partial | 2 | Packet closure claims are broadly true, but these two command surfaces are still behind runtime reality. |
| `feature_catalog_code` | overlay | notApplicable | 0 | No feature-catalog surface was in the requested scope. |
| `playbook_capability` | overlay | notApplicable | 0 | No playbook surface was in the requested scope. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/command/memory/save.md` | [D1, D3, D4] | 1 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/command/memory/manage.md` | [D3, D4] | 2 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | [D1, D3] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | [D1, D3] | 1 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | [D3, D4] | 2 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | [D3, D4] | 2 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 2
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-12T17:05:00Z-008-cmd-memory-speckit-revisit, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 15 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`,`checklist_evidence`; overlay=`feature_catalog_code`,`playbook_capability`
- Started: 2026-04-12T17:05:00Z
<!-- MACHINE-OWNED: END -->
