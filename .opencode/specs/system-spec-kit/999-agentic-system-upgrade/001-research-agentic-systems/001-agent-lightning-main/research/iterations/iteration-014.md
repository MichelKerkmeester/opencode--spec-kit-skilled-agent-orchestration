# Iteration 014 — Gate Ceremonies Versus Runtime Defaults

Date: 2026-04-10

## Research question
Does Agent Lightning's comparatively direct contributor experience suggest that `system-spec-kit` should pivot parts of its gate system away from user-visible ceremony and toward runtime defaults?

## Hypothesis
Gate 3 probably remains mission-critical for Public, but Gate 1 and Gate 2 are likely overexposed as operator-visible process steps. The external repo likely points toward a model where more of that policy is enforced silently by the runtime.

## Method
I compared the external repo's concise contributor contract with `system-spec-kit`'s mandatory gates, constitutional memory, skill routing, and pre-tool-call requirements.

## Evidence
- Agent Lightning's contributor guide is compact: architecture overview, project structure, standard verification commands, style rules, and testing guidance. [SOURCE: external/AGENTS.md:3-31]
- The external repo does not impose a conversational, tool-by-tool gate protocol on contributors before normal work begins. [SOURCE: external/AGENTS.md:11-16] [SOURCE: external/AGENTS.md:27-31]
- `system-spec-kit` requires gates before any tool use: context surfacing, intent classification, confidence thresholds, mandatory skill routing, and Gate 3 spec-folder binding. [SOURCE: AGENTS.md:159-186]
- Gate 2 specifically requires running `skill_advisor.py` for non-trivial tasks. [SOURCE: AGENTS.md:174-179]
- Constitutional memory reinforces the same gate protocol and trigger phrase model. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:58-69] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:83-89]
- The memory system is designed to auto-surface constitutional rules on every relevant search. [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:83-89] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:488-509]

## Analysis
The external repo is not directly comparable in mission, but it still reveals an important UX truth: contributors are not asked to manually reenact every enforcement step as part of the everyday operator experience. The rules exist, yet they are mostly encoded as standard repo practices and tooling rather than as a conversational protocol exposed at every turn.

`system-spec-kit` is different because it operates through agents and cross-session context, so some runtime-visible policy is necessary. But Public currently makes too much of that policy feel like operator ceremony. Gate 3 is the exception: it captures scope and documentation binding, which is core product behavior. Gate 1 and Gate 2, by contrast, increasingly look like runtime internals that should happen automatically unless they produce a genuine conflict or need a user decision.

## Conclusion
confidence: high

finding: `system-spec-kit` should pivot its gate system so Gate 3 remains an explicit user contract while Gate 1 and most of Gate 2 become runtime defaults. The current gate system solves real problems, but too much of it is exposed as ceremony rather than silent policy.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `AGENTS.md` gate model and supporting runtime enforcement
- **Change type:** product-direction pivot
- **Blast radius:** architectural
- **Prerequisites:** preserve Gate 3 semantics, define silent-policy behavior for memory surfacing and skill routing, and specify escalation triggers that still require user input
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Gates 1-3 are explicit process steps, with Gate 1 and Gate 2 often visible as part of the operator workflow.
- **External repo's approach:** Contributor rules are concise and mostly tool- or repo-enforced rather than interaction-enforced.
- **Why the external approach might be better:** It reduces friction, lowers ceremony, and keeps the human focused on decisions that actually need human input.
- **Why system-spec-kit's approach might still be correct:** Public's spec binding and memory-driven behavior really do require stronger policy than a normal code repo.
- **Verdict:** PIVOT
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep Gate 3 explicit; move Gate 1 and routine Gate 2 checks into silent runtime behavior, surfacing them only when confidence is low, scope is ambiguous, or routing conflicts arise.
- **Blast radius of the change:** architectural
- **Migration path:** Start by making Gate 1 and routine skill routing implicit in command handlers and runtime hooks, then trim operator-facing documentation so only decision points remain visible.

## Counter-evidence sought
I looked for evidence that Public's full visible gate ceremony is itself a core user-facing product feature rather than an implementation technique, and most of the evidence points the other way: the gates exist to protect scope, routing, and memory behavior. Gate 3 remains the strongest counterexample, which is why the recommendation is a partial pivot rather than wholesale removal.

## Follow-up questions for next iteration
- If Gate 1 and Gate 2 become mostly implicit, how should the operator-facing docs be reorganized?
- Which gate outcomes still need durable artifacts or audit trails?
- Can Public reduce anxiety for users by asking fewer setup questions without reducing safety?
