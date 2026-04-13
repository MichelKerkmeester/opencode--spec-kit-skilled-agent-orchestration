# Deep Review Strategy - 003 Deduplicate Entities

## 1. OVERVIEW

Review the phase as a targeted parser cleanup plus corpus verification. The user explicitly asked for code review over the shared entity helper, the focused Vitest additions, the adjacent trigger-cap cleanup, and the backfill path used to validate the corpus result.

## 2. TOPIC

Phase review of `003-deduplicate-entities`

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Extending the dedupe logic into cross-folder merging.
- Editing runtime code or changing the entity schema during the review.
- Re-scoping the adjacent trigger-cap cleanup into a separate patch during this pass.

## 5. STOP CONDITIONS

- Stop after 10 user-requested iterations unless a higher-severity defect appears.
- Escalate immediately if duplicate entity names remain in the active corpus or if trigger phrases still exceed the cap after regeneration.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 6 | The shared helper removed duplicate entity-name slots and the active no-archive corpus shows zero duplicate names and zero over-cap trigger arrays. |
| D2 Security | PASS | 2 | The dedupe path is metadata-only and did not introduce a new trust-boundary issue. |
| D3 Traceability | PASS | 7 | The phase packet claims, focused tests, and corpus metrics all align on canonical collision preference and parser-owned trigger capping. |
| D4 Maintainability | PASS | 9 | The helper stayed compact, the 16-entity cap is preserved, and no second-order refresh regression surfaced. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 0 active
- P2: 0 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Static inspection of `deriveEntities()` confirmed both write sites now flow through the same helper.
- Focused Vitest covered the canonical `spec.md` and `plan.md` collision cases as well as the parser-owned trigger cap.
- Active-corpus verification proved the intended outcome directly: zero duplicate entity names and zero packets over the 12-phrase cap on the active no-archive set.

## 9. WHAT FAILED

- No materially unproductive angle remained after the corpus verification and skeptic pass.

## 10. RULED OUT DIRECTIONS

- Cross-folder merging hidden inside the helper.
- A second-order refresh regression caused by the backfill path.
- Surviving canonical-path collision failures in representative packet-doc cases.

## 11. NEXT FOCUS

Completed. No active findings remain after iteration 10.

## 12. KNOWN CONTEXT

- The user-supplied target paths resolved to `.opencode/skill/system-spec-kit/...`, not a repo-root `mcp_server/` folder.
- The duplicate and trigger-cap verification used the active no-archive corpus (`360` graph-metadata files) to match the packet’s current-reality metrics.
- The raw default backfill sweep is broader, but it did not reveal a dedupe-specific defect inside the requested scope.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 7 | The helper logic, focused tests, and corpus metrics all align on canonical collision preference and the trigger cap. |
| `checklist_evidence` | core | pass | 7 | Packet-local verification claims are supported by the targeted test run and the corpus scans. |
| `feature_catalog_code` | overlay | notApplicable | 10 | No feature catalog surface is owned by this phase. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | D1, D2, D3, D4 | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | D1, D3 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | D2, D3 | 7 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | D4 | 8 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/graph-metadata.json` | D1, D4 | 9 | 0 P0, 0 P1, 0 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T10:20:00Z-019-003-review`, parentSessionId=`2026-04-13T08:25:00Z-019-graph-metadata-validation-review`, generation=`1`, lineageMode=`new`

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
### A second-order dedupe regression caused by refresh behavior: nothing in the reviewed path contradicted the clean corpus metrics. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A second-order dedupe regression caused by refresh behavior: nothing in the reviewed path contradicted the clean corpus metrics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second-order dedupe regression caused by refresh behavior: nothing in the reviewed path contradicted the clean corpus metrics.

### Additional release-blocking defects in the entity dedupe patch: none surfaced across the 10 allocated iterations. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Additional release-blocking defects in the entity dedupe patch: none surfaced across the 10 allocated iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional release-blocking defects in the entity dedupe patch: none surfaced across the 10 allocated iterations.

### Canonical-path preference failing on representative packet-doc collisions: the reviewed packet metadata stayed aligned with the helper logic. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Canonical-path preference failing on representative packet-doc collisions: the reviewed packet metadata stayed aligned with the helper logic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Canonical-path preference failing on representative packet-doc collisions: the reviewed packet metadata stayed aligned with the helper logic.

### Corpus verification still required a separate pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Corpus verification still required a separate pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Corpus verification still required a separate pass.

### Entity deduplication as a trust-boundary issue: the reviewed code only derives metadata references. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Entity deduplication as a trust-boundary issue: the reviewed code only derives metadata references.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Entity deduplication as a trust-boundary issue: the reviewed code only derives metadata references.

### Helper complexity outweighing the fix: the collision policy stayed small and the `slice(0, 16)` cap remains intact. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Helper complexity outweighing the fix: the collision policy stayed small and the `slice(0, 16)` cap remains intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Helper complexity outweighing the fix: the collision policy stayed small and the `slice(0, 16)` cap remains intact.

### Maintainability concerns needed a corpus pass to show whether any edge case remained. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Maintainability concerns needed a corpus pass to show whether any edge case remained.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Maintainability concerns needed a corpus pass to show whether any edge case remained.

### Missing targeted regression coverage for canonical collision preference and the trigger cap. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Missing targeted regression coverage for canonical collision preference and the trigger cap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing targeted regression coverage for canonical collision preference and the trigger cap.

### No direct security-sensitive path exists in the reviewed scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No direct security-sensitive path exists in the reviewed scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No direct security-sensitive path exists in the reviewed scope.

### No evidence justified escalating a finding after the skeptic pass. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No evidence justified escalating a finding after the skeptic pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence justified escalating a finding after the skeptic pass.

### No further productive angle remained inside the requested scope. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No further productive angle remained inside the requested scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further productive angle remained inside the requested scope.

### No new actionable issue emerged from the refresh-path review. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No new actionable issue emerged from the refresh-path review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new actionable issue emerged from the refresh-path review.

### No new issue emerged from the adjacent trigger-cap cleanup. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: No new issue emerged from the adjacent trigger-cap cleanup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new issue emerged from the adjacent trigger-cap cleanup.

### Over-cap trigger arrays after regeneration: the active no-archive corpus showed zero packets above the `12`-phrase limit. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Over-cap trigger arrays after regeneration: the active no-archive corpus showed zero packets above the `12`-phrase limit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Over-cap trigger arrays after regeneration: the active no-archive corpus showed zero packets above the `12`-phrase limit.

### Phase-local drift: the packet claims align with the canonical `spec.md` and `plan.md` collision cases in the focused tests. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase-local drift: the packet claims align with the canonical `spec.md` and `plan.md` collision cases in the focused tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase-local drift: the packet claims align with the canonical `spec.md` and `plan.md` collision cases in the focused tests.

### Split write-site regression: both the key-file seeding path and the extracted-entity path now flow through one helper. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Split write-site regression: both the key-file seeding path and the extracted-entity path now flow through one helper.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Split write-site regression: both the key-file seeding path and the extracted-entity path now flow through one helper.

### Static review alone could not confirm the corpus-wide duplicate count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Static review alone could not confirm the corpus-wide duplicate count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static review alone could not confirm the corpus-wide duplicate count.

### Surviving duplicate entity slots in active packets: the reviewed corpus showed zero duplicate entity names. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Surviving duplicate entity slots in active packets: the reviewed corpus showed zero duplicate entity names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Surviving duplicate entity slots in active packets: the reviewed corpus showed zero duplicate entity names.

### The duplicate scan alone did not verify the adjacent trigger-cap cleanup. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The duplicate scan alone did not verify the adjacent trigger-cap cleanup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The duplicate scan alone did not verify the adjacent trigger-cap cleanup.

### The tests did not suggest any further angle that would overturn the clean corpus results. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The tests did not suggest any further angle that would overturn the clean corpus results.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The tests did not suggest any further angle that would overturn the clean corpus results.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. No active follow-up is required from this review packet.

<!-- /ANCHOR:next-focus -->
