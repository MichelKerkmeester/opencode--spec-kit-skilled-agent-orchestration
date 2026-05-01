# Focus

Close the final synthesis gaps and draft the canonical research synthesis at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md`.

This iteration does not change the recommendation. The stable answer remains **PARTIAL**: consolidate the source of truth and resolver contract first, keep rendered level directories as checked-in goldens and fallback through consumer migration, and make physical deletion an optional Phase 4 gate.

# Actions Taken

1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-008.md` first for the 17-section outline, risk register, and prior file/LOC delta framing.
2. Re-read prior iteration evidence from `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-001.md` through `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/iterations/iteration-007.md`.
3. Read the per-level helper documentation in `.opencode/skill/system-spec-kit/templates/level_1/README.md`, `.opencode/skill/system-spec-kit/templates/level_2/README.md`, `.opencode/skill/system-spec-kit/templates/level_3/README.md`, and `.opencode/skill/system-spec-kit/templates/level_3+/README.md`.
4. Measured the exact markdown deletion budget for the four rendered level directories with the requested `find` and `wc -l` commands.
5. Wrote the canonical synthesis draft to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md`.

# Findings

## f-iter009-001: README policy should consolidate into the top-level template README

Choose option **(b)**: consolidate `.opencode/skill/system-spec-kit/templates/level_1/README.md`, `.opencode/skill/system-spec-kit/templates/level_2/README.md`, `.opencode/skill/system-spec-kit/templates/level_3/README.md`, and `.opencode/skill/system-spec-kit/templates/level_3+/README.md` into `.opencode/skill/system-spec-kit/templates/README.md` with per-level subsections.

Rationale: these files are helper documentation, not runtime templates, and their presence inside rendered output directories is exactly why they can leak into scaffolds or parity math. Keeping them as orphan helper docs preserves confusing `templates/level_N/README.md` path contracts after the resolver exists. Deleting them entirely would remove useful level-selection and quick-start guidance that is more local than `AGENTS.md` or `CLAUDE.md`. A master README keeps the guidance, removes runtime ambiguity, and lets golden parity exclude README files by explicit policy.

## f-iter009-002: Exact per-level deletion budget is 25 markdown files and 4,087 LOC

The requested count over `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, and `.opencode/skill/system-spec-kit/templates/level_3+` returned `25` markdown files and `4,087` total LOC.

This replaces the approximate iteration 8 phrasing when the deletion target is specifically "the four per-level rendered directories." The earlier "about 60 markdown files and about 7K LOC" should be retained only as a broader, not-yet-measured Phase 4 scenario that would also delete or reclassify other generated or duplicate surfaces outside those four directories. The canonical synthesis should not present that broader number as an exact deletion budget.

## f-iter009-003: Phase 4 has two distinct deletion scopes

There are two valid Phase 4 scopes, and mixing them creates bad planning math:

- **Per-level rendered-dir deletion**: delete only `.opencode/skill/system-spec-kit/templates/level_1`, `.opencode/skill/system-spec-kit/templates/level_2`, `.opencode/skill/system-spec-kit/templates/level_3`, and `.opencode/skill/system-spec-kit/templates/level_3+`; exact markdown delta is `-25` files and `-4,087` LOC.
- **Broader duplicate-surface deletion**: additionally delete or regenerate examples, helper docs, historical wrapper outputs, or other duplicate generated surfaces; this needs a separate inventory and must not inherit the exact per-level budget.

The recommendation should plan Phase 4 around the measured per-level deletion and leave broader cleanup as future work.

## f-iter009-004: Canonical synthesis is ready for iteration 10 polish

The research draft now contains all 17 requested sections: TL;DR, recommendation, background, methodology, Q1-Q10 findings, generator design, four-phase plan, backward compatibility, risk register, performance budget, validator migration, consumer migration map, test suite design, file/LOC deltas, open items, graph appendix, and command appendix. Iteration 10 can focus on wording, consistency, and final convergence rather than discovery.

# Questions Answered

- Gap A, README policy: answered. Consolidate per-level README content into `.opencode/skill/system-spec-kit/templates/README.md`; exclude per-level README files from runtime golden parity; remove per-level README files only when rendered dirs are deleted in Phase 4.
- Gap B, exact deletion budget: answered. The exact per-level rendered-dir deletion budget is `25` markdown files and `4,087` LOC.
- Canonical draft: answered. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md` now has a populated 17-section synthesis.

# Questions Remaining

- No research questions remain open for Q1-Q10.
- Iteration 10 should polish the final synthesis, verify internal arithmetic, and decide whether to mark the research loop converged.

# Next Focus

Polish `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/001-template-consolidation-investigation/research/research.md`, tighten table wording, and perform a final consistency pass across recommendation, file/LOC deltas, and risk mitigations.
