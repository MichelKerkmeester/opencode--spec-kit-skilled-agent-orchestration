# Deep Review Strategy - 001 Fix Status Derivation

## 1. OVERVIEW

Review the phase as a targeted parser-and-verification patch. The user explicitly asked for code review over the graph metadata parser, the focused Vitest coverage, and the backfill results that validate the new status buckets.

## 2. TOPIC

Phase review of `001-fix-status-derivation`

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Rewriting packet docs or normalizing legacy status strings in source markdown.
- Expanding the change into schema enums or a repo-wide migration patch.
- Editing runtime code under review.

## 5. STOP CONDITIONS

- Stop after 10 user-requested iterations unless a higher-severity defect appears.
- Escalate immediately if the fallback promotes incomplete checklist packets or breaks the focused Vitest suite.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 6 | The checklist-aware fallback is sound, but explicit frontmatter statuses still pass through without canonical normalization. |
| D2 Security | PASS | 2 | The status path is read-only metadata derivation and did not expose a trust-boundary issue. |
| D3 Traceability | PASS | 8 | The active no-archive corpus matches the expected `210 complete / 88 in_progress / 59 planned` buckets, with three mixed-case leftovers called out separately. |
| D4 Maintainability | CONDITIONAL | 7 | Downstream reporting still has to special-case non-canonical status strings because the parser preserves raw overrides verbatim. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 0 active
- P2: 1 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Static inspection of `deriveStatus()` and `evaluateChecklistCompletion()` quickly ruled out the high-risk false-positive path from the research packet.
- Focused Vitest on `graph-metadata-schema.vitest.ts` and `graph-metadata-integration.vitest.ts` matched the phase claims.
- Active-corpus verification exposed the only residual issue: three non-canonical status buckets outside the intended `complete|in_progress|planned` set.

## 9. WHAT FAILED

- Treating the expected `210 / 88 / 59` distribution as equivalent to full normalization; the corpus still contains three packets with mixed-case or alternate status spellings.

## 10. RULED OUT DIRECTIONS

- Incomplete checklist promotion: ruled out by the explicit `in_progress` fallback and the focused checklist regression tests.
- Security impact from status parsing: ruled out because the code only derives metadata strings from local packet docs.

## 11. NEXT FOCUS

Completed. No further review work remains inside this phase packet beyond the documented P2 follow-up.

## 12. KNOWN CONTEXT

- The user-supplied target paths resolved to `.opencode/skill/system-spec-kit/...`, not a repo-root `mcp_server/` folder.
- The review used the active no-archive corpus (`360` graph-metadata files) for the status-distribution verification the packet references.
- The raw default backfill sweep spans `536` folders because archived and future packets still carry `graph-metadata.json`.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 8 | The parser logic and focused Vitest coverage match the phase contract for checklist-aware fallback. |
| `checklist_evidence` | core | pass | 8 | Packet-local verification claims are supported by targeted test execution and corpus spot checks. |
| `feature_catalog_code` | overlay | notApplicable | 10 | No feature catalog surface is owned by this phase. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | D1, D2, D3, D4 | 10 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | D1, D4 | 7 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | D1, D3 | 8 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | D2, D3 | 8 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/003-constitutional-learn-refactor/graph-metadata.json` | D3 | 6 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/graph-metadata.json` | D3 | 6 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/015-full-playbook-execution/graph-metadata.json` | D3 | 6 | 0 P0, 0 P1, 1 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T08:30:00Z-019-001-review`, parentSessionId=`2026-04-13T08:25:00Z-019-graph-metadata-validation-review`, generation=`1`, lineageMode=`new`

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
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Additional release-blocking defects in the status fallback patch: none surfaced across the 10 allocated iterations. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Additional release-blocking defects in the status fallback patch: none surfaced across the 10 allocated iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional release-blocking defects in the status fallback patch: none surfaced across the 10 allocated iterations.

### Broad fallback mismatch: the active corpus still lands at `210 complete / 88 in_progress / 59 planned` when archived packets are excluded. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Broad fallback mismatch: the active corpus still lands at `210 complete / 88 in_progress / 59 planned` when archived packets are excluded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad fallback mismatch: the active corpus still lands at `210 complete / 88 in_progress / 59 planned` when archived packets are excluded.

### Corpus verification still required a separate pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Corpus verification still required a separate pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Corpus verification still required a separate pass.

### Corpus-level status normalization could not be proven from static parser review alone. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Corpus-level status normalization could not be proven from static parser review alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Corpus-level status normalization could not be proven from static parser review alone.

### Existing normalization layer: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36` still accepts any non-empty status string. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Existing normalization layer: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36` still accepts any non-empty status string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing normalization layer: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:36` still accepts any non-empty status string.

### Hidden parser coupling: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:607` keeps checklist evaluation local and explicit. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Hidden parser coupling: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:607` keeps checklist evaluation local and explicit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hidden parser coupling: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:607` keeps checklist evaluation local and explicit.

### Maintainability concerns needed corpus evidence to prove user-visible impact. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Maintainability concerns needed corpus evidence to prove user-visible impact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Maintainability concerns needed corpus evidence to prove user-visible impact.

### Metadata parsing as a privilege boundary: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:575` only derives a string field from local packet docs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Metadata parsing as a privilege boundary: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:575` only derives a string field from local packet docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Metadata parsing as a privilege boundary: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:575` only derives a string field from local packet docs.

### Missing focused regression coverage: the targeted `graph-metadata-schema` and `graph-metadata-integration` suites both passed during the review. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Missing focused regression coverage: the targeted `graph-metadata-schema` and `graph-metadata-integration` suites both passed during the review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing focused regression coverage: the targeted `graph-metadata-schema` and `graph-metadata-integration` suites both passed during the review.

### No downstream normalizer was found in the reviewed phase scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No downstream normalizer was found in the reviewed phase scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No downstream normalizer was found in the reviewed phase scope.

### No further productive angle remained inside the requested scope. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No further productive angle remained inside the requested scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further productive angle remained inside the requested scope.

### No second defect emerged from the local packet checks. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No second defect emerged from the local packet checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No second defect emerged from the local packet checks.

### No security-sensitive path exists beyond status-string derivation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No security-sensitive path exists beyond status-string derivation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No security-sensitive path exists beyond status-string derivation.

### Packet-local fallback regression: the reviewed phase behaves consistently with the parser logic and the focused tests. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Packet-local fallback regression: the reviewed phase behaves consistently with the parser logic and the focused tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Packet-local fallback regression: the reviewed phase behaves consistently with the parser logic and the focused tests.

### Phase-local doc drift: the packet claims line up with the new checklist-aware cases in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:195`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase-local doc drift: the packet claims line up with the new checklist-aware cases in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:195`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase-local doc drift: the packet claims line up with the new checklist-aware cases in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:195`.

### Ranked frontmatter precedence regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:580` still checks explicit statuses before the fallback logic. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ranked frontmatter precedence regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:580` still checks explicit statuses before the fallback logic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranked frontmatter precedence regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:580` still checks explicit statuses before the fallback logic.

### Stale graph files as the only cause: the source packet docs still carry the mixed-case status spellings that the parser preserves. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Stale graph files as the only cause: the source packet docs still carry the mixed-case status spellings that the parser preserves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale graph files as the only cause: the source packet docs still carry the mixed-case status spellings that the parser preserves.

### The distribution check alone does not explain the three extra non-canonical status buckets. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The distribution check alone does not explain the three extra non-canonical status buckets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The distribution check alone does not explain the three extra non-canonical status buckets.

### The test suite does not cover normalization of arbitrary explicit status strings. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The test suite does not cover normalization of arbitrary explicit status strings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The test suite does not cover normalization of arbitrary explicit status strings.

### This issue does not invalidate the new fallback logic; it is limited to normalization and reporting consistency. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: This issue does not invalidate the new fallback logic; it is limited to normalization and reporting consistency.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This issue does not invalidate the new fallback logic; it is limited to normalization and reporting consistency.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. Carry F001 as a follow-up normalization task if the reporting buckets need to be strictly canonical.

<!-- /ANCHOR:next-focus -->
