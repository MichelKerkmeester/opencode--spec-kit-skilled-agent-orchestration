# Iteration 023 — Replace Level-First Packet UX With Lazy Scaffolding

Date: 2026-04-10

## Research question
Is the current Level 1/2/3/3+ template and validation mental model intuitive for operators, or is it exposing too much documentation machinery too early?

## Hypothesis
Babysitter will suggest a lighter front door: fewer upfront artifact choices for the user, with richer structure added when the workflow actually proves it is needed.

## Method
I reviewed Spec Kit's level specifications, template architecture, and validator contract, then compared that operator experience to Babysitter's project/process onboarding flow.

## Evidence
- Spec Kit explicitly teaches the operator a composed `core/` + `addendum/` architecture and four levels, each adding file requirements and conceptually different documentation payloads. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-46] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74]
- Level 1 already expects four files, while Level 2 and Level 3 add more required artifacts and escalation rules. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:173-206]
- The template tree reinforces that complexity by exposing composed `level_1`, `level_2`, `level_3`, `level_3+`, `core`, `addendum`, `sharded`, `memory`, `research`, and changelog template families. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:19-46]
- The validator advertises a broad rule set and treats structural completeness as a central workflow gate. [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:80-100]
- Babysitter's operator onboarding is lighter: `user-install`, `project-install`, then `doctor`, after which the workflow is expressed through a process/run rather than through choosing a documentation level. [SOURCE: external/README.md:170-200]
- Its project-install command delegates into a process library instead of asking the operator to choose among multiple packet levels or template families. [SOURCE: external/plugins/babysitter-opencode/commands/project-install.md:1-15]
- Its harness lifecycle centers on process-definition and orchestration phases, not on upfront artifact-tier selection. [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:2-14] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:93-141]

## Analysis
The Level 1/2/3/3+ model is rich and internally coherent, but it is not especially intuitive from the outside. It asks the operator to reason about documentation taxonomy, validation scope, and escalation thresholds before the actual work shape is fully known. That is powerful for framework authors, yet high-friction for ordinary execution. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:173-206]

Babysitter's flow is more forgiving because it defers structure. The user starts a run or an install process, and the system expands the required machinery as execution unfolds. That lowers cognitive load because the user is choosing intent, not document taxonomy. [SOURCE: external/README.md:170-200] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:43-56]

The transfer pattern here is not "remove documentation." It is "make documentation expansion lazy." Spec Kit can keep its rich packet model without forcing users to pick the whole scaffold upfront.

## UX / System Design Analysis

- **Current system-spec-kit surface:** Users are asked to operate through a level taxonomy that changes required files, template choices, and validation expectations before execution begins. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97]
- **External repo's equivalent surface:** Babysitter asks for intent and then routes through onboarding or process execution; it does not expose a multi-level artifact taxonomy as the front-door interaction model. [SOURCE: external/README.md:170-200] [SOURCE: external/plugins/babysitter-opencode/commands/project-install.md:1-15]
- **Friction comparison:** Spec Kit creates more cognitive load and more initial files, while Babysitter delays structure until the workflow proves what it needs.
- **What system-spec-kit could DELETE to improve UX:** Delete direct exposure of the Level 1/2/3/3+ decision from the first operator interaction.
- **What system-spec-kit should ADD for better UX:** Add lazy packet expansion, where checklist, decision-record, governance, and handover artifacts are generated automatically when risk, scale, or workflow triggers require them.
- **Net recommendation:** REDESIGN

## Conclusion
confidence: high

finding: `system-spec-kit` should replace its level-first packet UX with a starter packet plus lazy artifact expansion. The current level model can remain as internal policy, but it is too ceremonial as the front-door operator abstraction.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Ask the operator to choose documentation level early, then scaffold that level's artifact set and validation expectations. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:48-74] [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:81-97]
- **External repo's approach:** Start with intent-driven onboarding or process execution, then let the runtime/process determine what artifacts or state are required. [SOURCE: external/README.md:170-200] [SOURCE: external/packages/sdk/src/cli/commands/harnessCreateRun.ts:93-141]
- **Why the external approach might be better:** It makes the first interaction about the work, not the framework.
- **Why system-spec-kit's approach might still be correct:** High-risk or regulated work really does benefit from explicit artifact guarantees.
- **Verdict:** REDESIGN
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Always start with a minimal packet skeleton, then auto-promote to verification, architecture, or governance artifacts when workflow triggers fire.
- **Blast radius of the change:** large
- **Migration path:** keep level metadata for compatibility, but shift creation scripts and command prompts to a starter-packet + escalation model first.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/references/templates/level_specifications.md`, `.opencode/skill/system-spec-kit/scripts/spec/create.sh`, `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`, `.opencode/skill/system-spec-kit/templates/`
- **Change type:** modified existing
- **Blast radius:** large
- **Prerequisites:** define the escalation triggers that lazily add checklist, decision-record, governance, and handover artifacts
- **Priority:** should-have

## Counter-evidence sought
I looked for proof that the current level model is already intuitive to operators, but the docs spend substantial time teaching the template architecture itself, which is a sign the mental model is framework-shaped rather than task-shaped. [SOURCE: .opencode/skill/system-spec-kit/references/templates/level_specifications.md:15-46]

## Follow-up questions for next iteration
- Are `@context-prime` and `@context` distinct enough to justify separate user-facing architecture?
- Which agent surfaces are genuinely valuable versus mainly administrative?
- What parts of the current continuity stack could be merged without losing recovery quality?
