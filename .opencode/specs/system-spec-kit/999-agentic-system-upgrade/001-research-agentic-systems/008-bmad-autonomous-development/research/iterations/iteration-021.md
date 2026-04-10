# Iteration 021 — Command UX Surface Area

## Research question
Is the current `spec_kit` + `memory` command surface too large and fragmented compared with BAD's much thinner operator-facing entrypoint?

## Hypothesis
`system-spec-kit` has real capability breadth, but it exposes too much taxonomy up front. BAD reaches a similar "start autonomous work" moment with fewer visible choices.

## Method
Compared BAD's setup/run/configure entrypoints to the local command inventories, lifecycle docs, and workflow-asset exposure.

## Evidence
- BAD centers operator UX on a small surface: install, `/bad setup`, `/bad`, and optional `/bad configure`. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:35-59] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/docs/index.md:92-98]
- `system-spec-kit` exposes 8 primary `spec_kit` commands, a separate 4-command `memory` family, and documents 15 YAML workflow assets behind those entrypoints. [SOURCE: .opencode/command/spec_kit/README.txt:43-63] [SOURCE: .opencode/command/spec_kit/README.txt:85-111] [SOURCE: .opencode/command/memory/README.txt:61-66]
- The local docs already need FAQ entries to explain lifecycle distinctions such as `plan` versus `complete` and when to use `resume`. [SOURCE: .opencode/command/spec_kit/README.txt:225-239]

## Analysis
The local surface is not "wrong," but it is ask-heavy. An operator needs to first understand the taxonomy, then choose the right family, then choose the right mode. BAD instead makes the default journey obvious and pushes complexity into the coordinator contract. That does not mean local commands should disappear; it means the first UX layer should be intent-first instead of inventory-first.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators are presented with parallel command families (`/spec_kit:*` and `/memory:*`), multiple lifecycle verbs, and an asset-driven implementation layer documented in the primary README.
- **External repo's equivalent surface:** BAD mostly asks the operator to configure once and then run one coordinator command, with runtime behavior hidden behind the skill.
- **Friction comparison:** Local UX asks for more up-front classification and command selection before work starts. BAD reduces visible step count and cognitive branching, even though the internal pipeline is still multi-stage.
- **What system-spec-kit could DELETE to improve UX:** Delete YAML asset visibility from the primary operator surface and stop leading with the full command inventory for common workflows.
- **What system-spec-kit should ADD for better UX:** Add an intent-first "start here" surface that maps common goals to the right existing commands and modes.
- **Net recommendation:** SIMPLIFY

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit lifecycle and memory command inventory with strong documentation coverage.
- **External repo's approach:** narrow visible entrypoints, broad hidden coordinator behavior.
- **Why the external approach might be better:** it lowers onboarding and reduces hesitation for common autonomous flows.
- **Why system-spec-kit's approach might still be correct:** local capabilities genuinely span more than BAD's narrow sprint-runner scope.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add a thin operator-facing alias or preset layer for common intents, while keeping the explicit command families as advanced surfaces.
- **Blast radius of the change:** medium
- **Migration path:** start with docs and wrapper aliases; only deprecate commands if usage proves the thinner entrypoints cover most cases.

## Conclusion
confidence: high

finding: `system-spec-kit` should stop making operators reason from the full command inventory first. BAD shows that a thinner intent-first surface can preserve backend power while reducing UX friction.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** UX simplification
- **Blast radius:** medium
- **Prerequisites:** identify 3-5 common operator intents worth stabilizing as presets or aliases
- **Priority:** should-have

## Counter-evidence sought
I looked for a similarly thin operator entrypoint already documented in the current command READMEs. The docs are comprehensive, but they still foreground taxonomy over intent.

## Follow-up questions for next iteration
If the surface should get thinner, which splits are the most costly: command family boundaries, lifecycle boundaries, or the YAML asset abstraction itself?
