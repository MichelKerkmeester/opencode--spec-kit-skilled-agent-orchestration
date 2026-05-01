# Iteration 018 — Command Surface Sprawl

## Research question
Does BAD's minimal `/bad` surface suggest `system-spec-kit` should simplify how users enter common workflows, even if the backend stays broad?

## Hypothesis
The local command split is useful for power users, but it creates unnecessary decision overhead for common flows that BAD avoids.

## Method
Compared BAD's run/setup/configure surface to the current `spec_kit` and `memory` command inventories and their user-facing structure.

## Evidence
- BAD centers the user journey on setup, run, and reconfigure, then relies on runtime overrides when needed. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:41-63] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/docs/index.md:92-97]
- `system-spec-kit` exposes 8 primary lifecycle commands in `spec_kit` and 4 more in `memory`, with additional mode suffixes and subcommands inside those groups. [SOURCE: .opencode/command/spec_kit/README.txt:43-111] [SOURCE: .opencode/command/memory/README.txt:38-131]
- The local command docs are well structured, but they still require the operator to choose the right command family before any YAML workflow helps them. [SOURCE: .opencode/command/spec_kit/README.txt:43-76] [SOURCE: .opencode/command/memory/README.txt:38-66]

## Analysis
This is a UX problem more than an architecture problem. The local command set is not wrong, but it is ask-heavy. BAD's surface demonstrates the value of opinionated entrypoints that map directly to what the user wants to do. `system-spec-kit` could preserve the current commands while adding a thinner preset/alias layer for common intents like "research this packet," "resume work," or "run the full autonomous path."

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** many explicit commands, modes, and subcommands for different lifecycle slices.
- **External repo's approach:** one narrow domain command with a couple of setup/config verbs.
- **Why the external approach might be better:** fewer up-front choices lower operator hesitation and onboarding cost.
- **Why system-spec-kit's approach might still be correct:** the local system genuinely covers more domains than BAD, so some command separation is warranted.
- **Verdict:** SIMPLIFY
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** add documented preset aliases or a top-level helper surface that maps common intents to the correct existing commands and modes, without deprecating the underlying command families.
- **Blast radius of the change:** medium
- **Migration path:** start in docs and wrappers first; only merge or retire commands if real usage data shows the aliases fully replace them.

## Conclusion
confidence: high

finding: BAD's minimal command surface is a useful UX benchmark. `system-spec-kit` should keep its explicit commands but add thinner preset/alias entrypoints for common autonomous workflows so operators do not need to reason from the full command inventory every time.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`
- **Change type:** added option
- **Blast radius:** medium
- **Prerequisites:** decide which common intents deserve stable aliases without muddying the current command taxonomy
- **Priority:** should-have

## Counter-evidence sought
I checked whether current docs already provide a small set of recommended entrypoint bundles; the current READMEs list commands comprehensively, but they do not materially reduce the up-front choice set.

## Follow-up questions for next iteration
Beyond command aliases, does BAD expose a deeper simplification opportunity inside the deep-loop infrastructure itself?
