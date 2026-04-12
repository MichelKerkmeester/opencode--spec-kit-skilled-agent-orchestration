# Iteration 021 — Merge the Lifecycle Front Door

Date: 2026-04-10

## Research question
Is the visible `/spec_kit:*` lifecycle too fragmented, and should `system-spec-kit` collapse `plan`, `implement`, and `complete` into a smaller operator-facing surface?

## Hypothesis
Relay's operator surface is smaller and easier to memorize because it exposes a few coordination modes while hiding most lifecycle machinery behind one plugin or workflow runner.

## Method
Compared Public's command index, workflow progression, and step counts with Relay's Claude plugin entrypoints and SDK quick-start surfaces.

## Evidence
- Public's `spec_kit` surface advertises 8 commands, with separate `plan`, `implement`, `resume`, `handover`, `debug`, `deep-research`, `deep-review`, and `complete` entrypoints. [SOURCE: .opencode/command/spec_kit/README.txt:43-63]
- Public's documented lifecycle explicitly chains `deep-research -> plan -> phase -> implement -> debug -> handover -> resume`, while `complete` separately combines multiple phases into one invocation. [SOURCE: .opencode/command/spec_kit/README.txt:121-145]
- `complete` alone is a 14-step workflow with extra flags for research, phases, and auto-debug. [SOURCE: .opencode/command/spec_kit/complete.md:175-228]
- `plan` is a separate 7-step workflow that ends by telling the operator to call `/spec_kit:implement`. [SOURCE: .opencode/command/spec_kit/plan.md:173-221]
- `implement` is another 9-step workflow with its own save-context and handover phases. [SOURCE: .opencode/command/spec_kit/implement.md:173-225]
- Relay's Claude plugin presents three primary coordination shapes, plus natural-language invocation: `/relay-team`, `/relay-fanout`, `/relay-pipeline`, or plain-English requests. [SOURCE: external/docs/plugin-claude-code.md:3-9] [SOURCE: external/docs/plugin-claude-code.md:27-63]
- Relay's SDK quick start similarly centers one workflow builder and one high-level facade instead of many top-level lifecycle commands. [SOURCE: external/packages/sdk/README.md:11-31]

## Analysis
Public gives experts more explicit control, but the visible surface asks the operator to understand both phase boundaries and command boundaries before work starts. Relay keeps fewer nouns in the user's head: team, fan-out, pipeline, or just describe the job. The result is lower front-door cognitive load even though substantial machinery still exists underneath.

## Conclusion
confidence: high
finding: Public should merge the visible lifecycle front door into fewer operator-facing modes, keeping the underlying packet and verification machinery but demoting the current `plan` / `implement` / `complete` split from the primary mental model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/command/spec_kit/README.txt`, top-level command docs, wrapper/help surfaces
- **Change type:** command UX merger
- **Blast radius:** high
- **Prerequisites:** decide the new front-door verbs and map current commands to them without losing advanced control paths
- **Priority:** must-have (adopt now)

## UX / System Design Analysis

- **Current system-spec-kit surface:** Operators choose among 8 `spec_kit` commands, then also choose between multi-command progression and the special `complete` mega-command.
- **External repo's equivalent surface:** Relay offers 3 memorable coordination commands plus natural language, with SDK users getting one workflow builder and one high-level facade.
- **Friction comparison:** Public requires more up-front branching decisions and more lifecycle vocabulary. Relay reaches a comparable "start coordinated work" outcome with fewer user-visible choices and no separate planning-vs-completion command taxonomy.
- **What system-spec-kit could DELETE to improve UX:** Delete the need for operators to reason about `plan` vs `implement` vs `complete` as separate front-door concepts for common work.
- **What system-spec-kit should ADD for better UX:** Add a smaller top-level mode model that maps common intents like "start", "continue", and "coordinate" onto the existing machinery.
- **Net recommendation:** MERGE

## Counter-evidence sought
Looked for a simpler Public front door already hiding the command split behind aliases or a mode-first wrapper; the reviewed docs still foreground the full command matrix.

## Follow-up questions for next iteration
- If the front door shrinks, which advanced flags still need direct power-user access?
- Should `complete` become an internal orchestration preset instead of a primary command?
- How much of the current split exists for implementation reasons versus user value?
