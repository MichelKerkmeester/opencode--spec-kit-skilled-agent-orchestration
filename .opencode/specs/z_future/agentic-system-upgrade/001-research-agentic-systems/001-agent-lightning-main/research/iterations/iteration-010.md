# Iteration 010 — Phase-005 Overlap And RL-Specific Scope Control

Date: 2026-04-10

## Research question
Does Agent Lightning justify changing Public's generic agent-loop architecture in this phase, or should this phase keep only RL-specific additions and defer generic loop work to phase 005?

## Hypothesis
Agent Lightning will likely show strong loop architecture, but Public already has mature iterative loop managers. The right answer will probably be to keep RL-specific telemetry and evaluator ideas here while rejecting generic loop imports.

## Method
I reviewed Agent Lightning's architecture split between runner bundle, algorithm bundle, trainer, and store, then compared that against Public's orchestrator plus the existing deep-research and deep-review loop managers. I used this pass to answer the phase's overlap question directly rather than as a side note.

## Evidence
- Agent Lightning's architecture separates runner-side and algorithm-side bundles and keeps them coordinated through the Trainer and LightningStore. The docs stress that this decoupling is what allows independent scaling and training-focused data flow. [SOURCE: external/docs/deep-dive/birds-eye-view.md:368-372]
- Agent Lightning's public positioning also emphasizes general framework support, selective optimization, and pluggable algorithms. Those are broad platform claims, not just narrow telemetry features. [SOURCE: external/README.md:20-23] [SOURCE: external/README.md:65-67]
- Community examples in the README highlight modular multi-agent systems and large-scale RL setups, reinforcing that the project does contain substantial generic loop and multi-agent architecture in addition to RL-specific pieces. [SOURCE: external/README.md:57-61]
- Public already has a strong orchestrator contract with explicit task decomposition, strategic delegation, conflict resolution, unified synthesis, and single-hop depth rules. [SOURCE: .opencode/agent/orchestrate.md:24-36] [SOURCE: .opencode/agent/orchestrate.md:49-60]
- Public also already has iterative loop managers for deep research and deep review, each with externalized state, convergence handling, synthesis phases, and memory preservation. [SOURCE: .opencode/command/spec_kit/deep-research.md:147-155] [SOURCE: .opencode/command/spec_kit/deep-review.md:162-169]
- The deep-research agent contract itself is already built around one focused iteration, JSONL state, reducer synchronization, and progressive synthesis, showing that Public does not need Agent Lightning to discover iterative loop structure. [SOURCE: .opencode/agent/deep-research.md:50-60] [SOURCE: .opencode/agent/deep-research.md:159-165]

## Analysis
This final comparison confirms the boundary for the whole phase. Agent Lightning absolutely contains generic loop and multi-agent architecture ideas, but Public already has those categories of capability in mature form. Importing them here would blur the line with phase 005 and would produce weaker recommendations than the RL-specific insights already captured in earlier iterations.

The RL-specific value from Agent Lightning is narrower and better: a trace seam, a richer evaluator-signal model, a reducer adapter boundary, targeted agent selection, and better operational metrics. Everything else that is "good loop architecture" but not specifically tied to RL-style observation, scoring, or targeted optimization should be deferred rather than folded into this phase.

## Conclusion
confidence: high

finding: This phase should reject generic loop-architecture adoption from Agent Lightning and keep only RL-specific improvements. Public already has orchestrator and iterative-loop machinery, so the strongest output of this phase is not "change the loop model"; it is "upgrade observability, evaluator richness, and targeted analysis surfaces." Generic multi-agent loop work belongs with phase 005.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none; the main action is to preserve scope discipline for follow-on planning
- **Priority:** rejected

## Counter-evidence sought
I looked for missing loop-manager capability in Public that would force generic loop adoption from Agent Lightning and did not find it. I also checked whether Agent Lightning's most valuable ideas were inseparable from its loop architecture, but earlier iterations showed several useful RL-specific patterns that can be lifted independently.

## Follow-up questions for next iteration
- None. This pass completes the planned iteration set and feeds directly into synthesis.
