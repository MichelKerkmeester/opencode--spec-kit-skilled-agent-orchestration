# Iteration 006 Review

Scope: `007-code-audit-per-feature-catalog` umbrella spec plus children `012`-`022`

Dimensions: `D1 Correctness` + `D6 Patterns`

## Findings

### P0-001 [P0] Phase 021 reports remediation complete while the follow-up implementation work is still open

- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md:53-58`
- Evidence: Phase `021` scopes in "Execute critical remediations," and the same spec marks `SC-003` ("Critical items ... remediated or explicitly deferred") as `COMPLETE` at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/spec.md:94-97`.
- Evidence: Its implementation summary then says remediation implementation is out of scope at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/021-remediation-revalidation/implementation-summary.md:101-104`.
- Evidence: The follow-up child `022` still has every execution item unchecked, including "Write implementation-summary.md," at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/tasks.md:6-15`, and its verification checklist is entirely open at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/checklist.md:6-27`.
- Risk: Release-readiness documents currently give a false "remediation complete" signal even though the actual implementation/removal work is still pending.
- Recommendation: Either re-scope `021` to synthesis/planning only and mark `022` as the in-progress remediation child, or finish `022` and then backfill the completion state in `021`.

### P1-001 [P1] Umbrella spec still inventories 21 phases and never references child 022

- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:3`
- Evidence: The umbrella frontmatter description still says the audit covers "21 phase folders," and the executive summary repeats "21 phase folders (001-021)" at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:21`.
- Evidence: The phase tables stop at `021-remediation-revalidation` in both the scope map and documentation map at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:72-96` and `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:101-127`.
- Evidence: The same 21-phase assumption also appears in the handoff criteria and non-functional requirements at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:143-144`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:198`, and `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:317`.
- Evidence: Child `022` is a real spec folder with active scope at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/022-implement-and-remove-deprecated-features/spec.md:1-4`.
- Risk: Reviewers reading the umbrella spec will miss the remediation child entirely, so inventory, dependency, and completion counts are wrong at the parent level.
- Recommendation: Update the umbrella spec to count/reference all 22 children and explicitly place `022` in the phase/dependency map.

### P1-002 [P1] Multiple completed second-half audit phases do not meet the parent traceability contract

- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spec.md:155-157`
- Evidence: The parent requires each phase to include source-file citations with line numbers and a feature-to-code traceability matrix.
- Evidence: Representative completed children in the reviewed half do not provide that traceability payload. `014-pipeline-architecture` records MATCH/PARTIAL outcomes without source citations at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/014-pipeline-architecture/spec.md:180-215`, and its summary collapses findings to brief prose at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/014-pipeline-architecture/implementation-summary.md:42-45`.
- Evidence: `017-governance` likewise reports its four findings without file:line evidence at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/017-governance/implementation-summary.md:42-45`.
- Evidence: `020-feature-flag-reference` lists category-level verdicts and a remediation note, but still no source-line traceability or matrix, at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md:170-184`.
- Risk: The parent says these phases are complete, but their findings are not independently reproducible from the docs alone, which weakens audit validity at release sign-off.
- Recommendation: Add the required traceability matrices and explicit source-line citations to the affected completed children, or downgrade their completion status until that evidence exists.

### P2-001 [P2] Several child specs carry conflicting level metadata

- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/012-query-intelligence/spec.md:13`
- Evidence: `012-query-intelligence` declares `SPECKIT_LEVEL: 2` but its complexity assessment concludes `Level 3` at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/012-query-intelligence/spec.md:145`.
- Evidence: `019-decisions-and-deferrals` declares `SPECKIT_LEVEL: 2` while its complexity table also concludes `Level 3` at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/spec.md:13` and `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/019-decisions-and-deferrals/spec.md:140`.
- Evidence: `020-feature-flag-reference` has the same mismatch at `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md:13` and `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020-feature-flag-reference/spec.md:141`.
- Risk: Validators and humans can read conflicting level signals from the same spec.
- Recommendation: Normalize the declared level, metadata section, and complexity table to one value per child.

## Sweep Notes

| Child | Companion docs | Category match | Status check | Notes |
|---|---|---|---|---|
| `012-query-intelligence` | Present | Matches umbrella/category naming | Complete | No doc-presence issue found; level metadata mismatch noted above |
| `013-memory-quality-and-indexing` | Present | Matches umbrella/category naming | Complete | No separate structure issue found in this pass |
| `014-pipeline-architecture` | Present | Matches umbrella/category naming | Complete | Traceability gap contributes to `P1-002` |
| `015-retrieval-enhancements` | Present | Matches umbrella/category naming | Complete | No separate structure issue found in this pass |
| `016-tooling-and-scripts` | Present | Matches umbrella/category naming | Complete | No separate structure issue found in this pass |
| `017-governance` | Present | Matches umbrella/category naming | Complete | Traceability gap contributes to `P1-002` |
| `018-ux-hooks` | Present | Matches umbrella/category naming | Complete | No separate structure issue found in this pass |
| `019-decisions-and-deferrals` | Present | Cross-cutting category is consistent with umbrella | Complete | Level metadata mismatch noted above |
| `020-feature-flag-reference` | Present | Matches umbrella/category naming | Complete | Traceability gap and level mismatch noted above |
| `021-remediation-revalidation` | Present | Meta-phase label matches umbrella | Drifted | Completion claim conflicts with summary and with child `022` |
| `022-implement-and-remove-deprecated-features` | Incomplete | Not represented in umbrella phase map | In progress / untracked | Active remediation spec with unchecked tasks and no completion artifact yet |

## Review Summary

- Files reviewed: umbrella spec + 11 child folders (`012`-`022`)
- Overall assessment: `REQUEST_CHANGES`
- Primary blockers: false remediation-complete signal in `021`, stale umbrella child inventory, and missing traceability evidence in several completed second-half phases
