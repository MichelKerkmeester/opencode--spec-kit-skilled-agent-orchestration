# Deep Review Strategy - Phase 003

## 1. OVERVIEW

Review the Tier3 save-handler wiring as a correctness-first integration lane. The loop followed the handler metadata assembly, the prompt builder in `content-router.ts`, and the focused `handler-memory-save.vitest.ts` coverage to confirm not just that Tier3 is called, but that it is called with truthful context.

## 2. TOPIC

Phase review: 003-wire-tier3-llm-classifier

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Modifying the Tier3 classifier logic itself.
- Changing LLM providers or the transport contract.
- Editing the handler or tests during this review pass.

## 5. STOP CONDITIONS

- Stop after 10 iterations unless a new P0 appears in the Tier3 save path.
- Escalate if the save-handler prompt metadata is found to misrepresent the packet context or natural-routing mode.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 10 | Tier3 is wired into the save path, but two prompt-context fields are still misreported before the model classifies ambiguous saves. |
| D2 Security | PASS | 10 | The Tier3 transport, timeout, and optional API-key handling did not surface a new security defect. |
| D3 Traceability | CONDITIONAL | 10 | The handler tests prove transport reachability, but they do not verify the prompt fields that condition Tier3 behavior. |
| D4 Maintainability | CONDITIONAL | 10 | The transport wiring stays localized, but the missing prompt assertions leave the two context defects easy to reintroduce. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 2 active
- P2: 1 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Reading the handler metadata assembly directly against `buildTier3Prompt()` exposed the prompt-context defects much faster than starting from the tests alone.
- Using the focused green `handler-memory-save.vitest.ts` run after the source review confirmed that the open issues are contract gaps, not obvious broken transport or write behavior.
- Separating prompt-conditioning defects from refusal/drop and transport behavior kept the later iterations focused and stable.

## 9. WHAT FAILED

- Treating the focused handler tests as prompt-contract coverage; they prove the fetch path runs, but they do not inspect the request body.

## 10. RULED OUT DIRECTIONS

- Tier3 still unreachable from the save path: ruled out by the natural-routing handler test and the `buildCanonicalRouter()` integration path.
- Refusal or drop results still merging into canonical docs: ruled out by the explicit abort path in `memory-save.ts:1174-1186`.
- A new security defect in transport or caching: ruled out by the fetch setup, timeout handling, and localized in-memory cache wiring.

## 11. NEXT FOCUS

Completed. No new findings remain; keep the two P1 prompt-context defects and the one P2 test-coverage advisory active.

## 12. KNOWN CONTEXT

- Packet 003 exists to connect the existing Tier3 classifier to the save handler, not to rewrite Tier3 classification logic itself.
- The parent 018 packet is explicitly a research packet, so Tier3 context fidelity matters for the routing-accuracy objectives recorded there.
- The focused handler tests currently prove Tier3 transport reachability and fail-open fallback, but not prompt-field correctness.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 10 | Tier3 is connected, but the handler still misreports both packet kind and natural save mode before building the prompt. |
| `checklist_evidence` | core | partial | 10 | The focused handler tests prove transport reachability and fail-open fallback, but they never inspect the request body for PACKET_KIND or SAVE_MODE. |
| `skill_agent` | overlay | notApplicable | 10 | No skill or agent contract is owned by this phase. |
| `agent_cross_runtime` | overlay | notApplicable | 10 | No cross-runtime surface is in scope. |
| `feature_catalog_code` | overlay | notApplicable | 10 | No feature catalog surface is owned here. |
| `playbook_capability` | overlay | notApplicable | 10 | No playbook surface is in scope. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/spec.md` | D1, D3 | 10 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/018-research-content-routing-accuracy/003-wire-tier3-llm-classifier/spec.md` | D1, D3 | 10 | 0 P0, 2 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | D1, D2, D3, D4 | 10 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | D1, D3 | 10 | 0 P0, 2 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | D3, D4 | 10 | 0 P0, 0 P1, 1 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T08:22:00Z-003-wire-tier3-llm-classifier-deep-review`, parentSessionId=`2026-04-13T08:19:00Z-018-content-routing-review-wave`, generation=`1`, lineageMode=`new`
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
- P1 (Required): 2
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A focused test failure already captures the prompt-context defects: ruled out by the green handler-memory-save suite. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A focused test failure already captures the prompt-context defects: ruled out by the green handler-memory-save suite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A focused test failure already captures the prompt-context defects: ruled out by the green handler-memory-save suite.

### Additional hidden Tier3 transport defect beyond prompt metadata: ruled out by the repeated handler and router readback plus green focused tests. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Additional hidden Tier3 transport defect beyond prompt metadata: ruled out by the repeated handler and router readback plus green focused tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional hidden Tier3 transport defect beyond prompt metadata: ruled out by the repeated handler and router readback plus green focused tests.

### Handler fixtures already pin prompt-contract regressions: ruled out by the lack of request-body assertions in the focused Tier3 tests. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Handler fixtures already pin prompt-contract regressions: ruled out by the lack of request-body assertions in the focused Tier3 tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Handler fixtures already pin prompt-contract regressions: ruled out by the lack of request-body assertions in the focused Tier3 tests.

### Late-stage regression beyond the existing prompt-context defects: ruled out by the repeated no-new-findings stabilization passes. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Late-stage regression beyond the existing prompt-context defects: ruled out by the repeated no-new-findings stabilization passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Late-stage regression beyond the existing prompt-context defects: ruled out by the repeated no-new-findings stabilization passes.

### None. -- BLOCKED (iteration 10, 10 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Refusal or drop results still merge into canonical docs: ruled out by `memory-save.ts:1174-1186`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Refusal or drop results still merge into canonical docs: ruled out by `memory-save.ts:1174-1186`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Refusal or drop results still merge into canonical docs: ruled out by `memory-save.ts:1174-1186`.

### Root research packets are forwarded to Tier3 with an accurate packet_kind: ruled out by `memory-save.ts:1165`, which reduces any slash-containing specFolder to `phase`, while the 018 root packet is explicitly `type: research` in `018.../spec.md:5`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Root research packets are forwarded to Tier3 with an accurate packet_kind: ruled out by `memory-save.ts:1165`, which reduces any slash-containing specFolder to `phase`, while the 018 root packet is explicitly `type: research` in `018.../spec.md:5`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Root research packets are forwarded to Tier3 with an accurate packet_kind: ruled out by `memory-save.ts:1165`, which reduces any slash-containing specFolder to `phase`, while the 018 root packet is explicitly `type: research` in `018.../spec.md:5`.

### The passing Tier3 transport tests fully validate prompt integrity: ruled out by the absence of any request-body assertions in `tests/handler-memory-save.vitest.ts:1246-1257` and `:1282-1293`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The passing Tier3 transport tests fully validate prompt integrity: ruled out by the absence of any request-body assertions in `tests/handler-memory-save.vitest.ts:1246-1257` and `:1282-1293`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The passing Tier3 transport tests fully validate prompt integrity: ruled out by the absence of any request-body assertions in `tests/handler-memory-save.vitest.ts:1246-1257` and `:1282-1293`.

### Tier3 cache or fail-open wiring is structurally brittle independent of prompt metadata: ruled out by `memory-save.ts:940-947` and `content-router.ts:681-743`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Tier3 cache or fail-open wiring is structurally brittle independent of prompt metadata: ruled out by `memory-save.ts:940-947` and `content-router.ts:681-743`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tier3 cache or fail-open wiring is structurally brittle independent of prompt metadata: ruled out by `memory-save.ts:940-947` and `content-router.ts:681-743`.

### Tier3 is still unreachable from the save path: ruled out by `memory-save.ts:1144-1172` plus the passing natural-routing handler tests at `tests/handler-memory-save.vitest.ts:1207-1257`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Tier3 is still unreachable from the save path: ruled out by `memory-save.ts:1144-1172` plus the passing natural-routing handler tests at `tests/handler-memory-save.vitest.ts:1207-1257`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tier3 is still unreachable from the save path: ruled out by `memory-save.ts:1144-1172` plus the passing natural-routing handler tests at `tests/handler-memory-save.vitest.ts:1207-1257`.

### Tier3 transport introduces a new secret leak or persistent cache write defect: ruled out by `memory-save.ts:882-947` and `content-router.ts:681-743`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Tier3 transport introduces a new secret leak or persistent cache write defect: ruled out by `memory-save.ts:882-947` and `content-router.ts:681-743`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tier3 transport introduces a new secret leak or persistent cache write defect: ruled out by `memory-save.ts:882-947` and `content-router.ts:681-743`.

### Tier3 was never actually wired into the save path: ruled out by the passing natural-routing handler test and the `buildCanonicalRouter()` path. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Tier3 was never actually wired into the save path: ruled out by the passing natural-routing handler test and the `buildCanonicalRouter()` path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tier3 was never actually wired into the save path: ruled out by the passing natural-routing handler test and the `buildCanonicalRouter()` path.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. No new findings remain; keep the active prompt-context defects and coverage advisory in the final report.

<!-- /ANCHOR:next-focus -->
