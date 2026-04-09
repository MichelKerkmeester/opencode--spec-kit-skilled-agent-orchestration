# Iteration 007 — Archive Rotation and Restart Safety

## Research question
Should `system-spec-kit` adopt Ralph's archive rotation and `.last-branch` tracking literally, or does the existing lineage model already cover that problem better?

## Hypothesis
Ralph's archive/reset model is elegant for single-feature loops, but too simple for `system-spec-kit`'s multi-phase and lineage-aware workflows.

## Method
Read Ralph's archive logic in `external/ralph.sh`, the archive guidance in `external/skills/ralph/SKILL.md` and `external/README.md`, then compared that behavior to `system-spec-kit`'s deep-research lineage handling and phase model.

## Evidence
- Ralph archives the previous run when `branchName` changes, copies `prd.json` and `progress.txt` into a dated archive folder, and resets `progress.txt` for the new run. [SOURCE: external/ralph.sh:42-64]
- Ralph stores the current branch in `.last-branch` so future launches can detect feature changes. [SOURCE: external/ralph.sh:67-73]
- The Ralph skill documents the same behavior as a pre-save checklist: if a new `branchName` replaces an old one, archive the old PRD and progress first. [SOURCE: external/skills/ralph/SKILL.md:233-257]
- The README describes archive folders as a built-in behavior when a new feature starts. [SOURCE: external/README.md:231-234]
- `system-spec-kit`'s deep-research workflow already has a richer model: canonical archive paths, session classification, resume vs restart vs fork, completed-session handling, and explicit lineage metadata. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:77-89] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-176]
- The phase model also treats parent/child folders and per-phase memory as first-class lifecycle concerns, which is broader than branch-based isolation. [SOURCE: .opencode/skill/system-spec-kit/references/structure/phase_definitions.md:147-173]

## Analysis
Ralph's archive rotation solves a very specific contamination problem: "a new feature PRD should not inherit the old feature's progress log." `system-spec-kit` already solves a harder version of that problem with explicit lineage state and phase folders. Adding a second `.last-branch` mechanism on top of that would duplicate state and risk disagreement between branch-based and packet-based truth.

## Conclusion
confidence: high

finding: `system-spec-kit` should reject literal adoption of Ralph's `.last-branch` archive model for deep-research-style workflows. The existing lineage and archive packet model is more expressive and already matches the repo's spec-folder architecture better than branch-name rotation would.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for missing restart/isolation concepts in the current deep-research workflow and found that archive roots, restart/fork handling, and completed-session continuation are already built in. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:128-176]

## Follow-up questions for next iteration
- Even if branch-based rotation is rejected, how should reusable learnings be promoted between runs?
- What is the closest `system-spec-kit` equivalent to Ralph's AGENTS/CLAUDE propagation step?
- Should restart safety be surfaced more plainly in user-facing docs?
