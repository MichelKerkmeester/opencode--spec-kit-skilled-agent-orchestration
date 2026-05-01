# Iteration 008 — Sequential Auto-Merge Policy

## Research question
What exactly does BAD's auto-merge phase do, and is sequential merge-by-story-number a pattern the local git workflow should adopt?

## Hypothesis
Sequential auto-merge is a sensible optimization inside BAD's batch scheduler, but it does not fit the default user-driven git finish contract.

## Method
Read BAD's Phase 3 auto-merge section and detailed merge subagent instructions, then compared them to the local git skill's completion and cleanup expectations.

## Evidence
- BAD only auto-merges stories that completed Step 4 successfully, then sorts them ascending by story number and merges them one at a time. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:340-353]
- BAD explains the rationale: merge lowest-first so each later merge rebases against `main` that already contains its predecessors, which makes conflict resolution incremental and predictable. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:342-345]
- Each BAD merge subagent checks mergeability, rebases if needed, waits for CI to pass, then squashes and confirms the merge. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/phase4-auto-merge.md:11-64]
- Local git finish is intentionally user-choice-driven, and its core process ends with presenting merge/PR/keep/discard options instead of automatically integrating multiple parallel branches. [SOURCE: .opencode/skill/sk-git/references/finish_workflows.md:25-39]
- Local git rules prioritize cleanups, squash merges, and explicit workflow choice, not autonomous multi-branch sequencing. [SOURCE: .opencode/skill/sk-git/SKILL.md:283-291]

## Analysis
BAD's sequential auto-merge is a batch scheduler policy, not a general git principle. It depends on story numbers, dependency order, and a coordinator that already owns the whole batch. The local git skill does not have that context and deliberately asks the user how to finish work. Folding BAD's merge policy into `sk-git` would over-specialize a general workflow and weaken the current explicit-choice contract.

## Conclusion
confidence: high

finding: Sequential auto-merge is valuable inside a dedicated sprint runner, but it should not become the default local git finish behavior. The right lesson for `system-spec-kit` is architectural separation: keep general git workflows user-driven, and reserve batch merge policies for a future higher-level automation module.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-git/references/finish_workflows.md`
- **Change type:** rejected
- **Blast radius:** medium
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for any local mechanism that already tracks ordered batches of related branches and could justify automatic sequential merge inside `sk-git`; none appeared in the current git docs.

## Follow-up questions for next iteration
What does BAD's packaging and config surface reveal about safe module design?
How serious is the `_bmad/bad/config.yaml` versus `_bmad/config.yaml` discrepancy?
What local test pattern could prevent the same documentation drift in future automation modules?
