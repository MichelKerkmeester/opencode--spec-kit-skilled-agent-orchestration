# Iteration 11: Best First Target Surface for a Phase-1 MVP

## Focus
Compare structured artifact generation against open-ended research generation to decide which surface is safest and most measurable for a first improvement-loop experiment.

## Findings
1. Handover output is structurally constrained. The command enforces pre-handover validation, explicit user confirmation flow, seven required sections, a fixed output location, and a mandatory follow-up memory save. [SOURCE: .opencode/command/spec_kit/handover.md:58] [SOURCE: .opencode/command/spec_kit/handover.md:78] [SOURCE: .opencode/command/spec_kit/handover.md:195] [SOURCE: .opencode/command/spec_kit/handover.md:215]
2. Deep research is intentionally broader and more subjective. The leaf agent executes one research cycle at a time, writes iteration artifacts, and relies on reducer-managed synthesis plus convergence logic over answered questions and novelty rather than a small fixed template. [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/agent/deep-research.md:159] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179]
3. Structured artifact surfaces already connect to deterministic evaluators: handover can be checked for required sections and resolvable resume paths, while artifact quality can be scored through the existing integrity checks and DQI-style structure metrics. [SOURCE: .opencode/command/spec_kit/handover.md:195] [SOURCE: .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:103] [SOURCE: .opencode/skill/sk-doc/scripts/extract_structure.py:940]
4. Because the research loop is open-ended and convergence-based, it is a poorer phase-1 target than handover-style artifact generation. The first mutable target should be something with a narrow template and binary quality gates, not a synthesis-heavy loop. [SOURCE: .opencode/agent/deep-research.md:24] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25] [SOURCE: .opencode/command/spec_kit/handover.md:195]

## Ruled Out
- Using `@deep-research` as the first mutation target would make the evaluator problem harder, not easier. It is too open-ended for a phase-1 keep/discard contract. [SOURCE: .opencode/agent/deep-research.md:28] [SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:25]

## Dead Ends
- A generic "improve any agent prompt" MVP would blur together artifact generation, orchestration, and synthesis. The first experiment needs a much narrower surface.

## Sources Consulted
- .opencode/command/spec_kit/handover.md:58
- .opencode/command/spec_kit/handover.md:195
- .opencode/agent/deep-research.md:28
- .opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:103

## Assessment
- New information ratio: 0.46
- Questions addressed: What should the MVP scope, boundaries, and success metric be for a new skill in this repo?
- Questions answered: None newly answered; this iteration selected the safest first target class.

## Reflection
- What worked and why: Comparing one highly templated workflow to one synthesis-heavy workflow made the phase-1 target choice much less ambiguous.
- What did not work and why: The delegated run returned more exploration trace than final structure, so the packet needed manual normalization.
- What I would do differently: The implementation packet should probably prototype on one handover-like artifact before it tries to score more open-ended agent behaviors.

## Recommended Next Focus
Translate the target and evaluator choices into a phased rollout with explicit promotion gates from propose-only to bounded auto-editing.
