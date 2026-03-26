# Iteration 012 Review

Scope: umbrella `015-manual-testing-per-playbook/spec.md` plus children `001-retrieval` through `011-scoring-and-calibration`

Dimensions: `D4 Completeness` + `D7 Documentation Quality`

## Findings

### P1-001 [P1] The umbrella packet is no longer a trustworthy source of truth for child inventory or aggregate coverage

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md:2-4,24-26,40-43,52-54,79-100`
  - `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md:14-33,145-150,157-173`
- Evidence: The umbrella spec marks the parent packet `Complete`, says the playbook contains `233 scenario files (265 exact IDs)` across `19 phase folders`, and hardcodes per-phase counts in the phase map.
- Evidence: The canonical playbook root now says release coverage should be measured against `231 scenario files (270 exact IDs)` and includes a deterministic count check that fails unless the playbook tree contains exactly `231` files.
- Evidence: The working tree under `015-manual-testing-per-playbook/` now contains `22` numbered child folders (`001` through `022`), not the umbrella's `19`, so the parent packet no longer matches either the canonical playbook totals or the on-disk child inventory.
- Evidence: The phase map is also stale at child level. For example, the umbrella still budgets `003` as `3` scenarios, `004` as `2`, and `007` as `2`, while the child specs now scope `8`, `7`, and `6` scenarios respectively (`003-discovery/spec.md:45-48,58-67`; `004-maintenance/spec.md:42-45,55-63`; `007-evaluation/spec.md:44-45,67-85`).
- Risk: Release-readiness rollups cannot be audited from the umbrella packet. A reviewer cannot tell whether coverage gaps are intentional, stale documentation, or missed execution.
- Recommendation: Reconcile the umbrella against the canonical playbook and current child tree before using it as a release gate. Either restore the parent to the current `231/270` reality with accurate child rows, or archive/remove extra children and re-baseline the entire packet consistently.

### P1-002 [P1] The umbrella claims completion while most child packets still self-report incomplete or contradictory execution state

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md:24-26`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/001-retrieval/spec.md:24-27`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/001-retrieval/implementation-summary.md:24-28`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/spec.md:29-32`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/implementation-summary.md:34-39`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/spec.md:26-29`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/implementation-summary.md:34-39`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/009-evaluation-and-measurement/spec.md:27-30`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/009-evaluation-and-measurement/checklist.md:1-4`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/010-graph-signal-activation/spec.md:24-29`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/010-graph-signal-activation/implementation-summary.md:36-63`
- Evidence: The umbrella spec says the whole parent packet is `Complete`.
- Evidence: Within the first 11 children, `spec.md` still reports `Not Started` for `001`, `002`, `003`, `004`, `005`, `006`, `007`, `008`, and `010` (spot checks above show the pattern directly for `001`, `003`, `004`, and `010`). Several of those same folders also carry completed result docs, e.g. `001` has `implementation-summary.md` status `Complete`, `003` reports `3/3 (100%)`, `004` reports `2/2 scenarios PASS`, and `010` reports `15/15 PASS`.
- Evidence: Even one of the folders whose `spec.md` says `Complete` is internally inconsistent: `009-evaluation-and-measurement/spec.md` marks the phase complete, but `009-evaluation-and-measurement/checklist.md` frontmatter still says `Verification Date: Not Started`.
- Risk: This is a false-ready documentation state. A reviewer cannot trust either the umbrella's completion signal or the child packet metadata without manually reconciling multiple files.
- Recommendation: Normalize status semantics across `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` for every child, then recalculate the umbrella status from those reconciled child states instead of treating it as an independent claim.

### P1-003 [P1] Three child packets scope scenarios that do not have matching verdict coverage or valid playbook-file traceability

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/spec.md:45-48,58-67`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/tasks.md:47-65`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/003-discovery/implementation-summary.md:34-39`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/spec.md:42-45,55-63`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/checklist.md:54-67`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/004-maintenance/implementation-summary.md:34-39`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/007-evaluation/spec.md:67-85`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/007-evaluation/implementation-summary.md:38-43`
- Evidence: `003-discovery/spec.md` scopes `8` scenarios (`EX-011` through `EX-040`), but `tasks.md` still leaves `EX-036` through `EX-040` unchecked with placeholder verdicts, and `implementation-summary.md` only reports `3/3 (100%)`.
- Evidence: `004-maintenance/spec.md` scopes `7` scenarios (`EX-014`, `EX-035`, `EX-041` through `EX-045`), but `checklist.md` still leaves `EX-041` through `EX-045` unchecked, and `implementation-summary.md` reports only `2/2 scenarios PASS`.
- Evidence: `007-evaluation/spec.md` scopes `6` scenarios and points `EX-046` through `EX-049` at specific playbook files, but `implementation-summary.md` only records verdicts for `EX-026` and `EX-027` with an overall pass rate of `2/2`.
- Evidence: The extra playbook file links named in `003`, `004`, and `007` do not resolve in the canonical playbook tree: `03--discovery/` contains `3` files, `04--maintenance/` contains `2`, and `07--evaluation/` contains `2`, so the added `036-040`, `041-045`, and `046-049` files referenced by these child specs are not currently present in the central playbook package.
- Risk: These three child packets fail both review questions at once: not every scoped scenario has a final verdict, and the missing scenario-file links mean the packet cannot be fully traced back to the canonical playbook.
- Recommendation: Pick one truth for each of these phases. Either shrink the child scope back to the canonical playbook inventory, or add the missing playbook scenario files and complete the verdict coverage for every scoped scenario before claiming the packet is complete.

## Sweep Notes

| Check | Result | Notes |
|---|---|---|
| Required docs present for each child? | Yes | All first 11 children contain `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `description.json`. |
| Are verdicts documented? | Mixed | Full outcome coverage is present for `001`, `002`, `005`, `006`, `008`, `009`, `010`, and `011`. `011` uses `21 PASS + 1 RETIRED` for historical row `170`, which matches its own documented intent. `003`, `004`, and `007` do not document final outcomes for every scenario they scope. |
| Does the umbrella correctly count all children? | No | The umbrella still models `19` phases and `233/265`, while the canonical playbook now uses `231/270` and the on-disk parent contains `22` numbered child folders. |
| Are scenario IDs traceable to the central playbook? | Mixed | Direct, resolvable playbook-file traceability is clean in `001`, `002`, `005`, and `006`; broken in `003`, `004`, and `007`; and weaker/indirect in `008`, `009`, `010`, and `011`, which rely more on scenario-ID mapping and root-playbook dependency language than on per-scenario playbook file links. |
| Any `Not Started` phases while the umbrella says `Complete`? | Yes | Child `spec.md` files still say `Not Started` for `001`, `002`, `003`, `004`, `005`, `006`, `007`, `008`, and `010`. `009` adds a second inconsistency because its checklist frontmatter still says `Verification Date: Not Started` even though the phase spec says `Complete`. |

## Review Summary

- Files reviewed: umbrella `spec.md`, child packets `001` through `011`, and the canonical playbook root
- Overall assessment: `REQUEST_CHANGES`
- Main blockers: stale umbrella inventory, umbrella/child status drift, and incomplete verdict + playbook-traceability coverage in `003`, `004`, and `007`
