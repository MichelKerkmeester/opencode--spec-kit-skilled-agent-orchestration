# Deep Review Strategy - Root 018

## 1. OVERVIEW

This root review covers the post-implementation, post-doc-alignment, post-flag-removal state of `018-research-content-routing-accuracy` plus child phases `001` through `004`. The loop stayed read-only on the review target and focused on the live router, the save handler, merge behavior, tests, doc mirrors, MCP config mirrors, agent mirrors, and the child-phase packet closeout state.

## 2. TOPIC

Root review: 018-research-content-routing-accuracy

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Re-running or modifying the child-phase review packets under `001` to `003`.
- Editing the routed save runtime or documentation surfaces as part of this review.
- Reopening broader 026 packet work outside the requested routing-accuracy lane.

## 5. STOP CONDITIONS

- Stop after 10 iterations unless a new P0 appears in the live router/save path.
- Escalate immediately if the current runtime still routes Tier 3 through a removed opt-in flag or if the save path can silently lose continuity state.
- Keep target writes out of scope; only `018.../review/` artifacts may change.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 10 | The main router/save path fixes from phase 003 are present, but metadata-only continuity can still land on a non-canonical host doc when the save source is already a spec doc. |
| D2 Security | notApplicable | 10 | The reviewed changes stay inside routing, documentation, and packet traceability; no new auth or data-exposure surface was introduced. |
| D3 Traceability | FAIL | 10 | The doc-alignment packet still records removed `SPECKIT_TIER3_ROUTING` semantics, and sub-phases `001` to `003` currently fail strict validation despite complete-looking closeout state. |
| D4 Maintainability | CONDITIONAL | 10 | The runtime stays reasonably localized, but verification coverage still misses the metadata-host continuity edge and the `004` sweep missed stale playbook wording. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 3 active
- P2: 1 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Reading the live router/save code beside the now-current `handler-memory-save.vitest.ts` prompt-body assertions separated already-fixed phase-003 issues from genuinely open regressions.
- Running `validate.sh --strict` across `001` to `004` exposed the packet-verification gap much faster than relying on the child checklists alone.
- Checking the feature-flag reference against the playbook and packet-local closeout docs made the stale Tier-3 opt-in story easy to confirm.

## 9. WHAT FAILED

- Treating the `004` closeout packet as authoritative without checking the current config notes and the playbook mirror would have missed a still-live removed-flag story.
- The existing targeted doc sweep was too narrow to catch stale wording about a removed flag when the text no longer contained the same search tokens.

## 10. RULED OUT DIRECTIONS

- The earlier phase-003 `packet_kind` / `save_mode` prompt regressions are still live: ruled out by `memory-save.ts:1206-1230` plus `handler-memory-save.vitest.ts:1288-1290`, `1342-1344`, and `1396-1398`.
- Tier 3 cache/fallback wiring is missing after flag removal: ruled out by `content-router.vitest.ts:235-307`, `333-475`, and the live save-handler fetch tests.
- The `.claude`, `.codex`, and `.gemini` agent mirrors still carry stale routing guidance: ruled out by a routing-term sweep across those agent directories with no hits.

## 11. NEXT FOCUS

Completed. No additional high-value review branches remained after the final stability pass.

## 12. KNOWN CONTEXT

- The parent packet is a research root (`type: research`) and the child phases split along delivery/progress, handover/drop, Tier-3 wiring, and doc-surface alignment.
- The user asked for a full 10-iteration root review with allocation across correctness, Tier-3 end-to-end, docs, tests, and traceability.
- The review target files were read-only for this run; only `018.../review/` artifacts were allowed to change.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 10 | Runtime/category logic is mostly aligned, but metadata-only continuity host selection still conflicts with the documented recovery contract. |
| `checklist_evidence` | core | fail | 10 | `004` still records removed opt-in semantics, and `001` to `003` fail current strict validation despite completion claims. |
| `skill_agent` | overlay | pass | 9 | No routing-specific stale guidance was found in the skill/agent mirror prompts requested for review. |
| `agent_cross_runtime` | overlay | pass | 9 | `.claude`, `.codex`, and `.gemini` agent mirrors showed no stale routing terms. |
| `feature_catalog_code` | overlay | pass | 6 | The feature-flag reference correctly marks `SPECKIT_TIER3_ROUTING` as removed. |
| `playbook_capability` | overlay | fail | 6 | The canonical save substrate playbook still tells operators to set `SPECKIT_TIER3_ROUTING=true`. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | D1, D3, D4 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` | D1, D3, D4 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | D1, D3, D4 | 10 | 1 P1 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts` | D1, D4 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | D1, D3, D4 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | D1, D3, D4 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/command/memory/save.md` | D3, D4 | 5 | 1 P1 | complete |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | D1, D3, D4 | 5 | 1 P1 | complete |
| `.opencode/skill/system-spec-kit/SKILL.md` | D3, D4 | 5 | 1 P1 | complete |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md` | D3, D4 | 6 | 1 P1, 1 P2 | complete |
| `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `opencode.json` | D3 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| `018/.../001-fix-delivery-progress-confusion` | D3 | 8 | 1 P1 | complete |
| `018/.../002-fix-handover-drop-confusion` | D3 | 8 | 1 P1 | complete |
| `018/.../003-wire-tier3-llm-classifier` | D1, D3 | 8 | 1 P1 | complete |
| `018/.../004-doc-surface-alignment` | D3, D4 | 6 | 1 P1, 1 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T12:45:00Z-018-research-content-routing-accuracy-deep-review`, parentSessionId=`none`, generation=`1`, lineageMode=`new`
- Cross-reference checks: core=`spec_code`, `checklist_evidence`; overlay=`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`

<!-- ANCHOR:review-dimensions -->
## 16. REVIEW DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:running-findings -->
## 17. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 18. EXHAUSTED APPROACHES (do not retry)

### Old phase-003 prompt-context bugs are still open in the live handler. -- BLOCKED (iteration 2, 1 attempt)
- What was tried: Re-checked the current `packet_kind` and `save_mode` prompt fields against the refreshed tests.
- Why blocked: The current code/tests already rule out that older bug class.
- Do NOT retry: Re-litigating the old phase-003 P1s without new runtime evidence.

### Config mirrors still describe Tier 3 as opt-in/default-off. -- BLOCKED (iteration 4, 1 attempt)
- What was tried: Re-read all five config mirrors plus `.gemini/settings.json`.
- Why blocked: Every current config note says Tier 3 is always on and fail-open.
- Do NOT retry: Looking for removed-flag drift in the MCP config mirrors themselves.

### Agent mirrors still contain stale routing guidance. -- BLOCKED (iteration 9, 1 attempt)
- What was tried: Routing-term sweep across `.claude/agents`, `.codex/agents`, and `.gemini/agents`.
- Why blocked: No routing-specific stale guidance was found there.
- Do NOT retry: Repeating the same agent-directory sweep without a new mirror being added.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 19. NEXT FOCUS
Completed. No active follow-on focus remains inside this read-only review packet.

<!-- /ANCHOR:next-focus -->
