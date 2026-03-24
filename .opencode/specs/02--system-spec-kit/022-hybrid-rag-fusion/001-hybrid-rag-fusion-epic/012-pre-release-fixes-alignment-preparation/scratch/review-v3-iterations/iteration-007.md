# Iteration 007 Review

Scope: `008-hydra-db-based-features` umbrella spec plus children `001`-`006`

Dimensions: `D1 Correctness` + `D2 Security`

## Findings

### P0-001 [P0] Phase 5 and Phase 6 claim governance and rollback safety rails are verified without explicit evidence for the cited drills

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance/checklist.md:44-48`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance/implementation-summary.md:66-77`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/checklist.md:44-48`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/implementation-summary.md:66-78`
- Evidence: Phase `005` marks `CHK-514` as complete with the claim "Rollback and isolation drills pass," and Phase `006` marks `CHK-613`/`CHK-614` complete with the claims "Kill-switch and rollback drills pass" and "Staged rollout procedure validated."
- Evidence: The cited implementation summaries only record generic validation (`validate.sh`, `tsc`, `npm run build`, focused Vitest runs, playbook presence, consolidated suite, recursive validation). They do not name or summarize a rollback drill, isolation drill, kill-switch exercise, or staged-rollout drill in the referenced verification sections.
- Risk: These are the core safety rails for governed retrieval and shared-memory rollout. Marking them verified without explicit evidence creates a false-ready signal around the very controls meant to contain security and cross-scope failure modes.
- Recommendation: Either add explicit drill evidence to the summaries/checklists, or downgrade these items from verified until the drill artifacts are documented.

### P1-001 [P1] The dependency-gate evidence chain is stale and cites impossible upstream P0 totals

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/checklist.md:34-37`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/checklist.md:104-108`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/003-unified-graph-retrieval/checklist.md:34-37`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/004-adaptive-retrieval-loops/checklist.md:34-37`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance/checklist.md:33-36`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/checklist.md:33-36`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/checklist.md:106-110`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/003-unified-graph-retrieval/checklist.md:106-110`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/005-hierarchical-scope-governance/checklist.md:94-98`
- Evidence: Phase `002` says it verified Phase `001` via "`P0 8/8`," but Phase `001`'s summary table shows `P0 Items | 0 | 0/0`.
- Evidence: Phases `003`, `004`, and `005` all cite Phase `002` as "`P0 9/9`," but Phase `002`'s summary table shows `P0 Items | 1 | 1/1`.
- Evidence: Phase `006` cites Phase `005` as "`P0 9/9`," but Phase `005`'s summary table shows `P0 Items | 8 | 8/8`.
- Risk: The phase-to-phase gate story is not reproducible from the docs, so reviewers cannot trust that downstream phases were opened against the actual upstream readiness state.
- Recommendation: Recompute and normalize every referenced upstream checklist total, or replace the numeric shorthand with a stable reference such as the upstream verification date plus a direct checklist anchor.

### P1-002 [P1] The umbrella and child status story still says “Complete” even where phase-local sign-off is pending

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/spec.md:79-89`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/spec.md:34-45`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/checklist.md:166-170`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/implementation-summary.md:89-94`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/spec.md:34-45`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/checklist.md:163-169`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/002-versioned-memory-state/implementation-summary.md:84-88`
- Evidence: The umbrella phase map marks all six children as `Complete`, and both Phase `001` and Phase `002` specs also declare `Status | Complete`.
- Evidence: Phase `001`'s sign-off table still reads `Pending | Maintainer | Pending`, and its implementation summary explicitly says "Human sign-off is pending."
- Evidence: Phase `002`'s sign-off table also remains `Pending | Maintainer | Pending`, while its implementation summary simultaneously says "No additional phase-local limitation is recorded."
- Risk: Release readers get a misleading readiness signal for the baseline safety-rails and lineage phases, especially because this is not merely external product/compliance review; the phase-local maintainer sign-off itself is still open.
- Recommendation: Either mark these phases as in-progress / awaiting sign-off, or complete the missing sign-off step and then sync the umbrella and child status fields.

### P1-003 [P1] Phase-local runtime wording still overstates live activation relative to the umbrella reality check

- Files:
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/spec.md:280-289`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/implementation-summary.md:35-46`
  - `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/004-adaptive-retrieval-loops/implementation-summary.md:34-45`
- Evidence: The umbrella reality check says shadow scoring is `Disabled`, `asOf` is internal-only, and shared memory is `Opt-in and inert by default`.
- Evidence: Phase `001` says the broader runtime "now uses default-on roadmap behavior" with "`shared-rollout` phase default plus six enabled capabilities unless explicitly disabled."
- Evidence: Phase `004` says "Adaptive retrieval behavior is active in shadow-first form."
- Risk: These child summaries can be read as production-activation claims, directly undercutting the umbrella's narrower release-readiness caveats about dormant or opt-in behavior.
- Recommendation: Mirror the umbrella caveats in the affected child summaries so they say "implemented and available behind internal/opt-in controls" rather than "active" or "default-on" without qualification.

## Sweep Notes

| Child | Safety/security spec quality | Evidence backing | Status alignment | Notes |
|---|---|---|---|---|
| `001-baseline-and-safety-rails` | Safety rails are described, but rollout wording is too broad | Partial | Drifted | `Complete` in spec, pending maintainer sign-off, and summary still says runtime is default-on |
| `002-versioned-memory-state` | Lineage/rollback constraints are specified | Partial | Drifted | Pending maintainer sign-off conflicts with `Complete`; summary understates that gap |
| `003-unified-graph-retrieval` | Security constraints are present and bounded | Mostly aligned | Aligned | Main issue is stale upstream gate reference (`P0 9/9`) |
| `004-adaptive-retrieval-loops` | Shadow-mode safety is specified | Partial | Drifted | Main issue is stale upstream gate reference plus "active" wording versus umbrella disabled state |
| `005-hierarchical-scope-governance` | Governance scope is well specified | Weak on drill evidence | Mostly aligned | Isolation / rollback completion claims rely on summary text that does not document the drills |
| `006-shared-memory-rollout` | Deny-by-default and opt-in controls are specified | Weak on drill evidence | Mostly aligned | Kill-switch / staged-rollout completion claims are not explicitly evidenced in the cited summary |

## Review Summary

- Files reviewed: umbrella `spec.md` plus six child `spec.md` files, with supporting `checklist.md` and `implementation-summary.md` evidence across the same scope
- Overall assessment: `REQUEST_CHANGES`
- Primary blockers: unbacked governance/shared-memory safety-rail completion claims, stale dependency-gate evidence, and child status/runtime wording that no longer matches the umbrella release-reality caveats
