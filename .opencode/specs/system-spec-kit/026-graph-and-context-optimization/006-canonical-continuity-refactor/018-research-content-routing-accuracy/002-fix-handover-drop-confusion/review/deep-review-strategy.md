# Deep Review Strategy - Phase 002

## 1. OVERVIEW

Review the handover-versus-drop classifier refinement as a bounded signal-priority lane. The loop stayed on the live scoring rules, the refreshed handover prototypes, and the focused router tests to verify that command-heavy stop-state notes no longer collapse into drop while true wrapper transcripts still do.

## 2. TOPIC

Phase review: 002-fix-handover-drop-confusion

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Changing downstream handover merge behavior.
- Reclassifying drop prototypes that were already correct.
- Editing the router or tests during this review pass.

## 5. STOP CONDITIONS

- Stop after 10 iterations unless a new P0 or P1 regression appears in the handover/drop boundary.
- Escalate if soft operational commands still dominate genuine handover language or if transcript-wrapper drop rules weaken.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 10 | Strong stop-state language still beats soft command mentions, while transcript wrappers remain hard drop candidates. |
| D2 Security | notApplicable | 10 | The phase stayed inside local scoring heuristics and did not add a new security surface. |
| D3 Traceability | PASS | 10 | The sub-phase scope, shipped scoring rules, and focused router tests remain aligned. |
| D4 Maintainability | PASS | 10 | The soft-versus-hard drop split is localized to named cue groups and proportionate regression tests. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 0 active
- P2: 0 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Reading the handover, drop, and soft-operational cue groups together made the intended precedence explicit.
- Cross-checking the focused router tests against the scoring block quickly separated the softened command cases from the preserved hard transcript-wrapper drop path.
- The same green `content-router.vitest.ts` run provided a stable final verification signal after the source review.

## 9. WHAT FAILED

- Assuming command-heavy text was still treated as a hard drop path without first distinguishing the soft operational cue set from the hard wrapper rules.

## 10. RULED OUT DIRECTIONS

- Soft command mentions still forcing drop over handover: ruled out by the scoring block and the focused handover tests.
- Hard wrapper drop rules weakening while softening command handling: ruled out by the preserved Tier1 hard drop rules and wrapper regression test.

## 11. NEXT FOCUS

Completed. No active findings remain after iteration 10.

## 12. KNOWN CONTEXT

- Packet 002 exists only to rebalance handover and drop scoring when stop-state language coexists with commands or tool mentions.
- The user explicitly scoped the review to router logic, prototypes, and focused tests rather than downstream handover consumption.
- The packet is intentionally bounded away from new categories or downstream merge behavior.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 10 | The scoring logic now preserves handover state when strong stop-state language coexists with soft command mentions. |
| `checklist_evidence` | core | pass | 10 | The focused router tests cover both command-heavy handover text and hard transcript-wrapper drop content. |
| `skill_agent` | overlay | notApplicable | 10 | No skill or agent contract is owned by this phase. |
| `agent_cross_runtime` | overlay | notApplicable | 10 | No cross-runtime surface is in scope. |
| `feature_catalog_code` | overlay | notApplicable | 10 | No feature catalog surface is owned here. |
| `playbook_capability` | overlay | notApplicable | 10 | No playbook surface is in scope. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/002-fix-handover-drop-confusion/spec.md` | D1, D3 | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | D1, D3, D4 | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` | D3, D4 | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | D1, D3, D4 | 10 | 0 P0, 0 P1, 0 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T08:21:00Z-002-fix-handover-drop-confusion-deep-review`, parentSessionId=`2026-04-13T08:19:00Z-018-content-routing-review-wave`, generation=`1`, lineageMode=`new`
- Cross-reference checks: core=`spec_code`, `checklist_evidence`; overlay=`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Command-heavy handover routing opens a new external execution surface: ruled out because the phase only adjusts classification heuristics. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Command-heavy handover routing opens a new external execution surface: ruled out because the phase only adjusts classification heuristics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command-heavy handover routing opens a new external execution surface: ruled out because the phase only adjusts classification heuristics.

### Coverage misses the command-heavy handover shape promised by the spec: ruled out by `tests/content-router.vitest.ts:133-141`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Coverage misses the command-heavy handover shape promised by the spec: ruled out by `tests/content-router.vitest.ts:133-141`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Coverage misses the command-heavy handover shape promised by the spec: ruled out by `tests/content-router.vitest.ts:133-141`.

### Focused router suite failed to protect the handover/drop boundary: ruled out by the green Vitest run. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Focused router suite failed to protect the handover/drop boundary: ruled out by the green Vitest run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Focused router suite failed to protect the handover/drop boundary: ruled out by the green Vitest run.

### Handover/drop balance now depends on scattered magic numbers: ruled out by the named cue constants and localized scoring block. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Handover/drop balance now depends on scattered magic numbers: ruled out by the named cue constants and localized scoring block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Handover/drop balance now depends on scattered magic numbers: ruled out by the named cue constants and localized scoring block.

### Hard wrapper drop behavior regressed while softening command handling: ruled out by `content-router.ts:359-371` and `tests/content-router.vitest.ts:205-214`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Hard wrapper drop behavior regressed while softening command handling: ruled out by `content-router.ts:359-371` and `tests/content-router.vitest.ts:205-214`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hard wrapper drop behavior regressed while softening command handling: ruled out by `content-router.ts:359-371` and `tests/content-router.vitest.ts:205-214`.

### Late-stage drift reintroduced drop dominance for command-heavy handover text: ruled out by the combined code/test pass. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Late-stage drift reintroduced drop dominance for command-heavy handover text: ruled out by the combined code/test pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Late-stage drift reintroduced drop dominance for command-heavy handover text: ruled out by the combined code/test pass.

### None. -- BLOCKED (iteration 10, 10 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Packet 002 changed downstream handover merge behavior: ruled out by the sub-phase spec and untouched downstream handler surfaces. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Packet 002 changed downstream handover merge behavior: ruled out by the sub-phase spec and untouched downstream handler surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet 002 changed downstream handover merge behavior: ruled out by the sub-phase spec and untouched downstream handler surfaces.

### Residual handover/drop regression after the fix wave: ruled out by repeated no-new-findings passes and the green focused router suite. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Residual handover/drop regression after the fix wave: ruled out by repeated no-new-findings passes and the green focused router suite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residual handover/drop regression after the fix wave: ruled out by repeated no-new-findings passes and the green focused router suite.

### Soft command mentions still force drop over handover: ruled out by `content-router.ts:907-947` and `tests/content-router.vitest.ts:121-141`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Soft command mentions still force drop over handover: ruled out by `content-router.ts:907-947` and `tests/content-router.vitest.ts:121-141`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Soft command mentions still force drop over handover: ruled out by `content-router.ts:907-947` and `tests/content-router.vitest.ts:121-141`.

### Soft command patterns still behave like hard wrapper drop signals: ruled out by `content-router.ts:943-947`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Soft command patterns still behave like hard wrapper drop signals: ruled out by `content-router.ts:943-947`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Soft command patterns still behave like hard wrapper drop signals: ruled out by `content-router.ts:943-947`.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. No active findings remain after iteration 10.

<!-- /ANCHOR:next-focus -->
