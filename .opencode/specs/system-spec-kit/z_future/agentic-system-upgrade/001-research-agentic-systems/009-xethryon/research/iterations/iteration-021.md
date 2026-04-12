# Iteration 021 — The Lifecycle UX Is Too Split At The Operator Surface

Date: 2026-04-10

## Research question
Does `system-spec-kit` ask the operator to think in too many top-level lifecycle commands compared with Xethryon's more compressed command surface?

## Hypothesis
`system-spec-kit` is not suffering from an unusually large raw command count. The bigger UX issue is that one feature workflow is split across three peer entry points: `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete`.

## Method
I compared the local lifecycle commands and their YAML-driven workflow contracts with Xethryon's command registry and slash-command operator surface.

## Evidence
- `/spec_kit:plan` introduces its own setup flow and explicitly translates markdown inputs into a YAML-driven execution workflow. [SOURCE: .opencode/command/spec_kit/plan.md:13-21] [SOURCE: .opencode/command/spec_kit/plan.md:37-52]
- `/spec_kit:implement` has a separate setup block and its own multi-step workflow contract, including explicit context-save behavior. [SOURCE: .opencode/command/spec_kit/implement.md:35-120] [SOURCE: .opencode/command/spec_kit/implement.md:171-201]
- `/spec_kit:complete` is yet another top-level workflow with its own setup questions and closeout sequence. [SOURCE: .opencode/command/spec_kit/complete.md:38-144] [SOURCE: .opencode/command/spec_kit/complete.md:198-217]
- Xethryon's README presents a flatter operator surface of slash commands inside one TUI conversation rather than a visible plan-then-implement-then-complete trilogy. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:165-205]
- Xethryon's command registry reinforces that model: commands are loaded into a single shared command layer and bundled skills are registered into the same surface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/command/index.ts:68-76] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/command/index.ts:96-183]

## Analysis
The comparison does not show that `system-spec-kit` has "too many commands" in the abstract. It shows that one lifecycle is exposed as three separate mental models, each with its own setup language, workflow prose, and automation contract. Xethryon achieves lower apparent friction by keeping the operator inside one conversation and layering optional commands on top of that shared surface.

The import lesson is not to delete planning or completion. It is to stop making the user choose among three sibling lifecycle doors when they usually just want "help me do the next safe step." The lifecycle can remain internally distinct while becoming externally guided.

## UX / System Design Analysis

- **Current system-spec-kit surface:** the operator chooses between `/spec_kit:plan`, `/spec_kit:implement`, and `/spec_kit:complete`, each with its own setup block and workflow language.
- **External repo's equivalent surface:** one persistent chat/TUI surface with a smaller set of optional slash commands layered onto it.
- **Friction comparison:** `system-spec-kit` creates more cognitive branching before work starts because the user must pick the right lifecycle door up front; Xethryon keeps the user in one lane and lets commands behave more like capability toggles.
- **What system-spec-kit could DELETE to improve UX:** the requirement that lifecycle stage selection be a first-order operator decision for common flows.
- **What system-spec-kit should ADD for better UX:** one guided lifecycle front door that decides whether the next action is planning, implementation, or completion while still delegating to the existing internals.
- **Net recommendation:** MERGE

## Conclusion
confidence: high

finding: `system-spec-kit` should merge the operator-facing lifecycle into a single guided front door while preserving the existing plan, implement, and complete internals behind that surface.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit lifecycle stages exposed as separate top-level commands.
- **External repo's approach:** one operator surface with flatter command layering.
- **Why the external approach might be better:** less branching, fewer premature choices, and better continuity between planning and execution.
- **Why system-spec-kit's approach might still be correct:** the internal distinction between planning, execution, and closeout is still valuable for governance and verification.
- **Verdict:** MERGE
- **If MERGE — concrete proposal:** add a guided `/spec_kit:workflow` or equivalent front door that routes into `plan`, `implement`, or `complete` after inspecting current packet state.
- **Blast radius of the change:** medium
- **Migration path:** additive first; keep existing commands as advanced entry points and measure whether the guided entry point absorbs most usage.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/plan.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** define stable routing heuristics for when the guided front door chooses planning, implementation, or completion
- **Priority:** should-have

## Counter-evidence sought
I looked for proof that the three-command split is already low-friction because users naturally think in those phases. The command docs themselves suggest the opposite: each phase restates workflow framing instead of feeling like one continuous conversation.

## Follow-up questions for next iteration
- Should the same UX merge apply to `/memory:*`, or is that surface serving a meaningfully different user need?
