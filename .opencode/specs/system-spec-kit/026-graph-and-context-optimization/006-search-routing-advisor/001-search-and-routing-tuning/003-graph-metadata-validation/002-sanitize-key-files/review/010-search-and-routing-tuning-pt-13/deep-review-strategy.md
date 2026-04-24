# Deep Review Strategy - 002 Sanitize Key Files

## 1. OVERVIEW

Review the phase as a focused parser hygiene change plus corpus verification. The user explicitly asked for code review over the `keepKeyFile()` predicate, the focused Vitest coverage, and the backfill path used to validate the zero-noise corpus result.

## 2. TOPIC

Phase review of `002-sanitize-key-files`

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Changing the predicate or the backfill script during the review.
- Re-scoring archived packet noise or redefining what counts as a canonical packet doc.
- Editing runtime code under review.

## 5. STOP CONDITIONS

- Stop after 10 user-requested iterations unless a higher-severity defect appears.
- Escalate immediately if the active corpus still contains noisy `key_files` entries or the focused Vitest suite fails.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 6 | The predicate and its filter placement behave as the phase intended, and the active no-archive corpus shows zero surviving noise entries. |
| D2 Security | PASS | 2 | The sanitizer is a data-quality layer and did not introduce a new trust-boundary issue. |
| D3 Traceability | CONDITIONAL | 7 | The packet’s zero-noise claim holds, but reproducing the verification counts requires an explicit no-archive filter outside the default backfill sweep. |
| D4 Maintainability | CONDITIONAL | 8 | The backfill script keeps raw archive and future packets in scope, so operators cannot reproduce the active-corpus verification totals from the default dry-run alone. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 0 active
- P2: 1 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Static inspection of `keepKeyFile()` and `deriveKeyFiles()` matched the wave-3 predicate and filter placement from the research packet.
- Focused Vitest confirmed the researched noise classes and the canonical-doc survival behavior.
- Active-corpus verification proved the intended outcome directly: zero noisy `key_files` entries and the expected status distribution on the active no-archive set.

## 9. WHAT FAILED

- Assuming the default backfill dry-run would reproduce the active verification corpus; it currently sweeps archives and future packets too.

## 10. RULED OUT DIRECTIONS

- A parser-level regression that still allows command strings or bare non-canonical filenames into `derived.key_files`.
- A security issue tied to the predicate itself; the reviewed code only sanitizes metadata output.

## 11. NEXT FOCUS

Completed. No further review work remains inside this phase packet beyond the documented tooling follow-up.

## 12. KNOWN CONTEXT

- The user-supplied target paths resolved to `.opencode/skill/system-spec-kit/...`, not a repo-root `mcp_server/` folder.
- The zero-noise verification used the active no-archive corpus (`360` graph-metadata files), because the default dry-run backfill still traverses `z_archive` and `z_future`.
- Raw dry-run output refreshed `536` spec folders, which is broader than the packet-local verification target.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 6 | The predicate implementation and focused tests match the phase contract. |
| `checklist_evidence` | core | partial | 7 | The zero-noise claim is correct, but the verification requires an explicit no-archive corpus filter outside the default dry-run command. |
| `feature_catalog_code` | overlay | notApplicable | 10 | No feature catalog surface is owned by this phase. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | D1, D2, D3, D4 | 10 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | D1, D3 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | D2, D3 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | D3, D4 | 10 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation/002-sanitize-key-files/graph-metadata.json` | D1, D3 | 9 | 0 P0, 0 P1, 0 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T09:25:00Z-019-002-review`, parentSessionId=`2026-04-13T08:25:00Z-019-graph-metadata-validation-review`, generation=`1`, lineageMode=`new`

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
### A correctness failure in the sanitizer: the scope mismatch lives in verification tooling, not in the parser output. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A correctness failure in the sanitizer: the scope mismatch lives in verification tooling, not in the parser output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A correctness failure in the sanitizer: the scope mismatch lives in verification tooling, not in the parser output.

### A parser correctness issue in the predicate itself: the zero-noise active corpus result held once the verification scope matched the phase expectation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A parser correctness issue in the predicate itself: the zero-noise active corpus result held once the verification scope matched the phase expectation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A parser correctness issue in the predicate itself: the zero-noise active corpus result held once the verification scope matched the phase expectation.

### A second packet-local regression: the reviewed phase output stayed clean once the verification scope was fixed. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A second packet-local regression: the reviewed phase output stayed clean once the verification scope was fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second packet-local regression: the reviewed phase output stayed clean once the verification scope was fixed.

### Additional release-blocking defects in the key-file sanitization patch: none surfaced across the 10 allocated iterations. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Additional release-blocking defects in the key-file sanitization patch: none surfaced across the 10 allocated iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Additional release-blocking defects in the key-file sanitization patch: none surfaced across the 10 allocated iterations.

### Canonical packet docs being dropped: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:547` still appends the packet docs after filtering. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Canonical packet docs being dropped: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:547` still appends the packet docs after filtering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Canonical packet docs being dropped: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:547` still appends the packet docs after filtering.

### Corpus verification still required a separate pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Corpus verification still required a separate pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Corpus verification still required a separate pass.

### Filter-after-cap regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:538` still filters before `normalizeUnique(...).slice(0, 20)`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Filter-after-cap regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:538` still filters before `normalizeUnique(...).slice(0, 20)`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Filter-after-cap regression: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:538` still filters before `normalizeUnique(...).slice(0, 20)`.

### Maintainability concerns needed a verification-tooling pass to show operator impact. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Maintainability concerns needed a verification-tooling pass to show operator impact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Maintainability concerns needed a verification-tooling pass to show operator impact.

### Missing direct regression coverage for the researched noise classes and canonical-doc retention behavior. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Missing direct regression coverage for the researched noise classes and canonical-doc retention behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing direct regression coverage for the researched noise classes and canonical-doc retention behavior.

### No additional issue surfaced beyond F001. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No additional issue surfaced beyond F001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional issue surfaced beyond F001.

### No built-in active-corpus mode was found in the reviewed backfill script. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No built-in active-corpus mode was found in the reviewed backfill script.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No built-in active-corpus mode was found in the reviewed backfill script.

### No direct security-sensitive path exists in the reviewed scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No direct security-sensitive path exists in the reviewed scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No direct security-sensitive path exists in the reviewed scope.

### No further productive angle remained inside the requested scope. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No further productive angle remained inside the requested scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further productive angle remained inside the requested scope.

### Parsing as a privilege boundary: the predicate only filters metadata strings before storage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Parsing as a privilege boundary: the predicate only filters metadata strings before storage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parsing as a privilege boundary: the predicate only filters metadata strings before storage.

### Phase-local drift: the packet claims align with the researched noise cases covered in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:256`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase-local drift: the packet claims align with the researched noise cases covered in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:256`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase-local drift: the packet claims align with the researched noise cases covered in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:256`.

### Residual key-file noise after regeneration: the active no-archive corpus showed zero failing entries against the reviewed predicate. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Residual key-file noise after regeneration: the active no-archive corpus showed zero failing entries against the reviewed predicate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residual key-file noise after regeneration: the active no-archive corpus showed zero failing entries against the reviewed predicate.

### Static review alone could not confirm corpus-wide zero-noise output. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Static review alone could not confirm corpus-wide zero-noise output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static review alone could not confirm corpus-wide zero-noise output.

### Test coverage does not answer whether the default backfill command matches the packet’s verification scope. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Test coverage does not answer whether the default backfill command matches the packet’s verification scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Test coverage does not answer whether the default backfill command matches the packet’s verification scope.

### The corpus result alone does not show whether the default backfill script can reproduce the same scope directly. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The corpus result alone does not show whether the default backfill script can reproduce the same scope directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The corpus result alone does not show whether the default backfill script can reproduce the same scope directly.

### This does not invalidate the key-file sanitizer; it is a tooling and reproducibility concern. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: This does not invalidate the key-file sanitizer; it is a tooling and reproducibility concern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: This does not invalidate the key-file sanitizer; it is a tooling and reproducibility concern.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. Carry F001 as a tooling follow-up if operators need raw dry-run output to match the active verification corpus directly.

<!-- /ANCHOR:next-focus -->
