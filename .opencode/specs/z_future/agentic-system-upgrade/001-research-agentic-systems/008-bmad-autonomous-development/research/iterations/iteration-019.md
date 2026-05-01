# Iteration 019 — Deep-Loop Abstraction Overhead

## Research question
Is `system-spec-kit`'s deep-loop infrastructure overbuilt compared with BAD's tighter domain-shaped execution loop?

## Hypothesis
The local deep-loop system has strong primitives, but too much reference-only or future-facing complexity bleeds into the canonical live contract.

## Method
Compared BAD's fixed execution loop to the local deep-research state model, YAML workflow, and convergence machinery.

## Evidence
- BAD's live loop stays close to the domain: dependency report, ready-story selection, fixed stage pipeline, timers, and continuation checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:13-20] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/references/pre-continuation-checks.md:3-15]
- Local `deep-research` defines 6 primary state files plus a reducer-owned registry, lineage generations, file-protection maps, optional focus tracks, convergence signals, dashboard synthesis, and multiple event types. [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:15-29] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:65-110] [SOURCE: .opencode/skill/sk-deep-research/references/state_format.md:132-183]
- The live YAML loop also carries canonical-name migration, completed-session reopening, reducer synchronization, dashboard generation, and experimental/reference-only notes in the executable contract. [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:116-197] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277] [SOURCE: .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:328-369]
- Convergence itself includes composite voting plus quality guards and additional reference-only branches, which is valuable but harder to keep legible as a core operator contract. [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:15-18] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:117-150] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:183-184]

## Analysis
The problem is not that the local deep loop has too many safeguards. The problem is that mandatory behavior, reducer-owned state, migration concerns, and future/reference-only design all live too close together. BAD's loop is easier to reason about because its live contract stays domain-shaped. `system-spec-kit` should keep the externalized-state core, but it should trim the live contract down to the behavior actually required today.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** generalized loop protocol with rich state, reducer, lineage, convergence, and extensibility concepts.
- **External repo's approach:** small domain-specific loop with explicit operational checkpoints and minimal live state.
- **Why the external approach might be better:** operators and maintainers can understand the active loop without loading future or experimental abstractions.
- **Why system-spec-kit's approach might still be correct:** the local loop intentionally serves reusable research/review workflows and needs more resumability than BAD.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** split live-loop documentation and YAML contracts from reference-only or experimental material; keep the state files that are actively enforced, but move advanced lineage/wave concepts out of the canonical execution contract until they are actually live.
- **Blast radius of the change:** medium
- **Migration path:** start with documentation/state-format cleanup, then trim YAML comments and reference-only branches, and only then revisit reducer/state internals if the live contract remains too dense.

## Conclusion
confidence: high

finding: BAD suggests a strong simplification rule for `system-spec-kit`: keep live loop contracts small, domain-shaped, and obviously enforceable. The current deep-loop design should retain its powerful primitives but stop mixing active behavior with future/reference-only complexity in the core contract.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/sk-deep-research/references/state_format.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** decide which lineage and reference-only concepts are truly live versus design notes
- **Priority:** must-have

## Counter-evidence sought
I looked for proof that all of the current lineage and reference-only concepts are already active in the executable loop. The live YAML still contains explicit experimental/reference-only notes, which weakens that claim.

## Follow-up questions for next iteration
If the loop contract should slim down, where should a future BAD-like sprint runner live relative to the current core commands and memory system?
