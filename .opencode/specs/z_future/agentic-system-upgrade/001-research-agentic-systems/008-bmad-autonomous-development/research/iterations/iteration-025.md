# Iteration 025 — LEAF Iteration Pattern Versus Simpler State Passing

## Research question
Should `system-spec-kit` replace its LEAF agent pattern and externalized iteration state with a simpler in-memory or coordinator-only loop more like BAD's visible contract?

## Hypothesis
No. The local LEAF pattern is still the right architecture for deep loops because it solves a different problem than BAD's thinner coordinator contract. The simplification opportunity is around adjacent bootstrap/handover surfaces, not the core iteration model.

## Method
Compared BAD's fresh-context coordinator flow to local deep-research/deep-review LEAF rules plus adjacent bootstrap and handover specialists.

## Evidence
- BAD intentionally keeps the coordinator thin and relies on fresh-context delegated work plus explicit continuation checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-24]
- Local `deep-research` and `deep-review` agents are explicitly single-iteration LEAF agents that externalize markdown and JSONL state for progressive synthesis and safe continuation. [SOURCE: .opencode/agent/deep-research.md:24-32] [SOURCE: .opencode/agent/deep-research.md:167-212] [SOURCE: .opencode/agent/deep-review.md:21-31] [SOURCE: .opencode/agent/deep-review.md:45-57]
- Local `context-prime` and `handover` are much more specialized bootstrap/continuation helpers that sit next to the main exploration and loop agents. [SOURCE: .opencode/agent/context-prime.md:24-45] [SOURCE: .opencode/agent/handover.md:24-58]

## Analysis
This is a good place to resist over-simplification. BAD and local deep loops share the "fresh context" instinct, but `system-spec-kit` is carrying richer packet-local artifacts, cross-iteration synthesis, and stricter reproducibility requirements. The LEAF model earns its complexity. The part that still looks over-sliced is the bootstrap/handover adjacency around it, not the iteration core itself.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep loops use explicit LEAF iterations, packet-local state files, synthesis artifacts, and separate bootstrap/handover helpers around them.
- **External repo's equivalent surface:** BAD runs a thinner visible coordinator loop and keeps continuation logic close to the main skill flow.
- **Friction comparison:** Local deep-loop execution is heavier, but that weight aligns with richer research/review outputs. BAD is lighter because it carries less artifact rigor and less cross-iteration state.
- **What system-spec-kit could DELETE to improve UX:** Delete extra operator emphasis on adjacent bootstrap/handover role names rather than deleting the LEAF loop itself.
- **What system-spec-kit should ADD for better UX:** Add clearer guidance that the LEAF pattern is the deep-loop substrate, while bootstrap and handover helpers are optional wrappers around it.
- **Net recommendation:** KEEP

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** single-iteration LEAF workers with externalized state and synthesis accumulation.
- **External repo's approach:** thinner coordinator-visible loop with domain-specific continuation checks.
- **Why the external approach might be better:** it is easier to understand when the workload is narrower and outputs are simpler.
- **Why system-spec-kit's approach might still be correct:** local deep research and deep review need durable artifacts, replayability, and stronger convergence evidence.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** no core loop replacement; only trim adjacent bootstrap/handover surface complexity in follow-on UX work.
- **Blast radius of the change:** architectural if changed, so avoid core churn without stronger evidence
- **Migration path:** none recommended for the LEAF core; focus instead on public-surface cleanup around it

## Conclusion
confidence: high

finding: Do not replace the LEAF iteration pattern with a thinner coordinator-only loop. The local deep-loop architecture is still justified; the real UX cleanup is around how adjacent bootstrap and handover helpers are presented.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/deep-research.md`
- **Change type:** rejected simplification
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for evidence that BAD's simpler visible loop carries equivalent artifact rigor and synthesis discipline. The external repo does not show an equivalent research/review packet model, so it is not a direct replacement.

## Follow-up questions for next iteration
If the agent roster should get thinner publicly, do the skill surfaces show the same fragmentation pattern?
