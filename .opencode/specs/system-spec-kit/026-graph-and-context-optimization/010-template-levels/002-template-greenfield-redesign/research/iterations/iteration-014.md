# Iteration 14: Final Workflow-Invariance Synthesis

## Focus

FINAL SYNTHESIS under the reopened workflow-invariance constraint. Consolidate iterations 10-13 into `research.md`, correct the earlier "levels disappear" language, append ADR-005, update the resource map, and declare convergence without introducing a new design direction.

## Actions Taken

- Read the existing synthesis in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/research.md` first, preserving the 17-section structure.
- Re-read iterations 10 through 13 and folded only their settled findings into a new §18 addendum.
- Updated §1 TL;DR and §2 Recommendation language from "levels disappear" / "Levels eliminated" to workflow-invariant framing.
- Updated `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/002-template-greenfield-redesign/research/resource-map.md` with iteration 10-14 artifacts and workflow-invariance test targets.

## Findings

The reopened loop did not change the chosen architecture. It narrowed the contract boundary.

Iterations 10-13 show that levels are the public and AI-facing contract, while kind/capabilities/preset remain private implementation vocabulary. Gate 3, slash-command prompts, `create.sh --help`, generated packet markers, validator output, resume summaries, and normal AI conversation all remain level-shaped. The internal manifest and `resolveLevelContract(level)` adapter can still remove duplicated on-disk `templates/level_N/` folders and route scaffolding/validation from one source of truth.

Iteration 12 found two user-visible leaks to fix in the follow-on implementation: replace `[capability]` user-story placeholders with `[needed behavior]`, and replace `Sub-phase manifest` with `Sub-phase list`. Iteration 13 dry-ran five user-conversation scenarios and all five PASS workflow-invariance.

One prompt-level correction overrides the stored iteration-13 narrative: workflow-invariance CI should be a single test under `.opencode/skill/system-spec-kit/scripts/tests/`, not two tests. It should scan live script outputs, generated fixtures, template sources, and public AI-facing docs with explicit allowlists for historical research text.

## Convergence

newInfoRatio: 0.08

Status: converged. This pass is additive synthesis only: it records ADR-005, fixes recommendation wording, and anchors the final contract. No new design direction was introduced.

Final recommendation:

> C+F hybrid manifest-driven greenfield. Public surface: today's `--level N`, Gate 3 classifier, AI conversation flow -- all UNCHANGED. Private surface: 86 -> 15 source files; level->preset->capabilities resolver inside scaffolder + validator; level dirs deleted. ADR-001 chooses C+F hybrid. ADR-005 locks in workflow invariance.
