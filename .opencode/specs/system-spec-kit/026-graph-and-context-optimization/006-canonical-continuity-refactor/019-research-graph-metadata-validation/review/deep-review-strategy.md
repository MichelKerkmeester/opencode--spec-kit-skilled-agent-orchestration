# Deep Review Strategy - 019 Research Graph Metadata Validation

## 1. OVERVIEW

Review the post-implementation packet as a root-level audit over the shipped parser, schema, backfill script, focused tests, aligned doc surfaces, and the 019 sub-phase closeout artifacts.

## 2. TOPIC

Root review of `019-research-graph-metadata-validation`

## 3. REVIEW DIMENSIONS (remaining)

- [x] D1 Correctness
- [x] D2 Security
- [x] D3 Traceability
- [x] D4 Maintainability

## 4. NON-GOALS

- Editing the parser, docs, or spec packet under review.
- Re-running a repo-wide backfill as part of the audit.
- Reopening archived review packets outside the requested 019 lineage.

## 5. STOP CONDITIONS

- Stop after the requested 10 iterations unless a P0 finding appears.
- Escalate immediately if runtime verification contradicts the shipped doc-alignment packet or if strict validation unexpectedly passes without the required docs.

## 6. COMPLETED DIMENSIONS

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | FAIL | 6 | The parser still leaks command-shaped `key_files`, re-emits them through `entities.path`, and can mis-prefer external packet-doc paths. |
| D2 Security | PASS | 7 | None of the observed defects crossed a privilege boundary; the review remained correctness and traceability focused. |
| D3 Traceability | FAIL | 8 | Backfill verification, packet validation, and phase closeout artifacts are materially out of sync with the shipped contract. |
| D4 Maintainability | CONDITIONAL | 9 | The packet story is readable after 005, but the remaining parser and packet drift would make future maintenance error-prone. |

## 7. RUNNING FINDINGS

- P0: 0 active
- P1: 3 active
- P2: 2 active
- Delta this iteration: +0 P0, +0 P1, +0 P2

## 8. WHAT WORKED

- Packet-local spot checks against `graph-metadata.json` outputs exposed concrete parser leaks instead of abstract concerns.
- The focused parser and integration Vitest suites passed, which narrowed the problem space to backfill coverage, packet hygiene, and missing edge cases.
- Bash and jq corpus scans were effective for counting command-shaped metadata, duplicate groups, trigger-cap overflow, and status buckets.
- The doc-alignment phase `005-doc-surface-alignment` served as a clean control sample: it validates cleanly and matches the shipped runtime contract.

## 9. WHAT FAILED

- The original “key file noise = 0” probe was too narrow and missed `cd ... && ...` command strings that still satisfy the current path heuristic.
- Phase `004-normalize-legacy-files` was not fully brought forward after the inclusive-default backfill change, so its tests and packet docs still narrate the old behavior.
- Root 019 and phases 001-004 are not template-clean or validator-clean, so packet status claims cannot be trusted at face value.

## 10. RULED OUT DIRECTIONS

- Security-sensitive parser regression: no evidence that graph metadata derivation crosses an auth or secret boundary.
- Trigger phrase overflow: the reviewed corpus did not produce any `derived.trigger_phrases` arrays longer than 12.
- Entity duplicate-group regression: duplicate name groups are at zero after the dedup patch; the remaining entity issue is misattribution, not duplication.
- Repo-level doc drift in AGENTS, CLAUDE, SKILL, save/manage, or templates: the operator-facing surfaces updated by phase 005 align with current runtime behavior.

## 11. NEXT FOCUS

Completed. The highest-value next step is remediation planning for F001-F003; F004-F005 can follow once the required fixes land.

## 12. KNOWN CONTEXT

- User-requested write scope is limited to `019-research-graph-metadata-validation/review/`.
- The shipped parser and schema live under `.opencode/skill/system-spec-kit/...`, not a repo-root `mcp_server/`.
- Full corpus scan found `540` `graph-metadata.json` files; excluding `z_archive` yields `364`, with status counts of `218 complete`, `89 in_progress` when the single `in-progress` outlier is folded in, and `56 planned`.
- Full-corpus scans also found `59` command-shaped `derived.key_files`, `42` command-shaped `entities.path` values, `0` duplicate groups, and `0` trigger-cap overflows.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 6 | Runtime, tests, and emitted metadata disagree on command sanitization and backfill-default behavior. |
| `checklist_evidence` | core | fail | 8 | Root 019 and phases 001-004 are not closed out cleanly; only phase 005 passes strict validation. |
| `feature_catalog_code` | overlay | pass | 5 | The phase-005 doc surfaces align with the runtime contract. |
| `playbook_capability` | overlay | pass | 5 | The playbook/template/operator docs reflect the inclusive default and lowercase checklist-aware status language. |

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | D1, D2, D3, D4 | 10 | 2 P1, 2 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | D1, D4 | 10 | 0 P0, 0 P1, 1 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | D1, D2, D3 | 10 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` | D1, D3 | 10 | 0 P0, 1 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | D1, D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | D1, D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| `019/spec.md` | D3 | 10 | 0 P0, 1 P1, 1 P2 | complete |
| `019/001-005 phase docs` | D3, D4 | 8 | 0 P0, 2 P1, 0 P2 | complete |

## 15. REVIEW BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Severity threshold: P2
- Review target type: spec-folder
- Session lineage: sessionId=`2026-04-13T11:30:00Z-019-root-review`, parentSessionId=`none`, generation=`1`, lineageMode=`new`

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
- P1 (Required): 3
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Repo-level operator doc drift after phase 005 -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Read AGENTS, CLAUDE, SKILL, save/manage, and template surfaces against the shipped parser and backfill contract.
- Why blocked: Those surfaces are already aligned and do not explain the remaining defects.
- Do NOT retry: Re-litigating the phase-005 operator docs instead of the active runtime and packet issues.

### Trigger-cap and duplicate-group regressions -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Full-corpus Bash and jq scans for duplicate entity groups and trigger arrays longer than 12.
- Why blocked: Both scans returned zero; the residual metadata issue is command leakage plus packet-doc drift.
- Do NOT retry: Treating duplicates or trigger overflow as the current blocker.

### Security-sensitive parser behavior -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reviewed parser and backfill code paths for privilege, secret, or trust-boundary crossings.
- Why blocked: The defects are metadata-quality and verification issues, not security escapes.
- Do NOT retry: Escalating the review as a security incident without new evidence.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Completed. Route follow-up work into remediation for F001-F003, then revisit F004-F005 once the required fixes land and the packet tree is validator-clean.

<!-- /ANCHOR:next-focus -->
