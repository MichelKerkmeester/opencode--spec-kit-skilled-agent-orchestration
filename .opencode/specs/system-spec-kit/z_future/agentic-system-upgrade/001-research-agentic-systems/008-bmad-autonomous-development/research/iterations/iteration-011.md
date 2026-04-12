# Iteration 011 — Single-Setup Automation UX

## Research question
Does BAD's one-time setup plus runtime `KEY=VALUE` override surface suggest `system-spec-kit`'s autonomous workflow UX is over-fragmented?

## Hypothesis
BAD's narrower operator surface is materially easier to reason about than the current `spec_kit` plus `memory` command spread, even if `system-spec-kit` still needs the richer backend.

## Method
Re-read BAD's setup, config, and runtime override surfaces, then compared them to the local command inventory and environment/config surface that autonomous workflows currently rely on.

## Evidence
- BAD effectively exposes one setup action (`/bad setup`), one reconfiguration action (`/bad configure`), and one runtime surface (`/bad ...KEY=VALUE...`). Its docs keep install-time configuration and runtime overrides in the same mental model. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:41-78] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/docs/index.md:29-46]
- BAD setup collects universal settings once, then branches into harness-specific settings based on detected runtime directories. It also echoes the resolved config back to the user before execution starts. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:21-38] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:51-93] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/assets/module-setup.md:145-149]
- `system-spec-kit` currently exposes 8 `spec_kit` commands, 4 `memory` commands, per-command YAML workflow assets, and a large environment-variable surface for retrieval/runtime tuning. [SOURCE: .opencode/command/spec_kit/README.txt:43-111] [SOURCE: .opencode/command/memory/README.txt:38-131] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:21-39] [SOURCE: .opencode/skill/system-spec-kit/references/config/environment_variables.md:164-219]

## Analysis
BAD is narrower in scope, so some of its simplicity comes from doing less. Even so, its operator experience is cleaner: users learn one setup verb, one runtime verb, and one override mechanism. `system-spec-kit` currently asks users to understand command families, YAML-backed workflow modes, and a separate env-flag layer. That power is valuable, but the entry cost is high for long autonomous runs.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** separate `spec_kit` and `memory` command groups, per-command YAML assets, plus a broad env-var surface for advanced tuning.
- **External repo's approach:** one domain module with setup/reconfigure/run verbs and runtime `KEY=VALUE` overrides.
- **Why the external approach might be better:** it compresses the operator mental model into one obvious setup path and one obvious execution path.
- **Why system-spec-kit's approach might still be correct:** the local system spans planning, implementation, research, review, memory, and governance, so one verb cannot honestly represent the whole system.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a thin "automation profile" setup surface for autonomous workflows that resolves shared defaults once, then lets `spec_kit` commands consume the saved profile without replacing the existing commands.
- **Blast radius of the change:** large
- **Migration path:** start with `deep-research`, `deep-review`, and future long-running implementation flows; keep current commands as the advanced/manual layer.

## Conclusion
confidence: high

finding: BAD's strongest UX lesson is not "fewer capabilities"; it is "one obvious setup path." `system-spec-kit` should keep its richer command set, but it would benefit from a thinner operator-facing configuration/profile layer for autonomous workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** define what counts as a shared autonomous-workflow profile versus command-specific override
- **Priority:** should-have

## Counter-evidence sought
I checked whether local command docs already offered a unified profile/bootstrap surface that hides command-family complexity; the current command READMEs still present the families separately.

## Follow-up questions for next iteration
If local autonomous workflows got a shared setup layer, what continuation and timer semantics should that layer own?
Would runtime-specific settings belong in env vars, per-command YAML, or a single shared profile artifact?
