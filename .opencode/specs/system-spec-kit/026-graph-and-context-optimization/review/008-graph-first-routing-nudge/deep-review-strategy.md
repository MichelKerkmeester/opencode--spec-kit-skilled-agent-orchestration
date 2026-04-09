---
title: "Deep Review Strategy - 008-graph-first-routing-nudge"
description: "Session tracking for Batch B review of 008-graph-first-routing-nudge."
---

# Deep Review Strategy - 008-graph-first-routing-nudge

## 1. OVERVIEW

Batch review packet for `008-graph-first-routing-nudge`.

## 2. TOPIC

Batch review of `008-graph-first-routing-nudge`

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness - Advisory routing nudge behavior and readiness gating
- [ ] D2 Security - Fail-closed gating and avoidance of unsafe authority escalation
- [ ] D3 Traceability - Spec/checklist/implementation-summary alignment
- [ ] D4 Maintainability - Clarity, bounded advisory scope, and documentation honesty
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- No new router design or broader retrieval changes.
- No modification of startup or resume ownership beyond reviewing the shipped hints.

## 5. STOP CONDITIONS

- Stop at 10 iterations max.
- Stop early on convergence if two consecutive iterations add no new findings.
- Stop immediately if routing claims cannot be tied back to a bounded runtime surface.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | `session-prime.ts` emits a startup structural-routing hint on graph readiness alone, which is looser than the packet's readiness-plus-scaffolding gate. |
| D2 Security | PASS | 2 | The nudge remains advisory-only and does not overwrite bootstrap ownership, but the hook path still needs the promised gate. |
| D3 Traceability | CONDITIONAL | 3 | Spec, implementation summary, and tests claim a stricter gate than the startup hook actually enforces. |
| D4 Maintainability | CONDITIONAL | 4 | One ungated hook path breaks the otherwise consistent routing-nudge contract across surfaces. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Comparing all three nudge surfaces together quickly exposed that `context-server.ts` and `memory-context.ts` were gated differently from `session-prime.ts`.
- The focused regression file was useful for proving what *was* covered, which made the missing hook-path coverage obvious.

## 9. WHAT FAILED

- The packet's focused test suite does not exercise the `session-prime.ts` startup hook path, so the claimed scaffolding gate is unproven on that surface.

## 10. EXHAUSTED APPROACHES (do not retry)

- None yet.

## 11. RULED OUT DIRECTIONS

- The nudge is not replacing bootstrap authority; the issue is specifically that one hook surface is less gated than the packet contract claims.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Complete after 10 iterations. Active finding remains on the startup or resume hint path in `session-prime.ts`; remediation should either add the missing activation-scaffold gate or narrow the packet claims and tests to the surfaces that actually enforce it.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

- Implementation summary claims the packet ships a narrow graph-first advisory nudge across startup, bootstrap, response-hint, and `memory_context` surfaces.
- It also claims the focused regression suite proves the nudge only fires with readiness plus activation scaffolding and stays off for semantic queries.
- Known limitation: startup and resume hints are intentionally generic because SessionStart priming has no user task yet.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 3 | `session-prime.ts` is looser than the packet's readiness-plus-scaffolding gate. |
| `checklist_evidence` | core | partial | 3 | The checklist and implementation summary overstate coverage because the focused tests skip the startup hook path. |
| `skill_agent` | overlay | notApplicable | 0 | No skill-agent cross-runtime surface in packet scope |
| `agent_cross_runtime` | overlay | notApplicable | 0 | No agent runtime parity work in packet scope |
| `feature_catalog_code` | overlay | notApplicable | 0 | No feature catalog surface in packet scope |
| `playbook_capability` | overlay | notApplicable | 0 | No playbook surface in packet scope |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | [D1, D4] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | [D1, D2, D3, D4] | 10 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` | [D1, D2] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | [D1, D2, D4] | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts` | [D1, D3] | 10 | 0 P0, 0 P1, 0 P2 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-04-09T14:20:47Z-008-graph-first-routing-nudge, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code`,`checklist_evidence`; overlay=`skill_agent`,`agent_cross_runtime`,`feature_catalog_code`,`playbook_capability`
- Started: 2026-04-09T14:20:47Z
<!-- MACHINE-OWNED: END -->
